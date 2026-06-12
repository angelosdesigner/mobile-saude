<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ modelValue: boolean; name?: string }>(), {
  name: 'Juliana Silva',
})
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const initials = computed(() =>
  props.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase(),
)

function ligar() {
  emit('update:modelValue', false)
  ElMessage.success('Iniciando ligação...')
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="448"
    align-center
    :show-close="false"
    class="ligacao-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-ms-text-primary">Nova ligação</h3>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full bg-ms-fill-light text-ms-text-primary transition hover:bg-ms-border-lighter"
          aria-label="Fechar"
          @click="emit('update:modelValue', false)"
        >
          <AppIcon name="close" class="h-4 w-4" />
        </button>
      </div>
    </template>

    <div class="space-y-4">
      <div>
        <label class="mb-2 block font-medium text-ms-text-primary">Número de telefone</label>
        <input
          value="+55 61 9 9999-9999"
          class="w-full rounded-lg border border-ms-border bg-ms-fill-light px-4 py-2.5 text-ms-text-primary placeholder-ms-text-placeholder outline-none focus:border-ms-primary"
        />
      </div>

      <div class="flex flex-col items-center gap-2 rounded-xl bg-ms-fill-light py-6">
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7C6CF2] to-[#5B4BD6] text-2xl font-semibold text-white"
        >
          {{ initials }}
        </div>
        <div class="text-lg font-semibold text-ms-text-primary">{{ name }}</div>
        <div class="text-sm text-ms-text-secondary">31 anos • Beneficiária</div>
      </div>

      <button
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-ms-success py-3 font-semibold text-white transition hover:bg-[#5daf34]"
        @click="ligar"
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
          <path
            d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
          />
        </svg>
        Ligar
      </button>
    </div>
  </el-dialog>
</template>

<style>
/* Header e body herdam o fundo do dialog (que segue o tema via Element Plus). */
.ligacao-dialog .el-dialog__header,
.ligacao-dialog .el-dialog__body {
  background: transparent;
}
.ligacao-dialog .el-dialog__headerbtn {
  display: none;
}
</style>
