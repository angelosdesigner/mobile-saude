<script setup lang="ts">
// Ícones de "chrome" do app. Agora servidos pelo Lucide (@lucide/vue) — um
// sistema de ícones único e mantido, em vez de SVGs à mão. A API pública
// (<AppIcon name="chevron-left" class="h-4 w-4" />) é preservada: os call sites
// não mudam. Os nomes em kebab-case mapeiam para os componentes do Lucide.
//
// `class` (h-*/w-*/text-*) passa direto para o <svg> do Lucide e vence o
// width/height do `size` (CSS > atributo), então o dimensionamento continua
// pelas utilitárias. currentColor por padrão herda a cor do texto.
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Plus,
  Sun,
  Moon,
  Eye,
  Pencil,
  Copy,
  Clock,
  MoreHorizontal,
  FileText,
  File,
  MapPin,
  BarChart3,
  User,
  type LucideProps,
} from '@lucide/vue'
import type { Component } from 'vue'

const icons = {
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  search: Search,
  close: X,
  plus: Plus,
  sun: Sun,
  moon: Moon,
  eye: Eye,
  edit: Pencil,
  copy: Copy,
  clock: Clock,
  'more-horizontal': MoreHorizontal,
  'file-text': FileText,
  file: File,
  'map-pin': MapPin,
  'bar-chart': BarChart3,
  user: User,
} satisfies Record<string, Component>

withDefaults(defineProps<{ name: keyof typeof icons; size?: LucideProps['size'] }>(), {
  size: 16,
})
</script>

<template>
  <component :is="icons[name]" :size="size" />
</template>
