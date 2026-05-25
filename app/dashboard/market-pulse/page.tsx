'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { PriceTable } from '@/components/market-pulse/PriceTable';
import { DataLagBanner } from '@/components/market-pulse/DataLagBanner';
import { MarketPulseFilters } from '@/components/market-pulse/MarketPulseFilters';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function MarketPulsePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLag, setDataLag] = useState('7 days');

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [places, setPlaces] = useState<string[]>([]);
  const [sector, setSector] = useState<string[]>([]);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (places.length > 0) params.append('places', places.join(','));
      if (sector.length > 0) params.append('sector', sector.join(','));

      const response = await api.get(`/market-pulse/prices?${params.toString()}`);
      setPrices(response.data.data.prices || []);
      setDataLag(response.data.data.dataLag || '7 days');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setPrices([]);
      setDataLag('7 days');
      setLoading(false);
    }
  }, [startDate, endDate, places, sector]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleUpgrade = () => {
    router.push('/subscription');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Market Pulse</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Real-time commodity prices across Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="space-y-6">
          {/* Data Lag Banner */}
          <DataLagBanner dataLag={dataLag} onUpgrade={handleUpgrade} />

          {/* Pro Filters */}
          <MarketPulseFilters 
            userTier={user?.tier}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            sector={sector}
            setSector={setSector}
            places={places}
            setPlaces={setPlaces}
            onApplyFilters={fetchPrices}
          />

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-600">Total Commodities</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{prices.length}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-600">States Covered</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {new Set(prices.map((p) => p.state)).size}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-600">Data Freshness</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {dataLag === 'live' ? 'Live' : '7 Days'}
              </p>
            </div>
          </div>

          {/* Price Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <PriceTable prices={prices} />
          )}

          {/* Info Card */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-sm font-semibold text-blue-900">About Market Pulse</h3>
            <p className="mt-1 text-sm text-blue-700">
              Market Pulse provides commodity price data from verified sources across Nigeria.
              {user?.tier === 'BASIC'
                ? ' Basic plan users see prices from 7 days ago. Upgrade to Pro or Enterprise for live prices.'
                : ' You have access to live market prices.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
