import { http } from "@/services/api";

export function confirmReservation(data) {
  const tokenCliente = localStorage.getItem("cliente_token");

  if (!tokenCliente) {
    throw new Error("No existe token de cliente autenticado.");
  }

  console.log("🔐 TOKEN PARA CONFIRMAR RESERVA:", tokenCliente);

  return http().post(`/reserva-publico`, data, {
    headers: {
      Authorization: `Bearer ${tokenCliente}`,
    },
  });
}
