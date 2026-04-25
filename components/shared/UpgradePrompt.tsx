'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
  requiredTier?: string;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  feature,
  description,
  requiredTier = 'Beta',
}: UpgradePromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-4">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Upgrade to {requiredTier}
          </h2>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-gray-700">
            {feature} is a {requiredTier} feature
          </p>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">
            {requiredTier} Benefits:
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Live market prices</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Full contact details</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Direct messaging</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>AI-powered matchmaking</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              // Navigate to subscription page
              window.location.href = '/subscription';
            }}
            className="flex-1"
          >
            Upgrade Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
