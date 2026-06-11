# REFACTORING PLAN — Mobile Saúde Frontend
**Gerado em:** 2026-06-11  
**Baseado em:** AUDIT_REPORT.md  
**Objetivo:** Elevar o projeto de Protótipo para base sólida de desenvolvimento profissional

---

## Visão Geral do Esforço

| Fase | Foco | Esforço estimado |
|------|------|-----------------|
| 0 — Quick Wins | Linting, CI, dead code | 2–4h |
| 1 — Fundação | Testes, tipos, serviços | 2–3 dias |
| 2 — Estado | Pinia, filtros corrigidos | 1–2 dias |
| 3 — UX/Qualidade | Loading, empty, icons, tokens | 2–3 dias |
| **Total** | | **~2 semanas (1 dev)** |

---

## Fase 0 — Quick Wins (< 1h cada)

### 0.1 Configurar ESLint + Prettier
**Esforço:** 1h  
```bash
npm install -D eslint @vue/eslint-config-typescript eslint-plugin-vue prettier @vue/eslint-config-prettier
```
Criar `eslint.config.js`:
```javascript
import pluginVue from 'eslint-plugin-vue'
import vueTsConfig from '@vue/eslint-config-typescript'
import prettierConfig from '@vue/eslint-config-prettier'

export default [
  ...pluginVue.configs['flat/recommended'],
  ...vueTsConfig(),
  prettierConfig,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
]
```
Criar `.prettierrc`:
```json
{ "semi": false, "singleQuote": true, "printWidth": 100 }
```
Adicionar scripts ao `package.json`:
```json
"lint": "eslint src --ext .vue,.ts",
"format": "prettier --write src"
```

### 0.2 Configurar GitHub Actions CI
**Esforço:** 30min  
Criar `.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### 0.3 Corrigir protocolos duplicados nos mocks
**Esforço:** 15min  
**Arquivo:** `src/data/ocorrencias.ts`  
Dar IDs únicos e protocolos distintos a cada ocorrência mock:
```typescript
{ id: 1, protocol: 'OC-2026-001001', ... }
{ id: 2, protocol: 'OC-2026-001002', ... }
// etc.
```

### 0.4 Corrigir protocolo no detalhe
**Esforço:** 5min  
**Arquivo:** `src/pages/OcorrenciaDetalheView.vue:72`  
```typescript
// ANTES
{ label: 'Protocolo', value: '00100200300400500' }

// DEPOIS
{ label: 'Protocolo', value: oc.value.protocol }
```

### 0.5 Remover DemoView e limpar sidebar
**Esforço:** 20min  
- Remover rota `/demo` de `src/router/index.ts`
- Remover `src/pages/DemoView.vue`
- Em `AppSidebar.vue`, remover itens sem rota implementada (`requiresQueue` só cobre parcialmente isso) — marcar rotas futuras como `disabled` em vez de links ativos:
```typescript
{ to: '/contatos', label: 'Contatos', icon: 'users', disabled: true }
```

### 0.6 Corrigir `dragScroll` — listener condicional
**Esforço:** 30min  
**Arquivo:** `src/directives/dragScroll.ts`  
Mover `window.addEventListener('pointermove', onMove)` para dentro do `onDown`:
```typescript
const onDown = (e: PointerEvent) => {
  if (e.button !== 0) return
  if ((e.target as HTMLElement).closest(INTERACTIVE)) return
  down = true
  moved = false
  sx = e.clientX; sy = e.clientY
  sl = el.scrollLeft; st = el.scrollTop
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

const onUp = () => {
  if (!down) return
  down = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  if (moved) {
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
}

// No mounted: apenas o pointerdown no elemento
el.addEventListener('pointerdown', onDown)
```

### 0.7 Corrigir double cast em `dragScroll`
**Esforço:** 15min  
**Arquivo:** `src/directives/dragScroll.ts:56`  
```typescript
// ANTES — double cast perigoso
(el as unknown as { __ds: () => void }).__ds = cleanup

// DEPOIS — WeakMap, type-safe
const cleanupMap = new WeakMap<HTMLElement, () => void>()

// mounted:
cleanupMap.set(el, cleanup)

// unmounted:
cleanupMap.get(el)?.()
cleanupMap.delete(el)
```

---

## Fase 1 — Fundação (1–4h cada)

### 1.1 Configurar Vitest e primeiros testes
**Esforço:** 4h  
```bash
npm install -D vitest @vue/test-utils jsdom @vitest/coverage-v8
```
Criar `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  }
})
```
Criar testes críticos em `src/composables/__tests__/useOcorrencias.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
// Testar: passesFilter, clearFilters, applyPreset, onDrop
```

### 1.2 Criar `src/types/` centralizado
**Esforço:** 1h  
Criar `src/types/ocorrencias.ts`:
```typescript
export type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'
export type SlaStatus = 'Crítico' | 'Vencido' | 'Atenção' | 'Dentro do prazo' | 'Sem SLA'
export type Prioridade = 'Alta' | 'Média' | 'Baixa'
export type Canal = 'WhatsApp' | 'Portal Web' | 'Telefone' | 'Presencial' | 'App'
export type TipoOcorrencia = 'Autorização' | 'Reembolso' | 'Segunda via' | 'Reclamação' | 'Cancelamento'
export type ColumnKey = 'NOVO' | 'EM ATENDIMENTO' | 'EM ESPERA' | 'ENCAMINHAMENTOS' | 'CONCLUÍDOS NO DIA'

