"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { LAUNCH_STATES } from '../../../lib/constants';
import type { AnalyticsFunnelResponse } from '../../../lib/types';
import { BarChart3, Users, MapPin, Loader2, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsFunnelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/analytics/funnel');
        setData(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center py-32">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-500">No Data Available</h3>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    );
  }

  // Calculate max for bar scaling
  const maxCount = Math.max(...Object.values(data.breakdown), 1);
  const totalFromBreakdown = Object.values(data.breakdown).reduce((a, b) => a + b, 0);

  // Color palette for bars
  const barColors = [
    'bg-red-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-red-500" />
          Platform Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time overview of user registrations across launch states.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{data.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Profiled Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{totalFromBreakdown}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Users with a state in their profile</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active States</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {Object.values(data.breakdown).filter((v) => v > 0).length}
                <span className="text-lg text-gray-400 ml-1">/ 10</span>
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <MapPin className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            User Distribution by State
          </h2>
          <span className="text-xs text-gray-400">10 Launch States</span>
        </div>

        <div className="space-y-4">
          {LAUNCH_STATES.map((state, idx) => {
            const count = data.breakdown[state] || 0;
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const barColor = barColors[idx % barColors.length];

            return (
              <div key={state} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-400">
                      ({data.totalUsers > 0 ? ((count / data.totalUsers) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80`}
                    style={{ width: `${Math.max(percentage, count > 0 ? 2 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
