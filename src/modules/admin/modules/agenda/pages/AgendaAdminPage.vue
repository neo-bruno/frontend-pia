<template>
<div class="agenda-page">
  <section class="agenda-heading">
    <div class="agenda-heading-icon">
      <v-icon color="primary" size="30">mdi-calendar-month-outline</v-icon>
    </div>
    <div>
      <h1>Agenda</h1>
      <p>Gestiona tu disponibilidad y reservas</p>
    </div>
  </section>

  <section class="calendario-card">
    <div class="mes-header">
      <button type="button" class="btn-mes" @click="cambiarSemana(-1)">
        <v-icon size="28">mdi-chevron-left</v-icon>
      </button>
      <div class="mes-titulo">{{ mesAnio }}</div>
      <button type="button" class="btn-mes" @click="cambiarSemana(1)">
        <v-icon size="28">mdi-chevron-right</v-icon>
      </button>
    </div>

    <div class="dias-semana">
      <button v-for="dia in diasSemana" :key="dia.fecha" type="button" class="dia-semana" :class="{ seleccionado: dia.fecha === fechaSeleccionada }" @click="seleccionarFecha(dia.fecha)">
        <span class="dia-nombre">{{ dia.nombre }}</span>
        <span class="dia-numero">{{ dia.numero }}</span>
        <span v-if="dia.indicador" class="dia-indicador"></span>
      </button>
    </div>
  </section>

  <section class="fecha-heading">
    <h4>{{ fechaFormateada }}</h4>
    <button type="button" class="btn-hoy" @click="irAHoy">{{ textoBotonHoy }}</button>
  </section>

  <div v-if="cargando" class="estado-carga">
    <v-progress-circular indeterminate size="30" width="3" />
    <span>Cargando agenda...</span>
  </div>

  <section v-else class="timeline-card">
    <div v-if="!profesionalActual" class="agenda-vacia">
      <div class="agenda-vacia-icono">
        <v-icon size="34">mdi-calendar-blank-outline</v-icon>
      </div>
      <div class="agenda-vacia-titulo">Sin agenda para este día</div>
      <div class="agenda-vacia-texto">
        No existen horarios configurados para esta fecha.
      </div>
    </div>

    <template v-else>
      <div class="timeline">
        <div class="horas-columna" :style="{ height: `${alturaAgenda}px` }">
          <div v-for="hora in horasVisibles" :key="hora.key" class="hora" :style="{ top: `${hora.top}px` }">
            {{ hora.valor }}
          </div>
        </div>

        <div class="agenda-columna">
          <div class="grid-horario" :style="{ height: `${alturaAgenda}px` }">
            <div v-for="slot in slotsActuales" :key="`linea-${slot.id}`" class="linea-hora" :style="estiloLinea(slot)"></div>

            <template v-for="bloque in bloquesAgenda" :key="bloque.key">
              <button v-if="bloque.tipo === 'DISPONIBLE'" type="button" class="bloque disponible" :style="estiloBloque(bloque)" @click="abrirSheetBloqueo(bloque)">
                <span class="disponible-circulo">
                  <v-icon size="18">mdi-plus</v-icon>
                </span>
                <span class="disponible-texto">Disponible</span>
                <span class="disponible-plus">
                  <v-icon size="23">mdi-plus</v-icon>
                </span>
              </button>

              <div v-else-if="bloque.tipo === 'BLOQUEADO'" class="bloque no-disponible" :style="estiloBloque(bloque)" :class="{ 'bloque-desbloqueable': bloque.bloqueoId }" @click="abrirSheetDesbloqueo(bloque)">
                <div class="bloque-icono">
                  <v-icon size="25">mdi-cancel</v-icon>
                </div>
                <div class="bloque-info">
                  <strong>{{ bloque.titulo }}</strong>
                  <span>No disponible</span>
                </div>
                <div class="bloque-hora">
                  {{ bloque.horaInicio }} - {{ bloque.horaFin }}
                </div>
                <v-icon size="23" class="bloque-candado">
                  mdi-lock-outline
                </v-icon>
              </div>

              <button v-else type="button" class="bloque reserva" :class="[`reserva-${bloque.estado.toLowerCase()}`, { 'reserva-alta': Number(bloque.duracion) >= 60 }]" :style="estiloBloque(bloque)" @click="abrirReserva(bloque.reserva)">
                <div class="reserva-contenido">
                  <div class="reserva-fila-principal">
                    <div class="cliente-avatar" :class="`avatar-${colorAvatar(bloque.reserva)}`">
                      {{ iniciales(bloque.reserva?.cliente?.nombre) }}
                    </div>

                    <strong class="reserva-servicio">
                      {{ bloque.reserva?.servicio?.nombre || "Reserva" }}
                      <span v-if="bloque.duracion >= 120" class="reserva-duracion">
                        · {{ formatearDuracion(bloque.duracion) }}
                      </span>
                    </strong>
                  </div>

                  <div class="reserva-cliente">
                    {{ bloque.reserva?.cliente?.nombre || "Cliente" }}
                  </div>

                  <div class="reserva-fila-final">
                    <span class="estado-badge">{{ bloque.estado }}</span>
                    <span class="reserva-hora">
                      {{ bloque.horaInicio }} - {{ bloque.horaFin }}
                    </span>
                  </div>
                </div>

                <v-icon size="20" class="reserva-arrow">
                  mdi-chevron-right
                </v-icon>
              </button>
            </template>
          </div>
        </div>
      </div>
    </template>
  </section>

  <section class="leyenda">
    <div><span class="leyenda-circulo disponible-dot"></span>Disponible</div>
    <div><span class="leyenda-circulo reservado-dot"></span>Reservado</div>
    <div><span class="leyenda-circulo pendiente-dot"></span>Pendiente</div>
    <div><span class="leyenda-circulo completada-dot"></span>Completada</div>
    <div>
      <span class="leyenda-icono">
        <v-icon size="14">mdi-cancel</v-icon>
      </span>
      No disponible
    </div>
  </section>

</div>

<!-- =====================================================
     SHEET CAMBIO DE ESTADO DE RESERVA
     ===================================================== -->
