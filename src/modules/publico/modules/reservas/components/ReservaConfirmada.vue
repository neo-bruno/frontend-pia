<template>
<div class="reserva-confirmada-page">
  <!-- HEADER -->
  <div class="header">
    <button class="header-btn" @click="volver">
      <v-icon size="30">mdi-arrow-left</v-icon>
    </button>

    <div class="logo">PIA</div>

    <button class="header-btn">
      <v-icon size="28">mdi-heart-outline</v-icon>
    </button>
  </div>

  <!-- CONTENIDO -->
  <div class="contenido">

    <!-- CONFETI -->
    <div class="confeti">
      <span class="confeti-item c1"></span>
      <span class="confeti-item c2"></span>
      <span class="confeti-item c3"></span>
      <span class="confeti-item c4"></span>
      <span class="confeti-item c5"></span>
      <span class="confeti-item c6"></span>
      <span class="confeti-item c7"></span>
      <span class="confeti-item c8"></span>
    </div>

    <!-- CHECK -->
    <div class="check-circle">
      <v-icon size="48">mdi-check</v-icon>
    </div>

    <!-- TITULO -->
    <h1>¡Reserva confirmada!</h1>

    <p class="subtitulo">
      Tu cita ha sido registrada<br />
      correctamente.
    </p>

    <!-- TARJETA RESERVA -->
    <div class="reserva-card">

      <div class="reserva-icon">
        <v-icon size="34">mdi-calendar-month</v-icon>
      </div>

      <div class="reserva-info">

        <div class="reserva-numero">
          Reserva #{{ numeroReserva }}
        </div>

        <div class="estado">
          CONFIRMADA
        </div>

        <p v-if="reserva?.condicion?.id">
          Hemos recibido tu comprobante de pago.
          Tu reserva está confirmada.
        </p>
        <p v-else>
          Ha realizado todos los pasos para reservar.
          Tu reserva está confirmada.
        </p>

      </div>
    </div>

    <!-- FECHA -->
    <div class="detalle">
      <div class="detalle-icon">
        <v-icon size="27">mdi-calendar-outline</v-icon>
      </div>

      <div class="detalle-text">
        <strong>
          Fecha 
        </strong>
        <span>
          {{ fechaFormateada }}
        </span>
      </div>
    </div>

    <!-- HORA -->
    <div class="detalle">
      <div class="detalle-icon">
        <v-icon size="29">mdi-clock-outline</v-icon>
      </div>

      <div class="detalle-text">
        <strong>
          {{ horaInicio }} – {{ horaFin }}
        </strong>

        <span class="duracion">
          ({{ duracion }} horas)
        </span>
      </div>
    </div>

    <!-- SERVICIO -->
    <div class="detalle">
      <div class="detalle-icon">
        <v-icon size="31">mdi-content-cut</v-icon>
      </div>

      <div class="detalle-text">
        <strong>
          {{ servicioNombre }}
        </strong>

        <span>
          {{ duracionMinutos }} minutos
        </span>
      </div>
    </div>

    <!-- PROFESIONAL -->
    <div class="detalle">
      <div class="detalle-icon">
        <v-icon size="32">mdi-account</v-icon>
      </div>

      <div class="detalle-text">
        <strong>
          {{ profesionalNombre }}
        </strong>

        <span>
          Profesional de belleza
        </span>
      </div>
    </div>
    
    <!-- NEGOCIO -->
    <div class="detalle">
      <div class="detalle-icon">
        <v-icon size="32">mdi-map-marker</v-icon>
      </div>

      <div class="detalle-text">
        <strong>
          {{ negocioNombre }}
        </strong>

        <span>
          {{ negocioDireccion }}
        </span>
      </div>
    </div>

    <!-- RECORDATORIO -->
    <div class="recordatorio">

      <div class="recordatorio-icon">
        <v-icon size="27">mdi-check</v-icon>
      </div>

      <div>
        Te enviaremos un recordatorio antes
        de tu cita. Puedes ver el estado de
        tu reserva en tu panel de cliente.
      </div>

    </div>

    <!-- BOTON RESERVAS -->
    <button class="btn-reservas" @click="verMisReservas">
      <v-icon size="27">
        mdi-calendar-month
      </v-icon>

      <span>
        Ver mis reservas
      </span>

      <v-icon size="30">
        mdi-arrow-right
      </v-icon>
    </button>

    <!-- VOLVER -->
    <button class="btn-inicio" @click="volverInicio">
      <v-icon size="22">
        mdi-home
      </v-icon>

      <span>
        Volver al inicio
      </span>
    </button>

    <!-- AGRADECIMIENTO -->
    <div class="agradecimiento">

      <div class="agradecimiento-img">
        <div class="mujer">
          <v-icon size="105">
            mdi-face-woman
          </v-icon>

          <span class="corazon">
            <v-icon color="primary">mdi-heart</v-icon>
          </span>
        </div>
      </div>

      <h2>
        Gracias por confiar en PIA
      </h2>

      <p>
        Tu belleza, en buenas manos
      </p>

      <div class="pia-final">
        PIA
      </div>

    </div>

  </div>

  <!-- PASO -->
  <div class="paso-final">

    <div class="linea"></div>

    <div class="paso-circulo">
      3
    </div>

    <div class="linea"></div>

    <div class="paso-texto">
      ¡Listo! Tu reserva está confirmada
    </div>

  </div>

