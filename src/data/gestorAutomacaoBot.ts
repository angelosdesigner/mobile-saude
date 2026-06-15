// Tela de detalhe "Central de Automação" (drill-down de Atendimentos →
// Atendimento automatizado) — Figma 7654:104067. Estrutura padrão das telas de
// detalhe: 1) Indicadores · 2) Tabela (fluxos do BOT) · 3) Evolução ·
// 4) BOT vs Humano · 5) Jornada do BOT · 6) Recomendações IA.
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

// ── Cabeçalho/contexto ────────────────────────────────────────────────────────
export const contexto = {
  badge: '1 FLUXO COM ALERTA',
  resumoAlerta: 'Envio de Documentos com 15% de abandono',
  titulo: 'Central de Automação',
  subtitulo: 'BOT principal · 8 fluxos · 12.847 interações hoje · 65% retidas sem humano',
}

// ── 1) Indicadores do BOT (KPIs) ──────────────────────────────────────────────
export interface BotKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger'
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

export const indicadoresBot: BotKpi[] = [
  { label: 'Retenção BOT', value: '65', unit: '%', status: 'ok', delta: 'meta 60%', deltaTone: 'up' },
  { label: 'Transbordo', value: '35', unit: '%', status: 'warning' },
  { label: 'Abandono BOT', value: '8.2', unit: '%', status: 'warning', delta: 'concentrado em 1 fluxo', deltaTone: 'down' },
  { label: 'Eficiência', value: '87', unit: '%', status: 'ok' },
  { label: 'Tempo Médio', value: '2:14', unit: '', status: 'ok' },
  { label: 'NPS do BOT', value: '4.3', unit: '/5', status: 'ok', delta: '+0.2 vs humano', deltaTone: 'up' },
]

// ── 3) Evolução dos indicadores do BOT ────────────────────────────────────────
export const evolucao = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'],
  volume: [52, 64, 78, 84, 90, 96, 100, 95, 92, 86, 70, 64],
  // Linha por indicador (%). Retenção é o default (casa a legenda).
  series: {
    Retenção: [70, 69, 68, 67, 66, 66, 65, 65, 64, 65, 66, 67],
    Abandono: [4, 5, 6, 7, 9, 10, 11, 10, 9, 8, 7, 7],
    Eficiência: [90, 89, 88, 88, 87, 87, 86, 87, 87, 88, 88, 89],
  } as Record<string, number[]>,
  meta: 90,
  picoIdx: 3, // 11h
  picoLabel: '11h · pico vespertino',
  agoraIdx: 9, // 17h
}
export const evolucaoMetricas = ['Retenção', 'Abandono', 'Eficiência'] as const

// ── 2) Todos os fluxos do BOT (tabela, ordenada por abandono) ────────────────
export type FluxoStatus = 'ALERTA' | 'ATENÇÃO' | 'BAIXA RET.' | 'OK'

export type FluxoBot = {
  fluxo: string
  atend: number
  retencao: number
  transferencia: number
  abandono: number
  tma: string
  nps: number
  tEspHumano: string
  status: FluxoStatus
}

export const fluxosBot: FluxoBot[] = [
  { fluxo: 'Envio de Documentos', atend: 2847, retencao: 59, transferencia: 26, abandono: 15, tma: '4:34', nps: 4.1, tEspHumano: '—', status: 'ALERTA' },
  { fluxo: 'Atualização Cadastral', atend: 1247, retencao: 68, transferencia: 25, abandono: 7, tma: '2:42', nps: 4.4, tEspHumano: '1:05', status: 'ATENÇÃO' },
  { fluxo: 'Cancelamento', atend: 892, retencao: 42, transferencia: 52, abandono: 6, tma: '3:12', nps: 4.2, tEspHumano: '0:58', status: 'BAIXA RET.' },
  { fluxo: 'Autorização Prévia', atend: 2103, retencao: 72, transferencia: 24, abandono: 4, tma: '2:18', nps: 4.6, tEspHumano: '1:23', status: 'OK' },
  { fluxo: 'Reembolso Status', atend: 1685, retencao: 78, transferencia: 18, abandono: 4, tma: '1:34', nps: 3.7, tEspHumano: '2:47', status: 'OK' },
  { fluxo: 'Consulta de Carência', atend: 1428, retencao: 84, transferencia: 13, abandono: 3, tma: '1:52', nps: 3.9, tEspHumano: '2:10', status: 'OK' },
  { fluxo: 'Agendamento', atend: 800, retencao: 88, transferencia: 9, abandono: 3, tma: '2:06', nps: 4.5, tEspHumano: '0:32', status: 'OK' },
  { fluxo: '2ª via de Boleto', atend: 1845, retencao: 91, transferencia: 7, abandono: 2, tma: '1:08', nps: 4.8, tEspHumano: '0:45', status: 'OK' },
]

// ── 4) BOT vs Atendimento Humano (comparativo) ───────────────────────────────
export interface BotVsHumano {
  metrica: string
  bot: string
  humano: string
  delta: string
  /** Quem está melhor nessa métrica (cor do delta). */
  tone: 'success' | 'warning' | 'neutral'
}

export const botVsHumano: BotVsHumano[] = [
  { metrica: 'TME', bot: '2:14 min', humano: '8:32 min', delta: '74% mais rápido', tone: 'success' },
  { metrica: 'NPS', bot: '4.3 /5', humano: '4.1 /5', delta: '+0.2 BOT', tone: 'success' },
  { metrica: 'Resolução', bot: '65%', humano: '87%', delta: '+22pp humano', tone: 'warning' },
  { metrica: 'Volume', bot: '8.420 atend', humano: '2.103 atend', delta: '80% via BOT', tone: 'neutral' },
]

