<template>
<div class="inicio-cliente">

  <!-- =====================================================
         BANNER DE PÍA
    ====================================================== -->

  <section class="pia-welcome">

    <!-- IMAGEN DE PÍA -->
    <div class="pia-character-wrapper">

      <img src="/images/pia/pia-character.png" alt="Pía" class="pia-character" />

    </div>

    <!-- TEXTO -->
    <div class="pia-welcome-text">

      <h1 class="text-capitalize">
        ¡Hola, {{nombreCliente.alias}}! 👋
      </h1>

      <p>
        Estas son tus opciones
        <br />
        como cliente.
      </p>

    </div>

  </section>

  <!-- =====================================================
         OPCIONES PRINCIPALES
    ====================================================== -->

  <section class="cliente-options">

    <!-- MIS RESERVAS -->
    <button class="option-card" @click="irA('/cliente/reservas')">

      <div class="option-icon reservas">

        <v-icon size="25">
          mdi-calendar-check-outline
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Mis reservas
        </h2>

        <p>
          Gestiona y consulta
          <br />
          tus reservas
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- HISTORIAL DE SERVICIOS -->
    <button class="option-card" @click="irA('/cliente/historial/reservas')">

      <div class="option-icon historial">

        <v-icon size="25">
          mdi-briefcase-clock
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Mi Historial
        </h2>

        <p>
          Revisa los servicios
          <br />
          que realizaste
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- MIS PAGOS -->
    <button class="option-card" @click="irA('/cliente/pagos')">

      <div class="option-icon pagos">

        <v-icon size="25">
          mdi-credit-card-outline
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Mis pagos
        </h2>

        <p>
          Consulta tus pagos
          <br />
          y comprobantes
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- MIS PROMOCIONES -->
    <button class="option-card" @click="irA('/cliente/promociones')">

      <div class="option-icon promociones">

        <v-icon size="25">
          mdi-percent-outline
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Mis promociones
        </h2>

        <p>
          Tus descuentos
          <br />
          y ofertas
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- MIS FAVORITOS -->
    <button class="option-card" @click="irA('/cliente/favoritos')">

      <div class="option-icon favoritos">

        <v-icon size="25">
          mdi-heart-outline
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Mis favoritos
        </h2>

        <p>
          Negocios y profesionales
          <br />
          guardados
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- NOTIFICACIONES -->
    <button class="option-card" @click="irA('/cliente/notificaciones')">

      <div class="option-icon notificaciones">

        <v-icon size="25">
          mdi-bell-outline
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Notificaciones
        </h2>

        <p>
          Avisos, recordatorios
          <br />
          y novedades
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- EDITAR PERFIL -->
    <button class="option-card" @click="irA('/cliente/perfil')">

      <div class="option-icon perfil">

        <v-icon size="25">
          mdi-account-edit-outline
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Editar Perfil
        </h2>

        <p>
          Actualiza tu Informacion
          <br />
          personal
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

    <!-- AYUDA/SOPORTE -->
    <button class="option-card" @click="irA('/cliente/soporte')">

      <div class="support-icon notificaciones">

        <v-icon size="25">
          mdi-lifebuoy
        </v-icon>

      </div>

      <div class="option-content">

        <h2>
          Ayuda y soporte
        </h2>

        <p>
          Resuelve tus dudas o
          <br />
          contáctanos
        </p>

      </div>

      <v-icon class="option-arrow">
        mdi-chevron-right
      </v-icon>

    </button>

  </section>
  
  <!-- ESPACIO PARA LA NAVEGACIÓN INFERIOR -->
  <div class="bottom-space"></div>

</div>
</template>

<script>
export default {
  
  name: "InicioClientePage",
  data(){
    return{
    }
  },

  computed: {
    nombreCliente() {
      try {
        const cliente = JSON.parse(
          localStorage.getItem("cliente") || "null"
        );

        return cliente || {
          alias: "Cliente"
        };
      } catch (error) {
        return {
          alias: "Cliente"
        };
      }
    }
  },

  methods: {

    irA(ruta) {

      this.$router.push(ruta);

    },

    logout() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem("cliente_token");
      localStorage.removeItem("cliente");
    },

  },

};
</script>

