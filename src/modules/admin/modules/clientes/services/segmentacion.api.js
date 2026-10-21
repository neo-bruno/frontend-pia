import { http } from "@/services/api";

export function getSegmentacion(params = {}) {
  return http().get("/segmentacion", { params });
}

export function getSegmentacionCliente(clienteId) {
  return http().get(`/segmentacion/cliente/${clienteId}`);
}

export function getHistorialSegmentacionCliente(clienteId) {
  return http().get(`/segmentacion/cliente/${clienteId}/historial`);
}
