<template>
<v-app>

  <!-- =========================
         MENÚ LATERAL
    ========================== -->

  <v-navigation-drawer v-model="drawer" :permanent="!esMovil" :temporary="esMovil" :scrim="esMovil" width="280" class="admin-drawer">
    <!-- CONTENIDO DESPLAZABLE -->
    <div class="drawer-scroll">

      <!-- Logo / encabezado -->
      <div class="drawer-brand px-5 pb-0 pt-4">
        <div class="d-flex align-center">
          <div class="logo-pia">PIA</div>
          <div class="ml-3">
            <div class="text-h6 font-weight-black brand-title">PIA</div>
            <div class="text-caption brand-subtitle">Gestión profesional</div>
          </div>
        </div>

        <div class="brand-caption mt-4">
          <v-icon size="14" class="mr-1">mdi-sparkles</v-icon>
          Tu negocio, mejor organizado
        </div>
      </div>

      <v-divider />

      <!-- PERFIL -->
      <div class="px-4 pt-2">
        <v-card variant="flat" rounded="xl" class="profile-summary pa-3">
          <div class="d-flex align-center">
            <v-avatar class="profile-avatar" size="44">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>

            <div class="ml-3">
              <div class="font-weight-bold text-capitalize">
                {{ authStore.usuario?.nombre || "Mi cuenta" }}
              </div>
              <div class="text-caption profile-role">
                {{ authStore.usuario?.rol || "Profesional" }}
              </div>
            </div>
          </div>
        </v-card>
      </div>

      <!-- MENÚ PRINCIPAL -->
      <v-list nav class="px-3">

        <v-list-subheader>PRINCIPAL</v-list-subheader>

        <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Inicio" to="/admin" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-calendar-check-outline" title="Reservas" to="/admin/reservas" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-book-account" title="Agenda" to="/admin/agenda" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-account-tie" title="Clientes" to="/admin/clientes" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-subheader class="mt-4">
          CONFIGURACIÓN
        </v-list-subheader>

        <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi perfil" to="/admin/perfil" exact rounded="lg" @click="cerrarDrawerMovil" />

        <template v-if="puedeConfigurarNegocio">
          <v-list-item prepend-icon="mdi-storefront-outline" title="Mi negocio" to="/admin/negocio" exact rounded="lg" @click="cerrarDrawerMovil" />
        </template>

        <v-list-item prepend-icon="mdi-content-cut" title="Servicios" to="/admin/servicios" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-calendar-clock-outline" title="Horarios" to="/admin/horarios" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-account-tie-outline" title="Profesionales" to="/admin/profesionales" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-archive-clock" title="Historial" to="/admin/historial" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-tag-minus" title="Descuentos" to="/admin/descuentos" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-crown-outline" title="Pagos y membresía" to="/admin/membresia" exact rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-subheader class="mt-5">
          CUENTA Y SOPORTE
        </v-list-subheader>

        <v-list-item prepend-icon="mdi-bell-outline" title="Notificaciones" rounded="lg" @click="cerrarDrawerMovil" />

        <v-list-item prepend-icon="mdi-lifebuoy" title="Ayuda y soporte" rounded="lg" @click="abrirAyuda" />

      </v-list>
    </div>

    <!-- CERRAR SESIÓN SIEMPRE VISIBLE -->
    <div class="drawer-logout">
      <v-divider class="mb-2" />

      <v-list nav class="px-3 py-1">
        <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" rounded="lg" class="logout-item" @click="cerrarSesion" />
      </v-list>
    </div>

  </v-navigation-drawer>

  <!-- =========================
         APP BAR
    ========================== -->
  <!-- =========================
     APP BAR PIA
