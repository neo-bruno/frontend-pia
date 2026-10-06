<template>
<div class="pia-page">

  <!-- =====================================================
         HEADER
         ===================================================== -->
  <header class="pia-header">
    <div class="pia-brand">
      <div class="pia-logo">PIA</div>

      <div class="pia-tagline">
        TU ASISTENTE PERSONAL
        <br />
        DE BELLEZA Y BIENESTAR
      </div>
    </div>

    <div class="pia-header-actions">
      <!-- CLIENTE -->
      <v-btn class="header-action cliente" icon="mdi-account" @click="irLoginCliente" />

      <!-- ADMIN -->
      <v-btn class="header-action admin" icon="mdi-account-tie" @click="irLoginAdmin" />

      <!-- REGISTRAR -->
      <v-btn class="header-action registrar" icon="mdi-store" @click="registrar" />
    </div>
  </header>

  <!-- =====================================================
         ASISTENTE PIA
         NO TOCAR
         ===================================================== -->
  <section class="pia-assistant">

    <div class="assistant-main">

      <div class="assistant-welcome">
        <v-row align="center" no-gutters>

          <v-col cols="5" class="pia-column">
            <v-img
              src="/images/pia/pia-character.png"
              width="125"
              height="165"
              contain
              class="pia-character"
            />
          </v-col>

          <v-col cols="7">
            <div class="assistant-content">
              <h1 class="assistant-title">
                ¡Hola! Soy Pía <v-icon color="primary" size="20">mdi-heart</v-icon>                
              </h1>

              <p class="assistant-subtitle">
                Tu asistente personal
              </p>

              <p class="assistant-question">
                ¿Qué estás buscando hoy?
              </p>
            </div>
          </v-col>

        </v-row>
      </div>

      <div class="assistant-search-area">

        <v-text-field v-model="textoBusqueda" class="pia-textfield" placeholder="Pregúntale a Pía lo que necesitas..." variant="outlined" hide-details rounded="pill" @keyup.enter="abrirAsistente">
          <template #append-inner>
            <span class="search-mic" @click.stop="abrirAsistente">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
                <path d="M9 21h6" />
              </svg>
            </span>
          </template>
        </v-text-field>

        <div class="assistant-suggestions">
          <button type="button" @click="usarSugerencia('Quiero cortarme el cabello')">
            Quiero cortarme el cabello
          </button>

          <button type="button" @click="usarSugerencia('Buscar peluquerías cerca de mí')">
            Buscar peluquerías cerca de mí
          </button>

          <button type="button" @click="usarSugerencia('Reservar con Roli')">
            Reservar con Roli
          </button>
        </div>

      </div>
    </div>

    <div class="assistant-footer">

      <div class="assistant-info">
        <span class="assistant-sparkles">✦</span>

        <p>
          Pía entiende lo que necesitas:
          servicios, profesionales,
          disponibilidad, ubicación y más.
        </p>
      </div>

      <button type="button" class="assistant-help" @click="abrirAsistente">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5h14v10H9l-4 4V5z" />
          <path d="M9 9h6" />
          <path d="M9 12h4" />
        </svg>

        <span>¿Cómo usar Pía?</span>
      </button>

    </div>
  </section>

  <!-- =====================================================
         DESTACADOS
         ===================================================== -->
  <v-container class="highlights-section px-3 px-sm-4" fluid>

    <!-- TITULO -->
    <v-row align="end" justify="space-between" class="section-heading">
      <v-col cols="8" class="pa-0">
        <div class="section-title-row">
          <span class="section-title-icon">★</span>

          <h2 class="section-title">
            Destacados
          </h2>
        </div>

        <p class="section-subtitle">
          Los mejores negocios y profesionales para ti
        </p>
      </v-col>

      <v-col cols="4" class="pa-0 text-right">
        <v-btn variant="text" class="view-all-btn" append-icon="mdi-chevron-right">
          Ver todos
        </v-btn>
      </v-col>
    </v-row>

    <!-- TABS -->
    <!-- TABS -->
    <v-tabs
      v-model="destacadosTab"
      class="featured-tabs my-3"
      color="primary"
      grow
      height="42"
      hide-slider
    >
      <v-tab value="negocios">
        <v-icon size="17" class="mr-1">
          mdi-store-outline
        </v-icon>
        Negocios
      </v-tab>

      <v-tab value="profesionales">
        <v-icon size="17" class="mr-1">
          mdi-account-tie
        </v-icon>
        Profesionales
      </v-tab>

      <v-tab value="servicios">
        <v-icon size="17" class="mr-1">
          mdi-content-cut
        </v-icon>
        Servicios
      </v-tab>
    </v-tabs>

    <!-- CONTENIDO DESTACADOS -->
    

      <!-- =================================================
        NEGOCIOS
        2 COLUMNAS EN MOBILE
      ================================================= -->
      <!-- NEGOCIOS -->
      <div
        v-show="destacadosTab === 'negocios'"
        class="featured-grid"
      >
        <TarjetaNegocio
          v-for="negocio in negociosDestacados"
          :key="negocio.id"
          :negocio="negocio"
          @click="abrirNegocio(negocio)"
          @favorito="toggleFavoritoNegocio(negocio)"
        />
      </div>

      <!-- =================================================
        PROFESIONALES
        3 COLUMNAS EN MOBILE
      ================================================= -->
      <!-- PROFESIONALES -->
      <div
        v-show="destacadosTab === 'profesionales'"
        class="professional-grid"
      >
        <TarjetaProfesional
          v-for="profesional in profesionalesDestacados"
          :key="profesional.id"
          :profesional="profesional"
          @click="abrirProfesional(profesional)"
          @favorito="toggleFavoritoProfesional(profesional)"
        />
      </div>

      <!-- =================================================
        SERVICIOS
      ================================================= -->
      <!-- SERVICIOS -->
      <div v-show="destacadosTab === 'servicios'" class="featured-grid">
        <TarjetaServicio v-for="servicio in serviciosDestacados" :key="servicio.id" :servicio="servicio"/>
      </div>    

    <!-- =================================================
           BENEFICIOS
           ================================================= -->
    <v-card class="benefits-card mt-6" elevation="0" rounded="xl">
      <v-row class="benefits-row">

        <v-col cols="6" sm="3" class="benefit-item">
          <v-icon size="28" color="primary">
            mdi-shield-check-outline
          </v-icon>

          <div>
            <div class="benefit-title">
              Negocios verificados
            </div>

            <div class="benefit-text">
              Calidad y confianza garantizada
            </div>
          </div>
        </v-col>

        <v-col cols="6" sm="3" class="benefit-item">
          <v-icon size="28" color="primary">
            mdi-calendar-check-outline
          </v-icon>

          <div>
            <div class="benefit-title">
              Reservas fáciles
            </div>

            <div class="benefit-text">
              Rápido, seguro y desde tu celular
            </div>
          </div>
        </v-col>

        <v-col cols="6" sm="3" class="benefit-item">
          <v-icon size="28" color="primary">
            mdi-bell-outline
          </v-icon>

          <div>
            <div class="benefit-title">
              Recordatorios
            </div>

            <div class="benefit-text">
              Nunca olvides tu reserva
            </div>
          </div>
        </v-col>

        <v-col cols="6" sm="3" class="benefit-item">
          <v-icon size="28" color="primary">
            mdi-message-text-outline
          </v-icon>

          <div>
            <div class="benefit-title">
              Soporte con Pía
            </div>

            <div class="benefit-text">
              Siempre estoy para ayudarte
            </div>
          </div>
        </v-col>

      </v-row>
    </v-card>

  </v-container>

  <!-- =====================================================
         NAVEGACIÓN INFERIOR
         ===================================================== -->
  <v-sheet class="pia-bottom-navigation d-flex align-center justify-space-around" elevation="4">

    <v-btn value="inicio" variant="text" stacked>
      <v-icon>mdi-home</v-icon>
      <span>Inicio</span>
    </v-btn>

    <v-btn value="favoritos" variant="text" stacked>
      <v-icon>mdi-heart-outline</v-icon>
      <span>Favoritos</span>
    </v-btn>

    <v-btn value="pia" class="pia-bottom-btn" variant="text" stacked @click="abrirAsistente">
      <div class="pia-bottom-avatar">
        <v-img src="../../../../public/images/pia/pia-character.png" cover />
      </div>
    </v-btn>

    <v-btn value="reservas" variant="text" stacked>
      <v-icon>mdi-calendar-blank-outline</v-icon>
      <span>Mis reservas</span>
    </v-btn>

    <v-btn value="perfil" variant="text" stacked>
      <v-icon>mdi-account-outline</v-icon>
      <span>Perfil</span>
    </v-btn>

  </v-sheet>

