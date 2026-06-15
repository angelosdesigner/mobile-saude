// Tela de detalhe "Abandonos e Desistência" (drill-down da aba Abandonos).
// Estrutura padrão das telas de detalhe do gestor (5 seções):
// 1) Indicadores gerais · 2) Tabela · 3) Evolução · 4) Correlação ·
// 5) Insights da IA.
//
// Números semeados a partir de `gestorAbandonos.ts` (aba): 23 abandonos no
// período, 6 no BOT / 17 no humano, taxa geral 14,6% (meta < 10%).
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const contexto = {
  badge: 'ATENÇÃO',
  titulo: 'Abandonos e Desistência',
  resumo: '23 desistências no período · taxa 14,6% (meta < 10%)',
  subtitulo:
    'Beneficiários que desistiram antes da resolução · diagnóstico por canal, fluxo e etapa da jornada',
}

// ── 1) Indicadores gerais (KpiStatCard) ──────────────────────────────────────
export interface AbandonoKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadores: AbandonoKpi[] = [
  { label: 'Abandonos', value: '23', unit: '', status: 'danger', delta: '↑ 2 hoje', deltaTone: 'down' },
  { label: 'No BOT', value: '6', unit: '', status: 'warning', delta: '26% dos abandonos', deltaTone: 'neutral' },
  { label: 'No humano', value: '17', unit: '', status: 'danger', delta: '74% · 2,8× o BOT', deltaTone: 'neutral' },
  { label: 'Taxa de abandono', value: '14,6', unit: '%', status: 'danger', delta: 'meta < 10%', deltaTone: 'down' },
]

// ── 2) Tabela — abandono por fluxo ───────────────────────────────────────────
export type AbandonoStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type FluxoLinha = {
  fluxo: string
  volume: number
  abandonos: number
  bot: number // % de abandono no BOT
  humana: number // % de abandono na fila humana
  origem: 'BOT' | 'Humano' | 'Misto'
  status: AbandonoStatus
}

// Abandonos somam 23 (= total da aba). Ordenado por criticidade.
export const fluxos: FluxoLinha[] = [
  { fluxo: 'Reembolso', volume: 42, abandonos: 8, bot: 15, humana: 2, origem: 'BOT', status: 'Crítico' },
  { fluxo: 'Financeiro (Boleto)', volume: 38, abandonos: 6, bot: 10, humana: 4, origem: 'BOT', status: 'Crítico' },
  { fluxo: 'Dúvidas Adm.', volume: 18, abandonos: 4, bot: 2, humana: 12, origem: 'Humano', status: 'Alto' },
  { fluxo: 'Negativas/Exames', volume: 26, abandonos: 2, bot: 4, humana: 3, origem: 'Misto', status: 'Médio' },
  { fluxo: 'Autorizações', volume: 27, abandonos: 2, bot: 2, humana: 2, origem: 'Misto', status: 'OK' },
  { fluxo: 'Ouvidoria/Reanálise', volume: 18, abandonos: 1, bot: 3, humana: 3, origem: 'Misto', status: 'OK' },
]

// ── 3) Evolução — abandonos por hora (contagem) ──────────────────────────────
export const evolucaoMetricas = ['Total', 'BOT', 'Humano'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

export const evolucao = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  // Total = BOT + Humano em cada hora. Somas: BOT 6 · Humano 17 · Total 23.
  series: {
    Total: [1, 2, 2, 3, 2, 1, 2, 3, 2, 2, 2, 1] as number[],
    BOT: [0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0] as number[],
    Humano: [1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1] as number[],
  } as Record<EvolucaoMetrica, number[]>,
  picoIdx: 7, // 15h
  picoLabel: '15h · pico de desistências',
  agoraIdx: 9, // 17h
}

// ── 4) Correlação — diagnóstico por fluxo ────────────────────────────────────
export type CorrelLinha = {
  fluxo: string
  volume: number
  bot: number
  humana: number
  gargalo: string
  status: AbandonoStatus
}

export const correlacao: CorrelLinha[] = [
  { fluxo: 'Reembolso', volume: 42, bot: 15, humana: 2, gargalo: 'Desiste no BOT (envio de docs) — fluxo complexo', status: 'Crítico' },
  { fluxo: 'Financeiro (Boleto)', volume: 38, bot: 10, humana: 4, gargalo: 'Desiste no BOT (validação financeira)', status: 'Crítico' },
  { fluxo: 'Dúvidas Adm.', volume: 18, bot: 2, humana: 12, gargalo: 'Espera longa na fila humana → workforce', status: 'Alto' },
  { fluxo: 'Negativas/Exames', volume: 26, bot: 4, humana: 3, gargalo: 'Equilibrado · sem gargalo dominante', status: 'Médio' },
  { fluxo: 'Autorizações', volume: 27, bot: 2, humana: 2, gargalo: 'Sem gargalo identificado', status: 'OK' },
  { fluxo: 'Ouvidoria/Reanálise', volume: 18, bot: 3, humana: 3, gargalo: 'Sem gargalo identificado', status: 'OK' },
]

export const comoInterpretar =
  'Abandono concentrado no BOT (Reembolso, Financeiro) indica fluxo complexo ou com erro — o cliente desiste antes de chegar ao humano. Abandono concentrado na fila humana (Dúvidas Adm.) indica espera longa → problema de dimensionamento (workforce). Origem "BOT" + alto volume = prioridade de correção de jornada.'

// ── 5) Insights da IA ────────────────────────────────────────────────────────
export const diagnostico = {
  confianca: 'confiança 86% · 312 padrões similares',
  texto:
    'O abandono está 2,8× maior no atendimento humano (17 vs 6), mas a causa-raiz dos casos mais críticos está no BOT: Reembolso e Financeiro concentram desistências na etapa de envio de documentos, sinalizando fluxo complexo. Já Dúvidas Adm. desiste na fila humana por espera longa — problema de capacidade, não de jornada.',
}

export const recomendacoes: RecomendacaoIA[] = [
  {
    titulo: 'Simplificar o envio de documentos no BOT',
    corpo: 'Reembolso e Financeiro perdem o cliente na etapa de upload. Reduzir passos, aceitar foto e validar em background diminui a desistência no robô.',
    impacto: 'Abandono no BOT −40%',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Reforçar a fila de Dúvidas Adm.',
    corpo: 'A desistência na fila humana é por espera. Realocar atendentes nos horários de pico (14h–17h) reduz o tempo até o primeiro atendimento.',
    impacto: 'Abandono humano −25%',
    acao: 'Detalhar',
  },
  {
    titulo: 'Callback para quem desiste',
    corpo: 'Oferecer retorno agendado aos beneficiários que abandonam após 5min de espera recupera parte da demanda sem ampliar a fila.',
    impacto: 'Recuperação +18%',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Corrigir fluxo de Reembolso no BOT'
