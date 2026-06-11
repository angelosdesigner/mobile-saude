<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue: boolean; name?: string }>(), {
  name: 'Juliana Silva',
})
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const tipo = ref<'video' | 'audio'>('video')
const initials = computed(() =>
  props.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase(),
)

watch(
  () => props.modelValue,
  (open) => {
    if (open) tipo.value = 'video'
  },
)

function iniciar() {
  emit('update:modelValue', false)
  ElMessage.success(
    tipo.value === 'video' ? 'Iniciando videochamada...' : 'Iniciando chamada de áudio...',
  )
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="553"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div>
        <h3 class="text-xl font-bold text-ms-text-primary">Iniciar Meeting</h3>
        <p class="mt-1 text-sm text-ms-text-secondary">Videochamada ou chamada de áudio</p>
      </div>
    </template>

    <div class="mb-2 font-medium text-ms-text-primary">Tipo de meeting</div>
    <div class="grid grid-cols-2 gap-3">
      <button
        class="rounded-xl border py-5 text-center transition"
        :class="
          tipo === 'video'
            ? 'border-ms-danger bg-[#FEF0F0]'
            : 'border-ms-border-light hover:border-[#C6E2FF]'
        "
        @click="tipo = 'video'"
      >
        <svg
          class="mx-auto h-7 w-7 text-ms-danger"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m23 7-7 5 7 5z" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
        <div class="mt-2 font-bold text-ms-text-primary">Videochamada</div>
        <div class="text-sm text-ms-text-secondary">Com câmera e áudio</div>
      </button>
      <button
        class="rounded-xl border py-5 text-center transition"
        :class="
          tipo === 'audio'
            ? 'border-ms-primary bg-ms-primary-light'
            : 'border-ms-border-light hover:border-[#C6E2FF]'
        "
        @click="tipo = 'audio'"
      >
        <svg
          class="mx-auto h-7 w-7 text-ms-text-regular"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
        </svg>
        <div class="mt-2 font-bold text-ms-text-primary">Apenas áudio</div>
        <div class="text-sm text-ms-text-secondary">Sem câmera</div>
      </button>
    </div>

    <div class="mb-2 mt-5 font-medium text-ms-text-primary">Participantes</div>
    <div class="space-y-3 rounded-xl bg-ms-fill-light p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C6CF2] to-[#5B4BD6] text-sm font-semibold text-white"
            >{{ initials }}</span
          >
          <div>
            <div class="font-medium text-ms-text-primary">{{ name }}</div>
            <div class="text-xs text-ms-text-secondary">Beneficiária</div>
          </div>
        </div>
        <el-tag type="success" effect="dark" round size="small">Convidado</el-tag>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-full bg-ms-primary text-sm font-semibold text-white"
            >VO</span
          >
          <div>
            <div class="font-medium text-ms-text-primary">Você</div>
            <div class="text-xs text-ms-text-secondary">Organizador</div>
          </div>
        </div>
        <el-tag type="primary" effect="dark" round size="small">Host</el-tag>
      </div>
    </div>

    <template #footer>
      <el-button text @click="emit('update:modelValue', false)">Voltar</el-button>
      <el-button type="primary" @click="iniciar">Iniciar meeting</el-button>
    </template>
  </el-dialog>
</template>
