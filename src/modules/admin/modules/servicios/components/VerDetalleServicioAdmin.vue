<template>
<div class="detalle-servicio-page">

  <!-- =====================================================

         CABECERA

    ====================================================== -->

  <div class="detalle-header">

    <button type="button" class="btn-volver" @click="volver">

      <v-icon size="20">

        mdi-arrow-left

      </v-icon>

    </button>

    <h1>

      Detalle del servicio

    </h1>

  </div>

  <!-- =====================================================

         CARGANDO

    ====================================================== -->

  <div v-if="cargando" class="estado-carga">

    <v-progress-circular indeterminate size="32" width="3" color="primary" />

    <span>

      Cargando servicio...

    </span>

  </div>

  <!-- =====================================================

         CONTENIDO

    ====================================================== -->

  <div v-else-if="servicio" class="detalle-contenido">

    <!-- =================================================

           GALERÍA PRINCIPAL

      ================================================== -->

    <section v-if="fotos.length" class="galeria">

      <!-- ===============================================

             IMAGEN PRINCIPAL

        ================================================ -->

      <div class="imagen-principal" @click="abrirVisorImagen" @touchstart="iniciarSwipeFoto" @touchend="finalizarSwipeFoto">

        <img :src="getFileUrl(imagenActual.url)" :alt="

              imagenActual.nombre ||

              servicio.nombre

            " />

        <!-- PRINCIPAL -->

        <div v-if="imagenActual.principal" class="badge-principal">

          <v-icon size="15">

            mdi-star

          </v-icon>

          Principal

        </div>

      </div>

      <!-- ===============================================

             MINIATURAS

             CARRUSEL DESLIZABLE

        ================================================ -->

      <div ref="miniaturasContainer" class="miniaturas">

        <button v-for="(foto, index) in fotos" :key="foto.id" :ref="

              el =>

                asignarMiniaturaRef(el, index)

            " type="button" class="miniatura" :class="{

              'miniatura-activa':

                indiceFotoActual === index

            }" @click="seleccionarFoto(index)">

          <img :src="getFileUrl(foto.url)" :alt="

                foto.nombre ||

                `Foto ${index + 1}`

              " />

        </button>

      </div>

    </section>

    <!-- =================================================

           INFORMACIÓN DEL SERVICIO

      ================================================== -->

    <section class="servicio-card">

      <div class="servicio-header">

        <h2>

          {{ servicio.nombre }}

        </h2>

        <span class="estado-chip" :class="

              servicio.estado === 'HABILITADO'

               ?'estado-activo'

                : 'estado-inactivo'

            ">

          {{

              servicio.estado === 'HABILITADO'

               ?'Activo'

                : 'Inactivo'

            }}

        </span>

      </div>

      <div class="servicio-datos">

        <div class="dato-servicio">

          <v-icon color="primary" size="21">

            mdi-clock-outline

          </v-icon>

          <span>

            {{ servicio.duracion || 0 }} min

          </span>

        </div>

        <div class="separador"></div>

        <div class="dato-servicio">

          <v-icon color="primary" size="21">

            mdi-tag-outline

          </v-icon>

          <span>

            Bs.

            {{ formatearPrecio(servicio.precio) }}

          </span>

        </div>

      </div>

    </section>

    <!-- =================================================

           DESCRIPCIÓN

      ================================================== -->

    <section class="detalle-card">

      <div class="detalle-card-icon">

        <v-icon size="28">

          mdi-file-document-outline

        </v-icon>

      </div>

      <div class="detalle-card-contenido">

        <h3>

          Descripción

        </h3>

        <p>

          {{

              servicio.descripcion ||

              "Este servicio no tiene una descripción registrada."

            }}

        </p>

      </div>

    </section>

    <!-- =================================================

           CONDICIÓN

      ================================================== -->

    <section v-if="condicion" class="condicion-card">

      <div class="condicion-header">

        <div class="condicion-header-icon">
          <v-icon size="26">
            mdi-file-document-outline
          </v-icon>
        </div>

        <h3>
          Condición del servicio
        </h3>

      </div>

      <div class="condicion-contenido">

        <!-- TÍTULO -->

        <div class="condicion-bloque">

          <strong>

            Título

          </strong>

          <span>

            {{

                condicion.nombre ||

                "Política de reserva"

              }}

          </span>

        </div>

        <!-- DESCRIPCIÓN -->

        <div class="condicion-bloque">

          <strong>

            Descripción

          </strong>

          <span>

            {{

                condicion.descripcion ||

                "Sin descripción."

              }}

          </span>

        </div>

        <!-- DATOS -->

        <div class="condicion-datos">

          <!-- REQUIERE ADELANTO -->

          <div class="condicion-item">

            <div class="condicion-icon">

              <v-icon size="20">

                mdi-currency-usd

              </v-icon>

            </div>

            <div class="condicion-item-text">

              <strong>

                Requiere adelanto

              </strong>

              <span>

                {{

                    condicion.requiere_adelanto

                     ?"Sí"

                      : "No"

                  }}

              </span>

            </div>

          </div>


          <!-- MONTO -->

          <div v-if="

                condicion.requiere_adelanto &&

                condicion.monto_adelanto !== null &&

                condicion.monto_adelanto !== undefined

              " class="condicion-item">

            <div class="condicion-icon">

              <v-icon size="20">

                mdi-cash

              </v-icon>

            </div>

            <div class="condicion-item-text">

              <strong>

                Monto del adelanto

              </strong>

              <span>

                Bs.

                {{

                    formatearPrecio(

                      condicion.monto_adelanto

                    )

                  }}

              </span>

            </div>

          </div>

          <!-- PORCENTAJE -->

          <div v-if="

                condicion.requiere_adelanto &&

                condicion.porcentaje_adelanto !== null &&

                condicion.porcentaje_adelanto !== undefined

              " class="condicion-item">

            <div class="condicion-icon">

              <v-icon size="20">

                mdi-percent

              </v-icon>

            </div>

            <div class="condicion-item-text">

              <strong>

                Porcentaje del adelanto

              </strong>

              <span>

                {{ condicion.porcentaje_adelanto }}%

              </span>

            </div>

          </div>

          <!-- REPROGRAMAR -->

          <div class="condicion-item">

            <div class="condicion-icon">

              <v-icon size="20">

                mdi-calendar-clock

              </v-icon>

            </div>

            <div class="condicion-item-text">

              <strong>

                Permite reprogramar

              </strong>

              <span>

                {{

                    condicion.permite_reprogramar

                     ?"Sí"

                      : "No"

                  }}

              </span>

              <small v-if="

                    condicion.permite_reprogramar &&

                    condicion.limite_horas_reprogramacion

                  ">

                Hasta

                {{

                    condicion.limite_horas_reprogramacion

                  }}

                horas antes de la cita.

              </small>

            </div>

          </div>

          <!-- CANCELAR -->

          <div class="condicion-item">

            <div class="condicion-icon">

              <v-icon size="20">

                mdi-close-box-outline

              </v-icon>

            </div>

            <div class="condicion-item-text">

              <strong>

                Permite cancelar

              </strong>

              <span>

                {{

                    condicion.permite_cancelar

                     ?"Sí"

                      : "No"

                  }}

              </span>

              <small v-if="

                    condicion.permite_cancelar &&

                    condicion.limite_horas_cancelacion

                  ">

                Hasta

                {{

                    condicion.limite_horas_cancelacion

                  }}

                horas antes de la cita.

              </small>

            </div>

          </div>

        </div>

      </div>

    </section>

    <!-- =================================================

           FOTOS DEL SERVICIO

      ================================================== -->

    <section v-if="fotos.length" class="media-card">

      <div class="media-header">

        <div class="media-titulo">

          <v-icon size="25">

            mdi-image-multiple-outline

          </v-icon>

          <h3>

            Fotos del servicio

          </h3>

        </div>

        <span>

          {{ fotos.length }} fotos

        </span>

      </div>

      <!-- CARRUSEL HORIZONTAL -->

      <div class="media-scroll">

        <button v-for="foto in fotos" :key="foto.id" type="button" class="foto-mini-card" @click="abrirVisorFoto(foto.id)">

          <img :src="getFileUrl(foto.url)" :alt="

                foto.nombre ||

                'Foto del servicio'

              " />

        </button>

      </div>

    </section>

    <!-- =================================================

           VIDEOS

      ================================================== -->

    <section v-if="videos.length" class="media-card">

      <div class="media-header">

        <div class="media-titulo">

          <v-icon size="25">

            mdi-video-outline

          </v-icon>

          <h3>

            Videos del servicio

          </h3>

        </div>

        <span>

          {{ videos.length }}

          {{

              videos.length === 1

               ?"video"

                : "videos"

            }}

        </span>

      </div>

      <!-- LOS VIDEOS SE MANTIENEN EN UNA SOLA FILA -->

      <div class="videos-grid">

        <button v-for="video in videos" :key="video.id" type="button" class="video-card" @click="abrirVisorVideo(video)">

          <video :src="getFileUrl(video.url)" muted preload="metadata" playsinline class="video-preview" />

          <div class="video-play">

            <v-icon size="24">

              mdi-play

            </v-icon>

          </div>

        </button>

      </div>

    </section>

  </div>

  <!-- =====================================================

         ERROR

    ====================================================== -->

  <div v-else-if="!cargando" class="estado-vacio">

    <v-icon size="42">

      mdi-alert-circle-outline

    </v-icon>

    <h3>

      No se pudo cargar el servicio

    </h3>

  </div>

  <!-- =====================================================

         DIALOGO IMAGEN

         SIN BOTONES DE NAVEGACIÓN

         SOLO SWIPE

    ====================================================== -->

  <!-- =====================================================

     DIALOGO IMAGEN

