// Dados mock da tela "Ocorrências" (frames Figma 2244:8452 / 2244:8483).
// Servem para o modo Quadro (kanban, com drag-and-drop) e o modo Lista.

export type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

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
  // Dimensões usadas pelos filtros (multi-select).
  prioridade: 'Alta' | 'Média' | 'Baixa'
  sla: string
  tipoOcorrencia: string
  tipoAtendimento: string
  atendente: string
}

export const columns: ColumnKey[] = [
  'NOVO',
  'EM ATENDIMENTO',
  'EM ESPERA',
  'ENCAMINHAMENTOS',
  'CONCLUÍDOS NO DIA',
]

// Opções dos filtros (extraídas dos dropdowns do Figma).
export const prioridadeOptions = ['Alta', 'Média', 'Baixa']
export const slaOptions = ['Crítico', 'Vencido', 'Atenção', 'Dentro do prazo', 'Sem SLA']
export const tipoOcorrenciaOptions = ['Autorização', 'Reembolso', 'Segunda via', 'Reclamação', 'Cancelamento']
export const tipoAtendimentoOptions = ['App', 'WhatsApp', 'Portal Web', 'Telefone', 'Presencial']
export const atendenteOptions = ['João Pereira', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Não atribuídos']

export const ocorrencias: Ocorrencia[] = [
  {
    id: 1, protocol: '0010020030040050',
    beneficiary: 'Maria Silva Santos de Oliveira Conceição',
    tipo: 'Reembolso de consulta médica com especialista em cardiologia',
    assunto: 'Consulta médica', status: 'Aguardando triagem', statusType: 'info',
    risk: false, time: '2h 15min', timeType: 'success', channel: 'WhatsApp', column: 'NOVO',
    prioridade: 'Alta', sla: 'Crítico', tipoOcorrencia: 'Reembolso', tipoAtendimento: 'WhatsApp', atendente: 'Não atribuídos',
  },
  {
    id: 2, protocol: '0010020030040050',
    beneficiary: 'João Pedro Oliveira',
    tipo: 'Autorização de exame',
    assunto: 'Consulta médica', status: 'Nova solicitação', statusType: 'info',
    risk: false, time: '1h 30min', timeType: 'success', channel: 'Portal Web', column: 'NOVO',
    prioridade: 'Média', sla: 'Atenção', tipoOcorrencia: 'Autorização', tipoAtendimento: 'Portal Web', atendente: 'Não atribuídos',
  },
  {
    id: 3, protocol: '0010020030040050',
    beneficiary: 'Ana Carolina Costa',
    tipo: 'Dúvida sobre cobertura',
    assunto: 'Consulta médica', status: 'Em análise', statusType: 'warning',
    risk: false, time: '45min', timeType: 'warning', channel: 'WhatsApp', assignee: 'Ana Silva', column: 'EM ATENDIMENTO',
    prioridade: 'Média', sla: 'Dentro do prazo', tipoOcorrencia: 'Reclamação', tipoAtendimento: 'WhatsApp', atendente: 'Ana Costa',
  },
  {
    id: 4, protocol: '0010020030040050',
    beneficiary: 'Carlos Eduardo Lima',
    tipo: 'Solicitação de procedimento',
    assunto: 'Consulta médica', status: 'Documentos solicitados', statusType: 'primary',
    risk: false, time: '15min', timeType: 'warning', channel: 'Telefone', assignee: 'Rafael Mendes Rocha', column: 'EM ESPERA',
    prioridade: 'Alta', sla: 'Vencido', tipoOcorrencia: 'Autorização', tipoAtendimento: 'Telefone', atendente: 'Carlos Oliveira',
  },
  {
    id: 5, protocol: '0010020030040050',
    beneficiary: 'Maria Silva Santos de Oliveira Conceição',
    tipo: 'Encaminhamento para autorização',
    assunto: 'Consulta médica', status: 'Aguardando financeiro', statusType: 'primary',
    risk: true, time: 'Vencido há 2d', timeType: 'danger', channel: 'Portal Web', column: 'ENCAMINHAMENTOS',
    prioridade: 'Alta', sla: 'Vencido', tipoOcorrencia: 'Autorização', tipoAtendimento: 'Portal Web', atendente: 'Maria Santos',
  },
  {
    id: 6, protocol: '0010020030040050',
    beneficiary: 'Fernanda Rodrigues',
    tipo: 'Encaminhamento para autorização',
    assunto: 'Consulta médica', status: 'Concluído', statusType: 'success',
    risk: false, time: 'Dentro do prazo', timeType: 'success', channel: 'WhatsApp', assignee: 'Ana Silva', column: 'CONCLUÍDOS NO DIA',
    prioridade: 'Baixa', sla: 'Dentro do prazo', tipoOcorrencia: 'Cancelamento', tipoAtendimento: 'WhatsApp', atendente: 'João Pereira',
  },
]
