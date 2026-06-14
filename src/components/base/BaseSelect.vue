<script setup lang="ts">
// BaseSelect — seletor do Design System (sobre el-select). Recebe `options`
// tipadas e suporta múltipla seleção. As telas usam <BaseSelect>, não el-select.
import { computed } from 'vue'

export interface BaseSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
export type BaseSelectSize = 'small' | 'default' | 'large'

const props = withDefaults(
  defineProps<{
    options: BaseSelectOption[]
    label?: string
    placeholder?: string
    size?: BaseSelectSize
    multiple?: boolean
    clearable?: boolean
    disabled?: boolean
    error?: boolean | string
  }>(),
  {
    label: '',
    placeholder: 'Selecione',
    size: 'default',
    multiple: false,
    clearable: true,
    disabled: false,
    error: false,
  },
)

const model = defineModel<string | number | Array<string | number> | undefined>()

const hasError = computed(() => props.error !== false && props.error !== '')
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''))
</script>

<template>
  <label class="flex flex-col gap-1">
    <span v-if="label" class="text-xs font-medium text-ms-text-regular">{{ label }}</span>
    <el-select
      v-model="model"
      :placeholder="placeholder"
      :size="size"
      :multiple="multiple"
      :clearable="clearable"
      :disabled="disabled"
      collapse-tags
      collapse-tags-tooltip
      :max-collapse-tags="1"
      :aria-invalid="hasError || undefined"
      class="w-full"
    >
      <el-option
        v-for="o in options"
        :key="o.value"
        :label="o.label"
        :value="o.value"
        :disabled="o.disabled"
      />
    </el-select>
    <span v-if="errorMessage" role="alert" class="text-2xs text-ms-danger">{{ errorMessage }}</span>
  </label>
</template>
