import { http } from '@/services/api'

export function listarRoles() {
  return http().get('/rol')
}