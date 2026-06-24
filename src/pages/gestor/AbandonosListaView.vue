<script setup lang="ts">
// Lista dedicada de CHAMADAS ABANDONADAS (drill-down do card "Chamadas na fila"
// da Início). Contexto separado das Ocorrências gerais — só os abandonos, com
// resumo + filtros (canal/fila/origem) + tabela padrão (DataList) ordenável.
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import {
  chamadasAbandonadas,
  abandonosResumo,
  type OrigemAbandono,
} from '@/data/gestorAbandonosLista'
import { canalCor, atendimentoCor, normalizeCanal, normalizeFila } from '@/data/gestorTaxonomia'
import { useChartColors } from '@/plugins/echarts'

const route = useRoute()
const C = useChartColors()

// Filtros locais (semeados pela query, p/ drill-down compartilhável).
const seed = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const fCanal = ref(seed('canal'))
const fFila = ref(seed('fila'))
const fOrigem = ref(seed('origem'))

const uniq = (v: string[]) => [...new Set(v)]
const canalOpts = uniq(chamadasAbandonadas.map((c) => c.canal))
const filaOpts = uniq(chamadasAbandonadas.map((c) => c.fila))
const origemOpts: OrigemAbandono[] = ['BOT', 'Humano']

const filtrados = computed(() =>
  chamadasAbandonadas
    .filter(
      (c) =>
        (!fCanal.value || normalizeCanal(c.canal) === normalizeCanal(fCanal.value)) &&
        (!fFila.value || normalizeFila(c.fila) === normalizeFila(fFila.value)) &&
        (!fOrigem.value || c.origem === fOrigem.value),
    )
    // espalha p/ tipo anônimo (com index signature) aceito pelo DataList.
    .map((c) => ({ ...c })),
)
const temFiltro = computed(() => !!(fCanal.value || fFila.value || fOrigem.value))
const limpar = () => {
  fCanal.value = ''
  fFila.value = ''
  fOrigem.value = ''
}

// "6:48" (m:ss) → segundos.
const seg = (s: string) => {
  const [m, sc] = s.split(':').map(Number)
  return (m || 0) * 60 + (sc || 0)
}
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

// Resumo (sobre o conjunto filtrado).
const total = computed(() => filtrados.value.length)
const esperaMedia = computed(() =>
  total.value ? fmt(filtrados.value.reduce((a, c) => a + seg(c.espera), 0) / total.value) : '—',
)
const bot = computed(() => filtrados.value.filter((c) => c.origem === 'BOT').length)
const humano = computed(() => filtrados.value.filter((c) => c.origem === 'Humano').length)

const origemCor = computed<Record<OrigemAbandono, string>>(() => ({
  BOT: atendimentoCor(C).bot,
  Humano: atendimentoCor(C).humano,
}))

const columns: DataListColumn[] = [
  { key: 'beneficiary', label: 'Beneficiário', minWidth: 200, sortable: true },
  { key: 'canal', label: 'Canal', minWidth: 150, sortable: true },
  { key: 'fila', label: 'Fila', minWidth: 160, sortable: true },
  { key: 'origem', label: 'Origem', width: 120, sortable: true },
  { key: 'espera', label: 'Espera até abandono', align: 'right', width: 170, sortBy: (r) => seg(r.espera as string) },
  { key: 'posicao', label: 'Posição na fila', align: 'right', width: 140, sortable: true },
  { key: 'horario', label: 'Horário', align: 'right', width: 110, sortable: true },
]
</script>

<template>
  <DashboardLayout>
    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>Chamadas Abandonadas</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-ms-text-primary">Chamadas Abandonadas</h1>
      <p class="mt-1 text-sm text-ms-text-secondary">
        Relação das chamadas que desistiram na fila ou no fluxo automatizado, com tempo de espera e
        origem do abandono.
      </p>
    </div>

    <!-- Resumo -->
    <div class="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          Total de abandonos
        </div>
        <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ total }}</div>
      </el-card>
      <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          Taxa de abandono
        </div>
        <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ abandonosResumo.taxa }}</div>
        <div class="text-2xs text-ms-text-secondary">meta {{ abandonosResumo.meta }}</div>
      </el-card>
      <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          Espera média até abandono
        </div>
        <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ esperaMedia }}</div>
      </el-card>
      <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          BOT × Humano
        </div>
        <div class="mt-1 flex items-center gap-3 text-sm">
          <span class="flex items-center gap-1 font-bold" :style="{ color: origemCor.BOT }">
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: origemCor.BOT }" />BOT
            {{ bot }}
          </span>
          <span class="flex items-center gap-1 font-bold" :style="{ color: origemCor.Humano }">
            <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: origemCor.Humano }" />Humano
            {{ humano }}
          </span>
        </div>
      </el-card>
    </div>

    <!-- Filtros -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <el-select v-model="fCanal" placeholder="Canal" class="!w-44" clearable>
        <el-option v-for="o in canalOpts" :key="o" :label="o" :value="o" />
      </el-select>
      <el-select v-model="fFila" placeholder="Fila" class="!w-48" clearable>
        <el-option v-for="o in filaOpts" :key="o" :label="o" :value="o" />
      </el-select>
      <el-select v-model="fOrigem" placeholder="Origem" class="!w-36" clearable>
        <el-option v-for="o in origemOpts" :key="o" :label="o" :value="o" />
      </el-select>
      <el-button v-if="temFiltro" text type="primary" size="small" @click="limpar"
        >Limpar filtros</el-button
      >
    </div>

    <!-- Tabela -->
    <DataList
      :columns="columns"
      :rows="filtrados"
      row-key="id"
      :selectable="false"
      :expandable="false"
      :actions="false"
      count-label="chamadas abandonadas"
      empty-text="Nenhuma chamada abandonada para os filtros aplicados"
    >
      <template #cell-canal="{ row }">
        <span class="flex items-center gap-1.5">
          <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: canalCor(row.canal, C) }" />{{
            row.canal
          }}
        </span>
      </template>
      <template #cell-origem="{ row }">
        <span class="text-xs font-semibold" :style="{ color: origemCor[row.origem as OrigemAbandono] }">{{
          row.origem
        }}</span>
      </template>
    </DataList>
  </DashboardLayout>
</template>
