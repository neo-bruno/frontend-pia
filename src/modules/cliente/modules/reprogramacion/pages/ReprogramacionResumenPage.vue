
<template>
  <div class="reprogramacion-resumen">
    <!-- HEADER -->
    <header class="header-pia">
      <v-btn
        icon
        variant="text"
        aria-label="Volver"
        @click="$router.back()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div class="logo-pia">PIA</div>

      <div class="header-etiqueta">
        <v-icon size="19">mdi-calendar-sync</v-icon>
      </div>
    </header>

    <main v-if="datos" class="contenido">
      <!-- IDENTIDAD DE LA OPERACIÓN -->
      <section class="encabezado">
        <div class="icono-reprogramacion">
          <v-icon size="30">mdi-calendar-refresh</v-icon>
        </div>

        <div class="etiqueta-superior">
          GESTIÓN DE TU RESERVA
        </div>

        <h1>Confirmar reprogramación</h1>

        <p>
          Cambia la fecha y hora de tu cita sin perder tu servicio
          ni los pagos que ya realizaste.
        </p>

        <div class="estado-reprogramacion">
          <v-icon size="16">mdi-check-circle-outline</v-icon>
          REPROGRAMACIÓN
        </div>
      </section>

      
      <!-- SERVICIO ORIGINAL -->
      <section class="servicio-card">
        <div class="servicio-icono servicio-imagen">
          <img
            v-if="datos.servicio?.foto && !imagenServicioError"
            :src="getFileUrl(datos.servicio.foto)"
            :alt="datos.servicio?.nombre || 'Imagen del servicio'"
            @error="imagenServicioError = true"
          />

          <v-icon v-else size="27">
            mdi-content-cut
          </v-icon>
        </div>

        <div class="servicio-info">
          <div class="campo-label">SERVICIO QUE CONSERVARÁS</div>

          <div class="servicio-nombre">
            {{ datos.servicio?.nombre || 'Servicio reservado' }}
          </div>

          <div class="servicio-detalles">
            <span>
              <v-icon size="16">mdi-clock-outline</v-icon>
              {{ datos.servicio?.duracion || datos.reservaOriginal?.servicio_duracion || '--' }} min
            </span>

            <span v-if="datos.reservaOriginal?.precio_aplicable != null">
              <v-icon size="16">mdi-cash</v-icon>
              Bs {{ dinero(datos.reservaOriginal.precio_aplicable) }}
            </span>
          </div>

          <div class="servicio-conservado">
            <v-icon size="16">mdi-check-circle</v-icon>
            El servicio original se mantiene
          </div>
        </div>
      </section>

      <!-- PROFESIONAL -->
      <section class="profesional-card">
        <div class="profesional-avatar">
          <img
            v-if="fotoProfesional"
            :src="getFileUrl(fotoProfesional)"
            alt="Fotografía del profesional"
            @error="imagenProfesionalError = true"
          />

          <v-icon v-if="!fotoProfesional || imagenProfesionalError" size="34">
            mdi-account
          </v-icon>
        </div>

        <div class="profesional-info">
          <div class="campo-label">TU PROFESIONAL</div>

          <div class="profesional-nombre">
            {{ datos.profesional?.nombre ||
               datos.reservaOriginal?.profesional_nombre ||
               'Profesional' }}
          </div>

          <div class="profesional-tipo">
            Profesional de belleza
          </div>

          <div
            v-if="calificacion !== null || totalResenas > 0"
            class="profesional-rating"
          >
            <v-icon color="#F5A623" size="18">mdi-star</v-icon>
            <strong>{{ calificacion !== null ? calificacion.toFixed(1) : '—' }}</strong>
            <span>({{ totalResenas }} reseñas)</span>
          </div>

          <div v-else class="profesional-rating sin-resenas">
            <v-icon size="16">mdi-star-outline</v-icon>
            Sin evaluaciones todavía
          </div>
        </div>

        <v-icon class="profesional-check" color="#079b99">
          mdi-check-decagram
        </v-icon>
      </section>

      <!-- RESERVA ORIGINAL -->
      <section class="tarjeta reserva-original">
        <div class="tarjeta-cabecera">
          <div class="tarjeta-titulo">
            <span class="titulo-icono original-icono">
              <v-icon size="20">mdi-calendar-clock</v-icon>
            </span>

            <div>
              <h2>Tu reserva actual</h2>
              <p>Horario original</p>
            </div>
          </div>

          <span class="badge-original">ORIGINAL</span>
        </div>

        <div class="fecha-principal">
          {{ formatearFecha(datos.reservaOriginal?.fecha) }}
        </div>

        <div class="hora-principal">
          <v-icon size="19">mdi-clock-outline</v-icon>
          {{ hora(datos.reservaOriginal?.hora_inicio) }}
          <span>–</span>
          {{ hora(datos.reservaOriginal?.hora_fin) }}
        </div>

        <div
          v-if="datos.reservaOriginal?.numero != null"
          class="numero-reserva"
        >
          Reserva N.º {{ datos.reservaOriginal.numero }}
        </div>

        <div class="separador-original"></div>

        <div class="detalle-original">
          <v-icon size="17">mdi-information-outline</v-icon>
          Esta es la cita cuyo horario vas a cambiar.
        </div>
      </section>

      <!-- INDICADOR DE CAMBIO -->
      <div class="cambio-conector">
        <div class="linea-conector"></div>

        <div class="flecha-cambio">
          <v-icon size="24">mdi-arrow-down</v-icon>
        </div>

        <div class="linea-conector"></div>
      </div>

      <!-- NUEVO HORARIO -->
      <section class="tarjeta nueva">
        <div class="tarjeta-cabecera">
          <div class="tarjeta-titulo">
            <span class="titulo-icono nuevo-icono">
              <v-icon size="20">mdi-calendar-check</v-icon>
            </span>

            <div>
              <h2>Nuevo horario</h2>
              <p>Tu cita después del cambio</p>
            </div>
          </div>

          <span class="badge-nuevo">NUEVO</span>
        </div>

        <div class="fecha-principal nueva-fecha">
          {{ formatearFecha(datos.fecha) }}
        </div>

        <div class="hora-principal nueva-hora">
          <v-icon size="19">mdi-clock-outline</v-icon>
          {{ hora(datos.hora_inicio) }}
          <span>–</span>
          {{ hora(datos.hora_fin) }}
        </div>

        <div class="nota-nuevo">
          <v-icon size="17">mdi-check-circle</v-icon>
          Este será el nuevo horario de tu servicio.
        </div>
      </section>

      
      <!-- RESUMEN ECONÓMICO -->
      <section class="tarjeta economia">
        <div class="economia-titulo">
          <div class="economia-icono">
            <v-icon size="23">mdi-receipt-text-check-outline</v-icon>
          </div>

          <div>
            <h2>Resumen del servicio</h2>
            <p>El precio y los pagos de tu reserva se conservan.</p>
          </div>
        </div>

        <div class="fila">
          <span>Precio del servicio</span>
          <strong>Bs {{ dinero(datos.servicio?.precio ?? datos.reservaOriginal?.servicio?.precio) }}</strong>
        </div>

        <div class="fila">
          <span>Descuento aplicado</span>
          <strong>
            Bs {{ dinero(datos.reservaOriginal?.monto_descuento ?? 0) }}
          </strong>
        </div>

        <div class="fila total-servicio">
          <span>Total de la reserva</span>
          <strong>
            Bs {{ dinero(
              datos.reservaOriginal?.precio_aplicable ??
              datos.reservaOriginal?.precio_original ??
              datos.servicio?.precio ??
              datos.reservaOriginal?.servicio?.precio
            ) }}
          </strong>
        </div>

        <div class="fila">
          <span>Importe pagado</span>
          <strong>
            Bs {{ dinero(datos.reservaOriginal?.monto_pagado ?? 0) }}
          </strong>
        </div>

        <div class="fila saldo">
          <span>Saldo pendiente</span>
          <strong>
            Bs {{ dinero(datos.reservaOriginal?.saldo ?? 0) }}
          </strong>
        </div>

        <div class="nota-economica">
          <v-icon size="19">mdi-shield-check-outline</v-icon>

          <span>
            Los pagos registrados se conservan. No se generará
            un segundo cobro por reprogramar la cita.
          </span>
        </div>
      </section>


      <!-- MENSAJE DE ERROR -->
      <div v-if="error" class="error">
        <v-icon size="20">mdi-alert-circle-outline</v-icon>
        <span>{{ error }}</span>
      </div>

      <!-- CONFIRMAR -->
      <div class="acciones">
        <v-btn
          block
          size="large"
          color="primary"
          class="btn-confirmar"
          :loading="enviando"
          :disabled="enviando"
          @click="confirmar"
        >
          <v-icon start>mdi-calendar-check</v-icon>
          Confirmar reprogramación
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>

        <v-btn
          block
          variant="text"
          class="btn-volver"
          :disabled="enviando"
          @click="$router.back()"
        >
          <v-icon start size="18">mdi-arrow-left</v-icon>
          Elegir otro horario
        </v-btn>

        <div class="pie-seguridad">
          <v-icon size="15">mdi-lock-outline</v-icon>
          Revisa los horarios antes de confirmar.
        </div>
      </div>
    </main>

    <!-- SIN SELECCIÓN -->
    <main v-else class="estado-vacio">
      <div class="vacio-icono">
        <v-icon size="42">mdi-calendar-alert</v-icon>
      </div>

      <h2>No encontramos la selección</h2>

      <p>
        Vuelve a elegir una fecha y un horario para continuar
        con la reprogramación.
      </p>

      <v-btn color="primary" @click="$router.back()">
        Volver a horarios
      </v-btn>
    </main>

    <v-overlay
      :model-value="enviando"
      class="align-center justify-center"
      persistent
    >
      <div class="overlay-carga">
        <v-progress-circular
          indeterminate
          size="54"
          color="primary"
        />
        <span>Confirmando tu reprogramación...</span>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { confirmarReprogramacion } from "../services/reprogramacion.api";
