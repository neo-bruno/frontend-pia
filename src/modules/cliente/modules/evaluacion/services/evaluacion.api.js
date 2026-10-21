import { http } from "@/services/api";

function obtenerTokenCliente() {
  const token = localStorage.getItem("cliente_token");

  if (!token) {
    throw new Error("No existe token de cliente autenticado.");
  }

  return token;
}

// ============================================================
// OBTENER LOS DATOS EVALUACION
// ============================================================
export function obtenerEvaluacion(evaluacionId) {
  const token = obtenerTokenCliente();

  return http().get(`/evaluacion-publico/${evaluacionId}`, {
    headers: {
      "x-cliente-token": token,
    },
  });
}
