// Conteúdo da aba "Detalhe" do painel esquerdo da tela de detalhe da ocorrência
// (Figma 7707:85575 · frame "Detalhe"). Seções colapsáveis com pares
// rótulo/valor. Mock fiel ao Figma — ligar à fonte real (oc) depois.

export interface DetalheCampo {
  label: string
  value?: string
  /** Tom do valor (ex.: SLA em verde). */
  tone?: 'success' | 'warning' | 'danger'
  /** Quando definido, renderiza tags (chips) em vez de um valor. */
  chips?: string[]
}
export interface DetalheGrupo {
  /** Subtítulo opcional dentro da seção (ex.: "Solicitante"). */
  titulo?: string
  campos: DetalheCampo[]
}
export interface DetalheSecao {
  titulo: string
  grupos: DetalheGrupo[]
}

export const detalheSecoes: DetalheSecao[] = [
  {
    titulo: 'Dados da ocorrência',
    grupos: [
      {
        campos: [
          { label: 'Tipo de ocorrência', value: 'Reembolso' },
          { label: 'Assunto', value: 'Consulta médica' },
          { label: 'Situação atual', value: 'Novo' },
          { label: 'Tipo de atendimento', value: 'Solicitação' },
          { label: 'Canal de origem', value: 'App' },
          { label: 'Prazo SLA', value: '48h', tone: 'success' },
          { label: 'Funcionalidade', value: 'Solicitação de reembolso' },
          { label: 'Tags', chips: ['Urgente', 'Reembolso', 'Reincidente', 'Prioritário'] },
          { label: 'Perfil de acesso', value: 'Beneficiário' },
          { label: 'Número de contrato', value: '181791-0' },
        ],
      },
    ],
  },
  {
    titulo: 'Contatos',
    grupos: [
      {
        titulo: 'Solicitante',
        campos: [
          { label: 'Nome', value: 'Ingrid Souza' },
          { label: 'CPF', value: '094.09.960-01.23' },
        ],
      },
      {
        titulo: 'Beneficiário',
        campos: [
          { label: 'Nome', value: 'Maria Santos Souza' },
          { label: 'CPF', value: '015.00.960-01.23' },
        ],
      },
    ],
  },
  {
    titulo: 'Atendente',
    grupos: [
      {
        campos: [
          { label: '1º atendente', value: 'Juliana Santos' },
          { label: 'Setor de atendimento', value: 'Reembolso' },
          { label: 'Perfil de atendente', value: 'N1' },
          { label: 'Atendente atual / Último atendente', value: 'Sara Sequeira Silva' },
          { label: 'Setor de atendimento', value: 'Financeiro' },
          { label: 'Perfil de atendente', value: 'N2' },
        ],
      },
    ],
  },
  {
    titulo: 'Outras informações',
    grupos: [
      {
        campos: [
          { label: 'Aplicativo', value: 'Portal Saúde' },
          { label: 'Canal', value: 'App mobile' },
          { label: 'Comentário', value: 'Atendente resolveu meu problema rapidamente. Estou satisfeita.' },
        ],
      },
    ],
  },
]

// ── Aba "Beneficiário" (Figma 2988:24325) ────────────────────────────────────
export const beneficiarioPerfil = {
  nome: 'Maria Silva Santos',
  papel: 'Beneficiário',
}

export const beneficiarioSecoes: DetalheSecao[] = [
  {
    titulo: 'Identificação',
    grupos: [
      {
        campos: [
          { label: 'Telefone', value: '(11) 98765-4321' },
          { label: 'E-mail', value: 'maria.silva@gmail.com' },
        ],
      },
    ],
  },
  {
    titulo: 'Situação financeira',
    grupos: [
      {
        campos: [
          { label: 'Situação', value: 'Adimplente' },
          { label: 'Vencimento', value: '01/12/2026' },
        ],
      },
    ],
  },
  {
    titulo: 'Plano',
    grupos: [
      {
        campos: [
          { label: 'Plano', value: 'Premium Nacional' },
          { label: 'Situação', value: 'Ativo' },
          { label: 'Cobertura', value: 'Hospitalar + Ambulatorial' },
          { label: 'Abrangência', value: 'Recife - PE' },
          { label: 'Operadora', value: 'Unimed' },
          { label: 'Tipo de contratação', value: 'Individual' },
          { label: 'Data de adesão', value: '01/03/2022' },
        ],
      },
    ],
  },
  {
    titulo: 'Carências',
    grupos: [
      {
        campos: [
          { label: 'Atendimentos Ambulatoriais', value: 'Liberado' },
          { label: 'Internações e Outros procedimentos', value: 'Liberado' },
          { label: 'Partos a termo', value: '01/12/2026' },
        ],
      },
    ],
  },
]

// ── Aba "Widgets" (Figma 2988:30636) ─────────────────────────────────────────
export type WidgetTone = 'warning' | 'neutral' | 'primary' | 'success'
export interface OcorrenciaWidget {
  label: string
  /** Nome de ícone do AppIcon (subconjunto dos registrados). */
  icon: 'file-text' | 'file' | 'clock' | 'map-pin' | 'bar-chart' | 'user'
  tone: WidgetTone
}

export const widgets: OcorrenciaWidget[] = [
  { label: 'Coberturas', icon: 'file-text', tone: 'warning' },
  { label: 'Últimas guias', icon: 'file', tone: 'neutral' },
  { label: 'Histórico financeiro', icon: 'clock', tone: 'neutral' },
  { label: 'Rede credenciada', icon: 'map-pin', tone: 'primary' },
  { label: 'PINSS', icon: 'file-text', tone: 'primary' },
  { label: 'Coparticipação', icon: 'bar-chart', tone: 'success' },
  { label: 'Customizada Datasource - Webview', icon: 'user', tone: 'warning' },
  { label: 'Extrato de Utilização', icon: 'file-text', tone: 'success' },
]
