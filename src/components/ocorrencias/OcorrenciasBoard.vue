<script setup lang="ts">
import { ref } from 'vue'
import { columns, type ColumnKey, type Ocorrencia } from '@/data/ocorrencias'
import { useOcorrencias, columnLabel } from '@/composables/useOcorrencias'

const { board, visibleColumns, passesFilter, visibleCount } = useOcorrencias()

// Drag-and-drop nativo (HTML5): arrasta cards entre colunas, atualizando o status.
const dragId = ref<number | null>(null)
const dragOverCol = ref<ColumnKey | null>(null)

function onDrop(toCol: ColumnKey) {
  const id = dragId.value
  dragOverCol.value = null
  dragId.value = null
  if (id == null) return
  let moved: Ocorrencia | undefined
  let fromCol: ColumnKey | undefined
  for (const k of columns) {
    const i = board[k].findIndex((x) => x.id === id)
    if (i >= 0) {
      fromCol = k
      moved = board[k].splice(i, 1)[0]
      break
    }
  }
  if (moved) {
    moved.column = toCol
    board[toCol].push(moved)
    if (fromCol !== toCol) ElMessage.success(`Ocorrência movida para "${columnLabel[toCol]}"`)
  }
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
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-2">
    <div v-for="col in visibleColumns" :key="col.key" class="flex w-72 shrink-0 flex-col">
      <!-- Cabeçalho da coluna -->
      <div class="mb-3 flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4 text-[#909399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="colMeta[col.key].icon === 'clock'"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></template>
            <template v-else-if="colMeta[col.key].icon === 'share'"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M16 6l-4-4-4 4M12 2v13" /></template>
            <template v-else-if="colMeta[col.key].icon === 'check'"><path d="M20 6 9 17l-5-5" /></template>
          </svg>
          <span class="text-xs font-bold uppercase tracking-wide text-[#606266]">{{ col.key }}</span>
          <span
            class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
            :style="{ backgroundColor: colMeta[col.key].badge }"
          >{{ visibleCount(col.key) }}</span>
        </div>
        <svg class="h-4 w-4 text-[#C0C4CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" /></svg>
      </div>

      <!-- Lista de cards (drop target) -->
      <div
        class="flex min-h-[120px] flex-1 flex-col gap-3 rounded-lg border-2 border-dashed p-1 transition-colors"
        :class="dragOverCol === col.key ? 'border-[#409EFF] bg-[#ECF5FF]/60' : 'border-transparent'"
        @dragover.prevent="dragOverCol = col.key"
        @dragleave="dragOverCol = dragOverCol === col.key ? null : dragOverCol"
        @drop="onDrop(col.key)"
      >
        <el-card
          v-for="o in board[col.key]"
          v-show="passesFilter(o)"
          :key="o.id"
          shadow="hover"
          body-class="!p-4"
          draggable="true"
          class="cursor-grab !border-[#EBEEF5] active:cursor-grabbing"
          :class="dragId === o.id ? 'opacity-40' : ''"
          @dragstart="dragId = o.id"
          @dragend="dragId = null; dragOverCol = null"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs text-[#909399]">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" /></svg>
              {{ o.protocol }}
            </div>
            <el-tag :type="o.timeType" :effect="o.timeType === 'danger' ? 'dark' : 'light'" size="small" round>{{ o.time }}</el-tag>
          </div>

          <h4 class="mt-2 text-sm font-semibold leading-snug text-[#303133]">{{ o.beneficiary }}</h4>

          <el-tag v-if="o.risk" type="danger" effect="plain" size="small" class="mt-2 !uppercase">
            Risco Jurídico Configurado
          </el-tag>

          <div class="mt-3 space-y-2">
            <div>
              <div class="text-[11px] text-[#909399]">Tipo de ocorrência</div>
              <div class="text-xs text-[#606266]">{{ o.tipo }}</div>
            </div>
            <div>
              <div class="text-[11px] text-[#909399]">Assunto</div>
              <div class="text-xs text-[#606266]">{{ o.assunto }}</div>
            </div>
          </div>

          <div class="mt-3">
            <el-tag :type="o.statusType" effect="light" size="small">{{ o.status }}</el-tag>
          </div>

          <div class="mt-3 flex items-center justify-between border-t border-[#F2F6FC] pt-2.5">
            <span class="flex items-center gap-1.5 text-xs" :style="{ color: channelColor(o.channel) }">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <template v-if="channelIcon(o.channel) === 'whatsapp'"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></template>
                <template v-else-if="channelIcon(o.channel) === 'phone'"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></template>
                <template v-else><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" /></template>
              </svg>
              <span class="text-[#606266]">{{ o.channel }}</span>
            </span>
            <span v-if="o.assignee" class="flex items-center gap-1.5">
              <span class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#67C23A] text-[9px] font-semibold text-white">{{ initials(o.assignee) }}</span>
              <span class="text-xs font-medium text-[#67C23A]">{{ o.assignee }}</span>
            </span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