import { getFileUrl } from "@/utils/ayuda";

export default {
  name: "ReprogramacionResumenPage",

  data() {
    return {
      datos: null,
      enviando: false,
      error: null,
      imagenProfesionalError: false,
      imagenServicioError: false,
    };
  },

  computed: {
    fotoProfesional() {
      if (this.imagenProfesionalError) return null;

      return (
        this.datos?.profesional?.foto ||
        this.datos?.profesional?.foto_url ||
        this.datos?.profesional?.imagen ||
        this.datos?.reservaOriginal?.profesional_foto ||
        null
      );
    },

    calificacion() {
      const profesional = this.datos?.profesional ||
        this.datos?.reservaOriginal || {};

      const valor =
        profesional.calificacion_promedio ??
        profesional.calificacion ??
        profesional.promedio_calificacion;

      if (valor === null || valor === undefined || valor === "") {
        return null;
      }

      const numero = Number(valor);

      return Number.isFinite(numero) ? numero : null;
    },

    totalResenas() {
      const profesional = this.datos?.profesional ||
        this.datos?.reservaOriginal || {};

      return Number(
        profesional.total_resenas ??
        profesional.cantidad_resenas ??
        profesional.total_calificaciones ??
        0
      );
    },
  },

  mounted() {
    try {
      const raw = sessionStorage.getItem("pia_reprogramacion_pendiente");

      this.datos = raw ? JSON.parse(raw) : null;
      console.log(
        "RESERVA ORIGINAL COMPLETA:",
        JSON.stringify(this.datos?.reservaOriginal, null, 2)
      );

      console.log(
        "DATOS ECONÓMICOS:",
        {
          precioServicio: this.datos?.servicio?.precio,
          precioOriginal: this.datos?.reservaOriginal?.precio_original,
          precioAplicable: this.datos?.reservaOriginal?.precio_aplicable,
          montoPagado: this.datos?.reservaOriginal?.monto_pagado,
          saldo: this.datos?.reservaOriginal?.saldo,
        }
      );

      if (this.datos && Number(this.datos.reservaId) !== Number(this.$route.params.reservaId)) {
        this.datos = null;
      }
    } catch (error) {
      console.error("No se pudo recuperar la reprogramación pendiente:", error);
      this.datos = null;
    }
  },

  methods: {
    getFileUrl,

    hora(value) {
      return value ? String(value).substring(0, 5) : "--:--";
    },

    dinero(value) {
      return (Number(value) || 0).toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatearFecha(value) {
      if (!value) return "--";

      const fecha = String(value).substring(0, 10);

      return new Date(`${fecha}T12:00:00`).toLocaleDateString(
        "es-BO",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    },

    async confirmar() {
      if (!this.datos || this.enviando) return;

      this.enviando = true;
      this.error = null;

      try {
        const response = await confirmarReprogramacion({
          reservaId: this.datos.reservaId,
          fecha: this.datos.fecha,
          slots_reserva: this.datos.slots_reserva,
        });

        if (!response.data?.ok) {
          throw new Error(
            response.data?.mensaje ||
            "No se pudo confirmar la reprogramación."
          );
        }

        sessionStorage.setItem(
          "pia_reprogramacion_resultado",
          JSON.stringify(response.data.data)
        );

        sessionStorage.removeItem("pia_reprogramacion_pendiente");

        this.$router.push({
          name: "cliente.reprogramacion.confirmada",
          params: {
            reservaId: this.datos.reservaId,
          },
        });
      } catch (error) {
        this.error =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          error.message ||
          "No se pudo completar la reprogramación.";
      } finally {
        this.enviando = false;
      }
    },
  },
};
</script>

<style scoped>
.reprogramacion-resumen {
  --pia: #079b99;
  --pia-dark: #087f80;
  --pia-soft: #e8f8f7;
  --pia-border: #d5e9e8;
  --pia-text: #263b43;
  --pia-muted: #71838a;

  min-height: 100vh;
  padding-bottom: 28px;
  background: #f5f8fc;
  color: var(--pia-text);
  font-family: Inter, "Segoe UI", Roboto, sans-serif;
}

.header-pia {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 62px;
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.97);
  border-bottom: 1px solid #e6eeee;
  backdrop-filter: blur(10px);
}

.header-pia > .v-btn {
  color: var(--pia);
}

.logo-pia {
  text-align: center;
  color: var(--pia);
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -1.5px;
}

.header-etiqueta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  justify-self: end;
  border-radius: 50%;
  color: var(--pia);
  background: var(--pia-soft);
}

