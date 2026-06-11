# AUDIT REPORT — Mobile Saúde Frontend
**Data:** 2026-06-11  
**Auditores:** Principal SWE · Software Architect · Staff Frontend · QA Specialist · DevOps  
**Stack:** Vue 3.5 · TypeScript 6 · Vite 8 · Element Plus 2.14 · Tailwind CSS v4  
**Branch auditada:** `main` (HEAD `6cd117b`)

---

## Executive Summary

O projeto é um protótipo de alta fidelidade visual construído rapidamente para validar fluxos de uma plataforma de gestão de atendimento em saúde. A qualidade estética e a escolha de stack são acertadas. O código é legível e bem intencionado. No entanto, **o projeto não está pronto para ser base de desenvolvimento profissional** sem um ciclo de refatoração estrutural.

Os problemas críticos são: ausência total de testes, ausência de camada de API/serviços, estado global implícito em vez de gerenciador de estado explícito, dados mock entrelaçados com lógica de negócio, múltiplos dead-ends de UX (botões sem handler, rotas inexistentes, dados hardcoded que fingem ser dinâmicos), e zero configuração de linting/formatação.

O projeto está classificado como **Protótipo → Early MVP**. Com um plano de refatoração de 3–4 semanas é possível elevá-lo a **MVP produtizável**.

---

## Scores

| Dimensão             | Nota | Classificação          |
|----------------------|------|------------------------|
| Arquitetura          | 5/10 | Aceitável              |
| Qualidade de Código  | 4/10 | Ruim                   |
| Escalabilidade       | 3/10 | Crítico                |
| Performance          | 4/10 | Ruim                   |
| Produção Readiness   | 2/10 | Crítico                |
| Dívida Técnica       | 5/10 | Aceitável (controlável)|

---

## 1. Arquitetura

### Organização de pastas
**Classificação: Bom**

A estrutura `pages/ components/ composables/ data/ directives/ layouts/ router/` é limpa e intuitiva. A separação entre páginas e componentes está correta. O agrupamento de componentes por domínio (`ocorrencias/`, `layout/`, `fila/`) é adequado.

**Problema:** não existe pasta `services/` ou `api/`. Não existe `stores/`. Não existe `types/` centralizado. Quando a camada de API chegar, não há onde colocá-la sem criar convenção na hora.

### Separação de responsabilidades
**Classificação: Aceitável**

Os composables isolam lógica reutilizável. Mas `useOcorrencias.ts` acumula responsabilidades demais: estado do board, filtros, notificações, configuração de colunas e filtros salvos — contextos distintos dentro do mesmo módulo.

### Acoplamento / Estado global implícito
**Classificação: Ruim**

`board`, `filters`, `notifications`, `columnConfig` e `savedFilters` são declarados no **nível de módulo** (fora da função `useOcorrencias()`). Isso os torna singletons globais implícitos. O padrão funciona num SPA simples, mas:

- Impossibilita reset de estado isolado por rota
- Impossibilita testes unitários sem side effects entre casos
- Mascara dependências — qualquer componente que chamar `useOcorrencias()` obtém o mesmo estado, sem declarar isso explicitamente
- Não escala quando múltiplos "contextos" de ocorrência existirem (ex: ocorrências do atendente vs. do gestor)

**Solução:** migrar para Pinia. É o gerenciador oficial do ecossistema Vue 3, tem devtools, suporta reset, SSR e testes limpos.

### Camada de dados / API
**Classificação: Crítico**

Não existe camada de serviços. `src/data/ocorrencias.ts` exporta arrays hardcoded diretamente consumidos por composables e páginas. Quando APIs reais chegarem, será necessário alterar composables, páginas e data files simultaneamente — alto risco de regressão.

**Solução:** criar `src/services/ocorrenciasService.ts` com funções assíncronas (`fetchOcorrencias`, `updateOcorrenciaStatus`, etc.) desde já, mesmo retornando mocks. Isso mantém os composables agnósticos à fonte de dados.

