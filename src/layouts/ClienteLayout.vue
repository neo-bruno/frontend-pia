<template>
<v-app class="pia-client-app">

  <!-- =====================================================
           HEADER FIJO DEL CLIENTE
      ====================================================== -->

  <header class="pia-client-header">

    <!-- MARCA -->
    <div class="pia-brand" @click="irInicio">
      <div class="pia-logo">
        PIA
      </div>

      <div class="pia-subtitle">
        TU ESPACIO COMO CLIENTE
      </div>
    </div>

    <!-- ACCIONES -->
    <div class="pia-header-actions">

      <!-- NOTIFICACIONES -->
      <div class="notification-wrapper">

        <v-btn icon variant="flat" class="header-action-btn" @click="irA('/cliente/notificaciones')">
          <v-icon size="25">
            mdi-bell-outline
          </v-icon>
        </v-btn>

        <!-- SOLO MOSTRAR SI HAY NO LEÍDAS -->
        <span v-if="notificaciones > 0" class="notification-badge">
          {{ notificaciones }}
        </span>

      </div>

      <!-- AVATAR -->
      <v-btn icon variant="flat" class="client-avatar-btn" to="/cliente/perfil">
        <v-avatar size="46">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </v-btn>

    </div>

  </header>

  <!-- =====================================================
           CONTENIDO
      ====================================================== -->

  <v-main class="pia-main">
    <router-view />
  </v-main>

  <!-- =====================================================
           NAVEGACIÓN INFERIOR FIJA
      ====================================================== -->

  <v-bottom-navigation v-model="activeNav" class="pia-bottom-nav" grow elevation="8" height="72">

    <!-- INICIO -->
    <v-btn value="inicio" to="/cliente" class="pia-nav-btn">
      <v-icon size="22">
        mdi-home-outline
      </v-icon>

      <span>Inicio</span>
    </v-btn>

    <!-- FAVORITOS -->
    <v-btn value="favoritos" to="/cliente/favoritos" class="pia-nav-btn">
      <v-icon size="22">
        mdi-heart-outline
      </v-icon>

      <span>Favoritos</span>
    </v-btn>

    <!-- PÍA -->
    <v-btn value="pia" class="pia-bottom-btn" variant="text" stacked @click="abrirPia">
      <div class="pia-bottom-avatar">
        <v-img src="/images/pia/pia-character.png" cover />
      </div>
    </v-btn>

    <!-- RESERVAS -->
    <v-btn value="reservas" to="/cliente/reservas" class="pia-nav-btn">
      <v-icon size="22">
        mdi-calendar-outline
      </v-icon>

      <span>Reservas</span>
    </v-btn>

    <!-- PERFIL -->
    <v-btn value="perfil" to="/cliente/perfil" class="pia-nav-btn">
      <v-icon size="22">
        mdi-account-outline
      </v-icon>

      <span>Perfil</span>
    </v-btn>

  </v-bottom-navigation>

</v-app>
</template>

<script>
import {
  useNotificationStore
} from "@/stores/notification.store";

export default {

  name: "ClienteLayout",

  computed: {

    // ==========================================================
    // STORE DE NOTIFICACIONES
    // ==========================================================

    notificationStore() {
      return useNotificationStore();
    },

    // ==========================================================
    // CANTIDAD DE NOTIFICACIONES NO LEÍDAS
    // ==========================================================

    notificaciones() {
      return this.notificationStore.cantidadNoLeidas;
    },

  },

  data() {
    return {
      activeNav: "inicio",
    };
  },

  methods: {

    // ==========================================================
    // IR A INICIO
    // ==========================================================

    irInicio() {
      this.$router.push({
        path: "/",
      });
    },

    // ==========================================================
    // NAVEGAR
    // ==========================================================

    irA(direccion) {
      this.$router.push({
        path: direccion,
      });
    },

    // ==========================================================
    // ABRIR PÍA
    // ==========================================================

    abrirPia() {
      console.log("Abrir asistente Pía");
    },

    // ==========================================================
    // CARGAR NOTIFICACIONES
    // ==========================================================

    async cargarCantidadNotificaciones() {
      try {

        await this.notificationStore.cargarNoLeidas();

      } catch (error) {

        console.error(
          "❌ ERROR AL OBTENER CANTIDAD DE NOTIFICACIONES:",
          error
        );

      }
    },

  },

  // ============================================================
  // MOUNTED
  // ============================================================

  mounted() {

    this.cargarCantidadNotificaciones();

  },

};
</script>

<style scoped>
/* =========================================================
   VARIABLES
========================================================= */

