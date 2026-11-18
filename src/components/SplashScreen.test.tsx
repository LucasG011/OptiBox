import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SplashScreen } from './SplashScreen'
import '@testing-library/jest-dom'

describe('SplashScreen', () => {
  it('calls onComplete after animation duration', async () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    
    // Should show branding immediately
    expect(screen.getByText('Opti')).toBeInTheDocument()
    
    // Should show rotating SVG box
    const img = screen.getByAltText('OptiBox 3D box')
    expect(img).toBeInTheDocument()
    expect(img).toHaveClass('animate-spin')
    
    // Should call onComplete after ~3s
    await waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 3500 })
  })

  it('skips animation when prefers-reduced-motion', async () => {
    const onComplete = vi.fn()
    // Mock matchMedia to return reduced motion
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    })
    
    render(<SplashScreen onComplete={onComplete} />)
    
    // Should call onComplete immediately (or very fast)
    await waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 100 })
  })
})