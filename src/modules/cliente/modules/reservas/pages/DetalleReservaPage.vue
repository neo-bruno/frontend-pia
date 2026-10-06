<template>
<div class="detalle-reserva-page">

  <!-- =====================================================
         ENCABEZADO
  ====================================================== -->
  <section class="page-header">
    <button class="back-button" type="button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Detalle de reserva</h1>
      <p>Información completa de tu reserva</p>
    </div>
  </section>

  <!-- =====================================================
         LOADING
    ====================================================== -->
  <section v-if="loading" class="loading-container">
    <v-progress-circular indeterminate size="32" width="3" />
    <span>Cargando detalle...</span>
  </section>

  <!-- =====================================================
         ERROR
    ====================================================== -->
  <section v-else-if="error" class="error-container">
    <div class="error-icon">
      <v-icon size="25">mdi-alert-circle-outline</v-icon>
    </div>
    <h3>No pudimos cargar la reserva</h3>
    <p>{{ error }}</p>
    <button type="button" class="retry-button" @click="cargarReserva">
      Intentar nuevamente
    </button>
  </section>

  <!-- =====================================================
         DETALLE
    ====================================================== -->
  <section v-else-if="reserva" class="reservation-detail">

    <!-- CABECERA DE LA RESERVA -->
    <article class="reservation-summary" :style="{
          '--business-color': reserva.color1,
          '--business-light': reserva.color2,
          '--business-dark': reserva.color3
        }">
      <div class="summary-top">

        <div class="reservation-date" :class="getDateClass(reserva)">
          <strong>{{ getReservationDay(reserva) }}</strong>
          <span>{{ getReservationMonth(reserva) }}</span>
        </div>

        <div class="summary-info">
          <div class="reservation-time">
            <v-icon size="15">mdi-clock-outline</v-icon>
            <span>
              {{ formatTime(reserva.horaInicio) }}
              <template v-if="reserva.horaFin">
                - {{ formatTime(reserva.horaFin) }}
              </template>
            </span>
          </div>

          <h2>{{ reserva.servicio }}</h2>

          <p v-if="reserva.categoria">
            {{ reserva.categoria }}
          </p>
        </div>

        <div class="reservation-status" :class="getStatusClass(reserva.estado)">
          <v-icon size="13">
            {{ getStatusIcon(reserva.estado) }}
          </v-icon>
          <span>{{ getStatusLabel(reserva.estado) }}</span>
        </div>
      </div>

      <!-- PROFESIONAL -->
      <div class="summary-professional">
        <div class="section-label">Profesional</div>

        <div class="professional-content">
          <div class="professional-photo">
            <img v-if="reserva.profesionalFoto" :src="getMediaUrl(reserva.profesionalFoto)" :alt="reserva.profesional" @error="handleImageError" />
            <v-icon v-else size="28">mdi-account-outline</v-icon>
          </div>

          <div class="professional-info">
            <strong>{{ reserva.profesional }}</strong>
            <span>Barbero profesional</span>
            <span class="rating" v-if="reserva.calificacion">
              <v-icon size="14">mdi-star</v-icon>
              {{ reserva.calificacion }}
              <template v-if="reserva.cantidadCalificaciones">
                ({{ reserva.cantidadCalificaciones }})
              </template>
            </span>
          </div>
        </div>

        <div class="business-image-small">
          <img v-if="reserva.imagen" :src="getMediaUrl(reserva.imagen)" :alt="reserva.negocio" @error="handleImageError" />
          <div v-else>
            <v-icon size="25">mdi-storefront-outline</v-icon>
          </div>
        </div>
      </div>

      <!-- NEGOCIO -->
      <div class="detail-section business-section">
        <div class="section-label">Negocio</div>

        <div class="business-content">
          <div class="business-logo">
            <img v-if="reserva.logo" :src="getMediaUrl(reserva.logo)" :alt="reserva.negocio" @error="handleImageError" />
            <v-icon v-else size="25">mdi-storefront-outline</v-icon>
          </div>

          <div class="business-info">
            <strong>{{ reserva.negocio }}</strong>
            <span>{{ reserva.direccion || "Dirección no disponible" }}</span>
          </div>

          <v-icon class="business-arrow" size="25">
            mdi-chevron-right
          </v-icon>
        </div>
      </div>
    </article>

    <!-- INFORMACIÓN DE LA RESERVA -->
    <section class="detail-section">
      <h3>Información de la reserva</h3>

      <div class="info-row">
        <v-icon size="20">mdi-calendar-outline</v-icon>
        <span>Fecha</span>
        <strong>{{ fechaCompleta }}</strong>
      </div>

      <div class="info-row">
        <v-icon size="20">mdi-clock-outline</v-icon>
        <span>Horario</span>
        <strong>
          {{ formatTime(reserva.horaInicio) }} -
          {{ formatTime(reserva.horaFin) }}
          <template v-if="duracionTexto">
            ({{ duracionTexto }})
          </template>
        </strong>
      </div>

      <div class="info-row">
        <v-icon size="20">mdi-human-handsup</v-icon>
        <span>Slot</span>
        <strong>{{ cantidadSlots }} slot{{ cantidadSlots === 1?'' : 's' }}</strong>
      </div>

      <div class="info-row">
        <v-icon size="20">mdi-check-circle-outline</v-icon>
        <span>Estado</span>
        <strong :class="statusTextClass(reserva.estado)">
          <v-icon size="16">{{ getStatusIcon(reserva.estado) }}</v-icon>
          {{ getStatusLabel(reserva.estado) }}
        </strong>
      </div>
    </section>

    <!-- PRECIOS -->
    <section class="detail-section prices-section">
      <h3>Precios y descuentos</h3>

      <div class="price-row">
        <div class="price-label">
          <v-icon size="20">mdi-tag-outline</v-icon>
          <span>Precio original</span>
        </div>
        <strong>{{ money(reserva.precioOriginal) }}</strong>
      </div>

      <div v-if="reserva.montoPromocion > 0 || reserva.montoDescuento > 0" class="price-row discount-row">
        <div class="price-label">
          <v-icon size="20">mdi-percent-outline</v-icon>
          <span>
            {{ reserva.montoPromocion > 0?'Promoción aplicada' : 'Descuento aplicado' }}
            <small v-if="reserva.promocionNombre">
              {{ reserva.promocionNombre }}
            </small>
          </span>
        </div>
        <strong>
          - {{ money(reserva.montoPromocion > 0?reserva.montoPromocion : reserva.montoDescuento) }}
        </strong>
      </div>

      <div class="price-row total-row">
        <div class="price-label">
          <v-icon size="20">mdi-credit-card-outline</v-icon>
          <strong>Precio aplicable</strong>
        </div>
        <strong>{{ money(reserva.precioAplicable) }}</strong>
      </div>
    </section>

    <!-- PAGOS -->
    <section class="detail-section">
      <h3>Pagos</h3>

      <div class="price-row">
        <div class="price-label">
          <v-icon size="20">mdi-credit-card-outline</v-icon>
          <span>Pagado (adelanto)</span>
        </div>
        <strong>{{ money(reserva.montoPagado) }}</strong>
      </div>

      <div class="price-row">
        <div class="price-label">
          <v-icon size="20">mdi-chart-pie-outline</v-icon>
          <span>Saldo pendiente</span>
        </div>
        <strong class="saldo-pendiente">
          {{ money(reserva.saldo) }}
        </strong>
      </div>
    </section>

    <!-- ACCIONES -->
    <div class="reservation-actions">
      <button v-if="puedeReprogramar" type="button" class="action-button reschedule-button" @click="reprogramar">
        <v-icon size="20">mdi-calendar-edit-outline</v-icon>
        <span>Reprogramar</span>
      </button>

      <button v-if="puedeCancelar" type="button" class="action-button cancel-button" @click="cancelar">
        <v-icon size="20">mdi-trash-can-outline</v-icon>
        <span>Cancelar</span>
      </button>
    </div>
  </section>

  <section v-else class="empty-container">
    <div class="empty-icon">
      <v-icon size="34">mdi-calendar-blank-outline</v-icon>
    </div>
    <h3>Reserva no encontrada</h3>
    <p>No encontramos la información de esta reserva.</p>
  </section>
