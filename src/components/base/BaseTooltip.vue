<script setup lang="ts">
// BaseTooltip — dica contextual (sobre el-tooltip). O conteúdo do gatilho vem
// do slot default. Tooltip é complemento — nunca a única forma de transmitir
// informação essencial (acessibilidade).
export type BaseTooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

withDefaults(
  defineProps<{
    content: string
    placement?: BaseTooltipPlacement
    disabled?: boolean
  }>(),
  { placement: 'top', disabled: false },
)

defineSlots<{ default(): unknown }>()
</script>

<template>
  <el-tooltip :content="content" :placement="placement" :disabled="disabled" :show-after="150">
    <slot />
  </el-tooltip>
</template>
