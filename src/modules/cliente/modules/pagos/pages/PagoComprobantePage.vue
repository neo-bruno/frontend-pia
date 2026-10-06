<template>
<div class="pagos-page">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->
  <section class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Mis pagos</h1>
      <p>Historial de tus pagos y comprobantes</p>
    </div>
  </section>

  <!-- =====================================================
         RESUMEN
    ====================================================== -->
  <div class="resumen-card">
    <div class="resumen-icon">
      <v-icon size="21">mdi-receipt-text-outline</v-icon>
    </div>

    <div class="resumen-content">
      <strong>
        {{ pagos.length }}
        {{ pagos.length === 1?'pago registrado' : 'pagos registrados' }}
      </strong>

      <span>Consulta tus pagos y comprobantes</span>
    </div>
  </div>

  <!-- =====================================================
         CARGANDO
    ====================================================== -->
  <div v-if="overlay" class="loading-container">
    <v-progress-circular indeterminate size="38" width="3" color="#008b8b" />
    <span>Cargando tus pagos...</span>
  </div>

  <!-- =====================================================
         SIN PAGOS
    ====================================================== -->
  <div v-else-if="pagos.length === 0" class="empty-state">
    <div class="empty-icon">
      <v-icon size="42">mdi-receipt-text-outline</v-icon>
    </div>

    <h3>Aún no tienes pagos</h3>

    <p>
      Aquí aparecerán los pagos que realices
      para tus reservas.
    </p>
  </div>

  <!-- =====================================================
         LISTA
    ====================================================== -->
  <div v-else class="pagos-list">

    <div v-for="pago in pagos" :key="pago.id" class="pago-card" @click="verDetalle(pago.id)">

      <!-- =================================================
             CABECERA DEL PAGO
        ================================================== -->
      <div class="card-top">

        <!-- PROFESIONAL -->
        <div class="profesional-wrapper">
          <img v-if="getProfesionalFoto(pago)" :src="getImageUrl(getProfesionalFoto(pago))" :alt="pago.profesional?.nombre || 'Profesional'" class="profesional-image" @error="onImageError" />

          <div v-else class="profesional-placeholder">
            <v-icon size="27">mdi-account-outline</v-icon>
          </div>

          <div class="foto-check">
            <v-icon size="12">mdi-check</v-icon>
          </div>
        </div>

        <!-- SERVICIO / PROFESIONAL -->
        <div class="card-main">
          <div class="card-date">
            {{ formatearFechaCorta(pago.fecha) }}
          </div>

          <div class="servicio-name">
            {{ pago.servicio?.nombre || 'Servicio' }}
          </div>

          <div class="profesional-name">
            <v-icon size="12">mdi-account-outline</v-icon>
            <span>
              {{ pago.profesional?.nombre || 'Profesional' }}
            </span>
          </div>
        </div>

        <!-- MONTO + MÉTODO -->
        <div class="card-amount">
          <strong>
            Bs {{ formatearMonto(pago.monto) }}
          </strong>

          <div class="metodo-pago">
            <v-icon size="13">
              {{ iconoMetodoPago(pago.metodo_pago?.codigo) }}
            </v-icon>
            <span>
              {{ pago.metodo_pago?.codigo || pago.metodo_pago?.nombre || 'Pago' }}
            </span>
          </div>
        </div>

      </div>

      <div class="card-divider"></div>

      <!-- =================================================
             NUMERO + ESTADO
        ================================================== -->
      <div class="payment-info">

        <div class="payment-number">
          <span class="label">N° de pago</span>
          <strong :title="pago.numero || `#${pago.id}`">
            {{ pago.numero || `#${pago.id}` }}
          </strong>
        </div>

        <div class="payment-status" :class="getEstadoClass(pago.estado, pago.comprobante?.estado)">
          <v-icon size="13">
            {{ getEstadoIcon(pago.estado, pago.comprobante?.estado) }}
          </v-icon>

          <span>
            {{ getEstadoTexto(pago.estado, pago.comprobante?.estado) }}
          </span>
        </div>

      </div>
      
      <!-- =================================================
             SERVICIO
        ================================================== -->
      <div class="service-section">
        <div class="servicio-imagen-wrapper">
          <v-img v-if="pago.servicio?.imagen" :src="getFileUrl(pago.servicio.imagen)" class="servicio-imagen" cover/>

          <div v-else class="servicio-imagen-fallback">
            <v-icon size="22">mdi-content-cut</v-icon>
          </div>
        </div>
        
        <div class="service-info">
          <strong>
            {{ pago.servicio?.nombre || 'Servicio' }}
          </strong>

          <span>
            {{ pago.servicio?.duracion || '--' }} minutos
          </span>
        </div>

        <div class="service-price">
          <span>Precio</span>
          <strong>
            Bs {{ formatearMonto(pago.servicio?.precio) }}
          </strong>
        </div>

      </div>

      <!-- =================================================
             RESERVA
        ================================================== -->
      <div class="reservation-row">

        <div class="reservation-item">
          <v-icon size="15">mdi-calendar-outline</v-icon>
          <span>
            {{ formatearFechaReserva(pago.reserva?.fecha) }}
          </span>
        </div>

        <div class="reservation-item">
          <v-icon size="15">mdi-clock-outline</v-icon>
          <span>
            {{ formatearHora(pago.reserva?.hora_inicio) }}
          </span>
        </div>

        <!-- COMPROBANTE -->
        <div v-if="pago.comprobante" class="comprobante-link">
          <v-icon size="15">mdi-file-image-outline</v-icon>
          <span>Comprobante</span>
        </div>

      </div>

      <!-- =================================================
             NEGOCIO
        ================================================== -->
      <div class="business-section">

        <div class="business-icon">
          <v-icon size="18">mdi-storefront-outline</v-icon>
        </div>

        <div class="business-info">
          <strong>
            {{ pago.negocio?.nombre || 'Negocio' }}
          </strong>

          <span>
            {{ pago.negocio?.direccion || 'Dirección no disponible' }}
          </span>
        </div>

        <v-icon size="20" class="business-arrow">
          mdi-chevron-right
        </v-icon>

      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getFileUrl } from "@/utils/ayuda";
