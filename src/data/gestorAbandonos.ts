// Fixtures da aba "Abandonos e desistência" — Figma 7900:111365.
// Abandono = evento/estado ocorrido em uma etapa da jornada (não uma fila).
// As 3 etapas onde o abandono pode ocorrer:
//   · Automatizado — beneficiário desiste durante o atendimento automatizado (BOT/URA)
//   · Em espera    — desiste enquanto aguarda na fila por atendimento humano
//   · No humano    — desiste durante o atendimento humano ativo
import type { IndicadorGeral } from '@/data/gestorIndicadoresGerais'

// Indicadores gerais (4 cards de topo). Total 23 (= porCanal.total).
// Convenção de cor: automatizado=primary, em espera=warning, taxa=warning.
export const indicadoresGerais: IndicadorGeral[] = [
  {
    label: 'Abandonos',
    value: 100,
    display: '23',
    delta: '↑ 2 hoje',
    deltaTone: 'danger',
    meta: 'desistências no período',
    tone: 'danger',
    // Abre a tela analítica de detalhe (não há "lista de todos os abandonados"
    // sem recorte — o detalhe é o ponto de entrada correto para o total).
    target: { kind: 'rota', to: '/gestor/abandonos-detalhe' },
  },
  {
    label: 'No automatizado',
    value: 26,
    display: '6',
    meta: '26% dos abandonos',
    tone: 'primary',
    target: { kind: 'ocorrencias', query: { stage: 'automatizado' } },
  },
  {
    label: 'Em espera',
    value: 74,
    display: '17',
    meta: '74% · desistiram na fila',
    tone: 'warning',
    target: { kind: 'ocorrencias', query: { stage: 'fila' } },
  },
  {
    label: 'Taxa de abandono',
    value: 14.6,
    display: '14,6%',
    delta: '↑ 1,1% hoje',
    deltaTone: 'danger',
    meta: 'Meta: < 10%',
    tone: 'warning',
    target: { kind: 'indicador', ind: 'abandono' },
  },
]

// ── Ponto de abandono por assunto ─────────────────────────────────────────────
// Onde o beneficiário abandonou a jornada — agrupado por assunto (não por fila).
// Fonte única: reutilizada pela aba e pela tela de detalhe. Nomes de assunto
// canônicos da taxonomia para o drill-down casar com a lista de Ocorrências.
// Total: 23 abandonos (= porCanal.total).
export type AbandonoStatus = 'Crítico' | 'Alto' | 'Médio' | 'OK'

// Etapa onde o abandono predomina para um dado assunto:
//   'Automatizado' = desiste durante o fluxo automatizado
//   'Em espera'    = desiste enquanto aguarda na fila
//   'Misto'        = distribuído entre etapas sem dominância clara
export type EtapaAbandono = 'Automatizado' | 'Em espera' | 'Misto'

export type FilaAbandonoLinha = {
  fila: string
  abandonos: number
  bot: number    // % de abandono no atendimento automatizado
  humana: number // % de abandono enquanto em espera na fila
  origem: EtapaAbandono // etapa onde o abandono é predominante
  status: AbandonoStatus
}

export const filasAbandono: FilaAbandonoLinha[] = [
  { fila: 'Reembolso',              abandonos: 8, bot: 15, humana:  2, origem: 'Automatizado', status: 'Crítico' },
  { fila: 'Financeiro',             abandonos: 6, bot: 10, humana:  4, origem: 'Automatizado', status: 'Crítico' },
  { fila: 'Dúvidas Administrativas',abandonos: 4, bot:  2, humana: 12, origem: 'Em espera',    status: 'Alto'    },
  { fila: 'Negativas/Exames',       abandonos: 2, bot:  4, humana:  3, origem: 'Misto',        status: 'Médio'   },
  { fila: 'Autorização',            abandonos: 2, bot:  2, humana:  2, origem: 'Misto',        status: 'OK'      },
  { fila: 'Ouvidoria/Reanálise',    abandonos: 1, bot:  3, humana:  3, origem: 'Misto',        status: 'OK'      },
]

// Cor por canal vem da taxonomia (canalCor) — não hardcoded aqui.
export const porCanal = {
  total: 23,
  taxa: '14,6%',
  itens: [
    { name: 'Chat/WhatsApp',     pct: '8.2%', value: 15 },
    { name: 'Telefone/Voz',      pct: '4.1%', value:  6 },
    { name: 'Balcão/Presencial', pct: '2.3%', value:  2 },
  ],
}

// Etapas de abandono no atendimento automatizado (% por fluxo/assunto).
// Clicável na aba → /gestor/ocorrencias?stage=automatizado&fila=X
export const porFluxoBot = [
  { label: 'Reembolso → Envio de docs',                 value: 15 },
  { label: 'Financeiro → Validação financeira',         value: 11 },
  { label: 'Autorização → Envio de docs',               value:  7 },
  { label: 'Dúvidas Administrativas → Identificação',   value:  4 },
]

// Abandonos enquanto em espera na fila, por assunto (% de quem entra na fila e
// desiste antes do atendimento humano iniciar).
// Clicável na aba → /gestor/ocorrencias?stage=fila&fila=X
export const porFilaHumana = [
  { label: 'Reembolso',              value: 38 },
  { label: 'Financeiro',             value: 27 },
  { label: 'Autorização',            value: 20 },
  { label: 'Dúvidas Administrativas',value: 12 },
]

// Comparativo entre as duas etapas principais de abandono: automatizado vs em espera.
export const comparativo = {
  total: 23,
  automatizado: { pct: 26, casos: 6 },
  emEspera:     { pct: 74, casos: 17 },
  mult: '2,8× mais em espera que no automatizado',
  tmeAutomatizado: '06:35',
  tmeEmEspera:     '02:00',
  insight: 'O fluxo do automatizado está complexo ou com erro na etapa de documentos',
}

// Dispersão por assunto: x = % abandono no automatizado, y = % em espera na
// fila, tamanho = volume do assunto. Clicável → fila de ocorrências.
export interface AbandonoPonto {
  nome: string
  volume: number
  bot: number    // % abandono no automatizado
  humana: number // % abandono em espera
  tone: 'danger' | 'warning' | 'success'
}

export const abandonoScatter: AbandonoPonto[] = [
  { nome: 'Dúvidas Adm.',      volume: 18, bot:  2, humana: 12, tone: 'warning' },
  { nome: 'Financeiro (Boleto)',volume: 38, bot: 10, humana:  4, tone: 'danger'  },
  { nome: 'Reembolso',         volume: 42, bot: 15, humana:  2, tone: 'danger'  },
  { nome: 'Ouvidoria/Reanálise',volume: 18, bot:  3, humana:  3, tone: 'success' },
  { nome: 'Negativas/Exames',  volume: 26, bot:  4, humana:  3, tone: 'success' },
  { nome: 'Autorizações',      volume: 27, bot:  2, humana:  2, tone: 'success' },
]

export const bannerAbandono =
  'Reembolso e Financeiro abandonam no automatizado (envio de docs) — fluxo complexo ou com erro. Dúvidas Adm. abandona em espera — dimensionamento de workforce.'
