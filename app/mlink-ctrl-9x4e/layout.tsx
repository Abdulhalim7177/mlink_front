"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '../../store/admin-auth.store';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Loader2, Menu, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isAuthenticated } = useAdminAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Is this the login page?
  const isLoginPage = pathname === '/mlink-ctrl-9x4e/login';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoginPage) {
      if (!isAuthenticated) {
        router.replace('/mlink-ctrl-9x4e/login');
        return;
      }
    }
    // If logged in and on the login page, redirect to correct dashboard
    if (isMounted && isLoginPage && isAuthenticated && admin) {
      if (admin.department === 'SUPER_ADMIN') router.replace('/mlink-ctrl-9x4e/admin-management');
      else if (admin.department === 'CUSTOMER_SERVICE') router.replace('/mlink-ctrl-9x4e/users');
      else router.replace('/mlink-ctrl-9x4e/queue');
    }
  }, [isMounted, isAuthenticated, isLoginPage, admin, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-400" />
      </div>
    );
  }

  // If this is the login page, don't show the dashboard layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !admin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Session Expired</h2>
          <p className="text-gray-400 text-sm">Please log in to the admin console.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 mr-3 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Admin Console</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {admin?.email} ({admin?.department.replace('_', ' ')})
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
