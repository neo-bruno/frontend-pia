<template>
<div class="pago-detalle-page">

  <!-- =====================================================

         HEADER

    ====================================================== -->

  <div class="page-header">

    <button class="back-btn" @click="volver">

      <v-icon size="22">mdi-arrow-left</v-icon>

    </button>

    <div>

      <h1>Detalle del pago</h1>

      <p>Información de tu comprobante</p>

    </div>

  </div>

  <!-- =====================================================

         LOADING

    ====================================================== -->

  <div v-if="cargando" class="loading-container">

    <v-progress-circular indeterminate size="42" width="4" color="#008b8b" />

    <span>Cargando información...</span>

  </div>

  <!-- =====================================================

         CONTENIDO

    ====================================================== -->

  <div v-else-if="pago" class="contenido">

    <!-- =================================================

           ESTADO + MONTO

      ================================================== -->

    <section class="monto-card">

      <div class="estado-row">

        <span class="estado-badge" :class="claseEstado(pago.comprobante?.estado)">

          <v-icon size="16">

            {{ iconoEstado(pago.comprobante?.estado) }}

          </v-icon>

          {{ textoEstado(pago.comprobante?.estado) }}

        </span>

      </div>

      <div class="monto-label">

        Monto pagado

      </div>

      <div class="monto">

        Bs {{ formatoMoneda(pago.monto) }}

      </div>

      <div class="metodo-pago">

        <v-icon size="18">mdi-qrcode</v-icon>

        {{ pago.metodo_pago?.nombre || 'Método de pago' }}

      </div>

    </section>

    <!-- =================================================

           INFORMACIÓN DEL PAGO

      ================================================== -->

    <section class="card">

      <div class="section-title">

        <div class="section-icon">

          <v-icon size="19">mdi-receipt-text-outline</v-icon>

        </div>

        <div>

          <h2>Información del pago</h2>

          <p>Datos de la transacción</p>

        </div>

      </div>

      <div class="info-list">

        <div class="info-row">

          <span>Número</span>

          <strong>{{ pago.numero || '—' }}</strong>

        </div>

        <div class="info-row">

          <span>Fecha</span>

          <strong>{{ formatoFecha(pago.fecha) }}</strong>

        </div>

        <div class="info-row">

          <span>Hora</span>

          <strong>{{ formatoHora(pago.hora) }}</strong>

        </div>

        <div class="info-row">

          <span>Método</span>

          <strong>

            {{ pago.metodo_pago?.nombre || '—' }}

          </strong>

        </div>

      </div>

    </section>

    <!-- =================================================

           RESERVA

      ================================================== -->

    <section v-if="pago.reserva" class="card">

      <div class="section-title">

        <div class="section-icon reserva-icon">

          <v-icon size="19">mdi-calendar-check-outline</v-icon>

        </div>

        <div>

          <h2>Reserva</h2>

          <p>Reserva asociada a este pago</p>

        </div>

      </div>

      <div class="reserva-numero">

        Reserva #{{ pago.reserva.numero }}

      </div>

      <div class="reserva-fecha">

        <div class="fecha-icon">

          <v-icon size="20">mdi-calendar-outline</v-icon>

        </div>

        <div>

          <span>Fecha</span>

          <strong>

            {{ formatoFecha(pago.reserva.fecha) }}

          </strong>

        </div>

      </div>

      <div class="horario-box">

        <div>

          <span>Inicio</span>

          <strong>

            {{ formatoHora(pago.reserva.hora_inicio) }}

          </strong>

        </div>

        <v-icon size="20">

          mdi-arrow-right

        </v-icon>

        <div>

          <span>Fin</span>

          <strong>

            {{ formatoHora(pago.reserva.hora_fin) }}

          </strong>

        </div>

      </div>

      <div class="precios">

        <div class="precio-row">

          <span>Precio del servicio</span>

          <strong>

            Bs {{ formatoMoneda(pago.reserva.precio_aplicable) }}

          </strong>

        </div>

        <div class="precio-row pagado">

          <span>Pagado</span>

          <strong>

            Bs {{ formatoMoneda(pago.reserva.monto_pagado) }}

          </strong>

        </div>

        <div class="precio-row saldo">

          <span>Saldo pendiente</span>

          <strong>

            Bs {{ formatoMoneda(pago.reserva.saldo) }}

          </strong>

        </div>

      </div>

    </section>

    <!-- =================================================

           SERVICIO

      ================================================== -->

    <section v-if="pago.servicio" class="card">

      <div class="section-title">

        <div class="section-icon servicio-icon">

          <v-icon size="19">mdi-account-heart</v-icon>           

        </div>

        <div>

          <h2>Servicio</h2>

          <p>Servicio reservado</p>

        </div>

      </div>
      
      <div class="servicio-content">

        <div class="servicio-icon-large">

          <!-- <v-icon size="25">mdi-content-cut</v-icon> -->
          <v-img v-if="pago.servicio?.imagen" :src="getFileUrl(pago.servicio.imagen)" cover/>

        </div>

        <div class="servicio-info">

          <h3>

            {{ pago.servicio.nombre }}

          </h3>

          <p v-if="pago.servicio.descripcion">

            {{ pago.servicio.descripcion }}

          </p>

          <div class="servicio-meta">

            <span>

              <v-icon size="15">mdi-clock-outline</v-icon>

              {{ pago.servicio.duracion }} min

            </span>

            <span>

              <v-icon size="15">mdi-currency-bob</v-icon>

              Bs {{ formatoMoneda(pago.servicio.precio) }}

            </span>

          </div>

        </div>

      </div>

    </section>

    <!-- =================================================

           PROFESIONAL

      ================================================== -->

    <section v-if="pago.profesional" class="card">

      <div class="section-title">

        <div class="section-icon profesional-icon">

          <v-icon size="19">mdi-account-star-outline</v-icon>

        </div>

        <div>

          <h2>Profesional</h2>

          <p>Tu profesional</p>

        </div>

      </div>

      <div class="persona-row">

        <div class="persona-avatar">

          <img v-if="urlImagen(pago.profesional.foto)" :src="urlImagen(pago.profesional.foto)" alt="Profesional" />

          <v-icon v-else size="28">

            mdi-account

          </v-icon>

        </div>

        <div class="persona-info">

          <h3>

            {{ pago.profesional.nombre || 'Profesional' }}

          </h3>

          <span v-if="pago.profesional.slug">

            @{{ pago.profesional.slug }}

          </span>

        </div>

      </div>

    </section>

    <!-- =================================================

           NEGOCIO

      ================================================== -->

    <section v-if="pago.negocio" class="card">

      <div class="section-title">

        <div class="section-icon negocio-icon">

          <v-icon size="19">mdi-store-outline</v-icon>

        </div>

        <div>

          <h2>Negocio</h2>

          <p>Establecimiento</p>

        </div>

      </div>

      <div class="negocio-row">

        <div class="negocio-imagen">

          <img v-if="urlImagen(imagenNegocio)" :src="urlImagen(imagenNegocio)" alt="Negocio" />

          <v-icon v-else size="27">

            mdi-store-outline

          </v-icon>

        </div>

        <div class="negocio-info">

          <h3>

            {{ pago.negocio.nombre }}

          </h3>

          <div v-if="pago.negocio.direccion">

            <v-icon size="15">mdi-map-marker-outline</v-icon>

            {{ pago.negocio.direccion }}

          </div>

          <div v-if="pago.negocio.telefono">

            <v-icon size="15">mdi-phone-outline</v-icon>

            {{ pago.negocio.telefono }}

          </div>

        </div>

      </div>

    </section>

    <!-- =================================================

           COMPROBANTE

      ================================================== -->

    <section v-if="pago.comprobante" class="card comprobante-card">

      <div class="section-title">

        <div class="section-icon comprobante-icon">

          <v-icon size="19">mdi-file-check-outline</v-icon>

        </div>

        <div>

          <h2>Comprobante</h2>

          <p>Comprobante enviado</p>

        </div>

      </div>

      <!-- Estado comprobante -->

      <div class="comprobante-estado">

        <span class="estado-badge" :class="claseEstado(pago.comprobante.estado)">

          <v-icon size="16">

            {{ iconoEstado(pago.comprobante.estado) }}

          </v-icon>

          {{ textoEstado(pago.comprobante.estado) }}

        </span>

      </div>

      <!-- Observación -->

      <div v-if="pago.comprobante.observacion" class="observacion">

        <v-icon size="18">

          mdi-information-outline

        </v-icon>

        <span>

          {{ pago.comprobante.observacion }}

        </span>

      </div>

      <!-- Imagen -->
      <div v-if="pago.comprobante?.archivo?.url" class="comprobante-imagen-wrapper">
        <img :src="getComprobanteUrl()" :alt="pago.comprobante.archivo?.nombre || 'Comprobante'" class="comprobante-imagen" @error="onComprobanteError" @click="abrirComprobante" />

        <div class="comprobante-image-fallback">
          <v-icon size="34">
            mdi-file-image-outline
          </v-icon>

          <span>
            No se pudo mostrar el comprobante
          </span>
        </div>

        <div class="imagen-overlay" @click="abrirComprobante">
          <v-icon size="20">
            mdi-magnify-plus-outline
          </v-icon>

          Ver comprobante
        </div>
      </div>

      <div v-if="pago.comprobante?.archivo" class="archivo-info">
        <v-icon size="20">
          mdi-file-image-outline
        </v-icon>

        <div>
          <strong>
            {{ pago.comprobante.archivo.nombre }}
          </strong>

          <span>
            {{ formatoTamano(pago.comprobante.archivo.tamano_bytes) }}
          </span>
        </div>
      </div>

      <div v-if="pago.comprobante?.fecha_validacion" class="validacion">
        <v-icon size="18">
          mdi-check-circle-outline
        </v-icon>

        Validado el

        {{ formatoFecha(pago.comprobante.fecha_validacion) }}
      </div>

      <div v-if="pago.comprobante.fecha_validacion" class="validacion">

        <v-icon size="18">

          mdi-check-circle-outline

        </v-icon>

        Validado el

        {{ formatoFecha(pago.comprobante.fecha_validacion) }}

      </div>

    </section>

    <!-- =================================================

           BOTÓN VOLVER

      ================================================== -->

    <button class="volver-btn" @click="volver">

      <v-icon size="20">

        mdi-arrow-left

      </v-icon>

      Volver a mis pagos

    </button>

    <div class="footer-space"></div>

  </div>

  <!-- =====================================================

         ERROR

    ====================================================== -->

  <div v-else class="error-container">

    <div class="error-icon">

      <v-icon size="32">

        mdi-alert-circle-outline

      </v-icon>

    </div>

    <h2>No se pudo cargar el pago</h2>

    <p>

      No encontramos la información de este comprobante.

    </p>

    <button class="volver-btn" @click="volver">

      Volver a mis pagos

    </button>

  </div>

  <!-- =====================================================

         VISOR DE COMPROBANTE

    ====================================================== -->

  <v-dialog v-model="mostrarComprobante" max-width="auto">
    <v-card class="visor-card">

      <div class="visor-header">
        <strong>Comprobante</strong>

        <v-icon
          color="primary"
          size="30"
          icon="mdi-close"
          @click="mostrarComprobante = false"
        ></v-icon>
      </div>

      <img
        v-if="pago?.comprobante?.archivo?.url"
        :src="getComprobanteUrl()"
        class="visor-imagen"
        alt="Comprobante"
        @error="onComprobanteError"
      />

    </v-card>
  </v-dialog>

