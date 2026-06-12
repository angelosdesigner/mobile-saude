// Fixtures da aba "Performance e Workforce" — Figma 7894:108707.

// Demanda vs capacidade por hora (barras = volume; linha = capacidade).
export const demandaHora = {
  horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h'],
  volume: [8, 12, 16, 20, 22, 18, 24, 32, 28, 22, 18, 16, 12, 10, 8],
  capacidade: 14,
}

// Carga por dia × faixa horária (heatmap, % de ocupação).
export const heatmapSlots = ['08-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22']
export const heatmapDias = [
  { dia: 'Seg', valores: [62, 75, 88, 92, 80, 58, 40] },
  { dia: 'Ter', valores: [68, 80, 90, 95, 82, 60, 42] },
  { dia: 'Qua', valores: [65, 78, 85, 88, 78, 55, 38] },
  { dia: 'Qui', valores: [70, 82, 85, 90, 80, 58, 41] },
  { dia: 'Sex', valores: [72, 85, 92, 98, 85, 62, 45] },
  { dia: 'Sáb', valores: [60, 78, 95, 90, 88, 64, 44] },
  { dia: 'Dom', valores: [40, 52, 60, 58, 50, 38, 28] },
]

export type TurnoStatus = 'atencao' | 'critico' | 'equilibrado'
export interface Turno {
  nome: string
  horario: string
  status: TurnoStatus
  badge: string
  atendentes: number
  cargaMedia: string
  sugestao: string
  detalhe: string
}

export const turnos: Turno[] = [
  {
    nome: 'Manhã',
    horario: '08-12h',
    status: 'atencao',
    badge: '',
    atendentes: 14,
    cargaMedia: '19/h',
    sugestao: 'Sugestão: realocar +3 atendentes de Autorizações',
    detalhe: 'pico às 11h: 26 chamados vs 14 capacidade',
  },
  {
    nome: 'Tarde',
    horario: '12-18h',
    status: 'critico',
    badge: 'CRÍTICO',
    atendentes: 12,
    cargaMedia: '22/h',
    sugestao: 'Sugestão: estender turno manhã até 16h (+5)',
    detalhe: 'pico às 15h: 30 chamados · TME 14min',
  },
  {
    nome: 'Noite',
    horario: '18-22h',
    status: 'equilibrado',
    badge: 'EQUILIBRADO',
    atendentes: 10,
    cargaMedia: '13/h',
    sugestao: 'Disponível: liberar 2 atendentes para reforço',
    detalhe: 'ocupação média 76% · folga para realocar',
  },
]

export const remanejamento = {
  titulo: 'Ação Sugerida de Remanejamento',
  texto: 'Mover 3 atendentes do turno noite para reforço no pico vespertino (14h-17h).',
  impacto: 'Impacto estimado: -28% TME · +12% SLA',
}

// Demanda × TME por hora (dispersão): x = demanda (chamados/h), y = TME (min).
export interface PerfPonto {
  hora: string
  demanda: number
  tme: number
}
export const demandaTme: PerfPonto[] = [
  { hora: '22h', demanda: 8, tme: 3 },
  { hora: '08h', demanda: 12, tme: 4 },
  { hora: '10h', demanda: 16, tme: 5 },
  { hora: '13h', demanda: 18, tme: 6 },
  { hora: '18h', demanda: 18, tme: 7 },
  { hora: '14h', demanda: 24, tme: 9 },
  { hora: '11h', demanda: 26, tme: 11 },
  { hora: '15h', demanda: 32, tme: 14 },
]
export const inflexao = 26

export const bannerPerfWarn = {
  titulo: 'SLA de Reembolso deve estourar em 6h',
  detalhe: 'Velocidade atual: 2.1 tickets/h — necessário 4.2 tickets/h',
}
export const bannerPerfCrit = 'Escalar +2 atendentes para 14h–16h'
export const bannerPerfInfo =
  'Ponto de inflexão em ~26 chamados/hora — acima desse limite o TME estoura o SLA de 8min. Threshold concreto para dimensionar equipe.'
