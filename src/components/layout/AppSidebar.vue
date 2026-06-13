<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { hasQueue, isGestor } = storeToRefs(useProfileStore())

// Estado de expansão (colapsada = rail de ícones, expandida = ícones + rótulos).
const expanded = ref(false)

// "Atendimento ao vivo" só aparece para quem atende a quente (perfil com fila).
// `comingSoon: true` marca telas ainda não implementadas — exibidas como item
// desabilitado ("em breve") em vez de link que levaria a um 404.
interface NavItem {
  to: string
  label: string
  icon: string
  requiresQueue?: boolean
  comingSoon?: boolean
}

// A navegação muda conforme o papel (mesmo layout, itens diferentes).
const atendenteItems = computed<NavItem[]>(() =>
  (
    [
      { to: '/inicio', label: 'Início', icon: 'home' },
      {
        to: '/atendimento',
        label: 'Atendimento ao vivo',
        icon: 'chat',
        requiresQueue: true,
        comingSoon: true,
      },
      { to: '/ocorrencias', label: 'Ocorrências', icon: 'alert' },
      { to: '/notificacoes', label: 'Notificações', icon: 'bell' },
      { to: '/contatos', label: 'Contatos', icon: 'users', comingSoon: true },
      { to: '/agenda', label: 'Agenda', icon: 'calendar', comingSoon: true },
      { to: '/widgets', label: 'Widgets', icon: 'grid', comingSoon: true },
    ] satisfies NavItem[]
  ).filter((i) => !i.requiresQueue || hasQueue.value),
)

const gestorItems: NavItem[] = [
  { to: '/gestor/tempo-real', label: 'Início', icon: 'home' },
  { to: '/gestor/ocorrencias', label: 'Ocorrências', icon: 'alert' },
  { to: '/notificacoes', label: 'Notificações', icon: 'bell' },
  { to: '/gestor/relatorios', label: 'Relatórios', icon: 'grid', comingSoon: true },
]

const items = computed<NavItem[]>(() => (isGestor.value ? gestorItems : atendenteItems.value))

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')
</script>

<template>
  <aside
    class="relative flex shrink-0 flex-col border-r border-ms-border bg-ms-surface transition-[width] duration-200"
    :class="expanded ? 'w-[200px]' : 'w-16'"
  >
    <!-- Cabeçalho: logo + botão de colapsar/expandir -->
    <div
      class="relative flex h-14 items-center border-b border-ms-border"
      :class="expanded ? 'px-4' : 'justify-center'"
    >
      <BrandLogo :size="32" />
      <button
        class="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ms-border bg-ms-surface text-ms-text-secondary shadow-sm transition hover:text-ms-primary"
        :title="expanded ? 'Colapsar' : 'Expandir'"
        :aria-label="expanded ? 'Colapsar menu' : 'Expandir menu'"
        @click="expanded = !expanded"
      >
        <AppIcon
          name="chevron-left"
          class="h-3.5 w-3.5 transition-transform"
          :class="expanded ? '' : 'rotate-180'"
        />
      </button>
    </div>

    <!-- Menu -->
    <nav class="flex flex-col gap-1 p-2">
      <el-tooltip
        v-for="item in items"
        :key="item.to"
        :content="item.comingSoon ? `${item.label} · em breve` : item.label"
        placement="right"
        :disabled="expanded && !item.comingSoon"
      >
        <component
          :is="item.comingSoon ? 'div' : 'router-link'"
          :to="item.comingSoon ? undefined : item.to"
          :aria-disabled="item.comingSoon || undefined"
          class="flex h-10 items-center rounded-lg no-underline transition"
          :class="[
            expanded ? 'gap-3 px-3' : 'justify-center',
            item.comingSoon
              ? 'cursor-not-allowed text-ms-text-placeholder'
              : isActive(item.to)
                ? 'bg-ms-primary-light font-medium text-ms-primary'
                : 'text-ms-text-regular hover:bg-ms-fill-light hover:text-ms-primary',
          ]"
        >
          <svg
            class="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <template v-if="item.icon === 'home'">
              <path d="M3 9.5 12 3l9 6.5" />
              <path d="M5 10v10h14V10" />
            </template>
            <template v-else-if="item.icon === 'chat'">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path
                d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
              />
            </template>
            <template v-else-if="item.icon === 'alert'">
              <path d="M6 2h8l4 4v16H6z" />
              <path d="M14 2v4h4" />
              <path d="M9 13h6M9 17h4" />
            </template>
            <template v-else-if="item.icon === 'users'">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </template>
            <template v-else-if="item.icon === 'calendar'">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </template>
            <template v-else-if="item.icon === 'bell'">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </template>
            <template v-else>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </template>
          </svg>
          <span v-if="expanded" class="truncate text-sm">{{ item.label }}</span>
          <span
            v-if="expanded && item.comingSoon"
            class="ml-auto shrink-0 rounded-full bg-ms-fill-light px-1.5 text-[10px] text-ms-text-placeholder"
            >em breve</span
          >
        </component>
      </el-tooltip>
    </nav>
  </aside>
</template>
