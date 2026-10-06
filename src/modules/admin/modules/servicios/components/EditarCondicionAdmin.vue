<template>
<v-bottom-sheet v-model="dialog" inset scrollable :scrim="true" content-class="condicion-sheet">
  <v-card class="condicion-card">

    <!-- =====================================================
           ENCABEZADO
      ====================================================== -->
    <div class="sheet-header">

      <div class="sheet-handle"></div>

      <div class="header-content">

        <div>
          <h2>Condición del servicio</h2>

          <p>
            Define las reglas para reservar este servicio.
          </p>
        </div>

        <button class="btn-close" type="button" @click="cerrar">
          <v-icon size="22">
            mdi-close
          </v-icon>
        </button>

      </div>
    </div>

    <!-- =====================================================
           CONTENIDO
      ====================================================== -->
    <div class="sheet-content">

      <!-- =================================================
             INFORMACIÓN GENERAL
        ================================================== -->
      <section class="condition-section">

        <div class="section-title">

          <div class="section-icon">
            <v-icon size="23">
              mdi-file-document-outline
            </v-icon>
          </div>

          <span>
            Información general
          </span>

        </div>

        <!-- TÍTULO -->
        <div class="field-group">

          <label>
            Título
            <span>*</span>
          </label>

          <v-text-field v-model="form.nombre" autofocus variant="outlined" density="comfortable" hide-details="auto" placeholder="Ej. Política de reserva" :error-messages="errores.nombre" />

        </div>

        <!-- DESCRIPCIÓN -->
        <div class="field-group">

          <label>
            Descripción
            <span>*</span>
          </label>

          <v-textarea v-model="form.descripcion" variant="outlined" density="comfortable" rows="3" maxlength="500" counter hide-details="auto" placeholder="Describe las condiciones para reservar este servicio." :error-messages="errores.descripcion" />

        </div>

      </section>

      <!-- =================================================
             ADELANTO
        ================================================== -->
      <section class="condition-section">

        <div class="section-title">

          <div class="section-icon">
            <v-icon size="23">
              mdi-currency-usd
            </v-icon>
          </div>

          <span>
            Adelanto
          </span>

        </div>

        <div class="section-inner">

          <!-- REQUIERE ADELANTO -->
          <div class="field-group">

            <label>
              Requiere adelanto
            </label>

            <div class="toggle-group">

              <button type="button" class="toggle-btn" :class="{
                    active: form.requiere_adelanto === true
                  }" @click="form.requiere_adelanto = true">
                Sí
              </button>

              <button type="button" class="toggle-btn" :class="{
                    active: form.requiere_adelanto === false
                  }" @click="desactivarAdelanto">
                No
              </button>

            </div>

          </div>

          <!-- CAMPOS DE ADELANTO -->
          <template v-if="form.requiere_adelanto">

            <!-- TIPO -->
            <div class="field-group">

              <label>
                Tipo de adelanto
              </label>

              <v-select v-model="form.tipo_adelanto" :items="tiposAdelanto" item-title="title" item-value="value" variant="outlined" density="comfortable" hide-details="auto" />

            </div>

            <!-- MONTO -->
            <div v-if="form.tipo_adelanto === 'MONTO'" class="field-group">

              <label>
                Monto del adelanto (Bs.)
                <span>*</span>
              </label>

              <v-text-field v-model.number="form.monto_adelanto" type="number" min="0" step="0.01" variant="outlined" density="comfortable" hide-details="auto" prefix="Bs." />

            </div>

            <!-- PORCENTAJE -->
            <div v-if="form.tipo_adelanto === 'PORCENTAJE'" class="field-group">

              <label>
                Porcentaje del adelanto (%)
                <span>*</span>
              </label>

              <v-text-field v-model.number="form.porcentaje_adelanto" type="number" min="0" max="100" step="0.01" variant="outlined" density="comfortable" hide-details="auto" suffix="%" />

            </div>

          </template>

          <!-- MENSAJE SIN ADELANTO -->
          <div v-else class="info-message">

            <v-icon size="20">
              mdi-information
            </v-icon>

            <span>
              No se solicitará adelanto para confirmar la cita.
            </span>

          </div>

        </div>

      </section>

      <!-- =================================================
             REPROGRAMACIÓN
        ================================================== -->
      <section class="condition-section">

        <div class="section-title">

          <div class="section-icon">
            <v-icon size="23">
              mdi-calendar-clock
            </v-icon>
          </div>

          <span>
            Reprogramación
          </span>

        </div>

        <div class="section-inner">

          <!-- PERMITE REPROGRAMAR -->
          <div class="field-group">

            <label>
              Permite reprogramar
            </label>

            <div class="toggle-group">

              <button type="button" class="toggle-btn" :class="{
                    active: form.permite_reprogramar === true
                  }" @click="form.permite_reprogramar = true">
                Sí
              </button>

              <button type="button" class="toggle-btn" :class="{
                    active: form.permite_reprogramar === false
                  }" @click="desactivarReprogramacion">
                No
              </button>

            </div>

          </div>

          <!-- HORAS -->
          <div v-if="form.permite_reprogramar" class="field-group">

            <label>
              Horas límite para reprogramar
              <span>*</span>
            </label>

            <v-text-field v-model.number="form.limite_horas_reprogramacion" type="number" min="0" step="1" variant="outlined" density="comfortable" hide-details="auto" />

            <small>
              Horas antes de la cita.
            </small>

          </div>

          <!-- MENSAJE -->
          <div v-else class="info-message">

            <v-icon size="20">
              mdi-information
            </v-icon>

            <span>
              No se permitirá reprogramar las citas.
            </span>

          </div>

        </div>

      </section>

      <!-- =================================================
             CANCELACIÓN
        ================================================== -->
      <section class="condition-section">

        <div class="section-title">

          <div class="section-icon">
            <v-icon size="23">
              mdi-email-outline
            </v-icon>
          </div>

          <span>
            Cancelación
          </span>

        </div>

        <div class="section-inner">

          <!-- PERMITE CANCELAR -->
          <div class="field-group">

            <label>
              Permite cancelar
            </label>

            <div class="toggle-group">

              <button type="button" class="toggle-btn" :class="{
                    active: form.permite_cancelar === true
                  }" @click="form.permite_cancelar = true">
                Sí
              </button>

              <button type="button" class="toggle-btn" :class="{
                    active: form.permite_cancelar === false
                  }" @click="desactivarCancelacion">
                No
              </button>

            </div>

          </div>

          <!-- HORAS -->
          <div v-if="form.permite_cancelar" class="field-group">

            <label>
              Horas límite para cancelar
              <span>*</span>
            </label>

            <v-text-field v-model.number="form.limite_horas_cancelacion" type="number" min="0" step="1" variant="outlined" density="comfortable" hide-details="auto" />

            <small>
              Horas antes de la cita.
            </small>

          </div>

          <!-- MENSAJE -->
          <div v-else class="info-message">

            <v-icon size="20">
              mdi-information
            </v-icon>

            <span>
              No se permitirá cancelar las citas.
            </span>

          </div>

        </div>

      </section>

    </div>

    <!-- =====================================================
           BOTÓN GUARDAR
      ====================================================== -->
    <div class="sheet-footer">

      <v-btn class="btn-save" block :loading="guardando" :disabled="guardando" @click="guardar">

        <v-icon start>
          mdi-content-save
        </v-icon>

        Guardar condición

      </v-btn>

    </div>

  </v-card>