</div>
</template>

<script>
import { getFileUrl } from "@/utils/ayuda";
import {

  getPagoClienteById

} from "../services/pago.api";

export default {

  name: "PagoComprobanteDetallePage",

  data() {

    return {

      pago: null,

      cargando: true,

      mostrarComprobante: false,

    };

  },

  computed: {

    imagenNegocio() {

      if (!this.pago?.negocio) {

        return null;

      }

      return (

        this.pago.negocio.portada ||

        this.pago.negocio.logo ||

        null

      );

    },

  },

  methods: {
    getFileUrl,

    // =====================================================

    // OBTENER DETALLE

    // =====================================================

    async obtenerDetalle() {

      try {

        this.cargando = true;

        const id = this.$route.params.id;

        const res = await getPagoClienteById(id);

        console.log("DETALLE PAGO CLIENTE:", res.data);

        if (res.data?.ok) {

          this.pago = res.data.data;

        } else {

          this.pago = null;

        }

      } catch (error) {

        console.error(

          "Error al obtener detalle del pago:",

          error

        );

        this.pago = null;

        if (this.$piaAlert) {

          this.$piaAlert.error(

            error.response?.data?.mensaje ||

            "No fue posible obtener el detalle del pago.", {

              title: "Error"

            }

          );

        }

      } finally {

        this.cargando = false;

      }

    },

    // =====================================================

    // VOLVER

    // =====================================================

    volver() {

      this.$router.push("/cliente/pagos");

    },

    // =====================================================

    // IMAGEN

    // =====================================================

    urlImagen(url) {

      if (!url) {
        return null;
      }

      let valor = String(url).trim();

      if (!valor) {
        return null;
      }

      if (/^https?:\/\//i.test(valor)) {
        return valor;
      }

      const baseUrl = (
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000"
      ).replace(/\/+$/, "");

      if (!valor.startsWith("/")) {
        valor = `/${valor}`;
      }

      const ruta = valor
        .split("/")
        .map((segmento) => {
          if (!segmento) return "";
          try {
            return encodeURIComponent(decodeURIComponent(segmento));
          } catch (error) {
            return encodeURIComponent(segmento);
          }
        })
        .join("/");

      return `${baseUrl}${ruta}`;
    },

    // =====================================================

    // URL DEL COMPROBANTE

    // =====================================================

    // =====================================================
    // URL DEL COMPROBANTE
    // =====================================================

    getComprobanteUrl() {
      const url = this.pago?.comprobante?.archivo?.url;

      if (!url) {
        return "";
      }

      const valor = String(url).trim();

      // Si ya viene completa
      if (
        valor.startsWith("http://") ||
        valor.startsWith("https://")
      ) {
        return valor;
      }

      const baseUrl =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      return `${baseUrl.replace(/\/+$/, "")}/${valor.replace(/^\/+/, "")}`;
    },

    // =====================================================
    // ERROR DE COMPROBANTE
    // =====================================================

    onComprobanteError(event) {
      console.error(
        "No se pudo cargar el comprobante:",
        this.getComprobanteUrl()
      );

      if (event?.target) {
        event.target.style.display = "none";

        event.target.parentElement?.classList.add(
          "imagen-error"
        );
      }
    },

    // =====================================================
    // ABRIR COMPROBANTE
    // =====================================================

    abrirComprobante() {
      this.mostrarComprobante = true;
    },

    // =====================================================

    // FECHA

    // =====================================================

    formatoFecha(fecha) {

      if (!fecha) {

        return "—";

      }

      const date = new Date(fecha);

      if (Number.isNaN(date.getTime())) {

        return "—";

      }

      return date.toLocaleDateString("es-BO", {

        day: "2-digit",

        month: "long",

        year: "numeric",

      });

    },

    // =====================================================

    // HORA

    // =====================================================

    formatoHora(hora) {

      if (!hora) {

        return "—";

      }

      const partes = String(hora).split(":");

      if (partes.length < 2) {

        return hora;

      }

      return `${partes[0]}:${partes[1]}`;

    },

    // =====================================================

    // MONEDA

    // =====================================================

    formatoMoneda(valor) {

      const numero = Number(valor || 0);

      return numero.toLocaleString("es-BO", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2,

      });

    },

    // =====================================================

    // TAMAÑO ARCHIVO

    // =====================================================

    formatoTamano(bytes) {

      const numero = Number(bytes || 0);

      if (!numero) {

        return "Tamaño desconocido";

      }

      if (numero < 1024) {

        return `${numero} B`;

      }

      if (numero < 1024 * 1024) {

        return `${(numero / 1024).toFixed(1)} KB`;

      }

      return `${(numero / (1024 * 1024)).toFixed(1)} MB`;

    },

    // =====================================================

    // ESTADO

    // =====================================================

    textoEstado(estado) {

      const estados = {

        PENDIENTE: "Pendiente",

        VALIDADO: "Validado",

        APROBADO: "Aprobado",

        RECHAZADO: "Rechazado",

        ACTIVO: "Activo",

        ANULADO: "Anulado",

      };

      return estados[estado] || estado || "Desconocido";

    },

    claseEstado(estado) {

      if (

        estado === "VALIDADO" ||

        estado === "APROBADO"

      ) {

        return "estado-success";

      }

      if (estado === "RECHAZADO") {

        return "estado-error";

      }

      if (estado === "ANULADO") {

        return "estado-error";

      }

      return "estado-pending";

    },

    iconoEstado(estado) {

      if (

        estado === "VALIDADO" ||

        estado === "APROBADO"

      ) {

        return "mdi-check-circle-outline";

      }

      if (

        estado === "RECHAZADO" ||

        estado === "ANULADO"

      ) {

        return "mdi-close-circle-outline";

      }

      return "mdi-clock-outline";

    },

  },

  mounted() {

    this.obtenerDetalle();

  },

};
</script>

