<template>
<v-dialog v-model="dialog" max-width="420" width="100%" persistent>
  <v-card class="servicios-card">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="dialog-header">
      <div>
        <div class="titulo">
          ¿Qué servicio deseas realizar?
        </div>

        <div class="subtitulo">
          Selecciona el servicio que mejor se adapte a tus necesidades.
        </div>
      </div>

      <v-btn icon variant="text" size="small" @click="cerrar">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- ================================================= -->
    <!-- LISTA DE SERVICIOS -->
    <!-- ================================================= -->

    <v-card-text class="servicios-container">

      <div
        v-for="servicio in servicios"
        :key="servicio.id"
        class="servicio-item"
        :class="{
          seleccionado: servicioSeleccionado?.id === servicio.id,
          'servicio-en-promocion': Boolean(servicio.descuento_cliente)
        }"
        @click="seleccionarServicio(servicio)"
      >

        <!-- IMAGEN -->
        <div class="servicio-imagen">

          <v-img v-if="servicio.foto" :src="getFileUrl(servicio.foto)" cover height="100%" width="100%" />

          <v-icon v-else size="40" color="primary">
            mdi-content-cut
          </v-icon>

        </div>

        <!-- INFORMACIÓN -->
        <div class="servicio-info">

          <div v-if="servicio.descuento_cliente" class="promocion-badge">
            <v-icon size="13">mdi-tag</v-icon>
            PROMOCIÓN
          </div>

          <div class="servicio-nombre">
            {{ servicio.nombre }}
          </div>

          <div class="servicio-duracion">
            <v-icon size="14">mdi-clock-outline</v-icon>
            {{ servicio.duracion }} minutos
          </div>

          <div class="servicio-precios">
            <div class="precio-linea">
              <div class="servicio-precio">
                Bs {{ formatoPrecio(servicio.precio_final ?? servicio.precio) }}
              </div>
              <div v-if="servicio.descuento_cliente" class="servicio-precio-original">
                Bs {{ formatoPrecio(servicio.precio) }}
              </div>
            </div>

            <div v-if="servicio.descuento_cliente" class="descuento-etiqueta">
              <v-icon size="14">mdi-tag-heart-outline</v-icon>
              Ahorras Bs {{ formatoPrecio(ahorroServicio(servicio)) }}
              <span v-if="porcentajeAhorro(servicio) > 0">
                ({{ porcentajeAhorro(servicio) }}%)
              </span>
            </div>
          </div>

          <div v-if="servicio.descripcion" class="servicio-descripcion">
            {{ servicio.descripcion }}
          </div>

        </div>

        <!-- RADIO: UNO SOLO -->
        <div class="servicio-radio">

          <v-icon v-if="servicioSeleccionado?.id === servicio.id" color="primary" size="30">
            mdi-checkbox-marked-circle
          </v-icon>

          <v-icon v-else color="#78909C" size="30">
            mdi-checkbox-blank-circle-outline
          </v-icon>

        </div>

      </div>

      <!-- SIN SERVICIOS -->

      <div v-if="!overlay && servicios.length === 0" class="sin-servicios">
        <v-icon size="45">
          mdi-content-cut
        </v-icon>

        <div>
          No hay servicios disponibles.
        </div>
      </div>

    </v-card-text>

    <!-- ================================================= -->
    <!-- FOOTER -->
    <!-- ================================================= -->

    <div class="dialog-footer">

      <v-btn block height="52" rounded="xl" color="primary" :disabled="!servicioSeleccionado" :loading="overlay" @click="continuar">
        Acepto el Servicio
        <v-icon end>
          mdi-check
        </v-icon>
      </v-btn>

    </div>

  </v-card>

  <!-- ================================================= -->
  <!-- OVERLAY -->
  <!-- ================================================= -->

  <v-overlay :model-value="overlay" class="align-center justify-center" persistent contained>
    <v-progress-circular color="primary" size="64" indeterminate />
  </v-overlay>

