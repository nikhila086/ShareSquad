import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Link } from 'lucide-react';

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
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
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
              Join Group
            </h1>
          </div>

          {/* Form Card */}
          <div className="card-gradient p-8 md:p-12 rounded-3xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-2xl">
                <Link className="w-8 h-8 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="groupId" className="block text-sm font-medium text-gray-300 mb-3">
                  Group ID
                </label>
                <input
                  type="text"
                  id="groupId"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Enter 6-character group ID"
                  className="w-full input-field text-lg font-mono uppercase tracking-wider"
                  maxLength={6}
                  required
                />
                <p className="text-gray-500 text-sm mt-2">
                  Group IDs are 6 characters long (e.g., ABC123)
                </p>
              </div>

              <div>
                <label htmlFor="participantName" className="block text-sm font-medium text-gray-300 mb-3">
                  Your Name
                </label>
                <input
                  type="text"
                  id="participantName"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full input-field text-lg"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!groupId.trim() || !participantName.trim()}
                className="w-full btn-primary py-4 text-lg glow-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Group
              </button>
            </form>

            <div className="mt-12 card-gradient p-6 rounded-2xl border border-green-500/20">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                How to join a group
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Get the group ID from the group creator</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Enter the 6-character group ID above</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Add your name and join the group</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}