====================================================== -->

  <v-dialog v-model="dialogImagen" width="calc(100% - 24px)" max-width="720">

    <v-card class="visor-dialog">

      <!-- CERRAR -->

      <v-btn icon variant="text" class="visor-cerrar" @click="dialogImagen = false">

        <v-icon size="24">

          mdi-close

        </v-icon>

      </v-btn>

      <!-- IMAGEN -->

      <div class="visor-imagen-contenedor" @touchstart="iniciarSwipeVisor" @touchend="finalizarSwipeVisor">

        <img v-if="imagenActual" :src="getFileUrl(imagenActual.url)" :alt="imagenActual.nombre || servicio?.nombre" class="imagen-dialog" />

        <!-- PRINCIPAL -->

        <div v-if="imagenActual?.principal" class="badge-principal visor-principal">

          <v-icon size="14">

            mdi-star

          </v-icon>

          Principal

        </div>

      </div>

    </v-card>

  </v-dialog>

  <!-- =====================================================

     DIALOGO VIDEO

====================================================== -->

  <v-dialog v-model="dialogVideo" max-width="720" width="100%" @after-leave="detenerVideo">

    <v-card class="visor-video-dialog">

      <!-- CERRAR -->

      <v-btn icon variant="text" class="visor-cerrar" @click="cerrarVisorVideo">

        <v-icon size="24">

          mdi-close

        </v-icon>

      </v-btn>

      <!-- VIDEO -->

      <video v-if="videoActual" ref="videoPlayer" :src="getFileUrl(videoActual.url)" controls autoplay playsinline class="video-dialog" />

    </v-card>

  </v-dialog>

