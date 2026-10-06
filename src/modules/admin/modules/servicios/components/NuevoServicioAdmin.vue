<template>
<div class="nuevo-servicio-page">

  <!-- =========================
         HEADER
    ========================== -->

  <div class="pagina-header">

    <v-btn icon="mdi-arrow-left" variant="text" color="secondary" size="small" @click="volver" />

    <div class="pagina-titulo">
      Nuevo servicio
    </div>

    <div class="header-espacio"></div>

  </div>

  <!-- =========================
         PASOS
    ========================== -->

  <div class="pasos-container">

    <v-tabs v-model="pasoActual" color="primary" grow density="compact" class="pasos-tabs">

      <v-tab v-for="(paso, index) in pasos" :key="paso.id" :value="index" :disabled="index > pasoMaximo">

        <div class="paso-tab">

          <div class="paso-numero" :class="{
                'paso-activo': pasoActual === index,
                'paso-completado': index < pasoActual,
              }">

            <v-icon v-if="index < pasoActual" size="14">
              mdi-check
            </v-icon>

            <span v-else>
              {{ index + 1 }}
            </span>

          </div>

          <div class="paso-nombre">
            {{ paso.nombre }}
          </div>

        </div>

      </v-tab>

    </v-tabs>

  </div>

  <!-- =========================
         CONTENIDO
    ========================== -->

  <v-window v-model="pasoActual" class="pasos-window" :touch="false">

    <!-- =========================
           PASO 1
      ========================== -->

    <v-window-item :value="0">

      <InformacionAdmin @siguiente="recibirInformacion" />

    </v-window-item>

    <!-- =========================
           PASO 2
      ========================== -->

    <v-window-item :value="1">

      <FotosAdmin @anterior="pasoAnterior" @siguiente="recibirFotos" />

    </v-window-item>

    <!-- =========================
           PASO 3
      ========================== -->

    <v-window-item :value="2">

      <VideosAdmin @anterior="pasoAnterior" @guardar="guardarServicio" />

    </v-window-item>

  </v-window>

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>

</template>

<script>
import InformacionAdmin from "./InformacionAdmin.vue";
import FotosAdmin from "./FotosAdmin.vue";
import VideosAdmin from "./VideosAdmin.vue";
import { saveService } from "../services/servicio.api.js";

