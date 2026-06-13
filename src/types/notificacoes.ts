// Tipos da Central de Notificações (dropdown do topbar + tela cheia).
import type { ChipTone } from '@/components/ui/filterChips'

// Severidade visual (ícone/tint).
export type NotifType = 'warning' | 'info' | 'danger' | 'success'

// Categoria — eixo de filtro principal (chips), comum a atendente e gestor.
export type NotifCategory =
  | 'sla'
  | 'sistema'
  | 'politica'
  | 'equipe'
  | 'atendimento'
  | 'qualidade'

// Público-alvo: o gestor vê 'gestor' + 'todos'; o atendente vê 'atendente' + 'todos'.
export type NotifAudience = 'atendente' | 'gestor' | 'todos'

// Agrupamento temporal exibido na tela cheia.
export type NotifBucket = 'hoje' | 'ontem' | 'anteriores'

export interface Notificacao {
  id: number
  type: NotifType
  category: NotifCategory
  audience: NotifAudience
  title: string
  desc: string
  time: string // rótulo relativo: "10min atrás"
  bucket: NotifBucket
  unread: boolean
  atendente?: string // cenário do gestor: a quem se refere
  setor?: string // cenário do gestor: setor/fila
}

export const categoryLabel: Record<NotifCategory, string> = {
  sla: 'SLA e prazos',
  sistema: 'Sistema',
  politica: 'Políticas e comunicados',
  equipe: 'Equipe',
  atendimento: 'Atendimento',
  qualidade: 'Qualidade',
}

// Tom do chip por categoria (consistente com o componente FilterChips).
export const categoryTone: Record<NotifCategory, ChipTone> = {
  sla: 'warning',
  sistema: 'danger',
  politica: 'neutral',
  equipe: 'teal',
  atendimento: 'primary',
  qualidade: 'success',
}

export const bucketLabel: Record<NotifBucket, string> = {
  hoje: 'Hoje',
  ontem: 'Ontem',
  anteriores: 'Anteriores',
}

export const bucketOrder: NotifBucket[] = ['hoje', 'ontem', 'anteriores']
