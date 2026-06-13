<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import type { ColumnCfg } from '@/types/ocorrencias'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const store = useOcorrenciasStore()
const MAX = 8
const draft = ref<ColumnCfg[]>([])
const dragIdx = ref<number | null>(null)

watch(
  () => props.modelValue,
  (open) => {
    if (open) draft.value = store.columnConfig.map((c) => ({ ...c }))
  },
)

const selectedCount = computed(() => draft.value.filter((c) => c.visible).length)

// Drag-and-drop nativo para reordenar as colunas.
function onDrop(toIdx: number) {
  const from = dragIdx.value
  dragIdx.value = null
  if (from == null || from === toIdx) return
  const arr = draft.value
  const [moved] = arr.splice(from, 1)
  arr.splice(toIdx, 0, moved)
}

function salvar() {
  store.columnConfig = draft.value.map((c) => ({ ...c }))
  emit('update:modelValue', false)
  ElMessage.success('Configuração de colunas salva')
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="480"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div>
        <h3 class="text-xl font-bold text-ms-text-primary">Configurar colunas do quadro</h3>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Personalize as colunas visíveis no quadro de ocorrências. Arraste para alterar a ordem.
        </p>
      </div>
    </template>

    <p class="mb-3 text-sm text-ms-text-regular">
      Selecione <b>até {{ MAX }} colunas</b> para exibir
      <span class="text-ms-text-secondary">({{ selectedCount }}/{{ MAX }} selecionadas)</span>
    </p>

    <div
      v-for="(c, i) in draft"
      :key="c.key"
      draggable="true"
      class="mb-2 flex items-center gap-3 rounded-lg border px-3 py-3 transition"
      :class="[
        c.visible ? 'border-ms-primary bg-ms-primary/5' : 'border-ms-border-light',
        dragIdx === i ? 'opacity-40' : '',
      ]"
      @dragstart="dragIdx = i"
      @dragover.prevent
      @drop="onDrop(i)"
      @dragend="dragIdx = null"
    >
      <span class="cursor-grab text-ms-text-placeholder" title="Arrastar para reordenar">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.6" />
          <circle cx="15" cy="6" r="1.6" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <circle cx="9" cy="18" r="1.6" />
          <circle cx="15" cy="18" r="1.6" />
        </svg>
      </span>
      <el-checkbox v-model="c.visible" :disabled="!c.visible && selectedCount >= MAX" />
      <span :class="c.visible ? 'font-medium text-ms-primary' : 'text-ms-text-primary'">{{
        c.label
      }}</span>
    </div>

    <template #footer>
      <el-button text @click="emit('update:modelValue', false)">Cancelar</el-button>
      <el-button type="primary" @click="salvar">Salvar configuração</el-button>
    </template>
  </el-dialog>
</template>
