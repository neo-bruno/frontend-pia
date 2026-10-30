<template>
<div class="mis-reservas-page">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->
  <section class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Mis Reservas</h1>
      <p>Gestiona y consulta todas tus reservas</p>
    </div>
  </section>

  <!-- =====================================================
         LOADING
    ====================================================== -->

  <section v-if="loading" class="loading-container">

    <v-progress-circular indeterminate size="32" width="3" />

    <span>

      Cargando tus reservas...

    </span>

  </section>

  <!-- =====================================================

         ERROR

    ====================================================== -->

  <section v-else-if="error" class="error-container">

    <div class="error-icon">

      <v-icon size="25">

        mdi-alert-circle-outline

      </v-icon>

    </div>

    <h3>

      No pudimos cargar tus reservas

    </h3>

    <p>

      {{ error }}

    </p>

    <button type="button" class="retry-button" @click="cargarReservas">

      Intentar nuevamente

    </button>

  </section>

  <!-- =====================================================

         SIN RESERVAS

    ====================================================== -->

  <section v-else-if="reservas.length === 0" class="empty-container">

    <div class="empty-icon">

      <v-icon size="34">

        mdi-calendar-blank-outline

      </v-icon>

    </div>

    <h3>

      No tienes reservas

    </h3>

    <p>

      Aquí aparecerán tus reservas.

    </p>

  </section>

  <!-- =====================================================

         LISTA DE RESERVAS

    ====================================================== -->

  <section v-else class="reservations-list">

    <article v-for="reserva in reservas" :key="reserva.id" class="reservation-card" :style="{

        '--business-color': reserva.color1,

        '--business-light': reserva.color2,

        '--business-dark': reserva.color3

      }">

      <!-- =================================================

             PARTE SUPERIOR

        ================================================== -->

      <div class="reservation-main">

        <!-- FECHA -->

        <div class="reservation-date" :class="getDateClass(reserva)">

          <div class="date-day">

            {{ getReservationDay(reserva) }}

          </div>

          <div class="date-month">

            {{ getReservationMonth(reserva) }}

          </div>

        </div>

        <!-- INFORMACIÓN -->

        <div class="reservation-info">

          <div class="reservation-time">

            <v-icon size="15">

              mdi-clock-outline

            </v-icon>

            <span>

              {{ reserva.horaInicio.slice(0, 5) }}

              <template v-if="reserva.horaFin">

                - {{ reserva.horaFin.slice(0, 5) }}

              </template>

            </span>

          </div>

          <h2>

            {{ reserva.servicio }}

          </h2>

          <p class="reservation-category">

            {{ reserva.categoria }}

          </p>

        </div>

        <!-- ESTADO -->

        <div class="reservation-status" :class="getStatusClass(reserva.estado)">

          <v-icon size="13">

            {{ getStatusIcon(reserva.estado) }}

          </v-icon>

          <span>

            {{ getStatusLabel(reserva.estado) }}

          </span>

        </div>

      </div>

      <!-- =================================================

             PROFESIONAL

        ================================================== -->

      <div class="reservation-detail-row">

        <div class="detail-icon">

          <v-icon size="19">

            mdi-account-outline

          </v-icon>

        </div>

        <div class="detail-content">

          <strong>

            {{ reserva.profesional }}

          </strong>

          <span>

            Profesional

          </span>

        </div>

      </div>

      <!-- =================================================

             NEGOCIO

        ================================================== -->

      <div class="reservation-detail-row">

        <div class="detail-icon">

          <v-icon size="19">

            mdi-storefront-outline

          </v-icon>

        </div>

        <div class="detail-content">

          <strong>

            {{ reserva.negocio }}

          </strong>

          <span>

            {{ reserva.direccion || 'Dirección no disponible' }}

          </span>

        </div>

      </div>

      <!-- =================================================

             IMAGEN

        ================================================== -->

      <div class="reservation-business-image">

        <img v-if="reserva.imagen" :src="getMediaUrl(reserva.imagen)" :alt="reserva.negocio" @error="handleImageError" />

        <div v-else class="reservation-business-placeholder">

          <v-icon size="30">

            mdi-storefront-outline

          </v-icon>

        </div>

      </div>

      <!-- =================================================

             ACCIONES

        ================================================== -->

      <div class="reservation-actions">

        <button type="button" class="detail-button" @click="verDetalle(reserva)">

          <v-icon size="18">

            mdi-file-document-outline

          </v-icon>

          <span>

            Ver detalle

          </span>

        </button>

        <button type="button" class="more-button" @click="abrirMenu(reserva)">

          <v-icon size="22">

            mdi-dots-vertical

          </v-icon>

        </button>

      </div>

    </article>

  </section>

  <!-- =====================================================

         MENU DE ACCIONES

    ====================================================== -->

  <v-dialog v-model="menuVisible" max-width="330">

    <div class="actions-dialog">

      <div class="dialog-header">

        <h3>

          Acciones de reserva

        </h3>

        <button type="button" @click="menuVisible = false">

          <v-icon size="21">

            mdi-close

          </v-icon>

        </button>

      </div>

      <button type="button" class="dialog-action" @click="verDetalle(reservaSeleccionada)">

        <div class="dialog-action-icon blue">

          <v-icon size="20">

            mdi-file-document-outline

          </v-icon>

        </div>

        <span>

          Ver detalle

        </span>

      </button>

      <button v-if="puedeCancelar(reservaSeleccionada)" type="button" class="dialog-action" @click="cancelarReserva">

        <div class="dialog-action-icon red">

          <v-icon size="20">

            mdi-close-circle-outline

          </v-icon>

        </div>

        <span>

          Cancelar reserva

        </span>

      </button>

    </div>

  </v-dialog>

