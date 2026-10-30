import { http } from "@/services/api";

export function getBusinessTypes() {
	return http().get("/tipo-negocio");
}
