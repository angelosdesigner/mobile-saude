# Agentes e Skills de Design — Mobile Saúde

Kit de agentes de **Product Design** para rodar com Claude Code no fluxo SDD.
São arquivos de projeto que o Claude Code carrega automaticamente neste repositório.

Referências internas: [`docs/PADRAO-AGENTES-IA.md`](../docs/PADRAO-AGENTES-IA.md) (convenções de
autoria) e [`docs/PLAYBOOK.md`](../docs/PLAYBOOK.md) (processo end-to-end do card).

---

## Agentes (`.claude/agents/`)

| Agente | Papel | Quando usar |
| ------ | ----- | ----------- |
| **orquestrador** | Roteador de intenção + publicação Confluence | Ponto de entrada quando o pedido envolve mais de um especialista, ou quando precisa documentar |
| **discovery-builder** | Captura e estrutura o briefing inicial (TM20-00) | Cadeia SDD: posição 1 — guia PM/PO a preencher Contexto e Jornadas *(agente pendente)* |
| **ux-discovery** | UX Discovery — gera Proposta de Interface (TM20-00) | Cadeia SDD: posição 2 — transforma briefing + jornadas em proposta UX |
| **ux-spec** | UX Spec — gera Wireframes + Versões aprovadas (TM20-00) | Cadeia SDD: posição 4 — transforma requisitos em spec UX completa |
| **product-designer-senior** | Estrategista de design — decisões de componentes, tokens e microcopy | Cadeia SDD: posição 5 — produz design-spec para o arquiteto-de-solução |
| **arquiteto-de-solucao** | Arquitetura técnica da solução | Cadeia SDD: posição 6 — define estrutura, estado, APIs e padrões *(agente pendente)* |
| **coder** | Implementação frontend (Vue 3 + TypeScript) | Cadeia SDD: posição 7 — implementa código a partir da arquitetura *(agente pendente)* |
| **design-reviewer** | Revisor de design (read-only) | Coluna Review — audita diff antes do merge |
| **formbuilder** | Formulários — campos, validação, máscaras | Cards que citam formulário, campos, el-form, validação |

> `_TEMPLATE.md` é o boilerplate para criar novos agentes. Ver `PADRAO-AGENTES-IA.md`.

---

## Skills (`.claude/skills/`)

Skills são **competências invocáveis** pelo mesmo agente — não criam um novo system
prompt, apenas injetam um roteiro especializado. O Claude Code invoca pela
`description` do frontmatter (campo `GATILHOS:`).

### Processo do card (ordem do fluxo)

| Skill | Quando invocar |
| ----- | -------------- |
| **playbook** | Ver o processo completo do Vibe Kanban (do discovery ao merge) |
| **discovery-contexto** | Início de qualquer card — mapear contexto e objetivo antes de decidir |
| **mapeamento-jornada** | Estruturar jornada do usuário (tabela Ator/Ação/Sistema) para o template TM20-00 |
| **proposta-preliminar** | Gerar "Proposta de interface UX/Design" completa no formato TM20-00 |
| **arquitetura-fluxos** | Card cita fluxo, navegação, mapa de telas, jornada, drill-down |
| **cenarios-estados** | Mapear cenários (papel/canal/SLA…) e cobrir todos os estados de UI |
| **criterios-ux** | Derivar critérios de aceite de UX a partir dos requisitos do Agente 1 |
| **ux-writing** | Microcopy, empty states, erros, labels, nomenclatura em pt-BR |
| **documentacao-fluxo** | Documentar/registrar o fluxo; publicar no Confluence |
| **metricas-heart** | Definir/revisar métricas de produto (HEART framework) |

### Design system & qualidade

| Skill | Quando invocar |
| ----- | -------------- |
| **design-system-tokens** | Usar/estender tokens (`--ms-*` → `--color-ms-*`), cascade layers, dark mode |
| **component-spec** | Projetar e construir um componente novo (design → implementação → Storybook) |
| **accessibility-audit** | Checklist WCAG 2.1 AA — invocar antes de fechar qualquer card de interface |
| **design-critique** | Crítica heurística (Nielsen + hierarquia visual) sem precisar mexer em código |

---

## Cadeia SDD — 7 agentes

```
A fazer
  └─► orquestrador (identifica intenção, roteia)
        │
        ├─► [1] discovery-builder  (captura briefing inicial)       [pendente]
        │         → docs/discovery/<card-id>-briefing.md
        │         → Confluence: Contexto e valor + Jornada
        │
        ├─► [2] ux-discovery  (proposta UX)
        │         skills: discovery-contexto → mapeamento-jornada → metricas-heart
        │               → proposta-preliminar → [publica Confluence]
        │         → docs/ux-discovery/<card-id>-proposta-ux.md
        │
        ├─► [3] Agente de Requisitos → requisitos consolidados
        │
        ├─► [4] ux-spec  (especificação UX)
        │         skills: discovery-contexto → arquitetura-fluxos → cenarios-estados
        │               → component-spec → ux-writing → criterios-ux
        │               → accessibility-audit → documentacao-fluxo → [publica Confluence]
        │         → docs/ux-spec/<card-id>-wireframes.md
        │
        ├─► [5] product-designer-senior  (decisões de design)
        │         skills: discovery-contexto → cenarios-estados → arquitetura-fluxos
        │               → component-spec → ux-writing → accessibility-audit
        │         → docs/design/<card-id>-design-spec.md
        │
        ├─► [6] arquiteto-de-solucao  (arquitetura técnica)         [pendente]
        │         → docs/arquitetura/<card-id>-arquitetura.md
        │
        ├─► [7] coder  (implementação Vue 3 + TypeScript)            [pendente]
        │
        └─► formbuilder  (paralelo — se card de formulário)

  └─► Review (design-reviewer — audita diff)
  └─► Documentação (orquestrador → documentacao-fluxo → Confluence)
  └─► Pronto
```

---

## Como usar

1. **Commite** a pasta `.claude/` no repositório — todo agente que o Vibe Kanban
   disparar no projeto herda esses agentes e skills.
2. Ao criar um **card**, escreva o objetivo de produto (não a solução).
   Ex.: *"Tela de detalhe da ocorrência precisa deixar o status mais claro e cobrir
   o estado de erro de carregamento."*
3. O agente **orquestrador** serve como ponto de entrada para pedidos compostos.
   Para cards simples de interface, dispare direto o `product-designer-senior`.
4. Skills são invocadas automaticamente quando a `description` casa com o pedido
   — ou invoque explicitamente: `/playbook`, `/cenarios-estados`, etc.

**Testar localmente:**

```bash
# na raiz do repo
claude
/agents        # lista os agentes ativos (6 arquivos; 3 pendentes de criação)
/skills        # lista as 14 skills
```

---

## Manutenção

- Atualize **design-system-tokens** e **component-spec** quando o DS ganhar novos
  tokens ou componentes base.
- Ao criar um agente novo, siga o `_TEMPLATE.md` e adicione uma linha na tabela
  acima. Documente a decisão de arquitetura em `docs/PADRAO-AGENTES-IA.md`.
- `name` no frontmatter deve bater exatamente com o nome do arquivo/pasta.

---

## Paralelismo e conflitos

Cards podem ser executados em paralelo (cada um em sua branch). Para evitar
"architectural drift":

- Mantenha cada agente **escopado ao seu card**.
- Arquivos globais sujeitos a colisão: `src/style.css`, `vite.config.ts`,
  `components.d.ts`, `src/router/*`, stores globais. Se um agente tocar um desses,
  ele deve **sinalizar** no resumo final para o humano coordenar o merge.
- **O humano continua sendo o árbitro final do merge.**
