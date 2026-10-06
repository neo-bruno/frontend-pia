import { http } from "@/services/api";

export function getAvailableSchedule(profesionalId, servicioId, fecha) {
  console.log('horario.api.js --> ', profesionalId, servicioId, fecha)
  if (servicioId) {
    return http().get(`/horario-publico/${profesionalId}/${servicioId}`, {
      params: { fecha },
    });
  }
  console.log('entonces  envia el otro')
  return http().get(`/horario-publico/${profesionalId}`, {
    params: { fecha },
  });
}
