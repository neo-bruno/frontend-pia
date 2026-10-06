<template>
<div class="editar-servicio-page">

  <!-- ==========================================
         HEADER
    =========================================== -->

  <div class="pagina-header">

    <v-btn icon="mdi-arrow-left" variant="text" color="secondary" size="small" @click="volver" />

    <div class="pagina-titulo">
      Editar servicio
    </div>

    <div class="header-espacio"></div>

  </div>

  <!-- ==========================================
         CARGANDO SERVICIO
    =========================================== -->

  <div v-if="cargando" class="estado-cargando">

    <v-progress-circular color="primary" size="40" indeterminate />

    <div class="estado-texto">
      Cargando servicio...
    </div>

  </div>

  <!-- ==========================================
         CONTENIDO
    =========================================== -->

  <template v-else-if="servicio">

    <!-- ========================================
           PASOS
      ========================================= -->

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

    <!-- ==========================================
           CONTENIDO DE LOS PASOS
      =========================================== -->

    <v-window v-model="pasoActual" class="pasos-window" :touch="false">

      <!-- ========================================
             PASO 1
        ========================================= -->

      <v-window-item :value="0">

        <InformacionAdmin ref="informacion" :datos-iniciales="informacionInicial" modo="editar" @siguiente="recibirInformacion" />

      </v-window-item>

      <!-- ========================================
             PASO 2
        ========================================= -->

      <v-window-item :value="1">

        <FotosAdmin ref="fotos" :datos-iniciales="fotosIniciales" :servicio-id="servicioId" modo="editar" @anterior="pasoAnterior" @siguiente="recibirFotos"/>

      </v-window-item>

      <!-- ========================================
             PASO 3
        ========================================= -->

      <v-window-item :value="2">
        <VideosAdmin :datos-iniciales="videosIniciales" :servicio-id="servicioId" modo="editar" @anterior="pasoAnterior" @guardar="guardarCambios"/>
      </v-window-item>

    </v-window>

  </template>

  <!-- ==========================================
         ERROR
    =========================================== -->

  <div v-else class="estado-error">

    <v-icon size="48" color="error">
      mdi-alert-circle-outline
    </v-icon>

    <div class="estado-error-titulo">
      No se pudo cargar el servicio
    </div>

    <v-btn color="primary" variant="tonal" class="mt-4" @click="cargarServicio">
      Reintentar
    </v-btn>

  </div>

</div>

<!-- ==========================================
       OVERLAY
  =========================================== -->

<v-overlay :model-value="guardando" class="align-center justify-center" persistent>

  <v-progress-circular color="primary" size="64" indeterminate />

</v-overlay>
</template>

<script>
import InformacionAdmin from "../components/InformacionAdmin.vue";
import FotosAdmin from "../components/FotosAdmin.vue";
import VideosAdmin from "../components/VideosAdmin.vue";

import {
  getServices,
  updateService,
} from "../services/servicio.api.js";

