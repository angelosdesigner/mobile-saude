// Configuração da aplicação derivada de variáveis de ambiente (Vite).
// Centralizar aqui evita espalhar `import.meta.env` pelo código e dá um único
// ponto para defaults e validação.
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'Mobile Saúde',
} as const
