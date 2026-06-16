// Timeline completa da jornada do atendimento (aba "Conversa" do detalhe da
// ocorrência) — fiel ao Figma `7383:78371` ("Container" da conversa, ~14000px).
//
// É um painel MULTICANAL: a mesma beneficiária (Maria Silva Santos) é atendida
// por vários atendentes em canais diferentes ao longo dos dias — App, WhatsApp,
// Telefone/URA, Chat/BOT. Por ora apenas exibimos toda a conversa; no futuro
// estes dados servirão para mapear/segmentar essas jornadas.
//
// Cada item é uma entrada tipada (discriminated union por `kind`) e o
// `TimelineJornada.vue` decide como renderizar cada tipo.

export interface JornadaRow {
  label: string
  value: string
}

/** Marcador de data (pílula central). */
export interface JornadaDivider {
  kind: 'divider'
  date: string
}

/**
 * Cartão de "evento" central com cabeçalho colorido e trilho (as linhas
 * horizontais que cruzam o cartão). `tone`:
 *  • success → início/abertura (borda + fundo verde)
 *  • danger  → fim/encerramento (borda + fundo vermelho)
 *  • neutral → criação / finalização / detalhes (fundo cinza, sem trilho)
 */
export interface JornadaEvent {
  kind: 'event'
  tone: 'success' | 'danger' | 'neutral'
  icon: string
  title: string
  meta?: string
  rows: JornadaRow[]
  cols?: 1 | 2
  /**
   * Posição do card. `center` (padrão) usa o trilho lateral; `left`/`right`
   * viram bloco alinhado (largura padrão de componente). O alinhamento é por
   * ATOR, não por tipo — daí ser controlado item a item.
   */
  align?: 'left' | 'center' | 'right'
}

/** Pílula arredondada de início/fim de conversa (contorno cinza). */
export interface JornadaChatPill {
  kind: 'chatPill'
  variant: 'start' | 'end'
  title: string
  time: string
  rows?: JornadaRow[]
}

/** Balão de mensagem (cliente à esquerda, atendente/BOT à direita). */
export interface JornadaBubble {
  kind: 'bubble'
  side: 'left' | 'right'
  author?: string
  text?: string
  /** Segunda linha/parágrafo (ex.: pergunta do BOT antes das quick-replies). */
  text2?: string
  time: string
  quickReplies?: string[]
  attachment?: { name: string }
  image?: { badge?: string }
}

/** Anotação interna/pública (cartão à direita, com autor acima). */
export interface JornadaNote {
  kind: 'note'
  variant: 'interna' | 'publica'
  author?: string
  text?: string
  time?: string
  /** Quando true, mostra as linhas de Gravação/Transcrição da chamada. */
  recording?: boolean
}

/** Disparo de template ativo (cartão laranja, ex.: "Contato ativo via Chat"). */
export interface JornadaTemplate {
  kind: 'template'
  author: string
  title: string
  time: string
  tags: string[]
  rows: JornadaRow[]
}

/** Evento de sistema (cartão cinza com ícone + título + linhas chave/valor). */
export interface JornadaSystem {
  kind: 'system'
  icon: string
  title: string
  rows: JornadaRow[]
  time: string
  author?: string
  attachment?: { name: string; size: string }
  /** `center` (padrão) ou `right` (ex.: Encaminhamento = ação do atendente). */
  align?: 'left' | 'center' | 'right'
}

/** Notificação enviada ao beneficiário (PUSH / E-mail / WhatsApp). */
export interface JornadaNotification {
  kind: 'notification'
  channel: string
  paragraphs: string[]
  time: string
}

/** Convite de pesquisa de satisfação (cartão cinza com seletor de nota). */
export interface JornadaSurvey {
  kind: 'survey'
  text: string
  time: string
}

