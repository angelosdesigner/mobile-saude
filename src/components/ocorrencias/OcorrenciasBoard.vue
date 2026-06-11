<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { ColumnKey } from '@/types/ocorrencias'
import { columnLabel } from '@/types/ocorrencias'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

const store = useOcorrenciasStore()
const { visibleColumns, filteredBoard } = storeToRefs(store)

// Drag-and-drop nativo (HTML5): arrasta cards entre colunas. A mutação de estado
// e a persistência ficam no store (moveCard); aqui só tratamos o gesto e o toast.
const dragId = ref<number | null>(null)
const dragOverCol = ref<ColumnKey | null>(null)

async function onDrop(toCol: ColumnKey) {
  const id = dragId.value
  dragOverCol.value = null
  dragId.value = null
  if (id == null) return
  const changed = await store.moveCard(id, toCol)
  if (changed) ElMessage.success(`Ocorrência movida para "${columnLabel[toCol]}"`)
}

function onDragEnd() {
  dragId.value = null
  dragOverCol.value = null
}

const colMeta: Record<ColumnKey, { icon: 'none' | 'clock' | 'share' | 'check'; badge: string }> = {
  NOVO: { icon: 'none', badge: '#1F2937' },
  'EM ATENDIMENTO': { icon: 'none', badge: '#E6A23C' },
  'EM ESPERA': { icon: 'clock', badge: '#E6A23C' },
  ENCAMINHAMENTOS: { icon: 'share', badge: '#E6A23C' },
  'CONCLUÍDOS NO DIA': { icon: 'check', badge: '#E6A23C' },
}

const channelIcon = (c: string) =>
  /whats/i.test(c) ? 'whatsapp' : /tele|fone/i.test(c) ? 'phone' : 'web'
const channelColor = (c: string) => (/whats/i.test(c) ? '#25D366' : '#909399')
const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <div v-drag-scroll class="flex gap-4 overflow-x-auto pb-2">
    <div v-for="col in visibleColumns" :key="col.key" class="flex w-72 shrink-0 flex-col">
      <!-- Cabeçalho da coluna -->
      <div class="mb-3 flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <svg
            class="h-4 w-4 text-ms-text-secondary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <template v-if="colMeta[col.key].icon === 'clock'">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </template>
            <template v-else-if="colMeta[col.key].icon === 'share'">
              <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
              <path d="M16 6l-4-4-4 4M12 2v13" />
            </template>
            <template v-else-if="colMeta[col.key].icon === 'check'">
              <path d="M20 6 9 17l-5-5" />
            </template>
          </svg>
          <span class="text-xs font-bold uppercase tracking-wide text-ms-text-regular">{{
            col.key
          }}</span>
          <span
            class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
            :style="{ backgroundColor: colMeta[col.key].badge }"
            >{{ filteredBoard[col.key].length }}</span
          >
        </div>
        <svg
          class="h-4 w-4 text-ms-text-placeholder"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" />
        </svg>
      </div>

      <!-- Lista de cards (drop target) -->
      <div
        class="flex min-h-[120px] flex-1 flex-col gap-3 rounded-lg border-2 border-dashed p-1 transition-colors"
        :class="
          dragOverCol === col.key
            ? 'border-ms-primary bg-ms-primary-light/60'
            : 'border-transparent'
        "
        @dragover.prevent="dragOverCol = col.key"
        @dragleave="dragOverCol = dragOverCol === col.key ? null : dragOverCol"
        @drop="onDrop(col.key)"
      >
        <el-card
          v-for="o in filteredBoard[col.key]"
          :key="o.id"
          shadow="hover"
          body-class="!p-4"
          draggable="true"
          class="cursor-grab !border-ms-border-light active:cursor-grabbing"
          :class="dragId === o.id ? 'opacity-40' : ''"
          @dragstart="dragId = o.id"
          @dragend="onDragEnd"
          @click="$router.push(`/ocorrencias/${o.id}`)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs text-ms-text-secondary">
              <svg
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              {{ o.protocol }}
            </div>
            <el-tag
              :type="o.timeType"
              :effect="o.timeType === 'danger' ? 'dark' : 'light'"
              size="small"
              round
              >{{ o.time }}</el-tag
            >
          </div>

          <h4 class="mt-2 text-sm font-semibold leading-snug text-ms-text-primary">
            {{ o.beneficiary }}
          </h4>

          <el-tag v-if="o.risk" type="danger" effect="plain" size="small" class="mt-2 !uppercase">
            Risco Jurídico Configurado
          </el-tag>

          <div class="mt-3 space-y-2">
            <div>
              <div class="text-[11px] text-ms-text-secondary">Tipo de ocorrência</div>
              <div class="text-xs text-ms-text-regular">{{ o.tipo }}</div>
            </div>
            <div>
              <div class="text-[11px] text-ms-text-secondary">Assunto</div>
              <div class="text-xs text-ms-text-regular">{{ o.assunto }}</div>
            </div>
          </div>

          <div class="mt-3">
            <el-tag :type="o.statusType" effect="light" size="small">{{ o.status }}</el-tag>
          </div>

          <div
            class="mt-3 flex items-center justify-between border-t border-ms-border-lighter pt-2.5"
          >
            <span
              class="flex items-center gap-1.5 text-xs"
              :style="{ color: channelColor(o.channel) }"
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
                <template v-if="channelIcon(o.channel) === 'whatsapp'">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"
                  />
                </template>
                <template v-else-if="channelIcon(o.channel) === 'phone'">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
                  />
                </template>
                <template v-else>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
                </template>
              </svg>
              <span class="text-ms-text-regular">{{ o.channel }}</span>
            </span>
            <span v-if="o.assignee" class="flex items-center gap-1.5">
              <span
                class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ms-success text-[9px] font-semibold text-white"
                >{{ initials(o.assignee) }}</span
              >
              <span class="text-xs font-medium text-ms-success">{{ o.assignee }}</span>
            </span>
          </div>
        </el-card>

        <!-- Estado vazio da coluna (após filtros ou sem itens). -->
        <p
          v-if="!filteredBoard[col.key].length"
          class="px-2 py-6 text-center text-xs text-ms-text-placeholder"
        >
          Nenhuma ocorrência
        </p>
      </div>
    </div>
  </div>
</template>
