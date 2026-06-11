<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()

const fileInput = ref<HTMLInputElement>()

function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) {
    emit('update:modelValue', false)
    ElMessage.success(`Documento anexado: ${f.name}`)
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="480"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <h3 class="text-xl font-bold text-[#303133]">Anexar documento</h3>
    </template>

    <button
      class="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[#DCDFE6] bg-[#FAFBFC] px-6 py-10 text-center transition hover:border-[#409EFF]"
      @click="fileInput?.click()"
    >
      <span class="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECF5FF] text-[#409EFF]">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5M12 3v12" /></svg>
      </span>
      <div class="text-[#606266]">
        Arraste e solte um arquivo aqui, ou
        <span class="font-semibold text-[#409EFF]">clique para selecionar</span>
      </div>
      <div class="text-xs text-[#909399]">Formatos aceitos: PDF, DOC, DOCX, JPG, PNG, GIF</div>
    </button>
    <input ref="fileInput" type="file" class="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" @change="onFile" />

    <template #footer>
      <el-button type="primary" @click="emit('update:modelValue', false)">Voltar</el-button>
    </template>
  </el-dialog>
</template>
