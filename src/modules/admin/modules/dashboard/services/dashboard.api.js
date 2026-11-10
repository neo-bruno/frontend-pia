import { http } from "@/services/api";

// =====================================================
// OBTENER DASHBOARD POR FECHA
// =====================================================

export function obtenerDashboard(fecha) {
	return http().get("/dashboard", {
		params: { fecha },
	});
}