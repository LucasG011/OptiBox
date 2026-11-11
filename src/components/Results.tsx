import type { SolveResult } from '../lib/solver'
import { Card } from './Controls'

export function Results({ result }: { result: SolveResult | null }) {
  if (!result) return null
  if (!result.feasible)
    return (
      <Card title="Resultado">
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{result.message}</p>
      </Card>
    )
  return (
    <Card title="Resultado">
      <div className="grid grid-cols-3 gap-2 text-center">
        {([['x', result.x], ['y', result.y], ['z', result.z]] as const).map(([k, v]) => (
          <div key={k} className="rounded-lg bg-stone-50 py-2">
            <div className="text-xl font-semibold tabular-nums text-amber-600">{v} cm</div>
            <div className="text-xs text-stone-500">{k}</div>
          </div>
        ))}
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between border-t border-stone-200 pt-2">
          <dt className="text-stone-500">Área de papelão</dt>
          <dd className="tabular-nums text-stone-800">{result.areaCm2.toFixed(1)} cm² · {result.areaM2.toFixed(3)} m²</dd>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-2">
          <dt className="text-stone-500">Custo estimado</dt>
          <dd className="font-semibold tabular-nums text-amber-600">R$ {result.cost.toFixed(2)}</dd>
        </div>
      </dl>
    </Card>
  )
}