</div>

<DialogoNegocioProfesional v-model="mostrarDialogoRegistro" @negocio="irARegistroNegocio" @profesional="irARegistroProfesional"/>

<DialogoVerificarCodigo v-model="mostrarDialogoVerificarCodigo" @negocio-verificado="negocioVerificado"/>

<LoginCliente v-model="dialogoLoginCliente" @login="clienteAutenticado" />

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>

</template>

<script>
import TarjetaNegocio from "../components/TarjetaNegocio.vue";
import TarjetaProfesional from "../components/TarjetaProfesional.vue";
import TarjetaServicio from "../components/TarjetaServicio.vue";
import DialogoNegocioProfesional from "../components/DialogoNegocioProfesional.vue";
import DialogoVerificarCodigo from "../components/DialogoVerificarCodigo.vue";
import { getProfessionals } from "../modules/profesional/services/profesional.api.js";

import LoginCliente from "../modules/cliente/components/LoginCliente.vue";

export default {
  name: "InicioPublicoPage",

  components: {
    TarjetaNegocio,
    TarjetaProfesional,
    TarjetaServicio,
    DialogoNegocioProfesional,
    DialogoVerificarCodigo,

    LoginCliente,
  },

  data() {
    return {
      textoBusqueda: "",

      destacadosTab: "negocios",
      scrollDestacados: 0,
      scrollAntesDeCambiar: 0,

      negociosDestacados: [{
          id: 1,
          posicion: 1,
          nombre: "Salón Glamour",
          rating: "4.9",
          reseñas: 128,
          precio: "$",
          ubicacion: "Cercado, Cochabamba",
          verificado: true,
          favorito: false,
          imagen: "/images/demo/salon-1.jpg",
        },
        {
          id: 2,
          posicion: 2,
          nombre: "Barbería Élite",
          rating: "4.8",
          reseñas: 96,
          precio: "$",
          ubicacion: "Quillacollo",
          verificado: true,
          favorito: false,
          imagen: "/images/demo/salon-2.jpg",
        },
        {
          id: 3,
          posicion: 3,
          nombre: "Belleza Total",
          rating: "4.7",
          reseñas: 85,
          precio: "$",
          ubicacion: "Sacaba",
          verificado: true,
          favorito: false,
          imagen: "/images/demo/salon-3.jpg",
        },
        {
          id: 4,
          posicion: 4,
          nombre: "Studio Bella",
          rating: "4.7",
          reseñas: 74,
          precio: "$",
          ubicacion: "Cercado, Cochabamba",
          verificado: true,
          favorito: false,
          imagen: "/images/demo/salon-1.jpg",
        },
      ],

      profesionalesDestacados: [{
          id: 1,
          posicion: 1,
          nombre: "Roli",
          profesion: "Barbero Profesional",
          rating: "4.9",
          reseñas: 120,
          precio: "$",
          favorito: false,
          imagen: "/images/demo/roli.jpg",
        },
        {
          id: 2,
          posicion: 2,
          nombre: "María",
          profesion: "Estilista",
          rating: "4.8",
          reseñas: 98,
          precio: "$",
          favorito: false,
          imagen: "/images/demo/maria.jpg",
        },
        {
          id: 3,
          posicion: 3,
          nombre: "Carlos",
          profesion: "Colorista",
          rating: "4.7",
          reseñas: 76,
          precio: "$",
          favorito: false,
          imagen: "/images/demo/carlos.jpg",
        },
        {
          id: 4,
          posicion: 4,
          nombre: "Andrea",
          profesion: "Manicurista",
          rating: "4.7",
          reseñas: 65,
          precio: "$",
          favorito: false,
          imagen: "/images/demo/andrea.jpg",
        },
        {
          id: 5,
          posicion: 5,
          nombre: "Sofía",
          profesion: "Maquillista",
          rating: "4.8",
          reseñas: 82,
          precio: "$",
          favorito: false,
          imagen: "/images/demo/maria.jpg",
        },
        {
          id: 6,
          posicion: 6,
          nombre: "Diego",
          profesion: "Barbero",
          rating: "4.7",
          reseñas: 69,
          precio: "$",
          favorito: false,
          imagen: "/images/demo/roli.jpg",
        },
      ],

      serviciosDestacados: [{
          id: 1,
          nombre: "Corte de cabello",
          negocio: "Salón Glamour",
          precio: 35,
          imagen: "/images/demo/salon-1.jpg",
        },
        {
          id: 2,
          nombre: "Corte + barba",
          negocio: "Barbería Élite",
          precio: 50,
          imagen: "/images/demo/salon-2.jpg",
        },
        {
          id: 3,
          nombre: "Coloración",
          negocio: "Belleza Total",
          precio: 120,
          imagen: "/images/demo/salon-3.jpg",
        },
        {
          id: 4,
          nombre: "Manicure",
          negocio: "Studio Bella",
          precio: 45,
          imagen: "/images/demo/salon-1.jpg",
        },
      ],
      
      // DIALOGO PARA REGISTRAR NEGOCIO O PROFESIONAL
      mostrarDialogoRegistro: false,
      mostrarDialogoVerificarCodigo: false,

      dialogoLoginCliente: false,

      overlay: false,
    };
  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {   

    clienteAutenticado(){
      this.$router.push({name: 'cliente'})
    },
    irLoginCliente() {
      const cliente = localStorage.getItem('cliente')
      if(cliente){
        this.$router.push({name: 'cliente'})
      }else
        this.dialogoLoginCliente = true
    },

    irLoginAdmin() {
      this.$router.push("/login");
    },

    registrar() {
      this.mostrarDialogoRegistro = true;
      console.log("Registrar negocio/profesional");
    },
    irARegistroNegocio(){
      this.overlay = false      
      this.$router.push({name: 'registro-negocio'})
      this.overlay = true
    },
    irARegistroProfesional(){
      console.log('entre a la verificacion de codigo: ')
      this.mostrarDialogoVerificarCodigo = true
    },

    negocioVerificado(negocio) {
      this.overlay = false;

      this.$router.push({
        name: "registro-profesional",
        query: {
          negocio_id: negocio.id,
          negocio_nombre: negocio.nombre,
          negocio_codigo: negocio.codigo,
        },
      });

      this.overlay = true;
    },

    abrirAsistente() {
      console.log("Abrir asistente Pía");
    },

    usarSugerencia(texto) {
      this.textoBusqueda = texto;
      this.abrirAsistente();
    },

    abrirNegocio(negocio) {
      console.log("Abrir negocio:", negocio);
    },
    
    abrirProfesional(profesional) {
      this.$router.push({
        name: 'perfil-profesional',
        params: {
          slug: profesional.slug
        }
      })
    },

    toggleFavoritoNegocio(negocio) {
      negocio.favorito = !negocio.favorito;
    },

    toggleFavoritoProfesional(profesional) {
      profesional.favorito = !profesional.favorito;
    },

    async obtenerProfesionales(){
      try {
        this.overlay = true

        const res = await getProfessionals()
        if (res.data.ok) {
          console.log('OBTENER PROFESIONALES: ', res.data.data)
          this.profesionalesDestacados = res.data.data
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,          
        })
      } finally {
        this.overlay = false
      }
    },

  },
  mounted(){
    this.obtenerProfesionales()
  }
};
</script>

