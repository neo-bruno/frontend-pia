<template>
<v-app>

  <!-- =========================
         MENÚ LATERAL
    ========================== -->
  <v-navigation-drawer v-model="drawer" :permanent="!esMovil" :temporary="esMovil" width="280" class="admin-drawer">
    
    <!-- Logo / encabezado -->
    <div class="drawer-brand pa-5">
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

    <!-- =========================
           PERFIL
      ========================== -->

    <div class="pa-4">
      <v-card variant="flat" rounded="xl" class="profile-summary pa-3">
        <div class="d-flex align-center">

          <v-avatar class="profile-avatar" size="44">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>

          <div class="ml-3">

            <!-- Nombre del profesional -->
            <div class="font-weight-bold text-capitalize">
              {{ authStore.usuario?.nombre || "Mi cuenta" }}
            </div>

            <!-- Rol -->
            <div class="text-caption profile-role">
              {{ authStore.usuario?.rol || "Profesional" }}
            </div>

          </div>

        </div>
      </v-card>
    </div>

    <!-- =========================
           MENÚ PRINCIPAL
      ========================== -->

    <v-list nav class="px-3">

      <v-list-subheader>
        PRINCIPAL
      </v-list-subheader>

      <!-- Inicio -->
      <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Inicio" to="/admin" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Reservas -->
      <v-list-item prepend-icon="mdi-calendar-check-outline" title="Reservas" to="/admin/reservas" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Agenda -->
      <v-list-item prepend-icon="mdi-book-account" title="Agenda" to="/admin/agenda" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Clientes -->
      <v-list-item prepend-icon="mdi-account-tie" title="Clientes" to="/admin/clientes" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- =========================
             CONFIGURACIÓN
        ========================== -->

      <v-list-subheader class="mt-4">
        CONFIGURACION
      </v-list-subheader>

      <!-- Mi perfil
             Disponible para todos -->
      <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi perfil" to="/admin/perfil" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- =========================================
             CONFIGURACIÓN DEL NEGOCIO
             SOLO PARA QUIEN PUEDE CONFIGURAR
        ========================================== -->

      <template v-if="puedeConfigurarNegocio">

        <!-- Mi negocio -->
        <v-list-item prepend-icon="mdi-storefront-outline" title="Mi negocio" to="/admin/negocio" exact rounded="lg" @click="cerrarDrawerMovil" />

      </template>

      <!-- Servicios -->
      <v-list-item prepend-icon="mdi-content-cut" title="Servicios" to="/admin/servicios" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Horarios -->
      <v-list-item prepend-icon="mdi-calendar-clock-outline" title="Horarios" to="/admin/horarios" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Profesionales -->
      <v-list-item prepend-icon="mdi-account-tie-outline" title="Profesionales" to="/admin/profesionales" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Historial -->
      <v-list-item prepend-icon="mdi-archive-clock" title="Historial" to="/admin/historial" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Descuentos -->
      <v-list-item prepend-icon="mdi-tag-minus" title="Descuentos" to="/admin/descuentos" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Pagos y membresía -->
      <v-list-item prepend-icon="mdi-crown-outline" title="Pagos y membresía" to="/admin/membresia" exact rounded="lg" @click="cerrarDrawerMovil" />

      <!-- =========================
             CUENTA Y SOPORTE
        ========================== -->

      <v-list-subheader class="mt-5">
        CUENTA Y SOPORTE
      </v-list-subheader>

      <!-- Notificaciones -->
      <v-list-item prepend-icon="mdi-bell-outline" title="Notificaciones" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Ayuda y soporte: acceso secundario -->
      <v-list-item prepend-icon="mdi-lifebuoy" title="Ayuda y soporte" rounded="lg" @click="abrirAyuda" />

      <v-divider class="my-3" />
      
      <!-- =========================
             CERRAR SESIÓN
        ========================== -->
      <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" rounded="lg" @click="cerrarSesion"/>
      
    </v-list>

  </v-navigation-drawer>

  <!-- =========================
         APP BAR
    ========================== -->

  <v-app-bar elevation="0" border color="white">

    <!-- Hamburguesa solo móvil -->
    <v-app-bar-nav-icon v-if="esMovil" color="primary" @click="drawer = !drawer" />

    <!-- Logo móvil -->
    <div v-if="esMovil" class="d-flex align-center">
      <span class="logo-mobile">
        PIA
      </span>
    </div>

    <!-- Título escritorio -->
    <v-toolbar-title v-else class="font-weight-bold">
      PIA · Mi negocio
    </v-toolbar-title>

    <v-spacer />

    <!-- =========================
           NOTIFICACIONES
      ========================== -->

    <v-btn icon variant="text" color="secondary" class="mr-1 notification-action" aria-label="Notificaciones" @click="abrirNotificaciones">

      <v-icon>
        mdi-bell-outline
      </v-icon>

      <v-badge v-if="cantidadNotificacionesNoLeidas > 0" color="error" :content="cantidadNotificacionesNoLeidas" floating />

    </v-btn>

    <!-- =========================
           PERFIL
      ========================== -->

    <v-btn icon variant="tonal" color="primary">
      <v-icon>
        mdi-account
      </v-icon>
    </v-btn>

    <!-- =========================
           ROL
      ========================== -->

    <v-chip v-if="!esMovil" color="secondary" class="ml-3 mr-4" variant="tonal">
      {{ puedeConfigurarNegocio ? "ADMIN" : "PROFESIONAL" }}
    </v-chip>

  </v-app-bar>

  <!-- =========================
         CONTENIDO
    ========================== -->

  <v-main class="admin-main">

    <v-container :class="esMovil ? 'px-4 py-4' : 'py-6'" fluid>
      <router-view />
    </v-container>

  </v-main>

  <!-- =========================
         BOTTOM NAVIGATION MÓVIL
    ========================== -->

  <v-bottom-navigation v-if="esMovil" v-model="bottomNav" color="primary" grow elevation="4" class="admin-bottom-nav">

    <!-- Inicio -->
    <v-btn value="inicio" to="/admin">

      <v-icon>
        mdi-home-outline
      </v-icon>

      <span>Inicio</span>

    </v-btn>

    <!-- Reserva -->
    <v-btn value="reserva" to="/admin/reservas">

      <v-badge v-if="cantidadNotificacionesNoLeidas > 0" color="error" :content="cantidadNotificacionesNoLeidas" floating>

        <v-icon>
          mdi-calendar-check-outline
        </v-icon>

      </v-badge>

      <v-icon v-else>
        mdi-calendar-check-outline
      </v-icon>

      <span>Reservas</span>

    </v-btn>

    <!-- Agenda -->
    <v-btn value="agenda" to="/admin/agenda">

      <v-icon>
        mdi-book
      </v-icon>

      <span>Agenda</span>

    </v-btn>

    <!-- Clientes -->
    <v-btn value="clientes" to="/admin/clientes">

      <v-icon>
        mdi-account-tie
      </v-icon>

      <span>Clientes</span>

    </v-btn>

  </v-bottom-navigation>

</v-app>
</template>

<script>
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
      bottomNav: "inicio",

      // ======================================================
      // SOCKET.IO
      // ======================================================

      socket: null,
    };
  },
  
  computed: {

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
      return this.notificationStore.cantidadNoLeidas;
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
          "🔔 NOTIFICACIONES ADMIN NO LEÍDAS:",
          this.notificationStore.cantidadNoLeidas,
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

  },

  mounted() {

    // ======================================================
    // CONECTAR SOCKET.IO
    // ======================================================

    this.socket = conectarSocket();

    if (this.socket) {

      this.socket.on(
        "nueva_notificacion",
        this.recibirNotificacionSocket,
      );

    }

    // ======================================================
    // CARGAR NOTIFICACIONES ACTUALES
    // ======================================================

    this.cargarNotificacionesAdmin();
  },

  beforeUnmount() {

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
  height: 68px !important;
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
    padding-bottom: 68px;
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
</style>
