<script setup lang="ts">
// BaseCheckbox — caixa de seleção (sobre el-checkbox). Toggle booleano com
// rótulo associado (clicar no texto alterna). Para múltiplas opções, componha
// vários BaseCheckbox ou use filtros de seleção.
export type BaseCheckboxSize = 'small' | 'default' | 'large'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    size?: BaseCheckboxSize
  }>(),
  { label: '', disabled: false, size: 'default' },
)

defineSlots<{ default?(): unknown }>()
</script>

<template>
  <el-checkbox v-model="model" :disabled="disabled" :size="size">
    <slot>{{ label }}</slot>
  </el-checkbox>
</template>
