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
    <!-- Sem <transition> aqui: envolver <component :is> de rotas assíncronas em
         transição causava bugs de navegação SPA (tela branca com mode="out-in";
         página anterior presa no DOM com fade simultâneo). Swap direto é confiável. -->
    <router-view />
  </el-config-provider>
</template>
