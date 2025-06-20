import React, { useState } from 'react';
import { Plus, Copy, Check, Users, Receipt, Calculator, Home, Share, DollarSign, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div className="flex items-center mb-6 lg:mb-0">
              <button
                onClick={onBackToHome}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 p-4 rounded-2xl transition-all duration-300 mr-6 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
              >
                <Home className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400 mb-2">
                  {group.name}
                </h1>
                <p className="text-gray-400 text-lg">Group ID: <span className="font-mono text-emerald-400">{group.id}</span></p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Share Link'}
              </button>
              
              <button
                onClick={onAddExpense}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-lg mb-2">Total Expenses</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                      ${totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-2xl shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-lg mb-2">Members</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      {group.participants.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-lg mb-2">Transactions</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {group.expenses.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                    <Receipt className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-3 mb-12 border border-gray-700/50 shadow-xl">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex-1 sm:flex-none justify-center ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
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
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      Recent Expenses
                    </h3>
                    {group.expenses.length === 0 ? (
                      <div className="text-center py-12">
                        <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                        <p className="text-gray-400 text-lg mb-4">No expenses yet</p>
                        <button
                          onClick={onAddExpense}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold text-lg transition-colors"
                        >
                          Add your first expense
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {group.expenses.slice(-3).reverse().map((expense) => {
                          const payer = group.participants.find(p => p.id === expense.paidBy);
                          return (
                            <div key={expense.id} className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-b-0">
                              <div>
                                <p className="text-white font-semibold text-lg">{expense.description}</p>
                                <p className="text-gray-400">Paid by {payer?.name}</p>
                              </div>
                              <p className="text-emerald-400 font-bold text-xl">${expense.amount.toFixed(2)}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Calculator className="w-6 h-6" />
                      Quick Balance
                    </h3>
                    {balances.length === 0 ? (
                      <div className="text-center py-12">
                        <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                        <p className="text-gray-400 text-lg">No balances to show</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {balances.slice(0, 4).map((balance) => (
                          <div key={balance.participantId} className="flex items-center justify-between py-3">
                            <p className="text-white font-semibold">{balance.participantName}</p>
                            <p className={`font-bold text-lg ${
                              balance.balance > 0 ? 'text-emerald-400' : 
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