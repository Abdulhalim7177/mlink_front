import React from 'react';
import { Search, Filter, Calendar, MapPin, Package } from 'lucide-react';
import { UserTier } from '@/lib/types';

interface MarketPulseFiltersProps {
  userTier: UserTier | undefined;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  sector: string[];
  setSector: (v: string[]) => void;
  places: string[];
  setPlaces: (v: string[]) => void;
  onApplyFilters: () => void;
}

const COMMODITIES = ['Cocoa Beans', 'Cashew Nuts', 'Palm Oil', 'Sesame Seeds', 'Ginger'];
const STATES = ['Lagos', 'Ogun', 'Ondo', 'Kano', 'Katsina', 'Oyo', 'Rivers', 'Delta', 'Edo', 'Jigawa', 'Kaduna', 'Plateau', 'Nasarawa'];

export function MarketPulseFilters({
  userTier,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sector,
  setSector,
  places,
  setPlaces,
  onApplyFilters
}: MarketPulseFiltersProps) {
  const isPro = userTier === 'PRO' || userTier === 'ENTERPRISE' || userTier === 'ADMIN';

  if (!isPro) return null;

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold border-b pb-2">
        <Filter className="w-5 h-5 text-primary" />
        Advanced Pro Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date Range */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Date Range
          </label>
          <div className="flex gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Sector / Commodity */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-2 text-gray-400" />
            Sector (Commodities)
          </label>
          <div className="max-h-24 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50 space-y-1">
            {COMMODITIES.map(c => (
              <label key={c} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={sector.includes(c)}
                  onChange={() => toggleSelection(c, sector, setSector)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Places / States */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            Places (States)
          </label>
          <div className="max-h-24 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50 space-y-1">
            {STATES.map(s => (
              <label key={s} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded">
                <input 
                  type="checkbox" 
                  checked={places.includes(s)}
                  onChange={() => toggleSelection(s, places, setPlaces)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                {s}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button 
          onClick={onApplyFilters}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}
