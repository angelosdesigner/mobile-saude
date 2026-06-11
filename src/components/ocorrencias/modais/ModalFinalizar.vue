<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const motivo = ref('')
const obs = ref('')

const motivos = [
  'Resolvido',
  'Sem retorno do beneficiário',
  'Duplicado',
  'Encaminhado para outro setor',
  'Improcedente',
]

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      motivo.value = ''
      obs.value = ''
    }
  },
)

function finalizar() {
  emit('update:modelValue', false)
  ElMessage.success('Atendimento finalizado')
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
      <h3 class="text-xl font-bold text-ms-text-primary">Finalizar atendimento</h3>
    </template>

    <div class="space-y-4">
      <div>
        <label class="mb-1.5 block text-ms-text-primary">Motivo da finalização</label>
        <el-select v-model="motivo" placeholder="Selecione um motivo..." class="w-full">
          <el-option v-for="m in motivos" :key="m" :label="m" :value="m" />
        </el-select>
      </div>
      <div>
        <label class="mb-1.5 block text-ms-text-primary"
          >Observação <span class="text-ms-text-secondary">(opcional)</span></label
        >
        <el-input v-model="obs" type="textarea" :rows="3" placeholder="Adicione uma observação" />
      </div>
    </div>

    <template #footer>
      <el-button text @click="emit('update:modelValue', false)">Voltar</el-button>
      <el-button type="primary" :disabled="!motivo" @click="finalizar"
        >Finalizar atendimento</el-button
      >
    </template>
  </el-dialog>
</template>
