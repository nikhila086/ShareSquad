import React, { useState, useEffect } from 'react';
import { Users, Plus, Calculator, ArrowLeft, Copy, Check, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import CreateGroup from './components/CreateGroup';
import JoinGroup from './components/JoinGroup';
import GroupDashboard from './components/GroupDashboard';
import AddExpense from './components/AddExpense';
import { Group, Expense, Participant, Balance } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'join' | 'dashboard' | 'add-expense'>('home');
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [urlGroupId, setUrlGroupId] = useState<string>('');

  useEffect(() => {
    // Check if user has a saved name
    const savedName = localStorage.getItem('sharesquad_username');
    if (savedName) {
      setUserName(savedName);
    }

    // Check if there's a group ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('group');
    
    if (groupId) {
      const groupIdUpper = groupId.toUpperCase();
      setUrlGroupId(groupIdUpper);
      
      // Try to find the group in localStorage first
      const savedGroups = JSON.parse(localStorage.getItem('sharesquad_groups') || '[]');
      const group = savedGroups.find((g: Group) => g.id === groupIdUpper);
      
      if (group) {
        // Check if user is already in the group
        const userInGroup = group.participants.find(p => p.name === savedName);
        if (userInGroup && savedName) {
          setCurrentGroup(group);
          setCurrentView('dashboard');
        } else {
          // User not in group or no saved name, go to join view
          setCurrentView('join');
        }
      } else {
        // Group not found locally, go to join view with pre-filled ID
        setCurrentView('join');
      }
      
      // Clean up URL after processing
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check for current group in localStorage
      const currentGroupId = localStorage.getItem('sharesquad_current_group');
      if (currentGroupId) {
        const savedGroups = JSON.parse(localStorage.getItem('sharesquad_groups') || '[]');
        const group = savedGroups.find((g: Group) => g.id === currentGroupId);
        if (group) {
          setCurrentGroup(group);
          setCurrentView('dashboard');
        }
      }
    }
  }, []);

  const saveGroup = (group: Group) => {
    const savedGroups = JSON.parse(localStorage.getItem('sharesquad_groups') || '[]');
    const existingIndex = savedGroups.findIndex((g: Group) => g.id === group.id);
    
    if (existingIndex >= 0) {
      savedGroups[existingIndex] = group;
    } else {
      savedGroups.push(group);
    }
    
    localStorage.setItem('sharesquad_groups', JSON.stringify(savedGroups));
    localStorage.setItem('sharesquad_current_group', group.id);
  };

  const handleCreateGroup = (groupName: string, creatorName: string) => {
    const groupId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const group: Group = {
      id: groupId,
      name: groupName,
      participants: [{ id: Date.now().toString(), name: creatorName }],
      expenses: [],
      createdAt: new Date().toISOString()
    };
    
    setCurrentGroup(group);
    setUserName(creatorName);
    localStorage.setItem('sharesquad_username', creatorName);
    saveGroup(group);
    setCurrentView('dashboard');
  };

  const handleJoinGroup = (groupId: string, participantName: string) => {
    const savedGroups = JSON.parse(localStorage.getItem('sharesquad_groups') || '[]');
    let group = savedGroups.find((g: Group) => g.id === groupId.trim().toUpperCase());
    
    if (!group) {
      // Create a new group if it doesn't exist (simulating joining via link)
      group = {
        id: groupId.trim().toUpperCase(),
        name: `Group ${groupId.trim().toUpperCase()}`,
        participants: [],
        expenses: [],
        createdAt: new Date().toISOString()
      };
    }
    
    // Add participant if not already in group
    const existingParticipant = group.participants.find((p: Participant) => p.name === participantName);
    if (!existingParticipant) {
      group.participants.push({
        id: Date.now().toString(),
        name: participantName
      });
    }
    
    setCurrentGroup(group);
    setUserName(participantName);
    localStorage.setItem('sharesquad_username', participantName);
    saveGroup(group);
    setUrlGroupId(''); // Clear the URL group ID
    setCurrentView('dashboard');
  };

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!currentGroup) return;
    
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedGroup = {
      ...currentGroup,
      expenses: [...currentGroup.expenses, newExpense]
    };
    
    setCurrentGroup(updatedGroup);
    saveGroup(updatedGroup);
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentGroup(null);
    setUrlGroupId('');
    localStorage.removeItem('sharesquad_current_group');
    setCurrentView('home');
  };

  if (currentView === 'create') {
    return <CreateGroup onCreateGroup={handleCreateGroup} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'join') {
    return (
      <JoinGroup 
        onJoinGroup={handleJoinGroup} 
        onBack={() => {
          setUrlGroupId('');
          setCurrentView('home');
        }} 
        defaultName={userName}
        prefilledGroupId={urlGroupId}
      />
    );
  }

  if (currentView === 'dashboard' && currentGroup) {
    return (
      <GroupDashboard
        group={currentGroup}
        currentUser={userName}
        onAddExpense={() => setCurrentView('add-expense')}
        onBackToHome={handleBackToHome}
        onUpdateGroup={(group) => {
          setCurrentGroup(group);
          saveGroup(group);
        }}
      />
    );
  }

  if (currentView === 'add-expense' && currentGroup) {
    return (
      <AddExpense
        group={currentGroup}
        onAddExpense={handleAddExpense}
        onBack={() => setCurrentView('dashboard')}
        currentUser={userName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-3xl mr-6 shadow-2xl shadow-emerald-500/25">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400">
                ShareSquad
              </h1>
            </div>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Split expenses effortlessly with friends. No signups, no hassle – just fair sharing made simple.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Create Groups</h3>
              <p className="text-gray-400 text-lg leading-relaxed">Start a new expense group and invite friends with a shareable link.</p>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Track Expenses</h3>
              <p className="text-gray-400 text-lg leading-relaxed">Add expenses and split them fairly among group members.</p>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">See Balances</h3>
              <p className="text-gray-400 text-lg leading-relaxed">Instantly see who owes whom and settle up easily.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => setCurrentView('create')}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:transform hover:scale-105"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              Create New Group
            </button>
            
            <button
              onClick={() => setCurrentView('join')}
              className="group bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 transition-all duration-300 border border-gray-600 hover:border-gray-500 shadow-2xl hover:transform hover:scale-105"
            >
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              Join Existing Group
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">∞</div>
              <div className="text-gray-300 text-lg">Groups Created</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-purple-400 mb-2">0</div>
              <div className="text-gray-300 text-lg">Signups Required</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-blue-400 mb-2">100%</div>
              <div className="text-gray-300 text-lg">Fair Splitting</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-12 border-t border-gray-700/50">
            <p className="text-gray-500 text-lg">
              No accounts needed • Data stays on your device • Share and split with ease
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;