<v-bottom-sheet v-model="sheetEstadoReserva" inset>
  <v-card class="estado-reserva-sheet">
    <div class="sheet-handle"></div>

    <!-- =================================================
         CABECERA
         ================================================= -->
    <div class="sheet-header">
      <div>
        <div class="sheet-titulo">
          Servicio Reservado
        </div>

        <div class="sheet-subtitulo">
          {{ reservaSeleccionada?.servicio?.nombre || "Reserva" }}
        </div>
      </div>

      <button type="button" class="sheet-cerrar" aria-label="Cerrar" @click="sheetEstadoReserva = false">
        <v-icon size="20">mdi-close</v-icon>
      </button>
    </div>

    <!-- =================================================
         INFORMACIÓN DE LA RESERVA
         ================================================= -->
    <div v-if="reservaSeleccionada" class="sheet-detalle-reserva">

      <!-- =================================================
           CLIENTE
           ================================================= -->
      <div class="sheet-cliente">
        <div class="sheet-avatar" :class="`avatar-${colorAvatar(reservaSeleccionada)}`">
          {{ iniciales(reservaSeleccionada?.cliente?.nombre) }}
        </div>

        <div class="sheet-cliente-datos">
          <strong>
            {{ reservaSeleccionada?.cliente?.nombre || "Cliente" }}
          </strong>

          <span v-if="reservaSeleccionada?.cliente?.telefono" class="sheet-dato-contacto">
            <v-icon color="primary" size="17">mdi-phone-outline</v-icon>
            {{ reservaSeleccionada.cliente.telefono }}
          </span>

          <span v-if="reservaSeleccionada?.cliente?.email" class="sheet-dato-contacto">
            <v-icon color="primary" size="17">mdi-email-outline</v-icon>
            {{ reservaSeleccionada.cliente.email }}
          </span>
        </div>
      </div>

      <!-- =================================================
           SERVICIO
           ================================================= -->
      <div class="sheet-servicio">

        <div class="sheet-servicio-icono">
          <v-img v-if="reservaSeleccionada?.servicio?.imagen" :src="getFileUrl(reservaSeleccionada.servicio.imagen)" cover width="56" height="56" class="servicio-imagen" />

          <v-icon v-else size="25">
            mdi-content-cut
          </v-icon>
        </div>

        <div class="sheet-servicio-datos">
          <strong>
            {{ reservaSeleccionada?.servicio?.nombre || "Servicio" }}
          </strong>

          <div class="sheet-servicio-meta">

            <strong v-if="reservaSeleccionada?.servicio?.duracion" class="sheet-meta-item">
              <v-icon color="primary" size="17">mdi-clock-outline</v-icon>
              {{ formatearDuracion(Number(reservaSeleccionada.servicio.duracion)) }}
            </strong>

            <strong class="sheet-meta-item">
              <v-icon color="primary" size="17">mdi-cash</v-icon>
              Bs. {{ Number(
                reservaSeleccionada.precio_aplicable ??
                reservaSeleccionada.servicio?.precio ??
                0
              ).toFixed(2) }}
            </strong>

          </div>
        </div>
      </div>

        <!-- =================================================
      RESUMEN FINANCIERO DE LA RESERVA
      ================================================= -->
      <div class="sheet-finanzas">
        <div class="sheet-finanzas-titulo">
          <v-icon color="primary" size="19">mdi-receipt-text-outline</v-icon>
          Detalle del pago
        </div>

        <div class="sheet-finanzas-fila">
          <span>Precio original</span>
          <strong>
            Bs. {{ Number(
              reservaSeleccionada.precio_original ??
              reservaSeleccionada.servicio?.precio ??
              0
            ).toFixed(2) }}
          </strong>
        </div>

        <div
          v-if="Number(reservaSeleccionada.monto_descuento ?? 0) > 0"
          class="sheet-finanzas-fila descuento"
        >
          <span>Descuento</span>
          <strong>
            − Bs. {{ Number(
              reservaSeleccionada.monto_descuento
            ).toFixed(2) }}
          </strong>
        </div>

        <div class="sheet-finanzas-fila">
          <span>Precio final</span>
          <strong>
            Bs. {{ Number(
              reservaSeleccionada.precio_aplicable ??
              reservaSeleccionada.servicio?.precio ??
              0
            ).toFixed(2) }}
          </strong>
        </div>

        <div class="sheet-finanzas-fila pagado">
          <span>Adelanto / pagado</span>
          <strong>
            Bs. {{ Number(
              reservaSeleccionada.monto_pagado ?? 0
            ).toFixed(2) }}
          </strong>
        </div>

        <div class="sheet-finanzas-saldo">
          <span>Saldo pendiente</span>
          <strong>
            Bs. {{ Number(
              reservaSeleccionada.saldo ??
              (
                Number(reservaSeleccionada.precio_aplicable ??
                  reservaSeleccionada.servicio?.precio ?? 0) -
                Number(reservaSeleccionada.monto_pagado ?? 0)
              )
            ).toFixed(2) }}
          </strong>
        </div>
      </div>

      <!-- =================================================
           FECHA Y HORA
           ================================================= -->
      <div class="sheet-fecha-hora">

        <div class="sheet-fecha">
          <v-icon color="primary" size="23">mdi-calendar-outline</v-icon>
          <span>
            {{ formatearFechaLarga(reservaSeleccionada?.fecha) }}
          </span>
        </div>

        <div class="sheet-hora">
          <v-icon color="primary" size="23">mdi-clock-outline</v-icon>
          <strong>
            {{ reservaSeleccionada?.hora_inicio?.slice(0, 5) }}
            -
            {{ reservaSeleccionada?.hora_fin?.slice(0, 5) }}
          </strong>
        </div>

        <!-- =================================================
             ESTADO ACTUAL
             ================================================= -->
        <!-- <div class="sheet-estado-actual">
          Estado actual:
          <strong>
            {{ reservaSeleccionada?.estado }}
          </strong>
        </div> -->

      </div>

    </div>

    <!-- =================================================
         CAMBIAR ESTADO
         ================================================= -->
    <div class="sheet-cambiar-estado">

      <div class="sheet-cambiar-estado-titulo">
        Cambiar estado de la reserva
      </div>

      <div class="sheet-cambiar-estado-descripcion">
        Selecciona el nuevo estado para esta reserva
      </div>

    </div>

    <!-- =================================================
         OPCIONES
         ================================================= -->
    <div class="estado-opciones">

      <!-- =================================================
           ATENDIDO
           ================================================= -->
      <button type="button" class="estado-opcion estado-opcion-atendido" @click="seleccionarEstadoReserva('COMPLETADA')">
        <span class="estado-opcion-icono">
          <v-icon size="27">mdi-check-circle</v-icon>
        </span>

        <span class="estado-opcion-texto">
          <strong>Atendido</strong>
          <small>El servicio fue realizado correctamente</small>
        </span>

        <!-- <v-icon size="23">mdi-chevron-right</v-icon> -->
      </button>

      <!-- =================================================
           VER RESERVA
           ================================================= -->
      <button type="button" class="estado-opcion estado-opcion-ver-reserva" @click="verReservaSeleccionada">
        <span class="estado-opcion-icono">
          <v-icon size="22">mdi-eye-outline</v-icon>
        </span>

        <span class="estado-opcion-texto">
          <strong>Ver reserva</strong>
          <small>Consultar el detalle completo de la reserva</small>
        </span>

        <!-- <v-icon size="23">mdi-chevron-right</v-icon> -->
      </button>

      <!-- =================================================
           CANCELADA + NO ASISTIÓ
           ================================================= -->
      <div class="estado-opciones-fila">

        <!-- CANCELADA -->
        <button type="button" class="estado-opcion estado-opcion-cancelada" @click="seleccionarEstadoReserva('CANCELADA')">
          <span class="estado-opcion-icono">
            <v-icon size="22">mdi-cancel</v-icon>
          </span>

          <span class="estado-opcion-texto">
            <strong>Cancelada</strong>
          </span>

          <!-- <v-icon size="23">mdi-chevron-right</v-icon> -->
        </button>

        <!-- NO ASISTIÓ -->
        <button type="button" class="estado-opcion estado-opcion-no-asistio" @click="seleccionarEstadoReserva('NO_ASISTIO')">
          <span class="estado-opcion-icono">
            <v-icon size="22">mdi-calendar-remove</v-icon>
          </span>

          <span class="estado-opcion-texto">
            <strong>No asistió</strong>
          </span>

          <!-- <v-icon size="23">mdi-chevron-right</v-icon> -->
        </button>

      </div>

    </div>

  </v-card>
