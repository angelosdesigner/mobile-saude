<script setup lang="ts">
// Coluna direita da tela de detalhe da ocorrência (Figma 7707:87922 / 7707:87926).
// Área com abas + controles:
//  • Abas: Conversa (timeline/jornada) · Históricos · Eventos · Dados de
//    pagamento · Transcrição da guia.
//  • Controles: filtros (Tipo de atendimento, Tipo de mensagem) · participantes
//    (avatares) · botão de filtro.
// A timeline da "Conversa" será construída na próxima etapa (placeholder por ora).
import { ref } from 'vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import TimelineJornada from '@/components/ocorrencias/TimelineJornada.vue'

const { comingSoon } = useActionFeedback()

type Aba = 'conversa' | 'historicos' | 'eventos' | 'pagamento' | 'transcricao'
const abas: { key: Aba; label: string }[] = [
  { key: 'conversa', label: 'Conversa' },
  { key: 'historicos', label: 'Históricos' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'pagamento', label: 'Dados de pagamento' },
  { key: 'transcricao', label: 'Transcrição da guia' },
]
const abaAtiva = ref<Aba>('conversa')

// Filtros da conversa.
const tipoAtendimento = ref('')
const tipoMensagem = ref('')
const tiposAtendimento = ['Atendimento automatizado', 'Atendimento humano']
const tiposMensagem = ['Cliente', 'Atendente', 'Sistema']

// Participantes (avatares sobrepostos + contagem extra).
const participantes = [
  { nome: 'Maria Souza', iniciais: 'MS', tone: 'bg-ms-primary' },
  { nome: 'Juliana Santos', iniciais: 'JS', tone: 'bg-ms-success' },
]
const extraParticipantes = 1
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Abas -->
    <div
      class="flex items-center gap-1 overflow-x-auto border-b border-ms-border-light"
      role="tablist"
    >
      <button
        v-for="a in abas"
        :key="a.key"
        type="button"
        role="tab"
        :aria-selected="abaAtiva === a.key"
        class="-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition"
        :class="
          abaAtiva === a.key
            ? 'border-ms-primary text-ms-primary'
            : 'border-transparent text-ms-text-secondary hover:text-ms-text-primary'
        "
        @click="abaAtiva = a.key"
      >
        {{ a.label }}
      </button>
    </div>

    <!-- Controles -->
    <div class="flex flex-wrap items-center gap-2 py-3">
      <el-select v-model="tipoAtendimento" placeholder="Tipo de atendimento" clearable class="!w-44">
        <el-option v-for="t in tiposAtendimento" :key="t" :label="t" :value="t" />
      </el-select>
      <el-select v-model="tipoMensagem" placeholder="Tipo de mensagem" clearable class="!w-44">
        <el-option v-for="t in tiposMensagem" :key="t" :label="t" :value="t" />
      </el-select>

      <!-- Participantes + filtro (à direita) -->
      <div class="ml-auto flex items-center gap-2">
        <el-tooltip
          v-for="p in participantes"
          :key="p.nome"
          :content="p.nome"
          placement="top"
        >
          <span
            class="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ms-surface text-2xs font-semibold text-ms-on-primary first:ml-0"
            :class="p.tone"
            >{{ p.iniciais }}</span
          >
        </el-tooltip>
        <span
          v-if="extraParticipantes"
          class="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ms-surface bg-ms-fill-light text-2xs font-semibold text-ms-text-secondary"
          >+{{ extraParticipantes }}</span
        >
        <span class="mx-1 h-5 w-px bg-ms-border" />
        <button
          type="button"
          aria-label="Filtrar conversa"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-ms-border-light text-ms-text-secondary transition hover:border-ms-primary/40 hover:text-ms-primary"
          @click="comingSoon('Filtrar conversa')"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Conteúdo -->
    <div class="min-h-0 flex-1 overflow-y-auto pr-1">
      <!-- Conversa: timeline completa da jornada (multicanal) -->
      <TimelineJornada v-if="abaAtiva === 'conversa'" />

      <!-- Demais abas: ainda em construção -->
      <div
        v-else
        class="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ms-border-light text-center"
      >
        <p class="text-sm font-medium text-ms-text-primary">
          {{ abas.find((a) => a.key === abaAtiva)?.label }}
        </p>
        <p class="text-xs text-ms-text-secondary">Conteúdo em construção (próxima etapa).</p>
      </div>
    </div>
  </div>
</template>
