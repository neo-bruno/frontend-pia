import { http } from "@/services/api";

export function getAgenda(fecha) {
  return http().get("/agenda", {
    params: {
      fecha,
    },
  });
}