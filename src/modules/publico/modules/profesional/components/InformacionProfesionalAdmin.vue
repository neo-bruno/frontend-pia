<template>
<div class="informacion-profesional">

  <!-- =========================
         SOBRE MÍ
    ========================== -->
  <section class="sobre-mi-section">

    <div class="section-title">
      <v-icon size="18">mdi-account-outline</v-icon>
      <strong>Sobre mí</strong>
    </div>

    <p v-if="profesional?.descripcion" class="descripcion">
      {{ profesional.descripcion }}
    </p>

    <!-- LEMA -->
    <div v-if="profesional?.lema" class="lema-card">
      <v-icon class="lema-icon" size="28">
        mdi-format-quote-open
      </v-icon>

      <div class="lema-contenido">
        <p>
          {{ profesional.lema }}
        </p>

        <span>
          — {{ profesional.nombre }}
        </span>
      </div>
    </div>

  </section>

  <!-- =========================
         GALERÍA
    ========================== -->
  <section v-if="fotosGaleria.length" class="galeria-section">

    <div class="section-header">

      <div class="section-title">
        <v-icon size="18">
          mdi-image-multiple-outline
        </v-icon>

        <strong>Galería de trabajos</strong>
      </div>

      <button type="button" class="ver-todas" @click="abrirGaleria(0)">
        Ver todas
        <v-icon size="16">
          mdi-chevron-right
        </v-icon>
      </button>

    </div>

    <!-- FOTOS -->
    <div class="galeria-grid">

      <div v-for="(foto, index) in fotosGaleria" :key="foto.id" class="galeria-item" @click="abrirGaleria(index)">

        <img :src="getFileUrl(foto.url)" :alt="foto.nombre || 'Trabajo realizado'" />

        <div class="galeria-overlay">
          <v-icon size="22">
            mdi-magnify-plus-outline
          </v-icon>
        </div>

      </div>

    </div>

  </section>

  <!-- =========================
         VISOR DE GALERÍA
    ========================== -->
  <v-dialog v-model="dialogGaleria" fullscreen scrim="black">

    <div class="visor-galeria">

      <!-- CABECERA -->
      <div class="visor-header">

        <strong>
          {{ profesional?.nombre || 'Galería' }}
        </strong>

        <span>
          {{ fotoActual + 1 }} / {{ fotosGaleria.length }}
        </span>

        <v-btn icon="mdi-close" variant="text" color="white" size="40" @click="cerrarGaleria" />

      </div>

      <!-- VISOR -->
      <v-carousel v-model="fotoActual" class="visor-carousel" hide-delimiter-background show-arrows="hover" height="100%">

        <v-carousel-item v-for="foto in fotosGaleria" :key="foto.id">

          <div class="foto-contenedor">

            <img :src="getFileUrl(foto.url)" :alt="foto.nombre || 'Trabajo realizado'" class="foto-grande" />

          </div>

        </v-carousel-item>

      </v-carousel>

    </div>

  </v-dialog>

</div>
</template>

<script>
export default {

  name: 'InformacionProfesionalAdmin',

  props: {

    profesional: {
      type: Object,
      default: () => ({})
    },

    galeria: {
      type: Array,
      default: () => []
    }

  },

  data() {
    return {
      dialogGaleria: false,
      fotoActual: 0
    }
  },

  computed: {

    fotosGaleria() {

      return this.galeria
        .filter(foto => foto.tipo === 'FOTO')
        .sort((a, b) => {
          return Number(a.orden || 0) - Number(b.orden || 0)
        })

    }

  },

  methods: {

    abrirGaleria(index) {

      this.fotoActual = index
      this.dialogGaleria = true

    },

    cerrarGaleria() {

      this.dialogGaleria = false

    },

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
.informacion-profesional {
  width: 100%;
}

/* =========================
   SECCIONES
========================= */

.sobre-mi-section,
.galeria-section {
  margin-bottom: 24px;
}

/* =========================
   TÍTULOS
========================= */

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #123b63;
  font-size: 15px;
}

.section-title .v-icon {
  color: #0fa3a8;
}

/* =========================
   DESCRIPCIÓN
========================= */

.descripcion {
  margin: 12px 0 0;
  color: #465b6f;
  font-size: 13px;
  line-height: 1.65;
}

/* =========================
   LEMA
========================= */

.lema-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  margin-top: 16px;
  padding: 12px;

  border-radius: 9px;

  background: #eef9fb;
}

.lema-icon {
  flex-shrink: 0;
  color: #0fa3a8;
}

.lema-contenido {
  flex: 1;
}

.lema-contenido p {
  margin: 0;

  color: #456176;

  font-size: 12px;
  line-height: 1.5;

  font-style: italic;
}

.lema-contenido span {
  display: block;

  margin-top: 5px;

  color: #123b63;

  font-size: 11px;
  font-weight: 600;
}

/* =========================
   VER TODAS
========================= */

.ver-todas {
  display: flex;
  align-items: center;
  gap: 2px;

  padding: 0;

  border: none;
  background: transparent;

  color: #0fa3a8;

  font-size: 11px;
  font-weight: 600;

  cursor: pointer;
}

/* =========================
   GALERÍA
========================= */

.galeria-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 4px;
}

.galeria-item {
  position: relative;

  width: 100%;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  border-radius: 6px;

  background: #f3f3f3;

  cursor: pointer;
}

.galeria-item img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.2s ease;
}

.galeria-item:hover img {
  transform: scale(1.04);
}

.galeria-overlay {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.25);

  opacity: 0;

  transition: opacity 0.2s ease;
}

.galeria-item:hover .galeria-overlay {
  opacity: 1;
}

/* =========================
   VISOR FULLSCREEN
========================= */

.visor-galeria {
  display: flex;
  flex-direction: column;

  width: 100vw;
  height: 100vh;

  background: #000;
}

/* =========================
   CABECERA VISOR
========================= */

.visor-header {
  display: flex;
  align-items: center;

  width: 100%;

  min-height: 56px;
  height: 56px;

  padding: 0 10px;

  background: rgba(0, 0, 0, 0.9);

  color: white;

  z-index: 10;
}

.visor-header strong {
  flex: 1;

  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 15px;
}

.visor-header span {
  margin-right: 4px;

  color: rgba(255, 255, 255, 0.75);

  font-size: 12px;
}

/* =========================
   CARRUSEL
========================= */

.visor-carousel {
  flex: 1;

  width: 100%;

  background: #000;
}

.visor-carousel :deep(.v-window__container) {
  height: 100% !important;
}

.visor-carousel :deep(.v-window-item) {
  height: 100%;
}

/* =========================
   FOTO GRANDE
========================= */

.foto-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background: #000;
}

.foto-grande {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

/* =========================
   MÓVIL
========================= */

@media (max-width: 600px) {

  .section-title {
    font-size: 15px;
  }

  .descripcion {
    font-size: 13px;
    line-height: 1.6;
  }

  .galeria-grid {
    gap: 3px;
  }

  .galeria-item {
    border-radius: 5px;
  }

  .visor-header {
    min-height: 52px;
    height: 52px;
  }

}
</style>
