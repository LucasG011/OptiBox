import { describe, expect, it } from 'vitest'
import { solve } from './solver'

const near = (a: number, b: number, tol = 0.15) => Math.abs(a - b) <= tol

describe('solve', () => {
  it('sem restrições retorna ótimo RSC (x=z, y=2^(2/3)·V^(1/3))', () => {
    const r = solve({ volume: 1000 })
    expect(r.feasible).toBe(true)
    expect(near(r.x, 7.94, 0.3)).toBe(true)
    expect(near(r.y, 15.87, 0.5)).toBe(true)
    expect(near(r.z, 7.94, 0.3)).toBe(true)
    expect(near(r.x * r.y * r.z, 1000, 15)).toBe(true)
  })

  it('max não vinculante não altera o ótimo', () => {
    const r = solve({ volume: 1000, x: { max: 20 } })
    expect(r.feasible).toBe(true)
    expect(near(r.y, 15.87, 0.5)).toBe(true)
    expect(near(r.areaCm2, 755.95, 6)).toBe(true)
  })

  it('dimensão fixa respeitada', () => {
    const r = solve({ volume: 1000, y: { fixed: 5 } })
    expect(r.y).toBe(5)
    expect(near(r.x, 14.1, 0.5)).toBe(true)
    expect(near(r.z, 14.1, 0.5)).toBe(true)
    expect(near(r.x * r.y * r.z, 1000, 15)).toBe(true)
  })

  it('ativa restrição máxima', () => {
    const r = solve({ volume: 1000, y: { max: 5 } })
    expect(r.y).toBe(5)
    expect(r.feasible).toBe(true)
  })

  it('s resolve com duas restrições', () => {
    const r = solve({ volume: 1000, x: { max: 5 }, z: { max: 5 } })
    expect(r.x).toBe(5)
    expect(r.z).toBe(5)
    expect(near(r.y, 40, 0.5)).toBe(true)
  })

  it('rejeita entrada inválida', () => {
    expect(solve({ volume: 0 }).feasible).toBe(false)
    expect(solve({ volume: -1 }).feasible).toBe(false)
    expect(solve({ volume: 100, x: { fixed: 10, max: 5 } }).feasible).toBe(false)
    expect(solve({ volume: 1000, x: { max: 5 }, y: { fixed: 10 }, z: { max: 5 } }).feasible).toBe(false)
  })

  it('lida com extremos de volume', () => {
    for (const v of [1e6, 0.01]) {
      const r = solve({ volume: v })
      expect(r.feasible).toBe(true)
      expect(Number.isNaN(r.x) || Number.isNaN(r.y) || Number.isNaN(r.z)).toBe(false)
      expect(r.x).toBeGreaterThan(0)
      expect(r.y).toBeGreaterThan(0)
      expect(r.z).toBeGreaterThan(0)
    }
  })

  it('área e custo coerentes com RSC', () => {
    const r = solve({ volume: 1000 })
    const areaCm2 = 2 * (r.x + r.z) * r.y + 4 * r.x * r.z
    expect(near(r.areaCm2, areaCm2, 1)).toBe(true)
    expect(near(r.areaM2, areaCm2 / 1e4, 1e-4)).toBe(true)
    expect(near(r.cost, r.areaM2 * 8.5, 1e-4)).toBe(true)
  })
})
