// Fixtures do "Centro de Indicadores Operacionais" do gestor — Figma 7651:87503
// (+ detalhes 8008:*). Valores extraídos fielmente dos frames. A tela é
// parametrizada pelo indicador ativo (?ind=).

export type IndicadorKey = 'fcr' | 'resolucao' | 'tme' | 'tmef' | 'tma' | 'nps' | 'abandono'

export interface IndicadorKpi {
  key: IndicadorKey
  label: string
  value: string
  status: 'ok' | 'warning' | 'danger'
}

// Cards seletores (linha "Indicadores estratégicos") — 7 KPIs.
export const indicadorKpis: IndicadorKpi[] = [
  { key: 'fcr', label: 'FCR', value: '73%', status: 'warning' },
  { key: 'resolucao', label: 'Resol. de chamados', value: '91%', status: 'ok' },
  { key: 'tme', label: 'TME', value: '12min', status: 'danger' },
  { key: 'tmef', label: 'TMEF', value: '4,2min', status: 'warning' },
  { key: 'tma', label: 'TMA', value: '14min', status: 'warning' },
  { key: 'nps', label: 'NPS', value: '50', status: 'ok' },
  { key: 'abandono', label: 'Abandono', value: '6,4%', status: 'danger' },
]

export interface Comparacao {
  label: string
  value: string
  tone: 'up' | 'down' | 'neutral'
}

export interface IndicadorDetalhe {
  titulo: string
  subtitulo: string
  valor: string
  delta: string
  deltaSub: string
  deltaTone: 'up' | 'down' | 'neutral'
  meta: number
  serieAtual: number[]
  serieAnterior: number[]
  comparacoes: Comparacao[]
  pioresSegmentos: { label: string; value: string }[]
}

