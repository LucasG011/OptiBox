import type { SolveResult } from '../lib/solver'

export function FlatPattern({ result }: { result: SolveResult }) {
  const { x, y, z } = result
  const panels = [z, x, z, x]
  const bodyW = panels.reduce((a, b) => a + b, 0)

  // Largura da aba de colagem (Glue Tab) e chanfro superior/inferior
  const tabW = Math.min(3.5, Math.max(2.5, Math.min(x, z) * 0.12))
  const bevel = Math.min(tabW * 0.6, y * 0.15)

  // Largura total considerando a aba de colagem
  const totalW = bodyW + tabW

  // Em uma caixa RSC padrão, todas as abas têm metade da menor dimensão da base
  const fd = Math.min(x, z) / 2
  const H = y + 2 * fd

  const s = 100 / Math.max(totalW, H)
  // Centraliza o conjunto todo (glue tab + 4 painéis) no SVG
  const off = (100 - totalW * s) / 2 + tabW * s

  const padX = 32
  const padY = 16
  const vb = `${-padX} ${-padY} ${100 + 2 * padX} ${H * s + 2 * padY + 12}`
  const fill = '#e8c39e'
  const fillFlap = '#f0d9c0'
  const fillTab = '#dfba93'

  let cx = 0
  const shapes: React.ReactNode[] = []
  const cuts: React.ReactNode[] = []
  const folds: React.ReactNode[] = []
  const panelLabels: React.ReactNode[] = []

  // Polígono chanfrado da Glue Tab (posicionada à esquerda de x = 0)
  const glueTabPoints = `0,0 ${-tabW},${bevel} ${-tabW},${y - bevel} 0,${y}`

  panels.forEach((w, i) => {
    const isZ = i % 2 === 0
    const axisName = isZ ? 'z' : 'x'

    // Preenchimento do corpo e das abas
    shapes.push(<rect key={`b${i}`} x={cx} y={0} width={w} height={y} fill={fill} />)
    shapes.push(<rect key={`t${i}`} x={cx} y={-fd} width={w} height={fd} fill={fillFlap} />)
    shapes.push(<rect key={`bo${i}`} x={cx} y={y} width={w} height={fd} fill={fillFlap} />)

    // Contorno de CORTE das abas (linhas contínuas)
    cuts.push(<rect key={`ct${i}`} x={cx} y={-fd} width={w} height={fd} fill="none" />)
    cuts.push(<rect key={`cbo${i}`} x={cx} y={y} width={w} height={fd} fill="none" />)

    // Linhas de DOBRA horizontais (entre corpo e abas)
    folds.push(<line key={`f${i}t`} x1={cx} y1={0} x2={cx + w} y2={0} />)
    folds.push(<line key={`f${i}b`} x1={cx} y1={y} x2={cx + w} y2={y} />)

    // Linhas de DOBRA verticais (agora inclui i === 0 por conta da glue tab)
    folds.push(<line key={`v${i}`} x1={cx} y1={0} x2={cx} y2={y} />)

    // Rótulo da largura de cada painel
    panelLabels.push(
      <text
        key={`d${i}`}
        x={off + (cx + w / 2) * s}
        y={(y + 2 * fd) * s + 7}
        textAnchor="middle"
        fontSize="4.5"
        fill="#444"
      >
        {axisName} = {w} cm
      </text>
    )

    cx += w
  })

  const bodyTopY = fd * s

  return (
    <figure className="w-full">
      <h2 className="mb-3 text-center text-sl font-semibold uppercase tracking-wide text-amber-600">
        Planificação da Caixa
      </h2>
      <svg viewBox={vb} width="100%" role="img" aria-label="Planificado da caixa com aba de colagem">
        <g transform={`translate(${off} ${bodyTopY}) scale(${s})`}>
          {/* Preenchimento da Glue Tab e dos painéis */}
          <polygon points={glueTabPoints} fill={fillTab} />
          {shapes}

          {/* Contornos de CORTE (linhas contínuas) */}
          <g stroke="#333" strokeWidth={0.4 / s} fill="none">
            {/* Corte externo da Glue Tab (3 lados externos, sem fechar em x=0 que é dobra) */}
            <polyline points={glueTabPoints} />
            {/* Borda direita final do corpo */}
            <line x1={bodyW} y1={0} x2={bodyW} y2={y} />
            {/* Cortes das abas superiores e inferiores */}
            {cuts}
          </g>

          {/* Linhas de DOBRA (tracejadas) */}
          <g stroke="#333" strokeWidth={0.4 / s} strokeDasharray={`${1.4 / s} ${1 / s}`}>
            {folds}
          </g>
        </g>

        {/* Rótulos e Cotas */}
        <g fill="#333">
          {panelLabels}

          {/* Rótulo da Glue Tab */}
          <text
            x={off - (tabW * s) / 2}
            y={bodyTopY + (y * s) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="3.5"
            fill="#444"
            transform={`rotate(-90, ${off - (tabW * s) / 2}, ${bodyTopY + (y * s) / 2})`}
          >
            cola ({Number(tabW.toFixed(1))} cm)
          </text>

          {/* Cota da Altura y */}
          <g transform={`translate(${off + bodyW * s + 4} ${bodyTopY + (y * s) / 2})`}>
            <text textAnchor="start" dominantBaseline="middle" fontSize="5" fontWeight="500" fill="#222">
              y = {y} cm
            </text>
          </g>

          {/* Cota da profundidade da aba (topo esquerdo) */}
          <text x={off - 4} y={bodyTopY - (fd / 2) * s} textAnchor="end" dominantBaseline="middle" fontSize="4" fill="#555">
            {fd} cm
          </text>

          {/* Resumo no rodapé */}
          <text x={50} y={H * s + 16} textAnchor="middle" fontSize="4.5" fill="#666">
            Dimensões externas: {x} × {y} × {z} cm
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-stone-500">
        Planificado RSC com aba de colagem — linhas contínuas indicam corte; tracejadas indicam dobras; cotas em cm.
      </figcaption>
    </figure>
  )
}