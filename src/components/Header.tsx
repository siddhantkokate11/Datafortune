import React from 'react';
import { useAppStore } from '../services/store';
import { SearchIcon, LogOutIcon } from './Icons';

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, logout } = useAppStore();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-sm">K</div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">KanbanFlow</span>
          </div>
          <div className="flex-1 max-w-2xl px-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div>
              <input className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all" placeholder="Search tasks by title or description..." type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold border border-brand-200">AD</div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><LogOutIcon className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;