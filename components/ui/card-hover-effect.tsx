"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: Array<{
    title: string;
    description: string;
    link: string;
    phaseNumber?: number;
  }>;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item.link}
          key={item.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full rounded-2xl bg-neutral-200 dark:bg-slate-800/[0.8] block z-0"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card item={item} phaseNumber={item.phaseNumber} />
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  item,
  phaseNumber,
  className,
}: {
  item: {
    title: string;
    description: string;
  };
  phaseNumber?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "glass-component glass-layered rounded-2xl p-6 overflow-hidden bg-white border border-neutral-200 relative z-20 w-full h-full transition-all duration-300 hover:border-neutral-300 shadow-sm",
        className
      )}
    >
      {phaseNumber && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-red-300 to-[#EC1C24] text-white w-16 h-16 flex items-center justify-center font-bold text-2xl rounded-bl-3xl z-10">
          {phaseNumber}
        </div>
      )}
      <div className="relative z-10">
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3
      className={cn(
        "text-2xl font-bold mb-3 text-gray-900 pr-16",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn("text-gray-600 line-clamp-4 text-sm leading-relaxed", className)}>
      {children}
    </p>
  );
};

