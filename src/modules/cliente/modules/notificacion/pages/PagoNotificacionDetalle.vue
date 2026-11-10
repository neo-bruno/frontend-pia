<template>
<div class="pago-page">

  <!-- ENCABEZADO -->
  <header class="encabezado">
    <button class="btn-volver" @click="$router.back()">
      <v-icon>mdi-arrow-left</v-icon>
    </button>

    <div class="encabezado-texto">
      <h1>Detalle del comprobante</h1>
      <p>Información de tu pago y comprobante.</p>
    </div>
  </header>

  <!-- CARGANDO -->
  <div v-if="cargando" class="estado-carga">
    <v-progress-circular indeterminate color="#0f8f8c" size="38" />
    <p>Consultando información del pago...</p>
  </div>

  <!-- ERROR -->
  <v-alert v-else-if="error && !pago" type="error" variant="tonal" rounded="lg">
    {{ error }}
  </v-alert>

  <template v-else-if="pago">

    <!-- ESTADO DEL COMPROBANTE -->
    <v-card class="estado-card" elevation="0">

      <div class="estado-icono" :class="claseEstado">
        <v-icon size="30">{{ iconoEstado }}</v-icon>
      </div>

      <div class="estado-contenido">
        <span class="estado-etiqueta">Estado del comprobante</span>
        <h2>{{ textoEstado }}</h2>
        <p>{{ mensajeEstado }}</p>
      </div>

      <v-chip size="small" :color="colorEstado" variant="tonal" class="estado-chip">
        {{ pago.comprobante?.estado || "SIN COMPROBANTE" }}
      </v-chip>

    </v-card>

    <!-- INFORMACIÓN DEL PAGO -->
    <v-card class="tarjeta" elevation="0">

      <div class="seccion-titulo">
        <v-icon color="#0f8f8c">mdi-cash-check</v-icon>
        <h3>Información del pago</h3>
      </div>

      <div class="monto-container">
        <span>Importe registrado</span>
        <strong>{{ formatoMoneda(pago.monto) }}</strong>
      </div>

      <div class="datos-grid">
        <div class="dato">
          <span>Número de pago</span>
          <strong>{{ pago.numero || pago.id }}</strong>
        </div>

        <div class="dato">
          <span>Fecha</span>
          <strong>{{ formatoFecha(pago.fecha) }}</strong>
        </div>

        <div class="dato">
          <span>Hora</span>
          <strong>{{ pago.hora || "--:--" }}</strong>
        </div>

        <div class="dato">
          <span>Método de pago</span>
          <strong>{{ pago.metodo_pago?.nombre || "No disponible" }}</strong>
        </div>
      </div>

    </v-card>

    <!-- COMPROBANTE -->
    <v-card class="tarjeta" elevation="0">

      <div class="seccion-titulo">
        <v-icon color="#0f8f8c">mdi-file-document-check-outline</v-icon>
        <h3>Comprobante enviado</h3>
      </div>

      <template v-if="pago.comprobante">

        <div class="comprobante-info">
          <div>
            <span>Estado de validación</span>
            <strong>{{ pago.comprobante.estado }}</strong>
          </div>

          <div v-if="pago.comprobante.fecha_validacion">
            <span>Fecha de validación</span>
            <strong>
              {{ formatoFecha(pago.comprobante.fecha_validacion) }}
            </strong>
          </div>
        </div>

        <!-- IMAGEN -->
        <div v-if="esImagen" class="archivo-container">
          <v-img :src="urlArchivo" aspect-ratio="4/3" cover class="imagen-comprobante" @click="abrirArchivo" />

          <p class="archivo-ayuda">
            <v-icon size="15">mdi-magnify-plus-outline</v-icon>
            Toca la imagen para verla completa.
          </p>
        </div>

        <!-- PDF U OTRO ARCHIVO -->
        <div v-else-if="urlArchivo" class="archivo-documento">
          <v-icon size="38" color="#0f8f8c">
            mdi-file-pdf-box
          </v-icon>

          <div class="archivo-documento-texto">
            <strong>
              {{ pago.comprobante.archivo?.nombre || "Comprobante" }}
            </strong>
            <span>Archivo adjunto</span>
          </div>

          <v-btn icon variant="tonal" color="#0f8f8c" :href="urlArchivo" target="_blank" rel="noopener noreferrer" aria-label="Abrir comprobante">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </div>

        <div v-else class="sin-archivo">
          <v-icon size="32" color="grey">mdi-file-hidden</v-icon>
          <p>No hay un archivo adjunto disponible.</p>
        </div>

        <!-- OBSERVACIÓN -->
        <div v-if="pago.comprobante.observacion" class="observacion" :class="claseEstado">
          <div class="observacion-titulo">
            <v-icon size="19">mdi-message-text-outline</v-icon>
            <strong>Observación del negocio</strong>
          </div>

          <p>{{ pago.comprobante.observacion }}</p>
        </div>

      </template>

      <div v-else class="sin-archivo">
        <v-icon size="32" color="grey">
          mdi-file-document-outline
        </v-icon>
        <p>Este pago no tiene un comprobante asociado.</p>
      </div>

    </v-card>

    <!-- RESERVA -->
    <v-card v-if="pago.reserva" class="tarjeta" elevation="0">

      <div class="seccion-titulo">
        <v-icon color="#0f8f8c">mdi-calendar-check</v-icon>
        <h3>Reserva relacionada</h3>
      </div>

      <div class="reserva-servicio">
        <v-img v-if="pago.servicio?.imagen" :src="urlImagenServicio" width="64" height="64" cover class="servicio-imagen" />

        <div class="servicio-info">
          <strong>{{ pago.servicio?.nombre || "Servicio" }}</strong>
          <span>
            Profesional: {{ pago.profesional?.nombre || "No disponible" }}
          </span>
          <span>
            Reserva #{{ pago.reserva.numero || pago.reserva.id }}
          </span>
        </div>
      </div>

      <v-divider class="my-4" />

      <div class="datos-grid">
        <div class="dato">
          <span>Fecha de reserva</span>
          <strong>{{ formatoFecha(pago.reserva.fecha) }}</strong>
        </div>

        <div class="dato">
          <span>Horario</span>
          <strong>
            {{ formatoHora(pago.reserva.hora_inicio) }}
            -
            {{ formatoHora(pago.reserva.hora_fin) }}
          </strong>
        </div>
      </div>

      <div class="resumen-montos">
        <div>
          <span>Total de la reserva</span>
          <strong>{{ formatoMoneda(pago.reserva.precio_aplicable) }}</strong>
        </div>

        <div>
          <span>Total pagado</span>
          <strong>{{ formatoMoneda(pago.reserva.monto_pagado) }}</strong>
        </div>

        <div class="saldo">
          <span>Saldo pendiente</span>
          <strong>{{ formatoMoneda(pago.reserva.saldo) }}</strong>
        </div>
      </div>

    </v-card>

    <!-- NEGOCIO -->
    <div v-if="pago.negocio?.nombre" class="negocio-info">
      <v-icon size="17" color="#718096">
        mdi-store-outline
      </v-icon>
      <span>{{ pago.negocio.nombre }}</span>
    </div>

  </template>

