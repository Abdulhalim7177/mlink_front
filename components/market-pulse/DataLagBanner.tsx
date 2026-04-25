'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataLagBannerProps {
  dataLag: string;
  onUpgrade: () => void;
}

export function DataLagBanner({ dataLag, onUpgrade }: DataLagBannerProps) {
  if (dataLag === 'live') {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900">
            You're viewing {dataLag} old prices
          </h3>
          <p className="mt-1 text-sm text-amber-700">
            Upgrade to Beta or Premium to access live market prices and stay ahead of the market.
          </p>
        </div>
        <Button
          onClick={onUpgrade}
          size="sm"
          className="flex-shrink-0 bg-amber-600 hover:bg-amber-700"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}
