---
name: cenarios-estados
description: >-
  Mapear e COBRIR cenários e estados de uma tela/fluxo do Mobile Saúde — antes e
  depois de desenhar/implementar. Cobre as dimensões de cenário (papel, perfil,
  canal, período, SLA, prioridade, estágio, audiência), a modelagem data-driven do
  projeto, e TODOS os estados de UI (carregando, vazio, filtrado-vazio, erro,
  sucesso, semânticos, leitura/seleção/expansão, edge cases). Use quando o card
  citar: cenários, estados, edge cases, variações, "cobrir os estados", matriz de
  cenários, ou ao preparar o "link de teste" de um fluxo.
---

# Cenários & Estados — Mobile Saúde

Garanta que a tela/fluxo cubra **todas as variações (cenários)** e **todos os
estados de UI** — nunca só o "happy path". App de saúde pt-BR: clareza e confiança
acima de tudo. Ancore-se nos padrões reais do projeto (abaixo).

## 1. Pense em DIMENSÕES de cenário

O produto reconfigura telas por combinação destas dimensões (fonte da verdade nos
tipos/dados). Para cada tela, liste **quais dimensões a afetam** e **se vêm de
rota (fixo) ou de ref (dinâmico)**:

| Dimensão | Valores | Reconfigura | Fonte |
| -------- | ------- | ----------- | ----- |
| **Papel** | atendente · gestor | navegação, telas visíveis | `stores/profile.ts` |
| **Perfil** | quente · frio · ambos | fila ao vivo aparece? (`hasQueue`) | `stores/profile.ts` |
| **Canal** | Chat/WhatsApp · Telefone · Portal · App · Balcão | KPIs, gráfico, alertas, IA, destaque em tabelas | `data/gestorOperacaoCanal.ts` (`contextos`), `gestorTaxonomia.ts` |
| **Período** | Tempo real · Hoje · 7d · 30d · Trimestre | escala volume (taxas/tempos ficam estáveis), eixos | `data/gestorPeriodo.ts` |
| **SLA** | Dentro · Atenção · Vencido · Crítico · Sem SLA | cor/tom, ordenação, filtros | `types/ocorrencias.ts` |
| **Prioridade** | Alta · Média · Baixa | ícone/cor, ordenação | `types/ocorrencias.ts` |
| **Estágio** | Novo · Em atendimento · Em espera · Encaminhamentos · Concluídos | colunas do board, ações disponíveis | `types/ocorrencias.ts` |
| **Audiência** | atendente · gestor · todos | filtro de notificações | `types/notificacoes.ts` |

> Pergunte: quais dimensões? fixas (rota) vs dinâmicas (ref)? combinam entre si?
> são hierárquicas (período reescala KPI → muda eixo do gráfico)?

## 2. Modele cenário DATA-DRIVEN (padrão do projeto — não invente outro)

- **`as const` → union type** (fonte única; tipo e UI nunca divergem):
  `export const prioridadeOptions = ['Alta','Média','Baixa'] as const` →
  `type Prioridade = (typeof prioridadeOptions)[number]`.
- **`Record<Chave, Contexto>`** reconfigura a tela inteira por **um lookup**
  (ex.: `contextos[ctxKey]` em `OperacaoCanalView.vue` muda KPIs/alertas/IA/tabelas).
  Cada chave deve trazer **todos** os campos → impede "esqueci isso num cenário".
- **Discriminated union por `kind`** quando itens têm formas diferentes
  (ex.: timeline da jornada: `divider | event | bubble | note | …`).
- **Computed cascade**: selector → `ctx` → derivados (títulos, séries) reagem sozinhos.
- **Predicates puros** para filtros: chips = **OR**, dropdowns = **AND**
  (ver `stores/ocorrencias.ts`). Adicionar filtro = adicionar predicate + tipo.

## 3. Cubra TODOS os estados (matriz obrigatória)

Para cada tela, garanta cada linha — com o componente e a microcopy do projeto:

| Estado | Quando | Use | Microcopy pt-BR (padrão) |
| ------ | ------ | --- | ------------------------ |
| **Carregando** | fetch em curso | `BaseSkeleton` (preserva layout) ou `v-loading`; `aria-busy` | — (visual) |
| **Vazio inicial** | zero itens, sem filtro | `EmptyState` (tom otimista) | "Tudo em dia" |
| **Filtrado-vazio** | filtro/busca sem resultado | `EmptyState` + botão **Limpar filtros (N)** | "Nenhuma ocorrência para os filtros aplicados" |
| **Erro** | falha de carga/ação | mensagem **o que + como resolver**; `role="alert"`; `store.error` | "Erro ao carregar ocorrências" |
| **Sucesso / feedback** | ação concluída | `useActionFeedback().done()` / `comingSoon()` (ElMessage) | "Ocorrência encaminhada", "Protocolo copiado" |
| **Semântico (status)** | SLA/prioridade/status/canal/severidade | **cor + rótulo** (nunca só cor): `SlaBadge`, `PrioridadeTag`, `StatusBadge`, `ChannelTag`, `BaseBadge` | "Crítico", "Alta", "Em análise" |
| **Leitura** | notificações | dot + `bg-ms-primary/5` em não-lida | "Apenas não lidas", "Marcar todas como lidas" |
| **Seleção / expansão** | listas | `DataList` (`selectable`, `expandable`/`#expand`), `SecoesColapsaveis` | "Sem detalhes adicionais." |

> ⚠️ **Distinga vazio-inicial de filtrado-vazio** (erro comum). São mensagens e
> ações diferentes — ver `NotificacoesView.vue` ("Tudo em dia" × "Nenhuma… +
> Limpar filtros").

**Edge cases a checar sempre:** listas longas (paginação do `DataList`), textos
longos (truncar + tooltip / `show-overflow-tooltip`), valores extremos (0, milhares),
sem permissão, offline/sem dados, e **light E dark**.

## 4. Entregável: matriz Cenários × Estados

Monte uma tabela **cenário (combinação de dimensões) × estado** dizendo o que a
tela mostra em cada célula. É isso que alimenta o **"link de teste"** (o dev/QA
valida célula a célula antes de subir) e o que a skill `documentacao-fluxo` publica.

## 5. Checklist de saída
- [ ] Dimensões de cenário mapeadas (fixas vs dinâmicas; combinam? hierárquicas?).
- [ ] Cenários modelados data-driven (`Record`/union/discriminated), sem if/else paralelo.
- [ ] Estados cobertos: carregando · vazio · **filtrado-vazio** · erro · sucesso.
- [ ] Semânticos por **cor + rótulo** (nunca só cor).
- [ ] Edge cases (longos, extremos, sem permissão, offline) e **light/dark**.
- [ ] Microcopy pt-BR clara (reusa os padrões do projeto).
- [ ] Matriz Cenários × Estados pronta (base do link de teste e da doc).

Skills relacionadas: `component-spec` (construir), `accessibility-audit` (a11y),
`design-system-tokens` (cores/tokens), `documentacao-fluxo` (publicar).
