# Design Tokens

This document outlines the design system tokens used throughout the FiftyFifty ToolKit application.

## Colors

### Brand Colors

#### Primary Blue (#0063AF)
- **Usage**: Primary actions, links, active states
- **Shades**: 50-900 available
- **Classes**: `bg-brand-primary`, `text-brand-primary`, `border-brand-primary`

```tsx
// Default
bg-brand-primary         // #0063AF
text-brand-primary-light // #4A8FCA
border-brand-primary-dark // #004A85
```

#### Secondary Red (#EC1C24)
- **Usage**: CTAs, alerts, important highlights
- **Shades**: 50-900 available
- **Classes**: `bg-brand-secondary`, `text-brand-secondary`, `border-brand-secondary`

```tsx
// Default
bg-brand-secondary         // #EC1C24
text-brand-secondary-light // #F15A60
border-brand-secondary-dark // #C01318
```

### Neutral Colors

#### Light (#F6F6F6)
- **Usage**: Backgrounds, surfaces

#### Medium (#DDDDDD)
- **Usage**: Borders, dividers

#### Dark (#222222)
- **Usage**: Primary text, headings

```tsx
bg-neutral-light   // #F6F6F6
bg-neutral-medium  // #DDDDDD
text-neutral-dark  // #222222
```

### Semantic Colors

#### Success (Green)
```tsx
bg-success      // #10B981
bg-success-light // #6EE7B7
bg-success-dark  // #059669
```

#### Warning (Amber)
```tsx
bg-warning      // #F59E0B
bg-warning-light // #FCD34D
bg-warning-dark  // #D97706
```

#### Error (Red)
```tsx
bg-error      // #EF4444
bg-error-light // #FCA5A5
bg-error-dark  // #DC2626
```

#### Info (Blue)
```tsx
bg-info      // #3B82F6
bg-info-light // #93C5FD
bg-info-dark  // #2563EB
```

## Typography

### Font Families

```tsx
font-sans  // System font stack
font-mono  // Monospace font stack
```

### Font Sizes

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem | 1rem | Captions, labels |
| `text-sm` | 0.875rem | 1.25rem | Small text |
| `text-base` | 1rem | 1.5rem | Body text |
| `text-lg` | 1.125rem | 1.75rem | Large body |
| `text-xl` | 1.25rem | 1.75rem | Subheadings |
| `text-2xl` | 1.5rem | 2rem | H4 |
| `text-3xl` | 1.875rem | 2.25rem | H3 |
| `text-4xl` | 2.25rem | 2.5rem | H2 |
| `text-5xl` | 3rem | 1 | H1 |

### Font Weights

```tsx
font-normal  // 400
font-medium  // 500
font-semibold // 600
font-bold    // 700
```

## Spacing

All spacing follows an 8px grid system.

| Class | Size | Pixels |
|-------|------|--------|
| `p-1`, `m-1` | 0.25rem | 4px |
| `p-2`, `m-2` | 0.5rem | 8px |
| `p-3`, `m-3` | 0.75rem | 12px |
| `p-4`, `m-4` | 1rem | 16px |
| `p-6`, `m-6` | 1.5rem | 24px |
| `p-8`, `m-8` | 2rem | 32px |
| `p-12`, `m-12` | 3rem | 48px |
| `p-16`, `m-16` | 4rem | 64px |

### Extended Spacing

```tsx
space-18  // 4.5rem (72px)
space-88  // 22rem (352px)
space-100 // 25rem (400px)
space-112 // 28rem (448px)
space-128 // 32rem (512px)
```

## Border Radius

```tsx
rounded-sm   // 0.25rem (4px)
rounded      // 0.5rem (8px)
rounded-md   // 0.5rem (8px)
rounded-lg   // 0.75rem (12px)
rounded-xl   // 1rem (16px)
rounded-2xl  // 1.5rem (24px)
rounded-3xl  // 1.75rem (28px)
rounded-4xl  // 2rem (32px)
rounded-full // 9999px (circle)
```

## Shadows

```tsx
shadow-soft     // Subtle shadow
shadow-card     // Card shadow
shadow-elevated // Elevated shadow
shadow-sm       // Small shadow
shadow-md       // Medium shadow
shadow-lg       // Large shadow
shadow-xl       // Extra large shadow
shadow-2xl      // 2X large shadow
```

## Animations

### Fade Animations

```tsx
animate-fade-in   // Fade in effect (0.3s)
animate-fade-out  // Fade out effect (0.3s)
```

### Slide Animations

```tsx
animate-slide-in-right  // Slide from right (0.3s)
animate-slide-in-left   // Slide from left (0.3s)
animate-slide-up        // Slide up (0.3s)
animate-slide-down      // Slide down (0.3s)
```

### Usage Example

```tsx
<div className="animate-fade-in hover:animate-slide-up">
  Animated content
</div>
```

## Breakpoints

```tsx
sm:   // 640px
md:   // 768px
lg:   // 1024px
xl:   // 1280px
2xl:  // 1536px
```

### Usage Example

```tsx
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>
```

## RTL Support

Use logical properties for RTL support:

```tsx
// Instead of: ml-4, mr-4
// Use: ms-4, me-4 (margin-inline-start/end)

// Instead of: pl-4, pr-4
// Use: ps-4, pe-4 (padding-inline-start/end)

// Instead of: left-0, right-0
// Use: start-0, end-0
```

### Example

```tsx
// LTR: margin-left
// RTL: margin-right
<div className="ms-4">Content</div>

// LTR: padding-right
// RTL: padding-left
<div className="pe-6">Content</div>
```

## Utility Classes

### Focus States

```tsx
focus:outline-none
focus:ring-2
focus:ring-brand-primary
focus:ring-offset-2
```

### Disabled States

```tsx
disabled:opacity-50
disabled:cursor-not-allowed
```

### Hover States

```tsx
hover:bg-brand-primary
hover:text-white
hover:scale-105
```

## Component Patterns

### Button

```tsx
<button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 transition-colors">
  Click me
</button>
```

### Card

```tsx
<div className="p-6 bg-white rounded-xl shadow-card hover:shadow-elevated transition-shadow">
  Card content
</div>
```

### Input

```tsx
<input className="w-full px-4 py-2 border border-neutral-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent" />
```

## Best Practices

1. **Use semantic color names** over arbitrary values
2. **Use spacing scale** consistently (4, 8, 12, 16, 24, 32, 48, 64px)
3. **Use logical properties** for RTL support (ms/me instead of ml/mr)
4. **Use cn() utility** for conditional classes
5. **Follow mobile-first** responsive design (sm:, md:, lg:, xl:)
6. **Use design tokens** instead of arbitrary values

### Good vs Bad

```tsx
// ✅ Good
<div className="bg-brand-primary text-white p-4 rounded-lg">

// ❌ Bad
<div className="bg-[#0063AF] text-[#fff] p-[16px] rounded-[8px]">
```

## Dark Mode (Optional)

To enable dark mode in the future:

```tsx
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
  Content
</div>
```

---

**Last Updated**: October 17, 2025

