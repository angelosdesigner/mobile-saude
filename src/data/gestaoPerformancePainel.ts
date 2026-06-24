// Fixtures do painel "Gestão e Performance" — área executiva (NÃO operacional).
// Público: supervisores, coordenadores, gestores, qualidade, ouvidoria, regulatório.
// Estrutura em 5 subabas (padrão do Tempo Real): Visão Geral · Gestão de Riscos ·
// Gargalos e Setores · Pendências e Limbo · Qualidade e Experiência.
// Princípios: gestão por exceção, menor carga cognitiva, visão executiva + ação.
import type { DataListColumn } from '@/components/ui/dataList'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

// Gerador determinístico (sem Math.random) p/ séries de tendência realistas.
const serie = (base: number, amp: number, n: number, phase = 0): number[] =>
  Array.from({ length: n }, (_, i) =>
    Math.round(base + amp * Math.sin((i / n) * Math.PI * 2 + phase) + amp * 0.35 * Math.sin(i * 0.8)),
  )

// ───────────────────────────────────────────────────────────────────────────
// SUBABA 1 · VISÃO GERAL
// ───────────────────────────────────────────────────────────────────────────

export type KpiStatus = 'ok' | 'warning' | 'danger' | 'neutral'
export type DeltaTone = 'up' | 'down' | 'neutral'

export interface ExecKpi {
  label: string
  value: string
  unit: string
  status: KpiStatus
  delta: string
  deltaTone: DeltaTone
  /** Rota de drill-down opcional — quando presente, o card vira clicável. */
  to?: string
}

// 8 KPIs executivos (tendência/variação vs período anterior). deltaTone reflete
// se a MUDANÇA é boa (up=verde) ou ruim (down=vermelho), não a direção da seta.
export const kpisExecutivos: ExecKpi[] = [
  { label: 'Backlog Total', value: '156', unit: 'tickets', status: 'neutral', delta: '↓ 6% vs período ant.', deltaTone: 'up', to: '/gestor/ocorrencias?view=lista' },
  { label: 'SLA Regulatório ANS', value: '96', unit: '%', status: 'ok', delta: '↑ 2 p.p. vs ant.', deltaTone: 'up', to: '/gestor/risco-detalhe' },
  { label: 'FCR', value: '82', unit: '%', status: 'ok', delta: '↑ 1 p.p. · 1º contato', deltaTone: 'up', to: '/gestor/qualidade-detalhe' },
  { label: 'TMR', value: '4,2', unit: 'dias', status: 'warning', delta: '↑ 0,3 dia acima da meta', deltaTone: 'down', to: '/gestor/gargalos-detalhe' },
  { label: 'Taxa de Reabertura', value: '8', unit: '%', status: 'warning', delta: '↑ 12% nos últimos 7 dias', deltaTone: 'down', to: '/gestor/qualidade-detalhe?ind=reabertura' },
  { label: 'NPS', value: '72', unit: '', status: 'warning', delta: '↓ 8 pts vs período ant.', deltaTone: 'down', to: '/gestor/qualidade-detalhe?ind=nps' },
  { label: 'CSAT', value: '4,6', unit: '/5', status: 'ok', delta: '↑ 0,1 vs ant.', deltaTone: 'up', to: '/gestor/qualidade-detalhe?ind=csat' },
  { label: 'CES', value: '2,4', unit: '/5', status: 'ok', delta: '↓ 0,2 · menor esforço', deltaTone: 'up', to: '/gestor/qualidade-detalhe?ind=ces' },
]

// Bloco 1 — Saúde da Operação: tendência de 30 dias (Backlog · SLA · Volume).
export const saudeOperacao = {
  dias: Array.from({ length: 30 }, (_, i) => String(i + 1)),
  backlog: serie(150, 14, 30, 0.6),
  sla: serie(93, 4, 30, 2.1),
  volume: serie(205, 28, 30, 1.2),
}

