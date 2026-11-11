import type { SolveResult } from '../lib/solver'

// Net RSC: corpo = 4 painéis [z, x, z, x] de altura y; abas de profundidade x/2 (nos
// painéis z) e z/2 (nos painéis x) no topo e na base. Desenho normalizado (maior lado = 100)
// para que traços, tracejados e fontes tenham espessura constante em qualquer escala.
export function FlatPattern({ result }: { result: SolveResult }) {
  const { x, y, z } = result
  const panels = [z, x, z, x]
  const W = panels.reduce((a, b) => a + b, 0)
  const flapMax = Math.max(x, z) / 2
  const H = y + 2 * flapMax
  const s = 100 / Math.max(W, H)
  const off = (100 - W * s) / 2 // centraliza o net horizontalmente no viewBox
  const pad = 14
  const vb = `${-pad} ${-pad} ${100 + 2 * pad} ${H * s + 2 * pad + 16}`
  const fill = '#e8c39e'
  const fillFlap = '#f0d9c0'

  let cx = 0
  const shapes: React.ReactNode[] = []
  const folds: React.ReactNode[] = []
  const dims: React.ReactNode[] = []
  let prevFd = 0
  panels.forEach((w, i) => {
    const fd = i % 2 === 0 ? x / 2 : z / 2
    shapes.push(<rect key={`b${i}`} x={cx} y={0} width={w} height={y} fill={fill} />)
    shapes.push(<rect key={`t${i}`} x={cx} y={-fd} width={w} height={fd} fill={fillFlap} />)
    shapes.push(<rect key={`bo${i}`} x={cx} y={y} width={w} height={fd} fill={fillFlap} />)
    folds.push(<line key={`f${i}t`} x1={cx} y1={0} x2={cx + w} y2={0} />)
    folds.push(<line key={`f${i}b`} x1={cx} y1={y} x2={cx + w} y2={y} />)
    if (i > 0) {
      const e = Math.max(prevFd, fd)
      folds.push(<line key={`v${i}`} x1={cx} y1={-e} x2={cx} y2={y + e} />)
    }
    prevFd = fd
    dims.push(<text key={`d${i}`} x={off + (cx + w / 2) * s} y={H * s + 5} textAnchor="middle">{w === x ? 'x' : 'z'}</text>)
    cx += w
  })

  return (
    <figure>
      <svg viewBox={vb} width="100%" role="img" aria-label="Planificado da caixa">
        <g transform={`translate(${off} 0) scale(${s})`}>
          {shapes}
          <rect x={0} y={-flapMax} width={W} height={y + 2 * flapMax} fill="none" stroke="#333" strokeWidth={0.4 / s} />
          <g stroke="#333" strokeWidth={0.4 / s} strokeDasharray={`${1.4 / s} ${1 / s}`}>
            {folds}
          </g>
        </g>
        {/* cotas de profundidade de aba (lado esquerdo do net) */}
        <g fontSize="6" fill="#333">
          <text x={off - 2} y={(-x / 4) * s} textAnchor="end" dominantBaseline="middle">{x / 2}</text>
          <text x={off - 2} y={(y + z / 4) * s} textAnchor="end" dominantBaseline="middle">{z / 2}</text>
          {dims}
          <text x={off + (z + x / 2) * s} y={H * s + 13} textAnchor="middle">y = {y} cm</text>
          <text x={off + W * s} y={H * s + 21} textAnchor="end">x={x} · y={y} · z={z} cm</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs text-stone-500">Planificado RSC — linhas tracejadas indicam dobras; cotas em cm.</figcaption>
    </figure>
  )
}
