import { http } from "@/services/api";

// Crear un bloqueo
export function crearBloqueo(datos) {
  return http().post("/bloqueo", datos);
}

// Consultar bloqueos de una fecha
export function getBloqueos(fecha) {
  return http().get("/bloqueo", {
    params: { fecha },
  });
}

// Desbloquear un horario
export function cancelarBloqueo(id) {
  return http().patch(`/bloqueo/${id}/cancelar`);
}
