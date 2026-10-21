<template>
<v-dialog v-model="abierto" max-width="430" persistent>
  <v-card class="estado-dialog">

    <!-- ==========================================
           CABECERA
      =========================================== -->

    <div class="estado-header">

      <div>
        <div class="estado-titulo">
          Cambiar estado
        </div>

        <div class="estado-subtitulo">
          Selecciona el estado del comprobante
        </div>
      </div>

      <v-btn icon variant="text" size="small" @click="cerrar">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>

    </div>

    <!-- ==========================================
           ESTADOS
      =========================================== -->

    <div class="estados-contenedor">

      <!-- ========================================
             ACEPTADO
        ========================================= -->

      <button type="button" class="estado-opcion estado-aceptado" :class="{
            'estado-seleccionado': estadoSeleccionado === 'ACEPTADO'
          }" @click="seleccionarEstado('ACEPTADO')">

        <div class="estado-icono">

          <v-icon>
            mdi-check
          </v-icon>

        </div>

        <div class="estado-info">

          <div class="estado-nombre">
            ACEPTADO
          </div>

          <div class="estado-descripcion">
            El comprobante de pago es válido
          </div>

        </div>

        <div class="estado-radio">

          <v-icon v-if="estadoSeleccionado === 'ACEPTADO'">
            mdi-check-circle
          </v-icon>

          <v-icon v-else>
            mdi-circle-outline
          </v-icon>

        </div>

      </button>

      <!-- ========================================
             RECHAZADO
        ========================================= -->

      <button type="button" class="estado-opcion estado-rechazado" :class="{
            'estado-seleccionado': estadoSeleccionado === 'RECHAZADO'
          }" @click="seleccionarEstado('RECHAZADO')">

        <div class="estado-icono">

          <v-icon>
            mdi-close
          </v-icon>

        </div>

        <div class="estado-info">

          <div class="estado-nombre">
            RECHAZADO
          </div>

          <div class="estado-descripcion">
            El comprobante de pago no es válido
          </div>

        </div>

        <div class="estado-radio">

          <v-icon v-if="estadoSeleccionado === 'RECHAZADO'">
            mdi-check-circle
          </v-icon>

          <v-icon v-else>
            mdi-circle-outline
          </v-icon>

        </div>

      </button>

    </div>

    <!-- ==========================================
           OBSERVACIÓN
      =========================================== -->

    <div v-if="estadoSeleccionado === 'RECHAZADO'" class="observacion-contenedor">

      <div class="observacion-label">
        Observación
      </div>

      <v-textarea v-model="observacion" placeholder="Ej. El monto del comprobante no coincide..." variant="outlined" rows="3" auto-grow hide-details class="observacion-input" />

    </div>

    <!-- ==========================================
           FOOTER
      =========================================== -->

    <div class="estado-footer">

      <v-btn block height="54" class="btn-guardar" :disabled="!estadoSeleccionado || guardando" :loading="guardando" @click="guardar">

        <v-icon class="mr-2">
          mdi-check
        </v-icon>

        Guardar cambio

      </v-btn>

    </div>

  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: "EstadoComprobanteAdmin",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    comprobante: {
      type: Object,
      default: null,
    },
  },

  emits: [
    "update:modelValue",
    "guardar",
  ],

  data() {
    return {
      estadoSeleccionado: null,
      observacion: "",
      guardando: false,
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
  },

  watch: {
    modelValue(valor) {
      if (valor) {
        // ==================================================
        // EL ESTADO REAL DEL COMPROBANTE VIENE DE LA RESERVA
        // ==================================================

        this.estadoSeleccionado =
          this.comprobante?.comprobante_estado || null;

        // ==================================================
        // OBSERVACIÓN DEL COMPROBANTE
        // ==================================================

        this.observacion =
          this.comprobante?.comprobante_observacion || "";
      }
    },
  },

  methods: {
    seleccionarEstado(estado) {
      this.estadoSeleccionado = estado;

      // Si vuelve a ACEPTADO,
      // eliminamos cualquier observación anterior.
      if (estado === "ACEPTADO") {
        this.observacion = "";
      }
    },

    cerrar() {
      this.abierto = false;
    },

    async guardar() {
      if (!this.estadoSeleccionado) {
        return;
      }

      // RECHAZADO requiere observación
      if (
        this.estadoSeleccionado === "RECHAZADO" &&
        !this.observacion.trim()
      ) {
        return;
      }

      this.guardando = true;

      try {
        this.$emit("guardar", {
          estado: this.estadoSeleccionado,
          observacion:
            this.observacion.trim() || null,
        });
      } finally {
        this.guardando = false;
      }
    },
  },
};
</script>

