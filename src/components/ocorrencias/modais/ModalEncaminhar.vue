<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const escolha = ref<'mesmo' | 'outro' | ''>('')
const obs = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      escolha.value = ''
      obs.value = ''
    }
  },
)

function confirmar() {
  emit('update:modelValue', false)
  ElMessage.success('Ocorrência encaminhada')
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="450"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div>
        <h3 class="text-xl font-bold text-ms-text-primary">Encaminhar atendimento</h3>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Escolha como deseja encaminhar este atendimento.
        </p>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-3">
      <button
        class="rounded-xl border p-4 text-left transition"
        :class="
          escolha === 'mesmo'
            ? 'border-ms-primary bg-ms-primary-light'
            : 'border-ms-border-light hover:border-[#C6E2FF]'
        "
        @click="escolha = 'mesmo'"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-ms-fill-light text-ms-text-regular"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 2v6h6" />
            <path d="M3 8a9 9 0 1 0 3-6.7L3 8" />
          </svg>
        </div>
        <div class="mt-3 font-bold text-ms-text-primary">Mesmo setor</div>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Transferir para outro atendente da mesma fila
        </p>
      </button>

      <button
        class="rounded-xl border p-4 text-left transition"
        :class="
          escolha === 'outro'
            ? 'border-ms-primary bg-ms-primary-light'
            : 'border-ms-border-light hover:border-[#C6E2FF]'
        "
        @click="escolha = 'outro'"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-ms-fill-light text-ms-text-regular"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4z" />
            <path d="M22 2 11 13" />
          </svg>
        </div>
        <div class="mt-3 font-bold text-ms-text-primary">Outro setor</div>
        <p class="mt-1 text-sm text-ms-text-secondary">Encaminhar para uma área diferente</p>
      </button>
    </div>

    <div class="mt-4">
      <label class="mb-1.5 block text-ms-text-primary"
        >Observação <span class="text-ms-text-secondary">(opcional)</span></label
      >
      <el-input v-model="obs" placeholder="Adicione uma observação" />
    </div>

    <template #footer>
      <el-button text @click="emit('update:modelValue', false)">Voltar</el-button>
      <el-button type="primary" :disabled="!escolha" @click="confirmar"
        >Confirmar encaminhamento</el-button
      >
    </template>
  </el-dialog>
</template>
