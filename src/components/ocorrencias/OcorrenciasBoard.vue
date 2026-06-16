<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import KanbanBoard from '@/components/ui/KanbanBoard.vue'
import KanbanCard from '@/components/ui/KanbanCard.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'
import type { KanbanColumn, KanbanTone } from '@/components/ui/kanbanBoard'
import type { ColumnKey } from '@/types/ocorrencias'
import { columnLabel } from '@/types/ocorrencias'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

const router = useRouter()
const store = useOcorrenciasStore()
const { visibleColumns, filteredBoard } = storeToRefs(store)

const colTone: Record<ColumnKey, KanbanTone> = {
  NOVO: 'primary',
  'EM ATENDIMENTO': 'warning',
  'EM ESPERA': 'warning',
  ENCAMINHAMENTOS: 'teal',
  'CONCLUÍDOS NO DIA': 'success',
}

const columns = computed<KanbanColumn[]>(() =>
  visibleColumns.value.map((c) => ({ key: c.key, label: c.label, tone: colTone[c.key] })),
)

// Drag-and-drop: a mutação/persistência ficam no store (moveCard); aqui o toast.
async function onMove(id: number | string, toKey: string) {
  const changed = await store.moveCard(Number(id), toKey as ColumnKey)
  if (changed) ElMessage.success(`Ocorrência movida para "${columnLabel[toKey as ColumnKey]}"`)
}

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <KanbanBoard :columns="columns" :groups="filteredBoard" draggable @move="onMove">
    <template #card="{ item }">
      <KanbanCard :highlight="item.risk" clickable @click="router.push(`/ocorrencias/${item.id}/jornada`)">
        <!-- Protocolo + tempo -->
        <div class="flex items-start justify-between gap-2">
          <span class="text-2xs text-ms-text-secondary">{{ item.protocol }}</span>
          <el-tag
            :type="item.timeType"
            :effect="item.timeType === 'danger' ? 'dark' : 'light'"
            size="small"
            round
            >{{ item.time }}</el-tag
          >
        </div>

        <!-- Beneficiário -->
        <h4 class="mt-1.5 text-sm font-semibold leading-snug text-ms-text-primary">
          {{ item.beneficiary }}
        </h4>

        <!-- Corpo: tipo · assunto (linha visual compacta, como o board do gestor) -->
        <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
          <div>
            Tipo: <span class="text-ms-text-secondary">{{ item.tipo }}</span>
          </div>
          <div>
            Assunto: <span class="text-ms-text-secondary">{{ item.assunto }}</span>
          </div>
        </div>

        <!-- Status + risco -->
        <div class="mt-2 flex flex-wrap items-center gap-1.5">
          <el-tag :type="item.statusType" effect="light" size="small">{{ item.status }}</el-tag>
          <span
            v-if="item.risk"
            class="inline-flex items-center rounded border border-ms-danger px-1.5 py-0.5 text-2xs font-medium uppercase text-ms-danger"
            >Risco jurídico</span
          >
        </div>

        <!-- Rodapé: canal + responsável -->
        <template #footer>
          <ChannelTag :channel="item.channel" />
          <span v-if="item.assignee" class="flex items-center gap-1.5">
            <span
              class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ms-success text-[9px] font-semibold text-white"
              >{{ initials(item.assignee) }}</span
            >
            <span class="text-xs font-medium text-ms-success">{{ item.assignee }}</span>
          </span>
        </template>
      </KanbanCard>
    </template>
  </KanbanBoard>
</template>
