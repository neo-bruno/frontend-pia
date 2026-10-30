<template>
<div class="resumen-page">

  <!-- HEADER -->
  <div class="resumen-header">

    <v-btn icon variant="text" @click="$router.back()">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <div class="logo-pia">
      PIA
    </div>

    <v-btn icon variant="text">
      <v-icon>mdi-heart-outline</v-icon>
    </v-btn>

  </div>

  <!-- TITULO -->
  <div class="titulo-seccion">

    <h1>
      Confirmar reserva
    </h1>

    <p>
      Revisa los detalles, realiza el pago (si aplica) y confirma tu cita.
    </p>

  </div>

  <!-- CONTENIDO -->
  <div v-if="reserva" class="contenido-resumen">

    <!-- =====================================================
           PROFESIONAL
      ====================================================== -->

    <div class="profesional-card">

      <img v-if="reserva?.profesional?.foto" :src="getFileUrl(reserva?.profesional.foto)" class="profesional-foto" />

      <div class="profesional-info">

        <div class="profesional-nombre">
          {{ reserva?.profesional?.nombre }}
        </div>

        <div class="profesional-tipo">
          Profesional de belleza
        </div>

        <div class="profesional-rating">
          <v-icon size="20" color="#F59E0B">mdi-star</v-icon>
          <strong>{{ Number(reserva?.profesional?.calificacion_promedio ?? reserva?.profesional?.calificacion ?? 0).toFixed(1) }}</strong>

          <span>({{ reserva?.profesional?.total_resenas ?? reserva?.profesional?.cantidad_resenas ?? 0 }}reseñas)</span>
        </div>

      </div>

    </div>

    <!-- =====================================================
           CLIENTE
      ====================================================== -->

    <div class="cliente-card">

      <div class="cliente-icono">

        <v-icon size="27">
          mdi-account
        </v-icon>

      </div>

      <div class="cliente-info">

        <div class="campo-label">
          Cliente
        </div>

        <div class="campo-valor">
          {{ reserva?.cliente?.nombre || reserva?.cliente?.alias }}
        </div>
        <div class="campo-label">
          {{ reserva?.cliente?.telefono }}
        </div>

      </div>

    </div>

    <!-- =====================================================
           SERVICIO
      ====================================================== -->

    <div class="servicio-card">

      <img v-if="reserva?.servicio?.foto" :src="getFileUrl(reserva?.servicio.foto)" class="servicio-foto" />

      <div class="servicio-info">

        <div class="campo-label">
          Servicio
        </div>

        <div class="servicio-nombre">
          {{ reserva?.servicio?.nombre }}
        </div>

        <div class="servicio-detalles">

          <span>

            <v-icon size="17">
              mdi-clock-outline
            </v-icon>

            {{ reserva?.servicio?.duracion }}
            minutos

          </span>

          <span class="precio-servicio">

            <v-icon size="17">
              mdi-currency-usd
            </v-icon>

            Bs {{ reserva?.servicio?.precio }}

          </span>

        </div>

        <div class="servicio-descripcion">
          {{ reserva?.servicio?.descripcion }}
        </div>

      </div>

    </div>

    <!-- =====================================================
           FECHA Y HORA
      ====================================================== -->

    <div class="fecha-card">

      <div class="fecha-icono">

        <v-icon size="27">
          mdi-calendar-month
        </v-icon>

      </div>

      <div class="fecha-info">

        <div class="campo-label">
          Fecha y hora
        </div>

        <div class="fecha">
          {{ formatearFecha(reserva?.fecha) }}
        </div>

        <div class="hora">

          <v-icon size="18">
            mdi-clock-outline
          </v-icon>

          <strong>
            {{ reserva?.hora_inicio.slice(0, 5) }}
            -
            {{ reserva?.hora_fin.slice(0, 5) }}
          </strong>

          <span>
            ({{ reserva?.servicio?.duracion }} min)
          </span>

        </div>

      </div>

    </div>

    
    <!-- =====================================================
      CÓDIGO DE DESCUENTO
    ====================================================== -->
    <div v-if="!consultandoDescuento && tieneDescuentoDisponible" class="descuento-card">
      <div class="descuento-titulo">
        <v-icon color="#079b99">mdi-ticket-percent-outline</v-icon>
        <strong>¿Tienes un código de descuento?</strong>
      </div>

      <div class="descuento-formulario">
        <v-text-field
          v-model="codigoDescuento"
          label="Código de descuento"
          placeholder="Ingresa tu código"
          variant="outlined"
          density="comfortable"
          hide-details
          :disabled="validandoDescuento || descuentoAplicado"
          @update:model-value="limpiarValidacionDescuento"
          @keyup.enter="aplicarCodigoDescuento"
        />

        <v-btn
          color="#079b99"
          class="btn-aplicar-descuento"
          :loading="validandoDescuento"
          :disabled="!codigoDescuento.trim() || descuentoAplicado"
          @click="aplicarCodigoDescuento"
        >
          {{ descuentoAplicado ? "Aplicado" : "Aplicar" }}
        </v-btn>
      </div>

      <div v-if="descuentoAplicado" class="descuento-exito">
        <div class="descuento-exito-header">
          <div class="descuento-exito-icono">
            <v-icon icon="mdi-ticket-confirmation" />
          </div>

          <div class="descuento-exito-titulo">
            <strong>Descuento aplicado</strong>
            <span>{{ codigoDescuento }}</span>
          </div>

          <v-icon
            icon="mdi-check-circle"
            class="descuento-check"
          />
        </div>

        <div class="descuento-exito-detalle">
          <div>
            <span>Tu ahorro</span>
            <strong>Bs {{ Number(montoDescuento).toFixed(2) }}</strong>
          </div>

          <span class="descuento-etiqueta">
            ¡Ahorro confirmado!
          </span>
        </div>

        <button
          type="button"
          class="descuento-quitar"
          @click="quitarDescuento"
        >
          <v-icon icon="mdi-close" size="16" />
          Quitar descuento
        </button>
      </div>

      <div
        v-else-if="mensajeDescuento"
        class="descuento-mensaje descuento-error"
      >
        <v-icon size="18">mdi-alert-circle-outline</v-icon>
        {{ mensajeDescuento }}
      </div>
    </div>


    <!-- =====================================================
       DETALLE DE PAGO
  ====================================================== -->

    <div class="seccion-pago">

      <div class="seccion-titulo">

        <v-icon>
          mdi-receipt-text-outline
        </v-icon>

        <strong>
          Detalle de pago
        </strong>

      </div>

      <div class="fila-pago">

        <span>
          Precio del servicio
        </span>

        <strong>
          Bs {{ pago.precio_original }}
        </strong>

      </div>

      <!-- PROMOCION -->

      <div v-if="pago.monto_promocion > 0" class="fila-pago descuento">

        <span>
          Promoción aplicada
        </span>

        <strong>
          - Bs {{ pago.monto_promocion }}
        </strong>

      </div>

      <!-- DESCUENTO -->

      <div v-if="pago.monto_descuento > 0" class="fila-pago descuento">

        <span>
          Descuento
        </span>

        <strong>
          - Bs {{ pago.monto_descuento }}
        </strong>

      </div>

      <!-- TOTAL -->

      <div class="total-pago">

        <strong>
          Total a pagar
        </strong>

        <strong>
          Bs {{ pago.precio_aplicable }}
        </strong>

      </div>

      <!-- ADELANTO -->

      <div v-if="pago.requiere_adelanto" class="fila-adelanto">

        <span>
          Adelanto requerido
        </span>

        <strong>
          Bs {{ pago.monto_adelanto }}
        </strong>

      </div>

      <!-- SALDO -->

      <div v-if="pago.requiere_adelanto" class="fila-saldo">

        <span>
          Saldo pendiente
        </span>

        <strong>
          Bs {{ pago.saldo }}
        </strong>

      </div>

    </div>

    <!-- =====================================================
     CONDICIONES
