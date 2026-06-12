import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// Tema claro/escuro. Persiste a escolha em localStorage e, na primeira visita,
// segue a preferência do sistema. A classe `dark` é aplicada no <html> — é o
// que o Element Plus (css-vars dark) e os tokens `ms-*` usam para alternar.
export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'ms-theme'

function systemPref(): ThemeMode {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function stored(): ThemeMode | null {
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'light' || v === 'dark' ? v : null
}

export const useThemeStore = defineStore('theme', () => {
  // `true` enquanto o usuário não escolheu manualmente: segue o SO em runtime.
  const followSystem = ref(stored() === null)
  const mode = ref<ThemeMode>(stored() ?? systemPref())

  const isDark = computed(() => mode.value === 'dark')

  function apply(m: ThemeMode) {
    document.documentElement.classList.toggle('dark', m === 'dark')
  }

  function setMode(m: ThemeMode) {
    followSystem.value = false
    mode.value = m
  }

  function toggle() {
    setMode(mode.value === 'dark' ? 'light' : 'dark')
  }

  // Acompanha a preferência do SO em tempo real — só até a 1ª escolha manual.
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (followSystem.value) mode.value = e.matches ? 'dark' : 'light'
  })

  watch(
    mode,
    (m) => {
      apply(m)
      // Só persiste a escolha manual; no modo "seguir SO" não grava.
      if (!followSystem.value) localStorage.setItem(STORAGE_KEY, m)
    },
    { immediate: true },
  )

  return { mode, isDark, followSystem, setMode, toggle }
})
