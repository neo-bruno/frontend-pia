<template>
<div class="reservas-page">

  <!-- =====================================================

         ENCABEZADO

    ====================================================== -->

  <div class="page-header">

    <div>

      <h1 class="page-title">

        Reservas

      </h1>

      <p class="page-subtitle">

        Gestiona las reservas de tus clientes

      </p>

    </div>

    <v-btn icon="mdi-calendar-month-outline" variant="tonal" color="primary" size="small" class="boton-calendario" @click="seleccionarFechaCalendario" />

  </div>

  <!-- =====================================================

         SELECTOR DE DÍAS

    ====================================================== -->

  <div class="dias-wrapper">

    <button v-for="dia in dias" :key="dia.fecha" class="dia-item" :class="{ activo: fechaSeleccionada === dia.fecha }" @click="seleccionarDia(dia.fecha)">

      <span class="dia-nombre">

        {{ dia.nombre }}

      </span>

      <span class="dia-fecha">

        {{ dia.numero }} {{ dia.mes }}

      </span>

      <span class="dia-cantidad">

        {{ cantidadPorDia(dia.fecha) }}

      </span>

    </button>

  </div>

  <!-- =====================================================

         ENCABEZADO DE LA LISTA

    ====================================================== -->

  <div class="lista-header">

    <div>

      <h2>

        {{ tituloFecha }}

      </h2>

      <span>

        {{ reservas.length }}

        {{ reservas.length === 1?"reserva" : "reservas" }}

      </span>

    </div>

  </div>

  <!-- =====================================================

         CARGANDO

    ====================================================== -->

  <div v-if="cargando" class="estado-cargando">

    <v-progress-circular indeterminate color="primary" size="32" />

    <span>

      Cargando reservas...

    </span>

  </div>

  <!-- =====================================================

         LISTA

    ====================================================== -->

  <div v-else-if="reservas.length" class="lista-reservas">

    <v-card v-for="reserva in reservas" :key="reserva.id" class="reserva-card" elevation="0" @click="abrirReserva(reserva)">

      <div class="reserva-contenido">

        <div class="reserva-info">

          <div class="cliente-row">
            <div class="cliente-nombre">
              {{ reserva.cliente_nombre || "Cliente" }}
            </div>

            <v-icon
              icon="mdi-chevron-right"
              size="24"
              class="flecha"
            />
          </div>

          <div class="servicio-nombre">
            {{ reserva.servicio_nombre || "Servicio" }}
          </div>

          <div class="servicio-meta">
            {{ reserva.servicio_duracion || 0 }} min
            <span>•</span>
            Bs. {{ formatearMonto(reserva.precio_aplicable) }}
          </div>

          <div class="estado-wrapper">
            <v-chip
              size="small"
              variant="flat"
              :class="claseEstado(reserva)"
            >
              {{ textoEstado(reserva) }}
            </v-chip>
          </div>

        </div>

        <div class="reserva-hora-col">
          <span class="notificacion-dot"></span>
          <strong class="reserva-hora-text">{{ formatearHora(reserva.hora_inicio) }}</strong>
        </div>

      </div>

    </v-card>

  </div>

  <!-- =====================================================

         ESTADO VACÍO

    ====================================================== -->

  <v-card v-else class="estado-vacio" elevation="0">

    <div class="estado-vacio-icono">

      <v-icon icon="mdi-calendar-check-outline" size="42" />

    </div>

    <h2>

      No tienes reservas

    </h2>

    <p>

      No hay reservas pendientes o confirmadas

      para {{ tituloFecha.toLowerCase() }}.

    </p>

  </v-card>

  <!-- =====================================================

         OVERLAY

    ====================================================== -->

  <v-overlay v-model="cargando" class="align-center justify-center" contained persistent>

    <v-progress-circular indeterminate color="primary" size="42" />

  </v-overlay>

</div>
</template>

<script>
import { useNotificationAdminStore } from "@/stores/notificacionAdmin.store.js";
import {

  getReservations,

} from "../services/reserva.api.js";