export default {

  name: "EditarServicioAdmin",

  components: {

    InformacionAdmin,
    FotosAdmin,
    VideosAdmin,

  },

  data() {

    return {

      // ==========================================
      // SERVICIO
      // ==========================================

      servicio: null,

      informacionInicial: null,

      fotosIniciales: [],

      videosIniciales: [],

      // ==========================================
      // PASOS
      // ==========================================

      pasoActual: 0,

      pasoMaximo: 0,

      pasos: [

        {
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
      // ESTADO
      // ==========================================

      cargando: true,

      guardando: false,

    };

  },

  computed: {
    servicioId() {
      return Number(this.$route.params.id);
    },
  },

  async mounted() {
    await this.cargarServicio();
  },

  methods: {

    // ==========================================
    // CARGAR SERVICIO
    // ==========================================

    async cargarServicio() {

      this.cargando = true;

      try {

        const respuesta = await getServices();
        console.log('CARGAR SERVICIO: ', this.servicioId)

        const servicios = respuesta.data?.data || [];

        const servicioEncontrado = servicios.find(
          (item) =>
          Number(item.id) === Number(this.servicioId)
        );

        if (!servicioEncontrado) {

          throw new Error(
            "El servicio no existe o no pertenece al profesional."
          );

        }

        this.servicio = servicioEncontrado;

        // ========================================
        // INFORMACIÓN
        // ========================================

        const condicion =
          servicioEncontrado.condiciones?.length ?
          servicioEncontrado.condiciones[0] :
          null;

        this.informacionInicial = {

          servicio: {

            id: servicioEncontrado.id,

            nombre: servicioEncontrado.nombre,

            descripcion: servicioEncontrado.descripcion || "",

            duracion: Number(servicioEncontrado.duracion),

            precio: Number(servicioEncontrado.precio),

          },

          condicion: condicion ?
            {

              requiere: true,

              id: condicion.id,

              nombre: condicion.nombre || "",

              descripcion: condicion.descripcion || "",

              requiere_adelanto: Boolean(
                condicion.requiere_adelanto
              ),

              tipo_adelanto: condicion.porcentaje_adelanto !== null ?
                "PORCENTAJE" :
                "MONTO",

              monto_adelanto: condicion.monto_adelanto !== null ?
                Number(
                  condicion.monto_adelanto
                ) :
                null,

              porcentaje_adelanto: condicion.porcentaje_adelanto !== null ?
                Number(
                  condicion.porcentaje_adelanto
                ) :
                null,

              permite_reprogramar: Boolean(
                condicion.permite_reprogramar
              ),

              limite_horas_reprogramacion: condicion.limite_horas_reprogramacion,

              permite_cancelar: Boolean(
                condicion.permite_cancelar
              ),

              limite_horas_cancelacion: condicion.limite_horas_cancelacion,

            } :
            null,

        };

        // ========================================
        // FOTOS
        // ========================================

        this.fotosIniciales =
          (servicioEncontrado.archivos || [])
            .filter(
              (archivo) =>
                archivo.tipo === "FOTO"
            )
            .sort((a, b) => {

              // ==================================================
              // 1. LA FOTO PRINCIPAL SIEMPRE VA PRIMERO
              // ==================================================

              if (Boolean(a.principal) !== Boolean(b.principal)) {
                return Boolean(b.principal) - Boolean(a.principal);
              }

              // ==================================================
              // 2. LAS DEMÁS RESPETAN SU ORDEN
              // ==================================================

              return Number(a.orden) - Number(b.orden);
            });

        // ========================================
        // VIDEOS
        // ========================================

        this.videosIniciales =
          (servicioEncontrado.archivos || [])
          .filter(
            (archivo) =>
            archivo.tipo === "VIDEO"
          )
          .sort(
            (a, b) =>
            Number(a.orden) -
            Number(b.orden)
          );

        console.log(
          "📋 Servicio para editar:",
          this.servicio
        );

        console.log(
          "📋 Información inicial:",
          this.informacionInicial
        );

        console.log(
          "📸 Fotos iniciales:",
          this.fotosIniciales
        );

        console.log(
          "🎥 Videos iniciales:",
          this.videosIniciales
        );

      } catch (error) {

        console.error(
          "Error cargando servicio:",
          error
        );

        this.$swal({

          title: "Error",

          text: error.response?.data?.message ||
            error.message ||
            "No se pudo cargar el servicio.",

          icon: "error",

          timer: 2500,

        });

        this.servicio = null;

      } finally {

        this.cargando = false;

      }

    },

    // ==========================================
    // RECIBIR INFORMACIÓN
    // ==========================================

    recibirInformacion(data) {

      console.log(
        "📋 Información editada:",
        data
      );

      this.informacionInicial = data;

      this.siguientePaso();

    },

    // ==========================================
    // RECIBIR FOTOS
    // ==========================================

    recibirFotos(fotos) {

      console.log(
        "📸 Fotos editadas:",
        fotos
      );

      this.fotosIniciales = fotos;

      this.siguientePaso();

    },

    // ==========================================
    // SIGUIENTE
    // ==========================================

    siguientePaso() {

      if (this.pasoActual >= this.pasos.length - 1) {
        return;
      }

      this.pasoMaximo = Math.max(this.pasoMaximo, this.pasoActual + 1);
      this.pasoActual++;

      this.$nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },

    // ==========================================
    // ANTERIOR
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
    // GUARDAR CAMBIOS
    // ==========================================
    async guardarCambios(videos) {
      try {
        this.guardando = true;

        this.videosIniciales = videos || [];

        const respuesta = await updateService(
          this.servicioId,
          this.informacionInicial
        );

        if (respuesta.status === 200) {
          this.$swal({
            icon: "success",
            title: "Servicio actualizado",
            text: "El servicio se actualizó correctamente.",
            confirmButtonText: "Aceptar",
          });

          this.$router.push({
            name: "servicios",
          });
        }
      } catch (error) {
        console.error("Error al actualizar servicio:", error);

        this.$swal({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "No se pudo actualizar el servicio.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        this.guardando = false;
      }
    },

    // ==========================================
    // VOLVER
    // ==========================================

    volver() {

      this.$router.back();

    },

  },

};
</script>

<style lang="scss" scoped>
.editar-servicio-page {

  width: 100%;

  max-width: 600px;

  margin: 0 auto;

  padding-bottom: 90px;

}

/* ==========================================
   HEADER
========================================== */

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

/* ==========================================
   PASOS
========================================== */

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

/* ==========================================
   CARGANDO
========================================== */

.estado-cargando {

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 15px;

}

.estado-texto {

  font-size: 13px;

  color: #627d98;

}

/* ==========================================
   ERROR
========================================== */

.estado-error {

  min-height: 350px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 30px;

}

.estado-error-titulo {

  margin-top: 15px;

  font-size: 15px;

  font-weight: 600;

  color: #102a43;

}

/* ==========================================
   WINDOW
========================================== */

.pasos-window {

  width: 100%;

}
</style>
