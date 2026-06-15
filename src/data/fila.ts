// Mock da "Minha fila de atendimentos" (frame Figma 8214:112872).

export interface FilaItem {
  id: number
  name: string
  time: string
  message: string
  categoria: string
  subtipo: string
  channel: string // WhatsApp | Telefone | App | Balcão | Portal Web
  unread?: number
  active?: boolean // em atendimento agora
}

export const filaItems: FilaItem[] = [
  {
    id: 1,
    name: 'Maria Silva Santos de Oliveira Conceição de Borges',
    time: '15:12',
    message: 'Preciso da segunda via do boleto de pagamento',
    categoria: 'Financeiro',
    subtipo: '2ª via',
    channel: 'WhatsApp',
    unread: 9,
    active: true,
  },
  {
    id: 2,
    name: 'João Pedro Oliveira',
    time: 'Ontem',
    message: 'Enviei os documentos ontem',
    categoria: 'Reembolso',
    subtipo: 'Análise',
    channel: 'Balcão',
  },
  {
    id: 3,
    name: 'Ana Paula Costa',
    time: '15:12',
    message: 'Ligação em atendimento',
    categoria: 'Rede Credenciada',
    subtipo: 'Consulta',
    channel: 'Telefone',
  },
  {
    id: 4,
    name: 'Roberto Mendes',
    time: 'sábado',
    message: 'Quando sai a autorização da consulta?',
    categoria: 'Financeiro',
    subtipo: '2ª via',
    channel: 'App',
  },
  {
    id: 5,
    name: 'Henrique Silva',
    time: '03/03/2026',
    message: 'Atendimento presencial',
    categoria: 'Cadastro',
    subtipo: 'Atualização',
    channel: 'Balcão',
  },
]

export const filaStats = {
  total: 10,
  abandono: 3,
  tmef: '8min',
  maiorEspera: '18min',
}
