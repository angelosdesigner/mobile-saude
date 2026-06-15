// Fixtures do widget flutuante "Status atual das Equipes" (Figma 7881:6096 /
// painel 7778:471799). Dados alinhados com gestorEquipe.ts (14 em atendimento,
// 4 ocupados). Canais seguem a taxonomia única (Chat/WhatsApp unificado).

export type EquipeStatusTone = 'success' | 'primary' | 'danger'

// Resumo geral (cabeçalho + barra segmentada do widget fechado).
// Soma bate com equipePorEquipe: disp 5 · atend 14 · ocup 4 · total 23.
export const equipeStatusResumo = {
  totalAgentes: 23,
  atualizado: 'há 30s',
  disponiveis: 5,
  emAtendimento: 14,
  ocupadosPausa: 4,
}

// Linhas de status (dot + rótulo + valor) — ordem da barra segmentada.
export const equipeStatusLinhas: {
  label: string
  short: string
  value: number
  tone: EquipeStatusTone
}[] = [
  { label: 'Disponível', short: 'Disp.', value: equipeStatusResumo.disponiveis, tone: 'success' },
  { label: 'Em atendimento', short: 'Atend.', value: equipeStatusResumo.emAtendimento, tone: 'primary' },
  { label: 'Ocupado / Pausa', short: 'Ocup.', value: equipeStatusResumo.ocupadosPausa, tone: 'danger' },
]

// Breakdown por canal de atendimento (painel aberto).
export const equipePorCanal = [
  { canal: 'Chat / WhatsApp', atendentes: 10, pct: 43 },
  { canal: 'Telefone', atendentes: 9, pct: 39 },
  { canal: 'Balcão / Presencial', atendentes: 4, pct: 17 },
]

// Breakdown por equipe (painel aberto). Soma bate com o resumo:
// disp 5 · atend 14 · ocup 4 · total 23.
export const equipePorEquipe = [
  { equipe: 'Suporte N1', disponivel: 2, atendimento: 5, ocupado: 1 },
  { equipe: 'Suporte N2', disponivel: 1, atendimento: 4, ocupado: 1 },
  { equipe: 'Financeiro', disponivel: 1, atendimento: 3, ocupado: 1 },
  { equipe: 'Vendas', disponivel: 1, atendimento: 2, ocupado: 1 },
]