// Bloco 2 — Qualidade da Operação: gap sistema × beneficiário.
export const gapResolutividade = {
  sistema: 82,
  beneficiario: 74,
  gap: 8,
  nota: 'O sistema considera resolvido, mas ~1 em cada 12 beneficiários discorda. Atenção à resolutividade percebida.',
}

// Tipos de insight executivo (cards inteligentes) — consumidos pelo componente
// reutilizável InsightsExecutivos.vue (atualmente sem uso ativo nas subabas).
export type InsightTipo = 'danger' | 'warning' | 'info' | 'success'
export interface InsightExec {
  tipo: InsightTipo
  tag: string
  texto: string
  acao?: string
  acaoTab?: string
}

// ───────────────────────────────────────────────────────────────────────────
// SUBABA 2 · GESTÃO DE RISCOS (tela mais importante — atuação preventiva)
// ───────────────────────────────────────────────────────────────────────────

export type RiscoNivel = 'CRÍTICO' | 'ALTO' | 'MODERADO' | 'BAIXO'

export interface RiskMetric {
  label: string
  value: string
  tone?: 'danger' | 'warning' | 'success' | 'neutral'
}

export interface RiskCard {
  chave: string
  titulo: string
  descricao: string
  nivel: RiscoNivel
  metricas: RiskMetric[]
}

export const riskCards: RiskCard[] = [
  {
    chave: 'nips',
    titulo: 'NIPs',
    descricao: 'Notificações de Intervenção Preliminar — resposta obrigatória à ANS.',
    nivel: 'ALTO',
    metricas: [
      { label: 'Volume atual', value: '7 casos' },
      { label: 'Próx. vencimento', value: '1 dia', tone: 'warning' },
      { label: 'TMR médio', value: '2 dias' },
      { label: 'Status de risco', value: 'Alto', tone: 'warning' },
    ],
  },
  {
    chave: 'escalonamento',
    titulo: 'Escalonamento',
    descricao: 'Casos com potencial de virar reclamações formais ou processos judiciais.',
    nivel: 'ALTO',
    metricas: [
      { label: 'Volume atual', value: '3 casos' },
      { label: 'Prazo mais crítico', value: '8 horas', tone: 'danger' },
      { label: 'Tendência', value: '↑ +2 na semana', tone: 'danger' },
      { label: 'Risco', value: 'Alto', tone: 'warning' },
    ],
  },
  {
    chave: 'liminares',
    titulo: 'Liminares e Casos Críticos',
    descricao: 'Passivos financeiros elevados — liminares e procedimentos cirúrgicos.',
    nivel: 'MODERADO',
    metricas: [
      { label: 'Casos ativos', value: '2 casos' },
      { label: 'Prazo médio', value: '1 dia' },
      { label: 'Impacto financeiro est.', value: 'R$ 180 mil', tone: 'warning' },
      { label: 'Criticidade', value: 'Moderada', tone: 'warning' },
    ],
  },
  {
    chave: 'menor-prazo',
    titulo: 'Menor Prazo Regulatório',
    descricao: 'Tipificações com janelas de resposta regulatória extremamente curtas.',
    nivel: 'CRÍTICO',
    metricas: [
      { label: 'Quantidade', value: '4 tickets' },
      { label: 'Próx. vencimento', value: '3 horas', tone: 'danger' },
      { label: 'Criticidade', value: 'Crítica', tone: 'danger' },
      { label: 'Tipos', value: 'Negativas e exames' },
    ],
  },
]

export type RiscoOcorrencia = 'Crítico' | 'Alto' | 'Moderado' | 'Baixo'

// `type` (não `interface`) para satisfazer o genérico `T extends Record<string,
// unknown>` do DataList — interfaces não ganham index signature implícita.
export type CriticaRow = {
  protocolo: string
  beneficiario: string
  tipo: string
  setor: string
  vencimento: string
  vencHoras: number
  risco: RiscoOcorrencia
}

