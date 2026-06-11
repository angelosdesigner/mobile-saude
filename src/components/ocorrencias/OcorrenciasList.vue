<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useOcorrenciasStore } from '@/stores/ocorrencias'

// Mesma fonte filtrada do Quadro.
const { filteredList } = storeToRefs(useOcorrenciasStore())

const page = ref(1)
const pageSize = ref(100)
</script>

<template>
  <el-card shadow="never" body-class="!p-0" class="!border-ms-border-light">
    <el-table
      :data="filteredList"
      style="width: 100%"
      stripe
      empty-text="Nenhuma ocorrência para os filtros aplicados"
    >
      <el-table-column type="selection" width="48" />
      <el-table-column prop="protocol" label="Protocolo" sortable width="180" />
      <el-table-column prop="beneficiary" label="Beneficiário" sortable min-width="220" />
      <el-table-column label="Classificação de risco" sortable width="200">
        <template #default="{ row }">
          <el-tag v-if="row.risk" type="danger" effect="plain" size="small" class="!uppercase">
            Risco Jurídico Configurado
          </el-tag>
          <span v-else class="text-ms-text-placeholder">—</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tipo"
        label="Tipo de ocorrência"
        sortable
        min-width="240"
        show-overflow-tooltip
      />
      <el-table-column label="Status" sortable width="190">
        <template #default="{ row }">
          <el-tag :type="row.statusType" effect="light" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Ações" width="120" align="center">
        <template #default="{ row }">
          <div class="flex justify-center gap-2">
            <el-button
              circle
              size="small"
              title="Visualizar"
              @click="$router.push(`/ocorrencias/${row.id}`)"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </el-button>
            <el-button circle size="small" title="Editar">
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Paginação -->
    <div class="flex items-center justify-center gap-4 px-4 py-4">
      <span class="text-sm text-ms-text-secondary">{{ filteredList.length }} ocorrência(s)</span>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[50, 100, 200]"
        :total="filteredList.length"
        layout="sizes, prev, pager, next, jumper"
        background
      />
    </div>
  </el-card>
</template>
