import { MATERIAL_COST_PER_M2 } from './config'

// Abas RSC reais: 4 abas topo + 4 base, pares que se encontram no centro → área de abas = 4xz
const areaCm2Of = ([x, y, z]: Dims) => 2 * (x + z) * y + 4 * x * z
export interface AxisConstraint {
  fixed?: number
  max?: number
}

export interface SolveInput {
  volume: number
  x?: AxisConstraint
  y?: AxisConstraint
  z?: AxisConstraint
}

export interface SolveResult {
  x: number
  y: number
  z: number
  areaCm2: number
  areaM2: number
  cost: number
  feasible: boolean
  message?: string
}

type Dims = [number, number, number]

const infeasible = (message: string): SolveResult => ({
  x: 0, y: 0, z: 0, areaCm2: 0, areaM2: 0, cost: 0, feasible: false, message,
})

const round1 = (v: number) => Math.round(v * 10) / 10

function finish(dims: Dims): SolveResult {
  const [x, y, z] = dims.map(round1) as Dims
  const areaCm2 = areaCm2Of([x, y, z])
  const areaM2 = areaCm2 / 1e4
  return { x, y, z, areaCm2, areaM2, cost: areaM2 * MATERIAL_COST_PER_M2, feasible: true }
}

// 1D numérico: grade logarítmica + refino por seção áurea no melhor trecho
function minimize1D(f: (a: number) => number, lo: number, hi: number): number {
  const n = 120
  const logLo = Math.log(lo)
  const logHi = Math.log(hi)
  let best = 0
  let bestV = Infinity
  for (let i = 0; i <= n; i++) {
    const a = Math.exp(logLo + (logHi - logLo) * (i / n))
    const v = f(a)
    if (v < bestV) { bestV = v; best = i }
  }
  const step = (logHi - logLo) / n
  let a0 = Math.max(logLo, Math.log(Math.exp(logLo + step * best)) - step * 2)
  let a1 = Math.min(logHi, Math.log(Math.exp(logLo + step * best)) + step * 2)
  const phi = 0.6180339887498949
  for (let i = 0; i < 60; i++) {
    const m0 = a1 - phi * (a1 - a0)
    const m1 = a0 + phi * (a1 - a0)
    if (f(Math.exp(m0)) < f(Math.exp(m1))) a1 = m1
    else a0 = m0
  }
  return Math.exp((a0 + a1) / 2)
}

export function solve(input: SolveInput): SolveResult {
  const V = input.volume
  if (!(V > 0) || !Number.isFinite(V)) return infeasible('Volume deve ser um número maior que zero')

  const specs = [input.x, input.y, input.z]
  for (const s of specs) {
    if (s?.fixed !== undefined && (!(s.fixed > 0) || !Number.isFinite(s.fixed)))
      return infeasible('Dimensão fixa deve ser maior que zero')
    if (s?.max !== undefined && (!(s.max > 0) || !Number.isFinite(s.max)))
      return infeasible('Dimensão máxima deve ser maior que zero')
    if (s?.fixed !== undefined && s?.max !== undefined && s.fixed > s.max)
      return infeasible('Dimensão fixa não pode ser maior que a máxima')
  }

  const hasFixed = specs.some((s) => s?.fixed !== undefined)
  if (hasFixed) {
    const fixedProduct = specs.reduce((p, s) => p * (s?.fixed ?? 1), 1)
    if (fixedProduct > V) return infeasible('Dimensões fixas excedem o volume')
  }
  const maxProduct = specs.reduce((p, s) => p * (s?.max ?? Infinity), 1)
  if (maxProduct < V) return infeasible('Dimensões máximas não comportam o volume')

  const withMax = [0, 1, 2].filter((i) => specs[i]?.max !== undefined)
  const free = [0, 1, 2].filter((i) => specs[i]?.fixed === undefined)

  let best: Dims | null = null
  let bestArea = Infinity

  const consider = (dims: Dims) => {
    // factibilidade dura: fixed e max
    for (let i = 0; i < 3; i++) {
      const f = specs[i]?.fixed
      const m = specs[i]?.max
      if (f !== undefined && Math.abs(dims[i] - f) > 1e-9) return
      if (m !== undefined && dims[i] > m * (1 + 1e-9)) return
    }
    if (Math.abs(dims[0] * dims[1] * dims[2] - V) > V * 1e-3) return
    const a = areaCm2Of(dims)
    if (a < bestArea) { bestArea = a; best = dims }
  }

  // caso fechado: nenhum clamp, sem fixed → mínimo de 2(x+z)y+4xz: y=k, x=k/2, z=k/3, k=∛(6V)
  if (!hasFixed && withMax.length === 0) {
    const k = Math.cbrt(6 * V)
    consider([k / 2, k, k / 3])
  } else {
    // enumerar subconjuntos de max ativos
    for (let mask = 0; mask < 1 << withMax.length; mask++) {
      const dims: Dims = [0, 0, 0]
      let known = 1
      for (let i = 0; i < 3; i++) {
        if (specs[i]?.fixed !== undefined) { dims[i] = specs[i]!.fixed!; known *= dims[i] }
      }
      withMax.forEach((axis, j) => {
        if (mask & (1 << j)) { dims[axis] = specs[axis]!.max!; known *= dims[axis] }
      })
      const f = free.filter((i) => dims[i] === 0)
      if (f.length === 0) {
        if (Math.abs(known - V) <= V * 1e-9) consider([...dims] as Dims)
      } else if (f.length === 1) {
        const [i] = f
        dims[i] = V / known
        consider([...dims] as Dims)
      } else if (f.length === 2) {
        const [i, j] = f
        // limites: max de i e de j; chute central pela média geométrica
        const guess = Math.sqrt(V / known)
        const iMax = specs[i]?.max
        const jMax = specs[j]?.max
        const lo = jMax !== undefined ? Math.max(V / (known * jMax), 1e-9) : guess / 100
        const hi = iMax !== undefined ? iMax : guess * 100
        if (lo >= hi) continue
        const fObj = (a: number) => {
          const d = [...dims] as Dims
          d[i] = a
          d[j] = V / (a * known)
          return areaCm2Of(d)
        }
        dims[i] = minimize1D(fObj, lo, hi)
        dims[j] = V / (dims[i] * known)
        consider([...dims] as Dims)
      }
    }
  }

  if (!best) return infeasible('Sem solução com as restrições informadas')
  return finish(best as Dims)
}
