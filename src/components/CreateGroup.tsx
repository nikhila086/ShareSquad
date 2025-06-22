import React, { useState } from 'react';
import { ArrowLeft, Users, Sparkles } from 'lucide-react';

interface CreateGroupProps {
  onCreateGroup: (groupName: string, creatorName: string) => void;
  onBack: () => void;
}

export default function CreateGroup({ onCreateGroup, onBack }: CreateGroupProps) {
  const [groupName, setGroupName] = useState('');
  const [creatorName, setCreatorName] = useState(() => {
    return localStorage.getItem('sharesquad_username') || '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && creatorName.trim()) {
      onCreateGroup(groupName.trim(), creatorName.trim());
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-12">
            <button
              onClick={onBack}
              className="btn-secondary p-3 rounded-xl mr-6"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Create Group
            </h1>
          </div>

          {/* Form Card */}
          <div className="card-gradient p-8 md:p-12 rounded-3xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-3">
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Weekend Trip, Dinner Party, House Expenses"
                  className="w-full input-field text-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="creatorName" className="block text-sm font-medium text-gray-300 mb-3">
                  Your Name
                </label>
                <input
                  type="text"
                  id="creatorName"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full input-field text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!groupName.trim() || !creatorName.trim()}
                className="w-full btn-primary py-4 text-lg glow-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </form>

            <div className="mt-12 card-gradient p-6 rounded-2xl border border-blue-500/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                What happens next?
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Get a unique group link to share</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Invite friends to join your group</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Start adding and splitting expenses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}