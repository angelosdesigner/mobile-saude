<script setup lang="ts">
// Seletor de período padrão do gestor: presets (botões segmentados) + opção
// "Personalizado" que revela um calendário de intervalo (el-date-picker
// daterange) para o usuário escolher qualquer janela de datas.
// Reutilizado nos filtros de período das telas de detalhe e indicadores.
defineProps<{ options: readonly string[]; label?: string }>()

// Período ativo (um preset ou "Personalizado").
const model = defineModel<string>({ required: true })
// Intervalo personalizado [início, fim] (YYYY-MM-DD). Opcional para o consumidor.
const range = defineModel<[string, string] | null>('range', { default: null })

const CUSTOM = 'Personalizado'

function onRangeChange(v: [string, string] | null) {
  if (v && v.length === 2) model.value = CUSTOM
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span
      v-if="label"
      class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary"
      >{{ label }}</span
    >
    <el-radio-group v-model="model" size="small">
      <el-radio-button v-for="o in options" :key="o" :value="o">{{ o }}</el-radio-button>
      <el-radio-button :value="CUSTOM">{{ CUSTOM }}</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-if="model === CUSTOM"
      v-model="range"
      type="daterange"
      size="small"
      unlink-panels
      range-separator="→"
      start-placeholder="Início"
      end-placeholder="Fim"
      format="DD/MM/YYYY"
      value-format="YYYY-MM-DD"
      class="!w-64"
      @change="onRangeChange"
    />
  </div>
</template>
