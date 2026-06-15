<script setup lang="ts" generic="T extends string">
// Seletor "aparente" padrão dos gráficos do gestor: rótulo + grupo de botões
// segmentados (Element Plus). Unifica o controle de métrica/indicador/período
// dos gráficos de evolução, substituindo dropdowns soltos. Reutilizado em
// Operação por Canal, Central de Automação e Gestão de Filas (detalhes).
defineProps<{ label?: string; options: readonly T[] }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="flex items-center gap-2">
    <span
      v-if="label"
      class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary"
      >{{ label }}</span
    >
    <el-radio-group v-model="model" size="small">
      <el-radio-button v-for="o in options" :key="o" :value="o">{{ o }}</el-radio-button>
    </el-radio-group>
  </div>
</template>
