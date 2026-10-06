<template>
<div>
  <!-- ============================================================
         BOTTOM SHEET
    ============================================================= -->

  <v-bottom-sheet v-model="sheetAbierto" inset>
    <v-card rounded="t-xl" class="sheet-videos">
      <!-- INDICADOR SUPERIOR -->
      <div class="sheet-indicador"></div>

      <!-- ========================================================
             HEADER
        ========================================================= -->

      <div class="sheet-header">
        <div class="sheet-header-info">
          <div class="sheet-icono">
            <v-icon size="22">
              mdi-video-multiple
            </v-icon>
          </div>

          <div>
            <div class="sheet-titulo">
              Videos del servicio
            </div>

            <div class="sheet-subtitulo">
              Agrega hasta 2 videos
            </div>
          </div>
        </div>

        <v-btn icon="mdi-close" variant="tonal" color="secondary" size="small" :disabled="procesando" @click="cerrar" />
      </div>

      <v-divider />

      <!-- ========================================================
             CONTENIDO
        ========================================================= -->

      <div class="contenido-videos">

        <!-- CONTADOR -->
        <div class="contador-container">
          <div class="contador">
            {{ videos.length }}/{{ MAX_VIDEOS }} videos
          </div>

          <div class="contador-info">
            Máximo {{ MAX_VIDEOS }} videos
          </div>
        </div>

        <!-- ======================================================
               GALERÍA
          ======================================================= -->

        <draggable v-model="videos" item-key="id" class="videos-grid" handle=".drag-handle" animation="200" ghost-class="video-ghost" chosen-class="video-chosen" drag-class="video-drag" :disabled="procesando" @end="ordenVideosCambio">
          <!-- VIDEO -->
          <template #item="{ element, index }">
            <div class="video-item">

              <div class="video-card">

                <!-- VIDEO -->
                <div class="video-preview-container" @click.stop="abrirVisor(element)">
                  <video :src="element.preview" class="video-preview" preload="metadata" playsinline />

                  <!-- PLAY -->
                  <div class="video-play">
                    <v-icon size="30">
                      mdi-play
                    </v-icon>
                  </div>
                </div>

                <!-- NUMERO -->
                <div class="video-numero">
                  {{ index + 1 }}
                </div>

                <!-- ELIMINAR -->
                <v-btn icon="mdi-delete" size="small" density="comfortable" variant="flat" class="btn-eliminar" :disabled="procesando" @click.stop="eliminarVideo(index)" />

                <!-- DRAG -->
                <div class="video-footer">
                  <span>
                    Arrastra para ordenar
                  </span>

                  <v-icon class="drag-handle" size="20">
                    mdi-drag
                  </v-icon>
                </div>

              </div>
            </div>
          </template>

          <!-- ====================================================
                 AGREGAR VIDEO
            ===================================================== -->

          <template #footer>
            <div v-if="videos.length < MAX_VIDEOS" class="video-item">
              <button type="button" class="agregar-video-card" :disabled="procesando" @click="seleccionarVideos">
                <div class="agregar-icono">
                  <v-icon size="28">
                    mdi-video-plus
                  </v-icon>
                </div>

                <div class="agregar-titulo">
                  Agregar video
                </div>

                <div class="agregar-disponibles">
                  {{ MAX_VIDEOS - videos.length }}
                  {{
                      MAX_VIDEOS - videos.length === 1
                       ?"disponible"
                        : "disponibles"
                    }}
                </div>
              </button>
            </div>
          </template>
        </draggable>

        <!-- ======================================================
               SI NO HAY VIDEOS
          ======================================================= -->

        <div v-if="videos.length === 0" class="estado-vacio">
          <v-icon size="42">
            mdi-video-outline
          </v-icon>

          <div class="estado-titulo">
            No hay videos
          </div>

          <div class="estado-subtitulo">
            Agrega hasta 2 videos para mostrar tu trabajo.
          </div>
        </div>

        <!-- INPUT OCULTO -->
        <input ref="inputVideos" type="file" accept="video/mp4,video/webm,video/quicktime,video/*" multiple hidden @change="procesarVideos" />

        <!-- INFORMACIÓN -->
        <v-alert type="info" variant="tonal" density="compact" class="info-alert" icon="mdi-information-outline">
          <div class="info-texto">
            <strong>Consejo:</strong>
            utiliza videos cortos y claros donde se pueda apreciar
            el proceso o resultado de tu trabajo.
          </div>
        </v-alert>

        <div class="formatos-info">
          <v-icon size="16">
            mdi-file-video-outline
          </v-icon>

          <span>
            Formatos recomendados: MP4, WebM o MOV
          </span>
        </div>

      </div>

      <!-- ========================================================
             FOOTER
        ========================================================= -->

      <div class="sheet-footer">

        <v-btn variant="tonal" color="error" prepend-icon="mdi-close" class="btn-cancelar" :disabled="procesando" @click="cerrar">
          Cancelar
        </v-btn>

        <v-btn color="primary" prepend-icon="mdi-content-save-outline" class="btn-guardar" :loading="procesando" :disabled="!servicioId" @click="guardar">
          Guardar videos
        </v-btn>

      </div>

    </v-card>
  </v-bottom-sheet>

  <!-- ============================================================
         VISOR DE VIDEOS
    ============================================================= -->

  <v-dialog v-model="visorVideo" fullscreen transition="dialog-bottom-transition" scrim="black">
    <div class="visor-video">

      <!-- HEADER -->
      <div class="visor-header">

        <div class="visor-contador">
          {{ indiceVideoSeleccionado + 1 }}
          /
          {{ videos.length }}
        </div>

        <v-btn icon="mdi-close" variant="text" size="large" class="visor-cerrar" @click="cerrarVisor" />

      </div>

      <!-- ANTERIOR -->
      <v-btn v-if="indiceVideoSeleccionado > 0" icon="mdi-chevron-left" variant="flat" class="visor-navegacion visor-anterior" @click.stop="videoAnterior" />

      <!-- VIDEO -->
      <div class="visor-video-container">
        <video v-if="videoSeleccionado" :key="videoSeleccionado.id" :src="videoSeleccionado.preview" class="visor-video-element" controls autoplay playsinline />
      </div>

      <!-- SIGUIENTE -->
      <v-btn v-if="indiceVideoSeleccionado < videos.length - 1" icon="mdi-chevron-right" variant="flat" class="visor-navegacion visor-siguiente" @click.stop="videoSiguiente" />

      <!-- FOOTER -->
      <div class="visor-footer">
        <span>
          Video {{ indiceVideoSeleccionado + 1 }}
          de {{ videos.length }}
        </span>
      </div>

    </div>
  </v-dialog>
