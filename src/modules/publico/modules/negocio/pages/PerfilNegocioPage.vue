<template>
<div class="negocio-page">
  <!-- CABECERA -->  
  <section class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Página del negocio</h1>
      <p>Conoce más sobre este establecimiento en PIA.</p>
    </div>
  </section>

  <!-- CARGA / ERROR -->
  <div v-if="cargando" class="estado-pagina">
    <v-progress-circular indeterminate color="primary" />
    <span>Cargando información del negocio...</span>
  </div>

  <div v-else-if="error" class="estado-pagina">
    <v-icon size="42" color="error">mdi-alert-circle-outline</v-icon>
    <h2>No pudimos cargar el negocio</h2>
    <p>{{ error }}</p>
    <v-btn color="primary" rounded="lg" @click="cargarNegocio">
      Intentar nuevamente
    </v-btn>
  </div>

  <template v-else-if="negocio">
    <!-- PESTAÑAS -->
    <nav class="tabs-negocio">
      <button :class="{ activo: tab === 'informacion' }" @click="tab = 'informacion'">
        <v-icon size="18">mdi-card-account-details-outline</v-icon>
        <span>Información</span>
      </button>

      <button :class="{ activo: tab === 'profesionales' }" @click="tab = 'profesionales'">
        <v-icon size="18">mdi-account-group-outline</v-icon>
        <span>Profesionales</span>
      </button>

      <button :class="{ activo: tab === 'resenas' }" @click="tab = 'resenas'">
        <v-icon size="18">mdi-comment-quote-outline</v-icon>
        <span>Reseñas</span>
      </button>
    </nav>

    <!-- ================= INFORMACIÓN ================= -->
    <section v-if="tab === 'informacion'" class="contenido">
      <div class="portada-container">
        <img v-if="urlImagen(negocio.portada)" :src="urlImagen(negocio.portada)" :alt="`Portada de ${negocio.nombre}`" class="portada" />
        <div v-else class="portada-vacia">
          <v-icon size="52">mdi-storefront-outline</v-icon>
          <span>Tu negocio en PIA</span>
        </div>

        <div class="logo-negocio">
          <img v-if="urlImagen(negocio.logo)" :src="urlImagen(negocio.logo)" :alt="`Logo de ${negocio.nombre}`" />
          <v-icon v-else size="42">mdi-storefront-outline</v-icon>
        </div>
      </div>

      <div class="identidad-negocio">
        <h2>{{ negocio.nombre }}</h2>
        <p v-if="negocio.descripcion" class="subtitulo">
          {{ negocio.descripcion }}
        </p>

        <div class="calificacion-negocio">
          <v-icon color="amber-darken-2" size="21">mdi-star</v-icon>
          <strong>{{ formatoCalificacion(calificacionNegocio) }}</strong>
          <span>({{ totalResenas }} reseñas)</span>

          <span v-if="negocio.verificado" class="verificado">
            <v-icon size="16">mdi-check-circle</v-icon>
            Verificado
          </span>
        </div>
      </div>

      <!-- ACCIONES -->
      <div class="acciones-negocio">
        <button class="accion" @click="llamarNegocio" :disabled="!negocio.telefono">
          <span class="accion-icono">
            <v-icon>mdi-phone-outline</v-icon>
          </span>
          <span>Llamar</span>
        </button>

        <button class="accion" @click="abrirMapa" :disabled="!tieneUbicacion">
          <span class="accion-icono">
            <v-icon>mdi-map-marker-outline</v-icon>
          </span>
          <span>Cómo llegar</span>
        </button>

        <button class="accion" @click="compartirNegocio">
          <span class="accion-icono">
            <v-icon>mdi-share-variant-outline</v-icon>
          </span>
          <span>Compartir</span>
        </button>

        <button class="accion" @click="favorito = !favorito">
          <span class="accion-icono">
            <v-icon>{{ favorito?'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
          </span>
          <span>{{ favorito?'Guardado' : 'Guardar' }}</span>
        </button>
      </div>

      <div v-if="negocio.lema" class="lema-negocio">
        “{{ negocio.lema }}”
      </div>

      <!-- UBICACIÓN -->
      <section class="bloque ubicacion-bloque">
        <button class="titulo-ubicacion" @click="abrirMapa" :disabled="!tieneUbicacion">
          <v-icon size="28" color="primary">mdi-map-marker</v-icon>
          <span>
            <strong>Ubicación</strong>
            <span class="direccion">{{ direccionCompleta || 'Dirección no registrada' }}</span>
            <span v-if="localidad" class="localidad">{{ localidad }}</span>
          </span>
          <v-icon class="flecha" size="22">mdi-chevron-right</v-icon>
        </button>

        <div v-if="tieneUbicacion" class="mapa-preview">
          <iframe :src="urlMapaEmbed" title="Ubicación del negocio" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen />
          <button class="mapa-link" @click="abrirMapa">
            <v-icon size="18">mdi-google-maps</v-icon>
            Ver en Google Maps
          </button>
        </div>

        <div v-else class="sin-mapa">
          <v-icon size="24">mdi-map-marker-off-outline</v-icon>
          <span>Este negocio todavía no tiene coordenadas registradas.</span>
        </div>

        <div class="botones-ubicacion">
          <v-btn color="primary" rounded="lg" prepend-icon="mdi-navigation-variant-outline" :disabled="!tieneUbicacion" @click="abrirMapa">
            Cómo llegar
          </v-btn>

          <v-btn variant="outlined" color="primary" rounded="lg" prepend-icon="mdi-phone-outline" :disabled="!negocio.telefono" @click="llamarNegocio">
            Llamar
          </v-btn>
        </div>
      </section>

      <!-- HORARIOS -->
      <section class="bloque horarios-bloque">
        <h3>
          <v-icon color="primary">mdi-clock-outline</v-icon>
          Horarios de atención
        </h3>

        <div v-if="horariosAgrupados.length" class="lista-horarios">
          <div v-for="grupo in horariosAgrupados" :key="grupo.dia" class="horario-item">
            <span class="horario-dia">{{ grupo.dia }}</span>

            <div class="horario-turnos">
              <strong v-for="(turno, index) in grupo.turnos" :key="`${grupo.dia}-${index}`">
                {{ turno.inicio }} a {{ turno.fin }}
              </strong>
            </div>
          </div>
        </div>

        <p v-else class="texto-secundario">
          Los horarios de atención aún no están disponibles.
        </p>
      </section>

      <!-- SOBRE EL NEGOCIO -->
      <section class="bloque sobre-bloque">
        <h3>
          <v-icon color="primary">mdi-text-box-outline</v-icon>
          Sobre nosotros
        </h3>

        <p v-if="negocio.descripcion">
          {{ negocio.descripcion }}
        </p>
        <p v-else class="texto-secundario">
          Este negocio todavía no ha añadido una descripción.
        </p>
      </section>
      

      <v-btn class="reservar-boton" block size="x-large" color="primary" rounded="xl" prepend-icon="mdi-account-multiple" @click="irAProfesionales">
        Ver Profesionales
      </v-btn>
    </section>

    <!-- ================= PROFESIONALES ================= -->
    <section v-else-if="tab === 'profesionales'" class="contenido">
      <div class="seccion-intro">
        <h2>Profesionales del negocio</h2>
        <p>Nuestro equipo está listo para brindarte la mejor experiencia.</p>
      </div>

      <div v-if="profesionales.length" class="lista-profesionales">
        <article v-for="profesional in profesionales" :key="profesional.id" class="profesional-card" @click="abrirPerfilProfesional(profesional)">
          <img v-if="urlImagen(profesional.foto)" :src="urlImagen(profesional.foto)" :alt="profesional.nombre" class="foto-profesional" />
          <div v-else class="foto-profesional foto-vacia">
            <v-icon size="34">mdi-account</v-icon>
          </div>

          <div class="datos-profesional">
            <h3>{{ profesional.nombre }}</h3>
            <p>{{ nombresTipos(profesional) || 'Profesional de belleza y bienestar' }}</p>

            <div class="calificacion-profesional">
              <v-icon color="amber-darken-2" size="19">mdi-star</v-icon>
              <strong>{{ formatoCalificacion(profesional.calificacion) }}</strong>
              <span>({{ Number(profesional.cantidad_calificaciones || 0) }} reseñas)</span>
            </div>

            <button class="ver-perfil" @click.stop="abrirPerfilProfesional(profesional)">
              Ver perfil y servicios
              <v-icon size="18">mdi-arrow-right</v-icon>
            </button>
          </div>

          <v-icon class="flecha-profesional">mdi-chevron-right</v-icon>
        </article>
      </div>

      <div v-else class="vacio">
        <v-icon size="46">mdi-account-group-outline</v-icon>
        <h3>Próximamente</h3>
        <p>Este negocio todavía no tiene profesionales disponibles para mostrar.</p>
      </div>

      <div class="mas-profesionales">
        <v-icon size="32">mdi-account-multiple</v-icon>
        <div>
          <strong>Seguimos creciendo</strong>
          <p>PIA trabaja para ofrecerte más profesionales y servicios.</p>
        </div>
      </div>
    </section>

    <!-- ================= RESEÑAS ================= -->
    <section v-else class="contenido">
      <div class="seccion-intro">
        <h2>Reseñas de clientes</h2>
        <p>Conoce las experiencias de quienes visitaron este negocio.</p>
      </div>

      <div class="resumen-resenas">
        <div class="promedio-resenas">
          <strong>{{ formatoCalificacion(calificacionNegocio) }}</strong>
          <div class="estrellas">
            <v-icon v-for="n in 5" :key="n" :color="n <= Math.round(calificacionNegocio)?'amber-darken-2' : 'grey-lighten-1'">
              mdi-star
            </v-icon>
          </div>
          <span>{{ totalResenas }} reseñas</span>
        </div>
      </div>

      <div v-if="resenas.length" class="lista-resenas">
        <article v-for="resena in resenas" :key="resena.id" class="resena-card" role="button" tabindex="0" @click="abrirDetalleResena(resena)" @keydown.enter="abrirDetalleResena(resena)">
          <div class="resena-cabecera">
            <div class="avatar-cliente">
              {{ inicial(resena.cliente_nombre || resena.nombre || 'C') }}
            </div>
            <div>
              <strong>{{ resena.cliente_nombre || resena.nombre || 'Cliente' }}</strong>
              <div class="estrellas estrellas-pequenas">
                <v-icon v-for="n in 5" :key="n" :color="n <= Number(resena.puntaje || resena.calificacion || 0)?'amber-darken-2' : 'grey-lighten-1'" size="16">
                  mdi-star
                </v-icon>
              </div>
            </div>
            <span class="fecha-resena">{{ formatearFecha(resena.fecha || resena.created_at) }}</span>
          </div>
          <p v-if="resena.observacion || resena.comentario">
            {{ resena.observacion || resena.comentario }}
          </p>
        </article>
      </div>

      <div v-else class="vacio">
        <v-icon size="46">mdi-comment-outline</v-icon>
        <h3>Aún no hay reseñas</h3>
        <p>Cuando los clientes compartan su experiencia, aparecerá aquí.</p>
      </div>
    </section>
  </template>
</div>

<v-bottom-sheet v-model="dialogDetalleResena">
  <v-card class="sheet-detalle-resena">
    <div class="sheet-indicador"></div>

    <v-card-title class="d-flex align-center justify-space-between">
      <span>Opinión del cliente</span>

      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        aria-label="Cerrar"
        @click="dialogDetalleResena = false"
      />
    </v-card-title>

    <v-card-text v-if="resenaSeleccionada">
      <div class="d-flex align-center ga-3 mb-4">
        <v-avatar color="teal-lighten-5" size="46">
          <span class="text-teal-darken-2 font-weight-bold">
            {{ inicial(resenaSeleccionada.cliente_nombre || resenaSeleccionada.nombre || 'C') }}
          </span>
        </v-avatar>

        <div>
          <div class="font-weight-bold">
            {{ resenaSeleccionada.cliente_nombre || resenaSeleccionada.nombre || 'Cliente' }}
          </div>

          <div class="text-caption text-medium-emphasis">
            {{ formatearFecha(resenaSeleccionada.fecha || resenaSeleccionada.created_at) }}
          </div>
        </div>
      </div>

      <div class="d-flex align-center mb-4">
        <v-rating
          :model-value="Number(resenaSeleccionada.puntaje ?? resenaSeleccionada.calificacion ?? 0)"
          color="amber-darken-2"
          density="compact"
          readonly
        />

        <strong class="ml-2">
          {{ Number(resenaSeleccionada.puntaje ?? resenaSeleccionada.calificacion ?? 0).toFixed(1) }}/5
        </strong>
      </div>

      <h3 v-if="resenaSeleccionada.titulo" class="text-subtitle-1 mb-2">
        {{ resenaSeleccionada.titulo }}
      </h3>

      <p class="comentario-completo">
        {{
          resenaSeleccionada.observacion ||
          resenaSeleccionada.comentario ||
          'El cliente no dejó un comentario escrito.'
        }}
      </p>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-btn
        block
        color="teal"
        variant="flat"
        rounded="lg"
        @click="dialogDetalleResena = false"
      >
        Cerrar
      </v-btn>
    </v-card-actions>
  </v-card>
</v-bottom-sheet>

</template>

<script>
import { getBusinessBySlug } from '../services/negocio.api'
import { getFileUrl } from '@/utils/ayuda.js'

export default {
  name: 'PerfilNegocioPage',

  data() {
    return {
      negocio: null,
      profesionales: [],
      resenas: [],
      horarios: [],
      tab: 'informacion',
      cargando: false,
      error: null,
      favorito: false,

      dialogDetalleResena: false,
      resenaSeleccionada: null,
    }
  },

  computed: {

    horariosAgrupados() {
      const dias = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];

      const grupos = new Map(dias.map((dia, index) => [ index + 1, { dia, turnos: [] },]));

      this.horarios.forEach((horario) => {
        const diaSemana = Number(horario.dia_semana);
        const grupo = grupos.get(diaSemana);

        if (!grupo) return;

        grupo.turnos.push({
          inicio: horario.hora_inicio || horario.apertura || "",
          fin: horario.hora_fin || horario.cierre || "",
          turno: horario.turno,
        });
      });

      return Array.from(grupos.values())
        .filter((grupo) => grupo.turnos.length > 0)
        .map((grupo) => ({
          ...grupo,
          turnos: grupo.turnos.sort(
            (a, b) => String(a.inicio).localeCompare(String(b.inicio))
          ),
        }));
    },

    direccionCompleta() {
      return [
        this.negocio?.direccion,
        this.negocio?.zona,
      ].filter(Boolean).join(', ')
    },

    localidad() {
      return [
        this.negocio?.municipio,
        this.negocio?.departamento,
      ].filter(Boolean).join(', ')
    },

    tieneUbicacion() {
      const lat = Number(this.negocio?.latitud)
      const lng = Number(this.negocio?.longitud)
      return Number.isFinite(lat) && Number.isFinite(lng) &&
        this.negocio?.latitud !== null && this.negocio?.longitud !== null &&
        this.negocio?.latitud !== '' && this.negocio?.longitud !== ''
    },

    urlMapaEmbed() {
      if (!this.tieneUbicacion) return ''
      const lat = Number(this.negocio.latitud)
      const lng = Number(this.negocio.longitud)
      return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    },

    calificacionNegocio() {
      return Number(
        this.negocio?.calificacion ??
        this.negocio?.puntaje_promedio ??
        0
      );
    },

    totalResenas() {
      return Number(
        this.negocio?.cantidad_calificaciones ??
        this.negocio?.total_resenas ??
        this.negocio?.cantidad_resenas ??
        this.resenas.length
      );
    },
  },

  watch: {
    '$route.params.slug': {
      immediate: true,
      handler() {
        this.cargarNegocio()
      },
    },
  },

  methods: {
    getFileUrl,

    urlImagen(ruta) {
      if (!ruta) return ''
      if (typeof ruta === 'object') {
        ruta = ruta.url || ruta.ruta || ruta.path
      }
      if (!ruta) return ''
      if (/^https?:\/\//i.test(ruta) || ruta.startsWith('data:')) return ruta
      return this.getFileUrl(ruta)
    },

    async cargarNegocio() {
      const slug = this.$route.params.slug;

      if (!slug) {
        this.error = 'No se recibió el slug del negocio en la ruta.';
        this.negocio = null;
        this.profesionales = [];
        this.resenas = [];
        this.horarios = [];
        return;
      }

      this.cargando = true;
      this.error = null;

      try {
        const response = await getBusinessBySlug(slug);

        const payload = response?.data?.data ?? response?.data;

        if (!payload) {
          throw new Error(
            'El servidor no devolvió información del negocio.'
          );
        }

        // =========================================
        // NEGOCIO
        // =========================================
        const negocio = payload.negocio ?? payload;

        this.negocio = negocio;

        // =========================================
        // PROFESIONALES
        // =========================================
        this.profesionales = Array.isArray(payload.profesionales)
          ? payload.profesionales
          : Array.isArray(negocio.profesionales)
            ? negocio.profesionales
            : [];

        // =========================================
        // RESEÑAS
        // =========================================
        if (Array.isArray(payload.resenas)) {
          this.resenas = payload.resenas;
        } else if (Array.isArray(negocio.resenas)) {
          this.resenas = negocio.resenas;
        } else if (Array.isArray(payload.calificaciones)) {
          this.resenas = payload.calificaciones;
        } else if (Array.isArray(negocio.calificaciones)) {
          this.resenas = negocio.calificaciones;
        } else {
          this.resenas = [];
        }

        console.log('RESEÑAS DEL NEGOCIO:', this.resenas);

        // =========================================
        // HORARIOS
        // =========================================
        this.horarios = Array.isArray(payload.horarios)
          ? payload.horarios
          : Array.isArray(negocio.horarios)
            ? negocio.horarios
            : [];

        console.log('NEGOCIO CARGADO:', this.negocio);
        console.log('PROFESIONALES DEL NEGOCIO:', this.profesionales);
        console.log('HORARIOS DEL NEGOCIO:', this.horarios);

      } catch (error) {
        console.error(
          'Error cargando página pública del negocio:',
          error
        );

        this.error =
          error?.response?.data?.message ||
          error?.response?.data?.mensaje ||
          error?.message ||
          'Ocurrió un error al cargar el negocio.';

      } finally {
        this.cargando = false;
      }
    },

    abrirDetalleResena(resena) {
      this.resenaSeleccionada = resena;
      this.dialogDetalleResena = true;
    },

    formatoCalificacion(valor) {
      const numero = Number(valor)
      return Number.isFinite(numero)?numero.toFixed(1) : '0.0'
    },

    nombresTipos(profesional) {
      const tipos = profesional?.tipos || profesional?.tipos_profesional ||
        profesional?.especialidades || []

      if (Array.isArray(tipos)) {
        return tipos.map(tipo => typeof tipo === 'string'?tipo : tipo.nombre)
          .filter(Boolean).join(', ')
      }

      return profesional?.tipo_profesional || ''
    },

    abrirMapa() {
      if (!this.tieneUbicacion) return
      const destino = `${this.negocio.latitud},${this.negocio.longitud}`
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`,
        '_blank',
        'noopener,noreferrer'
      )
    },

    llamarNegocio() {
      if (!this.negocio?.telefono) return
      window.location.href = `tel:${String(this.negocio.telefono).replace(/[^\d+]/g, '')}`
    },

    async compartirNegocio() {
      const url = window.location.href
      const texto = `Conoce ${this.negocio?.nombre || 'este negocio'} en PIA`

      try {
        if (navigator.share) {
          await navigator.share({
            title: this.negocio?.nombre || 'PIA',
            text: texto,
            url
          })
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url)
          alert('Enlace del negocio copiado.')
        } else {
          window.prompt('Copia el enlace del negocio:', url)
        }
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('No se pudo compartir el negocio:', error)
        }
      }
    },

    abrirPerfilProfesional(profesional) {
      if (!profesional?.slug) {
        console.warn('El profesional no tiene un slug público:', profesional)
        return
      }

      this.$router.push({
        name: 'perfil-profesional',
        params: {
          slug: profesional.slug
        },
      })
    },

    irAProfesionales() {
      this.tab = 'profesionales'
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },

    formatearFecha(fecha) {
      if (!fecha) return ''
      const date = new Date(fecha)
      if (Number.isNaN(date.getTime())) return ''
      return date.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    },

    inicial(nombre) {
      return String(nombre || 'C').trim().charAt(0).toUpperCase()
    },

    volver() {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push({
        name: 'InicioPublico'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.negocio-page {
  width: 100%;
  min-height: 100%;
  background: #fff;
  color: #102c4e;
  padding-bottom: 20px;
}

.page-header {

  display: flex;

  align-items: center;

  gap: 10px;
  padding: 10px;
  

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

.tabs-negocio {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  padding: 6px 12px 12px;
  background: #fff;
}

.tabs-negocio button {
  min-width: 0;
  min-height: 46px;
  border: 0;
  border-radius: 7px;
  background: #f5f7fa;
  color: #52677f;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  padding: 5px 3px;
}

.tabs-negocio button.activo {
  color: #008f91;
  background: #d9f4f4;
  font-weight: 700;
}

.contenido {
  padding: 0 14px 20px;
}

.portada-container {
  height: 220px;
  position: relative;
  margin: 0 -2px;
}

.portada,
.portada-vacia {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.portada-vacia {
  background: linear-gradient(135deg, #d9f4f2, #f3f7f9);
  color: #008f91;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.logo-negocio {
  position: absolute;
  left: 16px;
  bottom: -22px;
  width: 88px;
  height: 88px;
  border: 5px solid #fff;
  border-radius: 50%;
  background: #edf9f8;
  box-shadow: 0 3px 12px #102c4e20;
  overflow: hidden;
  display: grid;
  place-items: center;
  color: #008f91;
}

.logo-negocio img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identidad-negocio {
  padding: 27px 10px 10px;
}

.identidad-negocio h2 {
  font-size: 25px;
  line-height: 1.2;
  margin: 0;
  font-weight: 800;
}

.subtitulo {
  font-size: 14px;
  color: #536b84;
  margin: 5px 0;
}

.calificacion-negocio {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
  font-size: 13px;
}

.calificacion-negocio>span:not(.verificado) {
  color: #60758c;
}

.verificado {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #008f91;
  background: #e1f7f5;
  border-radius: 20px;
  padding: 4px 9px;
  margin-left: 5px;
}

.acciones-negocio {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  padding: 10px 0 14px;
}

.accion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #102c4e;
  font-size: 11px;
  min-width: 0;
}

.accion:disabled {
  opacity: .45;
}

.accion-icono {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #edf9f8;
  color: #008f91;
  display: grid;
  place-items: center;
}

.accion-icono .v-icon {
  font-size: 25px;
}

.lema-negocio {
  padding: 13px 10px;
  border-radius: 14px;
  text-align: center;
  background: #e9f8f7;
  color: #00898d;
  font-size: 17px;
  font-weight: 750;
  margin-bottom: 12px;
}

.titulo-ubicacion {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 0;
  background: transparent;
  text-align: left;
  padding: 12px 4px;
  color: #102c4e;
}

.titulo-ubicacion>span {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.titulo-ubicacion strong {
  font-size: 17px;
}

.direccion,
.localidad {
  font-size: 13px;
  line-height: 1.5;
  color: #536b84;
}

.flecha {
  align-self: center;
}

.mapa-preview {
  position: relative;
  height: 190px;
  overflow: hidden;
  border-radius: 14px;
  background: #e8eff0;
}

.mapa-preview iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.mapa-link {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: #fff;
  border: 0;
  border-radius: 10px;
  box-shadow: 0 2px 8px #102c4e20;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #102c4e;
  font-size: 12px;
  font-weight: 700;
}

.sin-mapa {
  border-radius: 12px;
  padding: 18px;
  background: #f4f8fa;
  color: #60758c;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.botones-ubicacion {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.botones-ubicacion :deep(.v-btn) {
  min-width: 0;
  font-size: 12px;
  letter-spacing: 0;
}


/* Cada sección funciona como una tarjeta independiente */
.bloque {
  background: #ffffff;
  border: 1px solid #e4eeef;
  border-radius: 16px;
  margin: 0 0 16px;
  padding: 15px 13px;
  box-shadow: 0 3px 12px rgba(16, 44, 78, 0.045);
}

/* Separación específica para ubicación */
.ubicacion-bloque {
  padding: 12px;
}

/* Encabezados de las tarjetas */
.bloque h3 {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 16px;
  line-height: 1.35;
  color: #102c4e;
  margin: 0 0 14px;
  padding-bottom: 11px;
  border-bottom: 1px solid #e8f0f1;
}

/* Sobre nosotros */
.sobre-bloque p {
  color: #536b84;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
  white-space: pre-line;
}

/* Horarios */
.horarios-bloque {
  background: #ffffff;
}

.lista-horarios {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.horario-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 2px;
  background: transparent;
  border-radius: 0;
  border-bottom: 1px solid #edf2f4;
  font-size: 12px;
}

.horario-item:last-child {
  border-bottom: 0;
  padding-bottom: 2px;
}

.horario-dia {
  color: #102c4e;
  font-weight: 700;
  min-width: 82px;
}

.horario-turnos {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  text-align: right;
}

.horario-turnos strong {
  color: #008f91;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}


.horarios-bloque {
  padding: 14px 10px;
}

.bloque h3 {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 17px;
  margin: 0 0 10px;
}

.sobre-bloque p {
  color: #536b84;
  font-size: 13px;
  line-height: 1.65;
  margin: 0;
  white-space: pre-line;
}

.texto-secundario {
  color: #74869a;
  font-size: 13px;
  line-height: 1.5;
}

.lista-horarios {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.horario-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  background: #f0f9f8;
  border-radius: 10px;
  font-size: 12px;
}

.horario-item span {
  color: #536b84;
}

.horario-item strong {
  font-size: 13px;
}

.reservar-boton {
  margin: 14px 0 0;
  min-height: 58px;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: 0;
}

.seccion-intro {
  padding: 8px 2px 14px;
}

.seccion-intro h2 {
  font-size: 21px;
  line-height: 1.3;
  margin: 0 0 5px;
}

.seccion-intro p {
  color: #60758c;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.lista-profesionales {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profesional-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #edf1f5;
  border-radius: 18px;
  box-shadow: 0 3px 12px #102c4e08;
  cursor: pointer;
  min-width: 0;
}

.foto-profesional {
  flex: 0 0 98px;
  width: 98px;
  height: 112px;
  border-radius: 13px;
  object-fit: cover;
}

.foto-vacia {
  display: grid;
  place-items: center;
  background: #e9f7f6;
  color: #008f91;
}

.datos-profesional {
  flex: 1;
  min-width: 0;
}

.datos-profesional h3 {
  font-size: 16px;
  line-height: 1.35;
  margin: 0 0 4px;
  overflow-wrap: anywhere;
}

.datos-profesional p {
  color: #60758c;
  font-size: 12px;
  line-height: 1.4;
  margin: 0 0 7px;
}

.calificacion-profesional {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 12px;
}

.calificacion-profesional span {
  color: #60758c;
}

.ver-perfil {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #008f91;
  font-size: 12px;
  font-weight: 750;
  background: transparent;
  border: 0;
  padding: 8px 0 0;
  text-align: left;
}

.flecha-profesional {
  flex: 0 0 auto;
  color: #102c4e;
}

.mas-profesionales {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 18px 14px;
  background: #e9f8f7;
  border-radius: 18px;
  color: #008f91;
}

.mas-profesionales>.v-icon {
  flex: 0 0 42px;
}

.mas-profesionales strong {
  font-size: 14px;
}

.mas-profesionales p {
  color: #536b84;
  font-size: 12px;
  line-height: 1.5;
  margin: 4px 0 0;
}

.resumen-resenas {
  display: flex;
  justify-content: center;
  padding: 18px;
  border: 1px solid #e5ebf1;
  border-radius: 16px;
}

.promedio-resenas {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.promedio-resenas>strong {
  font-size: 38px;
}

.estrellas {
  display: flex;
  align-items: center;
}

.promedio-resenas>span {
  font-size: 12px;
  color: #60758c;
}

.lista-resenas {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.resena-card {
  padding: 14px;
  border: 1px solid #e8edf2;
  border-radius: 15px;
}

.resena-cabecera {
  display: flex;
  align-items: center;
  gap: 9px;
}

.avatar-cliente {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e5f5f4;
  color: #008f91;
  display: grid;
  place-items: center;
  font-weight: 750;
}

.resena-cabecera>div:nth-child(2) {
  flex: 1;
  min-width: 0;
}

.resena-cabecera strong {
  font-size: 13px;
}

.estrellas-pequenas {
  margin-top: 2px;
}

.fecha-resena {
  font-size: 10px;
  color: #74869a;
}

.resena-card>p {
  color: #536b84;
  font-size: 13px;
  line-height: 1.5;
  margin: 12px 0 0;
}

.vacio,
.estado-pagina {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 40px 20px;
  color: #60758c;
}

.vacio h3,
.estado-pagina h2 {
  color: #102c4e;
  margin: 0;
}

.vacio p,
.estado-pagina p {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

@media (min-width: 700px) {
  .negocio-page {
    max-width: 760px;
    margin: 0 auto;
  }

  .contenido {
    padding-right: 22px;
    padding-left: 22px;
  }

  .portada-container {
    height: 300px;
  }

  .lista-profesionales {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 360px) {
  .tabs-negocio {
    gap: 4px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .tabs-negocio button {
    font-size: 10px;
  }

  .foto-profesional {
    flex-basis: 82px;
    width: 82px;
    height: 100px;
  }

  .profesional-card {
    gap: 9px;
    padding: 9px;
  }

  .datos-profesional h3 {
    font-size: 14px;
  }

  .ver-perfil {
    font-size: 11px;
  }
}

.horario-dia {
  color: #102c4e;
  font-weight: 700;
}

.horario-turnos {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.horario-turnos strong {
  color: #008f91;
  font-size: 12px;
  line-height: 1.4;
}



/* ==========================================
   AJUSTE VISUAL DEL PERFIL DEL NEGOCIO
   Cabecera, identidad y acciones separadas
   ========================================== */
.portada-container {
  height: 190px;
  margin: 0;
  border-radius: 18px;
  isolation: isolate;
}

.portada,
.portada-vacia {
  display: block;
  border-radius: 18px;
}

.portada {
  object-position: center;
}

.logo-negocio {
  left: 14px;
  bottom: -25px;
  width: 82px;
  height: 82px;
  border-width: 4px;
  box-shadow: 0 5px 16px rgba(16, 44, 78, 0.14);
}

.identidad-negocio {
  margin-top: 17px;
  padding: 28px 14px 14px;
  background: #ffffff;
  border: 1px solid #e4eeef;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(16, 44, 78, 0.045);
}

.identidad-negocio h2 {
  color: #102c4e;
  font-size: clamp(21px, 6vw, 25px);
  line-height: 1.22;
  overflow-wrap: anywhere;
}

.subtitulo {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.calificacion-negocio {
  margin-top: 10px;
  gap: 5px;
}

.acciones-negocio {
  margin-top: 12px;
  padding: 13px 8px 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  background: #f8fbfc;
  border: 1px solid #e4eeef;
  border-radius: 16px;
}

.accion {
  gap: 7px;
  font-size: 11px;
  line-height: 1.25;
  text-align: center;
  overflow-wrap: anywhere;
}

.accion-icono {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: #e7f7f5;
  transition: background 0.2s ease, transform 0.2s ease;
}

.accion:active .accion-icono {
  transform: scale(0.96);
  background: #d7f0ed;
}

.lema-negocio {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #dcefed;
  line-height: 1.5;
}

.bloque {
  margin-top: 14px;
  margin-bottom: 14px;
  padding: 14px 12px;
  border: 1px solid #e4eeef;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(16, 44, 78, 0.045);
}

.ubicacion-bloque {
  padding: 12px;
}

.titulo-ubicacion {
  padding: 6px 2px 12px;
}

.mapa-preview {
  height: 176px;
  border: 1px solid #edf2f4;
}

.horarios-bloque h3,
.sobre-bloque h3 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8f0f1;
  color: #102c4e;
  font-size: 16px;
  line-height: 1.35;
}

.lista-horarios {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.horario-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 11px 2px;
  border-bottom: 1px solid #edf2f4;
  border-radius: 0;
  background: transparent;
  font-size: 12px;
}

.horario-item:last-child {
  padding-bottom: 2px;
  border-bottom: 0;
}

.horario-dia {
  min-width: 78px;
  color: #102c4e !important;
  font-weight: 700;
}

.horario-turnos {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  min-width: 0;
  text-align: right;
}

.horario-turnos strong {
  color: #008f91;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}

.sobre-bloque p {
  margin: 0;
  color: #536b84;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.reservar-boton {
  margin-top: 4px;
}

@media (max-width: 360px) {
  .portada-container {
    height: 170px;
  }

  .identidad-negocio {
    padding-right: 11px;
    padding-left: 11px;
  }

  .acciones-negocio {
    padding-right: 4px;
    padding-left: 4px;
    gap: 3px;
  }

  .accion-icono {
    width: 44px;
    height: 44px;
  }

  .horario-dia {
    min-width: 70px;
  }

  .horario-turnos strong {
    font-size: 11px;
  }
}

.resena-card {
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.resena-card:hover {
  border-color: #16a6a0;
  box-shadow: 0 3px 12px rgba(22, 166, 160, 0.1);
}

.sheet-detalle-resena {
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: 22px 22px 0 0 !important;
}

.sheet-indicador {
  width: 42px;
  height: 4px;
  margin: 10px auto 4px;
  border-radius: 10px;
  background: #cbd5e1;
}

.comentario-completo {
  padding: 14px;
  border-radius: 12px;
  background: #f5f8fb;
  color: #3f536b;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
