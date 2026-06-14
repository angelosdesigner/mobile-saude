<script setup lang="ts">
// BaseDrawer — painel lateral do Design System (sobre el-drawer). Ideal para
// filtros avançados, detalhes e formulários secundários sem sair do contexto.
const visible = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    title?: string
    size?: string | number
    direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
    closable?: boolean
  }>(),
  { title: '', size: '32%', direction: 'rtl', closable: true },
)

defineSlots<{ default(): unknown; footer?(): unknown }>()
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :size="size"
    :direction="direction"
    :show-close="closable"
  >
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </el-drawer>
</template>