export const top10Criticas: CriticaRow[] = [
  { protocolo: '#0042-T', beneficiario: 'Marcos A. Souza', tipo: 'Negativa por escrito', setor: 'Ouvidoria', vencimento: '3 horas', vencHoras: 3, risco: 'Crítico' },
  { protocolo: '#0051-T', beneficiario: 'Helena R. Dias', tipo: 'Exame de alta complexidade', setor: 'Auditoria', vencimento: '5 horas', vencHoras: 5, risco: 'Crítico' },
  { protocolo: '#0047-T', beneficiario: 'João P. Lima', tipo: 'Liminar — cirurgia', setor: 'Contas Médicas', vencimento: '8 horas', vencHoras: 8, risco: 'Alto' },
  { protocolo: '#0039-T', beneficiario: 'Sandra M. Costa', tipo: 'NIP — reembolso', setor: 'Reembolsos', vencimento: '12 horas', vencHoras: 12, risco: 'Alto' },
  { protocolo: '#0055-T', beneficiario: 'Pedro H. Alves', tipo: 'Reanálise — negativa', setor: 'Ouvidoria', vencimento: '1 dia', vencHoras: 24, risco: 'Alto' },
  { protocolo: '#0033-T', beneficiario: 'Lucia F. Nunes', tipo: 'NIP — autorização', setor: 'Auditoria', vencimento: '1 dia', vencHoras: 26, risco: 'Moderado' },
  { protocolo: '#0061-T', beneficiario: 'Rafael T. Gomes', tipo: 'Escalonamento ouvidoria', setor: 'Ouvidoria', vencimento: '1 dia', vencHoras: 30, risco: 'Moderado' },
  { protocolo: '#0029-T', beneficiario: 'Beatriz L. Rocha', tipo: 'Procedimento cirúrgico', setor: 'Contas Médicas', vencimento: '2 dias', vencHoras: 48, risco: 'Moderado' },
  { protocolo: '#0044-T', beneficiario: 'Gabriel S. Pinto', tipo: 'NIP — reembolso', setor: 'Reembolsos', vencimento: '2 dias', vencHoras: 50, risco: 'Baixo' },
  { protocolo: '#0058-T', beneficiario: 'Camila V. Ramos', tipo: 'Dúvida regulatória', setor: 'Financeiro', vencimento: '3 dias', vencHoras: 72, risco: 'Baixo' },
]

export const top10Columns: DataListColumn[] = [
  { key: 'protocolo', label: 'Protocolo', width: 110 },
  { key: 'beneficiario', label: 'Beneficiário', minWidth: 160, sortable: true },
  { key: 'tipo', label: 'Tipo', minWidth: 180, sortable: true },
  { key: 'setor', label: 'Setor', width: 140, sortable: true },
  { key: 'vencimento', label: 'Vencimento', width: 120, sortBy: (r) => r.vencHoras as number },
  { key: 'risco', label: 'Risco', width: 120, sortBy: (r) => r.vencHoras as number },
]

// ───────────────────────────────────────────────────────────────────────────
// SUBABA 3 · GARGALOS E SETORES (heatmap operacional)
// ───────────────────────────────────────────────────────────────────────────

export type SemaforoNivel = 'critico' | 'atencao' | 'ok'

export interface SetorHeat {
  /** Slug usado no drill-down (?setor=) do detalhe de Gargalos. */
  chave: string
  setor: string
  fila: number
  emAtendimento: number
  slaEstourado: number
  ocupacao: number
  repasses: string
  aging: string
  nivel: SemaforoNivel
}

