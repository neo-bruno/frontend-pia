<template>
<div class="videos-admin">
  <!-- Encabezado -->
  <header class="encabezado">    
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div>
      <h1>Videos del negocio</h1>
      <p>Presenta tu negocio con videos.</p>
    </div>
  </header>

  <!-- Información -->
  <section class="aviso">
    <v-icon size="22">mdi-information-outline</v-icon>
    <p>
      Sube videos para que tus clientes conozcan tu negocio.
      Puedes tener hasta 2 videos.
    </p>
  </section>

  <!-- Resumen -->
  <section class="resumen">
    <div class="icono-resumen">
      <v-icon size="27">mdi-video-outline</v-icon>
    </div>

    <div class="resumen-info">
      <strong>Galería de videos</strong>
      <span>{{ videos.length }} de 2 videos</span>

      <v-progress-linear :model-value="videos.length * 50" color="teal" rounded height="6" />
    </div>
  </section>

  <!-- Selector -->
  <input ref="selectorVideos" type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden @change="seleccionarVideos" />

  <button v-if="videos.length < 2" class="zona-subida" :disabled="subiendo" @click="$refs.selectorVideos.click()">
    <v-progress-circular v-if="subiendo" indeterminate color="teal" size="30" />

    <v-icon v-else size="36">mdi-video-plus-outline</v-icon>

    <strong>
      {{ subiendo?"Subiendo videos..." : "Agregar videos" }}
    </strong>

    <span>MP4, WEBM o MOV · Máximo 20 MB por video</span>
  </button>

  <!-- Cargando -->
  <div v-if="cargando" class="estado">
    <v-progress-circular indeterminate color="teal" />
    <span>Cargando videos...</span>
  </div>

  <!-- Lista -->
  <div v-else-if="videos.length" class="lista-videos">
    <article v-for="(video, index) in videos" :key="video.negocio_archivo_id" class="video-card">
      <div class="video-miniatura">
        <video :src="urlVideo(video.url)" preload="metadata" playsinline controls />

        <span class="numero-video">
          {{ index + 1 }}
        </span>
      </div>

      <div class="video-info">
        <strong>{{ video.nombre || `Video ${index + 1}` }}</strong>

        <span class="etiqueta-video">
          <v-icon size="14">mdi-check-circle-outline</v-icon>
          Video del negocio
        </span>

        <button class="btn-reproducir" @click="abrirVisor(video)">
          <v-icon size="17">mdi-play-circle-outline</v-icon>
          Ver video
        </button>
      </div>

      <button class="btn-eliminar" :disabled="procesandoId === video.negocio_archivo_id" aria-label="Quitar video" @click="confirmarEliminar(video)">
        <v-icon>mdi-trash-can-outline</v-icon>
      </button>
    </article>
  </div>

  <!-- Sin videos -->
  <div v-else-if="!cargando" class="vacio">
    <div class="vacio-icono">
      <v-icon size="42">mdi-video-off-outline</v-icon>
    </div>

    <strong>Aún no tienes videos</strong>

    <span>
      Agrega videos para mostrar tu negocio de una forma más atractiva.
    </span>
  </div>

  <!-- Visor -->
  <v-dialog v-model="dialogVisor" fullscreen>
    <v-card class="visor">
      <header class="visor-header">
        <div class="visor-titulo">
          <v-icon color="white">mdi-video-outline</v-icon>

          <div>
            <strong>{{ videoVisor?.nombre || "Video del negocio" }}</strong>
            <span>Vista previa</span>
          </div>
        </div>

        <v-btn icon="mdi-close" variant="tonal" color="white" aria-label="Cerrar visor" @click="cerrarVisor" />
      </header>

      <main class="visor-contenido">
        <video v-if="videoVisor" :key="videoVisor.negocio_archivo_id" :src="urlVideo(videoVisor.url)" class="video-grande" controls autoplay playsinline />
      </main>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import {
  url
} from "@/utils/config";

