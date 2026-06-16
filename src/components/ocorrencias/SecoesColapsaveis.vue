<script setup lang="ts">
// Acordeão de seções rótulo/valor das abas do painel da ocorrência (Detalhe e
// Beneficiário). Cada seção é um card colapsável; grupos podem ter subtítulo
// (ex.: Solicitante/Beneficiário). Reutilizado entre as abas.
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { DetalheSecao } from '@/data/ocorrenciaDetalhe'

const props = defineProps<{ secoes: DetalheSecao[] }>()

const abertas = ref<Record<string, boolean>>(
  Object.fromEntries(props.secoes.map((s) => [s.titulo, true])),
)
function alternar(titulo: string) {
  abertas.value[titulo] = !abertas.value[titulo]
}

const toneClass: Record<'success' | 'warning' | 'danger', string> = {
  success: 'text-ms-success',
  warning: 'text-ms-warning',
  danger: 'text-ms-danger',
}
</script>

<template>
  <div class="space-y-3">
    <section
      v-for="secao in secoes"
      :key="secao.titulo"
      class="rounded-lg border border-ms-border-light bg-ms-surface"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-3 py-2.5 text-left"
        :aria-expanded="abertas[secao.titulo]"
        @click="alternar(secao.titulo)"
      >
        <span class="text-sm font-bold text-ms-text-primary">{{ secao.titulo }}</span>
        <AppIcon
          name="chevron-down"
          class="h-4 w-4 text-ms-text-secondary transition-transform"
          :class="abertas[secao.titulo] ? '' : '-rotate-90'"
        />
      </button>

      <div v-show="abertas[secao.titulo]" class="space-y-3 px-3 pb-3">
        <div v-for="(grupo, gi) in secao.grupos" :key="gi" class="space-y-2.5">
          <div
            v-if="grupo.titulo"
            class="border-t border-ms-border-lighter pt-2 text-sm font-semibold text-ms-text-primary first:border-t-0 first:pt-0"
          >
            {{ grupo.titulo }}
          </div>
          <div v-for="campo in grupo.campos" :key="campo.label">
            <div class="text-2xs text-ms-text-secondary">{{ campo.label }}</div>
            <div v-if="campo.chips" class="mt-1 flex flex-wrap gap-1.5">
              <span
                v-for="t in campo.chips"
                :key="t"
                class="inline-flex items-center rounded border border-ms-border-light bg-ms-fill-light px-2 py-0.5 text-2xs text-ms-text-regular"
                >{{ t }}</span
              >
            </div>
            <div
              v-else
              class="text-sm font-medium"
              :class="campo.tone ? toneClass[campo.tone] : 'text-ms-text-primary'"
            >
              {{ campo.value }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
