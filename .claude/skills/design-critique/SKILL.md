---
name: design-critique
description: >-
  Crítica heurística de UX/UI de uma tela ou fluxo do Mobile Saúde, baseada nas
  heurísticas de Nielsen e em hierarquia/consistência visual. Use para avaliar a
  qualidade de uma interface (existente ou proposta), priorizar melhorias de UX,
  ou preparar feedback de design — sem necessariamente alterar código.
---

# Crítica de design (heurísticas) — Mobile Saúde

Avalie a tela/fluxo como Product Designer Sênior. Saída: achados priorizados e
acionáveis, não opinião vaga. Contexto: app de saúde pt-BR — clareza e confiança
acima de tudo.

## Heurísticas de Nielsen (aplique cada uma)
1. **Visibilidade do status** — o sistema mostra o que está acontecendo?
   (loading, progresso, confirmação de ação).
2. **Compatibilidade com o mundo real** — linguagem do usuário de saúde, em
   pt-BR, sem jargão técnico; ordem natural das informações.
3. **Controle e liberdade** — desfazer/cancelar, saídas claras, sem becos sem saída.
4. **Consistência e padrões** — segue o design system (componentes base, tokens,
   espaçamento) e convenções do próprio app.
5. **Prevenção de erros** — confirmações em ações destrutivas, validação inline,
   restrições que evitam o erro antes dele acontecer.
6. **Reconhecer > lembrar** — opções e ações visíveis; reduzir carga de memória.
7. **Flexibilidade e eficiência** — atalhos para usuários avançados sem atrapalhar
   o iniciante.
8. **Estético e minimalista** — sem ruído visual; cada elemento ganha seu espaço.
9. **Recuperação de erros** — mensagens claras (o que houve + como resolver).
10. **Ajuda e documentação** — dicas contextuais quando necessárias.

## Lente de hierarquia visual
- Há **um** foco primário claro por tela? A ação principal se destaca?
- Escala tipográfica e peso comunicam a hierarquia (título > seção > corpo > apoio)?
- Espaçamento agrupa o relacionado e separa o distinto (proximidade/Gestalt)?
- Densidade adequada ao contexto (operacional vs. leitura)?

## Cobertura de estados e fluxo
- Estados **loading / vazio / erro / sucesso** previstos e bem desenhados?
- O fluxo tem o mínimo de passos? Onde o usuário pode travar ou hesitar?
- Casos de borda: listas longas, textos longos, sem dados, sem permissão, offline.

## Confiança (específico de saúde)
- Dados sensíveis tratados com clareza e cuidado; nada ambíguo em informação crítica.
- Ações irreversíveis bem sinalizadas e confirmadas.

## Formato da saída
- **Resumo** (2–3 linhas) da impressão geral.
- **Achados priorizados**: tabela com Severidade (Alta/Média/Baixa), heurística
  violada, descrição e recomendação concreta.
- **Quick wins** vs. **melhorias estruturais**.
- Quando útil, esboce a alternativa (em texto ou indicando componentes do DS a usar).
