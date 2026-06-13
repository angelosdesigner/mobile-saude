import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificacoesStore } from './notificacoes'
import { useProfileStore } from './profile'

describe('useNotificacoesStore', () => {
  let store: ReturnType<typeof useNotificacoesStore>
  let profile: ReturnType<typeof useProfileStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = useNotificacoesStore()
    profile = useProfileStore()
    await store.load()
  })

  it('escopo do atendente exclui notificações de gestor', () => {
    profile.setRole('atendente')
    expect(store.scoped.every((n) => n.audience !== 'gestor')).toBe(true)
    expect(store.scoped.length).toBeGreaterThan(0)
  })

  it('escopo do gestor inclui itens por atendente/setor e exclui os do atendente', () => {
    profile.setRole('gestor')
    expect(store.scoped.every((n) => n.audience !== 'atendente')).toBe(true)
    expect(store.scoped.some((n) => n.setor || n.atendente)).toBe(true)
  })

  it('filtra por categoria', () => {
    profile.setRole('atendente')
    store.filters.categorias = ['sla']
    expect(store.filteredList.every((n) => n.category === 'sla')).toBe(true)
    expect(store.filteredList.length).toBeGreaterThan(0)
  })

  it('filtro "apenas não lidas" e markAllRead zeram o contador', () => {
    profile.setRole('atendente')
    expect(store.unreadCount).toBeGreaterThan(0)
    store.filters.unreadOnly = true
    expect(store.filteredList.every((n) => n.unread)).toBe(true)
    store.markAllRead()
    expect(store.unreadCount).toBe(0)
  })

  it('markAllRead do atendente não afeta as notificações do gestor', async () => {
    profile.setRole('atendente')
    store.markAllRead()
    profile.setRole('gestor')
    expect(store.unreadCount).toBeGreaterThan(0)
  })

  it('activeFilterCount soma as dimensões ativas', () => {
    store.filters.categorias = ['sla', 'sistema']
    store.filters.unreadOnly = true
    expect(store.activeFilterCount).toBe(3)
    store.clearFilters()
    expect(store.activeFilterCount).toBe(0)
  })
})
