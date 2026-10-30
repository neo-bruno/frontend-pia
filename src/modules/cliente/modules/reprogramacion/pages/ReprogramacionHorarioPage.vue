<template>
<div class="horario-page">

  <!-- ================================================= -->

  <!-- HEADER -->

  <!-- ================================================= -->

  <div class="header-pia">
    <v-btn icon variant="text" aria-label="Volver" @click="$router.back()">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div class="header-titulo">
      <div class="logo-pia">PIA</div>
      <div class="header-subtitulo">REPROGRAMACIÓN DE RESERVA</div>
    </div>
    <div class="header-icono">
      <v-icon>mdi-calendar-sync</v-icon>
    </div>
  </div>

  <section class="reprogramacion-banner">
    <div class="banner-icono">
      <v-icon size="25">mdi-calendar-edit</v-icon>
    </div>
    <div class="banner-contenido">
      <div class="banner-titulo">Reprogramar mi reserva</div>
      <div class="banner-texto">
        Conservaremos tu servicio y el pago registrado. Solo elegirás una nueva fecha y hora.
      </div>
    </div>
    <span class="banner-etiqueta">CAMBIO DE CITA</span>
  </section>

  <div v-if="reservaOriginal" class="reserva-original-card">
    <div class="original-cabecera">
      <v-icon size="19">mdi-calendar-clock</v-icon>
      <span>Tu reserva actual</span>
      <span class="original-badge">ORIGINAL</span>
    </div>
    <div class="original-datos">
      <div class="original-fecha-icono">
        <v-icon size="25">mdi-calendar-check</v-icon>
      </div>
      <div class="original-info">
        <div class="original-fecha">{{ fechaOriginalFormateada }}</div>
        <div class="original-hora">
          <v-icon size="15">mdi-clock-outline</v-icon>
          {{ formatearHora(reservaOriginal.hora_inicio) }}
          <span v-if="reservaOriginal.hora_fin">– {{ formatearHora(reservaOriginal.hora_fin) }}</span>
        </div>
        <div class="original-numero" v-if="reservaOriginal.numero">
          Reserva N.º {{ reservaOriginal.numero }}
        </div>
      </div>
    </div>
    <div class="original-nota">
      <v-icon size="16">mdi-information-outline</v-icon>
      Esta es la cita que se cambiará por el nuevo horario.
    </div>
  </div>

  <!-- ================================================= -->
  <!-- INFORMACION DEL PROFESIONAL -->
  <!-- ================================================= -->

  <div v-if="profesional" class="profesional-card">
    
    <v-avatar size="68" class="profesional-avatar">
      <v-img v-if="fotoProfesional" :src="getFileUrl(fotoProfesional)" cover alt="Foto del profesional">
        <template #error>
          <div class="imagen-fallback"><v-icon size="30">mdi-account</v-icon></div>
        </template>
      </v-img>
      <div v-else class="imagen-fallback">
        <v-icon size="30">mdi-account</v-icon>
      </div>
    </v-avatar>

    <div class="profesional-info">

      <div class="profesional-nombre text-capitalize">

        {{ profesional.nombre  }}

      </div>

      <div class="profesional-tipo">

        {{ profesional.tipo || "Profesional de belleza" }}

      </div>

      <div class="profesional-rating">
        <template v-if="profesional.total_resenas > 0">
          <v-icon color="amber-darken-2" size="small">
            mdi-star
          </v-icon>

          <span class="rating-promedio">
            {{ Number(profesional.calificacion_promedio).toFixed(1) }}
          </span>

          <span class="rating-resenas">
            ({{ profesional.total_resenas }} reseñas)
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

      <v-img v-if="fotoServicio" :src="getFileUrl(fotoServicio)" cover height="100%" width="100%" alt="Imagen del servicio">
        <template #error>
          <div class="servicio-fallback">
            <v-icon size="25">mdi-content-cut</v-icon>
          </div>
        </template>
      </v-img>
      <v-icon v-else size="25">mdi-content-cut</v-icon>

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

        Selecciona la nueva fecha

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

  <div v-if="slotSeleccionado" class="nueva-reserva-card">
    <div class="nueva-reserva-titulo">
      <v-icon size="19">mdi-calendar-check</v-icon>
      Nueva fecha seleccionada
    </div>
    <div class="nueva-reserva-datos">
      <div class="nueva-reserva-fecha">{{ fechaSeleccionadaFormateada }}</div>
      <div class="nueva-reserva-hora">
        {{ formatearHora(slotSeleccionado.hora_inicio) }}
        <span>–</span>
        {{ formatearHora(slotSeleccionado.hora_fin_servicio || slotSeleccionado.hora_fin) }}
      </div>
    </div>
    <div class="nueva-reserva-ayuda">
      <v-icon size="15">mdi-check-circle</v-icon>
      Este será el horario solicitado para tu reprogramación.
    </div>
  </div>

  <div class="seccion-horarios">
    <div class="horarios-header">

      <div class="horarios-titulo">

        <v-icon size="22">

          mdi-clock-outline

        </v-icon>

        <strong>

          Elige el nuevo horario

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
                {{ slotSeleccionado?.slot_id === slot.slot_id ? 'mdi-check' : 'mdi-plus' }}
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
                  {{ slotSeleccionado?.slot_id === slot.slot_id ? 'Seleccionado' : 'Disponible' }}
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

      Continuar con la reprogramación
      <v-icon end>mdi-arrow-right</v-icon>

    </v-btn>

  </div>

