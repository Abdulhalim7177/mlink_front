'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, SlidersHorizontal, Package, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import api from '@/lib/api';

export default function ActiveListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');

  // Example basic filter states
  const commoditiesList = [
    'Cocoa', 'Sesame Seeds', 'Cashew Nuts', 'Sorghum', 
    'Ginger', 'Shea Butter', 'Cassava', 'Maize', 'Soybeans'
  ];

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/listings/search', {
        params: {
          searchTerm: debouncedSearchQuery,
          commodityType: commodityFilter,
          limit: 30,
        },
      });
      setListings(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, commodityFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = () => {
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Commodity Market
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse active listings from verified sellers across Nigeria.
              </p>
            </div>
            
            <div className="flex gap-3 flex-1 md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search commodities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-primary h-10"
                />
              </div>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={commodityFilter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCommodityFilter('')}
              className="rounded-full shrink-0"
            >
              All Commodities
            </Button>
            {commoditiesList.map(cmd => (
              <Button
                key={cmd}
                variant={commodityFilter === cmd ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCommodityFilter(cmd === commodityFilter ? '' : cmd)}
                className="rounded-full shrink-0"
              >
                {cmd}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 mt-8">
            <EmptyState
              icon={<Package className="h-12 w-12 text-gray-300" />}
              title="No active listings found"
              description="There are currently no listings matching your search criteria."
              action={{
                label: 'Clear Filters',
                onClick: () => {
                  setSearchQuery('');
                  setCommodityFilter('');
                },
              }}
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full cursor-pointer"
                onClick={() => router.push(`/dashboard/market/${listing.id}`)}
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {listing.commodityType}
                    </span>
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                      {listing.quantityAvailable} {listing.quantityUnit}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {listing.locationState} {listing.locationLga ? `, ${listing.locationLga}` : ''}
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4 bg-gray-50/50 flex flex-col gap-3">
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price</span>
                    <span className="text-lg font-bold text-gray-900">
                      {listing.priceOnRequest ? 'Price on Request' : `${listing.currency} ${listing.pricePerUnit?.toLocaleString()}`}
                      {!listing.priceOnRequest && <span className="text-sm font-normal text-gray-500">/{listing.quantityUnit}</span>}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div 
                      className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 rounded-lg transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to business profile
                        if (listing.seller?.id) {
                          router.push(`/dashboard/marketplace/${listing.seller.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                            {listing.seller?.profile?.businessName || listing.seller?.email || 'Unknown Seller'}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {listing.seller?.profile?.sector || 'Verified Seller'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
