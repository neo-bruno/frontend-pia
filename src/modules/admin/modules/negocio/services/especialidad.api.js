import { http } from "@/services/api";

const BASE_URL = "/especialidad";

export function listarEspecialidades() {
	return http().get(BASE_URL);
}

export function crearEspecialidad(datos) {
	return http().post(BASE_URL, datos);
}

export function actualizarEspecialidad(id, datos) {
	return http().put(`${BASE_URL}/${id}`, datos);
}

export function cambiarEstadoEspecialidad(id, estado) {
	return http().patch(`${BASE_URL}/${id}/estado`, { estado });
}

export function eliminarEspecialidad(id) {
	return http().delete(`${BASE_URL}/${id}`);
}