</div>
</template>

<script>
import {

  getServiceById

} from "@/modules/admin/modules/servicios/services/servicio.api";

export default {

  name: "VerDetalleServicioAdmin",

  data() {

    return {

      // ====================================================

      // ESTADO

      // ====================================================

      cargando: false,

      servicio: null,

      fotos: [],

      videos: [],

      condicion: null,

      // ====================================================

      // FOTOS

      // ====================================================

      indiceFotoActual: 0,

      miniaturasRefs: [],

      // ====================================================

      // DIALOGOS

      // ====================================================

      dialogImagen: false,

      dialogVideo: false,

      videoActual: null,

      // ====================================================

      // SWIPE

      // ====================================================

      touchInicioX: 0,

      touchFinX: 0,

    };

  },

  computed: {

    // ====================================================

    // IMAGEN ACTUAL

    // ====================================================

    imagenActual() {

      if (!this.fotos.length) {

        return null;

      }

      return (this.fotos[this.indiceFotoActual] || this.fotos[0]);

    },

  },

  mounted() {

    this.cargarDetalle();

  },

  methods: {

    // ====================================================

    // CARGAR DETALLE

    // ====================================================

    async cargarDetalle() {

      try {

        this.cargando = true;

        const id = Number(

          this.$route.params.id

        );

        console.log(

          "🔎 ID DEL SERVICIO:",

          id

        );

        if (

          !Number.isInteger(id) ||

          id <= 0

        ) {

          this.$piaAlert.error(

            "El ID del servicio no es válido.", {

              title: "Error al cargar servicio",

            }

          );

          return;

        }

        const respuesta =

          await getServiceById(id);

        console.log(

          "📋 RESPUESTA SERVICIO:",

          respuesta.data

        );

        // =================================================

        // IMPORTANTE

        //

        // La API devuelve:

        //

        // {

        //   ok: true,

        //   data: {...}

        // }

        //

        // Por eso tomamos data.data

        // =================================================

        this.servicio =

          respuesta.data?.data ||

          respuesta.data ||

          null;

        if (!this.servicio) {

          throw new Error(

            "No se encontró información del servicio."

          );

        }

        console.log(

          "📋 SERVICIO DETALLE:",

          this.servicio

        );

        // =================================================

        // CONDICIÓN

        // =================================================

        const condiciones =

          Array.isArray(

            this.servicio?.condiciones

          ) ?

          this.servicio.condiciones :

          [];

        this.condicion =

          condiciones.length ?

          condiciones[0] :

          null;

        // =================================================

        // ARCHIVOS

        // =================================================

        const archivos =

          Array.isArray(

            this.servicio?.archivos

          ) ?

          this.servicio.archivos :

          [];

        // =================================================

        // FOTOS

        // =================================================

        this.fotos =

          archivos

          .filter(

            archivo =>

            archivo.tipo === "FOTO"

          )

          .sort(

            (a, b) =>

            Number(a.orden || 0) -

            Number(b.orden || 0)

          );

        // =================================================

        // VIDEOS

        // =================================================

        this.videos =

          archivos

          .filter(

            archivo =>

            archivo.tipo === "VIDEO"

          )

          .sort(

            (a, b) =>

            Number(a.orden || 0) -

            Number(b.orden || 0)

          );

        // =================================================

        // FOTO PRINCIPAL

        // =================================================

        const indicePrincipal =

          this.fotos.findIndex(

            foto =>

            foto.principal === true

          );

        if (indicePrincipal >= 0) {

          this.indiceFotoActual =

            indicePrincipal;

        } else {

          this.indiceFotoActual = 0;

        }

        // Limpiamos referencias

        this.miniaturasRefs = [];

        console.log(

          "📷 FOTOS:",

          this.fotos

        );

        console.log(

          "🎥 VIDEOS:",

          this.videos

        );

      } catch (error) {

        console.error(

          "❌ Error cargando detalle del servicio:",

          error

        );

        this.$piaAlert.error(

          error.response?.data?.message ||

          error.response?.data?.error ||

          error.message ||

          "Ocurrió un error inesperado", {

            title: "Error al cargar servicio",

          }

        );

      } finally {

        this.cargando = false;

      }

    },

    // ====================================================

    // VOLVER

    // ====================================================

    volver() {

      this.$router.push({

        name: "servicios",

      });

    },

    // ====================================================

    // URL ARCHIVO

    // ====================================================

    getFileUrl(url) {

      if (!url) {

        return "";

      }

      if (

        url.startsWith("http://") ||

        url.startsWith("https://")

      ) {

        return url;

      }

      const baseUrl =

        import.meta.env.VITE_SERVER_URL ||

        "http://localhost:3000";

      return `${baseUrl}${url.startsWith("/")?"" : "/"}${url}`;

    },

    // ====================================================

    // PRECIO

    // ====================================================

    formatearPrecio(valor) {

      const numero =

        Number(valor || 0);

      return numero.toFixed(2);

    },

    // ====================================================

    // TIPO ADELANTO

    // ====================================================

    formatearTipoAdelanto(tipo) {

      if (!tipo) {

        return "-";

      }

      const tipos = {

        MONTO_FIJO: "Monto fijo",

        MONTO: "Monto fijo",

        PORCENTAJE: "Porcentaje",

      };

      return (

        tipos[tipo] ||

        tipo

        .toString()

        .replaceAll("_", " ")

      );

    },

    // ====================================================

    // SELECCIONAR FOTO

    // ====================================================

    seleccionarFoto(index) {

      if (

        index < 0 ||

        index >= this.fotos.length

      ) {

        return;

      }

      this.indiceFotoActual =

        index;

      this.$nextTick(() => {

        this.scrollMiniaturaActiva();

      });

    },

    // ====================================================

    // SELECCIONAR POR ID

    // ====================================================

    seleccionarFotoPorId(id) {

      const index = this.fotos.findIndex(foto => Number(foto.id) === Number(id));

      if (index === -1) {

        return;

      }

      this.seleccionarFoto(index);

    },

    // ====================================================

    // ABRIR FOTO DEL SERVICIO

    // ====================================================

    abrirVisorFoto(id) {

      const index = this.fotos.findIndex(

        foto => Number(foto.id) === Number(id)

      );

      if (index === -1) {

        return;

      }

      this.indiceFotoActual = index;

      this.dialogImagen = true;

    },

    // ====================================================

    // FOTO ANTERIOR

    // ====================================================

    mostrarFotoAnterior() {

      if (this.fotos.length <= 1) {

        return;

      }

      if (

        this.indiceFotoActual <= 0

      ) {

        this.indiceFotoActual =

          this.fotos.length - 1;

      } else {

        this.indiceFotoActual--;

      }

      this.$nextTick(() => {

        this.scrollMiniaturaActiva();

      });

    },

    // ====================================================

    // FOTO SIGUIENTE

    // ====================================================

    mostrarSiguienteFoto() {

      if (this.fotos.length <= 1) {

        return;

      }

      if (

        this.indiceFotoActual >=

        this.fotos.length - 1

      ) {

        this.indiceFotoActual = 0;

      } else {

        this.indiceFotoActual++;

      }

      this.$nextTick(() => {

        this.scrollMiniaturaActiva();

      });

    },

    // ====================================================

    // SWIPE FOTO PRINCIPAL

    // ====================================================

    iniciarSwipeFoto(event) {

      if (

        !event.changedTouches?.length

      ) {

        return;

      }

      this.touchInicioX =

        event.changedTouches[0]

        .screenX;

    },

    finalizarSwipeFoto(event) {

      if (

        !event.changedTouches?.length

      ) {

        return;

      }

      this.touchFinX =

        event.changedTouches[0]

        .screenX;

      const diferencia =

        this.touchFinX -

        this.touchInicioX;

      if (

        Math.abs(diferencia) < 50

      ) {

        return;

      }

      if (diferencia < 0) {

        this.mostrarSiguienteFoto();

      } else {

        this.mostrarFotoAnterior();

      }

    },

    // ====================================================

    // SWIPE VISOR DE IMAGEN

    // ====================================================

    iniciarSwipeVisor(event) {

      if (

        !event.changedTouches?.length

      ) {

        return;

      }

      this.touchInicioX =

        event.changedTouches[0]

        .screenX;

    },

    finalizarSwipeVisor(event) {

      if (

        !event.changedTouches?.length

      ) {

        return;

      }

      this.touchFinX =

        event.changedTouches[0]

        .screenX;

      const diferencia =

        this.touchFinX -

        this.touchInicioX;

      if (

        Math.abs(diferencia) < 50

      ) {

        return;

      }

      if (diferencia < 0) {

        this.mostrarSiguienteFoto();

      } else {

        this.mostrarFotoAnterior();

      }

    },

    // ====================================================

    // ABRIR VISOR IMAGEN

    // ====================================================

    abrirVisorImagen() {

      if (!this.imagenActual) {

        return;

      }

      this.dialogImagen = true;

    },

    // ====================================================

    // ABRIR VIDEO

    // ====================================================

    abrirVisorVideo(video) {

      if (!video) {

        return;

      }

      this.videoActual =

        video;

      this.dialogVideo = true;

    },

    // ====================================================

    // CERRAR VIDEO

    // ====================================================

    cerrarVisorVideo() {

      this.detenerVideo();

      this.dialogVideo = false;

    },

    // ====================================================

    // DETENER VIDEO

    // ====================================================

    detenerVideo() {

      const player =

        this.$refs.videoPlayer;

      if (player) {

        player.pause();

        player.currentTime = 0;

      }

      this.videoActual =

        null;

    },

    // ====================================================

    // REFERENCIAS MINIATURAS

    // ====================================================

    asignarMiniaturaRef(

      el,

      index

    ) {

      if (el) {

        this.miniaturasRefs[index] =

          el;

      }

    },

    // ====================================================

    // SCROLL MINIATURA ACTIVA

    // ====================================================

    scrollMiniaturaActiva() {

      const elemento =

        this.miniaturasRefs[

          this.indiceFotoActual

        ];

      if (!elemento) {

        return;

      }

      elemento.scrollIntoView({

        behavior: "smooth",

        block: "nearest",

        inline: "center",

      });

    },

  },

};
</script>

