import { http } from '@/services/api'

export function getVouchers() {
  return http().get('/comprobante')
}

export function validateVoucher(comprobante_id, data){
  return http().put(`/comprobante/${comprobante_id}/validar`, data)
}