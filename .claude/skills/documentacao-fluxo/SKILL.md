---
name: documentacao-fluxo
description: >-
  Documentar um fluxo/tela do Mobile Saúde de forma padronizada (cenários, estados,
  decisões, métricas) e preparar para publicação no Confluence. Use quando o card
  cita: documentar, documentação, registrar fluxo, escrever a doc, publicar no
  Confluence, atualizar página — ou ao fechar uma feature que precisa de registro.
---

# Documentação de Fluxo — Mobile Saúde

Fecha o pipeline do `playbook`: transforma o que foi desenhado/implementado em
documentação consistente, pronta para o Confluence. Reusa a estrutura dos docs
existentes — não invente formato novo.

## 1. Estrutura padrão de um doc de fluxo
1. **Contexto** — objetivo/JTBD, papel/perfil (do `discovery-contexto`).
2. **Fluxo** — passos e decisões (diagrama Mermaid `flowchart`, como nos docs).
3. **Cenários × Estados** — a matriz da `cenarios-estados` (o que a tela mostra em cada combinação).
4. **Decisões de design** — o que foi decidido e por quê; alternativas descartadas.
5. **Métricas / critério de sucesso** — da `metricas-heart` (o que o link de teste valida).
6. **Pendências / débitos** — o que ficou para depois.

> Modelos de referência: [`docs/PRODUTO-MOBILE-SAUDE.md`](../../docs/PRODUTO-MOBILE-SAUDE.md)
> (PRD) e [`docs/VISAO-GERAL-MOBILE-SAUDE.md`](../../docs/VISAO-GERAL-MOBILE-SAUDE.md)
> (visão geral). Tom e seções devem casar com eles.

## 2. Onde gravar
- Markdown em `docs/<nome-do-fluxo>.md` (fonte editável, com Mermaid).

## 3. Exportar para Confluence (pipeline já montado)
Para gerar `.docx` (importável) e `.pdf` com **diagramas renderizados como imagem**
(o Confluence importa Word nativamente, sem precisar de app Mermaid), use o
pipeline em `C:\Empresa\Projetos\_export-tmp` (servidor local + Edge headless +
`marked`/`html-to-docx`/`pngjs`): renderiza cada bloco Mermaid, faz autocrop e
embute as imagens. Saída em `docs/export/`. (Foi assim que o PRD e a Visão Geral
viraram docx/pdf.)

## 4. Publicar (handoff ao orquestrador)
A publicação no Confluence é do **agente `orquestrador`** (detém as tools):
`fetch`/`searchPages` → confirmar o alvo → `updatePage`/`createPage`. Regra de ouro:
**`fetch` antes de `updatePage`** e **confirmar antes de publicar** (ação externa);
citar `pageId`. Ver `docs/PADRAO-AGENTES-IA.md` §3.

## 5. Entregável
- `docs/<fluxo>.md` completo (6 seções) + (se pedido) `.docx`/`.pdf` em `docs/export/`
  + indicação de qual página do Confluence atualizar/criar.

→ Relacionadas: `cenarios-estados`, `metricas-heart`, agente `orquestrador`.
