# De-Para — Portar telas/fluxos para a stack do time (Vibe Kanban)

> **Objetivo:** aproveitar **todas as telas e fluxos** construídos neste projeto
> (Mobile Saúde) e portá-los para a stack **antiga** usada pelo time, **sem
> migrar a stack deles**. As versões da tabela abaixo são **travadas** — o porte
> adapta o nosso código a elas, não o contrário.
>
> **Status:** plano de-para para validação. Nenhum código foi convertido ainda.

---

## 1. Regra de ouro — o que NÃO pode mudar

| Item        | Stack travada do time (destino) | O que temos hoje (origem)               |
| ----------- | ------------------------------- | --------------------------------------- |
| Framework   | **Vue 3.3 + Vite 4**            | Vue 3.5.34 + Vite 8                      |
| CSS         | **Tailwind v3 + PostCSS**       | Tailwind v4 (`@tailwindcss/vite`)       |
| Icons       | **FontAwesome**                 | Lucide (`@lucide/vue`, via `AppIcon`)   |
| Charts      | — → **adicionar ECharts**       | ECharts 6 + vue-echarts 8               |
| Auto-import | **Manual**                      | `unplugin-auto-import` + `-vue-components` |
| Router      | **`createWebHashHistory`**      | `createWebHistory`                      |
| Testes      | — (sem testes)                  | Vitest 4 + @vue/test-utils              |
| TypeScript  | **5.0**                         | 6.0                                     |
| UI kit      | **Element Plus** (mantido nos 2 lados) | Element Plus 2.14                |

**Decisões já tomadas:**
- ✅ Element Plus existe nos dois lados → **não reescrevemos as 70 telas em HTML puro**.
- ✅ Charts: **adicionar `echarts` + `vue-echarts`** ao projeto deles (charts era "—"). Nossa implementação de gráficos é mantida.

---

## 2. Diagnóstico do que está sendo portado

- **121 arquivos `.vue`** → 19 telas (`src/pages`) + 100 componentes (`src/components`).
- **70 arquivos** usam Element Plus (`<el-*>`) diretamente — inclusive os wrappers `Base*`.
- **23 arquivos** usam ECharts (todos os dashboards do Gestor).
- **24 ícones** Lucide, **todos centralizados** em `src/components/ui/AppIcon.vue` — os call sites usam `<AppIcon name="..." />` e **não mudam**.
- **11 componentes** usam `defineModel` (⚠️ ver §3.1 — bloqueador do Vue 3.3).
- **4 arquivos** `*.spec.ts` (stores Pinia) — saem com o Vitest.
- **~49 stories** Storybook (`*.stories.ts`) + `.storybook/` (main + preview) — **incluídos** no porte (ver §3.9).

---

## 3. Matriz de-para por eixo

### 3.1 Framework — Vue 3.5 → 3.3 + Vite 8 → 4  🔴 atenção

**O bloqueador real:** `defineModel` (estável só no Vue **3.4**) em 11 componentes:

```
src/components/base/BaseInput.vue       src/components/base/BaseModal.vue
src/components/base/BaseSelect.vue       src/components/base/BaseDrawer.vue
src/components/base/BaseRadio.vue        src/components/base/BaseCheckbox.vue
src/components/gestor/IndicadorSelector.vue
src/components/gestor/PeriodoSelector.vue  (2 models: default + 'range')
src/components/ui/ColumnManager.vue      src/components/ui/FilterChips.vue
```

No Vue 3.3, reescrever cada um para o padrão clássico `props` + `emit`:

```ts
// DE (Vue 3.4+):
const model = defineModel<string>({ default: '' })

// PARA (Vue 3.3):
const props = withDefaults(defineProps<{ modelValue?: string }>(), { modelValue: '' })
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
```

Para o model nomeado de `PeriodoSelector` (`'range'`), use `props.range` +
`emit('update:range', v)`. **Esforço:** mecânico, ~11 arquivos, concentrado nos
`Base*` (bom — centralizado).

**Outras checagens (baixo risco):** nenhum `useTemplateRef`, `useId()` nem
`onWatcherCleanup` no código (são 3.5-only e **não** são usados). Vite 8 → 4 não
afeta o código das telas, só `vite.config.ts` (ver §3.4) e o lockfile.

| | |
| --- | --- |
| **Esforço** | Médio (11 arquivos `defineModel`) |
| **Arquivos** | 11 `Base*`/seletores; `vite.config.ts` |

---