</div>
</template>

<script>
import draggable from "vuedraggable";

import {
  deleteServiceFile,
  updateServiceFileOrder,
  uploadServiceVideos,
} from "../services/servicioArchivo.api.js";

export default {
  name: "EditarVideosAdmin",

  components: {
    draggable,
  },

  props: {
    // ==========================================================
    // V-MODEL
    // ==========================================================

    modelValue: {
      type: Boolean,
      default: false,
    },

    // ==========================================================
    // ID DEL SERVICIO
    // ==========================================================

    servicioId: {
      type: [Number, String],
      default: null,
    },

    // ==========================================================
    // VIDEOS INICIALES
    // ==========================================================

    videosIniciales: {
      type: Array,
      default: () => [],
    },
  },

  emits: [
    "update:modelValue",
    "guardado",
  ],

  data() {
    return {
      MAX_VIDEOS: 2,

      videos: [],

      procesando: false,

      visorVideo: false,

      videoSeleccionado: null,

      indiceVideoSeleccionado: -1,
    };
  },

  computed: {
    // ==========================================================
    // V-MODEL DEL BOTTOM SHEET
    // ==========================================================

    sheetAbierto: {
      get() {
        return this.modelValue;
      },

      set(valor) {
        this.$emit("update:modelValue", valor);
      },
    },
  },

  watch: {
    // ==========================================================
    // CARGAR VIDEOS CUANDO CAMBIA EL SERVICIO
    // ==========================================================

    videosIniciales: {
      immediate: true,
      deep: true,

      handler(nuevosVideos) {
        if (!this.sheetAbierto) {
          return;
        }

        this.cargarVideosIniciales(nuevosVideos);
      },
    },

    // ==========================================================
    // CUANDO SE ABRE EL SHEET
    // ==========================================================

    modelValue(abierto) {
      if (abierto) {
        this.cargarVideosIniciales(this.videosIniciales);
      } else {
        this.cerrarVisor();
      }
    },
  },

  methods: {
    // ==========================================================
    // CARGAR VIDEOS EXISTENTES
    // ==========================================================
    cargarVideosIniciales(videos) {
      // Limpiar los datos anteriores
      this.videos = [];

      if (!Array.isArray(videos)) {
        return;
      }

      this.videos = videos
        .filter((video) => video?.tipo === "VIDEO")
        .sort((a, b) => {
          return (
            Number(a.orden || 0) -
            Number(b.orden || 0)
          );
        })
        .slice(0, this.MAX_VIDEOS)
        .map((video, index) => ({
          id: video.id ||
            video.archivo_id ||
            `video-${index}`,

          archivoId: video.archivo_id ||
            video.id ||
            null,

          existente: true,

          archivo: null,

          preview: this.obtenerUrlVideo(video.url),

          nombre: video.nombre ||
            "Video del servicio",

          mime_type: video.mime_type ||
            "",

          tamano_bytes: video.tamano_bytes ||
            null,

          orden: Number(video.orden) ||
            index + 1,
        }));
    },

    // ==========================================================
    // URL DEL VIDEO
    // ==========================================================

    obtenerUrlVideo(url) {
      if (!url) {
        return "";
      }

      // URL completa
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("blob:")
      ) {
        return url;
      }

      const baseUrl =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      return `${baseUrl}${url.startsWith("/")?"" : "/"}${url}`;
    },

    // ==========================================================
    // SELECCIONAR VIDEOS
    // ==========================================================

    seleccionarVideos() {
      if (this.procesando) {
        return;
      }

      this.$refs.inputVideos?.click();
    },

    // ==========================================================
    // PROCESAR VIDEOS
    // ==========================================================

    procesarVideos(event) {
      const archivos = Array.from(
        event.target.files || [],
      );

      if (!archivos.length) {
        return;
      }

      const espacioDisponible =
        this.MAX_VIDEOS -
        this.videos.length;

      const archivosAgregar =
        archivos.slice(
          0,
          espacioDisponible,
        );

      archivosAgregar.forEach((archivo) => {
        if (!archivo.type.startsWith("video/")) {
          return;
        }

        const video = {
          id: `${Date.now()}-${Math.random()}`,

          archivo,

          existente: false,

          archivoId: null,

          preview: URL.createObjectURL(archivo),

          nombre: archivo.name,

          mime_type: archivo.type,

          tamano_bytes: archivo.size,

          orden: this.videos.length + 1,
        };

        this.videos.push(video);
      });

      // Permitir volver a seleccionar
      // el mismo archivo.
      event.target.value = "";

      this.normalizarOrden();
    },

    // ==========================================================
    // ELIMINAR VIDEO
    // ==========================================================

    async eliminarVideo(index) {
      const video = this.videos[index];

      if (!video) {
        return;
      }

      // --------------------------------------------------------
      // VIDEO NUEVO
      // --------------------------------------------------------

      if (!video.existente) {
        if (video.preview) {
          URL.revokeObjectURL(
            video.preview,
          );
        }

        this.videos.splice(index, 1);

        this.normalizarOrden();

        return;
      }

      // --------------------------------------------------------
      // VIDEO EXISTENTE
      // --------------------------------------------------------

      if (!video.id) {
        this.videos.splice(index, 1);
        this.normalizarOrden();
        return;
      }

      try {
        this.procesando = true;

        await deleteServiceFile(video.id);

        this.videos.splice(index, 1);

        this.normalizarOrden();

        if (this.$piaAlert) {
          this.$piaAlert.success(
            "Video eliminado correctamente",
          );
        }
      } catch (error) {
        console.error(
          "Error eliminando video:",
          error,
        );

        if (this.$piaAlert) {
          this.$piaAlert.error(
            error?.response?.data?.message ||
            "No se pudo eliminar el video",
          );
        }
      } finally {
        this.procesando = false;
      }
    },

    // ==========================================================
    // CAMBIO DE ORDEN
    // ==========================================================

    ordenVideosCambio() {
      this.normalizarOrden();
    },

    // ==========================================================
    // NORMALIZAR ORDEN LOCAL
    // ==========================================================

    normalizarOrden() {
      this.videos.forEach((video, index) => {
        video.orden = index + 1;
      });
    },

    // ==========================================================
    // GUARDAR
    // ==========================================================

    async guardar() {
      if (!this.servicioId) {
        if (this.$piaAlert) {
          this.$piaAlert.error(
            "No se encontró el ID del servicio",
          );
        }

        return;
      }

      this.normalizarOrden();

      try {
        this.procesando = true;

        // ======================================================
        // 1. SUBIR VIDEOS NUEVOS
        // ======================================================

        const videosNuevos =
          this.videos.filter(
            (video) =>
            !video.existente &&
            video.archivo,
          );

        if (videosNuevos.length) {
          const archivos =
            videosNuevos.map(
              (video) =>
              video.archivo,
            );

          const response =
            await uploadServiceVideos(
              this.servicioId,
              archivos,
            );

          const videosGuardados =
            response?.data?.data || [];

          videosNuevos.forEach(
            (video, index) => {
              const guardado =
                videosGuardados[index];

              if (!guardado) {
                return;
              }

              video.existente = true;

              video.archivoId =
                guardado?.archivo?.id ||
                guardado?.relacion?.archivo_id ||
                null;

              video.id =
                guardado?.relacion?.id ||
                video.id;

              video.nombre =
                guardado?.archivo?.nombre ||
                video.nombre;

              video.mime_type =
                guardado?.archivo?.mime_type ||
                video.mime_type;

              video.tamano_bytes =
                guardado?.archivo?.tamano_bytes ||
                video.tamano_bytes;

              // Si backend devuelve URL,
              // usamos la URL definitiva.
              if (guardado?.archivo?.url) {
                video.preview =
                  this.obtenerUrlVideo(
                    guardado.archivo.url,
                  );
              }

              video.archivo = null;
            },
          );
        }

        // ======================================================
        // 2. NORMALIZAR NUEVAMENTE
        // ======================================================

        this.normalizarOrden();

        // ======================================================
        // 3. GUARDAR ORDEN EN BACKEND
        // ======================================================

        for (
          let index = 0; index < this.videos.length; index++
        ) {
          const video =
            this.videos[index];

          if (!video.existente || !video.id) {
            continue;
          }

          await updateServiceFileOrder(
            video.id,
            index + 1,
          );
        }

        // ======================================================
        // 4. AVISAR AL PADRE
        // ======================================================

        this.$emit(
          "guardado",
          this.videos,
        );

        if (this.$piaAlert) {
          this.$piaAlert.success(
            "Videos guardados correctamente",
          );
        }

        // ======================================================
        // 5. CERRAR
        // ======================================================

        this.cerrar();
      } catch (error) {
        console.error(
          "Error guardando videos:",
          error,
        );

        if (this.$piaAlert) {
          this.$piaAlert.error(
            error?.response?.data?.message ||
            "No se pudieron guardar los videos",
          );
        }
      } finally {
        this.procesando = false;
      }
    },

    // ==========================================================
    // CERRAR SHEET
    // ==========================================================

    cerrar() {
      if (this.procesando) {
        return;
      }

      this.cerrarVisor();

      this.$emit(
        "update:modelValue",
        false,
      );
    },

    // ==========================================================
    // ABRIR VISOR
    // ==========================================================

    abrirVisor(video) {
      const index =
        this.videos.findIndex(
          (item) =>
          item.id === video.id,
        );

      if (index === -1) {
        return;
      }

      this.videoSeleccionado =
        this.videos[index];

      this.indiceVideoSeleccionado =
        index;

      this.visorVideo = true;
    },

    // ==========================================================
    // CERRAR VISOR
    // ==========================================================

    cerrarVisor() {
      this.visorVideo = false;
      this.videoSeleccionado = null;
      this.indiceVideoSeleccionado = -1;
    },

    // ==========================================================
    // VIDEO ANTERIOR
    // ==========================================================

    videoAnterior() {
      if (
        this.indiceVideoSeleccionado <= 0
      ) {
        return;
      }

      this.indiceVideoSeleccionado--;

      this.videoSeleccionado =
        this.videos[
          this.indiceVideoSeleccionado
        ];
    },

    // ==========================================================
    // VIDEO SIGUIENTE
    // ==========================================================

    videoSiguiente() {
      if (
        this.indiceVideoSeleccionado >=
        this.videos.length - 1
      ) {
        return;
      }

      this.indiceVideoSeleccionado++;

      this.videoSeleccionado =
        this.videos[
          this.indiceVideoSeleccionado
        ];
    },
  },

  // ==========================================================
  // LIMPIEZA
  // ==========================================================

  beforeUnmount() {
    this.videos.forEach((video) => {
      if (
        !video.existente &&
        video.preview &&
        video.preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          video.preview,
        );
      }
    });
  },
};
</script>

