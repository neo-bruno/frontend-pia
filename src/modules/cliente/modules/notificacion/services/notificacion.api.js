import { http } from "@/services/api";

// ============================================================
// OBTENER TODAS LAS NOTIFICACIONES DEL CLIENTE
// ============================================================

export function getNotificaciones() {
  const token = localStorage.getItem("cliente_token");

  return http().get("/notificacion", {
    headers: {
      "x-cliente-token": token,
    },
  });
}

// ============================================================
// OBTENER NOTIFICACIONES NO LEÍDAS
// ============================================================

export function getNotificacionesNoLeidas() {
  const token = localStorage.getItem("cliente_token");

  return http().get("/notificacion/no-leidas", {
    headers: {
      "x-cliente-token": token,
    },
  });
}

// ============================================================
// OBTENER UNA NOTIFICACIÓN POR ID
// ============================================================

export function getNotificacionById(id) {
  const token = localStorage.getItem("cliente_token");

  return http().get(`/notificacion/${id}`, {
    headers: {
      "x-cliente-token": token,
    },
  });
}

// ============================================================
// MARCAR UNA NOTIFICACIÓN COMO LEÍDA
// ============================================================

export function marcarNotificacionComoLeida(id) {
  const token = localStorage.getItem("cliente_token");

  return http().patch(
    `/notificacion/${id}/leer`,
    {},
    {
      headers: {
        "x-cliente-token": token,
      },
    },
  );
}

// ============================================================
// MARCAR TODAS LAS NOTIFICACIONES COMO LEÍDAS
// ============================================================

export function marcarTodasComoLeidas() {
  const token = localStorage.getItem("cliente_token");

  return http().patch(
    "/notificacion/leer-todas",
    {},
    {
      headers: {
        "x-cliente-token": token,
      },
    },
  );
}
