import { http } from '@/services/api'

export function getSlots(){
  return http().get('/slot')
}

export function saveSlot(data){   
  return http().post('/slot', data)
}