import {
  listarArchivosNegocio,
  subirVideosNegocio,
  eliminarArchivoNegocio,
} from "../services/negocioArchivo.api";

const MAX_VIDEOS = 2;
const MAX_BYTES = 20 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export default {
  name: "NegocioVideosAdmin",

  data() {
    return {
      videos: [],
      cargando: false,
      subiendo: false,
      procesandoId: null,
      dialogVisor: false,
      videoVisor: null,
    };
  },

  mounted() {
    this.cargarVideos();
  },

  methods: {
    async cargarVideos() {
      this.cargando = true;

      try {
        const respuesta = await listarArchivosNegocio();
        const data = respuesta.data?.data?? respuesta.data;

        this.videos = (Array.isArray(data)?data : [])
          .filter((archivo) => archivo.tipo === "VIDEO")
          .sort((a, b) => Number(a.orden) - Number(b.orden));
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudieron cargar los videos.",
          "error",
        );
      } finally {
        this.cargando = false;
      }
    },

    async seleccionarVideos(evento) {
      const archivos = Array.from(evento.target.files || []);

      // Permite volver a seleccionar el mismo archivo.
      evento.target.value = "";

      if (!archivos.length) return;

      const disponibles = MAX_VIDEOS - this.videos.length;

      if (archivos.length > disponibles) {
        this.notificar(
          `Solo puedes agregar ${disponibles} video(s) más.`,
          "warning",
        );
        return;
      }

      for (const archivo of archivos) {
        if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
          this.notificar(
            `${archivo.name} no tiene un formato permitido.`,
            "error",
          );
          return;
        }

        if (archivo.size > MAX_BYTES) {
          this.notificar(
            `${archivo.name} supera el límite de 20 MB.`,
            "error",
          );
          return;
        }
      }

      this.subiendo = true;

      try {
        await subirVideosNegocio(archivos);
        await this.cargarVideos();

        this.notificar(
          "Los videos se subieron correctamente.",
          "success",
        );
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudieron subir los videos.",
          "error",
        );
      } finally {
        this.subiendo = false;
      }
    },

    urlVideo(ruta) {
      if (!ruta) return "";

      if (/^https?:\/\//i.test(ruta)) {
        return ruta;
      }

      const base = String(url || "")
        .replace(/\/+$/, "")
        .replace(/\/api$/i, "");

      return `${base}/${String(ruta).replace(/^\/+/, "")}`;
    },

    abrirVisor(video) {
      this.videoVisor = video;
      this.dialogVisor = true;
    },

    cerrarVisor() {
      this.dialogVisor = false;
      this.videoVisor = null;
    },

    async confirmarEliminar(video) {
      const confirmar = await this.$piaAlert.confirm({
        title: "Quitar video",
        message: `¿Deseas quitar "${video.nombre || "este video"}" de la galería?`,
        confirmText: "Sí, quitar",
        cancelText: "Cancelar",
      });

      if (confirmar !== true) return;

      this.procesandoId = video.negocio_archivo_id;

      try {
        await eliminarArchivoNegocio(video.negocio_archivo_id);

        if (
          this.videoVisor?.negocio_archivo_id ===
          video.negocio_archivo_id
        ) {
          this.cerrarVisor();
        }

        await this.cargarVideos();

        this.notificar(
          "Video quitado de la galería.",
          "success",
        );
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo quitar el video.",
          "error",
        );
      } finally {
        this.procesandoId = null;
      }
    },

    volver() {
      this.$router.back();
    },

    notificar(mensaje, tipo = "info") {
      const opciones = {
        title: tipo === "success" ?
          "Correcto" :
          tipo === "error" ?
          "Error" :
          tipo === "warning" ?
          "Atención" :
          "Información",
      };

      if (tipo === "success") {
        this.$piaAlert.success(mensaje, opciones);
      } else if (tipo === "error") {
        this.$piaAlert.error(mensaje, opciones);
      } else if (tipo === "warning") {
        this.$piaAlert.warning(mensaje, opciones);
      } else {
        this.$piaAlert.info(mensaje, opciones);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.videos-admin {
  --teal: #079da2;
  --teal-oscuro: #087f86;
  --texto: #17324d;
  --secundario: #71869c;
  --borde: #e4edf2;

  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 16px 100px;
  color: var(--texto);
}

.encabezado {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
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

.encabezado h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}

.encabezado p {
  margin: 5px 0 0;
  color: var(--secundario);
  font-size: 12px;
}

.aviso {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px;
  border-radius: 14px;
  background: #eef8fa;
  color: var(--teal-oscuro);
}

.aviso p {
  margin: 0;
  color: #526f85;
  font-size: 12px;
  line-height: 1.6;
}

.resumen {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  margin: 13px 0;
  border: 1px solid var(--borde);
  border-radius: 16px;
}

.icono-resumen,
.vacio-icono {
  display: grid;
  place-items: center;
  color: var(--teal);
  background: #e7f7f7;
  border-radius: 13px;
}

.icono-resumen {
  width: 48px;
  height: 48px;
}

.resumen-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.resumen-info strong {
  font-size: 13px;
}

.resumen-info span {
  color: var(--secundario);
  font-size: 12px;
}

.zona-subida {
  width: 100%;
  min-height: 125px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 18px;
  margin-bottom: 15px;
  border: 1.5px dashed #18aeb1;
  border-radius: 16px;
  background: #f7fcfc;
  color: var(--teal);
}

.zona-subida strong {
  font-size: 15px;
}

.zona-subida span {
  color: #657d93;
  font-size: 12px;
  text-align: center;
}

.lista-videos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 40px;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--borde);
  border-radius: 16px;
  background: white;
  box-shadow: 0 3px 12px rgba(24, 62, 83, 0.04);
}

