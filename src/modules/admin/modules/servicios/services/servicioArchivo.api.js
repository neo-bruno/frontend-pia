import { http } from "@/services/api";

export function getFilesByService(servicioId) {
  return http().get(`/servicio-archivo/servicio/${servicioId}`);
}

export function uploadServiceFiles(servicioId, fotos) {
  const formData = new FormData();

  fotos.forEach((foto) => {
    formData.append("fotos", foto);
  });

  return http().post(`/servicio-archivo/servicio/${servicioId}`, formData);
}

// ============================================================
// VIDEOS
// ============================================================

export function uploadServiceVideos(servicioId, videos) {
  const formData = new FormData();

  videos.forEach((video) => {
    formData.append("videos", video);
  });

  return http().post(
    `/servicio-archivo/servicio/${servicioId}/videos`,
    formData,
  );
}

export function deleteServiceFile(archivoId) {
  return http().delete(`/servicio-archivo/${archivoId}`);
}

export function setServiceFilePrincipal(archivoId) {
  return http().patch(`/servicio-archivo/${archivoId}/principal`);
}

export function updateServiceFileOrder(archivoId, orden) {
  return http().patch(`/servicio-archivo/${archivoId}/orden`, { orden });
}
