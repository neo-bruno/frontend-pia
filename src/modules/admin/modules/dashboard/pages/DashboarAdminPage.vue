
<template>
  <div class="dashboard-page">

    <!-- ENCABEZADO -->
    <section class="dashboard-header">
      <div class="header-title">
        <h1 class="my-0">¡Hola, {{nombreProfesional}}!</h1>
        <p>Aquí tienes el resumen del día</p>
      </div>

      <div class="fecha-actual">
        <v-icon icon="mdi-calendar-month-outline" />
        <input v-model="fechaSeleccionada" type="date" class="fecha-input" aria-label="Seleccionar fecha del dashboard" @change="cambiarFecha"/>
      </div>
    </section>

    <!-- CARGANDO -->
    <div v-if="cargando" class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
        size="38"
      />
      <span>Cargando información del negocio...</span>
    </div>

    <!-- ERROR -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mb-4"
    >
      {{ error }}
      <template #append>
        <v-btn
          variant="text"
          color="error"
          @click="cargarDashboard"
        >
          Reintentar
        </v-btn>
      </template>
    </v-alert>

    <template v-else>

      <!-- INDICADORES -->
      <section class="indicadores-grid">

        <article
          class="indicador-card reservas-card clickable-card"
          role="button"
          tabindex="0"
          aria-label="Ir a reservas"
          @click="$router.push('/admin/reservas')"
          @keydown.enter="$router.push('/admin/reservas')"
          @keydown.space.prevent="$router.push('/admin/reservas')"
        >
          <div class="indicador-icon">
            <v-icon icon="mdi-calendar-month" />
          </div>

          <div class="indicador-info">
            <span>Reservas</span>
            <strong>{{ resumen.reservasHoy }}</strong>
          </div>
        </article>

        <article class="indicador-card atenciones-card">
          <div class="indicador-icon">
            <v-icon icon="mdi-check-circle-outline" />
          </div>

          <div class="indicador-info">
            <span>Atenciones</span>
            <strong>{{ resumen.atencionesHoy }}</strong>
          </div>
        </article>

        <article
          class="indicador-card clientes-card clickable-card"
          role="button"
          tabindex="0"
          aria-label="Ir a clientes"
          @click="$router.push('/admin/clientes')"
          @keydown.enter="$router.push('/admin/clientes')"
          @keydown.space.prevent="$router.push('/admin/clientes')"
        >
          <div class="indicador-icon">
            <v-icon icon="mdi-account-group" />
          </div>

          <div class="indicador-info">
            <span>Clientes</span>
            <strong>{{ resumen.totalClientes }}</strong>
          </div>
        </article>

        <article class="indicador-card ingresos-card">
          <div class="indicador-icon">
            <v-icon icon="mdi-cash-multiple" />
          </div>

          <div class="indicador-info">
            <span>Ventas día</span>
            <strong>{{ formatoMoneda(resumen.ingresosDia) }}</strong>
          </div>
        </article>

      </section>

      <!-- PRÓXIMAS RESERVAS -->
      <section class="dashboard-card reservas-section" @click="$router.push('/admin/agenda')"
        @keydown.enter="$router.push('/admin/agenda')"
        @keydown.space.prevent="$router.push('/admin/agenda')">

        <div class="card-header">
          <h2>Próximas reservas de hoy</h2>

          <button class="ver-mas">
            Ver agenda
            <v-icon icon="mdi-arrow-right" size="small" />
          </button>
        </div>

        <div
          v-if="!proximasReservas.length"
          class="empty-state"
        >
          <v-icon icon="mdi-calendar-blank-outline" />
          <span>No hay próximas reservas para hoy</span>
        </div>

        <div v-else class="reservas-lista">

          <div
            v-for="reserva in proximasReservas"
            :key="reserva.reserva_id"
            class="reserva-item"
          >
            <div class="reserva-hora">
              {{ reserva.hora_inicio }}
            </div>

            <div class="reserva-cliente-icon">
              <v-icon icon="mdi-account-outline" />
            </div>

            <div class="reserva-datos">
              <strong>
                {{ reserva.cliente_nombre || reserva.cliente_alias || 'Cliente' }}
              </strong>

              <span>{{ reserva.servicio_nombre }}</span>
            </div>

            <div
              class="reserva-estado"
              :class="claseEstado(reserva.estado)"
            >
              {{ textoEstado(reserva.estado) }}
            </div>
          </div>

        </div>
      </section>

      <!-- SEGMENTACIÓN -->
      <section class="dashboard-card segmentacion-section" @click="$router.push('/admin/clientes')"
        @keydown.enter="$router.push('/admin/clientes')"
        @keydown.space.prevent="$router.push('/admin/clientes')">

        <div class="card-header">
          <h2>Clientes por segmentación</h2>
          <v-icon icon="mdi-chevron-right" />
        </div>

        <div
          v-if="!clientesPorSegmentacion.length"
          class="empty-state"
        >
          <v-icon icon="mdi-account-group-outline" />
          <span>Aún no hay datos de segmentación</span>
        </div>

        <div v-else class="segmentacion-contenido">

          <div
            class="grafico-donut"
            :style="estiloDonut"
          >
            <div class="donut-centro">
              <strong>{{ totalSegmentados }}</strong>
              <span>clientes</span>
            </div>
          </div>

          <div class="segmentacion-leyenda">

            <div
              v-for="(segmento, index) in clientesPorSegmentacion"
              :key="segmento.segmentacionId"
              class="segmento-item"
            >
              <span
                class="segmento-indicador"
                :style="{ background: coloresSegmentacion[index % coloresSegmentacion.length] }"
              />

              <span class="segmento-nombre">
                {{ segmento.nombre }}
              </span>

              <strong>
                {{ porcentaje(segmento.cantidad) }}%
                ({{ segmento.cantidad }})
              </strong>
            </div>

          </div>
        </div>
      </section>

      <!-- SERVICIOS MÁS SOLICITADOS -->
      <section
        class="dashboard-card servicios-section clickable-card"
        role="button"
        tabindex="0"
        aria-label="Ir a servicios"
        @click="$router.push('/admin/servicios')"
        @keydown.enter="$router.push('/admin/servicios')"
        @keydown.space.prevent="$router.push('/admin/servicios')"
      >

        <div class="card-header">
          <h2>Servicios más solicitados</h2>
          <v-icon icon="mdi-chevron-right" />
        </div>

        <div
          v-if="!serviciosPopulares.length"
          class="empty-state"
        >
          <v-icon icon="mdi-scissors-cutting" />
          <span>Aún no hay servicios registrados este dia</span>
        </div>

        <div v-else class="servicios-lista">

          <div
            v-for="(servicio, index) in serviciosPopulares"
            :key="servicio.servicioId"
            class="servicio-item"
          >
            <v-icon
              :icon="iconosServicios[index % iconosServicios.length]"
              class="servicio-icon"
            />

            <span class="servicio-nombre">
              {{ servicio.nombre }}
            </span>

            <div class="barra-fondo">
              <div
                class="barra-progreso"
                :style="{
                  width: porcentajeServicio(servicio.cantidad) + '%'
                }"
              />
            </div>

            <strong class="servicio-porcentaje">
              {{ porcentajeServicio(servicio.cantidad) }}%
            </strong>
          </div>

        </div>
      </section>

    </template>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store";
