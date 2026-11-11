import type { SolveResult } from '../lib/solver'

// Net RSC: corpo = 4 painéis [z, x, z, x] de altura y, abas (largura dos painéis,
// profundidade x/2) no topo e na base; dobras tracejadas; cotas em cm.
export function FlatPattern({ result }: { result: SolveResult }) {
  const { x, y, z } = result
  const panels = [z, x, z, x]
  const W = panels.reduce((a, b) => a + b, 0)
  const H = y + Math.max(x, z)
  const pad = Math.max(W, H) * 0.15
  const vb = `${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad + 18}`
  const stroke = '#333'

  let cx = 0
  const panelRects = panels.map((w, i) => {
    const isZ = i % 2 === 0 // painéis z: abas de profundidade x/2; painéis x: z/2
    const fd = isZ ? x / 2 : z / 2
    const el = (
      <g key={i}>
        <rect x={cx} y={0} width={w} height={y} fill="#e8c39e" stroke={stroke} />
        <rect x={cx} y={-fd} width={w} height={fd} fill="#f0d9c0" stroke={stroke} />
        <rect x={cx} y={y} width={w} height={fd} fill="#f0d9c0" stroke={stroke} />
        {/* dobras */}
        <line x1={cx} y1={0} x2={cx + w} y2={0} stroke={stroke} strokeDasharray="4 3" />
        <line x1={cx} y1={y} x2={cx + w} y2={y} stroke={stroke} strokeDasharray="4 3" />
        {i > 0 && <line x1={cx} y1={-Math.max(x, z) / 2} x2={cx} y2={y + Math.max(x, z) / 2} stroke={stroke} strokeDasharray="4 3" />}
      </g>
    )
    cx += w
    return el
  })

  return (
    <figure>
      <svg viewBox={vb} width="100%" role="img" aria-label="Planificado da caixa">
        {panelRects}
        {/* cotas */}
        <text x={0} y={y / 2} fontSize={Math.min(z, y) * 0.35} textAnchor="middle" dominantBaseline="middle">z</text>
        <text x={z} y={y / 2} fontSize={Math.min(x, y) * 0.35} textAnchor="middle" dominantBaseline="middle">x</text>
        <text x={2 * z + x} y={y / 2} fontSize={Math.min(z, y) * 0.35} textAnchor="middle" dominantBaseline="middle">z</text>
        <text x={W - x / 2} y={y / 2} fontSize={Math.min(x, y) * 0.35} textAnchor="middle" dominantBaseline="middle">x</text>
        <text x={z + x / 2} y={H + 2} fontSize={Math.min(x, y) * 0.35} textAnchor="middle" dominantBaseline="hanging">y={y} cm</text>
        <text x={2} y={-Math.max(x, z) / 2 + 1} fontSize={Math.min(x, y) * 0.35} dominantBaseline="hanging">abas: {x / 2} e {z / 2} cm</text>
        <text x={W} y={H + 14} fontSize={Math.min(x, y) * 0.35} textAnchor="end">
          x={x} · y={y} · z={z} cm
        </text>
      </svg>
      <figcaption>Planificado RSC — linhas tracejadas indicam dobras.</figcaption>
    </figure>
  )
}
