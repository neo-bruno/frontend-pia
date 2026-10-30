<template>
<div class="resenas-container">
  <!-- ENCABEZADO -->
  <div class="resenas-titulo">
    <v-icon size="20" color="amber-darken-1">mdi-star</v-icon>
    <span>Reseñas de clientes</span>
  </div>

  <!-- CARGANDO -->
  <div v-if="cargando" class="estado-resenas">
    <v-progress-circular indeterminate color="teal" size="28" />
    <span>Cargando reseñas...</span>
  </div>

  <!-- ERROR -->
  <div v-else-if="errorCarga" class="estado-resenas">
    <v-icon color="error" size="28">mdi-alert-circle-outline</v-icon>
    <span>{{ errorCarga }}</span>
    <v-btn size="small" variant="outlined" color="teal" @click="cargarResenas">
      Reintentar
    </v-btn>
  </div>

  <template v-else>
    <!-- RESUMEN DE CALIFICACIONES -->
    <div class="resumen-calificaciones">
      <div class="calificacion-promedio">
        <div class="promedio">{{ promedio }}</div>
        <div class="estrellas-promedio">
          <v-icon v-for="n in 5" :key="n" size="18" :color="n <= Math.round(Number(promedio))?'amber-darken-1' : 'grey-lighten-1'">
            mdi-star
          </v-icon>
        </div>
        <div class="total-resenas">{{ totalResenas }} reseñas</div>
      </div>

      <div class="distribucion">
        <div v-for="nivel in distribucionOrdenada" :key="nivel.puntaje" class="fila-distribucion">
          <span class="numero-estrellas">{{ nivel.puntaje }}</span>
          <v-icon size="12" color="amber-darken-1">mdi-star</v-icon>
          <div class="barra">
            <div class="barra-progreso" :style="{ width: `${nivel.porcentaje}%` }" />
          </div>
          <span class="porcentaje">{{ nivel.porcentaje }}%</span>
        </div>
      </div>
    </div>

    <!-- LISTA DE RESEÑAS -->
    <div v-if="resenas.length" class="lista-resenas">
      <div v-for="resena in resenas" :key="resena.id" class="resena-card" role="button" tabindex="0" @click="abrirDetalleResena(resena)" @keydown.enter="abrirDetalleResena(resena)">
        <div class="resena-header">
          <div class="avatar-cliente">
            <img v-if="resena.cliente_foto" :src="getFileUrl(resena.cliente_foto)" :alt="resena.cliente_nombre || 'Cliente'" />
            <span v-else>{{ inicialCliente(resena.cliente_nombre) }}</span>
          </div>

          <div class="cliente-info">
            <strong>{{ resena.cliente_nombre || 'Cliente' }}</strong>
            <div class="calificacion-fecha">
              <span class="estrellas-resena">
                <v-icon v-for="n in 5" :key="n" size="14" :color="n <= Math.round(Number(resena.puntaje || 0))?'amber-darken-1' : 'grey-lighten-1'">
                  mdi-star
                </v-icon>
              </span>
              <span class="fecha">{{ formatearFecha(resena.fecha || resena.created_at) }}</span>
            </div>
          </div>

          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" density="comfortable" size="small" aria-label="Opciones de reseña" />
            </template>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-flag-outline" title="Reportar reseña" @click="reportarResena(resena)" />
            </v-list>
          </v-menu>
        </div>

        <div v-if="resena.titulo" class="resena-subtitulo">
          {{ resena.titulo }}
        </div>
        <div v-if="resena.observacion" class="resena-observacion">
          {{ resena.observacion }}
        </div>
      </div>
    </div>

    <!-- SIN RESEÑAS -->
    <div v-else class="sin-resenas">
      <v-icon size="38" color="grey-lighten-1">mdi-star-outline</v-icon>
      <strong>Aún no hay reseñas</strong>
      <span>Las opiniones de los clientes aparecerán aquí.</span>
    </div>
  </template>

  <!-- SEGURIDAD -->
  <div class="seguridad-resenas">
    <div class="seguridad-icono">
      <v-icon size="27" color="white">mdi-shield-check-outline</v-icon>
    </div>
    <div class="seguridad-texto">
      <strong>Tu seguridad es importante</strong>
      <span>
        Profesional verificado por PIA. Todas las reservas son seguras.
      </span>
    </div>
  </div>
