// Detalhe de "Qualidade e Experiência" (drill-down da subaba homônima).
// Estrutura padrão das telas de detalhe (5 blocos): 1) Indicadores · 2) Tabela
// (Qualidade por canal · agora) · 3) Evolução (90d) · 4) Correlação · 5) IA.
// Os chips no topo selecionam o INDICADOR (Geral por padrão).
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

export const periodos = ['Hoje', '7d', '30d', 'Trimestre'] as const

export type QualidadeContexto = 'geral' | 'nps' | 'csat' | 'ces' | 'reabertura'
export type BadgeTone = 'danger' | 'warning' | 'success' | 'primary'

export interface QualidadeDetKpi {
  label: string
  value: string
  unit: string
  status: 'ok' | 'warning' | 'danger' | 'neutral'
  delta: string
  deltaTone: 'up' | 'down' | 'neutral'
}

export interface ContextoQualidade {
  key: QualidadeContexto
  label: string
  badge: string
  badgeTone: BadgeTone
  resumo: string
  subtitulo: string
  kpis: QualidadeDetKpi[]
  diagnostico: { confianca: string; texto: string }
  recomendacoes: RecomendacaoIA[]
}

export interface QualidadeChip {
  key: QualidadeContexto
  label: string
  valor: string
  tone: 'danger' | 'warning' | 'success' | 'neutral'
}

export const chips: QualidadeChip[] = [
  { key: 'geral', label: 'Visão geral', valor: '', tone: 'neutral' },
  { key: 'nps', label: 'NPS', valor: '72', tone: 'warning' },
  { key: 'csat', label: 'CSAT', valor: '4,6', tone: 'success' },
  { key: 'ces', label: 'CES', valor: '2,4', tone: 'success' },
  { key: 'reabertura', label: 'Reabertura', valor: '8%', tone: 'danger' },
]

const rec = (titulo: string, corpo: string, impacto: string, acao = 'Detalhar', destaque = false): RecomendacaoIA => ({ titulo, corpo, impacto, acao, destaque })

