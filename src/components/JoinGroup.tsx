import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Link, Sparkles } from 'lucide-react';

interface JoinGroupProps {
  onJoinGroup: (groupId: string, participantName: string) => void;
  onBack: () => void;
  defaultName?: string;
  prefilledGroupId?: string;
}

export default function JoinGroup({ onJoinGroup, onBack, defaultName = '', prefilledGroupId = '' }: JoinGroupProps) {
  const [groupId, setGroupId] = useState(prefilledGroupId);
  const [participantName, setParticipantName] = useState(defaultName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilledGroupId) {
      setGroupId(prefilledGroupId);
    }
  }, [prefilledGroupId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!groupId.trim() || !participantName.trim()) {
      return;
    }

    // Always allow joining - create group if it doesn't exist
    onJoinGroup(groupId.trim().toUpperCase(), participantName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
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
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
              Join Group
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-center mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-3xl shadow-2xl shadow-blue-500/25">
                <Link className="w-12 h-12 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="groupId" className="block text-lg font-semibold text-gray-300 mb-4">
                  Group ID
                </label>
                <input
                  type="text"
                  id="groupId"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Enter the 6-character group ID"
                  className="w-full bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl px-6 py-4 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 uppercase"
                  maxLength={6}
                  required
                />
                <p className="text-gray-400 text-sm mt-3">
                  Group IDs are 6 characters long (e.g., ABC123)
                </p>
              </div>

              <div>
                <label htmlFor="participantName" className="block text-lg font-semibold text-gray-300 mb-4">
                  Your Name
                </label>
                <input
                  type="text"
                  id="participantName"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl px-6 py-4 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  required
                />
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-500/50 rounded-2xl p-6">
                  <p className="text-red-300 text-lg">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!groupId.trim() || !participantName.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:transform hover:scale-105"
              >
                <Users className="w-6 h-6" />
                Join Group
              </button>
            </form>

            <div className="mt-12 p-8 bg-gradient-to-r from-gray-700/30 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-600/30">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                How to join:
              </h3>
              <ul className="text-gray-300 space-y-3 text-lg">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Get the group link or ID from a group member
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Enter the 6-character group ID above
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Add your name and join the group
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Start splitting expenses with everyone!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}