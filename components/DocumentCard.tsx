'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, File, Download, Eye, Clock } from 'lucide-react';

export interface DocumentData {
  id: string | number;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'PDF' | 'Word' | 'Excel' | 'PowerPoint' | 'Other';
  fileSize?: string;
  moduleTitle?: string;
}

interface DocumentCardProps {
  document: DocumentData;
  locale: 'en' | 'ar';
  onView: (document: DocumentData) => void;
  index?: number;
}

/**
 * DocumentCard Component
 * 
 * A card component for displaying document information with:
 * - File type icon with color coding
 * - Hover effects (lift and tooltip)
 * - View and download actions
 * - Glassmorphism styling
 */
export function DocumentCard({ document, locale, onView, index = 0 }: DocumentCardProps) {
  const isRTL = locale === 'ar';

  // Get icon and color based on file type
  const getFileTypeConfig = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return {
          icon: FileText,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100',
          gradientFrom: 'from-red-500',
          gradientTo: 'to-red-600',
        };
      case 'WORD':
      case 'DOC':
      case 'DOCX':
        return {
          icon: FileText,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100',
          gradientFrom: 'from-blue-500',
          gradientTo: 'to-blue-600',
        };
      case 'EXCEL':
      case 'XLS':
      case 'XLSX':
        return {
          icon: FileSpreadsheet,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100',
          gradientFrom: 'from-green-500',
          gradientTo: 'to-green-600',
        };
      case 'POWERPOINT':
      case 'PPT':
      case 'PPTX':
        return {
          icon: FileText,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          gradientFrom: 'from-orange-500',
          gradientTo: 'to-orange-600',
        };
      default:
        return {
          icon: File,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100',
          gradientFrom: 'from-gray-500',
          gradientTo: 'to-gray-600',
        };
    }
  };

  const fileConfig = getFileTypeConfig(document.fileType);
  const IconComponent = fileConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group relative h-full"
    >
      <div
        className={`
          relative bg-white rounded-2xl p-6 border border-gray-100
          shadow-sm hover:shadow-xl transition-all duration-300
          cursor-pointer overflow-hidden h-full flex flex-col
        `}
        onClick={() => onView(document)}
      >
        {/* Background Gradient Accent */}
        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 -translate-y-1/2 ${isRTL ? '-translate-x-1/2' : 'translate-x-1/2'} bg-gradient-to-br ${fileConfig.gradientFrom} ${fileConfig.gradientTo} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
        
        {/* File Type Icon */}
        <div className={`relative w-14 h-14 rounded-xl ${fileConfig.bgColor} ${fileConfig.borderColor} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform flex-shrink-0`}>
          <IconComponent className={`w-7 h-7 ${fileConfig.color}`} />
        </div>

        {/* Title */}
        <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#0041A8] transition-colors flex-shrink-0">
          {document.title}
        </h4>

        {/* Description - Always reserve space */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-shrink-0">
          {document.description || '\u00A0'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full ${fileConfig.bgColor} ${fileConfig.color} font-medium`}>
            {document.fileType}
          </span>
          {document.fileSize && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {document.fileSize}
            </span>
          )}
        </div>

        {/* Module Reference - Always reserve space */}
        <p className="text-xs text-gray-400 mb-4 truncate flex-grow">
          {document.moduleTitle 
            ? `${locale === 'ar' ? 'من الوحدة:' : 'From:'} ${document.moduleTitle}`
            : '\u00A0'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(document);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0041A8] text-white rounded-xl text-sm font-medium hover:bg-[#003d96] transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{locale === 'ar' ? 'عرض' : 'View'}</span>
          </button>
          <a
            href={document.fileUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className={`w-10 h-10 rounded-xl ${fileConfig.bgColor} ${fileConfig.borderColor} border flex items-center justify-center ${fileConfig.color} hover:scale-110 transition-transform`}
            title={locale === 'ar' ? 'تحميل' : 'Download'}
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

        {/* Hover Preview Tooltip */}
        <div className={`
          absolute bottom-full ${isRTL ? 'right-0' : 'left-0'} mb-2 w-full
          opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0
          transition-all duration-200 pointer-events-none z-10
        `}>
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
            <p className="font-medium mb-1">
              {locale === 'ar' ? 'انقر للمعاينة' : 'Click to preview'}
            </p>
            {document.description && (
              <p className="text-gray-300 line-clamp-2">{document.description}</p>
            )}
            <div className={`absolute top-full ${isRTL ? 'right-4' : 'left-4'} w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DocumentCard;

