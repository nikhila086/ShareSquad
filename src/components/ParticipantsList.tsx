import React, { useState } from 'react';
import { Users, Plus, X, UserCheck } from 'lucide-react';
import { Group } from '../types';

interface ParticipantsListProps {
  group: Group;
  currentUser: string;
  onUpdateGroup: (group: Group) => void;
}

export default function ParticipantsList({ group, currentUser, onUpdateGroup }: ParticipantsListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newParticipantName.trim()) return;
    
    // Check if participant already exists
    const existingParticipant = group.participants.find(
      p => p.name.toLowerCase() === newParticipantName.trim().toLowerCase()
    );
    
    if (existingParticipant) {
      alert('A participant with this name already exists.');
      return;
    }

    const newParticipant = {
      id: Date.now().toString(),
      name: newParticipantName.trim()
    };

    const updatedGroup = {
      ...group,
      participants: [...group.participants, newParticipant]
    };

    onUpdateGroup(updatedGroup);
    setNewParticipantName('');
    setShowAddForm(false);
  };

  const handleRemoveParticipant = (participantId: string) => {
    // Don't allow removing if participant has expenses
    const hasExpenses = group.expenses.some(
      expense => expense.paidBy === participantId || 
      expense.splitBetween.some(split => split.participantId === participantId)
    );

    if (hasExpenses) {
      alert('Cannot remove participant who has associated expenses.');
      return;
    }

    if (group.participants.length <= 1) {
      alert('Cannot remove the last participant from the group.');
      return;
    }

    const updatedGroup = {
      ...group,
      participants: group.participants.filter(p => p.id !== participantId)
    };

    onUpdateGroup(updatedGroup);
  };

  return (
    <div className="card-gradient rounded-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Group Members ({group.participants.length})
          </h2>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Add Participant Form */}
        {showAddForm && (
          <form onSubmit={handleAddParticipant} className="mb-6 card-gradient p-4 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-3">Add New Member</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="Enter participant name"
                className="flex-1 input-field"
                autoFocus
                required
              />
              <button
                type="submit"
                className="btn-primary"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewParticipantName('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Participants List */}
        <div className="space-y-3">
          {group.participants.map((participant) => {
            const isCurrentUser = participant.name === currentUser;
            const participantExpenses = group.expenses.filter(
              expense => expense.paidBy === participant.id || 
              expense.splitBetween.some(split => split.participantId === participant.id)
            );
            
            return (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  isCurrentUser ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrentUser ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}>
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{participant.name}</span>
                      {isCurrentUser && (
                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {participantExpenses.length} expense{participantExpenses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {!isCurrentUser && participantExpenses.length === 0 && group.participants.length > 1 && (
                  <button
                    onClick={() => handleRemoveParticipant(participant.id)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove participant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {group.participants.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No participants yet</p>
          </div>
        )}
      </div>
    </div>
  );
}