### Escalabilidade estrutural
**Classificação: Ruim**

Rotas inexistentes no sidebar (`/atendimento`, `/contatos`, `/agenda`, `/widgets`) criam falsa impressão de produto completo e são dead-ends para o usuário. Novas telas não têm padrão de onde criar serviços, tipos, stores.

---

## 2. Frontend Engineering

### Componentização
**Classificação: Bom**

Componentes bem granularizados. Modais individuais por ação. `FloatingDock` como container arrastável reutilizável. `DashboardLayout` como wrapper de página.

**Problema:** `InicioView.vue` (200 linhas) e `OcorrenciaDetalheView.vue` (172 linhas) têm lógica de dados misturada com template. Poderiam extrair seções como `ConteudoDano.vue`, `RiscoFinanceiro.vue`, `TimelineConversa.vue`.

### SVGs inline em massa
**Classificação: Crítico**

Todos os ícones são SVGs copy-pasted inline em templates. São pelo menos **30+ SVGs duplicados** espalhados por `AppSidebar.vue`, `OcorrenciasBoard.vue`, `OcorrenciasView.vue`, `AppTopbar.vue`, etc.

Problemas:
- Templates inflados e ilegíveis
- Nenhuma reutilização — o mesmo ícone de "chevron" aparece 4+ vezes
- Alterar o estilo de um ícone exige busca global
- Tamanho do bundle maior que o necessário

**Solução:** criar `src/components/ui/AppIcon.vue` com um mapa de ícones nomeados, ou adotar uma biblioteca leve como `@iconify/vue`.

### Re-renders e `v-show` vs `v-if`
**Classificação: Ruim**

`OcorrenciasBoard.vue` usa `v-show="passesFilter(o)"` em cada card. Isso significa:
- Todos os cards estão no DOM, apenas ocultados
- `passesFilter` é chamado como função plain (não é computed), sendo invocado a cada re-render do componente
- Com 100+ ocorrências, o DOM terá 100+ cards renderizados mas invisíveis

**Solução:** usar `filteredList` (já computado em `useOcorrencias`) particionado por coluna, com `v-if` ou, melhor ainda, virtualização com `vue-virtual-scroller`.

### State Management — ausência de Pinia
**Classificação: Ruim**

Ver seção Arquitetura. Impacto direto em testabilidade e manutenção.

### Lazy Loading
**Classificação: Bom**

Todas as páginas são lazy-loaded no router. Correto.

### Responsividade
**Classificação: Aceitável**

Tailwind responsive prefixes (`md:`, `lg:`, `xl:`) são usados. O kanban board (`w-72 shrink-0`) não colapsa em mobile — em telas < 600px o scroll horizontal é a única saída, não é uma UX mobile adequada.

---

## 3. TypeScript

### Segurança de tipos
**Classificação: Aceitável**

Não há `any` explícito. Os tipos básicos estão corretos. Porém há fragilidades importantes:

**`dragScroll.ts:56` — double cast:**
```typescript
// ATUAL — bypassa o sistema de tipos
(el as unknown as { __ds: () => void }).__ds = () => { ... }

// CORRETO — usar WeakMap para associar cleanup a elementos DOM
const cleanupMap = new WeakMap<HTMLElement, () => void>()
// ... na mounted: cleanupMap.set(el, cleanup)
// ... na unmounted: cleanupMap.get(el)?.()
```

**`Ocorrencia` — campos frouxos:**
```typescript
// ATUAL
status: string
channel: string
tipoOcorrencia: string
tipoAtendimento: string
atendente: string

// CORRETO — usar os tipos já definidos nas opções
channel: 'WhatsApp' | 'Portal Web' | 'Telefone' | 'Presencial' | 'App'
tipoOcorrencia: 'Autorização' | 'Reembolso' | 'Segunda via' | 'Reclamação' | 'Cancelamento'
// etc.
```

**`SavedFilter.apply` — `status` ausente:**
O tipo de `apply` não inclui `status` como chave possível, mas `filters` tem `status: string[]`. `clearFilters()` limpa `filters.status` mas `applyPreset` nunca pode restaurá-lo.

