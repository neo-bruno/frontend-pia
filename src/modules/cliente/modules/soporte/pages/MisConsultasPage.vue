
<template>
  <div class="mis-consultas-page">

    <!-- ENCABEZADO -->
    <header class="pagina-header">
      <button
        class="btn-volver"
        type="button"
        @click="volver"
      >
        <v-icon size="24">mdi-arrow-left</v-icon>
      </button>

      <div class="header-contenido">
        <h1>Mis consultas</h1>
        <p>Consulta el estado de tus solicitudes de soporte.</p>
      </div>

      <button
        class="btn-actualizar"
        type="button"
        :disabled="cargando"
        @click="cargarConsultas"
      >
        <v-icon :class="{ girando: cargando }">
          mdi-refresh
        </v-icon>
      </button>
    </header>

    <!-- RESUMEN -->
    <section class="resumen-consultas" v-if="!cargando || consultas.length">
      <div class="resumen-icono">
        <v-icon size="27">mdi-message-text-outline</v-icon>
      </div>

      <div class="resumen-contenido">
        <strong>{{ consultas.length }}</strong>
        <span>
          {{ consultas.length === 1 ? 'Consulta registrada' : 'Consultas registradas' }}
        </span>
      </div>
    </section>

    <!-- CARGANDO -->
    <div v-if="cargando && !consultas.length" class="estado-carga">
      <v-progress-circular
        indeterminate
        color="#008f9b"
        size="36"
      />
      <p>Cargando tus consultas...</p>
    </div>

    <!-- LISTADO -->
    <section v-else-if="consultas.length" class="consultas-listado">

      <div class="seccion-titulo">
        <h2>Historial de consultas</h2>
        <span>{{ consultas.length }}</span>
      </div>

      <article
        v-for="consulta in consultas"
        :key="consulta.id"
        class="consulta-card"
      >

        <div class="consulta-card-header">

          <div class="consulta-icono">
            <v-icon size="24">
              mdi-message-processing-outline
            </v-icon>
          </div>

          <span
            class="estado-badge"
            :class="claseEstado(consulta.estado)"
          >
            <span class="estado-punto"></span>
            {{ textoEstado(consulta.estado) }}
          </span>

        </div>

        <div class="consulta-contenido">

          <span class="consulta-codigo">
            {{ consulta.codigo }}
          </span>

          <h3>{{ consulta.asunto }}</h3>

          <div class="consulta-categoria">
            <v-icon size="16">mdi-folder-outline</v-icon>
            {{ consulta.categoria || 'General' }}
          </div>

        </div>

        <div class="consulta-footer">

          <div class="consulta-info">
            <v-icon size="16">mdi-calendar-outline</v-icon>
            <span>{{ formatearFecha(consulta.created_at) }}</span>
          </div>

          <div class="consulta-info">
            <v-icon size="16">mdi-message-outline</v-icon>
            <span>
              {{ consulta.cantidad_mensajes || 0 }}
              {{ consulta.cantidad_mensajes === 1 ? 'mensaje' : 'mensajes' }}
            </span>
          </div>

        </div>

      </article>

    </section>

    <!-- SIN CONSULTAS -->
    <section v-else class="estado-vacio">

      <div class="vacio-icono">
        <v-icon size="43">mdi-message-text-outline</v-icon>
      </div>

      <h2>Aún no tienes consultas</h2>

      <p>
        Cuando envíes una consulta a nuestro equipo de soporte,
        aparecerá aquí para que puedas seguir su estado.
      </p>

      <button
        class="btn-nueva-consulta"
        type="button"
        @click="nuevaConsulta"
      >
        <v-icon size="19">mdi-plus</v-icon>
        Nueva consulta
      </button>

    </section>

  </div>
</template>

<script>
import { getSupportTickets } from "../services/soporte.api";
import { piaAlert } from "@/services/piaAlert";

