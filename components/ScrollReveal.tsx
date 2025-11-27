'use client';

import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
  staggerChildren?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'aside';
}

/**
 * ScrollReveal Component
 * 
 * A wrapper component that animates children when they scroll into view.
 * Features:
 * - Multiple animation directions
 * - Configurable delay, duration, and distance
 * - Staggered children animations
 * - Viewport-based triggering
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 30,
  once = true,
  threshold = 0.1,
  className = '',
  staggerChildren = 0,
  as = 'div',
  ...props
}: ScrollRevealProps) {
  // Get initial position based on direction
  const getInitialPosition = (): { x?: number; y?: number } => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      case 'none':
      default:
        return {};
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing
        staggerChildren: staggerChildren > 0 ? staggerChildren : undefined,
      },
    },
  };

  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * ScrollRevealItem Component
 * 
 * Used as a child of ScrollReveal for staggered animations.
 */
interface ScrollRevealItemProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
}

export function ScrollRevealItem({ 
  children, 
  className = '',
  direction = 'up',
  distance = 20,
}: ScrollRevealItemProps) {
  const getInitialPosition = (): { x?: number; y?: number } => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      case 'none':
      default:
        return {};
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * FadeIn Component
 * 
 * A simple fade-in animation on scroll.
 */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = '',
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, amount: 0.1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn Component
 * 
 * A slide-in animation with opacity.
 */
interface SlideInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 40,
  className = '',
  once = true,
}: SlideInProps) {
  const getAnimation = () => {
    switch (direction) {
      case 'up':
        return { initial: { opacity: 0, y: distance }, animate: { opacity: 1, y: 0 } };
      case 'down':
        return { initial: { opacity: 0, y: -distance }, animate: { opacity: 1, y: 0 } };
      case 'left':
        return { initial: { opacity: 0, x: distance }, animate: { opacity: 1, x: 0 } };
      case 'right':
        return { initial: { opacity: 0, x: -distance }, animate: { opacity: 1, x: 0 } };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
    }
  };

  const animation = getAnimation();

  return (
    <motion.div
      initial={animation.initial}
      whileInView={animation.animate}
      viewport={{ once, amount: 0.1 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer Component
 * 
 * A container that staggers the animation of its children.
 */
interface StaggerContainerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className = '',
  once = true,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;