<style lang="scss" scoped>
/* ==========================================================

   CONTENEDOR

========================================================== */

.detalle-servicio-page {

  width: 100%;

  max-width: 100%;

  padding-bottom: 24px;

}

/* ==========================================================

   CABECERA

========================================================== */

.detalle-header {

  display: flex;

  align-items: center;

  height: 56px;

  border-bottom: 1px solid #e8eeee;

  margin-bottom: 12px;

  padding: 0 4px;

}

.btn-volver {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 38px;

  height: 38px;

  border: none;

  background: transparent;

  color: #0f8f8c;

  cursor: pointer;

  border-radius: 50%;

  margin-right: 12px;

}

.btn-volver:active {

  background: #eaf7f6;

}

.detalle-header h1 {

  margin: 0;

  font-size: 18px;

  line-height: 1.2;

  font-weight: 600;

  color: #102a43;

}

/* ==========================================================

   CARGA

========================================================== */

.estado-carga {

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  color: #5f7892;

  font-size: 14px;

}

.estado-vacio {

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color: #78909c;

  text-align: center;

}

.estado-vacio h3 {

  margin: 0;

  font-size: 16px;

  font-weight: 600;

}

/* ==========================================================

   CONTENIDO

========================================================== */

.detalle-contenido {

  width: 100%;

}

