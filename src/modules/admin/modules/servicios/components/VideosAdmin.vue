<template>
<div class="videos-container">

  <!-- =========================================
         HEADER
    ========================================== -->

  <div class="seccion-header">

    <div class="seccion-icono">
      <v-icon size="22">
        mdi-video-multiple
      </v-icon>
    </div>

    <div class="seccion-header-texto">

      <div class="seccion-titulo">
        Videos del servicio
      </div>

      <div class="seccion-subtitulo">
        Muestra tu trabajo con hasta 2 videos
      </div>

    </div>

  </div>

  <!-- =========================================
         INFORMACIÓN
    ========================================== -->

  <v-alert type="info" variant="tonal" density="compact" class="info-alert" icon="mdi-information-outline">
    <div class="info-texto">
      <strong>Los videos son opcionales.</strong>
      Puedes agregar hasta 2 videos para mostrar
      mejor el resultado de tu servicio.
    </div>
  </v-alert>

  <!-- =========================================
         CONTADOR
    ========================================== -->

  <div class="contador-container">

    <div class="contador">
      {{ videos.length }}/2 videos agregados
    </div>

    <div class="contador-info">
      Máximo 2 videos
    </div>

  </div>

  <!-- =========================================
         GRID
    ========================================== -->

  <div class="videos-grid">

    <!-- VIDEOS -->
    <div v-for="(video, index) in videos" :key="video.id" class="video-item">

      <div class="video-card">

        <!-- VIDEO -->
        <video :src="video.preview" class="video-preview" controls preload="metadata" />

        <!-- NUMERO -->
        <div class="video-numero">
          {{ index + 1 }}
        </div>

        <!-- ELIMINAR -->
        <v-btn icon="mdi-close" size="small" density="comfortable" variant="flat" class="btn-eliminar" @click="eliminarVideo(index)" />

      </div>

    </div>

    <!-- =========================================
           AGREGAR VIDEO
      ========================================== -->

    <div v-if="videos.length < MAX_VIDEOS" class="video-item">

      <button type="button" class="agregar-video-card" @click="seleccionarVideos">

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
                ? "disponible"
                : "disponibles"
            }}
        </div>

      </button>

    </div>

  </div>

  <!-- =========================================
         FORMATOS
    ========================================== -->

  <div class="formatos-info">

    <v-icon size="16">
      mdi-file-video-outline
    </v-icon>

    <span>
      Formatos recomendados: MP4, WebM o MOV
    </span>

  </div>

  <!-- =========================================
         INPUT OCULTO
    ========================================== -->

  <input ref="inputVideos" type="file" accept="video/mp4,video/webm,video/quicktime,video/*" multiple hidden @change="procesarVideos" />

  <!-- =========================================
         CONSEJO
    ========================================== -->

  <v-alert type="info" variant="tonal" density="compact" class="info-alert inferior" icon="mdi-lightbulb-outline">
    <div class="info-texto">
      <strong>Consejo:</strong>
      utiliza videos cortos y claros donde se pueda apreciar
      el proceso o resultado de tu trabajo.
    </div>
  </v-alert>

  <!-- =========================================
         ACCIONES
    ========================================== -->

  <div class="acciones">

    <v-btn variant="outlined" color="secondary" class="btn-accion" @click="$emit('anterior')">
      <v-icon start>
        mdi-arrow-left
      </v-icon>

      Atrás
    </v-btn>

    <v-btn color="primary" class="btn-accion" @click="guardar">
      <v-icon start>
        mdi-content-save-outline
      </v-icon>

      Guardar servicio
    </v-btn>

  </div>

</div>
</template>

<script>
import {
  deleteServiceFile,
  uploadServiceVideos,
} from "@/modules/admin/modules/servicios/services/servicioArchivo.api";