import { obtenerDashboard } from "../services/dashboard.api";
import dayjs from "dayjs";
import "dayjs/locale/es";

export default {
  name: "DashboardAdminPage",

  data() {
    return {
      cargando: false,
      error: null,

      resumen: {
        reservasHoy: 0,
        atencionesHoy: 0,
        clientesActivos: 0,
        totalClientes: 0,
        ingresosDia: 0,
      },

      proximasReservas: [],
      clientesPorSegmentacion: [],
      serviciosPopulares: [],

      coloresSegmentacion: [
        "#08A891",
        "#2196E5",
        "#FFB900",
        "#A855D9",
        "#EF6C63",
        "#64748B",
      ],

      iconosServicios: [
        "mdi-content-cut",
        "mdi-auto-fix",
        "mdi-hair-dryer",
        "mdi-spa",
        "mdi-face-woman",
      ],
      fechaSeleccionada: dayjs().format("YYYY-MM-DD"),
    };
  },

  computed: {
    esFechaHoy() {
      return this.fechaSeleccionada === dayjs().format("YYYY-MM-DD");
    },
    fechaActual() {
      return new Intl.DateTimeFormat("es-BO", {
        day: "numeric",
        month: "short",
        timeZone: "America/La_Paz",
      }).format(new Date());
    },

    totalSegmentados() {
      return this.clientesPorSegmentacion.reduce(
        (total, item) => total + Number(item.cantidad || 0),
        0
      );
    },

    estiloDonut() {
      const total = this.totalSegmentados;

      if (!total) {
        return {
          background: "#E9EEF2",
        };
      }

      let acumulado = 0;

      const partes = this.clientesPorSegmentacion.map(
        (item, index) => {
          const inicio = acumulado;
          acumulado += (Number(item.cantidad) / total) * 100;

          return `${this.coloresSegmentacion[index % this.coloresSegmentacion.length]} ${inicio}% ${acumulado}%`;
        }
      );

      return {
        background: `conic-gradient(${partes.join(", ")})`,
      };
    },

    maximoServicios() {
      return Math.max(
        1,
        ...this.serviciosPopulares.map(
          (item) => Number(item.cantidad || 0)
        )
      );
    },

    authStore() {
      return useAuthStore();
    },

    // Nombre del usuario autenticado
    nombreProfesional() {
      const nombre = this.authStore.usuario?.nombre?.trim();

      if (!nombre) return "Mi cuenta";

      const primeraPalabra = nombre.split(/\s+/)[0];

      return primeraPalabra.charAt(0).toUpperCase() +
        primeraPalabra.slice(1).toLowerCase();
    },
  },

  mounted() {
    this.cargarDashboard();
  },

  methods: {
    async cambiarFecha() {
      if (!this.fechaSeleccionada) return;

      if (!dayjs(this.fechaSeleccionada, "YYYY-MM-DD", true).isValid()) {
        return;
      }

      await this.cargarDashboard();
    },

    async seleccionarHoy() {
      this.fechaSeleccionada = dayjs().format("YYYY-MM-DD");
      await this.cargarDashboard();
    },
    async cargarDashboard() {
      this.cargando = true;
      this.error = null;

      try {
        const respuesta = await obtenerDashboard(this.fechaSeleccionada);

        const data = respuesta.data?.data;
        console.log('DATA: ', data)
        if (!respuesta.data?.ok || !data) {
          throw new Error("No se pudo obtener la información del Dashboard.");
        }

        this.resumen = {
          reservasHoy: Number(data.resumen?.reservasHoy || 0),
          atencionesHoy: Number(data.resumen?.atencionesHoy || 0),
          clientesActivos: Number(data.resumen?.clientesActivos || 0),
          totalClientes: Number(data.resumen?.totalClientes || 0),
          ingresosDia: Number(data.resumen?.ingresosDia || 0),
        };

        this.proximasReservas = data.proximasReservas || [];
        this.clientesPorSegmentacion = data.clientesPorSegmentacion || [];
        this.serviciosPopulares = data.serviciosPopulares || [];

      } catch (error) {
        console.error("Error al cargar Dashboard:", error);

        this.error =
          error.response?.data?.message ||
          error.message ||
          "Ocurrió un error al cargar el Dashboard.";

      } finally {
        this.cargando = false;
      }
    },

    formatoMoneda(valor) {
      return "Bs " + Number(valor || 0).toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    porcentaje(cantidad) {
      if (!this.totalSegmentados) return 0;

      return Math.round(
        (Number(cantidad) / this.totalSegmentados) * 100
      );
    },

    porcentajeServicio(cantidad) {
      return Math.round(
        (Number(cantidad || 0) / this.maximoServicios) * 100
      );
    },

    textoEstado(estado) {
      const estados = {
        CONFIRMADA: "Confirmada",
        PENDIENTE: "Pendiente",
      };

      return estados[estado] || estado;
    },

    claseEstado(estado) {
      return {
        "estado-confirmada": estado === "CONFIRMADA",
        "estado-pendiente": estado === "PENDIENTE",
      };
    },
  },
};
</script>

<style scoped>

.dashboard-page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 24px 30px;
  color: #102039;
  box-sizing: border-box;  
}

