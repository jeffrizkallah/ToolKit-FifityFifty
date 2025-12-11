'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { LanguageToggle } from './language-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';

/**
 * Header Component
 * 
 * Implements US3.5 - Header Navigation Component
 * Main site header with navigation, language toggle, and responsive mobile menu.
 * Supports both LTR and RTL layouts using Tailwind logical properties.
 */

export function Header() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { key: 'home', href: `/${locale}` },
    { key: 'tools', href: '#phases-timeline' },
    { key: 'contact', href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-4 z-50 mx-4 glass-component glass-layered glass-float-shadow rounded-2xl border-white/20" role="banner">
      <div className="flex h-16 items-center justify-between max-w-6xl mx-auto px-6">
        {/* Logo / Brand */}
        <div className="flex items-center">
          <a href="/" className="flex items-center transition-all duration-300 ease-in-out hover:opacity-80" aria-label="FiftyFifty ToolKit Home">
            <Image
              src="/5050 Logo.png"
              alt="FiftyFifty Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-neutral-800 transition-all duration-300 ease-in-out hover:text-accent-blue hover:brightness-110 font-medium"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* Right Side: Language Toggle + Logout + Mobile Menu */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          
          {/* Logout Button - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">{loggingOut ? '...' : 'Sign Out'}</span>
          </Button>
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8" role="navigation" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg transition-colors hover:text-[#0063AF] py-2"
                  >
                    {t(link.key)}
                  </a>
                ))}
                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-lg text-red-600 hover:text-red-700 py-2 text-start flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  {loggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