<style scoped >
/* =========================
   PÁGINA
   ========================= */

.pia-page {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 80px;
  background: #ffffff;
  color: #10233f;
  box-sizing: border-box;
}


/* =========================
   HEADER
   ========================= */

.pia-header {
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 11px;
  background: #ffffff;
  box-sizing: border-box;
}

.pia-brand {
  display: flex;
  flex-direction: column;
}

.pia-logo {
  color: #087f7d;
  font-size: 28px;
  line-height: 28px;
  font-weight: 800;
  letter-spacing: -1.5px;
}

.pia-tagline {
  margin-top: 2px;
  color: #24364b;
  font-size: 6.5px;
  line-height: 6px;
  font-weight: 600;
}

.pia-header-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.header-action {
  width: 37px;
  height: 37px;
  padding: 0;
  border: 1px solid #d7e7e7;
  border-radius: 11px;
  background: #ffffff;
  color: #087f7d;
}

.header-action:active {
  transform: scale(0.94);
}

.header-action.admin {
  background: #087f7d;
  border-color: #087f7d;
  color: #ffffff;
}


/* =========================
   ASISTENTE PIA
   ========================= */

.pia-assistant {
  width: calc(100% - 16px);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #d5eeee;
  border-radius: 20px;
  background: #eefafa;
  box-shadow: 0 8px 25px rgba(8, 127, 125, 0.08);
}

