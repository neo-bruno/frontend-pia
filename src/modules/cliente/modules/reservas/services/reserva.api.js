import { http } from "@/services/api";

export function getReservations() {
	const token = localStorage.getItem("cliente_token");

	return http().get("/reserva-publico", {
		headers: {
			"x-cliente-token": token,
		},
	});
}

export function getReservationHistory() {
	const token = localStorage.getItem("cliente_token");

	return http().get("/reserva-publico/historial", {
		headers: {
			"x-cliente-token": token,
		},
	});
}

export function getReservationById(id) {
	const token = localStorage.getItem("cliente_token");

	return http().get(`/reserva-publico/${id}`, {
		headers: {
			"x-cliente-token": token,
		},
	});
}

export function cancelReservation(id, motivo = "") {
	const token = localStorage.getItem("cliente_token");

	return http().patch(
		`/reserva-publico/${id}/cancelar`,
		{ motivo },
		{
			headers: {
				"x-cliente-token": token,
			},
		},
	);
}
