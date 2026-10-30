<template>
<main class="busqueda-page">
  <!-- ENCABEZADO -->
  <header class="busqueda-header">
    <button type="button" class="back-button" aria-label="Volver" @click="volver">
      <v-icon size="25">mdi-arrow-left</v-icon>
    </button>

    <h1>Resultados de búsqueda</h1>
  </header>

  <!-- BUSCADOR -->
  <form class="search-panel" @submit.prevent="buscar">
    <v-icon class="search-icon" size="23">
      mdi-magnify
    </v-icon>

    <input v-model="textoBusqueda" type="search" placeholder="¿Qué servicio buscas?" aria-label="Buscar servicios" autocomplete="off" />

    <button v-if="textoBusqueda" type="button" class="clear-button" aria-label="Borrar búsqueda" @click="limpiarBusqueda">
      <v-icon size="20">mdi-close</v-icon>
    </button>
  </form>

  <!-- CONTADOR Y ORDENAMIENTO -->
  <section class="results-toolbar">
    <div class="results-summary">
      <strong>{{ totalResultados }}</strong>
      <span>
        {{ totalResultados === 1?'resultado' : 'resultados' }}
      </span>
      <span v-if="palabrasBuscadas" class="search-phrase">
        para "{{ palabrasBuscadas }}"
      </span>
    </div>

    <v-menu location="bottom end" offset="5">
      <template #activator="{ props }">
        <button v-bind="props" type="button" class="sort-button">
          <v-icon size="17">mdi-swap-vertical</v-icon>
          <span>{{ ordenActual }}</span>
          <v-icon size="17">mdi-chevron-down</v-icon>
        </button>
      </template>

      <v-list density="compact" class="sort-menu">
        <v-list-item v-for="opcion in opcionesOrden" :key="opcion.value" :active="orden === opcion.value" @click="orden = opcion.value">
          <v-list-item-title>
            {{ opcion.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </section>

  <!-- CARGANDO -->
  <section v-if="cargando" class="state-container">
    <v-progress-circular indeterminate color="#079b98" size="36" />
    <p>Buscando servicios para ti...</p>
  </section>

  <!-- ERROR -->
  <section v-else-if="error" class="state-container">
    <v-icon color="error" size="42">
      mdi-alert-circle-outline
    </v-icon>

    <strong>No pudimos cargar los resultados</strong>
    <p>{{ error }}</p>

    <v-btn color="#079b98" variant="flat" rounded="lg" @click="cargarServicios(true)">
      Intentar nuevamente
    </v-btn>
  </section>

  <!-- SIN RESULTADOS -->
  <section v-else-if="!servicios.length" class="state-container empty-state">
    <v-icon color="#079b98" size="48">
      mdi-store-search-outline
    </v-icon>

    <strong>No encontramos servicios</strong>

    <p>
      Prueba con otras palabras o con un nombre más general.
    </p>

    <v-btn color="#079b98" variant="outlined" rounded="lg" @click="volver">
      Volver al inicio
    </v-btn>
  </section>

  <!-- LISTA DE RESULTADOS HORIZONTALES -->
  <section v-else class="results-list">
    <article v-for="servicio in serviciosOrdenados" :key="`${servicio.id}-${servicio.negocio_id || ''}`" class="result-card" role="button" tabindex="0" @click="abrirServicio(servicio)" @keydown.enter="abrirServicio(servicio)" @keydown.space.prevent="abrirServicio(servicio)">
      <!-- FOTO -->
      <div class="result-image-wrapper">
        <v-img :src="obtenerImagen(servicio)" class="result-image" cover :alt="servicio.nombre">
          <template #placeholder>
            <div class="image-placeholder">
              <v-icon size="34" color="#079b98">
                mdi-image-outline
              </v-icon>
            </div>
          </template>

          <template #error>
            <div class="image-placeholder">
              <v-icon size="34" color="#079b98">
                mdi-image-off-outline
              </v-icon>
            </div>
          </template>
        </v-img>

        <!-- DISTANCIA: SOLO SI EXISTE -->
        <div v-if="formatearDistancia(servicio)" class="result-distance">
          <v-icon size="12">mdi-map-marker</v-icon>
          {{ formatearDistancia(servicio) }}
        </div>

        <!-- FAVORITO -->
        <button type="button" class="favorite-button" :aria-label="
              servicio.favorito
               ?'Quitar de favoritos'
                : 'Agregar a favoritos'
            " :disabled="servicio.procesandoFavorito" @click.stop="toggleFavoritoServicio(servicio)">
          <v-icon size="22" :color="servicio.favorito?'#079b98' : '#079b98'">
            {{
                servicio.favorito
                 ?'mdi-heart'
                  : 'mdi-heart-outline'
              }}
          </v-icon>
        </button>
      </div>

      <!-- INFORMACIÓN -->
      <div class="result-content">
        <div class="result-main">
          <h2 class="business-name">
            {{ nombreNegocio(servicio) }}
          </h2>

          <div class="result-rating">
            <v-icon size="17" color="#ffb900">
              {{
                  Number(servicio.rating) > 0
                   ?'mdi-star'
                    : 'mdi-star-outline'
                }}
            </v-icon>

            <span>
              {{ Number(servicio.rating || 0).toFixed(1) }}
            </span>

            <span class="review-count">
              ({{ numeroResenas(servicio) }})
            </span>
          </div>

          <p class="result-service-name">
            {{ servicio.nombre }}
          </p>

          <div v-if="ubicacionServicio(servicio)" class="result-location">
            <v-icon size="17" color="#079b98">
              mdi-map-marker
            </v-icon>

            <span>{{ ubicacionServicio(servicio) }}</span>
          </div>
        </div>

        <!-- PRECIO -->
        <div class="result-price">
          <template v-if="tieneDescuento(servicio)">
            <span class="original-price">
              Bs {{ precioTexto(servicio.precio) }}
            </span>

            <strong class="discount-price">
              Bs {{ precioTexto(servicio.precio_final) }}
            </strong>
          </template>

          <strong v-else>
            Bs {{ precioTexto(servicio.precio) }}
          </strong>
        </div>

        <!-- INDICADOR DE NAVEGACIÓN -->
        <v-icon class="result-chevron" size="21">
          mdi-chevron-right
        </v-icon>
      </div>
    </article>

    <!-- VER MÁS -->
    <div v-if="hayMasResultados" class="load-more-container">
      <v-btn variant="outlined" color="#079b98" rounded="lg" :loading="cargandoMas" :disabled="cargandoMas" @click="cargarMasServicios">
        Ver más servicios
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </div>

    <p v-else class="end-results">
      Has visto todos los servicios disponibles.
    </p>
  </section>
</main>
</template>

<script>
import {
  getServicios
} from '../services/piaPublico.api.js';
import {
  getFileUrl
} from '@/utils/ayuda';

import {
  getFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from '../../cliente/modules/favoritos/services/favorito.api.js';

export default {
  name: 'BusquedaServiciosPage',

  data() {
    return {
      textoBusqueda: '',
      palabrasBuscadas: '',

      servicios: [],

      cargando: false,
      cargandoMas: false,
      error: '',

      pagina: 1,
      limite: 12,
      totalResultados: 0,
      totalPaginas: 0,

      favoritosServicios: [],

      orden: 'relevancia',

      opcionesOrden: [{
          title: 'Más relevantes',
          value: 'relevancia'
        },
        {
          title: 'Menor precio',
          value: 'precio_asc'
        },
        {
          title: 'Mayor precio',
          value: 'precio_desc'
        },
        {
          title: 'Mejor calificación',
          value: 'rating_desc'
        },
      ],
    };
  },

  computed: {
    ordenActual() {
      return (
        this.opcionesOrden.find(
          (opcion) => opcion.value === this.orden,
        )?.title || 'Más relevantes'
      );
    },

    serviciosOrdenados() {
      const lista = [...this.servicios];

      switch (this.orden) {
        case 'precio_asc':
          return lista.sort(
            (a, b) =>
            this.precioComparable(a) - this.precioComparable(b),
          );

        case 'precio_desc':
          return lista.sort(
            (a, b) =>
            this.precioComparable(b) - this.precioComparable(a),
          );

        case 'rating_desc':
          return lista.sort(
            (a, b) =>
            Number(b.rating || 0) - Number(a.rating || 0),
          );

        default:
          return lista;
      }
    },

    hayMasResultados() {
      if (this.totalPaginas > 0) {
        return this.pagina < this.totalPaginas;
      }

      return this.servicios.length < this.totalResultados;
    },
  },

  watch: {
    '$route.params.palabras': {
      immediate: true,

      handler(nuevasPalabras) {
        const palabras = String(nuevasPalabras || '').trim();

        this.textoBusqueda = palabras;
        this.cargarServicios(true);
      },
    },
  },

  async mounted() {
    await this.cargarFavoritos();
  },

  methods: {
    precioComparable(servicio) {
      if (this.tieneDescuento(servicio)) {
        return Number(servicio.precio_final);
      }

      return Number(servicio.precio) || 0;
    },

    precioTexto(valor) {
      return Number(valor || 0).toLocaleString('es-BO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },

    tieneDescuento(servicio) {
      const original = Number(servicio.precio);
      const final = Number(servicio.precio_final);

      return (
        servicio.tiene_descuento === true &&
        Number.isFinite(original) &&
        Number.isFinite(final) &&
        original > final
      );
    },

    nombreNegocio(servicio) {
      return (
        servicio.negocio_nombre ||
        servicio.negocio ||
        servicio.profesional_nombre ||
        'Profesional de belleza'
      );
    },

    numeroResenas(servicio) {
      return Number(
        servicio.resenas?? servicio.total_resenas?? 0,
      ) || 0;
    },

    ubicacionServicio(servicio) {
      return (
        servicio.ubicacion || [
          servicio.zona,
          servicio.municipio,
          servicio.departamento,
        ]
        .filter(Boolean)
        .filter(
          (valor, indice, lista) =>
          lista.indexOf(valor) === indice,
        )
        .join(', ')
      );
    },

    obtenerImagen(servicio) {
      const imagen =
        servicio.imagen ||
        servicio.servicio_imagen ||
        servicio.profesional_foto ||
        servicio.negocio_logo ||
        '';

      return imagen?getFileUrl(imagen) : undefined;
    },

    formatearDistancia(servicio) {
      const valor =
        servicio.distancia_km?? servicio.distancia;

      if (
        valor === null ||
        valor === undefined ||
        valor === ''
      ) {
        return '';
      }

      const distancia = Number(valor);

      if (!Number.isFinite(distancia) || distancia < 0) {
        return '';
      }

      if (distancia < 1) {
        return `${Math.round(distancia * 1000)} m`;
      }

      return `${distancia.toFixed(1)} km`;
    },

    async cargarServicios(reiniciar = false) {
      if (this.cargando || this.cargandoMas) {
        return;
      }

      const palabras = String(
        this.$route.params.palabras || this.textoBusqueda || '',
      ).trim();

      this.palabrasBuscadas = palabras;

      if (!palabras) {
        this.servicios = [];
        this.totalResultados = 0;
        this.totalPaginas = 0;
        this.error = '';
        return;
      }

      if (reiniciar) {
        this.pagina = 1;
        this.servicios = [];
        this.totalResultados = 0;
        this.totalPaginas = 0;
        this.error = '';
        this.cargando = true;
      } else {
        this.cargandoMas = true;
      }

      const paginaSolicitada = reiniciar?1 : this.pagina + 1;

      try {
        const respuesta = await getServicios({
          pagina: paginaSolicitada,
          limite: this.limite,
          buscar: palabras,
        });

        const body = respuesta?.data || {};
        const lista =
          body.datos ||
          body.data ||
          body.servicios || [];

        const resultados = Array.isArray(lista)?lista : [];

        const preparados = resultados.map((servicio) => {
          const id = Number(
            servicio.servicio_id?? servicio.id,
          );

          return {
            ...servicio,

            id,
            servicio_id: id,

            nombre: servicio.servicio_nombre ||
              servicio.nombre ||
              'Servicio de belleza',

            descripcion: servicio.servicio_descripcion ||
              servicio.descripcion ||
              '',

            imagen: servicio.imagen ||
              servicio.servicio_imagen ||
              servicio.profesional_foto ||
              servicio.negocio_logo ||
              '',

            rating: Number(servicio.rating) || 0,

            resenas: Number(
              servicio.resenas?? servicio.total_resenas?? 0,
            ) || 0,

            precio: Number(servicio.precio) || 0,

            favorito: this.favoritosServicios.includes(id),
            procesandoFavorito: false,
          };
        });

        if (reiniciar) {
          this.servicios = preparados;
        } else {
          const existentes = new Set(
            this.servicios.map(
              (servicio) =>
              `${servicio.id}-${servicio.negocio_id || ''}`,
            ),
          );

          this.servicios.push(
            ...preparados.filter(
              (servicio) =>
              !existentes.has(
                `${servicio.id}-${servicio.negocio_id || ''}`,
              ),
            ),
          );
        }

        const paginacion = body.paginacion || {};

        this.pagina =
          Number(paginacion.pagina) || paginaSolicitada;

        this.totalResultados = Number(
          paginacion.total?? body.total?? this.servicios.length,
        ) || 0;

        this.totalPaginas =
          Number(paginacion.totalPaginas) || 0;
      } catch (error) {
        this.error =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          'Ocurrió un problema al consultar los servicios.';
      } finally {
        this.cargando = false;
        this.cargandoMas = false;
      }
    },

    async cargarMasServicios() {
      if (
        !this.hayMasResultados ||
        this.cargandoMas ||
        this.cargando
      ) {
        return;
      }

      await this.cargarServicios(false);
    },

    buscar() {
      const palabras = this.textoBusqueda.trim();

      if (!palabras) {
        this.limpiarBusqueda();
        return;
      }

      if (palabras === String(this.$route.params.palabras || '').trim()) {
        this.cargarServicios(true);
        return;
      }

      this.$router.push({
        name: 'publico-busqueda',
        params: {
          palabras
        },
      });
    },

    limpiarBusqueda() {
      this.textoBusqueda = '';

      this.$router.push({
        name: 'publico'
      });
    },

    volver() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push({
          name: 'publico'
        });
      }
    },

    abrirServicio(servicio) {
      const servicioId = Number(servicio?.servicio_id?? servicio?.id);

      if (!Number.isFinite(servicioId) || servicioId <= 0) {
        console.error('No se puede abrir el servicio: falta un ID válido.', servicio,);
        return;
      }

      this.$router.push({
        name: 'servicio-perfil',
        params: {
          servicioId
        },
      });
    },

    async cargarFavoritos() {
      if (!localStorage.getItem('cliente_token')) {
        this.favoritosServicios = [];
        return;
      }

      try {
        const respuesta = await getFavoritos();
        const datos = respuesta?.data?.data || {};

        this.favoritosServicios = (
          datos.servicios || []
        ).map((servicio) => Number(servicio.id));

        this.servicios.forEach((servicio) => {
          servicio.favorito = this.favoritosServicios.includes(
            Number(servicio.id),
          );
        });
      } catch {
        this.favoritosServicios = [];
      }
    },

    async toggleFavoritoServicio(servicio) {
      if (!localStorage.getItem('cliente_token')) {
        this.$toast?.info?.(
          'Inicia sesión para guardar favoritos.',
        );
        return;
      }

      const id = Number(
        servicio?.servicio_id?? servicio?.id,
      );

      if (
        !Number.isFinite(id) ||
        id <= 0 ||
        servicio.procesandoFavorito
      ) {
        return;
      }

      const eraFavorito = this.favoritosServicios.includes(id);

      servicio.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito('SERVICIO', id);

          this.favoritosServicios =
            this.favoritosServicios.filter(
              (favoritoId) => favoritoId !== id,
            );
        } else {
          await agregarFavorito('SERVICIO', id);

          if (!this.favoritosServicios.includes(id)) {
            this.favoritosServicios.push(id);
          }
        }

        this.servicios.forEach((item) => {
          if (Number(item.id) === id) {
            item.favorito = !eraFavorito;
          }
        });
      } catch (error) {
        if (error.response?.status === 401) {
          this.$toast?.info?.(
            'Inicia sesión para guardar favoritos.',
          );
        } else {
          this.$toast?.error?.(
            error.response?.data?.mensaje ||
            'No se pudo actualizar el favorito.',
          );
        }
      } finally {
        servicio.procesandoFavorito = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.busqueda-page {
  --pia-teal: #079b98;
  --pia-navy: #102653;
  --pia-muted: #718096;

  width: 100%;
  min-width: 0;
  padding: 4px 12px 24px;
  color: var(--pia-navy);
  overflow-x: hidden;
  background: #fff;
}

.busqueda-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-bottom: 8px;
}

.busqueda-header h1 {
  margin: 0;
  padding: 0 38px;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  transform: translateY(-50%);
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--pia-navy);
  cursor: pointer;
}

.search-panel {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 5px 14px;
  border: 1px solid #edf1f5;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 4px 18px rgba(25, 55, 78, 0.08);
}

.search-icon {
  flex: 0 0 auto;
  color: var(--pia-teal);
}

.search-panel input {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 8px 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--pia-navy);
  font: inherit;
  font-size: 13px;
}

.search-panel input::placeholder {
  color: #8492a8;
}

.search-panel input::-webkit-search-cancel-button {
  display: none;
}

.clear-button {
  display: grid;
  flex: 0 0 30px;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  margin: 13px 0 10px;
}

.results-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 3px;
  min-width: 0;
  font-size: 11px;
  line-height: 1.5;
}

.results-summary strong {
  font-weight: 900;
}

.search-phrase {
  overflow-wrap: anywhere;
}

.sort-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 4px;
  max-width: 155px;
  min-height: 30px;
  padding: 4px 7px;
  border: 1px solid #e8edf2;
  border-radius: 17px;
  background: #fff;
  color: #29405f;
  font-size: 10px;
  white-space: nowrap;
  cursor: pointer;
}

