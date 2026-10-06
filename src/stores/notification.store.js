import { defineStore } from "pinia";

import {
  getNotificaciones,
  getNotificacionesNoLeidas,
  getNotificacionById,
  marcarNotificacionComoLeida,
  marcarTodasComoLeidas,
} from "@/modules/cliente/modules/notificacion/services/notificacion.api";

export const useNotificationStore = defineStore("notification", {
  // ============================================================
  // STATE
  // ============================================================

  state: () => ({
    notificaciones: [],
    cantidadNoLeidas: 0,
    cargando: false,
    cargandoNoLeidas: false,
  }),

  // ============================================================
  // GETTERS
  // ============================================================

  getters: {
    tieneNotificacionesNoLeidas: (state) => state.cantidadNoLeidas > 0,

    notificacionesNoLeidas: (state) =>
      state.notificaciones.filter(
        (notificacion) => notificacion.estado === "NO_LEIDA",
      ),
  },

  // ============================================================
  // ACTIONS
  // ============================================================

  actions: {
    // ==========================================================
    // OBTENER TODAS LAS NOTIFICACIONES
    // ==========================================================

    async cargarNotificaciones() {
      this.cargando = true;

      try {
        const respuesta = await getNotificaciones();

        this.notificaciones = respuesta.data?.data || [];

        // Actualizamos también la cantidad
        // por si la respuesta trae el estado actual.
        this.cantidadNoLeidas = this.notificaciones.filter(
          (notificacion) => notificacion.estado === "NO_LEIDA",
        ).length;

        return this.notificaciones;
      } catch (error) {
        console.error("❌ ERROR OBTENIENDO NOTIFICACIONES:", error);

        this.notificaciones = [];
        this.cantidadNoLeidas = 0;

        throw error;
      } finally {
        this.cargando = false;
      }
    },

    // ==========================================================
    // OBTENER CANTIDAD DE NO LEÍDAS
    // ==========================================================

    async cargarNoLeidas() {
      this.cargandoNoLeidas = true;

      try {
        const respuesta = await getNotificacionesNoLeidas();

        const cantidad = respuesta.data?.cantidad;

        // El backend ya nos devuelve cantidad.
        this.cantidadNoLeidas = Number(cantidad) || 0;

        return this.cantidadNoLeidas;
      } catch (error) {
        console.error("❌ ERROR OBTENIENDO NOTIFICACIONES NO LEÍDAS:", error);

        this.cantidadNoLeidas = 0;

        throw error;
      } finally {
        this.cargandoNoLeidas = false;
      }
    },

    // ==========================================================
    // OBTENER UNA NOTIFICACIÓN
    // ==========================================================

    async obtenerNotificacion(id) {
      try {
        const respuesta = await getNotificacionById(id);

        return respuesta.data?.data || null;
      } catch (error) {
        console.error("❌ ERROR OBTENIENDO NOTIFICACIÓN:", error);

        throw error;
      }
    },

    // ==========================================================
    // MARCAR UNA COMO LEÍDA
    // ==========================================================

    async marcarComoLeida(id) {
      try {
        const respuesta = await marcarNotificacionComoLeida(id);

        const notificacion = respuesta.data?.data;

        // ------------------------------------------------------
        // Actualizar la notificación dentro del array
        // ------------------------------------------------------

        const index = this.notificaciones.findIndex((item) => item.id === id);

        if (index !== -1) {
          this.notificaciones[index] = {
            ...this.notificaciones[index],
            ...(notificacion || {}),
            estado: "LEIDA",
          };
        }

        // ------------------------------------------------------
        // Actualizar contador inmediatamente
        // ------------------------------------------------------

        if (this.cantidadNoLeidas > 0) {
          this.cantidadNoLeidas--;
        }

        // Seguridad:
        // nunca permitimos que sea negativo.
        if (this.cantidadNoLeidas < 0) {
          this.cantidadNoLeidas = 0;
        }

        return notificacion;
      } catch (error) {
        console.error("❌ ERROR MARCANDO NOTIFICACIÓN COMO LEÍDA:", error);

        throw error;
      }
    },

    // ==========================================================
    // MARCAR TODAS COMO LEÍDAS
    // ==========================================================

    async marcarTodasComoLeidas() {
      try {
        const respuesta = await marcarTodasComoLeidas();

        // Todas pasan a LEIDA
        this.notificaciones = this.notificaciones.map((notificacion) => ({
          ...notificacion,
          estado: "LEIDA",
          fecha_lectura: notificacion.fecha_lectura || new Date().toISOString(),
        }));

        // El contador pasa inmediatamente a cero
        this.cantidadNoLeidas = 0;

        return respuesta.data?.data || [];
      } catch (error) {
        console.error("❌ ERROR MARCANDO TODAS COMO LEÍDAS:", error);

        throw error;
      }
    },

    // ==========================================================
    // REINICIAR STORE
    // ==========================================================

    limpiar() {
      this.notificaciones = [];
      this.cantidadNoLeidas = 0;
      this.cargando = false;
      this.cargandoNoLeidas = false;
    },
  },
});
