<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const protocolo = ref('')
const obs = ref('')

const protocolos = [
  '0010020030040051 — Reembolso',
  '0010020030040052 — Autorização de exame',
  '0010020030040053 — Reclamação',
  '0010020030040054 — Segunda via',
]

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      protocolo.value = ''
      obs.value = ''
    }
  },
)

function confirmar() {
  emit('update:modelValue', false)
  ElMessage.success('Protocolo vinculado')
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
        <h3 class="text-xl font-bold text-ms-text-primary">Vincular protocolo</h3>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Associe este atendimento a outro protocolo para manter o histórico conectado.
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <div>
        <label class="mb-1.5 block text-ms-text-primary">Buscar protocolo</label>
        <el-select
          v-model="protocolo"
          placeholder="Busque ou selecione um protocolo"
          filterable
          class="w-full"
        >
          <el-option v-for="p in protocolos" :key="p" :label="p" :value="p" />
        </el-select>
      </div>
      <div>
        <label class="mb-1.5 block text-ms-text-primary"
          >Observação <span class="text-ms-text-secondary">(opcional)</span></label
        >
        <el-input
          v-model="obs"
          type="textarea"
          :rows="3"
          placeholder="Descreva o motivo do vínculo"
        />
      </div>
    </div>

    <template #footer>
      <el-button text @click="emit('update:modelValue', false)">Voltar</el-button>
      <el-button type="primary" :disabled="!protocolo" @click="confirmar"
        >Confirmar vínculo</el-button
      >
    </template>
  </el-dialog>
</template>
