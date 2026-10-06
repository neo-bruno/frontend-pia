<template>
<!-- =====================================================
       DIALOG PRINCIPAL DEL SERVICIO
  ====================================================== -->

<v-dialog :model-value="modelValue" max-width="600" width="100%" scrollable @update:model-value="$emit('update:modelValue', $event)">

  <v-card class="dialog-servicio">

    <!-- =================================================
           HEADER
      ================================================== -->

    <div class="dialog-header">

      <strong>
        {{ servicio?.nombre || 'Detalle del servicio' }}
      </strong>

      <v-btn icon="mdi-close" variant="text" density="comfortable" @click="cerrar" />

    </div>

    <!-- =================================================
           CONTENIDO
      ================================================== -->

    <v-card-text class="dialog-contenido">

      <!-- ===============================================
             CARGANDO
        ================================================ -->

      <div v-if="cargando" class="estado">

        <v-progress-circular indeterminate size="35" width="3" color="#0f9b9d" />

        <span>
          Cargando servicio...
        </span>

      </div>

      <!-- ===============================================
             ERROR
        ================================================ -->

      <div v-else-if="error" class="estado error">

        <v-icon size="40">
          mdi-alert-circle-outline
        </v-icon>

        <span>
          {{ error }}
        </span>

      </div>

      <!-- ===============================================
             SERVICIO
        ================================================ -->

      <div v-else-if="servicio" class="servicio-contenido">

        <!-- =====================================================
            GALERÍA PRINCIPAL
        ====================================================== -->

        <section v-if="galeria.length" class="galeria-principal">

          <!-- IMAGEN / VIDEO PRINCIPAL -->

          <div class="galeria-main">

            <v-carousel v-model="mediaActual" height="300" hide-delimiter-background show-arrows="hover" class="galeria-carousel">

              <v-carousel-item v-for="(archivo, index) in galeria" :key="archivo.id">

                <!-- FOTO -->

                <div v-if="archivo.tipo === 'FOTO'" class="media-principal" @click="abrirFoto(index)">

                  <img :src="getFileUrl(archivo.url)" :alt="archivo.nombre" />

                  <div class="media-zoom">
                    <v-icon>
                      mdi-magnify-plus-outline
                    </v-icon>
                  </div>

                </div>

                <!-- VIDEO -->

                <div v-else class="media-principal video-principal" @click="abrirVideo(archivo)">

                  <video :src="getFileUrl(archivo.url)" preload="metadata" />

                  <div class="video-play-principal">

                    <v-icon size="58" color="white">
                      mdi-play-circle
                    </v-icon>

                  </div>

                </div>

              </v-carousel-item>

            </v-carousel>

            <!-- CONTADOR -->

            <div class="galeria-contador">
              {{ mediaActual + 1 }} / {{ galeria.length }}
            </div>

          </div>

          <!-- MINIATURAS -->

          <div class="galeria-miniaturas">

            <div v-for="(archivo, index) in galeria" :key="archivo.id" class="miniatura" :class="{ activa: mediaActual === index }" @click="seleccionarMedia(index)">

              <!-- FOTO -->

              <img v-if="archivo.tipo === 'FOTO'" :src="getFileUrl(archivo.url)" :alt="archivo.nombre" />

              <!-- VIDEO -->

              <div v-else class="miniatura-video">

                <video :src="getFileUrl(archivo.url)" preload="metadata" />

                <div class="miniatura-play">
                  <v-icon size="28" color="white">
                    mdi-play-circle
                  </v-icon>
                </div>

              </div>

            </div>

          </div>

        </section>

        <!-- =============================================
               INFORMACIÓN PRINCIPAL
          ============================================== -->

        <section class="servicio-header">

          <div class="servicio-titulo">

            <h2>
              {{ servicio.nombre }}
            </h2>

            <div class="datos-basicos">

              <span>
                <v-icon size="16">
                  mdi-clock-outline
                </v-icon>

                {{ servicio.duracion }} minutos
              </span>

              <strong>
                Bs {{ servicio.precio }}
              </strong>

            </div>

          </div>

        </section>

        <!-- =============================================
               DESCRIPCIÓN
          ============================================== -->

        <section v-if="servicio.descripcion" class="seccion">

          <div class="section-title">

            <v-icon size="18">
              mdi-text-box-outline
            </v-icon>

            <strong>
              Descripción
            </strong>

          </div>

          <p class="descripcion">
            {{ servicio.descripcion }}
          </p>

        </section>
        
        <!-- =============================================
               VIDEOS
          ============================================== -->

        <section v-if="videos.length" class="seccion">

          <div class="section-title">

            <v-icon size="18">
              mdi-video-outline
            </v-icon>

            <strong>
              Videos
            </strong>

            <span>
              {{ videos.length }}
            </span>

          </div>

          <div class="videos-list">

            <div v-for="video in videos" :key="video.id" class="video-card" @click="abrirVideo(video)">

              <div class="video-preview">

                <video :src="getFileUrl(video.url)" preload="metadata" />

                <div class="video-play">

                  <v-icon size="32" color="white">
                    mdi-play-circle
                  </v-icon>

                </div>

              </div>

              <div class="video-info">

                <strong>
                  {{ video.nombre }}
                </strong>

                <span>
                  Ver video
                </span>

              </div>

              <v-icon size="20">
                mdi-chevron-right
              </v-icon>

            </div>

          </div>

        </section>

        <!-- =============================================
               CONDICIÓN
          ============================================== -->
        
        <section v-if="condicion" class="condicion-section">

          <div class="section-title">

            <v-icon size="18">
              mdi-information-outline
            </v-icon>

            <strong>
              {{ condicion.nombre }}
            </strong>

          </div>

          <p v-if="condicion.descripcion" class="condicion-descripcion">
            {{ condicion.descripcion }}
          </p>

          <!-- ADELANTO -->

          <div class="condicion-item">

            <v-icon size="19">
              {{
                  condicion.requiere_adelanto
                   ?'mdi-cash-fast'
                    : 'mdi-cash-check'
                }}
            </v-icon>

            <div>

              <strong>
                Adelanto
              </strong>

              <span v-if="condicion.requiere_adelanto">

                <template v-if="condicion.monto_adelanto">

                  Para reservar este servicio necesitas
                  pagar un adelanto de

                  <b>
                    Bs {{ condicion.monto_adelanto }}
                  </b>.

                </template>

                <template v-else-if="condicion.porcentaje_adelanto">

                  Para reservar este servicio necesitas
                  pagar el

                  <b>
                    {{ condicion.porcentaje_adelanto }}%
                  </b>

                  del precio.

                </template>

                <template v-else>

                  Este servicio requiere un adelanto
                  para realizar la reserva.

                </template>

              </span>

              <span v-else>

                No necesitas pagar ningún adelanto
                para reservar este servicio.

              </span>

            </div>

          </div>

          <!-- REPROGRAMACIÓN -->

          <div class="condicion-item">

            <v-icon size="19">
              mdi-calendar-refresh-outline
            </v-icon>

            <div>

              <strong>
                Cambio de fecha
              </strong>

              <span v-if="condicion.permite_reprogramar">

                Puedes cambiar la fecha de tu cita.

                <template v-if="condicion.limite_horas_reprogramacion">

                  Debes hacerlo hasta

                  <b>
                    {{ condicion.limite_horas_reprogramacion }}
                    horas antes
                  </b>.

                </template>

              </span>

              <span v-else>

                Una vez realizada la reserva,
                no podrás cambiar la fecha de la cita.

              </span>

            </div>

          </div>

          <!-- CANCELACIÓN -->

          <div class="condicion-item">

            <v-icon size="19">
              mdi-calendar-remove-outline
            </v-icon>

            <div>

              <strong>
                Cancelación
              </strong>

              <span v-if="condicion.permite_cancelar">

                Puedes cancelar tu cita.

                <template v-if="condicion.limite_horas_cancelacion">

                  Debes hacerlo hasta

                  <b>
                    {{ condicion.limite_horas_cancelacion }}
                    horas antes
                  </b>.

                </template>

              </span>

              <span v-else>

                Este servicio no permite cancelar
                la cita una vez realizada la reserva.

              </span>

            </div>

          </div>

        </section>

        <!-- =============================================
               AGENDAR
          ============================================== -->
        
        <div class="agendar-container">

          <v-btn block size="large" class="btn-agendar" prepend-icon="mdi-calendar-check-outline" @click="agendarCita">

            Agendar cita

          </v-btn>

        </div>

      </div>

    </v-card-text>

  </v-card>