export const setoresHeat: SetorHeat[] = [
  { chave: 'n1', setor: 'N1 · Atendimento', fila: 8, emAtendimento: 14, slaEstourado: 5, ocupacao: 88, repasses: '1,2×', aging: '4h 20min', nivel: 'critico' },
  { chave: 'reembolsos', setor: 'Reembolsos', fila: 12, emAtendimento: 8, slaEstourado: 0, ocupacao: 45, repasses: '1,1×', aging: '2 dias', nivel: 'ok' },
  { chave: 'ouvidoria', setor: 'Ouvidoria', fila: 5, emAtendimento: 3, slaEstourado: 2, ocupacao: 92, repasses: '2,5×', aging: '8h', nivel: 'critico' },
  { chave: 'auditoria', setor: 'Auditoria', fila: 9, emAtendimento: 6, slaEstourado: 1, ocupacao: 78, repasses: '1,8×', aging: '1d 12h', nivel: 'atencao' },
  { chave: 'financeiro', setor: 'Financeiro', fila: 4, emAtendimento: 5, slaEstourado: 0, ocupacao: 52, repasses: '1,3×', aging: '2d 4h', nivel: 'atencao' },
  { chave: 'contas-medicas', setor: 'Contas Médicas', fila: 10, emAtendimento: 6, slaEstourado: 0, ocupacao: 50, repasses: '1,3×', aging: '1 dia', nivel: 'ok' },
]

export const alertasGargalos = {
  estouradosInternos: 12,
  maisAntigoHa: '3h 42min',
  vencimento24h: 28,
  vencimento4h: 9,
  proxCriticoEm: '6 horas',
}


// ───────────────────────────────────────────────────────────────────────────
// SUBABA 4 · PENDÊNCIAS E LIMBO (tickets esquecidos)
// ───────────────────────────────────────────────────────────────────────────

export interface LimboKpi {
  label: string
  value: string
  unit: string
  status: KpiStatus
  delta: string
  deltaTone: DeltaTone
}

export const limboKpis: LimboKpi[] = [
  { label: 'Total em Limbo', value: '38', unit: 'tickets', status: 'warning', delta: 'pendências ativas', deltaTone: 'neutral' },
  { label: 'Aging Médio', value: '1d 9h', unit: '', status: 'warning', delta: '↑ 4h vs período ant.', deltaTone: 'down' },
  { label: 'Pendências Internas', value: '4', unit: '', status: 'warning', delta: 'área interna · 2 dias s/ resposta', deltaTone: 'neutral' },
  { label: 'Com Beneficiário', value: '6', unit: '', status: 'danger', delta: 'SLA congelado · descongela em 14min', deltaTone: 'neutral' },
  { label: 'Retornos não assumidos', value: '4', unit: '', status: 'warning', delta: '30 min a 1 dia sem atendente', deltaTone: 'neutral' },
]

export interface LimboCategoria {
  categoria: string
  /** Slug usado no drill-down (?cat=) do detalhe de Limbo. */
  cat: string
  valor: number
  pct: number
  tone: 'danger' | 'warning' | 'neutral'
  descricao: string
}

export const limboDistribuicao: LimboCategoria[] = [
  { categoria: 'Aguardando beneficiário', cat: 'beneficiario', valor: 6, pct: 16, tone: 'danger', descricao: 'SLA congelado aguardando retorno do cliente' },
  { categoria: 'Área interna sem resposta', cat: 'interna', valor: 4, pct: 11, tone: 'warning', descricao: 'cobrança a setores de retaguarda' },
  { categoria: 'Retorno não assumido', cat: 'retorno', valor: 4, pct: 10, tone: 'warning', descricao: 'cliente respondeu, nenhum atendente assumiu' },
]

export interface ResponsavelRow {
  atendente: string
  avatar: string
  quantidade: number
  aging: string
  tone: 'danger' | 'warning' | 'success'
}

