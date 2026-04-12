"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { ADMIN_BASE_PATH, VERIFICATION_STATUS_CONFIG } from '../../lib/constants';
import {
  ClipboardCheck,
  Users,
  BarChart3,
  LayoutGrid,
  ArrowLeft,
  Shield,
  LogOut,
} from 'lucide-react';

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navLinks = [
    { name: 'Verification Queue', href: `${ADMIN_BASE_PATH}/queue`, icon: ClipboardCheck },
    { name: 'User Management', href: `${ADMIN_BASE_PATH}/users`, icon: Users },
    { name: 'Analytics', href: `${ADMIN_BASE_PATH}/analytics`, icon: BarChart3 },
  ];

  const activeClass =
    'bg-gradient-to-r from-red-500/15 to-transparent border-l-4 border-red-400 text-white';
  const inactiveClass =
    'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent';

  const baseSidebarClasses =
    'w-64 bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col transition-transform duration-300 z-50 absolute md:relative h-full text-gray-300 border-r border-gray-800 shadow-2xl';
  const mobileTranslate = mobileOpen
    ? 'translate-x-0'
    : '-translate-x-full md:translate-x-0';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`${baseSidebarClasses} ${mobileTranslate}`}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-tight">Market-Link</span>
              <span className="block text-[10px] text-red-400 font-medium -mt-0.5 tracking-widest uppercase">Admin Console</span>
            </div>
          </div>
        </div>

        {/* Admin Identity */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold tracking-widest shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">
                {user?.firstName || user?.email?.split('@')[0] || 'Admin'}
              </h4>
              <span className="text-xs text-red-400 font-medium">Platform Administrator</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Administration
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                pathname.startsWith(link.href) ? activeClass : inactiveClass
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          ))}

          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-8">
            Navigation
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center px-6 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            User Dashboard
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center px-6 py-3 text-sm font-medium transition-colors text-red-400 hover:text-red-300 hover:bg-white/5 border-l-4 border-transparent"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
