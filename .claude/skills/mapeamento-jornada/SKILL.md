---
name: mapeamento-jornada
description: >-
  Estruturar a JORNADA DO USUÁRIO no formato TM20-00 do Confluence: tabela
  Ator | Ação | Sistema/Resposta | Observação, por tipo de jornada (beneficiário,
  atendente, operadora, administrador), com pontos de atenção. Use durante o
  discovery, antes de gerar a proposta de interface. Gatilho: jornada, mapa de
  jornada, jornada do usuário, passos do fluxo, touchpoints.
---

# Mapeamento de Jornada — Mobile Saúde

Estruture a jornada do usuário antes de propor qualquer interface. Uma jornada
bem mapeada revela pontos de fricção que a tela precisa resolver — e os que ela
pode criar se não for bem pensada.

## 1. Identifique o tipo de jornada

Tipos no Mobile Saúde: **beneficiário** | **atendente** | **gestor** | **operadora**
| **administrador**.

- Uma feature pode ter múltiplas jornadas (ex.: atendente inicia, gestor monitora).
- Mapeie cada uma separadamente — comportamentos e contextos são distintos.
- Se o briefing não especificar o tipo, pergunte antes de assumir.

## 2. Preencha o cabeçalho

```
Tipo de jornada: [beneficiário | atendente | gestor | operadora | administrador]
Contexto: [onde esta jornada se passa — canal, módulo, situação]
```

Exemplos de contexto:
- "WhatsApp · Triagem automatizada · Beneficiário inicia solicitação de autorização"
- "Portal Web · Fila de atendimento · Atendente assume ocorrência em espera"

## 3. Monte a tabela de passos

Regras para a tabela:
- **Ator** = quem age neste passo (Beneficiário, Atendente, Sistema, Bot, URA…)
- **Ação** = o que o ator faz (verbo no presente: "Envia", "Clica", "Aguarda"…)
- **Sistema / Resposta** = o que o sistema retorna ou o que acontece como consequência
- **Observação** = regra de negócio, condição, variação ou dúvida relevante

```
| #  | Ator         | Ação                     | Sistema / Resposta              | Observação                        |
|----|--------------|--------------------------|--------------------------------|-----------------------------------|
| 1  |              |                          |                                |                                   |
| 2  |              |                          |                                |                                   |
```

**Dicas:**
- Numere os passos para facilitar referência nos critérios de aceite.
- Marque passos opcionais com `(opcional)` na coluna Observação.
- Inclua passos de sistema (notificação, timeout, escalada) — não só ações humanas.
- Se houver bifurcação (ex.: autorizado × negado), use linhas separadas ou notas.

## 4. Identifique pontos de atenção

Dores, fricções e oportunidades ao longo da jornada:

```
## Pontos de atenção
- [Passo X] Risco de abandono: usuário aguarda mais de 30s sem feedback visual.
- [Passo Y] Ambiguidade: o sistema pode retornar dois estados e não fica claro qual priorizar.
- Oportunidade: reduzir passos 3-5 em um único formulário progressivo.
```

Categorias a considerar:
- **Fricção** — onde o usuário pode travar, confundir ou desistir
- **Carga cognitiva** — muita informação de uma vez, decisão complexa
- **Latência / feedback** — passos onde o sistema demora sem comunicar progresso
- **Oportunidade** — onde a interface pode antecipar a necessidade do usuário

## 5. Entregável

Para cada tipo de jornada identificado, entregue:

```markdown
### Jornada — [tipo]

**Tipo:** [beneficiário | atendente | gestor | operadora | administrador]
**Contexto:** [canal · módulo · situação]

| #  | Ator | Ação | Sistema / Resposta | Observação |
|----|------|------|--------------------|------------|
| 1  |      |      |                    |            |

**Pontos de atenção:**
- ...
```

→ Este artefato alimenta a skill `proposta-preliminar` (seção "Cenário de uso") e
o template TM20-00: Jornada no Confluence.
