<template>
<div class="horario-page">

  <!-- ================================================= -->

  <!-- HEADER -->

  <!-- ================================================= -->

  <div class="header-pia">

    <v-btn icon variant="text" @click="$router.back()">

      <v-icon>mdi-arrow-left</v-icon>

    </v-btn>

    <div class="logo-pia">

      PIA

    </div>

    <v-btn icon variant="text">

      <v-icon>mdi-heart-outline</v-icon>

    </v-btn>

  </div>

  <!-- ================================================= -->

  <!-- INFORMACION DEL PROFESIONAL -->

  <!-- ================================================= -->

  <div v-if="datos?.profesional" class="profesional-card">

    <v-avatar size="68" class="profesional-avatar">

      <v-img :src="getFileUrl(datos.profesional.foto)" cover />

    </v-avatar>

    <div class="profesional-info">

      <div class="profesional-nombre text-capitalize">

        {{ datos.profesional.nombre  }}

      </div>

      <div class="profesional-tipo">

        Profesional de belleza

      </div>

      <div class="profesional-rating">
        <template v-if="datos.profesional.total_resenas > 0">
          <v-icon color="amber-darken-2" size="small">
            mdi-star
          </v-icon>

          <span class="rating-promedio">
            {{ Number(datos.profesional.calificacion_promedio).toFixed(1) }}
          </span>

          <span class="rating-resenas">
            ({{ datos.profesional.total_resenas }} reseñas)
          </span>
        </template>

        <span v-else class="sin-resenas">
          Sin evaluaciones todavía
        </span>
      </div>

    </div>

  </div>

  <!-- ================================================= -->

  <!-- CLIENTE AUTENTICADO -->

  <!-- ================================================= -->

  <div v-if="clienteActual" class="cliente-card">

    <div class="cliente-icono">

      <v-icon size="26">

        mdi-account

      </v-icon>

    </div>

    <div class="cliente-info">

      <div class="cliente-label">

        Cliente

      </div>

      <div class="cliente-nombre text-capitalize">

        {{ clienteActual?.nombre || clienteActual?.alias }}

      </div>

      <div class="cliente-estado">

        <v-icon size="14">

          mdi-check

        </v-icon>

        <span>

          Cliente autenticado

        </span>

      </div>

    </div>

    <!-- <v-icon class="cliente-flecha" size="24">

      mdi-chevron-right

    </v-icon> -->

  </div>

  <!-- ================================================= -->

  <!-- SERVICIO SELECCIONADO -->

  <!-- ================================================= -->

  <div v-if="servicioSeleccionado" class="servicio-card">

    <!-- ICONO -->

    <div class="servicio-icono">

      <v-img v-if="servicioSeleccionado.foto" :src="getFileUrl(servicioSeleccionado.foto)" cover height="100%" width="100%" />

      <v-icon v-else size="25">

        mdi-content-cut

      </v-icon>

    </div>

    <!-- INFORMACIÓN -->

    <div class="servicio-info">

      <div class="servicio-label">

        Servicio seleccionado

      </div>

      <div class="servicio-nombre text-capitalize">

        {{ servicioSeleccionado.nombre }}

      </div>

      <div class="servicio-detalles">

        <span v-if="servicioSeleccionado.duracion" class="servicio-detalle">

          <v-icon size="17">

            mdi-clock-outline

          </v-icon>

          {{ servicioSeleccionado.duracion }} min

        </span>

        <span v-if="servicioSeleccionado.precio != null" class="servicio-detalle servicio-precio">

          <v-icon size="17">

            mdi-currency-usd

          </v-icon>

          Bs {{ servicioSeleccionado.precio }}

        </span>

      </div>

    </div>

    <!-- FLECHA -->

    <!-- <v-icon class="servicio-flecha" size="25">

      mdi-chevron-right

    </v-icon> -->

  </div>

  <!-- ================================================= -->

  <!-- SELECCIONAR FECHA -->

  <!-- ================================================= -->

  <div class="seccion-fecha">

    <div class="titulo-fecha">

      <span>

        Selecciona una fecha

      </span>

      <span class="mes">

        {{ nombreMes }}

      </span>

    </div>

    <div class="dias-wrapper">

      <!-- <button class="flecha-dia" @click="moverDias(-1)">

        <v-icon size="20">

          mdi-chevron-left

        </v-icon>

      </button> -->

      <div ref="diasScroll" class="dias-scroll">

        <div v-for="dia in dias" :key="dia.fecha" :data-fecha="dia.fecha" class="dia-card" :class="{

            seleccionado:

              dia.fecha === fechaSeleccionada

          }" @click="seleccionarFecha(dia.fecha)">

          <div class="dia-nombre">

            {{ dia.nombre }}

          </div>

          <div class="dia-numero">

            {{ dia.numero }}

          </div>

        </div>

      </div>

      <!-- <button class="flecha-dia" @click="moverDias(1)">

        <v-icon size="20">

          mdi-chevron-right

        </v-icon>

      </button> -->

    </div>

  </div>

  <!-- ================================================= -->

  <!-- HORARIOS -->

  <!-- ================================================= -->

  <div class="seccion-horarios">

    <div class="horarios-header">

      <div class="horarios-titulo">

        <v-icon size="22">

          mdi-clock-outline

        </v-icon>

        <strong>

          Horarios disponibles

        </strong>

      </div>

      <div class="fecha-texto">

        {{ fechaFormateada }}

      </div>

    </div>

    <!-- ================================================= -->

    <!-- SLOTS -->

    <!-- ================================================= -->

    <div v-if="datos?.horarios?.length" class="agenda-timeline">
      <div v-for="slot in datos.horarios" :key="slot.slot_id" class="timeline-row" :class="claseSlot(slot)" @click="seleccionarSlot(slot)">
        <div class="timeline-time">
          {{ formatearHora(slot.hora_inicio) }}
        </div>

        <div class="timeline-track" aria-hidden="true">
          <span class="timeline-dot"></span>
        </div>

        <div class="slot-card" :class="claseSlot(slot)">
          <div class="timeline-card-content">
            <div class="timeline-icon">
              <v-icon v-if="slot.estado === 'DISPONIBLE' && slot.seleccionable === true" size="21">
                {{ slotsSeleccionados.some(item => item.slot_id === slot.slot_id)?'mdi-check' : 'mdi-plus' }}
              </v-icon>
              <v-icon v-else-if="slot.estado === 'OCUPADO' || slot.estado === 'PENDIENTE'" size="22">mdi-account</v-icon>
              <v-icon v-else-if="slot.estado === 'COMPLETADA'" size="22">mdi-check</v-icon>
              <v-icon v-else-if="slot.estado === 'BLOQUEADO'" size="22">mdi-lock</v-icon>
              <v-icon v-else-if="slot.estado === 'NO_DISPONIBLE' || (slot.estado === 'DISPONIBLE' && slot.seleccionable === false)" size="22">mdi-cancel</v-icon>
              <v-icon v-else-if="slot.estado === 'MI_RESERVA'" size="22">mdi-account-check</v-icon>
            </div>

            <div class="timeline-details">
              <template v-if="slot.estado === 'DISPONIBLE'">
                <div class="timeline-title">
                  {{ slotsSeleccionados.some(item => item.slot_id === slot.slot_id)?'Seleccionado' : 'Disponible' }}
                </div>
                <div class="timeline-subtitle" v-if="slot.seleccionable !== false">
                  {{ slot.duracion || slot.duracion_minutos || 30 }} minutos
                </div>
                <div v-else class="timeline-subtitle">Fuera de horario</div>
              </template>

              <template v-else-if="slot.estado === 'OCUPADO' || slot.estado === 'PENDIENTE'">
                <div class="timeline-title">
                  {{ slot.estado === 'PENDIENTE'?'Reserva pendiente' : 'Reserva' }}<span v-if="slot.cliente_nombre"> - {{ slot.cliente_nombre }}</span>
                </div>
                <div class="timeline-subtitle">
                  {{ slot.reserva_servicio_nombre || (slot.estado === 'PENDIENTE'?'Pendiente de confirmación' : 'Horario reservado') }}
                  <span class="font-weight-bold" v-if="slot.hora_fin"> ({{ formatearHora(slot.hora_inicio) }} - {{ formatearHora(slot.hora_fin) }})</span>
                </div>
              </template>

              <template v-else-if="slot.estado === 'COMPLETADA'">
                <div class="timeline-title">Completada<span v-if="slot.cliente_nombre"> - {{ slot.cliente_nombre }}</span></div>
                <div class="timeline-subtitle">{{ slot.reserva_servicio_nombre || 'Servicio completado' }}</div>
              </template>

              <template v-else-if="slot.estado === 'MI_RESERVA'">
                <div class="timeline-title">Tu reserva</div>
                <div class="timeline-subtitle">{{ slot.cliente_nombre || 'Reserva registrada' }}</div>
              </template>

              <template v-else-if="slot.estado === 'BLOQUEADO'">
                <div class="timeline-title">Bloqueado</div>
                <div class="timeline-subtitle">{{ slot.motivo_bloqueo || slot.motivo || slot.observacion || 'Horario no disponible' }}</div>
              </template>

              <template v-else>
                <div class="timeline-title">No disponible</div>
                <div class="timeline-subtitle">Fuera de horario</div>
              </template>
            </div>

            <v-icon v-if="slot.estado === 'OCUPADO' || slot.estado === 'COMPLETADA' || slot.estado === 'MI_RESERVA'" class="timeline-chevron" size="20">mdi-chevron-right</v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- SIN HORARIOS -->

    <div v-else class="sin-horarios">

      <v-icon size="36">

        mdi-calendar-remove

      </v-icon>

      <div>

        No hay horarios disponibles

      </div>

    </div>

    
    <!-- ================================================= -->
    <!-- LEYENDA -->
    <!-- ================================================= -->
    <div class="leyenda">
      <div class="leyenda-item">
        <span class="punto disponible"></span>
        <span>Disponible</span>
      </div>

      <div class="leyenda-item">
        <span class="punto ocupado"></span>
        <span>Reservado</span>
      </div>

      <div class="leyenda-item">
        <span class="punto pendiente"></span>
        <span>Pendiente</span>
      </div>

      <div class="leyenda-item">
        <span class="punto bloqueado"></span>
        <span>Bloqueado</span>
      </div>

      <div class="leyenda-item">
        <span class="punto no-disponible"></span>
        <span>No disponible</span>
      </div>
    </div>
  

    <!-- ================================================= -->

    <!-- MENSAJE -->

    <!-- ================================================= -->

    <div class="mensaje-info">

      <v-icon>

        mdi-information

      </v-icon>

      <span>

        Los horarios ocupados no pueden

        ser seleccionados.

      </span>

    </div>

  </div>

  <!-- ================================================= -->

  <!-- CONTINUAR -->

  <!-- ================================================= -->

  <div class="continuar-container">

    <v-btn block size="large" class="btn-continuar" color="primary" :disabled="!slotSeleccionado" @click="continuarReserva">

      {{ servicioSeleccionado?'Reservar' : 'Seleccionar servicio' }}

      <v-icon end>

        {{ servicioSeleccionado

           ?'mdi-check-outline'

            : 'mdi-content-cut'

        }}

      </v-icon>

    </v-btn>

  </div>

