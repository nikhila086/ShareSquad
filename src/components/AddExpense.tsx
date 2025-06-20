import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Users, Calculator } from 'lucide-react';
import { Group, ExpenseSplit } from '../types';

interface AddExpenseProps {
  group: Group;
  onAddExpense: (expense: {
    description: string;
    amount: number;
    paidBy: string;
    splitBetween: ExpenseSplit[];
  }) => void;
  onBack: () => void;
  currentUser: string;
}

export default function AddExpense({ group, onAddExpense, onBack, currentUser }: AddExpenseProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(() => {
    const currentUserParticipant = group.participants.find(p => p.name === currentUser);
    return currentUserParticipant?.id || group.participants[0]?.id || '';
  });
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(() => 
    group.participants.map(p => p.id)
  );
  const [customAmounts, setCustomAmounts] = useState<{ [participantId: string]: string }>({});

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleCustomAmountChange = (participantId: string, value: string) => {
    setCustomAmounts(prev => ({
      ...prev,
      [participantId]: value
    }));
  };

  const calculateSplit = (): ExpenseSplit[] => {
    const totalAmount = parseFloat(amount) || 0;
    
    if (splitType === 'equal') {
      const splitAmount = totalAmount / selectedParticipants.length;
      return selectedParticipants.map(participantId => ({
        participantId,
        amount: splitAmount
      }));
    } else {
      return selectedParticipants.map(participantId => ({
        participantId,
        amount: parseFloat(customAmounts[participantId] || '0')
      }));
    }
  };

  const split = calculateSplit();
  const totalSplit = split.reduce((sum, s) => sum + s.amount, 0);
  const totalAmount = parseFloat(amount) || 0;
  const isValidSplit = Math.abs(totalSplit - totalAmount) < 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !paidBy || selectedParticipants.length === 0) {
      return;
    }

    if (splitType === 'custom' && !isValidSplit) {
      return;
    }

    onAddExpense({
      description: description.trim(),
      amount: totalAmount,
      paidBy,
      splitBetween: split
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-xl transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">Add Expense</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Expense Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this expense for?"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paid by
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  {group.participants.map(participant => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Options */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Split Between
              </h2>

              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setSplitType('equal')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    splitType === 'equal'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Split Equally
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('custom')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    splitType === 'custom'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Custom Amounts
                </button>
              </div>

              <div className="space-y-3">
                {group.participants.map(participant => (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      selectedParticipants.includes(participant.id)
                        ? 'bg-emerald-500/10 border-emerald-500'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleParticipantToggle(participant.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedParticipants.includes(participant.id)
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedParticipants.includes(participant.id) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </button>
                      <span className="text-white font-medium">{participant.name}</span>
                    </div>
                    
                    {selectedParticipants.includes(participant.id) && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">$</span>
                        {splitType === 'equal' ? (
                          <span className="text-white font-mono">
                            {totalAmount > 0 ? (totalAmount / selectedParticipants.length).toFixed(2) : '0.00'}
                          </span>
                        ) : (
                          <input
                            type="number"
                            step="0.01"
                            value={customAmounts[participant.id] || ''}
                            onChange={(e) => handleCustomAmountChange(participant.id, e.target.value)}
                            placeholder="0.00"
                            className="w-20 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-right font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {splitType === 'custom' && totalAmount > 0 && (
                <div className="mt-4 p-4 bg-gray-700 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Total Amount:</span>
                    <span className="text-white font-mono">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Split Total:</span>
                    <span className={`font-mono ${isValidSplit ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${totalSplit.toFixed(2)}
                    </span>
                  </div>
                  {!isValidSplit && (
                    <p className="text-red-400 text-xs mt-2">
                      Split amounts must equal the total expense amount
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                !description.trim() || 
                !amount || 
                !paidBy || 
                selectedParticipants.length === 0 || 
                (splitType === 'custom' && !isValidSplit)
              }
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-emerald-500/25"
            >
              <DollarSign className="w-5 h-5" />
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}