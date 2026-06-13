<script setup lang="ts">
// Item de notificação compartilhado: dropdown do topbar (compact) e tela cheia.
// `compact` esconde os metadados extras (categoria, atendente, setor).
import type { Notificacao, NotifType } from '@/types/notificacoes'
import { categoryLabel } from '@/types/notificacoes'

withDefaults(defineProps<{ notif: Notificacao; compact?: boolean }>(), { compact: false })
defineEmits<{ click: [] }>()

// Tint do ícone por severidade (tokens com opacidade — adaptam ao tema).
const tintClass: Record<NotifType, string> = {
  warning: 'bg-ms-warning/10 text-ms-warning',
  info: 'bg-ms-primary/10 text-ms-primary',
  danger: 'bg-ms-danger/10 text-ms-danger',
  success: 'bg-ms-success/10 text-ms-success',
}
</script>

<template>
  <div
    class="flex gap-3 px-4 py-3 transition-colors"
    :class="[
      notif.unread ? 'bg-ms-primary/5' : '',
      $attrs.onClick ? 'cursor-pointer hover:bg-ms-fill-light' : '',
    ]"
    @click="$emit('click')"
  >
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      :class="tintClass[notif.type]"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <template v-if="notif.type === 'warning'">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </template>
        <template v-else-if="notif.type === 'info'">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" />
        </template>
        <template v-else-if="notif.type === 'danger'">
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </template>
        <template v-else>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </template>
      </svg>
    </div>

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-ms-text-primary">{{ notif.title }}</span>
        <span v-if="notif.unread" class="h-2 w-2 shrink-0 rounded-full bg-ms-primary" />
      </div>
      <p class="mt-0.5 text-xs leading-relaxed text-ms-text-regular">{{ notif.desc }}</p>

      <!-- Metadados (tela cheia): categoria + atendente/setor -->
      <div v-if="!compact" class="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span
          class="rounded-full bg-ms-fill-light px-2 py-0.5 text-2xs font-medium text-ms-text-secondary"
          >{{ categoryLabel[notif.category] }}</span
        >
        <span
          v-if="notif.setor"
          class="rounded-full bg-ms-primary/10 px-2 py-0.5 text-2xs font-medium text-ms-primary"
          >{{ notif.setor }}</span
        >
        <span
          v-if="notif.atendente"
          class="rounded-full bg-ms-teal/10 px-2 py-0.5 text-2xs font-medium text-ms-teal"
          >{{ notif.atendente }}</span
        >
      </div>

      <p class="mt-1 text-2xs text-ms-text-secondary">{{ notif.time }}</p>
    </div>
  </div>
</template>
