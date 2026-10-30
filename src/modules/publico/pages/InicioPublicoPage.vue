<template>
<div class="inicio-publico">
  
  <!-- =========================================
      BANNER ROTATIVO DE DESCUENTOS PÚBLICOS
  ========================================= -->
  <section
    v-if="descuentosBanner.length"
    class="discount-banner-section"
    aria-label="Servicios con descuentos"
  >
    <div
      class="discount-banner"
      :key="descuentoActual?.servicio_id"
      @click="verServicioDescuento(descuentoActual)"
      role="button"
      tabindex="0"
      @keydown.enter="verServicioDescuento(descuentoActual)"
    >
      <!-- FOTO DEL SERVICIO -->
      <div class="discount-banner-photo">
        <v-img
          :src="getFileUrl(descuentoActual.imagen)"
          cover
          :alt="descuentoActual.servicio_nombre"
        >
          <template #placeholder>
            <div class="discount-banner-placeholder">
              <v-icon size="40">mdi-image-outline</v-icon>
            </div>
          </template>
        </v-img>

        <span class="discount-banner-tag">
          <v-icon size="15">mdi-tag</v-icon>
          Bs {{ moneda(descuentoActual.monto_descuento_calculado) }} OFF
        </span>
      </div>

      <!-- INFORMACIÓN -->
      <div class="discount-banner-content">
        <span class="discount-banner-eyebrow">
          OFERTA ESPECIAL
        </span>

        <h2>{{ descuentoActual.servicio_nombre }}</h2>

        <p>
          {{ descuentoActual.descuento_titulo ||
            descuentoActual.servicio_descripcion ||
            'Aprovecha este descuento especial en PIA.' }}
        </p>

        <div class="discount-banner-prices">
          <span class="discount-original-price">
            Bs {{ moneda(descuentoActual.precio) }}
          </span>

          <strong>
            Bs {{ moneda(descuentoActual.precio_final) }}
          </strong>
        </div>

        <span class="discount-banner-cta">
          Ver servicio
          <v-icon size="17">mdi-arrow-right</v-icon>
        </span>
      </div>
    </div>

    <!-- INDICADORES -->
    <div
      v-if="descuentosBanner.length > 1"
      class="discount-banner-dots"
    >
      <button
        v-for="(descuento, index) in descuentosBanner"
        :key="descuento.servicio_id"
        type="button"
        :class="{ active: index === indiceDescuento }"
        :aria-label="`Ver descuento ${index + 1}`"
        @click.stop="seleccionarDescuento(index)"
      />
    </div>
  </section>


  <!-- Búsqueda -->
  <section class="search-panel">
    <button class="filter-button" type="button" aria-label="Filtros de búsqueda" @click="hojaFiltros = true">
      <v-icon size="20">mdi-tune-variant</v-icon>
    </button>

    <div class="search-input">
      <v-icon color="primary" size="23" @click="abrirMapa">
        mdi-map-marker-radius
      </v-icon>

      <input v-model="textoBusqueda" type="search" placeholder="¿Qué servicio o negocio buscas?" @keyup.enter="buscar" />
    </div>

    <button class="search-submit" type="button" aria-label="Buscar" @click="buscar">
      <v-icon size="20">mdi-send</v-icon>
    </button>
  </section>

  <!-- =========================================
      SERVICIOS DESTACADOS DE PIA
  ========================================= -->
  <section class="servicios-section">
    <div class="servicios-heading">
      <div>
        <h2>Servicios para ti</h2>
        <p>Descubre lo que ofrecen nuestros profesionales</p>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="cargandoServicios" class="servicios-estado">
      <v-progress-circular indeterminate color="#079b98" size="30" />
      <span>Buscando servicios...</span>
    </div>

    <!-- Error -->
    <div v-else-if="errorServicios" class="servicios-estado">
      <v-icon color="error" size="30">
        mdi-alert-circle-outline
      </v-icon>
      <span>{{ errorServicios }}</span>
      <v-btn variant="text" color="primary" @click="obtenerServicios">
        Reintentar
      </v-btn>
    </div>

    <!-- Sin servicios -->
    <div v-else-if="!serviciosDestacados.length" class="servicios-estado">
      <v-icon size="34" color="grey">
        mdi-store-search-outline
      </v-icon>
      <strong>Aún no hay servicios disponibles</strong>
      <span>Vuelve pronto para descubrir nuevas opciones en PIA.</span>
    </div>

    <!-- Tarjetas de servicios con scroll infinito -->
    <div v-else>
      <v-infinite-scroll :key="claveScrollServicios" :items="serviciosDestacados" @load="cargarMasServicios" empty-text="Ya viste todos los servicios disponibles" color="#079ba9" side="end">
        <div class="servicios-grid">          
          <TarjetaServicio v-for="servicio in serviciosDestacados" :key="`${servicio.servicio_id || servicio.id}-${servicio.negocio_id}`" :servicio="servicio" @click="abrirServicio(servicio)" @favorito="toggleFavoritoServicio"/>
        </div>
      </v-infinite-scroll>
    </div>

  </section>

</div>

<MapaNegociosSheet v-if="hojaMapa" :key="contadorAperturasMapa" v-model="hojaMapa" :negocios="negociosDestacados" @seleccionar="abrirNegocio" />

<!-- Hoja inferior: ubicación -->
<v-bottom-sheet v-model="hojaUbicacion" inset>
  <v-card class="sheet-card" rounded="t-xl">
    <div class="sheet-handle"></div>
    <div class="sheet-heading">
      <h3>
        <v-icon color="#079b98" class="mr-2">mdi-map-marker</v-icon>Ubicación
      </h3>
      <v-btn icon="mdi-close" variant="text" size="small" @click="hojaUbicacion = false" />
    </div>
    <button class="use-location" type="button" @click="detectarUbicacion">
      <v-icon size="24">mdi-crosshairs-gps</v-icon><span><strong>Usar mi ubicación actual</strong><small>Detectar ubicación con GPS</small></span>
    </button>
    <v-text-field v-model="busquedaUbicacion" placeholder="Buscar ciudad o departamento..." prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details rounded="lg" class="sheet-search" />
    <div class="location-options">
      <button v-for="lugar in ubicacionesFiltradas" :key="lugar.departamento + lugar.municipio" type="button" @click="seleccionarUbicacion(lugar)">
        <v-icon color="#079b98">mdi-map-marker</v-icon><span>{{ lugar.municipio }}, {{ lugar.departamento }}</span>
        <v-icon v-if="lugar.departamento === departamentoSeleccionado && lugar.municipio === municipioSeleccionado" color="#079b98">mdi-check</v-icon>
      </button>
    </div>
  </v-card>
</v-bottom-sheet>

<!-- Hoja inferior: filtros -->
<v-bottom-sheet v-model="hojaFiltros" inset>
  <v-card class="sheet-card" rounded="t-xl">
    <div class="sheet-handle"></div>
    <div class="sheet-heading">
      <h3>
        <v-icon class="mr-2">mdi-tune-variant</v-icon>Filtros de búsqueda
      </h3><button class="text-action" type="button" @click="limpiarFiltros">Limpiar</button>
    </div>
    <p class="filter-label">¿Qué buscas?</p>
    <div class="filter-type-row"><button v-for="tipo in tiposBusqueda" :key="tipo.value" type="button" :class="{ selected: tipoBusqueda === tipo.value }" @click="tipoBusqueda = tipo.value">{{ tipo.label }}</button></div>
    <p class="filter-label">Ubicación</p>
    <button class="filter-select" type="button" @click="hojaFiltros = false; hojaUbicacion = true">
      <v-icon>mdi-map-marker-outline</v-icon><span>{{ municipioSeleccionado || departamentoSeleccionado || "Todas las ubicaciones" }}</span>
      <v-icon>mdi-chevron-right</v-icon>
    </button>
    <p class="filter-label">Categoría</p>
    <button class="filter-select" type="button" @click="hojaFiltros = false; hojaCategorias = true">
      <v-icon>mdi-shape-outline</v-icon><span>{{ categoriaSeleccionada?.nombre || "Todas las categorías" }}</span>
      <v-icon>mdi-chevron-right</v-icon>
    </button>
    <v-btn block color="#079b98" class="apply-filters" rounded="lg" @click="aplicarFiltros">Aplicar filtros</v-btn>
  </v-card>
