import { http } from "@/services/api";

// ============================================================
// RESERVAS
// ============================================================

// Listar reservas por fecha
export function getReservations(fecha = null) {
  const params = {};

  if (fecha) {
    params.fecha = fecha;
  }

  return http().get("/reserva", {
    params,
  });
}
