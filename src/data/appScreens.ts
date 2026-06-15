// Registro das principais telas do sistema — alimenta o menu "+ Adicionar" da
// navbar (SplitView). Cada item abre/ativa uma aba. Agrupado por contexto.
export interface AppScreen {
  label: string
  path: string
  group: 'Gestor' | 'Atendente' | 'Geral'
}

export const appScreens: AppScreen[] = [
  // ── Gestor ──
  { label: 'Gestão em tempo real', path: '/gestor/tempo-real', group: 'Gestor' },
  { label: 'Ocorrências · Gestão', path: '/gestor/ocorrencias', group: 'Gestor' },
  { label: 'Centro de Indicadores', path: '/gestor/indicadores', group: 'Gestor' },
  { label: 'Operação por Canal', path: '/gestor/operacao-canal', group: 'Gestor' },
  { label: 'Central de Automação', path: '/gestor/automacao-bot', group: 'Gestor' },
  { label: 'Gestão de Filas · Detalhes', path: '/gestor/filas-detalhe', group: 'Gestor' },
  { label: 'Chamadas Abandonadas', path: '/gestor/abandonos', group: 'Gestor' },
  // ── Atendente ──
  { label: 'Início do Atendente', path: '/inicio', group: 'Atendente' },
  { label: 'Ocorrências', path: '/ocorrencias', group: 'Atendente' },
  { label: 'Notificações', path: '/notificacoes', group: 'Atendente' },
  // ── Geral ──
  { label: 'Home', path: '/', group: 'Geral' },
]
