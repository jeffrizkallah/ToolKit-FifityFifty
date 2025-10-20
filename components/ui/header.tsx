'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { useState } from 'react';
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
  const [open, setOpen] = useState(false);

  const navLinks = [
    { key: 'home', href: '#' },
    { key: 'about', href: '#' },
    { key: 'initiatives', href: '#phases-timeline' },
    { key: 'tools', href: '#' },
    { key: 'contact', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60" role="banner">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold text-[#0063AF] hover:opacity-80 transition-opacity" aria-label="FiftyFifty ToolKit Home">
            FiftyFifty ToolKit
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="transition-colors hover:text-[#0063AF]"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* Right Side: Language Toggle + Mobile Menu */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

