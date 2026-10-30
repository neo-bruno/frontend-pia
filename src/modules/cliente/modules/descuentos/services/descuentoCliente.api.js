// src/modules/cliente/modules/descuentos/services/descuentoCliente.api.js

import { http } from "@/services/api";

export function getMisDescuentos() {
	const token = localStorage.getItem("cliente_token");

	return http().get("/descuento-cliente/mis-descuentos", {
		headers: {
			"x-cliente-token": token,
		},
	});
}

export function getDescuentosDelProfesional(profesionalId) {
	const token = localStorage.getItem("cliente_token");

	return http().get(`/descuento-cliente/profesional/${profesionalId}`, {
		headers: {
			"x-cliente-token": token,
		},
	});
}

export function verificarDescuentosPorServicio(servicioId) {
	const token = localStorage.getItem("cliente_token");

	return http().get(`/descuento-cliente/servicio/${servicioId}/disponibilidad`,
		{
			headers: {
				"x-cliente-token": token,
			},
		},
	);
}

export function validarCodigoDescuento(codigo, servicioId) {
	const token = localStorage.getItem("cliente_token");

	return http().post("/descuento-cliente/validar-codigo", { codigo, servicio_id: servicioId, },
		{
			headers: {
				"x-cliente-token": token,
			},
		},
	);
}
