import { http } from "@/services/api";

// ============================================================
// CONDICIONES
// ============================================================

// obtener una condicion
export function getConditionById(id) {
  return http().get(`/condicion/${id}`);
}

// Crear condicion
export function createCondition(data) {
  return http().post("/condicion", data);
}

// modificar condicion
export function updateCondition(id, data) {
  return http().put(`/condicion/${id}`, data);
}
