<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { columns, type Ocorrencia } from '@/data/ocorrencias'
import { useOcorrencias } from '@/composables/useOcorrencias'

const route = useRoute()
const router = useRouter()
const { board } = useOcorrencias()

const id = computed(() => Number(route.params.id))
const oc = computed<Ocorrencia | undefined>(() => {
  for (const c of columns) {
    const found = board[c].find((o) => o.id === id.value)
    if (found) return found
  }
  return undefined
})

// Conversa/timeline (mock, no espírito do detalhe-chat do Figma).
const reply = ref('')
const conversa = computed(() => {
  if (!oc.value) return []
  return [
    { from: 'cliente', text: `Olá, ${oc.value.tipo.toLowerCase()}.`, time: '14:58' },
    { from: 'sistema', text: `Atendimento iniciado via ${oc.value.channel}.`, time: '14:59' },
    { from: 'atendente', text: 'Olá! Já estou verificando sua solicitação, um momento por favor.', time: '15:01' },
    { from: 'cliente', text: 'Obrigada!', time: '15:02' },
  ]
})

const dados = computed(() =>
  oc.value
    ? [
        { label: 'Protocolo', value: '00100200300400500' },
        { label: 'Tipo de ocorrência', value: oc.value.tipoOcorrencia },
        { label: 'Assunto', value: oc.value.assunto },
        { label: 'SLA', value: oc.value.sla },
        { label: 'Prioridade', value: oc.value.prioridade },
        { label: 'Canal', value: oc.value.channel },
        { label: 'Atendente', value: oc.value.atendente },
      ]
    : [],
)
</script>

<template>
  <DashboardLayout>
    <div v-if="oc">
      <!-- Cabeçalho -->
      <div class="mb-5 flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <el-button circle text @click="router.push('/ocorrencias')">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6" /></svg>
          </el-button>
          <div>
            <div class="text-xs text-[#909399]">Ocorrência · 00100200300400500</div>
            <h1 class="text-2xl font-bold text-[#303133]">{{ oc.beneficiary }}</h1>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <el-tag :type="oc.statusType" effect="light" size="small">{{ oc.status }}</el-tag>
              <el-tag v-if="oc.risk" type="danger" effect="plain" size="small" class="!uppercase">Risco Jurídico Configurado</el-tag>
              <el-tag :type="oc.timeType" :effect="oc.timeType === 'danger' ? 'dark' : 'light'" size="small" round>{{ oc.time }}</el-tag>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <el-button>Encaminhar</el-button>
          <el-button type="primary">Concluir atendimento</el-button>
        </div>
      </div>

      <div class="grid gap-5 lg:grid-cols-3">
        <!-- Conversa -->
        <el-card shadow="always" body-class="!p-0" class="lg:col-span-2 !border-[#EBEEF5]">
          <div class="border-b border-[#F2F6FC] px-5 py-3 text-sm font-bold uppercase text-[#303133]">Conversa</div>
          <div class="flex max-h-[460px] flex-col gap-3 overflow-y-auto px-5 py-4">
            <div
              v-for="(m, i) in conversa"
              :key="i"
              class="flex"
              :class="m.from === 'atendente' ? 'justify-end' : m.from === 'sistema' ? 'justify-center' : 'justify-start'"
            >
              <div
                v-if="m.from === 'sistema'"
                class="rounded-full bg-[#F5F7FA] px-3 py-1 text-xs text-[#909399]"
              >{{ m.text }}</div>
              <div
                v-else
                class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
                :class="m.from === 'atendente' ? 'bg-[#409EFF] text-white' : 'bg-[#F0F2F5] text-[#303133]'"
              >
                {{ m.text }}
                <div class="mt-1 text-[10px]" :class="m.from === 'atendente' ? 'text-white/70' : 'text-[#C0C4CC]'">{{ m.time }}</div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 border-t border-[#F2F6FC] px-5 py-3">
            <el-input v-model="reply" placeholder="Escreva uma mensagem..." />
            <el-button type="primary">Enviar</el-button>
          </div>
        </el-card>

        <!-- Dados -->
        <el-card shadow="always" class="!border-[#EBEEF5]">
          <div class="mb-3 text-sm font-bold uppercase text-[#303133]">Dados do atendimento</div>
          <dl class="space-y-3">
            <div v-for="d in dados" :key="d.label">
              <dt class="text-[11px] text-[#909399]">{{ d.label }}</dt>
              <dd class="text-sm font-medium text-[#303133]">{{ d.value }}</dd>
            </div>
          </dl>
        </el-card>
      </div>
    </div>

    <!-- Ocorrência não encontrada -->
    <div v-else class="flex flex-col items-center gap-3 py-20 text-center">
      <p class="text-[#909399]">Ocorrência não encontrada.</p>
      <el-button type="primary" @click="router.push('/ocorrencias')">Voltar para Ocorrências</el-button>
    </div>
  </DashboardLayout>
</template>