</v-dialog>

<!-- =====================================================
       DIALOG VISOR DE FOTOS
  ====================================================== -->

<v-dialog v-model="dialogFoto" fullscreen scrim="black">

  <div class="visor-fotos">

    <div class="visor-header">

      <strong>
        {{ servicio?.nombre || 'Galería' }}
      </strong>

      <span v-if="fotos.length">

        {{ fotoActual + 1 }}
        /
        {{ fotos.length }}

      </span>

      <v-btn icon="mdi-close" variant="text" color="white" @click="cerrarFoto" />

    </div>

    <v-carousel v-if="fotos.length" v-model="fotoActual" class="visor-carousel" height="100%" hide-delimiter-background show-arrows="hover">

      <v-carousel-item v-for="foto in fotos" :key="foto.id">

        <div class="foto-grande-container">

          <img :src="getFileUrl(foto.url)" :alt="foto.nombre" class="foto-grande" />

        </div>

      </v-carousel-item>

    </v-carousel>

  </div>

</v-dialog>

<!-- =====================================================
       DIALOG VIDEO
  ====================================================== -->

<v-dialog v-model="dialogVideo" max-width="900" width="95%">

  <div class="visor-video">

    <div class="video-header">

      <strong>
        {{ videoActual?.nombre || 'Video' }}
      </strong>

      <v-btn icon="mdi-close" variant="text" @click="cerrarVideo" />

    </div>

    <div class="video-reproductor">

      <video v-if="videoActual" :src="getFileUrl(videoActual.url)" controls autoplay playsinline />

    </div>

  </div>

