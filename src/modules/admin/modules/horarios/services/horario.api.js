import { http } from '@/services/api'

export function saveBusinessHours(data){
  return http().post('/horarios', data)
}
export function getBusinessHours(){
  return http().get('/horarios')
}