========================== -->

  <v-app-bar class="pia-app-bar" height="64" elevation="0" border color="white">
    <div class="pia-app-bar-content">
      <div class="app-bar-top">

        <!-- Menú móvil -->
        <v-btn v-if="esMovil" icon variant="text" density="compact" class="app-bar-menu" color="primary" aria-label="Abrir menú" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- Marca PIA -->
        <div class="logo-mobile">PIA</div>

        <!-- El nombre aprovecha todo el espacio disponible -->
        <div class="professional-info">
          <div class="professional-name">
            {{ nombreProfesional }}
          </div>
          <div class="professional-role">
            {{ rolProfesional }}
          </div>
        </div>

        <!-- Estado automático según los horarios configurados -->
        <div class="business-status" :class="{
            'status-open': estadoHorario?.estado === 'ABIERTO',
            'status-closed': estadoHorario?.estado === 'CERRADO',
            'status-unknown': !estadoHorario
          }">
          <span class="status-indicator"></span>
          <span>
            {{ cargandoHorarios
             ?'VERIFICANDO'
              : estadoHorario?.estado || 'SIN DATOS'
            }}
          </span>
        </div>

      </div>
    </div>
  </v-app-bar>

  <!-- =========================
         CONTENIDO
    ========================== -->

  <v-main class="admin-main">
    <div class="admin-content-scroll">
      <v-container :class="esMovil?'px-2 py-4' : 'py-6'" fluid>
        <router-view />
      </v-container>
    </div>
  </v-main>

  <!-- =========================
     BOTTOM NAVIGATION MÓVIL
========================== -->

  <v-bottom-navigation v-if="esMovil" :model-value="bottomNav" color="primary" grow elevation="4" class="admin-bottom-nav">
    <!-- Inicio -->
    <v-btn value="inicio" to="/admin" exact>
      <v-icon>mdi-home-outline</v-icon>
      <span>Inicio</span>
    </v-btn>

    <!-- Reservas -->
    <v-btn value="reservas" to="/admin/reservas">
      <v-badge v-if="cantidadNotificacionesNoLeidas > 0" color="error" :content="cantidadNotificacionesNoLeidas" floating>
        <v-icon>mdi-calendar-check-outline</v-icon>
      </v-badge>

      <v-icon v-else>mdi-calendar-check-outline</v-icon>

      <span>Reservas</span>
    </v-btn>

    <!-- Agenda -->
    <v-btn value="agenda" to="/admin/agenda">
      <v-icon>mdi-book</v-icon>
      <span>Agenda</span>
    </v-btn>

    <!-- Clientes -->
    <v-btn value="clientes" to="/admin/clientes">
      <v-icon>mdi-account-tie</v-icon>
      <span>Clientes</span>
    </v-btn>
  </v-bottom-navigation>

</v-app>
</template>

<script>
import {
  getEstadoHorarioNegocio
} from "@/modules/admin/modules/negocio/services/negocio.api";
import {
  conectarSocket,
  desconectarSocket
} from "@/services/socket";
import {
  useAuthStore
} from "@/stores/auth.store";
import {
  useNotificationAdminStore
} from "@/stores/notificacionAdmin.store";

