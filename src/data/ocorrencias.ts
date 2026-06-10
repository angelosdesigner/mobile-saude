// Dados mock da tela "Ocorrências" (frames Figma 2244:8452 / 2244:8483).
// Servem tanto para o modo Quadro (kanban) quanto para o modo Lista (tabela).

export type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger' | ''

export type ColumnKey =
  | 'NOVO'
  | 'EM ATENDIMENTO'
  | 'EM ESPERA'
  | 'ENCAMINHAMENTOS'
  | 'CONCLUÍDOS NO DIA'

export interface Ocorrencia {
  id: number
  protocol: string
  beneficiary: string
  tipo: string
  assunto: string
  status: string
  statusType: TagType
  risk: boolean
  time: string
  timeType: TagType // success | warning | danger
  channel: string
  assignee?: string
  column: ColumnKey
}

export const columns: ColumnKey[] = [
  'NOVO',
  'EM ATENDIMENTO',
  'EM ESPERA',
  'ENCAMINHAMENTOS',
  'CONCLUÍDOS NO DIA',
]

export const ocorrencias: Ocorrencia[] = [
  {
    id: 1,
    protocol: '0010020030040050',
    beneficiary: 'Maria Silva Santos de Oliveira Conceição',
    tipo: 'Reembolso de consulta médica com especialista em cardiologia',
    assunto: 'Consulta médica',
    status: 'Aguardando triagem',
    statusType: 'info',
    risk: false,
    time: '2h 15min',
    timeType: 'success',
    channel: 'WhatsApp',
    column: 'NOVO',
  },
  {
    id: 2,
    protocol: '0010020030040050',
    beneficiary: 'João Pedro Oliveira',
    tipo: 'Autorização de exame',
    assunto: 'Consulta médica',
    status: 'Nova solicitação',
    statusType: 'info',
    risk: false,
    time: '1h 30min',
    timeType: 'success',
    channel: 'Portal Web',
    column: 'NOVO',
  },
  {
    id: 3,
    protocol: '0010020030040050',
    beneficiary: 'Ana Carolina Costa',
    tipo: 'Dúvida sobre cobertura',
    assunto: 'Consulta médica',
    status: 'Em análise',
    statusType: 'warning',
    risk: false,
    time: '45min',
    timeType: 'warning',
    channel: 'WhatsApp',
    assignee: 'Ana Silva',
    column: 'EM ATENDIMENTO',
  },
  {
    id: 4,
    protocol: '0010020030040050',
    beneficiary: 'Carlos Eduardo Lima',
    tipo: 'Solicitação de procedimento',
    assunto: 'Consulta médica',
    status: 'Documentos solicitados',
    statusType: 'primary',
    risk: false,
    time: '15min',
    timeType: 'warning',
    channel: 'Telefone',
    assignee: 'Rafael Mendes Rocha',
    column: 'EM ESPERA',
  },
  {
    id: 5,
    protocol: '0010020030040050',
    beneficiary: 'Maria Silva Santos de Oliveira Conceição',
    tipo: 'Encaminhamento para autorização',
    assunto: 'Consulta médica',
    status: 'Aguardando financeiro',
    statusType: 'primary',
    risk: true,
    time: 'Vencido há 2d',
    timeType: 'danger',
    channel: 'Portal Web',
    column: 'ENCAMINHAMENTOS',
  },
  {
    id: 6,
    protocol: '0010020030040050',
    beneficiary: 'Fernanda Rodrigues',
    tipo: 'Encaminhamento para autorização',
    assunto: 'Consulta médica',
    status: 'Concluído',
    statusType: 'success',
    risk: false,
    time: 'Dentro do prazo',
    timeType: 'success',
    channel: 'WhatsApp',
    assignee: 'Ana Silva',
    column: 'CONCLUÍDOS NO DIA',
  },
]
