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
    // Visão do gestor — dashboard agregado (mesmo produto, outro papel).
    // Telas adicionais (Jornadas, Relatórios) entram como rotas filhas aqui.
    path: '/gestor',
    name: 'gestor-dashboard',
    component: () => import('@/pages/gestor/DashboardView.vue'),
    meta: { title: 'Visão do gestor' },
  },
  {
    // Gestão em tempo real (dashboard de abas) — Figma seção "Gestão tempo real".
    path: '/gestor/tempo-real',
    name: 'gestor-tempo-real',
    component: () => import('@/pages/gestor/TempoRealView.vue'),
    meta: { title: 'Gestão em tempo real' },
  },
  {
    // Ocorrências — Gestão Operacional (Kanban) — Figma 8074:4666.
    path: '/gestor/ocorrencias',
    name: 'gestor-ocorrencias',
    component: () => import('@/pages/gestor/OcorrenciasView.vue'),
    meta: { title: 'Ocorrências · Gestão Operacional' },
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
