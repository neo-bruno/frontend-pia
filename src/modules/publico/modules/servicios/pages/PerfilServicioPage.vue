<template>
<main class="perfil-servicio">
  <!-- GALERÍA PRINCIPAL -->
  <section class="hero-gallery">
    <v-img :src="imagenPrincipal" class="hero-image" cover :alt="nombreServicio" @click="abrirGaleria">
      <template #placeholder>
        <div class="hero-placeholder">
          <v-progress-circular indeterminate color="#079b98" size="36" />
        </div>
      </template>

      <template #error>
        <div class="hero-placeholder">
          <v-icon size="54" color="#079b98">
            mdi-image-off-outline
          </v-icon>
        </div>
      </template>
    </v-img>

    <div class="hero-overlay">
      <button class="hero-action back-action" aria-label="Volver" @click="volver">
        <v-icon size="27">mdi-arrow-left</v-icon>
      </button>

      <div class="hero-actions-right">
        <button class="hero-action" aria-label="Agregar a favoritos" @click="toggleFavorito">
          <v-icon size="25">
            {{ favorito?'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
        </button>

        <button class="hero-action" aria-label="Compartir servicio" @click="compartirServicio">
          <v-icon size="24">mdi-share-variant-outline</v-icon>
        </button>
      </div>

      <div v-if="imagenes.length" class="photo-counter" @click="abrirGaleria">
        <v-icon size="15">mdi-image-multiple-outline</v-icon>
        {{ indiceImagen + 1 }}/{{ imagenes.length }}
      </div>
    </div>
  </section>

  <!-- CARGANDO -->
  <section v-if="cargando" class="state-container">
    <v-progress-circular indeterminate color="#079b98" size="36" />
    <p>Cargando información del servicio...</p>
  </section>

  <!-- ERROR -->
  <section v-else-if="error" class="state-container">
    <v-icon color="error" size="42">
      mdi-alert-circle-outline
    </v-icon>

    <strong>No pudimos cargar el servicio</strong>
    <p>{{ error }}</p>

    <v-btn color="#079b98" variant="flat" rounded="lg" @click="cargarServicio">
      Intentar nuevamente
    </v-btn>
  </section>

  <!-- CONTENIDO DEL SERVICIO -->
  <template v-else-if="servicio">
    <section class="service-summary">
      <div v-if="tieneDescuento" class="promotion-label">
        <v-icon size="15">mdi-tag-heart-outline</v-icon>
        <span>PROMOCIÓN ESPECIAL</span>
      </div>
      
      <div v-if="tieneDescuento" class="discount-savings">
        <div class="savings-icon">
          <v-icon size="18">mdi-check-decagram</v-icon>
        </div>
        <div class="savings-copy">
          <strong>¡Aprovecha esta promoción!</strong>
          <span>Ahorras Bs {{ precioTexto(montoAhorrado) }} en este servicio</span>
        </div>
      </div>
      
      <!-- CÓDIGO DE DESCUENTO PÚBLICO -->
      <div v-if="mostrarCodigoDescuento" class="codigo-descuento-card">
        <div class="codigo-descuento-info">
          <div class="codigo-descuento-icono">
            <v-icon size="19">mdi-ticket-percent-outline</v-icon>
          </div>

          <div class="codigo-descuento-texto">
            <span>CÓDIGO DE DESCUENTO</span>
            <strong>{{ codigoDescuento }}</strong>
            <small>Cópialo y úsalo al reservar este servicio.</small>
          </div>
        </div>

        <button type="button" class="codigo-descuento-copiar" @click="copiarCodigoDescuento">
          <v-icon size="17">mdi-content-copy</v-icon>
          Copiar
        </button>
      </div>

      <div class="title-price-row">
        <h1>{{ nombreServicio }}</h1>
        <div class="summary-price" :class="{ 'has-discount': tieneDescuento }">
          <template v-if="tieneDescuento">
            <span class="old-price">Bs {{ precioTexto(precioOriginal) }}</span>
            <strong class="final-price">Bs {{ precioTexto(precioFinal) }}</strong>
            <span class="discount-badge">{{ etiquetaDescuento }}</span>
          </template>
          <strong v-else class="final-price">Bs {{ precioTexto(precioOriginal) }}</strong>
        </div>
      </div>
      
      <div class="summary-rating">
        <v-icon color="#ffb900" size="21">{{ rating > 0?'mdi-star' : 'mdi-star-outline' }}</v-icon>
        <strong>{{ rating.toFixed(1) }}</strong>
        <span>({{ resenasTexto }})</span>
      </div>
      
      <button type="button" class="negocio-resumen" @click="irAlNegocio">
        <!-- COLUMNA IZQUIERDA: LOGO -->
        <div class="negocio-logo">
          <v-img v-if="logoNegocio" :src="logoNegocio" cover alt="Logo del negocio"/>
          <v-icon v-else size="30">mdi-store</v-icon>
        </div>

        <!-- COLUMNA CENTRAL: INFORMACIÓN -->
        <div class="negocio-resumen-contenido">
          <strong>{{ nombreNegocio }}</strong>

          <div class="negocio-rating">
            <v-icon color="#ffb900" size="21">mdi-star</v-icon>
            <b>{{ ratingNegocio.toFixed(1) }}</b>
            <span>({{ resenasNegocioTexto }})</span>
          </div>

          <span class="negocio-ubicacion">
            <v-icon size="19">mdi-map-marker</v-icon>
            {{ ubicacionNegocio }}
          </span>
        </div>

        <!-- COLUMNA DERECHA: ESTADO, FLECHA Y DISTANCIA -->
        <div class="negocio-estado-contenedor">

          <span class="negocio-estado" :class="estadoNegocio.abierto ? 'abierto' : 'cerrado'">
            <i></i>
            {{ estadoNegocio.texto }}
          </span>

          <v-icon class="negocio-resumen-flecha" size="27">
            mdi-chevron-right
          </v-icon>

          <span v-if="distanciaNegocio" class="negocio-distancia">
            <v-icon size="23">mdi-map-marker-distance</v-icon>
            {{ distanciaNegocio }}
          </span>

        </div>
      </button>

    </section>

    <!-- PESTAÑAS -->
    <nav class="detail-tabs" aria-label="Información del servicio">
      <button v-for="tab in tabs" :key="tab.value" type="button" class="detail-tab" :class="{ active: tabActiva === tab.value }" @click="tabActiva = tab.value">
        {{ tab.label }}
      </button>
    </nav>  

    <!-- INFORMACIÓN -->
    <section v-if="tabActiva === 'informacion'" class="tab-content">
      <h2>Descripción</h2>

      <p class="description">
        {{ descripcion || 'No hay una descripción disponible para este servicio.' }}
      </p>

      <div v-if="etiquetas.length" class="service-tags">
        <span v-for="etiqueta in etiquetas" :key="etiqueta">
          {{ etiqueta }}
        </span>
      </div>

      <div class="service-characteristics">
        <div class="characteristic">
          <span class="characteristic-icon">
            <v-icon size="18">mdi-clock-outline</v-icon>
          </span>
          <div><span>Duración</span><strong>{{ duracion || 'No especificada' }}</strong></div>
        </div>
        <div class="characteristic">
          <span class="characteristic-icon">
            <v-icon size="18">mdi-content-cut</v-icon>
          </span>
          <div><span>Tipo de servicio</span><strong>{{ tipoServicio }}</strong></div>
        </div>
      </div>

      <!-- GALERÍA -->
      <div class="gallery-heading">
        <h2>Galería de fotos</h2>

        <button v-if="imagenes.length > 1" type="button" @click="abrirGaleria">
          Ver todas
        </button>
      </div>

      <div v-if="imagenes.length" class="thumbnail-gallery">
        <button v-for="(imagen, index) in imagenes" :key="`${imagen}-${index}`" type="button" class="thumbnail" :aria-label="`Ver fotografía ${index + 1}`" @click="seleccionarImagen(index)">
          <v-img :src="imagen" cover />
        </button>
      </div>

      <p v-else class="muted-message">
        No hay fotografías adicionales.
      </p>
    </section>

    <!-- PROFESIONAL -->
    <section v-else-if="tabActiva === 'profesional'" class="tab-content professional-content">
      <h2>Profesional</h2>

      <!-- TARJETA DEL PROFESIONAL -->
      <div class="professional-card" role="button" tabindex="0" @click="irAlProfesional" @keydown.enter="irAlProfesional">
        <!-- FOTO -->
        <v-avatar size="52" color="#eaf5f3" class="professional-avatar">
          <v-img v-if="fotoProfesional" :src="fotoProfesional" cover/>
          <v-icon v-else size="26" color="#079b98">
            mdi-account
          </v-icon>
        </v-avatar>

        <!-- INFORMACIÓN -->
        <div class="professional-info">
          <strong>{{ nombreProfesional }}</strong>

          <span class="professional-business">
            {{ nombreNegocio }}
          </span>

          <div v-if="ratingProfesional > 0" class="professional-rating">
            <v-icon size="16" color="#ffb900">
              mdi-star
            </v-icon>

            <b>{{ ratingProfesional.toFixed(1) }}</b>

            <span>({{ resenasProfesionalTexto }})</span>
          </div>
        </div>

        <!-- FLECHA -->
        <v-icon class="professional-arrow" size="23">
          mdi-chevron-right
        </v-icon>
      </div>

      <!-- DESCRIPCIÓN -->
      <p v-if="descripcionProfesional" class="description">
        {{ descripcionProfesional }}
      </p>

      <p v-else class="muted-message">
        No hay información adicional del profesional.
      </p>
    </section>

    <!-- RESEÑAS -->
    <section v-else class="tab-content reviews-content">
      <h2>Reseñas de clientes</h2>

      <div class="reviews-overview">
        <strong>{{ rating.toFixed(1) }}</strong>

        <div>
          <div class="review-stars">
            <v-icon v-for="estrella in 5" :key="estrella" size="19" :color="estrella <= Math.round(rating)?'#ffb900' : '#d8dee8'">
              {{ estrella <= Math.round(rating)?'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </div>

          <span>{{ resenasTexto }} reseñas</span>
        </div>
      </div>

      <div v-if="resenas.length" class="lista-resenas">
        <article v-for="resena in resenas" :key="resena.id || `${resena.cliente_nombre || resena.cliente || 'cliente'}-${resena.fecha || ''}`" class="resena-card">
          <div class="resena-cabecera">
            <div class="resena-avatar">
              <v-icon size="20">mdi-account</v-icon>
            </div>
            <div class="resena-cliente">
              <strong>{{ resena.cliente_nombre || resena.cliente || resena.nombre_cliente || 'Cliente' }}</strong>
              <span v-if="resena.fecha">{{ fechaResena(resena.fecha) }}</span>
            </div>
            <div class="resena-puntaje">
              <v-icon size="15" color="#ffb900">mdi-star</v-icon>
              {{ Number(resena.puntaje ?? resena.calificacion ?? resena.rating ?? 0).toFixed(1) }}
            </div>
          </div>
          <strong v-if="resena.titulo" class="resena-titulo">
            {{ resena.titulo }}
          </strong>
          <p v-if="resena.observacion || resena.comentario || resena.comentarios || resena.descripcion" class="resena-comentario">
            {{ resena.observacion || resena.comentario || resena.comentarios || resena.descripcion }}
          </p>
        </article>
      </div>

      <p v-else class="muted-message">
        {{ resenasTexto === '0'
         ?'Este servicio todavía no tiene comentarios publicados.'
          : 'Hay calificaciones registradas, pero la API del servicio no está devolviendo todavía el detalle de los comentarios.' }}
      </p>
    </section>
    
    <!-- RESERVAR -->
    <div class="reserve-container">
      <v-btn block size="large" color="#079b98" rounded="lg" append-icon="mdi-chevron-right" class="reserve-button" prepend-icon="mdi-calendar-month-outline" @click="reservarAhora">
        Agendar cita
      </v-btn>
    </div>

  </template>

  <!-- VISOR DE FOTOGRAFÍAS -->
  <v-dialog v-model="dialogGaleria" fullscreen transition="dialog-bottom-transition">
    <v-card class="gallery-dialog">
      <v-toolbar color="#102653" dark>
        <v-btn icon="mdi-close" aria-label="Cerrar galería" @click="dialogGaleria = false" />

        <v-toolbar-title>
          Galería de fotos
        </v-toolbar-title>

        <v-spacer />

        <span class="gallery-position">
          {{ indiceImagen + 1 }}/{{ imagenes.length }}
        </span>
      </v-toolbar>

      <div class="gallery-viewer">
        <v-btn v-if="imagenes.length > 1" icon="mdi-chevron-left" class="gallery-arrow previous" aria-label="Fotografía anterior" @click="imagenAnterior" />

        <v-img v-if="imagenes.length" :src="imagenes[indiceImagen]" class="gallery-large-image" contain />

        <v-btn v-if="imagenes.length > 1" icon="mdi-chevron-right" class="gallery-arrow next" aria-label="Fotografía siguiente" @click="imagenSiguiente" />
      </div>
    </v-card>
  </v-dialog>
</main>

<!-- LOGIN DEL CLIENTE -->
<LoginCliente v-model="dialogoLoginCliente" @login="clienteAutenticado"/>

</template>

<script>
import { getBusinessBySlug } from '../../negocio/services/negocio.api.js';
import { getServicesById } from '../services/servicio.api.js';
import { getFileUrl } from '@/utils/ayuda.js'
import { getFavoritos, agregarFavorito, eliminarFavorito } from "../../../../cliente/modules/favoritos/services/favorito.api.js";
import LoginCliente from '../../cliente/components/LoginCliente.vue';

export default {
  name: 'PerfilServicioPage',

  components: {
    LoginCliente,
  },

  data() {
    return {
      servicio: null,
      cargando: false,
      error: '',

      tabActiva: 'informacion',

      favorito: false,

      dialogGaleria: false,
      indiceImagen: 0,

      tabs: [{
          label: 'Información',
          value: 'informacion'
        },
        {
          label: 'Profesional',
          value: 'profesional'
        },
        {
          label: 'Reseñas',
          value: 'resenas'
        },
      ],

      negocioPublico: null,
      distanciaNegocio: '',

      favorito: false,
      procesandoFavorito: false,
      dialogoLoginCliente: false,
      favoritoPendiente: false,

    };
  },

  computed: {
    datosServicio() {
      return this.servicio?.servicio || this.servicio || {};
    },

    datosNegocio() {
      return (
        this.datosServicio.negocio ||
        this.servicio?.negocio || {}
      );
    },

    datosProfesional() {
      return (
        this.datosServicio.profesional ||
        this.servicio?.profesional || {}
      );
    },

    nombreServicio() {
      return (
        this.datosServicio.servicio_nombre ||
        this.datosServicio.nombre ||
        'Servicio de belleza'
      );
    },

    nombreNegocio() {
      return (
        this.datosServicio.negocio_nombre ||
        this.datosNegocio.nombre ||
        this.datosNegocio.nombre_negocio ||
        'Negocio de belleza'
      );
    },

    nombreProfesional() {
      return (
        this.datosServicio.profesional_nombre ||
        this.datosProfesional.nombre_completo ||
        this.datosProfesional.nombre ||
        'Profesional de belleza'
      );
    },

    descripcionProfesional() {
      return (
        this.datosProfesional.descripcion ||
        this.datosProfesional.biografia ||
        this.datosProfesional.descripcion_profesional ||
        this.datosProfesional.presentacion ||
        this.datosProfesional.lema ||
        this.servicio?.profesional?.descripcion ||
        this.servicio?.profesional?.biografia ||
        ''
      );
    },

    descripcion() {
      return (
        this.datosServicio.servicio_descripcion ||
        this.datosServicio.descripcion ||
        ''
      );
    },

    precioOriginal() {
      return Number(this.datosServicio.precio) || 0;
    },

    precioFinal() {
      const precio = Number(this.datosServicio.precio_final);

      return Number.isFinite(precio) && precio >= 0 ?
        precio :
        this.precioOriginal;
    },

    tieneDescuento() {
      return (
        this.datosServicio.tiene_descuento === true &&
        this.precioFinal < this.precioOriginal
      );
    },

    montoAhorrado() {
      return Math.max(
        0,
        this.precioOriginal - this.precioFinal
      );
    },

    tipoDescuento() {
      if (this.datosServicio.descuento_monto != null) {
        return 'MONTO';
      }

      if (this.datosServicio.descuento_porcentaje != null) {
        return 'PORCENTAJE';
      }

      return null;
    },

    etiquetaDescuento() {
      if (!this.tieneDescuento) return '';

      if (this.tipoDescuento === 'MONTO') {
        return `−Bs ${this.precioTexto(
          this.datosServicio.descuento_monto
        )}`;
      }

      if (this.tipoDescuento === 'PORCENTAJE') {
        return `−${this.precioTexto(
          this.datosServicio.descuento_porcentaje
        )}%`;
      }

      return '';
    },
    
    esDescuentoPublico() {
      return (
        String(this.datosServicio.descuento_visibilidad || "")
          .trim()
          .toUpperCase() === "PUBLICO"
      );
    },

    codigoDescuento() {
      return String(
        this.datosServicio.descuento_codigo || ""
      ).trim();
    },

    mostrarCodigoDescuento() {
      return (
        this.tieneDescuento &&
        this.esDescuentoPublico &&
        Boolean(this.codigoDescuento)
      );
    },


    rating() {
      const valor = this.datosServicio?.calificacion?? 0;
      const numero = Number(valor);

      return Number.isFinite(numero) ?
        Math.min(5, Math.max(0, numero)) :
        0;
    },

    resenasTexto() {
      const valor = this.datosServicio?.cantidad_calificaciones?? 0;

      const numero = Number(valor);

      return Number.isFinite(numero) && numero >= 0 ?
        numero.toLocaleString("es-BO") :
        "0";
    },

    ratingProfesional() {
      const profesional = this.datosProfesional;

      const valor =
        profesional.calificacion ??
        profesional.rating ??
        profesional.promedio_calificacion ??
        profesional.promedio ??
        profesional.promedio_resenas ??
        0;

      const numero = Number(valor);

      return Number.isFinite(numero)
        ? Math.min(5, Math.max(0, numero))
        : 0;
    },

    resenasProfesionalTexto() {
      const profesional = this.datosProfesional;

      const valor =
        profesional.cantidad_calificaciones ??
        profesional.total_resenas ??
        profesional.cantidad_resenas ??
        profesional.total_calificaciones ??
        profesional.resenas ??
        0;

      const numero = Number(valor);

      return Number.isFinite(numero) && numero >= 0
        ? numero.toLocaleString("es-BO")
        : "0";
    },

    ubicacion() {
      return (
        this.datosServicio.ubicacion || [
          this.datosServicio.zona,
          this.datosServicio.municipio ||
          this.datosNegocio.municipio,
          this.datosServicio.departamento ||
          this.datosNegocio.departamento,
        ]
        .filter(Boolean)
        .filter((valor, indice, lista) => lista.indexOf(valor) === indice)
        .join(', ')
      );
    },

    distancia() {
      const valor =
        this.datosServicio.distancia_km??
        this.datosServicio.distancia??
        this.datosNegocio.distancia_km??
        this.datosNegocio.distancia;

      if (valor === undefined || valor === null || valor === '') {
        return '';
      }

      const numero = Number(valor);

      if (!Number.isFinite(numero) || numero < 0) {
        return '';
      }

      return numero < 1 ?
        `${Math.round(numero * 1000)} m` :
        `${numero.toFixed(1)} km`;
    },

    duracion() {
      const valor =
        this.datosServicio.duracion_minutos??
        this.datosServicio.duracion;

      if (valor === undefined || valor === null || valor === '') {
        return '';
      }

      if (typeof valor === 'string' && /min|hora/i.test(valor)) {
        return valor;
      }

      const minutos = Number(valor);

      if (!Number.isFinite(minutos) || minutos <= 0) {
        return String(valor);
      }

      if (minutos >= 60) {
        const horas = Math.floor(minutos / 60);
        const resto = minutos % 60;

        return resto ?
          `${horas} h ${resto} min` :
          `${horas} ${horas === 1?'hora' : 'horas'}`;
      }

      return `${minutos} minutos`;
    },

    tipoServicio() {
      return (
        this.datosServicio.tipo_servicio_nombre ||
        this.datosServicio.tipo_servicio ||
        this.datosServicio.condicion_nombre ||
        'Servicio normal'
      );
    },

    etiquetas() {
      const origen =
        this.datosServicio.etiquetas ||
        this.datosServicio.tags ||
        this.datosServicio.caracteristicas || [];

      if (Array.isArray(origen)) {
        return origen
          .map((item) =>
            typeof item === 'string' ?
            item :
            item?.nombre || item?.etiqueta || '',
          )
          .filter(Boolean)
          .slice(0, 8);
      }

      if (typeof origen === 'string') {
        return origen
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 8);
      }

      return [];
    },

    fotoProfesional() {
      const url_foto = this.datosServicio.profesional_foto || this.datosProfesional.foto || this.datosProfesional.foto_perfil || ''
      return getFileUrl(url_foto);
    },

    fotosServicio() {
      const archivos =
        this.datosServicio?.archivos ||
        this.servicio?.archivos ||
        this.servicio?.galeria || [];

      return archivos
        .filter((archivo) => {
          const tipo = String(archivo.tipo || archivo.tipo_archivo || "").toUpperCase();
          const url = String(
            archivo.url || archivo.url_archivo || archivo.ruta || archivo.archivo || ""
          ).toLowerCase();

          const esImagen =
            /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/.test(url) ||
            String(archivo.mime_type || archivo.mime || "").toLowerCase().startsWith("image/");

          return tipo === "FOTO" && esImagen;
        })
        .sort((a, b) => {
          // La foto principal aparece primero.
          if (a.principal !== b.principal) {
            return a.principal?-1 : 1;
          }

          return Number(a.orden || 0) - Number(b.orden || 0);
        });
    },

    imagenes() {
      return this.fotosServicio
        .map((archivo) =>
          this.getFileUrl(
            archivo.url || archivo.url_archivo || archivo.ruta || archivo.archivo
          )
        )
        .filter(Boolean);
    },

    imagenPrincipal() {
      return this.imagenes[this.indiceImagen] || this.imagenes[0] || "";
    },
   
    resenas() {
      const posibles = [
        this.datosServicio.servicio_resenas,
        this.datosServicio.resenas_detalle,
        this.datosServicio.resenas,
        this.datosServicio.comentarios,
        this.datosServicio.calificaciones,
        this.datosServicio.opiniones,

        this.servicio?.servicio_resenas,
        this.servicio?.resenas_detalle,
        this.servicio?.resenas,
        this.servicio?.comentarios,
        this.servicio?.calificaciones,
        this.servicio?.opiniones,
      ];

      const lista = posibles.find(
        (item) => Array.isArray(item) && item.length > 0
      );

      return lista || [];
    },

    logoNegocio() {
      return this.negocioPublico?.negocio?.logo
        ? this.getFileUrl(this.negocioPublico.negocio.logo)
        : this.datosNegocio.logo
          ? this.getFileUrl(this.datosNegocio.logo)
          : '';
    },

    ratingNegocio() {
      return Number(
        this.negocioPublico?.negocio?.calificacion ?? 0
      );
    },

    resenasNegocioTexto() {
      return Number(
        this.negocioPublico?.negocio?.cantidad_calificaciones ?? 0
      ).toLocaleString('es-BO');
    },

    ubicacionNegocio() {
      const negocio = this.negocioPublico?.negocio || this.datosNegocio;

      return [
        negocio.municipio,
        negocio.departamento
      ].filter(Boolean).join(', ');
    },

    estadoNegocio() {
      const horarios = this.negocioPublico?.horarios || [];

      const ahora = new Date();
      const dia = ahora.getDay() === 0 ? 7 : ahora.getDay();

      const horaActual =
        `${String(ahora.getHours()).padStart(2, '0')}:` +
        `${String(ahora.getMinutes()).padStart(2, '0')}`;

      const abierto = horarios.some(h => {
        if (Number(h.dia_semana) !== dia) return false;

        return (
          horaActual >= String(h.hora_inicio).slice(0, 5) &&
          horaActual < String(h.hora_fin).slice(0, 5)
        );
      });

      return {
        abierto,
        texto: abierto ? 'Abierto' : 'Cerrado'
      };
    },
  },

  watch: {
    '$route.params.servicioId'() {
      this.cargarServicio();
    },
  },

  mounted() {
    this.cargarServicio();
  },

  methods: {
    getFileUrl,

    async cargarDatosNegocio() {
      const slug = this.datosNegocio?.slug;

      if (!slug) return;

      try {
        const respuesta = await getBusinessBySlug(slug);
        const body = respuesta?.data || {};

        if (body.ok === false) {
          throw new Error(body.mensaje || 'No se pudo obtener el negocio');
        }

        const resultado = body.datos ?? body.data ?? body;

        this.negocioPublico = resultado;

        console.log('NEGOCIO COMPLETO:', this.negocioPublico);

        this.calcularDistanciaNegocio();
      } catch (error) {
        console.error('Error al cargar información del negocio:', error);
      }
    },

    calcularDistanciaNegocio() {
      const negocio = this.negocioPublico?.negocio;

      if (
        !negocio?.latitud ||
        !negocio?.longitud ||
        !navigator.geolocation
      ) {
        this.distanciaNegocio = '';
        return;
      }

      navigator.geolocation.getCurrentPosition(
        posicion => {
          const lat1 = posicion.coords.latitude;
          const lon1 = posicion.coords.longitude;

          const lat2 = Number(negocio.latitud);
          const lon2 = Number(negocio.longitud);

          if (!Number.isFinite(lat2) || !Number.isFinite(lon2)) return;

          const rad = valor => valor * Math.PI / 180;
          const R = 6371;

          const dLat = rad(lat2 - lat1);
          const dLon = rad(lon2 - lon1);

          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(lat1)) *
            Math.cos(rad(lat2)) *
            Math.sin(dLon / 2) ** 2;

          const distancia = 2 * R * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
          );

          this.distanciaNegocio = distancia < 1
            ? `${Math.round(distancia * 1000)} m`
            : `${distancia.toFixed(1)} km`;
        },
        () => {
          this.distanciaNegocio = '';
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000
        }
      );
    },
    
    async copiarCodigoDescuento() {
      const codigo = this.codigoDescuento;

      if (!codigo) {
        this.$piaAlert.warning("No hay un código de descuento disponible.",{ title: "Código no disponible", });
        return;
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(codigo);
        } else {
          const campo = document.createElement("textarea");

          campo.value = codigo;
          campo.style.position = "fixed";
          campo.style.left = "-9999px";

          document.body.appendChild(campo);
          campo.focus();
          campo.select();

          const copiado = document.execCommand("copy");

          campo.remove();

          if (!copiado) {
            throw new Error("No se pudo copiar el código.");
          }
        }

        this.$piaAlert.success(
          `El código ${codigo} se copió correctamente. Ya está listo para aplicar al descuento de este servicio.`,
          {
            title: "¡Código copiado!",
            duration: 3000,
          }
        );
      } catch (error) {
        console.error(
          "Error al copiar el código de descuento:",
          error
        );

        this.$piaAlert.error(
          "No se pudo copiar el código. Inténtalo nuevamente.",
          {
            title: "Error al copiar",
          }
        );
      }
    },

    precioTexto(valor) {
      return Number(valor || 0).toLocaleString('es-BO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },

    fechaResena(valor) {
      if (!valor) return '';
      const fecha = new Date(valor);
      if (Number.isNaN(fecha.getTime())) return String(valor);
      return fecha.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    },

    async cargarServicio() {
      const id = Number(this.$route.params.servicioId);

      if (!Number.isInteger(id) || id <= 0) {
        this.servicio = null;
        this.error = 'El identificador del servicio no es válido.';
        return;
      }

      this.cargando = true;
      this.error = '';
      this.servicio = null;
      this.indiceImagen = 0;

      try {
        const respuesta = await getServicesById(id);
        const body = respuesta?.data || {};

        if (body.ok === false) {
          throw new Error(
            body.mensaje || 'No se encontró el servicio solicitado.',
          );
        }

        const resultado = body.datos?? body.data?? body.servicio?? body;
        
        if (!resultado || typeof resultado !== 'object') {
          throw new Error('La API no devolvió información del servicio.');
        }
        this.servicio = resultado;
        await this.verificarFavorito();
        await this.cargarDatosNegocio();        
      } catch (error) {
        this.error =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          error.message ||
          'Ocurrió un problema al cargar el servicio.';
      } finally {
        this.cargando = false;
      }
    },

    seleccionarImagen(indice) {
      if (indice < 0 || indice >= this.imagenes.length) return;

      this.indiceImagen = indice;
      this.dialogGaleria = true;
    },

    abrirGaleria() {
      if (this.imagenes.length) {
        this.dialogGaleria = true;
      }
    },

    imagenAnterior() {
      if (!this.imagenes.length) return;

      this.indiceImagen =
        (this.indiceImagen - 1 + this.imagenes.length) %
        this.imagenes.length;
    },

    imagenSiguiente() {
      if (!this.imagenes.length) return;

      this.indiceImagen =
        (this.indiceImagen + 1) % this.imagenes.length;
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

    async compartirServicio() {
      const url = window.location.href;

      try {
        if (navigator.share) {
          await navigator.share({
            title: this.nombreServicio,
            text: `Mira este servicio en PIA: ${this.nombreServicio}`,
            url,
          });
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          this.$toast?.success?.('Enlace copiado.');
        } else {
          window.prompt('Copia el enlace del servicio:', url);
        }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          this.$toast?.info?.('No se pudo compartir el servicio.');
        }
      }
    },

    async toggleFavorito() {
      // Si no inició sesión, abrimos el login y guardamos la acción pendiente.
      if (!localStorage.getItem('cliente_token')) {
        this.favoritoPendiente = true;
        this.dialogoLoginCliente = true;
        return;
      }

      await this.actualizarFavorito();
    },

    async clienteAutenticado() {
      this.dialogoLoginCliente = false;

      // Si el usuario abrió el login para guardar este servicio,
      // completamos la acción automáticamente.
      if (this.favoritoPendiente) {
        this.favoritoPendiente = false;
        await this.actualizarFavorito();
        return;
      }
    },

    async actualizarFavorito() {
      if (this.procesandoFavorito || !this.servicio) return;

      const id = Number(
        this.datosServicio.id ||
        this.datosServicio.servicio_id ||
        this.$route.params.servicioId
      );

      if (!Number.isInteger(id) || id <= 0) {
        console.error('ID de servicio inválido:', this.servicio);
        return;
      }

      if (!localStorage.getItem('cliente_token')) {
        this.favoritoPendiente = true;
        this.dialogoLoginCliente = true;
        return;
      }

      const eraFavorito = this.favorito;
      this.procesandoFavorito = true;

      try {
        if (eraFavorito) {
          await eliminarFavorito('SERVICIO', id);
        } else {
          await agregarFavorito('SERVICIO', id);
        }

        this.favorito = !eraFavorito;

        this.$piaAlert.success(
          this.favorito
            ? 'Servicio agregado a favoritos.'
            : 'Servicio eliminado de favoritos.'
        );

      } catch (error) {
        console.error('Error al actualizar favorito:', error);

        if (error.response?.status === 401) {
          this.favoritoPendiente = !eraFavorito;
          this.dialogoLoginCliente = true;

          this.$piaAlert.info(
            'Tu sesión ha expirado. Inicia sesión nuevamente.'
          );
        } else {
          this.$piaAlert.error(
            error.response?.data?.mensaje ||
            'No se pudo actualizar el favorito.'
          );
        }
      } finally {
        this.procesandoFavorito = false;
      }
    },

    async verificarFavorito() {
      if (!localStorage.getItem('cliente_token') || !this.servicio) {
        this.favorito = false;
        return;
      }

      try {
        const respuesta = await getFavoritos();
        const datos = respuesta?.data?.data || {};

        const favoritos = (datos.servicios || []).map(
          servicio => Number(servicio.id)
        );

        const id = Number(
          this.datosServicio.id ||
          this.datosServicio.servicio_id ||
          this.$route.params.servicioId
        );

        this.favorito = favoritos.includes(id);

      } catch (error) {
        console.error('Error al verificar favorito:', error);
      }
    },

    async verificarFavorito() {
      const token = localStorage.getItem("cliente_token");

      if (!token || !this.servicio) {
        this.favorito = false;
        return;
      }

      try {
        const respuesta = await getFavoritos();
        const datos = respuesta?.data?.data || {};

        const favoritos = (datos.servicios || []).map(
          (servicio) => Number(servicio.id)
        );

        const id = Number(
          this.datosServicio.id ||
          this.datosServicio.servicio_id ||
          this.$route.params.servicioId
        );

        this.favorito = favoritos.includes(id);

      } catch (error) {
        console.error("Error al verificar favorito:", error);
      }
    },

    reservarAhora() {
      const profesionalId = Number(
        this.datosServicio.profesional_id ||
        this.datosProfesional.id ||
        this.servicio?.profesional?.id ||
        this.servicio?.profesional_id
      );
      const servicioId = Number(
        this.datosServicio.id ||
        this.datosServicio.servicio_id ||
        this.$route.params.servicioId
      );

      if (!Number.isInteger(profesionalId) || profesionalId <= 0) {
        this.$toast?.warning?.(
          'No encontramos el profesional asociado a este servicio.',
        );
        return;
      }

      if (!Number.isInteger(servicioId) || servicioId <= 0) {
        this.$toast?.warning?.(
          'No encontramos el servicio que deseas agendar.',
        );
        return;
      }

      // La pantalla de agenda recibe profesionalId y servicioId como parámetros.
      this.$router.push({
        name: 'horario',
        params: {
          profesionalId: String(profesionalId),
          servicioId: String(servicioId),
        },
      }).catch((error) => {
        if (error?.name !== 'NavigationDuplicated') {
          console.error('No se pudo abrir la agenda:', error);
          this.$toast?.error?.(
            'No se pudo abrir la agenda. Verifica el nombre de la ruta del horario.',
          );
        }
      });
    },

    irAlNegocio(){
      const slug = this.servicio.negocio.slug
      if(!slug) return
      
      if (slug) {
        this.$router.push({ path: `/perfil/negocio/${slug}` }).catch(() => {});
      } else {
        console.info("Falta definir la ruta pública del negocio:", this.servicio.negocio,);
      }
    },

    irAlProfesional() {
      const slug = this.datosProfesional?.slug;

      if (!slug) {
        console.warn("El profesional no tiene un slug definido.");
        return;
      }

      this.$router.push({
        name: "perfil-profesional",
        params: { slug },
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.perfil-servicio {
  --pia-teal: #079b98;
  --pia-navy: #102653;
  --pia-muted: #718096;

  width: 100%;
  min-width: 0;
  padding-bottom: 18px;
  overflow-x: hidden;
  color: var(--pia-navy);
  background: #fff;
}

.hero-gallery {
  position: relative;
  width: 100%;
  height: clamp(230px, 78vw, 340px);
  overflow: hidden;
  background: #eaf5f3;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #eaf5f3;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  pointer-events: none;
}

.hero-action {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.18);
  color: #fff;
  cursor: pointer;
  pointer-events: auto;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
}

.hero-actions-right {
  display: flex;
  gap: 6px;
}

.photo-counter {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 11px;
  cursor: pointer;
  pointer-events: auto;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 210px;
  padding: 24px;
  color: var(--pia-muted);
  text-align: center;
}

.state-container strong {
  color: var(--pia-navy);
  font-size: 15px;
}

.state-container p {
  margin: 0;
  font-size: 12px;
}

.service-summary {
  padding: 16px 16px 14px;
}

.title-price-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-top: 7px;
}

.title-price-row h1 {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 21px;
  font-weight: 850;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.summary-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  color: var(--pia-teal);
  font-size: 22px;
  font-weight: 900;
  white-space: nowrap;
}

.old-price {
  color: #8994a4;
  font-size: 12px;
  font-weight: 500;
  text-decoration: line-through;
}

.summary-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 0px;
  color: #718096;
  font-size: 14px;
}

.summary-rating strong {
  font-weight: 700;
}

.summary-business {
  margin-top: 8px;
  color: #607590;
  font-size: 16px;
}

.summary-location {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  color: #667b96;
  font-size: 12px;
  line-height: 1.4;
}

.summary-location span:first-of-type {
  min-width: 0;
  overflow-wrap: anywhere;
}

.location-separator {
  flex: 0 0 auto;
}

.detail-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid #edf1f5;
}

.detail-tab {
  position: relative;
  min-height: 47px;
  padding: 10px 3px;
  border: 0;
  background: #fff;
  color: #657992;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.detail-tab.active {
  color: var(--pia-teal);
}

.detail-tab.active::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--pia-teal);
  content: '';
}

.tab-content {
  padding: 20px 16px 12px;
}

.tab-content h2 {
  margin: 0 0 10px;
  color: var(--pia-navy);
  font-size: 16px;
  font-weight: 850;
}

.description {
  margin-top: 10px;
  color: #627893;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 13px;
}

.service-tags span {
  padding: 8px 12px;
  border-radius: 20px;
  background: #edf6f7;
  color: #61788f;
  font-size: 11px;
}

.service-characteristics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
  padding: 17px 0;
  border-top: 1px solid #edf1f5;
  border-bottom: 1px solid #edf1f5;
}

