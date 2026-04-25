'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { PriceTable } from '@/components/market-pulse/PriceTable';
import { DataLagBanner } from '@/components/market-pulse/DataLagBanner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export default function MarketPulsePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLag, setDataLag] = useState('7 days');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/market-pulse/prices');
      // setPrices(response.data.data.prices);
      // setDataLag(response.data.data.dataLag);

      // Mock data for now
      setTimeout(() => {
        const mockPrices = [
          {
            id: '1',
            commodity: 'Cocoa Beans',
            state: 'Lagos',
            price: 280000,
            unit: 'per tonne',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            change: 2.3,
          },
          {
            id: '2',
            commodity: 'Cashew Nuts',
            state: 'Kano',
            price: 450000,
            unit: 'per tonne',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            change: -1.8,
          },
          {
            id: '3',
            commodity: 'Palm Oil',
            state: 'Rivers',
            price: 120000,
            unit: 'per tonne',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            change: 5.2,
          },
          {
            id: '4',
            commodity: 'Sesame Seeds',
            state: 'Katsina',
            price: 380000,
            unit: 'per tonne',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            change: 0.5,
          },
          {
            id: '5',
            commodity: 'Ginger',
            state: 'Kaduna',
            price: 220000,
            unit: 'per tonne',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            change: -3.1,
          },
        ];
        setPrices(mockPrices);
        setDataLag(user?.tier === 'FREE' ? '7 days' : 'live');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/subscription');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Data Lag Banner */}
          <DataLagBanner dataLag={dataLag} onUpgrade={handleUpgrade} />

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
              {user?.tier === 'FREE'
                ? ' Free tier users see prices from 7 days ago. Upgrade to Beta or Premium for live prices.'
                : ' You have access to live market prices.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
