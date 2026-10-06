<template>
<div class="reserva-notificacion-page">
  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->

  <div class="page-header">
    <button class="back-button" type="button" @click="volver">
      <v-icon size="22">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Detalle de reserva</h1>
      <p>
        Información de tu reserva
      </p>
    </div>
  </div>

  <!-- =====================================================
         LOADING
    ====================================================== -->

  <div v-if="cargando" class="state-container">
    <v-progress-circular indeterminate size="34" width="3" color="#0F8F8C" />

    <span>Consultando tu reserva...</span>
  </div>

  <!-- =====================================================
         ERROR
    ====================================================== -->

  <div v-else-if="error" class="state-container">
    <div class="state-icon error-icon">
      <v-icon size="30">mdi-alert-circle-outline</v-icon>
    </div>

    <div class="state-title">
      No pudimos cargar la reserva
    </div>

    <div class="state-message">
      {{ error }}
    </div>

    <button class="primary-button" type="button" @click="cargarReserva">
      <v-icon size="18">mdi-refresh</v-icon>
      Reintentar
    </button>
  </div>

  <!-- =====================================================
         RESERVA
    ====================================================== -->

  <div v-else-if="reserva" class="content">

    <!-- =================================================
           ESTADO
      ================================================== -->

    <section class="status-card">

      <div class="status-icon">
        <v-icon size="28">mdi-calendar-check</v-icon>
      </div>

      <div class="status-content">
        <span class="status-label">
          Reserva #{{ reserva.numero }}
        </span>

        <span class="status-value" :class="estadoClase(reserva.estado)">
          {{ estadoTexto(reserva.estado) }}
        </span>
      </div>

    </section>

    <!-- =================================================
           SERVICIO
      ================================================== -->

    <section class="card">

      <div class="section-title">
        <div class="section-icon">
          <v-icon size="19">mdi-content-cut</v-icon>
        </div>

        <span>Servicio</span>
      </div>

      <div class="service-name">
        {{ reserva.servicio?.nombre || "Servicio" }}
      </div>

      <div v-if="reserva.servicio?.descripcion" class="service-description">
        {{ reserva.servicio.descripcion }}
      </div>

      <div class="info-row">
        <span class="info-label">Duración</span>

        <span class="info-value">
          {{ reserva.servicio?.duracion || 0 }} min
        </span>
      </div>

    </section>

    <!-- =================================================
           FECHA Y HORARIO
      ================================================== -->

    <section class="card">

      <div class="section-title">
        <div class="section-icon">
          <v-icon size="19">mdi-calendar-clock</v-icon>
        </div>

        <span>Fecha y horario</span>
      </div>

      <div class="date-main">
        {{ formatearFecha(reserva.fecha) }}
      </div>

      <div class="time-main">
        <v-icon size="19">mdi-clock-outline</v-icon>

        <span>
          {{ formatearHora(reserva.hora_inicio) }}
          -
          {{ formatearHora(reserva.hora_fin) }}
        </span>
      </div>

      <div v-if="reserva.cantidad_slots" class="slots-info">
        {{ reserva.cantidad_slots }} horario(s) reservado(s)
      </div>

    </section>

    <!-- =================================================
           PROFESIONAL
      ================================================== -->

    <section class="card">

      <div class="section-title">
        <div class="section-icon">
          <v-icon size="19">mdi-account</v-icon>
        </div>

        <span>Profesional</span>
      </div>

      <div class="person-row">

        <div class="avatar">
          <v-img v-if="reserva.profesional?.foto" :src="urlImagen(reserva.profesional.foto)" cover />

          <v-icon v-else size="25" color="#0F8F8C">
            mdi-account
          </v-icon>
        </div>

        <div class="person-content">
          <span class="person-name">
            {{ reserva.profesional?.nombre || "Profesional" }}
          </span>

          <span v-if="reserva.profesional?.slug" class="person-slug">
            @{{ reserva.profesional.slug }}
          </span>
        </div>

      </div>

    </section>

    <!-- =================================================
           NEGOCIO
      ================================================== -->

    <section class="card">

      <div class="section-title">
        <div class="section-icon">
          <v-icon size="19">mdi-storefront-outline</v-icon>
        </div>

        <span>Negocio</span>
      </div>

      <div class="business-name">
        {{ reserva.negocio?.nombre || "Negocio" }}
      </div>

      <div v-if="reserva.negocio?.direccion" class="business-row">
        <v-icon size="18">mdi-map-marker-outline</v-icon>

        <span>
          {{ reserva.negocio.direccion }}
        </span>
      </div>

      <div v-if="reserva.negocio?.telefono" class="business-row">
        <v-icon size="18">mdi-phone-outline</v-icon>

        <span>
          {{ reserva.negocio.telefono }}
        </span>
      </div>

    </section>

    <!-- =================================================
           RESUMEN ECONÓMICO
      ================================================== -->

    <section class="card">

      <div class="section-title">
        <div class="section-icon">
          <v-icon size="19">mdi-cash</v-icon>
        </div>

        <span>Resumen de pago</span>
      </div>

      <div class="price-row">
        <span>Precio original</span>

        <strong>
          Bs {{ dinero(reserva.precio_original) }}
        </strong>
      </div>

      <div v-if="Number(reserva.monto_promocion) > 0" class="price-row discount">
        <span>Promoción</span>

        <strong>
          - Bs {{ dinero(reserva.monto_promocion) }}
        </strong>
      </div>

      <div v-if="Number(reserva.monto_descuento) > 0" class="price-row discount">
        <span>Descuento</span>

        <strong>
          - Bs {{ dinero(reserva.monto_descuento) }}
        </strong>
      </div>

      <div class="divider"></div>

      <div class="price-row total">
        <span>Total</span>

        <strong>
          Bs {{ dinero(reserva.precio_aplicable) }}
        </strong>
      </div>

      <div class="price-row">
        <span>Pagado</span>

        <strong>
          Bs {{ dinero(reserva.monto_pagado) }}
        </strong>
      </div>

      <div class="price-row saldo">
        <span>Saldo pendiente</span>

        <strong>
          Bs {{ dinero(reserva.saldo) }}
        </strong>
      </div>

    </section>

    <!-- =================================================
           ACCIONES
      ================================================== -->

    <div class="actions">

      <button class="primary-button" type="button" @click="irAMisReservas">
        <v-icon size="19">mdi-calendar-check</v-icon>

        Ver mis reservas
      </button>

      <button class="secondary-button" type="button" @click="volver">
        Volver a notificaciones
      </button>

    </div>

  </div>

  <!-- =====================================================
         SIN RESERVA
    ====================================================== -->

  <div v-else class="state-container">

    <div class="state-icon">
      <v-icon size="30">mdi-calendar-remove-outline</v-icon>
    </div>

    <div class="state-title">
      Reserva no encontrada
    </div>

    <div class="state-message">
      No encontramos la reserva asociada a esta notificación.
    </div>

    <button class="primary-button" type="button" @click="volver">
      Volver
    </button>

  </div>