</div>
</template>

<script>
import {
  getPagoClienteById,
} from "@/modules/cliente/modules/pagos/services/pago.api";

import {
  marcarNotificacionComoLeida,
} from "@/modules/cliente/modules/notificacion/services/notificacion.api";

export default {
  name: "PagoNotificacionDetalle",

  data() {
    return {
      pago: null,
      cargando: false,
      error: "",
    };
  },

  computed: {
    pagoId() {
      return Number(this.$route.query.id);
    },

    notificacionId() {
      return Number(this.$route.query.notificacion_id);
    },

    estadoComprobante() {
      return String(
        this.pago?.comprobante?.estado || ""
      ).toUpperCase();
    },

    textoEstado() {
      const estados = {
        PENDIENTE: "En revisión",
        ACEPTADO: "Comprobante aceptado",
        RECHAZADO: "Comprobante rechazado",
      };

      return estados[this.estadoComprobante] ||
        "Estado del comprobante";
    },

    mensajeEstado() {
      const mensajes = {
        PENDIENTE: "Tu comprobante está pendiente de revisión por el negocio.",
        ACEPTADO: "Tu comprobante fue revisado y aceptado correctamente.",
        RECHAZADO: "Tu comprobante fue rechazado. Revisa la observación del negocio.",
      };

      return mensajes[this.estadoComprobante] ||
        "Consulta la información de tu comprobante.";
    },

    colorEstado() {
      const colores = {
        PENDIENTE: "warning",
        ACEPTADO: "success",
        RECHAZADO: "error",
      };

      return colores[this.estadoComprobante] || "grey";
    },

    iconoEstado() {
      const iconos = {
        PENDIENTE: "mdi-clock-outline",
        ACEPTADO: "mdi-check-circle-outline",
        RECHAZADO: "mdi-close-circle-outline",
      };

      return iconos[this.estadoComprobante] ||
        "mdi-file-document-outline";
    },

    claseEstado() {
      return {
        pendiente: this.estadoComprobante === "PENDIENTE",
        aceptado: this.estadoComprobante === "ACEPTADO",
        rechazado: this.estadoComprobante === "RECHAZADO",
      };
    },

    urlArchivo() {
      const url = this.pago?.comprobante?.archivo?.url;
      return this.resolverUrl(url);
    },

    esImagen() {
      const mime = this.pago?.comprobante?.archivo?.mime_type || "";
      return mime.startsWith("image/");
    },

    urlImagenServicio() {
      return this.resolverUrl(this.pago?.servicio?.imagen);
    },
  },

  methods: {
    resolverUrl(url) {
      if (!url) return "";

      if (/^https?:\/\//i.test(url)) {
        return url;
      }

      const base =
        import.meta.env.VITE_SERVER_URL || "";
      return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    },

    async cargarPago() {
      if (!Number.isInteger(this.pagoId) || this.pagoId <= 0) {
        this.error = "El identificador del pago no es válido.";
        return;
      }

      this.cargando = true;
      this.error = "";

      try {
        const respuesta = await getPagoClienteById(this.pagoId);
        const pago = respuesta.data?.data;

        if (!respuesta.data?.ok || !pago) {
          throw new Error("No se encontró la información del pago.");
        }

        this.pago = pago;

      } catch (error) {
        console.error("Error cargando pago:", error);

        this.error =
          error.response?.data?.mensaje ||
          error.message ||
          "No se pudo cargar la información del pago.";

      } finally {
        this.cargando = false;
      }
    },

    async marcarNotificacionLeida() {
      if (
        !Number.isInteger(this.notificacionId) ||
        this.notificacionId <= 0
      ) {
        return;
      }

      try {
        await marcarNotificacionComoLeida(this.notificacionId);
      } catch (error) {
        console.error(
          "Error marcando notificación como leída:",
          error
        );
      }
    },

    formatoMoneda(valor) {
      return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(valor || 0));
    },

    formatoFecha(fecha) {
      if (!fecha) return "No disponible";

      const fechaLocal = String(fecha).slice(0, 10);
      const partes = fechaLocal.split("-");

      if (partes.length !== 3) return fechaLocal;

      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },

    formatoHora(hora) {
      return hora?String(hora).slice(0, 5) : "--:--";
    },

    abrirArchivo() {
      if (this.urlArchivo) {
        window.open(
          this.urlArchivo,
          "_blank",
          "noopener,noreferrer"
        );
      }
    },
  },

  async mounted() {
    await Promise.all([
      this.cargarPago(),
      this.marcarNotificacionLeida(),
    ]);
  },
};
</script>

