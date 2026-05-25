'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  ArrowLeft, Eye, MessageSquare, BarChart3, Clock, 
  MapPin, CheckCircle, AlertCircle, Trash2, Edit 
} from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ViewListingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${listingId}`);
        setListing(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch listing:', err);
        setError('Failed to load listing data. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-medium text-gray-900">Listing Not Found</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button 
            onClick={() => router.push('/dashboard/listings')}
            className="mt-6 text-primary hover:text-primary-dark font-medium text-sm"
          >
            &larr; Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5" /> Live</span>;
      case 'PENDING_REVIEW':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3.5 h-3.5 mr-1.5 mt-0.5" /> Pending Review</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const conversionRate = listing.viewCount > 0 
    ? Math.round((listing.inquiryCount / listing.viewCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors bg-gray-50 border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                  {getStatusBadge(listing.status)}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Created on {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/dashboard/listings/edit/${listing.id}`)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full space-y-6">

        {listing.status === 'REJECTED' && listing.rejectedReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Rejection Reason</h4>
              <p className="text-sm text-red-700 mt-1">{listing.rejectedReason}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900">Listing Details</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Commodity Type</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">{listing.commodityType}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Category</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">{listing.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Total Quantity</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">{listing.quantityAvailable} {listing.quantityUnit}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Min. Order</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">
                      {listing.minimumOrder ? `${listing.minimumOrder} ${listing.quantityUnit}` : 'No minimum'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Price</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900 text-green-700">
                      {listing.priceOnRequest ? 'Price on Request' : `${listing.currency} ${listing.pricePerUnit} / ${listing.quantityUnit}`}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Delivery Terms</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900 uppercase">{listing.deliveryTerms}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> Location</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">
                      {listing.locationState} {listing.locationLga ? `, ${listing.locationLga}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Valid Until</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">
                      {listing.validUntil ? new Date(listing.validUntil).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Insights (Right Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Performance Insights
                </h3>
              </div>
              <div className="p-6 space-y-6">
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-medium text-blue-800">Total Views</span>
                    <span className="block text-2xl font-bold text-blue-900 mt-1">{listing.viewCount}</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-medium text-purple-800">Inquiries Received</span>
                    <span className="block text-2xl font-bold text-purple-900 mt-1">{listing.inquiryCount}</span>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-bold text-gray-900">{conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(conversionRate, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Percentage of viewers who sent an inquiry.</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
