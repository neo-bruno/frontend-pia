<template>
<div class="favoritos-page">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->
  <section class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">

      <h1>Mis Favoritos</h1>
      <p>Guarda tus negocios, profesionales y servicios.</p>
    </div>
  </section>

  <!-- =====================================================
         FILTROS
    ====================================================== -->
  <div class="filtros-wrapper">

    <button class="filtro" :class="{ activo: filtroActivo === 'TODOS' }" @click="filtroActivo = 'TODOS'">
      Todos

      <span>
        {{ totalFavoritos }}
      </span>
    </button>

    <button class="filtro" :class="{ activo: filtroActivo === 'NEGOCIOS' }" @click="filtroActivo = 'NEGOCIOS'">
      Negocios

      <span>
        {{ negocios.length }}
      </span>
    </button>

    <button class="filtro" :class="{ activo: filtroActivo === 'PROFESIONALES' }" @click="filtroActivo = 'PROFESIONALES'">
      Profesionales

      <span>
        {{ profesionales.length }}
      </span>
    </button>

    <button class="filtro" :class="{ activo: filtroActivo === 'SERVICIOS' }" @click="filtroActivo = 'SERVICIOS'">
      Servicios

      <span>
        {{ servicios.length }}
      </span>
    </button>

  </div>

  <!-- =====================================================
         CARGANDO
    ====================================================== -->
  <div v-if="cargando" class="estado">
    <v-progress-circular indeterminate size="30" width="3" color="primary" />

    <span>
      Cargando favoritos...
    </span>
  </div>

  <!-- =====================================================
         ERROR
    ====================================================== -->
  <div v-else-if="error" class="estado">

    <v-icon size="34" color="error">
      mdi-alert-circle-outline
    </v-icon>

    <strong>
      No pudimos cargar tus favoritos
    </strong>

    <span>
      Intenta nuevamente.
    </span>

    <v-btn size="small" color="primary" variant="flat" rounded="lg" @click="cargarFavoritos">
      Reintentar
    </v-btn>

  </div>

  <!-- =====================================================
         SIN FAVORITOS
    ====================================================== -->
  <div v-else-if="totalFavoritos === 0" class="sin-favoritos">

    <div class="empty-icon">
      <v-icon size="42">
        mdi-heart-outline
      </v-icon>
    </div>

    <h2>
      Aún no tienes favoritos
    </h2>

    <p>
      Cuando encuentres un negocio, profesional
      o servicio que te guste, puedes guardarlo aquí.
    </p>

    <v-btn color="primary" rounded="lg" size="small" variant="flat" class="btn-explorar" @click="irAInicio">
      <v-icon start size="18">
        mdi-magnify
      </v-icon>

      Explorar PIA
    </v-btn>

  </div>

  <!-- =====================================================
         FAVORITOS
    ====================================================== -->
  <div v-else class="favoritos-contenido">

    <!-- ===================================================
           NEGOCIOS
      ==================================================== -->
    <section v-if=" (filtroActivo === 'TODOS' || filtroActivo === 'NEGOCIOS') && negocios.length" class="seccion">

      <div class="seccion-header">

        <div class="seccion-titulo">

          <v-icon size="19" color="primary">
            mdi-store-outline
          </v-icon>

          <h2>
            Negocios
          </h2>

          <span>
            {{ negocios.length }}
          </span>

        </div>

        <button v-if="filtroActivo === 'TODOS' && negocios.length > 3" class="ver-todos" @click="filtroActivo = 'NEGOCIOS'">
          Ver todos
          <v-icon size="16">
            mdi-chevron-right
          </v-icon>
        </button>
      </div>

      <div class="cards-scroll">
        <TarjetaNegocio v-for="negocio in negociosVisibles" :key="negocio.id" :negocio="negocio" @click="abrirNegocioFavorito(negocio)" @favorito="quitarFavorito('NEGOCIO', negocio.id)" />
      </div>

    </section>

    <!-- PROFESIONALES FAVORITOS -->
    <section v-if="(filtroActivo === 'TODOS' || filtroActivo === 'PROFESIONALES') && profesionales.length" class="seccion">
      <div class="seccion-header">
        <div class="seccion-titulo">
          <v-icon size="19" color="primary">
            mdi-account-outline
          </v-icon>
          <h2>Profesionales</h2>

          <span>{{ profesionales.length }}</span>
        </div>

        <button v-if="filtroActivo === 'TODOS' && profesionales.length > 3" class="ver-todos" @click="filtroActivo = 'PROFESIONALES'">
          Ver todos
          <v-icon size="16">mdi-chevron-right</v-icon>
        </button>
      </div>

      <div class="cards-scroll">
        <TarjetaProfesional v-for="profesional in profesionalesVisibles" :key="`profesional-${profesional.id}`" :profesional="profesional" @favorito="quitarFavorito('PROFESIONAL', profesional.id)" @click="abrirProfesionalFavorito(profesional)" />
      </div>
    </section>

    <!-- ===================================================
           SERVICIOS
      ==================================================== -->
    <section v-if="(filtroActivo === 'TODOS' || filtroActivo === 'SERVICIOS') && servicios.length" class="seccion">
      <div class="seccion-header">
        <div class="seccion-titulo">
          <v-icon size="19" color="primary">
            mdi-content-cut
          </v-icon>
          <h2>Servicios</h2>

          <span>
            {{ servicios.length }}
          </span>
        </div>

        <button v-if="filtroActivo === 'TODOS' && servicios.length > 7" class="ver-todos" @click="filtroActivo = 'SERVICIOS'">
          Ver todos
          <v-icon size="16">mdi-chevron-right</v-icon>
        </button>
      </div>

      <div class="servicios-grid">
        <TarjetaServicio v-for="servicio in serviciosVisibles" :key="`servicio-${servicio.id}`"
          :servicio="{
            ...servicio,
            servicio_id: servicio.id,
            servicio_nombre: servicio.nombre,
            servicio_descripcion: servicio.descripcion,
            profesional_nombre:
              servicio.profesional?.nombre ||
              servicio.profesional_nombre ||
              '',
            favorito: true,
          }" @favorito="quitarFavorito('SERVICIO', servicio.id)" @click="abrirServicioFavorito(servicio)"
        />
      </div>

    </section>
  </div>