</div>
</template>

<script>
import { useReservaStore } from '@/stores/reserva.store';
import { formatearFecha } from '@/utils/ayuda';

export default {

  name: "ReservaConfirmada",

  data() {
    return {
      reservaStore: useReservaStore(),
    };
  },

  computed: {

    reserva() {
      return this.reservaStore.cargarReserva();
    },

    fechaFormateada() {
      return this.formatearFecha(
        this.reserva?.fecha,
        "dddd, D [de] MMMM [de] YYYY"
      );
    },

    numeroReserva() {
      if (!this.reserva) return "000000";

      return String(
        this.reserva.numero || this.reserva.id || 0
      ).padStart(6, "0");
    },

    horaInicio() {
      return this.formatearHora(
        this.reserva?.hora_inicio
      );
    },

    horaFin() {
      return this.formatearHora(
        this.reserva?.hora_fin
      );
    },

    duracionMinutos() {

      if (this.reserva?.servicio?.duracion) {
        return this.reserva.servicio.duracion;
      }

      if (
        this.reserva?.hora_inicio &&
        this.reserva?.hora_fin
      ) {
        const inicio =
          this.convertirMinutos(
            this.reserva.hora_inicio
          );

        const fin =
          this.convertirMinutos(
            this.reserva.hora_fin
          );

        return fin - inicio;
      }

      return 0;
    },

    duracion() {

      const minutos = this.duracionMinutos;

      if (!minutos) return "0";

      const horas = minutos / 60;

      return Number.isInteger(horas) ?
        horas :
        horas.toFixed(1);
    },

    servicioNombre() {
      return (
        this.reserva?.servicio?.nombre ||
        "Servicio"
      );
    },

    profesionalNombre() {
      return (
        this.reserva?.profesional?.nombre ||
        "Profesional"
      );
    },

    negocioNombre() {
      return (
        this.reserva?.negocio?.nombre ||
        this.reserva?.negocio_nombre ||
        "PIA Beauty Studio"
      );
    },

    negocioDireccion() {
      return (
        this.reserva?.negocio?.direccion ||
        this.reserva?.negocio_direccion ||
        ""
      );
    },
  },

  mounted() {

    if (!this.reserva) {
      this.$router.replace("/");
    }

  },

  methods: {  
    formatearFecha,

    formatearHora(hora) {

      if (!hora) return "";

      return hora.substring(0, 5);
    },

    convertirMinutos(hora) {

      const [h, m] = hora
        .split(":")
        .map(Number);

      return h * 60 + m;
    },

    verMisReservas() {

      this.$router.push({
        name: "cliente.reservas",
      });

    },

    volverInicio() {

      this.reservaStore.limpiarReserva();

      this.$router.push("/");

    },

    volver() {

      this.$router.back();

    },

  },
};
</script>

<style lang="scss" scoped>
.reserva-confirmada-page {
  min-height: 100vh;
  background: #ffffff;
  color: #303030;
  font-family: Arial, sans-serif;
}

/* =========================
   HEADER
========================= */

.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e5edf5;
  background: #fff;
}

