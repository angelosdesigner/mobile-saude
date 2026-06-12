<script setup lang="ts">
// Shell mínimo: cada página traz seu próprio layout (ex.: DashboardLayout).
// el-config-provider aplica o locale pt-BR ao Element Plus (paginação, tabelas…).
import ptBr from 'element-plus/es/locale/lang/pt-br'
import { useThemeStore } from '@/stores/theme'

// Instancia o tema cedo para aplicar a classe `dark` em qualquer rota (mesmo
// nas que não usam o topbar).
useThemeStore()
</script>

<template>
  <el-config-provider :locale="ptBr">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
