import { http } from "@/services/api";

// ============================================
// LISTAR EVALUACIONES
// ============================================
export function getEvaluaciones(filtros = {}) {
  return http().get("/evaluacion", {
    params: {
      objetivo: filtros.objetivo || undefined,
      estado: filtros.estado || undefined,
      buscar: filtros.buscar?.trim() || undefined,
    },
  });
}

// ============================================
// OBTENER EVALUACIÓN POR ID
// ============================================
export function getEvaluacionById(id) {
  return http().get(`/evaluacion/${id}`);
}

// ============================================
// CREAR EVALUACIÓN
// ============================================
export function createEvaluacion(tipo_calificacion_id) {
  return http().post("/evaluacion", {
    tipo_calificacion_id,
  });
}

// ============================================
// CAMBIAR ESTADO DE EVALUACIÓN
// ============================================
export function updateEstadoEvaluacion(id, data) {
  return http().patch(`/evaluacion/${id}/estado`, data);
}
