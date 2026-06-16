<script setup lang="ts">
// Tela de detalhe / jornada da ocorrência — compartilhada entre as visões
// Gestor e Atendente (o DashboardLayout já adapta a sidebar ao papel).
// Construção por partes: começamos pelo HEADER (Figma 7707:85572 · "Cenário
// Iniciado pelo APP / Detalhe"). Próximas partes: minifila + timeline da jornada.
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OcorrenciaDetalheHeader, {
  type AcaoOcorrencia,
} from '@/components/ocorrencias/OcorrenciaDetalheHeader.vue'
import PainelOcorrencia from '@/components/ocorrencias/PainelOcorrencia.vue'
import JornadaOcorrencia from '@/components/ocorrencias/JornadaOcorrencia.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import ModalFinalizar from '@/components/ocorrencias/modais/ModalFinalizar.vue'
import ModalEncaminhar from '@/components/ocorrencias/modais/ModalEncaminhar.vue'
import ModalVincular from '@/components/ocorrencias/modais/ModalVincular.vue'
import ModalCobrarSetor from '@/components/ocorrencias/modais/ModalCobrarSetor.vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'

const route = useRoute()
const store = useOcorrenciasStore()
const gestorStore = useGestorOcorrenciasStore()

onMounted(() => {
  store.load()
  gestorStore.load()
})

const id = computed(() => Number(route.params.id))
// A tela é compartilhada Gestor + Atendente. `?ctx=gestor` resolve o protocolo
// pela store do gestor (ids podem coincidir entre as duas fontes).
const ctxGestor = computed(() => route.query.ctx === 'gestor')

const dados = computed<{ protocolo: string; risco: boolean }>(() => {
  if (ctxGestor.value) {
    const c = gestorStore.cards.find((c) => c.id === id.value)
    return { protocolo: c?.protocolo ?? '—', risco: c?.risco ?? false }
  }
  const o = store.findById(id.value)
  return { protocolo: o?.protocol ?? '—', risco: o?.risk ?? false }
})

// SLA regulatório/interno ainda não estão no modelo de dados — mock fiel ao
// Figma por enquanto (próxima etapa liga à fonte real).
const slaRegulatorio = ref('14 min')
const slaInterno = ref('23 min')

// Coluna esquerda (painel Detalhe/Beneficiário/Widgets) colapsável.
const painelAberto = ref(true)

// Ações do header → abre o modal correspondente (reuso dos modais existentes).
const showFinalizar = ref(false)
const showEncaminhar = ref(false)
const showVincular = ref(false)
const showCobrar = ref(false)

function onAcao(cmd: AcaoOcorrencia) {
  const map: Record<AcaoOcorrencia, { value: boolean }> = {
    finalizar: showFinalizar,
    encaminhar: showEncaminhar,
    vincular: showVincular,
    cobrar: showCobrar,
  }
  map[cmd].value = true
}
</script>

<template>
  <DashboardLayout>
    <!-- 1) Header da ocorrência -->
    <OcorrenciaDetalheHeader
      class="-mx-6 -mt-6 mb-5"
      :protocolo="dados.protocolo"
      :risco="dados.risco"
      :sla-regulatorio="slaRegulatorio"
      :sla-interno="slaInterno"
      @acao="onAcao"
    />

    <!-- Container abaixo do header: 2 colunas (painel esquerdo + conteúdo) -->
    <div class="flex items-start">
      <!-- Coluna esquerda: painel Detalhe/Beneficiário/Widgets -->
      <aside v-show="painelAberto" class="w-[340px] shrink-0 self-stretch">
        <PainelOcorrencia />
      </aside>

      <!-- Divider + botão de colapsar/expandir -->
      <div class="relative shrink-0 self-stretch" :class="painelAberto ? 'mx-2 w-px' : 'mr-2'">
        <div v-if="painelAberto" class="h-full w-px bg-ms-border-light" />
        <button
          type="button"
          :aria-label="painelAberto ? 'Ocultar painel' : 'Mostrar painel'"
          class="absolute top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-ms-border-light bg-ms-surface text-ms-text-secondary shadow-sm transition hover:text-ms-primary"
          :class="painelAberto ? '-left-3.5' : 'left-0'"
          @click="painelAberto = !painelAberto"
        >
          <AppIcon :name="painelAberto ? 'chevron-left' : 'chevron-right'" class="h-4 w-4" />
        </button>
      </div>

      <!-- Coluna direita: jornada do atendimento (abas + conversa/timeline) -->
      <main class="min-w-0 flex-1 pl-2">
        <JornadaOcorrencia />
      </main>
    </div>

    <!-- Modais das ações (reuso) -->
    <ModalFinalizar v-model="showFinalizar" />
    <ModalEncaminhar v-model="showEncaminhar" />
    <ModalVincular v-model="showVincular" />
    <ModalCobrarSetor v-model="showCobrar" />
  </DashboardLayout>
</template>
