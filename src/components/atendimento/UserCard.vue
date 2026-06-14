<script setup lang="ts">
// UserCard — identidade compacta (avatar + nome + meta) para atendente ou
// beneficiário. Avatar com iniciais (sem depender de imagem) e ponto de
// presença opcional combinado com texto (acessibilidade).
import { computed } from 'vue'

export type PresenceTone = 'online' | 'busy' | 'away' | 'offline'

const props = withDefaults(
  defineProps<{
    name: string
    /** Cargo/canal/linha secundária. */
    meta?: string
    /** Presença opcional (mostra ponto + rótulo). */
    presence?: PresenceTone | ''
    size?: 'sm' | 'md'
  }>(),
  { meta: '', presence: '', size: 'md' },
)

const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join(''),
)

const presenceMap: Record<PresenceTone, { dot: string; label: string }> = {
  online: { dot: 'bg-ms-success', label: 'Disponível' },
  busy: { dot: 'bg-ms-danger', label: 'Ocupado' },
  away: { dot: 'bg-ms-warning', label: 'Ausente' },
  offline: { dot: 'bg-ms-text-placeholder', label: 'Offline' },
}
const presenceInfo = computed(() => (props.presence ? presenceMap[props.presence] : null))
const avatarSize = computed(() => (props.size === 'sm' ? 'h-8 w-8 text-2xs' : 'h-10 w-10 text-xs'))
</script>

<template>
  <div class="flex items-center gap-3">
    <span
      class="flex shrink-0 items-center justify-center rounded-full bg-ms-primary-light font-semibold text-ms-primary"
      :class="avatarSize"
      aria-hidden="true"
      >{{ initials }}</span
    >
    <div class="min-w-0">
      <div class="truncate text-sm font-semibold text-ms-text-primary">{{ name }}</div>
      <div v-if="meta" class="truncate text-2xs text-ms-text-secondary">{{ meta }}</div>
      <div v-if="presenceInfo" class="mt-0.5 flex items-center gap-1.5 text-2xs text-ms-text-secondary">
        <span class="h-1.5 w-1.5 rounded-full" :class="presenceInfo.dot" />{{ presenceInfo.label }}
      </div>
    </div>
  </div>
</template>