</div>

<!-- ================================================= -->

<!-- OVERLAY -->

<!-- ================================================= -->

<v-overlay :model-value="overlay" class="align-center justify-center" persistent>

  <v-progress-circular color="primary" size="64" indeterminate />

</v-overlay>

<!-- Hoja inferior: confirmar el servicio que se conservará en la reprogramación -->
<v-bottom-sheet v-model="sheetServicio" inset persistent>
  <v-card class="sheet-servicio" rounded="t-xl">
    <div class="sheet-handle"></div>
    <div class="sheet-cabecera">
      <div>
        <div class="sheet-eyebrow">REPROGRAMACIÓN</div>
        <h3>Confirma tu servicio</h3>
        <p>La reprogramación conserva el servicio de tu reserva original.</p>
      </div>
      <v-btn icon variant="text" aria-label="Cerrar" @click="cancelarSeleccionHorario">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- HORARIO ELEGIDO PROVISIONALMENTE -->
    <div v-if="slotPendiente" class="horario-pendiente">
      <div class="horario-pendiente-icono">
        <v-icon size="23">mdi-calendar-clock</v-icon>
      </div>

      <div class="horario-pendiente-info">
        <span class="horario-pendiente-titulo">
          Horario que elegiste
        </span>

        <strong>
          {{ formatearFecha(fechaSeleccionada) }}
        </strong>

        <span class="horario-pendiente-hora">
          <v-icon size="16">mdi-clock-outline</v-icon>
          {{ formatearHora(slotPendiente.hora_inicio) }} –
          {{ formatearHora(
            slotPendiente.hora_fin_servicio ||
            slotPendiente.hora_fin
          ) }}
        </span>
      </div>

      <v-icon color="#079b99" size="23">
        mdi-check-circle-outline
      </v-icon>
    </div>

    <div v-if="servicioSeleccionado" class="sheet-servicio-item">
      <div class="sheet-servicio-imagen">
        <v-img
          v-if="fotoServicio"
          :src="getFileUrl(fotoServicio)"
          cover
          alt="Imagen del servicio"
        >
          <template #error><v-icon>mdi-content-cut</v-icon></template>
        </v-img>
        <v-icon v-else size="27">mdi-content-cut</v-icon>
      </div>
      <div class="sheet-servicio-detalle">
        <div class="sheet-servicio-nombre">{{ servicioSeleccionado.nombre }}</div>
        <div class="sheet-servicio-meta">
          <span><v-icon size="15">mdi-clock-outline</v-icon>{{ servicioSeleccionado.duracion || 0 }} min</span>
          <span v-if="servicioSeleccionado.precio != null">
            <v-icon size="15">mdi-cash</v-icon>Bs {{ Number(servicioSeleccionado.precio).toFixed(2) }}
          </span>
        </div>
        <div class="sheet-conserva"><v-icon size="14">mdi-check-circle</v-icon>Se conservará en tu nueva cita</div>
      </div>
    </div>

    <v-btn block size="large" class="sheet-confirmar" :disabled="!servicioSeleccionado || !slotSeleccionado" @click="confirmarServicioYContinuar">
      Confirmar servicio y continuar
      <v-icon end>mdi-arrow-right</v-icon>
    </v-btn>

    <v-btn block variant="text" class="sheet-cancelar" @click="cancelarSeleccionHorario">
      Elegir otro horario
    </v-btn>

  </v-card>
