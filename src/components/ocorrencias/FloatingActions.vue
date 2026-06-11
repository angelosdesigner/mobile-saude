<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ action: [string] }>()
const expanded = ref(true)

type Icon = 'phone' | 'whatsapp' | 'video' | 'paperclip' | 'transfer' | 'check'
const actions: { key: string; icon: Icon; tip: string; green?: boolean }[] = [
  { key: 'ligacao', icon: 'phone', tip: 'Ligação' },
  { key: 'template', icon: 'whatsapp', tip: 'Template WhatsApp' },
  { key: 'video', icon: 'video', tip: 'Videochamada' },
  { key: 'anexar', icon: 'paperclip', tip: 'Anexar documento' },
  { key: 'encaminhar', icon: 'transfer', tip: 'Encaminhar' },
  { key: 'finalizar', icon: 'check', tip: 'Finalizar', green: true },
]
</script>

<template>
  <!-- Recolhido: botão quadrado com » -->
  <button
    v-if="!expanded"
    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#606266] shadow-lg transition hover:text-[#409EFF]"
    title="Expandir ações"
    @click="expanded = true"
  >
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5M13 17l5-5-5-5" /></svg>
  </button>

  <!-- Expandido: pílula com ações -->
  <div v-else class="flex items-center gap-1 rounded-2xl bg-white px-2 py-2 shadow-lg">
    <button
      class="flex h-9 w-9 items-center justify-center rounded-xl text-[#606266] transition hover:bg-[#F5F7FA]"
      title="Recolher"
      @click="expanded = false"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 17-5-5 5-5M11 17l-5-5 5-5" /></svg>
    </button>

    <template v-for="a in actions" :key="a.key">
      <span class="mx-0.5 h-6 w-px bg-[#EBEEF5]" />
      <el-tooltip :content="a.tip" placement="top">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-[#F5F7FA]"
          :class="a.green ? 'text-[#67C23A]' : 'text-[#606266] hover:text-[#409EFF]'"
          @click="emit('action', a.key)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="a.icon === 'phone'"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></template>
            <template v-else-if="a.icon === 'whatsapp'"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></template>
            <template v-else-if="a.icon === 'video'"><path d="m23 7-7 5 7 5z" /><rect x="1" y="5" width="15" height="14" rx="2" /></template>
            <template v-else-if="a.icon === 'paperclip'"><path d="M21.4 11.05 12.25 20.2a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 1 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.49-8.49" /></template>
            <template v-else-if="a.icon === 'transfer'"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" /></template>
            <template v-else><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></template>
          </svg>
        </button>
      </el-tooltip>
    </template>

    <!-- Overflow: ações que não cabem na barra -->
    <span class="mx-0.5 h-6 w-px bg-[#EBEEF5]" />
    <el-dropdown trigger="click" placement="top" @command="(c: string) => emit('action', c)">
      <button class="flex h-9 w-9 items-center justify-center rounded-xl text-[#606266] transition hover:bg-[#F5F7FA] hover:text-[#409EFF]" title="Mais ações">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="vincular">Vincular protocolo</el-dropdown-item>
          <el-dropdown-item command="cobrar">Cobrar setor</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
