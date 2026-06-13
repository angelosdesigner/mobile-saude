// Serviço da Central de Notificações. Hoje retorna fixtures de forma assíncrona;
// troque por chamadas HTTP quando o backend existir.
import type { Notificacao } from '@/types/notificacoes'
import { notificacoes } from '@/data/notificacoes'

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** Carrega as notificações. TODO: `GET /notificacoes`. */
export async function fetchNotificacoes(): Promise<Notificacao[]> {
  return delay(notificacoes.map((n) => ({ ...n })))
}
