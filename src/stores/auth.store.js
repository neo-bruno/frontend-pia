import { defineStore } from "pinia";
import { login } from "@/services/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,

    usuario: JSON.parse(localStorage.getItem("user") || "null"),

    loading: false,
  }),

  getters: {
    // =========================
    // AUTENTICACIÓN
    // =========================

    estaAutenticado: (state) => !!state.token,

    // =========================
    // USUARIO
    // =========================

    rol: (state) => state.usuario?.rol || null,

    nombre: (state) => state.usuario?.nombre || null,

    telefono: (state) => state.usuario?.telefono || null,

    // =========================
    // PROFESIONAL
    // =========================

    profesionalId: (state) => state.usuario?.profesional_id || null,

    profesionalEstado: (state) => state.usuario?.profesional_estado || null,

    profesionalEstadoFunciones: (state) =>
      state.usuario?.profesional_estado_funciones || null,

    // =========================
    // NEGOCIO
    // =========================

    negocioId: (state) => state.usuario?.negocio_id || null,

    profesionalNegocioEstado: (state) =>
      state.usuario?.profesional_negocio_estado || null,

    accesoNegocio: (state) => state.usuario?.acceso || null,

    // =========================
    // PERMISOS
    // =========================

    puedeConfigurarNegocio: (state) =>
      state.usuario?.puede_configurar_negocio === true,
  },

  actions: {
    async login(telefono, password) {
      this.loading = true;

      try {
        const response = await login(telefono, password);

        // 🔥 RESPUESTA REAL DEL BACKEND
        const data = response.data.data;

        this.token = data.token;
        this.usuario = data.usuario;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.usuario));

        return data;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.usuario = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    cargarSesion() {
      this.token = localStorage.getItem("token");

      const usuario = localStorage.getItem("user");

      try {
        this.usuario = usuario ? JSON.parse(usuario) : null;
      } catch (error) {
        this.usuario = null;

        localStorage.removeItem("user");
      }
    },
  },
});
