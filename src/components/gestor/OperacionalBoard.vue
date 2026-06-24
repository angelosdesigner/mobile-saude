<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import KanbanBoard from '@/components/ui/KanbanBoard.vue'
import KanbanCard from '@/components/ui/KanbanCard.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'
import PrioridadeTag from '@/components/ui/PrioridadeTag.vue'
import type { KanbanColumn } from '@/components/ui/kanbanBoard'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import { stages, type GestorStage, type PillTone, type SlaState, type Prioridade } from '@/types/gestorOcorrencias'

const store = useGestorOcorrenciasStore()
const { board, headerByStage } = storeToRefs(store)
const router = useRouter()

// ── Colunas ──────────────────────────────────────────────────────────────────
const columns = computed<KanbanColumn[]>(() =>
  stages.map((s) => ({
    key: s.key,
    label: s.label,
    tone: s.tone,
    meta: headerByStage.value[s.key]?.meta ?? [],
  })),
)

// ── Estilos por tom ───────────────────────────────────────────────────────────
// Pill de origem da fila: rótulo informativo (não é status de SLA). Mantém o
// tom apenas no dot; texto neutro e sem fundo cheio para conter a cor.
const pillDot: Record<PillTone, string> = {
  primary: 'bg-ms-primary',
  info: 'bg-ms-text-placeholder',
  warning: 'bg-ms-warning',
  success: 'bg-ms-success',
}
const slaClass: Record<SlaState, string> = {
  Dentro: 'text-ms-success',
  Atenção: 'text-ms-warning',
  Limite: 'text-ms-warning',
  Estourou: 'text-ms-danger',
}
const slaDot: Record<SlaState, string> = {
  Dentro: 'bg-ms-success',
  Atenção: 'bg-ms-warning',
  Limite: 'bg-ms-warning',
  Estourou: 'bg-ms-danger',
}

// ── Filtros por coluna ────────────────────────────────────────────────────────
const showFilterAutomat = ref(false)
const showFilterFila = ref(false)
const showFilterHumano = ref(false)
const showFilterConcluido = ref(false)

const filterAutomat = ref({ beneficiario: '', fluxo: '', no: '' })
const filterFila = ref({ beneficiario: '', filaTipo: '', prioridade: '' as '' | Prioridade })
const filterHumano = ref({ beneficiario: '', atendente: '', sla: '' as '' | SlaState })
const filterConcluido = ref({ beneficiario: '', atendente: '' })

const hasFilterAutomat = computed(() =>
  !!(filterAutomat.value.beneficiario || filterAutomat.value.fluxo || filterAutomat.value.no),
)
const hasFilterFila = computed(() =>
  !!(filterFila.value.beneficiario || filterFila.value.filaTipo || filterFila.value.prioridade),
)
const hasFilterHumano = computed(() =>
  !!(filterHumano.value.beneficiario || filterHumano.value.atendente || filterHumano.value.sla),
)
const hasFilterConcluido = computed(
  () => !!(filterConcluido.value.beneficiario || filterConcluido.value.atendente),
)

function matchText(val: string | undefined, q: string) {
  return !q || (val ?? '').toLowerCase().includes(q.toLowerCase())
}

const filteredBoard = computed(() => ({
  automatizado: (board.value.automatizado ?? []).filter(
    (c) =>
      matchText(c.beneficiary, filterAutomat.value.beneficiario) &&
      matchText(c.fluxo, filterAutomat.value.fluxo) &&
      matchText(c.no, filterAutomat.value.no),
  ),
  fila: (board.value.fila ?? []).filter(
    (c) =>
      matchText(c.beneficiary, filterFila.value.beneficiario) &&
      matchText(c.filaTipo, filterFila.value.filaTipo) &&
      (!filterFila.value.prioridade || c.prioridade === filterFila.value.prioridade),
  ),
  humano: (board.value.humano ?? []).filter(
    (c) =>
      matchText(c.beneficiary, filterHumano.value.beneficiario) &&
      matchText(c.atendente, filterHumano.value.atendente) &&
      (!filterHumano.value.sla || c.sla === filterHumano.value.sla),
  ),
  concluido: (board.value.concluido ?? []).filter(
    (c) =>
      matchText(c.beneficiary, filterConcluido.value.beneficiario) &&
      matchText(c.atendente, filterConcluido.value.atendente),
  ),
}))