====================================================== -->

    <div v-if="condicion" class="condiciones-card">

      <div class="condiciones-titulo">

        <v-icon>
          mdi-file-document-outline
        </v-icon>

        <div>

          <strong>
            Condiciones del servicio
          </strong>

          <div class="condicion-nombre">
            {{ condicion.nombre }}
          </div>

        </div>

      </div>

      <!-- DESCRIPCIÓN -->

      <div v-if="condicion.descripcion" class="condicion-item">

        <div class="condicion-icono">

          <v-icon size="15">
            mdi-check
          </v-icon>

        </div>

        <div class="condicion-texto">

          {{ condicion.descripcion }}

        </div>

      </div>

      <!-- ADELANTO -->

      <div v-if="condicion.requiere_adelanto" class="condicion-item">

        <div class="condicion-icono">

          <v-icon size="15">
            mdi-cash-multiple
          </v-icon>

        </div>

        <div class="condicion-texto">

          Requiere un adelanto de

          <strong>
            Bs {{ pago.monto_adelanto }}
          </strong>

          para confirmar tu reserva.

        </div>

      </div>

      <!-- REPROGRAMACIÓN -->

      <div class="condicion-item">

        <div class="condicion-icono">

          <v-icon size="15">
            mdi-calendar-refresh
          </v-icon>

        </div>

        <div class="condicion-texto">

          <template v-if="condicion.permite_reprogramar">

            Puedes reprogramar hasta

            <strong>
              {{ condicion.limite_horas_reprogramacion }} horas
            </strong>

            antes de tu cita.

          </template>

          <template v-else>

            Este servicio no permite reprogramación.

          </template>

        </div>

      </div>

      <!-- CANCELACIÓN -->

      <div class="condicion-item">

        <div class="condicion-icono">

          <v-icon size="15">
            mdi-calendar-remove
          </v-icon>

        </div>

        <div class="condicion-texto">

          <template v-if="condicion.permite_cancelar">

            Puedes cancelar hasta

            <strong>
              {{ condicion.limite_horas_cancelacion }} horas
            </strong>

            antes de tu cita.

          </template>

          <template v-else>

            Este servicio no permite cancelación.

          </template>

        </div>

      </div>

    </div>

    <!-- =====================================================
           PAGO
      ====================================================== -->

    <div v-if="pago.requiere_adelanto" class="pago-seccion">

      <!-- PASO 1 -->
      <div class="pago-paso">

        <div class="numero-paso">
          1
        </div>

        <div>

          <div class="pago-titulo">
            Realiza el pago
          </div>

          <div class="pago-descripcion">
            Escanea el código QR con tu banca móvil
            o aplicación de pago.
          </div>

        </div>

      </div>

      <div class="qr-container">

        <!-- QR -->
        <div class="qr-header">

          <strong>
            Pago por QR
          </strong>

          <v-btn icon size="small" variant="tonal" :disabled="!pagoQr" @click="descargarQR">

            <v-icon>
              mdi-download
            </v-icon>

          </v-btn>

        </div>
        <img v-if="pagoQr" :src="
      getFileUrl(
        typeof pagoQr === 'string'
         ?pagoQr
          : pagoQr.url
      )
    " class="qr-imagen" />

        <div v-else class="qr-sin-imagen">

          <v-icon size="40">
            mdi-qrcode-remove
          </v-icon>

          <div>
            El profesional todavía no tiene
            configurado su código QR.
          </div>

        </div>

        <div class="qr-monto">

          Monto:

          <strong>
            Bs {{ pago.monto_adelanto }}
          </strong>

        </div>

      </div>

      <!-- PASO 2 -->
      <div class="pago-paso">

        <div class="numero-paso">
          2
        </div>

        <div>

          <div class="pago-titulo">
            Sube tu comprobante de pago
          </div>

          <div class="pago-descripcion">
            Selecciona o toma una foto de tu comprobante.
            JPG, PNG o PDF (máx. 5MB)
          </div>

        </div>

      </div>

      <!-- UPLOAD -->
      <div class="comprobante-upload">

        <v-icon size="35">
          mdi-cloud-upload-outline
        </v-icon>

        <span>
          Seleccionar comprobante
        </span>

        <input type="file" accept="image/jpeg,image/png,application/pdf" @change="seleccionarComprobante" />

      </div>

      <!-- ARCHIVO SELECCIONADO -->
      <div v-if="comprobante" class="comprobante-seleccionado">

        <v-icon>
          mdi-file-check-outline
        </v-icon>

        <span>
          {{ comprobante.name }}
        </span>

        <v-btn icon size="small" variant="text" @click="comprobante = null">

          <v-icon>
            mdi-close
          </v-icon>

        </v-btn>

      </div>

    </div>

    <!-- =====================================================
           CONFIRMAR
      ====================================================== -->

    <v-btn block size="large" class="btn-confirmar" :loading="confirmando" :disabled="
          pago.requiere_adelanto &&
          !comprobante
        " @click="confirmarReserva">

      <v-icon start>
        mdi-check-circle
      </v-icon>

      Confirmar reserva

    </v-btn>

  </div>

  <!-- LOADING -->

  <div v-else class="loading">

    <v-progress-circular indeterminate color="primary" />

    <div>
      Cargando resumen...
    </div>

  </div>

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>

