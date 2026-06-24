// Fixtures da aba "Abandonos e desistência" — Figma 7900:111365.
import type { IndicadorGeral } from '@/data/gestorIndicadoresGerais'

// Indicadores gerais (4 cards de topo). Total 23 (= porCanal.total); quebra
// BOT/Humano coerente com `comparativo` (6 + 17 = 23). 4º card: taxa geral de
// abandono — KPI-resumo que o gestor acompanha ao longo do tempo.
// Convenção de cor: BOT=primary, humano=success (identidade), taxa=warning.
export const indicadoresGerais: IndicadorGeral[] = [
  {
    label: 'Abandonos',
    value: 100,
    display: '23',
    delta: '↑ 2 hoje',
    deltaTone: 'danger',
    meta: 'desistências no período',
    tone: 'danger',
    target: { kind: 'ocorrencias', query: { stage: 'fila' } },
  },
  {
    label: 'No BOT',
    value: 26,
    display: '6',
    meta: '26% dos abandonos',
    tone: 'primary',
    target: { kind: 'ocorrencias', query: { stage: 'automatizado' } },
  },
  {
    label: 'No humano',
    value: 74,
    display: '17',
    meta: '74% · 2,8× o BOT',
    tone: 'success',
    target: { kind: 'ocorrencias', query: { stage: 'humano' } },
  },
  {
    label: 'Taxa de abandono',
    value: 14.6,
    display: '14,6%',
    delta: '↑ 1,1% hoje',
    deltaTone: 'danger',
    meta: 'Meta: < 10%',
    tone: 'warning',
    target: { kind: 'indicador', ind: 'abandono' },
  },
]

// ── Filas de abandono (agrupador) ────────────────────────────────────────────
// Fonte única do "abandono por fila" — reutilizada pela aba e pela tela de
// detalhe. Foco do gestor: total de abandono · % no BOT · % no humano (sem
// volume). Nomes de fila canônicos (ver gestorTaxonomia) p/ o drill-down casar
// com a lista de Ocorrências. Abandonos somam 23 (= porCanal.total).
export type AbandonoStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type FilaAbandonoLinha = {
  fila: string
  abandonos: number
  bot: number // % de abandono no BOT
  humana: number // % de abandono na fila humana
  origem: 'BOT' | 'Humano' | 'Misto'
  status: AbandonoStatus
}

export const filasAbandono: FilaAbandonoLinha[] = [
  { fila: 'Reembolso', abandonos: 8, bot: 15, humana: 2, origem: 'BOT', status: 'Crítico' },
  { fila: 'Financeiro', abandonos: 6, bot: 10, humana: 4, origem: 'BOT', status: 'Crítico' },
  { fila: 'Dúvidas Administrativas', abandonos: 4, bot: 2, humana: 12, origem: 'Humano', status: 'Alto' },
  { fila: 'Negativas/Exames', abandonos: 2, bot: 4, humana: 3, origem: 'Misto', status: 'Médio' },
  { fila: 'Autorização', abandonos: 2, bot: 2, humana: 2, origem: 'Misto', status: 'OK' },
  { fila: 'Ouvidoria/Reanálise', abandonos: 1, bot: 3, humana: 3, origem: 'Misto', status: 'OK' },
]

// Cor por canal vem da taxonomia (canalCor) — não hardcoded aqui.
export const porCanal = {
  total: 23,
  taxa: '14,6%',
  itens: [
    { name: 'Chat/WhatsApp', pct: '8.2%', value: 15 },
    { name: 'Telefone/Voz', pct: '4.1%', value: 6 },
    { name: 'Balcão/Presencial', pct: '2.3%', value: 2 },
  ],
}

// Etapas de abandono no BOT (% por etapa do fluxo automatizado).
export const porFluxoBot = [
  { label: 'Reembolso → Envio de docs', value: 15 },
  { label: 'Financeiro → Valid. financeira', value: 11 },
  { label: 'Autorização → Envio de docs', value: 7 },
  { label: 'Dúvidas Administrativas → Identificação', value: 4 },
]

export const comparativo = {
  total: 23,
  bot: { pct: 26, casos: 6 },
  humano: { pct: 74, casos: 17 },
  mult: '2.8× mais que BOT',
  tmeBot: '06:35',
  tmeHumano: '02:00',
  insight: 'O fluxo está muito complexo ou com erro',
}

// Filas de abandono — BOT × Humano (dispersão): x = % abandono no BOT,
// y = % abandono na fila humana, tamanho = volume do fluxo.
export interface AbandonoPonto {
  nome: string
  volume: number
  bot: number
  humana: number
  tone: 'danger' | 'warning' | 'success'
}

export const abandonoScatter: AbandonoPonto[] = [
  { nome: 'Dúvidas Adm.', volume: 18, bot: 2, humana: 12, tone: 'warning' },
  { nome: 'Financeiro (Boleto)', volume: 38, bot: 10, humana: 4, tone: 'danger' },
  { nome: 'Reembolso', volume: 42, bot: 15, humana: 2, tone: 'danger' },
  { nome: 'Ouvidoria/Reanálise', volume: 18, bot: 3, humana: 3, tone: 'success' },
  { nome: 'Negativas/Exames', volume: 26, bot: 4, humana: 3, tone: 'success' },
  { nome: 'Autorizações', volume: 27, bot: 2, humana: 2, tone: 'success' },
]

export const bannerAbandono =
  'Reembolso e Financeiro caem no quadrante "Problema no Robô" — cliente desiste no BOT, não na fila humana. Dúvidas Adm. isola-se em "Workforce".'
