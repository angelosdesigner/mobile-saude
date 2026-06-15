import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGestorOcorrenciasStore } from './gestorOcorrencias'
import { normalizeFila, normalizeCanal } from '@/data/gestorTaxonomia'

describe('gestorTaxonomia · normalização', () => {
  it('normalizeFila colapsa sinônimos no nome canônico', () => {
    expect(normalizeFila('Reembolsos')).toBe('Reembolso')
    expect(normalizeFila('Reemb.')).toBe('Reembolso')
    expect(normalizeFila('Autorizações')).toBe('Autorização')
    expect(normalizeFila('Financeiro (Boleto)')).toBe('Financeiro')
    expect(normalizeFila('Dúvidas Adm.')).toBe('Dúvidas Administrativas')
    expect(normalizeFila('Dúvida contratual')).toBe('Dúvidas Administrativas')
  })

  it('normalizeFila preserva o original quando não há sinônimo', () => {
    expect(normalizeFila('Carência')).toBe('Carência')
  })

  it('normalizeCanal agrupa Chat e WhatsApp no mesmo grupo', () => {
    expect(normalizeCanal('WhatsApp')).toBe('Chat/WhatsApp')
    expect(normalizeCanal('Chat')).toBe('Chat/WhatsApp')
    expect(normalizeCanal('Chat/WhatsApp')).toBe('Chat/WhatsApp')
    expect(normalizeCanal('Telefone/Voz')).toBe('Telefone')
    expect(normalizeCanal('Balcão')).toBe('Balcão/Presencial')
  })
})

describe('useGestorOcorrenciasStore · filtros de contexto (drill-down)', () => {
  let store: ReturnType<typeof useGestorOcorrenciasStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = useGestorOcorrenciasStore()
    await store.load()
  })

  it('sem contexto, retorna todos os cards', () => {
    expect(store.hasContext).toBe(false)
    expect(store.filtered.length).toBe(store.cards.length)
  })

  it('filtra por estágio', () => {
    store.setContext({ stage: 'fila' })
    expect(store.filtered.length).toBeGreaterThan(0)
    expect(store.filtered.every((c) => c.stage === 'fila')).toBe(true)
  })

  it('filtra por fila casando filaTipo ou fluxo (normalizado)', () => {
    store.setContext({ fila: 'Reembolso' })
    expect(store.filtered.length).toBeGreaterThan(0)
    expect(
      store.filtered.every(
        (c) => normalizeFila(c.filaTipo ?? '') === 'Reembolso' || normalizeFila(c.fluxo ?? '') === 'Reembolso',
      ),
    ).toBe(true)
  })

  it('fila tolera sinônimos: "Dúvidas Adm." e "Dúvida contratual" dão o mesmo conjunto', () => {
    store.setContext({ fila: 'Dúvidas Administrativas' })
    const canonico = store.filtered.map((c) => c.id).sort()
    store.setContext({ fila: 'Dúvidas Adm.' })
    expect(store.filtered.map((c) => c.id).sort()).toEqual(canonico)
    // e casa o card cujo filaTipo é "Dúvida contratual"
    expect(store.filtered.some((c) => c.filaTipo === 'Dúvida contratual')).toBe(true)
  })

  it('filtra por canal agrupando Chat e WhatsApp', () => {
    store.setContext({ canal: 'Chat/WhatsApp' })
    expect(store.filtered.length).toBeGreaterThan(0)
    expect(store.filtered.every((c) => normalizeCanal(c.channel) === 'Chat/WhatsApp')).toBe(true)
    expect(store.filtered.every((c) => c.channel === 'WhatsApp')).toBe(true)
  })

  it('filtra por atendente (match exato)', () => {
    store.setContext({ atendente: 'Fernanda Paz' })
    expect(store.filtered.length).toBeGreaterThan(0)
    expect(store.filtered.every((c) => c.atendente === 'Fernanda Paz')).toBe(true)
  })

  it('combina dimensões em E lógico', () => {
    store.setContext({ stage: 'fila', canal: 'Chat/WhatsApp' })
    expect(
      store.filtered.every((c) => c.stage === 'fila' && normalizeCanal(c.channel) === 'Chat/WhatsApp'),
    ).toBe(true)
  })

  it('hasContext e clearContext', () => {
    store.setContext({ fila: 'Reembolso' })
    expect(store.hasContext).toBe(true)
    store.clearContext()
    expect(store.hasContext).toBe(false)
    expect(store.filtered.length).toBe(store.cards.length)
  })

  it('setContext ignora valores vazios', () => {
    store.setContext({ fila: '', canal: undefined })
    expect(store.hasContext).toBe(false)
  })
})
