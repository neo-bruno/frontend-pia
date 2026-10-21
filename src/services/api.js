import axios from "axios";
import { url } from "@/utils/config";
import router from "@/router";

function crearInstancia(extraHeaders = {}) {
  const instance = axios.create({
    baseURL: url,
    headers: { ...extraHeaders },
  });

  // ============================================================
  // DETERMINAR SI LA PETICIÓN ES DEL CLIENTE
  // ============================================================

  function esPeticionCliente(config) {
    const headers = config?.headers;

    if (!headers) return false;

    // AxiosHeaders
    if (typeof headers.get === "function") {
      const tokenCliente =
        headers.get("x-cliente-token") || headers.get("X-Cliente-Token");

      if (tokenCliente) {
        return true;
      }
    }

    // Objeto normal
    return !!(headers["x-cliente-token"] || headers["X-Cliente-Token"]);
  }

  // ============================================================
  // REQUEST
  // ============================================================

  instance.interceptors.request.use((config) => {
    const tokenUsuario = localStorage.getItem("token");
    const tokenCliente = localStorage.getItem("cliente_token");

    const peticionCliente = esPeticionCliente(config);

    // ============================================================
    // PETICIÓN DEL CLIENTE
    // ============================================================

    if (peticionCliente) {
      console.log("👤 API CLIENTE: x-cliente-token presente");

      return config;
    }

    // ============================================================
    // PETICIÓN ADMIN
    // ============================================================

    const tieneAuthorization =
      typeof config.headers?.get === "function"
        ? !!(
            config.headers.get("Authorization") ||
            config.headers.get("authorization")
          )
        : !!(config.headers?.Authorization || config.headers?.authorization);

    if (!tieneAuthorization && tokenUsuario) {
      config.headers.Authorization = `Bearer ${tokenUsuario}`;

      console.log("🔐 API AUTH:", `Bearer ${tokenUsuario.substring(0, 25)}...`);
    } else if (!tieneAuthorization) {
      console.log("🔐 API AUTH: SIN Authorization");
    }

    return config;
  });

  // ============================================================
  // RESPONSE
  // ============================================================

  instance.interceptors.response.use(
    (res) => res,

    (err) => {
      const status = err.response?.status;
      const config = err.config || {};

      const peticionCliente = esPeticionCliente(config);

      const message =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "Error en el servidor";

      // ============================================================
      // 401 DEL CLIENTE
      // ============================================================

      if (status === 401 && peticionCliente) {
        console.warn("⚠️ 401 CLIENTE:", message);

        // IMPORTANTE:
        // NO borrar token ADMIN
        // NO borrar token CLIENTE
        // NO redireccionar
        return Promise.reject({
          ...err,
          friendlyMessage: message,
        });
      }

      // ============================================================
      // 401 ADMIN
      // ============================================================

      if (status === 401 && !peticionCliente) {
        console.warn("⚠️ 401 ADMIN:", message);

        // Solo cerrar sesión administrativa
        // si realmente estamos dentro del área admin.
        const rutaActual = router.currentRoute.value?.path || "";

        const estaEnAdmin =
          rutaActual === "/admin" || rutaActual.startsWith("/admin/");

        if (estaEnAdmin) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          router.push("/");
        }
      }

      return Promise.reject({
        ...err,
        friendlyMessage: message,
      });
    },
  );

  return instance;
}

// ============================================================
// JSON
// ============================================================

export function http() {
  return crearInstancia();
}

// ============================================================
// FILES
// ============================================================

export function httpFiles() {
  return crearInstancia();
}
