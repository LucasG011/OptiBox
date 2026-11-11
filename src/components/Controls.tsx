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

export function Controls({ ui, onChange }: { ui: UiState; onChange: (ui: UiState) => void }) {
  const set = (patch: Partial<UiState>) => onChange({ ...ui, ...patch })
  return (
    <section>
      <label>
        Volume (cm³){' '}
        <input
          type="number"
          min="0"
          value={ui.volume}
          onChange={(e) => set({ volume: e.target.value })}
        />
      </label>
      <table>
        <thead>
          <tr><th>Eixo</th><th>Restrição</th><th>Valor (cm)</th></tr>
        </thead>
        <tbody>
          {AXES.map((a) => (
            <tr key={a}>
              <td>{a.toUpperCase()}</td>
              <td>
                <select
                  value={ui.modes[a]}
                  onChange={(e) => set({ modes: { ...ui.modes, [a]: e.target.value as Mode } })}
                >
                  <option value="livre">Livre</option>
                  <option value="fixa">Fixa</option>
                  <option value="maxima">Máxima</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  disabled={ui.modes[a] === 'livre'}
                  value={ui.values[a]}
                  onChange={(e) => set({ values: { ...ui.values, [a]: e.target.value } })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
