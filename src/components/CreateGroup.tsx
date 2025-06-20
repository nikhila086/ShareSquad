import React, { useState } from 'react';
import { ArrowLeft, Users, Sparkles, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-12">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 p-4 rounded-2xl transition-all duration-300 mr-6 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400">
              Create New Group
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-center mb-12">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-3xl shadow-2xl shadow-emerald-500/25">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="groupName" className="block text-lg font-semibold text-gray-300 mb-4">
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Weekend Trip, Dinner Party, House Expenses"
                  className="w-full bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl px-6 py-4 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="creatorName" className="block text-lg font-semibold text-gray-300 mb-4">
                  Your Name
                </label>
                <input
                  type="text"
                  id="creatorName"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl px-6 py-4 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!groupName.trim() || !creatorName.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:transform hover:scale-105"
              >
                <Sparkles className="w-6 h-6" />
                Create Group
              </button>
            </form>

            <div className="mt-12 p-8 bg-gradient-to-r from-gray-700/30 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-600/30">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                What happens next?
              </h3>
              <ul className="text-gray-300 space-y-3 text-lg">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Your group will get a unique shareable link
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Invite friends by sharing the link
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Start adding expenses and split them fairly
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Track who owes whom in real-time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}