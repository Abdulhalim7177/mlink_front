'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  ArrowLeft, Building2, MapPin, Package, AlertCircle, MessageSquare
} from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

export default function MarketListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
        setError('Failed to load listing data. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-medium text-gray-900">Listing Not Found</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => router.push('/dashboard/market')}
            className="mt-6"
            variant="outline"
          >
            &larr; Back to Market
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard/market')}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors bg-gray-50 border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Posted on {new Date(listing.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" /> Listing Overview
                </h3>
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
                    <span className="block text-xs font-medium text-gray-500 uppercase">Quantity Available</span>
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
                    <span className="block mt-1 text-xl font-bold text-green-700">
                      {listing.priceOnRequest ? 'Price on Request' : `${listing.currency} ${listing.pricePerUnit?.toLocaleString()}`}
                      {!listing.priceOnRequest && <span className="text-sm font-normal text-gray-500">/{listing.quantityUnit}</span>}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Delivery Terms</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900 uppercase">{listing.deliveryTerms}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> Location</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">
                      {listing.locationState} {listing.locationLga ? `, ${listing.locationLga}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary" /> Seller Profile
                </h3>
              </div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mx-auto mb-3">
                  <Building2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  {listing.seller?.profile?.businessName || listing.seller?.email || 'Unknown Seller'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {listing.seller?.profile?.sector || 'Verified Seller'}
                </p>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                    onClick={() => router.push(`/dashboard/inquiries/new?listingId=${listing.id}&sellerId=${listing.seller?.id}`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Send Inquiry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/network/profile/${listing.seller?.id}`)}
                  >
                    View Full Profile
                  </Button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
