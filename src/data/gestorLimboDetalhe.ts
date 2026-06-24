// Detalhe de "Pendências e Limbo" (drill-down da subaba homônima). Estrutura
// padrão das telas de detalhe (5 blocos): 1) Indicadores · 2) Tabela (Limbo por
// setor · agora) · 3) Evolução · 4) Correlação · 5) Insights da IA. Os chips no
// topo selecionam a CATEGORIA da pendência (Todas por padrão).
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export type LimboContexto = 'geral' | 'beneficiario' | 'interna' | 'retorno'
export type BadgeTone = 'danger' | 'warning' | 'success' | 'primary'

export interface LimboDetKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
}

export interface ContextoLimbo {
  key: LimboContexto
  label: string
  badge: string
  badgeTone: BadgeTone
  resumo: string
  subtitulo: string
  kpis: LimboDetKpi[]
  volume: number[]
  aging: number[]
  diagnostico: { confianca: string; texto: string }
  recomendacoes: RecomendacaoIA[]
}

export interface LimboChip {
  key: LimboContexto
  label: string
  total: number
  tone: 'danger' | 'warning' | 'success' | 'neutral'
}

export const chips: LimboChip[] = [
  { key: 'geral', label: 'Todas as pendências', total: 38, tone: 'neutral' },
  { key: 'beneficiario', label: 'Aguardando beneficiário', total: 6, tone: 'danger' },
  { key: 'interna', label: 'Área interna', total: 4, tone: 'warning' },
  { key: 'retorno', label: 'Retorno não assumido', total: 4, tone: 'warning' },
]

const rec = (titulo: string, corpo: string, impacto: string, acao = 'Detalhar', destaque = false): RecomendacaoIA => ({ titulo, corpo, impacto, acao, destaque })