<style lang="scss" scoped>
/* ============================================================
   SHEET
============================================================ */

.sheet-videos {
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

.sheet-indicador {
  width: 38px;
  height: 4px;
  margin: 10px auto 4px;
  border-radius: 10px;
  background: #cbd5e1;
}

/* ============================================================
   HEADER
============================================================ */

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
}

.sheet-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.sheet-icono {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background: #edf6f6;
  color: #0f9b9d;
}

.sheet-titulo {
  font-size: 17px;
  font-weight: 700;
  color: #102a43;
}

.sheet-subtitulo {
  margin-top: 3px;
  font-size: 12px;
  color: #627d98;
}

/* ============================================================
   CONTENIDO
============================================================ */

.contenido-videos {
  width: 100%;
  padding: 16px 14px 8px;
}

/* ============================================================
   CONTADOR
============================================================ */

.contador-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.contador {
  font-size: 13px;
  font-weight: 700;
  color: #102a43;
}

.contador-info {
  font-size: 10px;
  color: #627d98;
}

/* ============================================================
   GRID
============================================================ */

.videos-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;

  width: 100%;
}

/* ============================================================
   VIDEO ITEM
============================================================ */

.video-item {
  min-width: 0;
}

/* ============================================================
   VIDEO CARD
============================================================ */