export default {
  name: "AdminLayout",

  data() {
    return {
      drawer: false,
      socket: null,

      // Estado automático del negocio
      estadoHorario: null,
      cargandoHorarios: true,
      intervaloReloj: null,

    };
  },

  computed: {

    bottomNav() {
      const ruta = this.$route.path;

      if (ruta === "/admin") {
        return "inicio";
      }

      if (ruta.startsWith("/admin/reservas")) {
        return "reservas";
      }

      if (ruta.startsWith("/admin/agenda")) {
        return "agenda";
      }

      if (ruta.startsWith("/admin/clientes")) {
        return "clientes";
      }

      return "";
    },

    authStore() {
      return useAuthStore();
    },

    notificationStore() {
      return useNotificationAdminStore();
    },

    esMovil() {
      return this.$vuetify.display.mobile;
    },

    puedeConfigurarNegocio() {
      return this.authStore.puedeConfigurarNegocio;
    },

    cantidadNotificacionesNoLeidas() {
      return this.notificationStore.cantidadReservasNoLeidas;
    },

    // Nombre del usuario autenticado
    nombreProfesional() {
      return this.authStore.usuario?.nombre || "Mi cuenta";
    },

    // Rol del usuario autenticado
    rolProfesional() {
      const rol = this.authStore.usuario?.rol;

      const roles = {
        ADMIN: "Administrador",
        SUPERADMIN: "Superadministrador",
        PROFESIONAL: "Profesional",
      };

      return roles[rol] || rol || "Profesional";
    },

    // Estado automático recibido desde el backend
    estaAbierto() {
      return this.estadoHorario?.estado === "ABIERTO";
    },
  },

  methods: {

    cerrarDrawerMovil() {
      if (this.esMovil) {
        this.drawer = false;
      }
    },

    abrirNotificaciones() {
      if (typeof this.$piaAlert === "function") {
        this.$piaAlert(
          "Las notificaciones se muestran en el centro de notificaciones de PIA.",
          "info",
        );
      }
    },

    abrirAyuda() {
      this.cerrarDrawerMovil();

      // La ayuda aún no tiene una ruta propia en este layout.
      // Mostramos una orientación sin navegar a una ruta inexistente.
      if (typeof this.$piaAlert === "function") {
        this.$piaAlert(
          "Próximamente encontrarás aquí guías de uso y contacto con soporte de PIA.",
          "info",
        );
      }
    },

    cerrarSesion() {
      this.authStore.logout();

      this.$router.push({
        name: "login",
      });
    },

    async cargarNotificacionesAdmin() {
      try {

        await this.notificationStore.cargarNoLeidas();

        console.log(
          "🔔 CANTIDAD NO LEÍDAS:",
          this.notificationStore.cantidadNoLeidas,
        );

        console.table(
          this.notificationStore.notificaciones.map((item) => ({
            id: item.id,
            reserva_id: item.reserva_id,
            tipo: item.tipo,
            estado: item.estado,
            profesional_id: item.profesional_id,
          })),
        );

      } catch (error) {

        console.error(
          "❌ ERROR CARGANDO NOTIFICACIONES ADMIN:",
          error,
        );

      }
    },

    // ======================================================
    // RECIBIR NOTIFICACIÓN POR SOCKET.IO
    // ======================================================

    recibirNotificacionSocket(notificacion) {

      console.log(
        "🔔 NUEVA NOTIFICACIÓN RECIBIDA POR SOCKET.IO:",
        notificacion,
      );

      this.notificationStore.recibirNotificacion(notificacion);
    },

    // ============================================
    // CONSULTAR ESTADO AUTOMÁTICO DEL NEGOCIO
    // ============================================
    async cargarHorariosNegocio() {
      try {
        const respuesta = await getEstadoHorarioNegocio();

        this.estadoHorario = respuesta.data?.data || null;

      } catch (error) {
        console.error(
          "Error al consultar el estado del negocio:",
          error
        );

        this.estadoHorario = null;

      } finally {
        this.cargandoHorarios = false;
      }
    },

    // ============================================
    // FORMATEAR FECHA
    // ============================================
    formatearFecha(fecha) {
      if (!fecha) return "";
      const fechaFormateada = dayjs(fecha).format("D MMM");
      return fechaFormateada;
    },

  },

  mounted() {

    // Cargar estado inicial
    this.cargarHorariosNegocio();

    // Actualizar estado cada 30 segundos
    this.intervaloReloj = setInterval(() => {
      this.cargarHorariosNegocio();
    }, 30000);

    // SOCKET.IO
    this.socket = conectarSocket();

    if (this.socket) {
      this.socket.on(
        "nueva_notificacion",
        this.recibirNotificacionSocket,
      );
    }

    // Notificaciones
    this.cargarNotificacionesAdmin();

  },

  beforeUnmount() {

    if (this.intervaloReloj) {
      clearInterval(this.intervaloReloj);
    }
    // ======================================================
    // QUITAR LISTENER DEL SOCKET
    // ======================================================

    if (this.socket) {

      this.socket.off(
        "nueva_notificacion",
        this.recibirNotificacionSocket,
      );

    }

    // ======================================================
    // DESCONECTAR SOCKET
    // ======================================================

    desconectarSocket();
  },

};
</script>

<style scoped>
.admin-main {
  background:
    radial-gradient(circle at 92% 0%, rgba(13, 148, 136, 0.045), transparent 25rem),
    #f6f9fb;
  min-height: 100vh;
}

