'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { DocumentCard, DocumentData } from './DocumentCard';
import { DocumentViewerModal } from './DocumentViewerModal';

interface DocumentsSectionProps {
  documents: DocumentData[];
  locale: 'en' | 'ar';
  title?: string;
  subtitle?: string;
}

/**
 * DocumentsSection Component
 * 
 * A section component for displaying a grid of document cards.
 * Features:
 * - Responsive grid layout
 * - Document viewer modal integration
 * - Scroll-triggered animations
 * - Empty state handling
 */
export function DocumentsSection({ 
  documents, 
  locale, 
  title,
  subtitle 
}: DocumentsSectionProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDocument = (document: DocumentData) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Small delay before clearing document to allow animation
    setTimeout(() => setSelectedDocument(null), 300);
  };

  const defaultTitle = locale === 'ar' ? 'المستندات والموارد' : 'Documents & Resources';
  const defaultSubtitle = locale === 'ar' 
    ? 'تصفح واطلع على المواد التعليمية المتاحة في هذه المرحلة'
    : 'Browse and view the learning materials available in this phase';

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="py-16"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {locale === 'ar' ? 'لا توجد مستندات متاحة' : 'No Documents Available'}
          </h3>
          <p className="text-gray-500">
            {locale === 'ar' 
              ? 'سيتم إضافة مستندات لهذه المرحلة قريباً'
              : 'Documents will be added to this phase soon'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-16"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0041A8]/5 text-[#0041A8] text-sm font-medium mb-4">
          <FolderOpen className="w-4 h-4" />
          <span>{locale === 'ar' ? 'الموارد التعليمية' : 'Learning Resources'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0041A8] mb-3 tracking-tight">
          {title || defaultTitle}
        </h2>
        <p className="text-gray-600 text-lg font-normal max-w-2xl mx-auto">
          {subtitle || defaultSubtitle}
        </p>
      </motion.div>

      {/* Documents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {documents.map((document, index) => (
          <DocumentCard
            key={document.id}
            document={document}
            locale={locale}
            onView={handleViewDocument}
            index={index}
          />
        ))}
      </motion.div>

      {/* Document Count */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        {locale === 'ar' 
          ? `${documents.length} ${documents.length === 1 ? 'مستند متاح' : 'مستندات متاحة'}`
          : `${documents.length} document${documents.length !== 1 ? 's' : ''} available`}
      </motion.div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        document={selectedDocument}
        locale={locale}
      />
    </motion.section>
  );
}

export default DocumentsSection;

