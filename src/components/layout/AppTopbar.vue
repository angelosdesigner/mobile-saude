<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotificacoesPanel from './NotificacoesPanel.vue'
import { storeToRefs } from 'pinia'
import { useNotificacoesStore } from '@/stores/notificacoes'
import { useThemeStore } from '@/stores/theme'
import { useActionFeedback } from '@/composables/useActionFeedback'
import {
  useProfileStore,
  profileLabel,
  profileHint,
  roleLabel,
  type Profile,
  type Role,
} from '@/stores/profile'

const route = useRoute()
const router = useRouter()

const notifStore = useNotificacoesStore()
const { unreadCount } = storeToRefs(notifStore)
onMounted(() => notifStore.load())
const notifOpen = ref(false)

const { comingSoon } = useActionFeedback()

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

const activeTitle = computed(() => (route.meta.title as string) ?? 'Início')

// Status de disponibilidade (padrão de central de atendimento): Disponível
// (verde, pronto para receber) ou Ocupado (vermelho, em atendimento).
const status = ref<'Disponível' | 'Ocupado'>('Disponível')

// "Abas" de protocolos abertos (mock, fiel ao design).
const protocolTabs = ['99999999992026031290920', '99999999992026031290923']
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-ms-border bg-ms-surface px-4"
  >
    <!-- Esquerda: navegação em abas -->
    <div class="flex min-w-0 items-center gap-2">
      <el-button text circle size="small" aria-label="Voltar" @click="router.back()">
        <AppIcon name="chevron-left" class="h-4 w-4" />
      </el-button>

      <div class="flex min-w-0 items-center gap-2 overflow-hidden">
        <span
          class="shrink-0 rounded-md border border-ms-primary px-3 py-1 text-sm font-medium text-ms-primary"
        >
          {{ activeTitle }}
        </span>
        <span
          v-for="p in protocolTabs"
          :key="p"
          class="hidden shrink-0 truncate rounded-md border border-ms-border-light px-3 py-1 text-sm text-ms-text-secondary lg:block"
        >
          {{ p }}
        </span>
      </div>

      <el-button text circle size="small" class="!text-ms-text-secondary" aria-label="Avançar">
        <AppIcon name="chevron-right" class="h-4 w-4" />
      </el-button>
      <el-button
        type="primary"
        size="small"
        class="!px-2"
        aria-label="Novo"
        @click="comingSoon('Novo atendimento')"
      >
        <AppIcon name="plus" class="h-4 w-4" />
      </el-button>
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
          <el-badge is-dot type="danger" :hidden="!unreadCount" class="cursor-pointer">
            <svg
              class="h-5 w-5 text-ms-text-regular"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </el-badge>
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
            <div class="text-xs font-medium text-ms-text-primary">Juliana Santos</div>
            <div class="text-[10px] text-ms-text-secondary">
              {{ isGestor ? roleLabel.gestor : profileLabel[profile] }}
            </div>
          </div>
          <AppIcon name="chevron-down" class="h-3 w-3 text-ms-text-secondary" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- Visão (papel) -->
            <div
              class="px-4 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-ms-text-secondary"
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
              class="border-t border-ms-border-lighter px-4 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-ms-text-secondary"
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
                  <span class="text-[11px] text-ms-text-secondary">{{ profileHint[p] }}</span>
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>
