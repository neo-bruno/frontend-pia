import axios from "axios";
import { url } from "@/utils/config";
import router from "@/router";

function crearInstancia(extraHeaders = {}) {
  const instance = axios.create({
    baseURL: url,
    headers: { ...extraHeaders },
  });

  // 🔐 REQUEST
  instance.interceptors.request.use((config) => {
    const tokenUsuario = localStorage.getItem("token");

    const tokenCliente = localStorage.getItem("cliente_token");

    // Si la petición ya trae Authorization,
    // NO la sobrescribimos.
    if (!config.headers.Authorization) {
      if (tokenUsuario) {
        config.headers.Authorization = `Bearer ${tokenUsuario}`;
      } else if (tokenCliente) {
        config.headers.Authorization = `Bearer ${tokenCliente}`;
      }
    }

    console.log("🔐 API AUTH:", config.headers.Authorization ? config.headers.Authorization.substring(0, 30) + "..." : "SIN Authorization",);

    return config;
  });

  // 🔥 RESPONSE GLOBAL
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const message = err.response?.data?.message || "Error en el servidor";

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/");
      }

      return Promise.reject({
        ...err,
        friendlyMessage: message,
      });
    },
  );

  return instance;
}

// 🌐 JSON REQUESTS
export function http() {
  return crearInstancia();
}

// 📁 FILES
export function httpFiles() {
  return crearInstancia({
    "Content-Type": "multipart/form-data",
  });
}
