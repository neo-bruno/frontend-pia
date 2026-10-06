<template>
<div class="negocio-page">

  <!-- Encabezado -->
  <div class="page-header">
    <h1>Negocio</h1>

    <p>
      Gestiona la información de tu negocio.
    </p>
  </div>

  <!-- Opciones -->
  <div class="opciones-negocio">

    <!-- Datos del negocio -->
    <v-card class="opcion-card" elevation="0" rounded="lg" @click="irA('negocio-datos')">
      <div class="icon-container">
        <v-icon size="24">
          mdi-store-outline
        </v-icon>
      </div>

      <div class="opcion-contenido">
        <div class="opcion-titulo">
          Datos del negocio
        </div>

        <div class="opcion-descripcion">
          Información general, contacto,
          ubicación, imágenes, etc.
        </div>
      </div>

      <v-icon class="flecha">
        mdi-chevron-right
      </v-icon>
    </v-card>

    <!-- Horarios -->
    <v-card class="opcion-card" elevation="0" rounded="lg" @click="irA('negocio-horarios')">
      <div class="icon-container">
        <v-icon size="24">
          mdi-clock-outline
        </v-icon>
      </div>

      <div class="opcion-contenido">
        <div class="opcion-titulo">
          Horarios Negocio
        </div>

        <div class="opcion-descripcion">
          Configura los días y horarios
          de atención.
        </div>
      </div>

      <v-icon class="flecha">
        mdi-chevron-right
      </v-icon>
    </v-card>

    <!-- Profesionales -->
    <v-card class="opcion-card" elevation="0" rounded="lg" @click="irA('negocio-profesionales')">
      <div class="icon-container">
        <v-icon size="24">
          mdi-account-group-outline
        </v-icon>
      </div>

      <div class="opcion-contenido">
        <div class="opcion-titulo">
          Asignar Profesional
        </div>

        <div class="opcion-descripcion">
          Gestiona tu equipo de trabajo.
        </div>
      </div>

      <v-icon class="flecha">
        mdi-chevron-right
      </v-icon>
    </v-card>

    <!-- Página del negocio -->
    <v-card class="opcion-card" elevation="0" rounded="lg" @click="irA('/admin/negocio/pagina')">
      <div class="icon-container">
        <v-icon size="24">
          mdi-pencil-outline
        </v-icon>
      </div>

      <div class="opcion-contenido">
        <div class="opcion-titulo">
          Página negocio
        </div>

        <div class="opcion-descripcion">
          Configura cómo se mostrará
          tu negocio en PIA.
        </div>
      </div>

      <v-icon class="flecha">
        mdi-chevron-right
      </v-icon>
    </v-card>

    <!-- Fotos -->
    <v-card class="opcion-card" elevation="0" rounded="lg" @click="irA('/admin/negocio/fotos')">
      <div class="icon-container">
        <v-icon size="24">
          mdi-image-outline
        </v-icon>
      </div>

      <div class="opcion-contenido">
        <div class="opcion-titulo">
          Fotos
        </div>

        <div class="opcion-descripcion">
          Imágenes del negocio.
        </div>
      </div>

      <v-icon class="flecha">
        mdi-chevron-right
      </v-icon>
    </v-card>

    <!-- Videos -->
    <v-card class="opcion-card" elevation="0" rounded="lg" @click="irA('/admin/negocio/videos')">
      <div class="icon-container">
        <v-icon size="24">
          mdi-video-outline
        </v-icon>
      </div>

      <div class="opcion-contenido">
        <div class="opcion-titulo">
          Videos
        </div>

        <div class="opcion-descripcion">
          Videos del negocio.
        </div>
      </div>

      <v-icon class="flecha">
        mdi-chevron-right
      </v-icon>
    </v-card>

  </div>

</div>
</template>

<script>
export default {

  name: 'NegocioAdminPage',

  methods: {

    irA(nombre_ruta) {
      this.$router.push({name: nombre_ruta})
    },

  },

}
</script>

<style lang="scss" scoped>
.negocio-page {
  padding: 20px 16px 90px;
  max-width: 700px;
  margin: 0 auto;
}

/* ==============================
   ENCABEZADO
================================ */

.page-header {
  margin-bottom: 20px;

  h1 {
    margin: 0;

    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;

    color: #17324d;
    text-transform: none;
  }

  p {
    margin: 5px 0 0;

    font-size: 14px;
    line-height: 1.4;

    color: #6b86a3;
  }
}

/* ==============================
   OPCIONES
================================ */

.opciones-negocio {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ==============================
   TARJETA
================================ */

.opcion-card {
  min-height: 72px;

  display: flex;
  align-items: center;

  padding: 10px 12px;

  border: 1px solid #e2edf3;

  background: #ffffff;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.opcion-card:hover {
  background-color: #f8fcfd;
  border-color: #b9e2e4;

  transform: translateY(-1px);
}

.opcion-card:active {
  transform: scale(0.99);
}

/* ==============================
   ICONO
================================ */

.icon-container {
  width: 48px;
  height: 48px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 12px;

  border-radius: 10px;

  background: #f0f8fa;

  color: #0b9da3;
}

/* ==============================
   CONTENIDO
================================ */

.opcion-contenido {
  flex: 1;

  min-width: 0;
}

.opcion-titulo {
  font-size: 14px;
  font-weight: 700;

  color: #17324d;

  margin-bottom: 3px;
}

.opcion-descripcion {
  font-size: 12px;
  line-height: 1.35;

  color: #6b86a3;

  max-width: 280px;
}

/* ==============================
   FLECHA
================================ */

.flecha {
  flex-shrink: 0;

  color: #6b86a3;

  margin-left: 8px;
}

/* ==============================
   MOBILE
================================ */

@media (max-width: 480px) {

  .negocio-page {
    padding: 18px 16px 90px;
  }

  .page-header {
    margin-bottom: 18px;
  }

  .page-header h1 {
    font-size: 23px;
  }

  .opcion-card {
    min-height: 70px;
  }

  .icon-container {
    width: 44px;
    height: 44px;
    margin-right: 11px;
  }

  .opcion-descripcion {
    max-width: 230px;
  }

}
</style>
