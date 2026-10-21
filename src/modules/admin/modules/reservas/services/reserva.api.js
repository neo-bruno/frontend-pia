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

// ============================================================
// OBTENER UNA RESERVA
// ============================================================

export function getReservationById(id) {
  return http().get(`/reserva/${id}`);
}

// ============================================================
// CAMBIAR ESTADO DE UNA RESERVA
// ============================================================
export function cambiarEstadoReserva(id, datos) {
  return http().patch(`/reserva/${id}/estado`, datos);
}
