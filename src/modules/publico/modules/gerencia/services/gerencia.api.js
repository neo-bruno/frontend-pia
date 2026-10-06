import { http } from '@/services/api'

export function getManagement() {
  return http().get('/gerencia')
}