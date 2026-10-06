import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export function urlQrGerencia(ruta) {
  if (!ruta) return null;

  return `${import.meta.env.VITE_SERVER_URL}${ruta}`;
}

export function getFileUrl(url) {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${import.meta.env.VITE_SERVER_URL}${url}`;
}

export function fechaHoy() {
  return dayjs().format("YYYY-MM-DD");
}

export function formatearFecha(fecha, formato) {
  if (!fecha) return "";

  const resultado = dayjs(fecha).format(formato);

  return resultado
    .split(" ")
    .map(
      (parte) =>
        parte.charAt(0).toUpperCase() + parte.slice(1)
    )
    .join(" ");
}