</template>

<script>
import {
  useReservaStore
} from "@/stores/reserva.store";
import {
  getFileUrl
} from "@/utils/ayuda";
import { confirmReservation } from "../services/reserva.api";
import { verificarDescuentosPorServicio, validarCodigoDescuento } from "@/modules/cliente/modules/descuentos/services/descuentoCliente.api";

export default {

  data() {
    return {
      reservaStore: useReservaStore(),
      confirmando: false,
      comprobante: null,

      codigoDescuento: "",
      descuentoAplicado: false,
      validandoDescuento: false,
      mensajeDescuento: "",
      montoDescuento: 0,

      consultandoDescuento: false,
      tieneDescuentoDisponible: false,

      overlay: false,
    };
  },

  computed: {

    reserva() {
      return this.reservaStore.reserva
    },

    condicion() {
      return this.reserva?.servicio?.condicion || null
    },

    condiciones() {

      if (!this.condicion) {
        return []
      }

      return [{
          tipo: "descripcion",
          descripcion: this.condicion.descripcion
        },
        {
          tipo: "reprogramacion",
          descripcion: this.condicion.permite_reprogramar ?
            `Puedes reprogramar hasta ${this.condicion.limite_horas_reprogramacion} horas antes de tu cita.` :
            "Este servicio no permite reprogramación."
        },
        {
          tipo: "cancelacion",
          descripcion: this.condicion.permite_cancelar ?
            `Puedes cancelar hasta ${this.condicion.limite_horas_cancelacion} horas antes de tu cita.` :
            "Este servicio no permite cancelación."
        }
      ]
    },

    pago() {

      const precioOriginal = Number(this.reserva?.servicio?.precio || 0)

      const montoPromocion = Number(this.reserva?.monto_promocion || 0)

      const montoDescuento = this.descuentoAplicado ? Number(this.montoDescuento || 0) : 0;

      const precioAplicable = precioOriginal - montoPromocion - montoDescuento

      const condicion = this.condicion

      let montoAdelanto = 0

      if (condicion?.requiere_adelanto) {

        if (condicion.monto_adelanto != null) {

          montoAdelanto = Number(
            condicion.monto_adelanto
          )

        } else if (condicion.porcentaje_adelanto != null) {

          montoAdelanto =
            precioAplicable *
            Number(condicion.porcentaje_adelanto) /
            100
        }
      }

      const saldo =
        Math.max(
          precioAplicable - montoAdelanto,
          0
        )

      return {

        precio_original: precioOriginal,

        monto_promocion: montoPromocion,

        monto_descuento: montoDescuento,

        precio_aplicable: precioAplicable,

        monto_adelanto: montoAdelanto,

        saldo: saldo,

        requiere_adelanto: condicion?.requiere_adelanto === true

      }
    },
    
    pagoQr() {

      return this.reserva?.profesional?.pago_qr || null

    }

  },

  watch: {
    reserva: {
      immediate: true,
      handler() {
        this.consultarDescuentoDelServicio();
      },
    },

    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false;
      }, 100000);
    },
  },

  methods: {
    getFileUrl,

    // =====================================================
    // FECHA
    // =====================================================
    formatearFecha(fecha) {

      if (!fecha) return "";

      const date = new Date(`${fecha}T00:00:00`);

      return date.toLocaleDateString(
        "es-BO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );

    },

    // =====================================================
    // COMPROBANTE
    // =====================================================
    seleccionarComprobante(event) {

      const archivo = event.target.files?. [0];

      if (!archivo) return;

      // Validar tamaño máximo 5 MB
      if (archivo.size > 5 * 1024 * 1024) {

        alert("El comprobante no puede superar los 5 MB.");

        event.target.value = "";

        return;

      }

      this.comprobante = archivo;

    },

    // =====================================================
    // DESCARGAR QR
    // =====================================================
    descargarQR() {

      if (!this.pagoQr) {
        console.warn("⚠️ No existe QR de pago");
        return;
      }

      /*
       * Soportamos:
       *
       * pago_qr = "/uploads/..."
       *
       * o
       *
       * pago_qr = { url: "/uploads/..." }
       */

      const rutaQr =
        typeof this.pagoQr === "string" ?
        this.pagoQr :
        this.pagoQr?.url;

      if (!rutaQr) {
        console.warn("⚠️ El QR no tiene URL");
        return;
      }

      const url = getFileUrl(rutaQr);

      const link = document.createElement("a");

      link.href = url;
      link.download = "qr-pago-pia.png";
      link.target = "_blank";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    },
    
    async consultarDescuentoDelServicio() {
      this.tieneDescuentoDisponible = false;
      this.codigoDescuento = "";
      this.descuentoAplicado = false;
      this.montoDescuento = 0;
      this.mensajeDescuento = "";

      const servicioId = Number(
        this.reserva?.servicio?.id ??
        this.reserva?.servicio_id
      );

      if (!servicioId) return;

      this.consultandoDescuento = true;

      try {
        const respuesta = await verificarDescuentosPorServicio(servicioId);

        console.log(
          "RESPUESTA DE DESCUENTOS:",
          respuesta.data
        );

        this.tieneDescuentoDisponible =
          respuesta.data?.data?.tiene_descuento_disponible === true;

      } catch (error) {
        console.error(
          "Error al consultar descuentos del servicio:",
          error.response?.data || error
        );

        this.tieneDescuentoDisponible = false;

      } finally {
        this.consultandoDescuento = false;
      }
    },

    limpiarValidacionDescuento() {
      this.mensajeDescuento = "";
      this.descuentoAplicado = false;
      this.montoDescuento = 0;
    },

    async aplicarCodigoDescuento() {
      const codigo = this.codigoDescuento.trim();

      if (!codigo || this.validandoDescuento) return;

      const servicioId = Number(
        this.reserva?.servicio?.id ??
        this.reserva?.servicio_id
      );

      if (!servicioId) {
        this.mensajeDescuento = "No se pudo identificar el servicio seleccionado.";
        return;
      }

      this.validandoDescuento = true;
      this.mensajeDescuento = "";
      this.descuentoAplicado = false;
      this.montoDescuento = 0;

      try {
        const respuesta = await validarCodigoDescuento(
          codigo,
          servicioId,
        );

        const datos = respuesta.data?.data;

        if (!respuesta.data?.ok || !datos?.valido) {
          this.mensajeDescuento = "No se pudo validar el código.";
          return;
        }

        this.codigoDescuento = datos.codigo;
        this.montoDescuento = Number(datos.monto_descuento);
        this.descuentoAplicado = true;

        this.mensajeDescuento = "";

        console.log("DESCUENTO VALIDADO:", datos);
      } catch (error) {
        console.error(
          "Error al validar el código:",
          error.response?.data || error,
        );

        this.mensajeDescuento =
          error.response?.data?.mensaje ||
          "No se pudo validar el código de descuento.";
      } finally {
        this.validandoDescuento = false;
      }
    },

    quitarDescuento() {
      this.codigoDescuento = "";
      this.descuentoAplicado = false;
      this.montoDescuento = 0;
      this.mensajeDescuento = "";
    },

    // =====================================================
    // CONFIRMAR
    // =====================================================
    async confirmarReserva() {
      this.overlay = true
      		
      if (this.confirmando) {
        return
      }

      // =====================================================
      // VALIDACIÓN FRONTEND
      // =====================================================
      if (!this.reserva) {
        this.$swal({
          title: "Error Reserva!",
          text: "⚠️ No existe la reserva",
          icon: "error",
          timer: 2500
        })        
        return
      }

      if (this.pago.requiere_adelanto && !this.comprobante) {
        this.$swal({
          title: "Error Comprobante!",
          text: "Debes subir el comprobante de pago.",
          icon: "error",
          timer: 2500
        })
        return
      }
      this.confirmando = true

      try {
        // =====================================================
        // DATOS DE LA RESERVA
        // =====================================================
        const datosReserva = {
          cliente_id: this.reserva.cliente_id,
          profesional_id: this.reserva.profesional_id,
          servicio_id: this.reserva.servicio_id,
          fecha: this.reserva.fecha,
          hora_inicio: this.reserva.hora_inicio,
          hora_fin: this.reserva.hora_fin,
          slot_id: this.reserva.slot_id,
          slots_requeridos: this.reserva.slots_requeridos,
          slots_reserva: this.reserva.slots_reserva,
          codigo_descuento: this.descuentoAplicado ? this.codigoDescuento.trim() : null,
        }

        // =====================================================
        // DATOS DEL PAGO
        // =====================================================
        const datosPago = {
          precio_original: this.pago.precio_original,
          monto_promocion: this.pago.monto_promocion,
          monto_descuento: this.pago.monto_descuento,
          precio_aplicable: this.pago.precio_aplicable,
          monto_adelanto: this.pago.monto_adelanto,
          saldo: this.pago.saldo,
          requiere_adelanto: this.pago.requiere_adelanto
        }

        // =====================================================
        // FORM DATA
        // =====================================================
        const formData = new FormData()
        formData.append("reserva", JSON.stringify(datosReserva))
        formData.append("pago", JSON.stringify(datosPago))

        // =====================================================
        // CONDICIÓN
        // =====================================================
        if (this.condicion) {
          formData.append("condicion", JSON.stringify(this.condicion))
        }

        // =====================================================
        // COMPROBANTE
        // =====================================================
        if (this.comprobante) {
          formData.append("comprobante", this.comprobante)
        }

        // =====================================================
        // BACKEND
        // =====================================================        
        const res = await confirmReservation(formData)

        // =====================================================
        // ÉXITO
        // =====================================================

        if (res.status === 200 || res.status === 201) {
          const reservaCreada = res.data?.data?.reserva || res.data?.reserva || {}

          const reservaFinal = {
            ...this.reserva,
            ...reservaCreada,
            condicion: res.data.data.condicion
          }

          // Guardamos la reserva completa para la
          // pantalla de confirmación
          this.reservaStore.guardarReserva(reservaFinal)
         
          // ===================================================
          // IR A CONFIRMACIÓN
          // ===================================================
          this.$router.push({ name: "reserva-confirmada" })          
        }

      } catch (error) {
        console.log(error)        
        
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado",
        {
          title: "Error en la Reserva!",
        }
      );
      } finally {
        this.overlay = false
        this.confirmando = false
      }
    }
  },

  mounted() {
  }

};
</script>

