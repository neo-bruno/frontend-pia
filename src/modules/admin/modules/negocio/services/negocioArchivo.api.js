import { http, httpFiles } from "@/services/api";

const BASE_URL = "/negocio-archivo";

// Listar fotos y videos del negocio
export function listarArchivosNegocio() {
	return http().get(BASE_URL);
}

export function subirFotosNegocio(fotos) {
	const formData = new FormData();

	for (const foto of fotos) {
		formData.append("fotos", foto);
	}

	return httpFiles().post(`${BASE_URL}/fotos`, formData);
}

export function subirVideosNegocio(videos) {
	const formData = new FormData();

	for (const video of videos) {
		formData.append("videos", video);
	}

	return httpFiles().post(`${BASE_URL}/videos`, formData);
}

// Establecer foto principal
export function establecerFotoPrincipal(id) {
	return http().patch(`${BASE_URL}/${id}/principal`);
}

// Cambiar orden
export function cambiarOrdenArchivoNegocio(id, orden) {
	return http().patch(`${BASE_URL}/${id}/orden`, { orden });
}

// Eliminar archivo de la galería
export function eliminarArchivoNegocio(id) {
	return http().delete(`${BASE_URL}/${id}`);
}