/** Resposta da pesquisa de satisfação (cartão à esquerda, perguntas/respostas). */
export interface JornadaSurveyResponse {
  kind: 'surveyResponse'
  time: string
  items: { q: string; a: string }[]
}

/**
 * Envio do formulário de reembolso (cartão à esquerda). Espelha o componente
 * "Vários formulários resumidos" do Figma (`8453:29730`) — origem em outra tela.
 */
export interface JornadaForm {
  kind: 'form'
  title: string
  itemsTitle: string
  items: JornadaRow[][]
  complementoTitle: string
  pagamentoTitle: string
  pagamento: JornadaRow[]
}

export type JornadaItem =
  | JornadaDivider
  | JornadaEvent
  | JornadaChatPill
  | JornadaBubble
  | JornadaNote
  | JornadaTemplate
  | JornadaSystem
  | JornadaNotification
  | JornadaSurvey
  | JornadaSurveyResponse
  | JornadaForm

const P1 = '999999999920260312909202' // Reembolso via App
const P2 = '999999999920260314909233' // SAC via Telefone
const P3 = '999999999920260316909244' // SAC via Chat
const BENEF = 'Maria Silva Santos'

export const jornadaTimeline: JornadaItem[] = [
  // ───────────────────────────── 23/02/2026 ─────────────────────────────
  { kind: 'divider', date: '23/02/2026' },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Criação da ocorrência',
    meta: '23/02/2026 às 09:06',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P1 },
      { label: 'Solicitante', value: BENEF },
      { label: 'Tipo de ocorrência', value: 'Reembolso' },
      { label: 'Assunto', value: 'Solicitação' },
      { label: 'Funcionalidade', value: 'Solicitação de reembolso' },
    ],
  },
  {
    kind: 'event',
    tone: 'success',
    icon: 'file-text',
    title: 'Abertura de solicitação',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  23/02/2026 09:00` },
      { label: 'Responsável pela ação', value: `Beneficiário - ${BENEF}` },
      { label: 'Canal de início', value: 'App' },
    ],
  },
  {
    kind: 'form',
    title: 'Envio do formulário',
    itemsTitle: 'Tipo de Reembolso',
    items: [
      [
        { label: 'CPF ou CNPJ', value: '07805206708' },
        { label: 'Cidade', value: 'Brasília' },
        { label: 'Data da despesa', value: '12/02/2026' },
        { label: 'Valor da despesa', value: '400,90' },
      ],
      [
        { label: 'CPF ou CNPJ', value: '07805206708' },
        { label: 'Cidade', value: 'Brasília' },
        { label: 'Data da despesa', value: '12/02/2026' },
        { label: 'Valor da despesa', value: '400,90' },
      ],
      [
        { label: 'CPF ou CNPJ', value: '07805206708' },
        { label: 'Cidade', value: 'Brasília' },
        { label: 'Data da despesa', value: '12/02/2026' },
        { label: 'Valor da despesa', value: '400,90' },
      ],
    ],
    complementoTitle: 'Complemento',
    pagamentoTitle: 'Dados para pagamento',
    pagamento: [
      { label: 'Forma de depósito', value: 'PIX' },
      { label: 'Nome do favorecido', value: 'Everson' },
      { label: 'Tipo da chave PIX', value: 'E-mail' },
      { label: 'Chave PIX', value: '123' },
    ],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Anotação interna',
    cols: 2,
    align: 'right',
    rows: [
      { label: 'Protocolo', value: P1 },
      { label: 'Solicitante', value: BENEF },
      { label: 'Beneficiário', value: BENEF },
      { label: 'Número do contrato', value: '60312909202' },
      { label: 'Tipo de ocorrência', value: 'Reembolso' },
      { label: 'Assunto', value: 'Solicitação' },
      { label: 'Setor', value: 'Reembolso' },
      { label: 'Funcionalidade', value: 'Solicitação de reembolso' },
      { label: 'Canal de origem', value: 'App' },
      { label: 'Situação inicial', value: 'Novo' },
      { label: 'SLA inicial', value: '30 dias' },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'file-text',
    title: 'Fim da interação',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  23/02/2026 09:06` },
      { label: 'Tempo de duração', value: '6 minutos' },
      { label: 'SLA restante', value: '48h' },
    ],
  },
  {
    kind: 'event',
    tone: 'success',
    icon: 'file-text',
    title: 'Início do atendimento - Juliana Santos',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  23/02/2026 16:00` },
      { label: 'Canal de início', value: 'Painel de atendimento' },
      { label: 'Mudança de status', value: 'Novo → Em atendimento' },
      { label: 'Alocado por', value: 'Juliana Santos' },
      { label: 'Setor responsável', value: 'Reembolso' },
    ],
  },
  {
    kind: 'note',
    variant: 'interna',
    author: 'Juliana Santos',
    text: 'Ocorrência assumida para análise. Verificando documentação anexada e consultando tabela de procedimentos cobertos pelo plano Premium Plus.',
    time: '23/02/2026 às 16:00',
  },
  {
    kind: 'template',
    author: 'Juliana Santos',
    title: 'Contato ativo via Chat',
    time: '29/02/2026 às 11:17',
    tags: ['WhatsApp', 'Push', 'E-mail'],
    rows: [
      { label: 'Template', value: 'Solicitação de Documentação' },
      { label: 'Origem', value: 'Painel de atendimento' },
      { label: 'Destinatário', value: BENEF },
      { label: 'Canal de envio', value: 'Painel de atendimento / API' },
    ],
  },
  {
    kind: 'chatPill',
    variant: 'start',
    title: 'Início de conversa via chat',
    time: '23/02/2026 às 16:10',
    rows: [
      { label: 'Canal', value: 'WhatsApp' },
      { label: 'Ação de origem', value: 'Resposta de template' },
      { label: 'Iniciado por', value: 'Maria Santos Silva' },
    ],
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'Juliana Santos',
    text: 'Olá Maria! Recebi sua solicitação. Verifiquei que a imagem da nota fiscal está com baixa resolução. Poderia enviar uma foto mais nítida para prosseguirmos com a análise?',
    time: '23/02/2026 às 16:10',
  },
  {
    kind: 'bubble',
    side: 'left',
    author: BENEF,
    text: 'Oi! Segue a foto em melhor qualidade',
    time: '23/02/2026 às 16:10',
  },
  {
    kind: 'bubble',
    side: 'left',
    author: BENEF,
    attachment: { name: 'Formulario_Reembolso.pdf' },
    image: { badge: 'Alta qualidade' },
    time: '23/02/2026 às 16:10',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'Juliana Santos',
    text: 'Perfeito! Agora consigo visualizar todos os dados. Vou encaminhar sua solicitação para o setor financeiro analisar e aprovar o reembolso. Em breve você terá uma resposta.',
    time: '23/02/2026 às 16:10',
  },
  {
    kind: 'chatPill',
    variant: 'end',
    title: 'Fim da conversa via chat',
    time: '23/02/2026 às 16:15 (5min)',
    rows: [{ label: 'Encerrado por', value: 'Atendente - Juliana Santos' }],
  },
  {
    kind: 'note',
    variant: 'publica',
    author: 'Juliana Santos',
    text: 'Análise inicial do reembolso realizado com sucesso. Obtemos uma imagem em alta resolução da Nota Fiscal. Estamos encaminhando o atendimento para o time financeiro.',
    time: '23/02/2026 às 16:15',
  },
  {
    kind: 'system',
    icon: 'chevrons-right',
    title: 'Encaminhamento de atendimento',
    align: 'right',
    author: 'Juliana Santos',
    time: '23/02/2026 às 16:15',
    rows: [
      { label: 'Encaminhamento realizado por', value: 'Juliana Santos' },
      { label: 'Setor de origem', value: 'Atendimento' },
      { label: 'Setor de destino', value: 'Financeiro' },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'file-text',
    title: 'Fim do atendimento',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  23/02/2026 às 16:15` },
      { label: 'Tempo de duração', value: '5 minutos' },
      { label: 'SLA restante', value: '48h' },
    ],
  },

  // ───────────────────────────── 25/02/2026 ─────────────────────────────
  { kind: 'divider', date: '25/02/2026' },
  {
    kind: 'chatPill',
    variant: 'start',
    title: 'Início de contato via telefone',
    time: '25/02/2026 às 16:15',
    rows: [{ label: 'Iniciado por', value: 'Beneficiário - Maria Santos Silva' }],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Criação da ocorrência',
    meta: '25/02/2026 às 16:15',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P2 },
      { label: 'Solicitante', value: BENEF },
      { label: 'Tipo de ocorrência', value: 'SAC - Telefone' },
      { label: 'Funcionalidade', value: 'Solicitação de reembolso' },
    ],
  },
  {
    kind: 'event',
    tone: 'success',
    icon: 'file-text',
    title: 'Início da conversa - URA',
    rows: [
      { label: 'Protocolo', value: `${P2}  ·  25/02/2026 às 16:15` },
      { label: 'Canal de início', value: 'Telefone' },
      { label: 'Mudança de status', value: 'Novo → Em atendimento automatizado' },
      { label: 'Alocado por', value: 'Sistema / Gestor de atendimento' },
    ],
  },
  {
    kind: 'note',
    variant: 'interna',
    author: 'Sistema',
    text: 'Identificação do chamador. CPF informado: XXX.XXX.XXX-XX Entrada da fila de atendimento Alocação para o atendente. Tempo de espera na fila: 3min.',
    time: '25/02/2026 às 16:15',
  },
  {
    kind: 'system',
    icon: 'chevrons-right',
    title: 'Transferência',
    time: '25/02/2026 às 16:18',
    rows: [
      { label: 'Transferido por', value: 'URA' },
      { label: 'Mudança de atendente', value: 'URA → Pedro José' },
      { label: 'Mudança de status', value: 'Em atendimento automatizado → Em atendimento' },
    ],
  },
  {
    kind: 'system',
    icon: 'phone',
    title: 'Início de atendimento',
    time: '25/02/2026 às 16:18',
    rows: [
      { label: 'Iniciado por', value: 'Pedro José' },
      { label: 'Setor responsável', value: 'Atendimento Telefônico N1' },
      { label: 'Status', value: 'Em atendimento' },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'phone',
    title: 'Encerramento da ligação telefônica',
    rows: [
      { label: '', value: '25/02/2026 às 16:38 (20min)' },
      { label: 'Encerrado por', value: 'Atendente - Pedro José' },
    ],
  },
  {
    kind: 'note',
    variant: 'interna',
    author: 'Sistema',
    time: '25/02/2026 às 16:38',
    recording: true,
  },
  {
    kind: 'note',
    variant: 'publica',
    text: 'Foi informado ao cliente que o atendimento já se encontra com o setor financeiro.',
    time: '25/02/2026 às 16:38',
  },
  {
    kind: 'note',
    variant: 'interna',
    text: 'Cliente solicitou prioridade por motivo...',
    time: '25/02/2026 às 16:38',
  },
  {
    kind: 'system',
    icon: 'file-text',
    title: 'Fim da ocorrência vinculada',
    time: '25/02/2026 às 16:40',
    rows: [
      { label: 'Encerrado por', value: 'Pedro José' },
      { label: 'Mudança de status', value: 'Em atendimento → Encerrado' },
      { label: 'Motivo do encerramento', value: 'Atendimento finalizado' },
      {
        label: 'Observação',
        value: 'Foi informado ao cliente que o atendimento já se encontra com o setor financeiro.',
      },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'file-text',
    title: 'Fim do atendimento',
    rows: [
      { label: 'Protocolo', value: `${P2}  ·  25/02/2026 às 16:40` },
      { label: 'Tempo de duração', value: '22 minutos' },
      { label: 'SLA restante', value: '48h' },
    ],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Ocorrência finalizada',
    meta: '25/02/2026 às 16:40',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P2 },
      { label: 'Foi resolvido?', value: 'Sim' },
      { label: 'Cumpriu o SLA?', value: 'Sim' },
    ],
  },

  // ───────────────────────────── 27/02/2026 ─────────────────────────────
  { kind: 'divider', date: '27/02/2026' },
  {
    kind: 'chatPill',
    variant: 'start',
    title: 'Início de conversa via chat',
    time: '27/02/2026 às 10:00',
    rows: [
      { label: 'Canal', value: 'WhatsApp' },
      { label: 'Ação de origem', value: 'Início de conversa' },
      { label: 'Iniciado por', value: 'Beneficiário - Maria Santos Silva' },
    ],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Criação da ocorrência',
    meta: '27/02/2026 às 10:00',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P3 },
      { label: 'Solicitante', value: BENEF },
      { label: 'Tipo de ocorrência', value: 'SAC - Chat' },
      { label: 'Funcionalidade', value: 'Chat' },
    ],
  },
  {
    kind: 'event',
    tone: 'success',
    icon: 'file-text',
    title: 'Início da conversa - BOT',
    rows: [
      { label: 'Protocolo', value: `${P3}  ·  27/02/2026 às 10:00` },
      { label: 'Canal de início', value: 'WhatsApp' },
      { label: 'Mudança de status', value: 'Novo → Em atendimento automatizado' },
    ],
  },
  { kind: 'bubble', side: 'left', author: BENEF, text: 'Olá!', time: '27/02/2026 às 10:00' },
  { kind: 'bubble', side: 'right', author: 'BOT', text: 'Bem-vindo!', time: '27/02/2026 às 10:00' },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Para iniciarmos seu atendimento, precisamos que você se identifique',
    time: '27/02/2026 às 10:00',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Por favor, informe seu CPF',
    time: '27/02/2026 às 10:00',
  },
  { kind: 'bubble', side: 'left', author: BENEF, text: '07805206708', time: '27/02/2026 às 10:02' },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Identificamos que você tem uma ocorrência em aberto, do número de protocolo: 0010020030040050, com o status Aguardando Financeiro.',
    text2: 'Você gostaria de falar sobre esta ocorrência ou outro assunto?',
    quickReplies: ['Essa ocorrência', 'Outro assunto'],
    time: '27/02/2026 às 10:04',
  },
  {
    kind: 'bubble',
    side: 'left',
    author: BENEF,
    text: 'Essa ocorrência',
    time: '27/02/2026 às 10:05',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Você está sendo encaminhada para a fila de atendimento. Sua posição é a 10ª.',
    time: '27/02/2026 às 10:05',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Sua posição é a 4ª da fila.',
    time: '27/02/2026 às 10:15',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Chegou sua vez! Obrigado por aguardar.',
    time: '27/02/2026 às 10:25',
  },
  {
    kind: 'system',
    icon: 'chevrons-right',
    title: 'Transferência',
    time: '27/02/2026 às 10:25',
    rows: [
      { label: 'Transferido por', value: 'BOT' },
      { label: 'Mudança de atendente', value: 'BOT → Antônio Augusto' },
      { label: 'Mudança de status', value: 'Em atendimento automatizado → Em atendimento' },
    ],
  },
  {
    kind: 'system',
    icon: 'message-circle',
    title: 'Início de atendimento',
    time: '27/02/2026 às 10:25',
    rows: [
      { label: 'Iniciado por', value: 'Atendente - Antônio Augusto' },
      { label: 'Setor responsável', value: 'Atendimento Chat N1' },
      { label: 'Status', value: 'Em atendimento' },
    ],
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'Antônio Augusto',
    text: 'Olá, tudo bem? Como posso te ajudar?',
    time: '27/02/2026 às 10:25',
  },
  {
    kind: 'bubble',
    side: 'left',
    author: BENEF,
    text: 'Olá! Gostaria de saber o status da minha solicitação.',
    time: '27/02/2026 às 10:25',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'Antônio Augusto',
    text: 'Sua ocorrência encontra-se no setor financeiro.',
    time: '27/02/2026 às 10:27',
  },
  {
    kind: 'bubble',
    side: 'left',
    author: BENEF,
    text: 'Ok! Mas preciso de prioridade. Sabe quanto tempo demoraria?',
    time: '27/02/2026 às 10:30',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'Antônio Augusto',
    text: 'Vou solicitar prioridade ao setor e entraremos em breve com o retorno.',
    time: '27/02/2026 às 10:32',
  },
  {
    kind: 'note',
    variant: 'publica',
    text: 'Cliente solicitou atualização sobre o status da ocorrência.',
    time: '27/02/2026 às 10:35',
  },
  {
    kind: 'note',
    variant: 'interna',
    text: 'Cliente solicita prioridade novamente ao chamado.',
    time: '27/02/2026 às 10:35',
  },
  {
    kind: 'chatPill',
    variant: 'end',
    title: 'Fim da conversa via chat',
    time: '27/02/2026 às 10:35 (35min)',
    rows: [{ label: 'Encerrado por', value: 'Atendente - Antônio Augusto' }],
  },
  {
    kind: 'system',
    icon: 'file-text',
    title: 'Fim da ocorrência vinculada',
    time: '27/02/2026 às 10:35',
    rows: [
      { label: 'Atendimento alterado por', value: 'Antônio Augusto' },
      { label: 'Atendimento desalocado de', value: 'Antônio Augusto' },
      { label: 'Mudança de status', value: 'Em atendimento → Encerrado' },
      { label: 'Motivo do encerramento', value: 'Atendimento finalizado' },
      {
        label: 'Observação',
        value: 'Foi informado ao cliente que o atendimento já se encontra com o setor financeiro.',
      },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'file-text',
    title: 'Fim do atendimento',
    rows: [
      { label: 'Protocolo', value: `${P3}  ·  27/02/2026 às 10:35` },
      { label: 'Tempo de duração', value: '10 minutos' },
      { label: 'SLA restante', value: '48h' },
    ],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Ocorrência finalizada',
    meta: '27/02/2026 às 10:35',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P3 },
      { label: 'Foi resolvido?', value: 'Sim' },
      { label: 'Cumpriu o SLA?', value: 'Sim' },
    ],
  },

  // ───────────────────────────── 28/02/2026 ─────────────────────────────
  { kind: 'divider', date: '28/02/2026' },
  {
    kind: 'event',
    tone: 'success',
    icon: 'file-text',
    title: 'Início do atendimento - Marcos Pereira',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  28/02/2026 às 10:50` },
      { label: 'Canal de início', value: 'Painel de atendimento' },
      { label: 'Mudança de status', value: 'Aguardando financeiro → Análise financeira' },
      { label: 'Setor responsável', value: 'Financeiro' },
      { label: 'Responsável pela ação', value: 'Atendente - Marcos Pereira' },
    ],
  },
  {
    kind: 'note',
    variant: 'interna',
    text: 'Após analisar o chamado, registrei a data de pagamento e encaminhei o chamado de volta para o N1 dar o parecer ao cliente.',
    time: '28/02/2026 às 10:55',
  },
  {
    kind: 'note',
    variant: 'publica',
    text: 'Após analisar o chamado, registrei a data de pagamento e encaminhei o chamado de volta para o N1 dar o parecer ao cliente.',
    time: '28/02/2026 às 10:55',
  },
  {
    kind: 'system',
    icon: 'chevrons-right',
    title: 'Encaminhamento de atendimento',
    align: 'right',
    time: '28/02/2026 às 11:00',
    rows: [
      { label: 'Encaminhamento realizado por', value: 'Marcos Pereira' },
      { label: 'Setor de origem', value: 'Financeiro' },
      { label: 'Setor de destino', value: 'Atendimento' },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'file-text',
    title: 'Fim do atendimento',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  28/02/2026 às 11:17` },
      { label: 'Tempo de duração', value: '1 dia e 27 minutos' },
      { label: 'SLA restante', value: '24h' },
    ],
  },

  // ───────────────────────────── 29/02/2026 ─────────────────────────────
  { kind: 'divider', date: '29/02/2026' },
  {
    kind: 'event',
    tone: 'success',
    icon: 'file-text',
    title: 'Início do atendimento - Juliana Santos',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  29/02/2026 às 11:20` },
      { label: 'Canal de início', value: 'Painel de atendimento' },
      { label: 'Mudança de status', value: 'Em espera → Em análise' },
      { label: 'Setor responsável', value: 'Reembolso' },
      { label: 'Responsável pela ação', value: 'Atendente - Juliana Santos' },
    ],
  },
  {
    kind: 'template',
    author: 'Juliana Santos',
    title: 'Contato ativo via Chat',
    time: '29/02/2026 às 11:20',
    tags: ['WhatsApp', 'Push', 'E-mail'],
    rows: [
      { label: 'Template', value: 'Solicitação de Documentação' },
      { label: 'Origem', value: 'Painel de atendimento' },
      { label: 'Destinatário', value: BENEF },
      { label: 'Canal de envio', value: 'Painel de atendimento / API' },
    ],
  },
  {
    kind: 'chatPill',
    variant: 'start',
    title: 'Início de conversa via chat',
    time: '29/02/2026 às 11:20',
    rows: [
      { label: 'Canal', value: 'WhatsApp' },
      { label: 'Ação de origem', value: 'Resposta de template' },
      { label: 'Iniciado por', value: BENEF },
    ],
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'Juliana Santos',
    text: 'Olá Maria! Tenho uma ótima notícia! Seu reembolso foi aprovado no valor de R$ 450,00. O pagamento será realizado em 22/03/2026. Há mais alguma dúvida?',
    time: '29/02/2026 às 11:20',
  },
  {
    kind: 'note',
    variant: 'interna',
    text: 'Contato com o beneficiário para relatar que o reembolso foi aprovado pelo setor.',
    time: '29/02/2026 às 11:20',
  },
  {
    kind: 'bubble',
    side: 'left',
    author: BENEF,
    text: 'Que maravilha! Muito obrigada pelo atendimento!',
    time: '29/02/2026 às 11:20',
  },
  {
    kind: 'note',
    variant: 'publica',
    text: 'Contato com o beneficiário para relatar que o reembolso foi aprovado pelo setor.',
    time: '29/02/2026 às 11:20',
  },
  {
    kind: 'chatPill',
    variant: 'end',
    title: 'Fim da conversa via chat',
    time: '29/02/2026 às 11:20 (3min)',
    rows: [{ label: 'Encerrado por', value: 'Maria Santos Silva' }],
  },
  {
    kind: 'system',
    icon: 'file-text',
    title: 'Fim da ocorrência',
    time: '29/02/2026 às 11:20',
    attachment: { name: 'reembolsoaprovado_.pdf', size: '0.3mb' },
    rows: [
      { label: 'Atendimento alterado por', value: 'Juliana Santos' },
      { label: 'Atendimento desalocado de', value: 'Juliana Santos' },
      { label: 'Atendimento alocado para', value: '-' },
      { label: 'Status anterior', value: 'Em atendimento' },
      { label: 'Status atribuído', value: 'Concluído' },
      { label: 'Motivo do encerramento', value: 'Pedido aprovado' },
      { label: 'Observação', value: 'Atendimento aprovado dentro do prazo' },
    ],
  },
  {
    kind: 'event',
    tone: 'danger',
    icon: 'file-text',
    title: 'Fim do atendimento',
    rows: [
      { label: 'Protocolo', value: `${P1}  ·  29/02/2026 às 11:20` },
      { label: 'Tempo de duração', value: '3 minutos' },
      { label: 'SLA restante', value: '48h' },
    ],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Ocorrência finalizada',
    meta: '29/02/2026 às 11:20',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P1 },
      { label: 'Foi resolvido?', value: 'Sim' },
      { label: 'Cumpriu o SLA?', value: 'Sim' },
    ],
  },
  {
    kind: 'notification',
    channel: 'PUSH',
    time: '29/02/2026 às 11:20',
    paragraphs: [
      'Sua solicitação registrada na data 01/03/2026 sob o numero de protocolo: 123. Foi aprovado. O valor 450,00 será reembolsado até a data 01/04/2026.',
    ],
  },
  {
    kind: 'notification',
    channel: 'E-mail',
    time: '29/02/2026 às 11:20',
    paragraphs: [
      'Sua solicitação registrada na data 01/03/2026 sob o numero de protocolo: 123. Foi aprovado. O valor 450,00 será reembolsado até a data 01/04/2026.',
      'Lorem ipsum dolor sit amet consectetur. Molestie elit fusce habitant sed. Lorem viverra id nunc risus sit sed. Rhoncus sollicitudin sed eget lacus viverra rhoncus. Amet egestas elit non integer porta sit lacinia libero lectus.',
    ],
  },
  {
    kind: 'notification',
    channel: 'WhatsApp',
    time: '29/02/2026 às 11:20',
    paragraphs: [
      'Sua solicitação registrada na data 01/03/2026 sob o numero de protocolo: 123. Foi aprovado. O valor 450,00 será reembolsado até a data 01/04/2026.',
      'Lorem ipsum dolor sit amet consectetur. Molestie elit fusce habitant sed. Lorem viverra id nunc risus sit sed. Rhoncus sollicitudin sed eget lacus viverra rhoncus. Amet egestas elit non integer porta sit lacinia libero lectus.',
      'Lorem ipsum dolor sit amet consectetur. Molestie elit fusce habitant sed. Lorem viverra id nunc risus sit sed. Rhoncus sollicitudin sed eget lacus viverra rhoncus. Amet egestas elit non integer porta sit lacinia libero lectus.',
    ],
  },
  {
    kind: 'survey',
    text: 'Como foi o seu atendimento? Sua opinião é muito importante para nós. Acesse o link e avalie.',
    time: '29/02/2026 às 11:20',
  },
  {
    kind: 'bubble',
    side: 'right',
    author: 'BOT',
    text: 'Como foi o seu atendimento? Sua opinião é muito importante pra gente',
    text2: 'Acesse o link e preencha o formulário',
    time: '29/02/2026 às 11:20',
  },
  {
    kind: 'surveyResponse',
    time: '29/02/2026 às 11:20',
    items: [
      { q: 'Como você avalia o atendimento recebido?', a: 'Excelente ⭐⭐⭐⭐⭐' },
      { q: 'Como você avalia a solução proposta para o seu problema?', a: 'Muito boa ⭐⭐⭐⭐☆' },
      { q: 'Como você avalia o tempo de resolução do seu atendimento?', a: '12/02/2026' },
      {
        q: 'Deseja fazer alguma observação sobre sua experiência?',
        a: 'Fui bem atendido e o problema foi resolvido, mas o tempo poderia ser um pouco mais rápido.',
      },
    ],
  },
  {
    kind: 'event',
    tone: 'neutral',
    icon: 'file-text',
    title: 'Ocorrência finalizada',
    rows: [],
  },
]
