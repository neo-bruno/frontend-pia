import { http } from "@/services/api";

// =====================================================
// NEGOCIOS PÚBLICOS DE PIA
// =====================================================
export function getNegocios(params = {}) {
	return http().get("/pia-publico/negocios", { params });
}

// =====================================================
// SERVICIOS PÚBLICOS DE PIA
// =====================================================
export function getServicios(params = {}) {
	return http().get("/pia-publico/servicios", { params });
}

/**
 * Servicios con descuentos públicos vigentes para el banner.
 */
export function getServiciosConDescuentoPublico() {
	return http().get("/pia-publico/servicios/descuentos");
}

export function buscarNegociosPublicos(params = {}) {
	return http().get("/pia-publico/busqueda/negocios", { params });
}

export function buscarServiciosPublicos(params = {}) {
	return http().get("/pia-publico/busqueda/servicios", { params });
}
