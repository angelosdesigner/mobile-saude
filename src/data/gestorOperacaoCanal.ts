// Tela de detalhe "Operação por Canal" (drill-down da aba Atendimentos) —
// Figma 7651:98838. Estrutura padrão das telas de detalhe do gestor:
// 1) Indicadores · 2) Operação por canal (tabela) · 3) Evolução ·
// 4) Correlação · 5) Alertas · 6) Recomendações IA.
//
// Navegação por TIPO de canal (chips globais que reconfiguram tudo abaixo) ×
// comparação por CANAL (tabelas mantêm todos os canais, com o tipo ativo
// destacado). Chat e WhatsApp são o mesmo TIPO (mensageria), agrupados num só
// chip — coerente com a taxonomia canônica do app (Chat/WhatsApp).

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

// ── Tipos/contextos selecionáveis (chips globais) ────────────────────────────
export type CanalContexto = 'geral' | 'mensageria' | 'telefone' | 'balcao'

export interface ChipCanal {
  key: CanalContexto
  label: string
  sla: number
  tone: 'success' | 'warning' | 'danger' | 'neutral'
}

// "Geral" = operação consolidada (default). Chat/WhatsApp = mensageria.
export const chips: ChipCanal[] = [
  { key: 'geral', label: 'Geral', sla: 84, tone: 'neutral' },
  { key: 'mensageria', label: 'Chat/WhatsApp', sla: 86, tone: 'warning' },
  { key: 'telefone', label: 'Telefone', sla: 71, tone: 'danger' },
  { key: 'balcao', label: 'Balcão', sla: 88, tone: 'success' },
]

// ── KPIs (indicadores) ───────────────────────────────────────────────────────
export interface CanalKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

// ── Alertas ──────────────────────────────────────────────────────────────────
export interface AlertaCanal {
  severidade: 'CRÍTICO' | 'ATENÇÃO'
  tempo: string
  titulo: string
  corpo: string
}

// ── Recomendações IA ─────────────────────────────────────────────────────────
export interface RecomendacaoCanal {
  titulo: string
  corpo: string
  impacto: string
  acao: string
  destaque?: boolean
}

// ── Contexto completo por tipo de canal ──────────────────────────────────────
export interface ContextoCanal {
  /** Rótulo do tipo (ex.: "Chat/WhatsApp"). */
  label: string
  badge: string
  badgeTone: 'success' | 'warning' | 'danger' | 'primary'
  resumoSla: string
  subtitulo: string
  /** Card de KPIs (4). */
  kpis: CanalKpi[]
  /** Série da evolução (12 pontos, eixo de horas compartilhado). */
  volume: number[]
  sla: number[]
  alertas: AlertaCanal[]
  diagnostico: { confianca: string; texto: string }
  recomendacoes: RecomendacaoCanal[]
  /** Canais destacados nas tabelas comparativas quando este tipo está ativo. */
  canaisDestaque: string[]
}

