"use client";

import React, { useState } from 'react';
import { X, Download, Maximize2, Minimize2 } from 'lucide-react';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  mimeType: string;
}

export default function DocumentPreview({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  mimeType,
}: DocumentPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-gray-200 mx-4 animate-in zoom-in-95 duration-200 flex flex-col ${
          isFullscreen
            ? 'w-[98vw] h-[96vh]'
            : 'w-full max-w-3xl max-h-[85vh]'
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{documentName}</h3>
            <span className="ml-2 text-xs text-gray-400 uppercase shrink-0">
              {mimeType.split('/')[1]}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={documentUrl}
              download={documentName}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 flex items-center justify-center min-h-0">
          {isImage ? (
            <img
              src={documentUrl}
              alt={documentName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          ) : isPdf ? (
            <iframe
              src={documentUrl}
              className="w-full h-full min-h-[500px] rounded-lg border border-gray-200"
              title={documentName}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium mb-2">Preview not available for this file type.</p>
              <a
                href={documentUrl}
                download={documentName}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold text-sm hover:underline"
              >
                Download to view
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
