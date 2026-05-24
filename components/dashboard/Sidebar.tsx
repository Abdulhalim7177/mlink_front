"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import {
  LayoutGrid,
  BarChart2,
  Search,
  Brain,
  Briefcase,
  MessageSquare,
  FileSignature,
  Settings,
  LogOut
} from 'lucide-react';
import api from '../../lib/api';

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearCredentials } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout issue", e);
    } finally {
      clearCredentials();
      router.push('/auth/login');
    }
  };

  const navUserAbbr = user?.profile?.firstName 
    ? `${user.profile.firstName.charAt(0)}${user.profile.lastName?.charAt(0) || ''}`
    : user?.email.charAt(0).toUpperCase() || 'U';

  const navUserName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email.split('@')[0];

  const tierBadgeColors: Record<string, string> = {
    'BASIC': 'bg-gray-700 text-gray-300 border-gray-600',
    'PRO': 'bg-primary/20 text-primary-light border-primary/30',
    'ENTERPRISE': 'bg-accent/20 text-accent-light border-accent/30',
    'ADMIN': 'bg-red-900/40 text-red-300 border-red-800/50'
  };

  const currentTierLabel = user?.tier || 'BASIC';

  // Navigation Links
  const platformLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid, implemented: true },
    { name: 'Market Pulse', href: '/dashboard/market-pulse', icon: BarChart2, implemented: true },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: Search, implemented: true },
    { name: 'AI Matching', href: '/dashboard/ai-matches', icon: Brain, implemented: false },
  ];

  const managementLinks = [
    { name: 'My Listings', href: '/dashboard/listings', icon: Briefcase, implemented: true },
    { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare, implemented: true },
    { name: 'Deals & Contracts', href: '/dashboard/deals', icon: FileSignature, implemented: false },
  ];

  const activeClass = "bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent text-accent";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent";
  const disabledClass = "opacity-40 cursor-not-allowed text-gray-500 border-l-4 border-transparent";

  // Sidebar Panel Base Class
  const baseSidebarClasses = "w-64 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col transition-transform duration-300 z-50 absolute md:relative h-full text-gray-300 border-r border-gray-800 shadow-xl";
  const mobileTranslate = mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0";

  return (
    <>
      {/* Mobile Dark Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`${baseSidebarClasses} ${mobileTranslate}`}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-light rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Market-Link</span>
          </div>
        </div>

        {/* User Snippet */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-bold tracking-widest shrink-0">
              {navUserAbbr}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate capitalize">{navUserName}</h4>
              <div className={`mt-0.5 inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border ${tierBadgeColors[currentTierLabel]}`}>
                {currentTierLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</div>
          {platformLinks.map(link => {
            const active = pathname === link.href;
            if (!link.implemented) {
              return (
                <div key={link.name} className={`flex items-center px-6 py-3 text-sm font-medium ${disabledClass} group relative`}>
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.name}
                  <span className="ml-auto bg-gray-700 text-[8px] px-1.5 py-0.5 rounded text-gray-400">Soon</span>
                </div>
              );
            }
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${active ? activeClass : inactiveClass}`}>
                <link.icon className="w-5 h-5 mr-3" />
                {link.name}
                {link.badge && (
                  <span className="ml-auto bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{link.badge}</span>
                )}
              </Link>
            );
          })}

          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</div>
          {managementLinks.map(link => {
            const active = pathname === link.href;
            if (!link.implemented) {
              return (
                <div key={link.name} className={`flex items-center px-6 py-3 text-sm font-medium ${disabledClass} group relative`}>
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.name}
                  <span className="ml-auto bg-gray-700 text-[8px] px-1.5 py-0.5 rounded text-gray-400">Soon</span>
                </div>
              );
            }
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${active ? activeClass : inactiveClass}`}>
                <link.icon className="w-5 h-5 mr-3" />
                {link.name}
                {link.badge && (
                  <span className="ml-auto bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{link.badge}</span>
                )}
              </Link>
            );
          })}

          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Settings</div>
          <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)} className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${pathname === '/dashboard/settings' ? activeClass : inactiveClass}`}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center px-6 py-3 text-sm font-medium transition-colors text-red-400 hover:text-red-300 hover:bg-white/5 border-l-4 border-transparent">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