export const contextos: Record<QualidadeContexto, ContextoQualidade> = {
  geral: {
    key: 'geral', label: 'Geral', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: 'NPS 72 (↓8) · CSAT 4,6 · gap de resolutividade 8 p.p.',
    subtitulo: 'Percepção do beneficiário · clientes avaliam bem o atendimento, mas indicam dificuldade na resolução',
    kpis: [
      { label: 'NPS', value: '72', unit: '', status: 'warning', delta: '↓ 8 pts vs ant.', deltaTone: 'down' },
      { label: 'CSAT', value: '4,6', unit: '/5', status: 'ok', delta: '↑ 0,1 vs ant.', deltaTone: 'up' },
      { label: 'CES', value: '2,4', unit: '/5', status: 'ok', delta: '↓ 0,2 · menor esforço', deltaTone: 'up' },
      { label: 'Gap de resolutividade', value: '8', unit: 'p.p.', status: 'warning', delta: 'sistema 82% vs percebido 74%', deltaTone: 'down' },
    ],
    diagnostico: { confianca: 'confiança 86% · 480 padrões similares',
      texto: 'O atendimento é bem avaliado (CSAT 4,6 · CES 2,4), mas o NPS caiu 8 pontos e o gap de resolutividade é de 8 p.p.: o sistema considera resolvido (82%) o que o beneficiário não confirma (74%). A causa principal é a reabertura crescente — "a solução não resolveu de fato". Atacar a causa-raiz da reabertura recupera o NPS.' },
    recomendacoes: [
      rec('Atacar causa da reabertura', '38% das reaberturas são por "não resolveu". Revisar scripts de fechamento e checklist de resolução.', 'Reabertura −5 p.p. · NPS +4', 'Aplicar', true),
      rec('Fechar o gap percebido', 'Confirmar resolução com o beneficiário antes de encerrar.', 'Gap −4 p.p.'),
      rec('Reduzir esforço no Telefone', 'Canal com maior CES — simplificar o fluxo de URA.', 'CES −0,3'),
    ],
  },
  nps: {
    key: 'nps', label: 'NPS', badge: 'ATENÇÃO', badgeTone: 'warning',
    resumo: '72 · queda de 8 pontos no período',
    subtitulo: 'Lealdade do beneficiário · queda puxada pela reabertura e pelo canal Telefone',
    kpis: [
      { label: 'NPS', value: '72', unit: '', status: 'warning', delta: '↓ 8 pts vs ant.', deltaTone: 'down' },
      { label: 'Promotores', value: '58', unit: '%', status: 'ok', delta: 'nota 9–10', deltaTone: 'up' },
      { label: 'Detratores', value: '14', unit: '%', status: 'warning', delta: 'nota 0–6', deltaTone: 'down' },
      { label: 'Respostas', value: '1.240', unit: '', status: 'neutral', delta: 'no período', deltaTone: 'neutral' },
    ],
    diagnostico: { confianca: 'confiança 84% · 210 padrões similares',
      texto: 'A queda do NPS é puxada pelo aumento de detratores, fortemente correlacionado com casos de reabertura e com o canal Telefone (maior esforço). Promotores seguem estáveis. Recuperar os detratores recentes com follow-up proativo é a alavanca mais rápida.' },
    recomendacoes: [
      rec('Follow-up de detratores', 'Contato proativo com detratores das últimas 2 semanas.', 'Recupera +6 pts', 'Aplicar', true),
      rec('Fechar reaberturas', 'Resolver de fato os casos reabertos (causa nº1 de detração).', 'NPS +4'),
      rec('Revisar URA do Telefone', 'Canal com mais detratores — simplificar o fluxo.', 'Detratores −3 p.p.'),
    ],
  },
  csat: {
    key: 'csat', label: 'CSAT', badge: 'SAUDÁVEL', badgeTone: 'success',
    resumo: '4,6 / 5 · estável e dentro da meta',
    subtitulo: 'Satisfação com o atendimento · ponto forte da operação · maior no Balcão',
    kpis: [
      { label: 'CSAT', value: '4,6', unit: '/5', status: 'ok', delta: '↑ 0,1 vs ant.', deltaTone: 'up' },
      { label: 'Satisfeitos', value: '88', unit: '%', status: 'ok', delta: 'nota 4–5', deltaTone: 'up' },
      { label: 'Respostas', value: '1.240', unit: '', status: 'neutral', delta: 'no período', deltaTone: 'neutral' },
      { label: 'Menor canal', value: 'Telefone', unit: '', status: 'warning', delta: 'CSAT 4,2', deltaTone: 'down' },
    ],
    diagnostico: { confianca: 'confiança 88% · 260 padrões similares',
      texto: 'CSAT saudável (4,6) e estável — ponto forte. O atendimento em si agrada; a fragilidade está na resolução (vide gap e reabertura), não na experiência do contato. O Telefone puxa a média para baixo (4,2) por causa do esforço/espera.' },
    recomendacoes: [
      rec('Replicar boas práticas do Balcão', 'Mapear o que faz o Balcão ter o maior CSAT e replicar.', 'CSAT +0,1', 'Aplicar', true),
      rec('Reduzir espera no Telefone', 'Atacar o tempo de espera, principal queixa do canal.', 'CSAT Telefone +0,3'),
      rec('Pesquisa pós-resolução', 'Medir CSAT só após confirmação de resolução.', 'Sinal mais fiel'),
    ],
  },
  ces: {
    key: 'ces', label: 'CES', badge: 'SAUDÁVEL', badgeTone: 'success',
    resumo: '2,4 / 5 · esforço baixo (quanto menor, melhor)',
    subtitulo: 'Esforço do cliente para resolver · bom no geral · atrito concentrado no Telefone',
    kpis: [
      { label: 'CES', value: '2,4', unit: '/5', status: 'ok', delta: '↓ 0,2 · menor esforço', deltaTone: 'up' },
      { label: 'Baixo esforço', value: '72', unit: '%', status: 'ok', delta: 'nota 1–2', deltaTone: 'up' },
      { label: 'Pontos de atrito', value: '3', unit: '', status: 'warning', delta: 'URA · transferências · 2ª via', deltaTone: 'down' },
      { label: 'Maior atrito', value: 'Telefone', unit: '', status: 'warning', delta: 'CES 3,1', deltaTone: 'down' },
    ],
    diagnostico: { confianca: 'confiança 82% · 150 padrões similares',
      texto: 'Esforço baixo no geral (2,4), mas concentrado em 3 atritos: navegação da URA, transferências entre setores e emissão de 2ª via. O Telefone tem o maior CES (3,1). Reduzir transferências (ligado aos repasses da Ouvidoria) corta atrito e melhora o NPS.' },
    recomendacoes: [
      rec('Reduzir transferências', 'Resolver no 1º contato com alçada — menos repasses.', 'CES −0,3', 'Aplicar', true),
      rec('Simplificar URA', 'Encurtar a árvore de menus do Telefone.', 'CES Telefone −0,4'),
      rec('Autosserviço de 2ª via', 'Disponibilizar 2ª via no app/portal.', 'Tira atrito do canal humano'),
    ],
  },
  reabertura: {
    key: 'reabertura', label: 'Reabertura', badge: 'CRÍTICO', badgeTone: 'danger',
    resumo: 'Taxa 8% · ↑ 12% nos últimos 7 dias',
    subtitulo: 'Causa-raiz da queda de NPS e do gap de resolutividade · 38% por "não resolveu"',
    kpis: [
      { label: 'Taxa de reabertura', value: '8', unit: '%', status: 'warning', delta: '↑ 12% em 7 dias', deltaTone: 'down' },
      { label: 'Motivo principal', value: '38', unit: '%', status: 'danger', delta: '"não resolveu de fato"', deltaTone: 'down' },
      { label: 'Impacto no NPS', value: '−8', unit: 'pts', status: 'danger', delta: 'correlação direta', deltaTone: 'down' },
      { label: 'Pior setor', value: 'Ouvidoria', unit: '', status: 'warning', delta: 'reanálises', deltaTone: 'down' },
    ],
    diagnostico: { confianca: 'confiança 87% · 300 padrões similares',
      texto: 'Reabertura é a causa-raiz: subiu 12% em 7 dias e está diretamente ligada à queda do NPS e ao gap de resolutividade. 38% é "não resolveu de fato" e 27% "falta de retorno no prazo". Revisar o critério de fechamento (checklist de resolução) ataca os dois maiores motivos de uma vez.' },
    recomendacoes: [
      rec('Checklist de resolução', 'Exigir confirmação de resolução antes de fechar o ticket.', 'Reabertura −5 p.p.', 'Aplicar', true),
      rec('Garantir retorno no prazo', 'Alerta de SLA de retorno para evitar a 2ª maior causa.', 'Reabertura −3 p.p.'),
      rec('Revisar reanálises da Ouvidoria', 'Setor com maior reabertura — alçada para resolver de fato.', 'NPS +3'),
    ],
  },
}

