<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import FilaFab from '@/components/fila/FilaFab.vue'
import { useProfile } from '@/composables/useProfile'

const { hasQueue } = useProfile()
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#F5F7FA]">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-[1200px] px-6 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Fila flutuante global — só para perfis que atendem a quente. -->
    <FilaFab v-if="hasQueue" />
  </div>
</template>
