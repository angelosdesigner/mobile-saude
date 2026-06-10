<script setup lang="ts">
// Shell mínimo: cada página traz seu próprio layout (ex.: DashboardLayout).
// el-config-provider aplica o locale pt-BR ao Element Plus (paginação, tabelas…).
import ptBr from 'element-plus/es/locale/lang/pt-br'
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
