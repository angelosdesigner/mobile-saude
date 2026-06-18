# Agentes e Skills de Design — Mobile Saúde

Kit de **Product Designer Sênior Estrategista** para rodar com Claude Code dentro do
**Vibe Kanban**. São arquivos de projeto que o Claude Code carrega automaticamente
quando executa neste repositório.

Referências internas: [`docs/PADRAO-AGENTES-IA.md`](../docs/PADRAO-AGENTES-IA.md) (convenções de
autoria) e [`docs/PLAYBOOK.md`](../docs/PLAYBOOK.md) (processo end-to-end do card).

---

## Agentes (`.claude/agents/`)

| Agente | Papel | Quando usar |
| ------ | ----- | ----------- |
| **product-designer-senior** | Estrategista + executor de interface | Cards de tela, fluxo, componente, UX, DS |
| **design-reviewer** | Revisor de design (read-only) | Coluna Review — audita diff antes do merge |
| **orquestrador** | Roteador de intenção + publicação Confluence | Ponto de entrada quando o pedido envolve mais de um especialista, ou quando precisa documentar |
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
| **arquitetura-fluxos** | Card cita fluxo, navegação, mapa de telas, jornada, drill-down |
| **cenarios-estados** | Mapear cenários (papel/canal/SLA…) e cobrir todos os estados de UI |
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

## Fluxo recomendado no Vibe Kanban

```
A fazer
  └─► orquestrador (identifica intenção, roteia)
        └─► product-designer-senior
              skills: discovery-contexto → arquitetura-fluxos → cenarios-estados
                    → (implementação) → ux-writing → accessibility-audit
        └─► formbuilder  (se card de formulário)
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
/agents        # lista os 4 agentes
/skills        # lista as 11 skills
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

O Vibe Kanban pode executar cards em paralelo (cada um em sua branch). Para evitar
"architectural drift":

- Mantenha cada agente **escopado ao seu card**.
- Arquivos globais sujeitos a colisão: `src/style.css`, `vite.config.ts`,
  `components.d.ts`, `src/router/*`, stores globais. Se um agente tocar um desses,
  ele deve **sinalizar** no resumo final para o humano coordenar o merge.
- **O humano continua sendo o árbitro final do merge.**