</div>

<v-bottom-sheet v-model="dialogDetalleResena">
  <v-card class="sheet-resena">
    <div class="sheet-indicador"></div>

    <v-card-title class="d-flex align-center justify-space-between">
      <span>Reseña del cliente</span>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        aria-label="Cerrar reseña"
        @click="dialogDetalleResena = false"
      />
    </v-card-title>

    <v-card-text v-if="resenaSeleccionada">
      <div class="d-flex align-center ga-3 mb-4">
        <v-avatar color="blue-grey-lighten-3" size="48">
          <v-img
            v-if="resenaSeleccionada.cliente_foto"
            :src="getFileUrl(resenaSeleccionada.cliente_foto)"
            cover
          />
          <span v-else>
            {{ inicialCliente(resenaSeleccionada.cliente_nombre) }}
          </span>
        </v-avatar>

        <div>
          <div class="font-weight-bold">
            {{ resenaSeleccionada.cliente_nombre || 'Cliente' }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ formatearFecha(resenaSeleccionada.fecha || resenaSeleccionada.created_at) }}
          </div>
        </div>
      </div>

      <div class="d-flex align-center mb-4">
        <v-rating
          :model-value="Number(resenaSeleccionada.puntaje || 0)"
          color="amber-darken-1"
          density="compact"
          half-increments
          readonly
        />
        <span class="ml-2 font-weight-bold">
          {{ Number(resenaSeleccionada.puntaje || 0).toFixed(1) }}/5
        </span>
      </div>

      <h3 v-if="resenaSeleccionada.titulo" class="text-subtitle-1 mb-2">
        {{ resenaSeleccionada.titulo }}
      </h3>

      <p class="detalle-comentario">
        {{ resenaSeleccionada.observacion || 'El cliente no escribió un comentario.' }}
      </p>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-btn
        block
        color="teal"
        variant="flat"
        @click="dialogDetalleResena = false"
      >
        Cerrar
      </v-btn>
    </v-card-actions>
  </v-card>
</v-bottom-sheet>
</template>

<script>
import {
  getResenasProfesional
} from '../services/profesional.api'