/* ==========================================================

   GALERÍA

========================================================== */

.galeria {

  width: 100%;

  margin-bottom: 14px;

}

/* ==========================================================

   IMAGEN PRINCIPAL

========================================================== */

.imagen-principal {

  position: relative;

  width: 100%;

  height: 230px;

  overflow: hidden;

  border-radius: 15px;

  background: #eaf7f6;

  cursor: pointer;

  touch-action: pan-y;

  user-select: none;

  -webkit-user-select: none;

}

.imagen-principal img {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}

/* ==========================================================

   BADGE PRINCIPAL

========================================================== */

.badge-principal {

  position: absolute;

  top: 12px;

  left: 12px;

  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 6px 10px;

  border-radius: 18px;

  background: #0f8f8c;

  color: #ffffff;

  font-size: 13px;

  font-weight: 600;

  box-shadow:

    0 3px 10px rgba(0, 0, 0, 0.12);

}

/* ==========================================================

   MINIATURAS

========================================================== */

.miniaturas {

  display: flex;

  gap: 8px;

  width: 100%;

  overflow-x: auto;

  overflow-y: hidden;

  padding: 10px 2px 4px;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;

  touch-action: pan-x;

  user-select: none;

  -webkit-user-select: none;

}

.miniaturas::-webkit-scrollbar {

  display: none;

}

