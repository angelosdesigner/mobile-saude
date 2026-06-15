<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const setor = ref('')
const motivo = ref('')
const obs = ref('')

const setores = [
  'Financeiro',
  'Autorização',
  'Ouvidoria',
  'Rede Credenciada',
  'Cadastro',
  'Jurídico',
]
// Motivos da cobrança — Figma 2797:25722.
const motivos = [
  'SLA próximo do vencimento',
  'Aguardando resposta urgente',
  'Beneficiário solicitando retorno',
  'Documentação pendente',
]

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      setor.value = ''
      motivo.value = ''
      obs.value = ''
    }
  },
)

function enviar() {
  emit('update:modelValue', false)
  ElMessage.success('Cobrança enviada ao setor')
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
        <h3 class="text-xl font-bold text-ms-text-primary">Cobrar setor</h3>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Uma notificação será enviada ao departamento responsável.
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <div>
        <label class="mb-1.5 block text-ms-text-primary">Selecione o setor</label>
        <el-select
          v-model="setor"
          placeholder="Busque ou selecione um setor"
          filterable
          class="w-full"
        >
          <el-option v-for="s in setores" :key="s" :label="s" :value="s" />
        </el-select>
      </div>
      <div>
        <label class="mb-1.5 block text-ms-text-primary">Motivo da cobrança</label>
        <el-select v-model="motivo" filterable placeholder="Selecione um motivo..." class="w-full">
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
      <el-button type="primary" :disabled="!setor || !motivo" @click="enviar"
        >Enviar cobrança</el-button
      >
    </template>
  </el-dialog>
</template>