</v-dialog>
</template>

<script>
import { getFileUrl } from '@/utils/ayuda';
import { getServicesByProfessionalId } from '../services/servicio.api'
import { getDescuentosDelProfesional } from '@/modules/cliente/modules/descuentos/services/descuentoCliente.api';

export default {

  name: 'DialogoSeleccionServicios',

  props: {

    modelValue: {
      type: Boolean,
      default: false
    },

    profesionalId: {
      type: [Number, String],
      required: true
    }

  },

  emits: [
    'update:modelValue',
    'seleccionar'
  ],

  data() {

    return {

      servicios: [],

      servicioSeleccionado: null,

      overlay: false

    }

  },

  computed: {

    dialog: {

      get() {
        return this.modelValue
      },

      set(value) {
        this.$emit('update:modelValue', value)
      }

    }

  },

  watch: {

    modelValue(nuevoValor) {

      if (nuevoValor) {

        this.servicioSeleccionado = null

        this.obtenerServicios()

      }

    }

  },

  methods: {
    getFileUrl,

    // =====================================================
    // OBTENER SERVICIOS    
    // =====================================================
    
    async obtenerServicios() {
      try {
        this.overlay = true;

        const res = await getServicesByProfessionalId(this.profesionalId);

        if (!res.data?.ok) {
          this.servicios = [];
          return;
        }

        const servicios = res.data.data || [];

        // Mostrar inicialmente los precios normales.
        this.servicios = servicios.map((servicio) => ({
          ...servicio,
          precio_final: Number(servicio.precio),
          descuento_cliente: null,
        }));

        // const token = localStorage.getItem("cliente_token");

        // Si el cliente no inició sesión, mostrar los precios normales.
        // if (!token) return;

        // Consultar descuentos públicos y, si hay sesión,
        // también los descuentos personales del cliente.
        try {
          const respuesta = await getDescuentosDelProfesional(
            this.profesionalId
          );

          const descuentos =
            respuesta.data?.data?.descuentos || [];

          this.servicios = this.servicios.map((servicio) => {
            const descuento = descuentos.find(
              (item) =>
                Number(item.servicio_id) === Number(servicio.id)
            );

            if (!descuento) return servicio;

            const precio = Number(servicio.precio);
            let montoDescuento = 0;

            if (descuento.descuento_porcentaje != null) {
              montoDescuento =
                precio *
                Number(descuento.descuento_porcentaje) /
                100;
            } else if (descuento.descuento_monto != null) {
              montoDescuento = Number(descuento.descuento_monto);
            } else {
              return servicio;
            }

            montoDescuento = Math.min(
              precio,
              Math.max(0, montoDescuento)
            );

            const precioFinal =
              Math.round((precio - montoDescuento + Number.EPSILON) * 100) / 100;

            return {
              ...servicio,
              precio_final: precioFinal,
              descuento_cliente: {
                ...descuento,
                precio_original: precio,
                monto_descuento:
                  Math.round(montoDescuento * 100) / 100,
                precio_final: precioFinal,
              },
            };
          });
        } catch (error) {
          console.error(
            "Error obteniendo los descuentos del profesional:",
            error
          );
          // Si falla la consulta, se conservan los precios normales.
        }
      } catch (error) {
        console.error("Error obteniendo servicios:", error);

        this.servicios = [];

        this.$piaAlert.error(
          error.response?.data?.message ||
            error.response?.data?.mensaje ||
            error.response?.data?.error ||
            error.message ||
            "No se pudieron obtener los servicios.",
          { title: "Error al obtener servicios" }
        );
      } finally {
        this.overlay = false;
      }
    },


    formatoPrecio(valor) {
      return Number(valor || 0).toFixed(2);
    },

    ahorroServicio(servicio) {
      const original = Number(servicio.precio || 0);
      const final = Number(servicio.precio_final ?? servicio.precio ?? 0);
      return Math.max(0, Math.round((original - final + Number.EPSILON) * 100) / 100);
    },

    porcentajeAhorro(servicio) {
      const original = Number(servicio.precio || 0);
      if (original <= 0) return 0;

      const descuento = servicio.descuento_cliente || {};
      if (descuento.descuento_porcentaje != null) {
        return Number(Number(descuento.descuento_porcentaje).toFixed(2)).toString();
      }

      return Number(((this.ahorroServicio(servicio) / original) * 100).toFixed(2)).toString();
    },

    textoDescuento(descuento) {
      if (descuento.descuento_porcentaje != null) {
        return `${Number(descuento.descuento_porcentaje)}% de descuento`;
      }

      if (descuento.descuento_monto != null) {
        return `Bs ${this.formatoPrecio(
          descuento.descuento_monto
        )} de descuento`;
      }

      return "Descuento disponible";
    },


    // =====================================================
    // SELECCIONAR SERVICIO
    // =====================================================
    seleccionarServicio(servicio) {
      this.servicioSeleccionado = servicio
      console.log('✂️ SERVICIO SELECCIONADO:', servicio)
    },

    // =====================================================
    // CONTINUAR
    // =====================================================

    continuar() {
      if (!this.servicioSeleccionado) {
        return
      }
      console.log('➡️ CONTINUAR CON SERVICIO:', this.servicioSeleccionado)
      this.$emit('seleccionar', this.servicioSeleccionado)
      this.dialog = false
    },

    // =====================================================
    // CERRAR
    // =====================================================
    cerrar() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.servicios-card {

  border-radius: 24px !important;
  overflow: hidden;
  background: #ffffff;

}

/* ===================================================== */
/* HEADER */
/* ===================================================== */

.dialog-header {

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 20px 18px 12px;

}

.titulo {

  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.25;

}

.subtitulo {

  margin-top: 6px;

  font-size: 13px;
  line-height: 1.4;

  color: #64748B;

}

/* ===================================================== */
/* CONTENEDOR */
/* ===================================================== */

.servicios-container {

  padding: 8px 14px 14px !important;

  max-height: 500px;

  overflow-y: auto;

}

/* ===================================================== */
/* SERVICIO */
/* ===================================================== */

.servicio-item {

  position: relative;

  display: grid;

  grid-template-columns: 82px minmax(0, 1fr);

  align-items: center;

  column-gap: 12px;

  padding: 9px;

  margin-bottom: 10px;

  min-height: 112px;

  border: 1px solid #E2E8F0;

  border-radius: 16px;

  cursor: pointer;

  transition: all 0.2s ease;

  background: #ffffff;

  box-sizing: border-box;

}

.servicio-item:hover {

  border-color: #078B88;

}

.servicio-item.seleccionado {

  border: 2px solid #078B88;

  background: #F0FDFA;

}

/* ===================================================== */
/* IMAGEN */
/* NO CAMBIAMOS SU TAMAÑO */
/* ===================================================== */

.servicio-imagen {

  flex-shrink: 0;

  width: 82px;
  height: 82px;

  border-radius: 12px;

  overflow: hidden;

  background: #E6F7F6;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* ===================================================== */
/* INFORMACIÓN */
/* ===================================================== */

.servicio-info {

  width: 100%;

  min-width: 0;

  align-self: stretch;

  display: flex;

  flex-direction: column;

  justify-content: center;

}

/* ===================================================== */
/* NOMBRE */
/* ===================================================== */

.servicio-nombre {

  width: 100%;

  font-size: 16px;

  font-weight: 700;

  color: #0F172A;

  line-height: 1.2;

  word-break: break-word;

}

/* ===================================================== */
/* DURACIÓN */
/* ===================================================== */

.servicio-duracion {

  margin-top: 3px;

  font-size: 13px;

  color: #64748B;

}

/* ===================================================== */
/* PRECIO */
/* ===================================================== */

.servicio-precio {

  margin-top: 2px;

  font-size: 18px;

  font-weight: 700;

  color: #078B88;

}

/* ===================================================== */
/* DESCRIPCIÓN */
/* ===================================================== */

.servicio-descripcion {

  width: 100%;

  margin-top: 3px;

  font-size: 12px;

  line-height: 1.3;

  color: #64748B;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}

/* ===================================================== */
/* RADIO */
/* ===================================================== */

.servicio-radio {

  position: absolute;

  right: 9px;

  top: 50%;

  transform: translateY(-50%);

  width: 30px;

  height: 30px;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* ===================================================== */
/* FOOTER */
/* ===================================================== */

.dialog-footer {

  padding: 10px 14px 16px;

  border-top: 1px solid #E2E8F0;

}


.servicio-precios {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-top: 2px;
}

.servicio-precio-original {
  color: #8793a2;
  font-size: 12px;
  text-decoration: line-through;
}

.descuento-etiqueta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 3px;
  padding: 3px 7px;
  border-radius: 6px;
  background: #e0f5e9;
  color: #197344;
  font-size: 11px;
  font-weight: 650;
}


/* ===================================================== */
/* PRESENTACIÓN DE PROMOCIONES */
/* ===================================================== */
.servicio-item {
  grid-template-columns: 82px minmax(0, 1fr);
  padding: 10px;
  border-radius: 18px;
  gap: 12px;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.servicio-item.servicio-en-promocion {
  border-color: #ffcbd0;
  background: linear-gradient(135deg, #fff7f8 0%, #ffffff 100%);
}

.servicio-item.servicio-en-promocion.seleccionado {
  border: 2px solid #078b88;
  background: linear-gradient(135deg, #effdfa 0%, #fff7f8 100%);
  box-shadow: 0 3px 12px rgba(7, 139, 136, 0.08);
}

.servicio-imagen { position: relative; width: 82px; height: 82px; border-radius: 13px; overflow: hidden; }
.servicio-info { padding-right: 28px; }
.promocion-badge {
  display: inline-flex; align-items: center; align-self: flex-start; gap: 4px;
  margin-bottom: 5px; padding: 4px 8px; border-radius: 999px;
  background: #ff4658; color: #fff; font-size: 9px; font-weight: 800;
  letter-spacing: .35px; line-height: 1.2;
}
.servicio-nombre { font-size: 15px; font-weight: 750; line-height: 1.22; color: #102653; }
.servicio-duracion { display: flex; align-items: center; gap: 4px; margin-top: 5px; font-size: 12px; color: #71839b; }
.servicio-precios { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; margin-top: 4px; }
.precio-linea { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.servicio-precio { margin-top: 0; font-size: 18px; font-weight: 800; line-height: 1.15; color: #079b98; font-variant-numeric: tabular-nums; }
.servicio-precio-original { color: #8190a3; font-size: 12px; font-weight: 500; text-decoration: line-through; white-space: nowrap; }
.descuento-etiqueta { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 0; padding: 5px 8px; border-radius: 8px; background: #dcf8e8; color: #087b59; font-size: 11px; font-weight: 750; line-height: 1.25; }
.servicio-radio { right: 8px; top: 22px; transform: none; z-index: 1; }
.servicio-descripcion { margin-top: 5px; font-size: 11px; line-height: 1.3; }

@media (max-width: 380px) {
  .servicio-item { grid-template-columns: 74px minmax(0, 1fr); column-gap: 10px; padding: 8px; }
  .servicio-imagen { width: 74px; height: 78px; }
  .servicio-info { padding-right: 24px; }
  .servicio-nombre { font-size: 14px; }
  .servicio-precio { font-size: 16px; }
  .descuento-etiqueta { font-size: 10px; padding: 4px 6px; }
}

</style>