</div>

<loginCliente v-model="dialogoLoginCliente" @login="clienteAutenticado" />

<DialogoSeleccionServicios v-model="dialogoServicio" :profesional-id="profesionalId" @seleccionar="seleccionarServicio" />

<!-- ================================================= -->

<!-- OVERLAY -->

<!-- ================================================= -->

<v-overlay :model-value="overlay" class="align-center justify-center" persistent>

  <v-progress-circular color="primary" size="64" indeterminate />

</v-overlay>
</template>

<script>
import {
  useReservaStore
} from '@/stores/reserva.store.js';

import LoginCliente from '../../cliente/components/LoginCliente.vue';

import {
  fechaHoy,
  getFileUrl
} from '@/utils/ayuda'

import {
  getAvailableSchedule
} from '../services/horario.api';

import DialogoSeleccionServicios from '../../servicios/components/DialogoSeleccionServicios.vue';

export default {

  components: {

    LoginCliente,

    DialogoSeleccionServicios,

  },

  data() {

    return {

      profesionalId: Number(this.$route.params.profesionalId),

      servicioId: this.$route.params.servicioId?Number(this.$route.params.servicioId) : null,

      reservaStore: null,

      overlay: false,

      clienteActual: null,

      servicioSeleccionado: null,

      dialogoLoginCliente: false,

      reservaPendiente: null,

      clienteToken: null,

      dialogoServicio: false,

      serviciosProfesional: [],

      servicioSeleccionadoActual: null,

      datos: null,

      fechaSeleccionada: fechaHoy(),

      slotSeleccionado: null,

      slotsSeleccionados: [],

      diasDisponibles: 30,

      dias: [],

    }

  },

  computed: {

    // ==============================================

    // MES

    // ==============================================

    nombreMes() {

      if (!this.fechaSeleccionada) {

        return ''

      }

      const fecha =

        new Date(

          `${this.fechaSeleccionada}T12:00:00`

        )

      return fecha.toLocaleDateString(

        'es-BO', {

          month: 'long',

          year: 'numeric'

        }

      )

    },

    // ==============================================

    // FECHA FORMATEADA

    // ==============================================

    fechaFormateada() {

      if (!this.fechaSeleccionada) {

        return ''

      }

      const fecha = new Date(`${this.fechaSeleccionada}T12:00:00`)

      return fecha.toLocaleDateString('es-BO', {

        weekday: 'long',

        day: 'numeric',

        month: 'long'

      })

    },

    // ==============================================

    // SABER SI EXISTE MI RESERVA

    // ==============================================

    tieneMiReserva() {

      return !!this.datos?.horarios?.some(slot => slot.estado === 'MI_RESERVA')

    }

  },

  methods: {

    fechaHoy,

    getFileUrl,

    mostrarMensajeHorarioNoDisponible(slot) {

      this.$swal({

        icon: 'info',

        title: 'Horario no disponible',

        text: `Desde las ${this.formatearHora(slot.hora_inicio)} no hay suficiente tiempo para completar este servicio.`,

        confirmButtonText: 'Entendido'

      })

    },

    // ==============================================

    // GENERAR DIAS

    // ==============================================

    generarDias() {

      const fechaBase = new Date(`${fechaHoy()}T12:00:00`)

      const dias = []

      for (let i = 0; i < this.diasDisponibles; i++) {

        const fecha = new Date(fechaBase)

        fecha.setDate(fechaBase.getDate() + i)

        const year = fecha.getFullYear()

        const month = String(fecha.getMonth() + 1).padStart(2, '0')

        const day = String(fecha.getDate()).padStart(2, '0')

        const fechaString = `${year}-${month}-${day}`

        dias.push({

          fecha: fechaString,

          nombre: fecha.toLocaleDateString(

              'es-BO', {

                weekday: 'short'

              }

            )

            .replace('.', ''),

          numero: fecha.getDate()

        })

      }

      this.dias = dias

    },

    moverDias(direccion) {

      const contenedor =

        this.$refs.diasScroll

      if (!contenedor) {

        return

      }

      const desplazamiento = 180

      contenedor.scrollBy({

        left: direccion * desplazamiento,

        behavior: 'smooth'

      })

    },

    // ==============================================

    // SELECCIONAR FECHA

    // ==============================================

    async seleccionarFecha(fecha) {

      if (fecha === this.fechaSeleccionada) {

        return

      }

      this.fechaSeleccionada = fecha

      this.slotSeleccionado = null

      // Llevar el día seleccionado

      // hacia el centro de la vista

      this.$nextTick(() => {

        const elemento = this.$refs.diasScroll?.querySelector(`[data-fecha="${fecha}"]`)

        elemento?.scrollIntoView({

          behavior: 'smooth',

          inline: 'center',

          block: 'nearest'

        })

      })

      await this.obtenerHorariosDisponibles()

    },

    // ==============================================

    // OBTENER HORARIOS

    // ==============================================

    async obtenerHorariosDisponibles() {

      try {

        this.datos = null

        this.slotSeleccionado = null

        this.slotsSeleccionados = []

        this.overlay = true

        console.log(

          '🔎 OBTENIENDO HORARIOS:', {

            profesionalId: this.profesionalId,

            servicioId: this.servicioId,

            fecha: this.fechaSeleccionada

          }

        )

        const res = await getAvailableSchedule(

          this.profesionalId,

          this.servicioId,

          this.fechaSeleccionada

        )

        if (res.data.ok) {

          console.log(

            '📋 HORARIOS RECIBIDOS:',

            res.data.data

          )

          this.datos = res.data.data

        }

      } catch (error) {

        console.error('❌ ERROR OBTENIENDO HORARIOS:', error)

        this.$piaAlert.error(

          error.response?.data?.message ||

          error.response?.data?.error ||

          error.message ||

          "Ocurrió un error inesperado",

          {

            title: "Error Obteniendo Horarios!",

          }

        );

      } finally {

        this.overlay = false

      }

    },

    // ==============================================

    // FORMATEAR HORA

    // ==============================================

    formatearHora(hora) {

      if (!hora) {

        return ''

      }

      return hora.substring(0, 5)

    },

    // ==============================================

    // CLASE DEL SLOT

    // ==============================================

    claseSlot(slot) {

      const seleccionado =

        this.slotsSeleccionados.some(

          item => item.slot_id === slot.slot_id

        )

      return {

        'slot-disponible': slot.estado === 'DISPONIBLE',

        'slot-ocupado': slot.estado === 'OCUPADO',
        'slot-pendiente': slot.estado === 'PENDIENTE',
        'slot-completada': slot.estado === 'COMPLETADA',
        'slot-bloqueado': slot.estado === 'BLOQUEADO',
        'slot-disponible-no-seleccionable': slot.estado === 'DISPONIBLE' && slot.seleccionable === false,

        'slot-mi-reserva': slot.estado === 'MI_RESERVA',

        'slot-no-disponible': slot.estado === 'NO_DISPONIBLE',

        'slot-seleccionado': seleccionado

      }

    },

    // ==============================================

    // SELECCIONAR SLOT

    // ==============================================

    seleccionarSlot(slot) {

      console.log('🕐 SLOT SELECCIONADO:', slot)

      // No permitir seleccionar horarios ocupados

      if (slot.estado !== 'DISPONIBLE') {

        return

      }

      // Si el horario no tiene suficiente continuidad

      // para el servicio actualmente evaluado

      if (slot.seleccionable === false) {

        this.slotSeleccionado = null

        this.slotsSeleccionados = []

        this.mostrarMensajeHorarioNoDisponible(slot)

        return

      }

      // --------------------------------------------------

      // GUARDAMOS EL HORARIO INICIAL

      // --------------------------------------------------

      this.slotSeleccionado = slot

      const ids = (slot.slots_reserva || [slot.slot_id]).map(Number)

      this.slotsSeleccionados = this.datos.horarios.filter(

        horario => ids.includes(Number(horario.slot_id))

      )

      console.log('📌 HORARIO INICIAL:', this.slotSeleccionado)

      console.log('📌 SLOTS SELECCIONADOS:', this.slotsSeleccionados)

      // --------------------------------------------------

      // SI YA EXISTÍA UN SERVICIO

      // DEBEMOS VOLVER A CONFIRMARLO

      // --------------------------------------------------

      if (this.servicioSeleccionado) {

        console.log(

          '🔄 CAMBIÓ EL HORARIO → DEBE VOLVER A CONFIRMAR SERVICIO', this.servicioSeleccionado

        )

        // Quitamos temporalmente el servicio

        this.servicioId = null

        this.servicioSeleccionado = null

        this.servicioSeleccionadoActual = null

        // Abrimos nuevamente la lista de servicios

        this.dialogoServicio = true

        return

      }else{
        this.dialogoServicio = true
      }

      // --------------------------------------------------

      // SI TODAVÍA NO HAY SERVICIO

      // EL USUARIO PODRÁ CONTINUAR

      // Y ELEGIR EL SERVICIO DESPUÉS

      // --------------------------------------------------

      console.log('✅ HORARIO SELECCIONADO SIN SERVICIO')

    },

    // ==============================================

    // CONTINUAR

    // ==============================================

    continuarReserva() {

      if (!this.slotSeleccionado) {

        return

      }

      // --------------------------------------------------

      // TODAVÍA NO HAY SERVICIO

      // --------------------------------------------------

      if (!this.servicioId) {

        console.log('💇 TODAVÍA NO HAY SERVICIO → MOSTRAR SERVICIOS')

        this.dialogoServicio = true

        return

      }

      // --------------------------------------------------

      // YA TENEMOS SERVICIO + HORARIO VALIDADO

      // --------------------------------------------------

      const reserva = {

        profesional_id: this.profesionalId,

        servicio_id: this.servicioId,

        fecha: this.fechaSeleccionada,

        slot_id: this.slotSeleccionado.slot_id,

        hora_inicio: this.slotSeleccionado.hora_inicio,

        hora_fin: this.slotSeleccionado.hora_fin_servicio,

        slots_requeridos: this.slotSeleccionado.slots_requeridos,

        slots_reserva: this.slotSeleccionado.slots_reserva

      }

      console.log('📋 DATOS PARA CREAR RESERVA:', reserva)

      this.reservaPendiente = reserva

      // --------------------------------------------------

      // VERIFICAR CLIENTE

      // --------------------------------------------------

      const tokenCliente = localStorage.getItem('cliente_token')

      console.log('🔐 TOKEN CLIENTE:', tokenCliente?'EXISTE' : 'NO EXISTE')

      if (tokenCliente) {

        this.reservaPendiente.cliente_id = this.clienteActual.id

        console.log('✅ CLIENTE YA AUTENTICADO → CONTINUAR')

        this.continuarConReserva()

        return

      }

      console.log('🔓 CLIENTE NO AUTENTICADO → MOSTRAR LOGIN')

      this.dialogoLoginCliente = true

    },

    async clienteAutenticado(datosCliente) {

      console.log('👤 CLIENTE AUTENTICADO:', datosCliente)

      // --------------------------------------------------

      // GUARDAMOS TOKEN SI EL BACKEND LO DEVUELVE

      // --------------------------------------------------

      if (datosCliente?.token) {

        this.clienteActual = datosCliente

        this.reservaPendiente.cliente_id = datosCliente.id

        // --------------------------------------------------

        // CERRAMOS LOGIN

        // --------------------------------------------------

        this.dialogoLoginCliente = false

        // --------------------------------------------------

        // CONTINUAMOS CON LA RESERVA

        // --------------------------------------------------

        await this.continuarConReserva()

      }

    },

    // ==============================================

    // URL DE ARCHIVOS

    // ==============================================

    async continuarConReserva() {

      if (!this.reservaPendiente) {

        console.warn('⚠️ No existe reserva pendiente')

        return

      }

      console.log('➡️ CONTINUANDO CON RESERVA:', this.reservaPendiente)

      const reserva = this.reservaPendiente

      // ============================================

      // ¿TIENE SERVICIO?

      // ============================================

      if (!reserva.servicio_id) {

        console.warn('⚠️ LA RESERVA NO TIENE SERVICIO')

        // Mostrar diálogo de servicios

        this.dialogoServicio = true

        return

      }

      // ============================================

      // YA TIENE SERVICIO

      // ============================================

      console.log('✅ LA RESERVA YA TIENE SERVICIO:', reserva.servicio_id)

      // Aquí posteriormente iremos al resumen

      console.log('la resera: ', reserva)

      this.irAResumenReserva()

    },

    // ==============================================

    // SELECCIONAR SERVICIO

    // ==============================================

    async seleccionarServicio(servicio) {

      if (!servicio) {

        return

      }

      console.log('💇 SERVICIO SELECCIONADO TEMPORALMENTE:', servicio)

      // --------------------------------------------------

      // DEBE EXISTIR UN HORARIO INICIAL

      // --------------------------------------------------

      if (!this.slotSeleccionado) {

        this.$swal({

          icon: 'info',

          title: 'Selecciona un horario',

          text: 'Primero debes seleccionar el horario para este servicio.',

          confirmButtonText: 'Entendido'

        })

        return

      }

      // --------------------------------------------------

      // GUARDAMOS EL ID DEL SLOT INICIAL

      // --------------------------------------------------

      const slotInicialId = Number(

        this.slotSeleccionado.slot_id

      )

      console.log(

        '🎯 SLOT INICIAL:',

        slotInicialId

      )

      this.overlay = true

      try {

        // --------------------------------------------------

        // NO GUARDAMOS TODAVÍA EL SERVICIO

        //

        // Primero comprobamos si cabe en ese horario

        // --------------------------------------------------

        const res = await getAvailableSchedule(

          this.profesionalId,

          Number(servicio.id),

          this.fechaSeleccionada

        )

        if (!res.data?.ok) {

          throw new Error(

            'No se pudieron recalcular los horarios.'

          )

        }

        const nuevosDatos = res.data.data

        console.log(

          '📋 HORARIOS RECALCULADOS:',

          nuevosDatos

        )

        // --------------------------------------------------

        // BUSCAMOS EL MISMO SLOT QUE HABÍA ELEGIDO

        // --------------------------------------------------

        const horarioRecalculado =

          nuevosDatos?.horarios?.find(

            horario =>

            Number(horario.slot_id) === slotInicialId

          )

        console.log(

          '🔎 HORARIO RECALCULADO:',

          horarioRecalculado

        )

        // --------------------------------------------------

        // EL SERVICIO NO CABE EN ESE HORARIO

        // --------------------------------------------------

        if (!horarioRecalculado || horarioRecalculado.seleccionable !== true) {

          console.log('❌ EL SERVICIO NO CABE EN EL HORARIO')

          // NO GUARDAMOS EL SERVICIO

          this.servicioId = null

          this.servicioSeleccionado = null

          this.servicioSeleccionadoActual = null

          // Mantenemos el horario inicial

          // pero quitamos cualquier selección múltiple

          this.slotsSeleccionados = []

          this.$swal({

            icon: 'info',

            title: 'Horario no disponible',

            text: `El horario de las ${this.formatearHora(

            this.slotSeleccionado.hora_inicio

          )} no tiene suficiente tiempo para realizar el servicio de ${servicio.nombre}.`,

            confirmButtonText: 'Elegir otro servicio'

          })

          // Volvemos a mostrar los servicios

          this.$nextTick(() => {

            this.dialogoServicio = true

          })

          return

        }

        // --------------------------------------------------

        // EL SERVICIO SÍ CABE

        // --------------------------------------------------

        console.log(

          '✅ EL SERVICIO CABE EN EL HORARIO'

        )

        // Ahora sí actualizamos los horarios

        this.datos = nuevosDatos

        // --------------------------------------------------

        // AHORA SÍ GUARDAMOS EL SERVICIO

        // --------------------------------------------------

        this.servicioId = Number(servicio.id)

        this.servicioSeleccionado = servicio

        this.servicioSeleccionadoActual = servicio

        // --------------------------------------------------

        // USAMOS EL SLOT RECALCULADO

        // --------------------------------------------------

        this.slotSeleccionado = horarioRecalculado

        // --------------------------------------------------

        // PINTAMOS TODOS LOS SLOTS QUE OCUPARÁ EL SERVICIO

        // --------------------------------------------------

        const ids = (horarioRecalculado.slots_reserva || []).map(Number)

        this.slotsSeleccionados = this.datos.horarios.filter(

          horario =>

          ids.includes(Number(horario.slot_id))

        )

        console.log('🎨 SLOTS QUE OCUPARÁ LA RESERVA:', this.slotsSeleccionados)

        // --------------------------------------------------

        // CERRAMOS EL DIÁLOGO

        // --------------------------------------------------

        this.dialogoServicio = false

        console.log('🎉 SERVICIO CONFIRMADO:', this.servicioSeleccionado)

        this.continuarReserva()

      } catch (error) {

        console.error('❌ ERROR RECALCULANDO HORARIOS:', error)

        this.$piaAlert.error(

          error.response?.data?.message ||

          error.response?.data?.error ||

          error.message ||

          "No se pudo verificar la disponibilidad del servicio.",

          {

            title: "Error al recalcular horarios!",

          }

        );

      } finally {

        this.overlay = false

      }

    },

    irAResumenReserva() {

      if (!this.slotSeleccionado) {

        return

      }

      const datosReserva = {

        // IDENTIFICACIÓN

        cliente_id: this.clienteActual?.id,

        profesional_id: this.profesionalId,

        servicio_id: this.servicioId,

        // FECHA Y HORARIO

        fecha: this.fechaSeleccionada,

        hora_inicio: this.slotSeleccionado.hora_inicio,

        hora_fin: this.slotSeleccionado.hora_fin_servicio || this.slotSeleccionado.hora_fin,

        // SLOTS

        slot_id: this.slotSeleccionado.slot_id,

        slots_requeridos: this.slotSeleccionado.slots_requeridos || 1,

        slots_reserva: [...(this.slotSeleccionado.slots_reserva || [])],

        // DATOS VISUALES

        cliente: this.clienteActual,

        profesional: this.datos?.profesional,

        servicio: this.servicioSeleccionado,

      }

      console.log('📦 DATOS PARA RESUMEN:', datosReserva)

      this.reservaStore.guardarReserva(datosReserva)

      this.$router.push({

        name: 'resumen-reserva'

      })

    },

  },

  mounted() {

    this.reservaStore = useReservaStore()

    this.generarDias()

    this.obtenerHorariosDisponibles()

    const clienteGuardado = localStorage.getItem('cliente')

    if (clienteGuardado) {

      try {

        this.clienteActual = JSON.parse(clienteGuardado)

        console.log('👤 CLIENTE ACTUAL:', this.clienteActual)

      } catch (error) {

        console.error('❌ Error leyendo cliente:', error)

        localStorage.removeItem('cliente')

      }

    }

  },

}
</script>

