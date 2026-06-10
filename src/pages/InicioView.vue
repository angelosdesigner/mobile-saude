<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// ── Dados da tela "Início" (extraídos do frame Figma 3049:34138) ──────────────
// As cores do design foram normalizadas para os tipos semânticos do Element Plus
// (danger / warning / primary / success), conforme a stack do projeto.

const contencaoCards = [
  {
    tag: 'Risco Jurídico em Tempo Real',
    title: '8 atendimentos acima do limite',
    items: [
      'Chat: 4',
      'Telefone: 2',
      'Balcão: 2',
      'Tempo médio excedido: +6 min',
      'Maior tempo de espera: 14 min',
    ],
    note: 'Exposição a penalidade e passivo jurídico ativo.',
    action: 'Iniciar atendimento agora',
  },
  {
    tag: 'Risco Jurídico Configurado',
    title: '5 itens com SLA Regulatório estourado',
    items: [
      'Alto volume de nips: 2',
      'Menor prazo regulatório: 3',
      'Balcão: 2',
      'Atraso médio: +12h',
      'Maior atraso: 1d 4h',
    ],
    note: 'Exposição a penalidade e passivo jurídico ativo.',
    action: 'Corrigir agora',
  },
]

const prazosCards = [
  { tag: 'alto volume de nips', number: 7, title: 'Reembolsos', sub: ['Mais próximo do vencimento: 4 dias', 'Prazo médio: 2 dias'] },
  { tag: 'Risco de escalonamento', number: 3, title: 'Ouvidoria e reanálise', sub: ['Mais urgente vence em: 1 dia', 'Prazo médio: 6h'] },
  { tag: 'Maior criticidade e multas', number: 2, title: 'Alta complexidade e cirurgia', sub: ['Mais urgente vence em: 2 dias', 'Prazo médio: 1 dia'] },
  { tag: 'Menor prazo regulatório', number: 4, title: 'Negativas por escrito e exames', sub: ['Mais urgente vence em: 3h', 'Prazo médio: 1h'] },
]

const encColumns = [
  {
    title: 'Encaminhamentos sem resposta',
    rows: [
      { label: 'Pendências com beneficiário: 6', meta: ['Próximo SLA Regulatório: 14 min', 'Próximo SLA Interno: 14 min', 'Última interação: 1d'] },
      { label: 'Pendências com área interna: 4', meta: ['Próximo SLA Regulatório: 14 min', 'Próximo SLA Interno: 14 min', 'Última interação: 30min'] },
    ],
  },
  {
    title: 'Encaminhamentos com resposta',
    rows: [
      { label: 'Pendências com beneficiário: 6', meta: ['Próximo SLA Regulatório: 14 min', 'Próximo SLA Interno: 14 min', 'Última interação: 1d'] },
      { label: 'Pendências com área interna: 4', meta: ['Próximo SLA Regulatório: 14 min', 'Próximo SLA Interno: 14 min', 'Última interação: 30min'] },
    ],
  },
]

const slaInterno = {
  lines: [
    'SLA interno estourado: 12 tickets',
    'Mais antigo: há 3h 42min',
    'Vencendo nas próximas 24h: 28 atendimentos',
    '9 vencem nas próximas 4h',
    'Próximo SLA crítico: vence em 6h',
  ],
  note: 'Gestão preventiva para evitar risco jurídico futuro.',
  action: 'Acessar Fila de SLA',
}

const statTiles = [
  { value: '42', label: 'Meus atendimentos' },
  { value: '38', label: 'Minhas pendências' },
  { value: '29', label: 'Total de pendências do setor' },
  { value: '156', label: 'Total de atendimentos do setor' },
]