### 3.2 CSS — Tailwind v4 → Tailwind v3 + PostCSS  🟡

Hoje tudo vive em `src/style.css` com sintaxe v4 (`@import 'tailwindcss/...'
layer()`, `@theme`, `@custom-variant`). **A favor:** não há `@apply` nem `theme()`
no código — as cores são custom properties CSS puras + utilitárias. Então o
trabalho é recriar a config, não caçar usos espalhados.

**O que muda:**

1. **Plugin → PostCSS.** Remover `@tailwindcss/vite`; adicionar `tailwind.config.js`
   + `postcss.config.js` + `autoprefixer`.

   ```js
   // postcss.config.js
   export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
   ```

2. **Diretivas + cascade — ✅ RESOLVIDO no PoC (sem `@layer` nativo).** O
   Tailwind v3 emite CSS "unlayered", então NÃO replicamos `@layer`. A mesma
   prioridade da stack nova sai por **ordem + especificidade**:

   ```css
   /* @import EXIGE topo (regra do CSS). NÃO quebra a cascade — ver abaixo. */
   @import 'element-plus/dist/index.css';
   @import 'element-plus/theme-chalk/dark/css-vars.css';

   @tailwind base;        /* preflight: seletores de ELEMENTO (button{}) */
   @tailwind components;
   /* ...tokens :root / html.dark / overrides .el-* (plain CSS, DEPOIS do EP)... */
   @tailwind utilities;   /* POR ÚLTIMO → vence o EP quando aplicado a <el-*> */
   ```
   - **EP não é achatado:** as regras do EP são de CLASSE (`.el-button`) e vencem
     o preflight (ELEMENTO, `button{}`) por **especificidade** — mesmo o preflight
     vindo depois. (PoC: botão primário `bg = rgb(90,147,230)`, não transparente.)
   - **Utilitárias vencem o EP:** `@tailwind utilities` por último → empata em
     especificidade e ganha por ordem. (PoC validado.)
   - ⚠️ Erro pego no PoC: se os `@import` do EP ficarem DEPOIS de `@tailwind`, o
     Vite os **descarta** (warning "@import must precede…") e o EP some do bundle
     (CSS ~19 kB em vez de ~380 kB). Mantê-los no topo.

3. **`@theme` → `tailwind.config.js`.** Os tokens semânticos viram `theme.extend`.
   ⚠️ **Achado do PoC — modificador `/opacity`:** no v4, `bg-ms-primary/5` com var
   hex funcionava; no v3 **não**. É preciso o token em **formato de canais**
   `R G B` + `<alpha-value>` (e reapontar os canais no `html.dark`):

   ```css
   /* style.css */
   :root      { --color-ms-primary-rgb: 74 144 255; }
   html.dark  { --color-ms-primary-rgb: 90 147 230; }
   ```
   ```js
   // tailwind.config.js
   export default {
     darkMode: 'class',                 // ← substitui @custom-variant dark
     content: ['./index.html', './src/**/*.{vue,ts}', './.storybook/**/*.{ts,js}'],
     theme: { extend: {
       colors: {
         // Semânticas que recebem /opacity → canais + <alpha-value>:
         'ms-primary': 'rgb(var(--color-ms-primary-rgb) / <alpha-value>)',
         'ms-success': 'rgb(var(--color-ms-success-rgb) / <alpha-value>)',
         // ... (warning, danger, teal, purple)
         // Texto/borda/superfície (sem opacidade) → var() hex direto:
         'ms-text-primary': 'var(--color-ms-text-primary)',
         'ms-border-light': 'var(--color-ms-border-light)',
         // ...
       },
       fontSize: { '2xs': ['0.75rem', { lineHeight: '1rem' }] }, // ← --text-2xs
     } },
   }
   ```
   (PoC: `bg-ms-primary/5` → `rgba(90,147,230,0.05)` ✓.) Os `:root`/`html.dark`/
   overrides `.el-*` do `style.css` seguem em CSS puro (`color-mix` inclusive).

4. **`@custom-variant dark` → `darkMode: 'class'`** (acima). O toggle por classe
   `.dark` no `<html>` não muda. (PoC: dark validado.)

| | |
| --- | --- |
| **Esforço** | Médio — 3 arquivos de config + topo do `style.css` |
| **Arquivos** | `style.css` (topo), novo `tailwind.config.js`, novo `postcss.config.js` |
| **Risco** | ✅ Resolvido no PoC (cascade por ordem/especificidade; canais p/ opacidade) |

---

