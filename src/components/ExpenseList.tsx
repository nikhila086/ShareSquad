import React from 'react';
import { Receipt, User, Calendar } from 'lucide-react';
import { Group } from '../types';

interface ExpenseListProps {
  group: Group;
}

export default function ExpenseList({ group }: ExpenseListProps) {
  if (group.expenses.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
        <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No expenses yet</h3>
        <p className="text-gray-400">Start by adding your first expense to the group.</p>
      </div>
    );
  }

  const sortedExpenses = [...group.expenses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          All Expenses ({group.expenses.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-700">
        {sortedExpenses.map((expense) => {
          const payer = group.participants.find(p => p.id === expense.paidBy);
          const splitParticipants = expense.splitBetween.map(split => {
            const participant = group.participants.find(p => p.id === split.participantId);
            return { ...participant, amount: split.amount };
          });
          
          return (
            <div key={expense.id} className="p-6 hover:bg-gray-700/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{expense.description}</h3>
                    <span className="text-2xl font-bold text-emerald-400 ml-4">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>Paid by <span className="text-white font-medium">{payer?.name}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-400 text-sm">Split between:</span>
                  {splitParticipants.map((participant, index) => (
                    <span
                      key={participant.id}
                      className="inline-flex items-center gap-1 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {participant.name}
                      <span className="text-emerald-400 font-medium">
                        ${participant.amount.toFixed(2)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}