</v-bottom-sheet>
</template>

<script>
import {
  fechaHoy,
  getFileUrl
} from "@/utils/ayuda";
import {
  getCondicionesReprogramacion,
  getDisponibilidadReprogramacion,
} from "../services/reprogramacion.api";

export default {
  name: "ReprogramacionHorarioPage",

  data() {
    return {
      reservaId: Number(this.$route.params.reservaId),
      overlay: false,
      clienteActual: null,
      reservaOriginal: null,
      profesional: null,
      servicioSeleccionado: null,
      condiciones: [],
      datos: null,
      fechaSeleccionada: fechaHoy(),
      slotSeleccionado: null,
      slotPendiente: null,     // Horario provisional en el bottom sheet
      slotsSeleccionados: [],
      sheetServicio: false,
      diasDisponibles: 30,
      dias: [],
      errorCarga: null,
    };
  },

  computed: {
    fotoProfesional() {
      const p = this.profesional || {};
      return p.foto || p.foto_url || p.imagen || p.imagen_url ||
        p.avatar || p.foto_perfil || p.foto_principal || null;
    },

    fotoServicio() {
      const s = this.servicioSeleccionado || {};
      return s.foto || s.foto_url || s.imagen || s.imagen_url ||
        s.archivo_url || s.foto_principal || null;
    },

    nombreMes() {
      if (!this.fechaSeleccionada) return "";
      return new Date(`${this.fechaSeleccionada}T12:00:00`).toLocaleDateString(
        "es-BO", {
          month: "long",
          year: "numeric"
        }
      );
    },

    fechaFormateada() {
      if (!this.fechaSeleccionada) return "";
      return new Date(`${this.fechaSeleccionada}T12:00:00`).toLocaleDateString(
        "es-BO", {
          weekday: "long",
          day: "numeric",
          month: "long"
        }
      );
    },

    fechaSeleccionadaFormateada() {
      if (!this.fechaSeleccionada) return "";
      return new Date(`${this.fechaSeleccionada}T12:00:00`).toLocaleDateString(
        "es-BO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );
    },

    fechaOriginalFormateada() {
      const fecha = this.reservaOriginal?.fecha;
      if (!fecha) return "Fecha no disponible";
      const soloFecha = String(fecha).slice(0, 10);
      const fechaLocal = new Date(`${soloFecha}T12:00:00`);
      if (Number.isNaN(fechaLocal.getTime())) return soloFecha;
      return fechaLocal.toLocaleDateString(
        "es-BO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );
    },
  },

  methods: {
    fechaHoy,
    getFileUrl,

    cancelarSeleccionHorario() {
      this.slotPendiente = null;

      this.sheetServicio = false;
      this.slotSeleccionado = null;
      this.slotsSeleccionados = [];
    },

    formatearHora(hora) {
      return hora?String(hora).substring(0, 5) : "";
    },
    formatearFecha(value) {
      if (!value) return "--";

      // Evita desfases al recibir una fecha YYYY-MM-DD.
      const fecha = String(value).substring(0, 10);
      const [anio, mes, dia] = fecha.split("-").map(Number);

      const fechaLocal = new Date(anio, mes - 1, dia, 12, 0, 0);

      return fechaLocal.toLocaleDateString("es-BO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    generarDias() {
      const base = new Date(`${fechaHoy()}T12:00:00`);
      const resultado = [];
      for (let i = 0; i < this.diasDisponibles; i += 1) {
        const fecha = new Date(base);
        fecha.setDate(base.getDate() + i);
        const fechaString = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
        resultado.push({
          fecha: fechaString,
          nombre: fecha.toLocaleDateString("es-BO", {
            weekday: "short"
          }).replace(".", ""),
          numero: fecha.getDate(),
        });
      }
      this.dias = resultado;
    },

    async cargarCondiciones() {
      this.overlay = true;
      this.errorCarga = null;
      try {
        const respuesta = await getCondicionesReprogramacion(this.reservaId);
        if (!respuesta.data?.ok) {
          throw new Error(respuesta.data?.mensaje || "No se pudo validar la reserva.");
        }

        const data = respuesta.data.data;
        this.reservaOriginal = data;
        this.condiciones = data.condiciones || [];
        this.servicioSeleccionado = {
          id: data.servicio?.id,
          nombre: data.servicio?.nombre || "Servicio",
          duracion: Number(data.servicio?.duracion) || 0,
          precio: data.precio_aplicable ?? data.precio_original ?? null,
          foto: data.servicio?.foto || data.servicio?.foto_url ||
            data.servicio?.imagen || data.servicio?.imagen_url ||
            data.servicio_foto || data.foto_servicio || null,
        };
        const profesionalData = data.profesional || {};
        this.profesional = {
          ...profesionalData,
          id: profesionalData.id ?? data.profesional_id ?? data.profesional?.profesional_id,
          nombre: profesionalData.nombre || profesionalData.nombre_completo ||
            data.profesional_nombre || data.nombre_profesional || "Profesional",
          foto: profesionalData.foto || profesionalData.foto_url ||
            profesionalData.imagen || profesionalData.imagen_url ||
            data.profesional_foto || data.foto_profesional || data.foto_url || null,
          calificacion_promedio: profesionalData.calificacion_promedio ??
            profesionalData.promedio_calificacion ?? data.calificacion_promedio ??
            data.profesional_calificacion_promedio ?? data.promedio_calificacion ?? 0,
          total_resenas: profesionalData.total_resenas ??
            profesionalData.total_resenas ?? data.total_resenas ??
            data.profesional_total_resenas ?? data.cantidad_resenas ?? 0,
          tipo: profesionalData.tipo || profesionalData.tipo_profesional ||
            data.tipo_profesional || "Profesional de belleza",
        };

        if (data.puede_reprogramar !== true) {
          throw new Error("Esta reserva no permite reprogramación.");
        }

        const clienteGuardado = localStorage.getItem("cliente");
        if (clienteGuardado) {
          try {
            this.clienteActual = JSON.parse(clienteGuardado);
          } catch {
            localStorage.removeItem("cliente");
          }
        }

        await this.obtenerHorariosDisponibles();
      } catch (error) {
        console.error("Error cargando condiciones de reprogramación:", error);
        this.errorCarga =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          error.message ||
          "No se pudo cargar la reserva.";
        this.$piaAlert?.error?.(this.errorCarga, {
          title: "Reprogramación"
        });
      } finally {
        this.overlay = false;
      }
    },

    async seleccionarFecha(fecha) {
      if (fecha === this.fechaSeleccionada) return;
      this.fechaSeleccionada = fecha;
      this.slotSeleccionado = null;
      this.slotsSeleccionados = [];
      this.sheetServicio = false;

      this.$nextTick(() => {
        const elemento = this.$refs.diasScroll?.querySelector(`[data-fecha="${fecha}"]`);
        elemento?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      });

      await this.obtenerHorariosDisponibles();
    },

    async obtenerHorariosDisponibles() {
      if (!this.reservaId || !this.fechaSeleccionada) return;
      this.overlay = true;
      this.datos = null;
      this.slotSeleccionado = null;
      this.slotsSeleccionados = [];

      try {
        const respuesta = await getDisponibilidadReprogramacion(
          this.reservaId,
          this.fechaSeleccionada,
        );

        if (!respuesta.data?.ok) {
          throw new Error(respuesta.data?.mensaje || "No se pudieron cargar los horarios.");
        }

        const data = respuesta.data.data;
        // Convertimos cada combinación válida al formato que utiliza el diseño de la agenda.
        const combinaciones = (data.horarios_disponibles || []).map((item) => ({
          ...item,
          slot_id: Number(item.slots_reserva?.[0]),
          hora_fin_servicio: item.hora_fin,
          slots_requeridos: item.slots_reserva?.length || 1,

          // Las combinaciones recibidas deben venir validadas
          // por el backend para que solo incluyan horarios libres.
          estado: item.estado || "DISPONIBLE",
          seleccionable: item.seleccionable !== false,

          duracion:
            Number(item.duracion) ||
            Number(data.duracion_servicio) ||
            0,
        }));

        this.datos = {
          ...data,
          horarios: combinaciones,
          profesional: this.profesional,
        };
      } catch (error) {
        console.error("Error obteniendo disponibilidad:", error);
        this.$piaAlert?.error?.(
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          error.message ||
          "No se pudo consultar la disponibilidad.", {
            title: "Elige el nuevo horario"
          },
        );
      } finally {
        this.overlay = false;
      }
    },

    claseSlot(slot) {
      const seleccionado = this.slotSeleccionado?.slot_id === slot.slot_id;
      return {
        "slot-disponible": slot.estado === "DISPONIBLE" && slot.seleccionable !== false,
        "slot-disponible-no-seleccionable": slot.estado === "DISPONIBLE" && slot.seleccionable === false,
        "slot-ocupado": slot.estado === "OCUPADO",
        "slot-pendiente": slot.estado === "PENDIENTE",
        "slot-completada": slot.estado === "COMPLETADA",
        "slot-bloqueado": slot.estado === "BLOQUEADO",
        "slot-no-disponible": slot.estado === "NO_DISPONIBLE",
        "slot-mi-reserva": slot.estado === "MI_RESERVA",
        "slot-seleccionado": seleccionado,
      };
    },

    seleccionarSlot(slot) {
      if (slot.estado !== "DISPONIBLE" || slot.seleccionable !== true) return;

      this.slotSeleccionado = slot;
      this.slotsSeleccionados = (slot.slots_reserva || []).map((slotId) => ({
        slot_id: Number(slotId),
        hora_inicio: slot.hora_inicio,
        hora_fin: slot.hora_fin_servicio || slot.hora_fin,
      }));

      if (!this.slotsSeleccionados.length) {
        this.$piaAlert?.error?.(
          "No se identificaron los bloques de horario de esta combinación. Actualiza la agenda e inténtalo de nuevo.",
          { title: "Reprogramación" },
        );
        this.slotSeleccionado = null;
        this.sheetServicio = false;
        return;
      }

      // Todavía NO confirmamos el horario.
      // Solo lo guardamos provisionalmente para mostrarlo en el sheet.
      this.slotPendiente = slot;

      this.sheetServicio = true;
    },

    confirmarServicioYContinuar() {
      if (!this.slotPendiente || !this.servicioSeleccionado) {
        return;
      }

      // Ahora sí confirmamos el horario elegido.
      this.slotSeleccionado = this.slotPendiente;

      this.slotsSeleccionados = (
        this.slotPendiente.slots_reserva || []
      ).map((slotId) => ({
        slot_id: Number(slotId),
        hora_inicio: this.slotPendiente.hora_inicio,
        hora_fin:
          this.slotPendiente.hora_fin_servicio ||
          this.slotPendiente.hora_fin,
      }));

      if (!this.slotsSeleccionados.length) {
        this.slotSeleccionado = null;
        this.slotPendiente = null;

        this.$piaAlert?.error?.(
          "No se identificaron los bloques de horario. Actualiza la agenda e inténtalo de nuevo.",
          { title: "Reprogramación" }
        );

        return;
      }

      this.sheetServicio = false;
      this.slotPendiente = null;

      this.continuarReserva();
    },

    continuarReserva() {
      if (!this.slotSeleccionado || !this.reservaOriginal) return;

      const datosReprogramacion = {
        reservaId: this.reservaId,
        reservaOriginal: this.reservaOriginal,
        servicio: this.servicioSeleccionado,
        profesional: this.profesional,
        fecha: this.fechaSeleccionada,
        hora_inicio: this.slotSeleccionado.hora_inicio,
        hora_fin: this.slotSeleccionado.hora_fin_servicio || this.slotSeleccionado.hora_fin,
        slots_reserva: [...(this.slotSeleccionado.slots_reserva || [])].map(Number),
      };

      if (!datosReprogramacion.slots_reserva.length) {
        this.$piaAlert?.error?.("No se identificaron los horarios seleccionados.", {
          title: "Reprogramación",
        });
        return;
      }

      sessionStorage.setItem("pia_reprogramacion_pendiente", JSON.stringify(datosReprogramacion));
      this.$router.push({
        name: "cliente.reprogramacion.resumen",
        params: {
          reservaId: this.reservaId
        },
      });
    },
  },

  mounted() {
    this.generarDias();
    this.cargarCondiciones();
  },
};
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

.header-titulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.header-subtitulo {
  margin-top: 3px;
  color: #68859b;
  font-size: 8px;
  font-weight: 750;
  letter-spacing: .8px;
}

.header-icono {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #078f99;
  background: #e8f8f6;
  border: 1px solid #d2efec;
  border-radius: 50%;
}

.reprogramacion-banner {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin: 12px 12px 0;
  padding: 14px 12px;
  background: linear-gradient(135deg, #e8fbf8 0%, #f5fcff 100%);
  border: 1px solid #c7eeea;
  border-radius: 16px;
}

.banner-icono {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(145deg, #0aa8a4, #087f8a);
  border-radius: 13px;
}

.banner-contenido {
  min-width: 0;
  flex: 1;
}

.banner-titulo {
  color: #075f66;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
}

.banner-texto {
  margin-top: 4px;
  color: #4d7182;
  font-size: 11px;
  line-height: 1.5;
}

.banner-etiqueta {
  align-self: flex-start;
  padding: 4px 6px;
  color: #087e78;
  background: #d3f4ee;
  border-radius: 7px;
  font-size: 8px;
  font-weight: 800;
  white-space: nowrap;
}

.reserva-original-card,
.nueva-reserva-card {
  margin: 10px 12px 0;
  padding: 13px;
  background: #fff;
  border: 1px solid #dce8f1;
  border-radius: 16px;
  box-shadow: 0 3px 10px rgba(24, 59, 88, .035);
}

.original-cabecera,
.nueva-reserva-titulo {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #244e70;
  font-size: 12px;
  font-weight: 800;
}

.original-cabecera>.v-icon,
.nueva-reserva-titulo>.v-icon {
  color: #078f99;
}

.original-badge {
  margin-left: auto;
  padding: 4px 7px;
  color: #63758a;
  background: #eef2f6;
  border-radius: 6px;
  font-size: 8px;
  letter-spacing: .5px;
}

.original-datos {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 12px;
}

.original-fecha-icono {
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #52718f;
  background: #eef4fa;
  border-radius: 12px;
}

.original-info {
  min-width: 0;
}

.original-fecha {
  color: #173c60;
  font-size: 13px;
  font-weight: 750;
  text-transform: capitalize;
}

.original-hora,
.original-numero {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  color: #607b93;
  font-size: 11px;
}

.original-numero {
  color: #8797a8;
  font-size: 10px;
}

.original-nota {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 12px;
  padding-top: 10px;
  color: #6a7f92;
  border-top: 1px dashed #e0e8ef;
  font-size: 10px;
  line-height: 1.4;
}

.original-nota .v-icon {
  flex-shrink: 0;
  color: #8297aa;
}

.imagen-fallback,
.servicio-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #078f99;
  background: #e4f5f3;
}

.servicio-fallback {
  background: #fff0e7;
  color: #d98556;
}

.nueva-reserva-card {
  background: linear-gradient(135deg, #effbf8, #fff);
  border-color: #bfe8df;
}

.nueva-reserva-datos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

.nueva-reserva-fecha {
  color: #174765;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.nueva-reserva-hora {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #07877f;
  font-size: 16px;
  font-weight: 850;
  white-space: nowrap;
}

.nueva-reserva-ayuda {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 9px;
  color: #318277;
  font-size: 10px;
}

@media (max-width: 350px) {

  .reprogramacion-banner,
  .reserva-original-card,
  .nueva-reserva-card {
    margin-right: 9px;
    margin-left: 9px;
  }

  .banner-etiqueta {
    display: none;
  }

  .nueva-reserva-datos {
    align-items: flex-start;
    flex-direction: column;
  }
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

/* Hoja inferior para confirmar el servicio al seleccionar un horario */
.sheet-servicio {
  padding: 10px 18px calc(18px + env(safe-area-inset-bottom));
  background: #fff;
}
.sheet-handle {
  width: 38px;
  height: 4px;
  margin: 2px auto 17px;
  background: #d7e1e9;
  border-radius: 99px;
}
.sheet-cabecera {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 17px;
}
.sheet-eyebrow {
  margin-bottom: 4px;
  color: #078f99;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}
.sheet-cabecera h3 {
  color: #12365d;
  font-size: 19px;
  font-weight: 800;
}
.sheet-cabecera p {
  margin-top: 4px;
  color: #6b8195;
  font-size: 12px;
  line-height: 1.45;
}
.sheet-servicio-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 12px;
  background: #f4fbfa;
  border: 1px solid #d5efeb;
  border-radius: 15px;
}
.sheet-servicio-imagen {
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #d98556;
  background: #fff0e7;
  border-radius: 12px;
}
.sheet-servicio-detalle { min-width: 0; flex: 1; }
.sheet-servicio-nombre {
  color: #12365d;
  font-size: 14px;
  font-weight: 800;
}
.sheet-servicio-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
  color: #607991;
  font-size: 11px;
}
.sheet-servicio-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.sheet-conserva {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 7px;
  color: #078b84;
  font-size: 10px;
  font-weight: 650;
}
.sheet-confirmar {
  min-height: 48px;
  color: #fff !important;
  background: linear-gradient(100deg, #0aa5a7, #087e87) !important;
  border-radius: 13px;
  font-weight: 750;
}
.sheet-cancelar { margin-top: 5px; color: #607991; }
.horario-pendiente {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 18px 0 14px;
  padding: 13px;
  border: 1px solid #a9e4dd;
  border-radius: 15px;
  background: linear-gradient(135deg, #effcf9, #f8fffe);
}

.horario-pendiente-icono {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: #d9f5ef;
  color: #079b99;
}

.horario-pendiente-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.horario-pendiente-titulo {
  color: #078b84;
  font-size: 11px;
  font-weight: 800;
}

.horario-pendiente-info strong {
  color: #173c5e;
  font-size: 13px;
  text-transform: capitalize;
}

.horario-pendiente-hora {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #078b84;
  font-size: 13px;
  font-weight: 800;
}
</style>
