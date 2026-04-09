"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth.store';
import { Globe, Loader2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }).regex(/^\d+$/, 'Must contain only numbers'),
});

type OtpSchema = z.infer<typeof otpSchema>;

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [serverError, setServerError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
  });

  // Automatically kick user back to register if they navigate here manually without an email query param
  useEffect(() => {
    if (!emailParam) {
      router.replace('/auth/register');
    }
  }, [emailParam, router]);

  const onSubmit = async (data: OtpSchema) => {
    try {
      setServerError('');
      const payload = {
        email: emailParam,
        otp: data.otp
      };
      
      const response = await api.post('/auth/verify-otp', payload);
      
      // If the API returns accessToken locally based on verification completion
      if (response.data.data?.accessToken && response.data.data?.user) {
         setCredentials(response.data.data.user, response.data.data.accessToken);
         router.push('/dashboard');
      } else {
         // Fallback just in case they need to log in manually afterward
         router.push('/auth/login?verified=true');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      if (message.toLowerCase().includes('otp') || message.toLowerCase().includes('code')) {
        setError('otp', { type: 'server', message });
      } else {
        setServerError(message);
      }
    }
  };

  if (!emailParam) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-2xl z-10 border border-border/60 fade-in-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-light shadow-lg mb-4">
            <KeyRound className="w-8 h-8 text-primary-dark" />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-text-primary tracking-tight">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            We've sent a 6-digit code to <br/> <strong className="text-primary">{emailParam}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="bg-error/10 border border-error/20 p-4 rounded-lg flex items-center text-error text-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{serverError}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2 text-center">Enter Security Code</label>
            <input
              {...register('otp')}
              type="text"
              maxLength={6}
              className={`w-full px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] rounded-xl border ${errors.otp ? 'border-error ring-1 ring-error' : 'border-border focus:border-primary'} shadow-sm outline-none transition-all focus:ring-2 focus:ring-primary`}
              placeholder="••••••"
              autoComplete="one-time-code"
            />
            {errors.otp && <span className="text-center text-xs text-error mt-2 block">{errors.otp.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" /> 
            ) : (
              <>Verify & Continue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
          
          <div className="text-center text-sm text-text-secondary mt-6">
            Didn't receive the code?{' '}
            <button type="button" className="font-bold text-primary hover:text-primary-dark transition-colors">
              Resend OTP
            </button>
          </div>
        </form>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

// Wrapping in suspense boundary as required by Next.js useSearchParams
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
