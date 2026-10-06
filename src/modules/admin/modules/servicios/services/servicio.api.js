import { http } from "@/services/api";

// ============================================================
// SERVICIOS
// ============================================================

// Crear servicio
export function saveService(data) {
  return http().post("/servicio", data);
}

// Listar servicios
export function getServices() {
  return http().get("/servicio");
}

// Obtener detalle de un servicio
export function getServiceById(id) {
  return http().get(`/servicio/${id}`);
}

// Editar servicio
export function updateService(id, data) {
  return http().put(`/servicio/${id}`, data);
}

// Habilitar / deshabilitar servicio
export function updateServiceStatus(id, estado) {
  return http().patch(`/servicio/${id}/estado`, {
    estado,
  });
}
