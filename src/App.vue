<script setup lang="ts">
// Shell da aplicação: cabeçalho de navegação + área de rota.
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-3xl items-center gap-6 px-8 py-4">
        <router-link to="/" class="font-bold text-slate-800 no-underline">
          Mobile Saúde
        </router-link>
        <div class="flex gap-4 text-sm">
          <router-link to="/" class="text-slate-500 no-underline hover:text-slate-800">
            Início
          </router-link>
          <router-link to="/demo" class="text-slate-500 no-underline hover:text-slate-800">
            Demo
          </router-link>
        </div>
      </nav>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
