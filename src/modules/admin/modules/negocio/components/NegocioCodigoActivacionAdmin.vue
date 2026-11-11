<template>
<div class="codigo-page">
  
  <!-- =====================================================
        ENCABEZADO
  ====================================================== -->
  <section class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Código de invitación</h1>
      <p>Comparte este código con los profesionales que quieran incorporarse a tu negocio.</p>
    </div>
  </section>

  <!-- Tarjeta del código -->
  <v-card class="codigo-card" elevation="0" rounded="xl">

    <div class="codigo-icon">
      <v-icon size="30">mdi-ticket-confirmation-outline</v-icon>
    </div>

    <div class="codigo-label">
      CÓDIGO DE TU NEGOCIO
    </div>

    <div v-if="cargando" class="codigo-loading">
      <v-progress-circular indeterminate color="teal" size="32" />
      <span>Consultando código...</span>
    </div>

    <template v-else>
      <div class="codigo-valor">
        {{ codigo || 'Sin código disponible' }}
      </div>

      <div v-if="codigo" class="codigo-estado">
        <v-icon color="success" size="16">mdi-check-circle</v-icon>
        Código vigente
      </div>

      <v-btn v-if="codigo" class="btn-copiar" color="teal" variant="tonal" rounded="lg" block :disabled="copiando" @click="copiarCodigo">
        <v-icon start>mdi-content-copy</v-icon>
        {{ copiando?'Copiando...' : 'Copiar código' }}
      </v-btn>
    </template>

  </v-card>

  <!-- Información -->
  <div class="informacion-card">
    <div class="informacion-icon">
      <v-icon color="teal">mdi-information-outline</v-icon>
    </div>

    <div>
      <div class="informacion-titulo">
        ¿Cómo funciona?
      </div>

      <p>
        Comparte este código con el profesional que deseas
        incorporar. Al registrarse en PIA podrá introducirlo
        para vincularse a tu negocio.
      </p>
    </div>
  </div>

  <!-- Generar nuevo código -->
  <v-btn class="btn-generar" color="teal" rounded="lg" block size="large" :disabled="cargando || generando" :loading="generando" @click="dialogConfirmacion = true">
    <v-icon start>mdi-refresh</v-icon>
    Generar nuevo código
  </v-btn>

  <p class="nota-seguridad">
    Si generas un nuevo código, el anterior dejará de funcionar
    para futuros registros. Los profesionales que ya están
    vinculados a tu negocio conservarán su vinculación.
  </p>

  <!-- Confirmación -->
  <v-dialog v-model="dialogConfirmacion" max-width="380" persistent>
    <v-card rounded="xl" class="dialog-card">

      <div class="dialog-icon">
        <v-icon size="30" color="warning">
          mdi-alert-circle-outline
        </v-icon>
      </div>

      <v-card-title class="text-center">
        ¿Generar nuevo código?
      </v-card-title>

      <v-card-text class="text-center">
        <p>
          El código actual dejará de funcionar para nuevos
          registros de profesionales.
        </p>

        <p class="dialog-importante">
          Los profesionales que ya pertenecen a tu negocio
          no serán afectados.
        </p>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn variant="text" color="grey-darken-1" :disabled="generando" @click="dialogConfirmacion = false">
          Cancelar
        </v-btn>

        <v-btn color="teal" variant="flat" rounded="lg" :loading="generando" @click="confirmarGeneracion">
          Sí, generar
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- Notificaciones -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="bottom">
    {{ mensaje }}
  </v-snackbar>

</div>
</template>

<script>
import {
  obtenerDatosNegocio,
  generarNuevoCodigoNegocio,
} from '@/modules/admin/modules/negocio/services/negocio.api';

