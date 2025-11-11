# Components

This directory contains all React components for the application.

## Structure

```
components/
├── ui/              # shadcn/ui components (will be added in US1.5)
├── layout/          # Layout components (Header, Footer, etc.)
├── features/        # Feature-specific components
└── shared/          # Shared/common components
```

## Naming Conventions

- Use PascalCase for component files: `ComponentName.tsx`
- Use kebab-case for directories: `component-name/`
- Co-locate component-specific files (styles, tests, etc.)

## Best Practices

- Keep components small and focused
- Use TypeScript for type safety
- Follow accessibility guidelines
- Write tests for complex components
- Document props with JSDoc comments