export interface Ocorrencia {
  id: number
  protocol: string
  beneficiary: string
  tipo: string
  assunto: string
  status: string
  statusType: TagType
  risk: boolean
  time: string
  timeType: TagType
  channel: Canal
  assignee?: string
  column: ColumnKey
  prioridade: Prioridade
  sla: SlaStatus
  tipoOcorrencia: TipoOcorrencia
  tipoAtendimento: Canal
  atendente: string
}

export interface ColumnCfg {
  key: ColumnKey
  label: string
  visible: boolean
}

export interface NotificacaoItem {
  id: number
  type: 'warning' | 'info' | 'danger' | 'success'
  title: string
  desc: string
  time: string
  unread: boolean
}

export interface SavedFilter {
  name: string
  apply: Partial<Record<keyof Pick<Ocorrencia, 'prioridade' | 'sla' | 'tipoOcorrencia' | 'tipoAtendimento' | 'atendente'>, string[]>>
}
```

### 1.3 Criar camada de serviços
**Esforço:** 2h  
Criar `src/services/ocorrenciasService.ts`:
```typescript
import type { Ocorrencia, ColumnKey } from '@/types/ocorrencias'
import { ocorrencias as mockData } from '@/data/ocorrencias'

// Funções assíncronas desde já — swappable para chamadas de API reais
export async function fetchOcorrencias(): Promise<Ocorrencia[]> {
  // TODO: substituir por fetch('/api/ocorrencias')
  return [...mockData]
}

export async function updateOcorrenciaColumn(id: number, column: ColumnKey): Promise<void> {
  // TODO: substituir por fetch(`/api/ocorrencias/${id}`, { method: 'PATCH', body: ... })
  console.log(`[mock] Moved ${id} → ${column}`)
}

export async function fetchOcorrenciaById(id: number): Promise<Ocorrencia | undefined> {
  return mockData.find(o => o.id === id)
}
```

### 1.4 Configurar variáveis de ambiente
**Esforço:** 30min  
Criar `.env.example` (commitar):
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Mobile Saúde
```
Criar `.env.local` (não commitar — já está no .gitignore):
```
VITE_API_BASE_URL=http://localhost:3000
```
Criar `src/config.ts`:
```typescript
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'Mobile Saúde',
} as const
```

---

## Fase 2 — Estado e Lógica (4–16h)

### 2.1 Migrar para Pinia
**Esforço:** 8h  
```bash
npm install pinia
```
`src/main.ts`:
```typescript
import { createPinia } from 'pinia'
app.use(createPinia())
```
Criar `src/stores/ocorrencias.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { Ocorrencia, ColumnKey, ColumnCfg, NotificacaoItem, SavedFilter } from '@/types/ocorrencias'
import { fetchOcorrencias, updateOcorrenciaColumn } from '@/services/ocorrenciasService'
import { columns, columnLabel } from '@/data/ocorrencias'

export const useOcorrenciasStore = defineStore('ocorrencias', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const board = reactive<Record<ColumnKey, Ocorrencia[]>>(
    Object.fromEntries(columns.map(c => [c, []])) as Record<ColumnKey, Ocorrencia[]>
  )

  const filters = reactive({
    prioridade: [] as string[],
    sla: [] as string[],
    tipoOcorrencia: [] as string[],
    tipoAtendimento: [] as string[],
    atendente: [] as string[],
    status: [] as string[],
    assunto: '',
  })

  // ... computed, actions
  // Incluir: load(), clearFilters(), moveCard(), applyPreset()

  return { loading, error, board, filters, /* ... */ }
})
```
Substituir `useOcorrencias()` nos componentes pelo store.