**`time: string` e `sla: string` em `Ocorrencia`:**
São usados como display strings e como valores de filtro simultaneamente. Devem ser separados: `slaStatus: SlaStatus` (para filtragem) e `slaDisplay: string` (para exibição).

**Tipos centralizados ausentes:**
Tipos como `NotificacaoItem`, `ColumnCfg`, `SavedFilter` estão no composable. Deveriam estar em `src/types/`.

### Ausência de `noImplicitAny`
`tsconfig.app.json` herda de `@vue/tsconfig/tsconfig.dom.json`. A flag `strict` não é explicitamente definida — depende dos defaults do preset. Verificar se `strict: true` está ativo; se não, ativar explicitamente.

---

## 4. Clean Code

### Cores hex hardcoded em templates
**Classificação: Ruim**

`text-[#303133]`, `bg-[#409EFF]`, `border-[#DCDFE6]`, `text-[#909399]` aparecem dezenas de vezes em todos os arquivos `.vue`. São valores arbitrários sem semântica.

**Impacto:** trocar uma cor de marca exige busca global em todos os templates. Impossível criar tema escuro sem reescrita massiva.

**Solução:**
```css
/* src/style.css — adicionar aliases semânticos */
:root {
  --color-text-primary: #303133;
  --color-text-secondary: #606266;
  --color-text-muted: #909399;
  --color-text-placeholder: #C0C4CC;
  --color-brand: #409EFF;
  --color-border: #DCDFE6;
  --color-bg-page: #F5F7FA;
}
```
```javascript
// tailwind.config.js (ou CSS @theme em Tailwind v4)
// mapear para classes utilitárias: text-primary, text-secondary, etc.
```

### Dados estáticos fingindo ser dinâmicos
**Classificação: Crítico**

`OcorrenciasView.vue:41–50` — `stats` é um array hardcoded:
```typescript
const stats = [
  { label: 'Total', value: 10, color: '#909399' },    // valor fixo, não reflete o board
  { label: 'SLA regulatório', value: 3, ... },         // valor fixo
  ...
]
```
Isso nunca mudará quando o usuário filtrar. O usuário verá "Total: 10" mesmo com 2 itens visíveis.

**Solução:** derivar de `filteredList` e `board`:
```typescript
const stats = computed(() => [
  { label: 'Total', value: filteredList.value.length },
  { label: 'SLA regulatório', value: filteredList.value.filter(o => o.sla === 'Crítico').length },
  ...
])
```

### Protocolo hardcoded no detalhe
`OcorrenciaDetalheView.vue:72` — `value: '00100200300400500'` ignora `oc.value.protocol`. Todos os 6 mocks têm o mesmo protocolo `'0010020030040050'` (diferente do hardcoded no template, que é `'00100200300400500'`).

### Botão "Enviar" sem handler
`OcorrenciaDetalheView.vue:133` — `<el-button type="primary">Enviar</el-button>` não tem `@click`. Dead-end de UX.

### Rotas inexistentes no sidebar
`AppSidebar.vue:17–21` — links para `/atendimento`, `/contatos`, `/agenda`, `/widgets` não existem no router. Clicando, o usuário vai para `NotFoundView`.

### `DemoView.vue` e `HomeView.vue`
`DemoView.vue` é explicitamente temporário (comentário na rota). `HomeView.vue` provavelmente é uma landing page de redirecionamento. Ambas precisam de decisão clara: remover ou definir papel permanente.

### Código morto
- `reply` ref em `OcorrenciaDetalheView.vue` — nunca enviada
- `conversa` computed — retorna dados mock estáticos (não é uma conversa real)
- `dados` computed — protocolo hardcoded

---

## 5. Performance