</v-bottom-sheet>

<!-- SHEET: CREAR BLOQUEO -->
<v-bottom-sheet v-model="sheetBloqueo" inset>
  <v-card class="estado-reserva-sheet">
    <div class="sheet-handle"></div>

    <div class="sheet-header">
      <div>
        <div class="sheet-titulo">Bloquear horario</div>
        <div class="sheet-subtitulo">
          {{ fechaFormateada }}
        </div>
      </div>

      <button type="button" class="sheet-cerrar" @click="sheetBloqueo = false">
        <v-icon size="20">mdi-close</v-icon>
      </button>
    </div>

    <div v-if="bloqueoSeleccionado" class="sheet-fecha-hora">
      <div class="sheet-hora">
        <v-icon size="23">mdi-clock-outline</v-icon>
        <strong>
          {{ bloqueoSeleccionado.horaInicio }} -
          {{ bloqueoSeleccionado.horaFin }}
        </strong>
      </div>
    </div>

    <v-textarea v-model="formBloqueo.motivo" label="Motivo del bloqueo (opcional)" placeholder="Ej. Asunto personal" variant="outlined" rows="2" auto-grow maxlength="255" class="mt-4" />

    <v-btn block color="primary" size="large" :loading="procesandoBloqueo" :disabled="procesandoBloqueo" @click="dialogBloqueo = true">
      Bloquear horario
    </v-btn>
  </v-card>
</v-bottom-sheet>

<!-- CONFIRMACIÓN DEL BLOQUEO -->
<v-dialog v-model="dialogBloqueo" max-width="420" width="calc(100% - 32px)" persistent>
  <v-card class="pia-confirm-dialog" rounded="xl">
    <v-card-text class="pa-6">
      <div class="d-flex justify-center mb-4">
        <div class="pia-confirm-icon">
          <v-icon size="30" color="#087F8C">
            mdi-calendar-lock
          </v-icon>
        </div>
      </div>

      <div class="text-center">
        <h2 class="pia-confirm-title">
          Confirmar bloqueo
        </h2>

        <p class="pia-confirm-description">
          ¿Deseas dejar este horario como no disponible?
        </p>
      </div>

      <div class="pia-confirm-schedule mt-5">
        <div class="d-flex align-center ga-3">
          <v-icon color="#087F8C" size="23">
            mdi-clock-outline
          </v-icon>

          <div>
            <div class="pia-confirm-label">
              HORARIO SELECCIONADO
            </div>

            <div class="pia-confirm-time">
              {{ bloqueoSeleccionado?.horaInicio }} –
              {{ bloqueoSeleccionado?.horaFin }}
            </div>
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="d-flex align-center ga-3">
          <v-icon color="#087F8C" size="23">
            mdi-calendar-month-outline
          </v-icon>

          <div>
            <div class="pia-confirm-label">
              FECHA
            </div>

            <div class="pia-confirm-date">
              {{ fechaSeleccionada }}
            </div>
          </div>
        </div>
      </div>

      <div class="pia-confirm-notice mt-4">
        <v-icon size="19" color="#B7791F">
          mdi-information-outline
        </v-icon>

        <span>
          Este horario no estará disponible para reservas
          en la fecha seleccionada.
        </span>
      </div>
    </v-card-text>

    <v-card-actions class="pia-confirm-actions">
      <v-btn variant="outlined" color="grey-darken-1" rounded="lg" class="pia-confirm-cancel" :disabled="procesandoBloqueo" @click="dialogBloqueo = false">
        Volver
      </v-btn>

      <v-btn color="#087F8C" variant="flat" rounded="lg" class="pia-confirm-submit" :loading="procesandoBloqueo" :disabled="procesandoBloqueo" @click="confirmarBloqueo">
        <v-icon start>mdi-lock</v-icon>
        Sí, bloquear
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- SHEET: CANCELAR BLOQUEO -->
<v-bottom-sheet v-model="sheetDesbloqueo" inset>
  <v-card class="estado-reserva-sheet">
    <div class="sheet-handle"></div>

    <div class="sheet-header">
      <div>
        <div class="sheet-titulo">Horario bloqueado</div>
        <div class="sheet-subtitulo">
          {{ fechaFormateada }}
        </div>
      </div>

      <button type="button" class="sheet-cerrar" @click="sheetDesbloqueo = false">
        <v-icon size="20">mdi-close</v-icon>
      </button>
    </div>

    <div v-if="bloqueoSeleccionado" class="sheet-fecha-hora">
      <div class="sheet-hora">
        <v-icon size="23">mdi-clock-outline</v-icon>
        <strong>
          {{ bloqueoSeleccionado.horaInicio }} -
          {{ bloqueoSeleccionado.horaFin }}
        </strong>
      </div>

      <p class="mt-4">
        <strong>Motivo:</strong>
        {{ bloqueoSeleccionado.motivo || "Sin motivo especificado" }}
      </p>
    </div>

    <v-btn block color="error" size="large" :loading="procesandoBloqueo" :disabled="procesandoBloqueo" @click="confirmarDesbloqueo">
      <v-icon start>mdi-lock-open-outline</v-icon>
      Desbloquear horario
    </v-btn>
  </v-card>
</v-bottom-sheet>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>
</template>

<script>
import {
  getFileUrl
} from "@/utils/ayuda";
import {
  getAgenda
} from "../services/agenda.api";
import {
  cambiarEstadoReserva
} from "../../reservas/services/reserva.api";
import {
  crearBloqueo,
  cancelarBloqueo,
  getBloqueos
} from "../services/bloqueo.api";

import dayjs from "dayjs";
import "dayjs/locale/es";

