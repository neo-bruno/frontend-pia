import { defineStore } from "pinia";

export const useReservaStore = defineStore("reserva", {
  state: () => ({
    reserva: null,
  }),

  actions: {
    guardarReserva(datos) {
      this.reserva = {
        ...datos,
        slots_reserva: Array.isArray(datos.slots_reserva)
          ? [...datos.slots_reserva]
          : [],
      };

      sessionStorage.setItem(
        "pia_reserva_pendiente",
        JSON.stringify(this.reserva),
      );
    },

    cargarReserva() {
      if (this.reserva) {
        return this.reserva;
      }

      const guardada = sessionStorage.getItem("pia_reserva_pendiente");

      if (!guardada) {
        return null;
      }

      try {
        this.reserva = JSON.parse(guardada);
        return this.reserva;
      } catch (error) {
        console.error("Error al recuperar reserva:", error);

        this.limpiarReserva();

        return null;
      }
    },

    limpiarReserva() {
      this.reserva = null;

      sessionStorage.removeItem("pia_reserva_pendiente");
    },
  },
});
