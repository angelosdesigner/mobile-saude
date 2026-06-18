---
name: discovery-contexto
description: >-
  Etapa de descoberta/contexto ANTES de desenhar uma tela ou fluxo do Mobile Saúde:
  objetivo do usuário (JTBD), papel/perfil afetado, contexto de domínio, pontos de
  design, restrições e critério de sucesso. Use no começo de um card de produto, ou
  quando o pedido cita: contexto, discovery, levantamento, MDs, PRD, requisitos,
  "antes de desenhar", objetivo do usuário.
---

# Discovery & Contexto — Mobile Saúde

Antes de qualquer pixel: alinhe **problema, contexto e critério de sucesso**. App
de saúde pt-BR; clareza e confiança acima de enfeite. Esta etapa abastece a
`cenarios-estados` (o que cobrir) e a `documentacao-fluxo` (o que registrar).

## 1. Enquadre o problema (JTBD)
- Escreva o job: *"Quando <situação>, o usuário quer <objetivo>, para <resultado>."*
- **Quem é o usuário?** Papel (`atendente` | `gestor`) e, se atendente, perfil
  (`quente` | `frio` | `ambos`). Isso muda a tela (ver `cenarios-estados`).
- Evite pular para a solução — descreva a dor, não a tela.

## 2. Puxe o contexto que já existe (não recomece do zero)
- **Produto:** [`docs/PRODUTO-MOBILE-SAUDE.md`](../../docs/PRODUTO-MOBILE-SAUDE.md) (PRD: personas, jornadas, fluxos, estados, métricas) e [`docs/VISAO-GERAL-MOBILE-SAUDE.md`](../../docs/VISAO-GERAL-MOBILE-SAUDE.md).
- **Domínio:** canais, atendimento (BOT/URA/humano + IA), filas, SLA, estágios — `data/gestorTaxonomia.ts`, `types/ocorrencias.ts`.
- **Design system:** o que já existe para reusar — `src/components/base/`, `ui/`, `src/style.css` (tokens).
- **MDs/Figma do card:** leia os pontos de design fornecidos (telas principais, anotações).

## 3. Pontos de design (design points)
- Hierarquia: qual é a **ação/decisão primária** desta tela?
- Restrições: stack (Vue 3 + Element Plus + Tailwind), **WCAG AA**, **light e dark**,
  **multi-plataforma** (stack nova e a portada — `DE-PARA-STACK-ANTIGA.md`).
- Dependências e riscos: depende de dado/serviço que ainda não existe? (sinalize).

## 4. Critério de sucesso (como saberemos que funcionou)
- Defina a métrica que importa (ver `metricas-heart`): ex. SLA cumprido, FCR,
  tempo até resolução, abandono. É o que o **link de teste** vai checar.

## 5. Entregável: brief de discovery (curto)
- **Job/objetivo** · **usuário (papel/perfil)** · **contexto e domínio relevantes**
  · **pontos de design e restrições** · **critério de sucesso** · **dúvidas/decisões
  pendentes** (pergunte ao humano antes de assumir regra de negócio).

→ Próxima etapa: `cenarios-estados` (dimensões + matriz cenário×estado).