.drawer-brand {
  background: linear-gradient(145deg, #ffffff 0%, #f4fbfa 100%);
}

.brand-title {
  color: #173b4a;
  letter-spacing: -0.7px;
}

.brand-subtitle {
  color: #7a8c9a;
  font-size: 11px;
}

.brand-caption {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  border: 1px solid #dcefeb;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #39827d;
  font-size: 10px;
  font-weight: 600;
}

.logo-pia {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(13, 148, 136, 0.13);
  border-radius: 16px;
  background: linear-gradient(145deg, #e0f7f3, #f4fbfa);
  box-shadow: 0 6px 16px rgba(13, 148, 136, 0.09);
  color: #0f8f8c;
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -1.5px;
}

.logo-mobile {
  color: #0f8f8c;
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -1px;
}

.admin-drawer {
  border-right: 1px solid #e7eef1;
  background: #fff;
}

.admin-drawer :deep(.v-divider) {
  border-color: #edf2f4;
}

.admin-drawer :deep(.v-list) {
  padding-top: 6px;
  padding-bottom: 14px;
}

.admin-drawer :deep(.v-list-subheader) {
  min-height: 38px;
  padding-inline: 14px;
  color: #91a0ad;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.25px;
}

.profile-summary {
  border: 1px solid #e3efef;
  background: linear-gradient(135deg, #f0faf8, #f8fbfd);
}

.profile-avatar {
  background: linear-gradient(145deg, #0d9488, #087f83);
  box-shadow: 0 5px 12px rgba(13, 148, 136, 0.18);
}

.profile-role {
  margin-top: 2px;
  color: #718596;
  font-size: 11px;
}

.admin-drawer :deep(.v-list-item) {
  position: relative;
  min-height: 46px;
  margin: 3px 0;
  padding-inline: 14px;
  border-radius: 12px !important;
  color: #536779;
  transition: background-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.admin-drawer :deep(.v-list-item .v-list-item__prepend > .v-icon) {
  margin-inline-end: 12px;
  color: #8b9aa8;
  opacity: 0.9;
}

.admin-drawer :deep(.v-list-item .v-list-item-title) {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.05px;
}

.admin-drawer :deep(.v-list-item--active) {
  background: #eaf8f6 !important;
  color: #087f83 !important;
  font-weight: 700;
}

.admin-drawer :deep(.v-list-item--active::before) {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 3px;
  border-radius: 0 4px 4px 0;
  background: #07999b;
  content: "";
  opacity: 1;
}

.admin-drawer :deep(.v-list-item--active .v-icon) {
  color: #078f93 !important;
  opacity: 1;
}

.admin-drawer :deep(.v-list-item:not(.v-list-item--active):hover) {
  background: #f5f9fa;
  color: #263f52;
  transform: translateX(2px);
}

.v-app-bar {
  border-bottom: 1px solid #e8eff2 !important;
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(14px);
}

.notification-action {
  border: 1px solid #edf2f4;
  background: #fbfdfd;
}

.admin-bottom-nav {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;

  width: 100% !important;
  height: 68px !important;

  z-index: 1006 !important;

  padding-bottom: env(safe-area-inset-bottom);

  border-top: 1px solid #e4edef;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(14px);
}

.admin-bottom-nav .v-btn {
  min-width: 0;
  font-size: 11px;
  letter-spacing: 0;
}

.admin-bottom-nav .v-btn--active {
  color: #078f93;
}

.admin-bottom-nav .v-btn--active :deep(.v-btn__content) {
  font-weight: 700;
}

@media (min-width: 960px) {
  .admin-main :deep(.v-container) {
    max-width: 1600px;
  }
}

@media (max-width: 600px) {
  .admin-main {
    padding-bottom: 80px !important;
  }

  .admin-drawer :deep(.v-list-item) {
    min-height: 44px;
  }
}

/* =========================================
   SCROLL DEL MENÚ LATERAL PIA
========================================= */

.admin-drawer :deep(.v-navigation-drawer__content) {
  height: 100% !important;
  max-height: 100dvh !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;

  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
  scrollbar-width: thin;
}

/* =========================================
   APP BAR PIA
========================================= */

.pia-app-bar {
  padding: 0 12px;
}

.pia-app-bar :deep(.v-toolbar__content) {
  height: auto !important;
  padding: 0;
}

.pia-app-bar-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.app-bar-top {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 56px;
}

.professional-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 10px;
}

.professional-name {
  overflow: hidden;
  color: #173b4a;
  font-size: 13px;
  font-weight: 800;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.professional-role {
  color: #82929e;
  font-size: 10px;
  line-height: 14px;
}

.app-bar-bottom {
  display: flex;
  align-items: end;
  width: 100%;
  min-height: 40px;
  padding: 0 4px 4px;
}

.business-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-open {
  background: #e7f7ef;
  color: #16834d;
}

.status-open .status-indicator {
  background: #20b66b;
}

.status-closed {
  background: #fff0ef;
  color: #d34d48;
}

.status-closed .status-indicator {
  background: #e35b55;
}

.date-selector {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
}

.notification-action {
  flex-shrink: 0;
  border: 1px solid #edf2f4;
  background: #fbfdfd;
}

@media (max-width: 360px) {

  .pia-app-bar {
    padding: 0 5px;
  }

  .professional-info {
    margin-left: 5px;
  }

  .professional-name {
    max-width: 105px;
    font-size: 12px;
  }

  .professional-role {
    font-size: 9px;
  }

  .logo-mobile {
    font-size: 21px;
  }

  .business-status {
    padding: 5px 8px;
    font-size: 9px;
  }

  .date-selector {
    font-size: 10px;
  }

}

.status-unknown {
  background: #f1f5f9;
  color: #64748b;
}

.status-unknown .status-indicator {
  background: #94a3b8;
}

/* =========================================
   CERRAR SESIÓN SIEMPRE VISIBLE
   POR ENCIMA DEL BOTTOM NAVIGATION
========================================= */

.drawer-logout {
  position: sticky;
  bottom: 0;
  z-index: 10;
  flex: 0 0 auto;
  width: 100%;
  padding-bottom: 8px;
  background: #fff;
  border-top: 1px solid #edf2f4;
  box-shadow: 0 -4px 12px rgba(20, 50, 60, 0.05);
}

.drawer-logout :deep(.v-list) {
  padding: 4px 12px;
}

.drawer-logout :deep(.v-list-item) {
  min-height: 48px;
  border-radius: 12px !important;
  color: #d34d48;
}

.drawer-logout :deep(.v-list-item .v-icon) {
  color: #d34d48 !important;
}

/* En móvil, dejar espacio para el Bottom Navigation */
@media (max-width: 959px) {
  .drawer-logout {
    margin-bottom: 0px;
  }
}

/* En escritorio no existe Bottom Navigation */
@media (min-width: 960px) {
  .drawer-logout {
    margin-bottom: 0;
  }
}

/* =========================================
   DRAWER PIA FIJO
========================================= */

.admin-drawer {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  height: 100dvh !important;
  max-height: 100dvh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  border-right: 1px solid #e7eef1;
  background: #fff;
  z-index: 1008 !important;
}

/* Contenedor interno */
.admin-drawer :deep(.v-navigation-drawer__content) {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

/* Menú desplazable */
.drawer-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  scrollbar-width: thin;
}

/* Cerrar sesión siempre abajo */
.drawer-logout {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: #fff;
  border-top: 1px solid #edf2f4;
  box-shadow: 0 -4px 12px rgba(20, 50, 60, 0.05);
}

.drawer-logout :deep(.v-list) {
  padding: 4px 12px;
}

.drawer-logout :deep(.v-list-item) {
  min-height: 48px;
  border-radius: 12px !important;
  color: #d34d48;
}

.drawer-logout :deep(.v-list-item .v-icon) {
  color: #d34d48 !important;
}

/* =========================================
   APP BAR SIN CALENDARIO
========================================= */

.pia-app-bar {
  padding: 0 12px;
}

.pia-app-bar :deep(.v-toolbar__content) {
  height: 96px !important;
  padding: 0;
}

.pia-app-bar-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.app-bar-top {
  display: flex;
  justify-content: space-between;

  width: 100%;
  min-height: 56px;
}

.app-bar-bottom {
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  min-height: 32px;
  padding: 0 4px 3px;
}

/* =========================================
   MÓVIL
========================================= */

@media (max-width: 600px) {
  .admin-main {
    padding-bottom: 80px !important;
  }

  .admin-drawer :deep(.v-list-item) {
    min-height: 44px;
  }

  .pia-app-bar {
    padding: 0 5px;
  }

  .professional-info {
    margin-left: 5px;
  }

  .professional-name {
    max-width: 105px;
    font-size: 12px;
  }

  .professional-role {
    font-size: 9px;
  }

  .logo-mobile {
    font-size: 21px;
  }

  .business-status {
    padding: 5px 8px;
    font-size: 9px;
  }
}

/* =========================================
   ESTRUCTURA PRINCIPAL PIA
========================================= */

.admin-main {
  height: 100dvh;
  overflow: hidden !important;
  background:
    radial-gradient(circle at 92% 0%,
      rgba(13, 148, 136, 0.045),
      transparent 25rem),
    #f6f9fb;
}

/* Área independiente de desplazamiento */
.admin-content-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}

/* =========================================
   APP BAR SIEMPRE FIJO
========================================= */

.pia-app-bar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1005 !important;
}

/* =========================================
   DRAWER FIJO
========================================= */

.admin-drawer {
  position: fixed !important;
  top: 0 !important;
  bottom: 0 !important;
  height: 100dvh !important;
  z-index: 1008 !important;
}

/* =========================================
   AJUSTE DE CONTENIDO
========================================= */

@media (min-width: 960px) {
  .admin-content-scroll {
    padding-top: 96px;
    padding-bottom: 24px;
  }
}

/* =========================================
   APP BAR COMPACTO
========================================= */

.pia-app-bar {
  height: 64px !important;
  min-height: 64px !important;
  max-height: 64px !important;
}

.pia-app-bar :deep(.v-toolbar__content) {
  height: 64px !important;
  min-height: 64px !important;
  padding: 0 0px !important;
}

.app-bar-profesional {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  margin-left: 8px;
  margin-right: 8px;
}

.app-bar-profesional .nombre {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-bar-profesional .rol {
  font-size: 10px;
  color: #78909c;
  white-space: nowrap;
}

.app-bar-estado {
  flex: 0 0 auto;
  white-space: nowrap;
}

/* =========================================
   APP BAR PIA - DISTRIBUCIÓN DEFINITIVA
   Menú | Logo | Profesional flexible | Estado
========================================= */

.pia-app-bar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 64px !important;
  min-height: 64px !important;
  max-height: 64px !important;
  padding: 0 8px !important;
  z-index: 1005 !important;
}

.pia-app-bar :deep(.v-toolbar__content) {
  display: flex !important;
  align-items: center !important;
  height: 64px !important;
  min-height: 64px !important;
  max-height: 64px !important;
  padding: 0 !important;
}

.pia-app-bar-content {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  height: 64px !important;
  min-width: 0 !important;
}

.app-bar-top {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 6px !important;
  width: 100% !important;
  height: 64px !important;
  min-height: 64px !important;
  min-width: 0 !important;
}

.app-bar-menu {
  flex: 0 0 36px !important;
  width: 36px !important;
  height: 40px !important;
  margin: 0 !important;
}

.logo-mobile {
  flex: 0 0 auto !important;
  display: flex;
  align-items: center;
  color: #0f8f8c;
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
}

.professional-info {
  display: flex !important;
  flex: 1 1 0% !important;
  flex-direction: column !important;
  justify-content: center;
  min-width: 0 !important;
  margin: 0 2px 0 4px !important;
  overflow: hidden !important;
}

.professional-name {
  display: block;
  max-width: 100% !important;
  overflow: hidden !important;
  color: #173b4a;
  font-size: 12px;
  font-weight: 800;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.professional-role {
  display: block;
  overflow: hidden;
  color: #82929e;
  font-size: 9px;
  line-height: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-status {
  display: inline-flex !important;
  flex: 0 0 auto !important;
  align-items: center;
  justify-content: center;
  gap: 5px;
  max-width: 94px;
  padding: 6px 8px !important;
  border-radius: 20px;
  font-size: 9px !important;
  font-weight: 800;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.status-indicator {
  flex: 0 0 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

@media (max-width: 360px) {
  .pia-app-bar {
    padding: 0 5px !important;
  }

  .app-bar-top {
    gap: 5px !important;
  }

  .app-bar-menu {
    flex-basis: 34px !important;
    width: 34px !important;
  }

  .logo-mobile {
    font-size: 21px;
  }

  .professional-info {
    margin-left: 2px !important;
    margin-right: 1px !important;
  }

  .professional-name {
    font-size: 14px;
  }

  .professional-role {
    font-size: 12px;
  }

  .business-status {
    gap: 4px;
    padding: 5px 6px !important;
    font-size: 8px !important;
  }
}

/* El contenido comienza justo debajo del App Bar fijo */
.admin-content-scroll {
  padding-top: 0px;
}

@media (min-width: 960px) {
  .admin-content-scroll {
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
</style>
