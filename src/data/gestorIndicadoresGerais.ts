// Tipo do bloco "Indicadores gerais" — os 4 cards de topo padronizados em cada
// aba inicial do gestor (Atendimentos, Abandonos, Performance e Workforce).
// Renderizados via KpiRingCard: o anel é a participação (0–100) e o centro
// mostra o número-chave (contagem, taxa ou %). Cada aba exporta seu próprio
// `indicadoresGerais` no respectivo data file.

/**
 * Destino de drill-down de um card-indicador (padrão indicador → registro):
 *  - `indicador`: Centro de Indicadores (`/gestor/indicadores?ind=`) — análise temporal.
 *  - `ocorrencias`: lista canônica de Ocorrências (Protocolo → jornada), com filtro.
 *  - `rota`: rota direta (ex.: uma tela de detalhe analítica).
 */
export type IndicadorTarget =
  | { kind: 'indicador'; ind: string }
  | { kind: 'ocorrencias'; query?: Record<string, string> }
  | { kind: 'rota'; to: string }

export interface IndicadorGeral {
  /** Rótulo do card. */
  label: string
  /** Preenchimento do anel (0–100) — normalmente a participação no total. */
  value: number
  /** Número exibido no centro do anel ("163", "26", "14,6%", "229%"). */
  display: string
  /** Variação opcional ("↑ 4 hoje"). */
  delta?: string
  deltaTone?: 'up' | 'down' | 'danger' | 'neutral'
  /** Linha de contexto/meta ("52% do total", "Meta: <10%"). */
  meta?: string
  /** Cor do anel (taxonomia: BOT/automatizado=primary, humano=success, fila=warning). */
  tone: 'primary' | 'success' | 'purple' | 'danger' | 'warning'
  /** Destino de drill-down ao clicar no card (opcional). */
  target?: IndicadorTarget
}