.contenido {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  padding: 14px 15px 30px;
}

.encabezado {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 9px 8px 20px;
}

.icono-reprogramacion {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-bottom: 12px;
  border: 1px solid #cdecea;
  border-radius: 19px;
  background: linear-gradient(145deg, #fff, #e9f9f7);
  color: var(--pia);
  box-shadow: 0 5px 18px #087f8010;
}

.etiqueta-superior {
  color: var(--pia);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.encabezado h1 {
  margin: 7px 0;
  color: #12365d;
  font-size: 22px;
  line-height: 1.3;
  font-weight: 850;
  letter-spacing: -0.35px;
}

.encabezado p {
  max-width: 320px;
  margin: 0;
  color: #718398;
  font-size: 13px;
  line-height: 19px;
}

.estado-reprogramacion {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  padding: 6px 10px;
  border: 1px solid #c9ece7;
  border-radius: 20px;
  background: #eaf9f6;
  color: #07877f;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.55px;
}

/* SERVICIO */

.servicio-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  margin-bottom: 11px;
  border: 1px solid var(--pia-border);
  border-radius: 17px;
  background: linear-gradient(135deg, #fff, #f6fcfc);
  box-shadow: 0 3px 12px #0a6b6c08;
}

.servicio-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: #ed8c56;
  background: #fff0e6;
}

.servicio-info {
  flex: 1;
  min-width: 0;
}

.campo-label {
  color: #71838a;
  font-size: 10px;
  line-height: 1.5;
  font-weight: 700;
  letter-spacing: 0.35px;
}

.servicio-nombre {
  margin-top: 3px;
  color: #203b53;
  font-size: 15px;
  font-weight: 850;
  overflow-wrap: anywhere;
  text-transform: capitalize;
}

.servicio-detalles {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 12px;
  margin-top: 5px;
  color: #657b8b;
  font-size: 12px;
}

.servicio-detalles span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.servicio-detalles .v-icon {
  color: var(--pia);
}

.servicio-conservado {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  color: #07877f;
  font-size: 10px;
  font-weight: 750;
}

/* PROFESIONAL */

.profesional-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  margin-bottom: 15px;
  border: 1px solid #e0eaf1;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 3px 12px #173b5b08;
}