.pia-client-app {
  background: #ffffff;
  min-height: 100vh;
}

/* =========================================================
   HEADER FIJO
========================================================= */

.pia-client-header {

  position: fixed;

  top: 0;
  left: 0;
  right: 0;

  height: 94px;

  z-index: 1100;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px 10px;

  background: #ffffff;

  box-sizing: border-box;

}

/* =========================================================
   LOGO
========================================================= */

.pia-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.pia-logo {

  font-size: 42px;

  line-height: 0.9;

  font-weight: 900;

  letter-spacing: -2px;

  color: #008f9b;
}

.pia-subtitle {

  margin-top: 5px;

  font-size: 8px;

  line-height: 1;

  font-weight: 700;

  color: #23416b;

}

/* =========================================================
   ACCIONES HEADER
========================================================= */

.pia-header-actions {

  display: flex;

  align-items: center;

  gap: 8px;
}

/* =========================================================
   BOTÓN NOTIFICACIONES
========================================================= */

.notification-wrapper {

  position: relative;

  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.header-action-btn {

  width: 50px !important;
  height: 50px !important;

  border-radius: 50% !important;

  background: #ffffff !important;

  color: #183f72 !important;

  box-shadow:
    0 4px 16px rgba(20, 60, 100, 0.08);
}

.notification-badge {

  position: absolute;

  top: -2px;
  right: -1px;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ef5350;

  color: white;

  font-family: "Nunito", sans-serif;

  font-size: 11px;

  font-weight: 800;

  border: 2px solid white;
}

/* =========================================================
   AVATAR
========================================================= */

.client-avatar-btn {

  width: 52px !important;
  height: 52px !important;

  padding: 2px !important;

  border-radius: 50% !important;

  background: #ffffff !important;

  box-shadow:
    0 4px 16px rgba(20, 60, 100, 0.08);
}

.client-avatar-btn :deep(.v-avatar) {

  border: 2px solid #edf2f7;

}

/* =========================================================
   CONTENIDO
========================================================= */

.pia-main {

  background: #ffffff;

  padding-top: 94px;

  padding-bottom: 82px;

  min-height: 100vh;

}

/* =========================================================
   BOTTOM NAV
========================================================= */

.pia-bottom-nav {

  position: fixed !important;

  bottom: 0;
  left: 0;
  right: 0;

  height: 72px;

  background: #ffffff !important;

  border-top: 1px solid #e6eeee;

  z-index: 1200;

}

/* =========================================================
   BOTONES NAV
========================================================= */

.pia-nav-btn {

  min-width: 20% !important;

  color: #64748b !important;

  font-family: "Nunito", sans-serif;

  font-size: 10px;

  text-transform: none !important;
}

.pia-nav-btn :deep(.v-btn__content) {

  gap: 3px;

}

.pia-nav-btn.v-btn--active {

  color: #008b8b !important;

}

/* =========================================================
   BOTÓN CENTRAL PÍA
========================================================= */

.pia-center-wrapper {

  position: relative;

  width: 20%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}

.pia-bottom-btn {
  overflow: visible !important;
}

.pia-bottom-avatar {
  position: absolute;
  top: -0px;
  width: 57px;
  height: 57px;
  overflow: hidden;
  border: 4px solid #ffffff;
  border-radius: 50%;
  background: #0b9d98;
  box-shadow: 0 3px 12px rgba(8, 127, 125, 0.25);
}

.pia-assistant-btn {

  width: 54px !important;
  height: 54px !important;

  margin-top: -28px;

  padding: 0 !important;

  overflow: hidden;

  border-radius: 50% !important;

  background: #ffffff !important;

  border: 4px solid white;

  box-shadow:
    0 4px 14px rgba(0, 130, 145, 0.25);
}

.pia-assistant-btn :deep(.v-img) {

  width: 100%;
  height: 100%;

}

.pia-assistant-label {

  margin-top: 1px;

  font-size: 10px;

  color: #008b8b;

  font-weight: 700;

}

/* =========================================================
   SOLO CELULAR
========================================================= */

@media (min-width: 768px) {

  .pia-client-header,
  .pia-main,
  .pia-bottom-nav {

    max-width: 430px;

    margin-left: auto;
    margin-right: auto;

  }

  .pia-client-header {

    left: 50%;

    right: auto;

    width: 430px;

    transform: translateX(-50%);

  }

  .pia-bottom-nav {

    left: 50%;

    right: auto;

    width: 430px;

    transform: translateX(-50%);

  }

}
</style>
