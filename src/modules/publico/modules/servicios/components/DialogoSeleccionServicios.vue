<template>
<v-dialog v-model="dialog" max-width="420" width="100%" persistent>
  <v-card class="servicios-card">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="dialog-header">

      <div>
        <div class="titulo">
          ¿Qué servicio deseas realizar?
        </div>

        <div class="subtitulo">
          Selecciona el servicio que mejor se adapte a tus necesidades.
        </div>
      </div>

      <v-btn icon variant="text" size="small" @click="cerrar">
        <v-icon>mdi-close</v-icon>
      </v-btn>

    </div>

    <!-- ================================================= -->
    <!-- LISTA DE SERVICIOS -->
    <!-- ================================================= -->

    <v-card-text class="servicios-container">

      <div v-for="servicio in servicios" :key="servicio.id" class="servicio-item" :class="{
    seleccionado: servicioSeleccionado?.id === servicio.id
  }" @click="seleccionarServicio(servicio)">

        <!-- IMAGEN -->
        <div class="servicio-imagen">

          <v-img v-if="servicio.foto" :src="getFileUrl(servicio.foto)" cover height="100%" width="100%" />

          <v-icon v-else size="40" color="primary">
            mdi-content-cut
          </v-icon>

        </div>

        <!-- INFORMACIÓN -->
        <div class="servicio-info">

          <div class="servicio-nombre">
            {{ servicio.nombre }}
          </div>

          <div class="servicio-duracion">
            {{ servicio.duracion }} minutos
          </div>

          <div class="servicio-precio">
            Bs {{ servicio.precio }}
          </div>

          <div v-if="servicio.descripcion" class="servicio-descripcion">
            {{ servicio.descripcion }}
          </div>

        </div>

        <!-- RADIO: UNO SOLO -->
        <div class="servicio-radio">

          <v-icon v-if="servicioSeleccionado?.id === servicio.id" color="primary" size="30">
            mdi-checkbox-marked-circle
          </v-icon>

          <v-icon v-else color="#78909C" size="30">
            mdi-checkbox-blank-circle-outline
          </v-icon>

        </div>

      </div>

      <!-- SIN SERVICIOS -->

      <div v-if="!overlay && servicios.length === 0" class="sin-servicios">
        <v-icon size="45">
          mdi-content-cut
        </v-icon>

        <div>
          No hay servicios disponibles.
        </div>
      </div>

    </v-card-text>

    <!-- ================================================= -->
    <!-- FOOTER -->
    <!-- ================================================= -->

    <div class="dialog-footer">

      <v-btn block height="52" rounded="xl" color="primary" :disabled="!servicioSeleccionado" :loading="overlay" @click="continuar">
        Acepto el Servicio
        <v-icon end>
          mdi-check
        </v-icon>
      </v-btn>

    </div>

  </v-card>

  <!-- ================================================= -->
  <!-- OVERLAY -->
  <!-- ================================================= -->

  <v-overlay :model-value="overlay" class="align-center justify-center" persistent contained>
    <v-progress-circular color="primary" size="64" indeterminate />
  </v-overlay>

</v-dialog>
</template>

<script>
import {
  getFileUrl
} from '@/utils/ayuda';
import {
  getServicesByProfessionalId
} from '../services/servicio.api'

