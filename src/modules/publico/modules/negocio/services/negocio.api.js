import { http } from "@/services/api";

export function saveBusinessProfession(data) {
	return http().post("/negocio", data);
}

export function getBusinessBySlug(slug) {
	return http().get(`/negocio/slug/${encodeURIComponent(slug)}`);
}
