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

		cantidadReservasNoLeidas: (state) =>
			state.notificaciones.filter(
				(notificacion) =>
					notificacion.estado === "NO_LEIDA" && notificacion.tipo === "RESERVA",
			).length,
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
				this.notificaciones = data;
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

				const index = this.notificaciones.findIndex(
					(item) => Number(item.id) === Number(id),
				);

				if (index !== -1) {
					const estabaNoLeida =
						this.notificaciones[index].estado === "NO_LEIDA";

					this.notificaciones[index] = {
						...this.notificaciones[index],
						...(notificacion || {}),
						estado: "LEIDA",
					};

					// Disminuir solamente si realmente estaba no leída
					if (estabaNoLeida && this.cantidadNoLeidas > 0) {
						this.cantidadNoLeidas--;
					}
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
		// MARCAR NOTIFICACIÓN DE UNA RESERVA COMO LEÍDA
		// ======================================================

		async marcarNotificacionDeReserva(reservaId) {
			if (!reservaId) return null;

			const notificacion = this.notificaciones.find(
				(item) =>
					Number(item.reserva_id) === Number(reservaId) &&
					item.estado === "NO_LEIDA",
			);

			if (!notificacion) {
				return null;
			}

			return await this.marcarComoLeida(notificacion.id);
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
		// RECIBIR NOTIFICACIÓN POR SOCKET.IO
		// ======================================================

		recibirNotificacion(notificacion) {
			if (!notificacion) return;

			// Evitar duplicados
			const existe = this.notificaciones.some(
				(item) => item.id === notificacion.id,
			);

			if (existe) return;

			this.notificaciones.unshift(notificacion);

			if (notificacion.estado === "NO_LEIDA") {
				this.cantidadNoLeidas++;
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

		// ======================================================
		// SINCRONIZAR NOTIFICACIÓN CUANDO SE ATIENDE UNA RESERVA
		// ======================================================

		sincronizarNotificacionReservaLeida(reservaId) {
			if (!reservaId) return;

			const index = this.notificaciones.findIndex(
				(item) =>
					Number(item.reserva_id) === Number(reservaId) &&
					item.estado === "NO_LEIDA",
			);

			// Si no existe una notificación pendiente, no hacemos nada.
			if (index === -1) return;

			// Actualizar el estado local
			this.notificaciones[index] = {
				...this.notificaciones[index],
				estado: "LEIDA",
				fecha_lectura:
					this.notificaciones[index].fecha_lectura || new Date().toISOString(),
			};

			// Actualizar el contador
			this.cantidadNoLeidas = Math.max(0, this.cantidadNoLeidas - 1);
		},
	},
});
