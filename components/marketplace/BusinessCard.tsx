'use client';

import { useState } from 'react';
import { MapPin, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TierBadge } from '@/components/shared/TierBadge';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import type { UserTier } from '@/lib/types';

interface BusinessCardProps {
  id: string;
  businessName: string;
  sector: string;
  state: string;
  lga?: string;
  commodities: string[];
  badgeLevel: number;
  tier: UserTier;
  contactHidden: boolean;
  viewerTier: UserTier;
}

export function BusinessCard({
  id,
  businessName,
  sector,
  state,
  lga,
  commodities,
  badgeLevel,
  tier,
  contactHidden,
  viewerTier,
}: BusinessCardProps) {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleContactClick = () => {
    if (contactHidden) {
      setShowUpgradePrompt(true);
    } else {
      // Navigate to profile or open contact modal
      window.location.href = `/marketplace/${id}`;
    }
  };

  const getBadgeColor = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 2:
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 1:
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getBadgeLabel = (level: number) => {
    switch (level) {
      case 3:
        return 'Premium Verified';
      case 2:
        return 'Verified';
      case 1:
        return 'Basic';
      default:
        return 'New';
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="p-4">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-1">
                {businessName}
              </h3>
              <p className="text-sm text-gray-600">{sector}</p>
            </div>
            {badgeLevel > 0 && (
              <span
                className={`ml-2 flex-shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${getBadgeColor(
                  badgeLevel
                )}`}
              >
                {getBadgeLabel(badgeLevel)}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {lga ? `${lga}, ${state}` : state}
            </span>
          </div>

          {/* Commodities */}
          {commodities.length > 0 && (
            <div className="mb-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Package className="h-3.5 w-3.5" />
                <span>Commodities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {commodities.slice(0, 3).map((commodity, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                  >
                    {commodity}
                  </span>
                ))}
                {commodities.length > 3 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    +{commodities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tier Badge */}
          <div className="mb-3">
            <TierBadge tier={tier} />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleContactClick}
            variant={contactHidden ? 'outline' : 'default'}
            className="w-full"
            size="sm"
          >
            {contactHidden ? 'View Details (Upgrade Required)' : 'View Profile'}
          </Button>
        </div>
      </Card>

      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="Contact Details"
        description="Upgrade to Beta or Premium to view full contact information and connect with businesses."
        requiredTier="Beta"
      />
    </>
  );
}
