<script setup lang="ts">
// BaseModal — diálogo modal do Design System (sobre el-dialog). Foco preso,
// fechar por ESC/overlay e role=dialog vêm do EP; `title` vira o rótulo
// acessível. v-model controla a visibilidade.
const visible = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    title?: string
    width?: string | number
    closable?: boolean
    closeOnClickModal?: boolean
    alignCenter?: boolean
  }>(),
  { title: '', width: 520, closable: true, closeOnClickModal: true, alignCenter: true },
)

defineSlots<{ default(): unknown; footer?(): unknown }>()
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :show-close="closable"
    :close-on-click-modal="closeOnClickModal"
    :align-center="alignCenter"
  >
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </el-dialog>
</template>
