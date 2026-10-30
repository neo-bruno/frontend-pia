<template>
<div class="reprogramacion-confirmada-page">
  <!-- HEADER -->
  <header class="header">
    <button class="header-btn" @click="volver" aria-label="Volver">
      <v-icon size="27">mdi-arrow-left</v-icon>
    </button>

    <div class="logo-pia" aria-label="PIA">
      <img src="/images/pia/pia-avatar.png" alt="" class="logo-avatar" />
      <span>PIA</span>
    </div>

    <div class="header-placeholder"></div>
  </header>

  <main class="contenido">
    <!-- CONFETI -->
    <div class="confeti" aria-hidden="true">
      <span v-for="n in 8" :key="n" :class="`confeti-item c${n}`"></span>
    </div>

    <!-- CONFIRMACIÓN -->
    <div class="check-circle">
      <v-icon size="49">mdi-check</v-icon>
    </div>

    <h1>¡Reserva reprogramada!</h1>

    <p class="subtitulo">
      El cambio de fecha y hora se registró correctamente.
      Tu servicio y los pagos registrados se conservan.
    </p>

    <!-- TARJETA PRINCIPAL -->
    <section v-if="reserva" class="reserva-card">
      <div class="reserva-icon">
        <v-icon size="32">mdi-calendar-sync</v-icon>
      </div>

      <div class="reserva-info">
        <div class="reserva-numero">
          Reserva #{{ numeroReserva }}
        </div>

        <span class="estado">
          <v-icon size="14">mdi-check-circle</v-icon>
          REPROGRAMADA
        </span>

        <p>
          Tu nueva cita ya está registrada en PIA.
        </p>
      </div>
    </section>

    <!-- NUEVA FECHA -->
    <section v-if="reserva" class="detalle destacado">
      <div class="detalle-icon">
        <v-icon size="29">mdi-calendar-check</v-icon>
      </div>

      <div class="detalle-text">
        <span class="etiqueta">Tu nueva fecha</span>
        <strong>{{ fecha(reserva.fecha) }}</strong>
        <span class="hora-destacada">
          <v-icon size="17">mdi-clock-outline</v-icon>
          {{ hora(reserva.hora_inicio) }} – {{ hora(reserva.hora_fin) }}
        </span>
      </div>

      <span class="etiqueta-nuevo">NUEVO</span>
    </section>

    <!-- SERVICIO -->
    <section v-if="reserva" class="detalle">
      <div class="detalle-icon">
        <v-icon size="29">mdi-content-cut</v-icon>
      </div>

      <div class="detalle-text">
        <span class="etiqueta">Servicio</span>
        <strong>{{ servicioNombre }}</strong>
        <span>{{ duracionTexto }}</span>
      </div>
    </section>

    <!-- PROFESIONAL -->
    <section v-if="reserva" class="detalle">
      <div class="detalle-icon">
        <v-icon size="29">mdi-account-star-outline</v-icon>
      </div>

      <div class="detalle-text">
        <span class="etiqueta">Tu profesional</span>
        <strong>{{ profesionalNombre }}</strong>
        <span v-if="reserva.profesional?.tipo">
          {{ reserva.profesional.tipo }}
        </span>
      </div>
    </section>

    <!-- RESUMEN ECONÓMICO -->
    <section v-if="reserva" class="economia-card">
      <div class="economia-encabezado">
        <div class="economia-icon">
          <v-icon size="27">mdi-receipt-text-check-outline</v-icon>
        </div>

        <div>
          <h2>Tus pagos se conservan</h2>
          <p>No se genera un nuevo cobro por reprogramar tu cita.</p>
        </div>
      </div>

      <div class="fila-economia">
        <span>Precio del servicio</span>
        <strong>Bs {{ dinero(precioServicio) }}</strong>
      </div>

      <div class="fila-economia">
        <span>Descuento aplicado</span>
        <strong>Bs {{ dinero(descuentoTotal) }}</strong>
      </div>

      <div class="fila-economia total">
        <span>Total de la reserva</span>
        <strong>Bs {{ dinero(precioAplicable) }}</strong>
      </div>

      <div class="fila-economia">
        <span>Importe pagado</span>
        <strong>Bs {{ dinero(montoPagado) }}</strong>
      </div>

      <div class="fila-economia saldo">
        <span>Saldo pendiente</span>
        <strong>Bs {{ dinero(saldo) }}</strong>
      </div>

      <div class="nota-pagos">
        <v-icon size="20">mdi-shield-check-outline</v-icon>
        <span>
          Conservamos los importes registrados en tu reserva original.
          No se genera un segundo cobro por el adelanto realizado.
        </span>
      </div>
    </section>

    <!-- MENSAJE -->
    <section class="recordatorio">
      <div class="recordatorio-icon">
        <v-icon size="25">mdi-check</v-icon>
      </div>

      <p>
        ¡Todo listo! Puedes consultar tu nueva cita desde
        <strong>Mis reservas</strong>.
      </p>
    </section>

    <!-- ACCIONES -->
    <button class="btn-reservas" @click="irAReservas">
      <v-icon size="25">mdi-calendar-month</v-icon>
      <span>Ver mis reservas</span>
      <v-icon size="27">mdi-arrow-right</v-icon>
    </button>

    <button class="btn-inicio" @click="irInicio">
      <v-icon size="22">mdi-home-outline</v-icon>
      <span>Volver al inicio</span>
    </button>

    <!-- AGRADECIMIENTO -->
    <section class="agradecimiento">
      <div class="agradecimiento-img">
        <img src="/images/pia/pia-avatar.png" alt="Asistente virtual de PIA" class="pia-avatar-final" />

        <span class="corazon">
          <v-icon color="primary" size="19">mdi-heart</v-icon>
        </span>
      </div>

      <h2>Gracias por confiar en PIA</h2>
      <p>Tu belleza, en buenas manos.</p>
      <div class="pia-final">PIA</div>
    </section>

    <!-- PASO FINAL -->
    <div class="paso-final">
      <div class="linea"></div>
      <div class="paso-circulo">
        <v-icon size="21">mdi-check</v-icon>
      </div>
      <div class="linea"></div>

      <p>¡Listo! Tu nueva cita está registrada</p>
    </div>
  </main>
