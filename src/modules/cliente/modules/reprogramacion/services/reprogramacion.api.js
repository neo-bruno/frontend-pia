import { http } from "@/services/api";

function headersCliente() {
	return {
		"x-cliente-token": localStorage.getItem("cliente_token"),
	};
}

export function getCondicionesReprogramacion(reservaId) {
	return http().get(`/reprogramacion/condiciones/${reservaId}`, {
		headers: headersCliente(),
	});
}

export function getDisponibilidadReprogramacion(reservaId, fecha) {
	return http().get(`/reprogramacion/disponibilidad/${reservaId}`, {
		params: { fecha },
		headers: headersCliente(),
	});
}

export function confirmarReprogramacion(datos) {
	return http().post("/reprogramacion",
		{
			reservaId: datos.reservaId,
			fecha: datos.fecha,
			slots_reserva: datos.slots_reserva,
		},
		{
			headers: headersCliente(),
		},
	);
}
