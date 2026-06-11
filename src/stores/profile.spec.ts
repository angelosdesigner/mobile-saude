import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from './profile'

describe('useProfileStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('inicia no perfil "ambos" com fila habilitada', () => {
    const store = useProfileStore()
    expect(store.profile).toBe('ambos')
    expect(store.hasQueue).toBe(true)
  })

  it('perfil "frio" não tem fila', () => {
    const store = useProfileStore()
    store.setProfile('frio')
    expect(store.hasQueue).toBe(false)
  })

  it('perfil "quente" tem fila', () => {
    const store = useProfileStore()
    store.setProfile('quente')
    expect(store.hasQueue).toBe(true)
  })
})
