// Tela de detalhe "Performance e Workforce" (drill-down da aba Performance).
// Estrutura padrão das telas de detalhe do gestor (5 seções):
// 1) Indicadores gerais · 2) Tabela · 3) Evolução · 4) Correlação ·
// 5) Insights da IA.
//
// Números semeados a partir de `gestorPerformance.ts` (aba): pico 229% da
// capacidade (15h: 32 vs 14/h), 36 atendentes na escala, inflexão 26/h,
// ganho −28% TME no remanejamento sugerido.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const contexto = {
  badge: 'CRÍTICO',
  titulo: 'Performance e Workforce',
  resumo: 'Pico em 229% da capacidade · turno tarde crítico',
  subtitulo:
    'Dimensionamento da operação: demanda × capacidade, carga por turno e ponto de inflexão do SLA',
}

// ── 1) Indicadores gerais (KpiStatCard) ──────────────────────────────────────
export interface PerfKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadores: PerfKpi[] = [
  { label: 'Pico vs capacidade', value: '229', unit: '%', status: 'danger', delta: '15h · 32 vs 14/h', deltaTone: 'down' },
  { label: 'Atendentes na escala', value: '36', unit: '', status: 'neutral', delta: 'M 14 · T 12 · N 10', deltaTone: 'neutral' },
  { label: 'Limite de inflexão', value: '26', unit: '/h', status: 'warning', delta: 'acima disso o SLA estoura', deltaTone: 'neutral' },
  { label: 'Ganho do remanejamento', value: '−28', unit: '% TME', status: 'ok', delta: '+12% SLA', deltaTone: 'up' },
]

// ── 2) Tabela — turnos ───────────────────────────────────────────────────────
export type PerfStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type TurnoLinha = {
  turno: string
  horario: string
  atendentes: number
  capacidade: number
  cargaMedia: string
  pico: string
  sugestao: string
  status: PerfStatus
}

export const turnosTabela: TurnoLinha[] = [
  { turno: 'Tarde', horario: '12–18h', atendentes: 12, capacidade: 12, cargaMedia: '22/h', pico: '15h · 32 (TME 14min)', sugestao: 'Estender turno manhã até 16h (+5)', status: 'Crítico' },
  { turno: 'Manhã', horario: '08–12h', atendentes: 14, capacidade: 14, cargaMedia: '19/h', pico: '11h · 26 vs 14', sugestao: 'Realocar +3 de Autorizações', status: 'Alto' },
  { turno: 'Noite', horario: '18–22h', atendentes: 10, capacidade: 10, cargaMedia: '13/h', pico: 'ocupação média 76%', sugestao: 'Liberar 2 atendentes para reforço', status: 'OK' },
]

// ── 3) Evolução — demanda × capacidade / TME / ocupação por hora ─────────────
export const evolucaoMetricas = ['Demanda', 'TME', 'Ocupação'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

export const capacidade = 14
export const inflexao = 26

export const evolucao = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h'],
  demanda: [8, 12, 16, 20, 22, 18, 24, 32, 28, 22, 18, 16, 12, 10, 8],
  // TME (min) e Ocupação (%) derivados da demanda (≈ demanda/capacidade).
  tme: [4, 6, 8, 10, 11, 9, 12, 16, 14, 11, 9, 8, 6, 5, 4],
  ocupacao: [22, 34, 45, 56, 62, 50, 67, 90, 78, 62, 50, 45, 34, 28, 22],
  meta: 90, // meta de SLA / ocupação ideal
  picoIdx: 7, // 15h
  picoLabel: '15h · pico de demanda',
  agoraIdx: 9, // 17h
}

// ── 4) Correlação — diagnóstico por turno ────────────────────────────────────
export type CorrelLinha = {
  turno: string
  picoDemanda: number
  capacidade: number
  tme: number
  ocupacao: number
  gargalo: string
  status: PerfStatus
}

export const correlacao: CorrelLinha[] = [
  { turno: 'Tarde', picoDemanda: 32, capacidade: 12, tme: 14, ocupacao: 95, gargalo: 'Demanda 2,7× a capacidade no pico → SLA estoura', status: 'Crítico' },
  { turno: 'Manhã', picoDemanda: 26, capacidade: 14, tme: 11, ocupacao: 90, gargalo: 'Pico 11h acima da capacidade', status: 'Alto' },
  { turno: 'Noite', picoDemanda: 13, capacidade: 10, tme: 5, ocupacao: 76, gargalo: 'Folga de capacidade para realocar', status: 'OK' },
]

export const comoInterpretar =
  'Ponto de inflexão em ~26 chamados/hora: acima desse limite o TME cresce de forma não-linear e estoura o SLA de 8min. Turnos com ocupação > 90% E TME acima da meta estão subdimensionados. Turnos com ocupação < 80% têm folga e podem ceder atendentes para o pico — base do remanejamento sugerido.'

// ── 5) Insights da IA ────────────────────────────────────────────────────────
export const diagnostico = {
  confianca: 'confiança 88% · 264 padrões similares',
  texto:
    'O turno da tarde opera a 229% da capacidade no pico das 15h (32 chamados/h para 12 atendentes), empurrando o TME para 14min e estourando o SLA. O turno da noite tem folga (ocupação 76%). Remanejar 3 atendentes da noite para o pico vespertino equilibra a operação sem custo adicional de escala.',
}

export const recomendacoes: RecomendacaoIA[] = [
  {
    titulo: 'Remanejar 3 atendentes noite → tarde',
    corpo: 'Mover 3 atendentes do turno noite (folga) para reforço no pico vespertino (14h–17h). Equilibra a carga sem ampliar a escala.',
    impacto: '−28% TME · +12% SLA',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Estender o turno da manhã',
    corpo: 'Prolongar a jornada da manhã até 16h cobre a transição para o pico da tarde, quando a demanda já começou a subir.',
    impacto: 'Cobertura do pico +5',
    acao: 'Detalhar',
  },
  {
    titulo: 'Teto de fila por hora',
    corpo: 'Acionar callback automático quando a demanda passar de 26/h (inflexão), evitando que o SLA degrade antes do reforço chegar.',
    impacto: 'SLA protegido no pico',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Aprovar remanejamento do pico vespertino'