export default {
  name: "AgendaAdminPage",

  data() {
    const hoy = new Date();

    return {
      fechaSeleccionada: this.formatearFecha(hoy),
      fechaVista: new Date(hoy),
      cargando: false,
      agenda: null,
      sheetEstadoReserva: false,
      reservaSeleccionada: null,
      // 30 minutos = 50px. Esta es la unidad visual de la agenda.
      altoPorMediaHora: 50,

      // Sheet para administrar bloqueos
      sheetBloqueo: false,
      // Diálogo de confirmación
      dialogBloqueo: false,
      // Horario seleccionado
      bloqueoSeleccionado: null,
      // Datos del formulario
      formBloqueo: {
        motivo: "",
      },
      // Estado de la operación
      procesandoBloqueo: false,
      sheetDesbloqueo: false,
      bloqueos: [],

      overlay: false,
    };
  },

  computed: {
    diasSemana() {
      const fecha = new Date(this.fechaVista);
      const dia = fecha.getDay();
      const diferencia = dia === 0?-6 : 1 - dia;

      fecha.setDate(fecha.getDate() + diferencia);

      return Array.from({
        length: 7
      }, (_, i) => {
        const actual = new Date(fecha);
        actual.setDate(fecha.getDate() + i);

        const fechaString = this.formatearFecha(actual);

        return {
          fecha: fechaString,
          nombre: this.nombreDiaCorto(actual),
          numero: actual.getDate(),
          indicador: fechaString !== this.fechaSeleccionada,
        };
      });
    },

    mesAnio() {
      return new Intl.DateTimeFormat("es-BO", {
          month: "long",
          year: "numeric",
        })
        .format(this.fechaVista)
        .replace(/^./, (letra) => letra.toUpperCase());
    },

    fechaFormateada() {
      const fecha = this.fechaDesdeString(this.fechaSeleccionada);

      return new Intl.DateTimeFormat("es-BO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .format(fecha)
        .replace(/^./, (letra) => letra.toUpperCase());
    },

    textoBotonHoy() {
      const hoy = this.formatearFecha(new Date());
      return this.fechaSeleccionada === hoy?"Hoy" : "Ir a hoy";
    },

    profesionalActual() {
      return this.agenda?.profesionales?. [0] || null;
    },

    horariosActuales() {
      return this.profesionalActual?.horarios || [];
    },

    slotsActuales() {
      return this.horariosActuales
        .flatMap((horario) => horario.slots || [])
        .sort(
          (a, b) =>
          this.horaAMinutos(a.hora_inicio) -
          this.horaAMinutos(b.hora_inicio)
        );
    },

    horaMinima() {
      const horarios = this.horariosActuales;
      if (!horarios.length) return "08:00";

      const inicio = Math.min(
        ...horarios.map((horario) => this.horaAMinutos(horario.hora_inicio))
      );

      return this.minutosAHora(inicio);
    },

    horaMaxima() {
      const horarios = this.horariosActuales;
      if (!horarios.length) return "19:00";

      const fin = Math.max(
        ...horarios.map((horario) => this.horaAMinutos(horario.hora_fin))
      );

      return this.minutosAHora(fin);
    },

    horasVisibles() {
      const horas = [];
      const porInicio = new Map();

      for (const slot of this.slotsActuales) {
        const hora = String(slot.hora_inicio || "").slice(0, 5);
        if (hora && !porInicio.has(hora)) porInicio.set(hora, slot);
      }

      let offset = 0;
      for (const [hora, slot] of porInicio) {
        horas.push({
          key: hora,
          valor: hora,
          top: offset
        });
        offset += ((Number(slot.duracion) || 0) / 30) * this.altoPorMediaHora;
      }

      return horas;
    },

    alturaAgenda() {
      const porInicio = new Map();
      for (const slot of this.slotsActuales) {
        const hora = String(slot.hora_inicio || "").slice(0, 5);
        if (hora && !porInicio.has(hora)) porInicio.set(hora, slot);
      }
      return Array.from(porInicio.values()).reduce((total, slot) => {
        return total + ((Number(slot.duracion) || 0) / 30) * this.altoPorMediaHora;
      }, 0);
    },

    bloquesAgenda() {
      const resultado = [];
      const slots = this.slotsActuales;

      if (!slots.length) return resultado;

      const reservasMap = new Map();

      this.horariosActuales.forEach((horario) => {
        (horario.reservas || []).forEach((reserva) => {
          reservasMap.set(reserva.id, reserva);
        });
      });

      // Solo consideramos bloqueos activos de la fecha consultada.
      const bloqueosActivos = (this.bloqueos || []).filter(
        (bloqueo) =>
        String(bloqueo.estado || "ACTIVO").toUpperCase() === "ACTIVO"
      );

      const buscarBloqueoDelSlot = (slot) => {
        const inicioSlot = this.horaAMinutos(slot.hora_inicio);
        const finSlot = this.horaAMinutos(slot.hora_fin);

        return bloqueosActivos.find((bloqueo) => {
          const inicioBloqueo = this.horaAMinutos(
            bloqueo.hora_inicio?? bloqueo.horaInicio
          );
          const finBloqueo = this.horaAMinutos(
            bloqueo.hora_fin?? bloqueo.horaFin
          );

          // El bloqueo puede abarcar uno o varios slots.
          return inicioBloqueo < finSlot && finBloqueo > inicioSlot;
        });
      };

      let i = 0;

      while (i < slots.length) {
        const slot = slots[i];
        const reserva = this.reservaDeSlot(slot.id, reservasMap);

        // La reserva tiene prioridad para no alterar su representación actual.
        if (reserva) {
          const existe = resultado.some(
            (bloque) =>
            bloque.tipo === "RESERVA" &&
            bloque.reserva?.id === reserva.id
          );

          if (!existe) {
            resultado.push({
              key: `reserva-${reserva.id}`,
              tipo: "RESERVA",
              estado: reserva.estado,
              horaInicio: reserva.hora_inicio?.slice(0, 5),
              horaFin: reserva.hora_fin?.slice(0, 5),
              duracion: (reserva.slots || []).reduce(
                (total, slotReserva) =>
                total + (Number(slotReserva.duracion) || 0),
                0
              ),
              reserva,
            });
          }

          i++;
          continue;
        }

        const bloqueo = buscarBloqueoDelSlot(slot);

        if (bloqueo || slot.estado !== "DISPONIBLE") {
          resultado.push({
            key: `bloqueado-${slot.id}`,
            tipo: "BLOQUEADO",
            id: slot.id,
            bloqueoId: bloqueo?.id?? null,
            motivo: bloqueo?.motivo || "",
            estado: bloqueo?"BLOQUEADO" : slot.estado,
            horaInicio: slot.hora_inicio?.slice(0, 5),
            horaFin: slot.hora_fin?.slice(0, 5),
            duracion: Number(slot.duracion) || 0,
            titulo: bloqueo ?
              "Horario bloqueado" : slot.estado === "BLOQUEADO" ?
              "Bloqueado" : "No disponible",
          });

          i++;
          continue;
        }

        resultado.push({
          key: `disponible-${slot.id}`,
          tipo: "DISPONIBLE",
          id: slot.id,
          horaInicio: slot.hora_inicio?.slice(0, 5),
          horaFin: slot.hora_fin?.slice(0, 5),
          duracion: Number(slot.duracion) || 0,
        });

        i++;
      }

      return resultado;
    },
  },

  watch: {
    fechaSeleccionada() {
      this.cargarAgenda();
    },

    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  mounted() {
    this.cargarAgenda();
  },

  methods: {
    getFileUrl,

    async cargarAgenda() {
      this.cargando = true;

      try {
        const [respuestaAgenda, respuestaBloqueos] = await Promise.all([
          getAgenda(this.fechaSeleccionada),
          getBloqueos(this.fechaSeleccionada),
        ]);

        this.agenda = respuestaAgenda.data?.data || null;

        this.bloqueos = respuestaBloqueos.data?.data || [];
      } catch (error) {
        console.error("Error cargando agenda:", error);
        this.agenda = null;
        this.bloqueos = [];

        this.$piaAlert?.error(
          error.response?.data?.message ||
          "No fue posible cargar la agenda y sus bloqueos.", {
            title: "Error al cargar la agenda"
          }
        );
      } finally {
        this.cargando = false;
      }
    },

    seleccionarFecha(fecha) {
      this.fechaSeleccionada = fecha;
      this.fechaVista = this.fechaDesdeString(fecha);
    },

    cambiarSemana(direccion) {
      const fecha = new Date(this.fechaVista);
      fecha.setDate(fecha.getDate() + direccion * 7);
      this.fechaVista = fecha;

      const diaSemana = fecha.getDay();
      const diferencia = diaSemana === 0?-6 : 1 - diaSemana;
      const lunes = new Date(fecha);
      lunes.setDate(fecha.getDate() + diferencia);

      this.seleccionarFecha(this.formatearFecha(lunes));
    },

    irAHoy() {
      const hoy = new Date();
      this.fechaVista = hoy;
      this.fechaSeleccionada = this.formatearFecha(hoy);
    },

    // Calcula la posición compacta según los intervalos visuales reales.
    // Cada hora de inicio se representa una sola vez para evitar huecos
    // producidos por slots internos/duplicados de la misma franja.
    offsetVisualSlot(slot) {
      const objetivo = String(slot.hora_inicio || "").slice(0, 5);
      const porInicio = new Map();

      for (const actual of this.slotsActuales) {
        const inicio = String(actual.hora_inicio || "").slice(0, 5);
        if (!inicio || porInicio.has(inicio)) continue;
        porInicio.set(inicio, actual);
      }

      let offset = 0;
      for (const [inicio, actual] of porInicio) {
        if (inicio === objetivo) return offset;
        offset += ((Number(actual.duracion) || 0) / 30) * this.altoPorMediaHora;
      }

      return offset;
    },

    estiloLinea(slot) {
      const alto = ((Number(slot.duracion) || 0) / 30) * this.altoPorMediaHora;

      return {
        top: `${this.offsetVisualSlot(slot)}px`,
        height: `${alto}px`,
      };
    },

    estiloBloque(bloque) {
      const inicio = String(bloque.horaInicio || "").slice(0, 5);
      const slotInicio = this.slotsActuales.find(
        (slot) => String(slot.hora_inicio || "").slice(0, 5) === inicio
      );
      const offset = slotInicio?this.offsetVisualSlot(slotInicio) : 0;
      const altura = ((Number(bloque.duracion) || 0) / 30) * this.altoPorMediaHora;

      return {
        top: `${offset}px`,
        height: `${altura}px`,
      };
    },

    reservaDeSlot(slotId, reservasMap) {
      for (const reserva of reservasMap.values()) {
        if (
          (reserva.slots || []).some(
            (slot) => Number(slot.id) === Number(slotId)
          )
        ) {
          return reserva;
        }
      }

      return null;
    },

    abrirReserva(reserva) {
      if (!reserva?.id) return;

      this.reservaSeleccionada = reserva;
      this.sheetEstadoReserva = true;
    },

    abrirSheetBloqueo(bloque) {
      if (!bloque || bloque.tipo !== "DISPONIBLE") {
        return;
      }

      this.bloqueoSeleccionado = {
        id: bloque.id,
        horaInicio: bloque.horaInicio,
        horaFin: bloque.horaFin,
        motivo: "",
      };

      this.formBloqueo.motivo = "";
      this.sheetBloqueo = true;
    },

    abrirSheetDesbloqueo(bloque) {
      if (!bloque || bloque.tipo !== "BLOQUEADO" || !bloque.bloqueoId) {
        return;
      }

      this.bloqueoSeleccionado = {
        id: bloque.id,
        bloqueoId: bloque.bloqueoId,
        horaInicio: bloque.horaInicio,
        horaFin: bloque.horaFin,
        motivo: bloque.motivo || "",
      };

      this.sheetDesbloqueo = true;
    },

    // =====================================================
    // VER RESERVA
    // =====================================================

    verReservaSeleccionada() {
      if (!this.reservaSeleccionada?.id) return;

      this.sheetEstadoReserva = false;

      this.$router.push({
        path: `/admin/reservas/detalle/${this.reservaSeleccionada.id}`,
      });
    },

    async seleccionarEstadoReserva(estado) {
      try {
        this.overlay = true;

        if (!this.reservaSeleccionada?.id) {
          this.$piaAlert.warning(
            "Debe seleccionar la reserva correctamente!", {
              title: "Error al Seleccionar Reserva!",
            }
          );
          return;
        }

        const res = await cambiarEstadoReserva(
          this.reservaSeleccionada.id, {
            estado
          }
        );

        if (res.status === 201 || res.status === 200) {
          this.sheetEstadoReserva = false;

          // Mensaje según el estado seleccionado
          const mensajes = {
            PENDIENTE: {
              titulo: "Reserva Pendiente",
              mensaje: "La reserva se ha marcado como pendiente.",
            },
            CONFIRMADA: {
              titulo: "Reserva Confirmada",
              mensaje: "La reserva se ha confirmado correctamente.",
            },
            COMPLETADA: {
              titulo: "Servicio Atendido",
              mensaje: "El servicio se ha atendido correctamente.",
            },
            CANCELADA: {
              titulo: "Reserva Cancelada",
              mensaje: "La reserva se ha cancelado correctamente.",
            },
            NO_ASISTIO: {
              titulo: "Cliente No Asistió",
              mensaje: "La reserva se ha marcado como no asistida.",
            },
          };

          const resultado = mensajes[estado] || {
            titulo: "Estado Actualizado",
            mensaje: "El estado de la reserva se ha actualizado correctamente.",
          };

          this.$piaAlert.success(resultado.mensaje, {
            title: resultado.titulo,
          });

          await this.cargarAgenda();
        }
      } catch (error) {
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado", {
            title: "Error al Cambiar Estado de la Reserva",
          }
        );
      } finally {
        this.overlay = false;
      }
    },

    async confirmarBloqueo() {
      if (!this.bloqueoSeleccionado || this.procesandoBloqueo) {
        return;
      }

      try {
        this.procesandoBloqueo = true;

        const respuesta = await crearBloqueo({
          fecha: this.fechaSeleccionada,
          hora_inicio: this.bloqueoSeleccionado.horaInicio,
          hora_fin: this.bloqueoSeleccionado.horaFin,
          motivo: this.formBloqueo.motivo?.trim() || null,
        });

        if (respuesta.status === 200 || respuesta.status === 201) {
          this.dialogBloqueo = false;
          this.sheetBloqueo = false;

          this.$piaAlert.success(
            "El horario se bloqueó correctamente.", {
              title: "Horario bloqueado"
            }
          );

          await this.cargarAgenda();
        }
      } catch (error) {
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "No fue posible bloquear el horario.", {
            title: "Error al bloquear"
          }
        );
      } finally {
        this.procesandoBloqueo = false;
      }
    },
    async confirmarDesbloqueo() {
      const bloqueoId = this.bloqueoSeleccionado?.bloqueoId;

      if (!bloqueoId || this.procesandoBloqueo) {
        return;
      }

      try {
        this.procesandoBloqueo = true;

        const respuesta = await cancelarBloqueo(bloqueoId);

        if (respuesta.status === 200) {
          this.sheetDesbloqueo = false;

          this.$piaAlert.success(
            "El horario se desbloqueó correctamente.", {
              title: "Horario desbloqueado"
            }
          );

          await this.cargarAgenda();
        }
      } catch (error) {
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "No fue posible desbloquear el horario.", {
            title: "Error al desbloquear"
          }
        );
      } finally {
        this.procesandoBloqueo = false;
      }
    },

    formatearFechaLarga(fecha) {
      if (!fecha) return "";

      const fechaFormateada = dayjs(fecha);

      if (!fechaFormateada.isValid()) return "Fecha inválida";

      return fechaFormateada
        .locale("es")
        .format("dddd D [de] MMMM [de] YYYY")
        .replace(/^./, (letra) => letra.toUpperCase());
    },

    crearReserva(bloque = null) {
      console.log("Crear reserva desde agenda:", bloque);
    },

    nombreDiaCorto(fecha) {
      return new Intl.DateTimeFormat("es-BO", {
          weekday: "short",
        })
        .format(fecha)
        .replace(".", "")
        .slice(0, 3)
        .replace(/^./, (letra) => letra.toUpperCase());
    },

    iniciales(nombre) {
      if (!nombre) return "CL";

      const partes = nombre.trim().split(/\s+/).filter(Boolean);

      if (partes.length === 1) {
        return partes[0].slice(0, 2).toUpperCase();
      }

      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    },

    colorAvatar(reserva) {
      if (reserva?.estado === "PENDIENTE") return "amarillo";
      if (reserva?.estado === "COMPLETADA") return "morado";
      if (reserva?.estado === "NO_ASISTIO") return "rojo";
      return "turquesa";
    },

    formatearDuracion(minutos) {
      if (!minutos) return "";

      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;

      if (horas && minutosRestantes) {
        return `${horas} h ${minutosRestantes} min`;
      }
      if (horas) return horas === 1?"1 hora" : `${horas} horas`;

      return `${minutosRestantes} min`;
    },

    horaAMinutos(hora) {
      if (!hora) return 0;

      const [horas, minutos] = String(hora)
        .slice(0, 5)
        .split(":")
        .map(Number);

      return horas * 60 + minutos;
    },

    minutosAHora(minutos) {
      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;

      return `${String(horas).padStart(2, "0")}:${String(
        minutosRestantes
      ).padStart(2, "0")}`;
    },

    formatearFecha(fecha) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    fechaDesdeString(fecha) {
      const [year, month, day] = fecha.split("-").map(Number);
      return new Date(year, month - 1, day);
    },
  },
};
</script>

