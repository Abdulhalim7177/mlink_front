"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { useAdminAuthStore } from '../../../store/admin-auth.store';
import { AdminLoginResponse } from '../../../lib/types';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { setCredentials } = useAdminAuthStore();
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setGlobalError('');

    try {
      const response = await axios.post<{ data: AdminLoginResponse }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api/v1'}/admin-auth/login`,
        { email: data.email, password: data.password },
        { withCredentials: true }
      );

      const { accessToken, admin } = response.data.data;
      setCredentials(admin, accessToken);

      // Route based on department
      if (admin.department === 'SUPER_ADMIN') router.push('/mlink-ctrl-9x4e/admin-management');
      else if (admin.department === 'CUSTOMER_SERVICE') router.push('/mlink-ctrl-9x4e/users');
      else router.push('/mlink-ctrl-9x4e/queue');
    } catch (err: any) {
      setGlobalError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 selection:bg-red-500/30">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden relative">
          {/* Top red accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
          
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
              <p className="text-gray-400 text-sm mt-1">Market-Link Platform Management</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {globalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400 text-center font-medium">{globalError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">
                  Admin Email
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="admin@marketlink.com"
                  className={`w-full px-4 py-2.5 bg-gray-950 border rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-red-500 focus:ring-red-500/20'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-gray-950 border rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
                    errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-800 focus:border-red-500 focus:ring-red-500/20'
                  }`}
                />
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 auto-spin text-red-200" />
                  ) : (
                    <>
                      Enter Console
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-950 border-t border-gray-800 p-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              Restricted Area. Returning? <Link href="/auth/login" className="text-red-400 hover:text-red-300 transition-colors">Go to User Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
