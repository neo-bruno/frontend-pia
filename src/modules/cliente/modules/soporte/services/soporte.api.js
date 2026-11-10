import { http } from "@/services/api";

// ============================================================
// TOKEN DEL CLIENTE
// ============================================================

function getClienteHeaders() {
	const token = localStorage.getItem("cliente_token");

	return {
		"x-cliente-token": token,
	};
}

// ============================================================
// AYUDA PUBLICA
// ============================================================

// Obtener categorías de ayuda
export function getSupportCategories() {
	return http().get("/soporte/categorias");
}

// Obtener preguntas frecuentes
export function getSupportQuestions(params = {}) {
	return http().get("/soporte/preguntas", {
		params,
	});
}

// Obtener detalle de una pregunta
export function getSupportQuestionById(id) {
	return http().get(`/soporte/preguntas/${id}`);
}

// ============================================================
// TICKETS DEL CLIENTE
// ============================================================

// Crear una consulta
export function createSupportTicket(datos) {
	return http().post("/soporte/tickets", datos, {
		headers: getClienteHeaders(),
	});
}

// Obtener consultas del cliente
export function getSupportTickets() {
	return http().get("/soporte/tickets", {
		headers: getClienteHeaders(),
	});
}

// Obtener detalle de una consulta
export function getSupportTicketById(id) {
	return http().get(`/soporte/tickets/${id}`, {
		headers: getClienteHeaders(),
	});
}

// ============================================================
// MENSAJES
// ============================================================

// Enviar mensaje en una consulta
export function sendSupportMessage(id, datos) {
	return http().post(`/soporte/tickets/${id}/mensajes`, datos, {
		headers: getClienteHeaders(),
	});
}
