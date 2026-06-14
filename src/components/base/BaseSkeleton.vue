<script setup lang="ts">
// BaseSkeleton — placeholder de carregamento (sobre el-skeleton). Dá feedback
// imediato e preserva o layout enquanto os dados chegam (menos "salto" de UI).
// `loading=false` revela o conteúdo do slot default.
withDefaults(
  defineProps<{
    /** Linhas do esqueleto (quando sem slot template). */
    rows?: number
    /** Mostra o esqueleto; ao virar false, revela o slot default. */
    loading?: boolean
    /** Anima o brilho. */
    animated?: boolean
  }>(),
  { rows: 3, loading: true, animated: true },
)

defineSlots<{ default?(): unknown }>()
</script>

<template>
  <el-skeleton :rows="rows" :loading="loading" :animated="animated" aria-busy="true">
    <template #default><slot /></template>
  </el-skeleton>
</template>
