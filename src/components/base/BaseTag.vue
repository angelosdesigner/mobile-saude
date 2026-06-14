<script setup lang="ts">
// BaseTag — rótulo curto (sobre el-tag). Para categorias/labels neutros.
// Para STATUS do produto use o BaseBadge (combina ícone + texto + cor).
export type BaseTagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type BaseTagEffect = 'light' | 'dark' | 'plain'
export type BaseTagSize = 'small' | 'default' | 'large'

withDefaults(
  defineProps<{
    type?: BaseTagType
    effect?: BaseTagEffect
    size?: BaseTagSize
    round?: boolean
    closable?: boolean
  }>(),
  { type: 'info', effect: 'light', size: 'default', round: false, closable: false },
)

defineEmits<{ close: [] }>()
defineSlots<{ default(): unknown }>()
</script>

<template>
  <el-tag
    :type="type"
    :effect="effect"
    :size="size"
    :round="round"
    :closable="closable"
    disable-transitions
    @close="$emit('close')"
  >
    <slot />
  </el-tag>
</template>