</v-bottom-sheet>
</template>

<script>
import {
  getConditionById,
  createCondition,
  updateCondition,
} from "../services/condicion.api";

export default {

  name: "EditarCondicionAdmin",

  props: {

    modelValue: {
      type: Boolean,
      default: false,
    },

    condicionId: {
      type: [Number, String, null],
      default: null,
    },

  },

  emits: [
    "update:modelValue",
    "saved",
  ],

  data() {

    return {

      guardando: false,

      cargando: false,

      errores: {
        nombre: [],
        descripcion: [],
      },
      
      tiposAdelanto: [{
          title: "Monto fijo",
          value: "MONTO",
        },
        {
          title: "Porcentaje",
          value: "PORCENTAJE",
        },
      ],

      form: this.formInicial(),

    };

  },

  computed: {

    dialog: {

      get() {
        return this.modelValue;
      },

      set(value) {
        this.$emit("update:modelValue", value);
      },

    },

  },

  watch: {
    modelValue: {
      immediate: true,
      handler(value) {
        console.log("WATCH modelValue:", value);

        if (value) {
          console.log("EJECUTANDO cargarCondicion()");
          this.cargarCondicion();
        }
      },
    },

    "form.tipo_adelanto"(value) {
      if (value === "MONTO") {
        this.form.porcentaje_adelanto = null;
      }

      if (value === "PORCENTAJE") {
        this.form.monto_adelanto = null;
      }
    },
  },

  methods: {

    // =========================================================
    // FORMULARIO INICIAL
    // =========================================================

    formInicial() {

      return {

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

    },

    // =========================================================
    // CARGAR CONDICIÓN
    // =========================================================
    async cargarCondicion() {
      // El servicio no tiene condición
      if (!this.condicionId) {
        this.resetForm();
        this.$piaAlert.info(
          "Este servicio no tiene una condición configurada. ¿Deseas crear una?",
          {
            title: "Sin condición",
          }
        );

        return;
      }

      try {
        const response = await getConditionById(this.condicionId);
        const condicion = response.data?.data;

        if (!condicion) {
          this.resetForm();
          return;
        }

        this.form = {
          nombre: condicion.nombre || "",
          descripcion: condicion.descripcion || "",

          requiere_adelanto: condicion.requiere_adelanto === true,

          tipo_adelanto:
            condicion.requiere_adelanto === true
              ? condicion.porcentaje_adelanto !== null
                ? "PORCENTAJE"
                : "MONTO"
              : "MONTO",

          monto_adelanto: condicion.monto_adelanto ?? null,
          porcentaje_adelanto: condicion.porcentaje_adelanto ?? null,

          permite_reprogramar:
            condicion.permite_reprogramar === true,

          limite_horas_reprogramacion:
            condicion.limite_horas_reprogramacion ?? null,

          permite_cancelar:
            condicion.permite_cancelar === true,

          limite_horas_cancelacion:
            condicion.limite_horas_cancelacion ?? null,
        };

      } catch (error) {
        console.error("ERROR AL CARGAR CONDICION:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado",
          {
            title: "Error al cargar la condición",
          }
        );
      }
    },

    resetForm() {
      this.form = {
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
    },

    // =========================================================
    // DESACTIVAR ADELANTO
    // =========================================================

    desactivarAdelanto() {

      this.form.requiere_adelanto = false;

      this.form.monto_adelanto = null;

      this.form.porcentaje_adelanto = null;

    },

    // =========================================================
    // DESACTIVAR REPROGRAMACIÓN
    // =========================================================

    desactivarReprogramacion() {

      this.form.permite_reprogramar = false;

      this.form.limite_horas_reprogramacion = null;

    },

    // =========================================================
    // DESACTIVAR CANCELACIÓN
    // =========================================================

    desactivarCancelacion() {

      this.form.permite_cancelar = false;

      this.form.limite_horas_cancelacion = null;

    },

    // =========================================================
    // VALIDACIÓN FRONTEND
    // =========================================================

    validar() {

      this.errores = {
        nombre: [],
        descripcion: [],
      };

      let valido = true;

      if (!this.form.nombre?.trim()) {

        this.errores.nombre = [
          "El título es obligatorio.",
        ];

        valido = false;

      }

      if (!this.form.descripcion?.trim()) {

        this.errores.descripcion = [
          "La descripción es obligatoria.",
        ];

        valido = false;

      }

      // -----------------------------------------------------
      // ADELANTO
      // -----------------------------------------------------

      if (this.form.requiere_adelanto) {

        if (this.form.tipo_adelanto === "MONTO") {

          const monto = Number(
            this.form.monto_adelanto
          );

          if (!Number.isFinite(monto) || monto < 0) {

            valido = false;

          }

        }

        if (this.form.tipo_adelanto === "PORCENTAJE") {

          const porcentaje = Number(
            this.form.porcentaje_adelanto
          );

          if (
            !Number.isFinite(porcentaje) ||
            porcentaje < 0 ||
            porcentaje > 100
          ) {

            valido = false;

          }

        }

      }

      // -----------------------------------------------------
      // REPROGRAMACIÓN
      // -----------------------------------------------------

      if (this.form.permite_reprogramar) {

        const horas = Number(
          this.form.limite_horas_reprogramacion
        );

        if (
          !Number.isInteger(horas) ||
          horas < 0
        ) {

          valido = false;

        }

      }

      // -----------------------------------------------------
      // CANCELACIÓN
      // -----------------------------------------------------

      if (this.form.permite_cancelar) {

        const horas = Number(
          this.form.limite_horas_cancelacion
        );

        if (
          !Number.isInteger(horas) ||
          horas < 0
        ) {

          valido = false;

        }

      }

      return valido;

    },

    // =========================================================
    // GUARDAR
    // =========================================================

    async guardar() {

      if (!this.validar()) {
        return;
      }
      this.guardando = true;

      try {
        const data = {
          nombre: this.form.nombre.trim(),
          descripcion: this.form.descripcion?.trim() || null,
          requiere_adelanto: this.form.requiere_adelanto,
          tipo_adelanto: this.form.requiere_adelanto
            ? this.form.tipo_adelanto
            : undefined,
          monto_adelanto:
            this.form.requiere_adelanto &&
            this.form.tipo_adelanto === "MONTO"
              ? Number(this.form.monto_adelanto)
              : null,
          porcentaje_adelanto:
            this.form.requiere_adelanto &&
            this.form.tipo_adelanto === "PORCENTAJE"
              ? Number(this.form.porcentaje_adelanto)
              : null,
          permite_reprogramar: this.form.permite_reprogramar,
          limite_horas_reprogramacion:
            this.form.permite_reprogramar
              ? Number(this.form.limite_horas_reprogramacion)
              : null,
          permite_cancelar: this.form.permite_cancelar,
          limite_horas_cancelacion:
            this.form.permite_cancelar
              ? Number(this.form.limite_horas_cancelacion)
              : null,
        };
        let response;
        // -----------------------------------------------------
        // EDITAR
        // -----------------------------------------------------
        if (this.condicionId) {
          response = await updateCondition(this.condicionId, data);
        }
        // -----------------------------------------------------
        // CREAR
        // -----------------------------------------------------
        else {
          response = await createCondition(data);
        }
        console.log("CONDICIÓN GUARDADA:", response);
        // -----------------------------------------------------
        // MENSAJE DE ÉXITO
        // -----------------------------------------------------
        this.$piaAlert.success(
          this.condicionId
            ? "La condición se actualizó correctamente."
            : "La condición se creó correctamente.",
          {
            title: this.condicionId
              ? "Condición actualizada"
              : "Condición creada",
          }
        );
        this.$emit("saved", response?.data?.data);
        this.dialog = false;

      } catch (error) {
        console.error("Error al guardar condición:", error);
        // -----------------------------------------------------
        // MENSAJE DE ERROR
        // -----------------------------------------------------
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado.",
          {
            title: this.condicionId
              ? "Error al actualizar la condición"
              : "Error al crear la condición",
          }
        );
      } finally {
        this.guardando = false;
      }
    },

    // =========================================================
    // CERRAR
    // =========================================================

    cerrar() {

      if (this.guardando) {
        return;
      }

      this.dialog = false;

    },

  },

};
</script>

<style lang="scss" scoped>
/* ============================================================
   SHEET
============================================================ */

:deep(.condicion-sheet) {
  width: 100%;
  max-width: 100%;
}

/* ============================================================
   CARD PRINCIPAL
============================================================ */

.condicion-card {

  width: 100%;

  max-height: 92vh;

  border-radius: 24px 24px 0 0 !important;

  overflow: hidden;

  background: #ffffff;

}

/* ============================================================
   HEADER
============================================================ */

.sheet-header {

  background: #ffffff;

  padding: 10px 18px 12px;

  position: sticky;

  top: 0;

  z-index: 10;

}

.sheet-handle {

  width: 38px;

  height: 4px;

  border-radius: 10px;

  background: #c7d5df;

  margin: 0 auto 14px;

}

.header-content {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

}

.header-content h2 {

  margin: 0;

  color: #092653;

  font-size: 20px;

  font-weight: 700;

  line-height: 1.2;

}

.header-content p {

  margin: 5px 0 0;

  color: #7890b1;

  font-size: 13px;

  line-height: 1.35;

}

.btn-close {

  width: 42px;

  height: 42px;

  min-width: 42px;

  border: none;

  border-radius: 50%;

  background: #e8f4f3;

  color: #07335b;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

}

/* ============================================================
   CONTENIDO
============================================================ */

.sheet-content {

  overflow-y: auto;

  padding: 0 14px 12px;

}

/* ============================================================
   SECCIONES
============================================================ */

.condition-section {

  background: #eef9f8;

  border-radius: 15px;

  padding: 11px;

  margin-bottom: 8px;

}

.section-title {

  display: flex;

  align-items: center;

  gap: 11px;

  color: #082956;

  font-size: 14px;

  font-weight: 700;

  margin-bottom: 9px;

}

.section-icon {

  width: 36px;

  height: 36px;

  min-width: 36px;

  border-radius: 50%;

  background: #0fa39e;

  color: #ffffff;

  display: flex;

  align-items: center;

  justify-content: center;

}

.section-inner {

  background: rgba(255, 255, 255, 0.86);

  border-radius: 11px;

  padding: 8px;

}

/* ============================================================
   CAMPOS
============================================================ */

.field-group {

  margin-bottom: 9px;

}

.field-group:last-child {

  margin-bottom: 0;

}

.field-group label {

  display: block;

  color: #092653;

  font-size: 12px;

  font-weight: 600;

  margin-bottom: 5px;

}

.field-group label span {

  color: #e53935;

}

.field-group small {

  display: block;

  margin-top: 3px;

  color: #8293a8;

  font-size: 10px;

}

/* ============================================================
   VUETIFY INPUTS
============================================================ */

:deep(.v-field) {

  border-radius: 8px;

  background: #ffffff;

}

:deep(.v-field__outline) {

  --v-field-border-opacity: 0.45;

}

:deep(.v-field--focused .v-field__outline) {

  --v-field-border-opacity: 1;

  color: #0fa39e;

}

:deep(.v-input) {

  font-size: 13px;

}

:deep(.v-field__input) {

  min-height: 38px;

  padding-top: 7px;

  padding-bottom: 7px;

}

/* ============================================================
   TOGGLE SÍ / NO
============================================================ */

.toggle-group {

  width: 100%;

  display: flex;

  border: 1px solid #d5dee5;

  border-radius: 8px;

  overflow: hidden;

  background: #ffffff;

}

.toggle-btn {

  flex: 1;

  height: 36px;

  border: none;

  background: #ffffff;

  color: #30415d;

  font-size: 12px;

  font-weight: 500;

  cursor: pointer;

  transition: 0.18s ease;

}

.toggle-btn+.toggle-btn {

  border-left: 1px solid #d5dee5;

}

.toggle-btn.active {

  background: #0fa39e;

  color: #ffffff;

  font-weight: 600;

}

/* ============================================================
   MENSAJE INFORMATIVO
============================================================ */

.info-message {

  display: flex;

  align-items: flex-start;

  gap: 9px;

  padding: 10px;

  margin-top: 3px;

  border-radius: 9px;

  background: #e6f1ff;

  color: #2161a6;

  font-size: 11px;

  line-height: 1.4;

}

.info-message .v-icon {

  flex-shrink: 0;

  color: #1976d2;

}

/* ============================================================
   FOOTER
============================================================ */

.sheet-footer {

  background: #ffffff;

  padding: 4px 14px 12px;

  position: sticky;

  bottom: 0;

  z-index: 10;

}

.btn-save {

  height: 42px !important;

  border-radius: 8px !important;

  background: #0fa39e !important;

  color: #ffffff !important;

  font-size: 13px;

  font-weight: 700;

  text-transform: none;

  letter-spacing: 0;

}

/* ============================================================
   SCROLLBAR
============================================================ */

.sheet-content::-webkit-scrollbar {

  width: 4px;

}

.sheet-content::-webkit-scrollbar-thumb {

  background: #c7d9d8;

  border-radius: 10px;

}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {

  .condicion-card {

    max-height: 94vh;

    border-radius: 22px 22px 0 0 !important;

  }

  .sheet-header {

    padding-left: 16px;

    padding-right: 16px;

  }

  .sheet-content {

    padding-left: 12px;

    padding-right: 12px;

  }

  .condition-section {

    padding: 10px;

  }

  .section-title {

    font-size: 13px;

  }

}
</style>
