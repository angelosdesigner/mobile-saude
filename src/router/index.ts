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
