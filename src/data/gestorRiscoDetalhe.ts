// Detalhe do "Risk Center" (drill-down da subaba Gestão de Riscos da Gestão e
// Performance). Estrutura padrão das telas de detalhe do gestor (5 blocos):
// 1) Indicadores · 2) Tabela (· agora) · 3) Evolução · 4) Correlação · 5) IA.
// Os chips no topo selecionam o TIPO de risco (Geral por padrão) e reconfiguram
// KPIs/evolução/diagnóstico; as tabelas mantêm todos os tipos (comparativo),
// com o tipo ativo destacado.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export type RiscoContexto = 'geral' | 'nips' | 'escalonamento' | 'liminares' | 'menor-prazo'
export type BadgeTone = 'danger' | 'warning' | 'success' | 'primary'

export interface RiscoKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
}

export interface ContextoRisco {
  key: RiscoContexto
  label: string
  badge: string
  badgeTone: BadgeTone
  resumo: string
  subtitulo: string
  tiposDestaque: string[]
  kpis: RiscoKpi[]
  volume: number[]
  noPrazo: number[]
  diagnostico: { confianca: string; texto: string }
  recomendacoes: RecomendacaoIA[]
}

// ── Chips de tipo de risco (filtro global) ───────────────────────────────────
export interface RiscoChip {
  key: RiscoContexto
  label: string
  casos: number
  tone: 'danger' | 'warning' | 'success' | 'neutral'
}

export const chips: RiscoChip[] = [
  { key: 'geral', label: 'Todos os riscos', casos: 16, tone: 'neutral' },
  { key: 'menor-prazo', label: 'Menor Prazo', casos: 4, tone: 'danger' },
  { key: 'escalonamento', label: 'Escalonamento', casos: 3, tone: 'danger' },
  { key: 'nips', label: 'NIPs', casos: 7, tone: 'warning' },
  { key: 'liminares', label: 'Liminares', casos: 2, tone: 'warning' },
]