### 3.3 Icons — Lucide → FontAwesome  🟢 fácil

**Setup do time (confirmado):** Font Awesome **6** via `@fortawesome` —
`fontawesome-svg-core` ^6.4 + `free-solid`/`free-regular`/`free-brands` ^6.4 +
`@fortawesome/vue-fontawesome` ^3.0.3. É **SVG-core** (não font-based) → o
`<font-awesome-icon>` renderiza um `<svg>` e as classes `h-*/w-*` continuam
dimensionando igual ao Lucide. ✅ Todos os 24 ícones existem no conjunto
**solid** (free). `vue-fontawesome` 3.x é compatível com Vue 3.3. ✅

**Tudo está em `src/components/ui/AppIcon.vue`.** A API pública
(`<AppIcon name="search" class="h-4 w-4" />`) é preservada — **só esse arquivo
muda**, nenhum call site é tocado. Mapa dos 24 ícones:

| `name=` (não muda) | Lucide (hoje)   | FontAwesome (destino)            |
| ------------------ | --------------- | -------------------------------- |
| `chevron-left`     | ChevronLeft     | `chevron-left`                   |
| `chevron-right`    | ChevronRight    | `chevron-right`                  |
| `chevron-down`     | ChevronDown     | `chevron-down`                   |
| `chevrons-right`   | ChevronsRight   | `angles-right`                   |
| `search`           | Search          | `magnifying-glass` (FA6) / `search` |
| `close`            | X               | `xmark` (FA6) / `times`          |
| `plus`             | Plus            | `plus`                           |
| `sun`              | Sun             | `sun`                            |
| `moon`             | Moon            | `moon`                           |
| `eye`              | Eye             | `eye`                            |
| `edit`             | Pencil          | `pen` / `pencil`                 |
| `copy`             | Copy            | `copy`                           |
| `clock`            | Clock           | `clock`                          |
| `more-horizontal`  | MoreHorizontal  | `ellipsis`                       |
| `file-text`        | FileText        | `file-lines` (FA6) / `file-alt`  |
| `file`             | File            | `file`                           |
| `map-pin`          | MapPin          | `location-dot` / `map-marker-alt`|
| `bar-chart`        | BarChart3       | `chart-column` / `chart-bar`     |
| `user`             | User            | `user`                           |
| `message-circle`   | MessageCircle   | `comment` / `message`            |
| `phone`            | Phone           | `phone`                          |
| `download`         | Download        | `download`                       |
| `play`             | Play            | `play`                           |
| `bell`             | Bell            | `bell`                           |
| `star`             | Star            | `star`                           |

`AppIcon.vue` reescrito (FA 6 SVG-core, passando o objeto do ícone direto — sem
precisar de `library.add` global):

```vue
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronLeft, faChevronRight, faChevronDown, faAnglesRight,
  faMagnifyingGlass, faXmark, faPlus, faSun, faMoon, faEye, faPen,
  faCopy, faClock, faEllipsis, faFileLines, faFile, faLocationDot,
  faChartColumn, faUser, faComment, faPhone, faDownload, faPlay, faBell, faStar,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const icons = {
  'chevron-left': faChevronLeft, 'chevron-right': faChevronRight,
  'chevron-down': faChevronDown, 'chevrons-right': faAnglesRight,
  search: faMagnifyingGlass, close: faXmark, plus: faPlus, sun: faSun,
  moon: faMoon, eye: faEye, edit: faPen, copy: faCopy, clock: faClock,
  'more-horizontal': faEllipsis, 'file-text': faFileLines, file: faFile,
  'map-pin': faLocationDot, 'bar-chart': faChartColumn, user: faUser,
  'message-circle': faComment, phone: faPhone, download: faDownload,
  play: faPlay, bell: faBell, star: faStar,
} satisfies Record<string, IconDefinition>

defineProps<{ name: keyof typeof icons }>()
</script>
<template>
  <!-- class h-*/w-* do call site cai no <svg> do FA e dimensiona, igual ao Lucide -->
  <FontAwesomeIcon :icon="icons[name]" />
</template>
```

> ℹ️ Registrar o componente: `app.component('font-awesome-icon', FontAwesomeIcon)`
> em `main.ts` **ou** importá-lo localmente no `AppIcon.vue` (como acima — não
> precisa de global). A prop `size` do Lucide cai fora; o dimensionamento já era
> feito por `h-*/w-*` em todos os call sites, então nada quebra.

