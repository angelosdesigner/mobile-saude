# Stack Técnica — Frontend Painel Omnichannel

Referência para agentes que precisam conhecer ou implementar a stack frontend.
Quando a stack mudar, atualize **este arquivo** — não edite os agentes diretamente.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | TypeScript |
| Core Framework | Vue.js 3 |
| Build Tool | Vite |
| Biblioteca UI | Element Plus |
| Motor CSS / Layout | Tailwind CSS |
| Estado Global (Client) | Pinia |
| Estado Server (Async) | TanStack Query (Vue Query) |
| HTTP Client | Axios |
| Roteamento | Vue Router 4 |
| Validação de Forms | VeeValidate + Zod |
| Utils / Composables | VueUse |
| Testes Unitários | Vitest |
| Testes E2E | Playwright |
| Linter / Code Style | ESLint + Prettier |
| Ícones | Unplugin-icons |
| Microfrontend | single-spa |
| Real-time | Socket.io Client |
| CDN | AWS CloudFront |

## Regras obrigatórias

- **Pinia** é o state manager oficial — nunca Vuex.
- **TanStack Query** gerencia todo estado de servidor (cache, loading, refetch) — dados de API nunca ficam no Pinia.
- **VueUse** deve ser consultado antes de criar composables customizados.
- **Element Plus** para componentes complexos; **Tailwind** para layout/espaçamento — proibido recriar o que o Element Plus já oferece.
- **Lazy loading** obrigatório por rota no Vue Router.
- Componentes EP são **auto-importados** — não adicionar `import { ElButton } from 'element-plus'` manualmente.
- **Cascade layers** em `src/style.css` resolvem o conflito Tailwind ↔ Element Plus (ver `CLAUDE.md`).
- Compressão **Brotli** em produção com fallback Gzip.

## Complementos

- Versões exatas: ver `CLAUDE.md` e `package.json`
- Design tokens (primitivos → semânticos): ver skill `design-system-tokens` e `src/style.css`
- Componentes Base\*: `src/components/base/` e `src/components/ui/`