</v-dialog>
</template>

<script>
import {
  getServicesById
} from '../../servicios/services/servicio.api';

export default {

  name: 'DescripcionServicioProfesionalAdmin',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    servicioId: {
      type: [Number, String],
      required: true
    }

  },

  emits: ['agendar', 'update:modelValue'],

  data() {

    return {

      // Dialog principal
      mediaActual: 0,

      // Servicio
      servicio: null,

      // Estado
      cargando: false,
      error: null,

      // Fotos
      dialogFoto: false,
      fotoActual: 0,

      // Videos
      dialogVideo: false,
      videoActual: null

    }

  },

  computed: {

  galeria() {

    if (!this.servicio?.archivos) {
      return []
    }

    return [...this.servicio.archivos]
      .sort(
        (a, b) =>
          Number(a.orden || 0) -
          Number(b.orden || 0)
      )

  },

  fotos() {

    if (!this.servicio?.archivos) {
      return []
    }

    return [...this.servicio.archivos]
      .filter(
        archivo => archivo.tipo === 'FOTO'
      )
      .sort(
        (a, b) =>
          Number(a.orden || 0) -
          Number(b.orden || 0)
      )

  },

  videos() {

    if (!this.servicio?.archivos) {
      return []
    }

    return [...this.servicio.archivos]
      .filter(
        archivo => archivo.tipo === 'VIDEO'
      )
      .sort(
        (a, b) =>
          Number(a.orden || 0) -
          Number(b.orden || 0)
      )

  },

  condicion() {

    if (!this.servicio) {
      return null
    }

    return this.servicio.condicion || null

  }

},

  watch: {

    servicioId: {

      immediate: true,

      handler() {

        this.cargarServicio()

      }

    }

  },

  methods: {

    seleccionarMedia(index) {

      this.mediaActual = index

    },

    abrirFotoDesdeGaleria(archivo) {

      if (!archivo || archivo.tipo !== 'FOTO') {
        return
      }

      const index = this.fotos.findIndex(
        foto => foto.id === archivo.id
      )

      if (index === -1) {
        return
      }

      this.fotoActual = index
      this.dialogFoto = true

    },

    // ============================================
    // CARGAR SERVICIO
    // ============================================

    async cargarServicio() {

      if (!this.servicioId) {
        return
      }

      try {
        this.cargando = true
        this.error = null

        const res = await getServicesById(this.servicioId)
        console.log('CARGAR SERVICIO: ', res.data.data)
        const data = res.data?.data
        this.servicio = {
          ...data.servicio,
          condicion: data.servicio.condicion || null,
          profesional: data.profesional || null
        }

        const principal = this.galeria.findIndex(
          archivo => archivo.principal === true
        )
        this.mediaActual = principal >= 0 ? principal : 0

      } catch (error) {
        console.error('ERROR AL CARGAR SERVICIO:', error)
        this.error = error.response?.data?.message || 'No se pudo cargar la información del servicio.'

      } finally {
        this.cargando = false
      }

    },

    // ============================================
    // CERRAR DIALOG PRINCIPAL
    // ============================================

    cerrar() {
      this.$emit('update:modelValue', false)      
    },

    // ============================================
    // ABRIR FOTO
    // ============================================

    abrirFoto(index) {

      this.fotoActual = index

      this.dialogFoto = true

    },

    // ============================================
    // CERRAR FOTO
    // ============================================

    cerrarFoto() {

      this.dialogFoto = false

    },

    // ============================================
    // ABRIR VIDEO
    // ============================================

    abrirVideo(video) {

      this.videoActual = video

      this.dialogVideo = true

    },

    // ============================================
    // CERRAR VIDEO
    // ============================================

    cerrarVideo() {

      this.dialogVideo = false

      this.videoActual = null

    },

    // ============================================
    // AGENDAR
    // ============================================

    agendarCita() {
      this.$router.push({name: 'horario', params: { profesionalId: this.servicio.profesional.id}})
      // this.$emit(
      //   'agendar',
      //   this.servicio
      // )

    },

    // ============================================
    // URL ARCHIVOS
    // ============================================

    getFileUrl(url) {

      if (!url) {
        return ''
      }

      if (url.startsWith('http')) {
        return url
      }

      return `${import.meta.env.VITE_SERVER_URL}${url}`

    }

  }

}
</script>

