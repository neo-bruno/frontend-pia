<template>
<div class="pia-page">
  <header class="pia-header">
    <button class="pia-brand" type="button" @click="irInicio">
      <span class="pia-logo">PIA<span class="logo-leaf">◆</span></span>
      <span class="pia-tagline">TU ASISTENTE PERSONAL<br />DE BELLEZA Y BIENESTAR</span>
    </button>

    <button class="location-button" type="button" @click="hojaUbicacion = true">
      <v-icon color="#079b98" size="21">mdi-map-marker</v-icon>
      <span>{{ municipioSeleccionado || departamentoSeleccionado || "Ubicación" }}</span>
      <v-icon size="17">mdi-chevron-down</v-icon>
    </button>

    <div class="pia-header-actions">
      <v-btn class="header-action" color="primary" icon="mdi-bell" variant="text" aria-label="Notificaciones" @click="notificaciones" />
      <v-btn class="header-action login" color="primary" icon="mdi-account-tie" variant="text" aria-label="Loguin" @click="irLoginAdmin" />
      <v-btn class="header-action registrar" icon="mdi-store" variant="text" aria-label="Registrar negocio o profesional" @click="registrar" />
    </div>
  </header>

  <main>
    <!-- Banner principal -->
    <section class="hero-banner">
      <div class="hero-copy">
        <h1>Tu belleza,<br /><span>más cerca de ti</span></h1>
        <p>Descubre los mejores negocios y profesionales de belleza en tu ciudad.</p>
        <div class="hero-dots"><i class="active"></i><i></i><i></i></div>
      </div>
      <img class="hero-character" src="/images/pia/pia-character.png" alt="Pía, tu asistente personal" />
      <span class="hero-star star-one">✦</span><span class="hero-star star-two">✦</span>
    </section>

    <!-- Búsqueda -->
    <section class="search-panel">
      <button class="filter-button" type="button" aria-label="Filtros de búsqueda" @click="hojaFiltros = true">
        <v-icon size="20">mdi-tune-variant</v-icon>
      </button>
      <div class="search-input">
        <v-icon color="primary" size="23" @click="abrirMapa">mdi-map-marker-radius</v-icon>
        <input v-model="textoBusqueda" type="search" placeholder="¿Qué servicio o negocio buscas?" @keyup.enter="buscar" />
      </div>
      <button class="search-submit" type="button" aria-label="Buscar" @click="buscar">
        <v-icon size="20">mdi-send</v-icon>
      </button>
    </section>

    
    <!-- CARRUSEL DE CATEGORÍAS -->
    <!-- <section v-if="categoriasPrincipales.length" class="category-carousel" aria-label="Categorías de negocios">
      <div class="category-track">

        <button v-for="categoria in categoriasPrincipales" :key="categoria.id || categoria.nombre" class="category-item" type="button" @click="seleccionarCategoria(categoria)">
          <span class="category-icon" :style="{'--categoria-color': categoria.color || '#009c95', '--categoria-fondo': categoria.fondo || '#e3f6f3'}">
            <v-icon size="25">
              {{ categoria.icono || 'mdi-store-outline' }}
            </v-icon>
          </span>

          <span class="category-name">
            {{ categoria.nombre }}
          </span>
        </button>

        <button class="category-item category-more" type="button" @click="hojaCategorias = true">
          <span class="category-icon more-icon">
            <v-icon size="25">mdi-dots-horizontal</v-icon>
          </span>

          <span class="category-name">
            Más categorías
          </span>
        </button>

      </div>
    </section> -->
    
    
    <!-- Acciones rápidas: diseño PIA -->
    <section class="quick-actions">
      <!-- Ver en mapa -->
      <!-- <button
        class="quick-card map-card"
        type="button"
        @click="abrirMapa"
      >
        <span class="quick-photo" aria-hidden="true"></span>

        <span class="quick-icon">
          <v-icon color="primary" size="48">mdi-map-marker</v-icon>
        </span>

        <span class="quick-card-copy">
          <strong>Ver en mapa</strong>
          <small>Negocios cerca de ti</small>
        </span>
      </button> -->

      <!-- Mis favoritos -->
      <!-- <button
        class="quick-card favorites-card"
        type="button"
        @click="irFavoritos"
      >
        <span class="quick-photo" aria-hidden="true"></span>

        <span class="quick-icon">
          <v-icon size="48">mdi-heart-outline</v-icon>
          <v-icon class="quick-heart-small" size="23">
            mdi-heart
          </v-icon>
        </span>

        <span class="quick-card-copy">
          <strong>Mis favoritos</strong>
          <small>Tus lugares y servicios</small>
        </span>
      </button> -->

      <!-- Mis reservas -->
      <!-- <button
        class="quick-card reservations-card"
        type="button"
        @click="irReservas"
      >
        <span class="quick-photo" aria-hidden="true"></span>

        <span class="quick-icon">
          <v-icon size="43">mdi-calendar-month-outline</v-icon>
          <v-icon class="quick-calendar-check" size="22">
            mdi-check-circle
          </v-icon>
        </span>

        <span class="quick-card-copy">
          <strong>Mis reservas</strong>
          <small>Gestiona tus citas</small>
        </span>
      </button> -->
    </section>

    <!-- Negocios destacados: conserva TarjetaNegocio -->
    <section class="content-section">
      <div class="section-heading">
        <div class="section-title-row">
          <v-icon color="#079b98" size="24">mdi-store</v-icon>
          <h2>Negocios cerca de ti</h2>
        </div>
        <button class="view-all" type="button" @click="verTodosNegocios">Ver todos <v-icon size="18">mdi-chevron-right</v-icon></button>
      </div>
      <div v-if="cargandoNegocios" class="state-message">
        <v-progress-circular indeterminate color="teal" size="28" /><span>Buscando negocios...</span></div>
      <div v-else-if="errorNegocios" class="state-message">
        <v-icon>mdi-alert-circle-outline</v-icon><span>{{ errorNegocios }}</span><button type="button" @click="obtenerNegocios">Reintentar</button>
      </div>
      <div v-else-if="negociosDestacados.length" class="business-carousel">
        <TarjetaNegocio v-for="negocio in negociosFiltrados" :key="negocio.id" :negocio="negocio" @click="abrirNegocio(negocio)" @favorito="toggleFavoritoNegocio(negocio)" />
      </div>
      <div v-else class="state-message">
        <v-icon>mdi-store-off-outline</v-icon><span>No hay negocios publicados para esta búsqueda.</span><button type="button" @click="limpiarFiltros">Limpiar filtros</button>
      </div>
    </section>

    <!-- Profesionales -->
    <section class="content-section">
      <div class="section-heading">
        <div class="section-title-row">
          <v-icon color="#079b98" size="24">mdi-account-tie</v-icon>
          <h2>Profesionales destacados</h2>
        </div>
        <button class="view-all" type="button" @click="destacadosTab = 'profesionales'; verTodosProfesionales()">Ver todos <v-icon size="18">mdi-chevron-right</v-icon></button>
      </div>
      <div v-if="cargandoProfesionales" class="state-message">
        <v-progress-circular indeterminate color="teal" size="28" /><span>Cargando profesionales...</span></div>      
      <div v-else-if="profesionalesDestacados.length" class="profesionales-carrusel">
          <TarjetaProfesional v-for="profesional in profesionalesDestacados" :key="profesional.id" :profesional="profesional" @click="abrirProfesional(profesional)" @favorito="toggleFavoritoProfesional"/>
        </div>
      <div v-else class="state-message">
        <v-icon>mdi-account-search-outline</v-icon><span>No hay profesionales para mostrar.</span>
      </div>
    </section>

    <!-- Servicios destacados existentes: no inventamos un endpoint -->
    <section class="content-section">
      <div class="section-heading">
        <div class="section-title-row">
          <v-icon color="#079b98" size="24">mdi-content-cut</v-icon>
          <h2>Servicios populares</h2>
        </div>
        <button class="view-all" type="button" @click="avisarServiciosPendientes">Ver todos <v-icon size="18">mdi-chevron-right</v-icon></button>
      </div>
      <div v-if="cargandoServicios" class="state-message">
        <v-progress-circular indeterminate color="teal" size="28" />
        <span>Cargando servicios...</span>
      </div>
      <div v-else-if="serviciosDestacados.length" class="service-carousel">
        <TarjetaServicio v-for="servicio in serviciosDestacados" :key="servicio.id" :servicio="servicio" />
      </div>
      <div v-else class="state-message">
        <v-icon>mdi-content-cut</v-icon>
        <span>No hay servicios publicados para mostrar.</span>
      </div>
    </section>

    <!-- Especialidades visuales -->
    <section class="content-section specialty-section">
      <div class="section-heading">
        <div class="section-title-row">
          <v-icon color="#f4a52a" size="24">mdi-star</v-icon>
          <h2>Especialidades destacadas</h2>
        </div>
        <button class="view-all" type="button" @click="hojaCategorias = true">Ver todas <v-icon size="18">mdi-chevron-right</v-icon></button>
      </div>
      <div v-if="especialidades.length" class="specialty-grid">
        <button v-for="especialidad in especialidades" :key="especialidad.id || especialidad.nombre" class="specialty-card" type="button" @click="seleccionarCategoria(especialidad)">
          <span class="specialty-image" :style="{ background: especialidad.fondo || '#e4f8f6', color: especialidad.color || '#078e8c' }">
            <v-icon size="39">{{ especialidad.icono || 'mdi-star-outline' }}</v-icon>
          </span>
          <strong>{{ especialidad.nombre }}</strong>
        </button>
      </div>
      <div v-else class="state-message">
        <v-icon>mdi-shape-outline</v-icon>
        <span>Las categorías estarán disponibles cuando conectemos su catálogo público.</span>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="benefits-card">
      <div class="benefit-item">
        <v-icon color="#079b98" size="27">mdi-shield-check-outline</v-icon><span><strong>Negocios publicados</strong><small>Consulta su información</small></span>
      </div>
      <div class="benefit-item">
        <v-icon color="#079b98" size="27">mdi-calendar-check-outline</v-icon><span><strong>Reservas fáciles</strong><small>Gestiona tus citas</small></span>
      </div>
      <div class="benefit-item">
        <v-icon color="#079b98" size="27">mdi-bell-outline</v-icon><span><strong>Recordatorios</strong><small>Mantente al día</small></span>
      </div>
      <div class="benefit-item">
        <v-icon color="#079b98" size="27">mdi-message-text-outline</v-icon><span><strong>Asistente Pía</strong><small>Tu guía de belleza</small></span>
      </div>
    </section>
  </main>

  
  <v-bottom-navigation v-model="activeNav" class="pia-bottom-nav" grow elevation="8" height="72">

    <!-- INICIO -->
    <v-btn value="inicio" to="/cliente" class="pia-nav-btn">
      <v-icon size="22">
        mdi-home-outline
      </v-icon>

      <span>Inicio</span>
    </v-btn>

    <!-- FAVORITOS -->
    <v-btn value="favoritos" to="/cliente/favoritos" class="pia-nav-btn">
      <v-icon size="22">
        mdi-heart-outline
      </v-icon>

      <span>Favoritos</span>
    </v-btn>

    <!-- PÍA -->
    <v-btn value="pia" class="pia-bottom-btn" variant="text" stacked @click="abrirAsistente">
      <div class="pia-bottom-avatar">
        <v-img src="/images/pia/pia-character.png" cover />
      </div>
    </v-btn>

    <!-- RESERVAS -->
    <v-btn value="reservas" to="/cliente/reservas" class="pia-nav-btn">
      <v-icon size="22">
        mdi-calendar-outline
      </v-icon>

      <span>Reservas</span>
    </v-btn>

    <!-- PERFIL -->
    <v-btn value="perfil" to="/cliente/perfil" class="pia-nav-btn">
      <v-icon size="22">
        mdi-account-outline
      </v-icon>

      <span>Perfil</span>
    </v-btn>

  </v-bottom-navigation>

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
        <span
          class="sheet-categoria-icono"
          :style="{
            background: categoriaActiva?.fondo || '#e4f8f6',
            color: categoriaActiva?.color || '#078e8c'
          }"
        >
          <v-icon size="25">
            {{ categoriaActiva?.icono || 'mdi-store-outline' }}
          </v-icon>
        </span>

        <div>
          <h3>{{ categoriaActiva?.nombre || 'Negocios' }}</h3>
          <p>Negocios de esta categoría</p>
        </div>
      </div>

      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        aria-label="Cerrar"
        @click="hojaNegociosCategoria = false"
      />
    </div>

    <!-- CARGANDO -->
    <div v-if="cargandoNegociosCategoria" class="sheet-categoria-estado">
      <v-progress-circular
        indeterminate
        color="primary"
        size="32"
      />
      <span>Buscando negocios...</span>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="errorNegociosCategoria"
      class="sheet-categoria-estado"
    >
      <v-icon color="error" size="32">
        mdi-alert-circle-outline
      </v-icon>

      <span>{{ errorNegociosCategoria }}</span>

      <v-btn
        color="primary"
        variant="text"
        @click="obtenerNegociosPorCategoria(categoriaActiva)"
      >
        Reintentar
      </v-btn>
    </div>

    <!-- SIN RESULTADOS -->
    <div
      v-else-if="!negociosCategoria.length"
      class="sheet-categoria-estado"
    >
      <v-icon size="42" color="grey">
        mdi-store-search-outline
      </v-icon>

      <strong>Aún no hay negocios en esta categoría</strong>

      <span>
        Prueba con otra categoría para descubrir más opciones.
      </span>
    </div>

    <!-- LISTA DE NEGOCIOS -->
    <div v-else class="sheet-categoria-lista">
      <TarjetaNegocio
        v-for="negocio in negociosCategoria"
        :key="negocio.id"
        :negocio="negocio"
        @click="abrirNegocio(negocio)"
        @favorito="toggleFavoritoNegocio(negocio)"
      />
    </div>
  </v-card>
