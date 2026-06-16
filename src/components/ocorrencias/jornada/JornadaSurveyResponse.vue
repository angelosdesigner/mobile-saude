<script setup lang="ts">
// Resposta da pesquisa de satisfação — cartão à esquerda com pergunta/resposta
// separadas por divisores e barra vertical à esquerda.
import JornadaLabel from './JornadaLabel.vue'
import JornadaTime from './JornadaTime.vue'

defineProps<{ time: string; items: { q: string; a: string }[] }>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col items-start">
    <JornadaLabel text="Resposta de pesquisa" align="left" />
    <div class="w-full max-w-[460px] rounded-xl bg-ms-fill-light p-4">
      <div class="text-sm font-bold text-ms-text-primary">Pesquisa de satisfação</div>
      <div class="mt-3 border-l-2 border-ms-border-light pl-4">
        <div
          v-for="(it, i) in items"
          :key="i"
          class="border-ms-border-light/70 py-2"
          :class="i > 0 ? 'border-t' : ''"
        >
          <p class="text-xs text-ms-text-secondary">{{ it.q }}</p>
          <p class="mt-0.5 text-sm font-medium text-ms-text-primary">{{ it.a }}</p>
        </div>
      </div>
    </div>
    <JornadaTime :time="time" align="left" />
  </div>
</template>
