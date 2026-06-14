<script setup lang="ts">
// BaseCard — contêiner de card do Design System (chrome padrão: superfície,
// borda, raio, sombra). Slot default + footer (com divisor). Quando
// `interactive`, vira clicável e acessível por teclado (role=button, Enter/Espaço).
import { computed } from 'vue'

export type BaseCardTone = 'default' | 'danger' | 'primary'

const props = withDefaults(
  defineProps<{
    interactive?: boolean
    /** Realce de borda (ex.: risco jurídico = danger). */
    tone?: BaseCardTone
  }>(),
  { interactive: false, tone: 'default' },
)

const emit = defineEmits<{ click: [] }>()
defineSlots<{ default(): unknown; footer?(): unknown }>()

const toneBorder: Record<BaseCardTone, string> = {
  default: 'border-ms-border-light',
  danger: 'border-ms-danger',
  primary: 'border-ms-primary',
}
const borderClass = computed(() => toneBorder[props.tone])

function activate() {
  if (props.interactive) emit('click')
}
</script>

<template>
  <div
    class="rounded-lg border bg-ms-surface p-3 shadow-sm transition"
    :class="[borderClass, interactive ? 'cursor-pointer hover:shadow-md' : '']"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    @click="activate"
    @keydown.enter.prevent="activate"
    @keydown.space.prevent="activate"
  >
    <slot />
    <div
      v-if="$slots.footer"
      class="mt-2 flex items-center justify-between border-t border-ms-border-lighter pt-2 text-2xs"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
