// Lista própria de CHAMADAS ABANDONADAS — drill-down do card "Chamadas na fila"
// da Início. Separada da AbandonosTab (que é analítica/gráficos): aqui é a
// relação operacional, ocorrência a ocorrência, em contexto dedicado.
// Canais e filas seguem a taxonomia única (ver gestorTaxonomia).

export type OrigemAbandono = 'BOT' | 'Humano'

export interface ChamadaAbandonada {
  id: number
  beneficiary: string
  canal: string // "Chat/WhatsApp" | "Telefone" | "Balcão/Presencial" | "Portal" | "App"
  fila: string // nome canônico da fila
  origem: OrigemAbandono // abandonou no fluxo do BOT ou na fila humana
  espera: string // tempo aguardado até abandonar (m:ss)
  posicao: number // posição na fila no momento do abandono
  horario: string // HH:MM
}

export const chamadasAbandonadas: ChamadaAbandonada[] = [
  { id: 1, beneficiary: 'Marcos Tavares', canal: 'Chat/WhatsApp', fila: 'Reembolso', origem: 'BOT', espera: '6:48', posicao: 7, horario: '09:12' },
  { id: 2, beneficiary: 'Luana Prado', canal: 'Telefone', fila: 'Financeiro', origem: 'Humano', espera: '8:21', posicao: 5, horario: '09:47' },
  { id: 3, beneficiary: 'Roberto Dias', canal: 'Chat/WhatsApp', fila: 'Reembolso', origem: 'BOT', espera: '5:03', posicao: 9, horario: '10:05' },
  { id: 4, beneficiary: 'Patrícia Gomes', canal: 'Telefone', fila: 'Autorização', origem: 'Humano', espera: '12:40', posicao: 3, horario: '10:33' },
  { id: 5, beneficiary: 'Felipe Andrade', canal: 'App', fila: 'Dúvidas Administrativas', origem: 'BOT', espera: '3:54', posicao: 11, horario: '11:02' },
  { id: 6, beneficiary: 'Camila Rocha', canal: 'Chat/WhatsApp', fila: 'Financeiro', origem: 'Humano', espera: '9:15', posicao: 6, horario: '11:28' },
  { id: 7, beneficiary: 'Eduardo Lima', canal: 'Telefone', fila: 'Reembolso', origem: 'Humano', espera: '14:02', posicao: 2, horario: '12:10' },
  { id: 8, beneficiary: 'Sônia Martins', canal: 'Portal', fila: 'Dúvidas Administrativas', origem: 'BOT', espera: '2:31', posicao: 8, horario: '13:19' },
  { id: 9, beneficiary: 'Bruno Carvalho', canal: 'Chat/WhatsApp', fila: 'Reembolso', origem: 'BOT', espera: '7:09', posicao: 10, horario: '14:05' },
  { id: 10, beneficiary: 'Aline Souza', canal: 'Telefone', fila: 'Financeiro', origem: 'Humano', espera: '10:47', posicao: 4, horario: '14:41' },
  { id: 11, beneficiary: 'Gustavo Pereira', canal: 'App', fila: 'Autorização', origem: 'BOT', espera: '4:18', posicao: 12, horario: '15:23' },
  { id: 12, beneficiary: 'Renata Alves', canal: 'Chat/WhatsApp', fila: 'Reembolso', origem: 'Humano', espera: '11:36', posicao: 3, horario: '16:08' },
  { id: 13, beneficiary: 'Diego Fernandes', canal: 'Telefone', fila: 'Financeiro', origem: 'Humano', espera: '13:24', posicao: 2, horario: '16:52' },
  { id: 14, beneficiary: 'Juliana Castro', canal: 'Portal', fila: 'Dúvidas Administrativas', origem: 'BOT', espera: '3:07', posicao: 9, horario: '17:30' },
]

// Taxa de abandono (alinha com o card "Chamadas na fila" da Início).
export const abandonosResumo = {
  taxa: '6,4%',
  meta: '5%',
}