export default {
  name: 'ResenaProfesionalAdmin',

  props: {
    profesional: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      cargando: false,
      errorCarga: '',
      resenas: [],
      promedioLocal: 0,
      totalLocal: 0,
      distribucionLocal: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      dialogDetalleResena: false,
      resenaSeleccionada: null,
    }
  },

  computed: {
    profesionalId() {
      return (
        this.profesional?.id ??
        this.profesional?.profesional_id ??
        this.profesional?.profesional?.id ??
        this.profesional?.profesional?.profesional_id ??
        null
      );
    },

    promedio() {
      const valor = this.promedioLocal || this.profesional?.calificacion_promedio ||
        this.profesional?.profesional_calificacion_promedio || this.profesional?.calificacion || 0
      return Number(valor).toFixed(1)
    },

    totalResenas() {
      return this.totalLocal || this.resenas.length ||
        Number(this.profesional?.total_resenas??
          this.profesional?.profesional_total_resenas??
          this.profesional?.cantidad_calificaciones?? 0)
    },

    distribucionOrdenada() {
      const total = this.totalResenas
      return [5, 4, 3, 2, 1].map((puntaje) => {
        const cantidad = Number(this.distribucionLocal[puntaje] || 0)
        return {
          puntaje,
          cantidad,
          porcentaje: total > 0?Math.round((cantidad / total) * 100) : 0,
        }
      })
    },
  },

  watch: {
    profesionalId: {
      immediate: true,
      handler() {
        this.cargarResenas()
      },
    },
  },

  methods: {
    abrirDetalleResena(resena) {
      this.resenaSeleccionada = resena;
      this.dialogDetalleResena = true;
    },
    async cargarResenas() {
      if (!this.profesionalId) {
        this.resenas = []
        this.promedioLocal = 0
        this.totalLocal = 0
        return
      }

      this.cargando = true
      this.errorCarga = ''

      try {
        const respuesta = await getResenasProfesional(this.profesionalId)
        console.log('CARGAR RESEÑA: ', respuesta.data.data)
        const payload = respuesta?.data?.data?? respuesta?.data?? {}
        const datos = payload?.data?? payload

        this.resenas = Array.isArray(datos?.resenas) ?
          datos.resenas.map((resena) => ({
            ...resena,
            puntaje: Number(resena.puntaje || 0),
          })) :
          []

        this.promedioLocal = Number(datos?.promedio || 0)
        this.totalLocal = Number(datos?.total_resenas?? this.resenas.length?? 0)

        const distribucion = datos?.distribucion || {}
        this.distribucionLocal = {
          5: Number(distribucion[5] || 0),
          4: Number(distribucion[4] || 0),
          3: Number(distribucion[3] || 0),
          2: Number(distribucion[2] || 0),
          1: Number(distribucion[1] || 0),
        }
      } catch (error) {
        console.error('Error al obtener reseñas del profesional:', error)
        this.errorCarga = error?.response?.data?.message ||
          error?.response?.data?.mensaje ||
          'No se pudieron cargar las reseñas. Intenta nuevamente.'
      } finally {
        this.cargando = false
      }
    },

    inicialCliente(nombre) {
      if (!nombre || !nombre.trim()) return '?'
      return nombre.trim().charAt(0).toUpperCase()
    },

    formatearFecha(fecha) {
      if (!fecha) return ''
      const valor = new Date(fecha)
      if (Number.isNaN(valor.getTime())) return ''
      return valor.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    },

    reportarResena(resena) {
      // Aquí se conectará el flujo de reportes cuando exista su endpoint.
      console.log('Reportar reseña:', resena)
    },

    getFileUrl(url) {
      if (!url) return ''
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      const base =
        import.meta.env.VITE_SERVER_URL || ''
      return `${base}${url.startsWith('/')?'' : '/'}${url}`
    },
  },
}
</script>

<style lang="scss" scoped>
.resenas-container {
  width: 100%;
  padding: 14px 14px 30px;
}

.resenas-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
  color: #17375e;
}

.resumen-calificaciones {
  display: flex;
  gap: 18px;
  padding: 14px;
  border: 1px solid #e5ebf2;
  border-radius: 12px;
  background: white;
  margin-bottom: 14px;
}

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

.distribucion {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  min-width: 0;
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
  transition: width 0.3s ease;
}

.porcentaje {
  width: 29px;
  font-size: 10px;
  color: #50657d;
  text-align: right;
}

.lista-resenas {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.resena-card {
  padding: 12px;
  border: 1px solid #e5ebf2;
  border-radius: 11px;
  background: white;
}

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
  flex-wrap: wrap;
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

.resena-subtitulo {
  margin-top: 8px;
  color: #17375e;
  font-size: 12px;
  font-weight: 700;
}

.resena-observacion {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.45;
  color: #3f536b;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.estado-resenas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 28px 14px;
  text-align: center;
  color: #60758d;
  font-size: 12px;
}

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
.resena-card {
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.resena-card:hover {
  border-color: #16a6a0;
  box-shadow: 0 3px 12px rgba(22, 166, 160, 0.10);
}

.sheet-resena {
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: 22px 22px 0 0 !important;
}

.sheet-indicador {
  width: 42px;
  height: 4px;
  border-radius: 10px;
  background: #cbd5e1;
  margin: 10px auto 4px;
}

.detalle-comentario {
  color: #3f536b;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
  padding: 12px;
  border-radius: 12px;
  background: #f5f8fb;
}
</style>
