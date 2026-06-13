// Feedback de ação padronizado via toast (ElMessage). Centraliza o texto para
// dois casos recorrentes na auditoria de botões de ação:
//  - comingSoon: CTA ainda sem destino — reconhece o clique e sinaliza "em breve".
//  - done: ação concluída com sucesso (confirmação).
// ElMessage é auto-importado (unplugin-auto-import) também em arquivos .ts.
export function useActionFeedback() {
  function comingSoon(label: string) {
    ElMessage.info(`${label}: disponível em breve`)
  }
  function done(message: string) {
    ElMessage.success(message)
  }
  return { comingSoon, done }
}
