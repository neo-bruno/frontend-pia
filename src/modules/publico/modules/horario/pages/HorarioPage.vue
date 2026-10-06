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

        <v-icon size="18" color="orange">
          mdi-star
        </v-icon>

        <strong>{{ datos.profesional.calificacion || 0 }}</strong>

        <span>({{datos.profesional.cantidad_calificaciones || 0}})</span>

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
          mdi-check-circle
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
      <v-img
        v-if="servicioSeleccionado.foto"
        :src="getFileUrl(servicioSeleccionado.foto)"
        cover
        height="100%"
        width="100%"
      />
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
    <div v-if="datos?.horarios?.length" class="slots-grid">

      <div v-for="slot in datos.horarios" :key="slot.slot_id" class="slot-card" :class="claseSlot(slot)" @click="seleccionarSlot(slot)">

        <!-- HORA -->

        <div class="slot-hora">
          {{ formatearHora(slot.hora_inicio) }}
        </div>

        <!-- DISPONIBLE -->

        <template v-if="
            slot.estado === 'DISPONIBLE' &&
            slot.seleccionable === true
          ">
          <div class="slot-texto">
            Disponible
          </div>

        </template>

        <template v-else-if="
            slot.estado === 'DISPONIBLE' &&
            slot.seleccionable === false
          ">
          <div class="slot-texto">
            Disponible
          </div>

        </template>

        <template v-else-if="slot.estado === 'OCUPADO'">
          <div class="slot-texto">
            Ocupado
          </div>
        </template>

        <template v-else-if="slot.estado === 'MI_RESERVA'">
          <div class="slot-texto">
            {{ slot.cliente_nombre || 'Tu reserva' }}
          </div>

          <div class="slot-mi-reserva-texto">
            Tu reserva
          </div>
        </template>

        <template v-else-if="slot.estado === 'NO_DISPONIBLE'">
          <div class="slot-texto">
            No disponible
          </div>
        </template>

        <!-- OCUPADO -->

        <template v-else-if="slot.estado === 'OCUPADO'">

          <div class="slot-icono">

            <v-icon size="20">
              mdi-lock
            </v-icon>

          </div>

          <div class="slot-texto">
            Ocupado
          </div>

        </template>

        <!-- MI RESERVA -->

        <template v-else-if="slot.estado === 'MI_RESERVA'">

          <div class="slot-cliente">

            <v-icon size="20">
              mdi-account
            </v-icon>

            <span>
              {{ slot.cliente_nombre || 'Tu reserva' }}
            </span>

          </div>

          <div class="slot-texto">
            Tu reserva
          </div>

        </template>

        <!-- NO DISPONIBLE -->

        <template v-else-if="slot.estado === 'NO_DISPONIBLE'">

          <div class="slot-icono">

            <v-icon size="20">
              mdi-cancel
            </v-icon>

          </div>

          <div class="slot-texto">
            No disponible
          </div>

        </template>

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

        <span>
          Disponible
        </span>

      </div>

      <div class="leyenda-item">

        <span class="punto ocupado"></span>

        <span>
          Ocupado
        </span>

      </div>

      <div v-if="tieneMiReserva" class="leyenda-item">

        <span class="punto mi-reserva"></span>

        <span>
          Tu reserva
        </span>

      </div>

      <div class="leyenda-item">

        <span class="punto no-disponible"></span>

        <span>
          No disponible
        </span>

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
      {{ servicioSeleccionado ? 'Reservar' : 'Seleccionar servicio' }}
      <v-icon end>
        {{ servicioSeleccionado
            ? 'mdi-check-circle-outline'
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
import { useReservaStore } from '@/stores/reserva.store.js';
import LoginCliente from '../../cliente/components/LoginCliente.vue';
import { fechaHoy, getFileUrl } from '@/utils/ayuda'
import { getAvailableSchedule } from '../services/horario.api';
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

      }  catch (error) {
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
/* =====================================================
   CONTENEDOR
===================================================== */

.horario-page {

  min-height: 100vh;

  background: #ffffff;

  padding-bottom: 90px;

}

/* =====================================================
   HEADER
===================================================== */

.header-pia {

  height: 58px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 8px;

  border-bottom: 1px solid #eeeeee;

}

.logo-pia {

  font-size: 28px;

  font-weight: 800;

  color: #0796a0;

  letter-spacing: 1px;

}

/* =====================================================
   PROFESIONAL
===================================================== */

.profesional-card {

  margin: 12px;

  padding: 12px;

  display: flex;

  align-items: center;

  gap: 14px;

  border: 1px solid #e4e9ef;

  border-radius: 12px;

}

.profesional-avatar {

  flex-shrink: 0;

}

.profesional-info {

  min-width: 0;

}

.profesional-nombre {

  font-size: 18px;

  font-weight: 700;

  color: #102b50;

}

.profesional-tipo {

  font-size: 14px;

  color: #55708f;

  margin-top: 2px;

}

.profesional-rating {

  display: flex;

  align-items: center;

  gap: 4px;

  margin-top: 4px;

  color: #173b68;

}

.profesional-rating span {

  color: #55708f;

}

/* =====================================================
   FECHAS
===================================================== */

.seccion-fecha {

  padding: 8px 12px 14px;

}

.titulo-fecha {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 12px;

  color: #102b50;

  font-size: 14px;

  font-weight: 700;

}

.mes {

  font-size: 12px;

  font-weight: 500;

  text-transform: capitalize;

  color: #274b77;

}

/* =====================================================
   CONTENEDOR DE DIAS
===================================================== */

.dias-wrapper {

  display: flex;

  align-items: center;

  gap: 4px;

  width: 100%;

}

/* =====================================================
   SCROLL HORIZONTAL
===================================================== */

.dias-scroll {

  display: flex;

  gap: 7px;

  overflow-x: auto;

  scroll-behavior: smooth;

  scrollbar-width: none;

  flex: 1;

  padding: 2px 0;

}

.dias-scroll::-webkit-scrollbar {

  display: none;

}

/* =====================================================
   DIA
===================================================== */

.dia-card {

  min-width: 62px;

  height: 70px;

  flex-shrink: 0;

  border-radius: 10px;

  background: #f2f6fa;

  border: 1px solid #e3eaf2;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  color: #17365f;

  transition: .15s ease;

}

.dia-card:active {

  transform: scale(.95);

}

.dia-nombre {

  font-size: 12px;

  text-transform: capitalize;

}

.dia-numero {

  font-size: 18px;

  font-weight: 700;

  margin-top: 3px;

}

.dia-card.seleccionado {

  background: #079ba3;

  color: white;

  border-color: #079ba3;

  box-shadow:
    0 3px 8px rgba(0, 150, 160, .20);

}

/* =====================================================
   FLECHAS
===================================================== */

.flecha-dia {

  width: 28px;

  height: 50px;

  flex-shrink: 0;

  border: none;

  background: transparent;

  color: #17365f;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

}

.flecha-dia:active {

  transform: scale(.9);

}

.dia-nombre {

  font-size: 12px;

  text-transform: capitalize;

}

.dia-numero {

  font-size: 18px;

  font-weight: 700;

  margin-top: 3px;

}

.dia-card.seleccionado {

  background: #079ba3;

  color: white;

  border-color: #079ba3;

  box-shadow:
    0 3px 8px rgba(0, 150, 160, .20);

}

/* =====================================================
   HORARIOS
===================================================== */

.seccion-horarios {

  padding: 8px 12px;

}

.horarios-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 14px;

}

.horarios-titulo {

  display: flex;

  align-items: center;

  gap: 7px;

  color: #102b50;

  font-size: 12px;

}

.fecha-texto {

  font-size: 11px;

  color: #52708e;

  text-transform: capitalize;

}

/* =====================================================
   GRID SLOTS
===================================================== */

.slots-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 9px;

}

