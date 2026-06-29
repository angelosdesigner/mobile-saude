<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import { TIPOS_OCORRENCIA } from '@/data/gestorTaxonomia'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const store = useGestorOcorrenciasStore()
const { contextFilters } = storeToRefs(store)

const PRIORIDADES = ['Alta', 'Média', 'Baixa']
const SLAS = ['Dentro', 'Atenção', 'Limite', 'Estourou']
const RISCOS = [
  { value: '', label: 'Todos' },
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
]

const form = reactive({
  prioridade: [] as string[],
  sla: [] as string[],
  tipo: [] as string[],
  risco: '',
})

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    const f = contextFilters.value
    form.prioridade = f.prioridade ? f.prioridade.split(',') : []
    form.sla = f.sla ? f.sla.split(',') : []
    form.tipo = f.tipo ? f.tipo.split(',') : []
    form.risco = f.risco ?? ''
  },
)

const activeCount = computed(
  () =>
    form.prioridade.length +
    form.sla.length +
    form.tipo.length +
    (form.risco ? 1 : 0),
)

function toggle(arr: string[], v: string) {
  const i = arr.indexOf(v)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(v)
}

function aplicar() {
  store.setContext({
    ...contextFilters.value,
    prioridade: form.prioridade.join(',') || undefined,
    sla: form.sla.join(',') || undefined,
    tipo: form.tipo.join(',') || undefined,
    risco: form.risco || undefined,
  })
  emit('update:modelValue', false)
  ElMessage.success('Filtros aplicados')
}

function limparTudo() {
  form.prioridade = []
  form.sla = []
  form.tipo = []
  form.risco = ''
  store.setContext({
    ...contextFilters.value,
    prioridade: undefined,
    sla: undefined,
    tipo: undefined,
    risco: undefined,
  })
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
      <div class="flex items-start justify-between border-b border-ms-border-light px-6 py-5">
        <div>
          <h3 class="text-xl font-bold text-ms-text-primary">Filtros avançados</h3>
          <p class="mt-1 text-sm text-ms-text-secondary">
            Refine os atendimentos além dos filtros rápidos da barra.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <el-tag v-if="activeCount" type="primary" effect="light" round>
            {{ activeCount }} {{ activeCount === 1 ? 'filtro ativo' : 'filtros ativos' }}
          </el-tag>
          <el-button circle text aria-label="Fechar" @click="emit('update:modelValue', false)">
            <AppIcon name="x" class="h-4 w-4" />
          </el-button>
        </div>
      </div>

      <!-- Corpo -->
      <div class="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <!-- Prioridade -->
        <section class="rounded-xl border border-ms-border-light p-4">
          <label class="mb-3 block font-medium text-ms-text-primary">Prioridade</label>
          <div class="flex flex-wrap gap-2">
            <el-check-tag
              v-for="p in PRIORIDADES"
              :key="p"
              :checked="form.prioridade.includes(p)"
              @change="toggle(form.prioridade, p)"
            >{{ p }}</el-check-tag>
          </div>
        </section>

        <!-- SLA -->
        <section class="rounded-xl border border-ms-border-light p-4">
          <label class="mb-3 block font-medium text-ms-text-primary">SLA</label>
          <div class="flex flex-wrap gap-2">
            <el-check-tag
              v-for="s in SLAS"
              :key="s"
              :checked="form.sla.includes(s)"
              @change="toggle(form.sla, s)"
            >{{ s }}</el-check-tag>
          </div>
        </section>

        <!-- Tipo de ocorrência -->
        <section class="rounded-xl border border-ms-border-light p-4">
          <label class="mb-3 block font-medium text-ms-text-primary">Tipo de ocorrência</label>
          <div class="flex flex-wrap gap-2">
            <el-check-tag
              v-for="t in TIPOS_OCORRENCIA"
              :key="t"
              :checked="form.tipo.includes(t)"
              @change="toggle(form.tipo, t)"
            >{{ t }}</el-check-tag>
          </div>
        </section>

        <!-- Risco jurídico -->
        <section class="rounded-xl border border-ms-border-light p-4">
          <label class="mb-3 block font-medium text-ms-text-primary">Risco jurídico</label>
          <el-radio-group v-model="form.risco" class="flex flex-wrap gap-4">
            <el-radio v-for="r in RISCOS" :key="r.value" :value="r.value">{{ r.label }}</el-radio>
          </el-radio-group>
        </section>

        <p class="rounded-lg bg-ms-fill-light p-3 text-xs text-ms-text-secondary">
          Os filtros avançados combinam com os filtros rápidos da barra (AND). Múltiplos valores no mesmo filtro combinam em OR.
        </p>
      </div>

      <!-- Rodapé -->
      <div class="flex items-center justify-between border-t border-ms-border-light px-6 py-4">
        <el-button text :disabled="!activeCount" @click="limparTudo">Limpar tudo</el-button>
        <div class="flex gap-2">
          <el-button @click="emit('update:modelValue', false)">Cancelar</el-button>
          <el-button type="primary" @click="aplicar">Aplicar filtros</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
