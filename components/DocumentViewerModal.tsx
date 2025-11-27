'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  FileText,
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { DocumentData } from './DocumentCard';
import { downloadFile } from '@/lib/utils';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentData | null;
  locale: 'en' | 'ar';
}

type ViewerType = 'google' | 'office' | 'direct';

/**
 * DocumentViewerModal Component
 * 
 * A modal for viewing PDF and Word documents.
 * Features:
 * - PDF/Word document preview using Google Docs Viewer or Office Online
 * - Automatic viewer fallback when content is blocked
 * - Zoom controls
 * - Download option
 * - Full-screen mode
 * - Loading state
 * - Error handling
 * - Multi-page document support
 */
export function DocumentViewerModal({ 
  isOpen, 
  onClose, 
  document, 
  locale 
}: DocumentViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [currentViewer, setCurrentViewer] = useState<ViewerType>('google');
  const [viewerAttempts, setViewerAttempts] = useState(0);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if file is an Office document
  const isOfficeDocument = (fileType: string | undefined): boolean => {
    const officeTypes = ['Word', 'Excel', 'PowerPoint', 'DOCX', 'XLSX', 'PPTX', 'DOC', 'XLS', 'PPT'];
    return officeTypes.some(type => 
      fileType?.toLowerCase().includes(type.toLowerCase())
    );
  };

  // Check file extension for Office documents
  const isOfficeByExtension = (url: string): boolean => {
    const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const lowerUrl = url.toLowerCase();
    return officeExtensions.some(ext => lowerUrl.includes(ext));
  };

  // Reset state when document changes
  useEffect(() => {
    if (document) {
      setIsLoading(true);
      setHasError(false);
      setZoom(100);
      setViewerAttempts(0);
      // Start with Office viewer for Office documents, Google for others
      const shouldUseOffice = isOfficeDocument(document.fileType) || isOfficeByExtension(document.fileUrl);
      setCurrentViewer(shouldUseOffice ? 'office' : 'google');
    }
  }, [document?.id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
      setZoom(100);
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    }
  }, [isOpen]);

  // Set a timeout to detect if viewer fails to load properly
  useEffect(() => {
    if (isLoading && isOpen && document) {
      loadTimeoutRef.current = setTimeout(() => {
        // If still loading after 10 seconds, try next viewer or show error
        if (isLoading) {
          handleViewerFallback();
        }
      }, 10000);
    }
    
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isLoading, isOpen, document, currentViewer]);

  // Handle viewer fallback when content fails to load
  const handleViewerFallback = () => {
    const nextAttempt = viewerAttempts + 1;
    setViewerAttempts(nextAttempt);
    
    if (nextAttempt === 1 && currentViewer === 'office') {
      // Try Google viewer as fallback
      setCurrentViewer('google');
      setIsLoading(true);
    } else if (nextAttempt === 1 && currentViewer === 'google') {
      // Try Office viewer as fallback
      setCurrentViewer('office');
      setIsLoading(true);
    } else {
      // All viewers failed, show error
      setIsLoading(false);
      setHasError(true);
    }
  };

  // Generate viewer URL based on current viewer type
  const getViewerUrl = (fileUrl: string, viewerType: ViewerType): string => {
    // Check if it's a Google Drive URL
    const drivePatterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,  // /file/d/ID format
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/, // /open?id=ID format
      /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/, // Google Docs
      /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/, // Google Sheets
      /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/, // Google Slides
    ];

    for (const pattern of drivePatterns) {
      const match = fileUrl.match(pattern);
      if (match && match[1]) {
        const fileId = match[1];
        // Use Google Drive's native preview embed
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    const encodedUrl = encodeURIComponent(fileUrl);

    switch (viewerType) {
      case 'office':
        // Microsoft Office Online Viewer - works well for Office documents
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
      case 'google':
        // Google Docs Viewer - good for PDFs and general documents
        return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      case 'direct':
        // Direct URL - for PDFs that can be viewed natively
        return fileUrl;
      default:
        return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    handleViewerFallback();
  };

  // Retry with different viewer
  const retryWithViewer = (viewer: ViewerType) => {
    setCurrentViewer(viewer);
    setIsLoading(true);
    setHasError(false);
    setViewerAttempts(0);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        hideCloseButton
        className={`
          ${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-5xl h-[85vh]'} 
          w-full p-0 overflow-hidden flex flex-col
          transition-all duration-300
        `}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>
            {locale === 'ar' 
              ? 'عرض المستند'
              : 'Document viewer'}
          </DialogDescription>
        </DialogHeader>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          {/* Document Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              document.fileType === 'PDF' ? 'bg-red-100 text-red-600' :
              document.fileType === 'Word' ? 'bg-blue-100 text-blue-600' :
              document.fileType === 'Excel' ? 'bg-green-100 text-green-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {document.title}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">
                  {document.fileType} {document.fileSize && `• ${document.fileSize}`}
                </p>
                {!hasError && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                    {currentViewer === 'office' ? 'Office Viewer' : currentViewer === 'google' ? 'Google Viewer' : 'Direct'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white rounded-lg border">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title={locale === 'ar' ? 'تصغير' : 'Zoom out'}
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-xs text-gray-600 w-12 text-center">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title={locale === 'ar' ? 'تكبير' : 'Zoom in'}
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 rounded hover:bg-gray-100"
                title={locale === 'ar' ? 'إعادة تعيين' : 'Reset zoom'}
              >
                <RotateCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={locale === 'ar' ? (isFullscreen ? 'تصغير' : 'ملء الشاشة') : (isFullscreen ? 'Exit fullscreen' : 'Fullscreen')}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-gray-600" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Open in New Tab */}
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={locale === 'ar' ? 'فتح في علامة تبويب جديدة' : 'Open in new tab'}
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </a>

            {/* Download */}
            <button
              onClick={() => downloadFile(document.fileUrl, document.title)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={locale === 'ar' ? 'تحميل' : 'Download'}
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
              title={locale === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 relative bg-gray-100 overflow-auto">
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10"
              >
                <Loader2 className="w-12 h-12 text-[#0041A8] animate-spin mb-4" />
                <p className="text-gray-600 mb-1">
                  {locale === 'ar' ? 'جاري تحميل المستند...' : 'Loading document...'}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {locale === 'ar' 
                    ? `استخدام ${currentViewer === 'office' ? 'عارض Office' : 'عارض Google'}`
                    : `Using ${currentViewer === 'office' ? 'Office Viewer' : 'Google Viewer'}`}
                </p>
                
                {/* Quick viewer switch while loading */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => retryWithViewer(currentViewer === 'office' ? 'google' : 'office')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {locale === 'ar' 
                      ? `جرب ${currentViewer === 'office' ? 'Google' : 'Office'}`
                      : `Try ${currentViewer === 'office' ? 'Google' : 'Office'} Viewer`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10 p-4">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {locale === 'ar' ? 'تعذر عرض المستند في المتصفح' : 'Unable to preview document'}
              </h4>
              <p className="text-gray-600 text-sm mb-6 max-w-md text-center">
                {locale === 'ar' 
                  ? 'لا يمكن عرض هذا المستند مباشرة. يمكنك فتحه في علامة تبويب جديدة أو تحميله.'
                  : 'This document cannot be previewed directly. You can open it in a new tab or download it.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0041A8] text-white rounded-lg hover:bg-[#003d96] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'فتح في علامة تبويب جديدة' : 'Open in New Tab'}</span>
                </a>
                <button
                  onClick={() => downloadFile(document.fileUrl, document.title)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'تحميل' : 'Download'}</span>
                </button>
              </div>
              {/* Try different viewer options */}
              <div className="mt-6 pt-6 border-t border-gray-200 w-full max-w-md">
                <p className="text-xs text-gray-500 text-center mb-3">
                  {locale === 'ar' ? 'جرب عارض مختلف:' : 'Try a different viewer:'}
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => retryWithViewer('google')}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    Google Viewer
                  </button>
                  <button
                    onClick={() => retryWithViewer('office')}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    Office Viewer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Document iFrame */}
          {!hasError && (
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: zoom !== 100 ? `${10000 / zoom}%` : '100%',
                height: zoom !== 100 ? `${10000 / zoom}%` : '100%',
              }}
              className="transition-transform duration-200"
            >
              <iframe
                key={`${document.id}-${currentViewer}-${viewerAttempts}`}
                src={getViewerUrl(document.fileUrl, currentViewer)}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={document.title}
                allow="autoplay"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
              />
            </div>
          )}
        </div>

        {/* Footer - Mobile Zoom Controls */}
        <div className="sm:hidden flex items-center justify-center gap-4 py-3 border-t bg-gray-50">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-2 rounded-lg bg-white border disabled:opacity-50"
          >
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 w-16 text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="p-2 rounded-lg bg-white border disabled:opacity-50"
          >
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentViewerModal;