import {
  getPagosCliente
} from "../services/pago.api";

export default {
  name: "PagoComprobantePage",

  data() {
    return {
      pagos: [],
      overlay: false,
    };
  },

  methods: {
    getFileUrl,

    async obtenerPagosComprobantes() {
      try {
        this.overlay = true;

        const res = await getPagosCliente();

        console.log("OBTENER PAGOS COMPROBANTES:", res);

        if (res.data?.ok && Array.isArray(res.data.data)) {
          this.pagos = res.data.data;
        } else {
          this.pagos = [];
        }
      } catch (error) {
        console.error("Error al obtener pagos:", error);

        if (this.$piaAlert) {
          this.$piaAlert.error(
            "No fue posible cargar tus pagos.", {
              title: "Error",
            }
          );
        }
      } finally {
        this.overlay = false;
      }
    },

    verDetalle(id) {
      this.$router.push(`/cliente/pagos/detalle/${id}`);
    },

    getProfesionalFoto(pago) {
      return (
        pago?.profesional?.foto ||
        pago?.profesional?.portada ||
        null
      );
    },

    getImageUrl(url) {
      if (!url) return "";

      if (
        url.startsWith("http://") ||
        url.startsWith("https://")
      ) {
        return url;
      }

      const baseUrl =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      return `${baseUrl}${url}`;
    },

    onImageError(event) {
      const parent = event.target?.parentElement;

      if (!parent) return;

      event.target.style.display = "none";
      parent.classList.add("image-error");
    },

    formatearMonto(monto) {
      const numero = Number(monto || 0);

      return numero.toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatearFechaCorta(fecha) {
      if (!fecha) return "--";

      const date = new Date(fecha);

      return date.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },

    formatearFechaReserva(fecha) {
      if (!fecha) return "--";

      const date = new Date(fecha);

      return date.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "short",
      });
    },

    formatearHora(hora) {
      if (!hora) return "--";

      return hora.substring(0, 5);
    },

    iconoMetodoPago(codigo) {
      const metodo = String(codigo || "").toUpperCase();

      if (metodo === "QR") {
        return "mdi-qrcode";
      }

      if (metodo === "EFECTIVO") {
        return "mdi-cash";
      }

      if (
        metodo === "TARJETA" ||
        metodo === "CARD"
      ) {
        return "mdi-credit-card-outline";
      }

      return "mdi-cash-check";
    },

    getEstadoTexto(estadoPago, estadoComprobante) {
      const estado =
        estadoComprobante ||
        estadoPago;

      switch (estado) {
        case "APROBADO":
        case "VALIDADO":
        case "CONFIRMADO":
          return "Validado";

        case "PENDIENTE":
          return "Pendiente de validación";

        case "RECHAZADO":
          return "Comprobante rechazado";

        case "ANULADO":
          return "Pago anulado";

        default:
          return estado || "Pendiente";
      }
    },

    getEstadoClass(estadoPago, estadoComprobante) {
      const estado =
        estadoComprobante ||
        estadoPago;

      switch (estado) {
        case "APROBADO":
        case "VALIDADO":
        case "CONFIRMADO":
          return "estado-success";

        case "RECHAZADO":
        case "ANULADO":
          return "estado-error";

        default:
          return "estado-pending";
      }
    },

    getEstadoIcon(estadoPago, estadoComprobante) {
      const estado =
        estadoComprobante ||
        estadoPago;

      switch (estado) {
        case "APROBADO":
        case "VALIDADO":
        case "CONFIRMADO":
          return "mdi-check-circle-outline";

        case "RECHAZADO":
          return "mdi-close-circle-outline";

        case "ANULADO":
          return "mdi-cancel";

        default:
          return "mdi-clock-outline";
      }
    },

    volver() {
      this.$router.push({name: 'cliente'})
    },
  },

  mounted() {
    this.obtenerPagosComprobantes();
  },
};
</script>

