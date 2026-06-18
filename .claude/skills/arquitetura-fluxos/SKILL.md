---
name: arquitetura-fluxos
description: >-
  Projetar arquitetura de informação e FLUXOS de navegação no Mobile Saúde: mapa de
  telas/rotas, onde a tela nova encaixa, navegação (sidebar/topbar, drill-down),
  e o passo a passo do fluxo (incl. modais de ação). Use quando o card cita: fluxo,
  navegação, arquitetura de informação, mapa de telas, jornada, rota, drill-down.
---

# Arquitetura de Informação & Fluxos — Mobile Saúde

Defina **onde a tela vive** e **como o usuário chega/sai dela**, antes de detalhar
a UI. Reaproveite a navegação existente; não crie ilhas.

## 1. Onde encaixa (mapa de rotas)
- Rotas em `src/router/index.ts`. Famílias: **Atendente** (`/inicio`, `/ocorrencias`,
  `/ocorrencias/:id`, `/ocorrencias/:id/jornada`, `/notificacoes`) e **Gestor**
  (`/gestor/tempo-real`, `/gestor/operacao-canal`, `/gestor/*-detalhe`,
  `/gestor/indicadores`, `/gestor/ocorrencias`).
- A tela nova é **rota** ou **estado** de uma rota? (ex.: Quadro×Lista vivem na
  mesma rota via `?view=`; canal via `?canal=`). Prefira query param para variações
  da mesma tela; rota nova para destino distinto.

## 2. Navegação (padrões do projeto)
- **Shell:** toda tela vive no `DashboardLayout` (sidebar + topbar; split-view; modo
  embed `?embed=1`). Não recrie chrome de navegação.
- **Drill-down unificado:** todo card/KPI do gestor leva à **lista de ocorrências**
  pré-filtrada pelo estágio (`automatizado`/`fila`/`humano`). Use `SectionHeader`
  (`action`/`actionTo`) para o "ver detalhes".
- **Breadcrumb** nas telas de detalhe (Dashboard → contexto → tela).
- **Voltar/saídas claras** (heurística de Nielsen: controle e liberdade).

## 3. Padrões de fluxo
- **Ações no contexto via modal/drawer** (encaminhar, finalizar, anexar, ligar…) —
  `BaseModal`/`BaseDrawer`, com feedback (`useActionFeedback`).
- **Estágios** definem ações disponíveis (ex.: só "Novo" inicia; só "Em atendimento"
  encaminha) — ver máquina de estados em `cenarios-estados`/PRD.
- Mantenha o fluxo no **mínimo de passos**; marque onde o usuário pode travar.

## 4. Entregável
- **Diagrama/lista do fluxo** (passos, decisões, saídas) — pode ser Mermaid
  `flowchart` (como nos docs). Indique: rota(s), query params, modais, e os pontos
  de drill-down. Aponte estados de navegação (carregando rota, 404, sem permissão).

→ Relacionadas: `cenarios-estados` (variações da tela), `documentacao-fluxo` (registrar).
