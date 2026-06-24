<script setup lang="ts">
// SUBABA 3 · GARGALOS E SETORES — onde a operação está represada.
// Heatmap operacional em cards por setor (semáforo) + bloco lateral de alertas de SLA.
import { useRouter } from 'vue-router'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { setoresHeat, alertasGargalos, type SemaforoNivel } from '@/data/gestaoPerformancePainel'

const router = useRouter()
// Drill-down: cada card do heatmap abre o detalhe com o setor pré-selecionado.
function abrirSetor(chave: string) {
  router.push({ path: '/gestor/gargalos-detalhe', query: { setor: chave } })
}

// Minimalista: só problema recebe cor. "Saudável" fica neutro (cinza) — o
// heatmap destaca o que precisa de ação, não o que está bem.
const semaforo: Record<SemaforoNivel, { dot: string; label: string }> = {
  critico: { dot: 'bg-ms-danger', label: 'Crítico' },
  atencao: { dot: 'bg-ms-warning', label: 'Atenção' },
  ok: { dot: 'bg-ms-text-placeholder', label: 'Saudável' },
}
const ocupTone = (n: number) =>
  n >= 90 ? 'text-ms-danger' : n >= 75 ? 'text-ms-warning' : 'text-ms-text-regular'
const slaTone = (n: number) => (n > 0 ? 'text-ms-danger font-semibold' : 'text-ms-text-regular')
</script>

<template>
  <div class="space-y-7">
    <SectionHeader
      title="Heatmap operacional"
      subtitle="Capacidade, atraso e SLA por setor · destaque para atenção e crítico"
      action-to="/gestor/gargalos-detalhe"
      class="mb-0"
    />

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Heatmap (cards por setor) -->
      <div class="lg:col-span-2">
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <el-card
            v-for="s in setoresHeat"
            :key="s.setor"
            shadow="never"
            body-class="!p-3.5"
            class="cursor-pointer !border-ms-border-light transition hover:shadow-md"
            role="button"
            :tabindex="0"
            @click="abrirSetor(s.chave)"
            @keydown.enter="abrirSetor(s.chave)"
          >
            <!-- Cabeçalho -->
            <div class="mb-2.5 flex items-center justify-between gap-2">
              <span class="truncate text-sm font-bold text-ms-text-primary">{{ s.setor }}</span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full" :class="semaforo[s.nivel].dot" />
                <span class="text-2xs font-medium text-ms-text-secondary">{{ semaforo[s.nivel].label }}</span>
              </span>
            </div>

            <!-- Métricas -->
            <div class="grid grid-cols-3 gap-y-2.5 text-center">
              <div>
                <p class="text-base font-bold text-ms-text-primary">{{ s.fila }}</p>
                <p class="text-2xs text-ms-text-secondary">Fila</p>
              </div>
              <div>
                <p class="text-base font-bold text-ms-text-primary">{{ s.emAtendimento }}</p>
                <p class="text-2xs text-ms-text-secondary">Em atend.</p>
              </div>
              <div>
                <p class="text-base font-bold" :class="slaTone(s.slaEstourado)">
                  {{ s.slaEstourado === 0 ? '—' : s.slaEstourado }}
                </p>
                <p class="text-2xs text-ms-text-secondary">SLA estour.</p>
              </div>
            </div>

            <!-- Ocupação (barra) -->
            <div class="mt-3">
              <div class="mb-1 flex items-center justify-between text-2xs">
                <span class="text-ms-text-secondary">Ocupação</span>
                <span class="font-semibold" :class="ocupTone(s.ocupacao)">{{ s.ocupacao }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
                <div class="h-full rounded-full bg-ms-text-placeholder" :style="{ width: `${s.ocupacao}%` }" />
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Bloco lateral de alertas (neutro · cor só no rótulo/sinal) -->
      <aside class="space-y-3">
        <h3 class="text-2xs font-bold uppercase tracking-wide text-ms-text-secondary">Alertas de SLA</h3>
        <div class="rounded-lg border border-ms-border-light bg-ms-surface px-3 py-3">
          <p class="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-ms-danger">
            <span class="h-1.5 w-1.5 rounded-full bg-ms-danger" />SLA interno estourado
          </p>
          <p class="mt-1 text-2xl font-bold text-ms-text-primary">{{ alertasGargalos.estouradosInternos }}</p>
          <p class="mt-0.5 text-2xs text-ms-text-secondary">tickets · mais antigo há {{ alertasGargalos.maisAntigoHa }}</p>
        </div>
        <div class="rounded-lg border border-ms-border-light bg-ms-surface px-3 py-3">
          <p class="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-ms-warning">
            <span class="h-1.5 w-1.5 rounded-full bg-ms-warning" />Próximos vencimentos
          </p>
          <p class="mt-1 text-2xl font-bold text-ms-text-primary">{{ alertasGargalos.vencimento24h }}</p>
          <p class="mt-0.5 text-2xs text-ms-text-secondary">vencem em 24h · {{ alertasGargalos.vencimento4h }} em 4h</p>
        </div>
        <div class="rounded-lg border border-ms-border-light bg-ms-surface px-3 py-3">
          <p class="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-ms-danger">
            <span class="h-1.5 w-1.5 rounded-full bg-ms-danger" />Próximo SLA crítico
          </p>
          <p class="mt-1 text-2xl font-bold text-ms-danger">{{ alertasGargalos.proxCriticoEm }}</p>
          <p class="mt-0.5 text-2xs text-ms-text-secondary">vencimento grave iminente</p>
        </div>
      </aside>
    </div>
  </div>
</template>