<style lang="scss" scoped>

/* =========================================================
   BASE
========================================================= */

.pagos-page {
  min-height: 100vh;
  background: linear-gradient(180deg,
      #ffffff 0%,
      #f8fcfc 100%);

  padding: 20px 14px 100px;

  color: #102a43;
}

/* =========================================================
   HEADER
========================================================= */

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

/* =========================================================
   RESUMEN
========================================================= */

.resumen-card {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 13px;
  margin-bottom: 14px;

  border-radius: 17px;

  background: linear-gradient(135deg,
      #eefafa,
      #f8ffff);

  border: 1px solid #d4eeee;
}

.resumen-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;

  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffffff;
  color: #008b8b;

  box-shadow: 0 3px 10px rgba(0, 139, 139, 0.07);
}

.resumen-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.resumen-content strong {
  font-size: 13px;
  font-weight: 750;
}

.resumen-content span {
  font-size: 10px;
  color: #718096;
}

/* =========================================================
   LISTA
========================================================= */

.pagos-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

/* =========================================================
   CARD
========================================================= */

.pago-card {
  background: #ffffff;

  border: 1px solid #dfeeee;
  border-radius: 19px;

  padding: 13px;

  cursor: pointer;

  box-shadow:
    0 5px 18px rgba(15, 70, 70, 0.065);

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.pago-card:active {
  transform: scale(0.987);
}

.pago-card:hover {
  border-color: #a9dddd;
  box-shadow:
    0 8px 24px rgba(15, 70, 70, 0.10);
}

/* =========================================================
   CABECERA
========================================================= */

.card-top {
  display: flex;
  align-items: center;
  gap: 10px;

  min-width: 0;
}

/* =========================================================
   FOTO PROFESIONAL
========================================================= */

.profesional-wrapper {
  position: relative;

  width: 60px;
  height: 60px;
  flex-shrink: 0;

  border-radius: 15px;
  overflow: visible;

  background: #eaf8f8;

  border: 2px solid #ffffff;

  box-shadow:
    0 2px 8px rgba(0, 100, 100, 0.15);
}

.profesional-image,
.profesional-placeholder {
  width: 100%;
  height: 100%;

  border-radius: 13px;

  object-fit: cover;
  display: block;
}

.profesional-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;

  background: #eaf8f8;
  color: #008b8b;
}

.foto-check {
  position: absolute;

  right: -3px;
  bottom: -3px;

  width: 18px;
  height: 18px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #008b8b;
  color: #ffffff;

  border: 2px solid #ffffff;
}

/* =========================================================
   INFORMACIÓN PRINCIPAL
========================================================= */

.card-main {
  min-width: 0;
  flex: 1;
}

.card-date {
  font-size: 10px;
  color: #8294a5;
  margin-bottom: 3px;
}

.servicio-name {
  font-size: 13px;
  line-height: 1.2;
  font-weight: 750;
  color: #102a43;

  /*
   * Permitimos dos líneas para que el nombre completo
   * tenga espacio suficiente en móviles.
   */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.profesional-name {
  display: flex;
  align-items: center;
  gap: 3px;

  margin-top: 4px;

  min-width: 0;

  color: #718096;
  font-size: 9px;
}

.profesional-name .v-icon {
  color: #008b8b;
  flex-shrink: 0;
}

.profesional-name span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* =========================================================
   MONTO
========================================================= */

.card-amount {
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  gap: 5px;
}

.card-amount strong {
  color: #008b8b;
  font-size: 16px;
  font-weight: 800;
  white-space: nowrap;
}

.metodo-pago {
  display: flex;
  align-items: center;
  gap: 4px;

  color: #008b8b;
  font-size: 9px;
  font-weight: 650;
}

.metodo-pago .v-icon {
  color: #008b8b;
}

/* =========================================================
   DIVISOR
========================================================= */

.card-divider {
  height: 1px;
  background: #edf2f2;
  margin: 11px 0;
}

/* =========================================================
   NUMERO DE PAGO + ESTADO
========================================================= */

.payment-info {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 8px;
}

.payment-number {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.payment-number .label {
  font-size: 8px;
  color: #91a0ae;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.payment-number strong {
  display: block;

  max-width: 100%;

  font-size: 10px;
  line-height: 1.2;
  color: #40576a;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.payment-status {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  gap: 4px;

  padding: 5px 8px;

  border-radius: 20px;

  font-size: 8.5px;
  font-weight: 700;

  white-space: nowrap;
}

.estado-pending {
  background: #fff4d8;
  color: #c47b00;
}

.estado-success {
  background: #e5f8ef;
  color: #168552;
}

.estado-error {
  background: #fdeaea;
  color: #d83b3b;
}

/* =========================================================
   SERVICIO
========================================================= */

.service-section {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-top: 10px;
  padding: 9px 0;

  border-bottom: 1px solid #edf2f2;
}

.servicio-imagen-wrapper {
  width: 48px;
  height: 48px;
  min-width: 48px;
  flex-shrink: 0;
}

.servicio-imagen {
  width: 48px !important;
  height: 48px !important;
  border-radius: 10px;
  overflow: hidden;
}

.servicio-imagen-fallback {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #eef8f8;
  color: #008f9b;
}

.service-icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eaf8f8;
  color: #008b8b;
}

.servicio-imagen {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px;
  min-height: 48px;

  border-radius: 10px;

  overflow: hidden;

  flex-shrink: 0;

  background: #eef8f8;
}

.service-info {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 3px;
}

.service-info strong {
  font-size: 11px;
  line-height: 1.25;
  font-weight: 750;
  color: #263d52;

  /*
   * Aquí NO usamos nowrap.
   * Así el servicio puede verse completo.
   */
  white-space: normal;
}

.service-info span {
  font-size: 9px;
  color: #8091a0;
}

.service-price {
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.service-price span {
  font-size: 8px;
  color: #91a0ae;
}

.service-price strong {
  font-size: 11px;
  color: #263d52;
  font-weight: 750;
  white-space: nowrap;
}

/* =========================================================
   RESERVA
========================================================= */

.reservation-row {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 9px 0 0;
}

.reservation-item {
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 9px;
  color: #718096;
}

.reservation-item .v-icon {
  color: #008b8b;
}

/* COMPROBANTE */

.comprobante-link {
  margin-left: auto;

  display: flex;
  align-items: center;
  gap: 4px;

  color: #008b8b;

  font-size: 9px;
  font-weight: 700;

  white-space: nowrap;
}

.comprobante-link .v-icon {
  color: #008b8b;
}

/* =========================================================
   NEGOCIO
========================================================= */

.business-section {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-top: 9px;
  padding-top: 9px;

  border-top: 1px solid #edf2f2;
}

.business-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eaf8f8;
  color: #008b8b;
}

.business-info {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.business-info strong {
  font-size: 11px;
  font-weight: 750;
  color: #263d52;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.business-info span {
  font-size: 9px;
  color: #81909e;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.business-arrow {
  color: #9aabb7;
}

/* =========================================================
   EMPTY
========================================================= */

.empty-state {
  text-align: center;
  padding: 55px 25px;
}

.empty-icon {
  width: 76px;
  height: 76px;

  margin: 0 auto 16px;

  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eefafa;
  color: #008b8b;
}

.empty-state h3 {
  margin: 0;
  font-size: 16px;
}

.empty-state p {
  margin-top: 7px;

  font-size: 12px;
  line-height: 1.5;

  color: #80909f;
}

/* =========================================================
   LOADING
========================================================= */

.loading-container {
  min-height: 260px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 12px;

  color: #718096;
  font-size: 12px;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 360px) {
  .pagos-page {
    padding-left: 11px;
    padding-right: 11px;
  }

  .pago-card {
    padding: 11px;
  }

  .profesional-wrapper {
    width: 56px;
    height: 56px;
  }

  .card-amount strong {
    font-size: 15px;
  }

  .payment-status {
    padding-left: 7px;
    padding-right: 7px;
  }
}

@media (min-width: 768px) {
  .pagos-page {
    max-width: 430px;
    margin: 0 auto;
  }
}
</style>
