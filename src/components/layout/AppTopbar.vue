<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotificacoesPanel from './NotificacoesPanel.vue'
import { storeToRefs } from 'pinia'
import { useNotificacoesStore } from '@/stores/notificacoes'
import { useThemeStore } from '@/stores/theme'
import {
  useProfileStore,
  profileLabel,
  profileHint,
  roleLabel,
  type Profile,
  type Role,
} from '@/stores/profile'
import { useTabsStore, type AppTab } from '@/stores/tabs'
import { useSplitStore } from '@/stores/split'
import { appScreens, type AppScreen } from '@/data/appScreens'

const route = useRoute()
const router = useRouter()

const notifStore = useNotificacoesStore()
const { unreadCount } = storeToRefs(notifStore)
onMounted(() => notifStore.load())
const notifOpen = ref(false)

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const profileStore = useProfileStore()
const { profile, role, isGestor } = storeToRefs(profileStore)
const { setProfile, setRole } = profileStore
const profileOptions: Profile[] = ['quente', 'frio', 'ambos']
const roleOptions: Role[] = ['atendente', 'gestor']

// Comandos do menu são namespaced (`role:gestor`, `perfil:quente`) para um único
// handler distinguir troca de papel de troca de perfil de atendimento.
function onCommand(cmd: string) {
  if (cmd.startsWith('role:')) {
    const r = cmd.slice(5) as Role
    setRole(r)
    router.push(r === 'gestor' ? '/gestor' : '/inicio')
  } else if (cmd.startsWith('perfil:')) {
    setProfile(cmd.slice(7) as Profile)
  }
}

// ── Abas da navbar (SplitView · Fase 1) ──────────────────────────────────────
const tabsStore = useTabsStore()
const { tabs, activeId } = storeToRefs(tabsStore)
const addOpen = ref(false)

// Telas do menu "+ Adicionar", agrupadas por contexto.
const screenGroups = computed(() => {
  const groups: Record<string, AppScreen[]> = {}
  for (const s of appScreens) (groups[s.group] ??= []).push(s)
  return groups
})

function activateTab(t: AppTab) {
  if (t.fullPath !== route.fullPath) router.push(t.fullPath).catch(() => {})
}
function closeTab(t: AppTab) {
  const navTo = tabsStore.closeTab(t.id)
  if (navTo) router.push(navTo).catch(() => {})
  else if (tabs.value.length === 0)
    router.push(isGestor.value ? '/gestor' : '/inicio').catch(() => {})
}
function openScreen(s: AppScreen) {
  addOpen.value = false
  if (s.path !== route.path) router.push(s.path).catch(() => {})
}

// Arrastar uma aba abre o painel dividido (drop zone no DashboardLayout).
const splitStore = useSplitStore()
function onTabDragStart(t: AppTab, e: DragEvent) {
  splitStore.startDrag({ path: t.fullPath, title: t.title })
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', t.id)
    e.dataTransfer.effectAllowed = 'copy'
  }
}
function onTabDragEnd() {
  splitStore.endDrag()
}

// ── Rolagem horizontal das abas (sem scrollbar; setas + fade nas bordas) ──────
const tabStrip = ref<HTMLElement>()
const canLeft = ref(false)
const canRight = ref(false)

function updateEdges() {
  const el = tabStrip.value
  if (!el) return
  canLeft.value = el.scrollLeft > 1
  canRight.value = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth
}
function scrollTabs(dir: -1 | 1) {
  tabStrip.value?.scrollBy({ left: dir * 220, behavior: 'smooth' })
}
// Garante que a aba ativa fique visível (ex.: ao adicionar uma aba fora da área).
function revealActive() {
  nextTick(() => {
    const el = tabStrip.value?.querySelector('[data-active="true"]') as HTMLElement | null
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    updateEdges()
  })
}
// Observa a largura da régua: ao abrir/fechar aba ou ao surgir/sumir uma seta
// (que muda o espaço disponível), recalcula quais setas devem aparecer.
let stripRo: ResizeObserver | null = null
onMounted(() => {
  revealActive()
  window.addEventListener('resize', updateEdges)
  if (tabStrip.value) {
    stripRo = new ResizeObserver(updateEdges)
    stripRo.observe(tabStrip.value)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateEdges)
  stripRo?.disconnect()
})
watch(() => tabs.value.length, revealActive)
watch(activeId, revealActive)