export const contextos: Record<LimboContexto, ContextoLimbo> = {
  geral: {
    key: 'geral', label: 'Geral', badge: 'EM LIMBO', badgeTone: 'warning',
    resumo: '38 pendências ativas · aging médio 1d 9h',
    subtitulo: 'Tickets congelados aguardando interações externas ou validações de terceiros · maior concentração no N1',
    kpis: [
      { label: 'Total em limbo', value: '38', unit: 'tickets', status: 'warning', delta: '↑ 4 vs período ant.', deltaTone: 'down' },
      { label: 'Aging médio', value: '1d 9h', unit: '', status: 'warning', delta: '↑ 4h vs ant.', deltaTone: 'down' },
      { label: 'Pendências internas', value: '4', unit: '', status: 'warning', delta: '2 dias sem resposta', deltaTone: 'neutral' },
      { label: 'Com beneficiário', value: '6', unit: '', status: 'danger', delta: 'descongela em 14min', deltaTone: 'neutral' },
    ],
    volume: [4, 5, 5, 6, 6, 7, 7, 6, 5, 6, 6, 6],
    aging: [28, 29, 30, 31, 32, 33, 33, 33, 32, 33, 33, 33],
    diagnostico: { confianca: 'confiança 85% · 320 padrões similares',
      texto: '38 tickets congelados, com aging crescente (+4h). 29 estão no N1, concentrados na gaveta de Juliana Santos. As pendências com beneficiário têm SLA congelado, mas as internas (Financeiro/Auditoria) acumulam aging sem owner claro. Definir responsável e SLA interno destrava a maior parte.' },
    recomendacoes: [
      rec('Limpar gaveta do N1', 'Redistribuir os 12 tickets parados de Juliana Santos.', 'Aging −40% no N1', 'Aplicar', true),
      rec('SLA interno', 'Definir SLA de retaguarda para as 4 pendências internas.', 'Previsibilidade'),
      rec('Assumir retornos', 'Atribuir os 4 retornos não assumidos a um atendente disponível.', 'Evita reabertura'),
    ],
  },
  beneficiario: {
    key: 'beneficiario', label: 'Aguardando beneficiário', badge: 'CRÍTICO', badgeTone: 'danger',
    resumo: '6 pendências · próxima descongela em 14min',
    subtitulo: 'SLA congelado aguardando retorno do cliente · risco de reabertura ao descongelar',
    kpis: [
      { label: 'Aguardando benef.', value: '6', unit: '', status: 'danger', delta: 'SLA congelado', deltaTone: 'neutral' },
      { label: 'Próx. descongela', value: '14', unit: 'min', status: 'danger', delta: 'volta a contar SLA', deltaTone: 'down' },
      { label: 'Aging médio', value: '1d 2h', unit: '', status: 'warning', delta: 'desde o congelamento', deltaTone: 'neutral' },
      { label: 'Risco de reabertura', value: '2', unit: 'casos', status: 'warning', delta: 'histórico de retorno', deltaTone: 'down' },
    ],
    volume: [1, 1, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2],
    aging: [24, 25, 26, 26, 27, 27, 28, 27, 26, 27, 27, 26],
    diagnostico: { confianca: 'confiança 83% · 142 padrões similares',
      texto: 'Pendências com SLA congelado aguardando o beneficiário. O risco está no descongelamento: quando o cliente responde, o SLA volta a contar e ninguém assume imediatamente, virando "retorno não assumido". Acompanhar os que descongelam nos próximos minutos evita estouro.' },
    recomendacoes: [
      rec('Fila de descongelamento', 'Monitorar os tickets que descongelam nos próximos 30min.', 'Evita estouro pós-retorno', 'Aplicar', true),
      rec('Lembrete ao beneficiário', 'Enviar lembrete automático antes do descongelamento.', 'Retorno +20%'),
      rec('Pré-atribuir owner', 'Definir quem assume cada ticket ao descongelar.', 'Zero retorno órfão'),
    ],
  },
  interna: {
    key: 'interna', label: 'Área interna sem resposta', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: '4 pendências · última interação há 2 dias',
    subtitulo: 'Cobrança a setores de retaguarda sem owner claro · aging elevado',
    kpis: [
      { label: 'Área interna', value: '4', unit: '', status: 'warning', delta: 'sem resposta', deltaTone: 'neutral' },
      { label: 'Última interação', value: '2', unit: 'dias', status: 'danger', delta: 'sem movimento', deltaTone: 'down' },
      { label: 'Aging médio', value: '2d', unit: '', status: 'danger', delta: 'maior do limbo', deltaTone: 'down' },
      { label: 'Setores envolvidos', value: '3', unit: '', status: 'neutral', delta: 'Financeiro · Auditoria', deltaTone: 'neutral' },
    ],
    volume: [1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2],
    aging: [40, 42, 43, 44, 45, 46, 46, 46, 45, 46, 46, 46],
    diagnostico: { confianca: 'confiança 80% · 96 padrões similares',
      texto: 'Pendências cobradas de setores de retaguarda (Financeiro, Auditoria) sem SLA interno e sem owner claro — por isso o aging é o maior do limbo (2d). Não é volume, é falta de processo. Definir SLA de retaguarda e escalonar automaticamente após X horas resolve.' },
    recomendacoes: [
      rec('SLA de retaguarda', 'Definir prazo interno para resposta de cada setor.', 'Aging −50%', 'Aplicar', true),
      rec('Escalonamento automático', 'Escalar ao gestor do setor após 24h sem resposta.', 'Sem ticket esquecido'),
      rec('Owner único', 'Atribuir um responsável por cobrar cada pendência.', 'Accountability'),
    ],
  },
  retorno: {
    key: 'retorno', label: 'Retorno não assumido', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: '4 interações de 30min a 1 dia sem atendente',
    subtitulo: 'Cliente respondeu, mas nenhum atendente assumiu · risco direto de reabertura e abandono',
    kpis: [
      { label: 'Retornos não assumidos', value: '4', unit: '', status: 'warning', delta: 'sem atendente', deltaTone: 'neutral' },
      { label: 'Aging', value: '30min–1d', unit: '', status: 'warning', delta: 'desde o retorno', deltaTone: 'neutral' },
      { label: 'Risco de reabertura', value: 'Alto', unit: '', status: 'danger', delta: 'cliente aguardando', deltaTone: 'down' },
      { label: 'Impacto no NPS', value: '−', unit: '', status: 'warning', delta: 'percepção de abandono', deltaTone: 'down' },
    ],
    volume: [1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 1],
    aging: [10, 12, 14, 16, 18, 20, 22, 20, 18, 20, 20, 18],
    diagnostico: { confianca: 'confiança 82% · 110 padrões similares',
      texto: 'Pior tipo de pendência para a experiência: o cliente já respondeu e está esperando, mas ninguém assumiu. Vira reabertura e sensação de abandono — impacto direto no NPS. Uma fila dedicada de "retornos a assumir" com round-robin elimina o problema na origem.' },
    recomendacoes: [
      rec('Fila de retornos a assumir', 'Criar fila dedicada com distribuição automática (round-robin).', 'Zera retorno órfão', 'Aplicar', true),
      rec('Alerta de retorno', 'Notificar atendente assim que o cliente responde.', 'Tempo p/ assumir −80%'),
      rec('Priorizar no painel', 'Subir retornos não assumidos ao topo da fila do atendente.', 'NPS protegido'),
    ],
  },
}

