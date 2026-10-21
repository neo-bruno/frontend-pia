import { http } from "@/services/api";

export function getMisMembresias() {
	return http().get("/membresia/mis-membresias");
}

export function getQrGerenciaMembresia() {
	return http().get("/membresia/qr-gerencia");
}

/**
 * Envía el comprobante para iniciar la renovación.
 * membresiaId: ID de la membresía que se desea renovar.
 * archivo: archivo seleccionado por el profesional.
 *
 * Ruta real del backend:
 * POST /membresia/:id/comprobante-renovacion
 */
export function enviarComprobanteRenovacion(membresiaId, archivo) {
	if (!membresiaId) {
		throw new Error("El identificador de la membresía es obligatorio.");
	}

	if (!archivo) {
		throw new Error("Debes seleccionar el comprobante de pago.");
	}

	const formData = new FormData();
	formData.append("comprobante", archivo);

	return http().post(
		`/membresia/${membresiaId}/comprobante-renovacion`,
		formData,
	);
}
