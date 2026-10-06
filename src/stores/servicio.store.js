import { defineStore } from "pinia";

export const useServicioStore = defineStore("servicio", {
  state: () => ({
    servicio: {
      nombre: "",
      descripcion: "",
      duracion: 30,
      precio: null,
    },

    condicion: {
      requiere: false,

      nombre: "",
      descripcion: "",

      requiere_adelanto: false,
      tipo_adelanto: "MONTO",
      monto_adelanto: null,
      porcentaje_adelanto: null,

      permite_reprogramar: false,
      limite_horas_reprogramacion: null,

      permite_cancelar: false,
      limite_horas_cancelacion: null,
    },

    fotos: [],

    videos: [],
  }),

  actions: {
    // ============================================================
    // CARGAR SERVICIO PARA EDITAR
    // ============================================================

    cargarServicioParaEditar(data) {
      const servicio = data?.servicio || {};

      this.servicio = {
        id: servicio.id,
        nombre: servicio.nombre || "",
        descripcion: servicio.descripcion || "",
        duracion: Number(servicio.duracion) || 30,
        precio:
          servicio.precio !== null && servicio.precio !== undefined
            ? Number(servicio.precio)
            : null,
      };

      // ============================================================
      // CONDICIÓN
      // ============================================================

      const condicion = data?.condicion;

      if (condicion) {
        this.condicion = {
          requiere: true,

          nombre: condicion.nombre || "",
          descripcion: condicion.descripcion || "",

          requiere_adelanto: Boolean(condicion.requiere_adelanto),

          tipo_adelanto:
            condicion.porcentaje_adelanto !== null &&
            condicion.porcentaje_adelanto !== undefined
              ? "PORCENTAJE"
              : "MONTO",

          monto_adelanto:
            condicion.monto_adelanto !== null &&
            condicion.monto_adelanto !== undefined
              ? Number(condicion.monto_adelanto)
              : null,

          porcentaje_adelanto:
            condicion.porcentaje_adelanto !== null &&
            condicion.porcentaje_adelanto !== undefined
              ? Number(condicion.porcentaje_adelanto)
              : null,

          permite_reprogramar: Boolean(condicion.permite_reprogramar),

          limite_horas_reprogramacion:
            condicion.limite_horas_reprogramacion !== null &&
            condicion.limite_horas_reprogramacion !== undefined
              ? Number(condicion.limite_horas_reprogramacion)
              : null,

          permite_cancelar: Boolean(condicion.permite_cancelar),

          limite_horas_cancelacion:
            condicion.limite_horas_cancelacion !== null &&
            condicion.limite_horas_cancelacion !== undefined
              ? Number(condicion.limite_horas_cancelacion)
              : null,
        };
      } else {
        this.condicion = {
          requiere: false,

          nombre: "",
          descripcion: "",

          requiere_adelanto: false,
          tipo_adelanto: "MONTO",
          monto_adelanto: null,
          porcentaje_adelanto: null,

          permite_reprogramar: false,
          limite_horas_reprogramacion: null,

          permite_cancelar: false,
          limite_horas_cancelacion: null,
        };
      }

      // ============================================================
      // FOTOS
      // ============================================================

      this.fotos = Array.isArray(data?.fotos) ? [...data.fotos] : [];

      // ============================================================
      // VIDEOS
      // ============================================================

      this.videos = Array.isArray(data?.videos) ? [...data.videos] : [];
    },

    // ============================================================
    // LIMPIAR
    // ============================================================

    limpiar() {
      this.servicio = {
        nombre: "",
        descripcion: "",
        duracion: 30,
        precio: null,
      };

      this.condicion = {
        requiere: false,

        nombre: "",
        descripcion: "",

        requiere_adelanto: false,
        tipo_adelanto: "MONTO",
        monto_adelanto: null,
        porcentaje_adelanto: null,

        permite_reprogramar: false,
        limite_horas_reprogramacion: null,

        permite_cancelar: false,
        limite_horas_cancelacion: null,
      };

      this.fotos = [];
      this.videos = [];
    },
  },
});
