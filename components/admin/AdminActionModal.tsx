"use client";

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AdminActionModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor?: string;
  inputLabel: string;
  inputPlaceholder?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => Promise<void>;
  required?: boolean;
}

export default function AdminActionModal({
  title,
  description,
  confirmLabel,
  confirmColor = 'bg-red-600 hover:bg-red-700',
  inputLabel,
  inputPlaceholder = '',
  isOpen,
  onClose,
  onConfirm,
  required = true,
}: AdminActionModalProps) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (required && !value.trim()) {
      setError(`${inputLabel} is required.`);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onConfirm(value);
      setValue('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">{description}</p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {inputLabel}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={inputPlaceholder}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all resize-none text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl ${confirmColor} text-white font-bold text-sm transition-colors disabled:opacity-70 flex items-center`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
