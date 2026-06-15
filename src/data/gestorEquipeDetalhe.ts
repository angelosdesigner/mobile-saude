// Tela de detalhe "Equipe" (drill-down da aba Equipe).
// Estrutura padrão das telas de detalhe do gestor (5 seções):
// 1) Indicadores gerais · 2) Tabela · 3) Evolução · 4) Correlação ·
// 5) Insights da IA.
//
// Números semeados a partir de `gestorEquipe.ts` (aba): eficiência 89%,
// 14 em atendimento, ranking de ocupação/CSAT/reabertura por atendente.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const contexto = {
  badge: 'ATENÇÃO',
  titulo: 'Desempenho da Equipe',
  resumo: 'Eficiência 89% · 1 atendente em sobrecarga',
  subtitulo:
    'Produtividade, ocupação e qualidade por atendente · identificação de sobrecarga e risco de CSAT',
}

// ── 1) Indicadores gerais (KpiStatCard) ──────────────────────────────────────
export interface EquipeKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadores: EquipeKpi[] = [
  { label: 'Eficiência operacional', value: '89', unit: '%', status: 'ok', delta: 'meta 85%', deltaTone: 'up' },
  { label: 'Em atendimento', value: '14', unit: '', status: 'ok', delta: '4 em tarefa interna', deltaTone: 'neutral' },
  { label: 'Ocupação média', value: '73', unit: '%', status: 'warning', delta: '1 em sobrecarga', deltaTone: 'neutral' },
  { label: 'CSAT médio', value: '4,5', unit: '', status: 'ok', delta: '↓ Fernanda 3,9', deltaTone: 'down' },
]

// ── 2) Tabela — por atendente ────────────────────────────────────────────────
export type EquipeStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type AtendenteLinha = {
  atendente: string
  ocupacao: number
  csat: number
  reaberturas: number
  status: EquipeStatus
}

export const atendentes: AtendenteLinha[] = [
  { atendente: 'Fernanda Paz', ocupacao: 95, csat: 3.9, reaberturas: 8, status: 'Crítico' },
  { atendente: 'Paula Reis', ocupacao: 78, csat: 4.3, reaberturas: 5, status: 'Alto' },
  { atendente: 'Carlos Lima', ocupacao: 72, csat: 4.5, reaberturas: 4, status: 'Médio' },
  { atendente: 'Ana Souza', ocupacao: 60, csat: 4.8, reaberturas: 2, status: 'OK' },
  { atendente: 'João Melo', ocupacao: 58, csat: 4.9, reaberturas: 1, status: 'OK' },
]

// ── 3) Evolução — indicadores da equipe ao longo da semana ───────────────────
export const evolucaoMetricas = ['Eficiência', 'Ocupação', 'CSAT'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

export const evolucao = {
  dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  series: {
    Eficiência: [86, 88, 90, 87, 89, 84, 82],
    Ocupação: [70, 73, 76, 74, 73, 68, 60],
    CSAT: [4.4, 4.5, 4.6, 4.5, 4.5, 4.3, 4.6],
  } as Record<EvolucaoMetrica, number[]>,
  // Meta/escala por métrica.
  metas: { Eficiência: 85, Ocupação: 85, CSAT: 4.5 } as Record<EvolucaoMetrica, number>,
  picoIdx: 2, // Qua
  picoLabel: 'Qua · maior carga',
  agoraIdx: 4, // Sex (hoje)
}

// ── 4) Correlação — diagnóstico por atendente ────────────────────────────────
export type CorrelLinha = {
  atendente: string
  ocupacao: number
  csat: number
  reaberturas: number
  gargalo: string
  status: EquipeStatus
}

export const correlacao: CorrelLinha[] = [
  { atendente: 'Fernanda Paz', ocupacao: 95, csat: 3.9, reaberturas: 8, gargalo: 'Sobrecarga → queda de CSAT e alta reabertura', status: 'Crítico' },
  { atendente: 'Paula Reis', ocupacao: 78, csat: 4.3, reaberturas: 5, gargalo: 'Ocupação alta começa a pesar na qualidade', status: 'Alto' },
  { atendente: 'Carlos Lima', ocupacao: 72, csat: 4.5, reaberturas: 4, gargalo: 'Equilibrado · sem gargalo dominante', status: 'Médio' },
  { atendente: 'Ana Souza', ocupacao: 60, csat: 4.8, reaberturas: 2, gargalo: 'Saudável', status: 'OK' },
  { atendente: 'João Melo', ocupacao: 58, csat: 4.9, reaberturas: 1, gargalo: 'Saudável · com folga para absorver demanda', status: 'OK' },
]

export const comoInterpretar =
  'Quanto maior a ocupação, menor tende a ser o CSAT e maior a reabertura — sinal de sobrecarga. Atendentes acima de 90% de ocupação E com CSAT abaixo da meta (4,5) estão na zona crítica e precisam de redistribuição de carga. Atendentes abaixo de 65% têm folga e podem absorver parte da demanda dos sobrecarregados.'

// ── 5) Insights da IA ────────────────────────────────────────────────────────
export const diagnostico = {
  confianca: 'confiança 85% · 198 padrões similares',
  texto:
    'Fernanda Paz está na zona crítica: 95% de ocupação puxam o CSAT para 3,9 e elevam a reabertura para 8 casos. A correlação ocupação × qualidade é clara — João Melo e Ana Souza, com folga, sustentam CSAT acima de 4,8. Redistribuir parte da carga de Fernanda para os atendentes ociosos recupera a qualidade sem perder volume.',
}

export const recomendacoes: RecomendacaoIA[] = [
  {
    titulo: 'Redistribuir carga de Fernanda Paz',
    corpo: 'Mover parte das conversas de Fernanda (95% de ocupação) para João Melo e Ana Souza, que operam com folga e CSAT alto.',
    impacto: 'CSAT +0,4 · reabertura −30%',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Coaching focado em reabertura',
    corpo: 'Os 8 casos reabertos de Fernanda concentram-se em respostas incompletas sob pressão. Coaching pontual reduz o retrabalho.',
    impacto: 'Reabertura −25%',
    acao: 'Detalhar',
  },
  {
    titulo: 'Teto de ocupação por atendente',
    corpo: 'Definir limite de 85% de ocupação no roteamento evita que um atendente entre na zona crítica de qualidade.',
    impacto: 'Risco de CSAT mitigado',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Redistribuir carga de Fernanda Paz'
