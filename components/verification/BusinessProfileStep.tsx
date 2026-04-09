"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../lib/api';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  businessName: z.string().min(1, 'Business name is required'),
  sector: z.string().min(1, 'Sector is required'),
  state: z.string().min(1, 'State is required'),
  businessType: z.string().min(1, 'Business type is required'),
  businessDescription: z.string().min(10, 'Description needs to be richer'),
  yearsInOperation: z.coerce.number().int().positive('Must be greater than 0'),
  commodities: z.string().min(1, 'At least 1 commodity is required'),
  cacNumber: z.string().optional(),
  tinNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  onNext: () => void;
}

export default function BusinessProfileStep({ onNext }: Props) {
  const { user } = useAuthStore();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      businessName: '',
      sector: 'Agriculture',
      state: 'Lagos',
      businessType: 'seller',
      businessDescription: '',
      yearsInOperation: 1,
      commodities: 'Cocoa',
      cacNumber: '',
      tinNumber: ''
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setServerError('');
      const p = {
        ...data,
        bio: '',
        email: user?.email || '',
        lga: 'Default LGA',
        annualTurnoverRange: '1-10M',
        employeeCount: '1-10',
        website: 'https://example.com',
        commodities: data.commodities.split(',').map(s => s.trim())
      };
      await api.post('/users/profile', p);
      onNext();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to update profile. Ensure all fields are filled properly.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Profile</h2>
      <p className="text-gray-500 mb-8">This establishes your core business identity on Market-Link.</p>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
            <input type="text" {...register('firstName')} className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-border'} outline-none focus:ring-2 focus:ring-accent`} />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
            <input type="text" {...register('lastName')} className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-border'} outline-none focus:ring-2 focus:ring-accent`} />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
            <input type="text" {...register('businessName')} className={`w-full px-4 py-3 rounded-xl border ${errors.businessName ? 'border-red-500' : 'border-border'} outline-none focus:ring-2 focus:ring-accent`} />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Sector</label>
            <select {...register('sector')} className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent bg-white">
              <option value="Agriculture">Agriculture</option>
              <option value="Energy">Energy</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Logistics">Logistics</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Commmodities (comma separated)</label>
            <input type="text" {...register('commodities')} placeholder="e.g. Cocoa, Wheat, Maize" className={`w-full px-4 py-3 rounded-xl border ${errors.commodities ? 'border-red-500' : 'border-border'} outline-none focus:ring-2 focus:ring-accent`} />
            {errors.commodities && <p className="text-red-500 text-xs mt-1">{errors.commodities.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Business Type</label>
            <select {...register('businessType')} className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent bg-white">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="service_provider">Service Provider</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Business Description</label>
          <textarea {...register('businessDescription')} className={`w-full h-28 resize-none px-4 py-3 rounded-xl border ${errors.businessDescription ? 'border-red-500' : 'border-border'} outline-none focus:ring-2 focus:ring-accent`} placeholder="Briefly describe your history and expertise..."></textarea>
          {errors.businessDescription && <p className="text-red-500 text-xs mt-1">{errors.businessDescription.message}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Operations (Years)</label>
            <input type="number" {...register('yearsInOperation')} className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">CAC Number (Optional)</label>
            <input type="text" {...register('cacNumber')} className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">TIN Number (Optional)</label>
            <input type="text" {...register('tinNumber')} className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center px-8 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
            ) : (
              <>Next Step <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
