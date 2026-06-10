<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Menu lateral do Painel do Atendente. Cada item aponta para uma rota (tela).
// Ícones inline (SVG) para não depender de um pacote de ícones extra.
// Telas ainda não construídas caem na 404 até serem implementadas.
const items = [
  { to: '/inicio', label: 'Início', icon: 'home' },
  { to: '/atendimento', label: 'Atendimento ao vivo', icon: 'chat' },
  { to: '/ocorrencias', label: 'Ocorrências', icon: 'alert' },
  { to: '/contatos', label: 'Contatos', icon: 'users' },
  { to: '/agenda', label: 'Agenda', icon: 'calendar' },
  { to: '/widgets', label: 'Widgets', icon: 'grid' },
]

const isActive = (to: string) =>
  route.path === to || route.path.startsWith(to + '/')
</script>

<template>
  <aside
    class="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-[#DCDFE6] bg-white py-4"
  >
    <!-- Logo -->
    <div
      class="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#409EFF] font-bold text-white"
    >
      MS
    </div>

    <el-tooltip
      v-for="item in items"
      :key="item.to"
      :content="item.label"
      placement="right"
    >
      <router-link
        :to="item.to"
        class="flex h-10 w-10 items-center justify-center rounded-lg text-[#909399] no-underline transition hover:bg-[#ECF5FF] hover:text-[#409EFF]"
        :class="isActive(item.to) ? '!bg-[#ECF5FF] !text-[#409EFF]' : ''"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="item.icon === 'home'"><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></template>
          <template v-else-if="item.icon === 'chat'"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></template>
          <template v-else-if="item.icon === 'alert'"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></template>
          <template v-else-if="item.icon === 'users'"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></template>
          <template v-else-if="item.icon === 'calendar'"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></template>
          <template v-else><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></template>
        </svg>
      </router-link>
    </el-tooltip>
  </aside>
</template>
