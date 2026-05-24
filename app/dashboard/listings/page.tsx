'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Listing } from '@/lib/types';
import { Briefcase, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ListingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only PRO and ENTERPRISE can manage listings
    if (user && user.tier === 'BASIC') {
      router.push('/dashboard');
      return;
    }
    fetchListings();
  }, [user, router]);

  const fetchListings = async () => {
    try {
      const response = await api.get('/listings/mine');
      setListings(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, inquiryCount: number) => {
    if (inquiryCount > 0) {
      alert('Cannot delete a listing that has active inquiries.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await api.delete(`/listings/${id}`);
        fetchListings();
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Live</span>;
      case 'PENDING_REVIEW':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Review</span>;
      case 'REJECTED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your product offerings and track performance.</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/dashboard/listings/create')}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Listing
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first product listing.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/dashboard/listings/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((listing: any) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          <div className="text-sm text-gray-500">{listing.commodityType} &bull; {listing.quantityAvailable} {listing.quantityUnit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        {getStatusBadge(listing.status)}
                        {listing.status === 'REJECTED' && listing.rejectedReason && (
                          <span className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={listing.rejectedReason}>
                            Reason: {listing.rejectedReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.priceOnRequest ? 'Price on Request' : `${listing.currency} ${listing.pricePerUnit}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.viewCount} views</div>
                      <div className="text-sm text-gray-500">{listing.inquiryCount} inquiries</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => router.push(`/dashboard/listings/view/${listing.id}`)}
                        className="text-gray-400 hover:text-primary mr-3"
                        title="View insights"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => router.push(`/dashboard/listings/edit/${listing.id}`)}
                        className="text-gray-400 hover:text-blue-600 mr-3"
                        title="Edit listing"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(listing.id, listing.inquiryCount)}
                        className={`w-5 h-5 ${listing.inquiryCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
                        title={listing.inquiryCount > 0 ? 'Cannot delete listing with active inquiries' : 'Delete listing'}
                        disabled={listing.inquiryCount > 0}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
