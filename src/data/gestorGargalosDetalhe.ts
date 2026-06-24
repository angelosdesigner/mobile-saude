// Detalhe de "Gargalos e Setores" (drill-down da subaba homônima da Gestão e
// Performance). Estrutura padrão das telas de detalhe do gestor (5 blocos):
// 1) Indicadores · 2) Tabela (Setores · agora) · 3) Evolução · 4) Correlação ·
// 5) Insights da IA. Os chips no topo selecionam o SETOR (Geral por padrão).
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export type SetorContexto =
  | 'geral'
  | 'n1'
  | 'reembolsos'
  | 'ouvidoria'
  | 'auditoria'
  | 'financeiro'
  | 'contas-medicas'
export type BadgeTone = 'danger' | 'warning' | 'success' | 'primary'

export interface SetorKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
}

export interface ContextoSetor {
  key: SetorContexto
  label: string
  badge: string
  badgeTone: BadgeTone
  resumo: string
  subtitulo: string
  setoresDestaque: string[]
  kpis: SetorKpi[]
  volume: number[]
  ocupacao: number[]
  diagnostico: { confianca: string; texto: string }
  recomendacoes: RecomendacaoIA[]
}

export interface SetorChip {
  key: SetorContexto
  label: string
  ocupacao: number
  tone: 'danger' | 'warning' | 'success' | 'neutral'
}

export const chips: SetorChip[] = [
  { key: 'geral', label: 'Todos os setores', ocupacao: 69, tone: 'neutral' },
  { key: 'n1', label: 'N1', ocupacao: 88, tone: 'danger' },
  { key: 'ouvidoria', label: 'Ouvidoria', ocupacao: 92, tone: 'danger' },
  { key: 'auditoria', label: 'Auditoria', ocupacao: 78, tone: 'warning' },
  { key: 'financeiro', label: 'Financeiro', ocupacao: 52, tone: 'warning' },
  { key: 'reembolsos', label: 'Reembolsos', ocupacao: 45, tone: 'success' },
  { key: 'contas-medicas', label: 'Contas Médicas', ocupacao: 50, tone: 'success' },
]

const rec = (titulo: string, corpo: string, impacto: string, acao = 'Detalhar', destaque = false): RecomendacaoIA => ({ titulo, corpo, impacto, acao, destaque })

