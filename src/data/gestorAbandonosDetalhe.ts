// Tela de detalhe "Abandonos e Desistência" (drill-down da aba Abandonos).
// Estrutura padrão das telas de detalhe do gestor (5 seções):
// 1) Indicadores gerais · 2) Tabela (ponto de abandono por assunto) · 3) Evolução ·
// 4) Correlação · 5) Insights da IA.
//
// Abandono = evento ocorrido em uma etapa da jornada (não uma fila). As colunas
// "No automatizado" e "Em espera" indicam onde o beneficiário desistiu.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'
import type { AbandonoStatus } from '@/data/gestorAbandonos'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const contexto = {
  badge: 'ATENÇÃO',
  titulo: 'Abandonos e Desistência',
  resumo: '23 desistências no período · taxa 14,6% (meta < 10%)',
  subtitulo:
    'Onde o atendimento foi abandonado · diagnóstico por etapa da jornada, assunto e canal',
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
  { label: 'Abandonos',       value: '23',   unit: '', status: 'danger',  delta: '↑ 2 hoje',             deltaTone: 'down'    },
  { label: 'No automatizado', value: '6',    unit: '', status: 'warning', delta: '26% dos abandonos',    deltaTone: 'neutral' },
  { label: 'Em espera',       value: '17',   unit: '', status: 'danger',  delta: '74% · desistiram na fila', deltaTone: 'neutral' },
  { label: 'Taxa de abandono',value: '14,6', unit: '%',status: 'danger',  delta: 'meta < 10%',           deltaTone: 'down'    },
]

// ── 2) Tabela — ponto de abandono por assunto ─────────────────────────────────
// Fonte única em gestorAbandonos.ts (reutilizada pela aba e por esta tela).
export { filasAbandono } from '@/data/gestorAbandonos'
export type { AbandonoStatus, FilaAbandonoLinha, EtapaAbandono } from '@/data/gestorAbandonos'

// ── 3) Evolução — abandonos por hora (contagem) ──────────────────────────────
export const evolucaoMetricas = ['Total', 'Automatizado', 'Em espera'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

export const evolucao = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  // Total = Automatizado + Em espera em cada hora. Somas: Automatizado 6 · Em espera 17 · Total 23.
  series: {
    Total:        [1, 2, 2, 3, 2, 1, 2, 3, 2, 2, 2, 1] as number[],
    Automatizado: [0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0] as number[],
    'Em espera':  [1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1] as number[],
  } as Record<EvolucaoMetrica, number[]>,
  picoIdx: 7, // 15h
  picoLabel: '15h · pico de desistências',
  agoraIdx: 9, // 17h
}

// ── 4) Correlação — diagnóstico por assunto ──────────────────────────────────
export type CorrelLinha = {
  fila: string
  bot: number    // % abandono no automatizado
  humana: number // % abandono em espera
  gargalo: string
  status: AbandonoStatus
}

export const correlacao: CorrelLinha[] = [
  { fila: 'Reembolso',              bot: 15, humana:  2, gargalo: 'Abandona no automatizado (envio de docs) — fluxo complexo',       status: 'Crítico' },
  { fila: 'Financeiro',             bot: 10, humana:  4, gargalo: 'Abandona no automatizado (validação financeira)',                  status: 'Crítico' },
  { fila: 'Dúvidas Administrativas',bot:  2, humana: 12, gargalo: 'Abandona em espera (longa) → problema de workforce',              status: 'Alto'    },
  { fila: 'Negativas/Exames',       bot:  4, humana:  3, gargalo: 'Distribuído · sem etapa dominante',                              status: 'Médio'   },
  { fila: 'Autorização',            bot:  2, humana:  2, gargalo: 'Sem gargalo identificado',                                        status: 'OK'      },
  { fila: 'Ouvidoria/Reanálise',    bot:  3, humana:  3, gargalo: 'Sem gargalo identificado',                                        status: 'OK'      },
]

export const comoInterpretar =
  'Abandono concentrado no automatizado (Reembolso, Financeiro) indica fluxo complexo ou com erro — o beneficiário desiste antes de chegar ao humano. ' +
  'Abandono concentrado em espera (Dúvidas Administrativas) indica tempo de fila longo → problema de dimensionamento (workforce). ' +
  'Clique num assunto para abrir os protocolos e filtrar por etapa de abandono ("No automatizado" ou "Em espera").'

// ── 5) Insights da IA ────────────────────────────────────────────────────────
export const diagnostico = {
  confianca: 'confiança 86% · 312 padrões similares',
  texto:
    'O abandono está concentrado em espera (17 casos vs 6 no automatizado), mas a causa-raiz dos casos mais críticos está no automatizado: Reembolso e Financeiro concentram desistências na etapa de envio de documentos, sinalizando fluxo complexo. Dúvidas Administrativas desiste em espera por fila longa — problema de capacidade, não de jornada do fluxo.',
}

export const recomendacoes: RecomendacaoIA[] = [
  {
    titulo: 'Simplificar o envio de documentos no automatizado',
    corpo: 'Reembolso e Financeiro perdem o beneficiário na etapa de upload. Reduzir passos, aceitar foto e validar em background diminui a desistência no fluxo automatizado.',
    impacto: 'Abandono no automatizado −40%',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Reforçar a fila de Dúvidas Administrativas',
    corpo: 'A desistência em espera é por longa fila. Realocar atendentes nos horários de pico (14h–17h) reduz o tempo até o primeiro atendimento.',
    impacto: 'Abandono em espera −25%',
    acao: 'Detalhar',
  },
  {
    titulo: 'Callback para quem desiste em espera',
    corpo: 'Oferecer retorno agendado aos beneficiários que abandonam após 5min de espera recupera parte da demanda sem ampliar a fila.',
    impacto: 'Recuperação +18%',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Corrigir fluxo de Reembolso no automatizado'
