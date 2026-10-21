import { http } from "@/services/api";

// ============================================================
// LISTAR DESCUENTOS
// GET /api/descuento
// filtros opcionales: estado, buscar
// ============================================================

export const getDescuentos = (params = {}) => {
  return http().get("/descuento", { params });
};

// ============================================================
// OBTENER UN DESCUENTO
// GET /api/descuento/:id
// ============================================================

export const getDescuento = (id) => {
  return http().get(`/descuento/${id}`);
};

// ============================================================
// CREAR DESCUENTO
// POST /api/descuento
// ============================================================

export const crearDescuento = (datos) => {
  return http().post("/descuento", datos);
};

// ============================================================
// ACTUALIZAR DESCUENTO
// PUT /api/descuento/:id
// ============================================================

export const actualizarDescuento = (id, datos) => {
  return http().put(`/descuento/${id}`, datos);
};

// ============================================================
// ACTIVAR / DESACTIVAR DESCUENTO
// PATCH /api/descuento/:id/estado
// ============================================================

export const cambiarEstadoDescuento = (id, estado) => {
  return http().patch(`/descuento/${id}/estado`, { estado });
};
