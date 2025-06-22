import React, { useState, useEffect } from 'react';
import { Users, Plus, Calculator, ArrowLeft, Copy, Check, DollarSign, Receipt, TrendingUp, Sparkles, Star } from 'lucide-react';
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
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mr-6 float">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-gradient">
                ShareSquad
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Split expenses effortlessly with friends, family, and colleagues. 
              Beautiful, simple, and always free.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card-gradient p-8 rounded-2xl hover-card">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Groups</h3>
              <p className="text-gray-400 leading-relaxed">Start a new group instantly and invite friends with a simple link.</p>
            </div>
            
            <div className="card-gradient p-8 rounded-2xl hover-card">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Track Expenses</h3>
              <p className="text-gray-400 leading-relaxed">Add expenses and split them equally or with custom amounts.</p>
            </div>
            
            <div className="card-gradient p-8 rounded-2xl hover-card">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Balances</h3>
              <p className="text-gray-400 leading-relaxed">See who owes what with automatic calculations and settlement suggestions.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => setCurrentView('create')}
              className="btn-primary glow-blue flex items-center justify-center gap-3 text-lg"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
            
            <button
              onClick={() => setCurrentView('join')}
              className="btn-secondary flex items-center justify-center gap-3 text-lg"
            >
              <Users className="w-5 h-5" />
              Join Group
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center card-gradient p-8 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">Simple</div>
              <div className="text-gray-400">No signup required</div>
            </div>
            <div className="text-center card-gradient p-8 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">Fast</div>
              <div className="text-gray-400">Create groups instantly</div>
            </div>
            <div className="text-center card-gradient p-8 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">Free</div>
              <div className="text-gray-400">Always and forever</div>
            </div>
          </div>

          {/* Footer */}
          
        </div>
      </div>
    </div>
  );
}

export default App;