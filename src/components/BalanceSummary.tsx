import React from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Balance, Participant } from '../types';

interface BalanceSummaryProps {
  balances: Balance[];
  participants: Participant[];
}

export default function BalanceSummary({ balances, participants }: BalanceSummaryProps) {
  const settleDebts = () => {
    const settlements: Array<{
      from: string;
      fromName: string;
      to: string;
      toName: string;
      amount: number;
    }> = [];

    // Create a working copy of balances
    const workingBalances = balances.map(b => ({ ...b }));
    
    // Sort by balance (creditors first, then debtors)
    workingBalances.sort((a, b) => b.balance - a.balance);

    let creditorIndex = 0;
    let debtorIndex = workingBalances.length - 1;

    while (creditorIndex < debtorIndex) {
      const creditor = workingBalances[creditorIndex];
      const debtor = workingBalances[debtorIndex];

      if (creditor.balance <= 0) {
        creditorIndex++;
        continue;
      }

      if (debtor.balance >= 0) {
        debtorIndex--;
        continue;
      }

      const settleAmount = Math.min(creditor.balance, Math.abs(debtor.balance));

      settlements.push({
        from: debtor.participantId,
        fromName: debtor.participantName,
        to: creditor.participantId,
        toName: creditor.participantName,
        amount: settleAmount
      });

      creditor.balance -= settleAmount;
      debtor.balance += settleAmount;

      if (creditor.balance === 0) creditorIndex++;
      if (debtor.balance === 0) debtorIndex--;
    }

    return settlements;
  };

  if (balances.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No balances to show</h3>
        <p className="text-gray-400">Add some expenses to see who owes whom.</p>
      </div>
    );
  }

  const settlements = settleDebts();
  const hasBalances = balances.some(b => Math.abs(b.balance) > 0.01);

  return (
    <div className="space-y-6">
      {/* Individual Balances */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Individual Balances
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4">
            {balances.map((balance) => (
              <div
                key={balance.participantId}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    balance.balance > 0.01 ? 'bg-emerald-500' :
                    balance.balance < -0.01 ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-white font-medium">{balance.participantName}</span>
                </div>
                
                <div className="text-right">
                  <span className={`text-lg font-semibold ${
                    balance.balance > 0.01 ? 'text-emerald-400' :
                    balance.balance < -0.01 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {balance.balance > 0 ? '+' : ''}${balance.balance.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-400">
                    {balance.balance > 0.01 ? 'is owed' :
                     balance.balance < -0.01 ? 'owes' : 'settled up'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settlement Suggestions */}
      {hasBalances && settlements.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Suggested Settlements
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Settle all debts with {settlements.length} transaction{settlements.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{settlement.fromName}</span>
                      <span className="text-gray-400">pays</span>
                      <span className="text-white font-medium">{settlement.toName}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-400">
                      ${settlement.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-emerald-400 font-medium text-center">
                After these payments, everyone will be settled up! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasBalances && (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Minus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">All settled up!</h3>
          <p className="text-gray-400">Everyone's expenses are balanced. Great job! 🎉</p>
        </div>
      )}
    </div>
  );
}