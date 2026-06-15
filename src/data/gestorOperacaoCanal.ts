// Tela de detalhe "Operação por Canal" (drill-down da aba Atendimentos) —
// Figma 7651:98838. Estrutura padrão das telas de detalhe do gestor:
// 1) Indicadores do canal · 2) Operação por canal (tabela) · 3) Evolução ·
// 4) Correlação operacional · 5) Alertas · 6) Recomendações IA.
// Valores fiéis ao frame de referência (canal Telefone · crítico).

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

// ── Cabeçalho/contexto ──────────────────────────────────────────────────────
export const contexto = {
  badge: 'CANAL CRÍTICO',
  badgeTone: 'danger' as const,
  resumoSla: 'SLA 71% · pior canal no momento',
  titulo: 'Operação por Canal',
  canalAtivo: 'Telefone',
  subtitulo: '12 atendentes alocados · 23% do volume total · 47 atendimentos em curso',
}

export interface CanalPill {
  nome: string
  sla: number
  tone: 'success' | 'warning' | 'danger'
  ativo?: boolean
}

// SLA por canal nas pills do cabeçalho.
export const canalPills: CanalPill[] = [
  { nome: 'WhatsApp', sla: 84, tone: 'warning' },
  { nome: 'Chat', sla: 92, tone: 'success' },
  { nome: 'Telefone', sla: 71, tone: 'danger', ativo: true },
  { nome: 'Balcão', sla: 88, tone: 'success' },
]

// ── 1) Indicadores do canal (KPIs) ──────────────────────────────────────────
export interface CanalKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadoresCanal: CanalKpi[] = [
  { label: 'TME', value: '2.4', unit: 'min', status: 'danger', delta: 'meta 1.5min', deltaTone: 'down' },
  { label: 'Volume', value: '847', unit: 'atend.', status: 'warning', delta: '23% do total', deltaTone: 'neutral' },
  { label: 'TMA', value: '9', unit: 'min', status: 'warning' },
  { label: 'Ocupação', value: '92', unit: '%', status: 'danger', delta: '12/12 atendentes', deltaTone: 'down' },
]

// ── 2) Operação por canal · agora (tabela) ───────────────────────────────────
export type CanalLinha = {
  canal: string
  atendentes: number
  emEspera: number
  emAtendimento: number
  finalizados: number
  tme: string
  sla: number
  slaTone: 'success' | 'warning' | 'danger'
  esperaTone?: 'danger'
  ativo?: boolean
}

export const operacaoAgora: CanalLinha[] = [
  { canal: 'WhatsApp', atendentes: 14, emEspera: 12, emAtendimento: 47, finalizados: 384, tme: '2.1 min', sla: 84, slaTone: 'success' },
  { canal: 'Chat', atendentes: 8, emEspera: 4, emAtendimento: 21, finalizados: 218, tme: '1.8 min', sla: 92, slaTone: 'success' },
  { canal: 'Telefone', atendentes: 12, emEspera: 47, emAtendimento: 38, finalizados: 156, tme: '2.4 min', sla: 71, slaTone: 'danger', esperaTone: 'danger', ativo: true },
  { canal: 'Balcão', atendentes: 3, emEspera: 5, emAtendimento: 8, finalizados: 89, tme: '4.2 min', sla: 88, slaTone: 'success' },
  { canal: 'Portal Web', atendentes: 2, emEspera: 1, emAtendimento: 4, finalizados: 42, tme: '1.2 min', sla: 95, slaTone: 'success' },
  { canal: 'App', atendentes: 1, emEspera: 0, emAtendimento: 2, finalizados: 28, tme: '0.9 min', sla: 98, slaTone: 'success' },
]

// ── 3) Evolução do canal · últimas 12h ───────────────────────────────────────
// Volume (barras, eixo esq.) × métrica selecionável (linha, eixo dir. %).
export const evolucao = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  volume: [46, 58, 70, 75, 82, 90, 100, 96, 95, 88, 72, 68],
  // Linha por métrica (%). SLA é o default (casa a legenda "SLA atual").
  series: {
    SLA: [95, 93, 90, 88, 80, 72, 64, 67, 65, 60, 58, 56],
    Retenção: [78, 76, 74, 72, 70, 66, 60, 62, 61, 58, 55, 54],
    TME: [62, 64, 66, 70, 78, 84, 92, 88, 86, 90, 80, 78],
  } as Record<string, number[]>,
  meta: 90,
  picoIdx: 3, // 11h · pico vespertino
  picoLabel: '11h · pico vespertino',
  agoraIdx: 9, // 17h
}
export const evolucaoMetricas = ['SLA', 'Retenção', 'TME'] as const