### 2.2 Corrigir stats — derivar do estado real
**Esforço:** 1h  
**Arquivo:** `src/pages/OcorrenciasView.vue`  
```typescript
import { useOcorrenciasStore } from '@/stores/ocorrencias'
const store = useOcorrenciasStore()

const stats = computed(() => [
  { label: 'Total', value: store.filteredList.length, color: '#909399' },
  { label: 'SLA regulatório', value: store.filteredList.filter(o => o.sla === 'Crítico').length, color: '#F56C6C' },
  { label: 'SLA interno', value: store.filteredList.filter(o => o.sla === 'Vencido').length, color: '#F56C6C' },
  { label: 'Atenção', value: store.filteredList.filter(o => o.sla === 'Atenção').length, color: '#E6A23C' },
  { label: 'Alta prioridade', value: store.filteredList.filter(o => o.prioridade === 'Alta').length, color: '#F56C6C' },
])
```

### 2.3 Corrigir filtro no board — computed por coluna
**Esforço:** 2h  
**Arquivo:** `src/components/ocorrencias/OcorrenciasBoard.vue`  
```typescript
// Remover: v-show="passesFilter(o)"
// Adicionar computed no store:
const filteredBoard = computed(() =>
  Object.fromEntries(
    columns.map(c => [c, board[c].filter(passesFilter)])
  ) as Record<ColumnKey, Ocorrencia[]>
)

// No template:
// v-for="o in filteredBoard[col.key]"  (sem v-show)
```

---

## Fase 3 — UX, Qualidade Visual e Acessibilidade (4–16h)

### 3.1 Design tokens — eliminar hex hardcoded
**Esforço:** 4h  
Adicionar em `src/style.css` (na `@layer components`):
```css
:root {
  --ms-text-primary:   #303133;
  --ms-text-secondary: #606266;
  --ms-text-muted:     #909399;
  --ms-text-disabled:  #C0C4CC;
  --ms-brand:          #409EFF;
  --ms-border:         #DCDFE6;
  --ms-border-light:   #EBEEF5;
  --ms-bg-page:        #F5F7FA;
  --ms-bg-card:        #FFFFFF;
}
```
Para Tailwind v4, adicionar no `@theme`:
```css
@theme {
  --color-ms-text-primary: #303133;
  /* etc. */
}
```
Substituir progressivamente `text-[#303133]` por `text-ms-text-primary`.

### 3.2 Componente de ícones
**Esforço:** 3h  
Criar `src/components/ui/AppIcon.vue`:
```vue
<script setup lang="ts">
const props = defineProps<{ name: string; size?: number }>()
const icons: Record<string, string> = {
  home:     'M3 9.5 12 3l9 6.5 M5 10v10h14V10',
  chevron:  'm15 18-6-6 6-6',
  search:   'M21 21l-4.3-4.3 M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  // ... todos os ícones usados
}
</script>
<template>
  <svg
    :width="size ?? 16"
    :height="size ?? 16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="icons[name]" />
  </svg>
</template>
```
Substituir SVGs inline por `<AppIcon name="home" :size="20" />`.

### 3.3 Estados de loading e empty
**Esforço:** 4h  
Criar `src/components/ui/SkeletonCard.vue` e `src/components/ui/EmptyState.vue`.

`EmptyState.vue`:
```vue
<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<template>
  <div class="flex flex-col items-center gap-3 py-16 text-center">
    <AppIcon name="inbox" :size="40" class="text-ms-text-disabled" />
    <p class="font-medium text-ms-text-secondary">{{ title }}</p>
    <p v-if="description" class="text-sm text-ms-text-muted">{{ description }}</p>
  </div>
</template>
```

Usar em `OcorrenciasBoard.vue` e `OcorrenciasList.vue`:
```vue
<EmptyState
  v-if="filteredBoard[col.key].length === 0"
  title="Nenhuma ocorrência"
  description="Tente ajustar os filtros"
/>
```

### 3.4 Acessibilidade básica
**Esforço:** 2h  
- Adicionar `lang="pt-BR"` no `index.html`
- Adicionar `aria-label` em todos os botões icon-only:
```vue
<button aria-label="Colapsar menu" @click="expanded = !expanded">
<el-button circle text aria-label="Voltar para Ocorrências" @click="router.push('/ocorrencias')">
```
- Adicionar `role="status"` em contadores de badges

