import { http } from "@/services/api";

// ============================================================
// LISTAR SERVICIOS DE UN DESCUENTO
// GET /api/descuento-servicio/:descuentoId/servicios
// ============================================================

export const getServiciosPorDescuento = (descuentoId) => {
  return http().get(`/descuento-servicio/${descuentoId}/servicios`);
};

// ============================================================
// GUARDAR SERVICIOS ASOCIADOS A UN DESCUENTO
// PUT /api/descuento-servicio/:descuentoId/servicios
// ============================================================

export const guardarServiciosPorDescuento = (descuentoId, servicios) => {
  return http().put(`/descuento-servicio/${descuentoId}/servicios`, {
    servicios,
  });
};