export const contextos: Record<CanalContexto, ContextoCanal> = {
  geral: {
    label: 'Geral',
    badge: 'VISÃO GERAL',
    badgeTone: 'primary',
    resumoSla: 'SLA consolidado 84% · 4 tipos de canal',
    subtitulo: '47 atendentes alocados · 3.654 atendimentos no período · 4 canais monitorados',
    // Ordem por importância (macro→micro): Volume → Ocupação → TME → TMA.
    kpis: [
      { label: 'Volume', value: '3.654', unit: 'atend.', status: 'ok', delta: 'todos os canais', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '79', unit: '%', status: 'warning', delta: '37/47 atendentes', deltaTone: 'neutral' },
      { label: 'TME', value: '2.3', unit: 'min', status: 'warning', delta: 'meta 2.0min', deltaTone: 'down' },
      { label: 'TMA', value: '7', unit: 'min', status: 'ok' },
    ],
    volume: [60, 80, 110, 140, 160, 175, 190, 185, 180, 165, 130, 120],
    sla: [90, 89, 88, 87, 86, 85, 84, 84, 83, 84, 85, 86],
    alertas: [
      {
        severidade: 'CRÍTICO',
        tempo: 'há 3h',
        titulo: 'Telefone puxa o SLA geral para baixo',
        corpo: 'Telefone em 71% (meta 90%) concentra a maior parte da queda · 47 chamados aguardando',
      },
      {
        severidade: 'ATENÇÃO',
        tempo: 'há 1h',
        titulo: 'Pico vespertino pressiona a operação',
        corpo: 'Volume 18% acima da média entre 14h-17h · ocupação consolidada em 79%',
      },
    ],
    diagnostico: {
      confianca: 'confiança 87% · 540 padrões similares',
      texto: 'A operação está estável no consolidado (SLA 84%), mas o canal Telefone (71%) puxa o índice para baixo e concentra a fila. Redistribuir a demanda complexa do Telefone para os canais de mensageria nos horários de pico pode recuperar o SLA geral sem ampliar a equipe.',
    },
    recomendacoes: [
      { titulo: 'Rebalancear demanda do Telefone', corpo: 'Migrar parte das Autorizações do Telefone para Chat/WhatsApp via BOT nos picos. Tipo mensageria tem folga e SLA saudável.', impacto: 'SLA geral +6 pp', acao: 'Aplicar', destaque: true },
      { titulo: 'Reforçar pico vespertino', corpo: 'Alocar 3 atendentes do balcão (ocupação 58%) para os canais digitais entre 14h-18h.', impacto: 'TME -30% · em 2h', acao: 'Detalhar' },
      { titulo: 'Callback inteligente no Telefone', corpo: 'Oferecer retorno agendado para clientes em fila >5min no canal crítico.', impacto: 'Fila Telefone -40%', acao: 'Detalhar' },
    ],
    canaisDestaque: [],
  },
  mensageria: {
    label: 'Chat/WhatsApp',
    badge: 'MAIOR VOLUME',
    badgeTone: 'warning',
    resumoSla: 'SLA 86% · 65% do volume total',
    subtitulo: '22 atendentes alocados · 65% do volume total · 68 atendimentos em curso',
    kpis: [
      { label: 'Volume', value: '2.376', unit: 'atend.', status: 'warning', delta: '65% do total', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '81', unit: '%', status: 'warning', delta: '22 atendentes', deltaTone: 'neutral' },
      { label: 'TME', value: '2.0', unit: 'min', status: 'ok', delta: 'na meta', deltaTone: 'up' },
      { label: 'TMA', value: '6', unit: 'min', status: 'ok' },
    ],
    volume: [120, 160, 210, 260, 300, 330, 360, 350, 340, 310, 250, 230],
    sla: [92, 91, 90, 89, 88, 87, 86, 86, 85, 86, 87, 88],
    alertas: [
      {
        severidade: 'ATENÇÃO',
        tempo: 'há 2h',
        titulo: 'Volume crescente no canal',
        corpo: '68 conversas em atendimento · fila subindo de forma contínua desde 13h',
      },
      {
        severidade: 'ATENÇÃO',
        tempo: 'há 40min',
        titulo: 'Ocupação desequilibrada na fila',
        corpo: 'Parte dos atendentes saturada enquanto outros têm folga · distribuição puxa o SLA para 86%',
      },
    ],
    diagnostico: {
      confianca: 'confiança 88% · 410 padrões similares',
      texto: 'O canal Chat/WhatsApp concentra 65% do volume com SLA saudável (86%), mas começa a sentir a pressão do volume crescente nos horários de pico. Ampliar a automação de triagem e equilibrar a distribuição da fila mantém o canal acima da meta sem reforço de equipe.',
    },
    recomendacoes: [
      { titulo: 'Equilibrar distribuição da fila', corpo: 'Redistribuir as novas conversas entre os atendentes com menor ocupação para suavizar os picos do canal.', impacto: 'SLA +5 pp', acao: 'Aplicar', destaque: true },
      { titulo: 'Ampliar BOT de triagem', corpo: 'Aumentar a cobertura do BOT para FAQs e 2ª via, reduzindo o volume que chega ao humano.', impacto: 'Volume humano -18%', acao: 'Detalhar' },
      { titulo: 'Respostas rápidas para FAQ', corpo: 'Habilitar templates de resposta rápida para as 10 dúvidas mais frequentes.', impacto: 'TMA -25%', acao: 'Detalhar' },
    ],
    canaisDestaque: ['Chat/WhatsApp'],
  },
  telefone: {
    label: 'Telefone',
    badge: 'CANAL CRÍTICO',
    badgeTone: 'danger',
    resumoSla: 'SLA 71% · pior canal no momento',
    subtitulo: '12 atendentes alocados · 23% do volume total · 47 atendimentos em curso',
    kpis: [
      { label: 'Volume', value: '847', unit: 'atend.', status: 'warning', delta: '23% do total', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '92', unit: '%', status: 'danger', delta: '12/12 atendentes', deltaTone: 'down' },
      { label: 'TME', value: '2.4', unit: 'min', status: 'danger', delta: 'meta 1.5min', deltaTone: 'down' },
      { label: 'TMA', value: '9', unit: 'min', status: 'warning' },
    ],
    volume: [46, 58, 70, 75, 82, 90, 100, 96, 95, 88, 72, 68],
    sla: [95, 93, 90, 88, 80, 72, 64, 67, 65, 60, 58, 56],
    alertas: [
      { severidade: 'CRÍTICO', tempo: 'há 4h', titulo: 'TME acima da meta há 4h', corpo: '2.4min vs meta 1.5min · 47 chamados aguardando · risco de abandono em escala' },
      { severidade: 'CRÍTICO', tempo: 'há 3h', titulo: 'SLA abaixo de 80% há 3h', corpo: 'Queda contínua desde 13h · Autorizações respondem por 38% do impacto' },
      { severidade: 'ATENÇÃO', tempo: 'há 47min', titulo: 'Ocupação saturada', corpo: '12 de 12 atendentes ocupados há 47min · sem capacidade para picos adicionais' },
    ],
    diagnostico: {
      confianca: 'confiança 89% · 218 padrões similares',
      texto: 'O canal Telefone concentra demandas complexas (Autorizações, Reembolso, Dúvidas Administrativas representam 80% do volume) mas opera com capacidade saturada nos horários de pico. Migrar 25-30% de Autorizações para o Chat/WhatsApp via BOT pode aliviar a fila telefônica sem perder qualidade.',
    },
    recomendacoes: [
      { titulo: 'Migrar Autorizações para BOT Chat/WhatsApp', corpo: 'Ativar fluxo de autorização prévia via BOT no Chat/WhatsApp para casos simples (consulta, exames de rotina). BOT atual tem retenção de 72% em fluxos similares.', impacto: 'Volume Telefone -28% · em 2h', acao: 'Aplicar', destaque: true },
      { titulo: 'Escalar capacidade Telefone', corpo: 'Adicionar 3 atendentes de outras filas durante o pico vespertino (14h-18h). Patricia M. e João C. têm equipes com folga.', impacto: 'TME -45% · SLA +15 pp', acao: 'Detalhar' },
      { titulo: 'Callback inteligente', corpo: 'Oferecer retorno em horário escolhido para clientes em fila >5min. Reduz pressão imediata sem perder demanda.', impacto: 'TME percebido -60% · NPS +', acao: 'Detalhar' },
    ],
    canaisDestaque: ['Telefone'],
  },
  balcao: {
    label: 'Balcão',
    badge: 'CANAL SAUDÁVEL',
    badgeTone: 'success',
    resumoSla: 'SLA 88% · estável',
    subtitulo: '3 atendentes alocados · 12% do volume total · 8 atendimentos em curso',
    kpis: [
      { label: 'Volume', value: '431', unit: 'atend.', status: 'ok', delta: '12% do total', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '58', unit: '%', status: 'ok', delta: 'capacidade ociosa', deltaTone: 'up' },
      { label: 'TME', value: '4.2', unit: 'min', status: 'warning', delta: 'atendimento presencial', deltaTone: 'neutral' },
      { label: 'TMA', value: '11', unit: 'min', status: 'warning' },
    ],
    volume: [10, 14, 20, 28, 34, 40, 44, 42, 38, 30, 22, 18],
    sla: [94, 93, 92, 91, 90, 89, 88, 88, 87, 88, 89, 90],
    alertas: [
      {
        severidade: 'ATENÇÃO',
        tempo: 'há 2h',
        titulo: 'TME acima do esperado no balcão',
        corpo: '4.2min médio · fluxo presencial concentrado no início da tarde · sem risco de SLA',
      },
    ],
    diagnostico: {
      confianca: 'confiança 84% · 180 padrões similares',
      texto: 'O balcão opera saudável (SLA 88%, ocupação 58%) com TME naturalmente mais alto pelo atendimento presencial. Há folga de capacidade que pode reforçar os canais digitais nos horários de pico.',
    },
    recomendacoes: [
      { titulo: 'Realocar capacidade ociosa do balcão', corpo: 'Direcionar 1-2 atendentes do balcão para os canais digitais nos picos, mantendo o presencial coberto.', impacto: 'Reforço digital +2 · em 1h', acao: 'Aplicar', destaque: true },
      { titulo: 'Agendamento presencial', corpo: 'Oferecer agendamento de horário para reduzir a concentração no início da tarde.', impacto: 'TME -20%', acao: 'Detalhar' },
      { titulo: 'Senha digital', corpo: 'Permitir retirada de senha pelo app antes de chegar ao balcão.', impacto: 'Espera -30%', acao: 'Detalhar' },
    ],
    canaisDestaque: ['Balcão'],
  },
}