export const limboResponsaveis: ResponsavelRow[] = [
  { atendente: 'Juliana Santos', avatar: 'JS', quantidade: 12, aging: '4h 20min', tone: 'danger' },
  { atendente: 'Atendente B', avatar: 'AB', quantidade: 8, aging: '1d 6h', tone: 'warning' },
  { atendente: 'Atendente C', avatar: 'AC', quantidade: 6, aging: '2d 4h', tone: 'warning' },
  { atendente: 'Atendente D', avatar: 'AD', quantidade: 4, aging: '18h', tone: 'success' },
]

// `type` (DataList rows — ver CriticaRow).
export type LimboSetorRow = {
  setor: string
  pendencias: number
  aging: string
  responsavel: string
}

export const limboSetores: LimboSetorRow[] = [
  { setor: 'N1 · Atendimento', pendencias: 29, aging: '4h 20min', responsavel: 'Juliana Santos · 12 tickets' },
  { setor: 'Auditoria Médica', pendencias: 5, aging: '1d 12h', responsavel: 'Atendente B · 3 tickets' },
  { setor: 'Financeiro', pendencias: 4, aging: '2d 4h', responsavel: 'Atendente C · 4 tickets' },
]

export const limboColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 160, sortable: true },
  { key: 'pendencias', label: 'Pendências', align: 'right', width: 120, sortBy: (r) => r.pendencias as number },
  { key: 'aging', label: 'Aging médio', width: 140 },
  { key: 'responsavel', label: 'Responsável crítico', minWidth: 240 },
]


// ───────────────────────────────────────────────────────────────────────────
// SUBABA 5 · QUALIDADE E EXPERIÊNCIA (percepção do beneficiário)
// ───────────────────────────────────────────────────────────────────────────

export const qualidadeKpis: ExecKpi[] = [
  { label: 'NPS', value: '72', unit: '', status: 'warning', delta: '↓ 8 pts vs ant.', deltaTone: 'down' },
  { label: 'CSAT', value: '4,6', unit: '/5', status: 'ok', delta: '↑ 0,1 vs ant.', deltaTone: 'up' },
  { label: 'CES', value: '2,4', unit: '/5', status: 'ok', delta: '↓ 0,2 · menor esforço', deltaTone: 'up' },
  { label: 'FCR', value: '82', unit: '%', status: 'ok', delta: '↑ 1 p.p. · 1º contato', deltaTone: 'up' },
  { label: 'Taxa de Reabertura', value: '8', unit: '%', status: 'warning', delta: '↑ 12% em 7 dias', deltaTone: 'down' },
  { label: 'Gap de Resolutividade', value: '8', unit: 'p.p.', status: 'warning', delta: '↑ 1 p.p. vs ant.', deltaTone: 'down' },
]

export const qualidadeComparacao = {
  operacional: { label: 'Qualidade Operacional', valor: '82%', descricao: 'resolvido pelo sistema (FCR + SLA)' },
  percebida: { label: 'Qualidade Percebida', valor: '74%', descricao: 'confirmado pelo beneficiário (CSAT)' },
}

// Evolução de 90 dias (~13 semanas). NPS em 0–100; CSAT e CES em 0–5 (1 casa).
export const evolucaoExperiencia = {
  dias: Array.from({ length: 13 }, (_, i) => `S${i + 1}`),
  nps: serie(76, 6, 13, 0.4),
  csat: serie(46, 3, 13, 1.1).map((v) => +(v / 10).toFixed(1)),
  ces: serie(24, 4, 13, 2.3).map((v) => +(v / 10).toFixed(1)),
}

export interface MotivoReabertura {
  motivo: string
  pct: number
}

export const reabertura = {
  taxa: '8%',
  tendencia: '↑ 12% nos últimos 7 dias',
  tendenciaTone: 'down' as DeltaTone,
  motivos: [
    { motivo: 'Solução não resolveu de fato', pct: 38 },
    { motivo: 'Falta de retorno no prazo', pct: 27 },
    { motivo: 'Informação divergente entre canais', pct: 19 },
    { motivo: 'Reabertura por novo evento', pct: 16 },
  ] as MotivoReabertura[],
}