.profesional-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 66px;
  width: 66px;
  height: 66px;
  overflow: hidden;
  border: 3px solid #e4f5f4;
  border-radius: 50%;
  background: var(--pia-soft);
  color: var(--pia);
}

.profesional-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profesional-info {
  flex: 1;
  min-width: 0;
}

.profesional-nombre {
  margin-top: 3px;
  color: #203b53;
  font-size: 15px;
  font-weight: 850;
  overflow-wrap: anywhere;
}

.profesional-tipo {
  margin-top: 3px;
  color: #71838a;
  font-size: 12px;
}

.profesional-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  color: #34474e;
  font-size: 12px;
}

.profesional-rating strong {
  font-weight: 850;
}

.profesional-rating span {
  color: #71838a;
}

.profesional-rating.sin-resenas {
  color: #71838a;
}

.profesional-check {
  flex: 0 0 auto;
}

/* TARJETAS DE HORARIO */

.tarjeta {
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e0e9f1;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 3px 12px #173b5b08;
}

.tarjeta-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 15px;
}

.tarjeta-titulo {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.titulo-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.original-icono {
  color: #507da7;
  background: #edf4fb;
}

.nuevo-icono {
  color: #078f91;
  background: #dcf6f1;
}

.tarjeta-titulo h2 {
  margin: 0;
  color: #173b5b;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 850;
}

.tarjeta-titulo p {
  margin: 2px 0 0;
  color: #8293a4;
  font-size: 11px;
}

.badge-original,
.badge-nuevo {
  flex: 0 0 auto;
  padding: 5px 8px;
  border-radius: 7px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.3px;
}

.badge-original {
  color: #58748c;
  background: #edf2f7;
}

.badge-nuevo {
  color: #07877f;
  background: #d9f5ee;
}

.fecha-principal {
  color: #173b5b;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 850;
  text-transform: capitalize;
  overflow-wrap: anywhere;
}

.hora-principal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #59748b;
  font-size: 14px;
  font-weight: 750;
}

