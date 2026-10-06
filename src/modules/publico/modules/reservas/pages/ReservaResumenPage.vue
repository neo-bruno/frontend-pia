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

          <v-icon size="20" color="#F59E0B">
            mdi-star
          </v-icon>

          <strong>
            {{ reserva?.profesional?.calificacion ?? '0' }}
          </strong>

          <span>
            ({{ reserva?.profesional?.cantidad_resenas ?? 0 }})
          </span>

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

export default {

  data() {
    return {
      reservaStore: useReservaStore(),
      confirmando: false,
      comprobante: null,

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

      const precioOriginal = Number(
        this.reserva?.servicio?.precio || 0
      )

      const montoPromocion = Number(
        this.reserva?.monto_promocion || 0
      )

      const montoDescuento = Number(
        this.reserva?.monto_descuento || 0
      )

      const precioAplicable =
        precioOriginal -
        montoPromocion -
        montoDescuento

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
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
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
          slots_reserva: this.reserva.slots_reserva
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

        console.log("====================================")
        console.log("🚀 CONFIRMANDO RESERVA")
        console.log("====================================")

        console.log("📋 RESERVA:", datosReserva)
        console.log("💰 PAGO:", datosPago)
        console.log("📋 CONDICIÓN:", this.condicion)
        console.log("📎 COMPROBANTE:", this.comprobante)

        // =====================================================
        // BACKEND
        // =====================================================        
        const res = await confirmReservation(formData)
        console.log("📥 RESPUESTA BACKEND:", res.data)

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

          console.log("✅ RESERVA FINAL PARA CONFIRMACIÓN:", reservaFinal)
          
          // ===================================================
          // IR A CONFIRMACIÓN
          // ===================================================
          this.$router.push({ name: "reserva-confirmada" })          
        }

      } catch (error) {
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
                error.response?.data?.error ||
                error.message || "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })
      } finally {
        this.overlay = false
        this.confirmando = false
      }
    }
  },

  mounted() {
    console.log("📦 RESERVA EN RESUMEN:", this.reserva);
    console.log("📋 CONDICION:", this.condicion);
    console.log("💰 PAGO:", this.pago);
    console.log("📱 QR:", this.pagoQr);
  }

};
</script>

<style lang="scss" scoped>
.resumen-page {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  min-height: 100vh;
  background: #ffffff;
}

/* =====================================================
   HEADER
===================================================== */

.resumen-header {
  height: 64px;
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.resumen-header .v-btn:first-child {
  justify-self: start;
}

.resumen-header .v-btn:last-child {
  justify-self: end;
}

.logo-pia {
  text-align: center;
  font-size: 31px;
  font-weight: 900;
  color: #079b99;
}

/* =====================================================
   TITULO
===================================================== */

.titulo-seccion {
  text-align: center;
  padding: 10px 20px 14px;
}

.titulo-seccion h1 {
  margin: 0;
  color: #303030;
  font-size: 21px;
  font-weight: 800;
}

.titulo-seccion p {
  margin: 5px 0 0;
  color: #5a5858;
  font-size: 13px;
  line-height: 18px;
}

/* =====================================================
   CONTENIDO
===================================================== */

.contenido-resumen {
  padding: 0 16px 25px;
}

/* =====================================================
   PROFESIONAL
===================================================== */

.profesional-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dbe7f5;
  border-radius: 15px;
  padding: 9px;
}

.profesional-foto {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
}

.profesional-info {
  min-width: 0;
}

.profesional-nombre {
  color: #303030;
  font-size: 15px;
  font-weight: 800;
}

.profesional-tipo {
  color: #303030;
  font-size: 13px;
  margin-top: 2px;
}

.profesional-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 3px;
  color: #303030;
  font-size: 13px;
}

.profesional-rating span {
  color: #303030;
}

/* =====================================================
   CLIENTE
===================================================== */

.cliente-card,
.fecha-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 4px;
  border-bottom: 1px solid #e2e8f0;
}

.cliente-icono,
.fecha-icono {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e4f8f7;
  color: #079b99;
}

.cliente-info,
.fecha-info {
  min-width: 0;
}

.campo-label {
  color: #303030;
  font-size: 13px;
}

.campo-valor {
  color: #303030;
  font-size: 15px;
  font-weight: 800;
  margin-top: 2px;
}

/* =====================================================
   SERVICIO
===================================================== */

.servicio-card {
  display: flex;
  gap: 12px;
  padding: 10px 4px;
  border-bottom: 1px solid #e2e8f0;
}