<style lang="scss" scoped>
/* =====================================================
   PIA · ESTILO VISUAL DE CONFIRMACIÓN DE RESERVA
   Solo estilos: la plantilla y toda la lógica permanecen intactas.
===================================================== */
.resumen-page {
  --pia: #079b99;
  --pia-dark: #087f80;
  --pia-soft: #e8f8f7;
  --pia-pale: #f5fbfb;
  --pia-border: #d5e9e8;
  --pia-text: #263b43;
  --pia-muted: #71838a;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  color: var(--pia-text);
  font-family: inherit;
}

/* HEADER */
.resumen-header {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 62px;
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  padding: 0 8px;
  background: rgba(255, 255, 255, .97);
  border-bottom: 1px solid #e6efef;
  backdrop-filter: blur(10px);
}
.resumen-header .v-btn:first-child { justify-self: start; color: var(--pia); }
.resumen-header .v-btn:last-child { justify-self: end; color: var(--pia); }
.logo-pia {
  text-align: center;
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: var(--pia);
}

/* TÍTULO */
.titulo-seccion {
  text-align: center;
  padding: 17px 20px 18px;
  background: linear-gradient(180deg, #f4fbfb 0%, #fff 100%);
}
.titulo-seccion h1 {
  margin: 0;
  color: #20363d;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -.35px;
}
.titulo-seccion p {
  max-width: 310px;
  margin: 7px auto 0;
  color: #718087;
  font-size: 13px;
  line-height: 19px;
}

/* CONTENIDO */
.contenido-resumen { padding: 0 16px 28px; }

/* PROFESIONAL */
.profesional-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--pia-border);
  border-radius: 17px;
  background: linear-gradient(135deg, #fff 0%, #f7fcfc 100%);
  box-shadow: 0 3px 12px rgba(10, 107, 108, .055);
}
.profesional-foto {
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e3f5f4;
}
.profesional-info { min-width: 0; }
.profesional-nombre {
  color: #20363d;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.profesional-tipo { color: #73838a; font-size: 12px; margin-top: 3px; }
.profesional-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  color: #34474e;
  font-size: 12px;
}
.profesional-rating span { color: #71838a; }

/* CLIENTE Y FECHA */
.cliente-card,
.fecha-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 5px;
  border-bottom: 1px solid #e8eeee;
}
.cliente-icono,
.fecha-icono {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: var(--pia-soft);
  color: var(--pia);
}
.cliente-info, .fecha-info { min-width: 0; }
.campo-label { color: var(--pia-muted); font-size: 12px; line-height: 1.4; }
.campo-valor {
  color: #263b43;
  font-size: 14px;
  font-weight: 800;
  margin-top: 3px;
  overflow-wrap: anywhere;
}

