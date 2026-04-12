"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import adminApi from '../../../lib/admin-api';
import type { AdminUser, AdminDepartment } from '../../../lib/types';
import { Shield, Settings, UserPlus, Trash2, Edit2, Loader2, CheckCircle2 } from 'lucide-react';
import { useAdminAuthStore } from '../../../store/admin-auth.store';

const DEPARTMENTS: { label: string; value: AdminDepartment }[] = [
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Verification (KYC)', value: 'VERIFICATION' },
  { label: 'Customer Service', value: 'CUSTOMER_SERVICE' },
  { label: 'Finance', value: 'FINANCE' },
  { label: 'Analytics', value: 'ANALYTICS' },
];

const adminSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  department: z.enum(['SUPER_ADMIN', 'VERIFICATION', 'CUSTOMER_SERVICE', 'FINANCE', 'ANALYTICS'] as const),
  password: z.string().optional(),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function AdminManagementPage() {
  const { admin: currentAdmin } = useAdminAuthStore();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: { department: 'VERIFICATION' }
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/admin/admins');
      setAdmins(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admin list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    reset({ email: '', firstName: '', lastName: '', department: 'VERIFICATION', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    reset({
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      department: admin.department,
      password: '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: AdminFormData) => {
    setActionLoading(true);
    setError('');
    try {
      if (editingAdmin) {
        await adminApi.put(`/admin/admins/${editingAdmin.id}`, data);
      } else {
        await adminApi.post('/admin/admins', data);
      }
      setIsModalOpen(false);
      fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save admin.');
    } finally {
      setActionLoading(false);
    }
  };

  const deactivateAdmin = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this admin account?')) {
      try {
        await adminApi.delete(`/admin/admins/${id}`);
        fetchAdmins();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to deactivate admin.');
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-red-500" />
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage administrative access and department assignments.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Administrator
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Administrator</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold shrink-0">
                          {adm.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{adm.firstName} {adm.lastName}</p>
                          <p className="text-xs text-gray-500">{adm.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold whitespace-nowrap">
                        {adm.department.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {adm.isActive ? (
                        <span className="flex items-center text-emerald-600 font-medium text-xs">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium text-xs border border-red-200 bg-red-50 px-2.5 py-1 rounded-md inline-block">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(adm)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Edit Admin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {adm.id !== currentAdmin?.id && adm.isActive && (
                        <button
                          onClick={() => deactivateAdmin(adm.id)}
                          className="text-red-500 hover:text-red-700 p-2 ml-2"
                          title="Deactivate Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAdmin ? 'Edit Administrator' : 'Create Administrator'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to assign roles.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">First Name</label>
                  <input
                    {...register('firstName')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium"
                  />
                  {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input
                    {...register('lastName')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium"
                  />
                  {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  disabled={!!editingAdmin}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Department Head</label>
                <select
                  {...register('department')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-bold bg-white"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                {errors.department && <span className="text-xs text-red-500">{errors.department.message}</span>}
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Password</label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Leave empty for 'password123'"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm"
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
