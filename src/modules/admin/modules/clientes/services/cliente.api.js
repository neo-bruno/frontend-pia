import { http } from "@/services/api";

// =====================================================
// LISTA DE CLIENTES
// =====================================================

export function getClientes(params = {}) {
  return http().get("/cliente-admin", {
    params,
  });
}

// =====================================================
// HISTORIAL DEL CLIENTE
// =====================================================

export function getHistorialCliente(clienteId) {
  return http().get(`/cliente-admin/${clienteId}/historial`);
}

// =====================================================
// SEGMENTACIÓN DEL CLIENTE
// =====================================================

export function getSegmentacionCliente(clienteId) {
  return http().get(`/cliente-admin/${clienteId}/segmentacion`);
}

// =====================================================
// PROMOCIONES ASIGNADAS AL CLIENTE
// =====================================================

export function getPromocionesCliente(clienteId) {
  return http().get(`/cliente-admin/${clienteId}/promociones`);
}

// =====================================================
// DESCUENTOS ASIGNADOS AL CLIENTE
// =====================================================

export function getDescuentosCliente(clienteId) {
  return http().get(`/cliente-admin/${clienteId}/descuentos`);
}
