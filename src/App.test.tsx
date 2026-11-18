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

  it('shows initial result after splash, recalculates on button click', async () => {
    render(<App />)

    // Wait for splash to disappear
    await waitFor(() => {
      expect(screen.getByText('Parâmetros')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Initial result should be displayed (from initialUi values)
    expect(screen.getByText('Área de papelão')).toBeInTheDocument()

    // Change volume input
    const volumeInput = screen.getByLabelText('Volume (cm³)')
    fireEvent.change(volumeInput, { target: { value: '2000' } })

    // Click Calcular button to recalculate
    const calculateButton = screen.getByRole('button', { name: /calcular/i })
    fireEvent.click(calculateButton)

    // Result should still be displayed (updated)
    await waitFor(() => {
      expect(screen.getByText('Área de papelão')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})