import { http } from '@/services/api'

export function getReservations() {
  return http().get('/reserva-publico')
}
export function getReservationById(id){
  return http().get(`/reserva-publico/${id}`)
}