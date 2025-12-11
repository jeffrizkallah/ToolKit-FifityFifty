'use client';

/**
 * Contact Page Client Component
 * 
 * Form for users to contact FiftyFifty and book appointments.
 * Supports RTL layout and bilingual content.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Phone
} from 'lucide-react';

interface ContactClientProps {
  locale: 'en' | 'ar';
}

type ContactReason = 'general' | 'appointment' | 'partnership' | 'support';

interface FormData {
  name: string;
  email: string;
  phone: string;
  reason: ContactReason | '';
  preferredTime: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  reason: '',
  preferredTime: '',
  message: '',
};

export function ContactClient({ locale }: ContactClientProps) {
  const t = useTranslations('Contact');
  const isRTL = locale === 'ar';
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactReasons: { value: ContactReason; labelKey: string }[] = [
    { value: 'general', labelKey: 'reasons.general' },
    { value: 'appointment', labelKey: 'reasons.appointment' },
    { value: 'partnership', labelKey: 'reasons.partnership' },
    { value: 'support', labelKey: 'reasons.support' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Floating orbs for hero (matching homepage style)
  const orbPositions = [
    { left: 15, top: 25, size: 80, delay: 0 },
    { left: 80, top: 30, size: 60, delay: 0.5 },
    { left: 10, top: 65, size: 50, delay: 1 },
    { left: 85, top: 70, size: 70, delay: 1.5 },
  ];

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('success.title')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('success.description')}
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="mr-4"
            >
              {t('success.sendAnother')}
            </Button>
            <Button asChild>
              <a href={`/${locale}`}>
                {t('success.backToHome')}
              </a>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0041A8] via-[#0063AF] to-[#007BFF] mx-4 mt-8 rounded-2xl">
        {/* Subtle Gradient Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {orbPositions.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                left: `${orb.left}%`,
                top: `${orb.top}%`,
                width: orb.size,
                height: orb.size,
                filter: 'blur(30px)',
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: orb.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Mail className="w-12 h-12 text-white/80 mx-auto" />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {t('hero.title')}
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-white/85 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('hero.description')}
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form Column */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('form.title')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0063AF] focus:border-transparent transition-all duration-200 outline-none"
                      placeholder={t('form.namePlaceholder')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0063AF] focus:border-transparent transition-all duration-200 outline-none"
                      placeholder={t('form.emailPlaceholder')}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.phone')} <span className="text-gray-400">({t('form.optional')})</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0063AF] focus:border-transparent transition-all duration-200 outline-none"
                      placeholder={t('form.phonePlaceholder')}
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.reason')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0063AF] focus:border-transparent transition-all duration-200 outline-none bg-white"
                    >
                      <option value="">{t('form.reasonPlaceholder')}</option>
                      {contactReasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {t(reason.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Time - Only shown when appointment is selected */}
                  {formData.reason === 'appointment' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.preferredTime')} <span className="text-gray-400">({t('form.optional')})</span>
                      </label>
                      <input
                        type="text"
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0063AF] focus:border-transparent transition-all duration-200 outline-none"
                        placeholder={t('form.preferredTimePlaceholder')}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {t('form.preferredTimeHint')}
                      </p>
                    </motion.div>
                  )}

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0063AF] focus:border-transparent transition-all duration-200 outline-none resize-none"
                      placeholder={t('form.messagePlaceholder')}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full py-6 text-base font-bold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                        {t('form.submit')}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Info Column */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Contact Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                </h3>
                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium" dir="ltr">+961 79 182 926</span>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">info@fiftyfiftylb.com</span>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('info.followUs')}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="py-8 px-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <a
            href={`/${locale}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToHome')}
          </a>
        </div>
      </div>
    </main>
  );
}

