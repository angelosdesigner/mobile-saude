---
name: component-spec
description: >-
  Processo para projetar e construir um componente de UI novo (ou refatorar um
  existente) no Mobile Saúde, do design à implementação Vue 3 + Element Plus +
  Tailwind, com Storybook. Use ao criar um Base*/UI component, uma nova tela, ou
  ao padronizar um padrão visual repetido.
---

# Spec de componente — Mobile Saúde

Use para entregar um componente coeso com o design system, não um one-off.

## 1. Antes de criar — existe algo reaproveitável?

Procure em `src/components/base/` (primitivos: `BaseButton`, `BaseCard`,
`BaseInput`, `BaseModal`, `BaseDrawer`, `BaseSelect`, `BaseTable`, `BaseTag`,
`BaseBadge`, `BaseTooltip`, `BaseSkeleton`, `BaseCheckbox`, `BaseRadio`) e em
`src/components/ui/` (compostos: `DataList`, `EmptyState`, `FilterChips`,
`KanbanBoard`, `KanbanCard`, `SectionHeader`, `PrioridadeTag`, `ChannelTag`).
Componha a partir deles antes de criar do zero. Element Plus cru (`<el-*>`)
entra quando não há Base equivalente.

## 2. Defina a spec (escreva antes de codar)

- **Propósito** e onde será usado (rota/contexto).
- **Anatomia**: partes visuais e slots.
- **Props** (tipadas em TS) e eventos (`emit`) — nomes em inglês, valores pt-BR.
- **Variantes** (ex.: tipo/tom/tamanho) e **estados**: default, hover, focus,
  disabled, loading, **vazio**, **erro**, selecionado.
- **Tokens** que usará (cores semânticas `ms-*`, raios, sombras, espaçamento).
- **Acessibilidade**: papel ARIA, label, navegação por teclado, contraste AA.

## 3. Implemente (convenções do projeto)

- SFC `<script setup lang="ts">`; props via `defineProps<T>()`, eventos via
  `defineEmits<T>()`. Forneça defaults — sem prop obrigatória sem necessidade.
- Element Plus **auto-importado** (sem linhas de import de EP).
- Layout/cor/espaçamento com **utilitárias Tailwind** e **tokens semânticos**
  (`text-ms-*`, `bg-ms-*`, `border-ms-*`). Sem hex cru. Veja a skill
  **design-system-tokens**.
- Use `BaseSkeleton` para loading e `EmptyState` para o estado vazio.
- Garanta **light e dark** corretos.

## 4. Storybook (obrigatório para Base*/UI)

Crie `NomeDoComponente.stories.ts` ao lado do `.vue`, seguindo o padrão dos
stories existentes (ex.: `BaseButton.stories.ts`). Cubra:

- `Meta` com `title: 'Base/...'` ou `'UI/...'` e `component`.
- Uma story por variante principal + estados (Loading, Disabled, Empty, Error).
- `args`/`argTypes` para as props relevantes (controles interativos).

## 5. Validação (checklist de saída)

- [ ] `npm run build` passa (inclui `vue-tsc`) — zero erro de tipo.
- [ ] `npm run lint` limpo (se disponível).
- [ ] Renderiza certo em **light e dark**.
- [ ] Todos os estados cobertos (incl. vazio e erro).
- [ ] Sem cor crua; só tokens e componentes base.
- [ ] Story criada/atualizada e abrindo no Storybook.
- [ ] Acessibilidade: foco visível, teclado, ARIA/label, contraste AA, ≥12px.

Ao final, resuma: anatomia, props/eventos, variantes/estados e como ver no
Storybook.