.characteristic {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  color: #718096;
}

.characteristic>.v-icon {
  flex: 0 0 auto;
}

.characteristic div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.characteristic span {
  font-size: 11px;
}

.characteristic strong {
  color: var(--pia-navy);
  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.gallery-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 20px;
}

.gallery-heading h2 {
  margin-bottom: 0;
}

.gallery-heading button {
  padding: 6px 0 6px 8px;
  border: 0;
  background: transparent;
  color: var(--pia-teal);
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.thumbnail-gallery {
  display: grid;
  grid-auto-columns: 96px;
  grid-auto-flow: column;
  gap: 8px;
  margin-top: 13px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.thumbnail {
  width: 96px;
  height: 76px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 10px;
  background: #eaf5f3;
  cursor: pointer;
}

.thumbnail .v-img {
  width: 100%;
  height: 100%;
}

.muted-message {
  margin: 10px 0 0;
  color: var(--pia-muted);
  font-size: 12px;
  line-height: 1.6;
}

.professional-content {
  min-height: 180px;
}

.professional-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 0;
}

.professional-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.professional-info strong {
  color: var(--pia-navy);
  font-size: 15px;
}

.professional-info>span {
  color: #718096;
  font-size: 12px;
}

.professional-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #718096;
  font-size: 12px;
}