function clearFilter(col: string) {
  if (col === 'automatizado') filterAutomat.value = { beneficiario: '', fluxo: '', no: '' }
  else if (col === 'fila') filterFila.value = { beneficiario: '', filaTipo: '', prioridade: '' }
  else if (col === 'humano') filterHumano.value = { beneficiario: '', atendente: '', sla: '' }
  else if (col === 'concluido') filterConcluido.value = { beneficiario: '', atendente: '' }
}

// ── Drag-and-drop com modal de transferência ──────────────────────────────────
const stageLabel = (key: string) => stages.find((s) => s.key === key)?.label ?? key

interface TransferPending {
  id: number | string
  fromKey: GestorStage
  toKey: GestorStage
}

const transferPending = ref<TransferPending | null>(null)
const transferMotivo = ref('')
const transferLoading = ref(false)

const transferVisible = computed({
  get: () => transferPending.value !== null,
  set: (v) => { if (!v) cancelTransfer() },
})

function onCardMove(id: number | string, toKey: string) {
  const card = store.cards.find((c) => c.id === id)
  if (!card || card.stage === (toKey as GestorStage)) return
  transferPending.value = { id, fromKey: card.stage, toKey: toKey as GestorStage }
  transferMotivo.value = ''
}

function confirmTransfer() {
  if (!transferPending.value || !transferMotivo.value.trim()) return
  transferLoading.value = true
  store.moveCard(transferPending.value.id, transferPending.value.toKey)
  ElMessage.success(`Atendimento transferido para ${stageLabel(transferPending.value.toKey)}`)
  transferPending.value = null
  transferMotivo.value = ''
  transferLoading.value = false
}

function cancelTransfer() {
  transferPending.value = null
  transferMotivo.value = ''
}
</script>