.miniatura {

  flex: 0 0 64px;

  width: 64px;

  height: 64px;

  padding: 0;

  overflow: hidden;

  border: 2px solid transparent;

  border-radius: 10px;

  background: #eaf7f6;

  cursor: pointer;

  transition:

    border-color 0.2s ease,

    transform 0.2s ease;

}

.miniatura:active {

  transform: scale(0.96);

}

.miniatura-activa {

  border-color: #0f8f8c;

}

.miniatura img {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}

/* ==========================================================

   SERVICIO

========================================================== */

.servicio-card {

  width: 100%;

  padding: 16px;

  border: 1px solid #dce8e8;

  border-radius: 16px;

  background: #ffffff;

  margin-bottom: 12px;

}

.servicio-header {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 10px;

}

.servicio-header h2 {

  margin: 0;

  color: #102a43;

  font-size: 17px;

  line-height: 1.3;

  font-weight: 600;

  text-transform: lowercase;

}

.estado-chip {

  flex-shrink: 0;

  padding: 7px 12px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 500;

}

.estado-activo {

  color: #0f8f8c;

  background: #e1f5f2;

}

.estado-inactivo {

  color: #d9534f;

  background: #fdeaea;

}

.servicio-datos {

  display: flex;

  align-items: center;

  margin-top: 12px;

  color: #5f7892;

}