</v-bottom-sheet>

<!-- Hoja inferior: categorías -->
<v-bottom-sheet v-model="hojaCategorias" inset>
  <v-card class="sheet-card" rounded="t-xl">
    <div class="sheet-handle"></div>
    <div class="sheet-heading">
      <h3>
        <v-icon color="#079b98" class="mr-2">mdi-store</v-icon>Categorías
      </h3>
      <v-btn icon="mdi-close" variant="text" size="small" @click="hojaCategorias = false" />
    </div>
    <div v-if="todasCategorias.length" class="all-categories">
      <button v-for="categoria in todasCategorias" :key="categoria.id || categoria.nombre" type="button" @click="seleccionarCategoria(categoria)">
        <span class="category-icon" :style="{ background: categoria.fondo || '#e4f8f6', color: categoria.color || '#078e8c' }">
          <v-icon size="24">{{ categoria.icono || 'mdi-shape-outline' }}</v-icon>
        </span><span>{{ categoria.nombre }}</span>
      </button>
    </div>
    <div v-else class="state-message">
      <v-icon>mdi-shape-outline</v-icon>
      <span>El catálogo de categorías todavía no está conectado.</span>
    </div>
  </v-card>
</v-bottom-sheet>

<!-- SHEET: NEGOCIOS POR CATEGORÍA -->
<v-bottom-sheet v-model="hojaNegociosCategoria" inset>
  <v-card class="sheet-card sheet-categoria-negocios" rounded="t-xl">
    <div class="sheet-handle"></div>

    <!-- ENCABEZADO -->
    <div class="sheet-heading">
      <div class="sheet-categoria-titulo">
        <span class="sheet-categoria-icono" :style="{
            background: categoriaActiva?.fondo || '#e4f8f6',
            color: categoriaActiva?.color || '#078e8c'
          }">
          <v-icon size="25">
            {{ categoriaActiva?.icono || 'mdi-store-outline' }}
          </v-icon>
        </span>

        <div>
          <h3>{{ categoriaActiva?.nombre || 'Negocios' }}</h3>
          <p>Negocios de esta categoría</p>
        </div>
      </div>

      <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="hojaNegociosCategoria = false" />
    </div>

    <!-- CARGANDO -->
    <div v-if="cargandoNegociosCategoria" class="sheet-categoria-estado">
      <v-progress-circular indeterminate color="primary" size="32" />
      <span>Buscando negocios...</span>
    </div>

    <!-- ERROR -->
    <div v-else-if="errorNegociosCategoria" class="sheet-categoria-estado">
      <v-icon color="error" size="32">
        mdi-alert-circle-outline
      </v-icon>

      <span>{{ errorNegociosCategoria }}</span>

      <v-btn color="primary" variant="text" @click="obtenerNegociosPorCategoria(categoriaActiva)">
        Reintentar
      </v-btn>
    </div>

    <!-- SIN RESULTADOS -->
    <div v-else-if="!negociosCategoria.length" class="sheet-categoria-estado">
      <v-icon size="42" color="grey">
        mdi-store-search-outline
      </v-icon>

      <strong>Aún no hay negocios en esta categoría</strong>

      <span>
        Prueba con otra categoría para descubrir más opciones.
      </span>
    </div>
  </v-card>
</v-bottom-sheet>

<!-- ACCESO DEL CLIENTE -->
  <LoginCliente v-model="dialogoLoginCliente" @login="clienteAutenticado" />
</template>

<script>
import {getProfessionals} from "../modules/profesional/services/profesional.api.js";
import {municipiosPorDepartamento} from "@/modules/admin/modules/negocio/data/municipiosBolivia.js";
import {getBusinessTypes} from "../modules/negocio/services/tipoNegocio.api.js";
import { getFavoritos, agregarFavorito, eliminarFavorito } from "../../cliente/modules/favoritos/services/favorito.api.js";
import MapaNegociosSheet from "../components/MapaNegociosSheet.vue";
import { getNegocios, getServicios, getServiciosConDescuentoPublico } from "../services/piaPublico.api.js";

import { getFileUrl } from "@/utils/ayuda";

// Ajusta esta ruta si TarjetaServicio.vue está en otra carpeta.
import TarjetaServicio from "../components/TarjetaServicio.vue";
import LoginCliente from "../modules/cliente/components/LoginCliente.vue";

