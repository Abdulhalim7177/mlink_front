"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth.store';
import { Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard'); // or standard protected route
    }
  }, [isAuthenticated, router]);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setServerError('');
      // Hits POST /auth/register
      await api.post('/auth/register', data);
      
      setSuccess(true);
      // Wait a moment then redirect to OTP verification screen 
      setTimeout(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      if (message.toLowerCase().includes('phone number')) {
        setError('phoneNumber', { type: 'server', message });
      } else if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message });
      } else {
        setServerError(message);
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-text-primary">Account Created!</h2>
          <p className="text-text-secondary">We've sent an OTP to your email. Redirecting you to verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-lg w-full space-y-8 glass-card p-10 rounded-2xl z-10 border border-border/60 fade-in-up">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg mb-4">
            <Globe className="w-8 h-8 text-white" />
          </Link>
          <h2 className="text-3xl font-heading font-extrabold text-text-primary tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Join the verified B2B trading network
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="bg-error/10 border border-error/20 p-4 rounded-lg flex items-center text-error text-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{serverError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">First Name</label>
              <input
                {...register('firstName')}
                className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-error' : 'border-border focus:border-primary'} shadow-sm outline-none transition-all focus:ring-1 focus:ring-primary`}
                placeholder="John"
              />
              {errors.firstName && <span className="text-xs text-error mt-1 block">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Last Name</label>
              <input
                {...register('lastName')}
                className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-error' : 'border-border focus:border-primary'} shadow-sm outline-none transition-all focus:ring-1 focus:ring-primary`}
                placeholder="Doe"
              />
              {errors.lastName && <span className="text-xs text-error mt-1 block">{errors.lastName.message}</span>}
            </div>
          </div>

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
            <label className="block text-sm font-medium text-text-primary mb-1">Phone Number</label>
            <input
              {...register('phoneNumber')}
              type="tel"
              className={`w-full px-4 py-3 rounded-xl border ${errors.phoneNumber ? 'border-error ring-1 ring-error' : 'border-border focus:border-primary'} shadow-sm outline-none transition-all focus:ring-1 focus:ring-primary`}
              placeholder="+234..."
            />
            {errors.phoneNumber && <span className="text-xs text-error mt-1 block">{errors.phoneNumber.message}</span>}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
          
          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
              Sign In
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
