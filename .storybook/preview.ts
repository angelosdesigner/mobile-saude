import type { Preview } from '@storybook/vue3-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
// Estilos reais do produto: layers do Tailwind + Element Plus + tokens (claro e
// escuro). Garante que o catálogo renderize idêntico ao app.
import '../src/style.css'
// Registra os charts do ECharts (efeito colateral) — no app isto vem do main.ts;
// aqui é preciso para o VChart funcionar nas stories de Indicadores.
import '../src/plugins/echarts'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // addon-a11y roda axe-core em cada story. 'todo' destaca violações sem
    // reprovar; trocar para 'error' quando quisermos travar no CI.
    a11y: { test: 'todo' },
  },
  decorators: [
    // Alterna o tema pela classe `.dark` no <html> — mesmo mecanismo do app.
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    // Envolve cada story no fundo/textos por token (light e dark corretos).
    (story) => ({
      components: { story },
      template: '<div class="min-h-[140px] bg-ms-bg p-6 text-ms-text-primary"><story /></div>',
    }),
  ],
}

export default preview
