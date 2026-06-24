import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'
import type { DataListColumn } from '@/components/ui/dataList'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const contexto = {
  badge: 'ATENÇÃO',
  titulo: 'Performance por Atendente',
  resumo: '3 de 5 atendentes com SLA abaixo da meta · backlog crescente',
  subtitulo: 'Visão consolidada · análise a frio · compare, identifique gargalos e redistribua',
}

export interface KpiAtendentes {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadores: KpiAtendentes[] = [
  { label: 'Total de ocorrências', value: '1.248', unit: '', status: 'neutral', delta: 'vs 1.190 período anterior', deltaTone: 'neutral' },
  { label: 'Resolvidas', value: '83', unit: '%', status: 'warning', delta: '↓ vs 88% meta ≥ 90%', deltaTone: 'down' },
  { label: 'TME médio equipe', value: '10,3', unit: 'min', status: 'warning', delta: '↑ 2,3min acima da meta', deltaTone: 'down' },
  { label: 'SLA cumprido', value: '91', unit: '%', status: 'ok', delta: '+1% acima da meta', deltaTone: 'up' },
]

export type PerfStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

// `type` (não `interface`) p/ satisfazer o genérico do DataList (Record<string, unknown>).
export type AtendenteRow = {
  nome: string
  turno: string
  ocorrencias: number
  resolvidas: string
  tme: number
  sla: string
  pendentes: number
  gargalo: string
  status: PerfStatus
}

export const atendentesTabela: AtendenteRow[] = [
  { nome: 'Ana Lima', turno: 'Tarde', ocorrencias: 83, resolvidas: '76%', tme: 11, sla: '84%', pendentes: 20, gargalo: 'Reclamações vespertinas concentram 68% do backlog', status: 'Crítico' },
  { nome: 'Carlos M.', turno: 'Tarde', ocorrencias: 72, resolvidas: '81%', tme: 10, sla: '87%', pendentes: 13, gargalo: 'TME acima da meta em reembolsos', status: 'Alto' },
  { nome: 'Fernanda P.', turno: 'Manhã', ocorrencias: 68, resolvidas: '85%', tme: 9, sla: '89%', pendentes: 10, gargalo: 'Pico das 11h sem reforço', status: 'Médio' },
  { nome: 'Ricardo O.', turno: 'Manhã', ocorrencias: 74, resolvidas: '91%', tme: 7, sla: '94%', pendentes: 7, gargalo: 'Dentro da meta', status: 'OK' },
  { nome: 'Julia S.', turno: 'Noite', ocorrencias: 51, resolvidas: '92%', tme: 6, sla: '96%', pendentes: 4, gargalo: 'Dentro da meta', status: 'OK' },
]

export const atendentesColumns: DataListColumn[] = [
  { key: 'nome', label: 'Atendente', minWidth: 130, sortable: true },
  { key: 'turno', label: 'Turno', width: 100, sortable: true },
  { key: 'ocorrencias', label: 'Ocorrências', align: 'right', width: 120, sortable: true },
  { key: 'resolvidas', label: 'Resolvidas', align: 'right', width: 110, sortBy: (r) => parseInt(r.resolvidas as string) },
  { key: 'tme', label: 'TME (min)', align: 'right', width: 110, sortBy: (r) => r.tme as number },
  { key: 'sla', label: 'SLA', align: 'right', width: 90, sortBy: (r) => parseInt(r.sla as string) },
  { key: 'pendentes', label: 'Pendentes', align: 'right', width: 100, sortBy: (r) => r.pendentes as number },
  { key: 'gargalo', label: 'Gargalo principal', minWidth: 240 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => ({ Crítico: 0, Alto: 1, Médio: 2, OK: 3 }[r.status as PerfStatus]) },
]

export const evolucaoMetricas = ['Volume', 'TME', 'SLA%'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

export const evolucao = {
  dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  volume: [142, 168, 195, 224, 210, 160, 149],
  tme: [8, 9, 10, 13, 12, 7, 6],
  sla: [94, 91, 87, 81, 82, 88, 95],
  picoIdx: 3,
  picoLabel: 'Qui · pico de volume e queda de SLA',
}

export type CorrelStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

// `type` (não `interface`) p/ satisfazer o genérico do DataList (Record<string, unknown>).
export type CorrelRow = {
  atendente: string
  tipoPred: string
  tme: number
  pendentes: number
  sla: string
  gargalo: string
  status: CorrelStatus
}

export const correlacao: CorrelRow[] = [
  { atendente: 'Ana Lima', tipoPred: 'Reclamação', tme: 11, pendentes: 20, sla: '84%', gargalo: 'Backlog vespertino · 68% de reclamações', status: 'Crítico' },
  { atendente: 'Carlos M.', tipoPred: 'Reembolso', tme: 10, pendentes: 13, sla: '87%', gargalo: 'TME acima da meta nos reembolsos', status: 'Alto' },
  { atendente: 'Fernanda P.', tipoPred: 'Autorização', tme: 9, pendentes: 10, sla: '89%', gargalo: 'Pico 11h sem cobertura extra', status: 'Médio' },
  { atendente: 'Ricardo O.', tipoPred: 'Dúvida', tme: 7, pendentes: 7, sla: '94%', gargalo: 'Dentro da meta operacional', status: 'OK' },
  { atendente: 'Julia S.', tipoPred: 'Dúvida', tme: 6, pendentes: 4, sla: '96%', gargalo: 'Folga: pode absorver redistribuição', status: 'OK' },
]

export const correlacaoColumns: DataListColumn[] = [
  { key: 'atendente', label: 'Atendente', minWidth: 120, sortable: true },
  { key: 'tipoPred', label: 'Tipo predominante', minWidth: 130 },
  { key: 'tme', label: 'TME (min)', align: 'right', width: 110, sortBy: (r) => r.tme as number },
  { key: 'pendentes', label: 'Pendentes', align: 'right', width: 100, sortBy: (r) => r.pendentes as number },
  { key: 'sla', label: 'SLA', align: 'right', width: 90, sortBy: (r) => parseInt(r.sla as string) },
  { key: 'gargalo', label: 'Gargalo identificado', minWidth: 260 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => ({ Crítico: 0, Alto: 1, Médio: 2, OK: 3 }[r.status as CorrelStatus]) },
]

export const comoInterpretar =
  'Atendentes com TME > 8min E SLA < 90% estão subdimensionados ou com tipo de ocorrência inadequado para o turno. Atendentes com folga (SLA > 95% e pendentes < 6) podem absorver redistribuição sem impacto na operação.'

export const diagnostico = {
  confianca: 'confiança 87% · 312 padrões similares',
  texto:
    'Ana Lima e Carlos M. concentram 53% das pendências totais. O padrão sugere desalinhamento de tipo de ocorrência com perfil do turno — reclamações vespertinas para atendentes com menor TME histórico nesse horário. Julia S. e Ricardo O. têm folga operacional suficiente para absorver redistribuição sem impacto no SLA.',
}

export const recomendacoes: RecomendacaoIA[] = [
  {
    titulo: 'Redistribuir reclamações vespertinas',
    corpo: 'Reassinalar 12 reclamações abertas de Ana Lima para Julia S. e Ricardo O. no turno da tarde. Ambos com SLA > 93% e folga de capacidade.',
    impacto: '−24% pendências · +6% SLA geral',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Reforçar cobertura 11h (Manhã)',
    corpo: 'Fernanda P. enfrenta pico sem reforço às 11h. Estender jornada do turno noite em 1h cobrirá a transição com custo mínimo.',
    impacto: '−15% TME no turno Manhã',
    acao: 'Detalhar',
  },
  {
    titulo: 'Especializar por tipo de ocorrência',
    corpo: 'Direcionar reembolsos prioritariamente para Julia S. e autorizações para Ricardo O. — tipos onde cada um tem TME 30% menor que a média da equipe.',
    impacto: 'SLA +8% em reembolsos',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Redistribuir reclamações de Ana Lima para turno tarde'