// ── 2) Tabela "Qualidade por canal · agora" (comparativo) ────────────────────
export type QualidadeStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

export type QualidadeLinha = {
  canal: string
  nps: number
  csat: number
  ces: number
  reabertura: number
  fcr: number
  status: QualidadeStatus
}

export const qualidadeAgora: QualidadeLinha[] = [
  { canal: 'Chat/WhatsApp', nps: 76, csat: 4.7, ces: 2.1, reabertura: 6, fcr: 85, status: 'OK' },
  { canal: 'Telefone', nps: 64, csat: 4.2, ces: 3.1, reabertura: 12, fcr: 74, status: 'Alto' },
  { canal: 'Balcão', nps: 81, csat: 4.8, ces: 1.9, reabertura: 4, fcr: 90, status: 'OK' },
  { canal: 'App', nps: 70, csat: 4.5, ces: 2.4, reabertura: 8, fcr: 82, status: 'Médio' },
]

// ── 3) Evolução (90 dias · ~13 semanas) ──────────────────────────────────────
export const evolucaoBase = {
  semanas: Array.from({ length: 13 }, (_, i) => `S${i + 1}`),
  respostas: [86, 92, 95, 110, 120, 118, 122, 115, 108, 112, 119, 121, 124],
  nps: [80, 79, 81, 78, 76, 75, 74, 73, 72, 73, 72, 71, 72],
  csat: [4.7, 4.6, 4.7, 4.6, 4.5, 4.6, 4.6, 4.5, 4.6, 4.6, 4.6, 4.7, 4.6],
  ces: [2.7, 2.6, 2.5, 2.6, 2.5, 2.4, 2.5, 2.4, 2.3, 2.4, 2.4, 2.3, 2.4],
  picoIdx: 6,
  agoraIdx: 12,
  picoLabel: 'campanha NPS',
  metas: { NPS: 75, CSAT: 4.5, CES: 2.5 } as Record<string, number>,
}
export const evolucaoMetricas = ['NPS', 'CSAT', 'CES'] as const
export type EvolucaoMetrica = (typeof evolucaoMetricas)[number]

// ── 4) Tabela "Correlação de experiência" (comparativo) ──────────────────────
export type CorrelQualLinha = {
  canal: string
  csat: number
  fcr: number
  reabertura: number
  nps: number
  gargalo: string
  status: QualidadeStatus
}

export const correlacao: CorrelQualLinha[] = [
  { canal: 'Telefone', csat: 4.2, fcr: 74, reabertura: 12, nps: 64, gargalo: 'Maior esforço (CES 3,1) e reabertura · URA + espera', status: 'Alto' },
  { canal: 'App', csat: 4.5, fcr: 82, reabertura: 8, nps: 70, gargalo: 'Reabertura por informação divergente entre canais', status: 'Médio' },
  { canal: 'Chat/WhatsApp', csat: 4.7, fcr: 85, reabertura: 6, nps: 76, gargalo: 'Sem gargalo · melhor relação esforço/resolução', status: 'OK' },
  { canal: 'Balcão', csat: 4.8, fcr: 90, reabertura: 4, nps: 81, gargalo: 'Sem gargalo · referência de experiência', status: 'OK' },
]

export const comoInterpretar =
  'CSAT mede a satisfação com o contato; CES o esforço para resolver (menor é melhor); NPS a lealdade. Quando CSAT está alto mas NPS cai, o problema é resolução (gap/reabertura), não atendimento. Reabertura alta + FCR baixo no mesmo canal indica que o caso não é resolvido de fato no 1º contato.'

export const canalReferencia = { nome: 'Balcão', nps: 81 }
