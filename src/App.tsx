import { useState } from 'react'
import { solve, type SolveInput, type SolveResult } from './lib/solver'
import { Controls, initialUi, toSolveInput, type UiState } from './components/Controls'
import { Results } from './components/Results'
import { Box3D } from './components/Box3D'
import { FlatPattern } from './components/FlatPattern'

export default function App() {
  const [ui, setUi] = useState<UiState>(initialUi)
  const [result, setResult] = useState<SolveResult | null>(() => solve(toSolveInput(initialUi)))

  const recalc = (next: UiState) => {
    setUi(next)
    const input: SolveInput = toSolveInput(next)
    setResult(Number.isFinite(input.volume) && next.volume.trim() !== '' ? solve(input) : null)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Opti<span className="text-amber-600">Box</span>
        </h1>
        <p className="mt-1 text-sm text-stone-500">Dimensões ótimas de caixa com o mínimo de papelão</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <Controls ui={ui} onChange={recalc} />
          <Results result={result} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          {result?.feasible && (
            <>
              <div className="h-96 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
                <Box3D result={result} />
              </div>
              <div className="rounded-xl border border-stone-200 p-5 shadow-sm">
                <FlatPattern result={result} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