<style lang="scss" scoped>
.agenda-page {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 4px 0 90px;
  color: #102a43;
}

.agenda-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 2px 8px 14px;
}

.agenda-heading-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #123f63;
}

.agenda-heading h1 {
  margin: 0;
  color: #123f63;
  font-size: 28px;
  line-height: 1.05;
  font-weight: 700;
}

.agenda-heading p {
  margin: 5px 0 0;
  color: #627d98;
  font-size: 16px;
  line-height: 1.1;
}

.calendario-card {
  border: 1px solid #e8edf2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(16, 42, 67, 0.04);
  overflow: hidden;
}

.mes-header {
  height: 51px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.btn-mes {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #123f63;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-mes:hover {
  background: #eaf7f6;
}

.mes-titulo {
  color: #123f63;
  font-size: 22px;
  font-weight: 800;
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  padding: 0 7px 10px;
}

.dia-semana {
  min-width: 0;
  min-height: 67px;
  border: 0;
  background: transparent;
  border-radius: 12px;
  color: #526d8b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.dia-nombre {
  font-size: 14px;
  line-height: 1;
  margin-bottom: 7px;
}

.dia-numero {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
}

.dia-semana.seleccionado .dia-nombre {
  color: #0f8f8c;
}

.dia-semana.seleccionado .dia-numero {
  background: #0f9b9d;
  color: white;
  box-shadow: 0 4px 10px rgba(15, 155, 157, 0.18);
}

.dia-indicador {
  position: absolute;
  bottom: 1px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d6dde5;
}

.fecha-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 1px 10px;
}

