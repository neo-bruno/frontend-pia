<template>
<v-dialog :model-value="modelValue" width="100%" max-width="600" @update:model-value="$emit('update:modelValue', $event)">
  <v-card class="estado-reserva-dialog">

    <v-btn
      icon
      variant="text"
      size="40"
      class="btn-cerrar"
      @click="cerrar"
    >
      <v-icon>
        mdi-close
      </v-icon>
    </v-btn>

    <!-- HEADER -->

    <div class="dialog-header">

      <div class="header-icon">
        <v-icon size="24">
          mdi-swap-horizontal
        </v-icon>
      </div>

      <div>
        <h2>Cambiar estado</h2>

        <p>
          Selecciona el nuevo estado para esta reserva
        </p>
      </div>

    </div>

    <!-- =====================================================
           ESTADOS
      ====================================================== -->

    <div class="estados-list">

      <div v-for="estado in estados" :key="estado.value" class="estado-option" :class="{
            'estado-selected': estadoActual === estado.value
          }" @click="seleccionarEstado(estado.value)">

        <!-- ICONO -->

        <div class="estado-icon" :class="`icon-${estado.color}`">
          <v-icon size="23">
            {{ estado.icon }}
          </v-icon>
        </div>

        <!-- INFORMACIÓN -->

        <div class="estado-info">

          <div class="estado-titulo" :class="`texto-${estado.color}`">
            {{ estado.label }}
          </div>

          <div class="estado-descripcion">
            {{ estado.descripcion }}
          </div>

        </div>

        <!-- RADIO -->

        <div class="estado-radio" :class="{
              'radio-selected': estadoActual === estado.value
            }">

          <v-icon v-if="estadoActual === estado.value" size="17">
            mdi-check
          </v-icon>

        </div>

      </div>

    </div>

    <!-- =====================================================
           NOTA
      ====================================================== -->

    <div class="nota-section">

      <label>
        Nota <span>(opcional)</span>
      </label>

      <v-textarea v-model="observacion" placeholder="Ej. El cliente llegó puntual..." variant="outlined" rows="2" auto-grow hide-details maxlength="500" />

    </div>

    <!-- =====================================================
           ACCIONES
      ====================================================== -->

    <div class="dialog-actions">

      <v-btn block color="primary" prepend-icon="mdi-check" size="large" class="btn-guardar" :disabled="!estadoActual" :loading="guardando" @click="guardar">
        Guardar cambio
      </v-btn>

    </div>

  </v-card>
</v-dialog>
</template>

<script>
export default {

  name: "EstadoReservaAdmin",

  props: {

    modelValue: {
      type: Boolean,
      default: false,
    },

    estadoInicial: {
      type: String,
      default: null,
    },

    guardando: {
      type: Boolean,
      default: false,
    },

  },

  emits: [
    "update:modelValue",
    "guardar",
  ],

  data() {
    return {

      estadoActual: null,

      observacion: "",

      estados: [
      {
        value: "PENDIENTE",
        label: "PENDIENTE PAGO",
        descripcion: "El cliente debe realizar el pago",
        icon: "mdi-clock-outline",
        color: "gris",
      },

      {
        value: "CONFIRMADA",
        label: "CONFIRMADA",
        descripcion: "Reserva confirmada y lista",
        icon: "mdi-check",
        color: "verde",
      },

      {
        value: "COMPLETADA",
        label: "COMPLETADA",
        descripcion: "Servicio finalizado",
        icon: "mdi-check",
        color: "morado",
      },

      {
        value: "CANCELADA",
        label: "CANCELADA",
        descripcion: "Reserva cancelada por el cliente o negocio",
        icon: "mdi-close",
        color: "rojo",
      },

      {
        value: "NO_ASISTIO",
        label: "NO ASISTIÓ",
        descripcion: "El cliente no se presentó",
        icon: "mdi-account",
        color: "gris-oscuro",
      },
    ],

    };
  },

  watch: {

    modelValue: {
      immediate: true,

      handler(valor) {

        if (valor) {
          this.estadoActual = this.estadoInicial;
          this.observacion = "";
        }

      },
    },

    estadoInicial(valor) {

      if (this.modelValue) {
        this.estadoActual = valor;
      }

    },

  },

  methods: {

    // ========================================================
    // SELECCIONAR ESTADO
    // ========================================================

    seleccionarEstado(estado) {

      this.estadoActual = estado;

    },

    // ========================================================
    // GUARDAR
    // ========================================================

    guardar() {

      if (!this.estadoActual) {
        return;
      }

      this.$emit("guardar", {
        estado: this.estadoActual,
        observacion: this.observacion?.trim() || null,
      });

    },

    cerrar() {
      this.$emit("update:modelValue", false);
    },

  },

};
</script>

<style lang="scss" scoped>
/* ============================================================
   DIALOG
============================================================ */

