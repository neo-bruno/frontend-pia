import { http } from "@/services/api";

export function login(telefono, password) {
	return http().post("/auth/login", {
		telefono,
		password,
	});
}

export function cambiarPassword(datos) {
	return http().put("/auth/cambiar-password", datos);
}
