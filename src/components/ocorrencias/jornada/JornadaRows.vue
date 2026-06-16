<script setup lang="ts">
// Lista de linhas "Rótulo: valor" (rótulo em cinza, valor em negrito) — o padrão
// de informação mais repetido da timeline.
//  • `cols=2` → duas colunas com DIVISOR VERTICAL central (coluna esquerda à
//    direita do texto, coluna direita à esquerda, divididas por uma linha).
//  • valores com ` · ` (ex.: "protocolo · data") são quebrados com um divisor
//    vertical entre os segmentos.
import type { JornadaRow } from '@/data/ocorrenciaJornada'

withDefaults(
  defineProps<{ rows: JornadaRow[]; cols?: 1 | 2; align?: 'left' | 'center' }>(),
  { cols: 1, align: 'left' },
)

function segs(value: string) {
  return value.split(' · ')
}
</script>

<template>
  <!-- 2 colunas com divisor vertical central -->
  <div v-if="cols === 2" class="grid grid-cols-2 gap-y-1 text-xs">
    <p
      v-for="(r, i) in rows"
      :key="i"
      class="text-ms-text-secondary"
      :class="i % 2 === 0 ? 'pr-4 text-right' : 'border-l border-ms-border-light pl-4 text-left'"
    >
      <template v-if="r.label">{{ r.label }}: </template>
      <span class="font-semibold text-ms-text-primary">{{ r.value }}</span>
    </p>
  </div>

  <!-- 1 coluna -->
  <div v-else class="space-y-1 text-xs" :class="align === 'center' ? 'text-center' : ''">
    <p v-for="(r, i) in rows" :key="i" class="text-ms-text-secondary">
      <template v-if="r.label">{{ r.label }}: </template>
      <template v-for="(s, si) in segs(r.value)" :key="si">
        <span
          v-if="si > 0"
          class="mx-2 inline-block h-3 w-px translate-y-[2px] bg-ms-border-light"
        />
        <span class="font-semibold text-ms-text-primary">{{ s }}</span>
      </template>
    </p>
  </div>
</template>
