import { http } from '@/services/api'

export function getBusinessTypes() {
  return http().get('/tipo-negocio')
}
export function saveBusinessProfession(data){
  return http().post('/negocio', data)
}