.slot-card {

  min-height: 76px;

  border-radius: 10px;

  border: 1.5px solid;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  position: relative;

  cursor: pointer;

  transition: .15s ease;

}

.slot-card:active {

  transform: scale(.97);

}

.slot-hora {

  font-size: 17px;

  font-weight: 700;

}

.slot-texto {

  font-size: 12px;

  margin-top: 2px;

}

.slot-icono {

  margin-top: 2px;

}

.slot-cliente {

  display: flex;

  align-items: center;

  gap: 3px;

  font-size: 11px;

  font-weight: 700;

}

/* =====================================================
   DISPONIBLE
===================================================== */

.slot-disponible {

  color: #079b82;

  border-color: #10ad97;

  background: #ffffff;

}

/* =====================================================
   OCUPADO
===================================================== */

.slot-ocupado {

  color: #df4c4c;

  border-color: #ff7777;

  background: #fff8f8;

  cursor: not-allowed;

}

/* =====================================================
   MI RESERVA
===================================================== */

.slot-mi-reserva {

  color: #2361bd;

  border-color: #6b9bea;

  background: #edf4ff;

  cursor: default;

}

/* =====================================================
   NO DISPONIBLE
===================================================== */

.slot-no-disponible {

  color: #7b8797;

  border-color: #b7c0cb;

  background: #edf0f4;

  cursor: not-allowed;

}

/* =====================================================
   SELECCIONADO
===================================================== */

.slot-disponible.slot-seleccionado {

  background: #079ba3;

  color: white;

}

/* =====================================================
   LEYENDA
===================================================== */

