<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OperacionalBoard from '@/components/gestor/OperacionalBoard.vue'
import DataList from '@/components/ui/DataList.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import FilterChips from '@/components/ui/FilterChips.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import { FILAS_CANONICAS, CANAIS_CANONICOS, TIPOS_OCORRENCIA, tiposDaFila } from '@/data/gestorTaxonomia'
import { stages, type StageTone, type GestorCard } from '@/types/gestorOcorrencias'

const route = useRoute()
const router = useRouter()

const store = useGestorOcorrenciasStore()
const { statusPills, stats, loading, search, filtered, quickFilters, contextFilters, hasContext } =
  storeToRefs(store)

// "Concluídos hoje" é separado do estado atual: não compõe a visão "ativos
// agora" (histórico fica na lista). A barra de status renderiza os dois grupos.
const ativosPills = computed(() => statusPills.value.filter((p) => p.label !== 'CONCLUÍDOS HOJE'))
const concluidosPill = computed(() => statusPills.value.find((p) => p.label === 'CONCLUÍDOS HOJE'))

// Lê os filtros de contexto da URL (drill-down vindo do dashboard) e os aplica
// ao store. Reage a navegações posteriores para a mesma rota com outra query.
function syncContextFromRoute() {
  const q = route.query
  store.setContext({
    canal: typeof q.canal === 'string' ? q.canal : undefined,
    fila: typeof q.fila === 'string' ? q.fila : undefined,
    atendente: typeof q.atendente === 'string' ? q.atendente : undefined,
    stage: typeof q.stage === 'string' ? q.stage : undefined,
    tipo: typeof q.tipo === 'string' ? q.tipo : undefined,
  })
}

onMounted(() => {
  store.load()
  syncContextFromRoute()
})
watch(() => route.query, syncContextFromRoute)

// Remove um filtro de contexto (badge) — limpa store + query param da URL.
function removeContext(key: keyof typeof contextFilters.value) {
  store.setContext({ ...contextFilters.value, [key]: undefined })
  const { [key]: _omit, ...rest } = route.query
  router.replace({ query: rest })
}

// Limpa todos os filtros de contexto de uma vez.
function clearAllContext() {
  store.clearContext()
  const { canal: _c, fila: _f, atendente: _a, stage: _s, tipo: _t, ...rest } = route.query
  router.replace({ query: rest })
}

// Badges legíveis dos filtros de contexto ativos.
const contextBadges = computed(() => {
  const f = contextFilters.value
  const out: { key: keyof typeof f; label: string }[] = []
  // Cada filtro pode ter vários valores (multi) — junta com vírgula no badge.
  const join = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean).join(', ')
  if (f.canal) out.push({ key: 'canal', label: `Canal: ${join(f.canal)}` })
  if (f.fila) out.push({ key: 'fila', label: `Fila: ${join(f.fila)}` })
  if (f.atendente) out.push({ key: 'atendente', label: `Atendente: ${join(f.atendente)}` })
  if (f.stage)
    out.push({
      key: 'stage',
      label: `Etapa atual: ${f.stage
        .split(',')
        .map((s) => etapaLabel[s.trim() as GestorCard['stage']] ?? s.trim())
        .join(', ')}`,
    })
  if (f.tipo) out.push({ key: 'tipo', label: `Tipo: ${join(f.tipo)}` })
  return out
})