</div>
</template>

<script>
export default {
  name: "ReprogramacionConfirmadaPage",

  data() {
    return {
      resultado: null,
    };
  },

  computed: {
    reserva() {
      return this.resultado?.reserva_nueva || null;
    },

    numeroReserva() {
      return String(
        this.reserva?.numero || this.reserva?.id || "",
      ).padStart(6, "0");
    },

    servicioNombre() {
      return (
        this.reserva?.servicio_nombre ||
        this.reserva?.servicio?.nombre ||
        "Servicio"
      );
    },

    profesionalNombre() {
      return (
        this.reserva?.profesional_nombre ||
        this.reserva?.profesional?.nombre ||
        "Profesional"
      );
    },

    duracionTexto() {
      const duracion = Number(
        this.reserva?.servicio?.duracion ||
        this.reserva?.servicio_duracion ||
        0,
      );

      if (duracion <= 0) return "Servicio reservado";

      if (duracion < 60) return `${duracion} minutos`;

      const horas = Math.floor(duracion / 60);
      const minutos = duracion % 60;

      if (!minutos) {
        return `${horas} ${horas === 1?"hora" : "horas"}`;
      }

      return `${horas} h ${minutos} min`;
    },

    precioServicio() {
      const servicio = this.reserva?.servicio;

      // El precio original del servicio no siempre es
      // igual al precio final de la reserva.
      return Number(
        servicio?.precio??
        this.reserva?.precio_original??
        0,
      );
    },

    descuentoTotal() {
      return (
        Number(this.reserva?.monto_promocion || 0) +
        Number(this.reserva?.monto_descuento || 0)
      );
    },

    precioAplicable() {
      return Number(
        this.reserva?.precio_aplicable??
        Math.max(0, this.precioServicio - this.descuentoTotal),
      );
    },

    montoPagado() {
      return Number(this.reserva?.monto_pagado || 0);
    },

    saldo() {
      return Number(
        this.reserva?.saldo??
        Math.max(0, this.precioAplicable - this.montoPagado),
      );
    },
  },

  mounted() {
    try {
      const raw = sessionStorage.getItem(
        "pia_reprogramacion_resultado",
      );

      this.resultado = raw?JSON.parse(raw) : null;
    } catch (error) {
      console.error(
        "No se pudo recuperar el resultado de la reprogramación:",
        error,
      );

      this.resultado = null;
    }
  },

  methods: {
    hora(value) {
      return value?String(value).substring(0, 5) : "--:--";
    },

    fecha(value) {
      if (!value) return "--";

      const fechaLocal = String(value).substring(0, 10);

      return new Date(`${fechaLocal}T12:00:00`).toLocaleDateString(
        "es-BO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      );
    },

    dinero(value) {
      return (Number(value) || 0).toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    irAReservas() {
      this.$router.push({
        name: "cliente.reservas"
      }).catch(() => {
        this.$router.push("/cliente/reservas");
      });
    },

    irInicio() {
      this.$router.push("/cliente");
    },

    volver() {
      this.$router.push("/cliente/reservas");
    },
  },
};
</script>

<style lang="scss" scoped>
.reprogramacion-confirmada-page {
  --pia: #079b99;
  --pia-dark: #067d7d;
  --pia-soft: #e8f8f7;
  --pia-pale: #f5fbfb;
  --pia-border: #d7eceb;
  --text-main: #243746;
  --text-muted: #647785;

  min-height: 100vh;
  padding-bottom: 18px;
  overflow: hidden;
  color: var(--text-main);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  background:
    radial-gradient(ellipse at 50% 0%,
      rgba(7, 155, 153, 0.1),
      transparent 36%),
    #f5f9fa;
}

.header {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 66px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--pia-border);
  box-shadow: 0 4px 18px rgba(27, 73, 83, 0.04);
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
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 50%;
  background: var(--pia-soft);
}

.header-placeholder {
  width: 42px;
}

.contenido {
  position: relative;
  width: min(100%, 440px);
  margin: 0 auto;
  padding: 20px 17px 8px;
}

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
  opacity: 0.85;
}