// ── 5) Jornada do BOT (funil por fluxo) ──────────────────────────────────────
export interface JornadaEtapa {
  nome: string
  valor: number
  pctTotal: string
  conv: number
  aband: number
  tempo: string
  /** Cor da etapa (destaque do gargalo). */
  tone: 'primary' | 'warning' | 'danger' | 'success'
}
export interface JornadaFluxo {
  key: string
  label: string
  etapas: JornadaEtapa[]
  gargalo: { titulo: string; corpo: string }
}

export const jornadaFluxos: JornadaFluxo[] = [
  {
    key: 'envio-docs',
    label: 'Envio de Docs',
    etapas: [
      { nome: 'Documentação', valor: 40, pctTotal: '89% do total', conv: 72, aband: 15, tempo: '2:14', tone: 'danger' },
      { nome: 'Validação', valor: 30, pctTotal: '65% do total', conv: 84, aband: 9, tempo: '1:42', tone: 'warning' },
      { nome: 'Autorização', valor: 30, pctTotal: '65% do total', conv: 81, aband: 9, tempo: '1:42', tone: 'success' },
    ],
    gargalo: {
      titulo: 'Maior gargalo: etapa "Documentação" (15% abandono)',
      corpo: 'Usuários abandonam após receber instruções de upload. Tempo médio elevado sugere instruções confusas ou validação muito rígida. 425 abandonos representam 15% do volume diário do BOT.',
    },
  },
  {
    key: 'autorizacao',
    label: 'Autorização',
    etapas: [
      { nome: 'Identificação', valor: 36, pctTotal: '92% do total', conv: 88, aband: 5, tempo: '1:10', tone: 'success' },
      { nome: 'Validação prévia', valor: 30, pctTotal: '76% do total', conv: 80, aband: 8, tempo: '1:48', tone: 'warning' },
      { nome: 'Liberação', valor: 26, pctTotal: '66% do total', conv: 85, aband: 4, tempo: '1:20', tone: 'success' },
    ],
    gargalo: {
      titulo: 'Maior gargalo: etapa "Validação prévia" (8% abandono)',
      corpo: 'A validação prévia concentra o maior abandono do fluxo. Reduzir o número de campos obrigatórios tende a melhorar a conversão.',
    },
  },
  {
    key: '2via',
    label: '2ª via',
    etapas: [
      { nome: 'Identificação', valor: 44, pctTotal: '95% do total', conv: 95, aband: 2, tempo: '0:38', tone: 'success' },
      { nome: 'Emissão', valor: 41, pctTotal: '89% do total', conv: 92, aband: 2, tempo: '0:30', tone: 'success' },
      { nome: 'Envio', valor: 38, pctTotal: '82% do total', conv: 96, aband: 1, tempo: '0:22', tone: 'success' },
    ],
    gargalo: {
      titulo: 'Sem gargalo relevante (91% de retenção)',
      corpo: 'Fluxo modelo: alta conversão em todas as etapas e abandono mínimo. Bom candidato a servir de template para novos fluxos.',
    },
  },
  {
    key: 'carencia',
    label: 'Carência',
    etapas: [
      { nome: 'Identificação', valor: 38, pctTotal: '90% do total', conv: 90, aband: 3, tempo: '1:05', tone: 'success' },
      { nome: 'Consulta', valor: 33, pctTotal: '78% do total', conv: 86, aband: 4, tempo: '1:30', tone: 'warning' },
      { nome: 'Resultado', valor: 30, pctTotal: '71% do total', conv: 88, aband: 3, tempo: '1:12', tone: 'success' },
    ],
    gargalo: {
      titulo: 'Maior gargalo: etapa "Consulta" (4% abandono)',
      corpo: 'Abandono baixo e estável. O tempo na etapa de consulta pode ser reduzido com cache do histórico do beneficiário.',
    },
  },
]

// ── 6) Recomendações IA ───────────────────────────────────────────────────────
export const diagnosticoBot = {
  confianca: 'confiança 92% · análise sobre 12.847 jornadas',
  texto: 'O BOT performa acima da meta (65% retenção, meta 60%), mas o fluxo Envio de Documentos concentra 38% de todo o abandono. A análise de UX dos abandonos sugere instruções de upload pouco claras na etapa Documentação. Cancelamento também merece atenção: retenção de apenas 42% indica que o BOT não cobre bem os motivos de cancelamento.',
}

export const recomendacoesBot: RecomendacaoIA[] = [
  {
    titulo: 'Redesenhar etapa Documentação',
    corpo: 'Substituir instruções textuais por exemplos visuais de documentos aceitos. A/B test com 20% do tráfego durante 1 semana valida hipótese antes de full rollout.',
    impacto: 'Abandono -8 pp · em 14 dias',
    acao: 'Aplicar',
    destaque: true,
  },
  {
    titulo: 'Roteamento direto Cancelamento',
    corpo: 'Detectar intenção "cancelamento" nas primeiras 2 interações e direcionar diretamente para humano. Retenção atual é falsa positiva (cliente fica preso no BOT).',
    impacto: 'NPS +3 pts · CSAT no canal',
    acao: 'Detalhar',
  },
  {
    titulo: 'Expandir fluxos BOT em alta retenção',
    corpo: '2ª via (91%) e Carência (84%) com excelente retenção. Adicionar templates similares para Reagendamento e Dúvidas de Plano.',
    impacto: 'Retenção geral +4 pp · 30d',
    acao: 'Detalhar',
  },
]

export const proximoGargalo = 'Cancelamento · retenção 42%'
