import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Perfil do atendente (protótipo, sem backend):
//  - quente: atende fila em tempo real (WhatsApp, ligações…) + ocorrências
//  - frio:   atende SOMENTE ocorrências (sem fila), mas atua nos demais cenários
//  - ambos:  atua nas duas frentes
export type Profile = 'quente' | 'frio' | 'ambos'

export const profileLabel: Record<Profile, string> = {
  quente: 'Atendente a quente',
  frio: 'Atendente a frio',
  ambos: 'Quente e frio',
}

export const profileHint: Record<Profile, string> = {
  quente: 'Fila em tempo real + ocorrências',
  frio: 'Somente ocorrências (sem fila)',
  ambos: 'Atua nas duas frentes',
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>('ambos')

  // A fila (e o "Atendimento ao vivo") só existem para quem atende a quente.
  const hasQueue = computed(() => profile.value === 'quente' || profile.value === 'ambos')

  function setProfile(p: Profile) {
    profile.value = p
  }

  return { profile, hasQueue, setProfile }
})
