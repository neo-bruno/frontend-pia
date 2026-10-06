<template>
<div class="historial-page">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->
  <section class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Historial de Reservas</h1>
      <p>Consulta tus reservas anteriores</p>
    </div>
  </section>

  <!-- =====================================================
         LOADING
    ====================================================== -->
  <section v-if="loading" class="loading-container">
    <v-progress-circular indeterminate size="32" width="3" />
    <span>Cargando historial...</span>
  </section>

  <!-- =====================================================
         ERROR
    ====================================================== -->
  <section v-else-if="error" class="error-container">
    <div class="error-icon">
      <v-icon size="25">mdi-alert-circle-outline</v-icon>
    </div>

    <h3>No pudimos cargar tu historial</h3>
    <p>{{ error }}</p>

    <button type="button" class="retry-button" @click="cargarHistorial">
      Intentar nuevamente
    </button>
  </section>

  <!-- =====================================================
         SIN HISTORIAL
    ====================================================== -->
  <section v-else-if="reservasHistorial.length === 0" class="empty-container">
    <div class="empty-icon">
      <v-icon size="34">mdi-history</v-icon>
    </div>

    <h3>No tienes reservas en tu historial</h3>

    <p>
      Aquí aparecerán tus reservas completadas,
      canceladas o cuando no hayas asistido.
    </p>
  </section>

  <!-- =====================================================
         HISTORIAL
    ====================================================== -->
  <section v-else class="history-list">

    <article v-for="reserva in reservasHistorial" :key="reserva.id" class="history-card" :style="{
          '--business-color': reserva.color1,
          '--business-light': reserva.color2,
          '--business-dark': reserva.color3
        }" @click="verDetalle(reserva)">

      <!-- FECHA -->
      <div class="history-date" :class="getDateClass(reserva.estado)">
        <div class="date-day">
          {{ getReservationDay(reserva) }}
        </div>

        <div class="date-month">
          {{ getReservationMonth(reserva) }}
        </div>
      </div>

      <!-- INFORMACIÓN -->
      <div class="history-info">

        <div class="history-time">
          <v-icon size="14">
            mdi-clock-outline
          </v-icon>

          <span>
            {{ formatTime(reserva.horaInicio) }}
            <template v-if="reserva.horaFin">
              - {{ formatTime(reserva.horaFin) }}
            </template>
          </span>
        </div>

        <h2>
          {{ reserva.servicio }}
        </h2>

        <p v-if="reserva.categoria" class="history-category">
          {{ reserva.categoria }}
        </p>

        <div class="history-business">
          {{ reserva.negocio }}
        </div>
      </div>

      <!-- ESTADO -->
      <div class="history-status" :class="getStatusClass(reserva.estado)">
        <v-icon size="12">
          {{ getStatusIcon(reserva.estado) }}
        </v-icon>

        <span>
          {{ getStatusLabel(reserva.estado) }}
        </span>
      </div>

      <!-- IMAGEN DEL NEGOCIO -->
      <div class="history-business-image">
        <img v-if="reserva.imagen" :src="getMediaUrl(reserva.imagen)" :alt="reserva.negocio" @error="handleImageError" />

        <div v-else class="history-business-placeholder">
          <v-icon size="25">
            mdi-storefront-outline
          </v-icon>
        </div>
      </div>

      <!-- FLECHA -->
      <div class="history-arrow">
        <v-icon size="22">
          mdi-chevron-right
        </v-icon>
      </div>

    </article>

  </section>

</div>
</template>

<script>
import {
  getReservations
} from "../services/reserva.api";

