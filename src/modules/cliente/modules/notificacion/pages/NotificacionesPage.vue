<template>
<div class="notificaciones-page">

  <!-- =====================================================
         ENCABEZADO
  ====================================================== -->  
  <div class="page-header">
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="page-header-text">
      <h1>Notificaciones</h1>

      <p v-if="cantidadNoLeidas > 0">
        Tienes {{ cantidadNoLeidas }} notificación{{
            cantidadNoLeidas === 1?"" : "es"
          }}
        sin leer.
      </p>

      <p v-else>
        No tienes notificaciones pendientes.
      </p>
    </div>

    <v-btn v-if="cantidadNoLeidas > 0" variant="text" size="small" class="leer-todas-btn" @click="leerTodas" :loading="marcandoTodas">
      Leer todas
    </v-btn>
  </div>

  <!-- =====================================================
         FILTROS
    ====================================================== -->
  <div class="filtros">
    <button class="filtro" :class="{ activo: filtro === 'todas' }" @click="filtro = 'todas'">
      Todas
      <span class="contador">
        {{ notificaciones.length }}
      </span>
    </button>

    <button class="filtro" :class="{ activo: filtro === 'no-leidas' }" @click="filtro = 'no-leidas'">
      No leídas
      <span v-if="cantidadNoLeidas > 0" class="contador">
        {{ cantidadNoLeidas }}
      </span>
    </button>
  </div>

  <!-- =====================================================
         CARGANDO
    ====================================================== -->
  <div v-if="cargando" class="estado">
    <v-progress-circular indeterminate size="30" width="3" color="primary" />

    <span>Cargando notificaciones...</span>
  </div>

  <!-- =====================================================
         ERROR
    ====================================================== -->
  <div v-else-if="error" class="estado error">
    <v-icon size="38">
      mdi-alert-circle-outline
    </v-icon>

    <strong>No pudimos cargar tus notificaciones</strong>

    <span>
      Intenta nuevamente.
    </span>

    <v-btn size="small" variant="outlined" color="primary" @click="cargarNotificaciones">
      Reintentar
    </v-btn>
  </div>

  <!-- =====================================================
         SIN NOTIFICACIONES
    ====================================================== -->
  <div v-else-if="notificacionesFiltradas.length === 0" class="estado vacio">
    <div class="vacio-icon">
      <v-icon size="42">
        mdi-bell-off-outline
      </v-icon>
    </div>

    <strong>
      {{ filtro === "no-leidas"
         ?"No tienes notificaciones sin leer"
          : "Aún no tienes notificaciones"
        }}
    </strong>

    <span>
      Aquí aparecerán avisos importantes sobre tus
      reservas, pagos, promociones y servicios.
    </span>
  </div>

  <!-- =====================================================
         LISTA
    ====================================================== -->
  <div v-else class="lista-notificaciones">
    <div v-for="notificacion in notificacionesFiltradas" :key="notificacion.id" class="notificacion-card" :class="{
          'no-leida': !estaLeida(notificacion)
        }" @click="abrirNotificacion(notificacion)">

      <!-- ICONO -->
      <div class="notificacion-icon" :class="`tipo-${obtenerTipo(notificacion)}`">
        <v-icon size="21">
          {{ obtenerIcono(notificacion) }}
        </v-icon>
      </div>

      <!-- CONTENIDO -->
      <div class="notificacion-contenido">

        <div class="notificacion-top">
          <h2>
            {{ obtenerTitulo(notificacion) }}
          </h2>

          <span v-if="!estaLeida(notificacion)" class="punto-no-leida"></span>
        </div>

        <p class="mensaje">
          {{ obtenerMensaje(notificacion) }}
        </p>

        <div class="notificacion-bottom">

          <span class="fecha">
            {{ formatearFecha(notificacion) }}
          </span>

          <button class="accion" @click.stop="abrirNotificacion(notificacion)">
            {{ obtenerTextoBoton(notificacion) }}

            <v-icon size="15">
              mdi-chevron-right
            </v-icon>
          </button>

        </div>

      </div>
    </div>
  </div>

</div>
</template>

<script>
import {
  getNotificaciones,
  getNotificacionesNoLeidas,
  marcarNotificacionComoLeida,
  marcarTodasComoLeidas,
} from "../services/notificacion.api";

