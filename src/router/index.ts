import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'

/**
 * App routes. Each Figma flow/screen becomes a route here so the screens are
 * linked into a navigable flow. Pages live in `src/pages` and are lazy-loaded.
 *
 * As we import screens from Figma, add one route per screen and wire the
 * navigation (router-link / router.push) to match the prototype's flow.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomeView.vue'),
    meta: { title: 'Início' },
  },
  {
    // Tela "Início" (Painel do Atendente) — convertida do Figma 3049:34138.
    path: '/inicio',
    name: 'inicio',
    component: () => import('@/pages/InicioView.vue'),
    meta: { title: 'Painel do Atendente' },
  },
  {
    // Tela "Ocorrências" (Quadro + Lista) — Figma 2244:8452 / 2244:8483.
    // A interação Quadro/Lista fica no query param ?view=quadro|lista.
    path: '/ocorrencias',
    name: 'ocorrencias',
    component: () => import('@/pages/OcorrenciasView.vue'),
    meta: { title: 'Ocorrências' },
  },
  {
    // Detalhe da ocorrência (clique em um card) — Figma 8214:112869.
    path: '/ocorrencias/:id',
    name: 'ocorrencia-detalhe',
    component: () => import('@/pages/OcorrenciaDetalheView.vue'),
    meta: { title: 'Detalhe da ocorrência' },
  },
  {
    // Detalhe / jornada da ocorrência — compartilhada Gestor + Atendente.
    // Em construção por partes (Figma 7707:85572): header pronto; minifila +
    // timeline da jornada nas próximas etapas.
    path: '/ocorrencias/:id/jornada',
    name: 'ocorrencia-jornada',
    component: () => import('@/pages/OcorrenciaJornadaView.vue'),
    meta: { title: 'Detalhe da ocorrência' },
  },
  {
    // Central de Notificações — role-aware (atendente: gerais; gestor: por
    // atendente/setor). Acessível pelo dropdown do topbar e pela sidebar.
    path: '/notificacoes',
    name: 'notificacoes',
    component: () => import('@/pages/NotificacoesView.vue'),
    meta: { title: 'Notificações' },
  },
  {
    // A "Início" do gestor É o dashboard de Gestão em tempo real.
    path: '/gestor',
    redirect: '/gestor/tempo-real',
  },
  {
    // Gestão em tempo real (dashboard de abas) — Figma seção "Gestão tempo real".
    // É a tela inicial do gestor.
    path: '/gestor/tempo-real',
    name: 'gestor-tempo-real',
    component: () => import('@/pages/gestor/TempoRealView.vue'),
    meta: { title: 'Gestão em tempo real' },
  },
  {
    // Gestão e Performance (a frio) — análise retrospectiva de ocorrências por
    // atendente, volume por período e pendências acionáveis.
    path: '/gestor/gestao-performance',
    name: 'gestor-gestao-performance',
    component: () => import('@/pages/gestor/GestaoPerformanceView.vue'),
    meta: { title: 'Gestão e Performance' },
  },
  {
    // Overview geral de atendentes — drill-down da seção "Performance por
    // Atendente" na Gestão e Performance. Estrutura padrão de 5 seções.
    path: '/gestor/gestao-performance-atendentes',
    name: 'gestor-gestao-performance-atendentes',
    component: () => import('@/pages/gestor/GestaoPerformanceAtendentesView.vue'),
    meta: { title: 'Performance por Atendente' },
  },
  {
    // Detalhe de atendente individual — drill-down do overview geral acima.
    // Recebe ?atendente=<nome>&periodo=<chave> via query string.
    path: '/gestor/gestao-performance-atendente',
    name: 'gestor-gestao-performance-atendente',
    component: () => import('@/pages/gestor/GestaoPerformanceAtendenteView.vue'),
    meta: { title: 'Performance do Atendente' },
  },
  {
    // Detalhe "Operação por Canal" (drill-down da aba Atendimentos) — Figma
    // 7651:98838. Estrutura padrão das telas de detalhe do gestor.
    path: '/gestor/operacao-canal',
    name: 'gestor-operacao-canal',
    component: () => import('@/pages/gestor/OperacaoCanalView.vue'),
    meta: { title: 'Operação por Canal' },
  },
  {
    // Detalhe "Gestão de Filas e Atendimento Humano" (drill-down da aba Gestão
    // de filas). Estrutura padrão das telas de detalhe.
    path: '/gestor/filas-detalhe',
    name: 'gestor-filas-detalhe',
    component: () => import('@/pages/gestor/FilasDetalheView.vue'),
    meta: { title: 'Gestão de Filas · Detalhes' },
  },
  {
    // Detalhe "Central de Automação" (drill-down de Atendimentos → Atendimento
    // automatizado) — Figma 7654:104067. Estrutura padrão das telas de detalhe.
    path: '/gestor/automacao-bot',
    name: 'gestor-automacao-bot',
    component: () => import('@/pages/gestor/AutomacaoBotView.vue'),
    meta: { title: 'Central de Automação' },
  },
  {
    // Detalhe "Abandonos e Desistência" (drill-down da aba Abandonos).
    // Estrutura padrão das telas de detalhe (5 seções).
    path: '/gestor/abandonos-detalhe',
    name: 'gestor-abandonos-detalhe',
    component: () => import('@/pages/gestor/AbandonosDetalheView.vue'),
    meta: { title: 'Abandonos · Detalhes' },
  },
  {
    // Detalhe "Performance e Workforce" (drill-down da aba Performance).
    // Estrutura padrão das telas de detalhe (5 seções).
    path: '/gestor/performance-detalhe',
    name: 'gestor-performance-detalhe',
    component: () => import('@/pages/gestor/PerformanceDetalheView.vue'),
    meta: { title: 'Performance e Workforce · Detalhes' },
  },
  {
    // Detalhe "Desempenho da Equipe" (drill-down da aba Equipe).
    // Estrutura padrão das telas de detalhe (5 seções).
    path: '/gestor/equipe-detalhe',
    name: 'gestor-equipe-detalhe',
    component: () => import('@/pages/gestor/EquipeDetalheView.vue'),
    meta: { title: 'Equipe · Detalhes' },
  },
  {
    // Detalhe "Risk Center" (drill-down da subaba Gestão de Riscos da Gestão e
    // Performance). Recebe ?risco=<tipo> para pré-selecionar. Estrutura padrão
    // das telas de detalhe (5 blocos).
    path: '/gestor/risco-detalhe',
    name: 'gestor-risco-detalhe',
    component: () => import('@/pages/gestor/RiscoDetalheView.vue'),
    meta: { title: 'Risk Center · Detalhes' },
  },
  {
    // Detalhe "Gargalos e Setores" (drill-down da subaba homônima). Recebe
    // ?setor=<chave>. Estrutura padrão das telas de detalhe (5 blocos).
    path: '/gestor/gargalos-detalhe',
    name: 'gestor-gargalos-detalhe',
    component: () => import('@/pages/gestor/GargalosDetalheView.vue'),
    meta: { title: 'Gargalos e Setores · Detalhes' },
  },
  {
    // Detalhe "Pendências e Limbo" (drill-down da subaba homônima). Recebe
    // ?cat=<categoria>. Estrutura padrão das telas de detalhe (5 blocos).
    path: '/gestor/limbo-detalhe',
    name: 'gestor-limbo-detalhe',
    component: () => import('@/pages/gestor/LimboDetalheView.vue'),
    meta: { title: 'Pendências e Limbo · Detalhes' },
  },
  {
    // Detalhe "Qualidade e Experiência" (drill-down da subaba homônima). Recebe
    // ?ind=<indicador>. Estrutura padrão das telas de detalhe (5 blocos).
    path: '/gestor/qualidade-detalhe',
    name: 'gestor-qualidade-detalhe',
    component: () => import('@/pages/gestor/QualidadeDetalheView.vue'),
    meta: { title: 'Qualidade e Experiência · Detalhes' },
  },
  {
    // Indicadores do gestor — recebe ?ind= para pré-selecionar.
    path: '/gestor/indicadores',
    name: 'gestor-indicadores',
    component: () => import('@/pages/gestor/IndicadoresView.vue'),
    meta: { title: 'Indicadores' },
  },
  {
    // Ocorrências — Gestão Operacional (Kanban) — Figma 8074:4666.
    path: '/gestor/ocorrencias',
    name: 'gestor-ocorrencias',
    component: () => import('@/pages/gestor/OcorrenciasView.vue'),
    meta: { title: 'Ocorrências · Gestão Operacional' },
  },
  {
    // Lista dedicada de chamadas abandonadas (drill-down do card "Chamadas na
    // fila" da Início). Contexto separado das ocorrências gerais.
    path: '/gestor/abandonos',
    name: 'gestor-abandonos',
    component: () => import('@/pages/gestor/AbandonosListaView.vue'),
    meta: { title: 'Chamadas Abandonadas' },
  },
  {
    // Design System (styleguide vivo) — tokens + galeria de componentes.
    // Fora da navegação principal; acesso direto por /design-system.
    path: '/design-system',
    name: 'design-system',
    component: () => import('@/pages/DesignSystemView.vue'),
    meta: { title: 'Design System' },
  },
  {
    // Página de validação da stack (Element Plus + Tailwind). Pode remover
    // depois que os fluxos reais estiverem prontos.
    path: '/demo',
    name: 'demo',
    component: () => import('@/pages/DemoView.vue'),
    meta: { title: 'Demo da stack' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundView.vue'),
    meta: { title: 'Página não encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Atualiza o <title> da aba conforme a rota e sincroniza as abas da navbar
// (SplitView). O store de abas é lazy: só é instanciado após o Pinia montar.
router.afterEach((to) => {
  const base = 'Mobile Saúde'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
  if (to.name === 'not-found') return
  // Painel secundário (iframe embutido): não sincroniza abas.
  if (typeof window !== 'undefined' && window.self !== window.top) return
  try {
    useTabsStore().syncFromRoute(to)
  } catch {
    /* Pinia ainda não montado (improvável após o mount) */
  }
})

export default router