export default {
  name: "HistorialReservasPage",

  data() {
    return {
      loading: false,
      error: null,
      reservas: [],
    };
  },

  computed: {
    /*
     * El historial SOLO contiene:
     *
     * COMPLETADA
     * CANCELADA
     * NO ASISTIO
     */
    reservasHistorial() {
      return this.reservas.filter((reserva) => {
        const estado = this.normalizarEstado(
          reserva.estado
        );

        return [
          "COMPLETADA",
          "CANCELADA",
          "NO_ASISTIO",
        ].includes(estado);
      });
    },
  },

  mounted() {
    this.cargarHistorial();
  },

  methods: {

    // ============================================================
    // CARGAR RESERVAS
    // ============================================================
    async cargarHistorial() {
      this.loading = true;
      this.error = null;

      try {
        const response = await getReservations();

        console.log(
          "RESPUESTA HISTORIAL:",
          JSON.stringify(response?.data, null, 2)
        );

        const data =
          response?.data?.data??
          response?.data?? [];

        const lista = Array.isArray(data) ?
          data :
          (
            data?.reservas ||
            data?.rows ||
            data?.items || []
          );

        this.reservas = lista.map((reserva) => {
          return this.normalizarReserva(reserva);
        });

      } catch (error) {
        console.error(
          "ERROR CARGANDO HISTORIAL:",
          error
        );

        this.error =
          error?.response?.data?.message ||
          error?.message ||
          "No se pudo cargar el historial.";

      } finally {
        this.loading = false;
      }
    },

    // ============================================================
    // NORMALIZAR RESERVA
    // ============================================================
    normalizarReserva(reserva) {
      const fecha =
        reserva?.fecha ||
        reserva?.fecha_reserva ||
        reserva?.fechaReserva ||
        reserva?.fecha_inicio ||
        null;

      const fechaTexto = fecha ?
        String(fecha).substring(0, 10) :
        null;

      return {
        ...reserva,

        id: reserva?.id ||
          reserva?.reserva_id,

        fecha: fechaTexto,

        horaInicio: reserva?.hora_inicio ||
          reserva?.horaInicio ||
          reserva?.hora ||
          "",

        horaFin: reserva?.hora_fin ||
          reserva?.horaFin ||
          "",

        servicio: reserva?.servicio_nombre ||
          reserva?.servicio?.nombre ||
          (
            typeof reserva?.servicio === "string" ?
            reserva.servicio :
            ""
          ) ||
          "Servicio",

        categoria: reserva?.categoria_nombre ||
          reserva?.categoria ||
          reserva?.servicio?.categoria?.nombre ||
          "",

        profesional: reserva?.profesional_nombre ||
          reserva?.profesional?.nombre_completo ||
          reserva?.profesional?.nombre ||
          "Profesional",

        negocio: reserva?.negocio_nombre ||
          reserva?.negocio?.nombre ||
          (
            typeof reserva?.negocio === "string" ?
            reserva.negocio :
            ""
          ) ||
          "Negocio",

        direccion: reserva?.negocio_direccion ||
          reserva?.negocio?.direccion ||
          reserva?.direccion ||
          "",

        estado: reserva?.estado ||
          reserva?.estado_reserva ||
          "PENDIENTE",

        /*
         * IMPORTANTE:
         * La imagen pertenece al NEGOCIO.
         * No usamos la foto del profesional.
         */
        imagen: reserva?.negocio?.portada ||
          reserva?.negocio?.logo ||
          reserva?.negocio_imagen ||
          reserva?.imagen_url ||
          reserva?.imagen ||
          null,

        color1: reserva?.negocio?.color_1 ||
          reserva?.negocio?.color1 ||
          reserva?.color1 ||
          "#079DAF",

        color2: reserva?.negocio?.color_2 ||
          reserva?.negocio?.color2 ||
          reserva?.color2 ||
          "#E9F8F9",

        color3: reserva?.negocio?.color_3 ||
          reserva?.negocio?.color3 ||
          reserva?.color3 ||
          "#102D5A",
      };
    },

    // ============================================================
    // NORMALIZAR ESTADO
    // ============================================================
    normalizarEstado(estado) {
      const value = String(
          estado || ""
        )
        .trim()
        .toUpperCase();

      if (
        value === "FINALIZADA" ||
        value === "COMPLETADA"
      ) {
        return "COMPLETADA";
      }

      if (
        value === "CANCELADA" ||
        value === "CANCELADO"
      ) {
        return "CANCELADA";
      }

      if (
        value === "NO_ASISTIO" ||
        value === "NO ASISTIO" ||
        value === "NO ASISTIÓ"
      ) {
        return "NO_ASISTIO";
      }

      return value;
    },

    // ============================================================
    // FECHA
    // ============================================================
    getReservationDay(reserva) {
      if (!reserva?.fecha) {
        return "--";
      }

      const partes = String(
          reserva.fecha
        )
        .substring(0, 10)
        .split("-");

      return partes[2] || "--";
    },

    getReservationMonth(reserva) {
      if (!reserva?.fecha) {
        return "--";
      }

      const partes = String(
          reserva.fecha
        )
        .substring(0, 10)
        .split("-");

      const numeroMes = Number(
        partes[1]
      );

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

      return meses[numeroMes - 1] || "--";
    },

    // ============================================================
    // HORA
    // ============================================================
    formatTime(hora) {
      if (!hora) {
        return "--:--";
      }

      return String(hora).substring(0, 5);
    },

    // ============================================================
    // ESTADO
    // ============================================================
    getStatusLabel(estado) {
      const value =
        this.normalizarEstado(estado);

      const labels = {
        COMPLETADA: "COMPLETADA",
        CANCELADA: "CANCELADA",
        NO_ASISTIO: "NO ASISTIÓ",
      };

      return labels[value] || value;
    },

    getStatusClass(estado) {
      const value =
        this.normalizarEstado(estado);

      if (value === "COMPLETADA") {
        return "status-completed";
      }

      if (value === "CANCELADA") {
        return "status-cancelled";
      }

      if (value === "NO_ASISTIO") {
        return "status-absent";
      }

      return "status-default";
    },

    getStatusIcon(estado) {
      const value =
        this.normalizarEstado(estado);

      if (value === "COMPLETADA") {
        return "mdi-check-circle";
      }

      if (value === "CANCELADA") {
        return "mdi-close-circle";
      }

      if (value === "NO_ASISTIO") {
        return "mdi-close-circle";
      }

      return "mdi-information-outline";
    },

    getDateClass(estado) {
      const value =
        this.normalizarEstado(estado);

      if (value === "COMPLETADA") {
        return "date-completed";
      }

      if (value === "CANCELADA") {
        return "date-cancelled";
      }

      if (value === "NO_ASISTIO") {
        return "date-absent";
      }

      return "date-default";
    },

    // ============================================================
    // DETALLE
    // ============================================================
    verDetalle(reserva) {
      if (!reserva?.id) {
        return;
      }

      this.$router.push(
        `/cliente/reservas/${reserva.id}`
      );
    },

    // ============================================================
    // IMAGEN
    // ============================================================
    getMediaUrl(path) {
      if (!path) {
        return "";
      }

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

      if (!img) {
        return;
      }

      img.style.display = "none";

      const parent = img.parentElement;

      if (parent) {
        parent.classList.add(
          "image-load-error"
        );
      }
    },

    // ============================================================
    // VOLVER
    // ============================================================
    volver() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
/* ==========================================================
   CONTENEDOR
========================================================== */

.historial-page {
  width: 100%;
  max-width: 100%;

  padding: 10px 10px 95px;

  box-sizing: border-box;
}

/* ==========================================================
   HEADER
========================================================== */

.page-header {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 14px;
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
  min-width: 0;
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

  color: #60779a;

  font-size: 11px;
  line-height: 1.35;
}

/* ==========================================================
   LISTA
========================================================== */

.history-list {
  display: flex;
  flex-direction: column;

  gap: 9px;
}

/* ==========================================================
   CARD
========================================================== */

.history-card {
  --business-color: #079daf;
  --business-light: #e9f8f9;
  --business-dark: #102d5a;

  position: relative;

  min-height: 91px;

  display: flex;
  align-items: flex-start;

  padding: 10px 37px 10px 10px;

  background: #ffffff;

  border: 1px solid #e7edf3;
  border-radius: 16px;

  box-sizing: border-box;

  box-shadow:
    0 4px 14px rgba(16, 45, 90, 0.06);

  cursor: pointer;

  overflow: hidden;

  transition: transform 0.15s ease,
    box-shadow 0.15s ease;
}

.history-card:active {
  transform: scale(0.99);
}

/* ==========================================================
   FECHA
========================================================== */

.history-date {
  width: 54px;
  height: 58px;
  min-width: 54px;

  margin-right: 9px;

  border-radius: 12px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
}

.date-day {
  font-size: 22px;
  line-height: 21px;
  font-weight: 800;
}

.date-month {
  margin-top: 2px;

  font-size: 9px;
  line-height: 10px;
  font-weight: 700;
}

.date-completed {
  background: var(--business-light);
  color: var(--business-color);
}

.date-cancelled {
  background: #fde8ed;
  color: #dc3e58;
}

.date-absent {
  background: #eef1f5;
  color: #52677f;
}

.date-default {
  background: #edf5ff;
  color: #1673d1;
}

/* ==========================================================
   INFORMACIÓN
========================================================== */

.history-info {
  min-width: 0;

  flex: 1;

  padding-top: 1px;
  padding-right: 56px;
}

.history-time {
  display: flex;
  align-items: center;

  gap: 4px;

  color: var(--business-dark);

  font-size: 9px;
  font-weight: 700;
}

.history-time .v-icon {
  color: var(--business-color);
}

.history-info h2 {
  margin: 3px 0 1px;

  color: var(--business-dark);

  font-size: 13px;
  line-height: 1.15;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-category {
  margin: 0;

  color: #6e819d;

  font-size: 9px;
  line-height: 1.2;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-business {
  margin-top: 5px;

  color: #4e6990;

  font-size: 9px;
  line-height: 1.15;
  font-weight: 600;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==========================================================
   ESTADO
========================================================== */

.history-status {
  position: absolute;

  top: 10px;
  right: 37px;

  display: inline-flex;
  align-items: center;

  gap: 3px;

  min-height: 21px;

  padding: 3px 7px;

  border-radius: 12px;

  font-size: 8px;
  line-height: 1;
  font-weight: 700;

  white-space: nowrap;
}

.status-completed {
  background: #ddf7e9;
  color: #0da05b;
}

.status-cancelled {
  background: #fde7eb;
  color: #d92f48;
}

.status-absent {
  background: #edf0f4;
  color: #596777;
}

.status-default {
  background: #edf5ff;
  color: #1673d1;
}

/* ==========================================================
   IMAGEN DEL NEGOCIO
========================================================== */

.history-business-image {
  position: absolute;

  right: 36px;
  bottom: 10px;

  width: 67px;
  height: 51px;

  border-radius: 9px;

  overflow: hidden;

  background: var(--business-light);

  border: 1px solid rgba(16, 45, 90, 0.05);
}

.history-business-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.history-business-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--business-color);
  background: var(--business-light);
}

.image-load-error {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==========================================================
   FLECHA
========================================================== */

.history-arrow {
  position: absolute;

  right: 7px;
  top: 50%;

  transform: translateY(-50%);

  color: #315b89;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==========================================================
   LOADING
========================================================== */

.loading-container {
  min-height: 250px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #68809f;

  font-size: 11px;
}

/* ==========================================================
   EMPTY
========================================================== */

.empty-container {
  min-height: 280px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 20px;
}

.empty-icon {
  width: 65px;
  height: 65px;

  border-radius: 50%;

  background: #eaf8f9;
  color: #0799aa;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 12px;
}

.empty-container h3 {
  margin: 0;

  color: #173762;

  font-size: 15px;
}

.empty-container p {
  max-width: 270px;

  margin: 5px 0 0;

  color: #71829b;

  font-size: 11px;
  line-height: 1.4;
}

/* ==========================================================
   ERROR
========================================================== */

.error-container {
  margin-top: 30px;

  text-align: center;

  padding: 20px;
}

.error-icon {
  width: 55px;
  height: 55px;

  margin: 0 auto 10px;

  border-radius: 50%;

  background: #fff0f1;
  color: #d84a5b;

  display: flex;
  align-items: center;
  justify-content: center;
}

.error-container h3 {
  margin: 0;

  color: #263d60;

  font-size: 14px;
}

.error-container p {
  margin: 6px 0 12px;

  color: #75849b;

  font-size: 10px;
}

.retry-button {
  height: 34px;

  padding: 0 17px;

  border: none;
  border-radius: 17px;

  background: #079daf;
  color: #ffffff;

  font-size: 11px;
  font-weight: 700;

  cursor: pointer;
}

/* ==========================================================
   RESPONSIVE
========================================================== */

@media (min-width: 600px) {
  .historial-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
