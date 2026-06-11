<script setup lang="ts">
// Ícone flutuante do Copilot (logo aproximado em gradiente).
</script>

<template>
  <el-popover trigger="click" placement="top-end" :width="300">
    <template #reference>
      <button
        class="flex h-13 w-13 items-center justify-center rounded-full border border-[#EBEEF5] bg-white shadow-lg transition hover:shadow-xl"
        style="height: 52px; width: 52px"
        title="Copilot"
      >
        <svg class="h-7 w-7" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="copilot-grad" x1="2" y1="6" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#2E8CF0" />
              <stop offset="0.28" stop-color="#17C3E6" />
              <stop offset="0.5" stop-color="#3FD17A" />
              <stop offset="0.68" stop-color="#F7C948" />
              <stop offset="0.84" stop-color="#F2773B" />
              <stop offset="1" stop-color="#B05CF2" />
            </linearGradient>
          </defs>
          <path
            fill="url(#copilot-grad)"
            d="M14.5 4h3.6c3 0 5.6 1.9 6.6 4.7l2.8 7.9c.7 2-.8 4.1-2.9 4.1-1.3 0-2.5-.8-2.9-2.1l-1.8-5.2c-.4-1.1-1.4-1.8-2.6-1.8h-2.1c-1.2 0-2.2.7-2.6 1.8l-.4 1.1c-.6 1.7-2.2 2.8-4 2.8H4.7c-2 0-3.5-2-2.8-3.9l1.4-3.9C4.3 5.8 6.9 4 9.8 4h4.7z"
            opacity="0.95"
          />
          <path
            fill="url(#copilot-grad)"
            d="M9.9 17.2h2.2c1.2 0 2.2.7 2.6 1.8l1.8 5.2c.4 1.3 1.6 2.1 2.9 2.1h.2c2.1 0 3.6-2.1 2.9-4.1l-.3-.8c-.6-1.7-2.2-2.8-4-2.8H9.9z"
          />
        </svg>
      </button>
    </template>

    <div class="p-1">
      <div class="mb-1 flex items-center gap-2">
        <span class="text-sm font-semibold text-[#303133]">Copilot</span>
        <el-tag size="small" type="info" effect="light" round>beta</el-tag>
      </div>
      <p class="text-xs text-[#909399]">
        Assistente de IA para resumir o atendimento, sugerir respostas e próximos passos. Em breve.
      </p>
    </div>
  </el-popover>
</template>
