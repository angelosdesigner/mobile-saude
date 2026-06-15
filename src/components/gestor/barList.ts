// Tipo do item do BarList (separado do .vue para ser importado pelos data files
// que alimentam o componente — ex.: rankings da aba Equipe).
export interface BarItem {
  label: string
  /** Valor numérico (a largura da barra é `value / max`). */
  value: number
  /** Texto à direita (ex.: "95% (34)", "8", "3.9"). Default: `${value}%`. */
  caption?: string
  /** Iniciais opcionais (quando não estiver em modo `rank`). */
  avatar?: string
  /**
   * Cor da barra explícita. Quando ausente, a cor é derivada do valor
   * (faixas <70% / 70-89% / ≥90%) — válido só para métricas em %.
   */
  tone?: 'success' | 'warning' | 'danger' | 'neutral'
}
