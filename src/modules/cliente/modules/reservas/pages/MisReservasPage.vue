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
        const data = response?.data?.data??response?.data?? [];
        const lista = Array.isArray(data)? data : (data?.reservas || data?.rows || data?.items || []);
        this.reservas = lista.map(
          (reserva) =>
          this.normalizarReserva(reserva),
        );

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

        // Colores personalizados del negocio.
        color1: reserva.negocio?.color_1 ||
          reserva.negocio?.color1 ||
          reserva.color1 ||
          "#079DAF",

        color2: reserva.negocio?.color_2 ||
          reserva.negocio?.color2 ||
          reserva.color2 ||
          "#E9F8F9",

        color3: reserva.negocio?.color_3 ||
          reserva.negocio?.color3 ||
          reserva.color3 ||
          "#102D5A",
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
      this.$router.push({name: 'cliente'});
    },

  },

};
</script>

<style lang="scss" scoped>
/* ==========================================================

   CONTENEDOR

\========================================================== */

.mis-reservas-page {

  width: 100%;

  max-width: 100%;

  padding: 10px 10px 95px;

  box-sizing: border-box;

}

/* ==========================================================

   HEADER

\========================================================== */
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

/* ==========================================================

   LISTA

\========================================================== */

.reservations-list {

  display: flex;

  flex-direction: column;

  gap: 10px;

}

/* ==========================================================

   CARD

\========================================================== */

.reservation-card {
  --business-color: #079daf;
  --business-light: #e9f8f9;
  --business-dark: #102d5a;

  position: relative;
  background: #ffffff;
  border: 1px solid #e7edf3;
  border-radius: 18px;
  padding: 11px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 5px 18px rgba(16, 45, 90, 0.07);
}

/* ==========================================================

   PARTE PRINCIPAL

\========================================================== */

.reservation-main {

  position: relative;

  display: flex;

  gap: 9px;

  padding-right: 4px;

  min-height: 62px;

}

/* ==========================================================

   FECHA

\========================================================== */

.reservation-date {

  width: 61px;

  height: 61px;

  min-width: 61px;

  border-radius: 13px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

}

.date-default {

  background: #e9f8f9;

  color: #078da0;

}

.date-pending {

  background: #fff4d9;

  color: #ca7200;

}

.date-cancelled {

  background: #fdebed;

  color: #dc4b5b;

}

.date-day {

  font-size: 23px;

  line-height: 22px;

  font-weight: 800;

}

.date-month {

  margin-top: 2px;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: .4px;

}

/* ==========================================================

   INFORMACIÓN

\========================================================== */

.reservation-info {

  min-width: 0;

  padding-top: 1px;

  padding-right: 72px;

}

.reservation-time {

  display: flex;

  align-items: center;

  gap: 4px;

  color: #173e6d;

  font-size: 10px;

  font-weight: 600;

}

.reservation-info h2 {

  margin: 4px 0 1px;

  color: #112f5d;

  font-size: 14px;

  line-height: 1.15;

  font-weight: 700;

}

.reservation-category {

  margin: 0;

  color: #6a7e9e;

  font-size: 10px;

  line-height: 1.25;

}

/* ==========================================================

   ESTADO

\========================================================== */

.reservation-status {

  position: absolute;

  top: 0;

  right: 0;

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

   DETALLES

\========================================================== */

.reservation-detail-row {

  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 9px;

  padding-right: 86px;
  min-height: 30px;
}

.detail-icon {

  width: 28px;

  min-width: 28px;

  height: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #41638d;

}

.detail-content {

  min-width: 0;

  display: flex;

  flex-direction: column;

}

.detail-content strong {

  color: #193963;

  font-size: 11px;

  line-height: 1.2;

  font-weight: 700;

}

.detail-content span {

  color: #7385a0;

  font-size: 9px;

  line-height: 1.25;

}

/* ==========================================================

   IMAGEN

\========================================================== */

.reservation-business-image {
  position: absolute;
  right: 11px;
  bottom: 59px;
  width: 75px;
  height: 65px;
  border-radius: 11px;
  overflow: hidden;
  background: var(--business-light);
  border: 1px solid rgba(16, 45, 90, 0.05);
  z-index: 2;
}

.reservation-business-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.reservation-business-placeholder {
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

   ACCIONES

\========================================================== */

.reservation-actions {

  display: flex;

  gap: 7px;

  margin-top: 10px;

}

.detail-button {

  flex: 1;

  height: 38px;

  border-radius: 11px;

  border: 1px solid #e1e8f1;

  background: #ffffff;

  color: #0799aa;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;

}

.more-button {

  width: 39px;

  height: 38px;

  min-width: 39px;

  border-radius: 11px;

  border: 1px solid #e1e8f1;

  background: #ffffff;

  color: #31547e;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

}

/* ==========================================================

   LOADING

\========================================================== */

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

\========================================================== */

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

  margin: 5px 0 0;

  color: #71829b;

  font-size: 11px;

}

/* ==========================================================

   ERROR

\========================================================== */

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

  color: white;

  font-size: 11px;

  font-weight: 700;

}

/* ==========================================================

   DIALOG

\========================================================== */

.actions-dialog {

  background: white;

  border-radius: 18px;

  padding: 15px;

}

.dialog-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 8px;

}

.dialog-header h3 {

  margin: 0;

  color: #173762;

  font-size: 15px;

}

.dialog-header button {

  width: 32px;

  height: 32px;

  border: none;

  background: #f1f4f8;

  border-radius: 50%;

  color: #536a89;

}

.dialog-action {

  width: 100%;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 9px 4px;

  border: none;

  background: transparent;

  color: #193a64;

  font-size: 12px;

  font-weight: 600;

  text-align: left;

}

.dialog-action-icon {

  width: 37px;

  height: 37px;

  border-radius: 11px;

  display: flex;

  align-items: center;

  justify-content: center;

}

.dialog-action-icon.blue {

  background: #eaf4ff;

  color: #1473d1;

}

.dialog-action-icon.red {

  background: #fff0f2;

  color: #d9475c;

}

/* ==========================================================

   RESPONSIVE

\========================================================== */

@media (min-width: 600px) {

  .mis-reservas-page {

    max-width: 600px;

    margin: 0 auto;

  }

}
</style>
