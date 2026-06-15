// Tela de detalhe "Gestão de Filas e Atendimento Humano" (drill-down da aba
// Gestão de filas) — Figma "Central de Ações Prioritárias". Estrutura padrão:
// 1) Resumo executivo (KPIs) · 2) Tabela de filas · 3) Gráfico principal
// (evolução) · 4) Fila de abandono (métricas + gráficos) · 5) Registro de
// beneficiários · 6) Recomendações IA.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Tempo real', 'Hoje', '7 dias', '30 dias', 'Customizado'] as const

// ── Cabeçalho/contexto ────────────────────────────────────────────────────────
export const contexto = {
  badge: 'CRÍTICO',
  prioridade: 'Prioridade 1 de 3 ações pendentes',
  atualizado: 'Atualizado há 1 min · próxima leitura em 30s',
  titulo: 'Fila Dúvidas Administrativas em estouro de SLA',
  subtitulo:
    'Estouro projetado em 18 minutos · 18 beneficiários impactados · 3 protocolos com risco regulatório (Lei do SAC).',
}

// ── 1) Resumo executivo (KPIs) ────────────────────────────────────────────────
export interface FilaKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger'
}
export const resumoExecutivo: FilaKpi[] = [
  { label: 'Fila atual', value: '18', unit: '', status: 'warning' },
  { label: 'Aguardando', value: '12', unit: 'atendimentos', status: 'warning' },
  { label: 'TME', value: '14', unit: 'min', status: 'danger' },
  { label: 'SLA', value: '65', unit: '%', status: 'danger' },
  { label: 'Risco regulatório', value: '3', unit: 'protocolos', status: 'danger' },
]

// ── 2) Tabela de filas ────────────────────────────────────────────────────────
export type FilaLinha = {
  fila: string
  disponiveis: number
  emEspera: number
  emAtendimento: number
  finalizados: number
  tme: string
  tma: string
  nps: number | string
  abandonos: number
  reabertura: number
  ocupacao: number
  tone: 'danger' | 'warning' | 'success'
}
export const filasTabela: FilaLinha[] = [
  { fila: 'Financeiro (Boleto)', disponiveis: 5, emEspera: 18, emAtendimento: 3, finalizados: 42, tme: '14min', tma: '11min', nps: 61, abandonos: 7, reabertura: 3, ocupacao: 92, tone: 'danger' },
  { fila: 'Reembolso', disponiveis: 5, emEspera: 10, emAtendimento: 2, finalizados: 31, tme: '8min', tma: '7min', nps: 72, abandonos: 4, reabertura: 1, ocupacao: 90, tone: 'warning' },
  { fila: 'Dúvidas Adm.', disponiveis: 6, emEspera: 0, emAtendimento: 4, finalizados: 58, tme: '4min', tma: '5min', nps: 89, abandonos: 1, reabertura: 0, ocupacao: 84, tone: 'warning' },
  { fila: 'Autorizações', disponiveis: 2, emEspera: 4, emAtendimento: 1, finalizados: 19, tme: '—', tma: '6min', nps: '—', abandonos: 2, reabertura: 0, ocupacao: 45, tone: 'success' },
]
export const filasAlerta =
  'Fila Dúvidas Administrativas com risco de estouro — TME acima da SLA com 0 atendentes livres.'

// ── Correlação operacional (tabela diagnóstica por fila) ─────────────────────
export type CorrelStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'
export type FilaCorrel = {
  fila: string
  volume: number
  sla: number
  tme: string
  ocupacao: number
  espera: string
  gargalo: string
  status: CorrelStatus
}
export const correlacao: FilaCorrel[] = [
  { fila: 'Financeiro (Boleto)', volume: 842, sla: 61, tme: '14:00', ocupacao: 92, espera: '8:12', gargalo: 'Alta ocupação → TME elevado', status: 'Crítico' },
  { fila: 'Reembolso', volume: 531, sla: 72, tme: '8:00', ocupacao: 90, espera: '6:40', gargalo: 'Ocupação alta → fila crescente', status: 'Alto' },
  { fila: 'Dúvidas Adm.', volume: 614, sla: 89, tme: '4:00', ocupacao: 84, espera: '2:30', gargalo: 'SLA saudável; monitorar pico de demanda', status: 'Médio' },
  { fila: 'Autorizações', volume: 198, sla: 74, tme: '—', ocupacao: 45, espera: '1:10', gargalo: 'Baixa ocupação; sem gargalo identificado', status: 'OK' },
]
export const comoInterpretar =
  'Score Crítico = 2+ dimensões acima do limite simultaneamente. Filas com Alta Ocupação (>85%) E TME elevado (>8min) indicam subdimensionamento da equipe. Filas com SLA < meta E T. Espera alta indicam roteamento ou dimensionamento mal configurados.'

// ── 3) Gráfico principal · fila × período × indicador ─────────────────────────
export const indicadores = ['TME', 'TMA', 'SLA', 'Ocupação'] as const
export type Indicador = (typeof indicadores)[number]
export const graficoPeriodos = ['Últ. 4h', 'Hoje', '7 dias', '30 dias'] as const
export const horasGrafico = ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h']