</v-bottom-sheet>


  <MapaNegociosSheet v-if="hojaMapa" :key="contadorAperturasMapa" v-model="hojaMapa" :negocios="negociosDestacados" @seleccionar="abrirNegocio"/>

  <DialogoNegocioProfesional v-model="mostrarDialogoRegistro" @negocio="irARegistroNegocio" @profesional="irARegistroProfesional" />
  <DialogoVerificarCodigo v-model="mostrarDialogoVerificarCodigo" @negocio-verificado="negocioVerificado" />
  <LoginCliente v-model="dialogoLoginCliente" @login="clienteAutenticado" />

  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="56" indeterminate />
  </v-overlay>
</div>
</template>

<script>
import TarjetaNegocio from "../components/TarjetaNegocio.vue";
import TarjetaProfesional from "../components/TarjetaProfesional.vue";
import TarjetaServicio from "../components/TarjetaServicio.vue";
import DialogoNegocioProfesional from "../components/DialogoNegocioProfesional.vue";
import DialogoVerificarCodigo from "../components/DialogoVerificarCodigo.vue";
import LoginCliente from "../modules/cliente/components/LoginCliente.vue";
import { getProfessionals } from "../modules/profesional/services/profesional.api.js";
import { getNegocios } from "../services/piaPublico.api.js";
import { municipiosPorDepartamento, } from "@/modules/admin/modules/negocio/data/municipiosBolivia.js";
import MapaNegociosSheet from "../components/MapaNegociosSheet.vue";
import { getBusinessTypes } from "../modules/negocio/services/tipoNegocio.api.js";
import { getFavoritos, agregarFavorito, eliminarFavorito } from "../../cliente/modules/favoritos/services/favorito.api.js";