.video-card {
  position: relative;

  width: 100%;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  border-radius: 12px;

  background: #edf2f2;

  border: 1px solid #dce8e8;

  box-shadow:
    0 2px 6px rgba(16, 42, 67, 0.08);
}

/* ============================================================
   VIDEO PREVIEW
============================================================ */

.video-preview-container {
  position: absolute;
  inset: 0;

  cursor: pointer;

  background: #101010;
}

.video-preview {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

/* ============================================================
   PLAY
============================================================ */

.video-play {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  background: rgba(15, 143, 145, 0.92);

  color: white;

  pointer-events: none;

  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.25);
}

/* ============================================================
   NUMERO
============================================================ */

.video-numero {
  position: absolute;

  top: 8px;
  left: 8px;

  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(16, 42, 67, 0.88);

  color: white;

  font-size: 11px;
  font-weight: 700;

  z-index: 3;
}

/* ============================================================
   ELIMINAR
============================================================ */

.btn-eliminar {
  position: absolute;

  top: 6px;
  right: 6px;

  width: 28px;
  height: 28px;

  background: rgba(255, 255, 255, 0.94);

  color: #d64545;

  z-index: 5;
}

/* ============================================================
   FOOTER VIDEO
============================================================ */

.video-footer {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 7px 8px;

  background:
    linear-gradient(to top,
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.15));

  color: white;

  font-size: 9px;

  z-index: 4;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

