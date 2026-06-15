<script setup lang="ts">
// Tela de detalhe / jornada da ocorrência — compartilhada entre as visões
// Gestor e Atendente (o DashboardLayout já adapta a sidebar ao papel).
// Construção por partes: começamos pelo HEADER (Figma 7707:85572 · "Cenário
// Iniciado pelo APP / Detalhe"). Próximas partes: minifila + timeline da jornada.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OcorrenciaDetalheHeader, {
  type AcaoOcorrencia,
} from '@/components/ocorrencias/OcorrenciaDetalheHeader.vue'
import ModalFinalizar from '@/components/ocorrencias/modais/ModalFinalizar.vue'
import ModalEncaminhar from '@/components/ocorrencias/modais/ModalEncaminhar.vue'
import ModalVincular from '@/components/ocorrencias/modais/ModalVincular.vue'
import ModalCobrarSetor from '@/components/ocorrencias/modais/ModalCobrarSetor.vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

const route = useRoute()
const router = useRouter()
const store = useOcorrenciasStore()

onMounted(() => store.load())

const id = computed(() => Number(route.params.id))
const oc = computed(() => store.findById(id.value))

// SLA regulatório/interno ainda não estão no modelo de dados — mock fiel ao
// Figma por enquanto (próxima etapa liga à fonte real).
const slaRegulatorio = ref('14 min')
const slaInterno = ref('23 min')

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
      :protocolo="oc?.protocol ?? '—'"
      :risco="oc?.risk ?? false"
      :sla-regulatorio="slaRegulatorio"
      :sla-interno="slaInterno"
      @acao="onAcao"
    />

    <!-- Corpo da jornada — próximas etapas (minifila + timeline) -->
    <div
      class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ms-border-light py-16 text-center"
    >
      <p class="text-sm font-medium text-ms-text-primary">Jornada do atendimento</p>
      <p class="text-xs text-ms-text-secondary">
        Próximas etapas: minifila de atendimento + timeline da ocorrência.
      </p>
      <button
        class="mt-2 text-xs font-medium text-ms-primary hover:underline"
        @click="router.push('/gestor/ocorrencias')"
      >
        ← Voltar às ocorrências
      </button>
    </div>

    <!-- Modais das ações (reuso) -->
    <ModalFinalizar v-model="showFinalizar" />
    <ModalEncaminhar v-model="showEncaminhar" />
    <ModalVincular v-model="showVincular" />
    <ModalCobrarSetor v-model="showCobrar" />
  </DashboardLayout>
</template>
