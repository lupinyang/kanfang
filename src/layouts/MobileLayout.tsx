import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { PlusCircle, List } from 'lucide-react';
import { cn } from '../lib/utils';

export const MobileLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Mobile Container Simulation */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl flex flex-col relative">
        
        {/* Header (Optional, maybe just title) */}
        <header className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
          <div className="w-8"></div> {/* Spacer for centering */}
          <h1 className="text-lg font-bold text-center">
            {location.pathname === '/' ? '房源录入' : 
             location.pathname === '/list' ? '我的看房' : '看房助手'}
          </h1>
          <div className="w-8"></div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 pb-20 overflow-y-auto">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center p-2 z-20 pb-safe">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-400"
            )}
          >
            <PlusCircle size={24} />
            <span className="text-xs mt-1">录入</span>
          </NavLink>
          
          <NavLink 
            to="/list" 
            className={({ isActive }) => cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-400"
            )}
          >
            <List size={24} />
            <span className="text-xs mt-1">列表</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
