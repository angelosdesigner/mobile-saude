<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import FilaFab from '@/components/fila/FilaFab.vue'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'

const { hasQueue } = storeToRefs(useProfileStore())
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-ms-fill-light">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main v-drag-scroll class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-[1200px] px-6 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Fila flutuante global — só para perfis que atendem a quente. -->
    <FilaFab v-if="hasQueue" />
  </div>
</template>
