import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Controls, initialUi, type UiState } from './Controls'
import '@testing-library/jest-dom'

describe('Controls', () => {
  it('renders input fields and calculate button', () => {
    const onChange = vi.fn()
    const onCalculate = vi.fn()
    render(<Controls ui={initialUi} onChange={onChange} onCalculate={onCalculate} />)

    expect(screen.getByLabelText('Volume (cm³)')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('Y')).toBeInTheDocument()
    expect(screen.getByText('Z')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular/i })).toBeInTheDocument()
  })

  it('calls onChange when inputs change', () => {
    const onChange = vi.fn()
    const onCalculate = vi.fn()
    render(<Controls ui={initialUi} onChange={onChange} onCalculate={onCalculate} />)

    const volumeInput = screen.getByLabelText('Volume (cm³)')
    fireEvent.change(volumeInput, { target: { value: '2000' } })

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ volume: '2000' })
    )
  })

  it('calls onCalculate when button is clicked', () => {
    const onChange = vi.fn()
    const onCalculate = vi.fn()
    render(<Controls ui={initialUi} onChange={onChange} onCalculate={onCalculate} />)

    const button = screen.getByRole('button', { name: /calcular/i })
    fireEvent.click(button)

    expect(onCalculate).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables value inputs when mode is livre', () => {
    const onChange = vi.fn()
    const onCalculate = vi.fn()
    const ui: UiState = {
      ...initialUi,
      modes: { x: 'livre', y: 'fixa', z: 'maxima' },
    }
    render(<Controls ui={ui} onChange={onChange} onCalculate={onCalculate} />)

    expect(screen.getByLabelText('Valor X')).toBeDisabled()
    expect(screen.getByLabelText('Valor Y')).not.toBeDisabled()
    expect(screen.getByLabelText('Valor Z')).not.toBeDisabled()
  })
})