/* SERVICIO */
.servicio-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 5px;
  border-bottom: 1px solid #e8eeee;
}
.servicio-foto {
  width: 72px;
  height: 76px;
  flex: 0 0 72px;
  object-fit: cover;
  border-radius: 12px;
  background: var(--pia-soft);
}
.servicio-info { min-width: 0; flex: 1; }
.servicio-nombre {
  color: #263b43;
  font-size: 14px;
  line-height: 1.35;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.servicio-detalles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-top: 6px;
  color: #667981;
  font-size: 12px;
}
.servicio-detalles span { display: inline-flex; align-items: center; gap: 4px; }
.servicio-detalles .v-icon { color: var(--pia); }
.precio-servicio { color: var(--pia-dark); font-weight: 800; }
.servicio-descripcion {
  margin-top: 6px;
  color: #718087;
  font-size: 12px;
  line-height: 17px;
  overflow-wrap: anywhere;
}

/* FECHA Y HORA */
.fecha { color: #34474e; font-size: 13px; margin-top: 4px; line-height: 1.45; text-transform: capitalize; }
.hora { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 7px; color: #34474e; font-size: 13px; }
.hora > .v-icon { color: var(--pia); }
.hora span { color: var(--pia-dark); }

/* DETALLE DE PAGO */
.seccion-pago {
  margin-top: 14px;
  padding: 14px 12px 10px;
  border: 1px solid #e1eeee;
  border-radius: 16px;
  background: #fff;
}
.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #263b43;
  margin-bottom: 10px;
  font-size: 15px;
}
.seccion-titulo .v-icon { color: var(--pia); }
.fila-pago {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 7px 2px;
  color: #65777e;
  font-size: 13px;
}
.fila-pago strong { color: #34474e; white-space: nowrap; }
.fila-pago.descuento strong { color: #d9534f; }
.total-pago {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding: 13px 12px;
  border: 1px solid #ccebe8;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8f8f7, #f5fcfb);
  color: #263b43;
  font-size: 13px;
}
.total-pago strong:last-child { color: var(--pia-dark); font-size: 18px; white-space: nowrap; }
.fila-adelanto, .fila-saldo {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 5px 2px;
  color: #65777e;
  font-size: 12px;
}
.fila-adelanto strong { color: var(--pia-dark); }
.fila-saldo strong { color: #263b43; }

/* CONDICIONES */
.condiciones-card {
  margin-top: 13px;
  padding: 14px;
  border: 1px solid #d6ecea;
  border-radius: 16px;
  background: #f1fafa;
}
.condiciones-titulo {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #263b43;
  margin-bottom: 10px;
  font-size: 14px;
}
.condiciones-titulo > .v-icon { color: var(--pia); }
.condicion-nombre { margin-top: 3px; color: var(--pia-dark); font-size: 12px; font-weight: 700; }
.condicion-item { display: flex; align-items: flex-start; gap: 8px; margin: 10px 0 0; }
.condicion-icono {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--pia);
  color: #fff;
}
.condicion-texto { color: #5f7279; font-size: 12px; line-height: 18px; }
.condicion-texto strong { color: #263b43; font-weight: 800; }

/* PAGO QR */
.pago-seccion { margin-top: 16px; }
.pago-paso { display: flex; align-items: flex-start; gap: 10px; margin: 15px 0 11px; }
.numero-paso {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--pia);
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  box-shadow: 0 3px 8px rgba(7, 155, 153, .18);
}
.pago-titulo { color: #263b43; font-weight: 800; font-size: 14px; line-height: 1.4; }
.pago-descripcion { color: #718087; font-size: 12px; line-height: 17px; margin-top: 3px; }
.qr-container {
  border: 1px solid var(--pia-border);
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  background: #fff;
}
.qr-header { display: flex; justify-content: space-between; align-items: center; gap: 8px; color: #263b43; margin-bottom: 8px; }
.qr-header strong { font-size: 14px; }
.qr-header .v-btn { color: var(--pia); background: var(--pia-soft); }
.qr-imagen { display: block; width: 100%; max-width: 280px; height: auto; margin: 0 auto; border-radius: 8px; }
.qr-monto { margin-top: 8px; color: #65777e; font-size: 13px; }
.qr-monto strong { color: var(--pia-dark); font-size: 15px; }
.qr-sin-imagen {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #718087;
  font-size: 13px;
  text-align: center;
}
.qr-sin-imagen .v-icon { color: var(--pia); }

/* COMPROBANTE */
.comprobante-upload {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 70px;
  padding: 13px;
  border: 1.5px dashed #91cfcc;
  border-radius: 14px;
  background: #f6fcfc;
  color: #315158;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  transition: background .2s ease, border-color .2s ease;
}
.comprobante-upload:hover { background: #eaf8f7; border-color: var(--pia); }
.comprobante-upload .v-icon { color: var(--pia); }
.comprobante-upload input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.comprobante-seleccionado {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 10px;
  border: 1px solid #d3ece5;
  border-radius: 11px;
  background: #f0faf6;
  color: #315b50;
  font-size: 12px;
}
.comprobante-seleccionado > .v-icon { color: #078a75; flex-shrink: 0; }
.comprobante-seleccionado span { flex: 1; min-width: 0; overflow-wrap: anywhere; }

/* BOTÓN CONFIRMAR */
.btn-confirmar {
  margin-top: 17px;
  min-height: 52px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #079b99, #087f80) !important;
  color: #fff !important;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: .1px;
  text-transform: none;
  box-shadow: 0 5px 13px rgba(7, 155, 153, .22) !important;
}
.btn-confirmar:hover { filter: brightness(1.04); }

/* CARGA */
.loading {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #65777e;
}

/* CÓDIGO DE DESCUENTO */
.descuento-card {
  margin-top: 13px;
  padding: 14px;
  border: 1px solid #cfe8e6;
  border-radius: 16px;
  background: linear-gradient(145deg, #f6fcfb, #fff);
}
.descuento-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 11px;
  color: #29434a;
  font-size: 13px;
  line-height: 1.4;
}
.descuento-titulo .v-icon { color: var(--pia); }
.descuento-formulario { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
.descuento-formulario .v-text-field { flex: 1; min-width: 0; }
.descuento-formulario :deep(.v-field) { border-radius: 11px; }
.descuento-formulario :deep(.v-field--focused .v-field__outline) { color: var(--pia); }
.btn-aplicar-descuento {
  min-height: 48px;
  margin-top: 1px;
  border-radius: 11px;
  background: var(--pia) !important;
  color: #fff !important;
  font-weight: 700;
  text-transform: none;
}
.descuento-mensaje { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; margin-top: 10px; font-size: 12px; }
.descuento-error { color: #c62828; }
.descuento-exito {
  padding: 14px;
  border: 1px solid #ccebe1;
  border-radius: 14px;
  background: linear-gradient(145deg, #f3fbf8, #fff);
  color: #087f65;
}
.descuento-exito-header { display: flex; align-items: center; gap: 10px; }
.descuento-exito-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  color: #008f83;
  background: #ddf6ef;
}
.descuento-exito-titulo { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 3px; }
.descuento-exito-titulo strong { color: #173b35; font-size: 14px; }
.descuento-exito-titulo span { color: #647b78; font-size: 12px; overflow-wrap: anywhere; }
.descuento-check { color: #079c82; }
.descuento-exito-detalle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #d9ede7;
}
.descuento-exito-detalle > div { display: flex; flex-direction: column; gap: 3px; }
.descuento-exito-detalle > div span { color: #647b78; font-size: 12px; }
.descuento-exito-detalle > div strong { color: #008f73; font-size: 21px; }
.descuento-etiqueta { padding: 6px 9px; border-radius: 20px; color: #087a5b; background: #e2f5ec; font-size: 10px; font-weight: 700; text-align: center; }
.descuento-quitar {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 12px 0 0 auto;
  padding: 7px 9px;
  border-radius: 10px;
  color: #8d3434;
  font-size: 12px;
  background: #fff5f5;
  border: 1px solid #f3dddd;
  cursor: pointer;
}
.descuento-quitar:hover { color: #c24141; background: #ffeded; }

/* AJUSTES PARA TELÉFONOS ESTRECHOS */
@media (max-width: 360px) {
  .contenido-resumen { padding-right: 12px; padding-left: 12px; }
  .titulo-seccion { padding-right: 16px; padding-left: 16px; }
  .profesional-card { gap: 9px; padding: 10px; }
  .profesional-foto { width: 62px; height: 62px; flex-basis: 62px; }
  .servicio-card { gap: 9px; }
  .servicio-foto { width: 64px; height: 70px; flex-basis: 64px; }
  .servicio-detalles { gap: 6px 9px; }
  .descuento-formulario { gap: 6px; }
  .btn-aplicar-descuento { padding-right: 10px; padding-left: 10px; }
}
</style>
