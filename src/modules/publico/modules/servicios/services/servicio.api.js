import { http } from '@/services/api'

export function getServicesById(servicioId){
  return http().get(`/servicio-publico/${servicioId}`)
}

export function getServicesByProfessionalId(profesionalId){
  return http().get(`/servicio-publico/profesional/${profesionalId}`)
}