// ── 2) Tabela "Limbo por setor · agora" (comparativo) ────────────────────────
export type LimboStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type LimboSetorLinha = {
  setor: string
  pendencias: number
  aging: string
  beneficiario: number
  interna: number
  responsavel: string
  status: LimboStatus
}

export const limboAgora: LimboSetorLinha[] = [
  { setor: 'N1 · Atendimento', pendencias: 29, aging: '4h 20min', beneficiario: 4, interna: 1, responsavel: 'Juliana Santos · 12', status: 'Crítico' },
  { setor: 'Auditoria Médica', pendencias: 5, aging: '1d 12h', beneficiario: 1, interna: 2, responsavel: 'Atendente B · 3', status: 'Alto' },
  { setor: 'Financeiro', pendencias: 4, aging: '2d 4h', beneficiario: 1, interna: 1, responsavel: 'Atendente C · 4', status: 'Alto' },
]

// ── 3) Evolução ──────────────────────────────────────────────────────────────
export const evolucaoBase = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  picoIdx: 6,
  agoraIdx: 9,
  picoLabel: 'pico de entradas',
  meta: 24,
}
export const evolucaoMetricas = ['Aging', 'Saídas', 'Entradas'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

// ── 4) Tabela "Correlação de pendências" (comparativo) ───────────────────────
export type CorrelLimboLinha = {
  setor: string
  pendencias: number
  aging: string
  pctInterno: number
  responsavel: string
  gargalo: string
  status: LimboStatus
}

export const correlacao: CorrelLimboLinha[] = [
  { setor: 'N1 · Atendimento', pendencias: 29, aging: '4h 20min', pctInterno: 14, responsavel: 'Juliana Santos', gargalo: 'Volume concentrado em uma gaveta · falta redistribuição', status: 'Crítico' },
  { setor: 'Auditoria Médica', pendencias: 5, aging: '1d 12h', pctInterno: 60, responsavel: 'Atendente B', gargalo: 'Pendências internas sem SLA de retaguarda', status: 'Alto' },
  { setor: 'Financeiro', pendencias: 4, aging: '2d 4h', pctInterno: 50, responsavel: 'Atendente C', gargalo: 'Menor volume, maior aging · gargalo processual', status: 'Alto' },
]

export const comoInterpretar =
  'Limbo = tickets congelados aguardando terceiros. Pendência com beneficiário tem SLA congelado (risco no descongelamento). Pendência interna acumula aging por falta de SLA de retaguarda. Retorno não assumido é o pior para o NPS (cliente já respondeu). Aging alto com baixo volume indica gargalo processual, não de capacidade.'

export const setorControlado = { contexto: 'geral' as LimboContexto, nome: 'N1', detalhe: 'redistribuir gaveta' }