export default {

  name: 'DialogoSeleccionServicios',

  props: {

    modelValue: {
      type: Boolean,
      default: false
    },

    profesionalId: {
      type: [Number, String],
      required: true
    }

  },

  emits: [
    'update:modelValue',
    'seleccionar'
  ],

  data() {

    return {

      servicios: [],

      servicioSeleccionado: null,

      overlay: false

    }

  },

  computed: {

    dialog: {

      get() {
        return this.modelValue
      },

      set(value) {
        this.$emit('update:modelValue', value)
      }

    }

  },

  watch: {

    modelValue(nuevoValor) {

      if (nuevoValor) {

        this.servicioSeleccionado = null

        this.obtenerServicios()

      }

    }

  },

  methods: {
    getFileUrl,

    // =====================================================
    // OBTENER SERVICIOS
    // =====================================================
    async obtenerServicios() {

      try {
        this.overlay = true

        console.log('🔎 OBTENIENDO SERVICIOS DEL PROFESIONAL:', this.profesionalId)
        const res = await getServicesByProfessionalId(this.profesionalId)

        console.log('📋 SERVICIOS RECIBIDOS:', res.data)

        if (res.data.ok) {
          this.servicios = res.data.data || []
        } else {
          this.servicios = []
        }
      } catch (error) {
        console.error('❌ ERROR OBTENIENDO SERVICIOS:', error)

        this.$swal({
          title: 'Error',
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'No se pudieron obtener los servicios.',
          icon: 'error',
          timer: 2500
        })

      } finally {
        this.overlay = false
      }
    },

    // =====================================================
    // SELECCIONAR SERVICIO
    // =====================================================
    seleccionarServicio(servicio) {
      this.servicioSeleccionado = servicio
      console.log('✂️ SERVICIO SELECCIONADO:', servicio)
    },

    // =====================================================
    // CONTINUAR
    // =====================================================

    continuar() {
      if (!this.servicioSeleccionado) {
        return
      }
      console.log('➡️ CONTINUAR CON SERVICIO:', this.servicioSeleccionado)
      this.$emit('seleccionar', this.servicioSeleccionado)
      this.dialog = false
    },

    // =====================================================
    // CERRAR
    // =====================================================
    cerrar() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.servicios-card {

  border-radius: 24px !important;
  overflow: hidden;
  background: #ffffff;

}

/* ===================================================== */
/* HEADER */
/* ===================================================== */

.dialog-header {

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 20px 18px 12px;

}

.titulo {

  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.25;

}

.subtitulo {

  margin-top: 6px;

  font-size: 13px;
  line-height: 1.4;

  color: #64748B;

}

/* ===================================================== */
/* CONTENEDOR */
/* ===================================================== */

.servicios-container {

  padding: 8px 14px 14px !important;

  max-height: 500px;

  overflow-y: auto;

}

/* ===================================================== */
/* SERVICIO */
/* ===================================================== */

.servicio-item {

  position: relative;

  display: grid;

  grid-template-columns: 82px minmax(0, 1fr);

  align-items: center;

  column-gap: 12px;

  padding: 9px;

  margin-bottom: 10px;

  min-height: 112px;

  border: 1px solid #E2E8F0;

  border-radius: 16px;

  cursor: pointer;

  transition: all 0.2s ease;

  background: #ffffff;

  box-sizing: border-box;

}

.servicio-item:hover {

  border-color: #078B88;

}

.servicio-item.seleccionado {

  border: 2px solid #078B88;

  background: #F0FDFA;

}

/* ===================================================== */
/* IMAGEN */
/* NO CAMBIAMOS SU TAMAÑO */
/* ===================================================== */

.servicio-imagen {

  flex-shrink: 0;

  width: 82px;
  height: 82px;

  border-radius: 12px;

  overflow: hidden;

  background: #E6F7F6;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* ===================================================== */
/* INFORMACIÓN */
/* ===================================================== */

.servicio-info {

  width: 100%;

  min-width: 0;

  align-self: stretch;

  display: flex;

  flex-direction: column;

  justify-content: center;

}

/* ===================================================== */
/* NOMBRE */
/* ===================================================== */

.servicio-nombre {

  width: 100%;

  font-size: 16px;

  font-weight: 700;

  color: #0F172A;

  line-height: 1.2;

  word-break: break-word;

}

/* ===================================================== */
/* DURACIÓN */
/* ===================================================== */

.servicio-duracion {

  margin-top: 3px;

  font-size: 13px;

  color: #64748B;

}

/* ===================================================== */
/* PRECIO */
/* ===================================================== */

.servicio-precio {

  margin-top: 2px;

  font-size: 18px;

  font-weight: 700;

  color: #078B88;

}

/* ===================================================== */
/* DESCRIPCIÓN */
/* ===================================================== */

.servicio-descripcion {

  width: 100%;

  margin-top: 3px;

  font-size: 12px;

  line-height: 1.3;

  color: #64748B;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}

/* ===================================================== */
/* RADIO */
/* ===================================================== */

.servicio-radio {

  position: absolute;

  right: 9px;

  top: 50%;

  transform: translateY(-50%);

  width: 30px;

  height: 30px;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* ===================================================== */
/* FOOTER */
/* ===================================================== */

.dialog-footer {

  padding: 10px 14px 16px;

  border-top: 1px solid #E2E8F0;

}
</style>