<style lang="scss" scoped>
.pago-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 18px 14px 30px;
  box-sizing: border-box;
  color: #102a43;
}

.encabezado {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.btn-volver {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcefee;
  border-radius: 12px;
  background: white;
  color: #0f8f8c;
  cursor: pointer;
}

.encabezado h1 {
  margin: 0;
  font-size: 19px;
  line-height: 1.3;
  font-weight: 700;
  color: #102d5a;
}

.encabezado p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #718096;
}

.estado-card,
.tarjeta {
  padding: 17px;
  margin-bottom: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
}

.estado-card {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.estado-icono {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.estado-icono.pendiente {
  color: #b7791f;
  background: #fff8e7;
}

.estado-icono.aceptado {
  color: #16834b;
  background: #e8f8ef;
}

.estado-icono.rechazado {
  color: #d14343;
  background: #fff0f0;
}

.estado-contenido {
  flex: 1;
  min-width: 130px;
}

.estado-etiqueta,
.dato span,
.comprobante-info span,
.monto-container span {
  display: block;
  font-size: 11px;
  color: #8796a5;
}

.estado-contenido h2 {
  margin: 3px 0;
  font-size: 15px;
  font-weight: 700;
  color: #102d5a;
}

.estado-contenido p {
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
  color: #718096;
}

.estado-chip {
  margin-left: auto;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 17px;
}

.seccion-titulo h3 {
  margin: 0;
  font-size: 15px;
  color: #102d5a;
  font-weight: 700;
}

.monto-container {
  padding: 15px;
  margin-bottom: 17px;
  border-radius: 12px;
  background: #f0faf9;
}

.monto-container strong {
  display: block;
  margin-top: 5px;
  font-size: 25px;
  color: #0f8f8c;
  font-weight: 800;
}

.datos-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 12px;
}

.dato {
  min-width: 0;
}

.dato strong {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: #334e68;
  overflow-wrap: anywhere;
}

.comprobante-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

.comprobante-info strong {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #334e68;
}

.imagen-comprobante {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: zoom-in;
  overflow: hidden;
}

.archivo-ayuda {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 8px 0 0;
  font-size: 11px;
  color: #8796a5;
}

.archivo-documento {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.archivo-documento-texto {
  flex: 1;
  min-width: 0;
}

.archivo-documento-texto strong,
.archivo-documento-texto span {
  display: block;
  overflow-wrap: anywhere;
}

.archivo-documento-texto strong {
  font-size: 12px;
  color: #334e68;
}

.archivo-documento-texto span {
  margin-top: 3px;
  font-size: 11px;
  color: #8796a5;
}

.observacion {
  margin-top: 15px;
  padding: 13px;
  border-radius: 12px;
  background: #f8fafc;
}

.observacion.pendiente {
  background: #fff9eb;
}

.observacion.aceptado {
  background: #effaf3;
}

.observacion.rechazado {
  background: #fff1f1;
}

.observacion-titulo {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #334e68;
  font-size: 12px;
}

.observacion p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #52677d;
  white-space: pre-line;
}

.sin-archivo {
  padding: 20px 10px;
  text-align: center;
  color: #8796a5;
}

.sin-archivo p {
  margin: 8px 0 0;
  font-size: 12px;
}

.reserva-servicio {
  display: flex;
  align-items: center;
  gap: 12px;
}

.servicio-imagen {
  flex-shrink: 0;
  border-radius: 12px;
}

.servicio-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.servicio-info strong {
  font-size: 13px;
  color: #102d5a;
}

.servicio-info span {
  font-size: 11px;
  color: #718096;
}

.resumen-montos {
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-top: 18px;
}

.resumen-montos>div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #718096;
}

.resumen-montos strong {
  color: #334e68;
  text-align: right;
}

.resumen-montos .saldo {
  padding-top: 11px;
  border-top: 1px dashed #dce4ec;
}

.resumen-montos .saldo strong {
  color: #0f8f8c;
}

.negocio-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 5px;
  font-size: 11px;
  color: #718096;
}

.estado-carga {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 15px;
}

.estado-carga p {
  margin: 0;
  font-size: 13px;
  color: #718096;
}

@media (max-width: 360px) {
  .estado-chip {
    margin-left: 60px;
  }

  .estado-card,
  .tarjeta {
    padding: 14px;
  }

  .monto-container strong {
    font-size: 22px;
  }
}
</style>