export default {
  name: "NotificacionesPage",

  data() {
    return {
      notificaciones: [],

      filtro: "todas",

      cargando: false,
      error: false,

      marcandoTodas: false,
    };
  },

  computed: {
    // ======================================================
    // CANTIDAD NO LEÍDAS
    // ======================================================

    cantidadNoLeidas() {
      return this.notificaciones.filter(
        (notificacion) => !this.estaLeida(notificacion)
      ).length;
    },

    // ======================================================
    // NOTIFICACIONES FILTRADAS
    // ======================================================

    notificacionesFiltradas() {
      if (this.filtro === "no-leidas") {
        return this.notificaciones.filter(
          (notificacion) => !this.estaLeida(notificacion)
        );
      }

      return this.notificaciones;
    },
  },

  mounted() {
    this.cargarNotificaciones();
  },

  methods: {
    // ======================================================
    // CARGAR NOTIFICACIONES
    // ======================================================

    async cargarNotificaciones() {
      this.cargando = true;
      this.error = false;

      try {
        const response = await getNotificaciones();

        this.notificaciones = this.extraerLista(response);
      } catch (error) {
        console.error(
          "Error cargando notificaciones:",
          error
        );

        this.error = true;
        this.notificaciones = [];
      } finally {
        this.cargando = false;
      }
    },

    // ======================================================
    // EXTRAER LISTA
    // ======================================================

    extraerLista(response) {
      const data = response?.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.notificaciones)) {
        return data.notificaciones;
      }

      if (Array.isArray(data?.rows)) {
        return data.rows;
      }

      return [];
    },

    // ======================================================
    // DETERMINAR SI ESTÁ LEÍDA
    // ======================================================

    estaLeida(notificacion) {
      if (typeof notificacion.leida === "boolean") {
        return notificacion.leida;
      }

      if (typeof notificacion.leido === "boolean") {
        return notificacion.leido;
      }

      const estado = String(
        notificacion.estado || ""
      ).toUpperCase();

      return (
        estado === "LEIDA" ||
        estado === "LEIDO" ||
        estado === "LEÍDA" ||
        estado === "LEÍDO"
      );
    },

    // ======================================================
    // TIPO
    // ======================================================

    obtenerTipo(notificacion) {
      const tipo = String(
          notificacion.tipo ||
          notificacion.tipo_notificacion ||
          ""
        )
        .toLowerCase()
        .trim();

      if (tipo.includes("reserva")) {
        return "reserva";
      }

      if (tipo.includes("pago")) {
        return "pago";
      }

      if (tipo.includes("promocion") ||
        tipo.includes("promoción")) {
        return "promocion";
      }

      if (tipo.includes("descuento")) {
        return "descuento";
      }

      if (tipo.includes("servicio")) {
        return "servicio";
      }

      if (tipo.includes("membresia") ||
        tipo.includes("membresía")) {
        return "membresia";
      }

      return "general";
    },

    // ======================================================
    // ICONO
    // ======================================================

    obtenerIcono(notificacion) {
      const tipo = this.obtenerTipo(notificacion);

      const iconos = {
        reserva: "mdi-calendar-check-outline",
        pago: "mdi-cash-check",
        promocion: "mdi-sale-outline",
        descuento: "mdi-tag-outline",
        servicio: "mdi-content-cut",
        membresia: "mdi-card-account-details-outline",
        general: "mdi-bell-outline",
      };

      return iconos[tipo] || iconos.general;
    },

    // ======================================================
    // TÍTULO
    // ======================================================

    obtenerTitulo(notificacion) {
      return (
        notificacion.titulo ||
        notificacion.title ||
        this.tituloPorTipo(notificacion)
      );
    },

    tituloPorTipo(notificacion) {
      const titulos = {
        reserva: "Notificación de reserva",
        pago: "Pago recibido",
        promocion: "Nueva promoción",
        descuento: "Nuevo descuento",
        servicio: "Nuevo servicio",
        membresia: "Membresía",
        general: "Nueva notificación",
      };

      return titulos[this.obtenerTipo(notificacion)];
    },

    // ======================================================
    // MENSAJE
    // ======================================================

    obtenerMensaje(notificacion) {
      return (
        notificacion.mensaje ||
        notificacion.descripcion ||
        notificacion.message ||
        "Tienes una nueva notificación."
      );
    },

    // ======================================================
    // TEXTO DEL BOTÓN
    // ======================================================

    obtenerTextoBoton(notificacion) {
      const textos = {
        reserva: "Ver reserva",
        pago: "Ver pago",
        promocion: "Ver promoción",
        descuento: "Ver descuento",
        servicio: "Ver servicio",
        membresia: "Ver membresía",
        general: "Ver detalle",
      };

      return textos[this.obtenerTipo(notificacion)];
    },

    // ======================================================
    // FECHA
    // ======================================================

    formatearFecha(notificacion) {
      const valor =
        notificacion.created_at ||
        notificacion.fecha ||
        notificacion.fecha_creacion;

      if (!valor) {
        return "";
      }

      const fecha = new Date(valor);

      if (Number.isNaN(fecha.getTime())) {
        return "";
      }

      const ahora = new Date();

      const diferencia =
        ahora.getTime() - fecha.getTime();

      const minutos = Math.floor(
        diferencia / (1000 * 60)
      );

      const horas = Math.floor(
        diferencia / (1000 * 60 * 60)
      );

      const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
      );

      if (minutos < 1) {
        return "Ahora";
      }

      if (minutos < 60) {
        return `Hace ${minutos} min`;
      }

      if (horas < 24) {
        return `Hace ${horas} h`;
      }

      if (dias === 1) {
        return "Ayer";
      }

      if (dias < 7) {
        return `Hace ${dias} días`;
      }

      return fecha.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    // ======================================================
    // ABRIR NOTIFICACIÓN
    // ======================================================

    async abrirNotificacion(notificacion) {
      try {
        if (!this.estaLeida(notificacion)) {
          await marcarNotificacionComoLeida(
            notificacion.id
          );

          this.actualizarComoLeida(notificacion);
        }
      } catch (error) {
        console.error(
          "Error marcando notificación como leída:",
          error
        );
      }

      this.irAlDetalle(notificacion);
    },

    // ======================================================
    // ACTUALIZAR ESTADO LOCAL
    // ======================================================

    actualizarComoLeida(notificacion) {
      if ("leida" in notificacion) {
        notificacion.leida = true;
      }

      if ("leido" in notificacion) {
        notificacion.leido = true;
      }

      if ("estado" in notificacion) {
        notificacion.estado = "LEIDA";
      }
    },

    // ======================================================
    // IR AL DETALLE CORRESPONDIENTE
    // ======================================================

    irAlDetalle(notificacion) {
      const tipo = this.obtenerTipo(notificacion);

      switch (tipo) {
        case "reserva":
          this.$router.push({
            name: "cliente.notificaciones.reservas",
            query: {
              id: notificacion.reserva_id,
            },
          });
          break;

        case "pago":
          this.$router.push({
            name: "cliente.notificaciones.pago",
            query: {
              id: notificacion.pago_id,
            },
          });
          break;

        case "promocion":
          this.$router.push({
            name: "cliente.notificaciones.promocion",
            query: {
              id: notificacion.promocion_id,
            },
          });
          break;

        case "descuento":
          this.$router.push({
            name: "cliente.notificaciones.descuento",
            query: {
              id: notificacion.descuento_id,
            },
          });
          break;

        case "servicio":
          this.$router.push({
            name: "cliente.notificaciones.servicio",
            query: {
              id: notificacion.servicio_id,
            },
          });
          break;

        default:
          break;
      }
    },

    // ======================================================
    // LEER TODAS
    // ======================================================

    async leerTodas() {
      if (this.marcandoTodas || this.cantidadNoLeidas === 0) {
        return;
      }

      this.marcandoTodas = true;

      try {
        await marcarTodasComoLeidas();

        this.notificaciones.forEach(
          (notificacion) => {
            this.actualizarComoLeida(notificacion);
          }
        );
      } catch (error) {
        console.error(
          "Error marcando todas las notificaciones:",
          error
        );
      } finally {
        this.marcandoTodas = false;
      }
    },

    volver() {
      this.$router.push({name: 'cliente'});
    },
  },
};
</script>

