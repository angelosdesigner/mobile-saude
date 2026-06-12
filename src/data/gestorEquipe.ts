// Fixtures da aba "Equipe" — Figma 7901:112097.

export type EquipeTone = 'success' | 'danger'
export interface EquipeMetric {
  label: string
  value: string
  sub: string
  tone: EquipeTone
}

export const equipeMetrics: EquipeMetric[] = [
  { label: 'Em Atendimento', value: '14', sub: 'atendentes ativos', tone: 'success' },
  { label: 'Ocupados', value: '4', sub: 'tarefa interna', tone: 'danger' },
  { label: 'Progresso da Meta', value: '90%', sub: 'do volume previsto', tone: 'success' },
  { label: 'Alertas de TMA', value: '2', sub: 'conv. acima de 45 min', tone: 'danger' },
]

export const eficiencia = 89

// Rankings — ordenados do pior para o melhor (índice 0 = pior).
export interface RankingItem {
  nome: string
  sub?: string
  valor: number
  display: string
}
export interface Ranking {
  titulo: string
  subtitulo: string
  max: number
  itens: RankingItem[]
}

export const rankings: Ranking[] = [
  {
    titulo: 'Maior Ocupação',
    subtitulo: '% de uso de capacidade',
    max: 100,
    itens: [
      { nome: 'Fernanda Paz', sub: '34 atend. ativos', valor: 95, display: '95%' },
      { nome: 'Paula Reis', sub: '27 atend. ativos', valor: 78, display: '78%' },
      { nome: 'Carlos Lima', sub: '21 atend. ativos', valor: 72, display: '72%' },
      { nome: 'Ana Souza', sub: '18 atend. ativos', valor: 60, display: '60%' },
      { nome: 'João Melo', sub: '15 atend. ativos', valor: 58, display: '58%' },
    ],
  },
  {
    titulo: 'Maior Reabertura',
    subtitulo: 'casos retornam à fila',
    max: 8,
    itens: [
      { nome: 'Fernanda Paz', valor: 8, display: '8' },
      { nome: 'Paula Reis', valor: 5, display: '5' },
      { nome: 'Carlos Lima', valor: 4, display: '4' },
      { nome: 'Ana Souza', valor: 2, display: '2' },
      { nome: 'João Melo', valor: 1, display: '1' },
    ],
  },
  {
    titulo: 'Menor CSAT',
    subtitulo: 'satisfação do beneficiário',
    max: 5,
    itens: [
      { nome: 'Fernanda Paz', valor: 3.9, display: '3.9' },
      { nome: 'Paula Reis', valor: 4.3, display: '4.3' },
      { nome: 'Carlos Lima', valor: 4.5, display: '4.5' },
      { nome: 'Ana Souza', valor: 4.8, display: '4.8' },
      { nome: 'João Melo', valor: 4.9, display: '4.9' },
    ],
  },
]

// Ocupação × CSAT por atendente (dispersão): x = ocupação (%), y = CSAT (1-5),
// tamanho = reaberturas.
export interface EquipePonto {
  nome: string
  ocupacao: number
  csat: number
  reab: number
  tone: 'danger' | 'warning' | 'neutral' | 'success'
}
export const equipeScatter: EquipePonto[] = [
  { nome: 'João Melo', ocupacao: 58, csat: 4.9, reab: 1, tone: 'success' },
  { nome: 'Ana Souza', ocupacao: 60, csat: 4.8, reab: 2, tone: 'success' },
  { nome: 'Carlos Lima', ocupacao: 72, csat: 4.5, reab: 4, tone: 'neutral' },
  { nome: 'Paula Reis', ocupacao: 78, csat: 4.3, reab: 5, tone: 'warning' },
  { nome: 'Fernanda Paz', ocupacao: 95, csat: 3.9, reab: 8, tone: 'danger' },
]

export const bannerEquipe =
  'Fernanda Paz está na zona crítica (sobrecarga + baixa satisfação). Quanto maior a ocupação, menor o CSAT e maior a reabertura.'
