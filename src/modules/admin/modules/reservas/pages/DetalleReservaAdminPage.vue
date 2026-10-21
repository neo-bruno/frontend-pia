<template>
<div class="detalle-reserva-page">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->

  <div class="detalle-header">
    <v-btn icon="mdi-arrow-left" variant="text" color="primary" class="header-back" @click="$router.back()" />

    <div>
      <h1>Detalle de la reserva</h1>
      <p>Información completa</p>
    </div>
  </div>

  <!-- =====================================================
         CARGANDO
    ====================================================== -->

  <div v-if="cargando" class="d-flex justify-center py-10">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <!-- =====================================================
         ERROR
    ====================================================== -->

  <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">
    {{ error }}
  </v-alert>

  <!-- =====================================================
         DETALLE
    ====================================================== -->

  <div v-else-if="reserva">

    <!-- ===================================================
           CLIENTE
      ==================================================== -->

    <div class="cliente-section">

      <v-avatar size="76" color="primary" class="cliente-avatar">
        <span>
          {{ inicialesCliente(reserva.cliente_nombre) }}
        </span>
      </v-avatar>

      <div class="cliente-info">
        <div class="cliente-nombre">
          {{ reserva.cliente_nombre }}
        </div>

        <div class="cliente-telefono">
          {{ reserva.cliente_telefono }}
        </div>
      </div>

      <div class="cliente-actions">

        <v-btn icon="mdi-phone" variant="text" color="primary" :href="`tel:${reserva.cliente_telefono}`" />

        <v-btn icon="mdi-whatsapp" variant="text" color="primary" :href="urlWhatsApp" target="_blank" />

      </div>

    </div>

    <!-- ===================================================
           ESTADO
      ==================================================== -->

    <div class="estado-wrapper">
      <span class="estado" :class="claseEstado">
        {{ reserva.estado }}
      </span>
    </div>

    <!-- ===================================================
           INFORMACIÓN DE LA RESERVA
      ==================================================== -->

    <section class="seccion">

      <h2>Información de la reserva</h2>

      <div class="info-list">

        <div class="info-row">
          <v-icon>mdi-calendar-outline</v-icon>

          <span class="info-label">
            Fecha
          </span>

          <strong>
            {{ fechaFormateada }}
          </strong>
        </div>

        <div class="info-row">
          <v-icon>mdi-clock-outline</v-icon>

          <span class="info-label">
            Hora
          </span>

          <strong>
            {{ horaFormateada }}
            ({{ reserva.servicio_duracion }} min)
          </strong>
        </div>

        <div class="info-row">
          <v-icon>mdi-content-cut</v-icon>

          <span class="info-label">
            Servicio
          </span>

          <strong>
            {{ reserva.servicio_nombre }}
          </strong>
        </div>

        <div class="info-row">
          <v-icon>mdi-cash</v-icon>

          <span class="info-label">
            Precio base
          </span>

          <strong>
            Bs. {{ formatearMonto(reserva.precio_original) }}
          </strong>
        </div>

        <div v-if="Number(reserva.monto_descuento || 0) > 0" class="info-row descuento">
          <v-icon>mdi-tag-outline</v-icon>

          <span class="info-label">
            Descuento
          </span>

          <strong>
            - Bs. {{ formatearMonto(reserva.monto_descuento) }}
          </strong>
        </div>

        <div class="info-row total-row">
          <v-icon>mdi-cash-check</v-icon>

          <span class="info-label">
            Total a pagar
          </span>

          <strong>
            Bs. {{ formatearMonto(reserva.precio_aplicable) }}
          </strong>
        </div>

        <div v-if="reserva.pago_id" class="info-row monto-pagado">
          <v-icon>mdi-cash-minus</v-icon>

          <span class="info-label">
            Pagado
          </span>

          <strong>
            Bs. {{ formatearMonto(reserva.monto_pagado) }}
          </strong>
        </div>

        <div v-if="reserva.pago_id" class="info-row">
          <v-icon>mdi-cash-clock</v-icon>

          <span class="info-label">
            Saldo
          </span>

          <strong>
            Bs. {{ formatearMonto(reserva.saldo) }}
          </strong>
        </div>

      </div>

    </section>

    <!-- ===================================================
           DESCRIPCIÓN DEL SERVICIO
      ==================================================== -->

    <section v-if="reserva.servicio_descripcion" class="seccion">

      <h2>Descripción del servicio</h2>

      <p class="descripcion">
        {{ reserva.servicio_descripcion }}
      </p>

    </section>

    <!-- ===================================================
           PAGO
      ==================================================== -->
    <section v-if="reserva.pago_id" class="seccion">
      <h2>Información del Pago</h2>

      <div class="pago-card">

        <div class="pago-item">
          <span class="pago-label">
            Número de pago
          </span>

          <span class="pago-value">
            {{ reserva.pago_numero }}
          </span>
        </div>

        <div class="pago-item">
          <span class="pago-label">
            Monto pagado
          </span>

          <span class="pago-value pago-monto">
            Bs. {{ formatearMonto(reserva.pago_monto) }}
          </span>
        </div>

        <div class="pago-item">
          <span class="pago-label">
            Estado
          </span>

          <span class="pago-estado">
            {{ reserva.pago_estado }}
          </span>
        </div>

      </div>
    </section>

    <!-- ===================================================
     COMPROBANTE
    ==================================================== -->

    <section v-if="reserva.comprobante_id" class="seccion">

      <h2>Comprobante de Pago</h2>

      <div class="comprobante-card">

        <div class="comprobante-item">

          <div class="comprobante-icono">
            <v-icon>mdi-file-document-outline</v-icon>
          </div>

          <div class="comprobante-info">

            <span class="comprobante-label">
              Estado del comprobante
            </span>

            <span class="comprobante-estado" :class="claseEstadoComprobante">
              {{ reserva.comprobante_estado === 'ACEPTADO' ? 'CONFIRMADO' : reserva.comprobante_estado === 'RECHAZADO' ? 'RECHAZADO' : 'PENDIENTE' }}
            </span>

          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================
           BOTONES
      ==================================================== -->

    <div class="acciones">

      <v-btn v-if="reserva.comprobante_id" variant="outlined" color="primary" size="large" prepend-icon="mdi-file-image-outline" class="btn-accion" @click="verComprobante">
        Ver comprobante
      </v-btn>

      <v-btn color="primary" size="large" prepend-icon="mdi-swap-horizontal" class="btn-accion" @click="verEstadoReserva">
        Validar Reserva
      </v-btn>

    </div>

  </div>