.dato-servicio {

  display: flex;

  align-items: center;

  gap: 7px;

  font-size: 14px;

}

.dato-servicio .v-icon {

  color: #0f8f8c;

}

.separador {

  width: 1px;

  height: 20px;

  background: #dce8e8;

  margin: 0 12px;

}

/* ==========================================================

   CARDS DE DETALLE

========================================================== */

.detalle-card {

  display: flex;

  gap: 14px;

  padding: 16px;

  border: 1px solid #dce8e8;

  border-radius: 16px;

  background: #ffffff;

  margin-bottom: 12px;

}

.detalle-card-icon {

  flex-shrink: 0;

  color: #0f8f8c;

}

.detalle-card-contenido {

  min-width: 0;

}

.detalle-card h3,

.condicion-contenido h3 {

  margin: 0 0 5px;

  color: #102a43;

  font-size: 17px;

  font-weight: 700;

}

.detalle-card p {

  margin: 0;

  color: #486581;

  font-size: 14px;

  line-height: 1.5;

}

/* ==========================================================

   CONDICIÓN

========================================================== */

.condicion-card {

  width: 100%;

  padding: 16px;

  border-radius: 16px;

  background: #f0faf9;

  margin-bottom: 12px;

}

.condicion-header {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 4px;

}

.condicion-header-icon {

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 38px;

  height: 38px;

  color: #0f8f8c;

}

.condicion-header h3 {

  margin: 0;

  color: #102a43;

  font-size: 17px;

  font-weight: 700;

}

.condicion-contenido {

  min-width: 0;

}

.condicion-bloque {

  display: flex;

  flex-direction: column;

  gap: 3px;

  margin-top: 17px;

}

.condicion-bloque strong{
  font-weight: 700;
}

.condicion-item-text strong {

  color: #102a43;

  font-size: 14px;

  font-weight: 600;

}

.condicion-bloque span,

.condicion-item-text span {

  color: #294d6b;

  font-size: 14px;

  line-height: 1.4;

}

.condicion-datos {

  margin-top: 17px;

  padding: 4px 0px;

  border-radius: 14px;

  background: #ffffff;

}

.condicion-item {

  display: flex;

  align-items: flex-start;

  gap: 10px;

  padding: 10px 0;

  border-bottom: 1px solid #e6eeee;

}

.condicion-item:last-child {

  border-bottom: none;

}

.condicion-icon {

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 36px;

  height: 36px;

  border-radius: 50%;

  background: #0f8f8c;

  color: #ffffff;

}

.condicion-item-text {

  display: flex;

  flex-direction: column;

  gap: 2px;

  min-width: 0;

}

.condicion-item-text small {

  color: #5f7892;

  font-size: 12px;

  line-height: 1.4;

}

/* ==========================================================

   MEDIA CARDS

========================================================== */

.media-card {

  width: 100%;

  padding: 14px;

  border: 1px solid #dce8e8;

  border-radius: 16px;

  background: #ffffff;

  margin-bottom: 12px;

}

.media-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 12px;

}

