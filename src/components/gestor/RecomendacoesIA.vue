<script setup lang="ts">
// Bloco "Recomendações IA" das telas de detalhe do gestor: diagnóstico (com
// selo IA + confiança) + cartões de ação numerados (impacto + CTA). Padrão
// único reutilizado entre Operação por Canal, Central de Automação, etc.
import ChartCard from '@/components/gestor/ChartCard.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import type { RecomendacaoIA } from '@/components/gestor/recomendacoesIA'

withDefaults(
  defineProps<{
    /** Título da seção. Padrão "Insights da IA" (seção 5 das telas de detalhe). */
    title?: string
    subtitle?: string
    diagnosticoTitulo?: string
    confianca: string
    texto: string
    recomendacoes: RecomendacaoIA[]
  }>(),
  { title: 'Insights da IA', subtitle: undefined, diagnosticoTitulo: 'Diagnóstico' },
)

const { comingSoon } = useActionFeedback()
</script>

<template>
  <ChartCard :title="title" :subtitle="subtitle">
    <div class="mb-3 rounded-lg border border-ms-primary/20 bg-ms-primary/5 p-3">
      <div class="mb-1 flex flex-wrap items-center gap-2">
        <span class="text-sm font-bold text-ms-text-primary">{{ diagnosticoTitulo }}</span>
        <span class="rounded bg-ms-primary px-1.5 py-0.5 text-2xs font-bold uppercase text-white"
          >IA</span
        >
        <span class="ml-auto text-2xs text-ms-text-secondary">{{ confianca }}</span>
      </div>
      <p class="text-xs leading-relaxed text-ms-text-regular">{{ texto }}</p>
    </div>

    <div class="grid gap-3 lg:grid-cols-3">
      <div
        v-for="(r, i) in recomendacoes"
        :key="r.titulo"
        class="flex flex-col rounded-lg border p-3"
        :class="r.destaque ? 'border-ms-primary/40 bg-ms-primary/5' : 'border-ms-border-light'"
      >
        <div class="flex items-center gap-2">
          <span
            class="flex h-5 w-5 items-center justify-center rounded-full bg-ms-primary/10 text-2xs font-bold text-ms-primary"
            >{{ i + 1 }}</span
          >
          <span class="text-sm font-semibold text-ms-text-primary">{{ r.titulo }}</span>
        </div>
        <p class="mt-2 flex-1 text-xs text-ms-text-secondary">{{ r.corpo }}</p>
        <div class="mt-2 rounded bg-ms-fill-light px-2 py-1 text-2xs font-medium text-ms-text-regular">
          IMPACTO: {{ r.impacto }}
        </div>
        <el-button
          :type="r.destaque ? 'primary' : 'default'"
          size="small"
          class="mt-2"
          @click="comingSoon(r.acao)"
        >
          {{ r.acao }}
        </el-button>
      </div>
    </div>
  </ChartCard>
</template>
