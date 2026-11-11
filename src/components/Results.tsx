import type { SolveResult } from '../lib/solver'

export function Results({ result }: { result: SolveResult | null }) {
  if (!result) return null
  if (!result.feasible) return <p role="alert" style={{ color: 'crimson' }}>{result.message}</p>
  return (
    <section>
      <h2>Resultado</h2>
      <ul>
        <li>Largura (x): {result.x} cm</li>
        <li>Altura (y): {result.y} cm</li>
        <li>Comprimento (z): {result.z} cm</li>
        <li>Área de papelão: {result.areaCm2.toFixed(1)} cm² ({result.areaM2.toFixed(3)} m²)</li>
        <li>Custo estimado: R$ {result.cost.toFixed(2)}</li>
      </ul>
    </section>
  )
}
