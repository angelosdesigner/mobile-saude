// Fixtures da aba "Abandonos e desistência" — Figma 7900:111365.
import { abandonoFluxo } from '@/data/gestorTempoReal'

export { abandonoFluxo }

// Cor por canal vem da taxonomia (canalCor) — não hardcoded aqui.
export const porCanal = {
  total: 23,
  taxa: '14,6%',
  itens: [
    { name: 'Chat/WhatsApp', pct: '8.2%', value: 15 },
    { name: 'Telefone/Voz', pct: '4.1%', value: 6 },
    { name: 'Balcão/Presencial', pct: '2.3%', value: 2 },
  ],
}

// Abandono por fluxo no BOT (% por etapa).
export const porFluxoBot = [
  { label: 'Reembolso → Envio de docs', value: 15 },
  { label: 'Financeiro → Valid. financeira', value: 11 },
  { label: 'Autorização → Envio de docs', value: 7 },
  { label: 'Dúvidas Administrativas → Identificação', value: 4 },
]

// Abandono por fila humana (%).
export const porFilaHumana = [
  { label: 'Reembolso', value: 38 },
  { label: 'Financeiro', value: 27 },
  { label: 'Autorização', value: 20 },
  { label: 'Dúvidas Administrativas', value: 12 },
]

export const comparativo = {
  total: 17,
  bot: { pct: 24, casos: 4 },
  humano: { pct: 76, casos: 13 },
  mult: '3.25× mais que BOT',
  tmeBot: '06:35',
  tmeHumano: '02:00',
  insight: 'O fluxo está muito complexo ou com erro',
}

// Abandono BOT × Humano por fluxo (dispersão): x = % abandono no BOT,
// y = % abandono na fila humana, tamanho = volume do fluxo.
export interface AbandonoPonto {
  nome: string
  volume: number
  bot: number
  humana: number
  tone: 'danger' | 'warning' | 'success'
}

export const abandonoScatter: AbandonoPonto[] = [
  { nome: 'Dúvidas Adm.', volume: 18, bot: 2, humana: 12, tone: 'warning' },
  { nome: 'Financeiro (Boleto)', volume: 38, bot: 10, humana: 4, tone: 'danger' },
  { nome: 'Reembolso', volume: 42, bot: 15, humana: 2, tone: 'danger' },
  { nome: 'Ouvidoria/Reanálise', volume: 18, bot: 3, humana: 3, tone: 'success' },
  { nome: 'Negativas/Exames', volume: 26, bot: 4, humana: 3, tone: 'success' },
  { nome: 'Autorizações', volume: 27, bot: 2, humana: 2, tone: 'success' },
]

export const bannerAbandono =
  'Reembolso e Financeiro caem no quadrante "Problema no Robô" — cliente desiste no BOT, não na fila humana. Dúvidas Adm. isola-se em "Workforce".'
