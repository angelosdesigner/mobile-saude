<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotificacoesPanel from './NotificacoesPanel.vue'
import { useOcorrencias } from '@/composables/useOcorrencias'

const route = useRoute()
const router = useRouter()

const { unreadCount } = useOcorrencias()

const activeTitle = computed(() => (route.meta.title as string) ?? 'Início')

// Status de disponibilidade do atendente.
const status = ref<'Disponível' | 'Indisponível'>('Disponível')

// "Abas" de protocolos abertos (mock, fiel ao design).
const protocolTabs = ['99999999992026031290920', '99999999992026031290923']
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[#DCDFE6] bg-white px-4"
  >
    <!-- Esquerda: navegação em abas -->
    <div class="flex min-w-0 items-center gap-2">
      <el-button text circle size="small" @click="router.back()">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6" /></svg>
      </el-button>

      <div class="flex min-w-0 items-center gap-2 overflow-hidden">
        <span class="shrink-0 rounded-md border border-[#409EFF] px-3 py-1 text-sm font-medium text-[#409EFF]">
          {{ activeTitle }}
        </span>
        <span
          v-for="p in protocolTabs"
          :key="p"
          class="hidden shrink-0 truncate rounded-md border border-[#EBEEF5] px-3 py-1 text-sm text-[#909399] lg:block"
        >
          {{ p }}
        </span>
      </div>

      <el-button text circle size="small" class="!text-[#909399]">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" /></svg>
      </el-button>
      <el-button type="primary" size="small" class="!px-2">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
      </el-button>
    </div>

    <!-- Direita: notificações + status + usuário -->
    <div class="flex shrink-0 items-center gap-4">
      <el-popover trigger="click" :width="382" placement="bottom-end" popper-class="!p-0">
        <template #reference>
          <el-badge is-dot type="danger" :hidden="!unreadCount" class="cursor-pointer">
            <svg class="h-5 w-5 text-[#606266]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
          </el-badge>
        </template>
        <NotificacoesPanel />
      </el-popover>

      <el-dropdown trigger="click">
        <span class="flex cursor-pointer items-center gap-2 rounded-full border border-[#DCDFE6] px-3 py-1 text-sm">
          <span class="inline-block h-2 w-2 rounded-full" :class="status === 'Disponível' ? 'bg-[#67C23A]' : 'bg-[#C0C4CC]'" />
          <span class="font-medium text-[#606266]">{{ status }}</span>
          <svg class="h-3 w-3 text-[#909399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" /></svg>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="status = 'Disponível'">Disponível</el-dropdown-item>
            <el-dropdown-item @click="status = 'Indisponível'">Indisponível</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div class="flex items-center gap-2">
        <el-avatar :size="30" class="!bg-[#ECF5FF] !text-[#409EFF]">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </el-avatar>
        <div class="hidden leading-tight sm:block">
          <div class="text-xs font-medium text-[#303133]">Juliana Santos</div>
          <div class="text-[10px] text-[#909399]">Atendente</div>
        </div>
      </div>
    </div>
  </header>
</template>
