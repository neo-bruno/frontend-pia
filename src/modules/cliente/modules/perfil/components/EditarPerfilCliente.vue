<template>
<v-dialog v-model="dialog" max-width="430" persistent scrollable>
  <v-card class="editar-perfil-dialog" max-height="90vh">

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
</v-dialog>
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
.editar-perfil-dialog {
  border-radius: 22px !important;
  overflow: hidden;
}

/* =====================================================
   HEADER
===================================================== */

.dialog-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 14px;
  border-bottom: 1px solid #e8eeee;
  background: #fff;
}

.dialog-title {
  font-size: 19px;
  font-weight: 700;
  color: #263238;
}

.dialog-subtitle {
  margin-top: 3px;
  font-size: 12px;
  color: #78909c;
}

/* =====================================================
   CONTENIDO
===================================================== */

.dialog-content {
  padding: 18px !important;
  overflow-y: auto;
}

.campo {
  margin-bottom: 15px;
}

.campo label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #546e7a;
}

/* =====================================================
   NOTA
===================================================== */

.nota-privacidad {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
  padding: 11px 12px;
  border-radius: 12px;
  background: #f1fbfb;
  color: #607d8b;
  font-size: 11px;
}

.nota-privacidad .v-icon {
  color: #008b8b;
}

/* =====================================================
   ACCIONES
===================================================== */

.dialog-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 18px 18px;
  border-top: 1px solid #e8eeee;
  background: #fff;
}

.btn-cancelar {
  min-height: 42px;
  padding: 0 18px !important;
  border-radius: 12px !important;
  background: #ee6565 !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600;
}

.btn-guardar {
  min-height: 42px;
  padding: 0 18px !important;
  border-radius: 12px !important;
  background: #008b8b !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600;
}
</style>
