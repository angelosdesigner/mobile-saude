<script setup lang="ts">
// BaseRadio — grupo de opções exclusivas (sobre el-radio-group). Use quando o
// usuário escolhe exatamente UMA opção entre poucas (2–5). Para muitas, prefira
// BaseSelect.
export interface BaseRadioOption {
  label: string
  value: string | number
  disabled?: boolean
}
export type BaseRadioSize = 'small' | 'default' | 'large'

const model = defineModel<string | number>()

withDefaults(
  defineProps<{
    options: BaseRadioOption[]
    /** Rótulo do grupo (acessibilidade). */
    label?: string
    disabled?: boolean
    size?: BaseRadioSize
    /** Renderiza como botões segmentados. */
    button?: boolean
  }>(),
  { label: '', disabled: false, size: 'default', button: false },
)
</script>

<template>
  <fieldset class="flex flex-col gap-1.5 border-0 p-0">
    <legend v-if="label" class="mb-0.5 text-xs font-medium text-ms-text-regular">{{ label }}</legend>
    <el-radio-group v-model="model" :disabled="disabled" :size="size">
      <template v-if="button">
        <el-radio-button
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          :disabled="o.disabled"
          >{{ o.label }}</el-radio-button
        >
      </template>
      <template v-else>
        <el-radio v-for="o in options" :key="o.value" :value="o.value" :disabled="o.disabled">{{
          o.label
        }}</el-radio>
      </template>
    </el-radio-group>
  </fieldset>
</template>