.reviews-content {
  min-height: 180px;
}

.reviews-overview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px 10px;
}

.reviews-overview>strong {
  color: var(--pia-navy);
  font-size: 34px;
  font-weight: 850;
}

.reviews-overview>div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.review-stars {
  display: flex;
  gap: 1px;
}

.reviews-overview span {
  color: #718096;
  font-size: 12px;
}

.reserve-container {
  position: sticky;
  bottom: 0;
  z-index: 3;
  padding: 12px 12px 10px;
  border-top: 1px solid #edf1f5;
  background: rgba(255, 255, 255, 0.97);
}

.reserve-button {
  min-height: 50px;
  color: #fff !important;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  box-shadow: 0 4px 12px rgba(7, 155, 152, 0.18);
}

.gallery-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0b1424;
}

.gallery-position {
  padding-right: 12px;
  font-size: 12px;
}

.gallery-viewer {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  background: #0b1424;
}

.gallery-large-image {
  width: 100%;
  height: 100%;
}

.gallery-arrow {
  position: absolute;
  z-index: 2;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.gallery-arrow.previous {
  left: 10px;
}

.gallery-arrow.next {
  right: 10px;
}

@media (min-width: 600px) {
  .perfil-servicio {
    max-width: 760px;
    margin: 0 auto;
  }

  .hero-gallery {
    height: 360px;
  }

  .service-summary {
    padding: 22px 24px 18px;
  }

  .title-price-row h1 {
    font-size: 26px;
  }

  .tab-content {
    padding: 24px;
  }

  .reserve-container {
    padding: 14px 24px;
  }
}

@media (max-width: 360px) {
  .hero-gallery {
    height: 245px;
  }

  .service-summary {
    padding: 13px 12px;
  }

  .title-price-row h1 {
    font-size: 18px;
  }

  .summary-price {
    font-size: 19px;
  }

  .summary-business {
    font-size: 14px;
  }

  .summary-location {
    font-size: 11px;
  }

  .tab-content {
    padding: 17px 12px 10px;
  }

  .characteristic {
    gap: 6px;
  }

  .characteristic strong {
    font-size: 11px;
  }

  .thumbnail-gallery {
    grid-auto-columns: 84px;
  }

  .thumbnail {
    width: 84px;
    height: 68px;
  }
}

.negocio-resumen {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 7px;
  padding: 11px 5px;
  border: 1px solid #edf3f3;
  border-radius: 7px;
  background: #f3fafa;
  color: #102653;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.negocio-resumen:active {
  background: #e7f5f4;
}

.negocio-resumen-icono {
  display: flex;
  flex: 0 0 38px;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e0f3f1;
  color: #079b98;
}

.negocio-resumen-contenido {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.negocio-resumen-contenido strong {
  overflow-wrap: anywhere;
  color: #102653;
  font-size: 12px;
  font-weight: 800;
}

.negocio-resumen-contenido span {
  overflow-wrap: anywhere;
  color: #718096;
  font-size: 10px;
  line-height: 1.4;
}

.negocio-resumen-contenido .negocio-sin-ubicacion {
  color: #079b98;
}

.negocio-resumen-flecha {
  flex: 0 0 auto;
  color: #102653;
}

.negocio-distancia {
  display: flex !important;
  align-items: center;
  gap: 4px;
  color: #079b98 !important;
  font-weight: 700;
}

.lista-resenas {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.resena-card {
  padding: 13px;
  border: 1px solid #edf1f5;
  border-radius: 12px;
  background: #fff;
}

.resena-cabecera {
  display: flex;
  align-items: center;
  gap: 9px;
}

.resena-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eaf5f3;
  color: #079b98;
}

.resena-cliente {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.resena-cliente strong,
.resena-titulo {
  color: #102653;
  font-size: 12px;
}

.resena-cliente span {
  color: #718096;
  font-size: 10px;
}

.resena-puntaje {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #102653;
  font-size: 12px;
  font-weight: 750;
}

.resena-titulo {
  display: block;
  margin-top: 10px;
}

.resena-comentario {
  margin: 8px 0 0;
  color: #627893;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

/* Resumen promocional compacto */
.promotion-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 0px;
  padding: 5px 9px;
  border-radius: 6px;
  background: #fff0ed;
  color: #d84b42;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: .45px
}

.title-price-row {
  align-items: center;
  gap: 10px
}

.title-price-row h1 {
  font-size: 19px;
  line-height: 1.25
}

.summary-price {
  gap: 3px;
  font-size: 21px
}

.summary-price.has-discount {
  min-width: 92px
}

.summary-price .final-price {
  color: #079b98;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1
}

.summary-price .old-price {
  color: #8994a4;
  font-size: 11px;
  text-decoration: line-through
}

.discount-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 7px;
  border-radius: 6px;
  background: #e34b45;
  color: #fff;
  font-size: 11px;
  font-weight: 850;
  line-height: 1.2
}

.discount-savings {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 10px;
  padding: 10px 11px;
  border: 1px solid #d9eee3;
  border-radius: 10px;
  background: #f0faf4
}

.savings-icon {
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: #d9f2e2;
  color: #21834a
}

.savings-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px
}

.savings-copy strong {
  color: #176b3a;
  font-size: 11px;
  font-weight: 800
}

.savings-copy span {
  color: #42815b;
  font-size: 10px
}

.summary-rating {
  margin-top: 1px
}

.service-characteristics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 16px;
  padding: 0;
  border: 0
}

