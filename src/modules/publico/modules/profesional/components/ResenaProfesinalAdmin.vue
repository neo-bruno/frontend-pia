<template>
<div class="resenas-container">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->

  <div class="resenas-titulo">

    <v-icon size="20" color="amber-darken-1">
      mdi-star
    </v-icon>

    <span>
      Reseñas de clientes
    </span>

  </div>

  <!-- =====================================================
         RESUMEN DE CALIFICACIONES
    ====================================================== -->

  <div class="resumen-calificaciones">

    <!-- CALIFICACIÓN PROMEDIO -->

    <div class="calificacion-promedio">

      <div class="promedio">
        {{ promedio }}
      </div>

      <div class="estrellas-promedio">

        <v-icon v-for="n in 5" :key="n" size="18" color="amber-darken-1">
          mdi-star
        </v-icon>

      </div>

      <div class="total-resenas">
        {{ totalResenas }} reseñas
      </div>

    </div>

    <!-- DISTRIBUCIÓN -->

    <div class="distribucion">

      <div v-for="nivel in distribucionOrdenada" :key="nivel.puntaje" class="fila-distribucion">

        <span class="numero-estrellas">
          {{ nivel.puntaje }}
        </span>

        <v-icon size="12" color="amber-darken-1">
          mdi-star
        </v-icon>

        <div class="barra">

          <div class="barra-progreso" :style="{
                width: `${nivel.porcentaje}%`
              }" />

        </div>

        <span class="porcentaje">
          {{ nivel.porcentaje }}%
        </span>

      </div>

    </div>

  </div>

  <!-- =====================================================
         LISTA DE RESEÑAS
    ====================================================== -->

  <div class="lista-resenas">

    <div v-for="resena in resenas" :key="resena.id" class="resena-card">

      <!-- CABECERA -->

      <div class="resena-header">

        <!-- AVATAR -->

        <div class="avatar-cliente">

          <img v-if="resena.cliente_foto" :src="getFileUrl(resena.cliente_foto)" :alt="resena.cliente_nombre" />

          <span v-else>
            {{ inicialCliente(resena.cliente_nombre) }}
          </span>

        </div>

        <!-- INFORMACIÓN -->

        <div class="cliente-info">

          <strong>
            {{ resena.cliente_nombre }}
          </strong>

          <div class="calificacion-fecha">

            <span class="estrellas-resena">

              <v-icon v-for="n in 5" :key="n" size="14" :color="
                    n <= Math.round(resena.puntaje)
                     ?'amber-darken-1'
                      : 'grey-lighten-1'
                  ">
                mdi-star
              </v-icon>

            </span>

            <span class="fecha">
              {{ resena.fecha_relativa }}
            </span>

          </div>

        </div>

        <!-- MENU -->

        <v-menu>

          <template #activator="{ props }">

            <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" density="comfortable" size="small" />

          </template>

          <v-list density="compact">

            <v-list-item prepend-icon="mdi-flag-outline" title="Reportar reseña" @click="reportarResena(resena)" />

          </v-list>

        </v-menu>

      </div>

      <!-- TÍTULO -->

      <div v-if="resena.titulo" class="resena-subtitulo">
        {{ resena.titulo }}
      </div>

      <!-- COMENTARIO -->

      <div class="resena-observacion">

        {{ resena.observacion }}

      </div>

    </div>

  </div>

  <!-- =====================================================
         SEGURIDAD
    ====================================================== -->

  <div class="seguridad-resenas">

    <div class="seguridad-icono">

      <v-icon size="27" color="white">
        mdi-shield-check-outline
      </v-icon>

    </div>

    <div class="seguridad-texto">

      <strong>
        Tu seguridad es importante
      </strong>

      <span>
        Profesional verificado por PIA.
        Todas las reservas son seguras.
      </span>

    </div>

  </div>

  <!-- =====================================================
         SIN RESEÑAS
    ====================================================== -->

  <div v-if="!cargando && !resenas.length" class="sin-resenas">

    <v-icon size="38" color="grey-lighten-1">
      mdi-star-outline
    </v-icon>

    <strong>
      Aún no hay reseñas
    </strong>

    <span>
      Las opiniones de los clientes aparecerán aquí.
    </span>

  </div>