.fecha-heading h4 {
  margin: 0;
  color: #123f63;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 800;
}

.btn-hoy {
  min-width: 76px;
  height: 43px;
  border: 0;
  border-radius: 11px;
  background: #e5f6f4;
  color: #0f8f8c;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.estado-carga {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #627d98;
}

.timeline {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  width: 100%;
}

.horas-columna {
  position: relative;
}

.hora {
  position: absolute;
  left: 0;
  right: 0;
  height: 50px;
  padding-right: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  color: #627d98;
  font-size: 14px;
  line-height: 1;
  padding-top: 4px;
  box-sizing: border-box;
}

.agenda-columna {
  min-width: 0;
}

.grid-horario {
  position: relative;
  width: 100%;
  border-left: 1px solid #e7edf2;
}

.linea-hora {
  position: absolute;
  left: 0;
  right: 0;
  border-bottom: 1px solid #edf1f4;
  box-sizing: border-box;
  pointer-events: none;
}

.bloque {
  position: absolute;
  left: 0;
  right: 0;
  width: calc(100% - 3px);
  border-radius: 11px;
  box-sizing: border-box;
  overflow: hidden;
}

.bloque.disponible {
  border: 1px dashed #b8c8d8;
  background: #fbfcfd;
  color: #244d70;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  text-align: left;
}

.bloque.disponible:hover {
  background: #f0f8f8;
}

.disponible-circulo {
  width: 25px;
  height: 25px;
  border: 1.5px dashed #91a8bc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.disponible-texto {
  margin-left: 17px;
  font-size: 15px;
}

.disponible-plus {
  margin-left: auto;
  color: #123f63;
}

.bloque.reserva {
  border: 0;
  display: block;
  padding: 3px 22px 3px 9px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
}

/* Separador visual entre reservas consecutivas */
.bloque.reserva::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 0;
  border-bottom: 1px dashed rgba(18, 63, 99, 0.28);
  pointer-events: none;
}

.bloque.reserva::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
}

.reserva-confirmada {
  background: #e9f9f7;
}

.reserva-confirmada::before {
  background: #0faaa1;
}

.reserva-pendiente {
  background: #fff7e3;
}

.reserva-pendiente::before {
  background: #f3ad00;
}

.reserva-completada {
  background: #f1eaff;
}

.reserva-completada::before {
  background: #8639ed;
}

.reserva-no_asistio {
  background: #ffe9ed;
}

.reserva-no_asistio::before {
  background: #ed3158;
}

