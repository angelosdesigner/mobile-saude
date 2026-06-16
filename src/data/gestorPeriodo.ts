// Escala por período para as telas de detalhe do gestor. Os dados mock guardam
// os valores de "Hoje"; ao trocar o período, métricas de VOLUME/contagem são
// multiplicadas por um fator (acumulado do período) e métricas de TAXA (%) ou
// TEMPO (min) permanecem ~estáveis (são médias — não somam ao longo do período).
//
// Fatores aproximados e determinísticos (não são múltiplos exatos: fins de
// semana e sazonalidade reduzem o acumulado).

export const fatorPeriodo: Record<string, number> = {
  'Tempo real': 0.06,
  Hoje: 1,
  '7d': 6.4,
  '7 dias': 6.4,
  '30d': 26,
  '30 dias': 26,
  Trimestre: 74,
}

/** Fator de volume/contagem para o período (1 quando desconhecido). */
export function escalaPeriodo(periodo: string): number {
  return fatorPeriodo[periodo] ?? 1
}

/** "3.654" → 3654 (pt-BR: ponto = milhar, vírgula = decimal). */
export function parseNumeroPt(valor: string | number): number {
  if (typeof valor === 'number') return valor
  return Number(String(valor).replace(/\./g, '').replace(',', '.')) || 0
}

/** 24847 → "24.847" (separador de milhar pt-BR). */
export function formatarMilhar(n: number): string {
  return Math.round(n).toLocaleString('pt-BR')
}

/** Escala um valor de volume (string pt-BR ou número) pelo fator do período. */
export function escalarVolume(valor: string | number, periodo: string): string {
  return formatarMilhar(parseNumeroPt(valor) * escalaPeriodo(periodo))
}
