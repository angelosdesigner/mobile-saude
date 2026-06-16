<script setup lang="ts">
// Timeline completa da jornada do atendimento (aba "Conversa") — fiel ao Figma
// `7383:78371` (painel multicanal: App / WhatsApp / Telefone-URA / Chat-BOT).
//
// Este componente é só o DESPACHANTE: percorre a `jornadaTimeline` e renderiza
// o componente de card certo para cada `kind`. Cada tipo de card vive em
// `jornada/` e é autocontido (props tipadas) — reutilizável e pronto para o
// Design System (Storybook). `v-bind="item"` repassa os campos do item como
// props; o `inheritAttrs: false` de cada card evita que o `kind` vaze no DOM.
import type { Component } from 'vue'
import { jornadaTimeline, type JornadaItem } from '@/data/ocorrenciaJornada'
import JornadaDivider from './jornada/JornadaDivider.vue'
import JornadaEvent from './jornada/JornadaEvent.vue'
import JornadaChatPill from './jornada/JornadaChatPill.vue'
import JornadaBubble from './jornada/JornadaBubble.vue'
import JornadaNote from './jornada/JornadaNote.vue'
import JornadaTemplate from './jornada/JornadaTemplate.vue'
import JornadaSystem from './jornada/JornadaSystem.vue'
import JornadaNotification from './jornada/JornadaNotification.vue'
import JornadaSurvey from './jornada/JornadaSurvey.vue'
import JornadaSurveyResponse from './jornada/JornadaSurveyResponse.vue'
import JornadaForm from './jornada/JornadaForm.vue'

const cards: Record<JornadaItem['kind'], Component> = {
  divider: JornadaDivider,
  event: JornadaEvent,
  chatPill: JornadaChatPill,
  bubble: JornadaBubble,
  note: JornadaNote,
  template: JornadaTemplate,
  system: JornadaSystem,
  notification: JornadaNotification,
  survey: JornadaSurvey,
  surveyResponse: JornadaSurveyResponse,
  form: JornadaForm,
}
</script>

<template>
  <div class="flex flex-col gap-4 py-2">
    <component
      :is="cards[item.kind]"
      v-for="(item, i) in jornadaTimeline"
      :key="i"
      v-bind="item"
    />
  </div>
</template>
