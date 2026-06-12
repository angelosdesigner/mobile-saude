import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

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
  const mode = ref<ThemeMode>(stored() ?? systemPref())

  const isDark = ref(mode.value === 'dark')

  function apply(m: ThemeMode) {
    document.documentElement.classList.toggle('dark', m === 'dark')
  }

  function setMode(m: ThemeMode) {
    mode.value = m
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    mode,
    (m) => {
      isDark.value = m === 'dark'
      apply(m)
      localStorage.setItem(STORAGE_KEY, m)
    },
    { immediate: true },
  )

  return { mode, isDark, setMode, toggle }
})
