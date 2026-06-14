<script setup lang="ts">
// BaseInput — campo de texto do Design System (sobre el-input).
// Inclui label (associado), estado de erro (com role=alert p/ leitor de tela)
// e dica. As telas usam <BaseInput>, não <el-input> direto.
import { computed } from 'vue'

export type BaseInputSize = 'small' | 'default' | 'large'

const props = withDefaults(
  defineProps<{
    /** Rótulo visível e associado ao campo (acessibilidade). */
    label?: string
    placeholder?: string
    type?: 'text' | 'password' | 'textarea' | 'number' | 'email' | 'tel'
    size?: BaseInputSize
    disabled?: boolean
    clearable?: boolean
    /** Erro: `true` ou mensagem. Mensagem é anunciada via role=alert. */
    error?: boolean | string
    /** Texto de ajuda abaixo do campo. */
    hint?: string
  }>(),
  {
    label: '',
    placeholder: '',
    type: 'text',
    size: 'default',
    disabled: false,
    clearable: true,
    error: false,
    hint: '',
  },
)

const model = defineModel<string | number>({ default: '' })

const hasError = computed(() => props.error !== false && props.error !== '')
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))

defineSlots<{ prefix?(): unknown; suffix?(): unknown }>()
</script>

<template>
  <label class="flex flex-col gap-1">
    <span v-if="label" class="text-xs font-medium text-ms-text-regular">{{ label }}</span>
    <el-input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :clearable="clearable"
      :aria-invalid="hasError || undefined"
      :class="hasError ? 'is-error' : ''"
    >
      <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
      <template v-if="$slots.suffix" #suffix><slot name="suffix" /></template>
    </el-input>
    <span v-if="errorMessage" role="alert" class="text-2xs text-ms-danger">{{ errorMessage }}</span>
    <span v-else-if="hint" class="text-2xs text-ms-text-secondary">{{ hint }}</span>
  </label>
</template>

<style scoped>
/* Borda de erro via token (não depende só de cor: há também a mensagem). */
.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--color-ms-danger) inset;
}
</style>
