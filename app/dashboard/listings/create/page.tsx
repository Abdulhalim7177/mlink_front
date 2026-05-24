'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    commodityType: '',
    category: '',
    description: '',
    quantityAvailable: '',
    quantityUnit: 'tonne',
    pricePerUnit: '',
    currency: 'NGN',
    priceOnRequest: false,
    minimumOrder: '',
    deliveryTerms: 'negotiable',
    qualityGrade: '',
    locationState: '',
    locationLga: '',
    validUntil: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        quantityAvailable: parseFloat(formData.quantityAvailable),
        pricePerUnit: formData.priceOnRequest ? null : parseFloat(formData.pricePerUnit),
        minimumOrder: formData.minimumOrder ? parseFloat(formData.minimumOrder) : null,
        // Mock photo keys for now since S3 upload is a separate flow
        photoS3Keys: [],
        certifications: []
      };
      
      await api.post('/listings', payload);
      router.push('/dashboard/listings');
    } catch (err: any) {
      console.error('Failed to create listing:', err);
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
            <p className="mt-1 text-sm text-gray-600">List your products for buyers to discover.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Listing Title *</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                    placeholder="e.g., Premium Grade Cocoa Beans"
                  />
                </div>
                
                <div>
                  <label htmlFor="commodityType" className="block text-sm font-medium text-gray-700">Commodity Type *</label>
                  <select
                    id="commodityType"
                    name="commodityType"
                    required
                    value={formData.commodityType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  >
                    <option value="">Select a commodity...</option>
                    <option value="Cocoa Beans">Cocoa Beans</option>
                    <option value="Cashew Nuts">Cashew Nuts</option>
                    <option value="Sesame Seeds">Sesame Seeds</option>
                    <option value="Ginger">Ginger</option>
                    <option value="Soya Beans">Soya Beans</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  >
                    <option value="">Select a category...</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Processed Goods">Processed Goods</option>
                    <option value="Packaged Foods">Packaged Foods</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                    placeholder="Provide details about the product quality, source, and packaging..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Pricing & Quantity</h3>
              
              <div className="mb-4 flex items-center">
                <input
                  id="priceOnRequest"
                  name="priceOnRequest"
                  type="checkbox"
                  checked={formData.priceOnRequest}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="priceOnRequest" className="ml-2 block text-sm text-gray-900">
                  Price on Request (Buyers must contact you for pricing)
                </label>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {!formData.priceOnRequest && (
                  <>
                    <div>
                      <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">Price Per Unit *</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">₦</span>
                        </div>
                        <input
                          type="number"
                          name="pricePerUnit"
                          id="pricePerUnit"
                          required={!formData.priceOnRequest}
                          min="0"
                          step="0.01"
                          value={formData.pricePerUnit}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700">Total Quantity Available *</label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      name="quantityAvailable"
                      id="quantityAvailable"
                      required
                      min="0"
                      value={formData.quantityAvailable}
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
                  <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">Minimum Order Quantity</label>
                  <input
                    type="number"
                    name="minimumOrder"
                    id="minimumOrder"
                    min="0"
                    value={formData.minimumOrder}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                    placeholder={`e.g., 5 (${formData.quantityUnit})`}
                  />
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Logistics & Location</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="deliveryTerms" className="block text-sm font-medium text-gray-700">Delivery Terms *</label>
                  <select
                    id="deliveryTerms"
                    name="deliveryTerms"
                    required
                    value={formData.deliveryTerms}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  >
                    <option value="negotiable">Negotiable</option>
                    <option value="ex-works">Ex-Works (Buyer picks up)</option>
                    <option value="fob">FOB (Free on Board)</option>
                    <option value="ddp">DDP (Delivered Duty Paid)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">Offer Valid Until *</label>
                  <input
                    type="date"
                    name="validUntil"
                    id="validUntil"
                    required
                    value={formData.validUntil}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  />
                </div>

                <div>
                  <label htmlFor="locationState" className="block text-sm font-medium text-gray-700">Location (State) *</label>
                  <select
                    id="locationState"
                    name="locationState"
                    required
                    value={formData.locationState}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  >
                    <option value="">Select state...</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Oyo">Oyo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="locationLga" className="block text-sm font-medium text-gray-700">Location (LGA)</label>
                  <input
                    type="text"
                    name="locationLga"
                    id="locationLga"
                    value={formData.locationLga}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  />
                </div>
              </div>
            </div>

            {/* Photos Upload placeholder */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Photos</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">Click to upload photos</p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB (Max 5 photos)</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Creating...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Submit Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
