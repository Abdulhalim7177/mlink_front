"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth.store';
import { Globe, Loader2, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [serverError, setServerError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard'); // or standard protected route
    }
  }, [isAuthenticated, router]);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setServerError('');
      const response = await api.post('/auth/login', data);
      
      const { accessToken, refreshToken, user } = response.data.data;
      setCredentials(user, accessToken, refreshToken);
      
      // Redirect based on backend status routing rules
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to authenticate. Please check your credentials.';
      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message });
      } else if (message.toLowerCase().includes('password') || message.toLowerCase().includes('credentials')) {
        setError('password', { type: 'server', message });
      } else {
        setServerError(message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-2xl z-10 border border-border/60 fade-in-up">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg mb-4">
            <Globe className="w-8 h-8 text-white" />
          </Link>
          <h2 className="text-3xl font-heading font-extrabold text-text-primary tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to access B2B Market-Link
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="bg-error/10 border border-error/20 p-4 rounded-lg flex items-center text-error text-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{serverError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-error ring-1 ring-error' : 'border-border focus:border-primary'} shadow-sm outline-none transition-all focus:ring-1 focus:ring-primary`}
                placeholder="you@company.com"
              />
              {errors.email && <span className="text-xs text-error mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-error ring-1 ring-error' : 'border-border focus:border-primary'} shadow-sm outline-none transition-all focus:ring-1 focus:ring-primary`}
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-error mt-1 block">{errors.password.message}</span>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Sign In'}
          </button>
          
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
              Request Access
            </Link>
          </p>
        </form>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-light/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
