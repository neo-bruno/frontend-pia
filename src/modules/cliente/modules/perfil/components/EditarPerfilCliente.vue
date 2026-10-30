<template>
<v-bottom-sheet v-model="dialog" :persistent="guardando" scrollable>
  <v-card class="editar-perfil-dialog" width="100%" max-height="92dvh">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="dialog-header">
      <div>
        <div class="dialog-title">Editar perfil</div>
        <div class="dialog-subtitle">
          Actualiza tu información personal
        </div>
      </div>

      <v-btn icon variant="text" size="small" :disabled="guardando" @click="cerrar">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- ================================================= -->
    <!-- CONTENIDO -->
    <!-- ================================================= -->

    <v-card-text class="dialog-content">

      <!-- NOMBRE -->

      <div class="campo">
        <label>Nombre</label>

        <v-text-field v-model="form.nombre" placeholder="Ingresa tu nombre" variant="outlined" density="comfortable" hide-details="auto" prepend-inner-icon="mdi-account-outline" :disabled="guardando" :error-messages="errores.nombre" @input="limpiarError('nombre')" />
      </div>

      <!-- ALIAS -->

      <div class="campo">
        <label>Alias</label>

        <v-text-field v-model="form.alias" placeholder="¿Cómo quieres que te llamemos?" variant="outlined" density="comfortable" hide-details="auto" prepend-inner-icon="mdi-account-star-outline" :disabled="guardando" :error-messages="errores.alias" @input="limpiarError('alias')" />
      </div>

      <!-- TELEFONO -->

      <div class="campo">
        <label>Teléfono</label>

        <v-text-field v-model="form.telefono" placeholder="Número de teléfono" variant="outlined" density="comfortable" hide-details="auto" prepend-inner-icon="mdi-phone-outline" inputmode="numeric" :disabled="guardando" :error-messages="errores.telefono" @input="limpiarError('telefono')" />
      </div>

      <!-- SEXO -->

      <div class="campo">
        <label>Sexo</label>

        <v-select v-model="form.sexo" :items="opcionesSexo" item-title="nombre" item-value="valor" placeholder="Selecciona tu sexo" variant="outlined" density="comfortable" hide-details="auto" prepend-inner-icon="mdi-gender-male-female" clearable :disabled="guardando" :error-messages="errores.sexo" @update:model-value="limpiarError('sexo')" />
      </div>

      <!-- FECHA NACIMIENTO -->

      <div class="campo">
        <label>Fecha de nacimiento</label>

        <v-text-field v-model="form.fecha_nacimiento" type="date" variant="outlined" density="comfortable" hide-details="auto" prepend-inner-icon="mdi-calendar-outline" :disabled="guardando" :error-messages="errores.fecha_nacimiento" @input="limpiarError('fecha_nacimiento')" />
      </div>

      <div class="nota-privacidad">
        <v-icon size="18">mdi-shield-check-outline</v-icon>

        <span>
          Tu información se mantiene segura en PIA.
        </span>
      </div>

    </v-card-text>

    <!-- ================================================= -->
    <!-- ACCIONES -->
    <!-- ================================================= -->

    <div class="dialog-actions">

      <v-btn variant="text" class="btn-cancelar" :disabled="guardando" @click="cerrar">
        Cancelar
      </v-btn>

      <v-btn class="btn-guardar" :loading="guardando" :disabled="guardando" @click="guardar">
        <v-icon start>mdi-content-save-outline</v-icon>
        Actualizar
      </v-btn>

    </div>

  </v-card>
</v-bottom-sheet>
</template>

<script>
import {
  actualizarPerfilCliente
} from "@/modules/publico/modules/cliente/services/cliente.api";

