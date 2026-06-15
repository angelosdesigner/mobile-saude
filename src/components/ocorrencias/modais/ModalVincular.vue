<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Modal "Vincular protocolo" — Figma 2922:22774. Multiseleção de protocolos
// (associa este atendimento a um ou mais protocolos). Cada opção mostra dados
// ricos (protocolo · beneficiário · status · data · tipo); a busca filtra por
// número do protocolo OU nome do beneficiário.
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

interface ProtocoloItem {
  protocolo: string
  beneficiario: string
  status: string
  data: string
  tipo: string
}

const protocolosBase: ProtocoloItem[] = [
  { protocolo: '9999999999920260314909233', beneficiario: 'Maria Souza', status: 'Em análise', data: '20/03/2026', tipo: 'Reembolso' },
  { protocolo: '9999999999920260314909145', beneficiario: 'João Paulo', status: 'Em análise', data: '20/03/2026', tipo: 'Reembolso' },
  { protocolo: '9999999999920260314908871', beneficiario: 'Ana Lima', status: 'Aguardando documentos', data: '19/03/2026', tipo: 'Autorização de exame' },
  { protocolo: '9999999999920260314908410', beneficiario: 'Carlos Nunes', status: 'Concluído', data: '18/03/2026', tipo: 'Segunda via' },
  { protocolo: '9999999999920260314907956', beneficiario: 'Beatriz Rocha', status: 'Em análise', data: '17/03/2026', tipo: 'Reclamação' },
]

const selecionados = ref<string[]>([])
const obs = ref('')
const query = ref('')

const protocolosFiltrados = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return protocolosBase
  return protocolosBase.filter(
    (p) => p.protocolo.toLowerCase().includes(q) || p.beneficiario.toLowerCase().includes(q),
  )
})

// `filterable` + `:filter-method` controla a lista pela query (busca por
// protocolo OU beneficiário). EP guarda os rótulos dos itens já selecionados,
// então as tags continuam corretas mesmo quando filtrados para fora da lista.
function filtrar(q: string) {
  query.value = q
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selecionados.value = []
      obs.value = ''
      query.value = ''
    }
  },
)

function confirmar() {
  const n = selecionados.value.length
  emit('update:modelValue', false)
  ElMessage.success(n > 1 ? `${n} protocolos vinculados` : 'Protocolo vinculado')
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="450"
    align-center
    popper-class="vincular-protocolo"
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
          v-model="selecionados"
          multiple
          filterable
          :filter-method="filtrar"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="1"
          placeholder="Busque ou selecione um protocolo"
          popper-class="vincular-protocolo-pop"
          class="w-full"
        >
          <el-option
            v-for="p in protocolosFiltrados"
            :key="p.protocolo"
            :label="`Protocolo: ${p.protocolo}`"
            :value="p.protocolo"
          >
            <div class="flex flex-col gap-0.5 py-1 leading-snug">
              <span class="text-sm font-semibold text-ms-text-primary">Protocolo: {{ p.protocolo }}</span>
              <span class="text-2xs text-ms-text-secondary">Beneficiário: {{ p.beneficiario }}</span>
              <span class="text-2xs text-ms-text-secondary">Status: {{ p.status }}</span>
              <span class="text-2xs text-ms-text-secondary">Data: {{ p.data }}</span>
              <span class="text-2xs text-ms-text-secondary">Tipo de solicitação: {{ p.tipo }}</span>
            </div>
          </el-option>
          <template #empty>
            <div class="px-4 py-3 text-center text-xs text-ms-text-secondary">
              Nenhum protocolo encontrado
            </div>
          </template>
        </el-select>
        <p v-if="selecionados.length > 1" class="mt-1 text-2xs text-ms-text-secondary">
          {{ selecionados.length }} protocolos selecionados
        </p>
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
      <el-button type="primary" :disabled="!selecionados.length" @click="confirmar"
        >Confirmar vínculo</el-button
      >
    </template>
  </el-dialog>
</template>

<style>
/* Opções multi-linha (dados ricos do protocolo) — o dropdown é teleportado
   para o body, então o ajuste de altura precisa ser global, escopado pela
   popper-class do select. */
.vincular-protocolo-pop .el-select-dropdown__item {
  height: auto;
  line-height: 1.4;
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