<style lang="scss" scoped>
/* ==========================================================
   PÁGINA
========================================================== */

.notificaciones-page {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 16px 14px 24px;
  box-sizing: border-box;
  color: #102a43;
}

/* ==========================================================
   HEADER
========================================================== */

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.back-button {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  border-radius: 12px;
  border: 1px solid #dcefee;
  background: #ffffff;
  color: #008b8b;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow: 0 4px 12px rgba(0, 139, 139, 0.07);
}

.page-header-text {
  flex: 1;
}

.page-header-text h1 {
  margin: 0;

  color: #102d5a;

  font-size: 20px;
  line-height: 1.15;
  font-weight: 700;
}

.page-header-text p {
  margin: 3px 0 0;
  font-size: 11px;
  line-height: 1.35;
  color: #60779a;
}

.leer-todas-btn {
  flex-shrink: 0;

  min-width: auto !important;
  padding: 0 6px !important;

  font-size: 11px;
  font-weight: 600;

  color: #0f8f8c !important;

  text-transform: none;
}

/* ==========================================================
   FILTROS
========================================================== */

.filtros {
  display: flex;
  gap: 7px;

  margin-bottom: 14px;

  overflow-x: auto;
  scrollbar-width: none;
}

.filtros::-webkit-scrollbar {
  display: none;
}