.hora-principal .v-icon {
  color: #6085a8;
}

.numero-reserva {
  margin-top: 7px;
  color: #8a9bab;
  font-size: 11px;
}

.separador-original {
  height: 1px;
  margin: 13px 0 10px;
  border-top: 1px dashed #dce6ef;
}

.detalle-original {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  color: #71869a;
  font-size: 11px;
  line-height: 1.5;
}

.detalle-original .v-icon {
  flex: 0 0 auto;
}

/* CAMBIO DE HORARIO */

.cambio-conector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -3px 0 7px;
}

.linea-conector {
  width: 1px;
  height: 9px;
  background: #b8dfdb;
}

.flecha-cambio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid #c5eae5;
  border-radius: 50%;
  background: #eaf9f6;
  color: var(--pia);
}

/* NUEVO HORARIO */

.tarjeta.nueva {
  border-color: #9fdfd7;
  background: linear-gradient(145deg, #fff, #f0fffc);
  box-shadow: 0 4px 15px #079b990c;
}

.nueva-fecha {
  color: #087f80;
}

.nueva-hora {
  color: #087f80;
}

.nueva-hora .v-icon {
  color: var(--pia);
}

.nota-nuevo {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 13px;
  padding-top: 11px;
  border-top: 1px solid #d8efeb;
  color: #07877f;
  font-size: 11px;
  line-height: 1.5;
}

.nota-nuevo .v-icon {
  flex: 0 0 auto;
}

/* ECONOMÍA */

.economia {
  margin-top: 15px;
  padding: 16px 14px 13px;
}

.economia-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.economia-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 43px;
  width: 43px;
  height: 43px;
  border-radius: 13px;
  background: var(--pia-soft);
  color: var(--pia);
}