| | |
| --- | --- |
| **Esforço** | Baixo — **1 arquivo** |
| **Arquivos** | `src/components/ui/AppIcon.vue` |

---

### 3.4 Auto-import → manual  🟡

Hoje `unplugin-auto-import` injeta as APIs do Vue (`ref`, `computed`, `watch`,
`onMounted`…) e do EP (`ElMessage`, `ElLoading`, `ElMessageBox`); e
`unplugin-vue-components` registra os `<el-*>` sob demanda. Sem eles:

1. **Componentes EP** → registrar **globalmente** uma vez (mantém os templates
   `<el-*>` intactos — **não precisa importar EP em cada arquivo**):

   ```ts
   // main.ts
   import ElementPlus from 'element-plus'
   // CSS do EP já vem via style.css (ver §3.2)
   app.use(ElementPlus)
   ```

2. **APIs do Vue** → ✅ **Achado do PoC: NÃO é um gargalo.** O projeto **já importa
   `ref/computed/watch/...` explicitamente** em todos os 64 `.vue` que usam essas
   APIs (0 arquivos dependiam do auto-import para o Vue). Logo, **nenhum trabalho**
   aqui. (Idem `useRoute`/`useRouter`: todos já importam de `vue-router`.)

3. **APIs do EP** (`ElMessage`/`ElMessageBox`/`ElLoading`/`ElNotification`) → `import`
   explícito. São **13 arquivos**; injetados por codemod
   (`scripts/inject-ep-imports.mjs` no PoC — reutilizável).

4. **`vite.config.ts`** → remover os plugins `AutoImport`/`Components` e o
   `@tailwindcss/vite`; apagar `auto-imports.d.ts` e `components.d.ts`. (Para os
   tipos dos `<el-*>` no `vue-tsc`, referenciar `element-plus/global` em
   `vite-env.d.ts`.)

| | |
| --- | --- |
| **Esforço** | ✅ Baixo (revisto) — EP global (1 linha) + 13 imports de `ElMessage` (codemod). APIs do Vue já manuais. |
| **Arquivos** | `main.ts`, `vite.config.ts`, 13 `.vue/.ts` (codemod) |

---

### 3.5 Charts — adicionar ECharts  🟢

Era "—" no destino → **adicionar** `echarts@6` + `vue-echarts@8` ao
`package.json` deles. Nossa configuração (`src/plugins/echarts.ts` + os 23
componentes) **é mantida sem alteração**. Único cuidado: `vue-echarts` é
compatível com Vue 3.3 (✅).

| **Esforço** | Baixo — instalar 2 deps |
| --- | --- |

---

### 3.6 Router — `createWebHistory` → `createWebHashHistory`  🟢

Uma linha em `src/router/index.ts`:

```ts
// DE:   history: createWebHistory(import.meta.env.BASE_URL),
// PARA: history: createWebHashHistory(import.meta.env.BASE_URL),
```
E ajustar o `import` (`createWebHashHistory`). Sem impacto nas telas.

| **Esforço** | Trivial — 1 arquivo |
| --- | --- |

---

### 3.7 Testes — remover Vitest  🟢

Sair: `vitest.config.ts`, os 4 `src/stores/*.spec.ts`, devDeps `vitest`,
`@vue/test-utils`, `jsdom`, e os scripts `test`/`test:run`.

| **Esforço** | Trivial |
| --- | --- |

---

### 3.8 TypeScript 6 → 5.0  🟢

Baixo risco: o código não usa sintaxe TS-6-only. Ajustar `typescript` para `~5.0`
e o `vue-tsc` para a linha compatível (3.x funciona com TS 5). Revisar
`tsconfig*.json` por flags que só existam no TS 6 (improvável). Validar com
`vue-tsc -b`.

| **Esforço** | Baixo |
| --- | --- |

---

### 3.9 Storybook — downgrade 10 → 8.6 (compatível com Vite 4)  🟡

**Incluído no porte** (decisão do usuário). São **~49 stories** (`*.stories.ts`)
+ `.storybook/main.ts` + `.storybook/preview.ts`. O Storybook atual é a major
**10**, que exige Vite 5+ — **não roda sobre o Vite 4 travado**. Solução:
downgrade para **Storybook 8.6** (último 8.x).