.media-titulo {

  display: flex;

  align-items: center;

  gap: 10px;

  min-width: 0;

}

.media-titulo .v-icon {

  color: #0f8f8c;

}

.media-titulo h3 {

  margin: 0;

  color: #102a43;

  font-size: 16px;

  font-weight: 600;

}

.media-header>span {

  flex-shrink: 0;

  color: #5f7892;

  font-size: 13px;

}

/* ==========================================================

   CARRUSEL FOTOS

========================================================== */

.media-scroll {

  display: flex;

  gap: 10px;

  width: 100%;

  overflow-x: auto;

  overflow-y: hidden;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;

  touch-action: pan-x;

  padding-bottom: 2px;

}

.media-scroll::-webkit-scrollbar {

  display: none;

}

/* ==========================================================

   FOTOS

========================================================== */

.foto-mini-card {

  flex: 0 0 92px;

  width: 92px;

  height: 92px;

  padding: 0;

  border: none;

  border-radius: 12px;

  overflow: hidden;

  background: #eaf7f6;

  cursor: pointer;

  touch-action: manipulation;

}

.foto-mini-card img {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}

/* ==========================================================

   VIDEOS

   DOS VIDEOS EN UNA SOLA FILA

========================================================== */

.videos-grid {

  display: grid;

  grid-template-columns:

    repeat(2, minmax(0, 1fr));

  gap: 10px;

  width: 100%;

}

.video-card {

  position: relative;

  width: 100%;

  height: 100px;

  padding: 0;

  overflow: hidden;

  border: none;

  border-radius: 12px;

  background: #102a43;

  cursor: pointer;

  touch-action: manipulation;

}

.video-preview {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

  background: #102a43;

}

.video-play {

  position: absolute;

  top: 50%;

  left: 50%;

  transform:

    translate(-50%, -50%);

  display: flex;

  align-items: center;

  justify-content: center;

  width: 46px;

  height: 46px;

  border-radius: 50%;

  background:

    rgba(0, 0, 0, 0.72);

  color: #ffffff;

}

/* ==========================================================

   VISOR IMAGEN

========================================================== */

.visor-dialog {

  position: relative;

  width: 100%;

  max-width: 100%;

  margin: 0 !important;

  padding: 0 !important;

  overflow: hidden;

  border-radius: 14px !important;

}

/* =========================================================

   CONTENEDOR DE IMAGEN

========================================================= */

.visor-imagen-contenedor {

  position: relative;

  width: 100%;

  margin: 0 !important;

  padding: 0 !important;

  overflow: hidden;

  touch-action: pan-y;

}

/* =========================================================

   IMAGEN

========================================================= */

.imagen-dialog {

  display: block;

  width: 100%;

  height: auto;

  margin: 0 !important;

  padding: 0 !important;

  object-fit: contain;

}

/* =========================================================

   BOTÓN CERRAR

========================================================= */

.visor-cerrar {

  position: absolute !important;

  top: 8px;

  right: 8px;

  z-index: 20;

  background: #ffffff !important;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

}

/* =========================================================

   PRINCIPAL

========================================================= */

.visor-principal {

  position: absolute;

  top: 10px;

  left: 10px;

  z-index: 10;

}

/* ==========================================================

   VISOR VIDEO

========================================================== */

.visor-video-dialog {

  position: relative;

  overflow: hidden;

  border-radius: 18px !important;

  background: #102a43;

}

.video-dialog {

  display: block;

  width: 100%;

  max-height: 78vh;

  background: #102a43;

}

/* ==========================================================

   RESPONSIVE

========================================================== */

@media (max-width: 500px) {

  .detalle-header {

    height: 56px;

    margin-bottom: 12px;

  }

  .detalle-header h1 {

    font-size: 18px;

  }

  .imagen-principal {

    height: 230px;

    border-radius: 15px;

  }

  .servicio-header h2 {

    font-size: 17px;

  }

  .condicion-card {

    padding: 14px;

  }

  .detalle-card {

    padding: 14px;

  }

  .videos-grid {

    grid-template-columns:

      repeat(2, minmax(0, 1fr));

  }

  .video-card {

    height: 95px;

  }

}
</style>