.assistant-main {
  width: 100%;
  padding: 3px 10px 11px;
  box-sizing: border-box;
}

.assistant-welcome {
  min-height: 165px;
}

.pia-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pia-character {
  margin-left: -5px;
}

.assistant-content {
  padding-left: 2px;
}

.assistant-title {
  margin: 0;
  color: #10233f;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 800;
}

.assistant-heart {
  color: #0f8f8c;
  font-size: 25px;
}

.assistant-subtitle {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 12px;
}

.assistant-question {
  margin: 5px 0 0;
  color: #10233f;
  font-size: 13px;
  font-weight: 700;
}

.assistant-search-area {
  width: 100%;
}

.pia-textfield {
  width: 100%;
}

.pia-textfield :deep(.v-field) {
  min-height: 50px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 5px 16px rgba(15, 23, 42, 0.08);
}

.pia-textfield :deep(.v-field__outline) {
  --v-field-border-width: 1px;
  color: #dce5e8;
}

.pia-textfield :deep(.v-field__input) {
  min-height: 50px;
  padding-top: 0;
  padding-bottom: 0;
  color: #10233f;
  font-size: 12px;
}

.pia-textfield :deep(input::placeholder) {
  color: #8a98a8;
  opacity: 1;
}

.search-mic {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #0b9d98;
  color: #ffffff;
  cursor: pointer;
}

