import { http } from "@/services/api";

// ============================================
// LISTAR TIPOS DE CALIFICACIÓN
// ============================================
export function getTiposCalificacion(filtros = {}) {
  return http().get("/tipo-calificacion", {
    params: {
      objetivo: filtros.objetivo || undefined,
      estado: filtros.estado || undefined,
      buscar: filtros.buscar?.trim() || undefined,
    },
  });
}

// ============================================
// OBTENER TIPO DE CALIFICACIÓN POR ID
// ============================================
export function getTipoCalificacionById(id) {
  return http().get(`/tipo-calificacion/${id}`);
}

// ============================================
// CREAR TIPO DE CALIFICACIÓN
// ============================================
export function createTipoCalificacion(data) {
  return http().post("/tipo-calificacion", data);
}

// ============================================
// ACTUALIZAR TIPO DE CALIFICACIÓN
// ============================================
export function updateTipoCalificacion(id, data) {
  return http().put(`/tipo-calificacion/${id}`, data);
}

// ============================================
// CAMBIAR ESTADO
// ============================================
export function updateEstadoTipoCalificacion(id, data) {
  return http().patch(`/tipo-calificacion/${id}/estado`, data);
}
