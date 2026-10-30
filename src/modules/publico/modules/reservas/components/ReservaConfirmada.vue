<template>
<div class="reserva-confirmada-page">
  <!-- HEADER -->
  <div class="header">
    <button class="header-btn" @click="volver">
      <v-icon size="30">mdi-arrow-left</v-icon>
    </button>

    <div class="logo-pia" aria-label="PIA">
      <img src="/images/pia/pia-avatar.png" alt="" class="logo-avatar" />
      <span>PIA</span>
    </div>

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
          <img
            src="/images/pia/pia-avatar.png"
            alt="Asistente virtual de PIA"
            class="pia-avatar-final"
          />
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
  --pia: #079b99;
  --pia-dark: #067d7d;
  --pia-soft: #e8f8f7;
  --pia-pale: #f5fbfb;
  --pia-border: #d7eceb;
  --text-main: #243746;
  --text-muted: #647785;

  min-height: 100vh;
  padding-bottom: 12px;
  overflow: hidden;
  color: var(--text-main);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(7, 155, 153, .10), transparent 36%),
    #f5f9fa;
}

/* HEADER */
.header {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 68px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  background: rgba(255, 255, 255, .94);
  border-bottom: 1px solid rgba(215, 236, 235, .9);
  box-shadow: 0 4px 18px rgba(27, 73, 83, .04);
  backdrop-filter: blur(12px);
}

.header-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4efef;
  border-radius: 14px;
  background: #fff;
  color: var(--pia-dark);
  cursor: pointer;
  transition: background .2s ease, transform .2s ease;
}

.header-btn:hover {
  background: var(--pia-soft);
  transform: translateY(-1px);
}

.logo-pia {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--pia);
  font-size: 28px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -1.7px;
}

.logo-avatar {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 50%;
  background: var(--pia-soft);
}

/* CONTENIDO */
.contenido {
  position: relative;
  width: min(100%, 440px);
  margin: 0 auto;
  padding: 20px 18px 8px;
}

/* CONFETI */
.confeti {
  position: absolute;
  top: 14px;
  left: 0;
  width: 100%;
  height: 80px;
  pointer-events: none;
}

.confeti-item {
  position: absolute;
  width: 7px;
  height: 13px;
  border-radius: 3px;
  opacity: .85;
}

