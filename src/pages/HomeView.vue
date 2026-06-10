<script setup lang="ts">
import { routes } from '@/router'

// Lista os fluxos navegáveis (exclui home, demo e a rota catch-all).
const flows = routes.filter(
  (r) => r.name && !['home', 'not-found'].includes(String(r.name)),
)
</script>

<template>
  <section class="mx-auto flex max-w-3xl flex-col gap-6 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold text-slate-800">Mobile Saúde</h1>
      <p class="text-slate-500">
        Índice de fluxos. Cada tela do Figma vira uma rota linkada aqui.
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2">
      <router-link
        v-for="flow in flows"
        :key="String(flow.name)"
        :to="flow.path"
        class="block no-underline"
      >
        <el-card shadow="hover" class="h-full transition hover:-translate-y-0.5">
          <div class="flex items-center justify-between">
            <span class="font-medium text-slate-800">
              {{ flow.meta?.title ?? flow.name }}
            </span>
            <span class="text-slate-400">→</span>
          </div>
          <p class="mt-1 text-sm text-slate-500">{{ flow.path }}</p>
        </el-card>
      </router-link>
    </div>
  </section>
</template>