// Status de disponibilidade (padrão de central de atendimento): Disponível
// (verde, pronto para receber) ou Ocupado (vermelho, em atendimento).
const status = ref<'Disponível' | 'Ocupado'>('Disponível')
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-ms-border bg-ms-surface px-4"
  >
    <!-- Esquerda: navegação em abas -->
    <div class="flex min-w-0 items-center gap-2">
      <!-- Régua de abas com setas SOBREPOSTAS (estilo YouTube): a seta só aparece
           quando há conteúdo escondido naquele lado. Sendo overlay (absolute), não
           muda a largura da régua — evita o loop de aparecer/sumir no extremo. -->
      <div class="relative min-w-0 flex-1">
        <button
          v-if="canLeft"
          type="button"
          class="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-ms-surface text-ms-text-secondary shadow-sm transition hover:text-ms-primary"
          aria-label="Rolar abas à esquerda"
          @click="scrollTabs(-1)"
        >
          <AppIcon name="chevron-left" class="h-4 w-4" />
        </button>

        <!-- Sombreado de continuidade: gradiente da superfície → transparente
             sob cada seta, fazendo os chips desvanecerem (efeito YouTube). -->
        <div
          v-if="canLeft"
          class="pointer-events-none absolute inset-y-0 left-0 z-[5] w-14 bg-gradient-to-r from-ms-surface to-transparent"
        />
        <div
          v-if="canRight"
          class="pointer-events-none absolute inset-y-0 right-0 z-[5] w-14 bg-gradient-to-l from-ms-surface to-transparent"
        />

        <!-- Abas abertas: cada uma navega para sua tela; fecháveis. Sem scrollbar;
             rolagem pelas setas + sombreado de continuidade nas bordas. -->
        <div
          ref="tabStrip"
          class="tab-strip flex items-center gap-1.5 overflow-x-auto"
          @scroll="updateEdges"
        >
        <div
          v-for="t in tabs"
          :key="t.id"
          :data-active="t.id === activeId"
          draggable="true"
          class="group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1 text-sm transition"
          :class="
            t.id === activeId
              ? 'border-ms-primary font-medium text-ms-primary'
              : 'border-ms-border-light text-ms-text-secondary hover:bg-ms-fill-light'
          "
          role="button"
          :tabindex="0"
          :title="`${t.title} — arraste para dividir a tela`"
          @click="activateTab(t)"
          @keydown.enter="activateTab(t)"
          @dragstart="onTabDragStart(t, $event)"
          @dragend="onTabDragEnd"
        >
          <span class="max-w-[160px] truncate">{{ t.title }}</span>
          <button
            v-if="t.closable"
            class="-mr-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-ms-text-placeholder transition hover:bg-ms-fill hover:text-ms-text-primary"
            :aria-label="`Fechar ${t.title}`"
            @click.stop="closeTab(t)"
          >
            <svg
              class="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        </div>

        <button
          v-if="canRight"
          type="button"
          class="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-ms-surface text-ms-text-secondary shadow-sm transition hover:text-ms-primary"
          aria-label="Rolar abas à direita"
          @click="scrollTabs(1)"
        >
          <AppIcon name="chevron-right" class="h-4 w-4" />
        </button>
      </div>

      <!-- Adicionar tela (atalhos do sistema) -->
      <el-popover
        v-model:visible="addOpen"
        trigger="click"
        :width="300"
        placement="bottom-start"
        popper-class="!p-0"
      >
        <template #reference>
          <el-button type="primary" size="small" class="!px-2" aria-label="Adicionar tela">
            <AppIcon name="plus" class="h-4 w-4" />
          </el-button>
        </template>
        <div class="max-h-[60vh] overflow-y-auto py-2">
          <div class="px-3 pb-1 text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
            Adicionar tela
          </div>
          <template v-for="(items, group) in screenGroups" :key="group">
            <div
              class="mt-1 px-3 pb-0.5 pt-1 text-2xs font-medium uppercase tracking-wide text-ms-text-placeholder"
            >
              {{ group }}
            </div>
            <button
              v-for="s in items"
              :key="s.path"
              class="flex w-full items-center px-3 py-1.5 text-left text-sm text-ms-text-regular transition hover:bg-ms-fill-light hover:text-ms-primary"
              @click="openScreen(s)"
            >
              {{ s.label }}
            </button>
          </template>
        </div>
      </el-popover>
    </div>

    <!-- Direita: tema + notificações + status + usuário -->
    <div class="flex shrink-0 items-center gap-4">
      <el-tooltip :content="isDark ? 'Modo claro' : 'Modo escuro'" placement="bottom">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-ms-text-regular transition hover:bg-ms-fill-light hover:text-ms-primary"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          @click="themeStore.toggle()"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" class="h-5 w-5" />
        </button>
      </el-tooltip>

      <el-popover
        v-model:visible="notifOpen"
        trigger="click"
        :width="382"
        placement="bottom-end"
        popper-class="!p-0"
      >
        <template #reference>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-ms-text-regular transition hover:bg-ms-fill-light hover:text-ms-primary"
            :aria-label="unreadCount ? `Notificações (${unreadCount} não lidas)` : 'Notificações'"
          >
            <el-badge is-dot type="danger" :hidden="!unreadCount">
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </el-badge>
          </button>
        </template>
        <NotificacoesPanel @navigate="notifOpen = false" />
      </el-popover>

      <el-dropdown trigger="click">
        <span
          class="flex cursor-pointer items-center gap-2 rounded-full border border-ms-border px-3 py-1 text-sm"
        >
          <span
            class="inline-block h-2 w-2 rounded-full"
            :class="status === 'Disponível' ? 'bg-ms-success' : 'bg-ms-danger'"
          />
          <span class="font-medium text-ms-text-regular">{{ status }}</span>
          <AppIcon name="chevron-down" class="h-3 w-3 text-ms-text-secondary" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="status = 'Disponível'">Disponível</el-dropdown-item>
            <el-dropdown-item @click="status = 'Ocupado'">Ocupado</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" @command="onCommand">
        <div class="flex cursor-pointer items-center gap-2">
          <el-avatar :size="30" class="!bg-ms-primary-light !text-ms-primary">
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </el-avatar>
          <div class="hidden leading-tight sm:block">
            <div class="text-xs font-medium text-ms-text-primary">
              {{ isGestor ? 'Paulo' : 'Juliana Santos' }}
            </div>
            <div class="text-2xs text-ms-text-secondary">
              {{ isGestor ? roleLabel.gestor : profileLabel[profile] }}
            </div>
          </div>
          <AppIcon name="chevron-down" class="h-3 w-3 text-ms-text-secondary" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- Visão (papel) -->
            <div
              class="px-4 pb-1 pt-2 text-2xs font-medium uppercase tracking-wide text-ms-text-secondary"
            >
              Visão
            </div>
            <el-dropdown-item v-for="r in roleOptions" :key="r" :command="`role:${r}`">
              <div class="flex items-center gap-2 py-0.5">
                <span class="flex h-4 w-4 items-center justify-center">
                  <svg
                    v-if="role === r"
                    class="h-4 w-4 text-ms-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span
                  class="text-sm font-medium"
                  :class="role === r ? 'text-ms-primary' : 'text-ms-text-primary'"
                  >{{ roleLabel[r] }}</span
                >
              </div>
            </el-dropdown-item>

            <!-- Perfil de atendimento (só relevante para a visão do atendente) -->
            <div
              v-if="!isGestor"
              class="border-t border-ms-border-lighter px-4 pb-1 pt-2 text-2xs font-medium uppercase tracking-wide text-ms-text-secondary"
            >
              Perfil de atendimento
            </div>
            <el-dropdown-item
              v-for="p in isGestor ? [] : profileOptions"
              :key="p"
              :command="`perfil:${p}`"
            >
              <div class="flex items-center gap-2 py-0.5">
                <span class="flex h-4 w-4 items-center justify-center">
                  <svg
                    v-if="profile === p"
                    class="h-4 w-4 text-ms-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <div class="flex flex-col">
                  <span
                    class="text-sm font-medium"
                    :class="profile === p ? 'text-ms-primary' : 'text-ms-text-primary'"
                    >{{ profileLabel[p] }}</span
                  >
                  <span class="text-2xs text-ms-text-secondary">{{ profileHint[p] }}</span>
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
/* Oculta o scrollbar da régua de abas (rolagem via setas + fade nas bordas). */
.tab-strip {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tab-strip::-webkit-scrollbar {
  display: none;
}
</style>
