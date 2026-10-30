<template>
<v-app class="pia-public-app">
  <!-- ENCABEZADO PÚBLICO -->
  <header class="pia-public-header">
    <!-- LOGO -->
    <button class="pia-brand" type="button" aria-label="Ir al inicio de PIA" @click="irPrincipal">
      <span class="pia-logo">
        PIA<span class="logo-leaf">◆</span>
      </span>

      <span class="pia-tagline">
        SERVICIO<br />
        DE BELLEZA Y ESTETICA
      </span>
    </button>

    <!-- UBICACIÓN -->
    <button class="location-button" type="button" aria-label="Seleccionar ubicación" @click="hojaUbicacion = true">
      <v-icon color="#079b98" size="21">
        mdi-map-marker
      </v-icon>

      <span>
        {{
            municipioSeleccionado ||
            departamentoSeleccionado ||
            "Ubicación"
          }}
      </span>

      <v-icon size="17">mdi-chevron-down</v-icon>
    </button>

    <!-- ACCIONES DEL ENCABEZADO -->
    <div class="pia-header-actions">
      <v-btn class="header-action" icon="mdi-bell" variant="text" aria-label="Notificaciones" @click="irNotificaciones" />

      <v-btn class="header-action" icon="mdi-account-tie" variant="text" aria-label="Iniciar sesión" @click="irLoginAdmin" />

      <v-btn class="header-action registrar" icon="mdi-store" variant="text" aria-label="Registrar negocio o profesional" @click="mostrarDialogoRegistro = true" />
    </div>
  </header>

  <!-- CONTENIDO DE CADA PÁGINA PÚBLICA -->
  <v-main class="pia-public-main">
    <router-view />
  </v-main>

  <!-- NAVEGACIÓN INFERIOR -->
  <v-bottom-navigation v-model="activeNav" class="pia-bottom-nav" grow elevation="8" height="72">
    <v-btn value="inicio" class="pia-nav-btn" aria-label="Inicio" @click="irInicio">
      <v-icon size="22">mdi-home-outline</v-icon>
      <span>Inicio</span>
    </v-btn>

    <v-btn value="favoritos" class="pia-nav-btn" aria-label="Favoritos" @click="irFavoritos">
      <v-icon size="22">mdi-heart-outline</v-icon>
      <span>Favoritos</span>
    </v-btn>

    <!-- BOTÓN CENTRAL PÍA -->
    <v-btn value="pia" class="pia-bottom-btn" variant="text" stacked aria-label="Abrir Pía" @click="abrirPia">
      <span class="pia-bottom-avatar">
        <v-img src="/images/pia/pia-character.png" alt="Pía" cover />
      </span>
    </v-btn>    

    <v-btn value="reservas" class="pia-nav-btn" aria-label="Mis reservas" @click="irReservas">
      <v-icon size="22">mdi-calendar-outline</v-icon>
      <span>Reservas</span>
    </v-btn>

    <v-btn value="perfil" class="pia-nav-btn" aria-label="Mi perfil" @click="irPerfil">
      <v-icon size="22">mdi-account-outline</v-icon>
      <span>Perfil</span>
    </v-btn>
  </v-bottom-navigation>

  <!-- SELECTOR DE UBICACIÓN -->
  <v-bottom-sheet v-model="hojaUbicacion" inset>
    <v-card class="location-sheet" rounded="t-xl">
      <div class="sheet-handle"></div>

      <div class="sheet-heading">
        <h3>
          <v-icon color="#079b98" class="mr-2">
            mdi-map-marker
          </v-icon>
          Ubicación
        </h3>

        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="hojaUbicacion = false" />
      </div>

      <button class="use-location" type="button" :disabled="detectandoUbicacion" @click="detectarUbicacion">
        <v-icon size="24">mdi-crosshairs-gps</v-icon>

        <span>
          <strong>
            {{
                detectandoUbicacion
                  ? "Detectando ubicación..."
                  : "Usar mi ubicación actual"
              }}
          </strong>

          <small>Detectar ubicación con GPS</small>
        </span>
      </button>

      <v-text-field v-model="busquedaUbicacion" placeholder="Buscar ciudad o departamento..." prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details rounded="lg" class="sheet-search" />

      <p v-if="errorUbicacion" class="location-error">
        {{ errorUbicacion }}
      </p>

      <div class="location-options">
        <button v-for="lugar in ubicacionesFiltradas" :key="lugar.departamento + lugar.municipio" type="button" @click="seleccionarUbicacion(lugar)">
          <v-icon color="#079b98">
            mdi-map-marker-outline
          </v-icon>

          <span>
            {{ lugar.municipio }}, {{ lugar.departamento }}
          </span>

          <v-icon v-if="
                lugar.departamento === departamentoSeleccionado &&
                lugar.municipio === municipioSeleccionado
              " color="#079b98">
            mdi-check
          </v-icon>
        </button>
      </div>
    </v-card>
  </v-bottom-sheet>

  <!-- REGISTRO PÚBLICO -->
  <DialogoNegocioProfesional v-model="mostrarDialogoRegistro" @negocio="irARegistroNegocio" @profesional="irARegistroProfesional" />

  <DialogoVerificarCodigo v-model="mostrarDialogoVerificarCodigo" @negocio-verificado="negocioVerificado" />

  <!-- ACCESO DEL CLIENTE -->
  <LoginCliente v-model="dialogoLoginCliente" @login="clienteAutenticado" />

  <!-- INDICADOR DE NAVEGACIÓN -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="48" indeterminate />
  </v-overlay>