</div>
</template>

<script>
import {

  getReservations,

} from "../services/reserva.api";

export default {

  name: "MisReservasPage",
  data() {
    return {
      loading: false,
      error: null,
      reservas: [],
      reservaSeleccionada: null,
      menuVisible: false,
    };
  },

  mounted() {

    this.cargarReservas();

  },

  methods: {

    // ============================================================

    // FECHA DE LA RESERVA

    // ============================================================

    getReservationDay(reserva) {

      if (!reserva?.fecha) return "--";

      // Tomamos solamente YYYY-MM-DD.

      // Así evitamos que la conversión UTC cambie el día.

      const fecha = String(reserva.fecha).substring(0, 10);

      const [, mes, dia] = fecha.split("-");

      return dia || "--";

    },

    getReservationMonth(reserva) {

      if (!reserva?.fecha) return "--";

      const fecha = String(reserva.fecha).substring(0, 10);

      const [, mes] = fecha.split("-");

      if (!mes) return "--";

      const meses = [

        "ENE",

        "FEB",

        "MAR",

        "ABR",

        "MAY",

        "JUN",

        "JUL",

        "AGO",

        "SEP",

        "OCT",

        "NOV",

        "DIC",

      ];

      return meses[Number(mes) - 1] || "--";

    },

    // ============================================================

    // HORA

    // ============================================================

    formatTime(hora) {

      if (!hora) return "--:--";

      return String(hora).substring(0, 5);

    },

    // =====================================================

    // CARGAR RESERVAS

    // =====================================================

    async cargarReservas() {

      this.loading = true;

      this.error = null;

      try {

        const response = await getReservations();
        const data = response?.data?.data?? response?.data?? [];
        const lista = Array.isArray(data)?data : (data?.reservas || data?.rows || data?.items || []);

        this.reservas = lista.map((reserva) => this.normalizarReserva(reserva)).filter((reserva) => {
          const estado = String(reserva.estado || "").toUpperCase();

          const estadosActivos = ["PENDIENTE", "PENDIENTE_PAGO", "PENDIENTE_CONFIRMACION", "PENDIENTE_VALIDACION", "CONFIRMADA"];

          if (!estadosActivos.includes(estado)) {
            return false;
          }

          if (!reserva.fecha) {
            return false;
          }

          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);

          const fechaReserva = new Date(
            `${String(reserva.fecha).substring(0, 10)}T00:00:00`,
          );

          return (
            !Number.isNaN(fechaReserva.getTime()) &&
            fechaReserva >= hoy
          );
        });

      } catch (error) {

        console.error(

          "❌ ERROR CARGANDO RESERVAS:",

          error,

        );

        this.error =

          error?.response?.data?.message ||

          error?.message ||

          "No se pudieron cargar las reservas.";

      } finally {

        this.loading = false;

      }

    },

    // =====================================================

    // NORMALIZAR RESERVA

    // =====================================================

    normalizarReserva(reserva) {

      const fecha =

        reserva.fecha ||

        reserva.fecha_reserva ||

        reserva.fechaReserva ||

        reserva.fecha_inicio ||

        null;

      const fechaObj =

        fecha ?

        new Date(`${fecha}T00:00:00`) :

        null;

      const dia =

        fechaObj &&

        !Number.isNaN(fechaObj.getTime()) ?

        String(

          fechaObj.getDate(),

        ).padStart(2, "0") :

        "--";

      const mes =

        fechaObj &&

        !Number.isNaN(fechaObj.getTime()) ?

        fechaObj

        .toLocaleDateString(

          "es-ES", {

            month: "short",

          },

        )

        .replace(".", "")

        .toUpperCase() :

        "---";

      return {

        ...reserva,

        id: reserva.id ||

          reserva.reserva_id,

        fecha,

        dia,

        mes,

        horaInicio: reserva.hora_inicio ||

          reserva.horaInicio ||

          reserva.hora ||

          "",

        horaFin: reserva.hora_fin ||

          reserva.horaFin ||

          "",

        servicio: reserva.servicio_nombre ||

          reserva.servicio?.nombre ||

          reserva.servicio ||

          "Servicio",

        categoria: reserva.categoria_nombre ||

          reserva.categoria ||

          reserva.servicio?.categoria?.nombre ||

          "",

        profesional: reserva.profesional_nombre ||

          reserva.profesional?.nombre_completo ||

          reserva.profesional?.nombre ||

          reserva.profesional ||

          "Profesional",

        negocio: reserva.negocio_nombre ||

          reserva.negocio?.nombre ||

          reserva.negocio ||

          "Negocio",

        direccion: reserva.negocio_direccion ||

          reserva.negocio?.direccion ||

          reserva.direccion ||

          "",

        estado: reserva.estado ||

          reserva.estado_reserva ||

          "PENDIENTE",
        // Imagen del NEGOCIO, nunca la foto del profesional.
        // Prioridad: portada -> logo -> compatibilidad.
        imagen: reserva.negocio?.portada ||
          reserva.negocio?.logo ||
          reserva.negocio_imagen ||
          reserva.imagen_url ||
          reserva.imagen ||
          null,

      };

    },

    // =====================================================

    // DETALLE

    // =====================================================

    verDetalle(reserva) {

      if (!reserva?.id) {

        return;

      }

      this.menuVisible = false;

      this.$router.push(

        `/cliente/reservas/${reserva.id}`,

      );

    },

    // =====================================================

    // MENU

    // =====================================================

    abrirMenu(reserva) {

      this.reservaSeleccionada = reserva;

      this.menuVisible = true;

    },

    // =====================================================

    // CANCELAR

    // =====================================================

    cancelarReserva() {

      this.menuVisible = false;

      console.log(

        "Cancelar reserva:",

        this.reservaSeleccionada,

      );

      // ---------------------------------------------------

      // TODAVÍA NO LLAMAMOS API.

      // Primero vamos a implementar la regla de

      // cancelación/reprogramación.

      // ---------------------------------------------------

    },

    // =====================================================

    // ¿PUEDE CANCELAR?

    // =====================================================

    puedeCancelar(reserva) {

      if (!reserva) {

        return false;

      }

      const estado = String(reserva.estado || "").toUpperCase();

      return ![

        "CANCELADA",

        "CANCELADO",

        "FINALIZADA",

        "COMPLETADA",

        "NO_ASISTIO",

        "NO ASISTIO",

      ].includes(estado);

    },

    // =====================================================

    // ESTADO

    // =====================================================

    getStatusLabel(estado) {

      const value =

        String(

          estado || "",

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

      };

      return labels[value] || value;

    },

    getStatusClass(estado) {

      const value =

        String(

          estado || "",

        ).toUpperCase();

      if (value === "CONFIRMADA") {

        return "status-confirmed";

      }

      if (

        value.includes("PENDIENTE")

      ) {

        return "status-pending";

      }

      if (

        value.includes("CANCEL")

      ) {

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

      const value =

        String(

          estado || "",

        ).toUpperCase();

      if (value === "CONFIRMADA") {

        return "mdi-check-circle";

      }

      if (

        value.includes("PENDIENTE")

      ) {

        return "mdi-clock-outline";

      }

      if (

        value.includes("CANCEL")

      ) {

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

    // =====================================================

    // COLOR FECHA

    // =====================================================

    getDateClass(reserva) {

      const estado =

        String(

          reserva?.estado || "",

        ).toUpperCase();

      if (

        estado.includes("PENDIENTE")

      ) {

        return "date-pending";

      }

      if (

        estado.includes("CANCEL")

      ) {

        return "date-cancelled";

      }

      return "date-default";

    },

    // =====================================================

    // ERROR IMAGEN

    // =====================================================

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
      img.parentElement?.classList.add("image-load-error");
    },

    // =====================================================

    // VOLVER

    // =====================================================
    volver() {
      this.$router.push({
        name: 'cliente'
      });
    },

  },

};
</script>

<style lang="scss" scoped>
/* =========================================================
   IDENTIDAD VISUAL PIA — solo presentación
   ========================================================= */

.mis-reservas-page {
  --pia-primary: #079da0;
  --pia-primary-dark: #087f83;
  --pia-primary-soft: #e8f8f7;
  --pia-ink: #17354b;
  --pia-muted: #728597;
  --pia-border: #dceeed;

  width: 100%;
  max-width: 100%;
  padding: 12px 10px 100px;
  box-sizing: border-box;
  color: var(--pia-ink);
  background: transparent;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 2px 0 17px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid var(--pia-border);
  background: #fff;
  color: var(--pia-primary-dark);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(8, 127, 131, .08);
  transition: transform .18s ease, box-shadow .18s ease;
}

.back-button:active {
  transform: scale(.96);
}

.page-header-text {
  flex: 1;
  min-width: 0;
}

.page-header-text h1 {
  margin: 0;
  color: var(--pia-ink);
  font-size: 21px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -.45px;
}

.page-header-text p {
  margin: 4px 0 0;
  color: var(--pia-muted);
  font-size: 11px;
  line-height: 1.4;
}

/* Lista y tarjeta */
.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.reservation-card {
  --business-color: #087f83;
  --business-light: #e8f8f7;
  --business-dark: #17354b;

  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  overflow: hidden;
  padding: 15px 12px 13px;
  border: 1px solid #d8e9e8;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 8px 0 rgba(8, 127, 131, .035), 0 9px 24px rgba(24, 65, 82, .085);
  transition: box-shadow .2s ease, transform .2s ease;
}

.reservation-card::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--pia-primary), #63d5ca);
}

