<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import KanbanBoard from '@/components/ui/KanbanBoard.vue'
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

const channelIcon = (c: string) =>
  /whats/i.test(c) ? 'whatsapp' : /tele|fone/i.test(c) ? 'phone' : 'web'
const channelColor = (c: string) =>
  /whats/i.test(c) ? '#25D366' : 'var(--color-ms-text-secondary)'
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
      <el-card
        shadow="hover"
        body-class="!p-4"
        class="!border-ms-border-light"
        @click="router.push(`/ocorrencias/${item.id}`)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs text-ms-text-secondary">
            <AppIcon name="chevron-down" class="h-3.5 w-3.5" />
            {{ item.protocol }}
          </div>
          <el-tag
            :type="item.timeType"
            :effect="item.timeType === 'danger' ? 'dark' : 'light'"
            size="small"
            round
            >{{ item.time }}</el-tag
          >
        </div>

        <h4 class="mt-2 text-sm font-semibold leading-snug text-ms-text-primary">
          {{ item.beneficiary }}
        </h4>

        <el-tag v-if="item.risk" type="danger" effect="plain" size="small" class="mt-2 !uppercase">
          Risco Jurídico Configurado
        </el-tag>

        <div class="mt-3 space-y-2">
          <div>
            <div class="text-[11px] text-ms-text-secondary">Tipo de ocorrência</div>
            <div class="text-xs text-ms-text-regular">{{ item.tipo }}</div>
          </div>
          <div>
            <div class="text-[11px] text-ms-text-secondary">Assunto</div>
            <div class="text-xs text-ms-text-regular">{{ item.assunto }}</div>
          </div>
        </div>

        <div class="mt-3">
          <el-tag :type="item.statusType" effect="light" size="small">{{ item.status }}</el-tag>
        </div>

        <div
          class="mt-3 flex items-center justify-between border-t border-ms-border-lighter pt-2.5"
        >
          <span
            class="flex items-center gap-1.5 text-xs"
            :style="{ color: channelColor(item.channel) }"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <template v-if="channelIcon(item.channel) === 'whatsapp'">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"
                />
              </template>
              <template v-else-if="channelIcon(item.channel) === 'phone'">
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
                />
              </template>
              <template v-else>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
              </template>
            </svg>
            <span class="text-ms-text-regular">{{ item.channel }}</span>
          </span>
          <span v-if="item.assignee" class="flex items-center gap-1.5">
            <span
              class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ms-success text-[9px] font-semibold text-white"
              >{{ initials(item.assignee) }}</span
            >
            <span class="text-xs font-medium text-ms-success">{{ item.assignee }}</span>
          </span>
        </div>
      </el-card>
    </template>
  </KanbanBoard>
</template>