.characteristic {
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e8f0f1;
  border-radius: 10px;
  background: #f8fbfb
}

.characteristic-icon {
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: #e2f4f1;
  color: #079b98
}

.characteristic div {
  gap: 2px
}

.characteristic span:not(.characteristic-icon) {
  font-size: 10px;
  color: #718096
}

.characteristic strong {
  font-size: 11px;
  line-height: 1.25
}

@media(max-width:360px) {
  .title-price-row h1 {
    font-size: 17px
  }

  .summary-price .final-price {
    font-size: 20px
  }

  .characteristic {
    padding: 8px 7px;
    gap: 6px
  }

  .characteristic-icon {
    flex-basis: 28px;
    width: 28px;
    height: 28px
  }
}


.codigo-descuento-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  padding: 12px;
  border: 1px dashed #9bd4ce;
  border-radius: 10px;
  background: #f2fbfa;
}

.codigo-descuento-info {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.codigo-descuento-icono {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: #dff4f1;
  color: #079b98;
}

.codigo-descuento-texto {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.codigo-descuento-texto > span {
  color: #607a82;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.codigo-descuento-texto > strong {
  color: #087f79;
  font-size: 16px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.codigo-descuento-texto > small {
  color: #718096;
  font-size: 10px;
  line-height: 1.4;
}

.codigo-descuento-copiar {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px 10px;
  border: 1px solid #079b98;
  border-radius: 8px;
  background: #fff;
  color: #079b98;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.codigo-descuento-copiar:active {
  background: #e2f4f1;
}

@media (max-width: 360px) {
  .codigo-descuento-card {
    gap: 6px;
    padding: 9px;
  }

  .codigo-descuento-copiar {
    padding: 8px;
  }

  .codigo-descuento-texto > strong {
    font-size: 14px;
  }
}
.negocio-resumen {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 100px;
  margin-top: 7px;
  padding: 12px;
  border: 1px solid #e8edf3;
  border-radius: 13px;
  background: #fff;
  text-align: left;
  cursor: pointer;
}

.negocio-logo {
  display: flex;
  flex: 0 0 62px;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  overflow: hidden;
  border-radius: 50%;
  background: #eaf5f3;
  color: #079b98;
}

.negocio-logo .v-img {
  width: 100%;
  height: 100%;
}

.negocio-resumen-contenido {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.negocio-resumen-contenido > strong {
  color: #102653;
  font-size: 13px;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.negocio-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #718096;
  font-size: 12px;
}

.negocio-rating b {
  color: #102653;
}

.negocio-ubicacion {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #718096;
  font-size: 11px;
}

.negocio-ubicacion .v-icon {
  color: #079b98;
}

.negocio-estado-contenedor {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  min-width: 83px;
}

.negocio-estado {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.negocio-estado i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.negocio-estado.abierto {
  background: #e8f8ef;
  color: #15965a;
}

.negocio-estado.cerrado {
  background: #fff0ed;
  color: #d84b42;
}

.negocio-distancia {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #079b98;
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
}

.negocio-resumen-flecha {
  flex: 0 0 auto;
  color: #102653;
}

@media (max-width: 360px) {
  .negocio-resumen {
    gap: 7px;
    padding: 9px;
  }

  .negocio-logo {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
  }

  .negocio-estado-contenedor {
    min-width: 70px;
  }

  .negocio-estado {
    padding: 5px 7px;
    font-size: 9px;
  }
}

/* ==========================================
   TARJETA DEL NEGOCIO
   ESTRUCTURA: 3 COLUMNAS
   ========================================== */

.negocio-resumen {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr) 125px;
  grid-template-rows: repeat(3, minmax(0, auto));
  align-items: center;
  column-gap: 20px;

  width: 100%;
  min-height: 150px;
  margin-top: 7px;
  padding: 18px 16px;

  border: 1px solid #e8edf3;
  border-radius: 16px;
  background: #fff;
  color: #102653;
  text-align: left;
  cursor: pointer;
}

/* LOGO: OCUPA LAS TRES FILAS */

.negocio-logo {
  grid-column: 1;
  grid-row: 1 / 4;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 90px;
  height: 90px;
  overflow: hidden;

  border-radius: 50%;
  background: #eaf5f3;
  color: #079b98;
}

.negocio-logo .v-img {
  width: 100%;
  height: 100%;
}

/* INFORMACIÓN CENTRAL */

.negocio-resumen-contenido {
  display: contents;
}

.negocio-resumen-contenido > strong {
  grid-column: 2;
  grid-row: 1;

  min-width: 0;
  color: #102653;
  font-size: 19px;
  font-weight: 850;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.negocio-rating {
  grid-column: 2;
  grid-row: 2;

  display: flex;
  align-items: center;
  gap: 8px;

  color: #718096;
  font-size: 17px;
}

.negocio-rating b {
  color: #718096;
  font-weight: 750;
}

.negocio-ubicacion {
  grid-column: 2;
  grid-row: 3;

  display: flex;
  align-items: center;
  gap: 10px;

  min-width: 0;
  color: #718096;
  font-size: 17px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.negocio-ubicacion .v-icon {
  flex: 0 0 auto;
  color: #079b98;
}

/* COLUMNA DERECHA */

.negocio-estado-contenedor {
  grid-column: 3;
  grid-row: 1 / 4;

  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  justify-items: center;
  align-items: center;

  width: 100%;
  height: 100%;
}

.negocio-estado {
  grid-row: 1;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  padding: 12px 17px;
  border-radius: 30px;

  font-size: 17px;
  font-weight: 800;
  white-space: nowrap;
}

.negocio-estado i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: currentColor;
}

.negocio-estado.abierto {
  background: #e8f8ef;
  color: #15965a;
}

.negocio-estado.cerrado {
  background: #fff0ed;
  color: #d84b42;
}

.negocio-resumen-flecha {
  grid-row: 2;
  color: #718096;
}

.negocio-distancia {
  grid-row: 3;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: #718096;
  font-size: 17px;
  font-weight: 650;
  white-space: nowrap;
}

.negocio-distancia .v-icon {
  color: #079b98;
}

@media (max-width: 600px) {
  .negocio-resumen {
    grid-template-columns: 52px minmax(0, 1fr) 75px;
    column-gap: 8px;
    min-height: 88px;
    padding: 10px;
    border-radius: 12px;
  }

  .negocio-logo {
    width: 52px;
    height: 52px;
  }

  .negocio-resumen-contenido > strong {
    font-size: 12px;
  }

  .negocio-rating {
    gap: 3px;
    font-size: 11px;
  }

  .negocio-rating .v-icon {
    font-size: 16px !important;
  }

  .negocio-ubicacion {
    gap: 3px;
    font-size: 10px;
  }

  .negocio-ubicacion .v-icon {
    font-size: 14px !important;
  }

  .negocio-estado {
    gap: 4px;
    padding: 5px 7px;
    font-size: 9px;
  }

  .negocio-estado i {
    width: 6px;
    height: 6px;
  }

  .negocio-resumen-flecha {
    font-size: 21px !important;
  }

  .negocio-distancia {
    gap: 3px;
    font-size: 10px;
  }

  .negocio-distancia .v-icon {
    font-size: 16px !important;
  }
}

.negocio-resumen {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 75px;
  grid-template-rows: repeat(3, auto);
  align-items: center;
  column-gap: 4px;

  width: 100%;
  min-height: 0;
  margin-top: 7px;
  padding: 8px 8px;

  border: 1px solid #e8edf3;
  border-radius: 12px;
  background: #fff;
  color: #102653;
  text-align: left;
  cursor: pointer;
}

/* LOGO */
.negocio-logo {
  grid-column: 1;
  grid-row: 1 / 4;

  width: 52px;
  height: 52px;
  overflow: hidden;
  border-radius: 50%;
  background: #eaf5f3;
  color: #079b98;
}

/* INFORMACIÓN CENTRAL */
.negocio-resumen-contenido {
  display: contents;
}

.negocio-resumen-contenido > strong {
  grid-column: 2;
  grid-row: 1;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 850;
}

.negocio-rating {
  grid-column: 2;
  grid-row: 2;

  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  line-height: 1;
}

.negocio-ubicacion {
  grid-column: 2;
  grid-row: 3;

  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  line-height: 1.2;
}

/* COLUMNA DERECHA */
.negocio-estado-contenedor {
  grid-column: 3;
  grid-row: 1 / 4;

  display: grid;
  grid-template-rows: repeat(3, auto);
  justify-items: center;
  align-content: center;
  gap: 5px;
}

.negocio-estado {
  grid-row: 1;
  padding: 5px 7px;
  font-size: 9px;
}

.negocio-estado i {
  width: 6px;
  height: 6px;
}

.negocio-resumen-flecha {
  grid-row: 1;
  padding-top: 20px;
  font-size: 19px !important;
}

.negocio-distancia {
  grid-row: 3;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 750;
  white-space: nowrap;
}

.negocio-distancia .v-icon {
  font-size: 16px !important;
}

/* ==========================================
   AJUSTE FINAL: TARJETA COMPACTA
   ========================================== */

.negocio-resumen {
  min-height: unset !important;
  height: auto !important;
  padding: 6px 6px !important;

  grid-template-rows: repeat(3, min-content) !important;
  align-content: center !important;
  row-gap: 2px !important;
}

/* Logo centrado sin aumentar la altura */
.negocio-logo {
  width: 48px !important;
  height: 48px !important;
}

/* Información central */
.negocio-resumen-contenido > strong {
  line-height: 15px !important;
  margin: 0 !important;
}

.negocio-rating {
  line-height: 14px !important;
  margin: 0 !important;
}

.negocio-ubicacion {
  line-height: 14px !important;
  margin: 0 !important;
}

/* Columna derecha: sin espacios sobrantes */
.negocio-estado-contenedor {
  grid-template-rows: repeat(3, min-content) !important;
  align-content: center !important;
  gap: 0px !important;
}

.negocio-estado {
  padding: 3px 6px !important;
  line-height: 12px !important;
}

.negocio-resumen-flecha {
  line-height: 16px !important;
}

.negocio-distancia {
  line-height: 14px !important;
}

/* ==========================================
   TARJETA DEL PROFESIONAL
   ========================================== */

.professional-card {
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  min-height: 68px;
  padding: 8px 10px;

  border: 1px solid #e8edf3;
  border-radius: 12px;
  background: #fff;

  cursor: pointer;
  text-align: left;

  transition: background 0.2s ease;
}

.professional-card:active {
  background: #f5faf9;
}

/* FOTO */

.professional-avatar {
  flex: 0 0 52px;
}

/* INFORMACIÓN */

.professional-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  min-width: 0;
}

.professional-info > strong {
  color: #102653;
  font-size: 13px;
  font-weight: 800;
  line-height: 16px;
}

.professional-business {
  color: #718096;
  font-size: 11px;
  line-height: 14px;
}

/* CALIFICACIÓN */

.professional-rating {
  display: flex;
  align-items: center;
  gap: 4px;

  color: #718096;
  font-size: 11px;
  line-height: 14px;
}

.professional-rating b {
  color: #102653;
  font-weight: 750;
}

/* FLECHA */

.professional-arrow {
  flex: 0 0 auto;
  color: #718096;
}
</style>