.leyenda {

  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 14px;

  margin-top: 18px;

  font-size: 12px;

  color: #385577;

}

.leyenda-item {

  display: flex;

  align-items: center;

  gap: 5px;

}

.punto {

  width: 11px;

  height: 11px;

  border-radius: 50%;

}

.punto.disponible {

  background: #10ad97;

}

.punto.ocupado {

  background: #ff6262;

}

.punto.mi-reserva {

  background: #2864c1;

}

.punto.no-disponible {

  background: #8995a5;

}

/* =====================================================
   MENSAJE
===================================================== */

.mensaje-info {

  margin-top: 16px;

  padding: 14px;

  display: flex;

  align-items: center;

  gap: 10px;

  background: #edf9fc;

  border-radius: 12px;

  color: #245274;

  font-size: 13px;

}

/* =====================================================
   SIN HORARIOS
===================================================== */

.sin-horarios {

  min-height: 150px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  color: #718096;

}

/* =====================================================
   CONTINUAR
===================================================== */

.continuar-container {

  position: fixed;

  left: 0;

  right: 0;

  bottom: 0;

  padding: 10px 12px;

  background: white;

  border-top: 1px solid #e8edf2;

  z-index: 10;

}

.btn-continuar {

  height: 52px !important;

  border-radius: 12px;

  background: #079ba3;

  color: white;

  font-size: 17px;

  font-weight: 700;

}

.btn-continuar:disabled {

  background: #c8ced8;

  color: white;

}

.slot-disponible-no-seleccionable {
  cursor: not-allowed;
  opacity: 0.55;
  filter: grayscale(0.3);
}

.slot-duracion {
  font-size: 11px;
  margin-top: 2px;
  opacity: 0.8;
}

.slot-no-seleccionable {
  font-size: 10px;
  margin-top: 2px;
  opacity: 0.7;
}

.reserva-seleccionada {
  margin: 16px 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(0, 137, 123, 0.08);
  border: 1px solid rgba(0, 137, 123, 0.25);
}

.reserva-seleccionada-titulo {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
}

.reserva-seleccionada-hora {
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
}

.reserva-seleccionada-detalle {
  font-size: 12px;
  margin-top: 3px;
  opacity: 0.7;
}

/* =====================================================
   CLIENTE AUTENTICADO
===================================================== */

.cliente-card {

  margin: 10px 12px 8px;

  padding: 12px 12px;

  display: flex;

  align-items: center;

  gap: 12px;

  border-radius: 16px;

  background: #f0fbfb;

  border: 1px solid #d8eeee;

  box-shadow:
    0 2px 8px rgba(7, 139, 136, 0.06);

}


.cliente-icono {

  width: 44px;

  height: 44px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #d9f3f2;

  color: #078b88;

}


.cliente-info {

  min-width: 0;

  flex: 1;

}


.cliente-label {

  font-size: 11px;

  font-weight: 600;

  color: #62808d;

  margin-bottom: 1px;

}


.cliente-nombre {

  font-size: 15px;

  line-height: 20px;

  font-weight: 700;

  color: #102b50;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

}


.cliente-estado {

  display: inline-flex;

  align-items: center;

  gap: 4px;

  margin-top: 5px;

  padding: 3px 8px;

  border-radius: 20px;

  background: #d9f3ee;

  color: #078b88;

  font-size: 10px;

  font-weight: 600;

}


.cliente-flecha {

  flex-shrink: 0;

  color: #078b88;

  opacity: .65;

}


/* =====================================================
   SERVICIO SELECCIONADO
===================================================== */

.servicio-card {

  margin: 8px 12px 14px;

  padding: 12px;

  display: flex;

  align-items: center;

  gap: 11px;

  border-radius: 16px;

  background: #ffffff;

  border: 1px solid #e1e8ef;

  box-shadow:
    0 3px 10px rgba(16, 43, 80, 0.06);

}


.servicio-icono {

  width: 46px;

  height: 46px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background: #fff1e8;

  color: #e38a5c;

}


.servicio-info {

  min-width: 0;

  flex: 1;

}


.servicio-label {

  font-size: 11px;

  font-weight: 600;

  color: #71859a;

  margin-bottom: 1px;

}


.servicio-nombre {

  font-size: 16px;

  line-height: 21px;

  font-weight: 700;

  color: #102b50;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

}


.servicio-detalles {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 5px;

}


.servicio-detalle {

  display: inline-flex;

  align-items: center;

  gap: 4px;

  font-size: 11px;

  font-weight: 600;

  color: #60758b;

}


.servicio-precio {

  color: #078b88;

}


.servicio-flecha {

  flex-shrink: 0;

  color: #078b88;

  opacity: .65;

}
</style>
