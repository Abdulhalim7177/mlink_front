"use client";

import React from 'react';
import { Menu, Search, Plus, Bell } from 'lucide-react';

export default function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center md:hidden">
        <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700 p-1 -ml-1">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Page Title - Hidden on small screens */}
      <div className="hidden md:flex items-center">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Overview</h1>
        <span className="ml-3 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
          Last updated: Just now
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 ml-auto md:ml-0">
        {/* Search */}
        <div className="hidden md:block relative">
          <input 
            type="text" 
            placeholder="Search Listings..."
            className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent w-64 bg-gray-50 transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Create Listing Btn */}
        <button className="hidden md:flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Post Opportunity
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