const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export const detalhePorIndicador: Record<IndicadorKey, IndicadorDetalhe> = {
  fcr: {
    titulo: 'Evolução Temporal · FCR',
    subtitulo: '7 dias com comparativo vs semana anterior e vs meta 80%',
    valor: '73%',
    delta: '-3,2 pp',
    deltaSub: 'vs período anterior · meta 80%',
    deltaTone: 'down',
    meta: 80,
    serieAtual: [78, 77, 76, 75, 74, 73, 73],
    serieAnterior: [80, 79, 79, 78, 77, 76, 76],
    comparacoes: [
      { label: 'vs Meta (80%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-3,2 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '68%' },
      { label: 'Canal: Telefone', value: '70%' },
      { label: 'Turno: Noite', value: '65%' },
    ],
  },
  resolucao: {
    titulo: 'Evolução Temporal · Resolução',
    subtitulo: '7 dias com comparativo vs semana anterior e vs meta 95%',
    valor: '91%',
    delta: '-1,8 pp',
    deltaSub: 'vs período anterior · meta 95%',
    deltaTone: 'down',
    meta: 95,
    serieAtual: [93, 93, 92, 92, 91, 91, 91],
    serieAnterior: [94, 94, 93, 93, 93, 93, 93],
    comparacoes: [
      { label: 'vs Meta (95%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-1,8 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Carência', value: '78%' },
      { label: 'Canal: Telefone', value: '87%' },
      { label: 'Turno: Noite', value: '82%' },
    ],
  },
  tme: {
    titulo: 'Evolução Temporal · TME',
    subtitulo: '7 dias com comparativo vs período anterior e vs meta',
    valor: '12min',
    delta: '-4,1min',
    deltaSub: 'vs período anterior · meta 12',
    deltaTone: 'down',
    meta: 12,
    serieAtual: [16, 15, 14, 13, 13, 12, 12],
    serieAnterior: [17, 17, 16, 16, 16, 16, 16],
    comparacoes: [
      { label: 'vs Meta (90%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-4,1 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Dúvidas Adm.', value: '15min' },
      { label: 'Canal: Telefone', value: '16min' },
      { label: 'Turno: Noite', value: '18min' },
    ],
  },
  tmef: {
    titulo: 'Evolução Temporal · TMEF',
    subtitulo: '24h com comparativo vs benchmark setor 4min',
    valor: '4,2min',
    delta: '+0,3min',
    deltaSub: 'vs período anterior · meta 4min',
    deltaTone: 'down',
    meta: 4,
    serieAtual: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2, 4.2],
    serieAnterior: [3.6, 3.7, 3.8, 3.9, 3.9, 3.9, 3.9],
    comparacoes: [
      { label: 'vs Meta (4min)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '+0,3min', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Dúvidas Adm.', value: '6,8min' },
      { label: 'Canal: Telefone', value: '5,4min' },
      { label: 'Turno: Noite', value: '6,5min' },
    ],
  },
  nps: {
    titulo: 'Evolução Temporal · NPS',
    subtitulo: 'Trimestre com comparativo vs período anterior',
    valor: '50',
    delta: '-8',
    deltaSub: 'vs período anterior · meta 65',
    deltaTone: 'down',
    meta: 65,
    serieAtual: [58, 56, 54, 53, 52, 51, 50],
    serieAnterior: [60, 60, 59, 59, 58, 58, 58],
    comparacoes: [
      { label: 'vs Meta (65)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '-8', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '38' },
      { label: 'Canal: Telefone', value: '42' },
      { label: 'Turno: Noite', value: '36' },
    ],
  },
  tma: {
    titulo: 'Evolução Temporal · TMA',
    subtitulo: '7 dias com comparativo vs período anterior e vs meta 12min',
    valor: '14min',
    delta: '+1,5min',
    deltaSub: 'vs período anterior · meta 12min',
    deltaTone: 'down',
    meta: 12,
    serieAtual: [12, 12, 13, 13, 14, 14, 14],
    serieAnterior: [11, 11, 12, 12, 12, 13, 13],
    comparacoes: [
      { label: 'vs Meta (12min)', value: '+2min', tone: 'down' },
      { label: 'vs Semana anterior', value: '+1,5min', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '+0,8min', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '18min' },
      { label: 'Canal: Telefone', value: '16min' },
      { label: 'Turno: Noite', value: '19min' },
    ],
  },
  abandono: {
    titulo: 'Evolução Temporal · Abandono',
    subtitulo: '7 dias com comparativo vs benchmark setor 5%',
    valor: '6,4%',
    delta: '+1,4 pp',
    deltaSub: 'vs período anterior · meta 5%',
    deltaTone: 'down',
    meta: 5,
    serieAtual: [4.8, 5.2, 5.6, 6.0, 6.2, 6.4, 6.4],
    serieAnterior: [4.5, 4.6, 4.8, 5.0, 5.0, 5.0, 5.0],
    comparacoes: [
      { label: 'vs Meta (5%)', value: '-8 pp', tone: 'down' },
      { label: 'vs Semana anterior', value: '+1,4 pp', tone: 'down' },
      { label: 'vs Mesmo dia mês passado', value: '-2,5 pp', tone: 'down' },
    ],
    pioresSegmentos: [
      { label: 'Fila: Reembolso', value: '18,2%' },
      { label: 'Canal: Telefone', value: '13,2%' },
      { label: 'Turno: Noite', value: '12,5%' },
    ],
  },
}

export { dias }

// ── Segmentação (dispersão): Volume × indicador ativo, tamanho = volume da
// equipe, COR = fila. Cada segmento (canal × fila × equipe) carrega o valor de
// TODOS os indicadores, então o eixo Y reflete o indicador selecionado e os
// rótulos/críticos ficam coerentes em qualquer ?ind=.
export type FilaCor = 'duvidas' | 'reembolso' | 'autoriz'

// Direção "melhor": FCR/Resolução/NPS = maior melhor; TME/TMEF/TMA/Abandono = menor.
export const indicadorMaiorMelhor: Record<IndicadorKey, boolean> = {
  fcr: true,
  resolucao: true,
  nps: true,
  tme: false,
  tmef: false,
  tma: false,
  abandono: false,
}

// Unidade de cada indicador (sufixo dos rótulos/eixo Y da dispersão).
export const indicadorUnidade: Record<IndicadorKey, string> = {
  fcr: '%',
  resolucao: '%',
  tme: 'min',
  tmef: 'min',
  tma: 'min',
  nps: '',
  abandono: '%',
}

// Rótulo curto do eixo Y por indicador.
export const indicadorEixoY: Record<IndicadorKey, string> = {
  fcr: 'FCR %',
  resolucao: 'Resolução %',
  tme: 'TME (min)',
  tmef: 'TMEF (min)',
  tma: 'TMA (min)',
  nps: 'NPS',
  abandono: 'Abandono %',
}

export type Turno = 'Manhã' | 'Tarde' | 'Noite'

export interface SegmentoBase {
  canal: string
  fila: FilaCor
  filaLabel: string // rótulo legível da fila
  turno: Turno
  volume: number // eixo X
  size: number // diâmetro da bolha (∝ volume)
  metrics: Record<IndicadorKey, number> // valor de cada indicador no segmento
}

// 8 segmentos reais por canal × fila × turno. Os valores são internamente
// coerentes: o pior segmento (Telefone · Dúvidas Adm. · Noite) é o pior em TODOS
// os indicadores; os de Balcão/Financeiro são os melhores; chat supera telefone.
export const segmentosBase: SegmentoBase[] = [
  {
    canal: 'WhatsApp',
    fila: 'duvidas',
    filaLabel: 'Dúvidas Adm.',
    turno: 'Tarde',
    volume: 1800,
    size: 42,
    metrics: { fcr: 88, resolucao: 94, tme: 6, tmef: 3.5, tma: 11, nps: 58, abandono: 4.2 },
  },
  {
    canal: 'Telefone',
    fila: 'duvidas',
    filaLabel: 'Dúvidas Adm.',
    turno: 'Manhã',
    volume: 1170,
    size: 30,
    metrics: { fcr: 71, resolucao: 86, tme: 16, tmef: 5.8, tma: 17, nps: 42, abandono: 11.5 },
  },
  {
    canal: 'Chat',
    fila: 'reembolso',
    filaLabel: 'Reembolso',
    turno: 'Tarde',
    volume: 760,
    size: 28,
    metrics: { fcr: 82, resolucao: 90, tme: 8, tmef: 4.0, tma: 13, nps: 50, abandono: 6.0 },
  },
  {
    canal: 'Balcão',
    fila: 'autoriz',
    filaLabel: 'Autorizações',
    turno: 'Manhã',
    volume: 2050,
    size: 24,
    metrics: { fcr: 95, resolucao: 97, tme: 4, tmef: 2.5, tma: 9, nps: 66, abandono: 2.0 },
  },
  {
    canal: 'WhatsApp',
    fila: 'autoriz',
    filaLabel: 'Financeiro',
    turno: 'Noite',
    volume: 2200,
    size: 48,
    metrics: { fcr: 98, resolucao: 98, tme: 6, tmef: 3.0, tma: 10, nps: 70, abandono: 3.0 },
  },
  {
    canal: 'Telefone',
    fila: 'duvidas',
    filaLabel: 'Dúvidas Adm.',
    turno: 'Noite',
    volume: 720,
    size: 30,
    metrics: { fcr: 65, resolucao: 82, tme: 18, tmef: 6.5, tma: 19, nps: 36, abandono: 18.2 },
  },
  {
    canal: 'Chat',
    fila: 'reembolso',
    filaLabel: 'Reembolso',
    turno: 'Manhã',
    volume: 1420,
    size: 36,
    metrics: { fcr: 82, resolucao: 91, tme: 9, tmef: 4.2, tma: 14, nps: 48, abandono: 6.4 },
  },
  {
    canal: 'Telefone',
    fila: 'autoriz',
    filaLabel: 'Autorizações',
    turno: 'Tarde',
    volume: 1650,
    size: 46,
    metrics: { fcr: 84, resolucao: 92, tme: 12, tmef: 4.5, tma: 16, nps: 52, abandono: 7.5 },
  },
]

export const segmentacaoLegenda = {
  cor: [
    { label: 'Dúvidas Adm.', fila: 'duvidas' as FilaCor },
    { label: 'Reembolso', fila: 'reembolso' as FilaCor },
    { label: 'Autorizações / Financeiro', fila: 'autoriz' as FilaCor },
  ],
}

export type SegmentoLinha = {
  segmento: string
  volume: number
  atendidos: number
  abandonados: number
  disponiveis: number
  tme: string
  metaTme: string
  tma: string
  csat: number
  tendencia: string
  status: 'Crítico' | 'Atenção' | 'OK'
  acao: string
}

export const segmentosCriticos: SegmentoLinha[] = [
  {
    segmento: 'Telefone · Dúvidas Adm. · Noite',
    volume: 342,
    atendidos: 298,
    abandonados: 44,
    disponiveis: 12,
    tme: '14min',
    metaTme: '-1min',
    tma: '14min',
    csat: 3,
    tendencia: 'Piorando 7d',
    status: 'Crítico',
    acao: 'Investigar',
  },
  {
    segmento: 'Telefone · Reembolso · Tarde',
    volume: 287,
    atendidos: 241,
    abandonados: 46,
    disponiveis: 8,
    tme: '10min',
    metaTme: '-16min',
    tma: '10min',
    csat: 3,
    tendencia: 'Piorando 3d',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'Telefone · Autorizações · Manhã',
    volume: 256,
    atendidos: 213,
    abandonados: 43,
    disponiveis: 10,
    tme: '11min',
    metaTme: '-19min',
    tma: '11min',
    csat: 3,
    tendencia: 'Estável',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'Chat/WhatsApp · Dúvidas Adm. · Tarde',
    volume: 412,
    atendidos: 378,
    abandonados: 34,
    disponiveis: 15,
    tme: '5min',
    metaTme: '-8min',
    tma: '5min',
    csat: 5,
    tendencia: 'Estável',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'Chat/WhatsApp · Dúvidas Adm. · Manhã',
    volume: 528,
    atendidos: 489,
    abandonados: 39,
    disponiveis: 18,
    tme: '4min',
    metaTme: '-5min',
    tma: '4min',
    csat: 5,
    tendencia: 'Melhorando',
    status: 'OK',
    acao: '—',
  },
  {
    segmento: 'Chat/WhatsApp · Reembolso · Noite',
    volume: 318,
    atendidos: 276,
    abandonados: 42,
    disponiveis: 11,
    tme: '6min',
    metaTme: '-9min',
    tma: '6min',
    csat: 3,
    tendencia: 'Estável',
    status: 'Atenção',
    acao: 'Investigar',
  },
  {
    segmento: 'Chat/WhatsApp · Autorizações · Manhã',
    volume: 245,
    atendidos: 221,
    abandonados: 24,
    disponiveis: 14,
    tme: '3min',
    metaTme: '+8min',
    tma: '3min',
    csat: 5,
    tendencia: 'Melhorando',
    status: 'OK',
    acao: '—',
  },
  {
    segmento: 'Balcão · Autorizações · Tarde',
    volume: 94,
    atendidos: 82,
    abandonados: 12,
    disponiveis: 7,
    tme: '2min',
    metaTme: '+7min',
    tma: '2min',
    csat: 5,
    tendencia: 'Estável',
    status: 'OK',
    acao: '—',
  },
]

export interface Recomendacao {
  titulo: string
  descricao: string
  impacto: string
  acao: string
  destaque: boolean
}

export const diagnostico =
  'A queda de 4,1pp no SLA concentra-se na fila Dúvidas Administrativas (65% SLA, -8pp vs meta), via canal Telefone, no turno da noite. Demanda atípica iniciada na 4ª feira (+27% vs base histórica) precedeu o impacto, com o turno da noite como foco operacional.'

export const recomendacoes: Recomendacao[] = [
  {
    titulo: 'Reforçar o turno da noite em Dúvidas Adm.',
    descricao:
      'Realocar 2 atendentes da fila Reembolso para Dúvidas Adm. no turno da noite. Cenário simulado prevê resolução do gargalo do SLA consolidado em ~25min.',
    impacto: 'SLA +9pp · resolução em ~25min',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Capacitação focada no canal Telefone',
    descricao:
      'Programar 4h de treinamento em Dúvidas Adm. para o time do canal Telefone. Reduz TMA médio e aumenta a autonomia no atendimento nas próximas semanas.',
    impacto: 'SLA +4pp · em 7 dias',
    acao: 'Detalhar',
    destaque: false,
  },
  {
    titulo: 'Redimensionar canal Telefone',
    descricao:
      'Canal Telefone responde por 71% SLA com volume crescente. Avaliar redistribuição estrutural para próxima semana.',
    impacto: 'SLA +2pp · análise para próxima semana',
    acao: 'Detalhar',
    destaque: false,
  },
]
