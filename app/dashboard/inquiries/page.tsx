'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { Inquiry } from '@/lib/types';
import { MessageSquare, Inbox, Send, Eye, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function InquiriesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries(activeTab);
  }, [activeTab]);

  const fetchInquiries = async (type: 'received' | 'sent') => {
    setLoading(true);
    try {
      const role = type === 'received' ? 'seller' : 'buyer';
      const response = await api.get(`/inquiries?role=${role}`);
      // The backend returns it directly in response.data.data
      setInquiries(response.data.data || []);
    } catch (error) {
      console.error(`Failed to fetch ${type} inquiries:`, error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      // Refresh list
      fetchInquiries(activeTab);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">New</span>;
      case 'VIEWED':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Viewed</span>;
      case 'RESPONDED':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Responded</span>;
      case 'DEAL_INITIATED':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Deal Initiated</span>;
      case 'CLOSED':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Closed</span>;
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your business communications and negotiations.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('received')}
              className={`
                ${activeTab === 'received'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              <Inbox className={`mr-2 h-5 w-5 ${activeTab === 'received' ? 'text-primary' : 'text-gray-400'}`} />
              Received Inquiries
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`
                ${activeTab === 'sent'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              <Send className={`mr-2 h-5 w-5 ${activeTab === 'sent' ? 'text-primary' : 'text-gray-400'}`} />
              Sent Inquiries
            </button>
          </nav>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} inquiries</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'received' 
                ? "You haven't received any inquiries from buyers yet." 
                : "You haven't sent any inquiries to sellers yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activeTab === 'received' 
                        ? `From: ${inquiry.buyer?.profile?.businessName || inquiry.buyer?.email}` 
                        : `To: ${inquiry.seller?.profile?.businessName || inquiry.seller?.email}`}
                    </h3>
                    {getStatusBadge(inquiry.status)}
                  </div>
                  
                  {inquiry.listing && (
                    <div className="mb-3 text-sm font-medium text-primary bg-primary/5 px-3 py-1.5 rounded inline-block">
                      Re: {inquiry.listing.title}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div>
                      <span className="text-gray-500 block text-xs">Quantity Needed</span>
                      <span className="font-medium text-gray-900">{inquiry.quantityOfInterest} {inquiry.quantityUnit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Delivery Terms</span>
                      <span className="font-medium text-gray-900 capitalize">{inquiry.preferredDelivery}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-xs mb-1">Message</span>
                    <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100 whitespace-pre-wrap">
                      {inquiry.messageContent}
                    </p>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400">
                    Sent on {new Date(inquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  {activeTab === 'received' && inquiry.status === 'SENT' && (
                    <button 
                      onClick={() => updateStatus(inquiry.id, 'VIEWED')}
                      className="flex items-center justify-center w-full px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Mark Viewed
                    </button>
                  )}
                  {activeTab === 'received' && inquiry.status !== 'CLOSED' && (
                    <>
                      {inquiry.status !== 'RESPONDED' && inquiry.status !== 'DEAL_INITIATED' && (
                        <button 
                          onClick={() => updateStatus(inquiry.id, 'RESPONDED')}
                          className="flex items-center justify-center w-full px-3 py-2 bg-primary text-white hover:bg-primary-dark rounded-md text-sm font-medium transition-colors mt-2"
                        >
                          Mark Responded
                        </button>
                      )}
                      {inquiry.status !== 'DEAL_INITIATED' && (
                        <button 
                          onClick={() => updateStatus(inquiry.id, 'DEAL_INITIATED')}
                          className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors mt-2"
                        >
                          Initiate Deal
                        </button>
                      )}
                      <button 
                        onClick={() => updateStatus(inquiry.id, 'CLOSED')}
                        className="flex items-center justify-center w-full px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors mt-2"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