/* =========================
   ENCABEZADO
========================= */

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.header-title {
  flex: 1;
  min-width: 0;
}

.header-title h1 {
  font-size: 27px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.7px;
  color: #102039;
}

.header-title p {
  color: #64748b;
  font-size: 16px;
  margin-top: 5px;
  line-height: 1.4;
}

.fecha-actual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  flex-shrink: 0;
  padding: 12px 15px;
  border: 1px solid #e0e7ed;
  border-radius: 16px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  color: #18344d;
  background: #fff;
  box-shadow: 0 2px 6px #1020390a;
}

/* =========================
   INDICADORES
========================= */

.indicadores-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.indicador-card {
  min-width: 0;
  min-height: 115px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 23px;
  border: 1px solid transparent;
  box-shadow: 0 3px 8px #1020390c;
  box-sizing: border-box;
}

/* Tarjetas que navegan a sus módulos */
.clickable-card {
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px #10203914;
}

.clickable-card:focus-visible {
  outline: 2px solid #079B8B;
  outline-offset: 3px;
}

.indicador-icon {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.indicador-icon .v-icon {
  font-size: 39px;
}

.indicador-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.indicador-info span {
  font-size: 16px;
  font-weight: 650;
  line-height: 1.25;
}

.indicador-info strong {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.reservas-card {
  background: #E8FAF7;
  border-color: #D4F1EC;
}

.reservas-card .indicador-icon {
  background: #B8EEE5;
  color: #079B8B;
}

.atenciones-card {
  background: #F3EEFF;
  border-color: #E6DCFF;
}

.atenciones-card .indicador-icon {
  background: #E3D5FF;
  color: #8651D8;
}

.clientes-card {
  background: #EAF3FF;
  border-color: #D8E8FF;
}

.clientes-card .indicador-icon {
  background: #CFE2FF;
  color: #2876D2;
}

.ingresos-card {
  background: #FFF8E8;
  border-color: #F8EDCF;
}

.ingresos-card .indicador-icon {
  background: #FFEBAF;
  color: #E7A500;
}

.ingresos-card .indicador-info strong {
  font-size: 25px;
  white-space: nowrap;
}

/* =========================
   TARJETAS GENERALES
========================= */

.dashboard-card {
  width: 100%;
  min-width: 0;
  background: #fff;
  border: 1px solid #DCE4EA;
  border-radius: 23px;
  padding: 20px 24px;
  margin-bottom: 18px;
  box-shadow: 0 3px 9px #1020390b;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
}

.card-header h2 {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.4px;
  line-height: 1.3;
  color: #102039;
}

.ver-mas {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #079B8B;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  background: transparent;
  border: 0;
  cursor: pointer;
}

/* =========================
   PRÓXIMAS RESERVAS
========================= */

.reservas-lista {
  display: flex;
  flex-direction: column;
}

.reserva-item {
  min-height: 66px;
  display: grid;
  grid-template-columns: 90px 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #EDF0F3;
}

.reserva-item:last-child {
  border-bottom: none;
}

.reserva-hora {
  background: #EAF2FF;
  color: #142A49;
  padding: 9px 12px;
  text-align: center;
  border-radius: 13px;
  font-weight: 800;
  font-size: 17px;
  white-space: nowrap;
}

.reserva-cliente-icon {
  color: #079B8B;
  display: flex;
  justify-content: center;
}

.reserva-cliente-icon .v-icon {
  font-size: 30px;
}

.reserva-datos {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.reserva-datos strong {
  font-size: 16px;
  font-weight: 750;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reserva-datos span {
  color: #475569;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reserva-estado {
  padding: 10px 14px;
  border-radius: 13px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.estado-confirmada {
  color: #087A31;
  background: #DDF8E7;
}

.estado-pendiente {
  color: #A75A00;
  background: #FFF0C9;
}

/* =========================
   SEGMENTACIÓN
========================= */

.segmentacion-contenido {
  display: grid;
  grid-template-columns: minmax(170px, 1fr) minmax(0, 1.5fr);
  align-items: center;
  gap: 25px;
}

.grafico-donut {
  width: 195px;
  height: 195px;
  aspect-ratio: 1 / 1;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.donut-centro {
  width: 64%;
  height: 64%;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.donut-centro strong {
  font-size: 34px;
  font-weight: 800;
}

.donut-centro span {
  font-size: 14px;
}

.segmentacion-leyenda {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.segmento-item {
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.segmento-indicador {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.segmento-nombre {
  font-size: 15px;
  font-weight: 500;
  min-width: 0;
}

.segmento-item strong {
  font-size: 14px;
  white-space: nowrap;
}

/* =========================
   SERVICIOS MÁS SOLICITADOS
========================= */

.servicios-lista {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.servicio-item {
  display: grid;
  grid-template-columns: 30px minmax(120px, 1fr) minmax(80px, 1.3fr) 42px;
  align-items: center;
  gap: 12px;
}

.servicio-icon {
  color: #079B8B;
  font-size: 25px;
}

.servicio-nombre {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.barra-fondo {
  height: 13px;
  background: #F1F4F6;
  border-radius: 20px;
  overflow: hidden;
}

.barra-progreso {
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(90deg, #49C9C0, #009E8C);
}

.servicio-porcentaje {
  text-align: right;
  font-size: 15px;
  font-weight: 700;
}

/* =========================
   ESTADOS
========================= */

.empty-state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  color: #94A3B8;
  font-size: 14px;
  text-align: center;
}

.empty-state .v-icon {
  font-size: 32px;
}

.loading-container {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #64748b;
}

/* =========================
   TABLET Y MÓVIL
========================= */

@media (max-width: 600px) {
  .dashboard-page {
    padding: 18px 12px 25px;
  }

  .dashboard-header {
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .header-title h1 {
    font-size: 20px;
    letter-spacing: -0.5px;
  }

  .header-title p {
    font-size: 13px;
    line-height: 1.35;
  }

  .fecha-actual {
    padding: 10px 9px;
    gap: 5px;
    font-size: 12px;
    border-radius: 13px;
  }

  .fecha-actual .v-icon {
    font-size: 17px;
  }

  .indicadores-grid {
    gap: 10px;
    margin-bottom: 15px;
  }

  .indicador-card {
    min-height: 112px;
    padding: 12px;
    gap: 10px;
    border-radius: 19px;
  }

  .indicador-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
  }

  .indicador-icon .v-icon {
    font-size: 30px;
  }

  .indicador-info {
    gap: 5px;
  }

  .indicador-info span {
    font-size: 13px;
    line-height: 1.25;
  }

  .indicador-info strong {
    font-size: 27px;
  }

  .ingresos-card .indicador-info strong {
    font-size: 19px;
  }

  .dashboard-card {
    padding: 17px 15px;
    border-radius: 20px;
    margin-bottom: 15px;
  }

  .card-header {
    margin-bottom: 14px;
  }

  .card-header h2 {
    font-size: 17px;
  }

  .ver-mas {
    font-size: 12px;
  }

  /* Reservas */

  .reserva-item {
    grid-template-columns: 68px 28px minmax(0, 1fr) auto;
    gap: 7px;
    min-height: 68px;
  }

  .reserva-hora {
    padding: 9px 5px;
    font-size: 14px;
    border-radius: 11px;
  }

  .reserva-cliente-icon .v-icon {
    font-size: 25px;
  }

  .reserva-datos strong {
    font-size: 13px;
  }

  .reserva-datos span {
    font-size: 12px;
  }

  .reserva-estado {
    padding: 8px 9px;
    font-size: 11px;
    border-radius: 10px;
  }

  /* Segmentación */

  .segmentacion-contenido {
    grid-template-columns: minmax(115px, 0.8fr) minmax(0, 1.2fr);
    gap: 14px;
  }

  .grafico-donut {
    width: 100%;
    max-width: 150px;
    height: auto;
    aspect-ratio: 1 / 1;
  }

  .donut-centro strong {
    font-size: 27px;
  }

  .donut-centro span {
    font-size: 12px;
  }

  .segmentacion-leyenda {
    gap: 14px;
  }

  .segmento-item {
    grid-template-columns: 11px minmax(0, 1fr) auto;
    gap: 6px;
  }

  .segmento-indicador {
    width: 10px;
    height: 10px;
  }

  .segmento-nombre {
    font-size: 12px;
  }

  .segmento-item strong {
    font-size: 11px;
  }

  /* Servicios */

  .servicios-lista {
    gap: 17px;
  }

  .servicio-item {
    grid-template-columns: 25px minmax(0, 1fr) minmax(65px, 1fr) 35px;
    gap: 8px;
  }

  .servicio-icon {
    font-size: 22px;
  }

  .servicio-nombre {
    font-size: 12px;
  }

  .barra-fondo {
    height: 11px;
  }

  .servicio-porcentaje {
    font-size: 12px;
  }
}

/* =========================
   TELÉFONOS PEQUEÑOS: 320px
========================= */

@media (max-width: 360px) {
  .dashboard-page {
    padding: 1px 10px 25px;
  }

  .dashboard-header {
    gap: 5px;
    align-items: flex-start;
  }

  .header-title h1 {
    font-size: 17px;
  }

  .header-title p {
    font-size: 11px;
  }

  .fecha-actual {
    padding: 8px 7px;
    gap: 4px;
    font-size: 10px;
    border-radius: 11px;
  }

  .fecha-actual .v-icon {
    font-size: 15px;
  }

  .indicadores-grid {
    gap: 9px;
  }

  .indicador-card {
    min-height: 104px;
    padding: 9px;
    gap: 8px;
    border-radius: 17px;
  }

  .indicador-icon {
    width: 43px;
    height: 43px;
    border-radius: 13px;
  }

  .indicador-icon .v-icon {
    font-size: 25px;
  }

  .indicador-info span {
    font-size: 11px;
  }

  .indicador-info strong {
    font-size: 23px;
  }

  .ingresos-card .indicador-info strong {
    font-size: 15px;
  }

  .dashboard-card {
    padding: 15px 12px;
    border-radius: 18px;
  }

  .card-header h2 {
    font-size: 15px;
  }

  .reserva-item {
    grid-template-columns: 57px 22px minmax(0, 1fr) auto;
    gap: 5px;
  }

  .reserva-hora {
    font-size: 12px;
    padding: 8px 3px;
  }

  .reserva-datos strong {
    font-size: 11px;
  }

  .reserva-datos span {
    font-size: 10px;
  }

  .reserva-estado {
    font-size: 9px;
    padding: 7px 5px;
  }

  .segmentacion-contenido {
    grid-template-columns: minmax(95px, 0.85fr) minmax(0, 1.15fr);
    gap: 9px;
  }

  .grafico-donut {
    width: 100%;
    max-width: 115px;
    height: auto;
    aspect-ratio: 1 / 1;
  }

  .donut-centro strong {
    font-size: 23px;
  }

  .donut-centro span {
    font-size: 10px;
  }

  .segmentacion-leyenda {
    gap: 12px;
  }

  .segmento-item {
    grid-template-columns: 9px minmax(0, 1fr) auto;
    gap: 4px;
  }

  .segmento-nombre {
    font-size: 10px;
  }

  .segmento-item strong {
    font-size: 9px;
  }

  .servicio-item {
    grid-template-columns: 20px minmax(0, 1fr) minmax(48px, 0.9fr) 30px;
    gap: 5px;
  }

  .servicio-icon {
    font-size: 19px;
  }

  .servicio-nombre {
    font-size: 10px;
  }

  .barra-fondo {
    height: 9px;
  }

  .servicio-porcentaje {
    font-size: 10px;
  }
}
.fecha-input {
  width: 115px;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #18344d;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.fecha-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

@media (max-width: 360px) {
  .fecha-input {
    width: 105px;
    font-size: 12px;
  }
}
</style>

