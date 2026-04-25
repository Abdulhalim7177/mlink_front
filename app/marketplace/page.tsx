'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BusinessCard } from '@/components/marketplace/BusinessCard';
import { FilterPanel } from '@/components/marketplace/FilterPanel';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore } from '@/store/auth.store';

export default function MarketplacePage() {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    sector: '',
    state: '',
    commodity: '',
    businessType: '',
  });

  useEffect(() => {
    fetchBusinesses();
  }, [filters]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/users/directory', { params: { ...filters, search: searchQuery } });
      // setBusinesses(response.data.data.users);
      
      // Mock data for now
      setTimeout(() => {
        setBusinesses([
          {
            id: '1',
            businessName: 'Agro Farms Ltd',
            sector: 'Agriculture',
            state: 'Lagos',
            lga: 'Ikeja',
            commodities: ['Cocoa', 'Cashew Nuts', 'Palm Oil'],
            badgeLevel: 2,
            tier: 'BETA_SELLER',
            contactHidden: user?.tier === 'FREE',
          },
          {
            id: '2',
            businessName: 'Global Trade Corp',
            sector: 'Agriculture',
            state: 'Kano',
            commodities: ['Sesame Seeds', 'Groundnuts'],
            badgeLevel: 3,
            tier: 'PREMIUM',
            contactHidden: user?.tier === 'FREE',
          },
          {
            id: '3',
            businessName: 'Green Valley Exports',
            sector: 'Agriculture',
            state: 'Ogun',
            lga: 'Abeokuta',
            commodities: ['Ginger', 'Hibiscus (Zobo)'],
            badgeLevel: 1,
            tier: 'BETA_BUYER',
            contactHidden: user?.tier === 'FREE',
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      sector: '',
      state: '',
      commodity: '',
      businessType: '',
    });
  };

  const handleSearch = () => {
    fetchBusinesses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Business Directory</h1>
          <p className="mt-1 text-sm text-gray-600">
            Discover verified businesses across Nigeria
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Desktop Filters */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-6 rounded-lg border border-gray-200 bg-white">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Business Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : businesses.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                title="No businesses found"
                description="Try adjusting your filters or search query"
                action={{
                  label: 'Clear Filters',
                  onClick: handleClearFilters,
                }}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    {...business}
                    viewerTier={user?.tier || 'FREE'}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMobile
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
