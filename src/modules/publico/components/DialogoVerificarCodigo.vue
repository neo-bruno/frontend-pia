<template>
  <v-dialog
    v-model="dialog"
    max-width="450"
    persistent
  >
    <v-card rounded="xl">

      <!-- HEADER -->
      <v-card-title class="pa-5 d-flex align-center bg-primary">
        <v-icon
          icon="mdi-store-check-outline"
          class="mr-3"
        />

        <span class="text-h6 font-weight-bold">
          Verificar Negocio
        </span>
      </v-card-title>

      <v-divider />

      <!-- CONTENIDO -->
      <v-card-text class="pa-5">

        <div class="text-body-2 text-medium-emphasis mb-5">
          Ingresa el código del negocio al que deseas
          registrarte como profesional.
        </div>

        <v-text-field
          v-model="codigo"
          autofocus
          label="Código del negocio"
          placeholder="NEG-DA2DF"
          variant="outlined"
          prepend-inner-icon="mdi-key-outline"
          :loading="loading"
          :disabled="loading"
          :error-messages="error"
          maxlength="12"
          counter="12"
          @keyup.enter="verificarCodigo"
          @input="formatearCodigo"
        />

        <!-- NEGOCIO ENCONTRADO -->
        <v-alert
          v-if="negocio"
          type="success"
          variant="tonal"
          rounded="lg"
          class="mt-4"
        >
          <div class="font-weight-bold">
            {{ negocio.nombre }}
          </div>

          <div class="text-caption mt-1">
            Código: {{ negocio.codigo }}
          </div>
        </v-alert>

      </v-card-text>

      <v-divider />

      <!-- ACCIONES -->
      <v-card-actions class="pa-5">

        <v-btn
          variant="text"
          :disabled="loading"
          @click="cerrar"
        >
          Cancelar
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          :loading="loading"
          :disabled="!codigo.trim()"
          @click="verificarCodigo"
        >
          Verificar
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>

</template>

<script>
import { getVerificationCode } from "../modules/profesional/services/profesional.api";

export default {
  name: "DialogoVerificarCodigo",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    "update:modelValue",
    "negocio-verificado",
  ],

  data() {
    return {
      codigo: "",
      loading: false,
      error: "",
      negocio: null,

      overlay: false,
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
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {

    formatearCodigo() {
      let valor = this.codigo.toUpperCase().replace(/[^A-Z0-9-]/g, "");

      // Siempre comenzar con NEG-
      if (!valor.startsWith("NEG-")) {
        valor = "NEG-" + valor.replace(/^NEG-?/, "");
      }

      // Tomamos únicamente los 5 caracteres después de NEG-
      const codigo = valor.substring(4, 12);

      this.codigo = `NEG-${codigo}`;
      this.error = "";
    },

    async verificarCodigo() {

      if (!this.codigo.trim()) {
        this.error = "Ingresa el código del negocio";
        return;
      }

      this.loading = true;
      this.overlay = true
      this.error = "";
      this.negocio = null;

      try {
        const codigo = this.codigo.trim().toUpperCase();
                
        const res = await getVerificationCode(codigo)
        if (res.data.ok) {
          this.negocio = res.data.negocio;
          this.$swal({
            title: "Codigo Verificado!",
            text: "El codigo ser ha verificado y es válido para el registro del profesional.",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.$emit("negocio-verificado", this.negocio);
              this.dialog = false;
            }
          })
          
          
        }else{
          throw new Error(res.data.mensaje || "No se pudo verificar el código");
        }        

      }  catch (error) {
        console.error("Error verificando código:", error);

        this.$swal({
          title: "Error!",
          text:
            error.response?.data?.message || error.response?.data?.mensaje ||
            error.response?.data?.error ||
            error.message || error.mensaje ||
            "El código ingresado no es válido",
          icon: "error",
          timer: 2500,          
        })
      } finally {
        this.overlay = false
        this.loading = false;
      }       
    },

    cerrar() {
      if (this.loading) return;

      this.codigo = "";
      this.error = "";
      this.negocio = null;

      this.dialog = false;
    },
  },

  watch: {

    modelValue(value) {

      if (value) {
        this.codigo = "";
        this.error = "";
        this.negocio = null;
      }
    },
  },
};
</script>