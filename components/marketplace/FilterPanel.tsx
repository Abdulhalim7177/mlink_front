'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMMODITIES, LAUNCH_STATES, SECTORS } from '@/lib/constants';

interface FilterPanelProps {
  filters: {
    sector?: string;
    state?: string;
    commodity?: string;
    businessType?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  onClose,
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className={`${isMobile ? 'h-full' : ''} flex flex-col bg-white`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Sector Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Sector
          </label>
          <select
            value={filters.sector || ''}
            onChange={(e) => onFilterChange('sector', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Sectors</option>
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            value={filters.state || ''}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All States</option>
            {LAUNCH_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Commodity Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Commodity
          </label>
          <select
            value={filters.commodity || ''}
            onChange={(e) => onFilterChange('commodity', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Commodities</option>
            {COMMODITIES.map((commodity) => (
              <option key={commodity} value={commodity}>
                {commodity}
              </option>
            ))}
          </select>
        </div>

        {/* Business Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Business Type
          </label>
          <select
            value={filters.businessType || ''}
            onChange={(e) => onFilterChange('businessType', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Types</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="service_provider">Service Provider</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
