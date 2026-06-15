import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
    // Detalhe "Operação por Canal" (drill-down da aba Atendimentos) — Figma
    // 7651:98838. Estrutura padrão das telas de detalhe do gestor.
    path: '/gestor/operacao-canal',
    name: 'gestor-operacao-canal',
    component: () => import('@/pages/gestor/OperacaoCanalView.vue'),
    meta: { title: 'Operação por Canal' },
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

// Atualiza o <title> da aba conforme a rota.
router.afterEach((to) => {
  const base = 'Mobile Saúde'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
