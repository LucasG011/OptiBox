import type { ReactNode } from 'react'
import type { AxisConstraint, SolveInput } from '../lib/solver'

type AxisKey = 'x' | 'y' | 'z'
type Mode = 'livre' | 'fixa' | 'maxima'

const AXES: AxisKey[] = ['x', 'y', 'z']

export interface UiState {
  volume: string
  modes: Record<AxisKey, Mode>
  values: Record<AxisKey, string>
}

export const initialUi: UiState = {
  volume: '1000',
  modes: { x: 'livre', y: 'livre', z: 'livre' },
  values: { x: '', y: '', z: '' },
}

export function toSolveInput(ui: UiState): SolveInput {
  const input: SolveInput = { volume: Number(ui.volume) }
  for (const a of AXES) {
    const raw = ui.values[a]
    if (ui.modes[a] === 'livre' || raw === '') continue
    const c: AxisConstraint = ui.modes[a] === 'fixa' ? { fixed: Number(raw) } : { max: Number(raw) }
    input[a] = c
  }
  return input
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      {title && <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">{title}</h2>}
      {children}
    </section>
  )
}

export function Controls({ ui, onChange }: { ui: UiState; onChange: (ui: UiState) => void }) {
  const set = (patch: Partial<UiState>) => onChange({ ...ui, ...patch })
  return (
    <Card title="Parâmetros">
      <label className="mb-4 block text-sm text-stone-600">
        Volume (cm³)
        <input
          type="number"
          min="0"
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-lg font-semibold tabular-nums text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
          value={ui.volume}
          onChange={(e) => set({ volume: e.target.value })}
        />
      </label>
      <div className="space-y-3">
        {AXES.map((a) => (
          <div key={a} className="grid grid-cols-[2.5rem_1fr_1fr] items-center gap-3">
            <span className="font-medium text-stone-700">{a.toUpperCase()}</span>
            <select
              className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
              value={ui.modes[a]}
              onChange={(e) => set({ modes: { ...ui.modes, [a]: e.target.value as Mode } })}
            >
              <option value="livre">Livre</option>
              <option value="fixa">Fixa</option>
              <option value="maxima">Máxima</option>
            </select>
            <input
              type="number"
              min="0"
              disabled={ui.modes[a] === 'livre'}
              className="rounded-lg border border-stone-300 px-2 py-1.5 text-sm tabular-nums text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none disabled:bg-stone-100 disabled:text-stone-400"
              value={ui.values[a]}
              onChange={(e) => set({ values: { ...ui.values, [a]: e.target.value } })}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-stone-500">Restrições por eixo: fixa (valor exato) ou máxima (limite).</p>
    </Card>
  )
}