<style lang="scss" scoped>
.pago-detalle-page {

  min-height: 100vh;

  background: #f7fbfb;

  padding: 16px;

  padding-bottom: 90px;

}

/* =========================================================

   HEADER

========================================================= */

.page-header {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 18px;

}

.page-header h1 {

  margin: 0;

  color: #172b35;

  font-size: 22px;

  font-weight: 750;

}

.page-header p {

  margin: 3px 0 0;

  color: #78909c;

  font-size: 12px;

}

.back-btn {

  width: 40px;

  height: 40px;

  border: 1px solid #e2eeee;

  border-radius: 12px;

  background: white;

  color: #008b8b;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* =========================================================

   MONTO

========================================================= */

.monto-card {

  background: linear-gradient(135deg,

      #008b8b,

      #00a6a6);

  border-radius: 20px;

  padding: 22px;

  color: white;

  margin-bottom: 14px;

  box-shadow: 0 8px 22px rgba(0, 139, 139, 0.18);

}

.estado-row {

  display: flex;

  justify-content: flex-end;

}

.monto-label {

  margin-top: 18px;

  font-size: 12px;

  opacity: 0.85;

}

.monto {

  margin-top: 2px;

  font-size: 32px;

  font-weight: 800;

  letter-spacing: -0.5px;

}

.metodo-pago {

  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 8px;

  font-size: 13px;

  opacity: 0.9;

}

/* =========================================================

   CARDS

========================================================= */

.card {

  background: white;

  border: 1px solid #e5eeee;

  border-radius: 18px;

  padding: 17px;

  margin-bottom: 14px;

}

.section-title {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 15px;

}

.section-icon {

  width: 38px;

  height: 38px;

  border-radius: 11px;

  background: #e9f8f8;

  color: #008b8b;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

}

.section-title h2 {

  margin: 0;

  font-size: 15px;

  color: #263b45;

  font-weight: 700;

}

.section-title p {

  margin: 2px 0 0;

  font-size: 11px;

  color: #8aa0aa;

}

/* =========================================================

   INFO

========================================================= */

.info-list {

  border-top: 1px solid #edf2f2;

}

.info-row {

  min-height: 44px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  border-bottom: 1px solid #edf2f2;

  font-size: 12px;

}

.info-row:last-child {

  border-bottom: 0;

}

.info-row span {

  color: #81939b;

}

.info-row strong {

  color: #30444d;

  font-weight: 650;

  text-align: right;

  word-break: break-word;

}

/* =========================================================

   RESERVA

========================================================= */

.reserva-numero {

  font-size: 13px;

  font-weight: 700;

  color: #008b8b;

  margin-bottom: 14px;

}

.reserva-fecha {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 14px;

}

.fecha-icon {

  width: 38px;

  height: 38px;

  border-radius: 11px;

  background: #eefafa;

  color: #008b8b;

  display: flex;

  align-items: center;

  justify-content: center;

}

.reserva-fecha span,

.horario-box span {

  display: block;

  color: #8b9ba2;

  font-size: 10px;

}

.reserva-fecha strong,

.horario-box strong {

  display: block;

  margin-top: 2px;

  color: #30444d;

  font-size: 13px;

}

.horario-box {

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: #f7fbfb;

  border-radius: 13px;

  padding: 13px;

  margin-bottom: 15px;

}

.horario-box>div {

  flex: 1;

}

.horario-box>div:last-child {

  text-align: right;

}

.horario-box>.v-icon {

  color: #9ab0b7;

  margin: 0 12px;

}

.precios {

  border-top: 1px solid #edf2f2;

  padding-top: 7px;

}

.precio-row {

  display: flex;

  justify-content: space-between;

  gap: 10px;

  padding: 9px 0;

  font-size: 12px;

}

.precio-row span {

  color: #7c9199;

}

.precio-row strong {

  color: #30444d;

}

.precio-row.pagado strong {

  color: #008b8b;

}

.precio-row.saldo {

  border-top: 1px dashed #dce7e7;

  margin-top: 3px;

  padding-top: 12px;

}

.precio-row.saldo strong {

  color: #ef8c28;

}

/* =========================================================

   SERVICIO

========================================================= */

.servicio-content {

  display: flex;

  gap: 12px;

}

.servicio-icon-large {

  width: 48px;

  height: 48px;

  border-radius: 14px;

  background: #eefafa;

  color: #008b8b;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

}

.servicio-info {

  min-width: 0;

}

.servicio-info h3 {

  margin: 0;

  font-size: 14px;

  color: #263b45;

}

.servicio-info p {

  margin: 5px 0 8px;

  color: #82949b;

  font-size: 11px;

  line-height: 1.4;

}

.servicio-meta {

  display: flex;

  gap: 13px;

  flex-wrap: wrap;

}

.servicio-meta span {

  display: flex;

  align-items: center;

  gap: 3px;

  color: #687f88;

  font-size: 11px;

}

/* =========================================================

   PERSONA / PROFESIONAL

========================================================= */

.persona-row,

.negocio-row {

  display: flex;

  align-items: center;

  gap: 12px;

}

.persona-avatar,

.negocio-imagen {

  width: 58px;

  height: 58px;

  border-radius: 15px;

  overflow: hidden;

  background: #edf7f7;

  color: #008b8b;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

}

.persona-avatar img,

.negocio-imagen img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}

.persona-info,

.negocio-info {

  min-width: 0;

}

.persona-info h3,

.negocio-info h3 {

  margin: 0 0 4px;

  color: #263b45;

  font-size: 14px;

  font-weight: 700;

}

.persona-info span {

  color: #8a9da4;

  font-size: 11px;

}

.negocio-info>div {

  display: flex;

  align-items: center;

  gap: 4px;

  color: #82949b;

  font-size: 11px;

  margin-top: 3px;

}

/* =========================================================

   COMPROBANTE

========================================================= */

.comprobante-estado {

  margin-bottom: 13px;

}

.estado-badge {

  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 6px 9px;

  border-radius: 20px;

  font-size: 10px;

  font-weight: 700;

}

.estado-pending {

  background: #fff5df;

  color: #c47a00;

}

.estado-success {

  background: #e8f8ef;

  color: #159447;

}

.estado-error {

  background: #fff0f0;

  color: #df4545;

}

.monto-card .estado-badge {

  background: rgba(255, 255, 255, 0.18);

  color: white;

}

.observacion {

  display: flex;

  align-items: flex-start;

  gap: 7px;

  background: #fff8e9;

  color: #916b1a;

  border-radius: 11px;

  padding: 10px;

  font-size: 11px;

  margin-bottom: 13px;

}

.comprobante-imagen-wrapper {

  position: relative;

  min-height: 210px;

  overflow: hidden;

  border-radius: 14px;

  background: #f2f5f5;

  cursor: pointer;

}

.comprobante-imagen {

  display: block;

  width: 100%;

  max-height: 350px;

  object-fit: contain;

}

.comprobante-image-fallback {

  position: absolute;

  inset: 0;

  display: none;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  color: #8a9ba5;

  background: #f5f8f8;

  font-size: 11px;

}

.comprobante-imagen-wrapper.imagen-error .comprobante-image-fallback {

  display: flex;

}

.imagen-overlay {

  position: absolute;

  left: 0;

  right: 0;

  bottom: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 9px;

  background: rgba(0, 0, 0, 0.48);

  color: white;

  font-size: 11px;

}

.archivo-info {

  display: flex;

  align-items: center;

  gap: 9px;

  margin-top: 12px;

  color: #008b8b;

}

.archivo-info div {

  min-width: 0;

}

.archivo-info strong,

.archivo-info span {

  display: block;

}

.archivo-info strong {

  color: #425761;

  font-size: 11px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}

.archivo-info span {

  margin-top: 2px;

  color: #91a1a7;

  font-size: 10px;

}

.validacion {

  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 12px;

  color: #159447;

  font-size: 11px;

}

/* =========================================================

   BOTÓN

========================================================= */

.volver-btn {

  width: 100%;

  min-height: 46px;

  border: 1px solid #d9e8e8;

  border-radius: 13px;

  background: white;

  color: #008b8b;

  font-size: 13px;

  font-weight: 700;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

}

/* =========================================================

   LOADING / ERROR

========================================================= */

.loading-container,

.error-container {

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

}

.loading-container span {

  margin-top: 12px;

  color: #82949b;

  font-size: 12px;

}

.error-icon {

  width: 62px;

  height: 62px;

  border-radius: 50%;

  background: #fff0f0;

  color: #e85b5b;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 14px;

}

.error-container h2 {

  margin: 0;

  color: #354952;

  font-size: 17px;

}

.error-container p {

  max-width: 280px;

  margin: 7px 0 18px;

  color: #8a9ba2;

  font-size: 12px;

}

/* =========================================================

   VISOR

========================================================= */

.visor-card {

  overflow: hidden;

  border-radius: 18px !important;

  background: white;

}

.visor-header {

  height: 52px;

  padding: 0 15px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom: 1px solid #e8eeee;

  color: #30444d;

}

.visor-close {

  width: 34px;

  height: 34px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #607780;

}

.visor-imagen {

  display: block;

  width: 100%;

  max-height: 75vh;

  object-fit: contain;

  background: #f4f6f6;

}

/* =========================================================

   FOOTER

========================================================= */

.footer-space {

  height: 15px;

}
</style>
