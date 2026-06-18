---
name: ux-writing
description: >-
  Microcopy e UX writing em pt-BR para o Mobile Saúde: rótulos de botão, títulos,
  estados vazios, mensagens de erro/sucesso (toasts), placeholders e textos de
  confirmação. Use quando o card cita: microcopy, texto de UI, copy, rótulo,
  mensagem, placeholder, tom de voz — ou ao revisar a escrita de uma tela.
---

# UX Writing (pt-BR) — Mobile Saúde

App de saúde: a escrita transmite **clareza e confiança**. Humana, direta, sem
jargão técnico. Siga os padrões já usados no produto (reuse, não reinvente o tom).

## Princípios
- **pt-BR claro e humano** — linguagem do usuário, não do sistema.
- **Verbo de ação** em botões/CTAs: "Encaminhar", "Finalizar", "Aplicar", "Limpar filtros".
- **Diga o que aconteceu** em feedback (passado/curto): "Ocorrência encaminhada",
  "Protocolo copiado", "Configuração de colunas salva".
- **Erro = o que houve + como resolver** (nunca código cru): "Não foi possível
  copiar", "Erro ao carregar ocorrências".
- **Vazio com intenção** — distinga otimista de filtro: "Tudo em dia" × "Nenhuma
  ocorrência para os filtros aplicados".
- **Sem jargão técnico** ao usuário; números em pt-BR (3.654; 2,3 min).
- **Não comunique só por cor** — o texto/rótulo carrega o significado (ver tags de
  SLA/prioridade).

## Padrões por tipo (referência do projeto)
| Tipo | Padrão | Exemplos reais |
| ---- | ------ | -------------- |
| Botão/CTA | verbo + objeto curto | "Criar", "Aplicar", "Marcar todas como lidas" |
| Sucesso (toast) | fato no passado | "Atendimento finalizado", "Cobrança enviada ao setor" |
| Info/indisponível | reconhece + sinaliza | "{ação}: disponível em breve" (`comingSoon`) |
| Erro | causa + saída | "Não foi possível copiar" |
| Vazio inicial | otimista | "Tudo em dia" |
| Filtrado-vazio | explica + ação | "Nenhuma… para os filtros aplicados" + "Limpar filtros (N)" |
| Confirmação destrutiva | claro e específico | nomeie a ação ("Excluir ocorrência?") |

## Microcopy de saúde (confiança)
- Informação crítica: precisa e sem ambiguidade.
- Ações irreversíveis: confirme com texto explícito do que vai acontecer.

## Entregável
- Copy revisada por elemento (rótulo/título/estado/mensagem), em pt-BR, coerente
  com os padrões acima. Aponte onde o texto depende de contexto (papel, canal).

→ Relacionadas: `cenarios-estados` (textos por estado), `design-critique` (heurística 2 e 9).