// ── Modo Lista (mesma fonte do Kanban; colunas próprias da visão do gestor) ──
// Ordem prioriza leitura rápida do estado: Protocolo · Contato · ETAPA ATUAL ·
// DETALHE DA ETAPA primeiro; depois canal/classificação/atendente/tempo.
const listColumns: DataListColumn[] = [
  { key: 'protocolo', label: 'Protocolo', width: 148, locked: true,
    sortBy: (r) => (r as unknown as GestorCard).protocolo ?? '' },
  { key: 'contato', label: 'Contato', minWidth: 240,
    sortBy: (r) => (r as unknown as GestorCard).beneficiary },
  { key: 'etapaAtual', label: 'Etapa atual', width: 168 },
  { key: 'detalheEtapa', label: 'Detalhe da etapa', minWidth: 210 },
  { key: 'canal', label: 'Canal', width: 160,
    sortBy: (r) => (r as unknown as GestorCard).channel },
  { key: 'tipo', label: 'Tipo de ocorrência', width: 178,
    sortBy: (r) => (r as unknown as GestorCard).tipo ?? '' },
  { key: 'atendente', label: 'Atendente', minWidth: 200,
    sortBy: (r) => (r as unknown as GestorCard).atendente ?? '' },
  { key: 'tempoAtual', label: 'Tempo atual', width: 120,
    sortBy: (r) => parseTempoSec(r as unknown as GestorCard) },
]

const stageMeta = Object.fromEntries(stages.map((s) => [s.key, s])) as Record<
  GestorCard['stage'],
  (typeof stages)[number]
>

// Rótulos da coluna "Etapa atual" (lista) — distintos dos headers do Kanban.
// "Atendimento automatizado" engloba Chatbot e URA (conceito da operação).
// "Em espera na fila" é mais descritivo que "Fila" no contexto de abandono.
const etapaLabel: Record<GestorCard['stage'], string> = {
  automatizado: 'Atendimento automatizado',
  fila: 'Em espera na fila',
  humano: 'Atendimento humano',
  concluido: 'Concluídos no dia',
}

// Etapa atual é status legítimo: mantém a cor, mas de forma contida
// (dot pequeno + texto colorido, sem fundo cheio).
const stageDotClass: Record<StageTone, string> = {
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
}
const stageTextClass: Record<StageTone, string> = {
  primary: 'text-ms-primary',
  warning: 'text-ms-warning',
  teal: 'text-ms-teal',
  success: 'text-ms-success',
}

// Detalhe da etapa por estágio.
function detalheEtapa(c: GestorCard): string {
  if (c.stage === 'automatizado') {
    const parts = [c.fluxo, c.no].filter(Boolean)
    return parts.length ? parts.join(' / ') : '—'
  }
  if (c.stage === 'fila') return `${c.filaTipo ?? '—'} · Posição ${c.posicao ?? '—'}º`
  if (c.stage === 'humano') return 'Em conversa'
  return `Resolvido às ${c.concluidoHora ?? '—'}`
}

// Tempo atual (campo depende do estágio).
function tempoAtual(c: GestorCard): string {
  if (c.stage === 'automatizado') return c.tempoBot ?? '—'
  if (c.stage === 'fila') return c.espera ?? '—'
  if (c.stage === 'humano') return c.tempoAtendimento ?? '—'
  return c.total ?? '—'
}

// Segundos para ordenação numérica da coluna Tempo atual.
function parseTempoSec(c: GestorCard): number {
  const t = tempoAtual(c)
  if (t === '—') return 0
  const ms = t.match(/(\d+)m(\d+)s/)
  if (ms) return parseInt(ms[1]) * 60 + parseInt(ms[2])
  const min = t.match(/(\d+)min/)
  if (min) return parseInt(min[1]) * 60
  const m = t.match(/(\d+)m/)
  if (m) return parseInt(m[1]) * 60
  return 0
}

const { comingSoon } = useActionFeedback()

// Visualizar/Editar abrem a tela de detalhe/jornada da ocorrência (compartilhada
// Gestor + Atendente). ctx=gestor garante a resolução pela store do gestor.
function onVisualizar(c: GestorCard): void {
  router.push(`/ocorrencias/${c.id}/jornada?ctx=gestor`)
}
function onEditar(c: GestorCard) {
  router.push(`/ocorrencias/${c.id}/jornada?ctx=gestor`)
}