<style lang="scss" scoped>
.horario-page {
  min-height: 100vh;
  padding-bottom: calc(88px + env(safe-area-inset-bottom));
  background: #f5f7fb;
  color: #12365d;
  font-family: Inter, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.header-pia {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: #fff;
  border-bottom: 1px solid #edf0f5;
}

.header-pia :deep(.v-btn) {
  color: #193b61;
}

.logo-pia {
  color: #079ba3;
  font-size: 27px;
  font-weight: 850;
  letter-spacing: 1.5px;
}

.profesional-card,
.cliente-card,
.servicio-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 12px 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #e2eaf2;
  border-radius: 15px;
}

.profesional-avatar {
  flex-shrink: 0;
  border: 2px solid #e6f4f3;
}

.profesional-info,
.cliente-info,
.servicio-info {
  min-width: 0;
  flex: 1;
}

.profesional-nombre {
  color: #12365d;
  font-size: 16px;
  font-weight: 750;
  line-height: 1.3;
}

.profesional-tipo {
  margin-top: 3px;
  color: #587695;
  font-size: 12px;
}

.profesional-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  color: #234b73;
  font-size: 12px;
}

.profesional-rating span {
  color: #587695;
}

.cliente-card {
  margin-top: 8px;
  background: #effafa;
  border-color: #d5eeee;
}