.reservation-card::after {
  content: "";
  position: absolute;
  z-index: -1;
  right: -30px;
  top: -36px;
  width: 95px;
  height: 95px;
  border-radius: 50%;
  background: var(--business-light);
  opacity: .48;
  pointer-events: none;
}

.reservation-main {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-height: 65px;
  padding-right: 0;
}

.reservation-date {
  flex: 0 0 61px;
  width: 61px;
  height: 65px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 0 1px rgba(7, 157, 160, .05);
}

.date-default {
  background: linear-gradient(145deg, #e4f8f6, #f0fbfa);
  color: var(--pia-primary-dark);
}

.date-pending {
  background: #fff5df;
  color: #b96b00;
}

.date-cancelled {
  background: #fff0f1;
  color: #c83e52;
}

.date-day {
  font-size: 24px;
  line-height: 24px;
  font-weight: 800;
  letter-spacing: -.7px;
}

.date-month {
  margin-top: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .8px;
}

.reservation-info {
  flex: 1;
  min-width: 0;
  padding: 1px 0 0;
}

.reservation-time {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--pia-primary-dark);
  font-size: 10px;
  line-height: 1.35;
  font-weight: 700;
}

.reservation-time :deep(.v-icon) {
  color: var(--pia-primary);
}

.reservation-info h2 {
  margin: 5px 0 2px;
  color: var(--pia-ink);
  font-size: 14px;
  line-height: 1.25;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.reservation-category {
  margin: 0;
  color: var(--pia-muted);
  font-size: 10px;
  line-height: 1.35;
}

.reservation-status {
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  max-width: 112px;
  min-height: 22px;
  margin-left: 2px;
  padding: 4px 7px;
  border-radius: 20px;
  font-size: 8px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: .1px;
  text-align: center;
  white-space: normal;
}

.status-confirmed {
  background: #e2f8ef;
  color: #12835b;
}

.status-pending {
  background: #fff3d8;
  color: #a96500;
}

.status-cancelled {
  background: #ffeaed;
  color: #c53e52;
}

.status-absent {
  background: #eef1f5;
  color: #5d6b7e;
}

.status-default {
  background: #e9f5ff;
  color: #1768a7;
}

/* Profesional y negocio */
.reservation-detail-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 37px;
  margin-top: 12px;
  padding-right: 80px;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 29px;
  width: 29px;
  height: 29px;
  border-radius: 10px;
  background: #edf9f8;
  color: var(--pia-primary-dark);
}

