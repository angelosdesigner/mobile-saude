<script setup lang="ts">
import { ref, computed } from 'vue'
import { filaItems, filaStats } from '@/data/fila'

const search = ref('')
const items = computed(() =>
  filaItems.filter((i) => i.name.toLowerCase().includes(search.value.toLowerCase())),
)

const channelIcon = (c: string) => {
  if (/whats/i.test(c)) return 'whatsapp'
  if (/tele|fone/i.test(c)) return 'phone'
  if (/app/i.test(c)) return 'app'
  if (/web|portal/i.test(c)) return 'web'
  return 'users'
}
</script>

<template>
  <div class="flex max-h-[70vh] w-[380px] flex-col">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between px-4 pb-2 pt-4">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-bold text-ms-text-primary">Minha fila de atendimentos</h3>
        <span
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-danger px-1.5 text-[11px] font-semibold text-white"
          >{{ items.length }}</span
        >
      </div>
    </div>

    <!-- Busca -->
    <div class="px-4">
      <el-input v-model="search" placeholder="Buscar por beneficiário ou protocolo" clearable>
        <template #prefix>
          <AppIcon name="search" class="h-4 w-4 text-ms-text-placeholder" />
        </template>
      </el-input>
    </div>

    <!-- Chips -->
    <div class="flex items-center gap-2 overflow-x-auto px-4 py-3">
      <span
        class="flex shrink-0 items-center gap-1 rounded-full border border-ms-border-light px-3 py-1 text-xs text-ms-text-regular"
        >Total: <b class="text-ms-text-primary">{{ filaStats.total }}</b></span
      >
      <span
        class="flex shrink-0 items-center gap-1 rounded-full border border-ms-border-light px-3 py-1 text-xs text-ms-text-regular"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-ms-warning" />Fila de abandono:
        <b class="text-ms-text-primary">{{ filaStats.abandono }}</b>
      </span>
    </div>

    <!-- Lista -->
    <div class="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
      <button
        v-for="i in items"
        :key="i.id"
        class="block w-full rounded-lg border p-3 text-left transition hover:border-[#C6E2FF]"
        :class="i.active ? 'border-ms-success bg-[#F0F9EB]' : 'border-ms-border-light bg-white'"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ i.name }}</span>
          <span class="shrink-0 text-xs text-ms-text-secondary">{{ i.time }}</span>
        </div>
        <div class="mt-1 flex items-center justify-between gap-2">
          <span class="truncate text-xs italic text-ms-text-secondary">"{{ i.message }}"</span>
          <span
            v-if="i.unread"
            class="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-ms-success px-1 text-[11px] font-semibold text-white"
            >{{ i.unread }}</span
          >
        </div>
        <div class="mt-2 flex items-center gap-1.5 text-xs text-ms-text-regular">
          <span>{{ i.categoria }}</span>
          <span class="text-ms-border">|</span>
          <span>{{ i.subtipo }}</span>
          <span class="text-ms-border">|</span>
          <span
            class="flex items-center gap-1"
            :class="
              channelIcon(i.channel) === 'whatsapp' ? 'text-[#25D366]' : 'text-ms-text-secondary'
            "
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <template v-if="channelIcon(i.channel) === 'whatsapp'">
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"
                />
              </template>
              <template v-else-if="channelIcon(i.channel) === 'phone'">
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"
                />
              </template>
              <template v-else-if="channelIcon(i.channel) === 'app'">
                <rect x="7" y="2" width="10" height="20" rx="2" />
                <path d="M11 18h2" />
              </template>
              <template v-else-if="channelIcon(i.channel) === 'web'">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
              </template>
              <template v-else>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </template>
            </svg>
            {{ i.channel }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
