<template>
<div class="comprobantes-page">
  <!-- Título -->
  <div class="mb-6">
    <h2 class="text-h4 font-weight-bold">Comprobantes</h2>

    <p class="text-body-1 text-medium-emphasis mt-2">
      Revisión y validación de comprobantes de membresías.
    </p>
  </div>

  <!-- Resumen -->
  <v-row class="mb-4">
    <v-col cols="12" sm="6" md="4">
      <v-card variant="outlined" rounded="lg">
        <v-card-text>
          <div class="d-flex align-center">
            <v-avatar color="warning" variant="tonal" class="mr-4">
              <v-icon> mdi-clock-outline </v-icon>
            </v-avatar>

            <div>
              <div class="text-body-2 text-medium-emphasis">Pendientes</div>

              <div class="text-h5 font-weight-bold">
                {{ comprobantesPendientes.length }}
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Lista -->
  <v-card rounded="lg" variant="outlined">
    <v-card-title class="d-flex align-center">
      <span> Comprobantes pendientes </span>

      <v-spacer />

      <v-chip color="warning" variant="tonal">
        {{ comprobantesPendientes.length }} pendientes
      </v-chip>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0">
      <v-table>
        <thead>
          <tr>
            <th>Negocio</th>
            <th>Profesional</th>
            <th>Membresía</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th class="text-right">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="comprobante in comprobantesPendientes" :key="comprobante.id">
            <td>
              <div class="font-weight-medium">
                {{ comprobante.negocio_nombre }}
              </div>

              <div class="text-caption text-medium-emphasis">
                {{ comprobante.negocio_codigo }}
              </div>
            </td>

            <td>
              <div>
                {{ comprobante.profesional_nombre }}
              </div>

              <div class="text-caption text-medium-emphasis">
                {{ comprobante.profesional_telefono }}
              </div>
            </td>

            <td>
              <span class="font-weight-medium">
                Bs. {{ comprobante.membresia_monto }}
              </span>
            </td>

            <td>
              {{ formatearFecha(comprobante.fecha, "dddd, DD MMM YYYY") }}
            </td>

            <td>
              <v-chip :color="colorEstado(comprobante.estado)" size="small" variant="tonal" :prepend-icon="iconoEstado(comprobante.estado)">
                {{ comprobante.estado }}
              </v-chip>
            </td>

            <td class="text-right">
              <v-btn color="primary" variant="tonal" prepend-icon="mdi-eye-outline" @click="abrirComprobante(comprobante)">
                Revisar
              </v-btn>
            </td>
          </tr>

          <!-- Sin registros -->
          <tr v-if="comprobantesPendientes.length === 0">
            <td colspan="6" class="text-center py-8">
              <v-icon size="48" color="success" class="mb-3">
                mdi-check-circle-outline
              </v-icon>

              <div class="text-h6">No hay comprobantes pendientes</div>

              <div class="text-body-2 text-medium-emphasis">
                Todos los comprobantes han sido revisados.
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <!-- Dialog de revisión -->
  <v-dialog v-model="dialogo" max-width="700">
    <v-card v-if="comprobanteSeleccionado" rounded="lg">
      <v-card-title class="d-flex align-center pa-5">
        <div>
          <div class="text-h5 font-weight-bold">Revisar comprobante</div>

          <div class="text-body-2 text-medium-emphasis">
            Verifica la información antes de validar el pago.
          </div>
        </div>

        <v-spacer />

        <v-btn icon="mdi-close" variant="text" @click="dialogo = false" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <!-- Información -->
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">Negocio</div>

            <div class="text-body-1 font-weight-medium">
              {{ comprobanteSeleccionado.negocio_nombre }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">
              Código del negocio
            </div>

            <div class="text-body-1 font-weight-medium">
              {{ comprobanteSeleccionado.negocio_codigo }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">Profesional</div>

            <div class="text-body-1 font-weight-medium">
              {{ comprobanteSeleccionado.profesional_nombre }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">Teléfono</div>

            <div class="text-body-1 font-weight-medium">
              {{ comprobanteSeleccionado.profesional_telefono }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">Membresía</div>

            <div class="text-body-1 font-weight-medium">
              Bs. {{ comprobanteSeleccionado.membresia_monto }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">
              Número de pago
            </div>

            <div class="text-body-1 font-weight-medium">
              {{ comprobanteSeleccionado.numero }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-5" />

        <!-- Comprobante -->
        <div class="text-subtitle-1 font-weight-bold mb-3">
          Comprobante de pago
        </div>

        <v-card variant="outlined" rounded="lg" class="pa-4 text-center">
          <v-img v-if="comprobanteSeleccionado.archivo_url" :src="urlQrGerencia(comprobanteSeleccionado.archivo_url)" max-height="1000" contain rounded="lg">
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="primary" />
              </div>
            </template>
          </v-img>

          <v-icon v-else size="64" color="grey">
            mdi-file-image-outline
          </v-icon>

          <div class="text-body-1 mt-3">
            {{ comprobanteSeleccionado.archivo_nombre }}
          </div>

          <div class="text-caption text-medium-emphasis">
            Comprobante de pago
          </div>
        </v-card>

        <!-- Observación -->
        <v-textarea v-model="comprobanteSeleccionado.observacion" class="mt-5" label="Observación" placeholder="Escribe una observación si es necesario..." variant="outlined" rows="3" auto-grow />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-5">
        <v-spacer />

        <v-btn color="error" variant="outlined" prepend-icon="mdi-close-circle-outline" @click="rechazar">
          Rechazar
        </v-btn>

        <v-btn color="success" prepend-icon="mdi-check-circle-outline" @click="aceptar">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</div>
</template>

<script>
import {
  formatearFecha,
  urlQrGerencia
} from "@/utils/ayuda";
import {
  getVouchers,
  validateVoucher
} from "../services/superadmin.api";

export default {
  name: "ComprobantesSuperadminPage",

  data() {
    return {
      dialogo: false,

      comprobanteSeleccionado: null,

      observacion: "",

      comprobantesPendientes: [{
        id: 1,
        negocio: "Salón Bella",
        codigoNegocio: "NEG-A8F42K91",
        profesional: "Juan Pérez",
        telefono: "73425366",
        monto: 10,
        fecha: "04/09/2026",
        numeroPago: "MEM-20260904-000001",
        archivo: "comprobante-pago.jpg",
      }, ],

      overlay: false,
    };
  },

  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 100000);
    },
  },

  methods: {
    urlQrGerencia,
    formatearFecha,

    colorEstado(estado) {
      switch (estado) {
        case "ACEPTADO":
          return "success";

        case "RECHAZADO":
          return "error";

        case "PENDIENTE":
          return "warning";

        default:
          return "grey";
      }
    },

    iconoEstado(estado) {
      switch (estado) {
        case "ACEPTADO":
          return "mdi-check-circle";

        case "RECHAZADO":
          return "mdi-close-circle";

        case "PENDIENTE":
          return "mdi-clock-outline";

        default:
          return "mdi-help-circle";
      }
    },

    abrirComprobante(comprobante) {
      this.comprobanteSeleccionado = comprobante;
      // this.comprobanteSeleccionado.observacion = "";
      this.dialogo = true;
    },

    async aceptar() {
      try {
        this.overlay = true
        const comprobante_id = this.comprobanteSeleccionado.comprobante_id
        const comprobante = {
          estado: 'ACEPTADO',
          observacion: this.comprobanteSeleccionado.observacion
        }

        const res = await validateVoucher(comprobante_id, comprobante)

        if (res.status === 200) {
          this.$swal({
            title: "Comprobante Aceptado!",
            text: "Se ha aceptado el comprobante de pago correctamente!",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.dialogo = false;
              this.obtenerComprobantes()
            }
          })
        }

      } catch (error) {
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message || error.response?.data?.mensaje ||
            error.response?.data?.error ||
            error.message || error.mensaje ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
          didClose: () => {
            this.obtenerComprobantes()
          }
        })
      } finally {
        this.overlay = false
      }
    },

    async rechazar() {
      this.dialogo = false;
      try {
        this.overlay = true
        const comprobante_id = this.comprobanteSeleccionado.comprobante_id
        const comprobante = {
          estado: 'RECHAZADO',
          observacion: this.comprobanteSeleccionado.observacion
        }

        const res = await validateVoucher(comprobante_id, comprobante)

        if (res.status === 200) {
          this.$swal({
            title: "Comprobante Rechazado!",
            text: "Se ha rechazado el comprobante de pago!",
            icon: "warning",
            timer: 2500,
            didClose: () => {
              this.dialogo = false;
              this.obtenerComprobantes()
            }
          })
        }

      } catch (error) {
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message || error.response?.data?.mensaje ||
            error.response?.data?.error ||
            error.message || error.mensaje ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
          didClose: () => {
            this.obtenerComprobantes()
          }
        })
      } finally {
        this.overlay = false
      }
    },

    async obtenerComprobantes() {
      try {
        this.overlay = true;

        const res = await getVouchers();
        if (res.data.ok) {
          this.comprobantesPendientes = res.data.data;
        }
      } catch (error) {
        console.log(error);
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
        });
      } finally {
        this.overlay = false;
      }
    },
  },
  mounted() {
    this.obtenerComprobantes();
  },
};
</script>
