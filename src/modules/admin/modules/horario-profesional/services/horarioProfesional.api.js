import { http } from '@/services/api'

export function saveProfessionalHours(data){
  return http().post('/horario-profesional', data)
}

export function getProfessionalHours(){
  return http().get('/horario-profesional')
}