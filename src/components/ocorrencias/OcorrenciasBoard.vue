<script setup lang="ts">
import { columns, ocorrencias, type ColumnKey } from '@/data/ocorrencias'

const byColumn = (col: ColumnKey) => ocorrencias.filter((o) => o.column === col)
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-2">
    <div v-for="col in columns" :key="col" class="flex w-72 shrink-0 flex-col">
      <!-- Cabeçalho da coluna -->
      <div class="mb-3 flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-wide text-[#606266]">{{ col }}</span>
          <el-badge :value="byColumn(col).length" type="primary" />
        </div>
      </div>

      <!-- Cards -->
      <div class="flex flex-col gap-3">
        <el-card
          v-for="o in byColumn(col)"
          :key="o.id"
          shadow="hover"
          body-class="!p-4"
          class="cursor-pointer !border-[#EBEEF5]"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#909399]">{{ o.protocol }}</span>
            <el-tag :type="o.timeType" effect="light" size="small" round>{{ o.time }}</el-tag>
          </div>

          <h4 class="mt-2 text-sm font-semibold leading-snug text-[#303133]">{{ o.beneficiary }}</h4>

          <el-tag v-if="o.risk" type="danger" effect="plain" size="small" class="mt-2 !uppercase">
            Risco Jurídico Configurado
          </el-tag>

          <div class="mt-3 space-y-2">
            <div>
              <div class="text-[11px] text-[#909399]">Tipo de ocorrência</div>
              <div class="text-xs text-[#606266]">{{ o.tipo }}</div>
            </div>
            <div>
              <div class="text-[11px] text-[#909399]">Assunto</div>
              <div class="text-xs text-[#606266]">{{ o.assunto }}</div>
            </div>
          </div>

          <div class="mt-3">
            <el-tag :type="o.statusType" effect="light" size="small">{{ o.status }}</el-tag>
          </div>

          <div class="mt-3 flex items-center justify-between border-t border-[#F2F6FC] pt-2 text-xs text-[#909399]">
            <span>{{ o.channel }}</span>
            <span v-if="o.assignee" class="font-medium text-[#67C23A]">{{ o.assignee }}</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