export default {

  name: "ReservasAdminPage",

  data() {

    return {

      reservas: [],

      cargando: false,

      fechaSeleccionada: "",

      numero_dias: 10,

      dias: [],

    };

  },

  computed: {

    // ======================================================

    // TÍTULO DE LA FECHA

    // ======================================================

    tituloFecha() {

      const dia = this.dias.find(

        (item) =>

        item.fecha === this.fechaSeleccionada,

      );

      if (!dia) {

        return "Reservas";

      }

      if (dia.esHoy) {

        return "Reservas de hoy";

      }

      if (dia.esManana) {

        return "Reservas de mañana";

      }

      return `Reservas del ${dia.nombreCompleto}`;

    },

  },

  methods: {

    // ======================================================

    // GENERAR DÍAS

    // ======================================================

    generarDias() {

      const hoy = new Date();

      const dias = [];

      for (let i = 0; i < this.numero_dias; i++) {

        const fecha = new Date(hoy);

        fecha.setDate(

          hoy.getDate() + i,

        );

        const fechaApi =

          this.formatearFechaApi(fecha);

        dias.push({

          fecha: fechaApi,

          nombre: i === 0 ?

            "Hoy" :

            i === 1 ?

            "Mañana" :

            fecha.toLocaleDateString(

              "es-BO", {

                weekday: "short",

              },

            ).replace(".", ""),

          nombreCompleto: fecha.toLocaleDateString(

            "es-BO", {

              weekday: "long",

              day: "numeric",

              month: "long",

            },

          ),

          numero: String(

            fecha.getDate(),

          ).padStart(2, "0"),

          mes: fecha.toLocaleDateString(

            "es-BO", {

              month: "short",

            },

          ).replace(".", ""),

          esHoy: i === 0,

          esManana: i === 1,

        });

      }

      this.dias = dias;

      this.fechaSeleccionada =

        dias[0]?.fecha || "";

    },

    // ======================================================

    // FECHA PARA API

    // ======================================================

    formatearFechaApi(fecha) {

      const year =

        fecha.getFullYear();

      const month =

        String(

          fecha.getMonth() + 1,

        ).padStart(2, "0");

      const day =

        String(

          fecha.getDate(),

        ).padStart(2, "0");

      return `${year}-${month}-${day}`;

    },

    // ======================================================

    // SELECCIONAR DÍA

    // ======================================================

    async seleccionarDia(fecha) {

      if (

        this.fechaSeleccionada === fecha &&

        this.reservas.length

      ) {

        return;

      }

      this.fechaSeleccionada = fecha;

      await this.cargarReservas();

    },

    // ======================================================

    // CARGAR RESERVAS

    // ======================================================

    async cargarReservas() {

      this.cargando = true;

      try {
        const store = useNotificationAdminStore();

        await store.cargarNoLeidas();
        console.log("TOKEN ACTUAL:", localStorage.getItem("token"));
        const token = localStorage.getItem("token");

        console.log("TOKEN ADMIN:", token ? token.substring(0, 30) + "..." : "NO EXISTE");

        console.log('CANTIDAD DE NOTIFICACIONES NO LEIDAS: ', store.cantidadNoLeidas);

        const res = await getReservations(this.fechaSeleccionada);

        if (res.data?.ok) {
          this.reservas = Array.isArray(res.data.data) ? res.data.data : [];
        } else {
          this.reservas = [];
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        this.reservas = [];
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudieron cargar las reservas.",
        );
      } finally {
        this.cargando = false;
      }
    },

    // ======================================================

    // HORA

    // ======================================================

    formatearHora(hora) {

      if (!hora) {

        return "--:--";

      }

      return hora.substring(0, 5);

    },

    // ======================================================

    // MONTO

    // ======================================================

    formatearMonto(monto) {

      return Number(

        monto || 0,

      ).toFixed(2);

    },

    // ======================================================

    // INICIALES CLIENTE

    // ======================================================

    inicialesCliente(nombre) {

      if (!nombre) {

        return "CL";

      }

      const partes =

        nombre

        .trim()

        .split(/\s+/);

      if (partes.length === 1) {

        return partes[0]

          .substring(0, 2)

          .toUpperCase();

      }

      return (

        partes[0][0] +

        partes[1][0]

      ).toUpperCase();

    },

    // ======================================================

    // ESTADO

    // ======================================================

    textoEstado(reserva) {

      if (

        reserva.estado === "PENDIENTE" &&

        Number(reserva.saldo || 0) > 0 &&

        !reserva.comprobante_id

      ) {

        return "PENDIENTE PAGO";

      }

      if (reserva.estado === "PENDIENTE") {

        return "PENDIENTE";

      }

      if (reserva.estado === "CONFIRMADA") {

        return "CONFIRMADA";

      }

      return reserva.estado || "";

    },

    claseEstado(reserva) {

      if (

        reserva.estado === "CONFIRMADA"

      ) {

        return "estado-confirmada";

      }

      if (

        reserva.estado === "PENDIENTE"

      ) {

        return "estado-pendiente";

      }

      return "";

    },

    // ======================================================

    // CANTIDAD

    // ======================================================

    cantidadPorDia(fecha) {

      if (

        fecha === this.fechaSeleccionada

      ) {

        return this.reservas.length;

      }

      return "—";

    },

    // ======================================================

    // ABRIR RESERVA

    // ======================================================

    abrirReserva(reserva) {

      console.log(

        "Reserva seleccionada:",

        reserva,

      );

      // Próximo paso:

      // abrir el detalle de la reserva.

    },

    // ======================================================

    // CALENDARIO

    // ======================================================

    seleccionarFechaCalendario() {

      // Lo implementaremos después

      // con el selector de fecha de PIA.

    },

  },

  mounted() {

    this.generarDias();

    this.cargarReservas();

  },

};
</script>

