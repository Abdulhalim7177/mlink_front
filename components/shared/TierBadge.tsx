import { TIER_CONFIG } from '@/lib/constants';
import type { UserTier } from '@/lib/types';

interface TierBadgeProps {
  tier: UserTier;
  className?: string;
}

export function TierBadge({ tier, className = '' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}
