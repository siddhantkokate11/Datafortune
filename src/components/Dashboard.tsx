import React, { useState } from 'react';
import { useAppStore } from '../services/store';
import KanbanBoard from './KanbanBoard';
import { 
  Search, LogOut, Layout, Briefcase, Users, 
  BarChart3, Plus, Clock, ArrowLeft
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { searchQuery, setSearchQuery, logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Projects' | 'Team' | 'Reporting'>('Tasks');

  // This function allows the Header button to trigger the Modal inside KanbanBoard
  const handleAddTaskGlobal = () => {
    window.dispatchEvent(new CustomEvent('open-task-modal'));
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] text-slate-300 flex flex-col border-r border-slate-800 flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <Layout className="text-white" size={20} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Siddhant.ai</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem 
            icon={<Layout size={18}/>} 
            label="Dashboard" 
            active={activeTab === 'Tasks'} 
            onClick={() => setActiveTab('Tasks')} 
          />
          <NavItem 
            icon={<Briefcase size={18}/>} 
            label="Projects" 
            active={activeTab === 'Projects'} 
            onClick={() => setActiveTab('Projects')} 
          />
          <NavItem 
            icon={<Users size={18}/>} 
            label="Team" 
            active={activeTab === 'Team'} 
            onClick={() => setActiveTab('Team')} 
          />
          <NavItem 
            icon={<BarChart3 size={18}/>} 
            label="Reporting" 
            active={activeTab === 'Reporting'} 
            onClick={() => setActiveTab('Reporting')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 w-full rounded-xl transition-all">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks, candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">Siddhant Kokate</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-700 font-bold">SK</div>
          </div>
        </header>

        {/* Dynamic Content Switching */}
        {activeTab === 'Tasks' ? (
          <>
            <div className="p-8 pb-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase tracking-widest mb-1 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={12} />
                    Back to Projects
                  </button>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kanban - Technical Assessment</h1>
                </div>
                {/* GLOBAL ADD TASK BUTTON */}
                <button 
                  onClick={handleAddTaskGlobal}
                  className="bg-[#1E293B] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Plus size={18} />
                  Add Task
                </button>
              </div>

              <div className="flex gap-8 border-b border-slate-200">
                <button className="pb-3 text-sm font-bold text-slate-400 border-b-2 border-transparent">Overview</button>
                <button className="pb-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600">Tasks</button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto p-8 pt-6">
              <KanbanBoard />
            </div>
          </>
        ) : (
          <ComingSoonView title={activeTab} />
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-indigo-600/10 text-indigo-400 shadow-sm' : 'hover:bg-slate-800 text-slate-400'
    }`}
  >
    {icon}
    <span className="text-sm font-bold">{label}</span>
  </button>
);

const ComingSoonView = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
    <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Clock size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">{title} Module</h2>
      <p className="text-slate-500 font-medium leading-relaxed">
        This feature is part of the premium enterprise roadmap and is coming in the next sprint.
      </p>
    </div>
  </div>
);

export default Dashboard;