export default {
  name: "InicioPublicoPage",

  components: {
    MapaNegociosSheet,
    TarjetaServicio,
    LoginCliente,
  },

  data() {
    return {
      // Navegación
      activeNav: "inicio",

      // Banner compacto: preparado para futuras promociones
      bannerActual: 0,

      // Búsqueda
      textoBusqueda: "",
      destacadosTab: "negocios",
      tipoBusqueda: "negocio",

      tiposBusqueda: [{
          label: "Negocio",
          value: "negocio"
        },
        {
          label: "Servicio",
          value: "servicio"
        },
        {
          label: "Profesional",
          value: "profesional"
        },
      ],

      // Negocios
      negociosDestacados: [],
      cargandoNegocios: false,
      errorNegocios: "",

      // Profesionales
      profesionalesDestacados: [],
      cargandoProfesionales: false,

      // Servicios
      serviciosDestacados: [],
      cargandoServicios: false,
      errorServicios: "",

      // Especialidades
      especialidades: [],
      cargandoEspecialidades: false,
      errorEspecialidades: "",

      // Ubicación
      departamentoSeleccionado: "",
      municipioSeleccionado: "",
      busquedaUbicacion: "",
      municipiosPorDepartamento,

      // Filtros y categorías
      categoriaSeleccionada: null,
      hojaUbicacion: false,
      hojaFiltros: false,
      hojaCategorias: false,

      // Favoritos
      favoritosNegocios: [],
      favoritosProfesionales: [],
      favoritosServicios: [],

      // Diálogos
      mostrarDialogoRegistro: false,
      mostrarDialogoVerificarCodigo: false,
      dialogoLoginCliente: false,
      overlay: false,

      // Mapa
      hojaMapa: false,
      contadorAperturasMapa: 0,

      // Tipos de negocio
      tiposNegocio: [],
      cargandoTiposNegocio: false,
      errorTiposNegocio: "",

      // Negocios por categoría
      hojaNegociosCategoria: false,
      categoriaActiva: null,
      negociosCategoria: [],
      cargandoNegociosCategoria: false,
      errorNegociosCategoria: "",

      paginaServicios: 1,
      limiteServicios: 12,
      hayMasServicios: true,
      cargandoMasServicios: false,
      claveScrollServicios: 0,

      ubicacionCliente: {
        latitud: null,
        longitud: null,
      },

      // Banner rotativo de descuentos públicos
      descuentosBanner: [],
      indiceDescuento: 0,
      temporizadorDescuentos: null,
    };
  },

  computed: {
    descuentoActual() {
      return this.descuentosBanner[this.indiceDescuento] || null;
    },
    categoriasPrincipales() {
      return this.tiposNegocio.slice(0, 6);
    },

    todasCategorias() {
      return this.tiposNegocio;
    },

    ubicacionesFiltradas() {
      const texto = this.busquedaUbicacion
        .trim()
        .toLocaleLowerCase("es");

      return Object.entries(this.municipiosPorDepartamento)
        .flatMap(([departamento, municipios]) =>
          municipios.map((municipio) => ({
            departamento,
            municipio,
          })),
        )
        .filter((lugar) => {
          if (!texto) return true;

          return `${lugar.departamento} ${lugar.municipio}`
            .toLocaleLowerCase("es")
            .includes(texto);
        });
    },

    negociosFiltrados() {
      return this.negociosDestacados;
    },

    profesionalesFiltrados() {
      const q = this.textoBusqueda.trim().toLowerCase();

      return this.profesionalesDestacados.filter((profesional) => {
        const texto = [
            profesional.nombre || "",
            profesional.profesion || "",
            profesional.slug || "",
          ]
          .join(" ")
          .toLowerCase();

        return !q || texto.includes(q);
      });
    },
  },

  methods: {
    getFileUrl,
     
    async obtenerDescuentosBanner() {
      try {
        const respuesta = await getServiciosConDescuentoPublico();
        const body = respuesta?.data || {};
        const lista = Array.isArray(body.datos) ? body.datos : [];

        this.descuentosBanner = lista.filter((servicio) => {
          const precio = Number(servicio.precio);
          const precioFinal = Number(servicio.precio_final);
          const ahorro = Number(servicio.monto_descuento_calculado);

          return (
            servicio.servicio_id != null &&
            Number.isFinite(precio) &&
            Number.isFinite(precioFinal) &&
            Number.isFinite(ahorro) &&
            ahorro > 0 &&
            precioFinal >= 0 &&
            precioFinal < precio
          );
        });

        this.indiceDescuento = 0;

        this.iniciarRotacionDescuentos();
      } catch (error) {
        console.error("Error al cargar descuentos del banner:", error);
        this.descuentosBanner = [];
      }
    },

    iniciarRotacionDescuentos() {
      if (this.temporizadorDescuentos) {
        clearInterval(this.temporizadorDescuentos);
        this.temporizadorDescuentos = null;
      }

      if (this.descuentosBanner.length < 2) return;

      this.temporizadorDescuentos = setInterval(() => {
        this.indiceDescuento =
          (this.indiceDescuento + 1) % this.descuentosBanner.length;
      }, 5000);
    },

    seleccionarDescuento(index) {
      if (index < 0 || index >= this.descuentosBanner.length) return;

      this.indiceDescuento = index;
      this.iniciarRotacionDescuentos();
    },

    moneda(valor) {
      const numero = Number(valor);

      if (!Number.isFinite(numero)) return "0";

      return numero.toLocaleString("es-BO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },

    verServicioDescuento(servicio) {
      if (!servicio?.servicio_id) return;

      // Lleva al listado donde se encuentra la tarjeta del servicio.
      this.$nextTick(() => {
        const tarjeta = document.getElementById(
          `servicio-${servicio.servicio_id}`,
        );

        if (tarjeta) {
          tarjeta.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    },


    async obtenerServicios() {
      this.paginaServicios = 1;
      this.hayMasServicios = true;
      this.cargandoServicios = true;
      this.cargandoMasServicios = false;
      this.errorServicios = "";
      this.serviciosDestacados = [];
      this.claveScrollServicios++;

      try {
        await this.obtenerUbicacionCliente();

        const respuesta = await getServicios({
          pagina: 1,
          limite: this.limiteServicios,
          ...(this.departamentoSeleccionado && {
            departamento: this.departamentoSeleccionado,
          }),
          ...(this.municipioSeleccionado && {
            municipio: this.municipioSeleccionado,
          }),
          ...(this.textoBusqueda.trim() && {
            buscar: this.textoBusqueda.trim(),
          }),
        });

        const body = respuesta?.data || {};
        const lista = body.datos || body.data || body.servicios || [];
        const servicios = Array.isArray(lista)?lista : [];
        
        // Preparar cada servicio y calcular su distancia.
        const serviciosPreparados = servicios.map((servicio) => {
          const servicioPreparado = {
            ...servicio,
            favorito: this.favoritosServicios.includes(
              Number(servicio.servicio_id ?? servicio.id),
            ),
            id: servicio.servicio_id?? servicio.id,
            nombre: servicio.servicio_nombre?? servicio.nombre?? "",
            descripcion: servicio.servicio_descripcion?? servicio.descripcion?? "",
            imagen: servicio.imagen ||
              servicio.profesional_foto ||
              servicio.negocio_logo ||
              "",
            negocio: servicio.negocio_nombre || "",
            profesional: servicio.profesional_nombre || "",
            precio: Number(servicio.precio) || 0,
            rating: Number(servicio.rating) || 0,
            resenas: Number(servicio.resenas) || 0,
            ubicacion: [
              servicio.municipio,
              servicio.departamento,
            ].filter(Boolean).join(", "),
          };

          return this.agregarDistanciaServicio(servicioPreparado);
        });

        // Asignar la lista completa después de procesar todos los servicios.
        this.serviciosDestacados = serviciosPreparados;        
        this.paginaServicios = 1;
        
        const paginacion = body.paginacion;

        this.hayMasServicios = paginacion ?
          paginacion.pagina < paginacion.totalPaginas :
          servicios.length === this.limiteServicios;

      } catch (error) {
        console.error("Error al cargar servicios públicos:", error);

        this.errorServicios =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No pudimos cargar los servicios. Inténtalo nuevamente.";
      } finally {
        this.cargandoServicios = false;
      }
    },

    async cargarMasServicios({ done }) {
      if (
        this.cargandoServicios ||
        this.cargandoMasServicios ||
        !this.hayMasServicios
      ) {
        done("empty");
        return;
      }

      this.cargandoMasServicios = true;

      try {
        const siguientePagina = this.paginaServicios + 1;

        const respuesta = await getServicios({
          pagina: siguientePagina,
          limite: this.limiteServicios,

          ...(this.departamentoSeleccionado && {
            departamento: this.departamentoSeleccionado,
          }),

          ...(this.municipioSeleccionado && {
            municipio: this.municipioSeleccionado,
          }),

          ...(this.textoBusqueda.trim() && {
            buscar: this.textoBusqueda.trim(),
          }),
        });

        const body = respuesta?.data || {};
        const lista =
          body.datos ||
          body.data ||
          body.servicios ||
          [];

        const servicios = Array.isArray(lista) ? lista : [];

        if (servicios.length === 0) {
          this.hayMasServicios = false;
          done("empty");
          return;
        }

        // ==========================================
        // IDENTIFICAR SERVICIOS YA CARGADOS
        // ==========================================
        const existentes = new Set(
          this.serviciosDestacados.map((s) =>
            `${s.servicio_id ?? s.id}-${s.negocio_id ?? ""}`
          )
        );

        // ==========================================
        // PREPARAR LOS SERVICIOS NUEVOS
        // ==========================================
        const nuevos = servicios
          .filter((servicio) => {
            const clave =
              `${servicio.servicio_id ?? servicio.id}-${servicio.negocio_id ?? ""}`;

            return !existentes.has(clave);
          })
          .map((servicio) => {
            const servicioId = Number(
              servicio.servicio_id ?? servicio.id
            );

            const servicioPreparado = {
              ...servicio,

              // ======================================
              // ESTADO DE FAVORITO
              // ======================================
              favorito: Array.isArray(this.favoritosServicios)
                ? this.favoritosServicios.some(
                    (id) => Number(id) === servicioId
                  )
                : false,

              id: servicioId,

              nombre:
                servicio.servicio_nombre ??
                servicio.nombre ??
                "",

              descripcion:
                servicio.servicio_descripcion ??
                servicio.descripcion ??
                "",

              imagen:
                servicio.imagen ||
                servicio.profesional_foto ||
                servicio.negocio_logo ||
                "",

              negocio: servicio.negocio_nombre || "",
              profesional: servicio.profesional_nombre || "",

              precio: Number(servicio.precio) || 0,
              rating: Number(servicio.rating) || 0,
              resenas: Number(servicio.resenas) || 0,

              ubicacion: [
                servicio.municipio,
                servicio.departamento,
              ]
                .filter(Boolean)
                .join(", "),
            };

            // Calcular la distancia de cada servicio nuevo.
            return this.agregarDistanciaServicio(servicioPreparado);
          });

        // ==========================================
        // AGREGAR SIN REEMPLAZAR LOS EXISTENTES
        // ==========================================
        this.serviciosDestacados.push(...nuevos);

        this.paginaServicios = siguientePagina;

        // ==========================================
        // CONTROL DE PAGINACIÓN
        // ==========================================
        const paginacion = body.paginacion;

        this.hayMasServicios = paginacion
          ? paginacion.pagina < paginacion.totalPaginas
          : servicios.length === this.limiteServicios;

        done(this.hayMasServicios ? "ok" : "empty");
      } catch (error) {
        console.error("Error al cargar más servicios:", error);
        done("error");
      } finally {
        this.cargandoMasServicios = false;
      }
    },


    async obtenerUbicacionCliente() {
      if (!navigator.geolocation) {
        console.warn("Este navegador no admite geolocalización.");
        return false;
      }

      try {
        const posicion = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 300000,
            }
          );
        });

        this.ubicacionCliente = {
          latitud: posicion.coords.latitude,
          longitud: posicion.coords.longitude,
        };

        return true;
      } catch (error) {
        console.warn(
          "No se pudo obtener la ubicación:",
          error.code,
          error.message
        );

        return false;
      }
    },

    calcularDistanciaKm(lat1, lon1, lat2, lon2) {
      const rad = (grados) => (grados * Math.PI) / 180;
      const radioTierra = 6371;

      const dLat = rad(lat2 - lat1);
      const dLon = rad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLon / 2) ** 2;

      return Number(
        (
          2 *
          radioTierra *
          Math.asin(Math.sqrt(Math.min(1, a)))
        ).toFixed(2)
      );
    },

    agregarDistanciaServicio(servicio) {
      const latCliente = Number(this.ubicacionCliente?.latitud);
      const lonCliente = Number(this.ubicacionCliente?.longitud);

      // Las coordenadas reales vienen en latitud y longitud.
      const latServicio = Number(servicio.latitud);
      const lonServicio = Number(servicio.longitud);

      if (
        this.ubicacionCliente?.latitud == null ||
        this.ubicacionCliente?.longitud == null ||
        servicio.latitud == null ||
        servicio.longitud == null ||
        servicio.latitud === "" ||
        servicio.longitud === "" ||
        !Number.isFinite(latCliente) ||
        !Number.isFinite(lonCliente) ||
        !Number.isFinite(latServicio) ||
        !Number.isFinite(lonServicio)
      ) {
        return servicio;
      }

      const distancia = this.calcularDistanciaKm(
        latCliente,
        lonCliente,
        latServicio,
        lonServicio
      );

      return {
        ...servicio,
        distancia_km: distancia,
      };
    },

    // =========================================
    // TIPOS DE NEGOCIO
    // =========================================
    async obtenerTiposNegocio() {
      this.cargandoTiposNegocio = true;
      this.errorTiposNegocio = "";

      try {
        const respuesta = await getBusinessTypes();
        const body = respuesta?.data || {};

        this.tiposNegocio = Array.isArray(body.data) ?
          body.data :
          Array.isArray(body.tiposnegocio) ?
          body.tiposnegocio : [];
      } catch (error) {
        console.error("Error al cargar tipos de negocio:", error);

        this.tiposNegocio = [];
        this.errorTiposNegocio =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No se pudieron cargar las categorías.";
      } finally {
        this.cargandoTiposNegocio = false;
      }
    },

    // =========================================
    // NEGOCIOS
    // =========================================
    async obtenerNegocios() {
      this.cargandoNegocios = true;
      this.errorNegocios = "";

      try {
        const respuesta = await getNegocios({
          pagina: 1,
          limite: 12,

          ...(this.departamentoSeleccionado && {
            departamento: this.departamentoSeleccionado,
          }),

          ...(this.municipioSeleccionado && {
            municipio: this.municipioSeleccionado,
          }),

          ...(this.textoBusqueda.trim() && {
            buscar: this.textoBusqueda.trim(),
          }),
        });

        const body = respuesta?.data || {};
        const lista =
          body.datos || body.data || body.negocios || [];

        this.negociosDestacados = Array.isArray(lista) ?
          lista.map((negocio) => ({
            ...negocio,
            imagen: negocio.imagen ||
              negocio.logo ||
              negocio.portada ||
              negocio.imagen_portada ||
              "",
            ubicacion: negocio.ubicacion || [
                negocio.municipio,
                negocio.departamento,
              ]
              .filter(Boolean)
              .join(", "),
            favorito: this.favoritosNegocios.includes(
              Number(negocio.id),
            ),
          })) : [];
      } catch (error) {
        console.error("Error al cargar negocios públicos:", error);

        this.errorNegocios =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No pudimos cargar los negocios. Revisa el servidor e inténtalo nuevamente.";
      } finally {
        this.cargandoNegocios = false;
      }
    },

    // =========================================
    // PROFESIONALES
    // =========================================
    async obtenerProfesionales() {
      this.cargandoProfesionales = true;

      try {
        const respuesta = await getProfessionals();

        if (
          respuesta?.data?.ok &&
          Array.isArray(respuesta.data.data)
        ) {
          this.profesionalesDestacados =
            respuesta.data.data.map((profesional) => ({
              ...profesional,
              favorito: this.favoritosProfesionales.includes(
                Number(profesional.id),
              ),
            }));
        } else {
          this.profesionalesDestacados = [];
        }
      } catch (error) {
        console.error(
          "Error al cargar profesionales públicos:",
          error,
        );

        this.profesionalesDestacados = [];
      } finally {
        this.cargandoProfesionales = false;
      }
    },

    // =========================================
    // FAVORITOS
    // =========================================
    async obtenerFavoritosNegocios() {
      const token = localStorage.getItem("cliente_token");

      if (!token) {
        this.favoritosNegocios = [];
        this.favoritosProfesionales = [];
        this.favoritosServicios = [];

        this.profesionalesDestacados.forEach((profesional) => {
          profesional.favorito = false;
        });

        this.serviciosDestacados.forEach((servicio) => {
          servicio.favorito = false;
        });

        return;
      }

      try {
        const respuesta = await getFavoritos();
        const datos = respuesta?.data?.data || {};

        this.favoritosServicios = (datos.servicios || []).map(
          (servicio) => Number(servicio.id),
        );

        this.favoritosNegocios = (datos.negocios || []).map(
          (negocio) => Number(negocio.id),
        );

        this.favoritosProfesionales = (
          datos.profesionales || []
        ).map((profesional) => Number(profesional.id));

        for (const lista of [
            this.negociosDestacados,
            this.negociosCategoria,
          ]) {
          for (const negocio of lista) {
            negocio.favorito = this.favoritosNegocios.includes(
              Number(negocio.id),
            );
          }
        }

        for (const profesional of this.profesionalesDestacados) {
          profesional.favorito =
            this.favoritosProfesionales.includes(
              Number(profesional.id),
            );
        }

        for (const servicio of this.serviciosDestacados) {
          const id = Number(servicio.servicio_id ?? servicio.id);

          servicio.favorito = this.favoritosServicios.includes(id);
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    },

    async toggleFavoritoServicio(servicio) {
      const token = localStorage.getItem("cliente_token");

      if (!token) {
        this.dialogoLoginCliente = true;
        return;
      }

      if (servicio.procesandoFavorito) return;

      const id = Number(servicio.servicio_id ?? servicio.id);

      if (!Number.isFinite(id) || id <= 0) {
        console.error("No se puede guardar el favorito: ID de servicio inválido", servicio);
        return;
      }

      const eraFavorito = this.favoritosServicios.includes(id);

      servicio.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito("SERVICIO", id);

          this.favoritosServicios = this.favoritosServicios.filter(
            (favoritoId) => favoritoId !== id,
          );
        } else {
          await agregarFavorito("SERVICIO", id);

          if (!this.favoritosServicios.includes(id)) {
            this.favoritosServicios.push(id);
          }
        }

        // Actualiza todas las tarjetas del servicio, si está repetido.
        for (const item of this.serviciosDestacados) {
          const itemId = Number(item.servicio_id ?? item.id);

          if (itemId === id) {
            item.favorito = !eraFavorito;
          }
        }

        servicio.favorito = !eraFavorito;
      } catch (error) {
        console.error("Error al actualizar favorito del servicio:", error);

        if (error.response?.status === 401) {
          this.dialogoLoginCliente = true;
        } else {
          this.$toast?.error?.(
            error.response?.data?.mensaje ||
              "No se pudo actualizar el favorito del servicio.",
          );
        }
      } finally {
        servicio.procesandoFavorito = false;
      }
    },

    async toggleFavoritoNegocio(negocio) {
      const token = localStorage.getItem("cliente_token");

      if (!token) {
        this.dialogoLoginCliente = true;
        return;
      }

      if (negocio.procesandoFavorito) return;

      const id = Number(negocio.id);
      const eraFavorito = this.favoritosNegocios.includes(id);

      negocio.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito("NEGOCIO", id);

          this.favoritosNegocios =
            this.favoritosNegocios.filter(
              (favoritoId) => favoritoId !== id,
            );
        } else {
          await agregarFavorito("NEGOCIO", id);

          if (!this.favoritosNegocios.includes(id)) {
            this.favoritosNegocios.push(id);
          }
        }

        for (const lista of [
            this.negociosDestacados,
            this.negociosCategoria,
          ]) {
          const tarjeta = lista.find(
            (item) => Number(item.id) === id,
          );

          if (tarjeta) {
            tarjeta.favorito = !eraFavorito;
          }
        }
      } catch (error) {
        console.error("Error al actualizar favorito:", error);

        if (error.response?.status === 401) {
          this.dialogoLoginCliente = true;
        } else {
          this.$toast?.error?.(
            error.response?.data?.mensaje ||
            "No se pudo actualizar el favorito.",
          );
        }
      } finally {
        negocio.procesandoFavorito = false;
      }
    },

    async toggleFavoritoProfesional(profesional) {
      const token = localStorage.getItem("cliente_token");

      if (!token) {
        this.dialogoLoginCliente = true;
        return;
      }

      const id = Number(profesional.id);

      if (profesional.procesandoFavorito) return;

      const eraFavorito =
        this.favoritosProfesionales.includes(id);

      profesional.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito("PROFESIONAL", id);

          this.favoritosProfesionales =
            this.favoritosProfesionales.filter(
              (favoritoId) => favoritoId !== id,
            );
        } else {
          await agregarFavorito("PROFESIONAL", id);

          if (!this.favoritosProfesionales.includes(id)) {
            this.favoritosProfesionales.push(id);
          }
        }

        profesional.favorito = !eraFavorito;
      } catch (error) {
        console.error("Error al actualizar favorito:", error);

        if (error.response?.status === 401) {
          this.dialogoLoginCliente = true;
        } else {
          this.$toast?.error?.(
            error.response?.data?.mensaje ||
            "No se pudo actualizar el favorito.",
          );
        }
      } finally {
        profesional.procesandoFavorito = false;
      }
    },

    // =========================================
    // BÚSQUEDA Y FILTROS
    // =========================================
    buscar() {
      this.hojaFiltros = false;
      
      // if (this.tipoBusqueda === "negocio") {
      //   this.obtenerNegocios();
      //   return;
      // }

      // if (this.tipoBusqueda === "profesional") {
      //   this.obtenerProfesionales();
      //   return;
      // }

      const palabras = this.textoBusqueda.trim();
      console.log('palabras: ', palabras)
      if (!palabras) return;

      this.$router.push({
        name: "publico-busqueda",
        params: {
          palabras,
        },
      });
    },


    aplicarFiltros() {
      this.hojaFiltros = false;
      this.hojaCategorias = false;

      if (this.tipoBusqueda === "negocio") {
        this.obtenerNegocios();
      } else if (this.tipoBusqueda === "profesional") {
        this.obtenerProfesionales();
      } else {
        this.avisarServiciosPendientes();
      }
    },

    limpiarFiltros() {
      this.textoBusqueda = "";
      this.tipoBusqueda = "negocio";
      this.categoriaSeleccionada = null;
      this.departamentoSeleccionado = "";
      this.municipioSeleccionado = "";
      this.hojaFiltros = false;
      this.hojaCategorias = false;

      this.obtenerNegocios();
    },

    // =========================================
    // UBICACIÓN
    // =========================================
    seleccionarUbicacion(lugar) {
      this.departamentoSeleccionado = lugar.departamento;
      this.municipioSeleccionado = lugar.municipio;
      this.hojaUbicacion = false;

      if (this.tipoBusqueda === "negocio") {
        this.obtenerNegocios();
      }
    },

    async detectarUbicacion() {
      if (!navigator.geolocation) {
        this.errorNegocios =
          "Tu navegador no admite geolocalización. Elige tu ciudad manualmente.";
        return;
      }

      this.cargandoNegocios = true;
      this.errorNegocios = "";

      navigator.geolocation.getCurrentPosition(
        async (posicion) => {
            try {
              const {
                latitude,
                longitude
              } = posicion.coords;

              const respuesta = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=es`,
              );

              if (!respuesta.ok) {
                throw new Error(
                  "No se pudo identificar tu ciudad.",
                );
              }

              const resultado = await respuesta.json();
              const direccion = resultado.address || {};

              const departamento =
                direccion.state ||
                direccion.province ||
                direccion.region ||
                "";

              const municipio =
                direccion.city ||
                direccion.town ||
                direccion.municipality ||
                direccion.county ||
                direccion.village ||
                "";

              if (!departamento || !municipio) {
                throw new Error(
                  "No pudimos identificar tu municipio. Selecciónalo manualmente.",
                );
              }

              const normalizar = (texto) =>
                texto
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLocaleLowerCase("es")
                .trim();

              const departamentoCatalogo = Object.keys(
                this.municipiosPorDepartamento,
              ).find(
                (nombre) =>
                normalizar(nombre) === normalizar(departamento),
              );

              if (!departamentoCatalogo) {
                throw new Error(
                  "No encontramos el departamento en el catálogo de Bolivia.",
                );
              }

              const municipioCatalogo =
                this.municipiosPorDepartamento[
                  departamentoCatalogo
                ].find(
                  (nombre) =>
                  normalizar(nombre) === normalizar(municipio),
                );

              if (!municipioCatalogo) {
                throw new Error(
                  "No encontramos el municipio en el catálogo. Selecciónalo manualmente.",
                );
              }

              this.departamentoSeleccionado =
                departamentoCatalogo;
              this.municipioSeleccionado = municipioCatalogo;
              this.hojaUbicacion = false;

              if (this.tipoBusqueda === "negocio") {
                await this.obtenerNegocios();
              }
            } catch (error) {
              console.error(
                "Error al identificar ubicación:",
                error,
              );

              this.errorNegocios =
                error.message ||
                "No pudimos detectar tu ciudad. Selecciónala manualmente.";
            } finally {
              this.cargandoNegocios = false;
            }
          },

          (error) => {
            this.cargandoNegocios = false;

            const mensajes = {
              1: "Debes permitir el acceso a tu ubicación en el navegador.",
              2: "No fue posible determinar tu ubicación. Inténtalo nuevamente.",
              3: "La solicitud de ubicación tardó demasiado. Inténtalo nuevamente.",
            };

            this.errorNegocios =
              mensajes[error.code] ||
              "No pudimos obtener tu ubicación. Selecciona tu ciudad manualmente.";

            console.warn("Geolocalización:", error.message);
          },

          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000,
          },
      );
    },

    // =========================================
    // CATEGORÍAS Y NEGOCIOS POR CATEGORÍA
    // =========================================
    async seleccionarCategoria(categoria) {
      this.categoriaActiva = categoria;
      this.categoriaSeleccionada = categoria;
      this.hojaCategorias = false;
      this.hojaFiltros = false;

      this.negociosCategoria = [];
      this.errorNegociosCategoria = "";
      this.hojaNegociosCategoria = true;

      await this.obtenerNegociosPorCategoria(categoria);
    },

    async obtenerNegociosPorCategoria(categoria) {
      if (!categoria?.id) return;

      this.cargandoNegociosCategoria = true;
      this.errorNegociosCategoria = "";

      try {
        const respuesta = await getNegocios({
          pagina: 1,
          limite: 50,
          tipoNegocioId: categoria.id,

          ...(this.departamentoSeleccionado && {
            departamento: this.departamentoSeleccionado,
          }),

          ...(this.municipioSeleccionado && {
            municipio: this.municipioSeleccionado,
          }),
        });

        const body = respuesta?.data || {};
        const lista =
          body.datos || body.data || body.negocios || [];

        this.negociosCategoria = Array.isArray(lista) ?
          lista.map((negocio) => ({
            ...negocio,
            imagen: negocio.imagen ||
              negocio.logo ||
              negocio.portada ||
              negocio.imagen_portada ||
              "",
            ubicacion: negocio.ubicacion || [
                negocio.municipio,
                negocio.departamento,
              ]
              .filter(Boolean)
              .join(", "),
            favorito: this.favoritosNegocios.includes(
              Number(negocio.id),
            ),
          })) : [];
      } catch (error) {
        console.error(
          "Error al cargar negocios por categoría:",
          error,
        );

        this.errorNegociosCategoria =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No pudimos cargar los negocios de esta categoría.";
      } finally {
        this.cargandoNegociosCategoria = false;
      }
    },

    // =========================================
    // NAVEGACIÓN
    // =========================================
    abrirNegocio(negocio) {
      if (negocio.slug) {
        this.$router.push({ path: `/negocio/${negocio.slug}` }).catch(() => {});
      } else {
        console.info(
          "Falta definir la ruta pública del negocio:",
          negocio,
        );
      }
    },

    abrirProfesional(profesional) {
      if (profesional.slug) {
        this.$router
          .push({
            name: "perfil-profesional",
            params: {
              slug: profesional.slug
            },
          })
          .catch(() => {});
      } else {
        console.info(
          "El profesional no tiene slug público:",
          profesional,
        );
      }
    },

    abrirServicio(servicio) {
      console.log('ABRIR SERVICIO: ', servicio)
      if (!servicio) return;
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
      // const slug = servicio.profesional?.slug || servicio.profesional_slug || servicio.slug_profesional;

      // if (slug) {
      //   this.$router.push({
      //     name: "perfil-profesional",
      //     params: { slug },
      //   }).catch((error) => {
      //     console.error("Error al abrir el perfil del profesional:", error);
      //   });
      // } else {
      //   console.warn(
      //     "No se encontró el slug del profesional asociado al servicio:",
      //     servicio
      //   );
      // }
    },

    verTodosNegocios() {
      this.hojaFiltros = true;
    },

    verTodosProfesionales() {
      this.tipoBusqueda = "profesional";
      this.hojaFiltros = true;
    },

    abrirMapa() {
      this.contadorAperturasMapa++;
      this.hojaMapa = true;
    },

    irFavoritos() {
      if (localStorage.getItem("cliente")) {
        this.$router
          .push({
            path: "/cliente/favoritos"
          })
          .catch(() => {});
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irReservas() {
      if (localStorage.getItem("cliente")) {
        this.$router
          .push({
            path: "/cliente/reservas"
          })
          .catch(() => {});
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irLoginCliente() {
      if (localStorage.getItem("cliente")) {
        this.$router
          .push({
            name: "cliente"
          })
          .catch(() => {});
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irLoginAdmin() {
      this.$router.push("/login");
    },

    irInicio() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    notificaciones() {
      this.$router.push({
        path: "/cliente/notificaciones",
      });
    },

    abrirAsistente() {
      this.$router.push({
        path: "/"
      });
      console.info("Abrir asistente Pía");
    },

    avisarServiciosPendientes() {
      console.info(
        "El catálogo público de servicios debe conectarse al endpoint correspondiente.",
      );
    },

    // =========================================
    // REGISTRO DE NEGOCIOS Y PROFESIONALES
    // =========================================
    registrar() {
      this.mostrarDialogoRegistro = true;
    },

    irARegistroNegocio() {
      this.overlay = true;

      this.$router
        .push({
          name: "registro-negocio"
        })
        .finally(() => {
          this.overlay = false;
        });
    },

    irARegistroProfesional() {
      this.mostrarDialogoVerificarCodigo = true;
    },

    negocioVerificado(negocio) {
      this.overlay = true;

      this.$router
        .push({
          name: "registro-profesional",
          query: {
            negocio_id: negocio.id,
            negocio_nombre: negocio.nombre,
            negocio_codigo: negocio.codigo,
          },
        })
        .finally(() => {
          this.overlay = false;
        });
    },

    clienteAutenticado() {
      this.dialogoLoginCliente = false;
      this.$router.push("/cliente").catch(() => {});
    },
  },

  async mounted() {
    await this.obtenerFavoritosNegocios();

    this.obtenerNegocios();
    this.obtenerProfesionales();
    this.obtenerTiposNegocio();
    this.obtenerServicios();
    this.obtenerDescuentosBanner();
  },
  beforeUnmount() {
    if (this.temporizadorDescuentos) {
      clearInterval(this.temporizadorDescuentos);
      this.temporizadorDescuentos = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.inicio-publico {
  --pia-teal: #079b98;
  --pia-teal-dark: #087f7d;
  --pia-navy: #102653;

  width: 100%;
  min-width: 0;
  overflow-x: hidden;
}

/* =====================================
   BANNER COMPACTO
===================================== */
.hero-banner {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 76px;
  height: 76px;
  margin: 0 12px;
  padding: 9px 16px;
  overflow: hidden;
  border-radius: 17px;
  background: linear-gradient(110deg,
      #e3f7f4 0%,
      #f4fcf8 65%,
      #d8f3ed 100%);
}

.hero-copy {
  position: relative;
  z-index: 2;
  width: 67%;
}

.hero-copy h1 {
  margin: 0;
  color: var(--pia-navy);
  font-size: clamp(15px, 4.2vw, 19px);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.35px;
}

.hero-copy h1 span {
  color: var(--pia-teal);
}

.hero-character {
  position: absolute;
  z-index: 1;
  right: 7px;
  bottom: 0;
  width: 35%;
  height: 96%;
  object-fit: contain;
  object-position: center bottom;
}

.hero-dots {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
}

.hero-dots i {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #b5ded9;
}

.hero-dots i.active {
  background: var(--pia-teal);
}

.hero-star {
  position: absolute;
  z-index: 1;
  color: #ffb45c;
  font-size: 15px;
}

.star-one {
  top: 12px;
  right: 37%;
}

.star-two {
  top: 24px;
  right: 12px;
  font-size: 12px;
}

/* =====================================
   BÚSQUEDA
===================================== */
.search-panel {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  margin: 8px 12px 14px;
  padding: 5px 6px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(22, 58, 75, 0.10);
}

.filter-button,
.search-submit {
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.filter-button {
  background: #e5f8f5;
  color: var(--pia-teal-dark);
}

.search-input {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.search-input :deep(.v-icon) {
  flex-shrink: 0;
  cursor: pointer;
}

.search-input input {
  width: 100%;
  min-width: 0;
  padding: 5px 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--pia-navy);
  font-family: inherit;
  font-size: 11px;
}

.search-input input::placeholder {
  color: #8594aa;
  opacity: 1;
}

.search-submit {
  background: var(--pia-teal);
  color: #fff;
}

.filter-button:active,
.search-submit:active {
  transform: scale(0.95);
}

@media (max-width: 360px) {
  .hero-banner {
    height: 70px;
    min-height: 70px;
    margin-right: 10px;
    margin-left: 10px;
    padding-right: 12px;
    padding-left: 12px;
  }

  .hero-copy h1 {
    font-size: 15px;
  }

  .hero-character {
    width: 36%;
    right: 3px;
  }

  .search-panel {
    margin-right: 10px;
    margin-left: 10px;
    gap: 5px;
  }

  .search-input input {
    font-size: 10px;
  }
}

.sheet-card {
  padding: 8px 18px max(22px, env(safe-area-inset-bottom));
  max-height: 85vh;
  overflow-y: auto
}

.sheet-handle {
  width: 42px;
  height: 4px;
  margin: 2px auto 15px;
  border-radius: 5px;
  background: #aab5c0
}

.sheet-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px
}

.sheet-heading h3 {
  display: flex;
  align-items: center;
  margin: 0;
  color: var(--navy);
  font-size: 17px;
  font-weight: 900
}

.use-location {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
  border: 0;
  border-radius: 13px;
  background: #e7f8f5;
  color: var(--teal-dark);
  text-align: left
}

.use-location span {
  display: flex;
  flex-direction: column;
  gap: 3px
}

.use-location strong {
  font-size: 12px
}

.use-location small {
  font-size: 10px
}

.sheet-search {
  margin-bottom: 10px
}

.location-options {
  display: flex;
  flex-direction: column;
  max-height: 38vh;
  overflow-y: auto
}

.location-options button {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 43px;
  padding: 8px 4px;
  border: 0;
  border-bottom: 1px solid #edf1f3;
  background: white;
  color: var(--navy);
  text-align: left;
  font-size: 12px
}

.location-options button span {
  flex: 1
}

.text-action {
  border: 0;
  background: transparent;
  color: var(--teal-dark);
  font-size: 12px;
  font-weight: 800
}

.filter-label {
  margin: 15px 0 8px;
  color: var(--navy);
  font-size: 12px;
  font-weight: 800
}

.filter-type-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px
}

.filter-type-row button {
  min-height: 39px;
  padding: 6px;
  border: 1px solid #edf0f3;
  border-radius: 22px;
  background: #f5f7f9;
  color: #253b5c;
  font-size: 11px
}

.filter-type-row button.selected {
  border-color: #d3f0ed;
  background: #dff6f3;
  color: var(--teal-dark);
  font-weight: 800
}

.filter-select {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid #e3eaf0;
  border-radius: 12px;
  background: #fff;
  color: #253b5c;
  text-align: left;
  font-size: 12px
}

.filter-select span {
  flex: 1
}

.apply-filters {
  margin-top: 20px;
  min-height: 46px;
  color: white !important;
  font-weight: 800
}

.all-categories {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px 7px;
  padding: 6px 0 12px
}

.all-categories button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: var(--navy);
  font-size: 10px;
  text-align: center
}

.all-categories .category-icon {
  width: 47px;
  height: 47px
}

@media(min-width:700px) {
  .pia-page {
    max-width: 1180px;
    margin: 0 auto;
    padding-bottom: 25px
  }

  .pia-header {
    padding: 18px 26px
  }

  .pia-logo {
    font-size: 42px
  }

  .pia-tagline {
    font-size: 9px;
    line-height: 10px
  }

  .search-panel {
    margin: -20px 45px 0;
    padding: 10px
  }

  .search-input input {
    font-size: 15px
  }

  .category-strip {
    justify-content: center;
    gap: 25px
  }

  .quick-actions {
    padding-right: 24px;
    padding-left: 24px;
    gap: 16px
  }

  .quick-card {
    min-height: 145px;
    padding: 18px
  }

  .quick-card strong {
    font-size: 16px
  }

  .quick-card small {
    font-size: 12px
  }

  .content-section {
    padding-right: 24px;
    padding-left: 24px
  }

  .section-title-row h2 {
    font-size: 22px
  }

  .business-carousel,
  .professional-carousel {
    grid-auto-columns: minmax(0, 30%)
  }

  .service-carousel {
    grid-auto-columns: minmax(0, 23%)
  }

  .specialty-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr))
  }

  .specialty-card {
    min-height: 175px
  }

  .benefits-card {
    margin-right: 24px;
    margin-left: 24px;
    grid-template-columns: repeat(4, minmax(0, 1fr))
  }

  .pia-bottom-navigation {
    display: none
  }
}

@media(max-width:360px) {
  .pia-header {
    padding-right: 9px;
    padding-left: 9px
  }

  .pia-logo {
    font-size: 29px
  }

  .pia-tagline {
    font-size: 6px
  }

  .location-button {
    font-size: 10px
  }

  .location-button span {
    max-width: 70px
  }
}

/* Carrusel horizontal de profesionales */
.profesionales-carrusel {
  display: flex;
  flex-wrap: nowrap;
  gap: 3px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 2px 12px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.profesionales-carrusel::-webkit-scrollbar {
  display: none;
}

/* Cada tarjeta mantiene su ancho */
.profesionales-carrusel>* {
  flex: 0 0 150px;
  min-width: 150px;
  scroll-snap-align: start;
}

/* ========================================= */
/* CARRUSEL HORIZONTAL DE CATEGORÍAS         */
/* ========================================= */

.category-carousel {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 12px 0 14px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}

.category-carousel::-webkit-scrollbar {
  display: none;
}

.category-track {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: max-content;
  min-width: 100%;
  padding: 0 12px;
}

/* CADA CATEGORÍA */

.category-item {
  display: flex;
  flex: 0 0 64px;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 64px;
  min-width: 64px;
  padding: 4px 2px 8px;
  border: none;
  border-radius: 14px;
  color: #17345f;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s ease;
}

.category-item:active {
  transform: scale(0.94);
}

/* ICONO */

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 15px;
  color: var(--categoria-color, #009c95);
  background: var(--categoria-fondo, #e3f6f3);
}

/* NOMBRE */

.category-name {
  display: -webkit-box;
  width: 100%;
  min-height: 27px;
  overflow: hidden;
  color: #243b61;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* MÁS CATEGORÍAS */

.category-more .category-icon {
  color: #008f8c;
  background: #e9f7f5;
  border: 1px dashed #8acdc6;
}

.category-more .category-name {
  color: #008f8c;
}

/* PANTALLAS MUY PEQUEÑAS */

@media (max-width: 360px) {
  .category-track {
    gap: 8px;
    padding-inline: 10px;
  }

  .category-item {
    flex-basis: 60px;
    width: 60px;
    min-width: 60px;
  }

  .category-icon {
    width: 42px;
    height: 42px;
  }

  .category-name {
    font-size: 9px;
  }
}

.sheet-categoria-negocios {
  max-height: 82vh;
  overflow-y: auto;
  padding-bottom: 16px;
}

.sheet-categoria-titulo {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.sheet-categoria-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 15px;
}

.sheet-categoria-titulo h3 {
  margin: 0;
  color: #102653;
  font-size: 17px;
  font-weight: 800;
}

.sheet-categoria-titulo p {
  margin: 3px 0 0;
  color: #65768e;
  font-size: 12px;
}

.sheet-categoria-estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 190px;
  padding: 24px;
  color: #65768e;
  font-size: 13px;
  text-align: center;
}

.sheet-categoria-estado strong {
  color: #102653;
  font-size: 15px;
}

.sheet-categoria-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 24px;
}

/* =========================================
   TARJETAS PRINCIPALES PIA
   Fotografías difuminadas y superficies claras
========================================= */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0 16px 22px;
}

.quick-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0;
  min-width: 0;
  min-height: 207px;
  overflow: hidden;
  padding: 18px 16px 15px;
  border: 1px solid #e4ebef;
  border-radius: 24px;
  background: #fff;
  color: #102c50;
  text-align: left;
  box-shadow: 0 3px 12px rgba(27, 55, 78, 0.08);
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.quick-card>*:not(.quick-photo) {
  position: relative;
  z-index: 2;
}

.quick-card:active {
  transform: scale(0.98);
}

/* Fotografía difuminada de fondo */
.quick-photo {
  position: absolute;
  z-index: 0;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 1;
  filter: blur(1px);
  transform: scale(1.04);
}

.quick-card::before {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
}

/* Mapa: fotografía de mapa y naturaleza */
.map-card .quick-photo {
  background-image: url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80");
}

.map-card::before {
  background: linear-gradient(115deg,
      rgba(236, 250, 247, 0.94),
      rgba(230, 245, 241, 0.72));
}

/* Favoritos: fotografía de belleza y flores */
.favorites-card .quick-photo {
  background-image: url("https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80");
}

.favorites-card::before {
  background: linear-gradient(115deg,
      rgba(255, 248, 250, 0.94),
      rgba(255, 237, 241, 0.76));
}

/* Reservas: fotografía de agenda y espacio de belleza */
.reservations-card .quick-photo {
  background-image: url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80");
}

.reservations-card::before {
  background: linear-gradient(115deg,
      rgba(243, 248, 255, 0.95),
      rgba(226, 237, 250, 0.78));
}

/* Icono principal dentro de un círculo blanco translúcido */
.quick-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 106px;
  height: 106px;
  flex: 0 0 106px;
  margin-bottom: 9px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.77);
  color: #079b98;
}

.favorites-card .quick-icon {
  color: #e13d70;
}

.reservations-card .quick-icon {
  color: #079b98;
}

/* Pequeños detalles de los iconos */
.quick-heart-small {
  position: absolute;
  right: -2px;
  bottom: 12px;
  color: #e13d70;
  background: rgba(255, 255, 255, 0.65);
  border-radius: 50%;
}

.quick-calendar-check {
  position: absolute;
  right: 7px;
  bottom: 10px;
  color: #079b98;
  background: #fff;
  border-radius: 50%;
}

/* Flecha circular blanca */
.quick-arrow {
  position: absolute;
  top: 116px;
  right: 13px;
  display: grid;
  place-items: center;
  width: 51px;
  height: 51px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  color: #173756;
  box-shadow: 0 2px 8px rgba(24, 48, 70, 0.07);
}

/* Títulos y subtítulos */
.quick-card-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  min-width: 0;
  width: 100%;
}

.quick-card-copy strong {
  color: #102c50;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 850;
  letter-spacing: -0.35px;
  overflow-wrap: anywhere;
}

.quick-card-copy small {
  color: #304b6c;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 500;
  overflow-wrap: anywhere;
}

/* Escritorio */
@media (min-width: 700px) {
  .quick-actions {
    gap: 18px;
    padding-right: 24px;
    padding-left: 24px;
  }

  .quick-card {
    min-height: 225px;
    padding: 20px;
    border-radius: 25px;
  }

  .quick-icon {
    width: 112px;
    height: 112px;
    flex-basis: 112px;
  }

  .quick-arrow {
    top: 126px;
    right: 16px;
  }

  .quick-card-copy strong {
    font-size: 20px;
  }

  .quick-card-copy small {
    font-size: 15px;
  }
}

/* Móviles estrechos */
@media (max-width: 380px) {
  .quick-actions {
    gap: 8px;
    padding-right: 12px;
    padding-left: 12px;
  }

  .quick-card {
    min-height: 174px;
    padding: 12px 10px;
    border-radius: 20px;
  }

  .quick-icon {
    width: 72px;
    height: 72px;
    flex-basis: 72px;
    margin-bottom: 10px;
    border-radius: 25px;
  }

  .quick-icon>.v-icon {
    font-size: 37px !important;
  }

  .quick-arrow {
    top: 83px;
    right: 8px;
    width: 37px;
    height: 37px;
  }

  .quick-card-copy strong {
    font-size: 13px;
    letter-spacing: -0.2px;
  }

  .quick-card-copy small {
    font-size: 10px;
    line-height: 1.3;
  }

  .quick-heart-small,
  .quick-calendar-check {
    font-size: 18px !important;
  }
}

/* =========================================
   SERVICIOS PÚBLICOS PIA
========================================= */
.servicios-section {
  width: 100%;
  padding: 2px 12px 24px;
  color: #102653;
}

.servicios-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.servicios-heading h2 {
  margin: 0;
  color: #102653;
  font-size: 17px;
  font-weight: 850;
  letter-spacing: -0.3px;
}

.servicios-heading p {
  margin: 4px 0 0;
  color: #718096;
  font-size: 11px;
  line-height: 1.4;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
}

.servicios-grid>* {
  min-width: 0;
  width: 100%;
}

.servicios-estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 150px;
  padding: 20px 12px;
  color: #718096;
  font-size: 12px;
  text-align: center;
}

.servicios-estado strong {
  color: #102653;
  font-size: 14px;
}

@media (max-width: 360px) {
  .servicios-section {
    padding-right: 10px;
    padding-left: 10px;
  }

  .servicios-grid {
    gap: 8px;
  }
}

/* =========================================
   BANNER ROTATIVO DE DESCUENTOS
========================================= */

.discount-banner-section {
  margin: 4px 12px 20px;
  overflow: hidden;
}

.discount-banner {
  display: grid;
  grid-template-columns: 42% minmax(0, 1fr);
  min-height: 190px;
  overflow: hidden;
  border: 1px solid #ffe0e8;
  border-radius: 22px;
  background: linear-gradient(135deg, #fff0f4, #fff9fb);
  box-shadow: 0 5px 18px rgba(195, 48, 91, 0.09);
  cursor: pointer;
  animation: discount-appear 0.35s ease;
}

.discount-banner-photo {
  position: relative;
  min-width: 0;
  min-height: 190px;
  background: #fbe1e9;
}

.discount-banner-photo :deep(.v-img) {
  width: 100%;
  height: 100%;
  min-height: 190px;
}

.discount-banner-placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 190px;
  place-items: center;
  color: #d95b80;
  background: #fbe1e9;
}

.discount-banner-tag {
  position: absolute;
  top: 9px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 6px 9px;
  border-radius: 18px;
  background: #f20b4b;
  color: white;
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(140, 12, 51, 0.2);
}

.discount-banner-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  padding: 13px 12px;
}

.discount-banner-eyebrow {
  color: #df3867;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.discount-banner-content h2 {
  display: -webkit-box;
  margin: 5px 0;
  overflow: hidden;
  color: #102653;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.2;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.discount-banner-content p {
  display: -webkit-box;
  margin: 0 0 9px;
  overflow: hidden;
  color: #79566a;
  font-size: 10px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.discount-banner-prices {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 7px;
}

.discount-original-price {
  color: #9b8790;
  font-size: 11px;
  text-decoration: line-through;
}

.discount-banner-prices strong {
  color: #e90e4b;
  font-size: 21px;
  font-weight: 900;
  line-height: 1.2;
}

.discount-banner-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 9px;
  color: #b91e4e;
  font-size: 11px;
  font-weight: 900;
}

.discount-banner-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 10px;
}

.discount-banner-dots button {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 20px;
  background: #f4b8c9;
  cursor: pointer;
  transition: width 0.2s ease, background 0.2s ease;
}

.discount-banner-dots button.active {
  width: 21px;
  background: #e91e52;
}

@keyframes discount-appear {
  from {
    opacity: 0.65;
  }
  to {
    opacity: 1;
  }
}

@media (min-width: 600px) {
  .discount-banner-section {
    margin-right: 20px;
    margin-left: 20px;
  }

  .discount-banner {
    grid-template-columns: 36% minmax(0, 1fr);
    min-height: 230px;
  }

  .discount-banner-photo,
  .discount-banner-photo :deep(.v-img) {
    min-height: 230px;
  }

  .discount-banner-content {
    padding: 22px;
  }

  .discount-banner-content h2 {
    font-size: 23px;
  }

  .discount-banner-content p {
    font-size: 13px;
  }

  .discount-banner-prices strong {
    font-size: 28px;
  }

  .discount-banner-tag {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .discount-banner-section {
    margin-right: 10px;
    margin-left: 10px;
  }

  .discount-banner {
    grid-template-columns: 39% minmax(0, 1fr);
    min-height: 170px;
    border-radius: 17px;
  }

  .discount-banner-photo,
  .discount-banner-photo :deep(.v-img) {
    min-height: 170px;
  }

  .discount-banner-content {
    padding: 9px 8px;
  }

  .discount-banner-content h2 {
    font-size: 13px;
  }

  .discount-banner-content p {
    font-size: 9px;
  }

  .discount-banner-prices {
    gap: 5px;
  }

  .discount-banner-prices strong {
    font-size: 18px;
  }

  .discount-banner-tag {
    top: 6px;
    left: 5px;
    padding: 5px 6px;
    font-size: 9px;
  }
}

</style>
