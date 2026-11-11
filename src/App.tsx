import { useState } from 'react'
import { solve, type SolveInput, type SolveResult } from './lib/solver'
import { Controls, initialUi, toSolveInput, type UiState } from './components/Controls'
import { Results } from './components/Results'
import { Box3D } from './components/Box3D'
import './App.css'

export default function App() {
  const [ui, setUi] = useState<UiState>(initialUi)
  const [result, setResult] = useState<SolveResult | null>(null)

  const recalc = (next: UiState) => {
    setUi(next)
    const input: SolveInput = toSolveInput(next)
    setResult(Number.isFinite(input.volume) && next.volume.trim() !== '' ? solve(input) : null)
  }

  return (
    <main>
      <h1>OptiBox</h1>
      <Controls ui={ui} onChange={recalc} />
      <Results result={result} />
      {result?.feasible && (
        <section style={{ height: 400 }}>
          <Box3D result={result} />
        </section>
      )}
    </main>
  )
}