<style lang="scss" scoped>
/* =====================================================
   DIALOG PRINCIPAL
===================================================== */

.dialog-servicio {
  width: 100%;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  min-height: 54px;
  padding: 0 10px 0 16px;
  border-bottom: 1px solid #e8eeee;
}

.dialog-header strong {
  flex: 1;
  color: #123b63;
  font-size: 16px;
}

.dialog-contenido {
  padding: 16px;
}

/* =====================================================
   ESTADO
===================================================== */

.estado {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #718096;
  text-align: center;
}

.estado.error {
  color: #c62828;
}

/* =====================================================
   SERVICIO
===================================================== */

.servicio-header {
  margin-bottom: 20px;
}

.servicio-titulo h2 {
  margin: 0 0 8px;
  color: #123b63;
  font-size: 20px;
  font-weight: 700;
}

.datos-basicos {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.datos-basicos span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6b7c8f;
  font-size: 12px;
}

.datos-basicos strong {
  color: #0f9b9d;
  font-size: 18px;
}

/* =====================================================
   SECCIONES
===================================================== */

.seccion {
  margin-bottom: 22px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  color: #123b63;
  font-size: 14px;
}

.section-title .v-icon {
  color: #0f9b9d;
}

.section-title span {
  margin-left: auto;
  color: #7b8b98;
  font-size: 11px;
}

/* =====================================================
   DESCRIPCIÓN
===================================================== */

.descripcion {
  margin: 0;
  color: #526579;
  font-size: 13px;
  line-height: 1.6;
}

/* =====================================================
   FOTOS
===================================================== */

.fotos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.foto-item {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 7px;
  background: #f2f5f5;
  cursor: pointer;
}

.foto-item img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.foto-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, .25);

  opacity: 0;

  transition: opacity .2s ease;
}

.foto-item:hover .foto-overlay {
  opacity: 1;
}

/* =====================================================
   VIDEOS
===================================================== */

.videos-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.video-card {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 7px;

  border: 1px solid #e2e9e9;
  border-radius: 9px;

  cursor: pointer;

  transition: .2s;
}

.video-card:hover {
  background: #f6fbfb;
}

.video-preview {
  position: relative;
  width: 82px;
  height: 58px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
  background: #111;
}

.video-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, .2);
}

.video-info {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
}

.video-info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: #123b63;
  font-size: 12px;
}

.video-info span {
  color: #7b8b98;
  font-size: 10px;
}

/* =====================================================
   CONDICIÓN
===================================================== */

.condicion-section {
  margin-top: 10px;
  margin-bottom: 22px;
  padding: 14px;

  border-radius: 10px;

  background: #f1f9fa;
  border: 1px solid #d8eeee;
}