.search-mic svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.assistant-suggestions {
  width: 100%;
  display: flex;
  gap: 9px;
  margin-top: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.assistant-suggestions::-webkit-scrollbar {
  display: none;
}

.assistant-suggestions button {
  flex: 0 0 auto;
  margin-right: 10px;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: #087f7d;
  font-size: 9px;
  font-weight: 600;
  line-height: 15px;
  white-space: nowrap;
  cursor: pointer;
}

.assistant-footer {
  width: 100%;
  min-height: 59px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  background: #ffffff;
  border-top: 1px solid #dceeee;
  box-sizing: border-box;
}

.assistant-info {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  min-width: 0;
}

.assistant-sparkles {
  flex-shrink: 0;
  color: #0f9d94;
  font-size: 20px;
  line-height: 1;
}

.assistant-info p {
  margin: 0;
  color: #42566a;
  font-size: 9px;
  line-height: 12px;
}

.assistant-help {
  flex-shrink: 0;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 8px;
  border: 0;
  border-radius: 20px;
  background: #edf9f8;
  color: #087f7d;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

.assistant-help svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}


/* =========================
   DESTACADOS
   ========================= */

.highlights-section {
  margin-top: 24px;
  padding-bottom: 20px;
}

.section-heading {
  margin: 0;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.section-title-icon {
  color: #f4a62a;
  font-size: 22px;
  line-height: 1;
}

.section-title {
  margin: 0;
  color: #10233f;
  font-size: 21px;
  line-height: 25px;
  font-weight: 800;
}

.section-subtitle {
  margin: 3px 0 0 2px;
  color: #637589;
  font-size: 11px;
  line-height: 14px;
}

.view-all-btn {
  min-width: auto !important;
  height: 30px !important;
  padding: 0 !important;
  color: #087f7d !important;
  font-size: 11px;
  font-weight: 700;
  text-transform: none;
}


/* =========================
   TABS
   ========================= */

.featured-tabs {
  width: 100%;
  overflow: hidden;
  border-radius: 14px;
  background: #f4f7f8;
}

.featured-tabs :deep(.v-slide-group__content) {
  width: 100%;
}

.featured-tabs :deep(.v-tab) {
  min-width: 0;
  flex: 1;
  padding: 0 5px;
  border-radius: 14px;
  color: #24364b;
  font-size: 11px;
  font-weight: 700;
  text-transform: none;
}

.featured-tabs :deep(.v-tab--selected) {
  background: #e4f5f3;
  color: #087f7d;
}


/* =========================
   BENEFICIOS
   ========================= */

.benefits-card {
  overflow: hidden;
  border: 1px solid #dceeed;
  background: #eefafa !important;
}

.benefits-row {
  margin: 0;
}

.benefit-item {
  min-height: 82px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 8px !important;
}

.benefit-title {
  color: #10233f;
  font-size: 9px;
  line-height: 12px;
  font-weight: 800;
}

.benefit-text {
  margin-top: 2px;
  color: #637589;
  font-size: 7.5px;
  line-height: 10px;
}


/* =========================
   NAVEGACIÓN INFERIOR
   ========================= */

.pia-bottom-navigation {
  position: fixed !important;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 66px;
  background: #ffffff !important;
  border-top: 1px solid #e5eaed;
  box-sizing: border-box;
}

.pia-bottom-navigation :deep(.v-btn) {
  min-width: 0;
  height: 66px;
  padding: 0 3px;
  color: #687888;
  font-size: 8px;
  text-transform: none;
}

.pia-bottom-navigation :deep(.v-btn .v-icon) {
  margin-bottom: 2px;
}

.pia-bottom-btn {
  overflow: visible !important;
}

.pia-bottom-avatar {
  position: absolute;
  top: -27px;
  width: 57px;
  height: 57px;
  overflow: hidden;
  border: 4px solid #ffffff;
  border-radius: 50%;
  background: #0b9d98;
  box-shadow: 0 3px 12px rgba(8, 127, 125, 0.25);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.professional-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}
</style>