### `passesFilter` recalculada excessivamente
**Arquivo:** `src/composables/useOcorrencias.ts:74`  
**Problema:** `passesFilter` é uma função plain. Em `OcorrenciasBoard.vue`, é chamada via `v-show="passesFilter(o)"` para cada card no DOM. Vue não pode cacheá-la. A cada mudança de estado reativo no componente pai (hover, qualquer bind), todos os `v-show` re-avaliam.  
**Impacto:** Com 100 cards × 5 colunas = 500 chamadas por render cycle.  
**Solução:** Filtrar no computed antes de passar para o template:
```typescript
// Por coluna
const filteredBoard = computed(() =>
  Object.fromEntries(
    allColumns.map(c => [c, board[c].filter(passesFilter)])
  ) as Record<ColumnKey, Ocorrencia[]>
)
```

### Ausência de virtualização
**Arquivo:** `OcorrenciasBoard.vue`, `OcorrenciasList.vue`  
**Problema:** Todos os itens são renderizados no DOM.  
**Impacto:** Com 200+ ocorrências, o board ficará lento. Com 500+, inusável.  
**Solução:** `vue-virtual-scroller` ou `@tanstack/virtual` para lista. Para o board kanban, virtualizar por coluna.

### `window.addEventListener('pointermove')` sempre ativo
**Arquivo:** `src/directives/dragScroll.ts:54`  
**Problema:** O listener `pointermove` é adicionado no `window` no `mounted` do componente e permanece ativo o tempo todo (não apenas durante o drag).  
**Impacto:** Cada movimento do mouse dispara o handler, mesmo sem drag ativo. Em dispositivos lentos, pode causar jank.  
**Solução:**
```typescript
// Adicionar pointermove/pointerup APENAS no onDown, remover no onUp
const onDown = (e: PointerEvent) => {
  // ...
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
const onUp = () => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  // ...
}
// No mounted: apenas pointerdown no elemento
el.addEventListener('pointerdown', onDown)
```

### Bundle: Element Plus full CSS
**Problema:** `element-plus/dist/index.css` é importado inteiro (~300KB). A estratégia de cascade layers explica e justifica o tradeoff (documentado no CLAUDE.md). **Aceitável como decisão arquitetural**, mas documentar o impacto no Lighthouse.

---

## 6. UX Engineering

### Estados de loading
**Classificação: Crítico**

Zero estados de loading em qualquer componente. Quando APIs reais chegarem, o usuário verá telas em branco ou dados stale sem feedback visual.

**Solução:** criar componentes `SkeletonCard.vue` e `SkeletonList.vue` agora, mesmo que os dados ainda sejam síncronos. Estabelecer o padrão antes de precisar.

### Estados vazios
**Classificação: Ruim**

Se `filteredList` retornar vazio após filtros, o board mostra colunas vazias sem mensagem. A lista mostra tabela vazia. Nenhum feedback sobre "nenhum resultado para os filtros aplicados".

### Erros de UX — dead-ends
**Classificação: Crítico**

| Elemento | Arquivo | Problema |
|----------|---------|----------|
| Botão "Enviar" | `OcorrenciaDetalheView.vue:133` | Sem handler — não faz nada |
| Links sidebar | `AppSidebar.vue:17-21` | 4 rotas inexistentes |
| Stats chips | `OcorrenciasView.vue:41` | Valores fixos, nunca atualizam |
| Protocolo | `OcorrenciaDetalheView.vue:72` | Hardcoded, ignora dado real |
| `reply` input | `OcorrenciaDetalheView.vue:57` | Estado não usado |

### Acessibilidade
**Classificação: Ruim**

- Botões icon-only sem `aria-label` (ex: botão de colapsar sidebar, botão de voltar no detalhe)
- Drag-and-drop não acessível via teclado
- Sem `role` em elementos interativos customizados
- Sem foco visível customizado além do padrão do browser
- Sem `lang` no `<html>` (está em português mas não declarado)

---

## 7. Segurança

