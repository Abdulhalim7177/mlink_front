'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface Price {
  id: string;
  commodity: string;
  state: string;
  price: number;
  unit: string;
  createdAt: string;
  change?: number;
}

interface PriceTableProps {
  prices: Price[];
}

export function PriceTable({ prices }: PriceTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full min-w-[640px]">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Commodity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              State
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Unit
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
              Change
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {prices.map((price) => (
            <tr key={price.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {price.commodity}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{price.state}</td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                {formatPrice(price.price)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{price.unit}</td>
              <td className="px-4 py-3 text-right">
                {price.change !== undefined && price.change !== 0 ? (
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      price.change > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {price.change > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(price.change).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {formatDate(price.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