<style scoped>
/* ==========================================
   DIALOG
========================================== */

.estado-dialog {
  border-radius: 24px !important;
  overflow: hidden;
}

/* ==========================================
   CABECERA
========================================== */

.estado-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 20px 20px 14px;
}

.estado-titulo {
  color: #12345b;
  font-size: 20px;
  font-weight: 800;
}

.estado-subtitulo {
  color: #8a9aad;
  font-size: 14px;
  margin-top: 4px;
}

/* ==========================================
   ESTADOS
========================================== */

.estados-contenedor {
  padding: 4px 16px 0;
}

.estado-opcion {
  width: 100%;

  display: flex;
  align-items: center;

  margin-bottom: 10px;
  padding: 13px 12px;

  border: 1px solid transparent;
  border-radius: 14px;

  text-align: left;

  cursor: pointer;
  font-family: inherit;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

/* ==========================================
   ACEPTADO
========================================== */

.estado-aceptado {
  background: #edf9f4;
}

.estado-aceptado .estado-icono {
  background: #0f9f76;
  color: white;
}

.estado-aceptado .estado-nombre {
  color: #07804f;
}

.estado-aceptado .estado-radio {
  color: #0f9f76;
}

/* ==========================================
   RECHAZADO
========================================== */

.estado-rechazado {
  background: #fff0f2;
}

.estado-rechazado .estado-icono {
  background: #e84b5b;
  color: white;
}

.estado-rechazado .estado-nombre {
  color: #d93648;
}

.estado-rechazado .estado-radio {
  color: #e84b5b;
}

/* ==========================================
   SELECCIONADO
========================================== */

.estado-aceptado.estado-seleccionado {
  border-color: #0f9f76;
}

.estado-rechazado.estado-seleccionado {
  border-color: #e84b5b;
}

/* ==========================================
   ICONO
========================================== */

.estado-icono {
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 11px;

  border-radius: 50%;
}

.estado-icono .v-icon {
  font-size: 22px;
}

/* ==========================================
   INFORMACIÓN
========================================== */

.estado-info {
  flex: 1;
  min-width: 0;
}

.estado-nombre {
  font-size: 16px;
  font-weight: 800;
}

.estado-descripcion {
  margin-top: 2px;

  color: #61748a;
  font-size: 13px;
  line-height: 1.25;
}

/* ==========================================
   RADIO
========================================== */

.estado-radio {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: 8px;
}

.estado-radio .v-icon {
  font-size: 23px;
}

/* ==========================================
   OBSERVACIÓN
========================================== */

.observacion-contenedor {
  padding: 4px 16px 0;
}

.observacion-label {
  color: #12345b;
  font-size: 14px;
  font-weight: 700;

  margin-bottom: 7px;
}

.observacion-input :deep(.v-field) {
  border-radius: 12px;
}

.observacion-input :deep(textarea) {
  font-size: 14px;
}

/* ==========================================
   FOOTER
========================================== */

.estado-footer {
  padding: 16px;
}

.btn-guardar {
  border-radius: 12px !important;

  background: #0f9f98 !important;
  color: white !important;

  font-size: 16px;
  font-weight: 800;
}
</style>
