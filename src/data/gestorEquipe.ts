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

// Rankings — ordenados do pior para o melhor (índice 0 = pior). Renderizados
// pelo BarList (mesmo componente da "Ocupação por atendente" da Início):
// número sem cor, badge neutro, rodapé Pior/Melhor.
import type { BarItem } from '@/components/gestor/barList'

export interface Ranking {
  titulo: string
  subtitulo: string
  max: number
  itens: BarItem[]
}

// Reabertura e CSAT não são métricas em %: a cor da barra vem da posição
// (pior → melhor), não do valor.
const tonePorPosicao: BarItem['tone'][] = ['danger', 'warning', 'neutral', 'neutral', 'success']

export const rankings: Ranking[] = [
  {
    titulo: 'Maior Ocupação',
    subtitulo: '% de uso de capacidade · clique para detalhar',
    max: 100,
    // Ocupação é %: a cor da barra é derivada do valor (mesma regra da Início).
    itens: [
      { label: 'Fernanda Paz', value: 95, caption: '95% (34)' },
      { label: 'Paula Reis', value: 78, caption: '78% (27)' },
      { label: 'Carlos Lima', value: 72, caption: '72% (21)' },
      { label: 'Ana Souza', value: 60, caption: '60% (18)' },
      { label: 'João Melo', value: 58, caption: '58% (15)' },
    ],
  },
  {
    titulo: 'Maior Reabertura',
    subtitulo: 'casos retornam à fila · clique para detalhar',
    max: 8,
    itens: [
      { label: 'Fernanda Paz', value: 8, caption: '8', tone: tonePorPosicao[0] },
      { label: 'Paula Reis', value: 5, caption: '5', tone: tonePorPosicao[1] },
      { label: 'Carlos Lima', value: 4, caption: '4', tone: tonePorPosicao[2] },
      { label: 'Ana Souza', value: 2, caption: '2', tone: tonePorPosicao[3] },
      { label: 'João Melo', value: 1, caption: '1', tone: tonePorPosicao[4] },
    ],
  },
  {
    titulo: 'Menor CSAT',
    subtitulo: 'satisfação do beneficiário · clique para detalhar',
    max: 5,
    itens: [
      { label: 'Fernanda Paz', value: 3.9, caption: '3.9', tone: tonePorPosicao[0] },
      { label: 'Paula Reis', value: 4.3, caption: '4.3', tone: tonePorPosicao[1] },
      { label: 'Carlos Lima', value: 4.5, caption: '4.5', tone: tonePorPosicao[2] },
      { label: 'Ana Souza', value: 4.8, caption: '4.8', tone: tonePorPosicao[3] },
      { label: 'João Melo', value: 4.9, caption: '4.9', tone: tonePorPosicao[4] },
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
