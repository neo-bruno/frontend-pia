import { http } from "@/services/api";

export function findClientByPhone(telefono) {
  return http().get(`/cliente/${telefono}`);
}

export function loginRegisterClient(data) {
  return http().post("/cliente/login/register", data);
}

export function getClientePerfil() {
  const token = localStorage.getItem("cliente_token");

  return http().get("/cliente/perfil", {
    headers: {
      "x-cliente-token": token,
    },
  });
}

export function actualizarPerfilCliente(data) {
  const token = localStorage.getItem("cliente_token");

  return http().put("/cliente/perfil", data, {
    headers: {
      "x-cliente-token": token,
    },
  });
}
