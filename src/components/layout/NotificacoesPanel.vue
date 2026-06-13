<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNotificacoesStore } from '@/stores/notificacoes'
import { useActionFeedback } from '@/composables/useActionFeedback'
import NotificacaoItem from '@/components/notificacoes/NotificacaoItem.vue'

const emit = defineEmits<{ navigate: [] }>()
const router = useRouter()

const store = useNotificacoesStore()
const { recent, unreadCount } = storeToRefs(store)
const { markRead } = store
const { done } = useActionFeedback()

onMounted(() => store.load())

function marcarTodas() {
  store.markAllRead()
  done('Todas as notificações marcadas como lidas')
}

function open(id: number) {
  markRead(id)
  emit('navigate')
  router.push('/notificacoes')
}
function verTodas() {
  emit('navigate')
  router.push('/notificacoes')
}
</script>

<template>
  <div class="w-[380px]">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="font-bold text-ms-text-primary">Notificações</span>
        <span
          v-if="unreadCount"
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-danger px-1.5 text-2xs font-semibold text-white"
          >{{ unreadCount }}</span
        >
      </div>
      <button
        class="text-sm text-ms-primary hover:underline disabled:opacity-50"
        :disabled="!unreadCount"
        @click="marcarTodas"
      >
        Marcar todas como lidas
      </button>
    </div>

    <!-- Lista (recentes) -->
    <div class="max-h-[360px] divide-y divide-ms-border-lighter overflow-y-auto border-t border-ms-border-lighter">
      <NotificacaoItem
        v-for="n in recent"
        :key="n.id"
        :notif="n"
        compact
        @click="open(n.id)"
      />
    </div>

    <!-- Rodapé -->
    <div class="border-t border-ms-border-lighter py-3 text-center">
      <button class="text-sm font-medium text-ms-primary hover:underline" @click="verTodas">
        Ver todas as notificações
      </button>
    </div>
  </div>
</template>