.condicion-descripcion {
  margin: 0 0 12px;

  color: #526579;
  font-size: 12px;
  line-height: 1.5;
}

.condicion-item {
  display: flex;
  gap: 10px;

  padding: 10px 0;

  border-top: 1px solid #dceced;
}

.condicion-item:first-of-type {
  border-top: none;
}

.condicion-item>.v-icon {
  flex-shrink: 0;
  color: #0f9b9d;
}

.condicion-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.condicion-item strong {
  color: #123b63;
  font-size: 12px;
}

.condicion-item span {
  color: #5d7082;
  font-size: 11px;
  line-height: 1.5;
}

/* =====================================================
   AGENDAR
===================================================== */

.agendar-container {
  padding-top: 4px;
}

.btn-agendar {
  background: #0f9b9d !important;
  color: white !important;
  font-weight: 700;
  border-radius: 9px;
}

/* =====================================================
   VISOR FOTOS
===================================================== */

.visor-fotos {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;

  background: #000;
}

.visor-header {
  height: 58px;
  min-height: 58px;

  display: flex;
  align-items: center;

  padding: 0 12px;

  background: rgba(0, 0, 0, .9);
  color: white;

  z-index: 10;
}

.visor-header strong {
  flex: 1;
  font-size: 15px;
}

.visor-header span {
  margin-right: 8px;
  font-size: 12px;
  opacity: .8;
}

.visor-carousel {
  flex: 1;
  width: 100%;
  background: #000;
}

.visor-carousel :deep(.v-window__container) {
  height: 100% !important;
}

.foto-grande-container {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #000;
}

.foto-grande {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* =====================================================
   VISOR VIDEO
===================================================== */

.visor-video {
  width: 100%;
  background: #000;
  overflow: hidden;
  border-radius: 8px;
}

.video-header {
  min-height: 52px;

  display: flex;
  align-items: center;

  padding: 0 10px 0 15px;

  background: white;
}

.video-header strong {
  flex: 1;
  color: #123b63;
  font-size: 14px;
}

.video-reproductor {
  width: 100%;
  background: #000;
}

.video-reproductor video {
  display: block;

  width: 100%;
  max-height: 75vh;

  margin: 0 auto;
}

/* =====================================================
   MÓVIL
===================================================== */

@media (max-width: 600px) {

  .dialog-contenido {
    padding: 14px;
  }

  .servicio-titulo h2 {
    font-size: 18px;
  }

  .fotos-grid {
    gap: 3px;
  }

  .foto-item {
    border-radius: 5px;
  }

  .video-preview {
    width: 75px;
    height: 54px;
  }

}

/* =====================================================
   GALERÍA PRINCIPAL
===================================================== */

.galeria-principal {
  margin-bottom: 20px;
}

.galeria-main {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  background: #111;
}

.galeria-carousel {
  width: 100%;
}

.media-principal {
  position: relative;
  width: 100%;
  height: 300px;
  cursor: pointer;
  background: #111;
}

.media-principal img,
.media-principal video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}


/* CONTADOR */

.galeria-contador {
  position: absolute;

  top: 10px;
  right: 10px;

  padding: 5px 9px;

  border-radius: 20px;

  background: rgba(0, 0, 0, .65);
  color: white;

  font-size: 11px;
  font-weight: 600;

  z-index: 5;
}


/* VIDEO PRINCIPAL */

.video-principal {
  position: relative;
}

.video-play-principal {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, .25);
}


/* MINIATURAS */

.galeria-miniaturas {
  display: flex;

  gap: 7px;

  margin-top: 7px;

  overflow-x: auto;

  padding-bottom: 2px;
}

.miniatura {
  position: relative;

  width: 82px;
  height: 62px;

  flex: 0 0 82px;

  overflow: hidden;

  border-radius: 7px;

  background: #111;

  cursor: pointer;

  border: 2px solid transparent;

  transition:
    border-color .2s ease,
    transform .2s ease;
}

.miniatura:hover {
  transform: translateY(-1px);
}

.miniatura.activa {
  border-color: #0f9b9d;
}

.miniatura img,
.miniatura video {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}


/* MINIATURA VIDEO */

.miniatura-video {
  position: relative;

  width: 100%;
  height: 100%;
}

.miniatura-play {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, .25);
}
</style>