export default {
  name: "EditarPerfilCliente",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    cliente: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: [
    "update:modelValue",
    "actualizado",
  ],

  data() {
    return {
      guardando: false,

      form: {
        nombre: "",
        alias: "",
        telefono: "",
        sexo: null,
        fecha_nacimiento: "",
      },

      errores: {
        nombre: [],
        alias: [],
        telefono: [],
        sexo: [],
        fecha_nacimiento: [],
      },

      opcionesSexo: [{
          nombre: "Masculino",
          valor: "MASCULINO",
        },
        {
          nombre: "Femenino",
          valor: "FEMENINO",
        },
      ],
    };
  },

  computed: {
    dialog: {
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
        this.cargarDatos();
      }
    },
  },

  methods: {
    // ===================================================
    // CARGAR DATOS DEL CLIENTE
    // ===================================================

    cargarDatos() {
      this.form = {
        nombre: this.cliente?.nombre || "",
        alias: this.cliente?.alias || "",
        telefono: this.cliente?.telefono || "",
        sexo: this.cliente?.sexo || null,
        fecha_nacimiento: this.formatearFechaInput(
          this.cliente?.fecha_nacimiento
        ),
      };

      this.limpiarErrores();
    },

    // ===================================================
    // FECHA PARA INPUT DATE
    // ===================================================

    formatearFechaInput(fecha) {
      if (!fecha) {
        return "";
      }

      if (typeof fecha === "string") {
        return fecha.substring(0, 10);
      }

      return "";
    },

    // ===================================================
    // LIMPIAR ERRORES
    // ===================================================

    limpiarErrores() {
      this.errores = {
        nombre: [],
        alias: [],
        telefono: [],
        sexo: [],
        fecha_nacimiento: [],
      };
    },

    limpiarError(campo) {
      if (this.errores[campo]) {
        this.errores[campo] = [];
      }
    },

    // ===================================================
    // VALIDAR FORMULARIO
    // ===================================================

    validar() {
      this.limpiarErrores();

      let valido = true;

      this.form.nombre = this.form.nombre?.trim() || "";
      this.form.alias = this.form.alias?.trim() || "";
      this.form.telefono = this.form.telefono?.trim() || "";

      if (!this.form.nombre) {
        this.errores.nombre = ["El nombre es obligatorio"];
        valido = false;
      } else if (this.form.nombre.length < 2) {
        this.errores.nombre = [
          "El nombre debe tener al menos 2 caracteres",
        ];
        valido = false;
      }

      if (!this.form.alias) {
        this.errores.alias = ["El alias es obligatorio"];
        valido = false;
      } else if (this.form.alias.length < 2) {
        this.errores.alias = [
          "El alias debe tener al menos 2 caracteres",
        ];
        valido = false;
      }

      if (!this.form.telefono) {
        this.errores.telefono = [
          "El teléfono es obligatorio",
        ];
        valido = false;
      }

      return valido;
    },

    // ===================================================
    // GUARDAR
    // ===================================================

    async guardar() {
      if (!this.validar()) {
        return;
      }

      this.guardando = true;

      try {
        const payload = {
          nombre: this.form.nombre,
          alias: this.form.alias,
          telefono: this.form.telefono,
          sexo: this.form.sexo,
          fecha_nacimiento: this.form.fecha_nacimiento || null,
        };

        const response = await actualizarPerfilCliente(payload);

        if (!response.data?.ok) {
          throw new Error(
            response.data?.mensaje ||
            "No fue posible actualizar el perfil"
          );
        }

        const clienteActualizado = response.data.data;

        this.$emit(
          "actualizado",
          clienteActualizado
        );

        this.$emit(
          "update:modelValue",
          false
        );

        this.$piaAlert.success(
          "Tu información personal fue actualizada correctamente.", {
            title: "Perfil actualizado",
          }
        );
      } catch (error) {
        console.error(
          "Error al actualizar perfil:",
          error
        );

        const status = error.response?.status;
        const mensaje =
          error.response?.data?.mensaje ||
          "No fue posible actualizar tu perfil.";

        // ---------------------------------------------
        // TELÉFONO YA EXISTENTE
        // ---------------------------------------------

        if (status === 409) {
          this.errores.telefono = [
            mensaje,
          ];

          return;
        }

        this.$piaAlert.error(mensaje, {
          title: "No se pudo actualizar",
        });
      } finally {
        this.guardando = false;
      }
    },

    // ===================================================
    // CERRAR
    // ===================================================

    cerrar() {
      if (this.guardando) {
        return;
      }

      this.$emit(
        "update:modelValue",
        false
      );
    },
  },
};
</script>