export default {
  name: "VideosAdmin",

  props: {
    // Videos que vienen del servicio cuando estamos editando
    datosIniciales: {
      type: Array,
      default: () => [],
    },

    // ID del servicio
    servicioId: {
      type: [Number, String],
      default: null,
    },

    // "nuevo" | "editar"
    modo: {
      type: String,
      default: "nuevo",
    },
  },

  emits: [
    "anterior",
    "guardar",
  ],

  data() {
    return {
      MAX_VIDEOS: 2,

      videos: [],

      procesando: false,
    };
  },

  computed: {
    esEdicion() {
      return this.modo === "editar";
    },
  },

  watch: {
    datosIniciales: {
      immediate: true,
      deep: true,

      handler(videos) {
        if (!this.esEdicion) {
          return;
        }

        this.cargarVideosIniciales(videos);
      },
    },
  },

  methods: {
    // ============================================================
    // CARGAR VIDEOS EXISTENTES
    // ============================================================

    cargarVideosIniciales(videos) {
      if (!Array.isArray(videos)) {
        this.videos = [];
        return;
      }

      this.videos = videos
        .filter((video) => {
          return video?.tipo === "VIDEO";
        })
        .sort((a, b) => {
          return (
            Number(a.orden || 0) -
            Number(b.orden || 0)
          );
        })
        .slice(0, this.MAX_VIDEOS)
        .map((video) => ({
          id:
            video.id ||
            video.archivo_id,

          archivoId:
            video.archivo_id ||
            video.id,

          existente: true,

          archivo: null,

          preview: this.obtenerUrlVideo(
            video.url
          ),

          nombre:
            video.nombre ||
            "Video del servicio",

          mime_type:
            video.mime_type ||
            "",
        }));
    },

    // ============================================================
    // URL DEL VIDEO
    // ============================================================

    obtenerUrlVideo(url) {
      if (!url) {
        return "";
      }

      // Si ya es una URL completa
      if (
        url.startsWith("http://") ||
        url.startsWith("https://")
      ) {
        return url;
      }

      // Si es una ruta del backend
      const baseUrl =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    },

    // ============================================================
    // SELECCIONAR VIDEOS
    // ============================================================

    seleccionarVideos() {
      this.$refs.inputVideos.click();
    },

    // ============================================================
    // PROCESAR VIDEOS
    // ============================================================

    procesarVideos(event) {
      const archivos = Array.from(
        event.target.files || []
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
          espacioDisponible
        );

      archivosAgregar.forEach((archivo) => {
        if (
          !archivo.type.startsWith(
            "video/"
          )
        ) {
          return;
        }

        const video = {
          id: `${Date.now()}-${Math.random()}`,

          archivo,

          existente: false,

          archivoId: null,

          nombre: archivo.name,

          mime_type: archivo.type,

          preview:
            URL.createObjectURL(
              archivo
            ),
        };

        this.videos.push(video);
      });

      // Permitir volver a seleccionar
      // el mismo archivo.
      event.target.value = "";
    },

    // ============================================================
    // ELIMINAR VIDEO
    // ============================================================

    async eliminarVideo(index) {
      const video =
        this.videos[index];

      if (!video) {
        return;
      }

      // ----------------------------------------------------------
      // VIDEO NUEVO
      // ----------------------------------------------------------

      if (!video.existente) {
        if (video.preview) {
          URL.revokeObjectURL(
            video.preview
          );
        }

        this.videos.splice(index, 1);

        return;
      }

      // ----------------------------------------------------------
      // VIDEO EXISTENTE
      // ----------------------------------------------------------

      if (!video.archivoId) {
        this.videos.splice(index, 1);
        return;
      }

      try {
        this.procesando = true;

        await deleteServiceFile(
          video.id
        );

        this.videos.splice(
          index,
          1
        );

        if (this.$piaAlert) {
          this.$piaAlert.success(
            "Video eliminado correctamente"
          );
        }
      } catch (error) {
        console.error(
          "Error eliminando video:",
          error
        );

        if (this.$piaAlert) {
          this.$piaAlert.error(
            error?.response?.data?.message ||
              "No se pudo eliminar el video"
          );
        }
      } finally {
        this.procesando = false;
      }
    },

    // ============================================================
    // GUARDAR
    // ============================================================

    async guardar() {
      // ----------------------------------------------------------
      // MODO NUEVO
      // ----------------------------------------------------------

      if (!this.esEdicion) {
        this.$emit(
          "guardar",
          this.videos
        );

        return;
      }

      // ----------------------------------------------------------
      // MODO EDITAR
      // ----------------------------------------------------------

      if (!this.servicioId) {
        if (this.$piaAlert) {
          this.$piaAlert.error(
            "No se encontró el ID del servicio"
          );
        }

        return;
      }

      const videosNuevos =
        this.videos.filter(
          (video) =>
            !video.existente &&
            video.archivo
        );

      // No hay videos nuevos
      if (!videosNuevos.length) {
        this.$emit(
          "guardar",
          this.videos
        );

        return;
      }

      try {
        this.procesando = true;

        const archivos =
          videosNuevos.map(
            (video) =>
              video.archivo
          );

        const response =
          await uploadServiceVideos(
            this.servicioId,
            archivos
          );

        const videosGuardados =
          response?.data?.data || [];

        // Convertimos la respuesta del backend
        // al formato que utiliza este componente.
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
          }
        );

        if (this.$piaAlert) {
          this.$piaAlert.success(
            "Videos guardados correctamente"
          );
        }

        this.$emit(
          "guardar",
          this.videos
        );
      } catch (error) {
        console.error(
          "Error subiendo videos:",
          error
        );

        if (this.$piaAlert) {
          this.$piaAlert.error(
            error?.response?.data?.message ||
              "No se pudieron guardar los videos"
          );
        }
      } finally {
        this.procesando = false;
      }
    },
  },

  // ============================================================
  // LIMPIEZA
  // ============================================================

  beforeUnmount() {
    this.videos.forEach((video) => {
      // Solo revocamos URLs creadas
      // mediante createObjectURL.
      if (
        !video.existente &&
        video.preview
      ) {
        URL.revokeObjectURL(
          video.preview
        );
      }
    });
  },
};
</script>

