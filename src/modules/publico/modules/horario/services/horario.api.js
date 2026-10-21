import { http } from "@/services/api";

export function getAvailableSchedule(profesionalId, servicioId, fecha) {
  if (servicioId) {
    return http().get(`/horario-publico/${profesionalId}/${servicioId}`, {
      params: { fecha },
    });
  }

  return http().get(`/horario-publico/${profesionalId}`, {
    params: { fecha },
  });
}