const viewMode = computed({
  get: () => (route.query.view === 'lista' ? 'lista' : 'quadro'),
  set: (v) => router.replace({ query: { ...route.query, view: v } }),
})

const atendenteOptions = ['Ana Silva', 'Lucas Mendes', 'Ana Souza']

// Todos os filtros são MULTI-seleção. O store guarda cada um como lista separada
// por vírgula (1 ou vários valores); aqui convertemos de/para array p/ o
// el-select `multiple`. A URL é a fonte de verdade do drill-down (sincroniza
// store + query param). Match: OU dentro do filtro, E entre filtros distintos.
type CtxKey = 'canal' | 'fila' | 'atendente' | 'stage' | 'tipo'
function ctxModel(key: CtxKey) {
  return computed<string[]>({
    get: () => {
      const v = contextFilters.value[key]
      return v ? v.split(',') : []
    },
    set: (arr) => {
      const val = arr.length ? arr.join(',') : undefined
      store.setContext({ ...contextFilters.value, [key]: val })
      const next = { ...route.query }
      if (val) next[key] = val
      else delete next[key]
      router.replace({ query: next })
    },
  })
}
const ctxModels: Record<CtxKey, ReturnType<typeof ctxModel>> = {
  canal: ctxModel('canal'),
  fila: ctxModel('fila'),
  atendente: ctxModel('atendente'),
  stage: ctxModel('stage'),
  tipo: ctxModel('tipo'),
}

// Tipos disponíveis em cascata: selecionar uma fila restringe as opções de tipo
// aos tipos pertencentes àquela fila (vínculo fila ↔ tipo da taxonomia).
// Sem fila selecionada, todos os tipos ficam disponíveis.
const tipoOptions = computed(() => {
  const filasSelecionadas = ctxModels.fila.value
  if (!filasSelecionadas.length) return [...TIPOS_OCORRENCIA]
  const tipos = new Set(filasSelecionadas.flatMap((f) => tiposDaFila(f)))
  return tipos.size > 0 ? [...tipos] : [...TIPOS_OCORRENCIA]
})

// Filtros atrelados ao contexto (store + URL). Tipo cascateia com Fila.
const filterDefs = computed(() => [
  { label: 'Fila', ctxKey: 'fila' as const, options: [...FILAS_CANONICAS] },
  { label: 'Tipo de ocorrência', ctxKey: 'tipo' as const, options: tipoOptions.value },
  { label: 'Canal', ctxKey: 'canal' as const, options: [...CANAIS_CANONICOS] },
])

const pillDot: Record<StageTone | 'info', string> = {
  primary: 'bg-ms-primary',
  info: 'bg-ms-text-secondary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
}

