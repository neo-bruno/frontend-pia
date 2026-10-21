<template>
<v-bottom-sheet v-model="abierto" inset scrollable>
  <v-card class="comprobante-sheet">

    <!-- ==========================================
           CABECERA
      =========================================== -->

    <div class="sheet-header">
      <div>
        <div class="sheet-titulo">
          Comprobante de pago
        </div>

        <div class="sheet-subtitulo">
          Si existe para la reserva
        </div>
      </div>

      <v-btn icon variant="text" size="small" @click="cerrar">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- ==========================================
           COMPROBANTE
      =========================================== -->

    <div v-if="reserva?.comprobante_url" class="comprobante-imagen-contenedor" @click="ampliarImagen = true">
      <v-img :src="getFileUrl(reserva.comprobante_url)" class="comprobante-imagen" cover />

      <div class="boton-ampliar">
        <v-icon size="20">
          mdi-fullscreen
        </v-icon>
      </div>
    </div>

    <!-- ==========================================
           SIN COMPROBANTE
      =========================================== -->

    <div v-else class="sin-comprobante">
      <div class="sin-comprobante-icono">
        <v-icon size="30">
          mdi-file-document-outline
        </v-icon>
      </div>

      <div class="sin-comprobante-titulo">
        Sin comprobante
      </div>

      <div class="sin-comprobante-texto">
        Esta reserva todavía no tiene un comprobante de pago registrado.
      </div>
    </div>

    <!-- ==========================================
       ESTADO DEL COMPROBANTE
      =========================================== -->

    <div
      v-if="reserva?.comprobante_id"
      class="comprobante-estado"
      :class="claseEstadoComprobante"
    >

      <div class="comprobante-estado-icono">

        <v-icon>
          {{ iconoEstadoComprobante }}
        </v-icon>

      </div>

      <div>

        <div class="comprobante-estado-titulo">
          {{ tituloEstadoComprobante }}
        </div>

        <div class="comprobante-estado-texto">
          {{ textoEstadoComprobante }}
        </div>

      </div>

    </div>

    <!-- ==========================================
           INFORMACIÓN
      =========================================== -->

    <div v-if="reserva?.pago_id" class="informacion-pago">

      <div class="dato-pago">
        <div class="dato-icono">
          <v-icon>mdi-calendar</v-icon>
        </div>

        <div class="dato-label">
          Fecha de pago
        </div>

        <div class="dato-valor">
          {{ fechaPago }}
        </div>
      </div>

      <div class="dato-pago">
        <div class="dato-icono">
          <v-icon>mdi-cash</v-icon>
        </div>

        <div class="dato-label">
          Monto
        </div>

        <div class="dato-valor">
          Bs. {{ formatearMonto(reserva.pago_monto) }}
        </div>
      </div>

      <div v-if="reserva.pago_numero" class="dato-pago">
        <div class="dato-icono">
          <v-icon>mdi-receipt-text-outline</v-icon>
        </div>

        <div class="dato-label">
          N° operación
        </div>

        <div class="dato-valor">
          {{ reserva.pago_numero }}
        </div>
      </div>

    </div>

    <!-- ==========================================
           CAMBIAR ESTADO
      =========================================== -->

    <div class="sheet-footer">

      <v-btn block height="56" class="btn-cambiar-estado" @click="cambiarEstado">
        <v-icon class="mr-2">
          mdi-swap-horizontal
        </v-icon>

        Cambiar estado
      </v-btn>

    </div>

  </v-card>

  <!-- ==========================================
         VISOR DE IMAGEN
    =========================================== -->

  <v-dialog v-model="ampliarImagen" fullscreen>
    <v-card class="visor-comprobante">

      <v-btn icon variant="text" color="white" class="visor-cerrar" @click="ampliarImagen = false">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>

      <v-img v-if="reserva?.comprobante_url" :src="getFileUrl(reserva.comprobante_url)" contain class="imagen-fullscreen" />

    </v-card>
  </v-dialog>

</v-bottom-sheet>
</template>

<script>
import { getFileUrl } from '@/utils/ayuda';

