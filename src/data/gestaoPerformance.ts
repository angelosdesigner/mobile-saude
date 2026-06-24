// Fixtures da visão "Gestão e Performance" (a frio) — visão principal.
// Análise retrospectiva de ocorrências por atendente, volume por período
// e pendências acionáveis.
import type { IndicadorGeral } from '@/data/gestorIndicadoresGerais'
import type { FilterChip } from '@/components/ui/filterChips'
import type { BarItem } from '@/components/gestor/barList'
import type { DataListColumn } from '@/components/ui/dataList'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export const kpis: IndicadorGeral[] = [
  {
    label: 'Total de ocorrências',
    value: 100,
    display: '1.248',
    meta: 'vs 1.190 período anterior',
    tone: 'primary',
  },
  {
    label: 'Resolvidas',
    value: 83,
    display: '83%',
    delta: '↓ vs 88% ant.',
    deltaTone: 'danger',
    meta: 'meta ≥ 90%',
    tone: 'warning',
  },
  {
    label: 'TME médio',
    value: 62,
    display: '10,3min',
    delta: '↑ 2,3min acima da meta',
    deltaTone: 'danger',
    meta: 'meta ≤ 8min',
    tone: 'warning',
  },
  {
    label: 'SLA cumprido',
    value: 91,
    display: '91%',
    delta: '+1% acima da meta',
    deltaTone: 'up',
    meta: 'meta ≥ 90%',
    tone: 'success',
  },
]

export const chips: FilterChip[] = [
  { key: 'manha', label: 'Manhã', value: '14 atend.', tone: 'success' },
  { key: 'tarde', label: 'Tarde', value: '12 atend.', tone: 'warning' },
  { key: 'noite', label: 'Noite', value: '10 atend.', tone: 'neutral' },
]

export const atendentesRanking: BarItem[] = [
  { label: 'Ana Lima', value: 24, caption: '24% pend.', tone: 'danger', avatar: 'AL' },
  { label: 'Carlos M.', value: 18, caption: '18% pend.', tone: 'warning', avatar: 'CM' },
  { label: 'Fernanda P.', value: 14, caption: '14% pend.', tone: 'warning', avatar: 'FP' },
  { label: 'Ricardo O.', value: 8, caption: '8% pend.', tone: 'success', avatar: 'RO' },
  { label: 'Julia S.', value: 6, caption: '6% pend.', tone: 'success', avatar: 'JS' },
]

export interface VolumeDia {
  dia: string
  total: number
  sla: number
}

export const volumeDias: VolumeDia[] = [
  { dia: 'Seg', total: 142, sla: 94 },
  { dia: 'Ter', total: 168, sla: 91 },
  { dia: 'Qua', total: 195, sla: 87 },
  { dia: 'Qui', total: 224, sla: 81 },
  { dia: 'Sex', total: 210, sla: 82 },
  { dia: 'Sáb', total: 160, sla: 88 },
  { dia: 'Dom', total: 149, sla: 95 },
]

export type StatusPendente = 'Pendente' | 'Em análise' | 'Escalada'

export interface OcorrenciaPendente {
  protocolo: string
  atendente: string
  tipo: string
  canal: string
  abertoHa: string
  diasAberto: number
  status: StatusPendente
}

export const pendentes: OcorrenciaPendente[] = [
  { protocolo: '#0042-T', atendente: 'Ana Lima', tipo: 'Reclamação', canal: 'WhatsApp', abertoHa: '4 dias', diasAberto: 4, status: 'Pendente' },
  { protocolo: '#0038-T', atendente: 'Ana Lima', tipo: 'Autorização', canal: 'Portal', abertoHa: '3 dias', diasAberto: 3, status: 'Pendente' },
  { protocolo: '#0035-T', atendente: 'Carlos M.', tipo: 'Reembolso', canal: 'App', abertoHa: '2 dias', diasAberto: 2, status: 'Em análise' },
  { protocolo: '#0031-T', atendente: 'Carlos M.', tipo: 'Dúvida', canal: 'WhatsApp', abertoHa: '2 dias', diasAberto: 2, status: 'Pendente' },
  { protocolo: '#0028-T', atendente: 'Fernanda P.', tipo: 'Reclamação', canal: 'Portal', abertoHa: '1 dia', diasAberto: 1, status: 'Escalada' },
]

export const pendentesColumns: DataListColumn[] = [
  { key: 'protocolo', label: 'Protocolo', width: 110 },
  { key: 'atendente', label: 'Atendente', minWidth: 130, sortable: true },
  { key: 'tipo', label: 'Tipo', minWidth: 120, sortable: true },
  { key: 'canal', label: 'Canal', width: 100 },
  { key: 'abertoHa', label: 'Aberta há', width: 110, sortBy: (r) => r.diasAberto as number },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'acoes', label: 'Ações', width: 180 },
]