.video-miniatura {
  position: relative;
  grid-column: 1 / -1;
  overflow: hidden;
  border-radius: 11px;
  background: #101820;
}

.video-miniatura video {
  display: block;
  width: 100%;
  max-height: 230px;
  aspect-ratio: 16 / 9;
  object-fit: contain;
}

.numero-video {
  position: absolute;
  top: 9px;
  left: 9px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--teal);
  color: white;
  font-size: 13px;
  font-weight: 800;
  pointer-events: none;
}

.video-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
}

.video-info>strong {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-size: 12px;
}

.etiqueta-video {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--teal-oscuro);
  font-size: 11px;
}

.btn-reproducir {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  border: 1px solid var(--borde);
  border-radius: 9px;
  background: white;
  color: var(--texto);
  font-size: 12px;
}

.btn-eliminar {
  width: 38px;
  height: 38px;
  justify-self: end;
  align-self: end;
  display: grid;
  place-items: center;
  border: 1px solid #ffe0e3;
  border-radius: 10px;
  background: white;
  color: #e53948;
}

.estado,
.vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 30px 18px;
  color: var(--secundario);
  text-align: center;
  font-size: 13px;
}

.vacio {
  border: 1px dashed var(--borde);
  border-radius: 16px;
}

.vacio-icono {
  width: 76px;
  height: 76px;
  border-radius: 22px;
}

.vacio strong {
  color: var(--texto);
  font-size: 15px;
}

.vacio span {
  max-width: 260px;
  line-height: 1.6;
}

.visor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0 !important;
  background: #101418 !important;
  color: white;
}

.visor-header {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: #101418;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.visor-titulo {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.visor-titulo>div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.visor-titulo strong {
  max-width: 65vw;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visor-titulo span {
  color: #aebbc6;
  font-size: 11px;
}

.visor-contenido {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #101418;
}

.video-grande {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 600px) {
  .video-card {
    grid-template-columns: minmax(0, 1fr) 44px;
    padding: 14px;
  }

  .video-miniatura video {
    max-height: 340px;
  }
}

@media (max-width: 380px) {
  .videos-admin {
    padding: 12px 10px 95px;
  }

  .encabezado h1 {
    font-size: 20px;
  }
}
</style>