</div>
  <ComprobantePagoAdmin v-model="mostrarComprobante" :reserva="reserva" @cambiar-estado="cambiarEstado"/>
  <EstadoComprobanteAdmin v-model="mostrarEstadoComprobante" :comprobante="reserva" @guardar="guardarEstadoComprobante"/>
  <EstadoReservaAdmin v-model="mostrarEstadoReserva" :estado-inicial="reserva?.estado" @guardar="guardarEstadoReserva"/>
</template>

<script>
import {
  getReservationById,
  cambiarEstadoReserva,
} from "../services/reserva.api.js";
import { useNotificationAdminStore } from "@/stores/notificacionAdmin.store.js";
import ComprobantePagoAdmin from "../components/ComprobantePagoAdmin.vue";
import EstadoComprobanteAdmin from "../components/EstadoComprobanteAdmin.vue";
import { cambiarEstadoComprobante } from "../../comprobantes/services/comprobante.api.js";
import EstadoReservaAdmin from "../components/EstadoReservaAdmin.vue";

export default {
  name: "DetalleReservaAdminPage",
  components:{
    ComprobantePagoAdmin,
    EstadoComprobanteAdmin,
    EstadoReservaAdmin,
  },

  data() {
    return {
      reserva: null,
      mostrarComprobante: false,

      mostrarEstadoComprobante: false,
      mostrarEstadoReserva: false,

      cargando: false,
      error: null,
    };
  },

  computed: {
    fechaFormateada() {
      if (!this.reserva?.fecha) return "";

      const fecha = new Date(this.reserva.fecha);

      return fecha.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },

    horaFormateada() {
      if (!this.reserva) return "";

      const inicio = this.reserva.hora_inicio?.substring(0, 5);
      const fin = this.reserva.hora_fin?.substring(0, 5);

      return `${inicio} - ${fin}`;
    },

    claseEstado() {
      if (this.reserva?.estado === "PENDIENTE") {
        return "estado-pendiente";
      }

      if (this.reserva?.estado === "CONFIRMADA") {
        return "estado-confirmada";
      }

      if (this.reserva?.estado === "COMPLETADA") {
        return "estado-completada";
      }

      if (this.reserva?.estado === "CANCELADA") {
        return "estado-cancelada";
      }

      if (this.reserva?.estado === "NO_ASISTIO") {
        return "estado-no-asistio";
      }

      return "";
    },

    claseEstadoComprobante() {
      if (this.reserva?.comprobante_estado === "ACEPTADO") {
        return "comprobante-aceptado";
      }

      if (this.reserva?.comprobante_estado === "RECHAZADO") {
        return "comprobante-rechazado";
      }

      return "comprobante-pendiente";
    },

    urlWhatsApp() {
      if (!this.reserva?.cliente_telefono) return "#";

      const telefono = String(
        this.reserva.cliente_telefono,
      ).replace(/\D/g, "");

      return `https://wa.me/591${telefono}`;
    },
  },

  methods: {
    async cargarReserva() {
      this.cargando = true;
      this.error = null;

      try {
        const id = this.$route.params.id;

        const respuesta = await getReservationById(id);

        if (respuesta.data?.ok) {
          this.reserva = respuesta.data.data;

          // ================================================
          // MARCAR NOTIFICACIÓN DE LA RESERVA COMO LEÍDA
          // ================================================

          const notificationStore = useNotificationAdminStore();

          try {
            await notificationStore.cargarNoLeidas();

            await notificationStore.marcarNotificacionDeReserva(
              this.reserva.id,
            );
          } catch (error) {
            console.error("Error marcando notificación de reserva como leída:", error);
          }
        } else {
          this.error = respuesta.data?.message || "No se pudo obtener la reserva.";
        }
      } catch (error) {
        console.error("Error al cargar detalle de reserva:", error);
        this.error =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo cargar el detalle de la reserva.";
      } finally {
        this.cargando = false;
      }
    },

    formatearMonto(monto) {
      return Number(monto || 0).toFixed(2);
    },

    inicialesCliente(nombre) {
      if (!nombre) return "CL";

      const partes = nombre.trim().split(/\s+/);

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

    verComprobante() {
      if (!this.reserva?.comprobante_url) return;

      this.mostrarComprobante = true;
    },
    verEstadoReserva() {
      if (!this.reserva) return;

      this.mostrarEstadoReserva = true;
    },

    cambiarEstado() {      
      this.mostrarEstadoComprobante = true;
    },

    async guardarEstadoComprobante(datos) {
      try {
        if (!this.reserva?.comprobante_id) {

          if (this.$piaAlert) {
            this.$piaAlert.error(
              "No existe comprobante asociado a la reserva"
            );
          }

          return;
        }

        const respuesta = await cambiarEstadoComprobante(
          this.reserva.comprobante_id,
          {
            estado: datos.estado,
            observacion: datos.observacion,
          }
        );

        console.log(
          "Respuesta cambio comprobante:",
          respuesta.data
        );

        if (respuesta.data?.ok) {

          // ======================================================
          // ACTUALIZAR INMEDIATAMENTE LA RESERVA EN PANTALLA
          // ======================================================

          this.reserva = {
            ...this.reserva,
            comprobante_estado: datos.estado,
          };

          // ======================================================
          // CERRAR DIALOGS
          // ======================================================

          this.mostrarEstadoComprobante = false;
          this.mostrarComprobante = false;

          // ======================================================
          // ALERTA DE ÉXITO
          // ======================================================

          if (this.$piaAlert) {
            this.$piaAlert.success(
              "Estado del comprobante actualizado correctamente"
            );
          }
        }

      } catch (error) {

        console.error(
          "Error al cambiar estado del comprobante:",
          error
        );

        // ======================================================
        // ALERTA DE ERROR
        // ======================================================

        if (this.$piaAlert) {
          this.$piaAlert.error(
            error?.response?.data?.message ||
            "No se pudo cambiar el estado del comprobante"
          );
        }

      }
    },

    // ============================================================
    // GUARDAR ESTADO DE LA RESERVA
    // ============================================================

    async guardarEstadoReserva(datos) {
      try {
        if (!this.reserva?.id) {
          this.$piaAlert?.error(
            "No existe una reserva válida."
          );
          return;
        }

        const respuesta = await cambiarEstadoReserva(
          this.reserva.id,
          {
            estado: datos.estado,
            observacion: datos.observacion,
          }
        );

        console.log(
          "Respuesta cambio estado reserva:",
          respuesta.data
        );

        if (respuesta.data?.ok) {

          // ================================================
          // ACTUALIZAR INMEDIATAMENTE LA RESERVA EN PANTALLA
          // ================================================

          this.reserva = {
            ...this.reserva,
            estado: datos.estado,
          };

          // ================================================
          // CERRAR EL DIÁLOGO
          // ================================================

          this.mostrarEstadoReserva = false;

          // ================================================
          // ALERTA DE ÉXITO
          // ================================================

          this.$piaAlert?.success(
            respuesta.data.message ||
            "Estado de la reserva actualizado correctamente."
          );

        } else {

          this.$piaAlert?.error(
            respuesta.data?.message ||
            "No se pudo actualizar el estado de la reserva."
          );
        }

      } catch (error) {

        console.error(
          "Error al cambiar estado de la reserva:",
          error
        );

        this.$piaAlert?.error(
          error.response?.data?.message ||
          "No se pudo actualizar el estado de la reserva."
        );
      }
    },
  },

  mounted() {
    this.cargarReserva();
  },
};
</script>

<style lang="scss" scoped>
.detalle-reserva-page {
  max-width: 700px;
  margin: 0 auto;
}

/* ============================================================
   HEADER
============================================================ */

.detalle-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.detalle-header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.detalle-header p {
  margin: 2px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.header-back {
  margin-left: -8px;
}

/* ============================================================
   CLIENTE
============================================================ */

.cliente-section {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  margin-bottom: 8px;
}

.cliente-avatar {
  flex-shrink: 0;
}

.cliente-avatar span {
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.cliente-info {
  min-width: 0;
  flex: 1;
}

.cliente-nombre {
  font-size: 18px;
  font-weight: 700;
  color: #12305b;
}

.cliente-telefono {
  color: #52698a;
  font-size: 15px;
  margin-top: 2px;
}

.cliente-actions {
  display: flex;
}

/* ============================================================
   ESTADO
============================================================ */

.estado-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}

.estado {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.estado-confirmada {
  background: #d9f7e8;
  color: #087443;
}

.estado-pendiente {
  background: #fff3cd;
  color: #a06813;
}

/* ==========================================
   ESTADOS DE LA RESERVA
========================================== */

.estado-pendiente {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;
  border-radius: 999px;

  background: #fff4d6;
  color: #c58a00;

  font-size: 12px;
  font-weight: 800;
}

.estado-confirmada {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;
  border-radius: 999px;

  background: #e3f8f5;
  color: #0f9f98;

  font-size: 12px;
  font-weight: 800;
}

.estado-completada {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;
  border-radius: 999px;

  background: #eee8ff;
  color: #673de6;

  font-size: 12px;
  font-weight: 800;
}

.estado-cancelada {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;
  border-radius: 999px;

  background: #ffe7ea;
  color: #e51c2a;

  font-size: 12px;
  font-weight: 800;
}

.estado-no-asistio {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 12px;
  border-radius: 999px;

  background: #e9eff5;
  color: #52677d;

  font-size: 12px;
  font-weight: 800;
}
/* ============================================================
   SECCIONES
============================================================ */

.seccion {
  padding: 18px 0;
  border-top: 1px solid #edf1f5;
}

.seccion h2 {
  margin: 0 0 14px;
  color: #142d52;
  font-size: 18px;
  font-weight: 700;
}

/* ============================================================
   INFORMACIÓN
============================================================ */

.info-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.info-row {
  display: grid;
  grid-template-columns: 24px 95px 1fr;
  align-items: center;
  gap: 8px;
  color: #23456f;
  font-size: 15px;
}

.info-row .v-icon {
  color: #123f67;
}

.info-row strong {
  color: #173763;
  text-align: right;
}

.info-label {
  color: #52698a;
}

.descuento strong {
  color: #e53935;
}

.total-row strong {
  color: #087443;
  background: #e0f7ea;
  padding: 3px 7px;
  border-radius: 6px;
}

.monto-pagado strong {
  background: #fde8e8;
  color: #dc2626;
  border-radius: 6px;
  padding: 3px 7px;
}

/* ============================================================
   DESCRIPCIÓN
============================================================ */

.descripcion {
  margin: 0;
  color: #304d73;
  font-size: 15px;
  line-height: 1.5;
}

/* ============================================================
   PAGO
============================================================ */

/* ============================================================
   PAGO
============================================================ */

.pago-card {
  background: #f7fafc;
  border: 1px solid #e8eef5;
  border-radius: 14px;
  padding: 16px;
}

.pago-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pago-item + .pago-item {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #e5ebf2;
}

.pago-label {
  color: #718096;
  font-size: 13px;
}

.pago-value {
  color: #173763;
  font-size: 15px;
  font-weight: 600;
}

.pago-monto {
  font-size: 18px;
  font-weight: 700;
  color: #087443;
}

.pago-estado {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 20px;
  background: #d9f7e8;
  color: #087443;
  font-size: 12px;
  font-weight: 700;
}

/* ============================================================
   COMPROBANTE
============================================================ */

.comprobante-card {
  background: #f7fafc;
  border: 1px solid #e8eef5;
  border-radius: 14px;
  padding: 16px;
}

.comprobante-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comprobante-icono {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eaf7f6;
  color: #0f8f8c;
}

.comprobante-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.comprobante-label {
  color: #718096;
  font-size: 13px;
}

.comprobante-estado {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.comprobante-pendiente {
  background: #fff3cd;
  color: #a06813;
}

.comprobante-aceptado {
  background: #d9f7e8;
  color: #087443;
}

.comprobante-rechazado {
  background: #fde8e8;
  color: #dc2626;
}

/* ============================================================
   ACCIONES
============================================================ */

.acciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 0 10px;
}

.btn-accion {
  width: 100%;
  min-height: 48px;
  text-transform: none;
  font-weight: 700;
}

/* ============================================================
   ACCIONES
============================================================ */

.acciones {
  display: flex;
  gap: 10px;
  padding: 18px 0 10px;
}

.btn-accion {
  flex: 1;
  text-transform: none;
  font-weight: 700;
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {

  .detalle-reserva-page {
    width: 100%;
  }

  .detalle-header h1 {
    font-size: 20px;
  }

  .cliente-nombre {
    font-size: 17px;
  }

  .info-row {
    grid-template-columns: 22px 92px 1fr;
    font-size: 14px;
  }

  .info-row strong {
    font-size: 14px;
  }

  .acciones {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 12px 0;
    z-index: 5;
  }

}
</style>