</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho: título + busca + modo de visualização -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-ms-text-primary">Ocorrências</h1>
        <el-input v-model="search" placeholder="Buscar ocorrência" class="!w-72" clearable>
          <template #prefix>
            <AppIcon name="search" class="h-4 w-4 text-ms-text-placeholder" />
          </template>
        </el-input>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-ms-text-secondary">Modo de visualização:</span>
        <el-radio-group v-model="viewMode">
          <el-radio-button value="quadro">Quadro</el-radio-button>
          <el-radio-button value="lista">Lista</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Barra de status: estado atual ("ativos agora") + concluídos do dia
         (separado, histórico fica na lista) -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <div
        v-for="p in ativosPills"
        :key="p.label"
        class="flex items-center gap-2 rounded-lg border border-ms-border-light bg-ms-surface px-3 py-2"
      >
        <span class="h-2.5 w-2.5 rounded-full" :class="pillDot[p.tone]" />
        <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">{{
          p.label
        }}</span>
        <span class="text-base font-bold text-ms-text-primary">{{ p.value }}</span>
      </div>
      <!-- Concluídos hoje — fora do "estado atual" (não é "agora") -->
      <div
        v-if="concluidosPill"
        class="ml-auto flex items-center gap-2 rounded-lg border border-dashed border-ms-border bg-ms-fill-light px-3 py-2"
      >
        <span class="h-2.5 w-2.5 rounded-full" :class="pillDot[concluidosPill.tone]" />
        <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">{{
          concluidosPill.label
        }}</span>
        <span class="text-base font-bold text-ms-text-primary">{{ concluidosPill.value }}</span>
        <span class="text-2xs text-ms-text-placeholder">· histórico na lista</span>
      </div>
    </div>

    <!-- Linha de métricas (chips clicáveis, multi-seleção como filtros rápidos) -->
    <div class="mb-4">
      <FilterChips v-model="quickFilters" :chips="stats" />
    </div>

    <!-- Contexto de drill-down (vindo do dashboard) -->
    <div v-if="hasContext" class="mb-4 flex flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-ms-text-secondary">Filtrado por:</span>
      <el-tag
        v-for="b in contextBadges"
        :key="b.key"
        closable
        type="primary"
        size="small"
        @close="removeContext(b.key)"
        >{{ b.label }}</el-tag
      >
      <el-button text type="primary" size="small" @click="clearAllContext">Limpar filtros</el-button>
    </div>

    <!-- Filtros -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <!-- Todos os filtros atrelados ao contexto (store + URL). -->
      <el-select
        v-for="f in filterDefs"
        :key="f.label"
        v-model="ctxModels[f.ctxKey].value"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :placeholder="f.label"
        class="!w-44"
        clearable
      >
        <el-option v-for="o in f.options" :key="o" :label="o" :value="o" />
      </el-select>
      <!-- Filtro por Etapa (estágio do atendimento) -->
      <el-select
        v-model="ctxModels.stage.value"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="Etapa"
        class="!w-44"
        clearable
      >
        <el-option v-for="s in stages" :key="s.key" :label="etapaLabel[s.key]" :value="s.key" />
      </el-select>
      <!-- Atendente (multi-seleção) -->
      <el-select
        v-model="ctxModels.atendente.value"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="Atendente"
        class="!w-52"
        clearable
      >
        <el-option v-for="o in atendenteOptions" :key="o" :label="o" :value="o" />
      </el-select>
      <div class="ml-auto flex items-center gap-2">
        <!-- No modo lista a configuração de colunas fica no ▥ da própria tabela. -->
        <el-button v-if="viewMode === 'quadro'" @click="comingSoon('Configurar colunas')"
          >Configurar colunas</el-button
        >
      </div>
    </div>

    <!-- Conteúdo -->
    <div v-loading="loading">
      <OperacionalBoard v-if="viewMode === 'quadro'" />
      <DataList
        v-else
        :columns="listColumns"
        :rows="filtered"
        count-label="ocorrências"
        empty-text="Nenhuma ocorrência para os filtros aplicados"
        top-scrollbar
        @visualizar="onVisualizar"
        @editar="onEditar"
      >
        <template #footer-actions>
          <el-button text type="primary" size="small" @click="comingSoon('Criar ocorrência')">
            <AppIcon name="plus" class="mr-1 h-3.5 w-3.5" />Criar
          </el-button>
        </template>

        <!-- Protocolo -->
        <template #cell-protocolo="{ row }">
          <span class="font-mono text-xs tracking-wide text-ms-text-primary">
            {{ row.protocolo ?? '—' }}
          </span>
        </template>

        <!-- Contato: nome + tipo de perfil + CPF -->
        <template #cell-contato="{ row }">
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-medium leading-tight text-ms-text-primary">{{ row.beneficiary }}</span>
            <div class="flex items-center gap-1.5">
              <span
                v-if="row.perfilTipo"
                class="rounded border border-ms-border-light bg-ms-surface px-1 py-px text-2xs font-medium text-ms-text-secondary"
              >{{ row.perfilTipo }}</span>
              <span class="text-2xs text-ms-text-secondary">{{ row.cpf ?? '—' }}</span>
            </div>
          </div>
        </template>

        <!-- Atendente: nome + CPF + equipe -->
        <template #cell-atendente="{ row }">
          <div v-if="row.atendente" class="flex flex-col gap-0.5">
            <span class="text-sm font-medium leading-tight text-ms-text-primary">{{ row.atendente }}</span>
            <span class="text-2xs text-ms-text-secondary">
              {{ row.atendenteCpf ?? '' }}
              <template v-if="row.atendenteCpf && row.atendenteEquipe"> · </template>
              {{ row.atendenteEquipe ?? '' }}
            </span>
          </div>
          <span v-else class="text-ms-text-placeholder">—</span>
        </template>

        <!-- Canal -->
        <template #cell-canal="{ row }">
          <ChannelTag :channel="row.channel" />
        </template>

        <!-- Tipo de ocorrência -->
        <template #cell-tipo="{ row }">
          <div class="flex flex-col gap-0.5">
            <span class="text-xs font-medium text-ms-text-primary">{{ row.tipo ?? '—' }}</span>
            <span v-if="row.assunto" class="text-2xs text-ms-text-secondary">{{ row.assunto }}</span>
          </div>
        </template>

        <!-- Etapa atual (status legítimo: dot + texto colorido, sem fundo cheio) -->
        <template #cell-etapaAtual="{ row }">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium"
            :class="stageTextClass[stageMeta[row.stage].tone]"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full"
              :class="stageDotClass[stageMeta[row.stage].tone]" />{{ etapaLabel[row.stage] }}</span>
        </template>

        <!-- Detalhe da etapa — posição na fila como tag do DS (BaseBadge, tom
             âmbar): compacta e consistente com os demais rótulos da lista. -->
        <template #cell-detalheEtapa="{ row }">
          <span v-if="row.stage === 'fila'" class="flex items-center gap-2 text-xs">
            <BaseBadge tone="warning" :label="`${row.posicao ?? '—'}º na fila`" />
            <span class="text-ms-text-secondary">{{ row.filaTipo ?? '—' }}</span>
          </span>
          <span v-else class="text-xs text-ms-text-regular">{{ detalheEtapa(row) }}</span>
        </template>

        <!-- Tempo atual -->
        <template #cell-tempoAtual="{ row }">
          <span class="text-xs font-medium text-ms-text-primary">{{ tempoAtual(row) }}</span>
        </template>

        <!-- Accordion: SOMENTE informações complementares (não repetir colunas) -->
        <template #expand="{ row }">
          <dl class="grid grid-cols-2 gap-x-8 gap-y-1 text-xs md:grid-cols-4">
            <template v-if="row.stage === 'automatizado'">
              <div>
                <dt class="text-ms-text-secondary">Sinalização</dt>
                <dd class="text-ms-text-primary">{{ row.flag ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Risco jurídico</dt>
                <dd :class="row.risco ? 'text-ms-danger' : 'text-ms-text-primary'">
                  {{ row.risco ? 'Sim' : 'Não' }}
                </dd>
              </div>
            </template>
            <template v-else-if="row.stage === 'fila'">
              <div>
                <dt class="text-ms-text-secondary">Origem</dt>
                <dd class="text-ms-text-primary">{{ row.pill?.label ?? '—' }}</dd>
              </div>
            </template>
            <template v-else-if="row.stage === 'humano'">
              <div>
                <dt class="text-ms-text-secondary">SLA</dt>
                <dd class="text-ms-text-primary">{{ row.sla ?? '—' }}</dd>
              </div>
            </template>
            <template v-else>
              <div>
                <dt class="text-ms-text-secondary">Avaliação</dt>
                <dd class="text-ms-text-primary">{{ row.estrelas != null ? `${row.estrelas} ★` : '—' }}</dd>
              </div>
            </template>
          </dl>
        </template>
      </DataList>
    </div>
  </DashboardLayout>
</template>