</div>
</template>

<script>
import {getFavoritos, eliminarFavorito} from "../services/favorito.api";
import TarjetaNegocio from "@/modules/publico/components/TarjetaNegocio.vue";
import TarjetaProfesional from "@/modules/publico/components/TarjetaProfesional.vue";
import TarjetaServicio from "@/modules/publico/components/TarjetaServicio.vue";
import {getFileUrl} from "@/utils/ayuda";

export default {
  name: "FavoritoPage",
  components: {
    TarjetaNegocio,
    TarjetaProfesional,
    TarjetaServicio,
  },

  data() {
    return {
      cargando: true,
      error: false,

      filtroActivo: "TODOS",

      negocios: [],
      profesionales: [],
      servicios: [],
    };
  },

  computed: {

    totalFavoritos() {
      return (
        this.negocios.length +
        this.profesionales.length +
        this.servicios.length
      );
    },

    negociosVisibles() {
      if (this.filtroActivo === "NEGOCIOS") {
        return this.negocios;
      }

      return this.negocios.slice(0, 3);
    },

    profesionalesVisibles() {
      if (this.filtroActivo === "PROFESIONALES") {
        return this.profesionales;
      }

      return this.profesionales.slice(0, 3);
    },

    serviciosVisibles() {
      if (this.filtroActivo === "SERVICIOS") {
        return this.servicios;
      }

      return this.servicios.slice(0, 7);
    },
  },

  mounted() {
    this.cargarFavoritos();
  },

  methods: {
    getFileUrl,

    abrirNegocioFavorito(negocio) {
      if (!negocio) return;
      console.log(negocio)
      // Conserva la navegación que utiliza PIA
      // para abrir el detalle público del negocio.
      if (negocio.slug) {
        this.$router.push({
          name: "NegocioPublico",
          params: {
            slug: negocio.slug
          },
        });
      }
    },

    abrirProfesionalFavorito(profesional) {
      if (!profesional) return;
      console.log(profesional)
      if (profesional.slug) {
        this.$router.push({
          name: "perfil-profesional",
          params: {
            slug: profesional.slug,
          },
        }).catch(() => {});
      } else {
        console.info(
          "El profesional no tiene slug público:",
          profesional
        );
      }
    },

    abrirServicioFavorito(servicio) {
      if (!servicio) return;

      const slug =
        servicio.profesional?.slug ||
        servicio.profesional_slug ||
        servicio.slug_profesional;

      if (slug) {
        this.$router.push({
          name: "perfil-profesional",
          params: { slug },
        }).catch((error) => {
          console.error("Error al abrir el perfil del profesional:", error);
        });
      } else {
        console.warn(
          "El servicio no tiene el slug del profesional asociado:",
          servicio
        );
      }
    },

    // ======================================================
    // CARGAR FAVORITOS
    // ======================================================
    async cargarFavoritos() {
      this.cargando = true;
      this.error = false;
      try {
        const response = await getFavoritos();

        console.log("RESPUESTA API FAVORITOS:", response.data);

        const data = response?.data?.data || response?.data || {};

        console.log("SERVICIOS RECIBIDOS:", data.servicios);

        this.negocios = Array.isArray(data.negocios) ? data.negocios : [];
        this.profesionales = Array.isArray(data.profesionales) ? data.profesionales : [];
        this.servicios = Array.isArray(data.servicios) ? data.servicios : [];

      } catch (error) {
        console.error("Error cargando favoritos:", error);
        this.error = true;
      } finally {
        this.cargando = false;
      }
    },

    // ======================================================
    // ELIMINAR
    // ======================================================
    async quitarFavorito(tipo, id) {

      try {
        await eliminarFavorito(tipo, id);

        if (tipo === "NEGOCIO") {
          this.negocios =
            this.negocios.filter(
              (item) => item.id !== id
            );
        }

        if (tipo === "PROFESIONAL") {
          this.profesionales =
            this.profesionales.filter(
              (item) => item.id !== id
            );
        }

        if (tipo === "SERVICIO") {
          this.servicios =
            this.servicios.filter(
              (item) => item.id !== id
            );
        }

      } catch (error) {

        console.error(
          "Error eliminando favorito:",
          error
        );
      }
    },

    // ======================================================
    // IMÁGENES
    // ======================================================
    imagenNegocio(negocio) {
      const imagen =
        negocio?.portada ||
        negocio?.logo ||
        negocio?.logo_url ||
        negocio?.imagen ||
        negocio?.imagen_url ||
        negocio?.url_logo ||
        negocio?.url_portada;

      if (!imagen || typeof imagen !== "string") {
        return null;
      }

      const ruta = imagen.trim();

      if (!ruta) return null;

      // La imagen ya es una URL completa.
      if (/^https?:\/\//i.test(ruta)) {
        return ruta;
      }

      // Imagen servida desde la raíz del frontend o backend.
      const baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

      return `${baseURL.replace(/\/+$/, "")}/${ruta.replace(/^\/+/, "")}`;
    },
    imagenProfesional(profesional) {
      return (profesional?.foto || profesional?.imagen || profesional?.portada || null);
    },

    imagenServicio(servicio) {
      if (servicio?.imagen && typeof servicio.imagen === "object") {
        return getFileUrl(servicio.imagen.url) || null;
      }

      return (getFileUrl(servicio?.imagen) || getFileUrl(servicio?.imagen_url) || null);
    },

    // ======================================================
    // PRECIO
    // ======================================================
    formatoPrecio(precio) {
      const numero = Number(precio);

      if (Number.isNaN(numero)) {
        return "0.00";
      }

      return numero.toFixed(2);
    },

    // ======================================================
    // INICIO
    // ======================================================
    irAInicio() {
      this.$router.push({
        name: "InicioCliente",
      });
    },

    volver() {
      this.$router.push({
        name: 'cliente'
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* ==========================================================
   PÁGINA
========================================================== */

.favoritos-page {
  width: 100%;

  max-width: 100%;

  padding: 10px 10px 95px;

  box-sizing: border-box;
}

/* ==========================================================
   HEADER
========================================================== */
.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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
  font-size: 11px;
  line-height: 1.35;
  color: #60779a;
}

/* ==========================================================
   FILTROS
========================================================== */

.filtros-wrapper {
  display: flex;

  gap: 6px;

  margin-bottom: 20px;

  overflow-x: auto;

  scrollbar-width: none;
}

.filtros-wrapper::-webkit-scrollbar {
  display: none;
}

.filtro {
  display: flex;
  align-items: center;

  gap: 5px;

  min-height: 34px;

  padding: 0 10px;

  flex-shrink: 0;

  border: 1px solid #e5e9eb;

  border-radius: 9px;

  background: #ffffff;

  color: #607d8b;

  // font-family: inherit;

  font-size: 10px;
  font-weight: 650;

  cursor: pointer;

  transition: all 0.18s ease;
}

.filtro span {
  min-width: 17px;
  height: 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f1f4f5;

  font-size: 9px;
}

.filtro.activo {
  border-color: #0f8f8c;

  background: #0f8f8c;

  color: #ffffff;
}

.filtro.activo span {
  background: rgba(255, 255, 255, 0.18);

  color: #ffffff;
}

/* ==========================================================
   ESTADO
========================================================== */

.estado {
  min-height: 330px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 9px;

  text-align: center;

  color: #78909c;

  font-size: 11px;
}

/* ==========================================================
   SIN FAVORITOS
========================================================== */

.sin-favoritos {
  min-height: 430px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 20px;

  text-align: center;
}

.empty-icon {
  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 14px;

  border-radius: 50%;

  background: #eaf7f6;

  color: #0f8f8c;
}

.sin-favoritos h2 {
  margin: 0;

  color: #102a43;

  font-size: 17px;
  font-weight: 750;
}

.sin-favoritos p {
  max-width: 270px;

  margin: 8px 0 17px;

  color: #78909c;

  font-size: 11px;
  line-height: 1.45;
}

.btn-explorar {
  text-transform: none;

  font-size: 11px;
  font-weight: 650;
}

/* ==========================================================
   SECCIÓN
========================================================== */

.seccion {
  margin-bottom: 23px;
}

.seccion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 9px;
}

.seccion-titulo {
  display: flex;
  align-items: center;

  gap: 6px;
}

.seccion-titulo h2 {
  margin: 0;

  color: #102a43;

  font-size: 14px;
  font-weight: 750;
}

.seccion-titulo span {
  color: #90a4ae;

  font-size: 10px;
}

.ver-todos {
  display: flex;
  align-items: center;

  padding: 0;

  border: 0;

  background: transparent;

  color: #0f8f8c;

  font-family: inherit;

  font-size: 10px;
  font-weight: 650;

  cursor: pointer;
}

/* ==========================================================
   CARDS HORIZONTALES
========================================================== */

.cards-scroll {
  display: flex;

  gap: 9px;

  overflow-x: auto;

  padding-bottom: 3px;

  scrollbar-width: none;
}

.cards-scroll::-webkit-scrollbar {
  display: none;
}

/* ==========================================================
   NEGOCIO / PROFESIONAL
========================================================== */

.negocio-card,
.profesional-card {
  width: 150px;

  flex: 0 0 150px;

  overflow: hidden;

  border: 1px solid #edf0f1;

  border-radius: 11px;

  background: #ffffff;

  box-shadow:
    0 2px 8px rgba(16, 42, 67, 0.06);
}

.card-image {
  position: relative;

  width: 100%;
  height: 86px;

  overflow: hidden;

  background: #eaf7f6;
}

.card-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eaf7f6;

  color: #0f8f8c;
}

.favorite-button {
  position: absolute;

  top: 6px;
  right: 6px;

  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.94);

  color: #0f8f8c;

  box-shadow:
    0 2px 6px rgba(16, 42, 67, 0.12);

  cursor: pointer;
}

.card-content {
  padding: 8px;
}

.card-content h3 {
  margin: 0 0 4px;

  overflow: hidden;

  color: #102a43;

  font-size: 11px;
  font-weight: 700;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.rating {
  display: flex;
  align-items: center;

  gap: 2px;

  font-size: 9px;
}

.rating strong {
  color: #102a43;

  font-size: 9px;
}

.rating span {
  color: #90a4ae;
}

.location {
  display: flex;
  align-items: center;

  gap: 2px;

  margin-top: 4px;

  overflow: hidden;

  color: #78909c;

  font-size: 8px;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.descripcion {
  display: -webkit-box;

  margin: 5px 0 0;

  overflow: hidden;

  color: #78909c;

  font-size: 9px;
  line-height: 1.3;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ==========================================================
   SERVICIOS
========================================================== */

.servicios-lista {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.servicio-card {
  display: flex;

  width: 100%;
  min-height: 86px;

  overflow: hidden;

  border: 1px solid #edf0f1;

  border-radius: 11px;

  background: #ffffff;

  box-shadow:
    0 2px 8px rgba(16, 42, 67, 0.05);
}

.servicio-image {
  width: 82px;

  flex-shrink: 0;

  overflow: hidden;

  background: #eaf7f6;
}

.servicio-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.servicio-content {
  min-width: 0;

  flex: 1;

  padding: 8px 9px;
}

.servicio-header {
  display: flex;
  align-items: flex-start;

  justify-content: space-between;

  gap: 5px;
}

.servicio-header h3 {
  margin: 0;

  color: #102a43;

  font-size: 11px;
  font-weight: 700;

  line-height: 1.25;
}

.favorite-button.small {
  position: static;

  width: 25px;
  height: 25px;

  flex-shrink: 0;
}

.servicio-info {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 5px;

  color: #78909c;

  font-size: 8px;
}

.servicio-info span {
  display: flex;
  align-items: center;

  gap: 2px;
}

.servicio-info strong {
  color: #0f8f8c;

  font-size: 10px;
}

.servicio-profesional {
  display: flex;
  align-items: center;

  gap: 3px;

  margin-top: 6px;

  color: #78909c;

  font-size: 8px;
}

/* ==========================================================
   TABLET / DESKTOP
========================================================== */

@media (min-width: 600px) {

  .favoritos-page {
    max-width: 700px;

    margin: 0 auto;

    padding-left: 20px;
    padding-right: 20px;
  }

  .negocio-card,
  .profesional-card {
    width: 160px;

    flex-basis: 160px;
  }
}

.favoritos-negocios-lista {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  width: 100%;
}

.cards-scroll>* {
  flex: 0 0 150px;
  min-width: 0;
}

@media (min-width: 600px) {
  .cards-scroll>* {
    flex-basis: 160px;
  }
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

.servicios-grid > * {
  min-width: 0;
}

@media (max-width: 360px) {
  .servicios-grid {
    gap: 7px;
  }
}
</style>
