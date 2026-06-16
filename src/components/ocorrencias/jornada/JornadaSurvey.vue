<script setup lang="ts">
// Convite de pesquisa de satisfação — cartão cinza com texto e seletor de nota
// (5 estrelas vazias). É uma mensagem enviada ao beneficiário pelo serviço,
// portanto alinhada à direita (lado do atendente). A resposta do beneficiário
// (JornadaSurveyResponse) fica à esquerda.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaTime from './JornadaTime.vue'

defineProps<{ text: string; time: string }>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col items-end">
    <div class="w-full max-w-[460px] rounded-xl bg-ms-fill-light px-5 py-4">
      <div class="flex items-center gap-2 text-ms-text-primary">
        <AppIcon name="star" class="h-4 w-4 text-ms-warning" />
        <span class="text-sm font-bold">Pesquisa de satisfação</span>
      </div>
      <p class="mt-2 text-sm text-ms-text-secondary">{{ text }}</p>
      <div class="mt-3 flex items-center gap-2">
        <span class="text-xs text-ms-text-secondary">Selecione uma Nota</span>
        <AppIcon v-for="n in 5" :key="n" name="star" class="h-5 w-5 text-ms-border" />
      </div>
    </div>
    <JornadaTime :time="time" align="right" />
  </div>
</template>
