'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { ArrowLeft, MapPin, Package, ShieldCheck, Briefcase } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StructuredInquiryForm } from '@/components/inquiry/StructuredInquiryForm';
import { Listing } from '@/lib/types';
import { TierBadge } from '@/components/shared/TierBadge';

export default function BusinessProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const resolvedParams = use(params);
  const sellerId = resolvedParams.id;
  
  const [business, setBusiness] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchBusinessDetails();
  }, [sellerId]);

  const fetchBusinessDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch Business Profile
      const profileRes = await api.get(`/users/${sellerId}/profile`);
      setBusiness(profileRes.data.data);
      
      // 2. Fetch Active Listings for this seller
      const listingsRes = await api.get('/listings/search', {
        params: { sellerId, limit: 50 }
      });
      setListings(listingsRes.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch business details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500">Business not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{business.businessName}</h2>
                  <p className="text-gray-600 mt-1">{business.sector}</p>
                </div>
                {business.badgeLevel > 0 && (
                  <span className="flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {business.lga ? `${business.lga}, ${business.state}` : business.state}
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  {business.tier} Tier
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900">About</h3>
                <p className="mt-2 text-sm text-gray-600">{business.bio || 'No description provided.'}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900">Commodities Traded</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {business.commodities?.map((c: string) => (
                    <span key={c} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Listings Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Active Listings</h3>
              {listings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                  This business has no active listings.
                </div>
              ) : (
                <div className="space-y-4">
                  {listings.map(listing => (
                    <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-md font-semibold text-gray-900">{listing.title}</h4>
                          <span className="text-sm font-bold text-primary">
                            {listing.priceOnRequest ? 'Price on Request' : `${listing.currency} ${listing.pricePerUnit}`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description}</p>
                        <div className="mt-3 flex gap-3 text-xs text-gray-500">
                          <span>Qty: {listing.quantityAvailable} {listing.quantityUnit}</span>
                          <span>&bull;</span>
                          <span>Delivery: {listing.deliveryTerms?.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex items-end sm:items-center">
                        <button
                          onClick={() => setSelectedListing(listing.id)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedListing === listing.id 
                            ? 'bg-primary text-white border-primary' 
                            : 'border-primary text-primary hover:bg-primary/5'
                          }`}
                        >
                          {selectedListing === listing.id ? 'Selected' : 'Inquire'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <StructuredInquiryForm 
                sellerId={sellerId} 
                listingId={selectedListing} 
                onSuccess={() => {
                  setSelectedListing(undefined);
                }} 
              />
              {selectedListing && (
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setSelectedListing(undefined)} className="text-sm text-gray-500 hover:text-gray-700">
                    Clear selected listing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