| Severidade | Arquivo | Problema |
|-----------|---------|----------|
| Baixo | `dragScroll.ts:38` | `document.body.style.cursor` — manipulação direta do DOM. Inofensivo mas padrão ruim. |
| Baixo | `OcorrenciaDetalheView.vue:57` | `reply` string não sanitizada. Safe agora (nunca renderizada como HTML), mas XSS risk se renderização mudar. |
| Médio | — | Ausência de autenticação/autorização. Qualquer URL é acessível diretamente. |
| Médio | — | Sem route guards. Rotas protegidas devem verificar sessão antes de montar. |
| Alto | — | Sem variáveis de ambiente configuradas. Quando tokens de API chegarem, não há padrão de onde colocá-los (`.env.local` não existe). |
| Crítico | — | Sem dependência de auth. Toda a aplicação assume usuário autenticado sem verificar. |

**Nota:** não há segredos, tokens ou credenciais hardcoded no código atual — ponto positivo.

---

## 8. Qualidade de Engenharia

### Linting e formatação
**Classificação: Crítico**

Não existe `.eslintrc` / `eslint.config.*` / `.prettierrc` / `.editorconfig`. Num time, isso gera inconsistências de estilo, erros silenciosos e PRs cheios de whitespace diffs.

**Stack recomendada:**
```bash
npm install -D eslint @vue/eslint-config-typescript eslint-plugin-vue prettier
```

### Testes
**Classificação: Crítico**

Zero arquivos de teste. Nenhum framework configurado (Vitest, Jest, Cypress, Playwright).

**Impacto:** impossível refatorar com segurança. Impossível validar que filtros funcionam corretamente. Impossível garantir não-regressão ao adicionar features.

**Mínimo viável:**
```bash
npm install -D vitest @vue/test-utils jsdom
```
Testar pelo menos: `passesFilter`, `onDrop`, `applyPreset`, `clearFilters`.

### CI/CD
**Classificação: Ruim**

Sem GitHub Actions. Nenhum pipeline de `lint → typecheck → test → build` em PRs. Qualquer erro de TypeScript pode ser mergeado sem perceber.

**Solução mínima** (`.github/workflows/ci.yml`):
```yaml
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build  # typecheck + build
```

### Estrutura de branches
**Classificação: Aceitável**

`main` → produção, `dev` → desenvolvimento (recém-criado). Adequado para time pequeno.

### Commits
**Classificação: Bom**

Mensagens no formato `feat: descrição curta`. Consistente, rastreável. Falta Conventional Commits enforcement (commitlint).

---

## 9. Preparação para Produção

**Veredicto: Protótipo**

| Critério | Status |
|----------|--------|
| Dados reais (API) | ❌ Mock hardcoded |
| Autenticação | ❌ Ausente |
| Testes | ❌ Ausente |
| Linting | ❌ Ausente |
| CI/CD | ❌ Ausente |
| Tratamento de erros | ❌ Ausente |
| Loading states | ❌ Ausente |
| Variáveis de ambiente | ❌ Ausente |
| Acessibilidade | ⚠️ Básica |
| Responsividade | ⚠️ Desktop-first |
| Componentes reutilizáveis | ✅ Bom |
| Estrutura de arquivos | ✅ Bom |
| Tipagem TypeScript | ⚠️ Parcial |
| Estratégia CSS | ✅ Excelente |
| Bundle/Deploy | ✅ Funcional |

---

## 10. Lista de Problemas

