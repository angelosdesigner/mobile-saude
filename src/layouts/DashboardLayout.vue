<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import FilaFab from '@/components/fila/FilaFab.vue'
import EquipeStatusFloating from '@/components/gestor/EquipeStatusFloating.vue'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'

const { hasQueue, isGestor } = storeToRefs(useProfileStore())
</script>

<template>
  <!-- Shell de altura fixa (h-dvh): sidebar e topbar fixos; só o <main> rola.
       overflow-x-hidden contém o conteúdo largo (kanban rola internamente), sem
       gerar scroll horizontal da página inteira. min-w-0 evita blow-out do flex. -->
  <div class="flex h-dvh w-full overflow-hidden bg-ms-bg">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main v-drag-scroll class="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <!-- Full width: ocupa todo o espaço horizontal disponível (sem max-w). -->
        <div class="min-w-0 px-6 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Fila flutuante global — só para perfis que atendem a quente. -->
    <FilaFab v-if="hasQueue" />

    <!-- Status das equipes — ação flutuante global do gestor (arrastável). -->
    <EquipeStatusFloating v-if="isGestor" />
  </div>
</template>
