import { http } from "@/services/api";

// ============================================================
// LISTAR DESCUENTOS DISPONIBLES PARA ASIGNAR A UN CLIENTE
// GET /api/descuento-servicio-cliente/disponibles/:clienteId
// Solo descuentos vigentes, activos y de tipo CLIENTE.
// ============================================================

export const getDescuentosDisponiblesParaCliente = (clienteId) => {
	return http().get(`/descuento-servicio-cliente/disponibles/${clienteId}`);
};

// ============================================================
// ASIGNAR UNO O VARIOS DESCUENTOS A UN CLIENTE
// POST /api/descuento-servicio-cliente/asignar/:clienteId
// Envía los IDs de descuento_servicio.
// ============================================================

export const asignarDescuentosCliente = (clienteId, descuentosServicioIds) => {
	return http().post(`/descuento-servicio-cliente/asignar/${clienteId}`, {
		descuento_servicio_ids: descuentosServicioIds,
	});
};

// ============================================================
// RETIRAR ASIGNACIÓN DE DESCUENTO A UN CLIENTE
// DELETE /api/descuento-servicio-cliente/asignacion/:asignacionId
// Conserva el registro histórico y marca la asignación INACTIVO.
// ============================================================

export const retirarAsignacionDescuentoCliente = (asignacionId) => {
	return http().delete(
		`/descuento-servicio-cliente/asignacion/${asignacionId}`,
	);
};
