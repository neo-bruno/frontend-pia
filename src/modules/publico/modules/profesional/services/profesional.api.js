import { http } from '@/services/api'

export function getProfessionalsTypes(){
  return http().get('/tipo-profesional')
}

export function getProfessionals(){
  return http().get('/profesional-publico/todos')
}

export function getVerificationCode(codigo){
  return http().get(`/profesional-publico/verificar-codigo/${codigo}`)
}

export function getProfessionalBySlug(slug){
  return http().get(`/profesional-publico/buscar/slug/${slug}`)
}

export function saveProfessional(data){
  return http().post('/profesional-publico', data)
}