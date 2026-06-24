<script setup lang="ts">
// Cards inteligentes de insight executivo (gestão por exceção). Aparece nas 5
// subabas de Gestão e Performance → componente compartilhado.
// Visual minimalista (estilo Jira): card neutro + um único acento de cor (dot)
// por severidade; tag e CTA discretos.
import type { InsightExec } from '@/data/gestaoPerformancePainel'

defineProps<{
  title?: string
  items: InsightExec[]
}>()

const emit = defineEmits<{ (e: 'go-tab', tab: string): void }>()

// Único acento cromático: a bolinha de severidade.
const dot: Record<string, string> = {
  danger: 'bg-ms-danger',
  warning: 'bg-ms-warning',
  info: 'bg-ms-text-placeholder',
  success: 'bg-ms-text-placeholder',
}
</script>

<template>
  <section>
    <h3
      v-if="title"
      class="mb-2 text-2xs font-bold uppercase tracking-wide text-ms-text-secondary"
    >
      {{ title }}
    </h3>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <el-card
        v-for="(ins, i) in items"
        :key="i"
        shadow="never"
        body-class="!p-3"
        class="!border-ms-border-light"
      >
        <div class="flex items-start gap-2.5">
          <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="dot[ins.tipo]" aria-hidden="true" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium leading-snug text-ms-text-primary">{{ ins.texto }}</p>
            <div class="mt-2.5 flex items-center justify-between gap-2">
              <span
                class="rounded px-1.5 py-0.5 text-2xs font-medium text-ms-text-secondary bg-ms-fill-light"
                >{{ ins.tag }}</span
              >
              <button
                v-if="ins.acao"
                class="text-2xs font-semibold text-ms-primary hover:underline"
                @click="ins.acaoTab && emit('go-tab', ins.acaoTab)"
              >
                {{ ins.acao }} →
              </button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </section>
</template>
