<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useOcorrencias, columnLabel } from '@/composables/useOcorrencias'
import {
  slaOptions,
  tipoOcorrenciaOptions,
  tipoAtendimentoOptions,
  columns,
} from '@/data/ocorrencias'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const { filters, clearFilters } = useOcorrencias()

const tipoOcorrenciaChips = [...tipoOcorrenciaOptions, 'Dúvida', 'Solicitação de rede']
const tags = ['Urgente', 'Judicial', 'VIP', 'Recorrente', 'Complexo']

// Form local (só aplica nos filtros globais ao clicar "Aplicar filtros").
const form = reactive({
  sla: '' as string,
  tipoOcorrencia: [] as string[],
  assunto: '' as string,
  tipoAtendimento: '' as string,
  status: [] as string[],
  tags: [] as string[],
})

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    form.sla = filters.sla[0] ?? ''
    form.tipoOcorrencia = [...filters.tipoOcorrencia]
    form.assunto = filters.assunto
    form.tipoAtendimento = filters.tipoAtendimento[0] ?? ''
    form.status = [...filters.status]
    form.tags = []
  },
)

const activeCount = computed(
  () =>
    (form.sla ? 1 : 0) +
    form.tipoOcorrencia.length +
    (form.assunto ? 1 : 0) +
    (form.tipoAtendimento ? 1 : 0) +
    form.status.length +
    form.tags.length,
)

function toggle(arr: string[], v: string) {
  const i = arr.indexOf(v)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(v)
}

function aplicar() {
  filters.sla = form.sla ? [form.sla] : []
  filters.tipoOcorrencia = [...form.tipoOcorrencia]
  filters.assunto = form.assunto
  filters.tipoAtendimento = form.tipoAtendimento ? [form.tipoAtendimento] : []
  filters.status = [...form.status]
  emit('update:modelValue', false)
}

function limparTudo() {
  form.sla = ''
  form.tipoOcorrencia = []
  form.assunto = ''
  form.tipoAtendimento = ''
  form.status = []
  form.tags = []
  clearFilters()
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    :size="530"
    :with-header="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex h-full flex-col">
      <!-- Cabeçalho -->
      <div class="flex items-start justify-between border-b border-[#EBEEF5] px-6 py-5">
        <div>
          <h3 class="text-xl font-bold text-[#303133]">Filtros avançados</h3>
          <p class="mt-1 text-sm text-[#909399]">Combine diferentes critérios para localizar atendimentos específicos.</p>
        </div>
        <div class="flex items-center gap-3">
          <el-tag v-if="activeCount" type="primary" effect="light" round>{{ activeCount }} filtros ativos</el-tag>
          <el-button circle text @click="emit('update:modelValue', false)">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </el-button>
        </div>
      </div>

      <!-- Corpo -->
      <div class="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <section class="rounded-xl border border-[#EBEEF5] p-4">
          <label class="mb-2 block font-medium text-[#303133]">SLA</label>
          <el-select v-model="form.sla" placeholder="Todos" class="w-full" clearable>
            <el-option v-for="s in slaOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </section>

        <section class="rounded-xl border border-[#EBEEF5] p-4">
          <label class="mb-2 block font-medium text-[#303133]">Tipo de ocorrência</label>
          <el-input placeholder="Buscar tipo de ocorrência" class="mb-3">
            <template #prefix>
              <svg class="h-4 w-4 text-[#C0C4CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </template>
          </el-input>
          <div class="flex flex-wrap gap-2">
            <el-check-tag
              v-for="t in tipoOcorrenciaChips"
              :key="t"
              :checked="form.tipoOcorrencia.includes(t)"
              @change="toggle(form.tipoOcorrencia, t)"
            >{{ t }}</el-check-tag>
          </div>
        </section>

        <section class="rounded-xl border border-[#EBEEF5] p-4">
          <label class="mb-2 block font-medium text-[#303133]">Assunto</label>
          <el-input v-model="form.assunto" placeholder="Digite palavras-chave do assunto..." clearable />
        </section>

        <section class="rounded-xl border border-[#EBEEF5] p-4">
          <label class="mb-2 block font-medium text-[#303133]">Tipo de atendimento</label>
          <el-select v-model="form.tipoAtendimento" placeholder="Selecione o tipo de atendimento" class="w-full" clearable>
            <el-option v-for="t in tipoAtendimentoOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </section>

        <section class="rounded-xl border border-[#EBEEF5] p-4">
          <label class="mb-2 block font-medium text-[#303133]">Status</label>
          <div class="flex flex-wrap gap-2">
            <el-check-tag
              v-for="c in columns"
              :key="c"
              :checked="form.status.includes(c)"
              @change="toggle(form.status, c)"
            >{{ columnLabel[c] }}</el-check-tag>
          </div>
        </section>

        <section class="rounded-xl border border-[#EBEEF5] p-4">
          <label class="mb-2 block font-medium text-[#303133]">Tags</label>
          <div class="flex flex-wrap gap-2">
            <el-check-tag
              v-for="t in tags"
              :key="t"
              :checked="form.tags.includes(t)"
              @change="toggle(form.tags, t)"
            >{{ t }}</el-check-tag>
          </div>
          <p class="mt-2 text-xs text-[#909399]">Selecione uma ou mais tags para filtrar</p>
        </section>

        <p class="rounded-lg bg-[#F5F7FA] p-3 text-xs text-[#909399]">
          Combine múltiplos filtros para refinar ainda mais sua busca. Os filtros avançados funcionam em conjunto com os filtros rápidos.
        </p>
      </div>

      <!-- Rodapé -->
      <div class="flex items-center justify-between border-t border-[#EBEEF5] px-6 py-4">
        <el-button text :disabled="!activeCount" @click="limparTudo">Limpar tudo</el-button>
        <div class="flex gap-2">
          <el-button @click="emit('update:modelValue', false)">Cancelar</el-button>
          <el-button @click="aplicar">Salvar filtro</el-button>
          <el-button type="primary" @click="aplicar">Aplicar filtros</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
