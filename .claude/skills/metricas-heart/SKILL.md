---
name: metricas-heart
description: >-
  Definir métricas de sucesso de UX (framework Google HEART) e o que validar no
  "link de teste" de um fluxo do Mobile Saúde, conectando aos KPIs do produto
  (SLA, TME/ASA, TMA/AHT, abandono, ocupação, FCR, CSAT, NPS). Use quando o card
  cita: métrica, sucesso, KPI, o que medir, HEART, validação, link de teste, impacto.
---

# Métricas de UX (HEART) & critério de sucesso — Mobile Saúde

Toda mudança de produto precisa de **como saberemos que funcionou**. Conecte a
experiência (HEART) aos KPIs operacionais do produto.

## 1. HEART (escolha 1–2 dimensões por card)
| Dimensão | Mede | Sinal típico |
| -------- | ---- | ------------ |
| **Happiness** | satisfação | CSAT, NPS |
| **Engagement** | uso/profundidade | ações por turno, uso do dashboard |
| **Adoption** | novos usuários/feature | atendentes/gestores ativos |
| **Retention** | uso recorrente | uso diário |
| **Task success** | eficácia | **% SLA cumprido**, FCR, TMA, erros |

> Para a maioria dos cards operacionais, foque **Task success** + 1 complementar.

## 2. KPIs do produto (definições no PRD §5)
SLA (80/20) · **TME = ASA** (tempo até atender) · **TMA = AHT** (tempo de
tratamento) · Abandono · Ocupação · FCR · CSAT · NPS. Detalhes e benchmarks:
[`docs/PRODUTO-MOBILE-SAUDE.md`](../../docs/PRODUTO-MOBILE-SAUDE.md) (§5).

## 3. Do objetivo à métrica (Goal → Signal → Metric)
- **Goal:** o que o usuário/operação deve conseguir (vem do `discovery-contexto`).
- **Signal:** comportamento observável que indica sucesso (ex.: ocorrência resolvida
  sem reabrir = FCR; fila não cresce no pico).
- **Metric:** número a acompanhar (ex.: % SLA cumprido, TME, abandono).

## 4. O que validar no "link de teste"
- A tarefa-alvo é concluível **sem travar**? (tempo/clicks razoáveis)
- Todos os **estados** aparecem corretos (ver `cenarios-estados`)?
- A métrica de sucesso é **observável/instrumentável** (evento/medida existe)?
- Acessibilidade e light/dark ok? Microcopy clara?

## 5. Entregável
- **Critério de sucesso** do card: 1–2 métricas (HEART → KPI) + como medir +
  meta/baseline quando houver. Vira o checklist do dev/QA no link de teste e entra
  na `documentacao-fluxo`.

→ Relacionadas: `discovery-contexto` (define o goal), `cenarios-estados` (estados a validar).
