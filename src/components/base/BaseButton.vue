<script setup lang="ts">
// BaseButton — wrapper de botão do Design System (sobre Element Plus).
// As telas NÃO usam <el-button> direto: usam <BaseButton> para padronizar
// variantes, tamanhos e estados (loading/disabled) em um só lugar.
import { computed } from 'vue'

export type BaseButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'text'
export type BaseButtonSize = 'small' | 'default' | 'large'

const props = withDefaults(
  defineProps<{
    /** Intenção visual do botão. */
    variant?: BaseButtonVariant
    /** Tamanho do controle. */
    size?: BaseButtonSize
    /** Mostra spinner e bloqueia o clique. */
    loading?: boolean
    /** Desabilita o botão. */
    disabled?: boolean
    /** Ocupa 100% da largura do contêiner. */
    block?: boolean
    /** type do <button> nativo (use 'submit' em formulários). */
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'default',
    loading: false,
    disabled: false,
    block: false,
    nativeType: 'button',
  },
)

defineEmits<{ click: [event: MouseEvent] }>()
defineSlots<{
  /** Conteúdo do botão (rótulo). */
  default(): unknown
  /** Ícone à esquerda do rótulo. */
  icon?(): unknown
}>()

// `secondary`/`text` mapeiam para o tipo neutro do EP; os demais são 1:1.
const elType = computed(() =>
  props.variant === 'secondary' || props.variant === 'text' ? 'default' : props.variant,
)
</script>

<template>
  <el-button
    :type="elType"
    :text="variant === 'text'"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :native-type="nativeType"
    :class="block ? 'w-full' : ''"
    @click="$emit('click', $event)"
  >
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <slot />
  </el-button>
</template>
