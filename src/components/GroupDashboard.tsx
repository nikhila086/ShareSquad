import React, { useState } from 'react';
import { Plus, Copy, Check, Users, Receipt, Calculator, Home, Share, DollarSign } from 'lucide-react';
import { Group, Balance } from '../types';
import ExpenseList from './ExpenseList';
import BalanceSummary from './BalanceSummary';
import ParticipantsList from './ParticipantsList';

interface GroupDashboardProps {
  group: Group;
  currentUser: string;
  onAddExpense: () => void;
  onBackToHome: () => void;
  onUpdateGroup: (group: Group) => void;
}

export default function GroupDashboard({ 
  group, 
  currentUser, 
  onAddExpense, 
  onBackToHome,
  onUpdateGroup 
}: GroupDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'balances' | 'participants'>('overview');

  const groupUrl = `${window.location.origin}${window.location.pathname}?group=${group.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(groupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const calculateBalances = (): Balance[] => {
    const balances: { [participantId: string]: Balance } = {};
    
    // Initialize balances
    group.participants.forEach(participant => {
      balances[participant.id] = {
        participantId: participant.id,
        participantName: participant.name,
        balance: 0,
        owes: {},
        owedBy: {}
      };
    });

    // Calculate balances from expenses
    group.expenses.forEach(expense => {
      const totalSplit = expense.splitBetween.reduce((sum, split) => sum + split.amount, 0);
      
      // Add to payer's balance
      balances[expense.paidBy].balance += expense.amount;
      
      // Subtract each person's share
      expense.splitBetween.forEach(split => {
        balances[split.participantId].balance -= split.amount;
        
        if (split.participantId !== expense.paidBy) {
          // Track who owes whom
          if (!balances[split.participantId].owes[expense.paidBy]) {
            balances[split.participantId].owes[expense.paidBy] = 0;
          }
          if (!balances[expense.paidBy].owedBy[split.participantId]) {
            balances[expense.paidBy].owedBy[split.participantId] = 0;
          }
          
          balances[split.participantId].owes[expense.paidBy] += split.amount;
          balances[expense.paidBy].owedBy[split.participantId] += split.amount;
        }
      });
    });

    return Object.values(balances);
  };

  const balances = calculateBalances();
  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'balances', label: 'Balances', icon: Calculator },
    { id: 'participants', label: 'Members', icon: Users }
  ];

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div className="flex items-center mb-6 lg:mb-0">
              <button
                onClick={onBackToHome}
                className="btn-secondary p-3 rounded-xl mr-6"
              >
                <Home className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {group.name}
                </h1>
                <p className="text-gray-400">
                  Group ID: <span className="font-mono text-blue-400">{group.id}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCopyLink}
                className="btn-secondary flex items-center justify-center gap-3"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Share Link'}
              </button>
              
              <button
                onClick={onAddExpense}
                className="btn-primary glow-blue flex items-center justify-center gap-3"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Stats */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card-gradient p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-white">
                      ${totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="card-gradient p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Members</p>
                    <p className="text-2xl font-bold text-white">
                      {group.participants.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="card-gradient p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Transactions</p>
                    <p className="text-2xl font-bold text-white">
                      {group.expenses.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="card-gradient rounded-2xl p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all flex-1 sm:flex-none justify-center ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="card-gradient p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-white mb-6">Recent Expenses</h3>
                    {group.expenses.length === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No expenses yet</p>
                        <button
                          onClick={onAddExpense}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Add your first expense
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {group.expenses.slice(-3).reverse().map((expense) => {
                          const payer = group.participants.find(p => p.id === expense.paidBy);
                          return (
                            <div key={expense.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                              <div>
                                <p className="text-white font-medium">{expense.description}</p>
                                <p className="text-gray-400 text-sm">Paid by {payer?.name}</p>
                              </div>
                              <p className="text-green-400 font-semibold">${expense.amount.toFixed(2)}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="card-gradient p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-white mb-6">Balance Summary</h3>
                    {balances.length === 0 ? (
                      <div className="text-center py-8">
                        <Calculator className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No balances to show</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {balances.slice(0, 4).map((balance) => (
                          <div key={balance.participantId} className="flex items-center justify-between py-2">
                            <p className="text-white font-medium">{balance.participantName}</p>
                            <p className={`font-semibold ${
                              balance.balance > 0 ? 'text-green-400' : 
                              balance.balance < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {balance.balance > 0 ? '+' : ''}${balance.balance.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'expenses' && (
              <ExpenseList group={group} />
            )}

            {activeTab === 'balances' && (
              <BalanceSummary balances={balances} participants={group.participants} />
            )}

            {activeTab === 'participants' && (
              <ParticipantsList 
                group={group} 
                currentUser={currentUser}
                onUpdateGroup={onUpdateGroup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}