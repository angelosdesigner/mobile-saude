// Camada de serviço da feature "Ocorrências".
//
// Hoje retorna fixtures mock de forma assíncrona; quando o backend existir,
// basta trocar o corpo destas funções por chamadas `fetch`/cliente HTTP — os
// stores e componentes que as consomem não mudam (mantêm-se agnósticos à fonte
// de dados). É a fronteira entre "de onde vêm os dados" e "como a UI os usa".
import type { Ocorrencia, ColumnKey } from '@/types/ocorrencias'
import { ocorrencias as mockOcorrencias } from '@/data/ocorrencias'

/** Simula a latência de rede para o estado de loading se comportar como em produção. */
function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** Lista todas as ocorrências. TODO: `GET ${config.apiBaseUrl}/ocorrencias`. */
export async function fetchOcorrencias(): Promise<Ocorrencia[]> {
  return delay(mockOcorrencias.map((o) => ({ ...o })))
}

/** Busca uma ocorrência pelo id. TODO: `GET /ocorrencias/:id`. */
export async function fetchOcorrenciaById(id: number): Promise<Ocorrencia | undefined> {
  return delay(mockOcorrencias.find((o) => o.id === id))
}

/** Atualiza a coluna (status) de uma ocorrência. TODO: `PATCH /ocorrencias/:id`. */
export async function updateOcorrenciaColumn(id: number, column: ColumnKey): Promise<void> {
  // No mock não há persistência remota; o store mantém o estado local.
  await delay(undefined, 0)
  void id
  void column
}
