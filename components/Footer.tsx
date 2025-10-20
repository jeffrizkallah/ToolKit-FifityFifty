'use client';

/**
 * Footer Component
 * 
 * Implements US3.6 - Footer Component
 * Site footer with organization logos, navigation links, social media, and language toggle.
 * Supports both LTR and RTL layouts.
 */

import { useTranslations } from 'next-intl';
import { LanguageToggle } from './ui/language-toggle';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  locale: 'en' | 'ar';
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('Navigation');

  const footerLinks = [
    { key: 'home', href: '#' },
    { key: 'about', href: '#' },
    { key: 'initiatives', href: '#phases-timeline' },
    { key: 'tools', href: '#' },
    { key: 'contact', href: '#' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="container py-12">
        {/* Top Section: Logos and Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded">
                <div className="text-[#0063AF] font-bold text-xl" aria-label="FiftyFifty">
                  FiftyFifty
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {locale === 'ar'
                ? 'بناء مجتمعات مستدامة من خلال المسؤولية الاجتماعية'
                : 'Building sustainable communities through social responsibility'}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="font-semibold text-lg mb-4">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h2>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t(link.key)}
                </a>
              ))}
            </nav>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="font-semibold text-lg mb-4">
              {locale === 'ar' ? 'معلومات إضافية' : 'Additional Info'}
            </h2>
            <nav className="flex flex-col gap-2" aria-label="Legal and contact information">
              <a
                href={`/${locale}/privacy`}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section: Social Media, Language Toggle, and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Media Links */}
          <nav className="flex items-center gap-4" aria-label="Social media links">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`${social.name} ${locale === 'ar' ? '(يفتح في نافذة جديدة)' : '(opens in new window)'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </nav>

          {/* Copyright */}
          <div className="text-gray-400 text-sm text-center">
            {locale === 'ar'
              ? `© ${currentYear} فيفتي فيفتي. جميع الحقوق محفوظة.`
              : `© ${currentYear} FiftyFifty. All rights reserved.`}
          </div>

          {/* Language Toggle */}
          <div>
            <LanguageToggle />
          </div>
        </div>

        {/* Partner Logos Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h2 className="text-center text-gray-400 text-sm mb-4">
            {locale === 'ar' ? 'شركاؤنا' : 'Our Partners'}
          </h2>
          <div className="flex justify-center items-center gap-8 flex-wrap" role="list" aria-label="Partner organizations">
            <div className="bg-white px-6 py-3 rounded" role="listitem">
              <span className="text-[#0063AF] font-semibold">UN Women</span>
            </div>
            <div className="bg-white px-6 py-3 rounded" role="listitem">
              <span className="text-[#EC1C24] font-semibold">FiftyFifty</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