.estado-reserva-dialog {
  position: relative;

  width: 100%;
  max-height: calc(100vh - 24px);

  overflow-y: auto;
  overflow-x: hidden;

  border-radius: 24px !important;

  scrollbar-width: thin;

  -webkit-overflow-scrolling: touch;
}

.btn-cerrar {
  position: absolute !important;

  top: 10px;
  right: 10px;

  z-index: 20;

  color: #12345b !important;
}

/* ============================================================
   HEADER
============================================================ */

.dialog-header {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 24px 24px 18px;
}

.header-icon {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #e0f7f5;
  color: #079c94;

  flex-shrink: 0;
}

.dialog-header h2 {
  margin: 0;

  color: #142d52;

  font-size: 21px;
  font-weight: 700;
}

.dialog-header p {
  margin: 3px 0 0;

  color: #52698a;

  font-size: 14px;
}

/* ============================================================
   ESTADOS
============================================================ */

.estados-list {
  display: flex;
  flex-direction: column;

  gap: 9px;

  padding: 4px 18px 10px;
}

.estado-option {
  display: flex;
  align-items: center;

  min-height: 70px;

  padding: 10px 12px;

  border-radius: 13px;

  border: 1px solid transparent;

  cursor: pointer;

  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;
}

.estado-option:hover {
  transform: translateY(-1px);
}

/* ============================================================
   ICONO
============================================================ */

.estado-icon {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  flex-shrink: 0;
}

.icon-gris {
  background: #dbe2ea;
  color: #718096;
}

.icon-verde {
  background: #0aa88f;
  color: white;
}

.icon-azul {
  background: #1976d2;
  color: white;
}

.icon-morado {
  background: #673de6;
  color: white;
}

.icon-rojo {
  background: #ed1c2e;
  color: white;
}

.icon-gris-oscuro {
  background: #d9e0e8;
  color: #183455;
}

/* ============================================================
   INFORMACIÓN
============================================================ */

.estado-info {
  flex: 1;

  min-width: 0;

  margin-left: 13px;
}

.estado-titulo {
  font-size: 16px;
  font-weight: 700;

  line-height: 1.2;
}

.estado-descripcion {
  margin-top: 3px;

  color: #52698a;

  font-size: 13px;

  line-height: 1.3;
}

.texto-gris {
  color: #9aa9bc;
}

.texto-verde {
  color: #087443;
}

.texto-azul {
  color: #1769d1;
}

.texto-morado {
  color: #5730d5;
}

.texto-rojo {
  color: #df1e32;
}

.texto-gris-oscuro {
  color: #173763;
}

/* ============================================================
   RADIO
============================================================ */

.estado-radio {
  width: 21px;
  height: 21px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 2px solid #9eb2ca;

  flex-shrink: 0;

  margin-left: 10px;

  color: white;
}

.radio-selected {
  border-color: transparent;
  background: #079c94;
}

/* ============================================================
   COLORES DAS TARJETAS
============================================================ */

.estado-option:nth-child(1) {
  background: #f3f6fa;
}

.estado-option:nth-child(2) {
  background: #d9f7ef;
}

.estado-option:nth-child(3) {
  background: #e7f1ff;
}

.estado-option:nth-child(4) {
  background: #eee7ff;
}

.estado-option:nth-child(5) {
  background: #ffe9ed;
}

.estado-option:nth-child(6) {
  background: #edf1f5;
}

/* ============================================================
   SELECCIÓN
============================================================ */

.estado-option.estado-selected {
  border-color: rgba(7, 156, 148, 0.35);
}

/* ============================================================
   NOTA
============================================================ */

.nota-section {
  padding: 8px 24px 0;
}

.nota-section label {
  display: block;

  margin-bottom: 7px;

  color: #173763;

  font-size: 16px;
  font-weight: 500;
}

.nota-section label span {
  font-weight: 400;
  color: #718096;
}

/* ============================================================
   ACCIONES
============================================================ */

.dialog-actions {
  padding: 20px 24px 24px;
}

.btn-guardar {
  min-height: 50px;

  border-radius: 10px;

  text-transform: none;

  font-size: 16px;

  font-weight: 700;
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {

  .estado-reserva-dialog {
    width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
    margin: 8px;
    border-radius: 18px !important;
  }

  .dialog-header {
    padding: 20px 18px 14px;
  }

  .dialog-header h2 {
    font-size: 19px;
  }

  .dialog-header p {
    font-size: 13px;
  }

  .estados-list {
    padding-left: 12px;
    padding-right: 12px;
  }

  .estado-option {
    min-height: 67px;
    padding: 9px 10px;
  }

  .estado-icon {
    width: 40px;
    height: 40px;
  }

  .estado-titulo {
    font-size: 15px;
  }

  .estado-descripcion {
    font-size: 12px;
  }

  .nota-section {
    padding-left: 18px;
    padding-right: 18px;
  }

  .dialog-actions {
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 18px;
  }

}
</style>