| # | Severidade | Arquivo | Linha | Problema | Impacto | Solução |
|---|-----------|---------|-------|----------|---------|---------|
| 1 | Crítico | `src/composables/useOcorrencias.ts` | 25–71 | Estado global implícito no nível de módulo | Impossível testar, impossível resetar, acoplamento oculto | Migrar para Pinia store |
| 2 | Crítico | Toda a aplicação | — | Zero testes | Refatoração insegura, regressões invisíveis | Configurar Vitest + @vue/test-utils |
| 3 | Crítico | Toda a aplicação | — | Sem camada de serviços/API | Quando APIs chegarem, reescrita massiva | Criar `src/services/` com funções assíncronas |
| 4 | Crítico | Toda a aplicação | — | Sem ESLint/Prettier | Inconsistências, erros silenciosos | Configurar eslint + prettier |
| 5 | Crítico | `src/pages/OcorrenciasView.vue` | 41–50 | Stats hardcoded, não refletem dados reais | UX enganosa | Derivar de computed sobre `filteredList` |
| 6 | Crítico | `src/components/layout/AppSidebar.vue` | 17–21 | 4 rotas inexistentes no sidebar | Dead-end de UX | Remover ou criar as rotas |
| 7 | Crítico | `src/pages/OcorrenciaDetalheView.vue` | 133 | Botão "Enviar" sem handler | Dead-end de UX | Implementar ou marcar explicitamente como placeholder |
| 8 | Alto | `src/directives/dragScroll.ts` | 54 | `pointermove` global sempre ativo | Performance em dispositivos lentos | Adicionar/remover listener apenas no drag ativo |
| 9 | Alto | Todos os .vue | — | 30+ SVGs inline duplicados | Templates ilegíveis, manutenção impossível | Criar `AppIcon.vue` ou usar @iconify/vue |
| 10 | Alto | Todos os .vue | — | Hex colors hardcoded (#303133, #409EFF etc.) | Impossível theming, trocar cor = busca global | CSS custom properties + aliases Tailwind |
| 11 | Alto | `src/data/ocorrencias.ts` | 52–98 | Todos os protocols idênticos (`0010020030040050`) | Dado incoerente | UUIDs únicos nos mocks |
| 12 | Alto | `src/pages/OcorrenciaDetalheView.vue` | 72 | Protocolo hardcoded, ignora `oc.value.protocol` | Dado errado para o usuário | Usar `oc.value.protocol` |
| 13 | Alto | Toda a aplicação | — | Sem autenticação/route guards | Rotas expostas | Implementar auth antes de produção |
| 14 | Alto | `src/composables/useOcorrencias.ts` | 74–82 | `passesFilter` plain function em `v-show` | Re-executa em todo render cycle | Computed filteredBoard por coluna |
| 15 | Alto | Toda a aplicação | — | Sem estados de loading/error/empty | UX quebrada quando APIs chegarem | Criar padrão de skeleton + empty state |
| 16 | Médio | `src/data/ocorrencias.ts` | 1–99 | Mock data no src/, não em `__mocks__/` ou fixture | Dados vão para bundle de produção | Mover para fixtures separadas ou feature-flag |
| 17 | Médio | `src/composables/useOcorrencias.ts` | 18–22 | `ColumnCfg`, `NotificacaoItem`, `SavedFilter` definidos no composable | Tipos espalhados | Criar `src/types/ocorrencias.ts` |
| 18 | Médio | `src/data/ocorrencias.ts` | 13–33 | `status`, `channel`, `tipoOcorrencia` são `string` livres | Type safety fraca | Converter para union types |
| 19 | Médio | `src/directives/dragScroll.ts` | 56 | `as unknown as` double cast | Bypassa type system | Usar WeakMap para cleanup |
| 20 | Médio | `src/router/index.ts` | 9–12 | Comentário com Figma node IDs | Não pertence ao código de produção | Remover comentários de Figma |
| 21 | Médio | `src/pages/DemoView.vue` | — | Página explicitamente temporária | Confusão de propósito | Remover ou transformar em Storybook |
| 22 | Médio | Toda a aplicação | — | Sem `aria-label` em botões icon-only | Acessibilidade mínima não atendida | Adicionar aria-labels |
| 23 | Médio | Toda a aplicação | — | Sem CI/CD pipeline | Merges com erros passam despercebidos | GitHub Actions: lint → typecheck → build |
| 24 | Baixo | `src/router/index.ts` | — | `HomeView.vue` + `/demo` sem propósito claro | Confusão de onboarding | Definir ou remover |
| 25 | Baixo | `src/pages/OcorrenciaDetalheView.vue` | 57–66 | `conversa` computed com mock estático | Não representa dado real | Aceitar como placeholder ou remover |