.filtro {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  height: 34px;
  padding: 0 12px;

  border: 1px solid #e1eceb;
  border-radius: 9px;

  background: #ffffff;
  color: #60758a;

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  white-space: nowrap;

  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.filtro.activo {
  background: #0f8f8c;
  border-color: #0f8f8c;
  color: #ffffff;
}

.contador {
  min-width: 17px;
  height: 17px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0 4px;

  border-radius: 20px;

  background: #eaf7f6;
  color: #0f8f8c;

  font-size: 9px;
  font-weight: 700;
}

.filtro.activo .contador {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* ==========================================================
   LISTA
========================================================== */

.lista-notificaciones {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ==========================================================
   NOTIFICACIÓN
========================================================== */

.notificacion-card {
  display: flex;
  align-items: flex-start;
  gap: 11px;

  width: 100%;
  padding: 12px;

  border: 1px solid #edf2f2;
  border-radius: 12px;

  background: #ffffff;

  cursor: pointer;

  box-sizing: border-box;

  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.notificacion-card:hover {
  border-color: #b9dddb;
}

.notificacion-card.no-leida {
  background: #f4fbfa;
  border-color: #d8eeec;
}

/* ==========================================================
   ICONO
========================================================== */

.notificacion-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;
}

/* Tipos */

.tipo-reserva {
  background: #eaf7f6;
  color: #0f8f8c;
}

.tipo-pago {
  background: #eaf7f6;
  color: #16a6a0;
}

.tipo-promocion {
  background: #fff7e5;
  color: #c28a18;
}

.tipo-descuento {
  background: #fff7e5;
  color: #b57b0f;
}

.tipo-servicio {
  background: #eaf7f6;
  color: #0b5f63;
}

.tipo-membresia {
  background: #eef4fa;
  color: #416a8a;
}

.tipo-general {
  background: #f1f5f6;
  color: #617785;
}

/* ==========================================================
   CONTENIDO
========================================================== */

.notificacion-contenido {
  flex: 1;
  min-width: 0;
}

.notificacion-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notificacion-top h2 {
  flex: 1;

  margin: 0;

  overflow: hidden;

  font-size: 13px;
  line-height: 1.3;
  font-weight: 700;

  color: #102a43;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.punto-no-leida {
  width: 7px;
  height: 7px;
  min-width: 7px;

  border-radius: 50%;

  background: #0f8f8c;
}

.mensaje {
  margin: 4px 0 8px;

  font-size: 12px;
  line-height: 1.45;

  color: #60758a;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* ==========================================================
   PARTE INFERIOR
========================================================== */

.notificacion-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.fecha {
  font-size: 10px;
  color: #91a1ae;
}

.accion {
  display: inline-flex;
  align-items: center;
  gap: 2px;

  padding: 0;

  border: 0;
  background: transparent;

  color: #0f8f8c;

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  cursor: pointer;
}

/* ==========================================================
   ESTADOS
========================================================== */

.estado {
  min-height: 280px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 30px 20px;

  text-align: center;

  color: #6b7c93;
}

.estado span {
  max-width: 280px;

  font-size: 12px;
  line-height: 1.5;
}

.estado strong {
  color: #102a43;
  font-size: 14px;
}

.estado.error {
  color: #d9534f;
}

.estado.error strong {
  color: #102a43;
}

.vacio {
  padding-top: 50px;
}

.vacio-icon {
  width: 70px;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 5px;

  border-radius: 50%;

  background: #eaf7f6;
  color: #0f8f8c;
}

/* ==========================================================
   TABLET / DESKTOP
========================================================== */

@media (min-width: 600px) {
  .notificaciones-page {
    padding: 22px 20px 30px;
  }

  .notificacion-card {
    padding: 14px;
  }
}
</style>
