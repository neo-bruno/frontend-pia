import { http, httpFiles } from "@/services/api";

// ============================================================
// NEGOCIO
// ============================================================

// Obtener los datos del negocio del administrador autenticado
export function obtenerDatosNegocio() {
	return http().get("/negocio-admin/mi-negocio");
}

// ============================================================
// ACTUALIZAR DATOS DEL NEGOCIO
// ============================================================

export function actualizarDatosNegocio(datos) {
	return http().put("/negocio-admin/mi-negocio", datos);
}

// ============================================================
// TIPOS DE NEGOCIO
// ============================================================

export function getTiposNegocio() {
	return http().get("/negocio-admin/tipos");
}

// Actualizar presentación de la página pública
export function actualizarPaginaNegocio(datos) {
	return http().put("/negocio-admin/mi-negocio/pagina", datos);
}

// ============================================================
// ACTUALIZAR PORTADA Y LOGO
// ============================================================

export function subirImagenesNegocio({ portada, logo }) {
	const formData = new FormData();

	if (portada) {
		formData.append("portada", portada);
	}

	if (logo) {
		formData.append("logo", logo);
	}

	return httpFiles().patch("/negocio-admin/mi-negocio/imagenes", formData);
}

export function getEstadoHorarioNegocio() {
	return http().get("/negocio-admin/mi-negocio/estado-horario");
}

// Generar nuevo código de invitación del negocio
export function generarNuevoCodigoNegocio() {
	return http().post("/negocio-admin/mi-negocio/codigo");
}
