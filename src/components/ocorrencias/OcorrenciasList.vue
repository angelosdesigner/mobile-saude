<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import type { Ocorrencia } from '@/types/ocorrencias'
import { useActionFeedback } from '@/composables/useActionFeedback'

// Mesma fonte filtrada do Quadro; mesmo primitivo visual (DataList) da Lista do
// gestor, com as colunas próprias da visão do ATENDENTE.
const router = useRouter()
const { filteredList } = storeToRefs(useOcorrenciasStore())

const listColumns: DataListColumn[] = [
  { key: 'protocol', label: 'Protocolo', width: 170, sortable: true },
  { key: 'beneficiary', label: 'Beneficiário', minWidth: 220, sortable: true },
  { key: 'risk', label: 'Classificação de risco', minWidth: 200 },
  { key: 'tipo', label: 'Tipo de ocorrência', minWidth: 240 },
  { key: 'status', label: 'Status', width: 160 },
]

const { comingSoon } = useActionFeedback()

function onVisualizar(o: Ocorrencia) {
  router.push(`/ocorrencias/${o.id}`)
}
function onEditar(o: Ocorrencia) {
  ElMessage.info(`Editar: ${o.protocol}`)
}
</script>

<template>
  <DataList
    :columns="listColumns"
    :rows="filteredList"
    count-label="ocorrências"
    empty-text="Nenhuma ocorrência para os filtros aplicados"
    @visualizar="onVisualizar"
    @editar="onEditar"
  >
    <template #footer-actions>
      <el-button text type="primary" size="small" @click="comingSoon('Criar ocorrência')">
        <AppIcon name="plus" class="mr-1 h-3.5 w-3.5" />Criar
      </el-button>
    </template>
    <template #cell-risk="{ row }">
      <el-tag v-if="row.risk" type="danger" effect="plain" size="small" class="!uppercase">
        Risco Jurídico Configurado
      </el-tag>
      <span v-else class="text-ms-text-placeholder">—</span>
    </template>
    <template #cell-status="{ row }">
      <el-tag :type="row.statusType" effect="light" size="small">{{ row.status }}</el-tag>
    </template>

    <template #expand="{ row }">
      <dl class="grid grid-cols-2 gap-x-8 gap-y-1 text-xs md:grid-cols-4">
        <div>
          <dt class="text-ms-text-secondary">Assunto</dt>
          <dd class="text-ms-text-primary">{{ row.assunto }}</dd>
        </div>
        <div>
          <dt class="text-ms-text-secondary">Canal</dt>
          <dd class="text-ms-text-primary">{{ row.channel }}</dd>
        </div>
        <div>
          <dt class="text-ms-text-secondary">SLA</dt>
          <dd class="text-ms-text-primary">{{ row.sla }}</dd>
        </div>
        <div>
          <dt class="text-ms-text-secondary">Prioridade</dt>
          <dd class="text-ms-text-primary">{{ row.prioridade }}</dd>
        </div>
        <div>
          <dt class="text-ms-text-secondary">Tempo</dt>
          <dd class="text-ms-text-primary">{{ row.time }}</dd>
        </div>
        <div>
          <dt class="text-ms-text-secondary">Atendente</dt>
          <dd class="text-ms-text-primary">{{ row.atendente }}</dd>
        </div>
      </dl>
    </template>
  </DataList>
</template>
