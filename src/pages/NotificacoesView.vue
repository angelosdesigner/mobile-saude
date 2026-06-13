<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import type { FilterChip } from '@/components/ui/filterChips'
import NotificacaoItem from '@/components/notificacoes/NotificacaoItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useNotificacoesStore } from '@/stores/notificacoes'
import { useProfileStore } from '@/stores/profile'
import { useActionFeedback } from '@/composables/useActionFeedback'
import {
  categoryLabel,
  categoryTone,
  bucketLabel,
  bucketOrder,
  type NotifCategory,
} from '@/types/notificacoes'
import { setorOptions, atendenteOptions } from '@/data/notificacoes'

const store = useNotificacoesStore()
const { filteredList, categoryCounts, unreadCount, activeFilterCount, filters, loading, scoped } =
  storeToRefs(store)
const { markRead, clearFilters } = store
const { done } = useActionFeedback()

const { isGestor } = storeToRefs(useProfileStore())

onMounted(() => store.load())

function marcarTodas() {
  store.markAllRead()
  done('Todas as notificações marcadas como lidas')
}

// Chips de categoria (clicáveis, multi-seleção) — só as categorias presentes no
// escopo do papel atual. "Total" limpa a seleção de categorias.
const categoryChips = computed<FilterChip[]>(() => {
  const cats = Object.keys(categoryCounts.value) as NotifCategory[]
  return [
    { key: 'total', label: 'Total', value: scoped.value.length, tone: 'neutral', filterable: false },
    ...cats.map((c) => ({
      key: c,
      label: categoryLabel[c],
      value: categoryCounts.value[c],
      tone: categoryTone[c],
      filterable: true,
    })),
  ]
})

// Lista agrupada por período (esconde buckets vazios).
const grupos = computed(() =>
  bucketOrder
    .map((b) => ({ bucket: b, label: bucketLabel[b], itens: filteredList.value.filter((n) => n.bucket === b) }))
    .filter((g) => g.itens.length),
)
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho -->
    <div class="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-ms-text-primary">Notificações</h1>
        <p class="mt-1 text-sm text-ms-text-secondary">
          {{
            isGestor
              ? 'Alertas operacionais da central — por atendente, setor e categoria.'
              : 'Seus avisos de atendimento, prazos, sistema e comunicados.'
          }}
        </p>
      </div>
      <el-button :disabled="!unreadCount" @click="marcarTodas">
        Marcar todas como lidas
        <span v-if="unreadCount" class="ml-1 text-ms-text-secondary">({{ unreadCount }})</span>
      </el-button>
    </div>

    <!-- Chips de categoria -->
    <FilterChips v-model="filters.categorias" :chips="categoryChips" class="mb-3" />

    <!-- Filtros: apenas não lidas + (gestor) setor/atendente -->
    <div class="mb-5 flex flex-wrap items-center gap-3">
      <el-switch v-model="filters.unreadOnly" />
      <span class="text-sm text-ms-text-regular">Apenas não lidas</span>

      <template v-if="isGestor">
        <el-select
          v-model="filters.setores"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="1"
          placeholder="Setor"
          class="!w-48"
          clearable
        >
          <el-option v-for="s in setorOptions" :key="s" :label="s" :value="s" />
        </el-select>
        <el-select
          v-model="filters.atendentes"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="1"
          placeholder="Atendente"
          class="!w-48"
          clearable
        >
          <el-option v-for="a in atendenteOptions" :key="a" :label="a" :value="a" />
        </el-select>
      </template>

      <el-button v-if="activeFilterCount" text type="primary" @click="clearFilters">
        Limpar ({{ activeFilterCount }})
      </el-button>
    </div>

    <!-- Lista agrupada por período -->
    <div v-loading="loading" class="space-y-5">
      <section v-for="g in grupos" :key="g.bucket">
        <h2
          class="mb-2 text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary"
        >
          {{ g.label }}
        </h2>
        <div
          class="divide-y divide-ms-border-lighter overflow-hidden rounded-xl border border-ms-border-light bg-ms-surface"
        >
          <NotificacaoItem
            v-for="n in g.itens"
            :key="n.id"
            :notif="n"
            @click="markRead(n.id)"
          />
        </div>
      </section>

      <EmptyState
        v-if="!grupos.length && !loading"
        title="Nenhuma notificação"
        description="Não há notificações para os filtros aplicados."
      />
    </div>
  </DashboardLayout>
</template>