export default {
  name: "ComprobantePagoAdmin",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    reserva: {
      type: Object,
      default: null,
    },
  },

  emits: [
    "update:modelValue",
    "cambiar-estado",
  ],

  data() {
    return {
      ampliarImagen: false,
    };
  },

  computed: {
    abierto: {
      get() {
        return this.modelValue;
      },

      set(valor) {
        this.$emit("update:modelValue", valor);
      },
    },

    fechaPago() {
      if (!this.reserva?.created_at) {
        return "--";
      }

      const fecha = new Date(this.reserva.created_at);

      return fecha.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    claseEstadoComprobante() {
      const estado = this.reserva?.comprobante_estado;

      if (estado === "ACEPTADO") {
        return "estado-aceptado";
      }

      if (estado === "RECHAZADO") {
        return "estado-rechazado";
      }

      return "estado-pendiente";
    },

    iconoEstadoComprobante() {
      const estado = this.reserva?.comprobante_estado;

      if (estado === "ACEPTADO") {
        return "mdi-check";
      }

      if (estado === "RECHAZADO") {
        return "mdi-close";
      }

      return "mdi-clock-outline";
    },

    tituloEstadoComprobante() {
      const estado = this.reserva?.comprobante_estado;

      if (estado === "ACEPTADO") {
        return "Comprobante aceptado";
      }

      if (estado === "RECHAZADO") {
        return "Comprobante rechazado";
      }

      return "Comprobante pendiente de revisión";
    },

    textoEstadoComprobante() {
      const estado = this.reserva?.comprobante_estado;

      if (estado === "ACEPTADO") {
        return "El comprobante de pago fue validado correctamente.";
      }

      if (estado === "RECHAZADO") {
        return "El comprobante de pago fue rechazado.";
      }

      return "El comprobante todavía está pendiente de validación.";
    },
  },

  methods: {
    getFileUrl,

    cerrar() {
      this.abierto = false;
    },

    cambiarEstado() {
      this.$emit("cambiar-estado", this.reserva);
    },

    formatearMonto(monto) {
      return Number(monto || 0).toFixed(2);
    },
  },
};
</script>

<style scoped>
.comprobante-sheet {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 24px 24px 0 0 !important;
  overflow: hidden;
}

/* ==========================================
   CABECERA
========================================== */

.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 14px;
}

.sheet-titulo {
  color: #12345b;
  font-size: 20px;
  font-weight: 800;
}

.sheet-subtitulo {
  color: #8a9aad;
  font-size: 14px;
  margin-top: 3px;
}

/* ==========================================
   IMAGEN
========================================== */

.comprobante-imagen-contenedor {
  position: relative;
  margin: 0 16px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: #f3f5f7;
}

.comprobante-imagen {
  width: 100%;
  min-height: 300px;
}

.boton-ampliar {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: rgba(18, 52, 91, 0.85);
  color: white;
}

/* ==========================================
   SIN COMPROBANTE
========================================== */

.sin-comprobante {
  margin: 0 16px;
  padding: 35px 20px;

  text-align: center;

  background: #f7f9fa;
  border-radius: 16px;
}

.sin-comprobante-icono {
  width: 60px;
  height: 60px;

  margin: 0 auto 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eaf7f6;
  color: #0f8f8c;
}

.sin-comprobante-titulo {
  color: #12345b;
  font-size: 17px;
  font-weight: 800;
}

.sin-comprobante-texto {
  margin-top: 5px;

  color: #8a9aad;
  font-size: 13px;
}

/* ==========================================
   COMPROBANTE VÁLIDO
========================================== */
/* ==========================================
   ESTADO DEL COMPROBANTE
========================================== */

.comprobante-estado {
  display: flex;
  align-items: center;

  margin: 12px 16px 0;
  padding: 12px;

  border-radius: 12px;
}

.comprobante-estado-icono {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 10px;

  border-radius: 50%;

  color: white;
}

.comprobante-estado-titulo {
  font-size: 16px;
  font-weight: 800;
}

.comprobante-estado-texto {
  font-size: 13px;
  line-height: 1.3;
}

/* ==========================================
   PENDIENTE
========================================== */

.estado-pendiente {
  background: #fff8e6;
}

.estado-pendiente .comprobante-estado-icono {
  background: #e3a008;
}

.estado-pendiente .comprobante-estado-titulo {
  color: #a06813;
}

.estado-pendiente .comprobante-estado-texto {
  color: #80652d;
}

/* ==========================================
   ACEPTADO
========================================== */

.estado-aceptado {
  background: #e3f8ef;
}

.estado-aceptado .comprobante-estado-icono {
  background: #0f9d76;
}

.estado-aceptado .comprobante-estado-titulo {
  color: #07804f;
}

.estado-aceptado .comprobante-estado-texto {
  color: #39745f;
}

/* ==========================================
   RECHAZADO
========================================== */

.estado-rechazado {
  background: #fde8e8;
}

.estado-rechazado .comprobante-estado-icono {
  background: #dc4c5c;
}

.estado-rechazado .comprobante-estado-titulo {
  color: #c5303f;
}

.estado-rechazado .comprobante-estado-texto {
  color: #85434a;
}

/* ==========================================
   DATOS DEL PAGO
========================================== */

.informacion-pago {
  margin: 10px 16px 0;
}

.dato-pago {
  display: flex;
  align-items: center;

  min-height: 46px;

  border-bottom: 1px solid #edf1f4;
}

.dato-icono {
  width: 32px;
  color: #12345b;
}

.dato-label {
  flex: 1;

  color: #50647a;
  font-size: 14px;
}

.dato-valor {
  color: #12345b;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}

/* ==========================================
   FOOTER
========================================== */

.sheet-footer {
  padding: 16px;
}

.btn-cambiar-estado {
  border-radius: 12px !important;

  background: #0f9f98 !important;
  color: white !important;

  font-size: 16px;
  font-weight: 800;
}

/* ==========================================
   VISOR
========================================== */

.visor-comprobante {
  background: #000;
}

.visor-cerrar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.imagen-fullscreen {
  width: 100%;
  height: 100%;
}
</style>
