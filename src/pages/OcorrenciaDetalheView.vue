<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import ModalNovaLigacao from '@/components/ocorrencias/modais/ModalNovaLigacao.vue'
import ModalEnviarTemplate from '@/components/ocorrencias/modais/ModalEnviarTemplate.vue'
import ModalEncaminhar from '@/components/ocorrencias/modais/ModalEncaminhar.vue'
import ModalFinalizar from '@/components/ocorrencias/modais/ModalFinalizar.vue'
import ModalVideochamada from '@/components/ocorrencias/modais/ModalVideochamada.vue'
import ModalAnexar from '@/components/ocorrencias/modais/ModalAnexar.vue'
import ModalCobrarSetor from '@/components/ocorrencias/modais/ModalCobrarSetor.vue'
import ModalVincular from '@/components/ocorrencias/modais/ModalVincular.vue'
import FloatingActions from '@/components/ocorrencias/FloatingActions.vue'
import CopilotButton from '@/components/ocorrencias/CopilotButton.vue'
import FloatingDock from '@/components/ocorrencias/FloatingDock.vue'

const route = useRoute()
const router = useRouter()
const store = useOcorrenciasStore()

onMounted(() => store.load())

// Floating actions / cenários
const showLigacao = ref(false)
const showTemplate = ref(false)
const showEncaminhar = ref(false)
const showFinalizar = ref(false)
const showVideo = ref(false)
const showAnexar = ref(false)
const showCobrar = ref(false)
const showVincular = ref(false)

function onAcao(cmd: string) {
  const map: Record<string, { value: boolean }> = {
    ligacao: showLigacao,
    template: showTemplate,
    finalizar: showFinalizar,
    encaminhar: showEncaminhar,
    vincular: showVincular,
    cobrar: showCobrar,
    video: showVideo,
    anexar: showAnexar,
  }
  if (map[cmd]) map[cmd].value = true
}

const id = computed(() => Number(route.params.id))
const oc = computed(() => store.findById(id.value))

// Conversa/timeline (semente mock, no espírito do detalhe-chat do Figma).
// Estado real (não computed) para permitir o envio de novas mensagens.
type MensagemAutor = 'cliente' | 'sistema' | 'atendente'
interface Mensagem {
  from: MensagemAutor
  text: string
  time: string
}

const reply = ref('')
const messages = ref<Mensagem[]>([])

watch(
  oc,
  (value) => {
    messages.value = value
      ? [
          { from: 'cliente', text: `Olá, ${value.tipo.toLowerCase()}.`, time: '14:58' },
          { from: 'sistema', text: `Atendimento iniciado via ${value.channel}.`, time: '14:59' },
          {
            from: 'atendente',
            text: 'Olá! Já estou verificando sua solicitação, um momento por favor.',
            time: '15:01',
          },
          { from: 'cliente', text: 'Obrigada!', time: '15:02' },
        ]
      : []
  },
  { immediate: true },
)

function sendReply() {
  const text = reply.value.trim()
  if (!text) return
  messages.value.push({
    from: 'atendente',
    text,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  })
  reply.value = ''
}

const dados = computed(() =>
  oc.value
    ? [
        { label: 'Protocolo', value: oc.value.protocol },
        { label: 'Tipo de ocorrência', value: oc.value.tipoOcorrencia },
        { label: 'Assunto', value: oc.value.assunto },
        { label: 'SLA', value: oc.value.sla },
        { label: 'Prioridade', value: oc.value.prioridade },
        { label: 'Canal', value: oc.value.channel },
        { label: 'Atendente', value: oc.value.atendente },
      ]
    : [],
)
</script>

