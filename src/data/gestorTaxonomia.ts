// Fonte única de taxonomia da visão do Gestor: nomes canônicos de canais/filas
// (com sinônimos) e a cor de cada informação. Antes, a mesma informação recebia
// cores diferentes entre abas e os nomes de fila divergiam (auditoria 2026-06-14).
import { chartColors } from '@/plugins/echarts'

type Palette = typeof chartColors

// ── Canais ──────────────────────────────────────────────────────────────────
// Chave de cor canônica por canal (padrão das abas Início/Atendimentos). Aceita
// variações de grafia ("Telefone"/"Telefone/Voz", "Balcão"/"Balcão/Presencial").
// Guardamos a CHAVE (não o hex) p/ a cor poder vir de uma paleta theme-aware.
const CANAL_COR_KEY: Record<string, keyof Palette> = {
  'chat/whatsapp': 'danger',
  whatsapp: 'danger',
  chat: 'danger',
  telefone: 'primary',
  'telefone/voz': 'primary',
  'balcão/presencial': 'warning',
  balcão: 'warning',
  presencial: 'warning',
  portal: 'teal',
  app: 'neutral',
}

/**
 * Cor canônica de um canal (tolerante à grafia). Fallback: neutro.
 * `palette` permite passar a paleta reativa (useChartColors) p/ suavizar no dark;
 * sem ela, usa a paleta estática (claro).
 */
export function canalCor(nome: string, palette: Palette = chartColors): string {
  const key = CANAL_COR_KEY[nome.trim().toLowerCase()]
  return key ? palette[key] : palette.neutral
}

// Grupo canônico de canal (casa as várias grafias e o canal combinado
// "Chat/WhatsApp" com os valores `channel` dos cards: 'Chat'/'WhatsApp').
const CANAL_CANONICO: Record<string, string> = {
  'chat/whatsapp': 'Chat/WhatsApp',
  whatsapp: 'Chat/WhatsApp',
  chat: 'Chat/WhatsApp',
  telefone: 'Telefone',
  'telefone/voz': 'Telefone',
  'balcão/presencial': 'Balcão/Presencial',
  balcão: 'Balcão/Presencial',
  presencial: 'Balcão/Presencial',
  portal: 'Portal',
  app: 'App',
}

/** Grupo canônico de um canal (tolerante à grafia). Sem match: retorna o original. */
export function normalizeCanal(nome: string): string {
  const s = nome.trim()
  return CANAL_CANONICO[s.toLowerCase()] ?? s
}

/** Canais canônicos — usados em selects/filtros. */
export const CANAIS_CANONICOS = [
  'Chat/WhatsApp',
  'Telefone',
  'Balcão/Presencial',
  'Portal',
  'App',
] as const

// ── Atendimento: BOT vs Humano + IA ──────────────────────────────────────────
// Convenção de identidade (não severidade): BOT = azul, Humano = verde.
// Insights de IA = roxo. `palette` opcional p/ versão theme-aware (suave no dark).
export function atendimentoCor(palette: Palette = chartColors) {
  return { bot: palette.primary, humano: palette.success }
}
export const IA_COR = chartColors.purple

// ── Filas / fluxos ───────────────────────────────────────────────────────────
// Nome canônico por sinônimo. Usado para casar o drill-down (dashboard ↔ cards)
// independentemente da grafia.
const FILA_CANONICA: Record<string, string> = {
  reembolso: 'Reembolso',
  reembolsos: 'Reembolso',
  'reemb.': 'Reembolso',
  autorização: 'Autorização',
  autorizações: 'Autorização',
  financeiro: 'Financeiro',
  'financeiro (boleto)': 'Financeiro',
  'dúvidas adm.': 'Dúvidas Administrativas',
  'dúvidas administrativas': 'Dúvidas Administrativas',
  'dúvida contratual': 'Dúvidas Administrativas',
}

/** Nome canônico de uma fila (tolerante à grafia). Sem match: retorna o original. */
export function normalizeFila(nome: string): string {
  const s = nome.trim()
  return FILA_CANONICA[s.toLowerCase()] ?? s
}

/** Filas canônicas — usadas em selects/filtros. */
export const FILAS_CANONICAS = [
  'Reembolso',
  'Autorização',
  'Financeiro',
  'Dúvidas Administrativas',
] as const

// ── Tipo de ocorrência ────────────────────────────────────────────────────────
/** Tipos de ocorrência canônicos — usados na coluna e no filtro. */
export const TIPOS_OCORRENCIA = [
  'Reembolso',
  'Autorização',
  '2ª via de boleto',
  'Carência',
  'Dúvida contratual',
  'Financeiro',
] as const

// ── Prioridade ────────────────────────────────────────────────────────────────
/** Prioridades canônicas (estilo Jira) — usadas na coluna, no kanban e no filtro. */
export const PRIORIDADES = ['Alta', 'Média', 'Baixa'] as const

// ── Vínculo fila → tipos de ocorrência ────────────────────────────────────────
// Define explicitamente quais tipos de ocorrência pertencem a cada fila. Usado
// para: (1) cascata de filtro (selecionar fila → restringe opções de tipo);
// (2) casamento de cards em stage humano/concluido pelo passesContext, onde
// filaTipo e fluxo não existem — só tipo está disponível.
export const FILA_TIPOS_MAP: Record<string, readonly string[]> = {
  'Reembolso': ['Reembolso'],
  'Autorização': ['Autorização'],
  'Financeiro': ['Financeiro', '2ª via de boleto'],
  'Dúvidas Administrativas': ['Dúvida contratual', 'Carência'],
}

/** Mapa inverso: tipo de ocorrência → fila canônica. */
export const TIPO_FILA_MAP: Record<string, string> = Object.fromEntries(
  (Object.entries(FILA_TIPOS_MAP) as [string, readonly string[]][]).flatMap(([fila, tipos]) =>
    tipos.map((t) => [t, fila]),
  ),
)

/** Fila canônica de um tipo de ocorrência. Sem match: retorna o próprio tipo. */
export function filaDoTipo(tipo: string): string {
  return TIPO_FILA_MAP[tipo] ?? tipo
}

/** Tipos de ocorrência pertencentes a uma fila canônica. */
export function tiposDaFila(fila: string): string[] {
  return [...(FILA_TIPOS_MAP[fila] ?? [])]
}
