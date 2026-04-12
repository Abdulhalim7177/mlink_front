"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import adminApi from '../../../lib/admin-api';
import {
  ADMIN_BASE_PATH,
  VERIFICATION_STATUS_CONFIG,
  TIER_CONFIG,
} from '../../../lib/constants';
import type { AdminUserListItem, AdminUserListResponse } from '../../../lib/types';
import AdminActionModal from '../../../components/admin/AdminActionModal';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Eye,
  Ban,
  Unlock,
  Shield,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Suspend modal
  const [suspendUserId, setSuspendUserId] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.get(`/admin/users?page=${page}&limit=10`);
      const result = res.data.data as AdminUserListResponse;
      setUsers(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (reason: string) => {
    if (!suspendUserId) return;
    await adminApi.post(`/admin/users/${suspendUserId}/suspend`, { reason });
    setSuspendUserId(null);
    fetchUsers(pagination.page);
  };

  const handleUnsuspend = async (userId: string) => {
    try {
      await adminApi.post(`/admin/users/${userId}/unsuspend`);
      fetchUsers(pagination.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unsuspend user.');
    }
  };

  // Client-side search filter
  const filteredUsers = searchTerm
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.profile?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-3 text-red-500" />
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} total registered users
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 text-sm transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-500">No Users Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Docs</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const statusConf = VERIFICATION_STATUS_CONFIG[user.verificationStatus] || {
                    label: user.verificationStatus,
                    color: 'text-gray-700',
                    bg: 'bg-gray-50',
                  };
                  const tierConf = TIER_CONFIG[user.tier] || TIER_CONFIG.FREE;
                  const isSuspended = user.verificationStatus === 'SUSPENDED';

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                          {user.phoneNumber && (
                            <p className="text-xs text-gray-400">{user.phoneNumber}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${statusConf.color} ${statusConf.bg}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${tierConf.color} ${tierConf.bg}`}>
                          {tierConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.documents.length} file{user.documents.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`${ADMIN_BASE_PATH}/queue/${user.id}`}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {isSuspended ? (
                            <button
                              onClick={() => handleUnsuspend(user.id)}
                              className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Unsuspend"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setSuspendUserId(user.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Suspend"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend Modal */}
      <AdminActionModal
        title="Suspend User"
        description="This will suspend the user's account immediately. They will be unable to access the platform until unsuspended."
        confirmLabel="Suspend Account"
        inputLabel="Suspension Reason"
        inputPlaceholder="e.g. Fraudulent activity detected..."
        isOpen={!!suspendUserId}
        onClose={() => setSuspendUserId(null)}
        onConfirm={handleSuspend}
      />
    </div>
  );
}
