// src/modules/cliente/modules/pagos/services/pagoCliente.api.js

import { http } from "@/services/api";

export function getPagosCliente() {
  const token = localStorage.getItem("cliente_token");

  return http().get("/pago-cliente", {
    headers: {
      "x-cliente-token": token,
    },
  });
}

export function getPagoClienteById(id) {
  const token = localStorage.getItem("cliente_token");

  return http().get(`/pago-cliente/${id}`, {
    headers: {
      "x-cliente-token": token,
    },
  });
}