/* ============================================================
   AGREGAR VIDEO
============================================================ */

.agregar-video-card {
  width: 100%;

  aspect-ratio: 1 / 1;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border: 2px dashed #b9d5d5;

  border-radius: 12px;

  background: #f8fbfb;

  color: #0f8f91;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.agregar-video-card:hover {
  border-color: #0f9b9d;
  background: #edf6f6;
}

.agregar-video-card:active {
  transform: scale(0.98);
}

.agregar-video-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ============================================================
   ICONO AGREGAR
============================================================ */

.agregar-icono {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 8px;

  border-radius: 50%;

  background: #dff5f3;

  color: #0f9b9d;
}

.agregar-titulo {
  font-size: 12px;
  font-weight: 700;
}

.agregar-disponibles {
  margin-top: 3px;

  font-size: 10px;

  color: #627d98;
}

/* ============================================================
   ESTADO VACÍO
============================================================ */

.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 30px 20px;

  text-align: center;

  color: #8aa1b2;
}

.estado-vacio .v-icon {
  color: #9bb8c0;
  margin-bottom: 8px;
}

.estado-titulo {
  font-size: 14px;
  font-weight: 700;
  color: #627d98;
}

.estado-subtitulo {
  margin-top: 4px;
  font-size: 11px;
  color: #8aa1b2;
}

