---
name: playbook
description: >-
  Playbook de design de produto do Mobile Saúde — o processo padrão (do contexto à
  publicação) que garante consistência entre plataformas. Use no INÍCIO de um card
  de design/produto para saber qual etapa e qual skill/agente acionar, e como
  encadear discovery → cenários → implementação → link de teste/review → documentação.
  GATILHOS: playbook, processo de design, por onde começo, fluxo de trabalho, pipeline de design.
---

# Playbook de Design — Mobile Saúde

A skill-âncora que amarra o processo. Um app de saúde pt-BR; consistência entre
plataformas (inclui a stack portada — ver `DE-PARA-STACK-ANTIGA.md`). Siga o
pipeline e acione a competência (skill) ou o papel (agente) certo em cada etapa.

## O pipeline (do contexto à publicação)

```
1. Discovery/contexto → 2. Cenários & estados → 3. Implementação
   → 4. Link de teste / Review → 5. Documentação → 6. Publicação
        └──────────── Playbook + Design System mantêm consistência ───────────┘
```

| # | Etapa | O que fazer | Acione |
| - | ----- | ----------- | ------ |
| 1 | **Discovery/contexto** | objetivo do usuário, contexto, MDs/PRD, design points, restrições | skill `discovery-contexto` |
| 2 | **Cenários & estados** | dimensões de cenário + matriz cenário×estado (cobrir tudo, não só happy path) | skill **`cenarios-estados`** |
| 3 | **Implementação** | construir tela/componente no DS (tokens, Base*, a11y, Storybook) | agente `product-designer-senior` + skills `component-spec`, `design-system-tokens`, `accessibility-audit` |
| 4 | **Link de teste / Review** | validar build/dev; revisar diff (UX, DS, a11y); aprovar/reprovar | agente `design-reviewer` (read-only) |
| 5 | **Documentação** | documentar o fluxo (cenários, estados, decisões) | skill `documentacao-fluxo` |
| 6 | **Publicação** | publicar/atualizar no Confluence | agente `orquestrador` (tools Confluence: `fetch`→`updatePage`, confirmar antes) |

## Princípios de consistência (o "ganho" do playbook)
1. **Reuse antes de criar** — `src/components/base/` e `ui/` primeiro (ver `component-spec`).
2. **Tokens, nunca cor crua** — `ms-*`; funciona em light **e** dark (`design-system-tokens`).
3. **Cobertura de estados é obrigatória** — carregando/vazio/filtrado-vazio/erro/sucesso (`cenarios-estados`).
4. **Acessibilidade não-negociável** — WCAG AA, piso 12px, foco, cor+rótulo (`accessibility-audit`).
5. **Storybook documenta o DS** — toda peça `base/`/`ui/` tem `*.stories.ts`.
6. **Microcopy pt-BR** — clara, humana, sem jargão (`ux-writing`).
7. **Multi-plataforma** — o mesmo comportamento vale na stack nova e na portada.

## Quando é skill × quando é agente
- **Competência do mesmo designer** → skill (discovery, cenários, ux-writing, métricas, a11y, tokens, component-spec, doc).
- **Papel com tools/permissão diferentes ou isolado** → agente (`design-reviewer` read-only; `orquestrador` publica no Confluence). Ver `docs/PADRAO-AGENTES-IA.md`.

## Saída de um card pelo playbook
- Contexto e cenários explícitos → implementação no DS com estados cobertos →
  build/dev verde (link de teste) → review aprovado → fluxo documentado (e publicado
  se aplicável). Sinalize débitos e arquivos globais tocados.

Índice completo do processo em `docs/PLAYBOOK.md`.