const kpis = [
  { tag: 'SLA Regulatório', value: '96%', label: 'Resolução dentro do SLA Regulatório', note: '' },
  { tag: 'Reabertura', value: '8%', label: 'Taxa de Reabertura', note: 'Alta reabertura aumenta risco jurídico futuro.' },
  { tag: 'Satisfação', value: '4.6', label: 'CSAT', note: '' },
  { tag: 'Progresso', value: '18/20', label: 'Meta do Dia', note: '' },
]
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho da página -->
    <div class="mb-6">
      <h1 class="text-[28px] font-bold leading-tight text-[#111827]">Prioridades de Hoje</h1>
      <p class="mt-1 text-[#606266]">Aqui estão os casos que merecem sua atenção agora.</p>
    </div>

    <div class="flex flex-col gap-5">
      <!-- ── 1. Contenção de Dano (danger) ───────────────────────────────── -->
      <section class="rounded-xl border border-[#FDE2E2] bg-[#FEF2F2] p-5">
        <header class="mb-4 flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F56C6C] text-white">
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#991B1B]">Contenção de Dano — Risco Jurídico Imediato</h2>
            <p class="text-sm text-[#606266]">Situações com SLA Regulatório ultrapassado ou infração em tempo real.</p>
          </div>
        </header>

        <div class="grid gap-4 md:grid-cols-2">
          <el-card v-for="card in contencaoCards" :key="card.title" shadow="always" class="!border-[#FDE2E2]">
            <el-tag type="danger" effect="light" size="small" class="!uppercase">{{ card.tag }}</el-tag>
            <h3 class="mt-2 text-2xl font-bold text-[#303133]">{{ card.title }}</h3>
            <ul class="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              <li v-for="i in card.items" :key="i" class="text-sm font-medium text-[#606266]">{{ i }}</li>
            </ul>
            <p class="mt-3 text-xs text-[#909399]">{{ card.note }}</p>
            <el-button type="danger" class="mt-4">{{ card.action }} <span class="ml-1">→</span></el-button>
          </el-card>
        </div>
      </section>

      <!-- ── 2. Risco Jurídico e Financeiro (warning) ────────────────────── -->
      <section class="rounded-xl border border-[#FAECD8] bg-[#FFFBEB] p-5">
        <header class="mb-4 flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6A23C] text-white">
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#92400E]">Risco Jurídico e Financeiro — Prazos Críticos</h2>
            <p class="text-sm text-[#606266]">Demandas próximas do vencimento do SLA Regulatório.</p>
          </div>
        </header>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <el-card v-for="card in prazosCards" :key="card.title" shadow="always" class="!border-[#FAECD8]">
            <el-tag type="warning" effect="light" size="small" class="!uppercase">{{ card.tag }}</el-tag>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-[22px] font-bold text-[#E6A23C]">{{ card.number }}</span>
              <span class="font-semibold text-[#303133]">{{ card.title }}</span>
            </div>
            <ul class="mt-2 space-y-0.5">
              <li v-for="s in card.sub" :key="s" class="text-xs text-[#606266]">{{ s }}</li>
            </ul>
            <el-button type="warning" class="mt-3" size="small">Acessar casos <span class="ml-1">→</span></el-button>
          </el-card>
        </div>
      </section>

      <!-- ── 3. Controle Operacional (primary) ───────────────────────────── -->
      <section class="rounded-xl border border-[#D9ECFF] bg-[#ECF5FF] p-5">
        <header class="mb-4 flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#409EFF] text-white">
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#1D4ED8]">Controle Operacional — Prevenção de Risco</h2>
            <p class="text-sm text-[#606266]">Demandas dentro do SLA Regulatório com monitoramento preventivo.</p>
          </div>
        </header>

        <div class="grid gap-4 lg:grid-cols-2">
          <el-card v-for="col in encColumns" :key="col.title" shadow="always" class="!border-[#D9ECFF]">
            <h3 class="text-sm font-bold uppercase text-[#303133]">{{ col.title }}</h3>
            <div v-for="row in col.rows" :key="row.label" class="mt-3 border-t border-[#EBEEF5] pt-3 first:border-t-0 first:pt-0">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-[#303133]">{{ row.label }}</span>
                <el-button type="primary" link>Acessar →</el-button>
              </div>
              <div class="mt-1 flex flex-wrap gap-x-4 text-xs text-[#909399]">
                <span v-for="m in row.meta" :key="m">{{ m }}</span>
              </div>
            </div>
          </el-card>
        </div>

        <div class="mt-4 grid gap-4 lg:grid-cols-2">
          <!-- Gestão de SLA Interno -->
          <el-card shadow="always" class="!border-[#D9ECFF]">
            <h3 class="text-sm font-bold uppercase text-[#303133]">Gestão de SLA Interno</h3>
            <ul class="mt-3 space-y-1">
              <li v-for="l in slaInterno.lines" :key="l" class="text-sm font-medium text-[#606266]">{{ l }}</li>
            </ul>
            <p class="mt-2 text-xs text-[#909399]">{{ slaInterno.note }}</p>
            <el-button type="primary" class="mt-4">{{ slaInterno.action }} <span class="ml-1">→</span></el-button>
          </el-card>

          <!-- Tiles numéricos -->
          <div class="grid grid-cols-2 gap-4">
            <el-card v-for="t in statTiles" :key="t.label" shadow="always" body-class="!p-4" class="!border-[#D9ECFF]">
              <div class="text-xl font-bold text-[#303133]">{{ t.value }}</div>
              <div class="text-xs text-[#606266]">{{ t.label }}</div>
              <el-button type="primary" size="small" class="mt-2">Acessar</el-button>
            </el-card>
          </div>
        </div>
      </section>

      <!-- ── 4. Meu Desempenho (success) ─────────────────────────────────── -->
      <section class="rounded-xl border border-[#E1F3D8] bg-[#F0F9EB] p-5">
        <header class="mb-4 flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#67C23A] text-white">
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h2 class="text-lg font-bold text-[#15803D]">Meu desempenho</h2>
        </header>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <el-card v-for="k in kpis" :key="k.tag" shadow="always" class="!border-[#E1F3D8]">
            <el-tag type="success" effect="light" size="small">{{ k.tag }}</el-tag>
            <div class="mt-2 text-[28px] font-bold text-[#67C23A]">{{ k.value }}</div>
            <div class="text-sm font-medium text-[#606266]">{{ k.label }}</div>
            <p v-if="k.note" class="mt-1 text-xs text-[#909399]">{{ k.note }}</p>
          </el-card>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>
