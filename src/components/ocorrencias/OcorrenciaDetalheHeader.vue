<script setup lang="ts">
// Header da tela de detalhe da ocorrência (compartilhado entre as visões Gestor
// e Atendente) — Figma 7707:85612. Fica logo abaixo da navbar e reúne:
// protocolo + copiar · tag de risco jurídico · SLA regulatório · SLA interno ·
// botão "Ações". As ações emitem `acao` para o container abrir o modal certo
// (Finalizar / Encaminhar / Vincular protocolo / Cobrar setor).
import AppIcon from '@/components/ui/AppIcon.vue'

export type AcaoOcorrencia = 'finalizar' | 'encaminhar' | 'vincular' | 'cobrar'

withDefaults(
  defineProps<{
    protocolo: string
    /** Exibe a tag "Risco Jurídico Configurado" quando verdadeiro. */
    risco?: boolean
    /** SLA regulatório (ex.: "14 min"). Tom crítico/vermelho. */
    slaRegulatorio?: string
    /** SLA interno (ex.: "23 min"). Tom de atenção/âmbar. */
    slaInterno?: string
  }>(),
  { risco: false, slaRegulatorio: '', slaInterno: '' },
)

const emit = defineEmits<{ acao: [cmd: AcaoOcorrencia] }>()

const acoes: { cmd: AcaoOcorrencia; label: string }[] = [
  { cmd: 'finalizar', label: 'Finalizar a ocorrência' },
  { cmd: 'encaminhar', label: 'Encaminhar atendimento' },
  { cmd: 'vincular', label: 'Vincular protocolo' },
  { cmd: 'cobrar', label: 'Cobrar setor' },
]

async function copiarProtocolo(protocolo: string) {
  try {
    await navigator.clipboard.writeText(protocolo)
    ElMessage.success('Protocolo copiado')
  } catch {
    ElMessage.warning('Não foi possível copiar')
  }
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-ms-border-light bg-ms-surface px-4 py-2"
  >
    <!-- Protocolo + copiar -->
    <div class="flex min-w-0 items-center gap-2">
      <span class="shrink-0 text-sm text-ms-text-regular">Protocolo:</span>
      <span class="text-sm font-semibold break-all text-ms-text-primary">{{ protocolo }}</span>
      <el-tooltip content="Copiar protocolo" placement="top">
        <button
          type="button"
          aria-label="Copiar protocolo"
          class="flex shrink-0 items-center justify-center rounded p-1 text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-primary"
          @click="copiarProtocolo(protocolo)"
        >
          <AppIcon name="copy" class="h-4 w-4" />
        </button>
      </el-tooltip>
    </div>

    <!-- Tag de risco + SLAs + Ações -->
    <div class="ml-auto flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
      <span
        v-if="risco"
        class="rounded border border-ms-danger/50 px-2.5 py-px text-2xs font-semibold uppercase tracking-wide text-ms-danger"
      >
        Risco Jurídico Configurado
      </span>

      <span v-if="risco && slaRegulatorio" class="h-4 w-px bg-ms-border" />

      <span v-if="slaRegulatorio" class="flex items-center gap-1 text-sm text-ms-danger">
        <AppIcon name="clock" class="h-4 w-4" />
        SLA Regulatório: <b class="font-bold">{{ slaRegulatorio }}</b>
      </span>

      <span v-if="slaRegulatorio && slaInterno" class="h-4 w-px bg-ms-border" />

      <span v-if="slaInterno" class="flex items-center gap-1 text-sm text-ms-warning">
        <AppIcon name="clock" class="h-4 w-4" />
        SLA Interno: <b class="font-bold">{{ slaInterno }}</b>
      </span>

      <el-dropdown trigger="click" @command="emit('acao', $event)">
        <el-button type="primary">
          Ações
          <AppIcon name="more-horizontal" class="ml-1 h-4 w-4" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="a in acoes" :key="a.cmd" :command="a.cmd">
              {{ a.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
