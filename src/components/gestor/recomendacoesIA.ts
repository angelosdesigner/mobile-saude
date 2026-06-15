// Tipo do cartão de recomendação da IA (separado do .vue para ser importado
// pelos data files que alimentam o componente RecomendacoesIA).
export interface RecomendacaoIA {
  titulo: string
  corpo: string
  impacto: string
  acao: string
  destaque?: boolean
}