// ── Evolução: eixo/marcos compartilhados (séries vêm do contexto ativo) ───────
export const evolucaoBase = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  meta: 90,
  picoIdx: 3, // 11h
  picoLabel: '11h · pico vespertino',
  agoraIdx: 9, // 17h
}
// Seletores da evolução = os 4 indicadores da operação (G6).
export const evolucaoMetricas = ['Volume', 'Ocupação', 'TMA', 'TME'] as const

// ── 2) Operação por canal · agora (tabela comparativa — todos os canais) ──────
export type CanalLinha = {
  canal: string
  volume: number
  ocupacao: number
  ocupacaoTone: 'success' | 'warning' | 'danger'
  tme: string
  tma: string
  noBot: number
  emEspera: number
  emAtendimento: number
  finalizados: number // concluídos
  atendentes: number
  esperaTone?: 'danger'
}

// Sem coluna SLA. Portal Web e App entram dentro de "Chat/WhatsApp" (mensageria):
// atendentes 22+2+1=25, espera 16+1+0=17, atend. 68+4+2=74, concluídos 602+42+28=672,
// TME ponderado ≈ 1.9min. Volume/ocupação/TMA/TME por canal seguem os KPIs dos
// contextos (consistência). "No bot" = atendimentos no atendimento automatizado.
export const operacaoAgora: CanalLinha[] = [
  { canal: 'Chat/WhatsApp', volume: 2376, ocupacao: 81, ocupacaoTone: 'warning', tme: '1.9 min', tma: '6 min', noBot: 84, emEspera: 17, emAtendimento: 74, finalizados: 672, atendentes: 25 },
  { canal: 'Telefone', volume: 847, ocupacao: 92, ocupacaoTone: 'danger', tme: '2.4 min', tma: '9 min', noBot: 12, emEspera: 47, emAtendimento: 38, finalizados: 156, atendentes: 12, esperaTone: 'danger' },
  { canal: 'Balcão', volume: 431, ocupacao: 58, ocupacaoTone: 'success', tme: '4.2 min', tma: '11 min', noBot: 0, emEspera: 5, emAtendimento: 8, finalizados: 89, atendentes: 3 },
]