export default {

  name: "NuevoServicioAdmin",

  components: {
    InformacionAdmin,
    FotosAdmin,
    VideosAdmin,
  },

  data() {

    return {

      // ==========================================
      // PASOS
      // ==========================================

      pasoActual: 0,

      pasoMaximo: 0,

      pasos: [{
          id: "informacion",
          nombre: "Información",
        },
        {
          id: "fotos",
          nombre: "Fotos",
        },
        {
          id: "videos",
          nombre: "Videos",
        },
      ],

      // ==========================================
      // INFORMACIÓN DEL SERVICIO
      // ==========================================

      informacionServicio: null,

      // ==========================================
      // FOTOS
      // ==========================================

      fotosServicio: [],

      // ==========================================
      // VIDEOS
      // ==========================================

      videosServicio: [],

      // ==========================================
      // ESTADO
      // ==========================================

      guardando: false,

      overlay: false,

    };

  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {

    // ==========================================
    // RECIBIR INFORMACIÓN
    // ==========================================

    recibirInformacion(data) {

      console.log("📋 Información recibida:", data);

      this.informacionServicio = data;

      this.siguientePaso();

    },

    // ==========================================
    // RECIBIR FOTOS
    // ==========================================

    recibirFotos(fotos) {

      console.log("📸 Fotos recibidas:", fotos);

      this.fotosServicio = fotos;

      this.siguientePaso();

    },

    // ==========================================
    // SIGUIENTE PASO
    // ==========================================

    siguientePaso() {

      if (
        this.pasoActual >=
        this.pasos.length - 1
      ) {
        return;
      }

      this.pasoMaximo = Math.max(
        this.pasoMaximo,
        this.pasoActual + 1
      );

      this.pasoActual++;

      this.$nextTick(() => {

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      });

    },

    // ==========================================
    // PASO ANTERIOR
    // ==========================================

    pasoAnterior() {

      if (this.pasoActual <= 0) {
        return;
      }

      this.pasoActual--;

      this.$nextTick(() => {

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      });

    },

    // ==========================================
    // VOLVER
    // ==========================================

    volver() {

      this.$router.back();

    },

    // ==========================================
    // GUARDAR SERVICIO
    // ==========================================
    async guardarServicio(videos) {

      console.log("=================================");
      console.log("💾 GUARDANDO NUEVO SERVICIO");
      console.log("=================================");

      try {
        this.overlay = true
        this.guardando = true;

        // ==========================================
        // GUARDAR VIDEOS RECIBIDOS
        // ==========================================
        this.videosServicio = videos || [];

        // ==========================================
        // VALIDACIÓN
        // ==========================================
        if (!this.informacionServicio) {
          this.$swal({
            title: "Error!",
            text: "❌ No existe información del servicio.",
            icon: "error",
            timer: 2500,
          })
          return          
        }

        // ==========================================
        // INFORMACIÓN COMPLETA
        // ==========================================
        const datosServicio = {

          // ----------------------------------------
          // INFORMACIÓN + CONDICIÓN
          // ----------------------------------------

          servicio: {
            ...this.informacionServicio.servicio,
          },

          condicion: this.informacionServicio.condicion ? {
            ...this.informacionServicio.condicion,
          } : null,

          // ----------------------------------------
          // FOTOS
          // ----------------------------------------

          fotos: this.fotosServicio.map(
            (foto, index) => ({
              archivo: foto.archivo,

              orden: index + 1,

              principal: index === 0,
            })
          ),

          // ----------------------------------------
          // VIDEOS
          // ----------------------------------------

          videos: this.videosServicio.map(
            (video, index) => ({
              archivo: video.archivo,

              orden: index + 1,
            })
          ),

        };

        const formData = new FormData();
        formData.append("servicio", JSON.stringify(datosServicio.servicio));
        formData.append("condicion", datosServicio.condicion ? JSON.stringify(datosServicio.condicion) : "");
        datosServicio.fotos.forEach((foto) => {
          formData.append("fotos", foto.archivo);
        });
        datosServicio.videos.forEach((video) => {
          formData.append("videos", video.archivo);
        });
        
        const res = await saveService(formData)

        if (res.status === 201) {
          this.$swal({
            title: "Servicio Guardado!",
            text: "Se ha guardado los datos del servicio correctamente!",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.$router.push({name: 'servicios'})
            }
          })
        }

      } catch (error) {
        this.$swal({
          title: "Error!",
          text:
            error.response?.data?.message || error.response?.data?.mensaje ||
            error.response?.data?.error ||
            error.message || error.mensaje ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })
      } finally {
        this.overlay = false
        this.guardando = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nuevo-servicio-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  padding-bottom: 90px;
}

/* =========================
   HEADER
========================= */

.pagina-header {
  display: flex;
  align-items: center;

  min-height: 52px;
}

.pagina-titulo {
  flex: 1;

  text-align: center;

  font-size: 18px;
  font-weight: 700;

  color: #102a43;
}

.header-espacio {
  width: 40px;
}

/* =========================
   PASOS
========================= */

.pasos-container {
  padding: 0 4px;
}

.pasos-tabs {
  border-bottom: 1px solid #e5eeee;
}

.pasos-tabs :deep(.v-tab) {
  min-width: 0;
  padding: 0 5px;
}

.paso-tab {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;
}

.paso-numero {
  width: 22px;
  height: 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #edf6f6;

  color: #6b8790;

  font-size: 11px;

  font-weight: 700;
}

.paso-numero.paso-activo {
  background: #0f9b9d;

  color: white;
}

.paso-numero.paso-completado {
  background: #dff5f3;

  color: #0f8f91;
}

.paso-nombre {
  font-size: 10px;

  font-weight: 600;

  color: #627d98;
}

.pasos-tabs :deep(.v-tab--selected .paso-nombre) {
  color: #0f8f91;
}

/* =========================
   WINDOW
========================= */

.pasos-window {
  overflow: visible;
}

.pasos-window :deep(.v-window__container) {
  overflow: visible;
}

/* =========================
   ACCIONES
========================= */

.pasos-window :deep(.acciones) {
  position: static !important;

  left: auto !important;
  right: auto !important;
  bottom: auto !important;

  z-index: auto !important;

  width: 100%;

  margin-top: 18px;

  padding: 10px 4px 20px;

  background: transparent;

  border-top: none;
}

.pasos-window :deep(.acciones .v-btn) {
  min-height: 46px;
}

.pasos-window :deep(.acciones-dobles) {
  display: flex;

  gap: 10px;
}

.pasos-window :deep(.acciones) {
  margin-bottom: 10px;
}
</style>
