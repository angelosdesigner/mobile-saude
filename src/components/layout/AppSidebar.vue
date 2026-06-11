<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import { useProfile } from '@/composables/useProfile'

const route = useRoute()
const { hasQueue } = useProfile()

// Estado de expansão (colapsada = rail de ícones, expandida = ícones + rótulos).
const expanded = ref(false)

// "Atendimento ao vivo" só aparece para quem atende a quente (perfil com fila).
const items = computed(() =>
  [
    { to: '/inicio', label: 'Início', icon: 'home', requiresQueue: false },
    { to: '/atendimento', label: 'Atendimento ao vivo', icon: 'chat', requiresQueue: true },
    { to: '/ocorrencias', label: 'Ocorrências', icon: 'alert', requiresQueue: false },
    { to: '/contatos', label: 'Contatos', icon: 'users', requiresQueue: false },
    { to: '/agenda', label: 'Agenda', icon: 'calendar', requiresQueue: false },
    { to: '/widgets', label: 'Widgets', icon: 'grid', requiresQueue: false },
  ].filter((i) => !i.requiresQueue || hasQueue.value),
)

const isActive = (to: string) =>
  route.path === to || route.path.startsWith(to + '/')
</script>

<template>
  <aside
    class="relative flex shrink-0 flex-col border-r border-[#DCDFE6] bg-white transition-[width] duration-200"
    :class="expanded ? 'w-[200px]' : 'w-16'"
  >
    <!-- Cabeçalho: logo + botão de colapsar/expandir -->
    <div
      class="relative flex h-14 items-center border-b border-[#DCDFE6]"
      :class="expanded ? 'px-4' : 'justify-center'"
    >
      <BrandLogo :size="32" />
      <button
        class="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCDFE6] bg-white text-[#909399] shadow-sm transition hover:text-[#409EFF]"
        :title="expanded ? 'Colapsar' : 'Expandir'"
        @click="expanded = !expanded"
      >
        <svg class="h-3.5 w-3.5 transition-transform" :class="expanded ? '' : 'rotate-180'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
    </div>

    <!-- Menu -->
    <nav class="flex flex-col gap-1 p-2">
      <el-tooltip
        v-for="item in items"
        :key="item.to"
        :content="item.label"
        placement="right"
        :disabled="expanded"
      >
        <router-link
          :to="item.to"
          class="flex h-10 items-center rounded-lg no-underline transition"
          :class="[
            expanded ? 'gap-3 px-3' : 'justify-center',
            isActive(item.to)
              ? 'bg-[#ECF5FF] font-medium text-[#409EFF]'
              : 'text-[#606266] hover:bg-[#F5F7FA] hover:text-[#409EFF]',
          ]"
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="item.icon === 'home'"><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></template>
            <template v-else-if="item.icon === 'chat'"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></template>
            <template v-else-if="item.icon === 'alert'"><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v4h4" /><path d="M9 13h6M9 17h4" /></template>
            <template v-else-if="item.icon === 'users'"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></template>
            <template v-else-if="item.icon === 'calendar'"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></template>
            <template v-else><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></template>
          </svg>
          <span v-if="expanded" class="truncate text-sm">{{ item.label }}</span>
        </router-link>
      </el-tooltip>
    </nav>
  </aside>
</template>
