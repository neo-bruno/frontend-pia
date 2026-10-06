<template>
<v-app>

  <!-- =========================
         MENÚ LATERAL
    ========================== -->
  <v-navigation-drawer v-model="drawer" :permanent="!esMovil" :temporary="esMovil" width="280" class="admin-drawer">

    <!-- Logo / encabezado -->
    <div class="pa-5">
      <div class="d-flex align-center">

        <div class="logo-pia">
          PIA
        </div>

        <div class="ml-3">
          <div class="text-h6 font-weight-bold">
            PIA
          </div>

          <div class="text-caption text-medium-emphasis">
            (Proyecto Itzel & Adrian)
          </div>
        </div>

      </div>
    </div>

    <v-divider />

    <!-- =========================
           PERFIL
      ========================== -->
    <div class="pa-4">
      <v-card variant="tonal" color="primary" rounded="lg" class="pa-3">
        <div class="d-flex align-center">

          <v-avatar color="primary" size="44">
            <v-icon color="white">
              mdi-account
            </v-icon>
          </v-avatar>

          <div class="ml-3">

            <!-- Nombre del profesional -->
            <div class="font-weight-bold text-capitalize">
              {{ authStore.usuario?.nombre || "Mi cuenta" }}
            </div>

            <!-- Rol -->
            <div class="text-caption">
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
      <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Inicio" to="/admin" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Reservas -->       
      <v-list-item prepend-icon="mdi-calendar-check-outline" title="Reservas" to="/admin/reservas" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Agenda -->
      <v-list-item prepend-icon="mdi-book-account" title="Agenda" to="/admin/agenda" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Clientes -->
      <v-list-item prepend-icon="mdi-account-tie" title="Clientes" to="/admin/clientes" rounded="lg" @click="cerrarDrawerMovil" />      

      <!-- =========================
             CONFIGURACIÓN
        ========================== -->
      <v-list-subheader class="mt-4">
        CONFIGURACION
      </v-list-subheader>

      <!-- Mi perfil
             Disponible para todos -->
      <v-list-item prepend-icon="mdi-account-circle-outline" title="Mi perfil" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- =========================================
             CONFIGURACIÓN DEL NEGOCIO
             SOLO PARA QUIEN PUEDE CONFIGURAR
        ========================================== -->
      <template v-if="puedeConfigurarNegocio">

        <!-- Mi negocio -->
        <v-list-item prepend-icon="mdi-storefront-outline" title="Mi negocio" to="/admin/negocio" rounded="lg" @click="cerrarDrawerMovil" />        

      </template>      

      <!-- Servicios -->
      <v-list-item prepend-icon="mdi-content-cut" title="Servicios" to="/admin/servicios" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Horarios -->
      <v-list-item prepend-icon="mdi-calendar-clock-outline" title="Horarios" to="/admin/horarios" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Profesionales -->
      <v-list-item prepend-icon="mdi-account-tie-outline" title="Profesionales" to="/admin/profesionales" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Historial -->
      <v-list-item prepend-icon="mdi-archive-clock" title="Historial" to="/admin/historial" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Configuración -->
      <v-list-item prepend-icon="mdi-cog-outline" title="Configuración" to="/admin/configuracion" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- =========================
             CUENTA
        ========================== -->
      <v-list-subheader class="mt-4">
        CUENTA
      </v-list-subheader>

      <!-- Notificaciones -->
      <v-list-item prepend-icon="mdi-bell-outline" title="Notificaciones" rounded="lg" @click="cerrarDrawerMovil" />

      <!-- Ayuda -->
      <v-list-item prepend-icon="mdi-help-circle-outline" title="Ayuda" rounded="lg" @click="cerrarDrawerMovil" />

    </v-list>

    <!-- =========================
           CERRAR SESIÓN
      ========================== -->
    <template #append>

      <div class="pa-3">

        <v-divider class="mb-3" />

        <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" rounded="lg" @click="cerrarSesion" />

      </div>

    </template>

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
    <v-btn icon variant="text" color="secondary" class="mr-1">

      <v-icon>
        mdi-bell-outline
      </v-icon>

      <v-badge
        v-if="cantidadNotificacionesNoLeidas > 0"
        color="error"
        :content="cantidadNotificacionesNoLeidas"
        floating
      />

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

      <v-badge
        v-if="cantidadNotificacionesNoLeidas > 0"
        color="error"
        :content="cantidadNotificacionesNoLeidas"
        floating
      >
        <v-icon>
          mdi-calendar-check-outline
        </v-icon>
      </v-badge>

      <v-icon v-else>
        mdi-calendar-check-outline
      </v-icon>

      <span>Resevas</span>
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
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationAdminStore } from "@/stores/notificacionAdmin.store";


export default {
  name: "AdminLayout",

  data() {
    return {
      drawer: false,
      bottomNav: "inicio",
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
  },

  mounted() {
    this.cargarNotificacionesAdmin();
  },

};
</script>

<style scoped>
.admin-main {
  background: #ffffff;
  min-height: 100vh;
}

/* =========================
   LOGO
========================= */

.logo-pia {
  font-size: 28px;
  font-weight: 900;
  color: #0f8f8c;
  letter-spacing: -1px;
}

.logo-mobile {
  font-size: 23px;
  font-weight: 900;
  color: #0f8f8c;
  letter-spacing: -1px;
}

/* =========================
   DRAWER
========================= */

.admin-drawer {
  border-right: 1px solid #eaf7f6;
}

.admin-drawer :deep(.v-list-item--active) {
  background: #eaf7f6;
  color: #0f8f8c;
}

.admin-drawer :deep(.v-list-item--active .v-icon) {
  color: #0f8f8c;
}

/* =========================
   BOTTOM NAV
========================= */

.admin-bottom-nav {
  height: 68px !important;
  border-top: 1px solid #eaf7f6;
}

.admin-bottom-nav .v-btn {
  min-width: 0;
  font-size: 11px;
}

.admin-bottom-nav .v-btn--active {
  color: #0f8f8c;
}

/* Espacio para que el contenido
   no quede debajo del bottom nav */
@media (max-width: 600px) {
  .admin-main {
    padding-bottom: 68px;
  }
}
</style>
