<template>
<div class="evaluaciones-page">
  <!-- ENCABEZADO -->
  <div class="page-header">
    <div>
      <h1>Evaluaciones</h1>
      <p>
        Gestiona las evaluaciones de la plataforma. Define cuáles están
        habilitadas para que los clientes puedan calificar.
      </p>
    </div>

    <v-btn icon="mdi-refresh" variant="text" :loading="cargando" @click="cargarDatos" />
  </div>

  <!-- RESUMEN POR OBJETIVO -->
  <v-row class="resumen-row">
    <v-col v-for="grupo in resumenObjetivos" :key="grupo.codigo" cols="12" sm="6" xl="3">
      <v-card class="resumen-card" :class="`resumen-${grupo.codigo.toLowerCase()}`" rounded="lg" elevation="0" @click="seleccionarObjetivo(grupo.codigo)">
        <div class="resumen-icono">
          <v-icon :icon="grupo.icono" size="29" />
        </div>

        <div class="resumen-contenido">
          <div class="resumen-titulo">{{ grupo.nombre }}</div>

          <div class="resumen-total">
            {{ grupo.total }}
            <span>evaluaciones</span>
          </div>

          <div class="resumen-estados">
            <span class="habilitadas">
              <v-icon icon="mdi-check-circle" size="13" />
              {{ grupo.habilitadas }} habilitadas
            </span>

            <span class="deshabilitadas">
              <v-icon icon="mdi-close-circle" size="13" />
              {{ grupo.deshabilitadas }} deshabilitadas
            </span>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- PESTAÑAS -->
  <v-card class="filtros-card" rounded="lg" elevation="0">
    <v-tabs v-model="objetivoActivo" color="primary" grow show-arrows>
      <v-tab v-for="grupo in grupos" :key="grupo.codigo" :value="grupo.codigo">
        <v-icon :icon="grupo.icono" class="mr-2" />
        {{ grupo.nombre }}
        ({{ cantidadEvaluaciones(grupo.codigo) }})
      </v-tab>
    </v-tabs>

    <v-divider />

    <!-- FILTROS Y ACCIONES -->
    <div class="filtros-contenido">
      <v-select v-model="filtroEstado" label="Estado" :items="opcionesEstado" item-title="titulo" item-value="valor" variant="outlined" density="compact" hide-details class="filtro-estado" />

      <v-text-field v-model="busqueda" label="Buscar por nombre, código o descripción..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable class="filtro-busqueda" />

      <v-btn variant="outlined" prepend-icon="mdi-download" class="btn-exportar" @click="exportarEvaluaciones">
        Exportar
      </v-btn>

      <v-btn color="primary" prepend-icon="mdi-plus" class="btn-nueva" @click="abrirDialogCrear">
        Nueva evaluación
      </v-btn>
    </div>
  </v-card>

  <!-- ERROR -->
  <v-alert v-if="error" type="error" variant="tonal" closable class="mt-4" @click:close="error = ''">
    {{ error }}
  </v-alert>

  <!-- CARGANDO -->
  <div v-if="cargando" class="estado-carga">
    <v-progress-circular indeterminate color="primary" />
    <span>Cargando evaluaciones...</span>
  </div>

  <!-- LISTADO -->
  <template v-else>
    <v-expansion-panels v-model="panelesAbiertos" multiple class="grupos-paneles">
      <v-expansion-panel v-for="grupo in grupos" :key="grupo.codigo" :value="grupo.codigo" class="grupo-panel" rounded="lg">
        <v-expansion-panel-title>
          <div class="grupo-icono" :class="`icono-${grupo.codigo.toLowerCase()}`">
            <v-icon :icon="grupo.icono" size="24" />
          </div>

          <div class="grupo-titulo">
            <strong>
              Evaluaciones - {{ grupo.nombre }}
              ({{ evaluacionesPorObjetivo(grupo.codigo).length }})
            </strong>
            <span>{{ grupo.descripcion }}</span>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <div class="tabla-contenedor">
            <v-table v-if="evaluacionesPorObjetivo(grupo.codigo).length" density="comfortable" class="tabla-evaluaciones">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th class="text-center">Puntaje promedio</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-center">Estado</th>
                  <th class="text-center">Calificaciones</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="evaluacion in evaluacionesPorObjetivo(grupo.codigo)" :key="evaluacion.id">
                  <td>{{ evaluacion.id }}</td>

                  <td>
                    <span class="codigo-texto">
                      {{ evaluacion.tipo_codigo }}
                    </span>
                  </td>

                  <td>
                    <div class="nombre-evaluacion">
                      {{ evaluacion.tipo_nombre }}
                    </div>
                  </td>

                  <td>
                    <div class="descripcion-evaluacion">
                      {{ evaluacion.tipo_descripcion || 'Sin descripción' }}
                    </div>
                  </td>

                  <td class="text-center">
                    <div class="puntaje">
                      <v-icon icon="mdi-star" color="amber-darken-2" size="18" />
                      <strong>
                        {{ formatearPuntaje(evaluacion.puntaje_promedio) }}
                      </strong>
                    </div>
                  </td>

                  <td class="text-center">
                    {{ evaluacion.cantidad_calificaciones ?? 0 }}
                  </td>

                  <td>
                    <div class="estado-control">
                      <v-switch :model-value="evaluacion.estado === 'HABILITADO'" color="teal" density="compact" hide-details inset :disabled="
                            cambiandoEstadoId === evaluacion.id ||
                            evaluacion.tipo_estado !== 'ACTIVO'
                          " @update:model-value="
                            cambiarEstado(evaluacion, $event)
                          " />

                      <v-chip size="x-small" :color="
                            evaluacion.estado === 'HABILITADO'
                             ?'success'
                              : 'grey'
                          " variant="tonal">
                        {{
                            evaluacion.estado === 'HABILITADO'
                             ?'HABILITADO'
                              : 'DESHABILITADO'
                          }}
                      </v-chip>
                    </div>
                  </td>

                  <td class="text-center">
                    <v-btn size="small" variant="outlined" color="primary" prepend-icon="mdi-format-list-bulleted" @click="verDetalle(evaluacion)">
                      Ver ({{ evaluacion.cantidad_calificaciones ?? 0 }})
                    </v-btn>
                  </td>

                  <td>
                    <div class="acciones-tabla">
                      <v-tooltip text="Ver detalle" location="top">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-eye-outline"
                            size="small"
                            variant="tonal"
                            color="blue-grey"
                            @click="verDetalle(evaluacion)"
                          />
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Editar evaluación" location="top">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-pencil-outline"
                            size="small"
                            variant="tonal"
                            color="primary"
                            @click="verDetalle(evaluacion)"
                          />
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Estadísticas" location="top">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-chart-bar"
                            size="small"
                            variant="tonal"
                            color="primary"
                            @click="verEstadisticas(evaluacion)"
                          />
                        </template>
                      </v-tooltip>
                    </div>
                    
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div v-else class="tabla-vacia">
              <v-icon icon="mdi-clipboard-text-outline" size="28" />
              <span>No hay evaluaciones para este objetivo.</span>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </template>

  <!-- PANEL LATERAL -->
  <v-navigation-drawer v-model="drawerDetalle" location="right" temporary width="440" class="drawer-evaluacion">
    <template v-if="evaluacionSeleccionada">
      <div class="drawer-header">
        <h3>Detalle de evaluación</h3>
        <v-btn icon="mdi-close" variant="text" size="small" @click="drawerDetalle = false" />
      </div>

      <div class="drawer-contenido">
        <div class="detalle-identidad">
          <div class="detalle-icono" :class="
                `icono-${evaluacionSeleccionada.objetivo.toLowerCase()}`
              ">
            <v-icon :icon="iconoObjetivo(evaluacionSeleccionada.objetivo)" size="28" />
          </div>

          <div class="detalle-titulo">
            <h3>{{ evaluacionSeleccionada.tipo_nombre }}</h3>
            <span>{{ evaluacionSeleccionada.tipo_codigo }}</span>
          </div>
        </div>

        <div class="detalle-badges">
          <v-chip size="small" color="primary" variant="tonal">
            {{ evaluacionSeleccionada.objetivo }}
          </v-chip>

          <v-chip size="small" :color="
                evaluacionSeleccionada.estado === 'HABILITADO'
                 ?'success'
                  : 'grey'
              " variant="tonal">
            {{ evaluacionSeleccionada.estado }}
          </v-chip>
        </div>

        <v-tabs v-model="pestanaDetalle" color="primary" grow>
          <v-tab value="resumen">Resumen</v-tab>
          <v-tab value="calificaciones">
            Calificaciones ({{ evaluacionSeleccionada.cantidad_calificaciones ?? 0 }})
          </v-tab>
          <v-tab value="estadisticas">Estadísticas</v-tab>
        </v-tabs>

        <v-divider />

        <div v-if="pestanaDetalle === 'resumen'" class="detalle-seccion">
          <h4>Información general</h4>

          <div class="detalle-fila">
            <span>ID evaluación</span>
            <strong>{{ evaluacionSeleccionada.id }}</strong>
          </div>

          <div class="detalle-fila">
            <span>ID tipo de calificación</span>
            <strong>{{ evaluacionSeleccionada.tipo_calificacion_id }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Código</span>
            <strong>{{ evaluacionSeleccionada.tipo_codigo }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Nombre</span>
            <strong>{{ evaluacionSeleccionada.tipo_nombre }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Descripción</span>
            <strong>
              {{ evaluacionSeleccionada.tipo_descripcion || 'Sin descripción' }}
            </strong>
          </div>

          <div class="detalle-fila">
            <span>Objetivo</span>
            <strong>{{ evaluacionSeleccionada.objetivo }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Estado del tipo</span>
            <strong>{{ evaluacionSeleccionada.tipo_estado }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Estado de evaluación</span>
            <strong>{{ evaluacionSeleccionada.estado }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Puntaje promedio</span>
            <strong>{{ formatearPuntaje(evaluacionSeleccionada.puntaje_promedio) }} / 5</strong>
          </div>

          <div class="detalle-fila">
            <span>Cantidad de calificaciones</span>
            <strong>{{ evaluacionSeleccionada.cantidad_calificaciones ?? 0 }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Fecha de creación</span>
            <strong>{{ formatearFecha(evaluacionSeleccionada.created_at) }}</strong>
          </div>

          <div class="detalle-fila">
            <span>Última actualización</span>
            <strong>{{ formatearFecha(evaluacionSeleccionada.updated_at) }}</strong>
          </div>

          <v-btn block color="primary" variant="outlined" prepend-icon="mdi-toggle-switch" class="mt-5" :disabled="evaluacionSeleccionada.tipo_estado !== 'ACTIVO'" :loading="cambiandoEstadoId === evaluacionSeleccionada.id" @click="
                cambiarEstado(
                  evaluacionSeleccionada,
                  evaluacionSeleccionada.estado !== 'HABILITADO'
                )
              ">
            {{
                evaluacionSeleccionada.estado === 'HABILITADO'
                 ?'Deshabilitar evaluación'
                  : 'Habilitar evaluación'
              }}
          </v-btn>
        </div>

        <div v-else-if="pestanaDetalle === 'calificaciones'" class="detalle-seccion">
          <h4>Calificaciones recibidas</h4>

          <v-alert type="info" variant="tonal" density="compact">
            Esta evaluación registra
            {{ evaluacionSeleccionada.cantidad_calificaciones ?? 0 }}
            calificaciones. Para mostrar cada calificación necesitamos
            implementar el endpoint de consulta de calificaciones.
          </v-alert>
        </div>

        <div v-else-if="pestanaDetalle === 'estadisticas'" class="detalle-seccion">
          <h4>Estadísticas generales</h4>

          <div class="estadistica-destacada">
            <span>Puntaje promedio</span>
            <div>
              <v-icon icon="mdi-star" color="amber-darken-2" />
              <strong>
                {{ formatearPuntaje(evaluacionSeleccionada.puntaje_promedio) }}
              </strong>
              <small>/ 5</small>
            </div>
          </div>

          <div class="estadistica-destacada">
            <span>Total de calificaciones</span>
            <strong>
              {{ evaluacionSeleccionada.cantidad_calificaciones ?? 0 }}
            </strong>
          </div>

          <v-alert type="info" variant="tonal" density="compact">
            La distribución por estrellas estará disponible cuando
            implementemos la consulta de calificaciones individuales.
          </v-alert>
        </div>
      </div>
    </template>
  </v-navigation-drawer>

  <!-- NUEVA EVALUACIÓN -->
  <v-dialog v-model="dialogCrear" max-width="560">
    <v-card rounded="lg">
      <v-card-title class="pa-5">
        Nueva evaluación
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <p class="text-medium-emphasis mb-4">
          Selecciona un tipo de calificación activo que todavía no tenga
          una evaluación asociada.
        </p>

        <v-select v-model="nuevoTipoId" label="Tipo de calificación" :items="tiposDisponibles" item-title="tipo" item-value="id" variant="outlined" density="comfortable" :loading="cargandoTipos" :error-messages="errorCrear" no-data-text="No hay tipos disponibles para crear evaluaciones">
          <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="item.tipo" :subtitle="`${item.codigo} · ${item.objetivo}`" />
          </template>

          <template #selection="{ item }">
            <span>
              {{ item.tipo }} — {{ item.objetivo }}
            </span>
          </template>
        </v-select>

        <v-alert type="info" variant="tonal" density="compact">
          La evaluación se creará en estado DESHABILITADO. Podrás
          habilitarla después desde la tabla.
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-5 pt-0">
        <v-spacer />

        <v-btn variant="text" @click="dialogCrear = false">
          Cancelar
        </v-btn>

        <v-btn color="primary" :loading="creando" :disabled="!nuevoTipoId" @click="crearEvaluacion">
          Crear evaluación
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- MENSAJES -->
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3500" location="bottom">
    {{ snackbar.mensaje }}
  </v-snackbar>
</div>
</template>

<script>
import {
  getEvaluaciones,
  createEvaluacion,
  updateEstadoEvaluacion,
} from '@/modules/superadmin/modules/evaluacion/services/evaluacion.api'

import {
  getTiposCalificacion,
} from '@/modules/superadmin/modules/tipo-calificacion/services/tipoCalificacion.api'

const GRUPOS = [{
    codigo: 'PROFESIONAL',
    nombre: 'Profesional',
    descripcion: 'Criterios de evaluación definidos para los profesionales.',
    icono: 'mdi-account-outline',
  },
  {
    codigo: 'SERVICIO',
    nombre: 'Servicio',
    descripcion: 'Criterios de evaluación definidos para los servicios.',
    icono: 'mdi-content-cut',
  },
  {
    codigo: 'NEGOCIO',
    nombre: 'Negocio',
    descripcion: 'Criterios de evaluación definidos para los negocios.',
    icono: 'mdi-storefront-outline',
  },
  {
    codigo: 'PIA',
    nombre: 'PIA',
    descripcion: 'Criterios de evaluación definidos para la plataforma PIA.',
    icono: 'mdi-account-group-outline',
  },
]

export default {
  name: 'EvaluacionesSuperadminPage',

  data() {
    return {
      grupos: GRUPOS,
      evaluaciones: [],
      tiposCalificacion: [],

      cargando: false,
      cargandoTipos: false,
      error: '',

      objetivoActivo: 'PROFESIONAL',
      filtroEstado: null,
      busqueda: '',

      panelesAbiertos: ['PROFESIONAL'],

      drawerDetalle: false,
      evaluacionSeleccionada: null,
      pestanaDetalle: 'resumen',

      dialogCrear: false,
      nuevoTipoId: null,
      errorCrear: '',
      creando: false,

      cambiandoEstadoId: null,

      opcionesEstado: [{
          titulo: 'Todos',
          valor: null
        },
        {
          titulo: 'Habilitados',
          valor: 'HABILITADO'
        },
        {
          titulo: 'Deshabilitados',
          valor: 'DESHABILITADO'
        },
      ],

      snackbar: {
        visible: false,
        mensaje: '',
        color: 'success',
      },
    }
  },

  computed: {
    evaluacionesFiltradas() {
      const texto = (this.busqueda || '').trim().toLowerCase()

      return this.evaluaciones.filter((evaluacion) => {
        const coincideEstado = !this.filtroEstado ||
          evaluacion.estado === this.filtroEstado

        const contenido = [
            evaluacion.tipo_codigo,
            evaluacion.tipo_nombre,
            evaluacion.tipo_descripcion,
          ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return (
          coincideEstado &&
          (!texto || contenido.includes(texto))
        )
      })
    },

    tiposDisponibles() {
      return this.tiposCalificacion.filter((tipo) => {
        const yaTieneEvaluacion =
          tipo.evaluacion_id != null ||
          this.evaluaciones.some(
            (evaluacion) =>
            Number(evaluacion.tipo_calificacion_id) === Number(tipo.id)
          )

        return tipo.estado === 'ACTIVO' && !yaTieneEvaluacion
      })
    },

    resumenObjetivos() {
      return this.grupos.map((grupo) => {
        const lista = this.evaluaciones.filter(
          (evaluacion) => evaluacion.objetivo === grupo.codigo
        )

        return {
          ...grupo,
          total: lista.length,
          habilitadas: lista.filter(
            (evaluacion) => evaluacion.estado === 'HABILITADO'
          ).length,
          deshabilitadas: lista.filter(
            (evaluacion) => evaluacion.estado === 'DESHABILITADO'
          ).length,
        }
      })
    },
  },

  mounted() {
    this.cargarDatos()
  },

  methods: {
    async cargarDatos() {
      this.cargando = true
      this.error = ''

      try {
        const [respuestaEvaluaciones, respuestaTipos] = await Promise.all([
          getEvaluaciones(),
          getTiposCalificacion(),
        ])

        const evaluaciones = respuestaEvaluaciones.data?.data
        const tipos = respuestaTipos.data?.data

        if (!Array.isArray(evaluaciones)) {
          throw new Error(
            'La API de evaluaciones no devolvió una lista válida.'
          )
        }

        if (!Array.isArray(tipos)) {
          throw new Error(
            'La API de tipos de calificación no devolvió una lista válida.'
          )
        }

        this.evaluaciones = evaluaciones
        this.tiposCalificacion = tipos

        if (
          !this.evaluaciones.some(
            (evaluacion) => evaluacion.objetivo === this.objetivoActivo
          )
        ) {
          const primerGrupoConDatos = this.grupos.find((grupo) =>
            this.evaluaciones.some(
              (evaluacion) => evaluacion.objetivo === grupo.codigo
            )
          )

          if (primerGrupoConDatos) {
            this.objetivoActivo = primerGrupoConDatos.codigo
            this.panelesAbiertos = [primerGrupoConDatos.codigo]
          }
        }
      } catch (error) {
        console.error('Error cargando evaluaciones:', error)

        this.error =
          error.response?.data?.message ||
          error.message ||
          'No se pudieron cargar los datos.'
      } finally {
        this.cargando = false
      }
    },

    cantidadEvaluaciones(objetivo) {
      return this.evaluaciones.filter(
        (evaluacion) => evaluacion.objetivo === objetivo
      ).length
    },

    evaluacionesPorObjetivo(objetivo) {
      return this.evaluacionesFiltradas.filter(
        (evaluacion) => evaluacion.objetivo === objetivo
      )
    },

    seleccionarObjetivo(objetivo) {
      this.objetivoActivo = objetivo
      this.panelesAbiertos = [objetivo]
    },

    iconoObjetivo(objetivo) {
      return (
        this.grupos.find((grupo) => grupo.codigo === objetivo)?.icono ||
        'mdi-star-outline'
      )
    },

    formatearPuntaje(valor) {
      const numero = Number(valor?? 0)

      return Number.isFinite(numero) ?
        numero.toFixed(2) :
        '0.00'
    },

    formatearFecha(valor) {
      if (!valor) return '—'

      const fecha = new Date(valor)

      if (Number.isNaN(fecha.getTime())) return '—'

      return new Intl.DateTimeFormat('es-BO', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(fecha)
    },

    verDetalle(evaluacion) {
      this.evaluacionSeleccionada = evaluacion
      this.pestanaDetalle = 'resumen'
      this.drawerDetalle = true
    },

    verEstadisticas(evaluacion) {
      this.evaluacionSeleccionada = evaluacion
      this.pestanaDetalle = 'estadisticas'
      this.drawerDetalle = true
    },

    async cambiarEstado(evaluacion, habilitar) {
      if (this.cambiandoEstadoId !== null) return

      if (evaluacion.tipo_estado !== 'ACTIVO') {
        this.mostrarMensaje(
          'No se puede habilitar una evaluación cuyo tipo está inactivo.',
          'warning'
        )
        return
      }

      const nuevoEstado = habilitar
        ? 'HABILITADO'
        : 'DESHABILITADO'

      if (evaluacion.estado === nuevoEstado) return

      this.cambiandoEstadoId = evaluacion.id

      try {
        const respuesta = await updateEstadoEvaluacion(
          evaluacion.id,
          { estado: nuevoEstado }
        )

        if (respuesta.data?.ok === false) {
          throw new Error(
            respuesta.data.message ||
            'No se pudo actualizar el estado.'
          )
        }

        // Actualizar el listado con el resultado del servidor.
        // Si se habilitó otra evaluación, la anterior también
        // debe aparecer deshabilitada.
        await this.cargarDatos()

        if (this.evaluacionSeleccionada) {
          this.evaluacionSeleccionada =
            this.evaluaciones.find(
              (item) => item.id === this.evaluacionSeleccionada.id
            ) || null
        }

        this.mostrarMensaje(
          habilitar
            ? 'Evaluación habilitada correctamente.'
            : 'Evaluación deshabilitada correctamente.',
          'success'
        )
      } catch (error) {
        console.error('Error cambiando estado:', error)

        this.mostrarMensaje(
          error.response?.data?.message ||
          error.message ||
          'No se pudo cambiar el estado.',
          'error'
        )
      } finally {
        this.cambiandoEstadoId = null
      }
    },


    async abrirDialogCrear() {
      this.nuevoTipoId = null
      this.errorCrear = ''
      this.dialogCrear = true

      if (!this.tiposCalificacion.length) {
        this.cargandoTipos = true

        try {
          const respuesta = await getTiposCalificacion()
          const tipos = respuesta.data?.data

          this.tiposCalificacion = Array.isArray(tipos)?tipos : []
        } catch (error) {
          console.error('Error cargando tipos:', error)

          this.errorCrear =
            error.response?.data?.message ||
            'No se pudieron cargar los tipos de calificación.'
        } finally {
          this.cargandoTipos = false
        }
      }
    },

    async crearEvaluacion() {
      if (!this.nuevoTipoId) {
        this.errorCrear = 'Selecciona un tipo de calificación.'
        return
      }

      this.creando = true
      this.errorCrear = ''

      try {
        const respuesta = await createEvaluacion(
          Number(this.nuevoTipoId)
        )

        if (respuesta.data?.ok === false) {
          throw new Error(
            respuesta.data.message || 'No se pudo crear la evaluación.'
          )
        }

        this.dialogCrear = false

        this.mostrarMensaje(
          'Evaluación creada correctamente.',
          'success'
        )

        await this.cargarDatos()
      } catch (error) {
        console.error('Error creando evaluación:', error)

        this.errorCrear =
          error.response?.data?.message ||
          error.message ||
          'No se pudo crear la evaluación.'

        this.mostrarMensaje(this.errorCrear, 'error')
      } finally {
        this.creando = false
      }
    },

    exportarEvaluaciones() {
      const filas = this.evaluacionesFiltradas

      if (!filas.length) {
        this.mostrarMensaje(
          'No hay evaluaciones para exportar.',
          'warning'
        )
        return
      }

      const columnas = [
        ['ID', 'id'],
        ['Código', 'tipo_codigo'],
        ['Nombre', 'tipo_nombre'],
        ['Descripción', 'tipo_descripcion'],
        ['Objetivo', 'objetivo'],
        ['Puntaje promedio', 'puntaje_promedio'],
        ['Cantidad de calificaciones', 'cantidad_calificaciones'],
        ['Estado', 'estado'],
      ]

      const escapar = (valor) =>
        `"${String(valor ?? '').replace(/"/g, '""')}"`

      const contenido = [
        columnas.map(([titulo]) => escapar(titulo)).join(';'),
        ...filas.map((fila) =>
          columnas
          .map(([, campo]) => escapar(fila[campo]))
          .join(';')
        ),
      ].join('\r\n')

      const archivo = new Blob(
        ['\uFEFF', contenido], {
          type: 'text/csv;charset=utf-8;'
        }
      )

      const url = URL.createObjectURL(archivo)
      const enlace = document.createElement('a')

      enlace.href = url
      enlace.download = 'evaluaciones-pia.csv'
      enlace.click()

      URL.revokeObjectURL(url)
    },

    mostrarMensaje(mensaje, color = 'success') {
      this.snackbar.mensaje = mensaje
      this.snackbar.color = color
      this.snackbar.visible = true
    },
  },
}
</script>

<style lang="scss" scoped>
.evaluaciones-page {
  width: 100%;
  min-width: 0;
  padding: 16px;
  color: #17315f;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  h1 {
    font-size: 28px;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  p {
    margin-top: 4px;
    color: #7183a3;
    font-size: 14px;
  }
}

.resumen-row {
  margin-bottom: 12px;
}

.resumen-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 100px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.resumen-profesional {
  background: #e8f1ff;
  color: #0879f9;
}

.resumen-servicio {
  background: #e4f8f0;
  color: #08a77b;
}

.resumen-negocio {
  background: #fff0df;
  color: #ff8a00;
}

.resumen-pia {
  background: #ffe8f1;
  color: #ed1769;
}

.resumen-icono {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgb(255 255 255 / 55%);
}

.resumen-contenido {
  min-width: 0;
}

.resumen-titulo {
  margin-bottom: 3px;
  color: #17315f;
  font-size: 13px;
  font-weight: 700;
}

.resumen-total {
  color: #17315f;
  font-size: 22px;
  font-weight: 700;

  span {
    font-size: 12px;
    font-weight: 400;
  }
}

.resumen-estados {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  font-size: 11px;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .habilitadas {
    color: #138d62;
  }

  .deshabilitadas {
    color: #6f7e98;
  }
}

.filtros-card {
  margin-bottom: 12px;
  border: 1px solid #e4eaf3;
  background: #fff;
}

.filtros-contenido {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.filtro-estado {
  flex: 0 0 220px;
}

.filtro-busqueda {
  flex: 1 1 auto;
  min-width: 180px;
}

.btn-exportar,
.btn-nueva {
  flex-shrink: 0;
  min-height: 40px;
}

.grupos-paneles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grupo-panel {
  overflow: hidden;
  border: 1px solid #e4eaf3;
  background: #fff;
}

.grupo-panel :deep(.v-expansion-panel-title) {
  min-height: 66px;
  padding: 12px 16px;
}

.grupo-panel :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

.grupo-icono {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: 12px;
  border-radius: 50%;
}

.icono-profesional {
  background: #e3efff;
  color: #0879f9;
}

.icono-servicio {
  background: #dcf8ec;
  color: #08a77b;
}

.icono-negocio {
  background: #fff0df;
  color: #ff8a00;
}

.icono-pia {
  background: #ffe4f0;
  color: #ed1769;
}

.grupo-titulo {
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    color: #17315f;
    font-size: 14px;
    font-weight: 700;
  }

  span {
    color: #8291ad;
    font-size: 12px;
  }
}

.tabla-contenedor {
  width: 100%;
  overflow-x: auto;
}

.tabla-evaluaciones {
  min-width: 1150px;
}

.tabla-evaluaciones th {
  color: #4f6284;
  background: #f7f9fc;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.tabla-evaluaciones td {
  height: 64px;
  border-bottom: 1px solid #edf1f6;
  color: #354b70;
  font-size: 12px;
}

.codigo-texto {
  font-size: 11px;
  font-weight: 600;
}

.nombre-evaluacion {
  min-width: 105px;
  font-weight: 600;
}

.descripcion-evaluacion {
  display: -webkit-box;
  overflow: hidden;
  max-width: 190px;
  color: #647795;
  font-size: 11px;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.puntaje {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  strong {
    color: #17315f;
    white-space: nowrap;
  }
}

.estado-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  white-space: nowrap;
}

.estado-control :deep(.v-switch) {
  flex: 0 0 auto;
}

.acciones-tabla {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.tabla-vacia {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px;
  color: #8291ad;
  font-size: 13px;
}

.estado-carga {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
  color: #7183a3;
}

.drawer-evaluacion {
  max-width: 100%;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #e8edf5;

  h3 {
    color: #17315f;
    font-size: 17px;
    font-weight: 700;
  }
}

.drawer-contenido {
  padding: 20px;
}

.detalle-identidad {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.detalle-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
}

.detalle-titulo {
  min-width: 0;

  h3 {
    color: #17315f;
    font-size: 16px;
    font-weight: 700;
  }

  span {
    color: #7d8da8;
    font-size: 12px;
  }
}

.detalle-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.detalle-seccion {
  padding-top: 20px;

  h4 {
    margin-bottom: 16px;
    color: #17315f;
    font-size: 14px;
    font-weight: 700;
  }
}

.detalle-fila {
  display: grid;
  grid-template-columns: minmax(100px, 40%) minmax(0, 1fr);
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f2f6;
  font-size: 12px;

  span {
    color: #6d7f9e;
  }

  strong {
    overflow-wrap: anywhere;
    color: #354b70;
    font-weight: 500;
  }
}

.estadistica-destacada {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding: 16px;
  border: 1px solid #e5eaf2;
  border-radius: 10px;

  span {
    color: #6d7f9e;
    font-size: 12px;
  }

  strong {
    color: #17315f;
    font-size: 18px;
  }

  div {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  small {
    color: #8291ad;
  }
}

@media (max-width: 960px) {
  .evaluaciones-page {
    padding: 12px;
  }

  .filtros-contenido {
    flex-wrap: wrap;
  }

  .filtro-estado {
    flex: 1 1 180px;
  }

  .filtro-busqueda {
    flex: 1 1 250px;
  }

  .btn-exportar,
  .btn-nueva {
    flex: 1 1 180px;
  }
}

@media (max-width: 600px) {
  .page-header {
    align-items: flex-start;

    h1 {
      font-size: 23px;
    }

    p {
      font-size: 12px;
    }
  }

  .resumen-card {
    min-height: 86px;
    padding: 12px;
  }

  .resumen-icono {
    width: 48px;
    height: 48px;
  }

  .drawer-contenido {
    padding: 16px;
  }
}

.acciones-tabla {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
}

.acciones-tabla :deep(.v-tooltip > .v-overlay__content) {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  max-width: max-content;
}
</style>