.detail-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.detail-content strong {
  color: var(--pia-ink);
  font-size: 12.5px;
  line-height: 1.3;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.detail-content span {
  margin-top: 3px;
  color: #718494;
  font-size: 10px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.reservation-business-image {
  position: absolute;
  right: 12px;
  bottom: 60px;
  width: 72px;
  height: 66px;
  border-radius: 13px;
  overflow: hidden;
  background: #e8f8f7;
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(23, 53, 75, .12);
  z-index: 2;
}

.reservation-business-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reservation-business-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #087f83;
  background: #e8f8f7;
}

.image-load-error {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Acciones */
.reservation-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  padding-top: 11px;
  border-top: 1px solid #e4efee;
}

.detail-button,
.more-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;
}

.detail-button {
  flex: 1;
  min-width: 0;
  height: 39px;
  gap: 7px;
  border: 1px solid #cfe9e7;
  border-radius: 12px;
  background: #f6fcfb;
  color: var(--pia-primary-dark);
  font-size: 11px;
  font-weight: 800;
}

.detail-button:active,
.more-button:active {
  transform: scale(.98);
}

.detail-button:hover {
  background: #eaf8f6;
}

.more-button {
  flex: 0 0 40px;
  width: 40px;
  height: 39px;
  border: 1px solid #dcebea;
  border-radius: 12px;
  background: #fff;
  color: #527083;
}

