import type { DataListColumn } from '@/components/ui/dataList'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

// ── Bloco 1: Saúde Geral / KPIs Macro ──────────────────────────────────────

export interface MacroKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const kpisPrimarios: MacroKpi[] = [
  { label: 'Backlog Total', value: '156', unit: 'tickets', status: 'neutral', delta: 'ativos na operadora', deltaTone: 'neutral' },
  { label: 'SLA Regulatório ANS', value: '96', unit: '%', status: 'ok', delta: 'dentro do prazo legal', deltaTone: 'up' },
  { label: 'FCR', value: '82', unit: '%', status: 'ok', delta: 'resolução no 1º contato (RF084)', deltaTone: 'neutral' },
  { label: 'TMR', value: '4,2', unit: 'dias', status: 'warning', delta: 'ciclo abertura → fechamento (RF083)', deltaTone: 'neutral' },
]

export const kpisQualidade: MacroKpi[] = [
  { label: 'Taxa de Reabertura', value: '8', unit: '%', status: 'warning', delta: '↑ foco de atenção', deltaTone: 'down' },
  { label: 'Gap Resolutividade', value: '8', unit: 'p.p.', status: 'warning', delta: 'sistema 82% vs percebido 74%', deltaTone: 'down' },
  { label: 'CSAT', value: '4,6', unit: '/5', status: 'ok', delta: 'satisfação beneficiários', deltaTone: 'up' },
  { label: 'NPS', value: '72', unit: '', status: 'ok', delta: 'lealdade do cliente (RF089)', deltaTone: 'up' },
]

// ── Bloco 2: Gestão de Risco e Alertas Críticos ────────────────────────────

export type RiscoNivel = 'CRÍTICO' | 'ALTO' | 'MODERADO' | 'BAIXO'

export interface CardRisco {
  titulo: string
  descricao: string
  volume: number | null
  tipos: string
  proxVencimento: string
  tmrMedio: string
  nivel: RiscoNivel
}

export const riscos: CardRisco[] = [
  {
    titulo: 'Menor Prazo Regulatório',
    descricao: 'Tipificações com janelas de resposta regulatória extremamente curtas',
    volume: null,
    tipos: 'Negativas por escrito e exames',
    proxVencimento: '3 horas',
    tmrMedio: '1 hora',
    nivel: 'CRÍTICO',
  },
  {
    titulo: 'Risco de Escalonamento',
    descricao: 'Casos com potencial de virar reclamações formais ou processos judiciais',
    volume: 3,
    tipos: 'Ouvidoria e reanálise',
    proxVencimento: '1 dia',
    tmrMedio: '8 horas',
    nivel: 'ALTO',
  },
  {
    titulo: 'Alta Criticidade e Multas',
    descricao: 'Passivos financeiros elevados — liminares e procedimentos cirúrgicos',
    volume: 2,
    tipos: 'Alta complexidade e cirurgia',
    proxVencimento: '2 dias',
    tmrMedio: '1 dia',
    nivel: 'MODERADO',
  },
  {
    titulo: 'Alto Volume de NIPs',
    descricao: 'Notificações de Intervenção Preliminar — resposta obrigatória à ANS',
    volume: 7,
    tipos: 'Reembolsos',
    proxVencimento: '4 dias',
    tmrMedio: '2 dias',
    nivel: 'BAIXO',
  },
]

// ── Bloco 3: Eficiência por Setor (Matriz de Gargalos) ─────────────────────

export interface SetorRow {
  setor: string
  fila: string
  emAtend: string
  estourSla: number
  ocupacao: string
  repasses: string
  ocupNum: number
  repassesNum: number
}

export const setores: SetorRow[] = [
  { setor: 'N1 · Atendimento', fila: '8 · 14min', emAtend: '14 · 8min', estourSla: 5, ocupacao: '88%', repasses: '1,2×/ticket', ocupNum: 88, repassesNum: 1.2 },
  { setor: 'Reembolsos', fila: '12 · 2 dias', emAtend: '8 · 1 dia', estourSla: 0, ocupacao: '45%', repasses: '1,1×/ticket', ocupNum: 45, repassesNum: 1.1 },
  { setor: 'Ouvidoria', fila: '5 · 8h', emAtend: '3 · 4h', estourSla: 2, ocupacao: '92%', repasses: '2,5×/ticket', ocupNum: 92, repassesNum: 2.5 },
  { setor: 'Contas Médicas', fila: '10 · 1 dia', emAtend: '6 · 1 dia', estourSla: 0, ocupacao: '50%', repasses: '1,3×/ticket', ocupNum: 50, repassesNum: 1.3 },
]

export const setoresColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 150, sortable: true },
  { key: 'fila', label: 'Fila (n · TME)', minWidth: 130 },
  { key: 'emAtend', label: 'Em atend. (n · TMA)', minWidth: 150 },
  { key: 'estourSla', label: 'Estouro SLA', align: 'right', width: 120, sortBy: (r) => r.estourSla as number },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupNum as number },
  { key: 'repasses', label: 'Repasses (RF087)', width: 150 },
]

export const alertasSLA = {
  estouradosInternos: 12,
  maisAntigoHa: '3h 42min',
  vencimento24h: 28,
  vencimento4h: 9,
  proxCriticoEm: '6 horas',
}

// ── Bloco 4: Controle de Fluxo e Pendências — "Limbo" ──────────────────────

export const limboResumo = {
  total: 38,
  aguardBeneficiario: 6,
  aguardBeneficiarioDetalhe: 'SLA congelado · próx. prazo ao descongelar: 14 min',
  areaInternaSemResp: 4,
  areaInternaDetalhe: 'área interna · última interação: 2 dias',
  retornosNaoAssumidos: 4,
  retornosDetalhe: 'interações de 30 min a 1 dia sem atendente',
}

export interface LimboRow {
  setor: string
  total: number
  aging: string
  gaveta: string
}

export const limboSetores: LimboRow[] = [
  { setor: 'N1 · Atendimento', total: 29, aging: '4h 20min', gaveta: 'Juliana Santos · 12 tickets' },
  { setor: 'Auditoria Médica', total: 5, aging: '1d 12h', gaveta: 'Atendente B · 3 tickets' },
  { setor: 'Financeiro', total: 4, aging: '2d 4h', gaveta: 'Atendente C · 4 tickets' },
]

export const limboColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 150, sortable: true },
  { key: 'total', label: 'Pendências', align: 'right', width: 110, sortBy: (r) => r.total as number },
  { key: 'aging', label: 'Aging médio', width: 130 },
  { key: 'gaveta', label: '"Gaveta" — maior responsável', minWidth: 220 },
]

export const limboInsight =
  'O Financeiro tem apenas 4 tickets mas parados há +2 dias — possível gargalo processual. No N1, o alto volume (29) está concentrado na gaveta de Juliana Santos — intervenção pontual ou auxílio na limpeza da fila resolve sem impacto sistêmico.'
