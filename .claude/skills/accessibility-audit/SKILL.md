---
name: accessibility-audit
description: >-
  Checklist de auditoria de acessibilidade WCAG 2.1 AA adaptado ao Mobile Saúde
  (Vue 3 + Element Plus + Tailwind, pt-BR). Use ao revisar ou construir uma tela/
  componente, antes de fechar um card de interface, ou quando o card pedir
  "acessibilidade", "a11y", "contraste", "leitor de tela" ou "navegação por teclado".
---

# Auditoria de acessibilidade (WCAG 2.1 AA) — Mobile Saúde

Num app de saúde, acessibilidade é requisito, não polimento. Audite a tela/
componente contra os itens abaixo e reporte achados por severidade (Bloqueante /
Sério / Menor), com arquivo:linha e a correção.

## 1. Contraste de cor
- Texto normal ≥ **4.5:1**; texto grande (≥ 18.66px bold ou 24px) e ícones ≥ **3:1**.
- Use os pares "on-color" corretos (`text-ms-on-*`). **Nunca** branco sobre
  `ms-warning` (âmbar) — use `text-ms-on-warning` (escuro).
- Verifique em **light e dark** (as cores semânticas viram no tema).

## 2. Texto e tipografia
- Nada abaixo de **12px** (`text-xs`/`--text-2xs`). Sem `text-[10px]` etc.
- Layout aguenta zoom até 200% sem perda de conteúdo/função.

## 3. Teclado
- Tudo operável só por teclado; ordem de Tab segue a ordem visual/lógica.
- **Foco visível** sempre (o `:focus-visible` global desenha o outline — não
  remova com `outline-none` sem alternativa equivalente).
- Sem armadilha de foco; em modais/drawers o foco entra, fica preso enquanto
  aberto e retorna ao gatilho ao fechar (o EP `el-dialog`/`BaseModal` ajuda —
  confirme).

## 4. Semântica e ARIA
- HTML semântico (`<button>`, `<nav>`, `<main>`, headings em ordem h1→h2…).
- Botão só com ícone tem `aria-label`/`title`. Inputs têm `<label>` associado.
- Estados dinâmicos comunicados (`aria-expanded`, `aria-selected`,
  `aria-busy`/loading, `aria-invalid` em erro de form).
- Feedback transitório (`ElMessage`, toasts) usa região assertiva/`role="status"`.

## 5. Não-dependência de cor
- Status/prioridade não diferenciados só por cor — acompanhe de ícone e/ou
  rótulo (ex.: `PrioridadeTag`, `ChannelTag`, tags de status).

## 6. Alvos e toque
- Alvos clicáveis ≥ **40×40px** (mobile-first num app de saúde).
- Espaçamento suficiente entre alvos para evitar toque acidental.

## 7. Conteúdo e imagens
- Ícones decorativos com `aria-hidden="true"`; ícones informativos com texto alt.
- Microcopy pt-BR clara; mensagens de erro dizem o que aconteceu e como resolver.

## 8. Movimento
- Respeitar `prefers-reduced-motion` em animações/transições não essenciais.

## Como rodar
1. Leia o markup do componente/tela e cruze com a lista acima.
2. Cheque tokens de cor envolvidos em `src/style.css` para validar contraste.
3. Se possível, abra no Storybook/app e teste navegação por Tab em light e dark.
4. Reporte: tabela de achados (severidade · arquivo:linha · problema · correção)
   e um veredito final (Conforme AA / Não conforme).