export const contextos: Record<SetorContexto, ContextoSetor> = {
  geral: {
    key: 'geral', label: 'Geral', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: '48 em fila · ocupação média 69% · 8 estouros de SLA',
    subtitulo: '6 setores monitorados · maior pressão em N1 e Ouvidoria · Financeiro com aging elevado',
    setoresDestaque: [],
    kpis: [
      { label: 'Fila total', value: '48', unit: 'tickets', status: 'warning', delta: '↑ 6 vs ontem', deltaTone: 'down' },
      { label: 'Em atendimento', value: '42', unit: '', status: 'neutral', delta: '6 setores', deltaTone: 'neutral' },
      { label: 'Ocupação média', value: '69', unit: '%', status: 'warning', delta: 'N1 88% · Ouvidoria 92%', deltaTone: 'neutral' },
      { label: 'Estouros de SLA', value: '8', unit: '', status: 'danger', delta: 'N1 (5) · Ouvidoria (2)', deltaTone: 'down' },
    ],
    volume: [38, 40, 42, 45, 47, 48, 50, 49, 47, 48, 49, 48],
    ocupacao: [62, 64, 66, 68, 70, 71, 72, 71, 69, 70, 70, 69],
    diagnostico: { confianca: 'confiança 87% · 540 padrões similares',
      texto: 'A pressão está concentrada em N1 (ocupação 88%, 5 estouros) e Ouvidoria (92%, 2 estouros). Financeiro tem baixo volume mas aging elevado (2d 4h). Redistribuir parte da fila do N1 para canais com folga e reforçar a Ouvidoria no pico recupera o SLA sem ampliar a equipe.' },
    recomendacoes: [
      rec('Rebalancear N1', 'Migrar parte das Autorizações do N1 para Chat/WhatsApp via BOT nos picos.', 'TME N1 −30% · em 2h', 'Aplicar', true),
      rec('Reforçar Ouvidoria', 'Alocar 2 atendentes para a Ouvidoria entre 14h–18h.', 'SLA Ouvidoria +15 p.p.'),
      rec('Destravar Financeiro', 'Revisar os tickets parados há +2 dias no Financeiro (gargalo processual).', 'Aging −40%'),
    ],
  },
  n1: {
    key: 'n1', label: 'N1 · Atendimento', badge: 'CRÍTICO', badgeTone: 'danger',
    resumo: '8 em fila · ocupação 88% · 5 estouros de SLA',
    subtitulo: 'Porta de entrada da operação · maior volume e maior número de estouros ativos',
    setoresDestaque: ['N1 · Atendimento'],
    kpis: [
      { label: 'Fila', value: '8', unit: 'tickets', status: 'warning', delta: 'TME 14min', deltaTone: 'down' },
      { label: 'Em atendimento', value: '14', unit: '', status: 'neutral', delta: 'TMA 8min', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '88', unit: '%', status: 'danger', delta: '↑ 4 p.p. vs ontem', deltaTone: 'down' },
      { label: 'Estouros de SLA', value: '5', unit: '', status: 'danger', delta: 'maior fonte de risco', deltaTone: 'down' },
    ],
    volume: [6, 7, 8, 9, 10, 11, 12, 11, 10, 11, 12, 11],
    ocupacao: [80, 82, 84, 86, 88, 89, 90, 89, 87, 88, 89, 88],
    diagnostico: { confianca: 'confiança 90% · 410 padrões similares',
      texto: 'N1 opera no limite (88%) e concentra 5 estouros. O TME de 14min na fila indica subdimensionamento no horário de pico. Parte da demanda é automatizável (autorizações simples) e pode migrar para o BOT, liberando capacidade humana para os casos complexos.' },
    recomendacoes: [
      rec('Migrar autorizações p/ BOT', 'Triagem automática de autorizações simples nos picos.', 'Ocupação −12% · libera 2 atend.', 'Aplicar', true),
      rec('Reforço no pico', 'Escalar 1 atendente extra entre 14h–17h.', 'TME −30%'),
      rec('Priorizar estouros', 'Mesa dedicada para os 5 tickets com SLA estourado.', 'Zera estouros ativos'),
    ],
  },
  ouvidoria: {
    key: 'ouvidoria', label: 'Ouvidoria', badge: 'CRÍTICO', badgeTone: 'danger',
    resumo: '5 em fila · ocupação 92% · 2 estouros de SLA',
    subtitulo: 'Maior ocupação da operação · repasses elevados (2,5×) · risco de escalonamento',
    setoresDestaque: ['Ouvidoria'],
    kpis: [
      { label: 'Fila', value: '5', unit: 'tickets', status: 'warning', delta: 'TME 8h', deltaTone: 'down' },
      { label: 'Em atendimento', value: '3', unit: '', status: 'neutral', delta: 'TMA 4h', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '92', unit: '%', status: 'danger', delta: 'tendência de alta', deltaTone: 'down' },
      { label: 'Repasses', value: '2,5', unit: '×/ticket', status: 'danger', delta: 'maior da operação', deltaTone: 'down' },
    ],
    volume: [3, 3, 4, 4, 5, 5, 5, 5, 4, 5, 5, 5],
    ocupacao: [85, 86, 88, 89, 90, 91, 92, 92, 91, 92, 92, 92],
    diagnostico: { confianca: 'confiança 86% · 198 padrões similares',
      texto: 'Ocupação de 92% com tendência de alta e os maiores repasses da operação (2,5×/ticket) — cada caso passa por muitas mãos antes de resolver. Isso eleva o TMR e o risco de escalonamento para reclamação formal. Reduzir repasses com alçada de decisão é a maior alavanca aqui.' },
    recomendacoes: [
      rec('Reduzir repasses', 'Dar alçada de decisão ao 1º nível da Ouvidoria para casos recorrentes.', 'Repasses −40%', 'Aplicar', true),
      rec('Reforço vespertino', 'Alocar 2 atendentes entre 14h–18h.', 'SLA +15 p.p.'),
      rec('Contato proativo', 'Ligar antes do vencimento nos casos com risco de formalização.', 'Reduz escalonamento'),
    ],
  },
  auditoria: {
    key: 'auditoria', label: 'Auditoria', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: '9 em fila · ocupação 78% · 1 estouro de SLA',
    subtitulo: 'Concentra NIPs e exames de alta complexidade · aging crescente',
    setoresDestaque: ['Auditoria'],
    kpis: [
      { label: 'Fila', value: '9', unit: 'tickets', status: 'warning', delta: 'TME 1 dia', deltaTone: 'down' },
      { label: 'Em atendimento', value: '6', unit: '', status: 'neutral', delta: 'TMA 12h', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '78', unit: '%', status: 'warning', delta: '↑ 3 p.p. vs ontem', deltaTone: 'down' },
      { label: 'Estouros de SLA', value: '1', unit: '', status: 'warning', delta: 'NIP em risco', deltaTone: 'down' },
    ],
    volume: [6, 7, 7, 8, 8, 9, 9, 9, 8, 9, 9, 9],
    ocupacao: [72, 73, 74, 75, 76, 77, 78, 78, 77, 78, 78, 78],
    diagnostico: { confianca: 'confiança 83% · 142 padrões similares',
      texto: 'Auditoria concentra as NIPs e os exames de alta complexidade — casos que exigem parecer técnico e têm prazo regulatório. A fila de 9 com TME de 1 dia indica que os casos novos esperam demais antes do 1º parecer. Processar NIPs em lote acelera a vazão.' },
    recomendacoes: [
      rec('NIPs em lote', 'Agrupar e processar as NIPs de reembolso em lote.', 'NIPs no prazo +12 p.p.', 'Aplicar', true),
      rec('Parecer prioritário', 'Priorizar 1º parecer dos exames de alta complexidade.', 'TME −25%'),
      rec('Template técnico', 'Padronizar laudos recorrentes com template aprovado.', 'TMA −15%'),
    ],
  },
  financeiro: {
    key: 'financeiro', label: 'Financeiro', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: '4 em fila · ocupação 52% · aging 2d 4h',
    subtitulo: 'Baixo volume, porém o maior aging da operação — possível gargalo processual',
    setoresDestaque: ['Financeiro'],
    kpis: [
      { label: 'Fila', value: '4', unit: 'tickets', status: 'ok', delta: 'TME 2 dias', deltaTone: 'down' },
      { label: 'Em atendimento', value: '5', unit: '', status: 'neutral', delta: 'TMA 1 dia', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '52', unit: '%', status: 'ok', delta: 'folga de capacidade', deltaTone: 'up' },
      { label: 'Aging médio', value: '2d 4h', unit: '', status: 'danger', delta: 'maior da operação', deltaTone: 'down' },
    ],
    volume: [4, 4, 5, 5, 4, 5, 5, 5, 4, 5, 5, 4],
    ocupacao: [48, 49, 50, 51, 52, 52, 53, 52, 51, 52, 52, 52],
    diagnostico: { confianca: 'confiança 80% · 88 padrões similares',
      texto: 'Paradoxo clássico: baixa ocupação (52%) mas o maior aging da operação (2d 4h). Não é falta de capacidade — é gargalo processual (tickets parados aguardando uma etapa interna). Mapear a etapa que trava e definir SLA interno resolve sem reforço de equipe.' },
    recomendacoes: [
      rec('Mapear a etapa que trava', 'Identificar onde os tickets ficam parados +2 dias.', 'Aging −40%', 'Aplicar', true),
      rec('SLA interno', 'Definir SLA de retaguarda para a etapa crítica.', 'Previsibilidade'),
      rec('Mutirão pontual', 'Limpar os tickets mais antigos com a folga de capacidade atual.', 'Zera backlog antigo'),
    ],
  },
  reembolsos: {
    key: 'reembolsos', label: 'Reembolsos', badge: 'CONTROLADO', badgeTone: 'success',
    resumo: '12 em fila · ocupação 45% · sem estouros',
    subtitulo: 'Volume alto mas dentro do SLA · principal origem de NIPs',
    setoresDestaque: ['Reembolsos'],
    kpis: [
      { label: 'Fila', value: '12', unit: 'tickets', status: 'warning', delta: 'TME 2 dias', deltaTone: 'neutral' },
      { label: 'Em atendimento', value: '8', unit: '', status: 'neutral', delta: 'TMA 1 dia', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '45', unit: '%', status: 'ok', delta: 'folga de capacidade', deltaTone: 'up' },
      { label: 'Estouros de SLA', value: '0', unit: '', status: 'ok', delta: 'dentro do prazo', deltaTone: 'up' },
    ],
    volume: [10, 11, 11, 12, 12, 13, 12, 12, 11, 12, 12, 12],
    ocupacao: [42, 43, 44, 45, 45, 46, 46, 45, 44, 45, 45, 45],
    diagnostico: { confianca: 'confiança 81% · 176 padrões similares',
      texto: 'Setor saudável no SLA, mas é a principal origem de NIPs — insatisfações com reembolso viram notificação à ANS. A fila de 12 com folga de capacidade (45%) sugere oportunidade de automação da triagem para reduzir a entrada de NIPs.' },
    recomendacoes: [
      rec('Reduzir origem de NIPs', 'Mapear por que reembolsos viram NIP e atacar a causa.', 'Entrada de NIPs −20%', 'Aplicar', true),
      rec('Automatizar triagem', 'Triagem automática de reembolsos simples.', 'Vazão +25%'),
      rec('Comunicação proativa', 'Avisar o beneficiário sobre o status do reembolso.', 'CSAT +0,2'),
    ],
  },
  'contas-medicas': {
    key: 'contas-medicas', label: 'Contas Médicas', badge: 'CONTROLADO', badgeTone: 'success',
    resumo: '10 em fila · ocupação 50% · sem estouros',
    subtitulo: 'Dentro do SLA · candidato a automação de solicitações simples',
    setoresDestaque: ['Contas Médicas'],
    kpis: [
      { label: 'Fila', value: '10', unit: 'tickets', status: 'warning', delta: 'TME 1 dia', deltaTone: 'neutral' },
      { label: 'Em atendimento', value: '6', unit: '', status: 'neutral', delta: 'TMA 1 dia', deltaTone: 'neutral' },
      { label: 'Ocupação', value: '50', unit: '%', status: 'ok', delta: 'folga de capacidade', deltaTone: 'up' },
      { label: 'Estouros de SLA', value: '0', unit: '', status: 'ok', delta: 'dentro do prazo', deltaTone: 'up' },
    ],
    volume: [8, 9, 9, 10, 10, 10, 11, 10, 9, 10, 10, 10],
    ocupacao: [46, 47, 48, 49, 50, 50, 51, 50, 49, 50, 50, 50],
    diagnostico: { confianca: 'confiança 79% · 120 padrões similares',
      texto: 'Setor estável e dentro do SLA. A ocupação de 50% e a fila de 10 indicam que 30% das solicitações são simples e repetitivas — fortes candidatas a automação, liberando capacidade para os casos que exigem análise.' },
    recomendacoes: [
      rec('Automação de solicitações simples', 'Triagem automática via BOT das solicitações repetitivas.', 'Libera 2 atendentes', 'Aplicar', true),
      rec('Realocar capacidade', 'Usar a folga para apoiar setores em pico (N1/Ouvidoria).', 'Ocupação geral +'),
      rec('Padronizar análise', 'Checklist de análise para reduzir variação de TMA.', 'TMA −10%'),
    ],
  },
}

