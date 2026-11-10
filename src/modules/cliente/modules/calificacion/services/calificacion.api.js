import { http } from "@/services/api";

function obtenerTokenCliente() {
	const token = localStorage.getItem("cliente_token");

	if (!token) {
		throw new Error("No existe token de cliente autenticado.");
	}

	return token;
}

// ============================================================
// REGISTRAR CALIFICACIÓN
// ============================================================

export function registrarCalificacion(datos) {
	const token = obtenerTokenCliente();

	return http().post("/calificacion", datos, {
		headers: {
			"x-cliente-token": token,
		},
	});
}

// ============================================================
// OBTENER CALIFICACIONES PENDIENTES
// ============================================================

export function getCalificacionesPendientes() {
	const token = obtenerTokenCliente();

	return http().get("/calificacion/pendientes", {
		headers: {
			"x-cliente-token": token,
		},
	});
}

// ============================================================
// CREAR CALIFICACION
// ============================================================
export function crearCalificacion(datos) {
	const token = obtenerTokenCliente();

	return http().post("/calificacion", datos, {
		headers: {
			"x-cliente-token": token,
		},
	});
}

// ============================================================
// OBTENER CALIFICACIÓN REGISTRADA
// ============================================================

export function obtenerCalificacion(reservaId, evaluacionId) {
	const token = obtenerTokenCliente();

	return http().get(
		`/calificacion/reserva/${reservaId}/evaluacion/${evaluacionId}`,
		{
			headers: {
				"x-cliente-token": token,
			},
		},
	);
}
