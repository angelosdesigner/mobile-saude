---
name: criterios-ux
description: >-
  Derivar CRITÉRIOS DE ACEITE específicos de UX a partir dos requisitos do
  Agente 1 (histórias de usuário, casos de uso, ACs funcionais). Cobre:
  comportamento visual, estados de UI, acessibilidade WCAG AA, microcopy,
  responsividade e comparativo entre abordagens de design. Complementa os ACs
  de desenvolvimento — não substitui. Gatilho: critérios ux, AC de design,
  critérios de aceite de interface, AC visual, validação de UX, aceite de tela.
---

# Critérios de Aceite de UX — Mobile Saúde

Critérios de aceite de UX traduzem as decisões de design em condições verificáveis.
Eles complementam os ACs funcionais do Agente 1 e dão ao time de dev e ao revisor
uma lista objetiva para validar a experiência — não só o comportamento do sistema.

## Quando usar

Invoque após o Agente 1 (Requisitos) ter consolidado as histórias e ACs funcionais,
e após `component-spec` ter especificado os elementos de interface.

## Categorias de critérios de aceite de UX

### 1. Comportamento visual e hierarquia

Verifica se a hierarquia de informação implementada corresponde à especificada.

```markdown
- [ ] [AC-UX-V01] O elemento primário (CTA ou informação principal) é visualmente
  destacado em relação aos elementos secundários (maior peso tipográfico ou cor de ação).
- [ ] [AC-UX-V02] Informações de status/estágio usam a semântica de cor correta
  (success = verde, warning = amarelo, danger = vermelho) com rótulo textual junto.
- [ ] [AC-UX-V03] A hierarquia da tela segue a ordem: identificação → ação → contexto.
```

### 2. Estados de UI (cobertura obrigatória)

Para cada tela/componente especificado, derive um AC por estado:

```markdown
- [ ] [AC-UX-E01] Estado de carregamento: esqueleto visual (BaseSkeleton) exibido
  durante fetch; nenhum dado parcial visível.
- [ ] [AC-UX-E02] Estado vazio (sem dados): EmptyState com ícone, título e descrição
  explicando por que está vazio e o que o usuário pode fazer.
- [ ] [AC-UX-E03] Estado vazio filtrado: EmptyState específico indicando que o filtro
  ativo não retornou resultados (diferente de "sem dados").
- [ ] [AC-UX-E04] Estado de erro: mensagem explicativa + ação de recuperação visível
  (ex.: "Tentar novamente"). Sem stack trace exposto ao usuário.
- [ ] [AC-UX-E05] Estado de sucesso: feedback positivo via toast/ElMessage após
  ação concluída; duração adequada (≥ 2s).
```

### 3. Acessibilidade WCAG AA (não-negociável)

```markdown
- [ ] [AC-UX-A01] Contraste ≥ 4.5:1 para texto normal; ≥ 3:1 para texto grande
  (≥ 18px normal ou ≥ 14px bold) e ícones informativos.
- [ ] [AC-UX-A02] Nenhum texto renderizado abaixo de 12px (piso do design system).
- [ ] [AC-UX-A03] Todos os controles interativos são alcançáveis e ativáveis por
  teclado (Tab/Shift+Tab/Enter/Space/Esc); sem armadilhas de foco.
- [ ] [AC-UX-A04] Foco visível (:focus-visible) presente em todos os elementos
  interativos; outline não removido.
- [ ] [AC-UX-A05] Alvos de toque ≥ 40×40px para todos os botões e controles.
- [ ] [AC-UX-A06] Informação não comunicada exclusivamente por cor (ícone ou rótulo
  textual acompanha toda codificação de cor).
- [ ] [AC-UX-A07] Todos os campos de formulário têm label associado; campos
  obrigatórios marcados com aria-required ou indicação visual + textual.
- [ ] [AC-UX-A08] Imagens e ícones informativos têm alt text ou aria-label;
  ícones decorativos têm aria-hidden="true".
```

### 4. Microcopy e linguagem

```markdown
- [ ] [AC-UX-M01] Todos os textos estão em pt-BR correto; sem termos técnicos
  expostos ao usuário final (ex.: "undefined", "null", "404").
- [ ] [AC-UX-M02] Mensagens de erro descrevem o problema E indicam o que fazer
  (ex.: "Não foi possível carregar. Verifique sua conexão e tente novamente.").
- [ ] [AC-UX-M03] Empty states têm título descritivo + subtexto motivador quando
  aplicável (ex.: "Nenhuma ocorrência aberta · Quando surgir uma, ela aparecerá aqui.").
- [ ] [AC-UX-M04] Labels de botões descrevem a ação (evitar "OK", "Sim"; preferir
  "Encaminhar para humano", "Confirmar agendamento").
```

### 5. Responsividade e temas

```markdown
- [ ] [AC-UX-R01] A tela está funcional e sem quebra de layout em viewport de
  1280px (desktop padrão do produto).
- [ ] [AC-UX-R02] A tela funciona em dark mode: todos os tokens semânticos
  (bg-ms-*, text-ms-*, border-ms-*) invertem corretamente; sem cor crua hardcoded.
- [ ] [AC-UX-R03] Conteúdo truncado com ellipsis em textos longos; sem overflow
  horizontal visível.
```

### 6. Comparativo de abordagens (quando houver múltiplas visões)

Quando a spec inclui comparativo (Visão A × Visão B), derive ACs para a abordagem
adotada e explique o que foi descartado:

```markdown
- [ ] [AC-UX-C01] A abordagem adotada ([Visão X]) está implementada conforme especificado.
- [ ] [AC-UX-C02] Os trade-offs documentados no comparativo foram comunicados ao time
  antes da implementação (sem surpresas de escopo).
```

## Como derivar os ACs a partir dos requisitos do Agente 1

Para cada história de usuário, faça as perguntas:

| Pergunta | AC derivado |
|----------|-------------|
| "O usuário vê feedback imediato?" | AC de estado (loading/sucesso/erro) |
| "O campo tem validação?" | AC de microcopy (mensagem de erro) + AC de acessibilidade (aria) |
| "Há filtragem?" | AC de estado filtrado-vazio |
| "É uma ação destrutiva?" | AC de confirmação + microcopy do modal |
| "O resultado varia por perfil/canal?" | AC de estado semântico |
| "Aparece em dark mode?" | AC de tema |

## Formato de entrega

Agrupe os ACs por categoria e inclua o prefixo `[AC-UX-XX]` para rastreabilidade.

```markdown
## Critérios de aceite de UX — [Nome da Feature]

### Comportamento visual
- [ ] [AC-UX-V01] ...

### Estados de UI
- [ ] [AC-UX-E01] ...

### Acessibilidade
- [ ] [AC-UX-A01] ...

### Microcopy
- [ ] [AC-UX-M01] ...

### Responsividade e tema
- [ ] [AC-UX-R01] ...
```

→ Estes ACs vão para a seção "Versões aprovadas" do Confluence (TM20-00: UX/Design)
e servem de checklist para o revisor (`design-reviewer`) no PR.