// ── 2) Tabela "Setores · agora" (comparativo) ────────────────────────────────
export type SetorStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type SetorLinha = {
  setor: string
  fila: number
  emAtendimento: number
  tme: string
  tma: string
  estourados: number
  ocupacao: number
  repasses: string
  status: SetorStatus
}

export const setoresAgora: SetorLinha[] = [
  { setor: 'N1 · Atendimento', fila: 8, emAtendimento: 14, tme: '14min', tma: '8min', estourados: 5, ocupacao: 88, repasses: '1,2×', status: 'Crítico' },
  { setor: 'Ouvidoria', fila: 5, emAtendimento: 3, tme: '8h', tma: '4h', estourados: 2, ocupacao: 92, repasses: '2,5×', status: 'Crítico' },
  { setor: 'Auditoria', fila: 9, emAtendimento: 6, tme: '1 dia', tma: '12h', estourados: 1, ocupacao: 78, repasses: '1,8×', status: 'Alto' },
  { setor: 'Financeiro', fila: 4, emAtendimento: 5, tme: '2 dias', tma: '1 dia', estourados: 0, ocupacao: 52, repasses: '1,3×', status: 'Médio' },
  { setor: 'Reembolsos', fila: 12, emAtendimento: 8, tme: '2 dias', tma: '1 dia', estourados: 0, ocupacao: 45, repasses: '1,1×', status: 'OK' },
  { setor: 'Contas Médicas', fila: 10, emAtendimento: 6, tme: '1 dia', tma: '1 dia', estourados: 0, ocupacao: 50, repasses: '1,3×', status: 'OK' },
]