**Compatibilidade confirmada (web, jun/2026):**
- ✅ Storybook **8** suporta **Vite 4** (peer mínimo `vite ≥ 4.0`).
- ✅ O parâmetro `a11y: { test: 'todo' }` do `preview.ts` foi introduzido no
  **Storybook 8.5** (PR #30516) → mirando **8.6** ele **continua válido**.
- ✅ `withThemeByClassName` (`@storybook/addon-themes`) existe desde o SB7.

**O que muda:**

1. **Versões** (`package.json`): `storybook`, `@storybook/vue3-vite`,
   `@storybook/addon-a11y`, `@storybook/addon-themes` → de `^10.4.x` para
   `^8.6.x` (a MESMA major nos quatro — Storybook exige addons na major do core).
   ⚠️ **Achado do PoC:** adicionar `react` + `react-dom` (`^18`) como devDeps — o
   `@storybook/addon-themes` 8.6 referencia `react` no build do preview e, sem ele,
   o Rollup falha (`Rollup failed to resolve import "react"`).

2. **`.storybook/main.ts`** → **sem mudança de conteúdo.** Ele reaproveita o
   `vite.config.ts` do projeto, então herda automaticamente Vite 4 + Tailwind v3
   (PostCSS) + a remoção do auto-import. ⚠️ Mas como o auto-import sai (§3.4), o
   comentário que diz "ElButton/ElMessage funcionam nas stories" deixa de valer →
   ver item 3.

3. **`.storybook/preview.ts`** → registrar o Element Plus **globalmente** (substitui
   o auto-import que hoje faz os `<el-*>` funcionarem nas stories):

   ```ts
   import { setup } from '@storybook/vue3-vite'
   import ElementPlus from 'element-plus'
   setup((app) => app.use(ElementPlus))
   // mantém: import '../src/style.css'  e  import '../src/plugins/echarts'
   ```
   O resto do `preview.ts` (decorators de tema `.dark`, `bg-ms-bg`/`text-ms-text-primary`,
   `a11y.test`) permanece — as utilitárias `*-ms-*` vêm da config Tailwind v3 (§3.2).

4. **Stories (~49)** → conteúdo praticamente intacto (importam os wrappers `Base*`
   explicitamente; render functions não dependem de auto-import). ⚠️ **Confirmado
   no PoC:** o import de tipos `from '@storybook/vue3-vite'` (Meta/StoryObj/Preview/
   setup) **NÃO funciona** no 8.6 — esse pacote não re-exporta os tipos do renderer.
   **Trocar para `from '@storybook/vue3'`** — `sed` mecânico nos ~49 arquivos +
   `preview.ts`. (Erro exato: `has no exported member 'Meta'/'StoryObj'/…`.)

| | |
| --- | --- |
| **Esforço** | Médio — versões (+react) + `preview.ts`; `sed` do import nas ~49 stories |
| **Arquivos** | `package.json`, `.storybook/preview.ts`, ~49 `*.stories.ts` (`@storybook/vue3-vite` → `@storybook/vue3`) |
| **Risco** | ✅ Resolvido no PoC (Storybook 8.6 builda sobre Vite 4) |

---

## 4. Itens fora de "telas/fluxos" (decidir)

- **Design System view** (`DesignSystemView.vue`) e `DemoView.vue`: páginas de
  vitrine — portáveis, mas opcionais.
- **`auto-imports.d.ts` / `components.d.ts`**: apagados (§3.4).

---

## 5. Plano de execução sugerido (depois de você validar este de-para)

| Fase | Escopo | Eixos |
| ---- | ------ | ----- |
| **0. Setup** | Projeto destino com deps certas (EP global, ECharts, FA, Tailwind v3) | 3.2, 3.4, 3.5 |
| **1. Base config** | `tailwind.config.js`, `postcss.config.js`, `style.css`, `main.ts`, `router`, `vite.config.ts` | 3.2, 3.4, 3.6 |
| **2. Ícones** | `AppIcon.vue` → FontAwesome | 3.3 |
| **3. `defineModel`** | Reescrever os 11 `Base*`/seletores | 3.1 |
| **4. Imports manuais** | Varrer os `<script setup>` adicionando imports do Vue/EP | 3.4 |
| **5. Telas** | Copiar `pages/` + `components/` restantes; ajustar quebras | — |
| **6. Storybook** | Downgrade 10→8.6; EP global no `preview.ts`; validar stories | 3.9 |
| **7. Limpeza** | Remover Vitest; downgrade TS | 3.7, 3.8 |
| **8. Validação** | `vue-tsc -b` + build + `storybook` + smoke visual (dark mode, EP, charts) | todos |

**Prova de conceito recomendada:** portar **1 tela piloto** que exercite tudo
(ex.: uma do Gestor — tem EP + ECharts + AppIcon + `defineModel` via seletores)
para validar o padrão antes de escalar para as 19.

---

## 6. Resumo de esforço

| Eixo | Esforço | Arquivos |
| ---- | ------- | -------- |
| 3.1 Vue 3.5→3.3 (`defineModel`) | 🟡 Médio | 11 + config |
| 3.2 Tailwind v4→v3 | 🟡 Médio | 3 config + `style.css` |
| 3.3 Lucide→FontAwesome | 🟢 Baixo | **1** |
| 3.4 Auto-import→manual | 🟢 Baixo (revisto) | EP global + 13 imports (codemod); Vue já manual |
| 3.5 +ECharts | 🟢 Baixo | só deps |
| 3.6 Router hash | 🟢 Trivial | 1 |
| 3.7 −Vitest | 🟢 Trivial | config + 4 specs |
| 3.8 TS 6→5 | 🟢 Baixo | tsconfig |
| 3.9 Storybook 10→8.6 | 🟡 Médio | `package.json` + `preview.ts` + ~49 stories (verificar) |

**Gargalos (revistos após o PoC):** (a) `defineModel` → props/emit (10 arquivos),
(b) Tailwind config (3 arquivos + canais p/ opacidade), (c) downgrade do Storybook
(versões casadas + `@storybook/vue3` + `react`). Os imports manuais do Vue
**deixaram de ser gargalo** (já eram explícitos). Todo o resto é trivial,
centralizado ou automatizável por codemod.

---

## 7. Porte completo — executado e validado ✅

**O app INTEIRO foi portado** para a stack do time, como projeto **runnable**, em
`C:\Empresa\Projetos\poc-stack-antiga\` (pasta-irmã, isolada do repo):
**19 telas + ~100 componentes + 49 stories**. Começou por 1 piloto (Operação por
Canal) para travar o padrão; depois a árvore `src/` inteira foi copiada e os
transforms aplicados.

**Stack usada:** Vue 3.3 · Vite 4.5 · Tailwind 3.4 (PostCSS) · Element Plus 2.14
· FontAwesome 6 · ECharts 5 + vue-echarts 7 · Storybook 8.6 · TS 5.2.

**Transforms aplicados (receita reproduzível):**
1. `cp` da árvore `src/` real → projeto destino.
2. `AppIcon.vue` → FontAwesome (1 arquivo; call sites intactos).
3. `defineModel` → props/emit/computed (**10** arquivos `Base*`/seletores).
4. EP global em `main.ts` + `AppIcon` global; `import { ElMessage }` em **13**
   arquivos (codemod `scripts/inject-ep-imports.mjs`).
5. `style.css` → Tailwind v3 (EP `@import` no topo; canais p/ opacidade);
   `tailwind.config.js` + `postcss.config.js`; `vite.config.ts` sem auto-import.
6. Router `createWebHistory` → `createWebHashHistory` (sed).
7. Remover 4 `*.spec.ts` (Vitest).
8. Storybook: versões 8.6 + `react`; `@storybook/vue3-vite` → `@storybook/vue3`
   nas 49 stories (sed); EP global no `preview.ts`.

**Validações (todas passaram, app COMPLETO):**

| Verificação | Comando / método | Resultado |
| ----------- | ---------------- | --------- |
| Instalação | `npm install` | sem conflitos de peer-deps |
| Build do app | `vite build` | OK · **19 telas** compiladas · EP no bundle |
| Type-check | `vue-tsc --noEmit` | **exit 0** (121 arquivos) |
| Storybook | `storybook build` | OK · **49 stories** sobre Vite 4 |
| Runtime (5 rotas) | dev server + console | **0 erros**; Home, Tempo Real, Indicadores, Ocorrências, Notificações renderam |
| EP não achatado | `getComputedStyle` | botão primário `rgb(90,147,230)` |
| Utilitárias > EP · `/opacity` | idem | `bg-ms-primary` resolve · `bg-ms-primary/5` → `rgba(…,0.05)` |
| Dark mode · FontAwesome · ECharts | idem | `html.dark` troca tokens · `svg.svg-inline--fa` · `<canvas>` |

**Padrão fixado:** EP + AppIcon **globais** (`main.ts`/`preview.ts`) → templates
`<el-*>`/`<AppIcon>` **inalterados**. O `DashboardLayout` real (topbar/sidebar)
foi portado e funciona. O time copia `src/` + configs do PoC para o Vibe Kanban,
ou roda a mesma receita lá.
