import type { SolveResult } from '../lib/solver'

// Net RSC: corpo = 4 painéis [z, x, z, x] de altura y; abas de profundidade x/2 (nos
// painéis z) e z/2 (nos painéis x) no topo e na base. Desenho normalizado (maior lado = 100).
export function FlatPattern({ result }: { result: SolveResult }) {
  const { x, y, z } = result
  const panels = [z, x, z, x]
  const W = panels.reduce((a, b) => a + b, 0)
  const flapMax = Math.max(x, z) / 2
  const H = y + 2 * flapMax
  const s = 100 / Math.max(W, H)
  const off = (100 - W * s) / 2 // centraliza o net no SVG
  const padX = 32
  const padY = 16
  const vb = `${-padX} ${-padY} ${100 + 2 * padX} ${H * s + 2 * padY + 12}`
  const fill = '#e8c39e'
  const fillFlap = '#f0d9c0'

  let cx = 0
  let prevFd = 0
  const shapes: React.ReactNode[] = []
  const folds: React.ReactNode[] = []
  const panelLabels: React.ReactNode[] = []

  panels.forEach((w, i) => {
    const isZ = i % 2 === 0
    const axisName = isZ ? 'z' : 'x'
    const fd = isZ ? x / 2 : z / 2

    // Retângulos do corpo e das abas
    shapes.push(<rect key={`b${i}`} x={cx} y={0} width={w} height={y} fill={fill} />)
    shapes.push(<rect key={`t${i}`} x={cx} y={-fd} width={w} height={fd} fill={fillFlap} />)
    shapes.push(<rect key={`bo${i}`} x={cx} y={y} width={w} height={fd} fill={fillFlap} />)

    // Dobras horizontais
    folds.push(<line key={`f${i}t`} x1={cx} y1={0} x2={cx + w} y2={0} />)
    folds.push(<line key={`f${i}b`} x1={cx} y1={y} x2={cx + w} y2={y} />)

    // Dobras verticais
    if (i > 0) {
      const e = Math.max(prevFd, fd)
      folds.push(<line key={`v${i}`} x1={cx} y1={-e} x2={cx} y2={y + e} />)
    }
    prevFd = fd

    // Rótulo da largura de cada painel (abaixo do net)
    panelLabels.push(
      <text key={`d${i}`} x={off + (cx + w / 2) * s} y={(y + flapMax) * s + 7} textAnchor="middle" fontSize="4.5" fill="#444">
        {axisName} = {w} cm
      </text>
    )

    cx += w
  })

  // Coordenadas calculadas no espaço do viewBox (após escala e offset)
  const bodyTopY = flapMax * s

  return (
    <figure className="w-full">
      <svg viewBox={vb} width="100%" role="img" aria-label="Planificado da caixa">
        {/* Grupo com a geometria escalada do net */}
        <g transform={`translate(${off} ${bodyTopY}) scale(${s})`}>
          {shapes}
          <rect x={0} y={-flapMax} width={W} height={H} fill="none" stroke="#333" strokeWidth={0.4 / s} />
          <g stroke="#333" strokeWidth={0.4 / s} strokeDasharray={`${1.4 / s} ${1 / s}`}>
            {folds}
          </g>
        </g>

        {/* Rótulos e Cotas */}
        <g fill="#333">
          {/* Rótulos dos 4 painéis abaixo de cada coluna */}
          {panelLabels}

          {/* Cota da Altura y (lado direito do corpo) */}
          <g transform={`translate(${off + W * s + 4} ${bodyTopY + (y * s) / 2})`}>
            <text textAnchor="start" dominantBaseline="middle" fontSize="5" fontWeight="500" fill="#222">
              y = {y} cm
            </text>
          </g>

          {/* Profundidade das abas (topo e base) */}
          <text x={off - 5} y={bodyTopY - (x / 4) * s} textAnchor="end" dominantBaseline="middle" fontSize="4" fill="#555">
            {x / 2} cm
          </text>

          {x !== z && (
            <text x={off - 5} y={bodyTopY + (y + z / 4) * s} textAnchor="end" dominantBaseline="middle" fontSize="4" fill="#555">
              {z / 2} cm
            </text>
          )}

          {/* Resumo com dimensões no rodapé */}
          <text x={50} y={(H * s) + 16} textAnchor="middle" fontSize="4.5" fill="#666">
            Dimensões externas: {x} × {y} × {z} cm
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-stone-500">
        Planificado RSC — linhas tracejadas indicam dobras; cotas em cm.
      </figcaption>
    </figure>
  )
}
