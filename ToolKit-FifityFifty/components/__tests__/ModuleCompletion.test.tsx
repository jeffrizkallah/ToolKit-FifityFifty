import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleCompletion, ModuleCompletionStatus } from '../ModuleCompletion';
import { ProgressProvider } from '@/lib/contexts/ProgressContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('ModuleCompletion', () => {
  describe('Button Variant (default)', () => {
    it('should render uncompleted state by default', () => {
      render(<ModuleCompletion moduleId={1} />, { wrapper });
      
      expect(screen.getByRole('button')).toHaveTextContent('markComplete');
    });

    it('should toggle completion on click', () => {
      render(<ModuleCompletion moduleId={1} />, { wrapper });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(button).toHaveTextContent('markIncomplete');
    });

    it('should toggle back to incomplete', () => {
      render(<ModuleCompletion moduleId={1} />, { wrapper });
      
      const button = screen.getByRole('button');
      
      // Mark complete
      fireEvent.click(button);
      expect(button).toHaveTextContent('markIncomplete');
      
      // Mark incomplete
      fireEvent.click(button);
      expect(button).toHaveTextContent('markComplete');
    });
  });

  describe('Icon Variant', () => {
    it('should render icon-only button', () => {
      render(<ModuleCompletion moduleId={1} variant="icon" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'markComplete');
    });

    it('should toggle completion with icon variant', () => {
      render(<ModuleCompletion moduleId={1} variant="icon" />, { wrapper });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(button).toHaveAttribute('aria-label', 'markIncomplete');
    });
  });

  describe('Badge Variant', () => {
    it('should not render badge when incomplete', () => {
      const { container } = render(
        <ModuleCompletion moduleId={1} variant="badge" />, 
        { wrapper }
      );
      
      expect(container.textContent).toBe('');
    });

    it('should render badge when complete', () => {
      render(<ModuleCompletion moduleId={1} variant="badge" />, { wrapper });
      
      // First mark it complete
      const { rerender } = render(
        <ModuleCompletion moduleId={1} variant="button" />, 
        { wrapper }
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Then check badge variant
      rerender(<ModuleCompletion moduleId={1} variant="badge" />);
      
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label for icon variant', () => {
      render(<ModuleCompletion moduleId={1} variant="icon" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should update ARIA label when state changes', () => {
      render(<ModuleCompletion moduleId={1} variant="icon" />, { wrapper });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'markComplete');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'markIncomplete');
    });
  });

  describe('Multiple Instances', () => {
    it('should maintain independent state for different modules', () => {
      render(
        <div>
          <ModuleCompletion moduleId={1} />
          <ModuleCompletion moduleId={2} />
        </div>, 
        { wrapper }
      );
      
      const buttons = screen.getAllByRole('button');
      
      // Mark first module complete
      fireEvent.click(buttons[0]);
      
      expect(buttons[0]).toHaveTextContent('markIncomplete');
      expect(buttons[1]).toHaveTextContent('markComplete');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(
        <ModuleCompletion moduleId={1} className="custom-class" />, 
        { wrapper }
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});

describe('ModuleCompletionStatus', () => {
  it('should not render when module is incomplete', () => {
    const { container } = render(
      <ModuleCompletionStatus moduleId={1} />, 
      { wrapper }
    );
    
    expect(container.textContent).toBe('');
  });

  it('should render completion status when module is complete', () => {
    // First mark module as complete
    const { rerender } = render(
      <ModuleCompletion moduleId={1} />, 
      { wrapper }
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Then check status component
    rerender(<ModuleCompletionStatus moduleId={1} />);
    
    expect(screen.getByText('completed')).toBeInTheDocument();
  });
});

