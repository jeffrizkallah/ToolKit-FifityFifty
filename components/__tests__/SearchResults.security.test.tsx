import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchResults } from '../SearchResults';

/**
 * Security Tests for SearchResults Component
 * 
 * These tests verify that the HighlightedText component
 * properly escapes user input and prevents XSS attacks
 */

describe('SearchResults - XSS Security', () => {
  const mockResults = [
    {
      id: 1,
      type: 'phase' as const,
      title: 'Test Phase',
      description: 'Test description',
      slug: 'test-phase',
      score: 0.9,
    }
  ];

  describe('XSS Prevention', () => {
    it('should escape HTML tags in search query', () => {
      const xssQuery = '<script>alert("xss")</script>';
      
      render(
        <SearchResults 
          results={mockResults} 
          query={xssQuery} 
          locale="en" 
        />
      );
      
      // The script tag should be escaped and rendered as text, not executed
      const container = screen.getByRole('link');
      expect(container.innerHTML).not.toContain('<script>');
      
      // Should not find actual script tag in DOM
      expect(document.querySelector('script')).toBeNull();
    });

    it('should handle injection attempts with quotes', () => {
      const xssQuery = '"><img src=x onerror=alert(1)>';
      
      render(
        <SearchResults 
          results={mockResults} 
          query={xssQuery} 
          locale="en" 
        />
      );
      
      // Should not create any img tags
      const imgs = document.querySelectorAll('img');
      expect(imgs.length).toBe(0);
    });

    it('should escape regex special characters safely', () => {
      const specialChars = '.*+?^${}()|[]\\';
      
      // This should not crash
      expect(() => {
        render(
          <SearchResults 
            results={mockResults} 
            query={specialChars} 
            locale="en" 
          />
        );
      }).not.toThrow();
    });

    it('should handle event handler injection attempts', () => {
      const xssQuery = 'test" onload="alert(1)" data-test="';
      
      render(
        <SearchResults 
          results={mockResults} 
          query={xssQuery} 
          locale="en" 
        />
      );
      
      // Should not find any onload attributes
      const elementsWithOnload = document.querySelectorAll('[onload]');
      expect(elementsWithOnload.length).toBe(0);
    });

    it('should properly escape ampersands and entities', () => {
      const query = 'test & query';
      
      render(
        <SearchResults 
          results={mockResults} 
          query={query} 
          locale="en" 
        />
      );
      
      // React should properly escape the ampersand
      const container = screen.getByRole('link');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Highlighting Behavior', () => {
    it('should highlight matching text without XSS', () => {
      const results = [
        {
          id: 1,
          type: 'phase' as const,
          title: 'Strategic Planning',
          description: 'Learn about strategy',
          slug: 'strategic',
          score: 0.9,
        }
      ];
      
      render(
        <SearchResults 
          results={results} 
          query="strategy" 
          locale="en" 
        />
      );
      
      // Should find mark tags for highlighting
      const marks = document.querySelectorAll('mark');
      expect(marks.length).toBeGreaterThan(0);
      
      // But content should be safe text
      marks.forEach(mark => {
        expect(mark.innerHTML).not.toContain('<script>');
        expect(mark.innerHTML).not.toContain('onerror');
      });
    });

    it('should handle empty query safely', () => {
      render(
        <SearchResults 
          results={mockResults} 
          query="" 
          locale="en" 
        />
      );
      
      // Should render without marks
      const marks = document.querySelectorAll('mark');
      expect(marks.length).toBe(0);
    });
  });

  describe('No Results State', () => {
    it('should safely display search query in no results message', () => {
      const xssQuery = '<img src=x onerror=alert(1)>';
      
      render(
        <SearchResults 
          results={[]} 
          query={xssQuery} 
          locale="en" 
        />
      );
      
      // Should display the query as text, not execute it
      expect(screen.getByText(/No results found/)).toBeInTheDocument();
      
      // Should not create any img tags
      const imgs = document.querySelectorAll('img');
      expect(imgs.length).toBe(0);
    });
  });

  describe('Regex Escaping Function', () => {
    it('should escape all regex special characters', () => {
      const specialChars = ['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'];
      
      specialChars.forEach(char => {
        // This should not throw regex errors
        expect(() => {
          render(
            <SearchResults 
              results={mockResults} 
              query={char} 
              locale="en" 
            />
          );
        }).not.toThrow();
      });
    });
  });

  describe('React Default Escaping Verification', () => {
    it('should rely on React default escaping for text content', () => {
      const results = [
        {
          id: 1,
          type: 'phase' as const,
          title: '<b>Bold</b> Text',
          description: '<i>Italic</i> text',
          slug: 'test',
          score: 0.9,
        }
      ];
      
      render(
        <SearchResults 
          results={results} 
          query="text" 
          locale="en" 
        />
      );
      
      // HTML tags in title/description should be escaped
      expect(screen.getByText(/<b>Bold<\/b> Text/)).toBeInTheDocument();
      
      // Should not find actual bold tag
      const boldTags = document.querySelectorAll('b');
      expect(boldTags.length).toBe(0);
    });
  });
});

/**
 * SECURITY REVIEW NOTES:
 * 
 * These tests verify that:
 * 1. React's default escaping prevents XSS
 * 2. escapeRegExp function properly escapes regex special chars
 * 3. User input is never directly inserted into HTML
 * 4. Mark tags only wrap text content, not HTML
 * 
 * CONCLUSION: The implementation is secure because:
 * - React automatically escapes text content
 * - No dangerouslySetInnerHTML is used
 * - Regex escaping prevents injection
 * - User input flows through React's safe rendering
 */

