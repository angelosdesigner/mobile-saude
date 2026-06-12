<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const beneficiario = ref('Maria Souza')
const template = ref('')

const templates = [
  {
    value: 'saudacao',
    label: 'Saudação inicial',
    text: 'Olá! Sou da Mobile Saúde e vou te ajudar com a sua solicitação. 😊',
  },
  {
    value: 'documentos',
    label: 'Solicitação de documentos',
    text: 'Para prosseguir, precisamos dos documentos: RG, comprovante de residência e o pedido médico.',
  },
  {
    value: 'protocolo',
    label: 'Confirmação de protocolo',
    text: 'Seu protocolo 0010020030040050 foi registrado e está em análise. Avisaremos por aqui.',
  },
  {
    value: 'encerramento',
    label: 'Encerramento',
    text: 'Atendimento finalizado. Qualquer dúvida, estamos à disposição. Obrigado!',
  },
]

const preview = computed(() => templates.find((t) => t.value === template.value)?.text || '')
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="700"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div>
        <h3 class="text-xl font-bold text-ms-text-primary">Enviar template WhatsApp</h3>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Selecione um template e visualize antes de enviar
        </p>
      </div>
    </template>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block font-medium text-ms-text-primary"
            >Selecione o beneficiário</label
          >
          <el-select v-model="beneficiario" class="w-full">
            <el-option label="Maria Souza" value="Maria Souza" />
            <el-option label="João Pedro Oliveira" value="João Pedro Oliveira" />
          </el-select>
        </div>
        <div>
          <label class="mb-1.5 block font-medium text-ms-text-primary">Selecione o template</label>
          <el-select v-model="template" placeholder="Tipo de mensagem" class="w-full">
            <el-option v-for="t in templates" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </div>
      </div>

      <div class="rounded-xl bg-ms-fill-light p-4">
        <div class="mb-3 text-sm text-ms-text-regular">Preview da mensagem</div>
        <div
          class="flex min-h-[180px] items-center justify-center rounded-lg bg-ms-surface p-4 text-center"
        >
          <p v-if="preview" class="text-sm text-ms-text-primary">{{ preview }}</p>
          <div v-else class="flex flex-col items-center gap-2 text-ms-text-placeholder">
            <svg
              class="h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span class="text-sm">Selecione um template para visualizar a mensagem</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button text @click="emit('update:modelValue', false)">Voltar</el-button>
      <el-button type="primary" :disabled="!template" @click="emit('update:modelValue', false)"
        >Enviar mensagem</el-button
      >
    </template>
  </el-dialog>
</template>
