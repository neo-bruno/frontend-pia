import { http } from "@/services/api";

/**
 * Obtener comprobante por ID
 */
export function getComprobante(id) {
  return http().get(`/comprobante-admin/${id}`);
}

/**
 * Cambiar estado del comprobante
 */
export function cambiarEstadoComprobante(id, datos) {
  return http().patch(`/comprobante-admin/${id}/estado`, datos);
}
