import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOcorrenciasStore } from './ocorrencias'

describe('useOcorrenciasStore', () => {
  let store: ReturnType<typeof useOcorrenciasStore>

  beforeEach(async () => {
    // Pinia novo por teste → estado limpo, sem vazamento entre casos.
    setActivePinia(createPinia())
    store = useOcorrenciasStore()
    await store.load()
  })

  it('carrega as ocorrências via serviço e distribui por coluna', () => {
    expect(store.filteredList.length).toBe(6)
    expect(store.board['NOVO'].length).toBe(2)
    expect(store.loaded).toBe(true)
  })

  it('load() é idempotente (não recarrega sem force)', async () => {
    store.board['NOVO'].push({ ...store.board['NOVO'][0], id: 999 })
    await store.load()
    expect(store.board['NOVO'].some((o) => o.id === 999)).toBe(true)
  })

  it('passesFilter respeita prioridade', () => {
    store.filters.prioridade = ['Alta']
    expect(store.filteredList).toHaveLength(3)
    expect(store.filteredList.every((o) => o.prioridade === 'Alta')).toBe(true)
  })

  it('busca textual cobre assunto e tipo', () => {
    store.filters.assunto = 'reembolso'
    expect(store.filteredList).toHaveLength(1)
    expect(store.filteredList[0].id).toBe(1)
  })

  it('combina múltiplos filtros (E lógico)', () => {
    store.filters.prioridade = ['Alta']
    store.filters.sla = ['Vencido']
    expect(store.filteredList.every((o) => o.prioridade === 'Alta' && o.sla === 'Vencido')).toBe(
      true,
    )
  })

  it('activeFilterCount soma todas as dimensões ativas', () => {
    store.filters.prioridade = ['Alta', 'Média']
    store.filters.assunto = 'x'
    expect(store.activeFilterCount).toBe(3)
  })

  it('clearFilters zera tudo', () => {
    store.filters.prioridade = ['Alta']
    store.filters.assunto = 'x'
    store.clearFilters()
    expect(store.activeFilterCount).toBe(0)
    expect(store.filteredList).toHaveLength(6)
  })

  it('applyPreset substitui os filtros vigentes', () => {
    store.filters.tipoOcorrencia = ['Reclamação']
    store.applyPreset({ name: 'teste', apply: { prioridade: ['Baixa'] } })
    expect(store.filters.tipoOcorrencia).toEqual([])
    expect(store.filters.prioridade).toEqual(['Baixa'])
    expect(store.filteredList).toHaveLength(1)
  })

  it('moveCard move entre colunas e sinaliza mudança', async () => {
    const changed = await store.moveCard(1, 'EM ATENDIMENTO')
    expect(changed).toBe(true)
    expect(store.findById(1)?.column).toBe('EM ATENDIMENTO')
    expect(store.board['NOVO'].some((o) => o.id === 1)).toBe(false)
  })

  it('moveCard para a mesma coluna retorna false', async () => {
    const changed = await store.moveCard(1, 'NOVO')
    expect(changed).toBe(false)
    expect(store.board['NOVO'].some((o) => o.id === 1)).toBe(true)
  })

  it('moveCard com id inexistente retorna false', async () => {
    expect(await store.moveCard(12345, 'EM ESPERA')).toBe(false)
  })

  it('stats derivam do conjunto filtrado', () => {
    expect(store.stats.find((s) => s.label === 'Total')?.value).toBe(6)
    store.filters.prioridade = ['Alta']
    expect(store.stats.find((s) => s.label === 'Total')?.value).toBe(3)
  })

  it('filteredBoard agrupa por coluna respeitando filtros', () => {
    store.filters.status = ['NOVO']
    expect(store.filteredBoard['NOVO']).toHaveLength(2)
    expect(store.filteredBoard['EM ATENDIMENTO']).toHaveLength(0)
  })
})