.c1 { left: 14%; top: 8px; background: #12b8b0; transform: rotate(-32deg); }
.c2 { left: 76%; top: 12px; background: #079b99; transform: rotate(35deg); }
.c3 { left: 86%; top: 32px; background: #5bc7c3; transform: rotate(42deg); }
.c4 { left: 8%; top: 38px; background: #079b99; transform: rotate(-42deg); }
.c5 { left: 25%; top: 28px; background: #f6b84a; transform: rotate(43deg); }
.c6 { left: 72%; top: 55px; background: #f6b84a; transform: rotate(-42deg); }
.c7 { left: 5%; top: 65px; background: #5bc7c3; transform: rotate(48deg); }
.c8 { left: 91%; top: 62px; background: #12b8b0; transform: rotate(45deg); }

/* CONFIRMACIÓN */
.check-circle {
  position: relative;
  z-index: 1;
  width: 82px;
  height: 82px;
  margin: 35px auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #fff;
  border-radius: 50%;
  background: linear-gradient(145deg, #16b9ad, #078b8c);
  color: #fff;
  box-shadow: 0 0 0 7px #ddf5f2, 0 12px 28px rgba(7, 155, 153, .22);
}

.check-circle :deep(.v-icon) { font-weight: 900; }

h1 {
  margin: 10px 0 8px;
  color: var(--text-main);
  text-align: center;
  font-size: clamp(25px, 7vw, 30px);
  line-height: 1.15;
  font-weight: 850;
  letter-spacing: -.8px;
}

.subtitulo {
  margin: 0 auto 22px;
  max-width: 300px;
  color: var(--text-muted);
  text-align: center;
  font-size: 15px;
  line-height: 1.55;
}

/* TARJETA DE RESERVA */
.reserva-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  border: 1px solid var(--pia-border);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(32, 89, 97, .06);
}

.reserva-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: var(--pia-soft);
  color: var(--pia);
}

.reserva-info { flex: 1; min-width: 0; }

.reserva-numero {
  margin: 1px 0 8px;
  color: var(--text-main);
  font-size: 16px;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.estado {
  display: inline-flex;
  align-items: center;
  padding: 6px 11px;
  border: 1px solid #bdece0;
  border-radius: 30px;
  background: #e8faf3;
  color: #087e67;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .55px;
}

.reserva-info p {
  margin: 9px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

/* DETALLES */
.detalle {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 11px;
  padding: 13px 12px;
  border: 1px solid #e8f0f0;
  border-radius: 16px;
  background: rgba(255, 255, 255, .86);
  box-shadow: 0 3px 12px rgba(32, 89, 97, .025);
}

.detalle-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--pia-soft);
  color: var(--pia);
}

.detalle-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.detalle-text strong {
  color: var(--text-main);
  font-size: 14px;
  font-weight: 800;
}

.duracion {
  display: inline;
  margin-left: 3px;
  color: var(--pia-dark);
}

/* RECORDATORIO */
.recordatorio {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #ccece7;
  border-radius: 17px;
  background: linear-gradient(135deg, #e8f9f6, #f5fcfb);
  color: #416c70;
  font-size: 12px;
  line-height: 1.55;
}

.recordatorio-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: var(--pia);
  color: #fff;
}

/* ACCIONES */
.btn-reservas {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
  padding: 0 17px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(110deg, #079b99, #0ab5ad);
  color: #fff;
  box-shadow: 0 8px 18px rgba(7, 155, 153, .22);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
}

.btn-reservas span { flex: 1; text-align: left; }
.btn-reservas :deep(.v-icon) { color: #fff; }
.btn-reservas:hover { transform: translateY(-1px); box-shadow: 0 11px 22px rgba(7, 155, 153, .27); }

.btn-inicio {
  width: 100%;
  min-height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 10px;
  border: 1px solid #dceaea;
  border-radius: 15px;
  background: #fff;
  color: var(--pia-dark);
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
  transition: background .2s ease;
}

.btn-inicio:hover { background: var(--pia-pale); }

/* AGRADECIMIENTO + AVATAR PIA */
.agradecimiento {
  margin-top: 22px;
  padding: 20px 14px 18px;
  border: 1px solid var(--pia-border);
  border-radius: 22px;
  background: linear-gradient(180deg, #fff, #f3fbfa);
  text-align: center;
}

.agradecimiento-img {
  height: 122px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mujer {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  overflow: visible;
}

.pia-avatar-final {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 7px 8px rgba(17, 82, 84, .13));
}

.corazon {
  position: absolute;
  top: 1px;
  right: -9px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #ffe9ec;
  color: #f05270;
  box-shadow: 0 3px 9px rgba(100, 45, 55, .10);
}

.agradecimiento h2 {
  margin: 10px 0 5px;
  color: var(--text-main);
  font-size: 18px;
  font-weight: 850;
  letter-spacing: -.3px;
}

.agradecimiento p {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
}

.pia-final {
  margin-top: 11px;
  color: var(--pia);
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -1.5px;
}

/* INDICADOR FINAL */
.paso-final {
  width: min(100% - 36px, 440px);
  margin: 22px auto 0;
  padding-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.linea {
  flex: 1;
  height: 1px;
  background: #c9e4e2;
}

.paso-circulo {
  width: 39px;
  height: 39px;
  margin: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  border-radius: 50%;
  background: var(--pia);
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  box-shadow: 0 0 0 3px #d9f2ef;
}

.paso-texto {
  width: 100%;
  margin-top: 13px;
  color: var(--text-muted);
  text-align: center;
  font-size: 13px;
  font-weight: 650;
}

@media (min-width: 600px) {
  .contenido { padding-top: 26px; }
  .reserva-confirmada-page { padding-bottom: 24px; }
}

@media (max-width: 360px) {
  .contenido { padding-left: 14px; padding-right: 14px; }
  .header { padding: 0 12px; }
  .reserva-card { padding: 12px; }
  .detalle { padding: 11px 10px; gap: 10px; }
  .detalle-icon { width: 38px; height: 38px; }
  .detalle-text strong { font-size: 13px; }
  .logo-pia { font-size: 25px; }
  .logo-avatar { width: 32px; height: 32px; }
}
</style>