export default {
  name: 'NegocioCodigoActivacionAdmin',

  data() {
    return {
      codigo: null,

      cargando: false,
      generando: false,
      copiando: false,

      dialogConfirmacion: false,

      snackbar: false,
      snackbarColor: 'success',
      mensaje: '',
    };
  },

  mounted() {
    this.cargarCodigo();
  },

  methods: {

    // ==========================================
    // CARGAR CÓDIGO ACTUAL
    // ==========================================

    async cargarCodigo() {
      this.cargando = true;

      try {
        const respuesta = await obtenerDatosNegocio();

        if (!respuesta.data?.ok) {
          throw new Error('No se pudo obtener el negocio.');
        }

        this.codigo = respuesta.data.data?.codigo || null;

      } catch (error) {
        console.error('Error al obtener código:', error);

        this.mostrarMensaje(
          error.response?.data?.message ||
          'No se pudo cargar el código del negocio.',
          'error'
        );

      } finally {
        this.cargando = false;
      }
    },

    // ==========================================
    // COPIAR CÓDIGO
    // ==========================================

    async copiarCodigo() {
      if (!this.codigo) return;

      this.copiando = true;

      try {
        await navigator.clipboard.writeText(this.codigo);

        this.mostrarMensaje(
          'Código copiado correctamente.',
          'success'
        );

      } catch (error) {
        console.error('Error al copiar:', error);

        this.mostrarMensaje(
          'No se pudo copiar el código.',
          'error'
        );

      } finally {
        this.copiando = false;
      }
    },

    // ==========================================
    // CONFIRMAR GENERACIÓN
    // ==========================================

    async confirmarGeneracion() {
      if (this.generando) return;

      this.generando = true;

      try {
        const respuesta = await generarNuevoCodigoNegocio();

        if (!respuesta.data?.ok || !respuesta.data?.data?.codigo) {
          throw new Error(
            respuesta.data?.message ||
            'No se pudo generar el nuevo código.'
          );
        }

        this.codigo = respuesta.data.data.codigo;

        this.dialogConfirmacion = false;

        this.mostrarMensaje(
          'Nuevo código generado correctamente.',
          'success'
        );

      } catch (error) {
        console.error('Error al generar código:', error);

        this.mostrarMensaje(
          error.response?.data?.message ||
          error.message ||
          'No se pudo generar el nuevo código.',
          'error'
        );

      } finally {
        this.generando = false;
      }
    },

    // ==========================================
    // MENSAJES
    // ==========================================

    mostrarMensaje(mensaje, color = 'success') {
      this.mensaje = mensaje;
      this.snackbarColor = color;
      this.snackbar = true;
    },

    volver() {
      this.$router.back();
    },

  },
};
</script>

<style lang="scss" scoped>
.codigo-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 16px 90px;
}

/* ==========================================================
   HEADER
\========================================================== */
.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.back-button {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  border-radius: 12px;
  border: 1px solid #dcefee;
  background: #ffffff;
  color: #008b8b;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow: 0 4px 12px rgba(0, 139, 139, 0.07);
}

.page-header-text {
  flex: 1;
}

.page-header-text h1 {
  margin: 0;

  color: #102d5a;

  font-size: 20px;
  line-height: 1.15;
  font-weight: 700;
}

.page-header-text p {
  margin: 3px 0 0;
  font-size: 12px;
  line-height: 1.35;
  color: #60779a;
}

.codigo-card {
  padding: 25px 20px;
  text-align: center;
  border: 1px solid #e2edf3;
  background: #ffffff;
}

.codigo-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #eaf8f8;
  color: #0b9da3;
}

.codigo-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #7890a5;
}

.codigo-valor {
  margin: 13px 0 8px;
  font-size: clamp(25px, 7vw, 34px);
  font-weight: 800;
  letter-spacing: 3px;
  color: #17324d;
  overflow-wrap: anywhere;
}

.codigo-estado {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 22px;
  font-size: 12px;
  color: #388e65;
  font-weight: 600;
}

.codigo-loading {
  min-height: 115px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #6b86a3;
  font-size: 13px;
}

.btn-copiar {
  max-width: 240px;
  margin: 0 auto;
  font-weight: 700;
}

.informacion-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 18px 0;
  padding: 15px;
  border: 1px solid #e2edf3;
  border-radius: 12px;
  background: #f8fcfd;
}

.informacion-icon {
  flex-shrink: 0;
}

.informacion-titulo {
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #17324d;
}

.informacion-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #6b86a3;
}

.btn-generar {
  min-height: 48px;
  font-weight: 700;
  letter-spacing: 0;
}

.nota-seguridad {
  margin: 13px 4px 0;
  font-size: 11px;
  line-height: 1.5;
  text-align: center;
  color: #8496a7;
}

.dialog-card {
  padding: 18px 12px 12px;
}

.dialog-icon {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  border-radius: 50%;
  background: #fff5e5;
}

.dialog-card p {
  font-size: 13px;
  line-height: 1.5;
}

.dialog-importante {
  margin-top: 12px;
  padding: 10px;
  border-radius: 9px;
  background: #f0f8fa;
  color: #176d73;
  font-weight: 600;
}

.dialog-actions {
  justify-content: space-between;
  padding: 8px 12px;
}
</style>
