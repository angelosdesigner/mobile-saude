<script setup lang="ts">
// SlaBadge — estado de SLA do atendimento, sobre BaseBadge (cor + texto, nunca
// só cor). Fonte única do mapeamento estado → tom, usada em cards e listas.
import { computed } from 'vue'
import BaseBadge, { type BaseBadgeTone } from '@/components/base/BaseBadge.vue'

export type SlaState = 'Dentro' | 'Atenção' | 'Limite' | 'Estourou'

const props = defineProps<{ state: SlaState }>()

const toneByState: Record<SlaState, BaseBadgeTone> = {
  Dentro: 'success',
  Atenção: 'warning',
  Limite: 'warning',
  Estourou: 'danger',
}

const tone = computed(() => toneByState[props.state])
</script>

<template>
  <BaseBadge :tone="tone" :label="state" />
</template>