<template>
  <KanbanBoard :columns="columns" :groups="filteredBoard" :draggable="true" @move="onCardMove">
    <!-- ── Botões de filtro por coluna ───────────────────────────────────── -->
    <template #column-action="{ col }">
      <!-- Automatizado -->
      <el-popover
        v-if="col.key === 'automatizado'"
        v-model:visible="showFilterAutomat"
        placement="bottom-end"
        :width="220"
        trigger="click"
        popper-class="!p-0"
      >
        <template #reference>
          <button
            class="relative flex h-6 w-6 items-center justify-center rounded-md text-ms-text-placeholder transition hover:bg-ms-fill-light hover:text-ms-text-secondary"
            :class="hasFilterAutomat ? '!text-ms-primary' : ''"
            title="Filtrar coluna"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span v-if="hasFilterAutomat" class="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ms-primary" />
          </button>
        </template>
        <div class="p-3 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-ms-text-primary">Filtrar</span>
            <button class="text-2xs text-ms-primary hover:underline" @click="clearFilter('automatizado')">Limpar</button>
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Beneficiário</label>
            <el-input v-model="filterAutomat.beneficiario" size="small" clearable placeholder="Nome..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Fluxo</label>
            <el-input v-model="filterAutomat.fluxo" size="small" clearable placeholder="Ex: Reembolso" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Nó atual</label>
            <el-input v-model="filterAutomat.no" size="small" clearable placeholder="Nome do nó" />
          </div>
        </div>
      </el-popover>

      <!-- Fila -->
      <el-popover
        v-else-if="col.key === 'fila'"
        v-model:visible="showFilterFila"
        placement="bottom-end"
        :width="220"
        trigger="click"
        popper-class="!p-0"
      >
        <template #reference>
          <button
            class="relative flex h-6 w-6 items-center justify-center rounded-md text-ms-text-placeholder transition hover:bg-ms-fill-light hover:text-ms-text-secondary"
            :class="hasFilterFila ? '!text-ms-primary' : ''"
            title="Filtrar coluna"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span v-if="hasFilterFila" class="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ms-primary" />
          </button>
        </template>
        <div class="p-3 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-ms-text-primary">Filtrar</span>
            <button class="text-2xs text-ms-primary hover:underline" @click="clearFilter('fila')">Limpar</button>
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Beneficiário</label>
            <el-input v-model="filterFila.beneficiario" size="small" clearable placeholder="Nome..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Tipo de fila</label>
            <el-input v-model="filterFila.filaTipo" size="small" clearable placeholder="Ex: Reembolso" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Prioridade</label>
            <el-select v-model="filterFila.prioridade" size="small" clearable placeholder="Todas">
              <el-option label="Alta" value="Alta" />
              <el-option label="Média" value="Média" />
              <el-option label="Baixa" value="Baixa" />
            </el-select>
          </div>
        </div>
      </el-popover>

      <!-- Humano -->
      <el-popover
        v-else-if="col.key === 'humano'"
        v-model:visible="showFilterHumano"
        placement="bottom-end"
        :width="220"
        trigger="click"
        popper-class="!p-0"
      >
        <template #reference>
          <button
            class="relative flex h-6 w-6 items-center justify-center rounded-md text-ms-text-placeholder transition hover:bg-ms-fill-light hover:text-ms-text-secondary"
            :class="hasFilterHumano ? '!text-ms-primary' : ''"
            title="Filtrar coluna"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span v-if="hasFilterHumano" class="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ms-primary" />
          </button>
        </template>
        <div class="p-3 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-ms-text-primary">Filtrar</span>
            <button class="text-2xs text-ms-primary hover:underline" @click="clearFilter('humano')">Limpar</button>
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Beneficiário</label>
            <el-input v-model="filterHumano.beneficiario" size="small" clearable placeholder="Nome..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Atendente</label>
            <el-input v-model="filterHumano.atendente" size="small" clearable placeholder="Nome..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">SLA</label>
            <el-select v-model="filterHumano.sla" size="small" clearable placeholder="Todos">
              <el-option label="Dentro" value="Dentro" />
              <el-option label="Atenção" value="Atenção" />
              <el-option label="Limite" value="Limite" />
              <el-option label="Estourou" value="Estourou" />
            </el-select>
          </div>
        </div>
      </el-popover>

      <!-- Concluído -->
      <el-popover
        v-else-if="col.key === 'concluido'"
        v-model:visible="showFilterConcluido"
        placement="bottom-end"
        :width="220"
        trigger="click"
        popper-class="!p-0"
      >
        <template #reference>
          <button
            class="relative flex h-6 w-6 items-center justify-center rounded-md text-ms-text-placeholder transition hover:bg-ms-fill-light hover:text-ms-text-secondary"
            :class="hasFilterConcluido ? '!text-ms-primary' : ''"
            title="Filtrar coluna"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span v-if="hasFilterConcluido" class="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ms-primary" />
          </button>
        </template>
        <div class="p-3 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-ms-text-primary">Filtrar</span>
            <button class="text-2xs text-ms-primary hover:underline" @click="clearFilter('concluido')">Limpar</button>
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Beneficiário</label>
            <el-input v-model="filterConcluido.beneficiario" size="small" clearable placeholder="Nome..." />
          </div>
          <div class="space-y-1.5">
            <label class="block text-2xs text-ms-text-secondary">Atendente</label>
            <el-input v-model="filterConcluido.atendente" size="small" clearable placeholder="Nome..." />
          </div>
        </div>
      </el-popover>
    </template>

    <!-- ── Cards ─────────────────────────────────────────────────────────── -->
    <template #card="{ item }">
      <KanbanCard
        :highlight="item.destaque || item.risco"
        clickable
        @click="router.push(`/ocorrencias/${item.id}/jornada?ctx=gestor`)"
      >

        <!-- ── Atendimento Automatizado ──────────────────────────────── -->
        <template v-if="item.stage === 'automatizado'">
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ item.beneficiary }}</span>
            <div class="flex shrink-0 items-center gap-1.5">
              <PrioridadeTag v-if="item.prioridade" :prioridade="item.prioridade" />
              <span v-if="item.tempoBot" class="text-2xs font-medium text-ms-text-secondary">{{ item.tempoBot }}</span>
            </div>
          </div>
          <div class="mt-2 space-y-1 text-xs text-ms-text-regular">
            <div>Fluxo: <span class="text-ms-text-secondary">{{ item.fluxo }}</span></div>
            <div v-if="item.no" class="inline-flex items-center gap-1 rounded border border-ms-border-light bg-ms-surface px-1.5 py-0.5 text-2xs text-ms-text-secondary">
              Nó: {{ item.no }}
            </div>
          </div>
          <div
            v-if="item.risco"
            class="mt-2 inline-flex items-center rounded border border-ms-danger px-1.5 py-0.5 text-2xs font-medium uppercase text-ms-danger"
          >
            Risco jurídico
          </div>
        </template>

        <!-- ── Fila ──────────────────────────────────────────────────── -->
        <template v-else-if="item.stage === 'fila'">
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ item.beneficiary }}</span>
            <PrioridadeTag v-if="item.prioridade" :prioridade="item.prioridade" class="shrink-0" />
          </div>
          <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
            <div>Fila: <span class="text-ms-text-secondary">{{ item.filaTipo }}</span></div>
            <div class="flex items-center gap-2">
              <span>Posição: <b class="text-ms-text-primary">{{ item.posicao }}º</b></span>
              <span class="text-ms-text-placeholder">·</span>
              <span class="text-ms-text-regular">{{ item.espera }}</span>
              <span
                v-if="item.pill"
                class="inline-flex items-center gap-1 text-2xs font-medium text-ms-text-secondary"
              >
                <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="pillDot[item.pill.tone]" />{{ item.pill.label }}</span>
            </div>
          </div>
        </template>

        <!-- ── Atendimento Humano ─────────────────────────────────────── -->
        <template v-else-if="item.stage === 'humano'">
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ item.beneficiary }}</span>
            <div class="flex shrink-0 items-center gap-1.5">
              <PrioridadeTag v-if="item.prioridade" :prioridade="item.prioridade" />
              <span
                v-if="item.sla"
                class="flex items-center gap-1 text-2xs font-medium"
                :class="slaClass[item.sla]"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="slaDot[item.sla]" />{{ item.sla }}
              </span>
            </div>
          </div>
          <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
            <div>Atendente: <span class="text-ms-text-secondary">{{ item.atendente }}</span></div>
            <div>Tempo: <span class="text-ms-text-secondary">{{ item.tempoAtendimento }}</span></div>
          </div>
        </template>

        <!-- ── Concluídos hoje ────────────────────────────────────────── -->
        <template v-else>
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ item.beneficiary }}</span>
            <div class="flex shrink-0 items-center gap-1.5">
              <PrioridadeTag v-if="item.prioridade" :prioridade="item.prioridade" />
              <span class="text-2xs text-ms-text-secondary">Concluído {{ item.concluidoHora }}</span>
            </div>
          </div>
          <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
            <div>Atendente: <span class="text-ms-text-secondary">{{ item.atendente }}</span></div>
            <div class="flex items-center gap-3">
              <span>Total: <span class="text-ms-text-secondary">{{ item.total }}</span></span>
              <span v-if="item.estrelas" class="flex items-center gap-0.5 text-ms-text-placeholder">
                <svg class="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span class="text-xs font-medium text-ms-text-primary">{{ item.estrelas }}</span>
              </span>
            </div>
          </div>
        </template>

        <!-- Rodapé: canal (todas as colunas) -->
        <template #footer>
          <ChannelTag :channel="item.channel" />
        </template>
      </KanbanCard>
    </template>
  </KanbanBoard>

  <!-- ── Modal de transferência ──────────────────────────────────────────── -->
  <el-dialog
    v-model="transferVisible"
    title="Transferir atendimento"
    width="420px"
    :close-on-click-modal="false"
    @closed="cancelTransfer"
  >
    <div v-if="transferPending" class="space-y-4">
      <p class="text-sm text-ms-text-regular">
        Movendo de
        <span class="font-semibold text-ms-text-primary">{{ stageLabel(transferPending.fromKey) }}</span>
        para
        <span class="font-semibold text-ms-text-primary">{{ stageLabel(transferPending.toKey) }}</span>.
      </p>
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-ms-text-primary">
          Motivo da transferência <span class="text-ms-danger">*</span>
        </label>
        <el-input
          v-model="transferMotivo"
          type="textarea"
          :rows="4"
          placeholder="Descreva o motivo da transferência deste atendimento..."
          maxlength="500"
          show-word-limit
          resize="none"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="cancelTransfer">Cancelar</el-button>
        <el-button
          type="primary"
          :disabled="!transferMotivo.trim()"
          :loading="transferLoading"
          @click="confirmTransfer"
        >
          Confirmar transferência
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