.economia-titulo h2 {
  margin: 0;
  color: #173b5b;
  font-size: 14px;
  font-weight: 850;
}

.economia-titulo p {
  margin: 3px 0 0;
  color: #8293a4;
  font-size: 11px;
  line-height: 1.5;
}

.fila {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 2px;
  border-bottom: 1px solid #edf1f5;
  font-size: 12px;
}

.fila span {
  color: #71859a;
}

.fila strong {
  color: #173c5e;
  font-weight: 800;
  text-align: right;
  white-space: nowrap;
}

.fila.saldo {
  border-bottom: 0;
}

.fila.saldo strong {
  color: #078b84;
  font-size: 14px;
}

.nota-economica {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 10px;
  padding: 11px;
  border: 1px solid #d7ece9;
  border-radius: 12px;
  background: #f0faf8;
  color: #52747b;
  font-size: 11px;
  line-height: 1.6;
}

.nota-economica .v-icon {
  flex: 0 0 auto;
  color: var(--pia);
}

/* ACCIONES */

.acciones {
  margin-top: 17px;
}

.btn-confirmar {
  min-height: 52px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #079b99, #087f80) !important;
  color: #fff !important;
  font-size: 14px;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: none;
  box-shadow: 0 5px 13px #079b9930 !important;
}

.btn-confirmar:hover {
  filter: brightness(1.04);
}

.btn-volver {
  min-height: 44px;
  margin-top: 4px;
  border-radius: 12px;
  color: #607b90;
  font-size: 13px;
  font-weight: 650;
  text-transform: none;
}

.pie-seguridad {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  color: #8b9aaa;
  font-size: 10px;
}

/* ERROR */

.error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 13px;
  padding: 12px;
  border: 1px solid #f1d3d7;
  border-radius: 12px;
  background: #fff0f2;
  color: #9e2938;
  font-size: 12px;
  line-height: 1.5;
}

.error .v-icon {
  flex: 0 0 auto;
}

/* SIN SELECCIÓN */

.estado-vacio {
  max-width: 420px;
  margin: 50px auto;
  padding: 25px 20px;
  text-align: center;
}

.vacio-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 74px;
  margin: 0 auto 15px;
  border-radius: 23px;
  background: #fff4e5;
}

.estado-vacio h2 {
  margin: 12px 0;
  color: #173b5b;
  font-size: 19px;
}

.estado-vacio p {
  margin-bottom: 18px;
  color: #708398;
  font-size: 13px;
  line-height: 1.6;
}

.overlay-carga {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px;
  border-radius: 18px;
  background: #fff;
  color: #173b5b;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 8px 35px #173b5b20;
}

@media (max-width: 360px) {
  .contenido {
    padding-right: 11px;
    padding-left: 11px;
  }

  .profesional-card {
    gap: 9px;
    padding: 10px;
  }

  .profesional-avatar {
    flex-basis: 58px;
    width: 58px;
    height: 58px;
  }

  .tarjeta {
    padding: 12px;
  }

  .tarjeta-titulo h2 {
    font-size: 12px;
  }

  .badge-original,
  .badge-nuevo {
    padding: 4px 6px;
    font-size: 8px;
  }

  .fecha-principal {
    font-size: 13px;
  }

  .btn-confirmar {
    font-size: 12px;
  }
}

.fila.total-servicio {
  padding-top: 12px;
  padding-bottom: 12px;
  border-top: 1px solid #dcebe9;
  background: #f4fbfa;
}

.fila.total-servicio span {
  color: #173b5b;
  font-weight: 800;
}

.fila.total-servicio strong {
  color: #078b84;
  font-size: 15px;
}
.servicio-imagen {
  overflow: hidden;
  padding: 0;
  flex: 0 0 66px;
  width: 66px;
  height: 66px;
  border-radius: 14px;
}

.servicio-imagen img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