export default {
  name: "MisConsultasPage",

  data() {
    return {
      consultas: [],
      cargando: false,
    };
  },

  mounted() {
    this.cargarConsultas();
  },

  methods: {

    // ========================================================
    // CARGAR CONSULTAS DEL CLIENTE
    // ========================================================

    async cargarConsultas() {
      if (this.cargando) return;

      this.cargando = true;

      try {
        const respuesta = await getSupportTickets();

        if (respuesta.data?.ok) {
          this.consultas = Array.isArray(respuesta.data.data)
            ? respuesta.data.data
            : [];
        } else {
          this.consultas = [];

          piaAlert.error(
            respuesta.data?.message ||
            "No fue posible obtener tus consultas."
          );
        }

      } catch (error) {
        console.error("Error al cargar consultas:", error);

        piaAlert.error(
          error.response?.data?.message ||
          "No pudimos cargar tus consultas. Intenta nuevamente."
        );

      } finally {
        this.cargando = false;
      }
    },

    // ========================================================
    // VOLVER
    // ========================================================

    volver() {
      this.$router.push({
        name: "cliente-soporte",
      });
    },

    // ========================================================
    // NUEVA CONSULTA
    // ========================================================

    nuevaConsulta() {
      this.$router.push({
        name: "cliente-soporte-nueva",
      });
    },

    // ========================================================
    // ESTADOS
    // ========================================================

    textoEstado(estado) {
      const estados = {
        PENDIENTE: "Pendiente",
        EN_REVISION: "En revisión",
        RESPONDIDO: "Respondido",
        CERRADO: "Cerrado",
      };

      return estados[estado] || estado;
    },

    claseEstado(estado) {
      const clases = {
        PENDIENTE: "estado-pendiente",
        EN_REVISION: "estado-revision",
        RESPONDIDO: "estado-respondido",
        CERRADO: "estado-cerrado",
      };

      return clases[estado] || "estado-default";
    },

    // ========================================================
    // FECHAS
    // ========================================================

    formatearFecha(fecha) {
      if (!fecha) return "";

      const fechaLocal = new Date(fecha);

      if (Number.isNaN(fechaLocal.getTime())) return "";

      return fechaLocal.toLocaleString("es-BO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },

  },
};
</script>

<style lang="scss" scoped>

.mis-consultas-page {
  width: 100%;
  min-height: 100%;
  padding: 18px 15px 25px;
  color: #102653;
  font-family: "Nunito", sans-serif;
}

/* ============================================================
   ENCABEZADO
============================================================ */

.pagina-header {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 20px;
}

.btn-volver,
.btn-actualizar {
  flex-shrink: 0;
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5edf2;
  border-radius: 13px;
  background: #ffffff;
  color: #008f9b;
  cursor: pointer;
}

.btn-actualizar:disabled {
  opacity: 0.5;
}

.header-contenido {
  flex: 1;
  min-width: 0;

  h1 {
    margin: 0;
    color: #102653;
    font-size: 20px;
    line-height: 1.2;
    font-weight: 900;
  }

  p {
    margin: 4px 0 0;
    color: #71839d;
    font-size: 11px;
    line-height: 1.4;
  }
}

.girando {
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================
   RESUMEN
============================================================ */

.resumen-consultas {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  margin-bottom: 24px;
  border: 1px solid #d9f1ef;
  border-radius: 17px;
  background: linear-gradient(110deg, #e4faf7, #f5fbfc);
}

.resumen-icono {
  width: 47px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 14px;
  background: #c5f1ec;
  color: #008f9b;
}

.resumen-contenido {
  display: flex;
  flex-direction: column;

  strong {
    color: #008f9b;
    font-size: 21px;
    line-height: 1.1;
    font-weight: 900;
  }

  span {
    margin-top: 3px;
    color: #49658e;
    font-size: 12px;
  }
}

/* ============================================================
   TÍTULO DE SECCIÓN
============================================================ */

.seccion-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 13px;

  h2 {
    margin: 0;
    color: #102653;
    font-size: 16px;
    font-weight: 900;
  }

  span {
    min-width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: #e5f8f6;
    color: #008f9b;
    font-size: 12px;
    font-weight: 900;
  }
}

/* ============================================================
   TARJETA DE CONSULTA
============================================================ */

.consultas-listado {
  width: 100%;
}

.consulta-card {
  padding: 15px;
  margin-bottom: 13px;
  border: 1px solid #e6edf2;
  border-radius: 17px;
  background: #ffffff;
  box-shadow: 0 4px 13px rgba(20, 65, 110, 0.055);
}

.consulta-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}

.consulta-icono {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: #e5f8f6;
  color: #008f9b;
}

/* ============================================================
   ESTADOS
============================================================ */

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;
}

.estado-punto {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.estado-pendiente {
  color: #bd7900;
  background: #fff4d9;
}

.estado-revision {
  color: #3473c5;
  background: #eaf2ff;
}

.estado-respondido {
  color: #008b78;
  background: #e0f8ef;
}

.estado-cerrado {
  color: #748195;
  background: #eef1f5;
}

.estado-default {
  color: #607d8b;
  background: #edf3f5;
}

/* ============================================================
   CONTENIDO
============================================================ */

.consulta-codigo {
  color: #008f9b;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.4px;
}

.consulta-contenido h3 {
  margin: 5px 0 8px;
  color: #102653;
  font-size: 15px;
  line-height: 1.3;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.consulta-categoria {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #71839d;
  font-size: 11px;
}

/* ============================================================
   PIE DE TARJETA
============================================================ */

.consulta-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding-top: 12px;
  margin-top: 13px;
  border-top: 1px solid #edf1f5;
}

.consulta-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #71839d;
  font-size: 10px;

  .v-icon {
    color: #008f9b;
  }
}

/* ============================================================
   CARGANDO
============================================================ */

.estado-carga {
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  p {
    margin: 0;
    color: #71839d;
    font-size: 13px;
  }
}

/* ============================================================
   ESTADO VACÍO
============================================================ */

.estado-vacio {
  min-height: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 20px;
  text-align: center;
}

.vacio-icono {
  width: 85px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 17px;
  border-radius: 27px;
  background: #e5f8f6;
  color: #008f9b;
}

.estado-vacio h2 {
  margin: 0;
  color: #102653;
  font-size: 17px;
  font-weight: 900;
}

.estado-vacio p {
  max-width: 280px;
  margin: 9px 0 20px;
  color: #71839d;
  font-size: 12px;
  line-height: 1.6;
}

.btn-nueva-consulta {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  border: none;
  border-radius: 13px;
  background: #008f9b;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 5px 13px rgba(0, 143, 155, 0.18);
  cursor: pointer;
}

.btn-nueva-consulta:active {
  transform: scale(0.98);
}

/* ============================================================
   MÓVIL
============================================================ */

@media (max-width: 350px) {
  .mis-consultas-page {
    padding: 15px 11px 22px;
  }

  .consulta-card {
    padding: 13px;
  }

  .header-contenido h1 {
    font-size: 18px;
  }
}

</style>