export default {
  name: "InicioPublicoPage",
  components: {
    TarjetaNegocio,
    TarjetaProfesional,
    TarjetaServicio,
    DialogoNegocioProfesional,
    DialogoVerificarCodigo,
    LoginCliente,
    MapaNegociosSheet,
  },
  data() {  
    return {
      activeNav: "inicio",

      textoBusqueda: "",
      destacadosTab: "negocios",
      negociosDestacados: [],
      profesionalesDestacados: [],
      serviciosDestacados: [],
      especialidades: [],
      cargandoServicios: false,
      cargandoEspecialidades: false,
      errorServicios: "",
      errorEspecialidades: "",
      cargandoNegocios: false,
      cargandoProfesionales: false,
      errorNegocios: "",
      departamentoSeleccionado: "",
      municipioSeleccionado: "",
      busquedaUbicacion: "",
      municipiosPorDepartamento,
      tipoBusqueda: "negocio",
      categoriaSeleccionada: null,
      hojaUbicacion: false,
      hojaFiltros: false,
      hojaCategorias: false,
      favoritosNegocios: [],
      favoritosProfesionales: [],
      mostrarDialogoRegistro: false,
      mostrarDialogoVerificarCodigo: false,
      dialogoLoginCliente: false,
      overlay: false,
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

      hojaMapa: false,
      contadorAperturasMapa: 0,

      tiposNegocio: [],
      cargandoTiposNegocio: false,
      errorTiposNegocio: "",

      hojaNegociosCategoria: false,
      categoriaActiva: null,
      negociosCategoria: [],
      cargandoNegociosCategoria: false,
      errorNegociosCategoria: "",
    };
  },
  computed: {
    categoriasPrincipales() {
      return this.tiposNegocio.slice(0, 6);
    },

    todasCategorias() {
      return this.tiposNegocio;
    },
    ubicacionesFiltradas() {
      const texto = this.busquedaUbicacion.trim().toLocaleLowerCase("es");
      return Object.entries(this.municipiosPorDepartamento)
        .flatMap(([departamento, municipios]) =>
          municipios.map((municipio) => ({ departamento, municipio })),
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
      return this.profesionalesDestacados.filter((p) => {
        const texto = `${p.nombre || ""} ${p.profesion || ""} ${p.slug || ""}`.toLowerCase();
        return !q || texto.includes(q);
      });
    },
  },
  methods: {
    async obtenerTiposNegocio() {
      this.cargandoTiposNegocio = true;
      this.errorTiposNegocio = "";

      try {
        const respuesta = await getBusinessTypes();
        const body = respuesta?.data || {};

        this.tiposNegocio = Array.isArray(body.data)
          ? body.data
          : Array.isArray(body.tiposnegocio)
            ? body.tiposnegocio
            : [];
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
        const lista = body.datos || body.data || body.negocios || [];
        
        this.negociosDestacados = Array.isArray(lista)
          ? lista.map((n) => ({
              ...n,
              imagen: n.imagen || n.logo || n.portada || n.imagen_portada || "",
              ubicacion: n.ubicacion || [n.municipio, n.departamento].filter(Boolean).join(", "),
              favorito: this.favoritosNegocios.includes(n.id),
            }))
          : [];
      } catch (error) {
        console.error("Error al cargar negocios públicos:", error);
        this.errorNegocios = error.response?.data?.mensaje || error.response?.data?.message || "No pudimos cargar los negocios. Revisa el servidor e inténtalo nuevamente.";
      } finally {
        this.cargandoNegocios = false;
      }
    },
    async obtenerProfesionales() {
      this.cargandoProfesionales = true;

      try {
        const res = await getProfessionals();

        if (res?.data?.ok && Array.isArray(res.data.data)) {
          this.profesionalesDestacados = res.data.data.map(
            (profesional) => ({
              ...profesional,
              favorito: this.favoritosProfesionales.includes(
                Number(profesional.id)
              ),
            })
          );
        } else {
          this.profesionalesDestacados = [];
        }
      } catch (error) {
        console.error("Error al cargar profesionales públicos:", error);
        this.profesionalesDestacados = [];
      } finally {
        this.cargandoProfesionales = false;
      }
    },
    async obtenerFavoritosNegocios() {
      const token = localStorage.getItem("cliente_token");

      if (!token) {
        this.favoritosNegocios = [];
        this.favoritosProfesionales = [];

        this.profesionalesDestacados.forEach((profesional) => {
          profesional.favorito = false;
        });

        return;
      }

      try {
        const respuesta = await getFavoritos();
        const datos = respuesta?.data?.data || {};

        // Favoritos de negocios
        this.favoritosNegocios = (datos.negocios || []).map(
          (negocio) => Number(negocio.id)
        );

        // Favoritos de profesionales
        this.favoritosProfesionales = (
          datos.profesionales || []
        ).map((profesional) => Number(profesional.id));

        // Sincronizar negocios
        for (const lista of [
          this.negociosDestacados,
          this.negociosCategoria,
        ]) {
          for (const negocio of lista) {
            negocio.favorito = this.favoritosNegocios.includes(
              Number(negocio.id)
            );
          }
        }

        // Sincronizar profesionales
        for (const profesional of this.profesionalesDestacados) {
          profesional.favorito = this.favoritosProfesionales.includes(
            Number(profesional.id)
          );
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    },

    buscar() {
      if (this.tipoBusqueda !== "negocio") {
        this.hojaFiltros = true;
        return;
      }
      this.hojaFiltros = false;
      if (this.tipoBusqueda === "negocio") this.obtenerNegocios();
      else if (this.tipoBusqueda === "profesional") this.obtenerProfesionales();
      else this.avisarServiciosPendientes();
    },
    aplicarFiltros() {
      this.hojaFiltros = false;
      this.hojaCategorias = false;
      if (this.tipoBusqueda === "negocio") this.obtenerNegocios();
      else if (this.tipoBusqueda === "profesional") this.obtenerProfesionales();
      else this.avisarServiciosPendientes();
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
    seleccionarUbicacion(lugar) {
      this.departamentoSeleccionado = lugar.departamento;
      this.municipioSeleccionado = lugar.municipio;
      this.hojaUbicacion = false;
      if (this.tipoBusqueda === "negocio") this.obtenerNegocios();
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
            const { latitude, longitude } = posicion.coords;

            // Geocodificación inversa para identificar la ubicación.
            const respuesta = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=es`
            );

            if (!respuesta.ok) {
              throw new Error("No se pudo identificar tu ciudad.");
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
                "No pudimos identificar tu municipio. Selecciónalo manualmente."
              );
            }

            // Buscar nombres equivalentes en el catálogo de Bolivia.
            const normalizar = (texto) =>
              texto
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLocaleLowerCase("es")
                .trim();

            const departamentoCatalogo = Object.keys(
              this.municipiosPorDepartamento
            ).find(
              (nombre) => normalizar(nombre) === normalizar(departamento)
            );

            if (!departamentoCatalogo) {
              throw new Error(
                "No encontramos el departamento en el catálogo de Bolivia."
              );
            }

            const municipioCatalogo = this.municipiosPorDepartamento[departamentoCatalogo].find(
                (nombre) => normalizar(nombre) === normalizar(municipio)
              );

            if (!municipioCatalogo) {
              throw new Error(
                "No encontramos el municipio en el catálogo. Selecciónalo manualmente."
              );
            }

            this.departamentoSeleccionado = departamentoCatalogo;
            this.municipioSeleccionado = municipioCatalogo;

            this.hojaUbicacion = false;

          } catch (error) {
            console.error("Error al identificar ubicación:", error);
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
        }
      );
    },
   
    async seleccionarCategoria(categoria) {
      this.categoriaActiva = categoria;
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
        const lista = body.datos || body.data || body.negocios || [];

        this.negociosCategoria = Array.isArray(lista)
          ? lista.map((negocio) => ({
              ...negocio,
              imagen:
                negocio.imagen ||
                negocio.logo ||
                negocio.portada ||
                negocio.imagen_portada ||
                "",
              ubicacion:
                negocio.ubicacion ||
                [
                  negocio.municipio,
                  negocio.departamento,
                ].filter(Boolean).join(", "),
              favorito: this.favoritosNegocios.includes(negocio.id),
            }))
          : [];
      } catch (error) {
        console.error(
          "Error al cargar negocios por categoría:",
          error
        );

        this.errorNegociosCategoria =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No pudimos cargar los negocios de esta categoría.";
      } finally {
        this.cargandoNegociosCategoria = false;
      }
    },
    
    async toggleFavoritoNegocio(negocio) {
      const token = localStorage.getItem("cliente_token");

      if (!token) {
        this.dialogoLoginCliente = true;
        return;
      }

      if (negocio.procesandoFavorito) return;

      const eraFavorito = this.favoritosNegocios.includes(negocio.id);

      negocio.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito("NEGOCIO", negocio.id);

          this.favoritosNegocios = this.favoritosNegocios.filter(
            (id) => id !== negocio.id,
          );
        } else {
          await agregarFavorito("NEGOCIO", negocio.id);

          if (!this.favoritosNegocios.includes(negocio.id)) {
            this.favoritosNegocios.push(negocio.id);
          }
        }

        // Sincronizar las tarjetas de ambas listas.
        for (const lista of [
          this.negociosDestacados,
          this.negociosCategoria,
        ]) {
          const tarjeta = lista.find((item) => item.id === negocio.id);

          if (tarjeta) {
            tarjeta.favorito = !eraFavorito;
          }
        }
      } catch (error) {
        console.error("Error al actualizar favorito:", error);

        const status = error.response?.status;

        if (status === 401) {
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

      const eraFavorito = this.favoritosProfesionales.includes(id);

      profesional.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito("PROFESIONAL", id);

          this.favoritosProfesionales =
            this.favoritosProfesionales.filter(
              (favoritoId) => favoritoId !== id
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
            "No se pudo actualizar el favorito."
          );
        }
      } finally {
        profesional.procesandoFavorito = false;
      }
    },
    abrirNegocio(negocio) {
      if (negocio.slug) this.$router.push({
        path: `/negocio/${negocio.slug}`
      }).catch(() => {});
      else console.info("Falta definir la ruta pública del negocio:", negocio);
    },
    abrirProfesional(profesional) {
      if (profesional.slug) this.$router.push({
        name: "perfil-profesional",
        params: {
          slug: profesional.slug
        }
      }).catch(() => {});
      else console.info("El profesional no tiene slug público:", profesional);
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
      if (localStorage.getItem("cliente")) this.$router.push({
        path: "/cliente/favoritos"
      }).catch(() => {});
      else this.dialogoLoginCliente = true;
    },
    irReservas() {
      if (localStorage.getItem("cliente")) this.$router.push({
        path: "/cliente/reservas"
      }).catch(() => {});
      else this.dialogoLoginCliente = true;
    },
    irLoginCliente() {
      if (localStorage.getItem("cliente")) this.$router.push({
        name: "cliente"
      }).catch(() => {});
      else this.dialogoLoginCliente = true;
    },
    irLoginAdmin() {
      this.$router.push("/login");      
    },
    irInicio() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    notificaciones() {
      this.$router.push({path: '/cliente/notificaciones'})
    },
    abrirAsistente() {
      this.$router.push({path: '/'})
      console.info("Abrir asistente Pía");
    },
    avisarServiciosPendientes() {
      console.info("El catálogo público de servicios debe conectarse al endpoint correspondiente.");
    },
    registrar() {
      this.mostrarDialogoRegistro = true;
    },
    irARegistroNegocio() {
      this.overlay = true;
      this.$router.push({
        name: "registro-negocio"
      }).finally(() => {
        this.overlay = false;
      });
    },
    irARegistroProfesional() {
      this.mostrarDialogoVerificarCodigo = true;
    },
    negocioVerificado(negocio) {
      this.overlay = true;
      this.$router.push({
        name: "registro-profesional",
        query: {
          negocio_id: negocio.id,
          negocio_nombre: negocio.nombre,
          negocio_codigo: negocio.codigo
        },
      }).finally(() => {
        this.overlay = false;
      });
    },
    clienteAutenticado() {
      this.$router.push({
        name: "cliente"
      });
    },
  },
  async mounted() {
    await this.obtenerFavoritosNegocios();

    this.obtenerNegocios();
    this.obtenerProfesionales();
    this.obtenerTiposNegocio();
  },
};
</script>

<style scoped>
.pia-page {
  --teal: #079b98;
  --teal-dark: #087f7d;
  --navy: #102653;
  --muted: #65768e;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 82px;
  background: #fff;
  color: var(--navy);
  overflow-x: hidden;
  box-sizing: border-box
}

.pia-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  min-height: 72px;
  padding: 10px 14px;
  background: #fff
}

.pia-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left
}

.pia-logo {
  position: relative;
  color: var(--teal-dark);
  font-size: 33px;
  line-height: 32px;
  font-weight: 900;
  letter-spacing: -2px
}

.logo-leaf {
  position: absolute;
  top: -2px;
  right: -9px;
  color: #49bcb2;
  font-size: 10px;
  transform: rotate(-25deg)
}

.pia-tagline {
  color: #52637b;
  font-size: 7px;
  line-height: 8px;
  font-weight: 700
}

.location-button {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  padding: 5px 0;
  border: 0;
  background: transparent;
  color: var(--navy);
  font-size: 11px;
  font-weight: 800
}

.location-button span {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.pia-header-actions {
  display: flex;
  align-items: center;
  gap: 1px
}

.header-action {
  width: 34px !important;
  height: 36px !important;  
}

.header-action.registrar {
  color: var(--teal-dark) !important
}

.hero-banner {
  position: relative;
  min-height: 235px;
  margin: 0 12px;
  overflow: hidden;
  padding: 28px 18px;
  border-radius: 24px;
  background: linear-gradient(115deg, #e3f7f4, #f4fcf8 65%, #c9eee7)
}

.hero-copy {
  position: relative;
  z-index: 2;
  width: 64%
}

.hero-copy h1 {
  margin: 8px 0 0;
  color: var(--navy);
  font-size: clamp(26px, 6vw, 35px);
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -.7px
}

.hero-copy h1 span {
  color: var(--teal)
}

.hero-copy p {
  max-width: 220px;
  margin: 10px 0 0;
  color: #526c8d;
  font-size: 12px;
  line-height: 1.4
}

.hero-character {
  position: absolute;
  right: -7px;
  bottom: 0;
  width: 48%;
  height: 94%;
  object-fit: contain;
  object-position: bottom center
}

.hero-dots {
  display: flex;
  gap: 6px;
  margin-top: 14px
}

.hero-dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b5ded9
}

.hero-dots i.active {
  background: var(--teal)
}

.hero-star {
  position: absolute;
  color: #ffb45c;
  font-size: 24px
}

.star-one {
  top: 28px;
  right: 38%
}

.star-two {
  top: 65px;
  right: 10px
}

.search-panel {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 7px;
  margin: -14px 16px 0;
  padding: 7px;
  border-radius: 23px;
  background: white;
  box-shadow: 0 6px 22px #163a4b18
}

.filter-button,
.search-submit {
  display: grid;
  place-items: center;
  flex: 0 0 35px;
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 50%;
  background: #e5f8f5;
  color: var(--teal-dark)
}

.search-input {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0
}

.search-input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--navy);
  font: inherit;
  font-size: 12px
}

.search-input input::placeholder {
  color: #8594aa;
  opacity: 1
}

.search-submit {
  background: var(--teal);
  color: #fff
}

.category-strip {
  display: flex;
  gap: 12px;
  padding: 18px 15px 16px;
  overflow-x: auto;
  scrollbar-width: none
}

.category-strip::-webkit-scrollbar {
  display: none
}

.category-item {
  display: flex;
  flex: 0 0 56px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--navy);
  font-size: 10px;
  font-weight: 700
}

.category-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%
}

.more-icon {
  background: #e8f7f5;
  color: #17365b
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 0 13px 20px
}

.quick-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 13px;
  min-width: 0;
  min-height: 126px;
  padding: 12px 10px 13px;
  border: 1px solid transparent;
  border-radius: 19px;
  text-align: left;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.quick-card:active {
  transform: scale(0.975);
}

.quick-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}

.quick-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.22);
}

.quick-card-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  min-width: 0;
}

.quick-card strong {
  display: block;
  font-size: 11px;
  line-height: 1.25;
  font-weight: 850;
  letter-spacing: -0.15px;
  overflow-wrap: anywhere;
}

.quick-card small {
  display: block;
  max-width: 100%;
  font-size: 9px;
  line-height: 1.35;
  font-weight: 550;
  opacity: 0.9;
  overflow-wrap: anywhere;
}

.map-card {
  background: linear-gradient(145deg, #0ba6a0 0%, #078783 100%);
  color: #fff;
  box-shadow: 0 5px 13px rgba(7, 135, 131, 0.13);
}

.map-card .quick-icon {
  background: rgba(255, 255, 255, 0.19);
  color: #fff;
}

.favorites-card {
  background: #fff3f7;
  border-color: #f8dce7;
  color: #a9255d;
}

.favorites-card .quick-icon {
  background: #ffe2ed;
  color: #b72d68;
}

.reservations-card {
  background: #eff7ff;
  border-color: #dcecff;
  color: #174f96;
}

.reservations-card .quick-icon {
  background: #dceeff;
  color: #175bb0;
}

.quick-arrow {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  flex: 0 0 27px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
}

.map-card .quick-arrow {
  color: #087f7d;
}

.favorites-card .quick-arrow {
  color: #b72d68;
  background: #fff;
}

.reservations-card .quick-arrow {
  color: #175bb0;
  background: #fff;
}

.content-section {
  padding: 2px 7px 18px
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  margin-bottom: 12px
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0
}

.section-title-row h2 {
  margin: 0;
  color: var(--navy);
  font-size: 16px;
  line-height: 1.2;
  font-weight: 900
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 0;
  flex: 0 0 auto;
  padding: 4px 0 4px 4px;
  border: 0;
  background: transparent;
  color: var(--teal-dark);
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap
}

.business-carousel,
.professional-carousel,
.service-carousel {
  display: grid;
  grid-auto-columns: minmax(0, 72%);
  grid-auto-flow: column;
  gap: 3px;
  overflow-x: auto;
  padding: 0 0 7px;
  scrollbar-width: none;
  scroll-snap-type: x mandatory
}

.business-carousel::-webkit-scrollbar,
.professional-carousel::-webkit-scrollbar,
.service-carousel::-webkit-scrollbar {
  display: none
}

.business-carousel>*,
.professional-carousel>*,
.service-carousel>* {
  min-width: 0;
  scroll-snap-align: start
}

.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 115px;
  padding: 16px;
  border: 1px dashed #cfe5e2;
  border-radius: 15px;
  color: #65768e;
  text-align: center;
  font-size: 12px
}

.state-message button {
  border: 0;
  background: transparent;
  color: var(--teal-dark);
  font-weight: 800
}

.section-note {
  margin: 6px 2px 0;
  color: #8390a2;
  font-size: 10px;
  line-height: 1.4
}

.specialty-section {
  border-top: 1px solid #edf2f3;
  padding-top: 17px
}

.specialty-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px
}

.specialty-card {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 112px;
  overflow: hidden;
  padding: 10px;
  border: 0;
  border-radius: 14px;
  background: #f3e8e0;
  text-align: left
}

.specialty-image {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: .86
}

.specialty-image .v-icon {
  transform: scale(1.6);
  opacity: .7
}

.specialty-card strong {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 13px;
  text-shadow: 0 1px 5px #1b253b80
}

.benefits-card {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 9px;
  margin: 0 14px 20px;
  padding: 16px 11px;
  border: 1px solid #dceeed;
  border-radius: 18px;
  background: #effaf8
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0
}

.benefit-item span {
  display: flex;
  flex-direction: column;
  gap: 3px
}

.benefit-item strong {
  color: var(--navy);
  font-size: 10px
}

.benefit-item small {
  color: #65768e;
  font-size: 9px;
  line-height: 1.25
}

/* =========================================================
   BOTTOM NAV
========================================================= */

.pia-bottom-nav {

  position: fixed !important;

  bottom: 0;
  left: 0;
  right: 0;

  height: 72px;

  background: #ffffff !important;

  border-top: 1px solid #e6eeee;

  z-index: 1200;

}

/* =========================================================
   BOTONES NAV
========================================================= */

.pia-nav-btn {

  min-width: 20% !important;

  color: #64748b !important;

  font-family: "Nunito", sans-serif;

  font-size: 10px;

  text-transform: none !important;
}

.pia-nav-btn :deep(.v-btn__content) {

  gap: 3px;

}

.pia-nav-btn.v-btn--active {

  color: #008b8b !important;

}

/* =========================================================
   BOTÓN CENTRAL PÍA
========================================================= */

.pia-center-wrapper {

  position: relative;

  width: 20%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.pia-bottom-btn {
  overflow: visible !important;
}

.pia-bottom-avatar {
  position: absolute;
  top: -0px;
  width: 57px;
  height: 57px;
  overflow: hidden;
  border: 4px solid #ffffff;
  border-radius: 50%;
  background: #0b9d98;
  box-shadow: 0 3px 12px rgba(8, 127, 125, 0.25);
}

.pia-assistant-btn {

  width: 54px !important;
  height: 54px !important;

  margin-top: -28px;

  padding: 0 !important;

  overflow: hidden;

  border-radius: 50% !important;

  background: #ffffff !important;

  border: 4px solid white;

  box-shadow:
    0 4px 14px rgba(0, 130, 145, 0.25);
}

.pia-assistant-btn :deep(.v-img) {

  width: 100%;
  height: 100%;

}

.pia-assistant-label {

  margin-top: 1px;

  font-size: 10px;

  color: #008b8b;

  font-weight: 700;

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

  .hero-banner {
    min-height: 300px;
    margin: 0 24px;
    padding: 38px 40px
  }

  .hero-copy {
    width: 55%
  }

  .hero-copy h1 {
    font-size: 44px
  }

  .hero-copy p {
    font-size: 15px;
    max-width: 300px
  }

  .hero-character {
    width: 38%
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

  .hero-banner {
    min-height: 218px;
    padding: 20px 13px
  }

  .hero-copy {
    width: 65%
  }

  .hero-copy h1 {
    font-size: 25px
  }

  .hero-character {
    width: 43%;
    right: -10px
  }

  .quick-actions {
    gap: 6px;
    padding-right: 10px;
    padding-left: 10px
  }

  .quick-card {
    padding: 10px 7px
  }

  .quick-card strong {
    font-size: 10px
  }

  .quick-card small {
    font-size: 8px
  }

  .section-title-row h2 {
    font-size: 14px
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
.profesionales-carrusel > * {
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

.quick-card > *:not(.quick-photo) {
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
  background: linear-gradient(
    115deg,
    rgba(236, 250, 247, 0.94),
    rgba(230, 245, 241, 0.72)
  );
}

/* Favoritos: fotografía de belleza y flores */
.favorites-card .quick-photo {
  background-image: url("https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80");
}

.favorites-card::before {
  background: linear-gradient(
    115deg,
    rgba(255, 248, 250, 0.94),
    rgba(255, 237, 241, 0.76)
  );
}

/* Reservas: fotografía de agenda y espacio de belleza */
.reservations-card .quick-photo {
  background-image: url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80");
}

.reservations-card::before {
  background: linear-gradient(
    115deg,
    rgba(243, 248, 255, 0.95),
    rgba(226, 237, 250, 0.78)
  );
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

  .quick-icon > .v-icon {
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

</style>
