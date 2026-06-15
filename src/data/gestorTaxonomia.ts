// Fonte única de taxonomia da visão do Gestor: nomes canônicos de canais/filas
// (com sinônimos) e a cor de cada informação. Antes, a mesma informação recebia
// cores diferentes entre abas e os nomes de fila divergiam (auditoria 2026-06-14).
import { chartColors as C } from '@/plugins/echarts'

// ── Canais ──────────────────────────────────────────────────────────────────
// Cor canônica por canal (padrão das abas Início/Atendimentos). Aceita as
// variações de grafia ("Telefone" / "Telefone/Voz", "Balcão" / "Balcão/Presencial").
const CANAL_CORES: Record<string, string> = {
  'chat/whatsapp': C.danger,
  whatsapp: C.danger,
  chat: C.danger,
  telefone: C.primary,
  'telefone/voz': C.primary,
  'balcão/presencial': C.warning,
  balcão: C.warning,
  presencial: C.warning,
  portal: C.teal,
  app: C.neutral,
}

/** Cor canônica de um canal (tolerante à grafia). Fallback: neutro. */
export function canalCor(nome: string): string {
  return CANAL_CORES[nome.trim().toLowerCase()] ?? C.neutral
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
// Insights de IA = roxo.
export const atendimentoCor = { bot: C.primary, humano: C.success }
export const IA_COR = C.purple

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
