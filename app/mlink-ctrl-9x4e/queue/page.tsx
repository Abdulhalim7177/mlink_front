"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import adminApi from '../../../lib/admin-api';
import { ADMIN_BASE_PATH, VERIFICATION_STATUS_CONFIG } from '../../../lib/constants';
import type { AdminQueueItem, AdminQueueResponse } from '../../../lib/types';
import {
  ClipboardCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  Users,
  Clock,
  FileText,
} from 'lucide-react';

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<AdminQueueItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQueue = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.get(`/admin/queue?page=${page}&limit=10`);
      const result: AdminQueueResponse = res.data.data;
      setQueue(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ClipboardCheck className="w-6 h-6 mr-3 text-red-500" />
          Verification Queue
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Users awaiting KYC document review. SLA target: 24 hours.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{meta.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Breached</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {queue.filter((q) => q.isSLABreached).length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Page</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {meta.page} <span className="text-lg text-gray-400">/ {meta.totalPages || 1}</span>
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <FileText className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
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
        ) : queue.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-500">Queue is Empty</h3>
            <p className="text-sm text-gray-400 mt-1">No users are currently awaiting verification.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Docs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Wait Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {item.profile?.firstName} {item.profile?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">
                        {item.profile?.businessName || '—'}
                      </p>
                      <p className="text-xs text-gray-400">{item.profile?.sector || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        {item.documents.length} files
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {item.timeInQueue}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.isSLABreached ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Breached
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          On Track
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`${ADMIN_BASE_PATH}/queue/${item.id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchQueue(meta.page - 1)}
                disabled={meta.page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchQueue(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