.sort-menu {
  min-width: 180px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-card {
  display: flex;
  align-items: stretch;
  gap: 11px;
  width: 100%;
  min-width: 0;
  min-height: 112px;
  padding: 7px;
  overflow: hidden;
  border: 1px solid #edf1f5;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(16, 35, 63, 0.07);
  cursor: pointer;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.result-card:active {
  transform: scale(0.99);
}

.result-card:focus-visible {
  outline: 2px solid var(--pia-teal);
  outline-offset: 2px;
}

.result-image-wrapper {
  position: relative;
  flex: 0 0 39%;
  width: 39%;
  max-width: 145px;
  min-width: 100px;
  min-height: 98px;
  overflow: hidden;
  border-radius: 11px;
  background: #eaf5f3;
}

.result-image {
  width: 100%;
  height: 100%;
  min-height: 98px;
  position: absolute;
  inset: 0;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #eaf5f3;
}

.result-distance {
  position: absolute;
  bottom: 5px;
  left: 5px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  max-width: calc(100% - 10px);
  padding: 3px 6px;
  border-radius: 15px;
  background: rgba(24, 29, 35, 0.8);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.favorite-button {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 2px 7px rgba(16, 35, 63, 0.12);
  cursor: pointer;
}

.favorite-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.result-content {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 5px;
  min-width: 0;
  padding: 2px 14px 2px 0;
}

.result-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  min-width: 0;
}

.business-name {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--pia-navy);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.25;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.result-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  color: #718096;
  font-size: 11px;
  white-space: nowrap;
}

.review-count {
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-service-name {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #667b96;
  font-size: 11px;
  line-height: 1.35;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.result-location {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  color: #526a86;
  font-size: 10px;
  line-height: 1.35;
}

.result-location .v-icon {
  flex: 0 0 auto;
}

.result-location span {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.result-price {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding-left: 2px;
  color: var(--pia-teal);
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
}

.original-price {
  color: #8b98a8;
  font-size: 10px;
  font-weight: 500;
  text-decoration: line-through;
}

.discount-price {
  color: #d92d45;
}

.result-chevron {
  position: absolute;
  top: 50%;
  right: -3px;
  transform: translateY(-50%);
  color: #536d8e;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 240px;
  padding: 24px 12px;
  color: var(--pia-muted);
  text-align: center;
}

.state-container strong {
  color: var(--pia-navy);
  font-size: 15px;
}

.state-container p {
  max-width: 300px;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 18px 0 8px;
}

.end-results {
  padding: 12px 0;
  color: var(--pia-muted);
  font-size: 11px;
  text-align: center;
}

@media (min-width: 600px) {
  .busqueda-page {
    max-width: 760px;
    margin: 0 auto;
    padding: 12px 20px 30px;
  }

  .busqueda-header h1 {
    font-size: 19px;
  }

  .search-panel {
    min-height: 56px;
  }

  .results-summary {
    font-size: 13px;
  }

  .sort-button {
    font-size: 12px;
  }

  .result-card {
    min-height: 132px;
    gap: 14px;
    padding: 9px;
  }

  .result-image-wrapper {
    flex-basis: 35%;
    width: 35%;
    max-width: 175px;
    min-height: 112px;
  }

  .result-image {
    min-height: 112px;
  }

  .business-name {
    font-size: 15px;
  }

  .result-rating {
    font-size: 13px;
  }

  .result-service-name {
    font-size: 13px;
  }

  .result-location {
    font-size: 12px;
  }

  .result-price {
    font-size: 17px;
  }
}

@media (max-width: 360px) {
  .busqueda-page {
    padding-right: 9px;
    padding-left: 9px;
  }

  .busqueda-header h1 {
    font-size: 14px;
  }

  .results-toolbar {
    gap: 4px;
  }

  .results-summary {
    font-size: 10px;
  }

  .sort-button {
    gap: 2px;
    padding: 4px 5px;
    font-size: 9px;
  }

  .result-card {
    gap: 8px;
    min-height: 104px;
    padding: 6px;
    border-radius: 14px;
  }

  .result-image-wrapper {
    flex-basis: 36%;
    width: 36%;
    min-width: 88px;
    min-height: 92px;
  }

  .result-image {
    min-height: 92px;
  }

  .result-content {
    padding-right: 12px;
  }

  .result-main {
    gap: 4px;
  }

  .business-name {
    font-size: 11px;
  }

  .result-rating {
    gap: 2px;
    font-size: 10px;
  }

  .result-service-name {
    font-size: 10px;
  }

  .result-location {
    font-size: 9px;
  }

  .result-price {
    font-size: 12px;
  }

  .favorite-button {
    width: 27px;
    height: 27px;
  }

  .result-chevron {
    right: -5px;
  }
}
</style>
