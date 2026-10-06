import { http } from '@/services/api'

export function updateProfessional(data){
  return http().put('/profesional', data)
}

export function getDataProfessional(){
  return http().get('/profesional')
}