</div>
</template>

<script>
export default {

  name: 'ResenaProfesionalAdmin',

  props: {

    profesional: {
      type: Object,
      default: null
    }

  },

  data() {

    return {

      cargando: false,

      resenas: [],

      promedioLocal: 0,

      distribucionLocal: {

        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0

      }

    }

  },

  computed: {

    // =====================================================
    // PROMEDIO
    // =====================================================

    promedio() {

      if (this.promedioLocal) {
        return Number(this.promedioLocal).toFixed(1)
      }

      return Number(
        this.profesional?.calificacion || 0
      ).toFixed(1)

    },

    // =====================================================
    // TOTAL RESEÑAS
    // =====================================================

    totalResenas() {

      if (this.resenas.length) {
        return this.resenas.length
      }

      return Number(
        this.profesional?.cantidad_calificaciones || 0
      )

    },

    // =====================================================
    // DISTRIBUCIÓN
    // =====================================================

    distribucionOrdenada() {

      const total = this.totalResenas

      return [5, 4, 3, 2, 1].map(puntaje => {

        const cantidad =
          this.distribucionLocal[puntaje] || 0

        const porcentaje =
          total > 0 ?
          Math.round((cantidad / total) * 100) :
          0

        return {

          puntaje,
          cantidad,
          porcentaje

        }

      })

    }

  },

  mounted() {

    this.cargarResenas()

  },

  methods: {

    // =====================================================
    // CARGAR RESEÑAS
    // =====================================================

    async cargarResenas() {

      if (!this.profesional?.id) {
        return
      }

      try {

        this.cargando = true

        /*
         * Aquí conectaremos posteriormente
         * el endpoint de reseñas.
         *
         * Ejemplo:
         *
         * const res = await
         * getResenasProfesional(this.profesional.id)
         *
         * this.resenas = res.data.data.resenas
         *
         * this.promedioLocal =
         * res.data.data.promedio
         *
         * this.distribucionLocal =
         * res.data.data.distribucion
         */

      } catch (error) {

        console.error(
          'Error al obtener reseñas:',
          error
        )

      } finally {

        this.cargando = false

      }

    },

    // =====================================================
    // INICIAL DEL CLIENTE
    // =====================================================

    inicialCliente(nombre) {

      if (!nombre) {
        return '?'
      }

      return nombre
        .trim()
        .charAt(0)
        .toUpperCase()

    },

    // =====================================================
    // REPORTAR
    // =====================================================

    reportarResena(resena) {

      console.log(
        'Reportar reseña:',
        resena
      )

    },

    // =====================================================
    // URL ARCHIVO
    // =====================================================

    getFileUrl(url) {

      if (!url) {
        return ''
      }

      if (
        url.startsWith('http://') ||
        url.startsWith('https://')
      ) {
        return url
      }

      const base =
        import.meta.env.VITE_SERVER_URL ||
        ''

      return `${base}${url}`

    }

  }

}
</script>

<style lang="scss" scoped>
/* =====================================================
   CONTENEDOR
===================================================== */

.resenas-container {

  width: 100%;

  padding: 14px 14px 30px;

}

/* =====================================================
   TÍTULO
===================================================== */

.resenas-titulo {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 14px;

  font-size: 16px;

  font-weight: 700;

  color: #17375e;

}

/* =====================================================
   RESUMEN
===================================================== */

.resumen-calificaciones {

  display: flex;

  gap: 18px;

  padding: 14px;

  border: 1px solid #e5ebf2;

  border-radius: 12px;

  background: white;

  margin-bottom: 14px;

}

/* =====================================================
   PROMEDIO
===================================================== */