.cliente-icono,
.servicio-icono {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: #d9f3f1;
  color: #078f91;
}

.cliente-label,
.servicio-label {
  margin-bottom: 2px;
  color: #68859b;
  font-size: 11px;
}

.cliente-nombre {
  overflow: hidden;
  color: #12365d;
  font-size: 14px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cliente-estado {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  padding: 3px 7px;
  color: #078b84;
  background: #d7f2ed;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 650;
}

.servicio-card {
  margin-top: 8px;
}

.servicio-icono {
  border-radius: 12px;
  background: #fff0e7;
  color: #d98556;
}

.servicio-nombre {
  overflow: hidden;
  color: #12365d;
  font-size: 14px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.servicio-detalles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.servicio-detalle {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #607991;
  font-size: 11px;
}

.servicio-precio {
  color: #078b84;
}

.seccion-fecha,
.seccion-horarios {
  margin: 12px 12px 0;
  padding: 13px 12px;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 17px;
}

.titulo-fecha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 11px;
  color: #12365d;
  font-size: 13px;
  font-weight: 750;
}

.mes {
  color: #527493;
  font-size: 11px;
  text-transform: capitalize;
}

.dias-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.dias-scroll {
  display: flex;
  flex: 1;
  gap: 7px;
  overflow-x: auto;
  padding: 2px 1px 4px;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

.dias-scroll::-webkit-scrollbar {
  display: none;
}

.dia-card {
  min-width: 57px;
  height: 63px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #345573;
  background: #f1f5f9;
  border: 1px solid #e2eaf2;
  border-radius: 12px;
  cursor: pointer;
  transition: .18s ease;
}

.dia-card:active {
  transform: scale(.96);
}

.dia-nombre {
  font-size: 11px;
  text-transform: capitalize;
}

.dia-numero {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 700;
}

.dia-card.seleccionado {
  color: #fff;
  background: linear-gradient(145deg, #0aa9aa, #078b94);
  border-color: transparent;
  box-shadow: 0 4px 10px #079ba333;
}

.horarios-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.horarios-titulo {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #12365d;
  font-size: 13px;
}

.horarios-titulo :deep(.v-icon) {
  color: #078f99;
}

.fecha-texto {
  color: #68839c;
  font-size: 10px;
  text-align: right;
  text-transform: capitalize;
}

.agenda-timeline {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1px 0 0;
}

.timeline-row {
  display: grid;
  grid-template-columns: 48px 16px minmax(0, 1fr);
  align-items: stretch;
  min-width: 0;
  cursor: pointer;
  background: transparent !important;
  border-color: transparent !important;
  color: inherit;
}

.timeline-time {
  padding: 13px 5px 0 0;
  color: #587695;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.timeline-track {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 42px;
}

.timeline-track::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: -5px;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: #e2eaf0;
}

.timeline-row:last-child .timeline-track::before {
  bottom: 50%;
}

.timeline-dot {
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  margin-top: 16px;
  border-radius: 50%;
  background: #079b91;
  box-shadow: 0 0 0 3px #fff;
}

.slot-card {
  min-width: 0;
  margin: 0 0 4px;
  padding: 0;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 11px;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}

.slot-card:active {
  transform: scale(.992);
}

.timeline-card-content {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 7px 10px;
}

.timeline-icon {
  width: 29px;
  height: 29px;
  flex: 0 0 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.timeline-details {
  min-width: 0;
  flex: 1;
}

.timeline-title {
  color: inherit;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.timeline-subtitle {
  margin-top: 2px;
  color: inherit;
  font-size: 10px;
  line-height: 1.35;
  opacity: .9;
  overflow-wrap: anywhere;
}

.timeline-chevron {
  flex: 0 0 auto;
}

.slot-disponible {
  color: #087e78;
  background: #e0f5f2;
  border-color: #b8e9e3;
}

.slot-disponible .timeline-icon {
  color: #fff;
  background: #0aa598;
}

.slot-disponible .timeline-dot {
  background: #079b91;
}

.slot-disponible-no-seleccionable {
  color: #586574;
  background: #edf0f3;
  border-color: #d9dfe5;
  cursor: not-allowed;
}

.slot-disponible-no-seleccionable .timeline-icon {
  color: #fff;
  background: #84919d;
}

.slot-disponible-no-seleccionable .timeline-dot {
  background: #84919d;
}

.slot-disponible-no-seleccionable .timeline-icon .v-icon {
  display: block;
}

.slot-ocupado {
  color: #304c9a;
  background: #eef2ff;
  border-color: #c4d0ff;
  cursor: not-allowed;
}

.slot-ocupado .timeline-icon {
  color: #fff;
  background: #596bd8;
}

.slot-ocupado .timeline-dot {
  background: #596bd8;
}

.slot-pendiente {
  color: #80550c;
  background: #fff4db;
  border-color: #f6d38b;
  cursor: not-allowed;
}

.slot-pendiente .timeline-icon {
  color: #fff;
  background: #d99a19;
}

.slot-pendiente .timeline-dot {
  background: #d99a19;
}

.slot-mi-reserva {
  color: #245d96;
  background: #eaf3ff;
  border-color: #bfd9fa;
  cursor: not-allowed;
}

.slot-mi-reserva .timeline-icon {
  color: #fff;
  background: #4286c7;
}

.slot-mi-reserva .timeline-dot {
  background: #4286c7;
}

.slot-completada {
  color: #286b45;
  background: #edf8f0;
  border-color: #c8e8d0;
  cursor: not-allowed;
}

.slot-completada .timeline-icon {
  color: #fff;
  background: #39865a;
}

.slot-completada .timeline-dot {
  background: #39865a;
}

.slot-bloqueado {
  color: #922d3b;
  background: #fff0f2;
  border-color: #f4bbc3;
  cursor: not-allowed;
}

.slot-bloqueado .timeline-icon {
  color: #fff;
  background: #d94352;
}

.slot-bloqueado .timeline-dot {
  background: #d94352;
}

.slot-no-disponible {
  color: #566270;
  background: #edf0f3;
  border-color: #d9dfe5;
  cursor: not-allowed;
}

.slot-no-disponible .timeline-icon {
  color: #fff;
  background: #84919d;
}

.slot-no-disponible .timeline-dot {
  background: #84919d;
}

.slot-disponible.slot-seleccionado {
  color: #fff;
  background: #078b83;
  border-color: #078b83;
  box-shadow: 0 4px 12px #078b8326;
}

.slot-seleccionado .timeline-icon {
  color: #078b83;
  background: #fff;
}

.slot-seleccionado .timeline-subtitle {
  color: #fff;
}

.sin-horarios {
  min-height: 145px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #78899b;
  font-size: 12px;
}

.sin-horarios :deep(.v-icon) {
  color: #aab7c5;
}

/* =====================================================
   LEYENDA DE ESTADOS
===================================================== */

.leyenda {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-top: 18px;
  padding: 4px 2px;
}

.leyenda-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #526781;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.punto {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
}

/* Disponible: turquesa */
.punto.disponible {
  background-color: #0aa598;
}

/* Reserva confirmada: azul */
.punto.ocupado {
  background-color: #596bd8;
}

/* Reserva pendiente: anaranjado */
.punto.pendiente {
  background-color: #e99a16;
}

/* Bloqueado: rojo */
.punto.bloqueado {
  background-color: #e5394f;
}

/* No disponible: gris */
.punto.no-disponible {
  background-color: #8995a5;
}


.mensaje-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 11px;
  color: #245274;
  background: #edf7fd;
  border-radius: 12px;
  font-size: 11px;
  line-height: 1.5;
}

.mensaje-info :deep(.v-icon) {
  flex-shrink: 0;
  color: #27648a;
}

.continuar-container {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, .97);
  border-top: 1px solid #e6ecf2;
  box-shadow: 0 -5px 18px #172b460d;
  backdrop-filter: blur(10px);
}

.btn-continuar {
  height: 48px !important;
  color: #fff;
  background: linear-gradient(100deg, #0aa5a7, #087e87);
  border-radius: 13px;
  font-size: 14px;
  font-weight: 750;
  letter-spacing: 0;
}

.btn-continuar:disabled {
  color: #fff;
  background: #cbd2dc !important;
  box-shadow: none;
}

.slot-duracion {
  margin-top: 2px;
  font-size: 11px;
  opacity: .8;
}

.slot-no-seleccionable {
  margin-top: 2px;
  font-size: 10px;
  opacity: .7;
}

.reserva-seleccionada {
  margin: 16px 0;
  padding: 14px 16px;
  background: rgba(0, 137, 123, .08);
  border: 1px solid rgba(0, 137, 123, .25);
  border-radius: 14px;
}

.reserva-seleccionada-titulo {
  font-size: 12px;
  font-weight: 600;
  opacity: .7;
}

.reserva-seleccionada-hora {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
}

.reserva-seleccionada-detalle {
  margin-top: 3px;
  font-size: 12px;
  opacity: .7;
}

@media (max-width:350px) {

  .profesional-card,
  .cliente-card,
  .servicio-card {
    margin-right: 9px;
    margin-left: 9px;
    padding: 10px;
  }

  .seccion-fecha,
  .seccion-horarios {
    margin-right: 9px;
    margin-left: 9px;
    padding: 11px 9px;
  }

  .timeline-row {
    grid-template-columns: 35px 14px minmax(0, 1fr);
  }

  .timeline-time {
    font-size: 11px;
    padding-right: 3px;
  }

  .timeline-card-content {
    gap: 7px;
    padding: 7px;
  }

  .timeline-title {
    font-size: 11px;
  }

  .timeline-subtitle {
    font-size: 10px;
  }

  .dia-card {
    min-width: 53px;
  }
}

.profesional-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  font-size: 12px;
}

.rating-promedio {
  color: #263b53;
  font-weight: 700;
}

.rating-resenas {
  color: #7b8798;
}

.sin-resenas {
  color: #7b8798;
  font-size: 11px;
}
</style>