<style lang="scss" scoped>
/* =========================================
   CONTENEDOR
========================================= */

.videos-container {
  width: 100%;

  padding: 18px 12px 24px;
}

/* =========================================
   HEADER
========================================= */

.seccion-header {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 16px;
}

.seccion-icono {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: #edf6f6;

  color: #0f9b9d;

  flex-shrink: 0;
}

.seccion-header-texto {
  min-width: 0;
}

.seccion-titulo {
  font-size: 17px;

  font-weight: 700;

  color: #102a43;
}

.seccion-subtitulo {
  margin-top: 2px;

  font-size: 12px;

  line-height: 1.4;

  color: #627d98;
}

/* =========================================
   ALERT
========================================= */

.info-alert {
  margin-bottom: 18px;

  border-radius: 10px;
}

.info-texto {
  font-size: 11px;

  line-height: 1.45;
}

/* =========================================
   CONTADOR
========================================= */

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

/* =========================================
   GRID
========================================= */

.videos-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;

  width: 100%;
}

.video-item {
  min-width: 0;
}

/* =========================================
   VIDEO CARD
========================================= */

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

.video-preview {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  background: #101010;
}

/* =========================================
   NUMERO
========================================= */

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

  background:
    rgba(16, 42, 67, 0.88);

  color: white;

  font-size: 11px;

  font-weight: 700;

  z-index: 3;
}

/* =========================================
   ELIMINAR
========================================= */

.btn-eliminar {
  position: absolute;

  top: 6px;
  right: 6px;

  width: 28px;
  height: 28px;

  background:
    rgba(255, 255, 255, 0.94);

  color: #d64545;

  z-index: 5;
}

/* =========================================
   AGREGAR VIDEO
========================================= */

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

/* =========================================
   ICONO AGREGAR
========================================= */

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

/* =========================================
   FORMATOS
========================================= */

.formatos-info {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  margin-top: 12px;

  color: #627d98;

  font-size: 10px;
}

/* =========================================
   ALERT INFERIOR
========================================= */

.inferior {
  margin-top: 18px;

  margin-bottom: 18px;
}

/* =========================================
   ACCIONES
========================================= */

.acciones {
  display: flex;

  gap: 10px;

  margin-top: 8px;
}

.btn-accion {
  flex: 1;

  height: 42px;

  border-radius: 10px;

  font-size: 12px;

  font-weight: 700;
}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 360px) {

  .videos-container {
    padding-left: 8px;

    padding-right: 8px;
  }

  .videos-grid {
    gap: 8px;
  }

}

/* =========================================
   DESKTOP
========================================= */

@media (min-width: 600px) {

  .videos-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}
</style>
