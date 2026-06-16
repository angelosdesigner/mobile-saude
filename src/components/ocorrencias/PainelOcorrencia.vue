<script setup lang="ts">
// Painel esquerdo da tela de detalhe da ocorrência (Figma 7707:85575 /
// 2988:24325 / 2988:30636). Abas: Detalhe · Beneficiário · Widgets.
//  • Detalhe / Beneficiário → seções colapsáveis (SecoesColapsaveis).
//  • Beneficiário tem ainda um card de perfil no topo.
//  • Widgets → busca + grade de atalhos.
import { computed, ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import SecoesColapsaveis from '@/components/ocorrencias/SecoesColapsaveis.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import {
  detalheSecoes,
  beneficiarioPerfil,
  beneficiarioSecoes,
  widgets,
  type WidgetTone,
} from '@/data/ocorrenciaDetalhe'

const { comingSoon } = useActionFeedback()

type Aba = 'detalhe' | 'beneficiario' | 'widgets'
const abas: { key: Aba; label: string }[] = [
  { key: 'detalhe', label: 'Detalhe' },
  { key: 'beneficiario', label: 'Beneficiário' },
  { key: 'widgets', label: 'Widgets' },
]
const abaAtiva = ref<Aba>('detalhe')

// Busca de widgets.
const buscaWidget = ref('')
const widgetsFiltrados = computed(() => {
  const q = buscaWidget.value.trim().toLowerCase()
  if (!q) return widgets
  return widgets.filter((w) => w.label.toLowerCase().includes(q))
})

const widgetTint: Record<WidgetTone, string> = {
  warning: 'bg-ms-warning/10 text-ms-warning',
  neutral: 'bg-ms-fill-light text-ms-text-secondary',
  primary: 'bg-ms-primary/10 text-ms-primary',
  success: 'bg-ms-success/10 text-ms-success',
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Abas (fill container: cada aba ocupa parte igual da largura) -->
    <div class="flex items-center border-b border-ms-border-light" role="tablist">
      <button
        v-for="a in abas"
        :key="a.key"
        type="button"
        role="tab"
        :aria-selected="abaAtiva === a.key"
        class="-mb-px flex-1 border-b-2 px-2 py-2 text-center text-sm font-medium transition"
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

    <!-- Conteúdo -->
    <div class="min-h-0 flex-1 overflow-y-auto pt-3">
      <!-- Detalhe -->
      <SecoesColapsaveis v-if="abaAtiva === 'detalhe'" :secoes="detalheSecoes" />

      <!-- Beneficiário -->
      <div v-else-if="abaAtiva === 'beneficiario'" class="space-y-3">
        <div
          class="flex items-center gap-3 rounded-lg border border-ms-border-light bg-ms-surface p-3"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ms-primary/10 text-ms-primary"
          >
            <AppIcon name="user" class="h-5 w-5" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="truncate font-bold text-ms-text-primary">{{ beneficiarioPerfil.nome }}</div>
            <div class="text-xs text-ms-text-secondary">{{ beneficiarioPerfil.papel }}</div>
          </div>
          <button
            type="button"
            aria-label="Ver perfil do beneficiário"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ms-primary text-ms-on-primary transition hover:brightness-95"
            @click="comingSoon('Perfil do beneficiário')"
          >
            <AppIcon name="chevron-right" class="h-4 w-4" />
          </button>
        </div>
        <SecoesColapsaveis :secoes="beneficiarioSecoes" />
      </div>

      <!-- Widgets -->
      <div v-else class="space-y-3">
        <el-input v-model="buscaWidget" placeholder="Buscar protocolo" clearable>
          <template #prefix><AppIcon name="search" class="h-4 w-4" /></template>
        </el-input>
        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="w in widgetsFiltrados"
            :key="w.label"
            type="button"
            class="flex flex-col items-center gap-2 rounded-lg border border-ms-border-light bg-ms-surface px-2 py-4 text-center transition hover:border-ms-primary/40 hover:shadow-sm"
            @click="comingSoon(w.label)"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-lg"
              :class="widgetTint[w.tone]"
            >
              <AppIcon :name="w.icon" class="h-5 w-5" />
            </span>
            <span class="text-xs font-medium leading-tight text-ms-text-primary">{{ w.label }}</span>
          </button>
        </div>
        <p
          v-if="!widgetsFiltrados.length"
          class="py-6 text-center text-xs text-ms-text-secondary"
        >
          Nenhum widget encontrado
        </p>
      </div>
    </div>
  </div>
</template>
