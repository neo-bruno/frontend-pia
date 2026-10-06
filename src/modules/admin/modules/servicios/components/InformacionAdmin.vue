<template>
<div class="informacion-page">

  <!-- =========================
         TITULO
    ========================== -->

  <div class="seccion-titulo">
    Información del servicio
  </div>

  <div class="seccion-descripcion">
    Completa la información básica del servicio.
  </div>

  <!-- =========================
         NOMBRE
    ========================== -->

  <div class="campo">

    <label class="campo-label">
      Nombre del servicio <span>*</span>
    </label>

    <v-text-field v-model="formulario.servicio.nombre" placeholder="Ej. Corte de cabello" variant="outlined" density="compact" hide-details="auto" color="primary" />

  </div>

  <!-- =========================
         DESCRIPCIÓN
    ========================== -->

  <div class="campo">

    <label class="campo-label">
      Descripción <span>*</span>
    </label>

    <v-textarea v-model="formulario.servicio.descripcion" placeholder="Describe el servicio..." variant="outlined" density="compact" rows="3" hide-details="auto" color="primary" />

  </div>

  <!-- =========================
         DURACIÓN + PRECIO
    ========================== -->

  <div class="fila-dos">

    <!-- DURACIÓN -->

    <div class="campo">

      <label class="campo-label">
        Duración <span>*</span>
      </label>

      <v-select v-model="formulario.servicio.duracion" :items="duraciones" suffix="min" variant="outlined" density="compact" hide-details="auto" color="primary" />

    </div>

    <!-- PRECIO -->

    <div class="campo">

      <label class="campo-label">
        Precio <span>*</span>
      </label>

      <v-text-field v-model.number="formulario.servicio.precio" type="number" min="0" step="0.01" suffix="Bs." placeholder="50" variant="outlined" density="compact" hide-details="auto" color="primary" />

    </div>

  </div>

  <!-- =========================
         INFORMACIÓN PRECIO
    ========================== -->

  <div class="informacion">

    <v-icon size="17" color="primary">
      mdi-information-outline
    </v-icon>

    <span>
      El precio corresponde al monto total que pagará el cliente por este servicio.
    </span>

  </div>

  <!-- =========================
         CONDICIÓN
    ========================== -->

  <div class="condicion-card" :class="{
        'condicion-activa': formulario.condicion.requiere,
      }">

    <!-- CABECERA -->

    <div class="condicion-header">

      <div class="condicion-icono">

        <v-icon size="21" color="primary">
          mdi-shield-check-outline
        </v-icon>

      </div>

      <div class="condicion-texto">

        <div class="condicion-titulo">
          Requiere condición
        </div>

        <div class="condicion-subtitulo">
          El cliente deberá cumplir requisitos antes de reservar.
        </div>

      </div>

      <!-- SWITCH -->

      <v-switch v-model="formulario.condicion.requiere" color="primary" inset hide-details class="condicion-switch" />

    </div>

    <!-- =========================
           DATOS CONDICIÓN
      ========================== -->

    <div v-if="formulario.condicion.requiere" class="condicion-contenido">

      <!-- TÍTULO -->

      <div class="campo">

        <label class="campo-label">
          Título de la condición <span>*</span>
        </label>

        <v-text-field v-model="formulario.condicion.nombre" placeholder="Ej. Cabello limpio y sin productos" variant="outlined" density="compact" hide-details="auto" color="primary" />

      </div>

      <!-- DESCRIPCIÓN -->

      <div class="campo">

        <label class="campo-label">
          Descripción <span>*</span>
        </label>

        <v-textarea v-model="formulario.condicion.descripcion" placeholder="Describe lo que debe cumplir el cliente..." variant="outlined" density="compact" rows="3" hide-details="auto" color="primary" />

      </div>

      <!-- =========================
             ADELANTO
        ========================== -->

      <div class="opcion">

        <div class="opcion-texto">

          <div class="opcion-titulo">
            Requiere adelanto
          </div>

          <div class="opcion-descripcion">
            El cliente deberá realizar un pago previo.
          </div>

        </div>

        <v-switch v-model="formulario.condicion.requiere_adelanto" color="primary" inset hide-details />

      </div>

      <!-- DATOS ADELANTO -->

      <div v-if="formulario.condicion.requiere_adelanto" class="adelanto">

        <v-radio-group v-model="formulario.condicion.tipo_adelanto" inline hide-details>

          <v-radio label="Monto fijo" value="MONTO" color="primary" />

          <v-radio label="Porcentaje" value="PORCENTAJE" color="primary" />

        </v-radio-group>

        <v-text-field v-if="formulario.condicion.tipo_adelanto === 'MONTO'" v-model.number="formulario.condicion.monto_adelanto" type="number" min="0" step="0.01" label="Monto del adelanto" suffix="Bs." variant="outlined" density="compact" hide-details="auto" color="primary" />

        <v-text-field v-else v-model.number="formulario.condicion.porcentaje_adelanto" type="number" min="0" max="100" label="Porcentaje del adelanto" suffix="%" variant="outlined" density="compact" hide-details="auto" color="primary" />

      </div>

      <!-- =========================
             REPROGRAMAR
        ========================== -->

      <div class="opcion">

        <div class="opcion-texto">

          <div class="opcion-titulo">
            Permite reprogramar
          </div>

          <div class="opcion-descripcion">
            El cliente podrá cambiar la fecha de su reserva.
          </div>

        </div>

        <v-switch v-model="formulario.condicion.permite_reprogramar" color="primary" inset hide-details />

      </div>

      <v-text-field v-if="formulario.condicion.permite_reprogramar" v-model.number="formulario.condicion.limite_horas_reprogramacion" type="number" min="1" label="Hasta cuántas horas antes" suffix="horas" variant="outlined" density="compact" hide-details="auto" color="primary" />

      <!-- =========================
             CANCELAR
        ========================== -->

      <div class="opcion">

        <div class="opcion-texto">

          <div class="opcion-titulo">
            Permite cancelar
          </div>

          <div class="opcion-descripcion">
            El cliente podrá cancelar su reserva.
          </div>

        </div>

        <v-switch v-model="formulario.condicion.permite_cancelar" color="primary" inset hide-details />

      </div>

      <v-text-field v-if="formulario.condicion.permite_cancelar" v-model.number="formulario.condicion.limite_horas_cancelacion" type="number" min="1" label="Hasta cuántas horas antes" suffix="horas" variant="outlined" density="compact" hide-details="auto" color="primary" />

      <!-- INFORMACIÓN -->

      <div class="condicion-info">

        <v-icon size="17" color="primary">
          mdi-information-outline
        </v-icon>

        <span>
          Esta información se mostrará al cliente antes de reservar el servicio.
        </span>

      </div>

    </div>

  </div>

  <!-- =========================
         BOTÓN SIGUIENTE
    ========================== -->

  <div class="acciones">

    <v-btn block color="primary" size="large" rounded="lg" :disabled="!formularioValido" @click="siguiente">

      Siguiente

      <v-icon end>
        mdi-arrow-right
      </v-icon>

    </v-btn>

  </div>

