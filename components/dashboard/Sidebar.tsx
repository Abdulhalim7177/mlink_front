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

  const tierMap: Record<string, string> = {
    'FREE': 'Standard User',
    'BETA_BUYER': 'Beta Buyer',
    'BETA_SELLER': 'Beta Seller',
    'PREMIUM': 'Premium Investor',
    'ADMIN': 'Platform Admin'
  };

  const currentTier = user?.tier ? tierMap[user.tier] : 'Standard User';

  // Navigation Links
  const platformLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { name: 'Opportunities', href: '/dashboard/opportunities', icon: Search, badge: 'New' },
    { name: 'AI Matchmaking', href: '/dashboard/ai-matchmaking', icon: Brain },
  ];

  const managementLinks = [
    { name: 'Deal Flow', href: '/dashboard/deal-flow', icon: Briefcase },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: '3' },
    { name: 'Contracts', href: '/dashboard/contracts', icon: FileSignature },
  ];

  const activeClass = "bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent text-accent";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent";

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
              <span className="text-xs text-accent font-medium truncate py-0.5">{currentTier}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</div>
          {platformLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${pathname === link.href ? activeClass : inactiveClass}`}>
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
              {link.badge && (
                <span className="ml-auto bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{link.badge}</span>
              )}
            </Link>
          ))}

          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</div>
          {managementLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${pathname === link.href ? activeClass : inactiveClass}`}>
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
              {link.badge && (
                <span className="ml-auto bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{link.badge}</span>
              )}
            </Link>
          ))}

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