.header-btn {
  width: 42px;
  height: 42px;
  border: none;
  background: transparent;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logo {
  font-size: 34px;
  font-weight: 900;
  color: #08a4a9;
  letter-spacing: -2px;
}

/* =========================
   CONTENIDO
========================= */

.contenido {
  max-width: 370px;
  margin: 0 auto;
  padding: 25px 20px 10px;
  position: relative;
}

/* =========================
   CONFETI
========================= */

.confeti {
  height: 48px;
  position: relative;
}

.confeti-item {
  position: absolute;
  width: 7px;
  height: 13px;
  border-radius: 1px;
}

.c1 {
  left: 63px;
  top: 4px;
  background: #1499ed;
  transform: rotate(-32deg);
}

.c2 {
  left: 225px;
  top: 8px;
  background: #0b999b;
  transform: rotate(35deg);
}

.c3 {
  left: 263px;
  top: 20px;
  background: #168bf1;
  transform: rotate(42deg);
}

.c4 {
  left: 35px;
  top: 28px;
  background: #0aa39d;
  transform: rotate(-42deg);
}

.c5 {
  left: 91px;
  top: 27px;
  background: #ff5963;
  transform: rotate(43deg);
}

.c6 {
  left: 235px;
  top: 42px;
  background: #ffae27;
  transform: rotate(-42deg);
}

.c7 {
  left: 17px;
  top: 49px;
  background: #159ee9;
  transform: rotate(48deg);
}

.c8 {
  left: 280px;
  top: 52px;
  background: #168bf1;
  transform: rotate(45deg);
}

/* =========================
   CHECK
========================= */

.check-circle {
  width: 88px;
  height: 88px;
  margin: 35px auto 15px;

  border-radius: 50%;

  background: #e5f9fa;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #04999d;
}

.check-circle :deep(.v-icon) {
  font-weight: bold;
}

/* =========================
   TITULO
========================= */

h1 {
  margin: 10px 0 6px;

  text-align: center;

  font-size: 28px;
  line-height: 1.15;
  font-weight: 900;

  color: #303030;
}

.subtitulo {
  text-align: center;

  font-size: 19px;
  line-height: 1.35;

  color: #303030;

  margin: 0 0 18px;
}

/* =========================
   RESERVA CARD
========================= */

.reserva-card {
  display: flex;
  gap: 13px;

  padding: 13px;

  border: 1px solid #dce8f3;
  border-radius: 15px;

  background: #fbfdff;

  box-shadow: 0 2px 8px rgba(0, 80, 130, 0.04);
}

.reserva-icon {
  width: 49px;
  height: 49px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #e7fafb;

  color: #079da2;

  display: flex;
  align-items: center;
  justify-content: center;
}

.reserva-info {
  flex: 1;
}

.reserva-numero {
  font-size: 17px;
  font-weight: 900;
  color: #303030;
  margin-bottom: 6px;
}

.estado {
  display: inline-block;

  padding: 5px 12px;

  border-radius: 20px;

  background: #aaf1c7;

  color: #008f75;

  font-size: 13px;
  font-weight: 900;
}

.reserva-info p {
  margin: 8px 0 0;

  font-size: 13px;
  line-height: 1.35;

  color: #303030;
}

/* =========================
   DETALLES
========================= */

.detalle {
  display: flex;

  gap: 15px;

  margin-top: 18px;

  align-items: flex-start;
}

.detalle-icon {
  width: 30px;
  flex-shrink: 0;

  color: #303030;

  display: flex;
  justify-content: center;
}

.detalle-text {
  display: flex;
  flex-direction: column;

  font-size: 15px;
  line-height: 1.35;

  color: #303030;
}

.detalle-text strong {
  font-size: 16px;
  font-weight: 800;
}

.duracion {
  display: inline;
  margin-left: 3px;
}

/* =========================
   RECORDATORIO
========================= */

.recordatorio {
  display: flex;

  gap: 12px;

  margin-top: 20px;
  padding: 13px;

  border-radius: 14px;

  background: #e6faf8;

  color: #118e91;

  font-size: 13px;
  line-height: 1.4;

  align-items: center;
}

.recordatorio-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #0ab47b;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================
   BOTON RESERVAS
========================= */

.btn-reservas {
  width: 100%;

  margin-top: 15px;

  min-height: 53px;

  border: none;
  border-radius: 17px;

  background: #08a4a9;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  font-size: 16px;
  font-weight: 800;

  cursor: pointer;
}

.btn-reservas :deep(.v-icon) {
  color: white;
}

/* =========================
   BOTON INICIO
========================= */

.btn-inicio {
  width: 100%;

  margin-top: 13px;

  min-height: 48px;

  border-radius: 15px;

  border: 1px solid #dbe8f2;

  background: #f6f9fc;

  color: #303030;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  font-size: 15px;
  font-weight: 800;

  cursor: pointer;
}

/* =========================
   AGRADECIMIENTO
========================= */

.agradecimiento {
  text-align: center;

  padding-top: 25px;
}

.agradecimiento-img {
  height: 125px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.mujer {
  position: relative;

  color: #f2a6b5;

  display: inline-flex;
}

.corazon {
  position: absolute;

  right: -17px;
  top: 5px;

  color: #ff5367;

  font-size: 30px;
}

.agradecimiento h2 {
  margin: 5px 0 3px;

  font-size: 20px;
  font-weight: 900;

  color: #303030;
}

.agradecimiento p {
  margin: 0;

  font-size: 16px;

  color: #303030;
}

.pia-final {
  margin-top: 13px;

  font-size: 32px;
  font-weight: 900;

  color: #08a4a9;
}

/* =========================
   PASO FINAL
========================= */

.paso-final {
  max-width: 370px;

  margin: 130px auto 0;

  padding-bottom: 20px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-wrap: wrap;
}

.linea {
  width: calc(50% - 45px);
  height: 1px;

  background: #b8d5e8;
}

.paso-circulo {
  width: 48px;
  height: 48px;

  margin: 0 10px;

  border-radius: 50%;

  background: #09a2a7;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 21px;
  font-weight: 900;

  box-shadow:
    0 0 0 7px #e2f8fa,
    0 0 0 8px #b7e9ed;
}

.paso-texto {
  width: 100%;

  margin-top: 12px;

  text-align: center;

  font-size: 16px;

  color: #303030;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 390px) {

  .contenido {
    padding-left: 16px;
    padding-right: 16px;
  }

  h1 {
    font-size: 27px;
  }

  .subtitulo {
    font-size: 18px;
  }

  .detalle-text {
    font-size: 14px;
  }

  .detalle-text strong {
    font-size: 15px;
  }

}
</style>
