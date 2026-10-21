import { http } from "@/services/api";

/**
 * Obtener el historial del profesional autenticado.
 *
 * Filtros opcionales:
 * - fechaDesde
 * - fechaHasta
 * - estado
 * - negocioId
 * - busqueda
 * - pagina
 * - limite
 */
export function getHistorial(params = {}) {
	return http().get("/historial/profesional", {
		params,
	});
}

/**
 * Obtener el detalle de un registro de historial.
 *
 * Este método se implementará cuando agreguemos
 * el endpoint de detalle en el backend.
 */