// ── 4) Correlação operacional (tabela) ───────────────────────────────────────
export type CorrelStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type CorrelLinha = {
  canal: string
  volume: number
  sla: number
  tme: string
  ocupacao: number
  espera: string
  gargalo: string
  status: CorrelStatus
}

export const correlacao: CorrelLinha[] = [
  { canal: 'Telefone', volume: 276, sla: 61, tme: '9:23', ocupacao: 95, espera: '12:41', gargalo: 'Alta ocupação → TME elevado', status: 'Crítico' },
  { canal: 'WhatsApp', volume: 1456, sla: 79, tme: '6:14', ocupacao: 83, espera: '8:02', gargalo: 'Volume alto → fila crescente', status: 'Alto' },
  { canal: 'Chat', volume: 920, sla: 68, tme: '7:48', ocupacao: 78, espera: '9:34', gargalo: 'SLA < meta; espera > 9min', status: 'Alto' },
  { canal: 'App', volume: 89, sla: 55, tme: '12:40', ocupacao: 91, espera: '18:20', gargalo: 'Baixo vol., alta ocup. → gargalo', status: 'Crítico' },
  { canal: 'Portal Web', volume: 412, sla: 74, tme: '5:17', ocupacao: 62, espera: '4:48', gargalo: 'Estável; ligeira piora no TME', status: 'Médio' },
  { canal: 'Balcão', volume: 143, sla: 96, tme: '2:34', ocupacao: 58, espera: '1:12', gargalo: 'Sem gargalo identificado', status: 'OK' },
]

export const comoInterpretar =
  'Score Crítico = 2+ dimensões acima do limite simultaneamente. Canais com Alta Ocupação (>85%) E TME elevado (>8min) indicam subdimensionamento da equipe. Canais com SLA < meta E T. Espera alta indicam problema de roteamento ou fila mal configurada.'

// ── 5) Alertas do canal · ativos ─────────────────────────────────────────────
export interface AlertaCanal {
  severidade: 'CRÍTICO' | 'ATENÇÃO'
  tempo: string
  titulo: string
  corpo: string
}

export const alertas: AlertaCanal[] = [
  {
    severidade: 'CRÍTICO',
    tempo: 'há 4h',
    titulo: 'TME acima da meta há 4h',
    corpo: '2.4min vs meta 1.5min · 47 chamados aguardando · risco de abandono em escala',
  },
  {
    severidade: 'CRÍTICO',
    tempo: 'há 3h',
    titulo: 'SLA abaixo de 80% há 3h',
    corpo: 'Queda contínua desde 13h · Autorizações respondem por 38% do impacto',
  },
  {
    severidade: 'ATENÇÃO',
    tempo: 'há 47min',
    titulo: 'Ocupação saturada',
    corpo: '12 de 12 atendentes ocupados há 47min · sem capacidade para picos adicionais',
  },
]

// ── 6) Recomendações IA ──────────────────────────────────────────────────────
export const diagnosticoCanal = {
  confianca: 'confiança 89% · 218 padrões similares',
  texto:
    'O canal Telefone concentra demandas complexas (Autorizações, Reembolso, Dúvidas Administrativas representam 80% do volume) mas opera com capacidade saturada nos horários de pico. Migrar 25-30% de Autorizações para WhatsApp via BOT pode aliviar a fila telefônica sem perder qualidade.',
}

export interface RecomendacaoCanal {
  titulo: string
  corpo: string
  impacto: string
  acao: string
  destaque?: boolean
}

export const recomendacoesCanal: RecomendacaoCanal[] = [
  {
    titulo: 'Migrar Autorizações para BOT WhatsApp',
    corpo: 'Ativar fluxo de autorização prévia via BOT no WhatsApp para casos simples (consulta, exames de rotina). BOT atual tem retenção de 72% em fluxos similares.',
    impacto: 'Volume Telefone -28% · em 2h',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Escalar capacidade Telefone',
    corpo: 'Adicionar 3 atendentes de outras filas durante o pico vespertino (14h-18h). Patricia M. e João C. têm equipes com folga.',
    impacto: 'TME -45% · SLA +15 pp',
    acao: 'Detalhar',
  },
  {
    titulo: 'Callback inteligente',
    corpo: 'Oferecer retorno em horário escolhido para clientes em fila >5min. Reduz pressão imediata sem perder demanda.',
    impacto: 'TME percebido -60% · NPS +',
    acao: 'Detalhar',
  },
]

// Rodapé: link para o canal saudável de referência.
export const canalSaudavel = { nome: 'Chat', sla: 92 }