// ── 3) Evolução ──────────────────────────────────────────────────────────────
export const evolucaoBase = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  picoIdx: 6,
  agoraIdx: 9,
  picoLabel: 'pico de fila',
  meta: 85,
}
export const evolucaoMetricas = ['Ocupação', 'TME', 'Fila'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

// ── 4) Tabela "Correlação operacional" (comparativo) ─────────────────────────
export type CorrelSetorLinha = {
  setor: string
  volume: number
  sla: number
  tme: string
  ocupacao: number
  espera: string
  gargalo: string
  status: SetorStatus
}

export const correlacao: CorrelSetorLinha[] = [
  { setor: 'N1 · Atendimento', volume: 847, sla: 61, tme: '9:23', ocupacao: 88, espera: '12:41', gargalo: 'Alta ocupação → TME elevado · subdimensionamento no pico', status: 'Crítico' },
  { setor: 'Ouvidoria', volume: 143, sla: 75, tme: '6:50', ocupacao: 92, espera: '8:38', gargalo: 'Ocupação crítica + repasses elevados (2,5×)', status: 'Alto' },
  { setor: 'Auditoria', volume: 176, sla: 84, tme: '4:10', ocupacao: 78, espera: '5:20', gargalo: 'NIPs e exames aguardam 1º parecer', status: 'Alto' },
  { setor: 'Financeiro', volume: 92, sla: 88, tme: '2:34', ocupacao: 52, espera: '1:12', gargalo: 'Aging alto por etapa interna travada (processual)', status: 'Médio' },
  { setor: 'Reembolsos', volume: 240, sla: 94, tme: '2:10', ocupacao: 45, espera: '1:20', gargalo: 'Sem gargalo · origem de NIPs', status: 'OK' },
  { setor: 'Contas Médicas', volume: 176, sla: 96, tme: '2:34', ocupacao: 50, espera: '1:12', gargalo: 'Sem gargalo identificado', status: 'OK' },
]

export const comoInterpretar =
  'Score Crítico = 2+ dimensões acima do limite simultaneamente. Setores com Alta Ocupação (>85%) e TME elevado (>8min) indicam subdimensionamento da equipe. Aging alto com ocupação baixa indica gargalo processual (etapa interna), não falta de capacidade. Repasses elevados (>2×) elevam o TMR e o risco de escalonamento.'

export const setorSaudavel = { contexto: 'reembolsos' as SetorContexto, nome: 'Reembolsos', sla: 94 }
