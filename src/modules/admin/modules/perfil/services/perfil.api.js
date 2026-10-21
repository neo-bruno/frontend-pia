import { http } from "@/services/api";

export function getPerfil() {
	return http().get("/perfil");
}

export function updatePerfil(datos) {
	// Si ya recibimos FormData, lo enviamos directamente.
	if (datos instanceof FormData) {
		return http().put("/perfil", datos);
	}

	// Compatibilidad si se envía un objeto normal.
	const formulario = new FormData();

	Object.entries(datos || {}).forEach(([clave, valor]) => {
		if (valor !== undefined && valor !== null) {
			formulario.append(clave, valor);
		}
	});

	return http().put("/perfil", formulario);
}
