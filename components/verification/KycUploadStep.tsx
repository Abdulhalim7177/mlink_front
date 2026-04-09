"use client";

import React, { useState } from 'react';
import api from '../../lib/api';
import { UploadCloud, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function KycUploadStep({ onNext, onBack }: Props) {
  const [documents, setDocuments] = useState<Record<string, File | null>>({
    cacCertificate: null,
    businessId: null,
    directorsId: null,
    tinCertificate: null,
    bankStatement: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleFileDrop = (key: string, file: File | null) => {
    if (!file) return;
    // basic filter
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setServerError(`Invalid file type for ${key}. Use PDF or JPEG/PNG.`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setServerError(`File size for ${key} exceeds 5MB limit.`);
      return;
    }

    setServerError('');
    setDocuments(prev => ({ ...prev, [key]: file }));
  };

  const submitKYC = async () => {
    try {
      setServerError('');
      setIsUploading(true);

      const missingFiles = Object.entries(documents).filter(([_, file]) => file === null);
      if (missingFiles.length > 0) {
        setServerError('Please upload all 5 required identity documents before proceeding.');
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      await api.post('/users/upload-kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onNext();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const DropZone = ({ title, fieldKey, hint }: { title: string, fieldKey: string, hint: string }) => {
    const file = documents[fieldKey];

    return (
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">{title}</label>
        <div 
          className={`border-2 border-dashed ${file ? 'border-success bg-success/5' : 'border-border hover:border-accent hover:bg-accent/5'} rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden`}
        >
          <input 
            type="file" 
            accept=".pdf,.png,.jpg,.jpeg" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileDrop(fieldKey, e.target.files?.[0] || null)}
          />
          
          {file ? (
             <div className="flex flex-col items-center justify-center">
               <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-3">
                 <CheckCircle2 className="w-6 h-6 text-success" />
               </div>
               <p className="text-gray-900 font-bold mb-1 truncate px-4 w-full">{file.name}</p>
               <p className="text-sm text-success-dark font-medium">Ready to upload</p>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-accent/20">
                 <UploadCloud className="w-6 h-6 text-gray-500" />
               </div>
               <p className="text-gray-900 font-medium mb-1">Click to browse or drag and drop</p>
               <p className="text-xs text-text-muted mt-1">{hint}</p>
               <p className="text-xs text-text-muted mt-0.5">PDF, PNG, JPG (max. 5MB)</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity & Business Verification</h2>
      <p className="text-gray-500 mb-8">Securely upload your registry documents. All data is strictly encrypted.</p>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {serverError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
        <DropZone title="CAC Registration Certificate" fieldKey="cacCertificate" hint="Corporate Affairs Commission Certificate" />
        <DropZone title="Business Identification Form" fieldKey="businessId" hint="Form CAC 1.1 / CAC 7" />
        <DropZone title="Director's ID" fieldKey="directorsId" hint="Valid Government Issued ID" />
        <DropZone title="Tax Identification Number (TIN)" fieldKey="tinCertificate" hint="FIRS Issued TIN Document" />
        <DropZone title="Corporate Bank Statement" fieldKey="bankStatement" hint="Most recent 3 months statement" />
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <button 
          onClick={onBack}
          type="button" 
          disabled={isUploading}
          className="flex items-center px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <button 
          onClick={submitKYC}
          disabled={isUploading}
          className="flex items-center px-8 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isUploading ? 'Uploading Securely...' : <>Upload & Proceed <ArrowRight className="w-5 h-5 ml-2" /></>}
        </button>
      </div>

    </div>
  );
}