.more-button:hover {
  background: #f1f9f8;
  color: var(--pia-primary-dark);
}

/* Estados vacíos, carga y error */
.loading-container {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--pia-muted);
  font-size: 12px;
}

.empty-container {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  text-align: center;
  border: 1px dashed #cce7e5;
  border-radius: 22px;
  background: linear-gradient(145deg, #fff, #f5fbfa);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin-bottom: 14px;
  border-radius: 22px;
  background: var(--pia-primary-soft);
  color: var(--pia-primary);
}

.empty-container h3 {
  margin: 0;
  color: var(--pia-ink);
  font-size: 16px;
  font-weight: 800;
}

.empty-container p {
  margin: 6px 0 0;
  color: var(--pia-muted);
  font-size: 11px;
  line-height: 1.5;
}

.error-container {
  margin-top: 25px;
  padding: 24px 18px;
  text-align: center;
  border: 1px solid #f5dfe2;
  border-radius: 20px;
  background: #fffafb;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 18px;
  background: #fff0f1;
  color: #d84a5b;
}

.error-container h3 {
  margin: 0;
  color: var(--pia-ink);
  font-size: 14px;
  font-weight: 800;
}

.error-container p {
  margin: 7px 0 14px;
  color: var(--pia-muted);
  font-size: 11px;
  line-height: 1.45;
}

.retry-button {
  min-height: 37px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  background: var(--pia-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(7, 157, 160, .18);
}

/* Menú de acciones */
.actions-dialog {
  padding: 16px;
  border: 1px solid #e2efee;
  border-radius: 21px;
  background: #fff;
  box-shadow: 0 18px 55px rgba(23, 53, 75, .16);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.dialog-header h3 {
  margin: 0;
  color: var(--pia-ink);
  font-size: 15px;
  font-weight: 800;
}

.dialog-header button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  border: 0;
  border-radius: 11px;
  background: #eff8f7;
  color: var(--pia-primary-dark);
  cursor: pointer;
}

.dialog-action {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 4px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--pia-ink);
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.dialog-action:hover {
  background: #f7fbfb;
}

.dialog-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border-radius: 12px;
}

.dialog-action-icon.blue {
  background: #e6f7f6;
  color: var(--pia-primary-dark);
}

.dialog-action-icon.red {
  background: #fff0f2;
  color: #d9475c;
}

/* Adaptación móvil */
@media (max-width: 359px) {
  .mis-reservas-page {
    padding-left: 8px;
    padding-right: 8px;
  }

  .reservation-card {
    padding: 11px 9px 10px;
    border-radius: 18px;
  }

  .reservation-main {
    gap: 8px;
  }

  .reservation-date {
    flex-basis: 54px;
    width: 54px;
    height: 60px;
  }

  .date-day {
    font-size: 22px;
  }

  .reservation-info h2 {
    font-size: 13px;
  }

  .reservation-status {
    max-width: 96px;
    padding: 4px 6px;
    font-size: 7px;
  }

  .reservation-detail-row {
    padding-right: 68px;
  }

  .reservation-business-image {
    right: 9px;
    width: 62px;
    height: 58px;
    bottom: 69px;
  }
}

@media (min-width: 600px) {
  .mis-reservas-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px 14px 100px;
  }

  .reservations-list {
    gap: 15px;
  }

  .reservation-card {
    padding: 15px;
  }

  .reservation-business-image {
    right: 15px;
  }
}
</style>