<template>
  <DashboardLayout>
    <!-- Carregando -->
    <div
      v-if="store.loading"
      v-loading="true"
      class="flex justify-center py-20 text-ms-text-secondary"
    />

    <div v-else-if="oc">
      <!-- Cabeçalho -->
      <div class="mb-5 flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <el-button
            circle
            text
            aria-label="Voltar para Ocorrências"
            @click="router.push('/ocorrencias')"
          >
            <AppIcon name="chevron-left" class="h-4 w-4" />
          </el-button>
          <div>
            <div class="text-xs text-ms-text-secondary">Ocorrência · {{ oc.protocol }}</div>
            <h1 class="text-2xl font-bold text-ms-text-primary">{{ oc.beneficiary }}</h1>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <el-tag :type="oc.statusType" effect="light" size="small">{{ oc.status }}</el-tag>
              <el-tag v-if="oc.risk" type="danger" effect="plain" size="small" class="!uppercase"
                >Risco Jurídico Configurado</el-tag
              >
              <el-tag
                :type="oc.timeType"
                :effect="oc.timeType === 'danger' ? 'dark' : 'light'"
                size="small"
                round
                >{{ oc.time }}</el-tag
              >
            </div>
          </div>
        </div>
        <!-- As floating actions ficam na barra flutuante (abaixo). -->
        <div class="text-xs text-ms-text-placeholder">Atendimento #{{ oc.id }}</div>
      </div>

      <div class="grid gap-5 lg:grid-cols-3">
        <!-- Conversa -->
        <el-card shadow="always" body-class="!p-0" class="lg:col-span-2 !border-ms-border-light">
          <div
            class="border-b border-ms-border-lighter px-5 py-3 text-sm font-bold uppercase text-ms-text-primary"
          >
            Conversa
          </div>
          <div class="flex max-h-[460px] flex-col gap-3 overflow-y-auto px-5 py-4">
            <div
              v-for="(m, i) in messages"
              :key="i"
              class="flex"
              :class="
                m.from === 'atendente'
                  ? 'justify-end'
                  : m.from === 'sistema'
                    ? 'justify-center'
                    : 'justify-start'
              "
            >
              <div
                v-if="m.from === 'sistema'"
                class="rounded-full bg-ms-fill-light px-3 py-1 text-xs text-ms-text-secondary"
              >
                {{ m.text }}
              </div>
              <div
                v-else
                class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
                :class="
                  m.from === 'atendente'
                    ? 'bg-ms-primary text-white'
                    : 'bg-ms-fill-light text-ms-text-primary'
                "
              >
                {{ m.text }}
                <div
                  class="mt-1 text-[10px]"
                  :class="m.from === 'atendente' ? 'text-white/70' : 'text-ms-text-placeholder'"
                >
                  {{ m.time }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 border-t border-ms-border-lighter px-5 py-3">
            <el-input
              v-model="reply"
              placeholder="Escreva uma mensagem..."
              @keyup.enter="sendReply"
            />
            <el-button type="primary" :disabled="!reply.trim()" @click="sendReply"
              >Enviar</el-button
            >
          </div>
        </el-card>

        <!-- Dados -->
        <el-card shadow="always" class="!border-ms-border-light">
          <div class="mb-3 text-sm font-bold uppercase text-ms-text-primary">
            Dados do atendimento
          </div>
          <dl class="space-y-3">
            <div v-for="d in dados" :key="d.label">
              <dt class="text-[11px] text-ms-text-secondary">{{ d.label }}</dt>
              <dd class="text-sm font-medium text-ms-text-primary">{{ d.value }}</dd>
            </div>
          </dl>
        </el-card>
      </div>
    </div>

    <!-- Ocorrência não encontrada -->
    <EmptyState
      v-else
      title="Ocorrência não encontrada"
      description="O protocolo informado não existe ou foi removido."
    >
      <el-button type="primary" @click="router.push('/ocorrencias')">
        Voltar para Ocorrências
      </el-button>
    </EmptyState>

    <!-- Modais das floating actions -->
    <ModalNovaLigacao v-model="showLigacao" :name="oc?.beneficiary" />
    <ModalEnviarTemplate v-model="showTemplate" />
    <ModalEncaminhar v-model="showEncaminhar" />
    <ModalFinalizar v-model="showFinalizar" />
    <ModalVideochamada v-model="showVideo" :name="oc?.beneficiary" />
    <ModalAnexar v-model="showAnexar" />
    <ModalCobrarSetor v-model="showCobrar" />
    <ModalVincular v-model="showVincular" />

    <!-- Floating actions bar + Copilot — arrastável; inicia no rodapé (40px) -->
    <FloatingDock v-if="oc">
      <FloatingActions @action="onAcao" />
      <CopilotButton />
    </FloatingDock>
  </DashboardLayout>
</template>