.reserva-contenido {
  width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*
 * En reservas de 60 minutos o más aprovechamos la altura adicional
 * sin cambiar la alineación horizontal de ninguna fila.
 * Las reservas de 30 minutos conservan exactamente su distribución actual.
 */
.reserva-alta .reserva-contenido {
  justify-content: center;
  gap: 8px;
}

.reserva-fila-principal {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
}

.cliente-avatar {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 9px;
  font-weight: 800;
}

.avatar-turquesa {
  background: #0faaa1;
}

.avatar-amarillo {
  background: #eeb33c;
}

.avatar-morado {
  background: #9849e9;
}

.avatar-rojo {
  background: #ef3158;
}

.reserva-servicio {
  min-width: 0;
  color: #123f63;
  font-size: 13px;
  line-height: 1.1;
  font-weight: 800;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reserva-duracion {
  color: #5d7892;
  font-weight: 700;
}

.reserva-cliente {
  min-width: 0;
  margin-left: 29px;
  margin-top: -5px;
  color: #244d70;
  font-size: 12px;
  line-height: 1.05;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reserva-fila-final {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-left: 29px;
}

.reserva-hora {
  min-width: 0;
  color: #2e6388;
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
}

.estado-badge {
  min-width: 0;
  padding: 2px 5px;
  border-radius: 999px;
  text-align: center;
  font-size: 9px;
  line-height: 1.1;
  font-weight: 800;
  white-space: nowrap;
}

.reserva-confirmada .estado-badge {
  background: #c8f5ed;
  color: #0b9b91;
}

.reserva-pendiente .estado-badge {
  background: #ffe9b7;
  color: #e29a00;
}

.reserva-completada .estado-badge {
  background: #e7d5ff;
  color: #8737e8;
}

.reserva-no_asistio .estado-badge {
  background: #ffd2da;
  color: #db274d;
}

.reserva-arrow {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  color: #123f63;
}

.bloque-desbloqueable {
  cursor: pointer;
}

.bloque-desbloqueable:hover {
  filter: brightness(0.97);
}

.bloque.no-disponible {
  background: #ffe8ed;
  color: #d9254c;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.bloque-icono {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffc4d0;
  flex-shrink: 0;
}

.bloque-info {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}

.bloque-info strong {
  font-size: 13px;
  line-height: 1.1;
}

.bloque-info span {
  margin-top: 3px;
  font-size: 11px;
}

.bloque-hora {
  margin-left: auto;
  font-size: 13px;
  white-space: nowrap;
}

.bloque-candado {
  margin-left: 9px;
}

.agenda-vacia {
  min-height: 280px;
  border: 1px dashed #d5dfe8;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.agenda-vacia-icono {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #eaf7f6;
  color: #0f8f8c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agenda-vacia-titulo {
  margin-top: 12px;
  color: #123f63;
  font-size: 16px;
  font-weight: 800;
}

.agenda-vacia-texto {
  margin-top: 5px;
  color: #7890a6;
  font-size: 13px;
}

.leyenda {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 15px;
  margin: 8px 3px 0;
  padding: 10px 0 4px;
  border-top: 1px solid #e6edf2;
  color: #526d8b;
  font-size: 11px;
}

.leyenda>div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.leyenda-circulo {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.disponible-dot {
  border: 1px solid #7890a6;
  background: white;
}

/* =====================================================
   SHEET CAMBIO DE ESTADO DE RESERVA
   ===================================================== */

.estado-reserva-sheet {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  padding: 14px 16px 20px;
  border-radius: 24px 24px 0 0 !important;
  background: #ffffff;
  overflow-y: auto;
}

/* =====================================================
   HANDLE
   ===================================================== */

.sheet-handle {
  width: 38px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 999px;
  background: #cbd5df;
}

/* =====================================================
   CABECERA
   ===================================================== */

.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.sheet-titulo {
  color: #123f63;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 800;
}

.sheet-subtitulo {
  margin-top: 5px;
  color: #70859a;
  font-size: 11px;
  line-height: 1.2;
  font-weight: 600;
}

.sheet-cerrar {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: #f1f5f8;
  color: #7890a5;
  cursor: pointer;
}

/* =====================================================
   INFORMACIÓN COMPLETA DE LA RESERVA
   ===================================================== */

.sheet-detalle-reserva {
  width: 100%;
}

/* =====================================================
   CLIENTE
   ===================================================== */

.sheet-cliente {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 4px 0 16px;
  border-bottom: 1px solid #e3eaf0;
}

.sheet-avatar {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
}

.sheet-cliente-datos {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sheet-cliente-datos>strong {
  color: #173e61;
  font-size: 17px;
  line-height: 1.1;
  font-weight: 800;
}

.sheet-dato-contacto {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #526b82;
  font-size: 13px;
  line-height: 1.1;
}

.sheet-dato-contacto .v-icon {
  color: #526b82;
}

/* =====================================================
   SERVICIO
   ===================================================== */

.sheet-servicio {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #e3eaf0;
}

.sheet-servicio-icono {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e7f8f7;
  color: #0ca7a1;
}

.sheet-servicio-datos {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sheet-servicio-datos>strong {
  color: #173e61;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 800;
}

.sheet-servicio-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}

.sheet-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #526b82;
  font-size: 13px;
  line-height: 1;
}

/* =====================================================
   FECHA Y HORA
   ===================================================== */

.sheet-fecha-hora {
  padding: 5px 0;
  border-bottom: 1px solid #e3eaf0;
}

.sheet-fecha,
.sheet-hora {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #405b73;
  font-size: 15px;
  line-height: 1.2;
}

.sheet-fecha {
  margin-bottom: 5px;
  margin-top: 5px;
}

.sheet-fecha .v-icon,
.sheet-hora .v-icon {
  flex: 0 0 auto;
  // color: #526b82;
}

/* =====================================================
   ESTADO ACTUAL
   ===================================================== */

.sheet-estado-actual {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
  padding: 7px 14px;
  border-radius: 999px;
  background: #e5f8f6;
  color: #0b9e99;
  font-size: 13px;
  line-height: 1.1;
  font-weight: 600;
}

.sheet-estado-actual strong {
  font-weight: 800;
}

/* =====================================================
   SECCIÓN CAMBIAR ESTADO
   ===================================================== */

.sheet-cambiar-estado {
  padding: 15px 0 12px;
}

.sheet-cambiar-estado-titulo {
  color: #123451;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 800;
}

.sheet-cambiar-estado-descripcion {
  margin-top: 4px;
  color: #7a8da1;
  font-size: 13px;
  line-height: 1.2;
}

/* =====================================================
   OPCIONES
   ===================================================== */

.estado-opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.estado-opciones-fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* =====================================================
   BOTÓN BASE
   ===================================================== */

.estado-opcion {
  position: relative;
  min-width: 0;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 13px;
  border: 1px solid #d9e2ea;
  border-radius: 15px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.estado-opcion:active {
  transform: scale(0.98);
}

.estado-opcion-icono {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.estado-opcion-texto {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.estado-opcion-texto strong {
  font-size: 14px;
  line-height: 1.1;
  font-weight: 800;
}

.estado-opcion-texto small {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.15;
  font-weight: 600;
}

.estado-opcion>.v-icon:last-child {
  flex: 0 0 auto;
}

/* =====================================================
   ATENDIDO
   ===================================================== */

.estado-opcion-atendido {
  min-height: 70px;
  border-color: #a55bf2;
  background: linear-gradient(135deg, #ad65f5, #8d32ed);
  color: #ffffff;
}

.estado-opcion-atendido .estado-opcion-icono {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.estado-opcion-atendido .estado-opcion-texto strong {
  font-size: 16px;
}

.estado-opcion-atendido .estado-opcion-texto small {
  color: rgba(255, 255, 255, 0.9);
}

.estado-opcion-atendido>.v-icon:last-child {
  color: #ffffff;
}

/* =====================================================
   CANCELADA
   ===================================================== */

.estado-opcion-cancelada {
  border-color: #ff9aa9;
  background: #fff8f9;
  color: #ed3158;
}

.estado-opcion-cancelada .estado-opcion-icono {
  background: #ffe8ed;
  color: #ed3158;
}

.estado-opcion-cancelada>.v-icon:last-child {
  color: #ed3158;
}

/* =====================================================
   NO ASISTIÓ
   ===================================================== */

.estado-opcion-no-asistio {
  border-color: #f2bd50;
  background: #fffaf0;
  color: #c98500;
}

.estado-opcion-no-asistio .estado-opcion-icono {
  background: #fff0c9;
  color: #d89200;
}

.estado-opcion-no-asistio>.v-icon:last-child {
  color: #d89200;
}

/* =====================================================
   VER RESERVA
   ===================================================== */

.estado-opcion-ver-reserva {
  min-height: 58px;
  border-color: #cbd6e0;
  background: #ffffff;
  color: #48627a;
}

.estado-opcion-ver-reserva .estado-opcion-icono {
  background: transparent;
  color: #536d84;
}

.estado-opcion-ver-reserva .estado-opcion-texto strong {
  color: #48627a;
}

.estado-opcion-ver-reserva .estado-opcion-texto small {
  color: #7d90a2;
}

.estado-opcion-ver-reserva>.v-icon:last-child {
  color: #536d84;
}

/* =====================================================
   RESPONSIVE
   ===================================================== */

@media (max-width: 430px) {

  .estado-reserva-sheet {
    padding: 12px 14px 18px;
    border-radius: 22px 22px 0 0 !important;
  }

  .sheet-header {
    margin-bottom: 14px;
  }

  .sheet-titulo {
    font-size: 17px;
  }

  .sheet-avatar,
  .sheet-servicio-icono {
    width: 54px;
    height: 54px;
    flex-basis: 54px;
  }

  .sheet-cliente-datos>strong {
    font-size: 16px;
  }

  .sheet-dato-contacto {
    font-size: 12px;
  }

  .sheet-servicio-datos>strong {
    font-size: 15px;
  }

  .sheet-fecha,
  .sheet-hora {
    font-size: 14px;
  }

  .sheet-cambiar-estado-titulo {
    font-size: 17px;
  }

  .sheet-cambiar-estado-descripcion {
    font-size: 12px;
  }

  .estado-opciones {
    gap: 8px;
  }

  .estado-opciones-fila {
    gap: 8px;
  }

  .estado-opcion {
    padding: 10px 11px;
    border-radius: 14px;
  }

  .estado-opcion-atendido {
    min-height: 64px;
  }

  .estado-opcion-texto strong {
    font-size: 13px;
  }

  .estado-opcion-atendido .estado-opcion-texto strong {
    font-size: 15px;
  }

  .estado-opcion-texto small {
    font-size: 10px;
  }
}

.reservado-dot {
  background: #0faaa1;
}

.pendiente-dot {
  background: #f3ad00;
}

.completada-dot {
  background: #8639ed;
}

.leyenda-icono {
  color: #ed3158;
  display: flex;
}

@media (max-width: 600px) {
  .agenda-page {
    max-width: 100%;
    padding: 0px 0 0px;
  }

  .agenda-heading {
    margin-left: 4px;
    margin-right: 4px;
  }

  .agenda-heading h1 {
    font-size: 23px;
  }

  .agenda-heading p {
    font-size: 12px;
  }

  .mes-titulo {
    font-size: 19px;
  }

  .fecha-heading h2 {
    font-size: 20px;
  }

  .timeline {
    grid-template-columns: 78px minmax(0, 1fr);
  }

  .estado-badge {
    font-size: 8px;
  }
}

@media (max-width: 430px) {
  .timeline {
    grid-template-columns: 45px minmax(0, 1fr);
  }

  .hora {
    font-size: 13px;
    padding-right: 8px;
  }

  .bloque.reserva {
    padding-left: 8px;
    padding-right: 21px;
  }

  .cliente-avatar {
    width: 21px;
    height: 21px;
    flex-basis: 21px;
    font-size: 8px;
  }

  .reserva-servicio {
    font-size: 11px;
  }

  .reserva-cliente {
    margin-left: 28px;
    font-size: 10px;
  }

  .reserva-fila-final {
    margin-left: 28px;
  }

  .reserva-hora {
    font-size: 11px;
  }

  .estado-badge {
    font-size: 8px;
    padding: 2px 4px;
  }

  .bloque.no-disponible {
    padding: 0 8px;
  }

  .bloque-info {
    margin-left: 8px;
  }

  .bloque-info strong {
    font-size: 11px;
  }

  .bloque-info span {
    font-size: 11px;
  }

  .bloque-hora {
    font-size: 11px;
  }

  .leyenda {
    gap: 8px 11px;
    font-size: 10px;
  }
}

.sheet-servicio-icono {
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5f8f6;
  color: #00aaa2;
}

.servicio-imagen {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pia-confirm-dialog {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e7eeee;
  box-shadow: 0 18px 50px rgba(18, 55, 60, 0.16) !important;
}

.pia-confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 22px;
  background: #e5f5f4;
}

.pia-confirm-title {
  color: #173b40;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  line-height: 1.3;
}

.pia-confirm-description {
  margin: 9px 0 0;
  color: #718187;
  font-size: 14px;
  line-height: 1.6;
}

.pia-confirm-schedule {
  padding: 18px;
  border: 1px solid #e4eeee;
  border-radius: 16px;
  background: #f8fbfb;
}

.pia-confirm-label {
  margin-bottom: 5px;
  color: #809195;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.pia-confirm-time {
  color: #087f8c;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.pia-confirm-date {
  color: #29464b;
  font-size: 14px;
  font-weight: 600;
}

.pia-confirm-notice {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 12px;
  border-radius: 12px;
  background: #fff8e8;
  color: #795b25;
  font-size: 12px;
  line-height: 1.5;
}

.pia-confirm-notice .v-icon {
  flex-shrink: 0;
}

.pia-confirm-actions {
  display: flex;
  gap: 10px;
  padding: 0 24px 24px;
}

.pia-confirm-cancel,
.pia-confirm-submit {
  flex: 1;
  height: 46px !important;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.pia-confirm-submit {
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(8, 127, 140, 0.2);
}

@media (max-width: 400px) {
  .pia-confirm-actions {
    padding-right: 18px;
    padding-left: 18px;
  }

  .pia-confirm-time {
    font-size: 19px;
  }
}

.sheet-finanzas {
  padding: 15px 10px;
  border-bottom: 1px solid #e3eaf0;
}

.sheet-finanzas-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  color: #173e61;
  font-size: 15px;
  font-weight: 800;
}

.sheet-finanzas-fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 3px 0;
  color: #62798d;
  font-size: 13px;
}

.sheet-finanzas-fila strong {
  color: #173e61;
  font-weight: 700;
  white-space: nowrap;
}

.sheet-finanzas-fila.descuento,
.sheet-finanzas-fila.descuento strong {
  color: #16845b;
}

.sheet-finanzas-fila.pagado strong {
  color: #16845b;
}

.sheet-finanzas-saldo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding: 13px;
  border: 1px solid #b9e7df;
  border-radius: 12px;
  background: #edfaf7;
  color: #087f72;
  font-size: 14px;
  font-weight: 700;
}

.sheet-finanzas-saldo strong {
  font-size: 17px;
  font-weight: 800;
  white-space: nowrap;
}
</style>
