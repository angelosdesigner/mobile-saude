// Serviço da tela operacional do gestor. Hoje retorna fixtures mock de forma
// assíncrona; troque o corpo por chamadas HTTP quando o backend existir.
import type { GestorCard, StatusPill, GestorStat, StageHeader } from '@/types/gestorOcorrencias'
import { gestorCards, statusPills, gestorStats, stageHeaders } from '@/data/gestorOcorrencias'

export interface GestorBoardData {
  cards: GestorCard[]
  statusPills: StatusPill[]
  stats: GestorStat[]
  headers: StageHeader[]
}

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** Carrega o board operacional do gestor. TODO: `GET /gestor/ocorrencias`. */
export async function fetchGestorBoard(): Promise<GestorBoardData> {
  return delay({
    cards: gestorCards.map((c) => ({ ...c })),
    statusPills,
    stats: gestorStats,
    headers: stageHeaders,
  })
}