</v-app>
</template>

<script>
import { municipiosPorDepartamento } from "@/modules/admin/modules/negocio/data/municipiosBolivia.js";
import DialogoNegocioProfesional from "@/modules/publico/components/DialogoNegocioProfesional.vue";
import DialogoVerificarCodigo from "@/modules/publico/components/DialogoVerificarCodigo.vue";
import LoginCliente from "@/modules/publico/modules/cliente/components/LoginCliente.vue";

export default {
  name: "PublicoLayout",

  components: {
    DialogoNegocioProfesional,
    DialogoVerificarCodigo,
    LoginCliente,
  },

  data() {
    return {
      activeNav: "inicio",

      hojaUbicacion: false,
      busquedaUbicacion: "",

      departamentoSeleccionado: "",
      municipioSeleccionado: "",

      municipiosPorDepartamento,

      detectandoUbicacion: false,
      errorUbicacion: "",

      mostrarDialogoRegistro: false,
      mostrarDialogoVerificarCodigo: false,
      dialogoLoginCliente: false,

      overlay: false,
    };
  },

  computed: {
    ubicacionesFiltradas() {
      const texto = this.busquedaUbicacion
        .trim()
        .toLocaleLowerCase("es");

      return Object.entries(this.municipiosPorDepartamento)
        .flatMap(([departamento, municipios]) =>
          municipios.map((municipio) => ({
            departamento,
            municipio,
          }))
        )
        .filter((lugar) => {
          if (!texto) return true;

          return `${lugar.departamento} ${lugar.municipio}`
            .toLocaleLowerCase("es")
            .includes(texto);
        });
    },
  },

  watch: {
    "$route.path": {
      immediate: true,

      handler(ruta) {
        if (
          ruta === "/" ||
          ruta === "/inicio"
        ) {
          this.activeNav = "inicio";
        } else if (ruta.includes("/favoritos")) {
          this.activeNav = "favoritos";
        } else if (ruta.includes("/reservas")) {
          this.activeNav = "reservas";
        } else if (ruta.includes("/perfil")) {
          this.activeNav = "perfil";
        } else {
          this.activeNav = "";
        }
      },
    },
  },

  methods: {
    irPrincipal() {
      this.$router.push("/").catch(() => {});
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    irA(ruta) {
      this.$router.push(ruta).catch(() => {});
    },

    irLoginAdmin() {
      this.$router.push("/login").catch(() => {});
    },

    abrirPia() {
      this.$router.push("/").catch(() => {});
    },

    irInicio() {
      if (localStorage.getItem("cliente_token")) {
        this.irA("/cliente");
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irNotificaciones(){
      if (localStorage.getItem("cliente_token")) {
        this.irA("/cliente/notificaciones");
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irFavoritos() {
      if (localStorage.getItem("cliente_token")) {
        this.irA("/cliente/favoritos");
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irReservas() {
      if (localStorage.getItem("cliente_token")) {
        this.irA("/cliente/reservas");
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    irPerfil() {
      if (localStorage.getItem("cliente_token")) {
        this.irA("/cliente/perfil");
      } else {
        this.dialogoLoginCliente = true;
      }
    },

    seleccionarUbicacion(lugar) {
      this.departamentoSeleccionado = lugar.departamento;
      this.municipioSeleccionado = lugar.municipio;
      this.hojaUbicacion = false;
      this.errorUbicacion = "";

      // Guardar la selección para reutilizarla en las páginas públicas.
      localStorage.setItem(
        "pia_ubicacion_publica",
        JSON.stringify({
          departamento: lugar.departamento,
          municipio: lugar.municipio,
        })
      );

      // Avisar a los componentes que necesiten actualizar sus resultados.
      window.dispatchEvent(
        new CustomEvent("pia:ubicacion-cambiada", {
          detail: {
            departamento: lugar.departamento,
            municipio: lugar.municipio,
          },
        })
      );
    },

    normalizar(texto) {
      return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .trim();
    },

    detectarUbicacion() {
      if (!navigator.geolocation) {
        this.errorUbicacion =
          "Tu navegador no admite geolocalización.";
        return;
      }

      this.detectandoUbicacion = true;
      this.errorUbicacion = "";

      navigator.geolocation.getCurrentPosition(
        async (posicion) => {
            try {
              const {
                latitude,
                longitude
              } = posicion.coords;

              const respuesta = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=es`
              );

              if (!respuesta.ok) {
                throw new Error(
                  "No se pudo identificar tu ubicación."
                );
              }

              const resultado = await respuesta.json();
              const direccion = resultado.address || {};

              const departamento =
                direccion.state ||
                direccion.province ||
                direccion.region ||
                "";

              const municipio =
                direccion.city ||
                direccion.town ||
                direccion.municipality ||
                direccion.county ||
                direccion.village ||
                "";

              const departamentoCatalogo = Object.keys(
                this.municipiosPorDepartamento
              ).find(
                (nombre) =>
                this.normalizar(nombre) ===
                this.normalizar(departamento)
              );

              if (!departamentoCatalogo) {
                throw new Error(
                  "No encontramos el departamento en el catálogo. Selecciónalo manualmente."
                );
              }

              const municipioCatalogo =
                this.municipiosPorDepartamento[
                  departamentoCatalogo
                ].find(
                  (nombre) =>
                  this.normalizar(nombre) ===
                  this.normalizar(municipio)
                );

              if (!municipioCatalogo) {
                throw new Error(
                  "No encontramos el municipio en el catálogo. Selecciónalo manualmente."
                );
              }

              this.seleccionarUbicacion({
                departamento: departamentoCatalogo,
                municipio: municipioCatalogo,
              });
            } catch (error) {
              console.error(
                "Error al detectar ubicación:",
                error
              );

              this.errorUbicacion =
                error.message ||
                "No pudimos detectar tu ubicación.";
            } finally {
              this.detectandoUbicacion = false;
            }
          },

          (error) => {
            const mensajes = {
              1: "Debes permitir el acceso a tu ubicación.",
              2: "No fue posible determinar tu ubicación.",
              3: "La solicitud tardó demasiado.",
            };

            this.errorUbicacion =
              mensajes[error.code] ||
              "No pudimos obtener tu ubicación.";

            this.detectandoUbicacion = false;
          },

          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000,
          }
      );
    },

    irARegistroNegocio() {
      this.overlay = true;

      this.$router
        .push({
          name: "registro-negocio"
        })
        .catch(() => {})
        .finally(() => {
          this.overlay = false;
        });
    },

    irARegistroProfesional() {
      this.mostrarDialogoVerificarCodigo = true;
    },

    negocioVerificado(negocio) {
      this.overlay = true;

      this.$router
        .push({
          name: "registro-profesional",
          query: {
            negocio_id: negocio.id,
            negocio_nombre: negocio.nombre,
            negocio_codigo: negocio.codigo,
          },
        })
        .catch(() => {})
        .finally(() => {
          this.overlay = false;
        });
    },

    clienteAutenticado() {
      this.dialogoLoginCliente = false;
      this.$router.push("/cliente").catch(() => {});
    },
  },

  mounted() {
    try {
      const guardada = localStorage.getItem(
        "pia_ubicacion_publica"
      );

      if (guardada) {
        const ubicacion = JSON.parse(guardada);

        this.departamentoSeleccionado =
          ubicacion.departamento || "";

        this.municipioSeleccionado =
          ubicacion.municipio || "";
      }
    } catch (error) {
      console.warn(
        "No se pudo recuperar la ubicación pública:",
        error
      );
    }
  },
};
</script>

<style scoped>
.pia-public-app {
  min-height: 100vh;
  background: #fff;
  color: #102653;
}

.pia-public-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;

  min-height: 72px;
  padding: 10px 14px;

  background: #fff;
  box-sizing: border-box;
}

.pia-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  gap: 1px;

  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.pia-logo {
  position: relative;
  color: #087f7d;
  font-size: 33px;
  line-height: 32px;
  font-weight: 900;
  letter-spacing: -2px;
}

.logo-leaf {
  position: absolute;
  top: -2px;
  right: -9px;
  color: #49bcb2;
  font-size: 10px;
  transform: rotate(-25deg);
}

.pia-tagline {
  color: #52637b;
  font-size: 7px;
  line-height: 8px;
  font-weight: 700;
}

.location-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;

  min-width: 0;
  padding: 5px 0;
  border: 0;
  background: transparent;

  color: #102653;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.location-button span {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pia-header-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 1px;
}

.header-action {
  width: 34px !important;
  height: 36px !important;
  color: #087f7d !important;
}

.header-action.registrar {
  color: #087f7d !important;
}

.pia-public-main {
  min-height: 100vh;
  padding-top: 72px;
  padding-bottom: 82px;
  background: #fff;
}

.pia-bottom-nav {
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;

  height: 72px;
  background: #fff !important;
  border-top: 1px solid #e6eeee;
  z-index: 1200;
}

.pia-nav-btn {
  min-width: 20% !important;
  color: #64748b !important;
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

.location-sheet {
  max-height: 85vh;
  overflow-y: auto;
  padding: 8px 18px max(22px, env(safe-area-inset-bottom));
}

.sheet-handle {
  width: 42px;
  height: 4px;
  margin: 2px auto 15px;
  border-radius: 5px;
  background: #aab5c0;
}

.sheet-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
}

.sheet-heading h3 {
  display: flex;
  align-items: center;
  margin: 0;
  color: #102653;
  font-size: 17px;
  font-weight: 900;
}

.use-location {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  margin-bottom: 12px;
  padding: 12px;

  border: 0;
  border-radius: 13px;
  background: #e7f8f5;
  color: #087f7d;
  text-align: left;
  cursor: pointer;
}

.use-location:disabled {
  opacity: 0.6;
  cursor: wait;
}

.use-location span {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.use-location strong {
  font-size: 12px;
}

.use-location small {
  font-size: 10px;
}

.sheet-search {
  margin-bottom: 10px;
}

.location-options {
  display: flex;
  flex-direction: column;
  max-height: 38vh;
  overflow-y: auto;
}

.location-options button {
  display: flex;
  align-items: center;
  gap: 10px;

  min-height: 43px;
  padding: 8px 4px;

  border: 0;
  border-bottom: 1px solid #edf1f3;
  background: #fff;
  color: #102653;

  text-align: left;
  font-size: 12px;
  cursor: pointer;
}

.location-options button span {
  flex: 1;
}

.location-error {
  padding: 8px;
  color: #b42318;
  font-size: 12px;
}

@media (min-width: 700px) {
  .pia-public-header {
    padding: 18px 26px;
  }

  .pia-logo {
    font-size: 42px;
  }

  .pia-tagline {
    font-size: 9px;
    line-height: 10px;
  }
}

@media (max-width: 360px) {
  .pia-public-header {
    padding-right: 9px;
    padding-left: 9px;
  }

  .pia-logo {
    font-size: 29px;
  }

  .pia-tagline {
    font-size: 6px;
  }

  .location-button {
    font-size: 10px;
  }

  .location-button span {
    max-width: 70px;
  }
}
</style>
