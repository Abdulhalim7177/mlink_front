'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/admin-api';
import { 
  ArrowLeft, Check, X, AlertCircle, Eye, MessageSquare, 
  BarChart3, Package, MapPin, Calendar, CheckCircle
} from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

export default function AdminListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchListing = async () => {
    try {
      const response = await adminApi.get(`/admin/listings/${listingId}`);
      setListing(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch listing:', err);
      setError('Failed to load listing data. It may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await adminApi.post(`/admin/listings/${listingId}/approve`);
      fetchListing(); // Refresh to see updated status
    } catch (error) {
      console.error('Failed to approve listing:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await adminApi.post(`/admin/listings/${listingId}/reject`, { reason: rejectionReason });
      setIsRejecting(false);
      setRejectionReason('');
      fetchListing();
    } catch (error) {
      console.error('Failed to reject listing:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
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
            onClick={() => router.push('/mlink-ctrl-9x4e/listings')}
            className="mt-6"
            variant="outline"
          >
            &larr; Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5" /> Live</span>;
      case 'PENDING_REVIEW':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"><Calendar className="w-3.5 h-3.5 mr-1.5 mt-0.5" /> Pending Review</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

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
            
            {listing.status === 'PENDING_REVIEW' && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleApprove} 
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRejecting(true)}
                  disabled={actionLoading}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full space-y-6">

        {isRejecting && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-bold text-red-800 mb-2">Rejection Reason</h4>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border-red-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm p-3 border mb-3"
              rows={3}
              placeholder="Explain to the seller why this listing is rejected..."
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleReject} 
                disabled={!rejectionReason.trim() || actionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Reject
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsRejecting(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {listing.status === 'REJECTED' && listing.rejectedReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Rejected</h4>
              <p className="text-sm text-red-700 mt-1">Reason: {listing.rejectedReason}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" /> Listing Specifications
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
                    <span className="block text-xs font-medium text-gray-500 uppercase flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> Valid Until</span>
                    <span className="block mt-1 text-sm font-semibold text-gray-900">
                      {listing.validUntil ? new Date(listing.validUntil).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col */}
          <div className="space-y-6">

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900">Seller Details</h3>
              </div>
              <div className="p-6">
                {listing.seller ? (
                  <div className="space-y-3">
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase">Email</span>
                      <span className="block mt-1 text-sm font-semibold text-gray-900">{listing.seller.email}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase">Phone</span>
                      <span className="block mt-1 text-sm font-semibold text-gray-900">{listing.seller.phoneNumber || 'N/A'}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => router.push(`/mlink-ctrl-9x4e/users/${listing.seller.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Seller information not available.</p>
                )}
              </div>
            </div>

            {/* Engagement Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Metrics
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

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
