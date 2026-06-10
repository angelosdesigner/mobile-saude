<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6 p-8">
    <h1 class="text-2xl font-bold text-slate-800">
      Vue 3 + Element Plus + Tailwind v4
    </h1>

    <!-- Button row: proves the CSS-layer conflict is resolved -->
    <el-card shadow="never" class="p-4">
      <template #header>
        <span class="font-medium text-slate-700">Botões</span>
      </template>

      <div class="flex flex-wrap items-center gap-4">
        <!-- 1) Native Element Plus look — untouched by Tailwind preflight -->
        <el-button type="primary">El-Button nativo</el-button>

        <!-- 2) Element Plus button receiving Tailwind utilities (spacing + shadow) -->
        <el-button class="mt-4 shadow-lg">El-Button + Tailwind</el-button>

        <!-- 3) Conflict probe: Tailwind background/border on an <el-*>.
             If utilities win the cascade, this turns emerald green. -->
        <el-button class="border-0 bg-emerald-500 text-white hover:bg-emerald-600">
          El-Button + bg-emerald-500
        </el-button>

        <!-- 4) Plain HTML button styled only with Tailwind -->
        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-md transition hover:bg-indigo-700"
        >
          Botão HTML puro
        </button>
      </div>
    </el-card>

    <!-- Form layout built with Tailwind utilities, EP inputs inside -->
    <el-card shadow="never">
      <div class="flex flex-col gap-4 p-2">
        <el-input v-model="name" placeholder="Digite seu nome" clearable />
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-500">Olá,</span>
          <span class="font-semibold text-slate-800">{{ name || '...' }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>