<style scoped>

/* =========================================================
   CONTENEDOR GENERAL
========================================================= */

.inicio-cliente {

  font-family: "Nunito", sans-serif;

  --pia-primary: #008f9b;
  --pia-primary-dark: #006d82;

  --pia-text: #102653;
  --pia-text-secondary: #49658e;

  --pia-background: #ffffff;
  --pia-card: #ffffff;

  --pia-border: #e8f0f4;

  width: 100%;

  min-height: 100vh;

  background: #ffffff;

  padding: 10px 12px 0;

  box-sizing: border-box;

}

/* =========================================================
   BANNER PÍA
========================================================= */

.pia-welcome {

  position: relative;

  display: flex;

  align-items: center;

  overflow: hidden;

  min-height: 165px;

  margin-bottom: 12px;

  border-radius: 20px;

  background: linear-gradient(110deg,
      #dff8f8 0%,
      #e9fbfb 100%);

}

.pia-character-wrapper {

  position: absolute;

  left: 0;

  bottom: 0;

  width: 49%;

  height: 100%;

  display: flex;

  align-items: flex-end;

  justify-content: center;

}

.pia-character {

  width: 100%;

  height: 100%;

  object-fit: contain;

  object-position: center bottom;

}

.pia-welcome-text {

  position: relative;

  z-index: 2;

  width: 54%;

  margin-left: 44%;

  padding: 15px 12px 15px 4px;

  box-sizing: border-box;

}

.pia-welcome-text h1 {

  margin: 0;

  color: #102653;

  font-size: 19px;

  line-height: 1.15;

  font-weight: 800;

  letter-spacing: -0.3px;

}

.pia-welcome-text p {

  margin: 6px 0 0;

  color: #1a345f;

  font-size: 13px;

  line-height: 1.3;

  font-weight: 500;

}

/* =========================================================
   GRID PRINCIPAL
========================================================= */

.cliente-options {

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 11px;

}

/* =========================================================
   TARJETAS PRINCIPALES
========================================================= */

.option-card {

  position: relative;

  min-height: 140px;

  padding: 10px;

  border: 1px solid #edf3f6;

  border-radius: 17px;

  background: #ffffff;

  text-align: left;

  box-shadow:
    0 4px 14px rgba(20, 65, 110, 0.05);

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}

.option-card:active {

  transform: scale(0.98);

  box-shadow:
    0 2px 8px rgba(20, 65, 110, 0.05);

}

/* =========================================================
   ICONOS PRINCIPALES
========================================================= */

.option-icon {

  width: 46px;

  height: 46px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 8px;

  border-radius: 13px;

}

/* RESERVAS */

.option-icon.reservas {

  background: #e2f8fc;

  color: #0094a7;

}

/* HISTORIAL */

.option-icon.historial {

  background: #eaf3ff;

  color: #1265dc;

}

/* PAGOS */

.option-icon.pagos {

  background: #dcf9e8;

  color: #10a957;

}

/* PROMOCIONES */

.option-icon.promociones {

  background: #ffe5ec;

  color: #c99c0b;

}

/* FAVORITOS */

.option-icon.favoritos {

  background: #ffe5ee;

  color: #f0184f;

}

/* NOTIFICACIONES */
.option-icon.notificaciones {

  background: #eee8ff;

  color: #6936e8;

}

/* PERFIL */
.option-icon.perfil {

  background: #eee8ff;

  color: #f86611;
}

/* =========================================================
   TEXTO TARJETAS
========================================================= */

.option-content {

  padding-right: 8px;

}

.option-content h2 {

  margin: 0;

  color: var(--pia-text);

  font-family: "Nunito", sans-serif;

  font-size: 14px;

  line-height: 1.15;

  font-weight: 800;

  letter-spacing: -0.15px;

}

.option-content p {

  margin: 4px 0 0;

  color: var(--pia-text-secondary);

  font-family: "Nunito", sans-serif;

  font-size: 10px;

  line-height: 1.25;

  font-weight: 500;

}

/* =========================================================
   FLECHA
========================================================= */

.option-arrow {

  position: absolute;

  right: 7px;

  top: 50%;

  transform: translateY(-50%);

  color: #315684;

  opacity: 0.9;

  font-size: 20px !important;

}

/* =========================================================
   OPCIONES SECUNDARIAS
========================================================= */

.secondary-options {

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 8px;

  margin-top: 9px;

}

.secondary-card {

  position: relative;

  min-height: 68px;

  display: flex;

  align-items: center;

  padding: 7px;

  border: 1px solid #edf3f6;

  border-radius: 15px;

  background: #ffffff;

  text-align: left;

  box-shadow:
    0 3px 10px rgba(20, 65, 110, 0.04);

  cursor: pointer;

}

.secondary-card:active {

  transform: scale(0.98);

}

/* =========================================================
   ICONOS SECUNDARIOS
========================================================= */

.secondary-icon {

  width: 40px;

  height: 40px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-right: 6px;

  border-radius: 12px;

}

.secondary-icon.editar {

  background: #fff0dc;

  color: #ee7c08;

}

.secondary-icon.configuracion {

  background: #e8f1ff;

  color: #2862a8;

}

/* =========================================================
   TEXTO SECUNDARIO
========================================================= */

.secondary-content {

  min-width: 0;

  padding-right: 12px;

}

.secondary-content h2 {

  margin: 0;

  color: var(--pia-text);

  font-family: "Nunito", sans-serif;

  font-size: 11px;

  line-height: 1.1;

  font-weight: 800;

}

.secondary-content p {

  margin: 3px 0 0;

  color: var(--pia-text-secondary);

  font-size: 8px;

  line-height: 1.2;

  font-weight: 500;

}

.secondary-arrow {

  position: absolute;

  right: 4px;

  top: 50%;

  transform: translateY(-50%);

  color: #315684;

  font-size: 18px !important;

}

/* =========================================================
   AYUDA Y SOPORTE
========================================================= */

.support-card {

  position: relative;

  width: 100%;

  min-height: 60px;

  display: flex;

  align-items: center;

  margin-top: 8px;

  padding: 7px 9px;

  border: 1px solid #edf3f6;

  border-radius: 15px;

  background: #ffffff;

  text-align: left;

  box-shadow:
    0 3px 10px rgba(20, 65, 110, 0.04);

  cursor: pointer;

}

.support-card:active {

  transform: scale(0.98);

}

.support-icon {

  width: 40px;

  height: 40px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-right: 8px;

  border-radius: 12px;

  background: #edf2f7;

  color: #31506f;

}

.support-content {

  padding-right: 25px;

}

.support-content h2 {

  margin: 0;

  color: var(--pia-text);

  font-family: "Nunito", sans-serif;

  font-size: 12px;

  line-height: 1.1;

  font-weight: 800;

}

.support-content p {

  margin: 2px 0 0;

  color: var(--pia-text-secondary);

  font-size: 8px;

  line-height: 1.2;

}

.support-arrow {

  position: absolute;

  right: 10px;

  top: 50%;

  transform: translateY(-50%);

  color: #315684;

  font-size: 18px !important;

}

/* =========================================================
   ESPACIO PARA BOTTOM NAV
========================================================= */

.bottom-space {

  height: 82px;

}

/* =========================================================
   PANTALLAS PEQUEÑAS
========================================================= */

@media (max-width: 360px) {

  .inicio-cliente {

    padding-left: 9px;

    padding-right: 9px;

  }

  .pia-welcome {

    min-height: 160px;

  }

  .pia-welcome-text h1 {

    font-size: 18px;

  }

  .pia-welcome-text p {

    font-size: 12px;

  }

  .option-card {

    min-height: 136px;

    padding: 9px;

  }

  .option-icon {

    width: 44px;

    height: 44px;

  }

  .option-content h2 {

    font-size: 13px;

  }

  .option-content p {

    font-size: 9px;

  }

}

/* =========================================================
   EXPERIENCIA MOBILE
========================================================= */

@media (min-width: 768px) {

  .inicio-cliente {

    max-width: 430px;

    margin: 0 auto;

  }

}
</style>
