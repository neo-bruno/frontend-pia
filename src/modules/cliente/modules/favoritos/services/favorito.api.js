import { http } from "@/services/api";

// ============================================================
// OBTENER FAVORITOS DEL CLIENTE
// ============================================================

export function getFavoritos() {
  const token = localStorage.getItem("cliente_token");

  return http().get("/favoritos", {
    headers: {
      "x-cliente-token": token,
    },
  });
}

// ============================================================
// AGREGAR FAVORITO
// ============================================================

export function agregarFavorito(tipo, id) {
  const token = localStorage.getItem("cliente_token");

  return http().post(
    "/favoritos",
    {
      tipo,
      id,
    },
    {
      headers: {
        "x-cliente-token": token,
      },
    },
  );
}

// ============================================================
// ELIMINAR FAVORITO
// ============================================================

export function eliminarFavorito(tipo, id) {
  const token = localStorage.getItem("cliente_token");

  return http().delete(`/favoritos/${tipo}/${id}`, {
    headers: {
      "x-cliente-token": token,
    },
  });
}

// ============================================================
// CONSULTAR SI ES FAVORITO
// ============================================================

export function getEstadoFavorito(tipo, id) {
  const token = localStorage.getItem("cliente_token");

  return http().get(`/favoritos/${tipo}/${id}`, {
    headers: {
      "x-cliente-token": token,
    },
  });
}