// ── Contextos (um por chip) ──────────────────────────────────────────────────
export const contextos: Record<RiscoContexto, ContextoRisco> = {
  geral: {
    key: 'geral',
    label: 'Geral',
    badge: 'EM RISCO',
    badgeTone: 'danger',
    resumo: '16 casos em risco · 4 vencem em < 6h',
    subtitulo:
      '16 ocorrências em risco regulatório ativo · 5 setores · maior exposição: Ouvidoria e Auditoria',
    tiposDestaque: [],
    kpis: [
      { label: 'Casos em risco', value: '16', unit: '', status: 'danger', delta: '↑ 3 vs ontem', deltaTone: 'down' },
      { label: 'Vencem em 24h', value: '9', unit: 'casos', status: 'warning', delta: '4 em menos de 6h', deltaTone: 'down' },
      { label: 'TMR médio', value: '1,4', unit: 'dias', status: 'warning', delta: '↑ 0,2 vs meta', deltaTone: 'down' },
      { label: 'Exposição financeira', value: 'R$ 180', unit: 'mil', status: 'warning', delta: 'liminares + multas', deltaTone: 'neutral' },
    ],
    volume: [10, 11, 12, 13, 14, 15, 16, 16, 15, 16, 17, 16],
    noPrazo: [88, 86, 85, 84, 82, 80, 79, 78, 79, 80, 81, 80],
    diagnostico: {
      confianca: 'confiança 87% · 540 padrões similares',
      texto:
        'O risco está concentrado em Ouvidoria (escalonamento) e Auditoria (NIPs). Há 4 tickets de menor prazo regulatório vencendo em até 3h — janela curta. Encaminhar a fila crítica para mesa dedicada e antecipar as NIPs evita estouros junto à ANS sem ampliar a equipe.',
    },
    recomendacoes: [
      { titulo: 'Mesa dedicada p/ prazo curto', corpo: 'Direcionar os 4 tickets de menor prazo (vencem em 3h) para uma mesa com alerta de countdown.', impacto: 'Evita 4 estouros ANS', acao: 'Aplicar', destaque: true },
      { titulo: 'Antecipar NIPs', corpo: 'Priorizar as 7 NIPs (reembolsos) antes do vencimento de 24h, com 2 atendentes de Auditoria.', impacto: 'NIPs no prazo +12 p.p.', acao: 'Detalhar' },
      { titulo: 'Conter escalonamento', corpo: 'Revisar os 3 casos de Ouvidoria com risco de virar reclamação formal/judicial.', impacto: 'Reduz exposição jurídica', acao: 'Detalhar' },
    ],
  },
  'menor-prazo': {
    key: 'menor-prazo',
    label: 'Menor Prazo Regulatório',
    badge: 'CRÍTICO',
    badgeTone: 'danger',
    resumo: '4 tickets · próximo vence em 3h',
    subtitulo: 'Tipificações com janela regulatória extremamente curta · negativas por escrito e exames',
    tiposDestaque: ['Menor Prazo Regulatório'],
    kpis: [
      { label: 'Tickets ativos', value: '4', unit: '', status: 'danger', delta: '↑ 1 vs ontem', deltaTone: 'down' },
      { label: 'Próx. vencimento', value: '3', unit: 'horas', status: 'danger', delta: 'janela crítica', deltaTone: 'down' },
      { label: 'TMR médio', value: '1', unit: 'hora', status: 'ok', delta: 'dentro do ritmo', deltaTone: 'up' },
      { label: 'No prazo', value: '75', unit: '%', status: 'danger', delta: '↓ 8 p.p. vs meta', deltaTone: 'down' },
    ],
    volume: [2, 2, 3, 3, 4, 4, 4, 4, 3, 4, 4, 4],
    noPrazo: [86, 84, 82, 80, 78, 76, 75, 74, 75, 76, 75, 75],
    diagnostico: {
      confianca: 'confiança 91% · 210 padrões similares',
      texto:
        'Tipo mais crítico da operação: janela de resposta de poucas horas. 4 tickets ativos, o mais próximo vence em 3h. O TMR de execução (1h) é compatível, mas a fila não está priorizada — risco de estouro por ordenação, não por capacidade.',
    },
    recomendacoes: [
      { titulo: 'Countdown na fila', corpo: 'Ativar ordenação por vencimento e alerta visual de countdown para os 4 tickets.', impacto: 'Evita 4 estouros ANS', acao: 'Aplicar', destaque: true },
      { titulo: 'Dupla checagem', corpo: 'Revisão por 2ª pessoa nas negativas por escrito antes do envio (reduz reabertura).', impacto: 'Reabertura −6 p.p.', acao: 'Detalhar' },
      { titulo: 'Template regulatório', corpo: 'Usar template aprovado para exames de alta complexidade — acelera a resposta.', impacto: 'TMR −20%', acao: 'Detalhar' },
    ],
  },
  escalonamento: {
    key: 'escalonamento',
    label: 'Escalonamento',
    badge: 'ALTO',
    badgeTone: 'danger',
    resumo: '3 casos · prazo mais crítico em 8h',
    subtitulo: 'Casos com potencial de virar reclamações formais ou processos judiciais · Ouvidoria e reanálise',
    tiposDestaque: ['Escalonamento'],
    kpis: [
      { label: 'Casos ativos', value: '3', unit: '', status: 'warning', delta: '↑ 2 na semana', deltaTone: 'down' },
      { label: 'Prazo mais crítico', value: '8', unit: 'horas', status: 'warning', delta: 'Ouvidoria', deltaTone: 'down' },
      { label: 'TMR médio', value: '8', unit: 'horas', status: 'warning', delta: '↑ 1h vs meta', deltaTone: 'down' },
      { label: 'No prazo', value: '82', unit: '%', status: 'warning', delta: '↓ 3 p.p. vs meta', deltaTone: 'down' },
    ],
    volume: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
    noPrazo: [90, 89, 87, 86, 85, 84, 83, 82, 82, 83, 82, 82],
    diagnostico: {
      confianca: 'confiança 84% · 156 padrões similares',
      texto:
        'Tendência de alta (+2 na semana). Os casos concentram-se na Ouvidoria e têm potencial de virar reclamação formal/judicial. O prazo mais crítico vence em 8h. Conter agora reduz exposição jurídica e protege o NPS.',
    },
    recomendacoes: [
      { titulo: 'Reforçar Ouvidoria', corpo: 'Alocar 2 atendentes seniores para os 3 casos entre 14h–18h, antes do vencimento.', impacto: 'Contém 100% dos casos', acao: 'Aplicar', destaque: true },
      { titulo: 'Contato proativo', corpo: 'Ligar para o beneficiário antes do prazo nos casos com histórico de reabertura.', impacto: 'Reduz formalização', acao: 'Detalhar' },
      { titulo: 'Alçada de decisão', corpo: 'Subir alçada para reanálise rápida sem novo ciclo completo.', impacto: 'TMR −30%', acao: 'Detalhar' },
    ],
  },
  nips: {
    key: 'nips',
    label: 'NIPs',
    badge: 'ALTO',
    badgeTone: 'warning',
    resumo: '7 NIPs ativas · próxima vence em 1 dia',
    subtitulo: 'Notificações de Intervenção Preliminar — resposta obrigatória à ANS · reembolsos',
    tiposDestaque: ['NIPs'],
    kpis: [
      { label: 'NIPs ativas', value: '7', unit: '', status: 'warning', delta: '→ estável', deltaTone: 'neutral' },
      { label: 'Próx. vencimento', value: '1', unit: 'dia', status: 'warning', delta: 'resposta obrigatória', deltaTone: 'down' },
      { label: 'TMR médio', value: '2', unit: 'dias', status: 'warning', delta: '↑ 0,3 vs meta', deltaTone: 'down' },
      { label: 'No prazo', value: '86', unit: '%', status: 'ok', delta: '↑ 2 p.p. vs ant.', deltaTone: 'up' },
    ],
    volume: [5, 5, 6, 6, 7, 7, 7, 7, 6, 7, 7, 7],
    noPrazo: [82, 83, 84, 85, 85, 86, 86, 86, 87, 86, 86, 86],
    diagnostico: {
      confianca: 'confiança 88% · 320 padrões similares',
      texto:
        'Volume estável (7 ativas), maioria de reembolsos. Resposta é obrigatória à ANS, então mesmo com prazo de 1 dia o tipo deve ser priorizado. O risco é acumular com o pico de reembolsos da semana.',
    },
    recomendacoes: [
      { titulo: 'Lote de reembolsos', corpo: 'Processar as NIPs de reembolso em lote com a Auditoria antes do vencimento.', impacto: 'NIPs no prazo +12 p.p.', acao: 'Aplicar', destaque: true },
      { titulo: 'Alerta ANS', corpo: 'Configurar alerta 12h antes do vencimento de cada NIP.', impacto: 'Zero estouro ANS', acao: 'Detalhar' },
      { titulo: 'Causa-raiz', corpo: 'Mapear por que reembolsos viram NIP (origem da insatisfação).', impacto: 'Reduz entrada de NIPs', acao: 'Detalhar' },
    ],
  },
  liminares: {
    key: 'liminares',
    label: 'Liminares e Casos Críticos',
    badge: 'MODERADO',
    badgeTone: 'warning',
    resumo: '2 casos ativos · R$ 180 mil em exposição',
    subtitulo: 'Passivos financeiros elevados — liminares e procedimentos cirúrgicos',
    tiposDestaque: ['Liminares e Casos Críticos'],
    kpis: [
      { label: 'Casos ativos', value: '2', unit: '', status: 'warning', delta: '↓ 1 vs semana', deltaTone: 'up' },
      { label: 'Prazo médio', value: '1', unit: 'dia', status: 'warning', delta: 'cirurgia + liminar', deltaTone: 'neutral' },
      { label: 'Exposição financeira', value: 'R$ 180', unit: 'mil', status: 'warning', delta: 'estimada', deltaTone: 'neutral' },
      { label: 'No prazo', value: '90', unit: '%', status: 'ok', delta: 'dentro da meta', deltaTone: 'up' },
    ],
    volume: [3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    noPrazo: [86, 87, 88, 89, 90, 90, 90, 91, 90, 90, 90, 90],
    diagnostico: {
      confianca: 'confiança 82% · 96 padrões similares',
      texto:
        'Baixo volume (2 casos), porém alta exposição financeira (R$ 180 mil) por envolver liminares e procedimentos cirúrgicos. Tendência de queda. O risco aqui é financeiro/jurídico, não de SLA — exige acompanhamento próximo, não velocidade.',
    },
    recomendacoes: [
      { titulo: 'Comitê de casos críticos', corpo: 'Levar os 2 casos ao comitê semanal com jurídico e auditoria médica.', impacto: 'Mitiga R$ 180 mil', acao: 'Aplicar', destaque: true },
      { titulo: 'Parecer médico', corpo: 'Garantir parecer da auditoria médica antes do prazo da liminar.', impacto: 'Evita multa judicial', acao: 'Detalhar' },
      { titulo: 'Registro de provisão', corpo: 'Provisionar a exposição estimada no fechamento do período.', impacto: 'Conformidade contábil', acao: 'Detalhar' },
    ],
  },
}

// ── 2) Tabela "Risco por tipo · agora" (comparativo) ─────────────────────────
export type RiscoStatus = 'Crítico' | 'Alto' | 'Moderado' | 'OK'

export type RiscoLinha = {
  tipo: string
  casos: number
  proxVencimento: string
  proxHoras: number
  tmr: string
  estourados: number
  noPrazo: number
  status: RiscoStatus
}

export const riscoAgora: RiscoLinha[] = [
  { tipo: 'Menor Prazo Regulatório', casos: 4, proxVencimento: '3 horas', proxHoras: 3, tmr: '1 hora', estourados: 0, noPrazo: 75, status: 'Crítico' },
  { tipo: 'Escalonamento', casos: 3, proxVencimento: '8 horas', proxHoras: 8, tmr: '8 horas', estourados: 1, noPrazo: 82, status: 'Alto' },
  { tipo: 'NIPs', casos: 7, proxVencimento: '1 dia', proxHoras: 24, tmr: '2 dias', estourados: 0, noPrazo: 86, status: 'Alto' },
  { tipo: 'Liminares e Casos Críticos', casos: 2, proxVencimento: '1 dia', proxHoras: 26, tmr: '1 dia', estourados: 0, noPrazo: 90, status: 'Moderado' },
]

// ── 3) Evolução ──────────────────────────────────────────────────────────────
export const evolucaoBase = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  picoIdx: 6,
  agoraIdx: 9,
  picoLabel: 'pico de risco',
  meta: 90,
}
export const evolucaoMetricas = ['No prazo', 'Vencidos', 'TMR'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

// ── 4) Tabela "Correlação de risco" (comparativo) ────────────────────────────
export type CorrelRiscoLinha = {
  tipo: string
  casos: number
  prazoCritico: string
  tmr: string
  tendencia: string
  tendenciaTone: 'danger' | 'warning' | 'success' | 'neutral'
  gargalo: string
  status: RiscoStatus
}

export const correlacao: CorrelRiscoLinha[] = [
  { tipo: 'Menor Prazo Regulatório', casos: 4, prazoCritico: '3h', tmr: '1h', tendencia: '↑ +1', tendenciaTone: 'danger', gargalo: 'Janela regulatória curta · negativas e exames não priorizados', status: 'Crítico' },
  { tipo: 'Escalonamento', casos: 3, prazoCritico: '8h', tmr: '8h', tendencia: '↑ +2 na semana', tendenciaTone: 'danger', gargalo: 'Potencial de reclamação formal/judicial · Ouvidoria', status: 'Alto' },
  { tipo: 'NIPs', casos: 7, prazoCritico: '1 dia', tmr: '2 dias', tendencia: '→ estável', tendenciaTone: 'neutral', gargalo: 'Volume alto de reembolsos pendentes', status: 'Alto' },
  { tipo: 'Liminares e Casos Críticos', casos: 2, prazoCritico: '1 dia', tmr: '1 dia', tendencia: '↓ −1', tendenciaTone: 'success', gargalo: 'Passivo financeiro elevado (R$ 180 mil)', status: 'Moderado' },
]

export const comoInterpretar =
  'Score de risco = proximidade do vencimento × volume × exposição. Tipos com janela curta (< 6h) e tendência de alta exigem mesa dedicada. NIPs têm resposta obrigatória à ANS — priorizar mesmo com prazo maior. Liminares pesam pela exposição financeira, não pelo SLA.'

// Link de rodapé: tipo de menor risco no momento (tendência de queda).
export const riscoControlado = { contexto: 'liminares' as RiscoContexto, nome: 'Liminares', tendencia: '↓ em queda' }