<style scoped>
/* =====================================================
   SHEET DE PERFIL PIA
   ===================================================== */

.editar-perfil-dialog {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  max-height: 92dvh;
  overflow: hidden;
  border-radius: 24px 24px 0 0 !important;
  background: #ffffff;
  box-shadow: 0 -8px 35px rgba(15, 65, 70, 0.14) !important;
}

/* El sheet ocupa todo el ancho disponible */
:deep(.v-overlay__content) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  align-self: flex-end;
}

:deep(.v-bottom-sheet > .v-overlay__content) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
}

/* =====================================================
   HEADER
   ===================================================== */

.dialog-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid #e5f0f0;
  background: #ffffff;
  position: relative;
}

.dialog-header::before {
  content: "";
  position: absolute;
  width: 38px;
  height: 4px;
  border-radius: 999px;
  background: #cbdede;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
}

.dialog-title {
  font-size: 20px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #173b45;
}

.dialog-subtitle {
  margin-top: 5px;
  font-size: 13px;
  line-height: 1.4;
  color: #718992;
}

.dialog-header :deep(.v-btn) {
  width: 40px;
  height: 40px;
  border: 1px solid #e1eeee;
  border-radius: 13px;
  color: #52717a;
}

/* =====================================================
   CONTENIDO
   ===================================================== */

.dialog-content {
  flex: 1 1 auto;
  min-height: 0;
  padding: 20px 20px 16px !important;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.campo {
  margin-bottom: 17px;
}

.campo label {
  display: block;
  margin-bottom: 7px;
  font-size: 13px;
  font-weight: 700;
  color: #45636d;
}

.campo :deep(.v-field) {
  border-radius: 14px;
  background: #ffffff;
}

.campo :deep(.v-field__outline) {
  color: #d5e3e5;
}

.campo :deep(.v-field--focused .v-field__outline) {
  color: #008f91;
}

.campo :deep(.v-field__prepend-inner > .v-icon) {
  color: #78939b;
  opacity: 1;
}

.campo :deep(input),
.campo :deep(.v-select__selection-text) {
  color: #244650;
  font-size: 15px;
}

.campo :deep(.v-messages__message) {
  font-size: 12px;
}

/* =====================================================
   NOTA DE PRIVACIDAD
   ===================================================== */

.nota-privacidad {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  padding: 13px 14px;
  border: 1px solid #d9efec;
  border-radius: 14px;
  background: #f0faf9;
  color: #58777e;
  font-size: 12px;
  line-height: 1.4;
}

.nota-privacidad .v-icon {
  flex-shrink: 0;
  color: #008f91;
}

/* =====================================================
   ACCIONES FIJAS AL PIE DEL SHEET
   ===================================================== */

.dialog-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #e5f0f0;
  background: #ffffff;
}

.dialog-actions :deep(.v-btn) {
  flex: 1 1 0;
  min-width: 0;
  min-height: 48px;
  border-radius: 14px !important;
  text-transform: none !important;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
}

.btn-cancelar {
  background: #fff0f0 !important;
  color: #d94c59 !important;
  border: 1px solid #ffd9dc;
}

.btn-guardar {
  background: #008f91 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(0, 143, 145, 0.2) !important;
}

.btn-guardar:disabled {
  opacity: 0.65;
}

/* =====================================================
   AJUSTES PARA MÓVILES
   ===================================================== */

@media (max-width: 600px) {
  .editar-perfil-dialog {
    max-height: 92dvh;
    border-radius: 24px 24px 0 0 !important;
  }

  .dialog-header {
    padding: 22px 18px 15px;
  }

  .dialog-title {
    font-size: 19px;
  }

  .dialog-content {
    padding: 18px 18px 12px !important;
  }

  .campo {
    margin-bottom: 16px;
  }

  .dialog-actions {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
