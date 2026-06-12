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

// Papel do usuário no produto (eixo diferente do perfil de atendimento acima).
// Enquanto não há login, é alternado pelo switcher no topbar; quando houver
// autenticação, vem da sessão do usuário e passa a gatear rotas/navegação.
export type Role = 'atendente' | 'gestor'

export const roleLabel: Record<Role, string> = {
  atendente: 'Atendente',
  gestor: 'Gestor',
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>('ambos')
  const role = ref<Role>('atendente')

  // A fila (e o "Atendimento ao vivo") só existem para quem atende a quente.
  const hasQueue = computed(() => profile.value === 'quente' || profile.value === 'ambos')
  const isGestor = computed(() => role.value === 'gestor')

  function setProfile(p: Profile) {
    profile.value = p
  }

  function setRole(r: Role) {
    role.value = r
  }

  return { profile, role, hasQueue, isGestor, setProfile, setRole }
})