.c1 {
  left: 14%;
  top: 8px;
  background: #12b8b0;
  transform: rotate(-32deg);
}

.c2 {
  left: 76%;
  top: 12px;
  background: #079b99;
  transform: rotate(35deg);
}

.c3 {
  left: 86%;
  top: 32px;
  background: #5bc7c3;
  transform: rotate(42deg);
}

.c4 {
  left: 8%;
  top: 38px;
  background: #079b99;
  transform: rotate(-42deg);
}

.c5 {
  left: 25%;
  top: 28px;
  background: #f6b84a;
  transform: rotate(43deg);
}

.c6 {
  left: 72%;
  top: 55px;
  background: #f6b84a;
  transform: rotate(-42deg);
}

.c7 {
  left: 5%;
  top: 65px;
  background: #5bc7c3;
  transform: rotate(48deg);
}

.c8 {
  left: 91%;
  top: 62px;
  background: #12b8b0;
  transform: rotate(45deg);
}

.check-circle {
  position: relative;
  z-index: 1;
  width: 82px;
  height: 82px;
  margin: 35px auto 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #fff;
  border-radius: 50%;
  background: linear-gradient(145deg, #16b9ad, #078b8c);
  color: #fff;
  box-shadow:
    0 0 0 7px #ddf5f2,
    0 12px 28px rgba(7, 155, 153, 0.22);
}

h1 {
  margin: 10px 0 8px;
  color: var(--text-main);
  text-align: center;
  font-size: clamp(25px, 7vw, 30px);
  line-height: 1.15;
  font-weight: 850;
  letter-spacing: -0.8px;
}

.subtitulo {
  max-width: 320px;
  margin: 0 auto 22px;
  color: var(--text-muted);
  text-align: center;
  font-size: 14px;
  line-height: 1.55;
}

.reserva-card,
.detalle,
.economia-card {
  border: 1px solid var(--pia-border);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(32, 89, 97, 0.04);
}

.reserva-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
}

.reserva-icon,
.detalle-icon,
.economia-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: var(--pia-soft);
  color: var(--pia);
}

.reserva-info {
  flex: 1;
  min-width: 0;
}