/* ============================================================
   ALERT
============================================================ */

.info-alert {
  margin-top: 18px;
  border-radius: 10px;
}

.info-texto {
  font-size: 11px;
  line-height: 1.45;
}

/* ============================================================
   FORMATOS
============================================================ */

.formatos-info {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  margin-top: 12px;

  color: #627d98;

  font-size: 10px;
}

/* ============================================================
   FOOTER SHEET
============================================================ */

.sheet-footer {
  display: flex;

  gap: 10px;

  padding: 12px 14px 14px;

  border-top: 1px solid #e5eeee;
}

.btn-cancelar,
.btn-guardar {
  flex: 1;

  height: 44px;

  border-radius: 10px;

  font-size: 12px;

  font-weight: 700;
}

/* ============================================================
   DRAG
============================================================ */

.video-ghost {
  opacity: 0.4;
}

.video-chosen {
  transform: scale(1.02);
}

.video-drag {
  opacity: 0.9;
}

/* ============================================================
   VISOR
============================================================ */

.visor-video {
  position: relative;

  width: 100%;
  height: 100%;

  background: #050505;

  display: flex;

  align-items: center;
  justify-content: center;
}

/* ============================================================
   VISOR HEADER
============================================================ */

.visor-header {
  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 14px;

  background:
    linear-gradient(to bottom,
      rgba(0, 0, 0, 0.75),
      transparent);

  z-index: 10;
}

.visor-contador {
  color: white;

  font-size: 14px;

  font-weight: 600;
}

.visor-cerrar {
  color: white !important;
}

/* ============================================================
   VISOR VIDEO
============================================================ */

.visor-video-container {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 70px 55px;
}

.visor-video-element {
  max-width: 100%;
  max-height: 100%;

  width: auto;
  height: auto;

  object-fit: contain;

  background: #000;
}

/* ============================================================
   NAVEGACIÓN VISOR
============================================================ */

.visor-navegacion {
  position: absolute;

  top: 50%;

  transform: translateY(-50%);

  width: 44px;
  height: 44px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.15) !important;

  color: white !important;

  z-index: 12;
}

.visor-anterior {
  left: 10px;
}

.visor-siguiente {
  right: 10px;
}

/* ============================================================
   VISOR FOOTER
============================================================ */

.visor-footer {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  height: 58px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    linear-gradient(to top,
      rgba(0, 0, 0, 0.75),
      transparent);

  color: white;

  font-size: 12px;

  z-index: 10;
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 360px) {
  .contenido-videos {
    padding-left: 10px;
    padding-right: 10px;
  }

  .videos-grid {
    gap: 8px;
  }

  .sheet-footer {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
