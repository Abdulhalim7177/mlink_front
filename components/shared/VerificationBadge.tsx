import { VERIFICATION_STATUS_CONFIG } from '@/lib/constants';
import type { VerificationStatus } from '@/lib/types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className = '' }: VerificationBadgeProps) {
  const config = VERIFICATION_STATUS_CONFIG[status];

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
