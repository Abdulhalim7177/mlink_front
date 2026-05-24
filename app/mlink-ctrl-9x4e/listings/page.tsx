'use client';

import { useState, useEffect } from 'react';
import { Package, Check, X, Search, ChevronRight } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/listings/pending');
      setListings(res.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await adminApi.post(`/admin/listings/${id}/approve`);
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error('Failed to approve listing:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await adminApi.post(`/admin/listings/${id}/reject`, { reason: rejectionReason });
      setIsRejecting(false);
      setRejectionReason('');
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error('Failed to reject listing:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings Moderation</h1>
          <p className="text-gray-500 mt-1">Review and approve or reject pending marketplace listings.</p>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md relative">
            <button 
              onClick={() => { setSelectedListing(null); setIsRejecting(false); setRejectionReason(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Quick View</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                <p className="text-sm text-gray-900">{selectedListing.title}</p>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Description (Snippet)</label>
                <p className="text-sm text-gray-900 line-clamp-3">{selectedListing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Price</label>
                  <p className="text-sm text-gray-900 font-medium">
                    {selectedListing.priceOnRequest ? 'Price on Request' : `${selectedListing.currency} ${selectedListing.pricePerUnit}`}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Quantity</label>
                  <p className="text-sm text-gray-900">
                    {selectedListing.quantityAvailable} {selectedListing.quantityUnit}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-2">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{selectedListing.viewCount}</span> Views
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{selectedListing.inquiryCount}</span> Inquiries
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                {!isRejecting ? (
                  <>
                    <Button 
                      onClick={() => handleApprove(selectedListing.id)} 
                      disabled={actionLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve Listing
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRejecting(true)}
                      disabled={actionLoading}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject Listing
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Reason for Rejection</label>
                    <textarea 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm p-2 border"
                      rows={3}
                      placeholder="Please explain why this listing is being rejected..."
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleReject(selectedListing.id)} 
                        disabled={!rejectionReason.trim() || actionLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700"
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              icon={<Package className="w-10 h-10 text-gray-400" />} 
              title="No Pending Listings" 
              description="There are currently no listings awaiting review." 
            />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing Info</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commodity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Qty</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.map(listing => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => router.push(`/mlink-ctrl-9x4e/listings/${listing.id}`)}
                  >
                    <div className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors">{listing.title}</div>
                    <div className="text-xs text-gray-500 mt-1">Seller: {listing.seller?.email || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{listing.commodityType}</div>
                    <div className="text-xs text-gray-500">{listing.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {listing.priceOnRequest ? 'Price on Request' : `${listing.currency} ${listing.pricePerUnit}`}
                    </div>
                    <div className="text-xs text-gray-500">{listing.quantityAvailable} {listing.quantityUnit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListing(listing);
                          setIsRejecting(false);
                          setRejectionReason('');
                        }}
                      >
                        Quick View
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(listing.id);
                        }}
                        disabled={actionLoading}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListing(listing);
                          setIsRejecting(true);
                          setRejectionReason('');
                        }}
                        disabled={actionLoading}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
