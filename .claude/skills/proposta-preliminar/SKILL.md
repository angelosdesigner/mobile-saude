---
name: proposta-preliminar
description: >-
  Gerar o documento PROPOSTA DE INTERFACE UX/Design completo, no formato
  TM20-00 do Confluence, a partir de briefing + contexto de negócio + jornadas.
  Cobre: resumo, contexto atual, mudança proposta, princípios de design, proposta
  visual por tela/componente, regras de negócio, comparativo, prós/contras,
  cenário de uso, público impactado, benefícios, referências. Gatilho: proposta
  de interface, proposta visual, proposta ux, gerar proposta, TM20-00 UX.
---

# Proposta de Interface UX/Design — Mobile Saúde

Transforme o contexto de negócio e as jornadas mapeadas em uma proposta de
interface estruturada. Este documento é lido pelo Agente 1 (Requisitos) e pelo
time de desenvolvimento — escreva com precisão e objetividade.

## Antes de escrever

Confirme que você tem:
- [ ] Contexto e valor de negócio (problema, público, critérios de sucesso, restrições)
- [ ] Pelo menos uma jornada mapeada (`mapeamento-jornada`)
- [ ] Benefícios esperados e métricas de sucesso (`metricas-heart`)

Se algum item estiver faltando, sinalize antes de prosseguir.

## Estrutura do documento (preencha em ordem)

---

### Cabeçalho

```markdown
# Proposta de interface UX/Design — [Nome do EPIC]

**Responsável:** [PM/PO/UX]
**Card Jira:** [link]
**Data:** [YYYY-MM-DD]
**Status:** Rascunho — aguarda revisão PM/PO
```

---

### 1. Resumo da proposta

2-3 parágrafos que respondem:
- O que está sendo proposto?
- Qual o racional por trás da decisão de design?
- Qual o impacto esperado na experiência?

> Escreva para quem vai ler em 30 segundos antes de uma reunião. Sem jargão técnico.

---

### 2. Contexto atual

- Como a interface funciona hoje? (se não existe, descreva o processo manual/workaround)
- Quais são os problemas de usabilidade, carga cognitiva ou limitações que motivam a mudança?
- Dados ou evidências que sustentam o diagnóstico (se disponíveis).

---

### 3. Mudança proposta

- O que muda na experiência do usuário?
- Qual a direção de design adotada?
- O que foi explicitamente **não** incluído e por quê (delimite o escopo).

---

### 4. Princípios de design

Liste 3-5 princípios ou diretrizes de UX que norteiam esta proposta.

Princípios comuns no Mobile Saúde (adapte ao contexto):
- Redução de carga cognitiva — menos decisões por tela
- Navegação orientada à ação — o próximo passo sempre visível
- Foco no presente — o que o atendente precisa agora, não histórico
- Transparência de estado — o usuário sempre sabe onde está e o que acontece
- Confiança e clareza — app de saúde exige linguagem segura, sem ambiguidade

---

### 5. Proposta visual

Para **cada tela ou componente** relevante, preencha uma subseção:

```markdown
#### Tela / Componente [N]: [Nome]

**Objetivo:** [o que este elemento permite o usuário fazer]
**Foco:** [o que deve chamar atenção primeiro — hierarquia visual]

[Descrição textual da interface: layout, regiões, hierarquia, comportamento]

**Elementos da interface:**
| Elemento / Card | Descrição | Comportamento / Ação |
|-----------------|-----------|----------------------|
| [nome]          |           |                      |
```

> Inclua quantas telas/componentes forem necessários. Se houver mockup ou link
> do Figma, adicione aqui. Sem Figma, a descrição textual é o substituto.

---

### 6. Regras de negócio e comportamento

Liste as regras, filtros e restrições que impactam a interface.

```markdown
| Regra / Filtro | Tela / Componente | Descrição |
|----------------|-------------------|-----------|
|                |                   |           |
```

---

### 7. Comparativo de experiência *(se houver múltiplas abordagens)*

Use quando há mais de uma forma de resolver o problema de design.

```markdown
| Característica      | Visão / Modo A | Visão / Modo B |
|---------------------|----------------|----------------|
| Propósito principal |                |                |
| Foco temporal       |                |                |
| Filtros disponíveis |                |                |
| Mecanismo de ação   |                |                |
| Perfil de uso típico|                |                |
```

*Remova esta seção se não se aplica.*

---

### 8. Análise de prós e contras *(se houver múltiplas abordagens)*

```markdown
| Fator                    | Prós (Benefícios) | Contras (Pontos de atenção) |
|--------------------------|-------------------|-----------------------------|
| Carga cognitiva          |                   |                             |
| Gestão do fluxo de trabalho |               |                             |
| Adoção e experiência UX  |                   |                             |
| Performance do sistema   |                   |                             |
```

*Remova esta seção se não se aplica.*

---

### 9. Cenário de uso (workflow do usuário)

Descreva passo a passo como o usuário interage com a interface em um cenário
típico. Use os passos da jornada mapeada como base.

```markdown
1. [Ação]: ...
2. [Ação]: ...
3. [Ação]: ...
```

Adicione cenários alternativos se houver fluxos secundários relevantes.

---

### 10. Público impactado

```markdown
| Público     | Como impactado |
|-------------|----------------|
| Beneficiário |               |
| Atendente   |               |
| Gestor      |               |
| Operadora   |               |
```

*Remova linhas que não se aplicam. Adicione outros públicos se necessário.*

---

### 11. Benefícios esperados

Liste os benefícios concretos da adoção desta proposta.

```markdown
- [Benefício 1]
- [Benefício 2]
- [Benefício 3]
```

---

### 12. Referências

```markdown
| Tipo                  | Link |
|-----------------------|------|
| Contexto e valor      |      |
| Jornada               |      |
| Levantamento          |      |
| Benchmark / referência visual |   |
| Protótipo / Figma     |      |
| Card Jira             |      |
```

---

## Checklist antes de entregar

- [ ] Todas as seções obrigatórias preenchidas (1-5, 9-12)
- [ ] Seções opcionais preenchidas ou explicitamente removidas (7-8)
- [ ] Cada tela/componente tem objetivo + foco + elementos
- [ ] Regras de negócio documentadas
- [ ] Cenário de uso com pelo menos um fluxo completo
- [ ] Nenhum `PREENCHER` remanescente no documento

→ Entregue ao `ux-discovery` para revisão e depois ao orquestrador para
publicação no Confluence (TM20-00: Discovery e contexto > Proposta de interface).
