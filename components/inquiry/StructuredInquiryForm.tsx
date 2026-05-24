'use client';

import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface StructuredInquiryFormProps {
  sellerId: string;
  listingId?: string;
  onSuccess?: () => void;
}

export function StructuredInquiryForm({ sellerId, listingId, onSuccess }: StructuredInquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    quantityOfInterest: '',
    quantityUnit: 'tonne',
    preferredDelivery: 'negotiable',
    messageContent: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload: any = {
        sellerId,
        quantityOfInterest: formData.quantityOfInterest ? parseFloat(formData.quantityOfInterest) : null,
        quantityUnit: formData.quantityUnit,
        preferredDelivery: formData.preferredDelivery,
        messageContent: formData.messageContent,
      };

      if (listingId) {
        payload.listingId = listingId;
      }

      await api.post('/inquiries', payload);
      setSuccessMsg('Your inquiry has been sent to the seller.');
      setFormData({
        quantityOfInterest: '',
        quantityUnit: 'tonne',
        preferredDelivery: 'negotiable',
        messageContent: '',
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Failed to send inquiry:', err);
      setError(err.response?.data?.message || 'Failed to send inquiry. You may have exceeded your quota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Send an Inquiry</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-3 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-3">
          <p className="text-sm text-green-700">{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="quantityOfInterest" className="block text-sm font-medium text-gray-700">Quantity Needed</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                name="quantityOfInterest"
                id="quantityOfInterest"
                min="0"
                step="0.01"
                required
                value={formData.quantityOfInterest}
                onChange={handleChange}
                className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm p-2 border border-r-0"
              />
              <select
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                className="inline-flex items-center rounded-none rounded-r-md border border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
              >
                <option value="kg">kg</option>
                <option value="tonne">tonne</option>
                <option value="bags">bags</option>
                <option value="litres">litres</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="preferredDelivery" className="block text-sm font-medium text-gray-700">Preferred Delivery Terms</label>
            <select
              id="preferredDelivery"
              name="preferredDelivery"
              required
              value={formData.preferredDelivery}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            >
              <option value="negotiable">Negotiable</option>
              <option value="ex-works">Ex-Works (I will pick up)</option>
              <option value="fob">FOB (Free on Board)</option>
              <option value="ddp">DDP (Delivered Duty Paid)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700">Message (No Contact Details Allowed)</label>
          <textarea
            id="messageContent"
            name="messageContent"
            rows={3}
            required
            value={formData.messageContent}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            placeholder="Specify quality requirements or any specific questions..."
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Inquiry
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