</div>
</template>

<script>
export default {

  name: "InformacionAdmin",

  props: {

    // ==========================================
    // DATOS PARA EDICIÓN
    // ==========================================

    datosIniciales: {
      type: Object,
      default: null,
    },

    // ==========================================
    // MODO
    // nuevo | editar
    // ==========================================

    modo: {
      type: String,
      default: "nuevo",
    },

  },

  data() {

    return {

      formulario: {

        servicio: {

          nombre: "",
          descripcion: "",
          duracion: 30,
          precio: null,

        },

        condicion: {

          requiere: false,

          id: null,

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

      },

      duraciones: [

        30,
        60,
        90,
        120,
        180,
        240,
        300,
        360,

      ],

    };

  },

  watch: {

    // =====================================================
    // RECIBIR DATOS DEL SERVICIO
    // =====================================================

    datosIniciales: {

      immediate: true,

      deep: true,

      handler(datos) {

        if (!datos) {
          return;
        }

        this.cargarDatosIniciales(datos);

      },

    },

  },

  computed: {

    formularioValido() {

      // ==========================
      // SERVICIO
      // ==========================

      const nombreValido =
        this.formulario.servicio.nombre.trim() !== "";

      const descripcionValida =
        this.formulario.servicio.descripcion.trim() !== "";

      const duracionValida = [30, 60, 90, 120].includes(
        Number(this.formulario.servicio.duracion)
      );

      const precioValido =
        this.formulario.servicio.precio !== null &&
        this.formulario.servicio.precio !== "" &&
        Number(this.formulario.servicio.precio) >= 0;

      if (
        !nombreValido ||
        !descripcionValida ||
        !duracionValida ||
        !precioValido
      ) {

        return false;

      }

      // ==========================
      // SIN CONDICIÓN
      // ==========================

      if (!this.formulario.condicion.requiere) {

        return true;

      }

      // ==========================
      // DATOS CONDICIÓN
      // ==========================

      if (
        !this.formulario.condicion.nombre?.trim() ||
        !this.formulario.condicion.descripcion?.trim()
      ) {

        return false;

      }

      // ==========================
      // ADELANTO
      // ==========================

      if (this.formulario.condicion.requiere_adelanto) {

        if (
          this.formulario.condicion.tipo_adelanto === "MONTO"
        ) {

          if (
            this.formulario.condicion.monto_adelanto === null ||
            Number(this.formulario.condicion.monto_adelanto) <= 0
          ) {

            return false;

          }

        }

        if (
          this.formulario.condicion.tipo_adelanto === "PORCENTAJE"
        ) {

          if (
            this.formulario.condicion.porcentaje_adelanto === null ||
            Number(this.formulario.condicion.porcentaje_adelanto) <= 0 ||
            Number(this.formulario.condicion.porcentaje_adelanto) > 100
          ) {

            return false;

          }

        }

      }

      // ==========================
      // REPROGRAMAR
      // ==========================

      if (
        this.formulario.condicion.permite_reprogramar &&
        Number(
          this.formulario.condicion.limite_horas_reprogramacion
        ) <= 0
      ) {

        return false;

      }

      // ==========================
      // CANCELAR
      // ==========================

      if (
        this.formulario.condicion.permite_cancelar &&
        Number(
          this.formulario.condicion.limite_horas_cancelacion
        ) <= 0
      ) {

        return false;

      }

      return true;

    },

  },

  methods: {

    // =====================================================
    // CARGAR DATOS INICIALES
    // =====================================================

    cargarDatosIniciales(datos) {

      if (!datos) {
        return;
      }

      // =================================================
      // SERVICIO
      // =================================================

      if (datos.servicio) {

        this.formulario.servicio = {

          id: datos.servicio.id?? null,

          nombre: datos.servicio.nombre?? "",

          descripcion: datos.servicio.descripcion?? "",

          duracion: Number(datos.servicio.duracion?? 30),

          precio: datos.servicio.precio !== null &&
            datos.servicio.precio !== undefined ?
            Number(datos.servicio.precio) :
            null,

        };

      }

      // =================================================
      // CONDICIÓN
      // =================================================

      if (datos.condicion) {

        this.formulario.condicion = {

          requiere: datos.condicion.requiere === true,

          id: datos.condicion.id?? null,

          nombre: datos.condicion.nombre?? "",

          descripcion: datos.condicion.descripcion?? "",

          requiere_adelanto: datos.condicion.requiere_adelanto === true,

          tipo_adelanto: datos.condicion.tipo_adelanto?? "MONTO",

          monto_adelanto: datos.condicion.monto_adelanto !== null &&
            datos.condicion.monto_adelanto !== undefined ?
            Number(datos.condicion.monto_adelanto) :
            null,

          porcentaje_adelanto: datos.condicion.porcentaje_adelanto !== null &&
            datos.condicion.porcentaje_adelanto !== undefined ?
            Number(datos.condicion.porcentaje_adelanto) :
            null,

          permite_reprogramar: datos.condicion.permite_reprogramar === true,

          limite_horas_reprogramacion: datos.condicion.limite_horas_reprogramacion !== null &&
            datos.condicion.limite_horas_reprogramacion !== undefined ?
            Number(datos.condicion.limite_horas_reprogramacion) :
            null,

          permite_cancelar: datos.condicion.permite_cancelar === true,

          limite_horas_cancelacion: datos.condicion.limite_horas_cancelacion !== null &&
            datos.condicion.limite_horas_cancelacion !== undefined ?
            Number(datos.condicion.limite_horas_cancelacion) :
            null,

        };

      } else {

        this.formulario.condicion = {

          requiere: false,

          id: null,

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

    },

    // =====================================================
    // SIGUIENTE
    // =====================================================

    siguiente() {

      if (!this.formularioValido) {

        return;

      }

      const informacion = {

        servicio: {

          // IMPORTANTE:
          // conservamos el ID solamente en edición

          ...(this.formulario.servicio.id ?
            {
              id: this.formulario.servicio.id,
            } :
            {}),

          nombre: this.formulario.servicio.nombre,

          descripcion: this.formulario.servicio.descripcion,

          duracion: Number(this.formulario.servicio.duracion),

          precio: Number(this.formulario.servicio.precio),

        },

        condicion: this.formulario.condicion.requiere

          ?
          {

            requiere: true,

            // IMPORTANTE:
            // conservamos el ID de la condición

            ...(this.formulario.condicion.id ?
              {
                id: this.formulario.condicion.id,
              } :
              {}),

            nombre: this.formulario.condicion.nombre,

            descripcion: this.formulario.condicion.descripcion,

            requiere_adelanto: this.formulario.condicion.requiere_adelanto,

            tipo_adelanto: this.formulario.condicion.tipo_adelanto,

            monto_adelanto: this.formulario.condicion.monto_adelanto,

            porcentaje_adelanto: this.formulario.condicion.porcentaje_adelanto,

            permite_reprogramar: this.formulario.condicion.permite_reprogramar,

            limite_horas_reprogramacion: this.formulario.condicion.limite_horas_reprogramacion,

            permite_cancelar: this.formulario.condicion.permite_cancelar,

            limite_horas_cancelacion: this.formulario.condicion.limite_horas_cancelacion,

          }

          :
          null,

      };

      console.log(
        "📋 INFORMACIÓN DEL SERVICIO:",
        informacion
      );

      this.$emit(
        "siguiente",
        informacion
      );

    },

  },

};
</script>

<style lang="scss" scoped>
.informacion-page {
  padding: 12px 4px 90px;
}

/* =========================
   TITULO
========================= */

.seccion-titulo {
  font-size: 17px;
  font-weight: 700;
  color: #102a43;
}

.seccion-descripcion {
  margin-top: 2px;
  margin-bottom: 14px;

  font-size: 11px;
  color: #627d98;
}

/* =========================
   CAMPOS
========================= */

.campo {
  margin-bottom: 12px;
}

.campo-label {
  display: block;

  margin-bottom: 5px;

  font-size: 12px;
  font-weight: 700;

  color: #102a43;
}

.campo-label span {
  color: #d9534f;
}

/* =========================
   DURACIÓN + PRECIO
========================= */

.fila-dos {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 10px;
}

/* =========================
   INFORMACIÓN
========================= */

.informacion,
.condicion-info {

  display: flex;
  align-items: flex-start;

  gap: 7px;

  padding: 9px 10px;

  margin-bottom: 12px;

  border-radius: 9px;

  background: #eefaf9;

  color: #486581;

  font-size: 10px;

  line-height: 1.35;

}

/* =========================
   CONDICIÓN
========================= */

.condicion-card {

  border: 1px solid #cfe4e4;

  border-radius: 13px;

  background: #f8fcfc;

  overflow: hidden;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

}

.condicion-card.condicion-activa {

  border-color: #0f9b9d;

  background: #effafa;

  box-shadow: 0 2px 8px rgba(15, 155, 157, 0.08);

}

/* =========================
   CABECERA CONDICIÓN
========================= */

.condicion-header {

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 11px;

}

.condicion-icono {

  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: white;

  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

}

.condicion-texto {

  flex: 1;

  min-width: 0;

}

.condicion-titulo {

  font-size: 13px;
  font-weight: 700;

  color: #102a43;

}

.condicion-subtitulo {

  margin-top: 2px;

  font-size: 10px;

  line-height: 1.3;

  color: #627d98;

}

/* =========================
   SWITCH PRINCIPAL
========================= */

.condicion-switch {

  flex-shrink: 0;

}

.condicion-switch :deep(.v-switch__track) {

  opacity: 1;

  background: #d7e8e8;

}

.condicion-switch :deep(.v-switch__thumb) {

  background: white;

  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);

}

.condicion-switch :deep(.v-selection-control--dirty .v-switch__track) {

  background: #0f9b9d;

}

.condicion-switch :deep(.v-selection-control--dirty .v-switch__thumb) {

  background: white;

}

/* =========================
   CONTENIDO
========================= */

.condicion-contenido {

  padding: 11px;

  border-top: 1px solid #d7ebea;

}

/* =========================
   OPCIONES
========================= */

.opcion {

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  padding: 9px 0;

  border-top: 1px solid #dbeceb;

}

.opcion-texto {

  flex: 1;

  min-width: 0;

}

.opcion-titulo {

  font-size: 11px;
  font-weight: 700;

  color: #102a43;

}

.opcion-descripcion {

  margin-top: 2px;

  font-size: 9px;

  color: #627d98;

}

/* =========================
   ADELANTO
========================= */

.adelanto {

  padding: 8px 0 10px;

}

.adelanto :deep(.v-radio-group) {

  margin-bottom: 8px;

}

/* =========================
   ACCIONES
========================= */

.acciones {
  position: fixed;
  left: 0;
  right: 0;

  /* Dejar espacio para la navegación inferior */
  bottom: 68px;

  z-index: 20;

  padding: 9px 16px 13px;

  background: rgba(255, 255, 255, 0.97);

  border-top: 1px solid #e4eeee;

  backdrop-filter: blur(6px);
}

.acciones :deep(.v-btn) {

  max-width: 600px;

  margin: 0 auto;

  min-height: 46px;

  font-size: 13px;

  font-weight: 700;

}
</style>
