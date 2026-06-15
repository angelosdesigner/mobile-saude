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
