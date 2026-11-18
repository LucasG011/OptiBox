import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import App from './App'
import '@testing-library/jest-dom'

describe('App', () => {
  it('shows splash then main UI', async () => {
    render(<App />)

    // Splash visible initially (text split across span, check for partial)
    expect(screen.getByText('Opti')).toBeInTheDocument()

    // After transition, main UI appears - look for Controls section title
    await waitFor(() => {
      expect(screen.getByText('Parâmetros')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('calculates result only when Calcular button is clicked', async () => {
    render(<App />)

    // Wait for splash to disappear
    await waitFor(() => {
      expect(screen.getByText('Parâmetros')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Initially no result displayed (Box3D/FlatPattern not rendered)
    expect(screen.queryByText('Área de papelão')).not.toBeInTheDocument()

    // Click Calcular button
    const calculateButton = screen.getByRole('button', { name: /calcular/i })
    fireEvent.click(calculateButton)

    // Result should appear
    await waitFor(() => {
      expect(screen.getByText('Área de papelão')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})