<style lang="scss" scoped>
.reservas-page {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 8px 10px 90px;
  color: #102a43;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
  color: #102a43;
}

.page-subtitle {
  margin: 3px 0 0;
  font-size: 11px;
  line-height: 1.2;
  color: #627d98;
}

.boton-calendario {
  flex-shrink: 0;
}

.dias-wrapper {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding: 0 0 8px;
  scrollbar-width: none;
}

.dias-wrapper::-webkit-scrollbar {
  display: none;
}

.dia-item {
  flex: 0 0 78px;
  min-height: 64px;
  border: 0;
  border-radius: 12px;
  background: #edf3f8;
  color: #102a43;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

.dia-item.activo {
  background: #0f9b9d;
  color: white;
  box-shadow: 0 4px 12px rgba(15, 155, 157, 0.18);
}

.dia-nombre {
  font-size: 12px;
  font-weight: 600;
}

.dia-fecha {
  margin-top: 2px;
  font-size: 12px;
}

.dia-cantidad {
  margin-top: 2px;
  font-size: 11px;
  opacity: 0.8;
}

.lista-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 8px;
}

.lista-header h2 {
  margin: 0;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 700;
  color: #102a43;
}

.lista-header span {
  font-size: 12px;
  color: #627d98;
}

.lista-reservas {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reserva-card {
  position: relative;
  display: block;
  min-height: 104px;
  padding: 12px;
  border-radius: 14px !important;
  background: #ffffff;
  border: 1px solid #edf2f5;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s;
}

.reserva-card:active {
  transform: scale(0.99);
}

.reserva-contenido {
  display: flex;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  min-height: 78px;
}

.reserva-info {
  flex: 1;
  min-width: 0;
}

.reserva-info {
  position: relative;
  width: 100%;
  flex: 1 1 auto;
  min-width: 0;
}

.cliente-row {
  position: static;
  display: block;
  width: 100%;
  padding-right: 28px;
}

.cliente-nombre {
  width: 100%;
  min-width: 0;
  font-size: 15px;
  line-height: 1.2;
  font-weight: 700;
  color: #102a43;
  white-space: normal;
  overflow-wrap: anywhere;
}

.flecha {
  position: absolute !important;
  top: 5px !important;
  right: -50px !important;
  margin: 0 !important;
  color: #102a43;
}

.servicio-nombre {
  margin-top: 3px;  
  font-size: 13px;
  line-height: 1.2;
  color: #243b53;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.servicio-meta {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.2;
  color: #627d98;
}

.servicio-meta span {
  margin: 0 3px;
}

.estado-wrapper {
  margin-top: 6px;
}

.estado-confirmada {
  background: #d9f8e7 !important;
  color: #15803d !important;
  font-size: 10px !important;
  font-weight: 700;
}

.estado-pendiente {
  background: #fff0cc !important;
  color: #d97706 !important;
  font-size: 10px !important;
  font-weight: 700;
}

.reserva-hora-col {
  width: 50px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 10px;
}

.notificacion-dot {
  width: 8px;
  height: 8px;
  margin-bottom: 10px;
  border-radius: 50%;
  background: #ef233c;
}

.reserva-hora-text {
  color: #102a43;
  font-size: 15px;
  line-height: 1;
  font-weight: 700;
}

.estado-vacio {

  margin-top: 20px;

  padding: 40px 20px;

  text-align: center;

  border-radius: 16px !important;

  border: 1px solid #edf2f5;

}

.estado-vacio-icono {

  width: 68px;

  height: 68px;

  margin: 0 auto 14px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #edf7f7;

  color: #0f9b9d;

}

.estado-vacio h2 {

  margin: 0;

  font-size: 17px;

}

.estado-vacio p {

  margin: 8px auto 0;

  max-width: 280px;

  font-size: 12px;

  line-height: 1.5;

  color: #627d98;

}

/* ==========================================================

   CARGANDO

   ========================================================== */

.estado-cargando {

  min-height: 250px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  color: #627d98;

  font-size: 12px;

}

/* ==========================================================

   MÓVIL

   ========================================================== */

@media (max-width: 600px) {

  .reservas-page {

    max-width: 100%;

    padding-left: 10px;

    padding-right: 10px;

  }

  .reserva-card {

    min-height: 104px;

  }
}
</style>
