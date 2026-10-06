import { defineStore } from "pinia";

import {
  getNotificacionesAdmin,
  getNotificacionesAdminNoLeidas,
  getNotificacionAdminById,
  marcarNotificacionAdminComoLeida,
  marcarTodasNotificacionesAdminComoLeidas,
} from "@/modules/admin/modules/notificacion-admin/services/notificacionAdmin.api";

export const useNotificationAdminStore = defineStore("notificationAdmin", {
  state: () => ({
    notificaciones: [],
    cantidadNoLeidas: 0,
    cargando: false,
    cargandoNoLeidas: false,
  }),

  getters: {
    tieneNotificacionesNoLeidas: (state) => state.cantidadNoLeidas > 0,

    notificacionesNoLeidas: (state) =>
      state.notificaciones.filter(
        (notificacion) => notificacion.estado === "NO_LEIDA",
      ),
  },

  actions: {
    // ======================================================
    // CARGAR TODAS
    // ======================================================

    async cargarNotificaciones() {
      this.cargando = true;

      try {
        const respuesta = await getNotificacionesAdmin();

        this.notificaciones = respuesta.data?.data || [];

        this.cantidadNoLeidas = this.notificaciones.filter(
          (notificacion) => notificacion.estado === "NO_LEIDA",
        ).length;

        return this.notificaciones;
      } catch (error) {
        console.error("❌ ERROR OBTENIENDO NOTIFICACIONES ADMIN:", error);

        this.notificaciones = [];
        this.cantidadNoLeidas = 0;

        throw error;
      } finally {
        this.cargando = false;
      }
    },

    // ======================================================
    // CARGAR NO LEÍDAS
    // ======================================================

    async cargarNoLeidas() {
      this.cargandoNoLeidas = true;

      try {
        const respuesta = await getNotificacionesAdminNoLeidas();

        const data = respuesta.data?.data || [];

        const cantidad = respuesta.data?.cantidad;

        this.cantidadNoLeidas = Number(cantidad) || 0;

        return data;
      } catch (error) {
        console.error(
          "❌ ERROR OBTENIENDO NOTIFICACIONES ADMIN NO LEÍDAS:",
          error,
        );

        this.cantidadNoLeidas = 0;

        throw error;
      } finally {
        this.cargandoNoLeidas = false;
      }
    },

    // ======================================================
    // OBTENER UNA
    // ======================================================

    async obtenerNotificacion(id) {
      try {
        const respuesta = await getNotificacionAdminById(id);

        return respuesta.data?.data || null;
      } catch (error) {
        console.error("❌ ERROR OBTENIENDO NOTIFICACIÓN ADMIN:", error);

        throw error;
      }
    },

    // ======================================================
    // MARCAR UNA COMO LEÍDA
    // ======================================================

    async marcarComoLeida(id) {
      try {
        const respuesta = await marcarNotificacionAdminComoLeida(id);

        const notificacion = respuesta.data?.data;

        const index = this.notificaciones.findIndex((item) => item.id === id);

        if (index !== -1) {
          this.notificaciones[index] = {
            ...this.notificaciones[index],
            ...(notificacion || {}),
            estado: "LEIDA",
          };
        }

        if (this.cantidadNoLeidas > 0) {
          this.cantidadNoLeidas--;
        }

        if (this.cantidadNoLeidas < 0) {
          this.cantidadNoLeidas = 0;
        }

        return notificacion;
      } catch (error) {
        console.error(
          "❌ ERROR MARCANDO NOTIFICACIÓN ADMIN COMO LEÍDA:",
          error,
        );

        throw error;
      }
    },

    // ======================================================
    // MARCAR TODAS COMO LEÍDAS
    // ======================================================

    async marcarTodasComoLeidas() {
      try {
        const respuesta = await marcarTodasNotificacionesAdminComoLeidas();

        this.notificaciones = this.notificaciones.map((notificacion) => ({
          ...notificacion,
          estado: "LEIDA",
          fecha_lectura: notificacion.fecha_lectura || new Date().toISOString(),
        }));

        this.cantidadNoLeidas = 0;

        return respuesta.data;
      } catch (error) {
        console.error(
          "❌ ERROR MARCANDO TODAS LAS NOTIFICACIONES ADMIN:",
          error,
        );

        throw error;
      }
    },

    // ======================================================
    // LIMPIAR
    // ======================================================

    limpiar() {
      this.notificaciones = [];
      this.cantidadNoLeidas = 0;
      this.cargando = false;
      this.cargandoNoLeidas = false;
    },
  },
});