.servicio-foto {
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 8px;
}

.servicio-info {
  min-width: 0;
}

.servicio-nombre {
  color: #303030;
  font-size: 15px;
  font-weight: 800;
}

.servicio-detalles {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 3px;
  color: #303030;
  font-size: 13px;
}

.servicio-detalles span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.precio-servicio {
  color: #079b99;
  font-weight: 800;
}

.servicio-descripcion {
  margin-top: 3px;
  color: #303030;
  font-size: 12px;
  line-height: 16px;
}

/* =====================================================
   FECHA
===================================================== */

.fecha {
  color: #303030;
  font-size: 13px;
  margin-top: 2px;
  text-transform: capitalize;
}

.hora {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  color: #303030;
  font-size: 14px;
}

.hora span {
  color: #079b99;
}

/* =====================================================
   PAGO
===================================================== */

.seccion-pago {
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303030;
  margin-bottom: 7px;
}

.seccion-titulo .v-icon {
  color: #079b99;
}

.fila-pago {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 5px;
  color: #303030;
  font-size: 14px;
}

.fila-pago strong {
  color: #303030;
}

.fila-pago.descuento strong {
  color: #ef4444;
}

.total-pago {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding: 7px 10px;
  border-radius: 10px;
  background: #e5f8f7;
  color: #303030;
}

.total-pago strong:last-child {
  color: #079b99;
  font-size: 15px;
}

.fila-adelanto,
.fila-saldo {
  display: flex;
  justify-content: space-between;
  padding: 5px 8px;
  color: #303030;
  font-size: 13px;
}

.fila-adelanto strong {
  color: #079b99;
}

.fila-saldo strong {
  color: #303030;
}

/* =====================================================
   CONDICIONES
===================================================== */

.condiciones-card {
  margin-top: 10px;
  padding: 11px;
  border-radius: 12px;
  background: #e8f8f7;
}

.condicion-nombre {
  margin-top: 2px;
  color: #079b99;
  font-size: 12px;
  font-weight: 700;
}

.condiciones-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303030;
  margin-bottom: 7px;
}

.condiciones-titulo .v-icon {
  color: #079b99;
}

.condicion-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 7px 0;
}

.condicion-icono {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #0ca88e;
  color: white;
}

.condicion-texto {
  color: #303030;
  font-size: 12px;
  line-height: 16px;
}

.condicion-texto strong {
  color: #303030;
  font-weight: 800;
}

/* =====================================================
   PAGO QR
===================================================== */

.pago-seccion {
  margin-top: 12px;
}

.pago-paso {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 10px 0;
}

.numero-paso {
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #079b99;
  color: white;
  font-weight: 800;
  font-size: 17px;
}

.pago-titulo {
  color: #303030;
  font-weight: 800;
  font-size: 14px;
}

.pago-descripcion {
  color: #303030;
  font-size: 12px;
  line-height: 16px;
  margin-top: 2px;
}

/* =====================================================
   QR
===================================================== */

.qr-container {
  border: 1px solid #cfe0ef;
  border-radius: 13px;
  padding: 10px;
  text-align: center;
}

.qr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #303030;
  margin-bottom: 5px;
}

.qr-imagen {
  display: block;
  width: 100%;
  max-width: 280px;
  height: auto;
  margin: 0 auto;
}

.qr-monto {
  color: #303030;
  font-size: 13px;
}

.qr-monto strong {
  color: #079b99;
}

/* =====================================================
   COMPROBANTE
===================================================== */

.comprobante-upload {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 70px;
  padding: 10px;
  border: 1px solid #b9d9ed;
  border-radius: 12px;
  color: #303030;
  font-size: 13px;
  overflow: hidden;
}

.comprobante-upload .v-icon {
  color: #303030;
}

.comprobante-upload input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.comprobante-seleccionado {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 7px;
  padding: 7px 9px;
  border-radius: 9px;
  background: #e8f8f7;
  color: #303030;
  font-size: 12px;
}

/* =====================================================
   CONFIRMAR
===================================================== */

.btn-confirmar {
  margin-top: 14px;
  min-height: 52px !important;
  border-radius: 13px !important;
  background: #079b99 !important;
  color: white !important;
  font-weight: 800;
  font-size: 16px;
  text-transform: none;
}

/* =====================================================
   LOADING
===================================================== */

.loading {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #303030;
}

.qr-sin-imagen {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #303030;
  font-size: 13px;
  text-align: center;
}
</style>
