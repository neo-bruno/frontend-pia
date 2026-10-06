import { http } from "@/services/api";

// ============================================================
// OBTENER TODAS LAS NOTIFICACIONES
// ============================================================

export function getNotificacionesAdmin() {
  return http().get("/notificacion-admin");
}

// ============================================================
// OBTENER SOLAMENTE LAS NO LEÍDAS
// ============================================================

export function getNotificacionesAdminNoLeidas() {
  return http().get("/notificacion-admin/no-leidas");
}

// ============================================================
// OBTENER UNA NOTIFICACIÓN
// ============================================================

export function getNotificacionAdminById(id) {
  return http().get(`/notificacion-admin/${id}`);
}

// ============================================================
// MARCAR UNA COMO LEÍDA
// ============================================================

export function marcarNotificacionAdminComoLeida(id) {
  return http().patch(`/notificacion-admin/${id}/leer`);
}

// ============================================================
// MARCAR TODAS COMO LEÍDAS
// ============================================================

export function marcarTodasNotificacionesAdminComoLeidas() {
  return http().patch("/notificacion-admin/leer-todas");
}