</div>
</template>

<script>
import {
  getReservationById
} from "../services/reserva.api";

export default {
  name: "DetalleReservaPage",

  data() {
    return {
      loading: false,
      error: null,
      reserva: null,
    };
  },

  computed: {
    fechaCompleta() {
      if (!this.reserva?.fecha) return "--";

      const fecha = String(this.reserva.fecha).substring(0, 10);
      const [year, month, day] = fecha.split("-").map(Number);

      if (!year || !month || !day) return "--";

      const fechaObj = new Date(year, month - 1, day);

      return fechaObj.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },

    cantidadSlots() {
      return Number(this.reserva?.cantidadSlots || 1);
    },

    duracionTexto() {
      if (!this.reserva?.horaInicio || !this.reserva?.horaFin) {
        return "";
      }

      const inicio = this.timeToMinutes(this.reserva.horaInicio);
      const fin = this.timeToMinutes(this.reserva.horaFin);

      if (inicio === null || fin === null) return "";

      let diferencia = fin - inicio;
      if (diferencia < 0) diferencia += 24 * 60;

      const horas = Math.floor(diferencia / 60);
      const minutos = diferencia % 60;

      if (horas && minutos) {
        return `${horas} hora${horas > 1?"s" : ""} ${minutos} min`;
      }

      if (horas) {
        return `${horas} hora${horas > 1?"s" : ""}`;
      }

      return `${minutos} min`;
    },

    puedeCancelar() {
      if (!this.reserva) return false;

      const estado = String(
        this.reserva.estado || ""
      ).toUpperCase();

      return ![
        "CANCELADA",
        "CANCELADO",
        "FINALIZADA",
        "COMPLETADA",
        "NO_ASISTIO",
        "NO ASISTIO",
      ].includes(estado);
    },

    puedeReprogramar() {
      if (!this.reserva) return false;

      const estado = String(
        this.reserva.estado || ""
      ).toUpperCase();

      return ![
        "CANCELADA",
        "CANCELADO",
        "FINALIZADA",
        "COMPLETADA",
        "NO_ASISTIO",
        "NO ASISTIO",
      ].includes(estado);
    },
  },

  mounted() {
    this.cargarReserva();
  },

  methods: {
    async cargarReserva() {
      this.loading = true;
      this.error = null;

      try {
        const id = this.$route.params.id;

        if (!id) {
          throw new Error("No se recibió el ID de la reserva.");
        }

        const response = await getReservationById(id);

        console.log(
          "RESPUESTA DETALLE RESERVA:",
          JSON.stringify(response?.data, null, 2)
        );

        const data =
          response?.data?.data??
          response?.data?.reserva??
          response?.data??
          null;

        if (!data) {
          throw new Error("No se encontró la reserva.");
        }

        this.reserva = this.normalizarReserva(data);
      } catch (error) {
        console.error(
          "ERROR CARGANDO DETALLE:",
          error
        );

        this.error =
          error?.response?.data?.message ||
          error?.message ||
          "No se pudo cargar el detalle de la reserva.";
      } finally {
        this.loading = false;
      }
    },

    normalizarReserva(reserva) {
      const negocio = reserva?.negocio || {};
      const profesional = reserva?.profesional || {};
      const servicio = reserva?.servicio || {};

      const montoPromocion = Number(
        reserva?.monto_promocion??
        reserva?.montoPromocion??
        0
      );

      const montoDescuento = Number(
        reserva?.monto_descuento??
        reserva?.montoDescuento??
        0
      );

      return {
        ...reserva,

        id: reserva?.id ||
          reserva?.reserva_id,

        numero: reserva?.numero ||
          reserva?.numero_reserva,

        fecha: reserva?.fecha ||
          reserva?.fecha_reserva ||
          reserva?.fechaReserva ||
          null,

        horaInicio: reserva?.hora_inicio ||
          reserva?.horaInicio ||
          reserva?.hora ||
          "",

        horaFin: reserva?.hora_fin ||
          reserva?.horaFin ||
          "",

        estado: reserva?.estado ||
          reserva?.estado_reserva ||
          "PENDIENTE",

        servicio: servicio?.nombre ||
          reserva?.servicio_nombre ||
          "Servicio",

        categoria: servicio?.categoria?.nombre ||
          reserva?.categoria_nombre ||
          reserva?.categoria ||
          "",

        profesional: profesional?.nombre ||
          profesional?.nombre_completo ||
          reserva?.profesional_nombre ||
          "Profesional",

        profesionalFoto: profesional?.foto ||
          profesional?.imagen ||
          reserva?.profesional_foto ||
          null,

        calificacion: profesional?.calificacion??
          profesional?.rating??
          reserva?.calificacion??
          null,

        cantidadCalificaciones: profesional?.cantidad_calificaciones??
          profesional?.cantidadCalificaciones??
          reserva?.cantidad_calificaciones??
          null,

        negocio: negocio?.nombre ||
          reserva?.negocio_nombre ||
          "Negocio",

        direccion: negocio?.direccion ||
          reserva?.negocio_direccion ||
          "",

        logo: negocio?.logo ||
          null,

        imagen: negocio?.portada ||
          negocio?.logo ||
          reserva?.negocio_imagen ||
          reserva?.imagen_url ||
          null,

        color1: negocio?.color_1 ||
          negocio?.color1 ||
          "#079DAF",

        color2: negocio?.color_2 ||
          negocio?.color2 ||
          "#E9F8F9",

        color3: negocio?.color_3 ||
          negocio?.color3 ||
          "#102D5A",

        cantidadSlots: Number(
          reserva?.cantidad_slots??
          reserva?.cantidadSlots??
          1
        ),

        precioOriginal: Number(
          reserva?.precio_original??
          reserva?.precioOriginal??
          servicio?.precio??
          0
        ),

        montoPromocion,
        montoDescuento,

        precioAplicable: Number(
          reserva?.precio_aplicable??
          reserva?.precioAplicable??
          0
        ),

        montoPagado: Number(
          reserva?.monto_pagado??
          reserva?.montoPagado??
          0
        ),

        saldo: Number(
          reserva?.saldo??
          0
        ),

        promocionNombre: reserva?.promocion_nombre ||
          reserva?.promocionNombre ||
          null,
      };
    },

    getReservationDay(reserva) {
      if (!reserva?.fecha) return "--";

      const fecha = String(reserva.fecha).substring(0, 10);
      const [, , dia] = fecha.split("-");

      return dia || "--";
    },

    getReservationMonth(reserva) {
      if (!reserva?.fecha) return "--";

      const fecha = String(reserva.fecha).substring(0, 10);
      const [, mes] = fecha.split("-");

      const meses = [
        "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
        "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
      ];

      return meses[Number(mes) - 1] || "--";
    },

    formatTime(hora) {
      if (!hora) return "--:--";
      return String(hora).substring(0, 5);
    },

    timeToMinutes(hora) {
      if (!hora) return null;

      const partes = String(hora)
        .substring(0, 5)
        .split(":")
        .map(Number);

      if (
        partes.length !== 2 ||
        Number.isNaN(partes[0]) ||
        Number.isNaN(partes[1])
      ) {
        return null;
      }

      return partes[0] * 60 + partes[1];
    },

    money(value) {
      const number = Number(value || 0);

      return `Bs ${number.toLocaleString("es-BO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    },

    getStatusLabel(estado) {
      const value = String(
        estado || ""
      ).toUpperCase();

      const labels = {
        CONFIRMADA: "CONFIRMADA",
        PENDIENTE: "PENDIENTE",
        PENDIENTE_PAGO: "PENDIENTE DE PAGO",
        PENDIENTE_CONFIRMACION: "PENDIENTE DE CONFIRMACIÓN",
        PENDIENTE_VALIDACION: "PENDIENTE DE VALIDACIÓN",
        CANCELADA: "CANCELADA",
        CANCELADO: "CANCELADA",
        FINALIZADA: "FINALIZADA",
        COMPLETADA: "COMPLETADA",
        NO_ASISTIO: "NO ASISTIÓ",
        "NO ASISTIO": "NO ASISTIÓ",
      };

      return labels[value] || value;
    },

    getStatusClass(estado) {
      const value = String(
        estado || ""
      ).toUpperCase();

      if (value === "CONFIRMADA") {
        return "status-confirmed";
      }

      if (value.includes("PENDIENTE")) {
        return "status-pending";
      }

      if (value.includes("CANCEL")) {
        return "status-cancelled";
      }

      if (
        value === "NO_ASISTIO" ||
        value === "NO ASISTIO"
      ) {
        return "status-absent";
      }

      return "status-default";
    },

    getStatusIcon(estado) {
      const value = String(
        estado || ""
      ).toUpperCase();

      if (value === "CONFIRMADA") {
        return "mdi-check-circle";
      }

      if (value.includes("PENDIENTE")) {
        return "mdi-clock-outline";
      }

      if (value.includes("CANCEL")) {
        return "mdi-close-circle";
      }

      if (
        value === "NO_ASISTIO" ||
        value === "NO ASISTIO"
      ) {
        return "mdi-account-remove";
      }

      return "mdi-information-outline";
    },

    statusTextClass(estado) {
      return this.getStatusClass(estado);
    },

    getDateClass(reserva) {
      const estado = String(
        reserva?.estado || ""
      ).toUpperCase();

      if (estado.includes("PENDIENTE")) {
        return "date-pending";
      }

      if (estado.includes("CANCEL")) {
        return "date-cancelled";
      }

      return "date-default";
    },

    getMediaUrl(path) {
      if (!path) return "";

      const value = String(path);

      if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:")
      ) {
        return value;
      }

      const serverUrl =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      if (value.startsWith("/")) {
        return `${serverUrl}${value}`;
      }

      return `${serverUrl}/${value}`;
    },

    handleImageError(event) {
      const img = event?.target;
      if (!img) return;

      img.style.display = "none";
    },

    reprogramar() {
      if (!this.reserva?.id) return;

      this.$router.push(
        `/cliente/reservas/${this.reserva.id}/reprogramar`
      );
    },

    cancelar() {
      console.log(
        "Cancelar reserva:",
        this.reserva
      );

      // Aquí conectaremos la API de cancelación
      // cuando implementemos la regla definitiva.
    },

    volver() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.detalle-reserva-page {
  width: 100%;
  max-width: 100%;
  padding: 10px 10px 95px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
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

.loading-container,
.empty-container,
.error-container {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
}

.loading-container {
  color: #68809f;
  font-size: 11px;
}

.error-icon,
.empty-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  background: #fff0f1;
  color: #d84a5b;
}

.empty-icon {
  background: #eaf8f9;
  color: #0799aa;
}

.error-container h3,
.empty-container h3 {
  margin: 0;
  color: #173762;
  font-size: 15px;
}

.error-container p,
.empty-container p {
  margin: 0;
  color: #71829b;
  font-size: 11px;
}

.retry-button {
  height: 34px;
  padding: 0 17px;
  border: none;
  border-radius: 17px;
  background: #079daf;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

/* ==========================================================
   RESUMEN
========================================================== */

.reservation-summary {
  --business-color: #079daf;
  --business-light: #e9f8f9;
  --business-dark: #102d5a;

  position: relative;
  background: #fff;
  border: 1px solid #e7edf3;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 5px 18px rgba(16, 45, 90, 0.07);
}

.summary-top {
  position: relative;
  display: flex;
  gap: 9px;
  padding: 11px;
  min-height: 62px;
}

.reservation-date {
  width: 61px;
  height: 61px;
  min-width: 61px;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.reservation-date strong {
  font-size: 23px;
  line-height: 22px;
  font-weight: 800;
}

.reservation-date span {
  margin-top: 2px;
  font-size: 9px;
  font-weight: 700;
}

.date-default {
  background: var(--business-light);
  color: var(--business-color);
}

.date-pending {
  background: #fff4d9;
  color: #ca7200;
}

.date-cancelled {
  background: #fdebed;
  color: #dc4b5b;
}

.summary-info {
  min-width: 0;
  flex: 1;
  padding-right: 76px;
}

.reservation-time {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--business-dark);
  font-size: 10px;
  font-weight: 700;
}

.reservation-time .v-icon {
  color: var(--business-color);
}

.summary-info h2 {
  margin: 4px 0 1px;
  color: var(--business-dark);
  font-size: 14px;
  line-height: 1.15;
  font-weight: 700;
}

.summary-info p {
  margin: 0;
  color: #6a7e9e;
  font-size: 10px;
}

.reservation-status {
  position: absolute;
  top: 11px;
  right: 11px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  min-height: 22px;
  padding: 3px 7px;
  border-radius: 13px;
  font-size: 8px;
  font-weight: 700;
  white-space: nowrap;
}

.status-confirmed {
  background: #ddf7e9;
  color: #13a260;
}

.status-pending {
  background: #fff2d1;
  color: #d27a00;
}

.status-cancelled {
  background: #fde7eb;
  color: #d74458;
}

.status-absent {
  background: #eceff4;
  color: #5d6b7e;
}

.status-default {
  background: #edf5ff;
  color: #1673d1;
}

/* ==========================================================
   PROFESIONAL
========================================================== */

.summary-professional {
  position: relative;
  padding: 0 11px 10px;
  border-bottom: 1px solid #edf1f5;
}

.section-label {
  color: #102d5a;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 7px;
}

.professional-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 88px;
}

.professional-photo {
  width: 54px;
  height: 54px;
  min-width: 54px;
  border-radius: 50%;
  overflow: hidden;
  background: #edf4f8;
  color: var(--business-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.professional-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.professional-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.professional-info strong {
  color: #193963;
  font-size: 11px;
}

.professional-info span {
  color: #7184a0;
  font-size: 10px;
}

.professional-info .rating {
  color: #d88700;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;
}

.business-image-small {
  position: absolute;
  right: 11px;
  bottom: 10px;
  width: 75px;
  height: 65px;
  overflow: hidden;
  border-radius: 11px;
  background: var(--business-light);
}

.business-image-small img,
.business-image-small>div {
  width: 100%;
  height: 100%;
}

.business-image-small img {
  display: block;
  object-fit: cover;
}

.business-image-small>div {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--business-color);
}

/* ==========================================================
   SECCIONES
========================================================== */

.detail-section {
  background: #fff;
  padding: 9px 11px;
  border-bottom: 1px solid #edf1f5;
}

.detail-section h3 {
  margin: 0 0 7px;
  color: #102d5a;
  font-size: 12px;
  font-weight: 700;
}

.business-section {
  padding-top: 8px;
  padding-bottom: 9px;
}

.business-content {
  display: flex;
  align-items: center;
  gap: 9px;
}

.business-logo {
  width: 54px;
  height: 54px;
  min-width: 54px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--business-light);
  color: var(--business-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.business-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.business-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.business-info strong {
  color: #193963;
  font-size: 12px;
}

.business-info span {
  color: #7184a0;
  font-size: 10px;
}

.business-arrow {
  color: #2f5b88;
}

.info-row,
.price-row {
  display: flex;
  align-items: center;
  min-height: 27px;
  gap: 8px;
}

.info-row>.v-icon,
.price-label>.v-icon {
  color: #41638d;
  min-width: 21px;
}

.info-row>span {
  color: #7184a0;
  font-size: 10px;
  width: 78px;
  min-width: 78px;
}

.info-row>strong {
  color: #31547e;
  font-size: 10px;
  font-weight: 600;
  text-align: right;
  margin-left: auto;
}

.info-row>strong.status-confirmed,
.info-row>strong.status-pending,
.info-row>strong.status-cancelled,
.info-row>strong.status-absent {
  background: transparent;
  padding: 0;
}

.info-row>strong.status-confirmed {
  color: #13a260;
}

.info-row>strong.status-pending {
  color: #d27a00;
}

.info-row>strong.status-cancelled {
  color: #d74458;
}

.info-row>strong.status-absent {
  color: #5d6b7e;
}

.price-label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.price-label span,
.price-label strong {
  color: #58739a;
  font-size: 11px;
  font-weight: 500;
}

.price-row>strong {
  color: #31547e;
  font-size: 12px;
  font-weight: 700;
}

.discount-row .price-label>.v-icon,
.discount-row>strong {
  color: #00a96a;
}

.price-label small {
  display: block;
  color: #7184a0;
  font-size: 9px;
  margin-top: 1px;
}

.total-row {
  margin-top: 3px;
  padding-top: 6px;
  border-top: 1px solid #edf1f5;
}

.total-row .price-label strong,
.total-row>strong {
  color: #102d5a;
  font-weight: 800;
}

.saldo-pendiente {
  color: #f07800 !important;
}

/* ==========================================================
   ACCIONES
========================================================== */

.reservation-actions {
  display: flex;
  gap: 8px;
  padding: 9px;
  background: #fff;
}

.action-button {
  flex: 1;
  height: 39px;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.reschedule-button {
  background: #e8f5ff;
  color: #0877d1;
}

.cancel-button {
  background: #ffe8ed;
  color: #e31c35;
}

@media (min-width: 600px) {
  .detalle-reserva-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
