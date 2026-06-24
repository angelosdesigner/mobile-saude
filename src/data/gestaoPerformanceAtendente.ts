// Fixtures do detalhe "Gestão e Performance — Atendente".
// Drill-down de um atendente específico: KPIs individuais, distribuição por
// tipo de ocorrência, evolução semanal e recomendações da IA.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'
import type { BarItem } from '@/components/gestor/barList'
import type { DataListColumn } from '@/components/ui/dataList'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const contexto = {
  badge: 'ATENÇÃO',
  titulo: 'Ana Lima — Atendente',
  resumo: '24% de pendências · acima da média da equipe',
  subtitulo: 'Turno Tarde · 83 ocorrências no período · TME médio 11min',
}

export interface AtendenteKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadores: AtendenteKpi[] = [
  { label: 'Ocorrências', value: '83', unit: '', status: 'neutral', delta: 'total no período', deltaTone: 'neutral' },
  { label: 'Resolvidas', value: '76', unit: '%', status: 'warning', delta: '↓ vs 88% equipe', deltaTone: 'down' },
  { label: 'TME médio', value: '11', unit: 'min', status: 'danger', delta: '↑ meta 8min', deltaTone: 'down' },
  { label: 'SLA cumprido', value: '84', unit: '%', status: 'warning', delta: '↓ meta 90%', deltaTone: 'down' },
]

export const tiposOcorrencia: BarItem[] = [
  { label: 'Reclamação', value: 55, caption: '46 ocorr.', tone: 'danger' },
  { label: 'Autorização', value: 34, caption: '28 ocorr.', tone: 'warning' },
  { label: 'Reembolso', value: 14, caption: '12 ocorr.', tone: 'warning' },
  { label: 'Dúvida', value: 11, caption: '9 ocorr.', tone: 'success' },
]

export const evolucaoMetricas = ['Demanda', 'TME'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

export const evolucao = {
  dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  demanda: [10, 14, 12, 18, 16, 8, 5],
  tme: [7, 9, 8, 14, 12, 5, 4],
}

export type StatusOcorrencia = 'Pendente' | 'Resolvida' | 'Escalada'

// `type` (não `interface`) p/ satisfazer o genérico do DataList (Record<string, unknown>).
export type OcorrenciaAtendente = {
  protocolo: string
  tipo: string
  canal: string
  aberta: string
  tme: number
  status: StatusOcorrencia
}

export const ocorrencias: OcorrenciaAtendente[] = [
  { protocolo: '#0042-T', tipo: 'Reclamação', canal: 'WhatsApp', aberta: '20/06', tme: 14, status: 'Pendente' },
  { protocolo: '#0038-T', tipo: 'Autorização', canal: 'Portal', aberta: '20/06', tme: 12, status: 'Pendente' },
  { protocolo: '#0031-T', tipo: 'Dúvida', canal: 'App', aberta: '19/06', tme: 5, status: 'Resolvida' },
  { protocolo: '#0027-T', tipo: 'Reembolso', canal: 'WhatsApp', aberta: '18/06', tme: 11, status: 'Resolvida' },
  { protocolo: '#0022-T', tipo: 'Reclamação', canal: 'Portal', aberta: '17/06', tme: 16, status: 'Escalada' },
  { protocolo: '#0019-T', tipo: 'Autorização', canal: 'App', aberta: '16/06', tme: 9, status: 'Resolvida' },
]

export const ocorrenciasColumns: DataListColumn[] = [
  { key: 'protocolo', label: 'Protocolo', width: 110 },
  { key: 'tipo', label: 'Tipo', minWidth: 120, sortable: true },
  { key: 'canal', label: 'Canal', width: 100 },
  { key: 'aberta', label: 'Aberta em', width: 110 },
  { key: 'tme', label: 'TME (min)', align: 'right', width: 110, sortBy: (r) => r.tme as number },
  { key: 'status', label: 'Status', width: 120 },
]

export const diagnostico = {
  confianca: 'confiança 85% · 128 padrões similares',
  texto:
    'Ana Lima concentra 24% das pendências da equipe, acima da média de 12%. As reclamações vespertinas (14h–17h) respondem por 68% do seu backlog. Julia S. e Fernanda P. têm folga de capacidade nesse período e podem absorver o excedente sem impacto no SLA.',
}

export const recomendacoes: RecomendacaoIA[] = [
  {
    titulo: 'Redistribuir reclamações 14h–17h',
    corpo: 'Reassinalar as reclamações abertas entre 14h e 17h para Julia S. e Fernanda P., que operam abaixo de 80% de ocupação nesse intervalo.',
    impacto: '−30% TME · SLA no nível da equipe',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Priorizar autorizações pendentes',
    corpo: 'As 12 autorizações abertas há mais de 2 dias entram no prazo de reembolso em 48h — priorizar antes das novas reclamações.',
    impacto: 'Evitar SLA crítico em 12 casos',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Reassinalar reclamações vespertinas de Ana Lima'
