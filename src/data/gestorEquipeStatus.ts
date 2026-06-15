// Fixtures do widget flutuante "Status atual das Equipes" (Figma 7881:6096 /
// painel 7778:471799). Visão global que o gestor consulta de qualquer tela.
// Canais seguem a taxonomia única (Chat/WhatsApp unificado).

export type EquipeStatusTone = 'success' | 'primary' | 'warning'

// Resumo geral (cabeçalho + barra segmentada do widget fechado).
export const equipeStatusResumo = {
  totalAgentes: 73,
  atualizado: 'há 30s',
  disponiveis: 12,
  emAtendimento: 37,
  ocupadosPausa: 24,
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
  { label: 'Ocupado / Pausa', short: 'Ocup.', value: equipeStatusResumo.ocupadosPausa, tone: 'warning' },
]

// Breakdown por canal de atendimento (painel aberto).
export const equipePorCanal = [
  { canal: 'Chat / WhatsApp', atendentes: 32, pct: 44 },
  { canal: 'Telefone', atendentes: 28, pct: 38 },
  { canal: 'Balcão / Presencial', atendentes: 13, pct: 18 },
]

// Breakdown por equipe (painel aberto). Soma bate com o resumo:
// disp 12 · atend 37 · ocup 24 · total 73.
export const equipePorEquipe = [
  { equipe: 'Suporte N1', disponivel: 4, atendimento: 10, ocupado: 6 },
  { equipe: 'Suporte N2', disponivel: 3, atendimento: 8, ocupado: 5 },
  { equipe: 'Financeiro', disponivel: 2, atendimento: 7, ocupado: 5 },
  { equipe: 'Vendas', disponivel: 2, atendimento: 8, ocupado: 4 },
  { equipe: 'Jurídico', disponivel: 1, atendimento: 4, ocupado: 4 },
]