.calificacion-promedio {

  width: 105px;

  min-width: 105px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border-right: 1px solid #e5ebf2;

  padding-right: 15px;

}

.promedio {

  font-size: 34px;

  line-height: 1;

  font-weight: 700;

  color: #17375e;

}

.estrellas-promedio {

  display: flex;

  gap: 1px;

  margin-top: 7px;

}

.total-resenas {

  margin-top: 5px;

  font-size: 11px;

  color: #60758d;

}

/* =====================================================
   DISTRIBUCIÓN
===================================================== */

.distribucion {

  flex: 1;

  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: 5px;

}

.fila-distribucion {

  display: flex;

  align-items: center;

  gap: 3px;

  height: 16px;

}

.numero-estrellas {

  width: 9px;

  font-size: 11px;

  color: #50657d;

  text-align: right;

}

.barra {

  flex: 1;

  height: 8px;

  overflow: hidden;

  border-radius: 5px;

  background: #e9eef4;

}

.barra-progreso {

  height: 100%;

  border-radius: 5px;

  background: #16a77d;

  transition: width .3s ease;

}

.porcentaje {

  width: 29px;

  font-size: 10px;

  color: #50657d;

  text-align: right;

}

/* =====================================================
   LISTA
===================================================== */

.lista-resenas {

  display: flex;

  flex-direction: column;

  gap: 9px;

}

/* =====================================================
   CARD RESEÑA
===================================================== */

.resena-card {

  padding: 12px;

  border: 1px solid #e5ebf2;

  border-radius: 11px;

  background: white;

}

/* =====================================================
   HEADER RESEÑA
===================================================== */

.resena-header {

  display: flex;

  align-items: flex-start;

  gap: 9px;

}

.avatar-cliente {

  width: 36px;

  height: 36px;

  min-width: 36px;

  overflow: hidden;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #8da0b5;

  color: white;

  font-weight: 600;

  font-size: 15px;

}

.avatar-cliente img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}

.cliente-info {

  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

}

.cliente-info strong {

  color: #17375e;

  font-size: 13px;

}

.calificacion-fecha {

  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 2px;

}

.estrellas-resena {

  display: flex;

  gap: 0;

}

.fecha {

  font-size: 10px;

  color: #75879a;

}

/* =====================================================
   TÍTULO RESEÑA
===================================================== */

.resena-subtitulo {

  margin-top: 8px;

  color: #17375e;

  font-size: 12px;

  font-weight: 700;

}

/* =====================================================
   COMENTARIO
===================================================== */

.resena-observacion {

  margin-top: 4px;

  font-size: 12px;

  line-height: 1.45;

  color: #3f536b;

}

/* =====================================================
   SEGURIDAD
===================================================== */

.seguridad-resenas {

  display: flex;

  align-items: center;

  gap: 11px;

  margin-top: 16px;

  padding: 12px;

  border-radius: 10px;

  background: #eaf8fb;

}

.seguridad-icono {

  width: 42px;

  height: 42px;

  min-width: 42px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #129da0;

}

.seguridad-texto {

  display: flex;

  flex-direction: column;

  gap: 3px;

}

.seguridad-texto strong {

  font-size: 12px;

  color: #17375e;

}

.seguridad-texto span {

  font-size: 11px;

  line-height: 1.4;

  color: #4e657d;

}

/* =====================================================
   SIN RESEÑAS
===================================================== */

.sin-resenas {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 35px 15px;

  gap: 6px;

}

.sin-resenas strong {

  font-size: 14px;

  color: #52667c;

}

.sin-resenas span {

  font-size: 11px;

  color: #8998a8;

}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 400px) {

  .resumen-calificaciones {

    gap: 10px;

    padding: 12px;

  }

  .calificacion-promedio {

    width: 90px;

    min-width: 90px;

    padding-right: 10px;

  }

  .promedio {

    font-size: 30px;

  }

}
</style>