.reserva-numero {
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.estado {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border: 1px solid #bdece0;
  border-radius: 30px;
  background: #e8faf3;
  color: #087e67;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.4px;
}

.reserva-info p {
  margin: 9px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.detalle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 11px;
  padding: 13px 12px;
  border-color: #e8f0f0;
}

.detalle.destacado {
  position: relative;
  border-color: #a9e4dd;
  background: linear-gradient(135deg, #f1fffc, #e8f9f6);
}

.detalle-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.etiqueta {
  color: var(--text-muted);
  font-size: 11px;
}

.detalle-text strong {
  color: var(--text-main);
  font-size: 14px;
  font-weight: 800;
}

.hora-destacada {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
  color: var(--pia-dark);
  font-size: 14px;
  font-weight: 800;
}

.etiqueta-nuevo {
  align-self: flex-start;
  padding: 5px 7px;
  border-radius: 8px;
  background: #d8f6ef;
  color: #078b84;
  font-size: 9px;
  font-weight: 900;
}

.economia-card {
  margin-top: 14px;
  padding: 15px 13px;
}

.economia-encabezado {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.economia-icon {
  width: 43px;
  height: 43px;
}

.economia-encabezado h2 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 850;
}

.economia-encabezado p {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.45;
}

.fila-economia {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid #edf1f5;
  font-size: 12px;
}

.fila-economia span {
  color: #71859a;
}

.fila-economia strong {
  color: #173c5e;
  text-align: right;
  font-weight: 800;
  white-space: nowrap;
}

.fila-economia.total {
  padding: 13px 9px;
  background: #f1fbfa;
}

.fila-economia.total span,
.fila-economia.total strong {
  color: var(--pia-dark);
  font-weight: 900;
}

.fila-economia.saldo {
  border-bottom: 0;
}

.fila-economia.saldo strong {
  color: #078b84;
}

.nota-pagos {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 11px;
  padding: 11px;
  border: 1px solid #ccece7;
  border-radius: 13px;
  background: linear-gradient(135deg, #e8f9f6, #f5fcfb);
  color: #416c70;
  font-size: 11px;
  line-height: 1.55;
}

.nota-pagos :deep(.v-icon) {
  flex-shrink: 0;
  color: var(--pia);
}

.recordatorio {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 15px;
  padding: 13px;
  border: 1px solid #ccece7;
  border-radius: 16px;
  background: #f1fbfa;
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

.recordatorio p {
  margin: 0;
  color: #416c70;
  font-size: 12px;
  line-height: 1.55;
}

.btn-reservas {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
  padding: 0 16px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(110deg, #079b99, #0ab5ad);
  color: #fff;
  box-shadow: 0 8px 18px rgba(7, 155, 153, 0.22);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.btn-reservas span {
  flex: 1;
  text-align: left;
}

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
}

.agradecimiento {
  margin-top: 22px;
  padding: 20px 14px 18px;
  border: 1px solid var(--pia-border);
  border-radius: 22px;
  background: linear-gradient(180deg, #fff, #f3fbfa);
  text-align: center;
}

.agradecimiento-img {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.pia-avatar-final {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 7px 8px rgba(17, 82, 84, 0.13));
}

.corazon {
  position: absolute;
  top: 1px;
  right: -7px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #ffe9ec;
  box-shadow: 0 3px 9px rgba(100, 45, 55, 0.1);
}

.agradecimiento h2 {
  margin: 10px 0 5px;
  font-size: 18px;
  font-weight: 850;
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

.paso-final {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin: 22px auto 0;
  padding-bottom: 12px;
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
  box-shadow: 0 0 0 3px #d9f2ef;
}

.paso-final p {
  width: 100%;
  margin: 13px 0 0;
  color: var(--text-muted);
  text-align: center;
  font-size: 12px;
  font-weight: 650;
}

@media (max-width: 360px) {
  .contenido {
    padding-right: 13px;
    padding-left: 13px;
  }

  .header {
    padding: 0 12px;
  }

  .reserva-card {
    padding: 12px;
  }

  .detalle {
    padding: 11px 9px;
    gap: 9px;
  }

  .detalle-icon {
    width: 39px;
    height: 39px;
  }

  .fila-economia {
    font-size: 11px;
  }
}
</style>
