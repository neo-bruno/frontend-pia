import { http } from '@/services/api'

export function getProfessionalBusiness(){
  return http().get('/profesional-negocio')
}