### 3.5 Implementar handler de envio na conversa
**Esforço:** 1h  
**Arquivo:** `src/pages/OcorrenciaDetalheView.vue`  
```typescript
const messages = ref([...conversa.value]) // separar de computed estático

function sendReply() {
  if (!reply.value.trim()) return
  messages.value.push({
    from: 'atendente',
    text: reply.value,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  })
  reply.value = ''
}
```
```html
<el-button type="primary" @click="sendReply">Enviar</el-button>
```

---

## Fase 4 — Backlog de Refinamento (> 16h, longo prazo)

### 4.1 Virtualização do board e lista
Quando o volume de ocorrências for real, implementar `vue-virtual-scroller` na lista e virtualização por coluna no board.

### 4.2 Autenticação e route guards
Criar `src/composables/useAuth.ts` e guards no router para rotas protegidas.

### 4.3 Responsividade mobile do board
O kanban precisa de uma visualização alternativa em mobile (ex: accordion ou lista agrupada por coluna).

### 4.4 Storybook para componentes
Substituir `DemoView.vue` por Storybook. Documentar componentes de UI reutilizáveis.

### 4.5 Error boundaries
Vue 3 tem `onErrorCaptured`. Criar um componente `ErrorBoundary.vue` para envolver seções críticas.

### 4.6 i18n
Se o produto for multi-idioma, configurar `vue-i18n` agora custa menos do que migrar depois.

---

## Checklist de Progresso

> **Fases 0, 1 e 2 concluídas e verificadas** em 2026-06-11 (lint limpo, 17 testes
> passando, build OK, app validado no navegador). Fase 3 e Fase 4 pendentes.

### Fase 0 — Quick Wins ✅
- [x] 0.1 ESLint + Prettier configurados (`eslint.config.js`, `.prettierrc.json`, `.editorconfig`)
- [x] 0.2 GitHub Actions CI (`.github/workflows/ci.yml`: lint → build → test)
- [x] 0.3 Protocolos únicos nos mocks (`OC-2026-00100X`)
- [x] 0.4 Protocolo correto no detalhe (usa `oc.protocol`)
- [x] 0.5 Sidebar: links sem rota viram "em breve" (`aria-disabled`); DemoView mantido mas fora do índice de fluxos
- [x] 0.6 dragScroll listener condicional (pointermove só durante o arraste)
- [x] 0.7 dragScroll double cast → WeakMap

### Fase 1 — Fundação ✅
- [x] 1.1 Vitest configurado + 17 testes (`src/stores/*.spec.ts`)
- [x] 1.2 `src/types/ocorrencias.ts` centralizado (union types derivados das opções)
- [x] 1.3 `src/services/ocorrenciasService.ts` criado (assíncrono, mock swappable)
- [x] 1.4 `.env.example` + `src/config.ts`

### Fase 2 — Estado ✅
- [x] 2.1 Pinia: `src/stores/ocorrencias.ts` + `src/stores/profile.ts` (composables antigos removidos)
- [x] 2.2 Stats derivados do estado real (`store.stats` sobre `filteredList`)
- [x] 2.3 Filtro do board via computed `filteredBoard` (sem `v-show`)
- [x] Bônus: estados vazios (board/lista), loading no detalhe, handler de envio funcional

### Fase 3 — UX/Qualidade ✅ (concluída em 2026-06-11)
- [x] 3.1 Design tokens (`@theme` em `style.css`) — 259 substituições do core palette EP em 24 arquivos; `text-[#303133]` → `text-ms-text-primary` etc. Tints decorativos de uso único permanecem inline (documentado)
- [x] 3.2 `AppIcon.vue` — ícones de chrome repetidos entre arquivos centralizados (search ×3, chevron-left ×3, chevron-down ×3, chevron-right, plus, close ×2). Regra: ilustrações de uso único ficam inline
- [x] 3.3 `EmptyState.vue` reutilizável (usado no detalhe "não encontrada"; board/lista têm empty states próprios)
- [x] 3.4 `aria-label` em botões icon-only + `lang="pt-BR"` (já existia no index.html)
- [x] 3.5 Handler de envio na conversa (feito na Fase 2)

> **Pendências da Fase 3 (incremental):** `SkeletonCard` dedicado (hoje usa `v-loading`);
> migração dos ~40 SVGs ilustrativos de uso único (decisão: ficam inline).
