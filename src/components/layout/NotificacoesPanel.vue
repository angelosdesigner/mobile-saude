<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

const store = useOcorrenciasStore()
const { notifications, unreadCount } = storeToRefs(store)
const { markAllRead } = store

// Classes de token (com opacidade) por tipo — adaptam automaticamente ao tema.
const tintClass: Record<string, string> = {
  warning: 'bg-ms-warning/10 text-ms-warning',
  info: 'bg-ms-primary/10 text-ms-primary',
  danger: 'bg-ms-danger/10 text-ms-danger',
  success: 'bg-ms-success/10 text-ms-success',
}
</script>

<template>
  <div class="w-[380px]">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="font-bold text-ms-text-primary">Notificações</span>
        <span
          v-if="unreadCount"
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-danger px-1.5 text-[11px] font-semibold text-white"
          >{{ unreadCount }}</span
        >
      </div>
      <button class="text-sm text-ms-primary hover:underline" @click="markAllRead">
        Marcar todas como lidas
      </button>
    </div>

    <!-- Lista -->
    <div class="max-h-[360px] overflow-y-auto">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="flex gap-3 border-t border-ms-border-lighter px-4 py-3"
        :class="n.unread ? 'bg-[#FAFCFF]' : ''"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          :class="tintClass[n.type]"
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
            <template v-if="n.type === 'warning'">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </template>
            <template v-else-if="n.type === 'info'">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v4h1" />
            </template>
            <template v-else-if="n.type === 'danger'">
              <path
                d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
              />
              <path d="M12 9v4M12 17h.01" />
            </template>
            <template v-else>
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </template>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-ms-text-primary">{{ n.title }}</span>
            <span v-if="n.unread" class="h-2 w-2 shrink-0 rounded-full bg-ms-primary" />
          </div>
          <p class="mt-0.5 text-xs leading-relaxed text-ms-text-regular">{{ n.desc }}</p>
          <p class="mt-1 text-[11px] text-ms-text-placeholder">{{ n.time }}</p>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="border-t border-ms-border-lighter py-3 text-center">
      <button class="text-sm font-medium text-ms-primary hover:underline">
        Ver todas as notificações
      </button>
    </div>
  </div>
</template>