</div>
</template>

<script>
import {
  getReservationById
} from "@/modules/cliente/modules/reservas/services/reserva.api";

export default {
  name: "ReservaNotificacionDetalle",

  data() {
    return {
      reserva: null,
      cargando: false,
      error: null,
    };
  },

  computed: {
    reservaId() {
      return Number(this.$route.query.id);
    },
  },

  mounted() {
    this.cargarReserva();
  },

  methods: {
    // ===================================================
    // CARGAR RESERVA
    // ===================================================

    async cargarReserva() {
      if (!this.reservaId || Number.isNaN(this.reservaId)) {
        this.error = "No se recibió el identificador de la reserva.";
        return;
      }

      this.cargando = true;
      this.error = null;

      try {
        const response = await getReservationById(this.reservaId);

        this.reserva =
          response?.data?.data ||
          response?.data ||
          null;

        if (!this.reserva) {
          this.error =
            "No encontramos la información de esta reserva.";
        }
      } catch (error) {
        console.error(
          "Error al obtener reserva desde notificación:",
          error,
        );

        this.error =
          error?.response?.data?.message ||
          "No fue posible obtener el detalle de la reserva.";
      } finally {
        this.cargando = false;
      }
    },

    // ===================================================
    // VOLVER
    // ===================================================

    volver() {
      this.$router.push({
        name: "cliente.notificaciones",
      });
    },

    // ===================================================
    // MIS RESERVAS
    // ===================================================

    irAMisReservas() {
      this.$router.push("/cliente/reservas");
    },

    // ===================================================
    // ESTADO
    // ===================================================

    estadoTexto(estado) {
      const estados = {
        PENDIENTE: "Pendiente",
        CONFIRMADA: "Confirmada",
        COMPLETADA: "Completada",
        CANCELADA: "Cancelada",
        NO_ASISTIO: "No asistió",
      };

      return estados[estado] || estado || "Pendiente";
    },

    estadoClase(estado) {
      return {
        "estado-pendiente": estado === "PENDIENTE",
        "estado-confirmada": estado === "CONFIRMADA",
        "estado-completada": estado === "COMPLETADA",
        "estado-cancelada": estado === "CANCELADA",
        "estado-no-asistio": estado === "NO_ASISTIO",
      };
    },

    // ===================================================
    // FECHA
    // ===================================================

    formatearFecha(fecha) {
      if (!fecha) {
        return "Fecha no disponible";
      }

      const fechaTexto = String(fecha).substring(0, 10);

      const [year, month, day] = fechaTexto.split("-");

      if (!year || !month || !day) {
        return fechaTexto;
      }

      const fechaLocal = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
      );

      return fechaLocal.toLocaleDateString("es-BO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    // ===================================================
    // HORA
    // ===================================================

    formatearHora(hora) {
      if (!hora) {
        return "--:--";
      }

      return String(hora).substring(0, 5);
    },

    // ===================================================
    // DINERO
    // ===================================================

    dinero(valor) {
      const numero = Number(valor || 0);

      return numero.toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    // ===================================================
    // IMAGEN
    // ===================================================

    urlImagen(url) {
      if (!url) {
        return "";
      }

      if (
        url.startsWith("http://") ||
        url.startsWith("https://")
      ) {
        return url;
      }

      const base =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      return `${base}${url.startsWith("/")?"" : "/"}${url}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.reserva-notificacion-page {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 16px 14px 24px;
  box-sizing: border-box;
  color: #102a43;
}

/* =========================================================
   HEADER
========================================================= */

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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

/* =========================================================
   CONTENT
========================================================= */

.content {
  padding: 14px 14px 20px;
}

/* =========================================================
   STATUS
========================================================= */

.status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  margin-bottom: 12px;
  background: #eaf7f6;
  border: 1px solid #ccebea;
  border-radius: 18px;
}

.status-icon {
  width: 46px;
  height: 46px;
  border-radius: 15px;
  background: #ffffff;
  color: #0f8f8c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-label {
  font-size: 13px;
  font-weight: 700;
}

.status-value {
  width: fit-content;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 9px;
  border-radius: 999px;
}

.estado-pendiente {
  background: #fff4d8;
  color: #9a6b00;
}

.estado-confirmada {
  background: #dff7f2;
  color: #087c76;
}

.estado-completada {
  background: #e5f4ff;
  color: #1670a8;
}

.estado-cancelada {
  background: #fde8e7;
  color: #b83b35;
}

.estado-no-asistio {
  background: #f0e9ff;
  color: #7048a5;
}

/* =========================================================
   CARDS
========================================================= */

.card {
  background: #ffffff;
  border: 1px solid #e6efef;
  border-radius: 18px;
  padding: 15px;
  margin-bottom: 12px;
  box-shadow: 0 3px 14px rgba(15, 143, 140, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0b5f63;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 13px;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #eaf7f6;
  color: #0f8f8c;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================================================
   SERVICIO
========================================================= */

.service-name {
  font-size: 16px;
  font-weight: 800;
  color: #102a43;
}

.service-description {
  margin-top: 6px;
  color: #6b7c93;
  font-size: 12px;
  line-height: 1.45;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 13px;
  padding-top: 11px;
  border-top: 1px solid #edf2f2;
}

.info-label {
  font-size: 12px;
  color: #6b7c93;
}

.info-value {
  font-size: 12px;
  font-weight: 700;
}

/* =========================================================
   FECHA
========================================================= */

.date-main {
  font-size: 15px;
  font-weight: 800;
  text-transform: capitalize;
}

.time-main {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  color: #0f8f8c;
  font-size: 14px;
  font-weight: 800;
}

.slots-info {
  margin-top: 9px;
  font-size: 11px;
  color: #7b8a9a;
}

/* =========================================================
   PERSONA
========================================================= */

.person-row {
  display: flex;
  align-items: center;
  gap: 11px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #eaf7f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.person-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.person-name {
  font-size: 14px;
  font-weight: 800;
}

.person-slug {
  font-size: 11px;
  color: #7b8a9a;
}

/* =========================================================
   NEGOCIO
========================================================= */

.business-name {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 10px;
}

.business-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #60758a;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 7px;
}

.business-row .v-icon {
  color: #0f8f8c;
  flex-shrink: 0;
}

/* =========================================================
   PRECIOS
========================================================= */

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  font-size: 12px;
  margin-top: 10px;
}

.price-row span {
  color: #6b7c93;
}

.price-row strong {
  color: #102a43;
  white-space: nowrap;
}

.discount strong {
  color: #0f8f8c;
}

.divider {
  height: 1px;
  background: #e8eeee;
  margin: 14px 0 4px;
}

.price-row.total {
  font-size: 14px;
}

.price-row.total span,
.price-row.total strong {
  color: #0b5f63;
}

.price-row.saldo {
  margin-top: 12px;
  padding: 10px;
  background: #f7fbfb;
  border-radius: 12px;
}

.price-row.saldo strong {
  color: #0f8f8c;
}

/* =========================================================
   ACTIONS
========================================================= */

.actions {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 4px;
}

.primary-button,
.secondary-button {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.primary-button {
  border: none;
  background: #0f8f8c;
  color: #ffffff;
}

.secondary-button {
  border: 1px solid #d7e9e8;
  background: #ffffff;
  color: #0b5f63;
}

/* =========================================================
   STATES
========================================================= */

.state-container {
  min-height: 65vh;
  padding: 30px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
}

.state-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: #eaf7f6;
  color: #0f8f8c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.error-icon {
  background: #fde8e7;
  color: #d9534f;
}

.state-title {
  font-size: 15px;
  font-weight: 800;
}

.state-message {
  max-width: 280px;
  font-size: 12px;
  line-height: 1.5;
  color: #718096;
}

.state-container .primary-button {
  width: auto;
  padding: 0 20px;
  margin-top: 6px;
}

/* =========================================================
   MOBILE
========================================================= */

@media (min-width: 600px) {
  .reserva-notificacion-page {
    max-width: 520px;
    margin: 0 auto;
  }
}
</style>
