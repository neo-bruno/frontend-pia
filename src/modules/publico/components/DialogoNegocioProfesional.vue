<template>
<v-dialog v-model="dialog" max-width="560" width="calc(100% - 24px)">
  <v-card class="registration-dialog" rounded="xl" elevation="0">
    <!-- ========================================= -->
    <!-- CERRAR -->
    <!-- ========================================= -->

    <v-btn class="close-btn" icon="mdi-close" size="38" variant="text" color="secondary" @click="cerrar" />

    <!-- ========================================= -->
    <!-- CABECERA -->
    <!-- ========================================= -->

    <div class="dialog-header">

      <div class="dialog-main-icon">
        <v-icon size="34" color="primary">
          mdi-store
        </v-icon>
      </div>

      <h2 class="dialog-title">
        ¿Qué deseas registrar?
      </h2>

      <p class="dialog-subtitle">
        Elige la opción que mejor se adapte a lo que necesitas.
      </p>

    </div>

    <!-- ========================================= -->
    <!-- OPCIONES -->
    <!-- ========================================= -->

    <div class="registration-options">

      <!-- ======================================= -->
      <!-- NEGOCIO -->
      <!-- ======================================= -->

      <v-card class="registration-option" elevation="0" rounded="xl" @click="seleccionarNegocio">

        <div class="option-icon">
          <v-icon size="42" color="primary">
            mdi-storefront-outline
          </v-icon>
        </div>

        <div class="option-content">

          <div class="option-title">
            Registrar mi negocio
          </div>

          <div class="option-description">
            Crea tu negocio en PIA y empieza
            a conectar con clientes.
          </div>

        </div>

        <div class="option-arrow">
          <v-icon size="25" color="white">
            mdi-arrow-right
          </v-icon>
        </div>

      </v-card>

      <!-- ======================================= -->
      <!-- PROFESIONAL -->
      <!-- ======================================= -->

      <v-card class="registration-option" elevation="0" rounded="xl" @click="seleccionarProfesional">

        <div class="option-icon professional-icon">
          <v-icon size="42" color="secondary">
            mdi-account-tie
          </v-icon>
        </div>

        <div class="option-content">

          <div class="option-title">
            Registrarme como profesional
          </div>

          <div class="option-description">
            Únete a un negocio existente
            utilizando un código de invitación.
          </div>

        </div>

        <div class="option-arrow">
          <v-icon size="25" color="white">
            mdi-arrow-right
          </v-icon>
        </div>

      </v-card>

    </div>

    <!-- ========================================= -->
    <!-- PIE -->
    <!-- ========================================= -->

    <div class="dialog-footer">

      <div class="privacy-message">

        <div class="privacy-icon">
          <v-icon size="20" color="primary">
            mdi-shield-check-outline
          </v-icon>
        </div>

        <div class="privacy-content">

          <div class="privacy-title">
            Tus datos están protegidos
          </div>

          <div class="privacy-text">
            Solo los utilizaremos para gestionar tu registro.
          </div>

        </div>

      </div>

      <v-btn class="cancel-btn" variant="text" color="secondary" rounded="pill" @click="cerrar">
        Cancelar
      </v-btn>

    </div>

  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: "DialogoNegocioProfesional",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    "update:modelValue",
    "negocio",
    "profesional",
  ],

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

  methods: {
    cerrar() {
      this.dialog = false;
    },

    seleccionarNegocio() {
      this.$emit("negocio");
      this.dialog = false;
    },

    seleccionarProfesional() {
      this.$emit("profesional");
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
/* ================================================= */
/* DIALOGO                                           */
/* ================================================= */

.registration-dialog {
  position: relative;

  overflow: hidden;

  background: #ffffff;

  border: 1px solid rgba(15, 143, 140, 0.10);

  box-shadow:
    0 20px 60px rgba(16, 42, 67, 0.18) !important;
}

/* ================================================= */
/* BOTÓN CERRAR                                      */
/* ================================================= */

.close-btn {
  position: absolute;

  top: 12px;
  right: 12px;

  z-index: 10;
}

/* ================================================= */
/* CABECERA                                           */
/* ================================================= */

.dialog-header {
  padding: 34px 24px 22px;

  text-align: center;
}

.dialog-main-icon {
  width: 76px;
  height: 76px;

  margin: 0 auto 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eaf7f6;
}

.dialog-title {
  margin: 0;

  color: #102a43;

  font-size: 24px;
  line-height: 1.2;

  font-weight: 800;
}

.dialog-subtitle {
  max-width: 390px;

  margin: 10px auto 0;

  color: #64748b;

  font-size: 13px;
  line-height: 1.5;
}

/* ================================================= */
/* OPCIONES                                           */
/* ================================================= */

.registration-options {
  display: flex;

  flex-direction: column;

  gap: 14px;

  padding: 0 24px 22px;
}

/* ================================================= */
/* TARJETA OPCIÓN                                     */
/* ================================================= */

.registration-option {
  position: relative;

  display: flex;

  align-items: center;

  min-height: 150px;

  padding: 22px 70px 22px 22px;

  border: 1px solid rgba(15, 143, 140, 0.28);

  background: #f8fcfc;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.registration-option:hover {
  border-color: rgba(15, 143, 140, 0.55);

  box-shadow:
    0 8px 28px rgba(15, 143, 140, 0.10);
}

.registration-option:active {
  transform: scale(0.985);
}

/* ================================================= */
/* ICONO OPCIÓN                                       */
/* ================================================= */

.option-icon {
  flex: 0 0 auto;

  width: 96px;
  height: 96px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eaf7f6;
}

.professional-icon {
  background: #e4f1f2;
}

/* ================================================= */
/* CONTENIDO                                          */
/* ================================================= */

.option-content {
  min-width: 0;

  margin-left: 24px;
}

.option-title {
  color: #102a43;

  font-size: 18px;
  line-height: 1.25;

  font-weight: 800;
}

.option-description {
  max-width: 330px;

  margin-top: 8px;

  color: #64748b;

  font-size: 13px;
  line-height: 1.5;
}

/* ================================================= */
/* FLECHA                                             */
/* ================================================= */

.option-arrow {
  position: absolute;

  top: 50%;
  right: 22px;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #0f8f8c;

  transform: translateY(-50%);

  box-shadow:
    0 5px 14px rgba(15, 143, 140, 0.22);
}

/* ================================================= */
/* FOOTER                                             */
/* ================================================= */

.dialog-footer {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 14px;

  margin: 0 24px 24px;

  padding: 14px 16px;

  border-radius: 16px;

  background: #eaf7f6;
}

.privacy-message {
  display: flex;

  align-items: center;

  min-width: 0;

  gap: 10px;
}

.privacy-icon {
  flex: 0 0 auto;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffffff;
}

.privacy-content {
  min-width: 0;
}

.privacy-title {
  color: #102a43;

  font-size: 11px;
  font-weight: 800;
}

.privacy-text {
  margin-top: 3px;

  color: #64748b;

  font-size: 9px;
  line-height: 1.3;
}

.cancel-btn {
  flex: 0 0 auto;

  font-size: 12px;

  font-weight: 600;
}

/* ================================================= */
/* MOBILE                                             */
/* ================================================= */

@media (max-width: 600px) {

  .dialog-header {
    padding: 28px 18px 20px;
  }

  .dialog-main-icon {
    width: 68px;
    height: 68px;

    margin-bottom: 15px;
  }

  .dialog-title {
    font-size: 20px;
  }

  .dialog-subtitle {
    font-size: 11px;

    max-width: 300px;
  }

  .registration-options {
    gap: 10px;

    padding: 0 14px 18px;
  }

  .registration-option {
    min-height: 128px;

    padding: 18px 58px 18px 16px;
  }

  .option-icon {
    width: 74px;
    height: 74px;
  }

  .option-icon .v-icon {
    font-size: 34px !important;
  }

  .option-content {
    margin-left: 15px;
  }

  .option-title {
    font-size: 14px;
  }

  .option-description {
    margin-top: 6px;

    font-size: 10px;
    line-height: 1.4;
  }

  .option-arrow {
    right: 14px;

    width: 40px;
    height: 40px;
  }

  .option-arrow .v-icon {
    font-size: 21px !important;
  }

  .dialog-footer {
    margin: 0 14px 14px;

    padding: 10px 12px;
  }

  .privacy-icon {
    width: 32px;
    height: 32px;
  }

  .privacy-title {
    font-size: 9px;
  }

  .privacy-text {
    display: none;
  }

  .cancel-btn {
    font-size: 10px;
  }
}

/* ================================================= */
/* PANTALLAS MUY PEQUEÑAS                             */
/* ================================================= */

@media (max-width: 360px) {

  .dialog-header {
    padding-top: 24px;
  }

  .dialog-title {
    font-size: 18px;
  }

  .registration-option {
    min-height: 115px;

    padding: 14px 52px 14px 12px;
  }

  .option-icon {
    width: 64px;
    height: 64px;
  }

  .option-icon .v-icon {
    font-size: 29px !important;
  }

  .option-content {
    margin-left: 12px;
  }

  .option-title {
    font-size: 12px;
  }

  .option-description {
    font-size: 9px;
  }

  .option-arrow {
    right: 10px;

    width: 36px;
    height: 36px;
  }
}
</style>
