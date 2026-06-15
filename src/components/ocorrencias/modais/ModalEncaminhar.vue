<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Modal "Encaminhar atendimento" — Figma 2558:29671 / 2558:29077. Jornada:
// escolher um card (Mesmo setor / Outro setor).
//  • Mesmo setor → "Selecione o atendente" (outro atendente da mesma fila).
//  • Outro setor → "Selecione o setor" + "Selecione o atendente" do setor +
//    checkbox "Definir como responsável pelo atendimento":
//      marcado   → o atendente selecionado ASSUME o atendimento (responsável);
//      desmarcado→ entra apenas como APOIO (mantém o responsável atual).
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

type Escolha = 'mesmo' | 'outro' | ''
const escolha = ref<Escolha>('')
const setor = ref('')
const atendente = ref('')
const responsavel = ref(false)
const obs = ref('')
const processando = ref(false)

const atendentes = ['João Paulo Santos', 'Maria Souza', 'Aline Peixoto', 'Lucas Moraes']
const setores = ['Financeiro', 'Autorização', 'Ouvidoria', 'Rede Credenciada', 'Cadastro', 'Jurídico']

const podeConfirmar = computed(() => {
  if (escolha.value === 'mesmo') return !!atendente.value
  if (escolha.value === 'outro') return !!setor.value
  return false
})

// Texto de apoio do checkbox (esclarece a regra conforme o estado).
const responsavelHint = computed(() => {
  if (!atendente.value) return 'Selecione um atendente para definir o responsável.'
  return responsavel.value
    ? `${atendente.value} assumirá o atendimento como responsável.`
    : `${atendente.value} entrará como apoio; o responsável atual é mantido.`
})

function escolher(value: Escolha) {
  escolha.value = value
  setor.value = ''
  atendente.value = ''
  responsavel.value = false
}

// Trocar de setor limpa o atendente e o flag de responsável.
watch(setor, () => {
  atendente.value = ''
  responsavel.value = false
})
// Sem atendente não há responsável a definir.
watch(atendente, (v) => {
  if (!v) responsavel.value = false
})

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      escolha.value = ''
      setor.value = ''
      atendente.value = ''
      responsavel.value = false
      obs.value = ''
      processando.value = false
    }
  },
)

function confirmar() {
  processando.value = true
  window.setTimeout(() => {
    processando.value = false
    emit('update:modelValue', false)
    ElMessage.success('Ocorrência encaminhada')
  }, 600)
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
        v-for="opt in [
          { key: 'mesmo', titulo: 'Mesmo setor', desc: 'Transferir para outro atendente da mesma fila' },
          { key: 'outro', titulo: 'Outro setor', desc: 'Encaminhar para uma área diferente' },
        ]"
        :key="opt.key"
        type="button"
        :aria-pressed="escolha === opt.key"
        class="relative rounded-xl border p-4 text-left transition"
        :class="
          escolha === opt.key
            ? 'border-ms-primary bg-ms-primary-light ring-1 ring-ms-primary'
            : 'border-ms-border-light hover:border-ms-primary/40'
        "
        @click="escolher(opt.key as Escolha)"
      >
        <span
          class="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border"
          :class="escolha === opt.key ? 'border-ms-primary' : 'border-ms-border'"
        >
          <span v-if="escolha === opt.key" class="h-2 w-2 rounded-full bg-ms-primary" />
        </span>

        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg transition"
          :class="
            escolha === opt.key
              ? 'bg-ms-primary text-ms-on-primary'
              : 'bg-ms-fill-light text-ms-text-regular'
          "
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
            <template v-if="opt.key === 'mesmo'">
              <path d="m16 3 4 4-4 4" />
              <path d="M20 7H4" />
              <path d="m8 13-4 4 4 4" />
              <path d="M4 17h16" />
            </template>
            <template v-else>
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </template>
          </svg>
        </div>
        <div class="mt-3 font-bold text-ms-text-primary">{{ opt.titulo }}</div>
        <p class="mt-1 text-sm text-ms-text-secondary">{{ opt.desc }}</p>
      </button>
    </div>

    <!-- Mesmo setor: só atendente da fila -->
    <div v-if="escolha === 'mesmo'" class="mt-4">
      <label class="mb-1.5 block text-ms-text-primary">Selecione o atendente</label>
      <el-select
        v-model="atendente"
        filterable
        placeholder="Busque ou selecione um atendente"
        class="w-full"
      >
        <el-option v-for="o in atendentes" :key="o" :label="o" :value="o" />
      </el-select>
    </div>

    <!-- Outro setor: setor + atendente + responsável -->
    <template v-if="escolha === 'outro'">
      <div class="mt-4">
        <label class="mb-1.5 block text-ms-text-primary">Selecione o setor</label>
        <el-select v-model="setor" filterable placeholder="Busque ou selecione um setor" class="w-full">
          <el-option v-for="o in setores" :key="o" :label="o" :value="o" />
        </el-select>
      </div>
      <div class="mt-4">
        <label class="mb-1.5 block text-ms-text-primary">Selecione o atendente</label>
        <el-select
          v-model="atendente"
          filterable
          :disabled="!setor"
          placeholder="Busque ou selecione um atendente"
          class="w-full"
        >
          <el-option v-for="o in atendentes" :key="o" :label="o" :value="o" />
        </el-select>
      </div>
      <div class="mt-4">
        <el-checkbox v-model="responsavel" :disabled="!atendente">
          Definir como responsável pelo atendimento
        </el-checkbox>
        <p class="ml-6 mt-0.5 text-2xs text-ms-text-secondary">{{ responsavelHint }}</p>
      </div>
    </template>

    <div class="mt-4">
      <label class="mb-1.5 block text-ms-text-primary"
        >Observação <span class="text-ms-text-secondary">(opcional)</span></label
      >
      <el-input v-model="obs" placeholder="Adicione uma observação" />
    </div>

    <template #footer>
      <el-button text :disabled="processando" @click="emit('update:modelValue', false)"
        >Voltar</el-button
      >
      <el-button
        type="primary"
        :disabled="!podeConfirmar"
        :loading="processando"
        @click="confirmar"
        >{{ processando ? 'Processando' : 'Confirmar encaminhamento' }}</el-button
      >
    </template>
  </el-dialog>
</template>
