<script setup lang="ts">
// Envio do formulário (reembolso) — beneficiário, à esquerda. Espelha fielmente
// o componente do Figma `8453:29730` ("Vários formulários resumidos"), que vem
// de outra tela/plataforma: seção "Tipo de Reembolso" com N formulários
// resumidos (FormularioResumido) e seção "Complemento" → "Dados para pagamento"
// (campos rótulo/valor separados por divisores). Largura nativa do componente
// (430px), mantida conforme o design.
import JornadaLabel from './JornadaLabel.vue'
import FormularioResumido from '@/components/forms/FormularioResumido.vue'
import type { JornadaRow } from '@/data/ocorrenciaJornada'

defineProps<{
  title: string
  itemsTitle: string
  items: JornadaRow[][]
  complementoTitle: string
  pagamentoTitle: string
  pagamento: JornadaRow[]
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col items-start">
    <JornadaLabel :text="title" align="left" />
    <div class="w-full max-w-[430px] space-y-4 rounded-lg bg-ms-fill-light p-4">
      <!-- Seção: Tipo de Reembolso -->
      <section class="space-y-2">
        <h4 class="text-sm font-bold leading-5 text-ms-text-primary">{{ itemsTitle }}</h4>
        <div class="space-y-4">
          <FormularioResumido
            v-for="(grp, i) in items"
            :key="i"
            :numero="i + 1"
            :campos="grp"
          />
        </div>
      </section>

      <!-- Seção: Complemento → Dados para pagamento -->
      <section class="space-y-2">
        <h4 class="text-sm font-bold leading-5 text-ms-text-primary">{{ complementoTitle }}</h4>
        <div class="space-y-2.5 rounded-[10px] p-2">
          <p class="text-sm font-bold leading-5 text-ms-text-regular">{{ pagamentoTitle }}</p>
          <div class="flex flex-col gap-4">
            <template v-for="(r, i) in pagamento" :key="i">
              <div class="flex flex-col gap-0.5">
                <p class="text-xs leading-4 text-ms-text-regular">{{ r.label }}</p>
                <p class="text-sm font-medium leading-5 text-ms-text-primary">{{ r.value }}</p>
              </div>
              <span v-if="i < pagamento.length - 1" class="h-px w-full bg-ms-border-light" />
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