// ── 4) Correlação operacional (tabela comparativa — todos os canais) ─────────
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

// Chat/WhatsApp unificados (volume somado 1456+920=2376; SLA/TME/ocup./espera
// ponderados pelo volume: SLA ≈ 75%, TME ≈ 6:50, ocup. ≈ 81%, espera ≈ 8:38).
export const correlacao: CorrelLinha[] = [
  { canal: 'Telefone', volume: 276, sla: 61, tme: '9:23', ocupacao: 95, espera: '12:41', gargalo: 'Alta ocupação → TME elevado', status: 'Crítico' },
  { canal: 'Chat/WhatsApp', volume: 2376, sla: 75, tme: '6:50', ocupacao: 81, espera: '8:38', gargalo: 'Volume alto → SLA e espera pressionados', status: 'Alto' },
  { canal: 'App', volume: 89, sla: 55, tme: '12:40', ocupacao: 91, espera: '18:20', gargalo: 'Baixo vol., alta ocup. → gargalo', status: 'Crítico' },
  { canal: 'Portal Web', volume: 412, sla: 74, tme: '5:17', ocupacao: 62, espera: '4:48', gargalo: 'Estável; ligeira piora no TME', status: 'Médio' },
  { canal: 'Balcão', volume: 143, sla: 96, tme: '2:34', ocupacao: 58, espera: '1:12', gargalo: 'Sem gargalo identificado', status: 'OK' },
]

export const comoInterpretar =
  'Score Crítico = 2+ dimensões acima do limite simultaneamente. Canais com Alta Ocupação (>85%) E TME elevado (>8min) indicam subdimensionamento da equipe. Canais com SLA < meta E T. Espera alta indicam problema de roteamento ou fila mal configurada.'

// Rodapé: tipo de canal saudável de referência (atalho para o contexto).
export const canalSaudavel = { nome: 'Balcão', sla: 88, contexto: 'balcao' as CanalContexto }