// Série base de TME por fila (min); TMA/SLA/Ocupação são derivados no componente.
export interface FilaSerie {
  key: string
  label: string
  tme: number[]
  ativoPadrao: boolean
}
export const filasEvolucao: FilaSerie[] = [
  { key: 'reembolso', label: 'Reembolso', tme: [6, 7, 8, 9, 10, 11, 12, 13, 14], ativoPadrao: true },
  { key: 'duvidas', label: 'Dúvidas Adm.', tme: [8, 10, 11, 13, 14, 16, 17, 18, 19], ativoPadrao: true },
  { key: 'autorizacoes', label: 'Autorizações', tme: [3, 4, 4, 5, 5, 6, 6, 7, 7], ativoPadrao: false },
  { key: 'financeiro', label: 'Financeiro', tme: [10, 11, 12, 13, 14, 15, 16, 15, 14], ativoPadrao: false },
]
// Meta por indicador (min para TME/TMA; % para SLA/Ocupação).
export const graficoMeta: Record<Indicador, number> = { TME: 8, TMA: 8, SLA: 90, Ocupação: 85 }

export const anotacoes = [
  { titulo: 'Pico do dia', valor: '19min', sub: '→ 14h · Dúvidas Adm.' },
  { titulo: 'Filas acima da meta', valor: '2 de 4', sub: 'Reembolso · Dúvidas' },
  { titulo: 'Tendência geral', valor: '↑ Alta', sub: 'Últimas 3 horas' },
]

// ── 4) Fila de abandono ───────────────────────────────────────────────────────
export interface AbandonoMetric {
  label: string
  value: string
  sub: string
  tone: 'danger' | 'warning' | 'neutral'
}
export const abandonoMetrics: AbandonoMetric[] = [
  { label: 'Total de abandonos', value: '23', sub: '↑ +8 vs média histórica', tone: 'danger' },
  { label: 'Tempo médio abandono', value: '16min', sub: '↑ Meta é 8min', tone: 'danger' },
  { label: 'Assunto principal', value: 'Reembolso', sub: '11 de 23 casos (48%)', tone: 'neutral' },
  { label: 'Taxa de abandono', value: '12%', sub: '↑ Meta máxima: 5%', tone: 'danger' },
]
export const abandonosPorHora = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h'],
  valores: [1, 2, 3, 4, 6, 5, 3, 2, 1],
  media: 3,
  picoLabel: 'Pico: 12h com 6 casos',
  picoIdx: 4,
}
export const abandonoPorAssunto = [
  { nome: 'Reembolso', value: 48 },
  { nome: 'Dúvidas Adm.', value: 26 },
  { nome: 'Autorizações', value: 15 },
  { nome: 'Financeiro', value: 11 },
]

// ── 5) Registro de beneficiários ──────────────────────────────────────────────
export type Beneficiario = {
  beneficiario: string
  fila: string
  assunto: string
  espera: string
  horario: string
  tentativas: string
}
export const beneficiarios: Beneficiario[] = [
  { beneficiario: 'João S.', fila: 'Reembolso', assunto: 'Recurso negado', espera: '22min', horario: '12:04', tentativas: '1ª vez' },
  { beneficiario: 'Maria L.', fila: 'Dúvidas Adm.', assunto: 'Contrato / Reajuste', espera: '19min', horario: '12:11', tentativas: '2ª vez' },
  { beneficiario: 'Carlos M.', fila: 'Reembolso', assunto: '1ª solicitação', espera: '14min', horario: '12:18', tentativas: '1ª vez' },
  { beneficiario: 'Ana R.', fila: 'Autorizações', assunto: 'Exame de imagem', espera: '11min', horario: '12:31', tentativas: '3ª vez' },
  { beneficiario: 'Pedro F.', fila: 'Dúvidas Adm.', assunto: 'Cancelamento', espera: '09min', horario: '12:44', tentativas: '1ª vez' },
  { beneficiario: 'Luisa T.', fila: 'Reembolso', assunto: 'Recurso negado', espera: '08min', horario: '13:02', tentativas: '2ª vez' },
]
export const totalAbandonos = 23

// ── 6) Recomendações IA ───────────────────────────────────────────────────────
export const diagnosticoFila = {
  confianca: 'confiança 91% · baseado em 847 casos similares',
  texto:
    'Fila Dúvidas Administrativas em estouro projetado em 18 minutos · 18 beneficiários impactados · 3 protocolos com risco regulatório (Lei do SAC). Cenário B (3 atendentes + BOT de triagem) tem maior viabilidade operacional e menor risco regulatório nos próximos 30 minutos.',
}
export const recomendacoesFila: RecomendacaoIA[] = [
  {
    titulo: 'Aplicar Cenário B (recomendado)',
    corpo: 'Realocar 3 atendentes especializados da fila Reembolso para Dúvidas Adm. nas próximas 2h. Ativar BOT de triagem inicial em paralelo para reduzir carga.',
    impacto: 'TME -52% · SLA +21pp · risco Lei SAC mitigado',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Triagem de protocolos críticos',
    corpo: 'Identificar e priorizar manualmente os 3 protocolos com risco regulatório antes da realocação geral. Notificar supervisores em 5min.',
    impacto: 'Risco regulatório -100% · 3 protocolos',
    acao: 'Detalhar',
  },
  {
    titulo: 'Comunicação proativa aos beneficiários',
    corpo: 'Disparar SMS aos 18 beneficiários impactados informando previsão de atendimento e oferecendo canal alternativo (WhatsApp).',
    impacto: 'Abandono projetado -45% · NPS +',
    acao: 'Detalhar',
  },
]

export const proximaAcao = 'Fluxo Envio de Documentos com 15% abandono'
