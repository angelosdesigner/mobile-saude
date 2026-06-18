---
name: design-system-tokens
description: >-
  Como usar e estender corretamente o sistema de design tokens do Mobile Saúde
  (primitivos --ms-* e semânticos --color-ms-*), a arquitetura de cascade layers
  Element Plus + Tailwind v4, e o dark mode. Use ao escolher cores/espaçamento,
  adicionar um token, ajustar tema claro/escuro, ou sempre que for tentado a
  escrever um hex cru num componente.
---

# Design tokens — Mobile Saúde

Modelo de **2 camadas** (referência: Material 3, Spectrum, Primer). A fonte da
verdade é `src/style.css`.

## Camadas

- **Tier 1 — PRIMITIVOS (`--ms-*`)**: valores crus, agnósticos de tema
  (`--ms-blue-500`, `--ms-gray-800`, `--ms-dark-surface`…). NÃO geram utilitárias.
- **Tier 2 — SEMÂNTICOS (`--color-ms-*`)**: papel/uso; referenciam primitivos e
  **viram no tema**. Só estes geram utilitárias Tailwind (`text-ms-*`, `bg-ms-*`,
  `border-ms-*`). **Componentes só consomem semânticos.**

## Catálogo semântico (use estes nos componentes)

| Papel | Utilitária | Uso |
| --- | --- | --- |
| Texto primário | `text-ms-text-primary` | títulos, texto forte |
| Texto regular | `text-ms-text-regular` | corpo |
| Texto secundário | `text-ms-text-secondary` | apoio (≈4.7:1, AA) |
| Placeholder | `text-ms-text-placeholder` | dicas em inputs |
| Marca/ação | `bg-ms-primary` / `text-ms-primary` | botões, links, ativo |
| Marca suave | `bg-ms-primary-light` | fundo de item ativo |
| Sucesso | `*-ms-success` | confirmações |
| Aviso | `*-ms-warning` | atenção |
| Perigo | `*-ms-danger` | erro/destrutivo |
| Teal | `*-ms-teal` | estágio "Atendimento Humano" |
| Roxo | `*-ms-purple` | NPS / insights de IA |
| On-color | `text-ms-on-primary`, `text-ms-on-success`, `text-ms-on-warning` (escuro!), `text-ms-on-danger`, `text-ms-on-teal`, `text-ms-on-purple` | texto/ícone SOBRE preenchimento de cor |
| Superfície nível 1 | `bg-ms-bg` | fundo de página |
| Superfície nível 2 | `bg-ms-fill-light` | container / header de tabela |
| Superfície nível 3 | `bg-ms-surface` | card |
| Bordas | `border-ms-border`, `border-ms-border-light`, `border-ms-border-lighter` | divisores |

> `on-warning` é **escuro de propósito**: branco sobre âmbar reprova WCAG AA.

## Regras (não quebrar)

1. **Nunca** escreva hex/`rgb()` cru num componente `.vue`. Use a utilitária do
   token semântico.
2. **Cor de marca nova** → adicione/edite um **primitivo** `--ms-*` em `:root`.
3. **Mudar o papel de uma cor** (ex.: novo "primary") → reaponte o **semântico**
   `--color-ms-*` no `@theme` e o equivalente em `html.dark`.
4. **Token semântico novo** → declare em `@theme { --color-ms-...: var(--ms-...) }`
   e, se o valor muda no escuro, reaponte dentro de `html.dark { ... }`.
5. Tudo precisa funcionar em **light E dark**. Sempre valide os dois (a barra de
   temas do Storybook ajuda).
6. Tipografia: piso de **12px** (`--text-2xs` / `text-xs`). Nada abaixo disso.
7. Raios e sombras também são tokens (`--el-border-radius-base: 10px`, cards
   16px, `--ms-shadow-card`). Reutilize; não invente valores soltos.

## Cascade layers (a regra que sustenta tudo)

`src/style.css` declara a ordem ANTES de qualquer `@import`:

    @layer theme, base, element-plus, components, utilities;

Prioridade (baixa → alta): `theme` < `base` (preflight) < `element-plus` <
`components` < `utilities`.

- Element Plus fica **acima** do preflight → o reset não achata os componentes EP.
- `utilities` (Tailwind) fica **no topo** → utilitárias vencem ao decorar um `<el-*>`.
- Por isso `ElementPlusResolver` usa `importStyle: false` (`vite.config.ts`): evita
  CSS por-componente injetado **sem layer**, que venceria todo `@layer`. **Não
  mude isso.** Se um dia voltar a `importStyle: 'css'`, será preciso usar o
  modificador `!` do Tailwind (ex.: `!bg-ms-primary`) para vencer o EP.

## Dark mode

Baseado em **classe** `.dark` no `<html>` (toggle manual via `src/stores/theme.ts`,
não `prefers-color-scheme`). O bloco `html.dark` em `style.css` apenas **reaponta
os semânticos** para primitivos "soft" calibrados — as utilitárias passam a
resolver o valor escuro automaticamente. Use `dark:` do Tailwind só para ajustes
pontuais; o caminho preferido é o token virar sozinho.
