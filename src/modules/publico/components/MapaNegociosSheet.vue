<template>
<v-bottom-sheet :model-value="modelValue" inset scrollable @update:model-value="$emit('update:modelValue', $event)">
  <v-card class="map-sheet" rounded="t-xl">
    <div class="sheet-handle"></div>

    <header class="map-header">
      <div class="map-title">
        <v-icon color="#079b98" size="25">mdi-map-marker</v-icon>
        <div>
          <h2>Negocios en el mapa</h2>
          <p>
            {{ negociosConCoordenadas.length }}
            negocios con ubicación
          </p>
        </div>
      </div>

      <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar mapa" @click="$emit('update:modelValue', false)" />
    </header>

    <div class="map-search">
      <v-icon color="#079b98">mdi-magnify</v-icon>
      <input v-model="textoBusqueda" type="search" placeholder="Buscar un negocio..." />
      <v-btn icon="mdi-crosshairs-gps" color="primary" variant="tonal" size="small" aria-label="Usar mi ubicación" :loading="localizando" @click="centrarEnMiUbicacion" />
    </div>

    <div class="map-status" v-if="errorUbicacion">
      {{ errorUbicacion }}
    </div>

    <div ref="mapElement" class="leaflet-map"></div>

    <section class="map-results">
      <div class="results-heading">
        <strong>
          {{ negociosFiltrados.length }} negocios
        </strong>
        <span>Selecciona un local para ubicarlo</span>
      </div>

      <div v-if="!negociosFiltrados.length" class="empty-results">
        <v-icon size="30">mdi-store-search-outline</v-icon>
        <p>
          No hay negocios que coincidan con la búsqueda y tengan
          coordenadas registradas.
        </p>
      </div>

      <button v-for="negocio in negociosFiltrados" :key="negocio.id" type="button" class="business-result" :class="{ selected: negocioSeleccionado?.id === negocio.id }" @click="seleccionarNegocio(negocio)">
        <v-img :src="urlImagen(negocio)" class="business-thumb" width="58" height="58" cover>
          <template #error>
            <div class="thumb-placeholder">
              <v-icon>mdi-store</v-icon>
            </div>
          </template>
        </v-img>

        <div class="business-info">
          <strong>{{ negocio.nombre }}</strong>
          <span>
            {{ [negocio.zona, negocio.municipio, negocio.departamento]
                .filter(Boolean)
                .join(', ') || 'Ubicación no especificada' }}
          </span>
          <small>
            {{ negocio.tipo_negocio || 'Negocio de belleza' }}
          </small>
        </div>

        <v-icon color="#079b98">mdi-map-marker</v-icon>
      </button>
    </section>
  </v-card>
</v-bottom-sheet>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getFileUrl
} from "@/utils/ayuda";

export default {
  name: "MapaNegociosSheet",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    negocios: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["update:modelValue", "seleccionar"],

  data() {
    return {
      mapa: null,
      marcadores: [],
      marcadorUsuario: null,
      negocioSeleccionado: null,
      textoBusqueda: "",
      localizando: false,
      errorUbicacion: "",
    };
  },

  computed: {
    negociosConCoordenadas() {
      return this.negocios.filter((negocio) => {
        const lat = Number(negocio.latitud);
        const lng = Number(negocio.longitud);

        return (
          negocio.latitud !== null &&
          negocio.latitud !== undefined &&
          negocio.latitud !== "" &&
          negocio.longitud !== null &&
          negocio.longitud !== undefined &&
          negocio.longitud !== "" &&
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        );
      });
    },

    negociosFiltrados() {
      const texto = this.textoBusqueda.trim().toLocaleLowerCase("es");

      if (!texto) return this.negociosConCoordenadas;

      return this.negociosConCoordenadas.filter((negocio) => {
        const contenido = [
            negocio.nombre,
            negocio.tipo_negocio,
            negocio.zona,
            negocio.municipio,
            negocio.departamento,
            negocio.direccion,
          ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("es");

        return contenido.includes(texto);
      });
    },
  },

  watch: {
    modelValue(abierto) {
      if (abierto) {
        this.$nextTick(() => {
          this.inicializarMapa();

          // Recalcular después de que el sheet se haga visible.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (this.mapa) {
                this.mapa.invalidateSize({ pan: false });

                this.actualizarMarcadores();
              }
            });
          });
        });
      }
    },

    negocios: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.actualizarMarcadores();
        });
      },
    },

    negociosFiltrados() {
      this.$nextTick(() => {
        this.actualizarMarcadores();
      });
    },
  },

  mounted() {
    if (this.modelValue) {
      this.$nextTick(() => this.inicializarMapa());
    }
  },

  beforeUnmount() {
    this.destruirMapa();
  },

  methods: {
    inicializarMapa() {
      const elemento = this.$refs.mapElement;

      if (!elemento || this.mapa) {
        this.mapa?.invalidateSize();
        return;
      }

      // Centro inicial orientativo: Cochabamba.
      // No representa la ubicación exacta del usuario.
      this.mapa = L.map(elemento, {
        zoomControl: false,
        scrollWheelZoom: true,
      }).setView([-17.3935, -66.157], 12);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
          maxZoom: 19,
        },
      ).addTo(this.mapa);

      L.control.zoom({
        position: "bottomright"
      }).addTo(this.mapa);

      this.actualizarMarcadores();

      setTimeout(() => this.mapa?.invalidateSize(), 250);
    },
   
    actualizarMarcadores() {
      if (!this.mapa) return;

      this.marcadores.forEach((marcador) => marcador.remove());
      this.marcadores = [];

      this.negociosFiltrados.forEach((negocio) => {
        const lat = Number(negocio.latitud);
        const lng = Number(negocio.longitud);

        const seleccionado =
          String(this.negocioSeleccionado?.id) === String(negocio.id);

        const logo = this.urlImagen(negocio);

        const contenido = logo
          ? `<img src="${this.escaparHTML(logo)}"
                  alt=""
                  class="business-marker-image"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span class="business-marker-fallback" style="display:none">✂</span>`
          : `<span class="business-marker-fallback">✂</span>`;

        const icono = L.divIcon({
          className: "business-marker-container",
          html: `
            <div class="business-marker ${seleccionado ? "is-selected" : ""}">
              ${contenido}
            </div>
          `,
          iconSize: seleccionado ? [50, 50] : [42, 42],
          iconAnchor: seleccionado ? [25, 25] : [21, 21],
          popupAnchor: [0, -23],
        });

        const marcador = L.marker([lat, lng], {
          icon: icono,
          title: negocio.nombre || "Negocio",
          alt: negocio.nombre || "Negocio",
          keyboard: true,
          zIndexOffset: seleccionado ? 1000 : 0,
        }).addTo(this.mapa);

        marcador.bindTooltip(
          this.escaparHTML(negocio.nombre || "Negocio"),
          {
            direction: "top",
            offset: [0, -20],
          }
        );

        marcador.on("click", () => {
          this.seleccionarNegocio(negocio);
        });

        this.marcadores.push(marcador);
      });

      if (this.marcadores.length > 1) {
        const limites = L.featureGroup(this.marcadores).getBounds();

        if (limites.isValid()) {
          this.mapa.fitBounds(limites, {
            padding: [35, 35],
            maxZoom: 15,
            animate: true,
          });
        }
      } else if (this.marcadores.length === 1) {
        this.mapa.setView(
          this.marcadores[0].getLatLng(),
          15,
          { animate: true }
        );
      }
    },
        
    seleccionarNegocio(negocio) {
      this.negocioSeleccionado = negocio;

      if (this.mapa) {
        this.mapa.setView(
          [Number(negocio.latitud), Number(negocio.longitud)],
          16,
          { animate: true }
        );
      }

      this.actualizarMarcadores();

      this.$emit("seleccionar", negocio);

      if (!negocio.slug) {
        console.error(
          "No se puede abrir el perfil: el negocio no tiene slug.",
          negocio
        );
        return;
      }

      this.$router.push({
        path: `/perfil/negocio/${encodeURIComponent(negocio.slug)}`,
      }).catch((error) => {
        if (error.name !== "NavigationDuplicated") {
          console.error("Error al abrir el perfil del negocio:", error);
        }
      });
    },

    centrarEnMiUbicacion() {
      this.errorUbicacion = "";

      if (!navigator.geolocation) {
        this.errorUbicacion =
          "Tu navegador no admite la geolocalización.";
        return;
      }

      this.localizando = true;

      navigator.geolocation.getCurrentPosition(
        ({
          coords
        }) => {
          const latlng = [coords.latitude, coords.longitude];

          if (this.marcadorUsuario) {
            this.marcadorUsuario.remove();
          }

          this.marcadorUsuario = L.circleMarker(latlng, {
              radius: 9,
              color: "#ffffff",
              weight: 3,
              fillColor: "#2878e8",
              fillOpacity: 1,
            })
            .addTo(this.mapa)
            .bindTooltip("Tu ubicación");

          this.mapa.setView(latlng, 15, {
            animate: true
          });
          this.localizando = false;
        },
        (error) => {
          const mensajes = {
            1: "Permite la ubicación en tu navegador para usar esta función.",
            2: "No pudimos determinar tu ubicación. Inténtalo nuevamente.",
            3: "La solicitud tardó demasiado. Inténtalo nuevamente.",
          };

          this.errorUbicacion =
            mensajes[error.code] || "No se pudo obtener tu ubicación.";
          this.localizando = false;
        }, {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 300000,
        },
      );
    },

    urlImagen(negocio) {
      const imagen =
        negocio.imagen ||
        negocio.logo ||
        negocio.portada ||
        negocio.imagen_portada;

      return imagen?getFileUrl(imagen) : undefined;
    },

    escaparHTML(texto) {
      return String(texto).replace(/[&<>"']/g, (caracter) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[caracter]);
    },

    destruirMapa() {
      if (this.mapa) {
        this.mapa.remove();
        this.mapa = null;
      }

      this.marcadores = [];
      this.marcadorUsuario = null;
    },
  },
};
</script>

<style scoped>
.map-sheet {
  max-height: 92dvh;
  padding: 8px 14px max(16px, env(safe-area-inset-bottom));
  overflow-y: auto;
  background: #fff;
}

.sheet-handle {
  width: 42px;
  height: 4px;
  margin: 3px auto 13px;
  border-radius: 5px;
  background: #b5bec9;
}

.map-header,
.map-title {
  display: flex;
  align-items: center;
}

.map-header {
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.map-title {
  gap: 9px;
}

.map-title h2 {
  margin: 0;
  color: #102653;
  font-size: 17px;
  font-weight: 800;
}

.map-title p {
  margin: 2px 0 0;
  color: #718096;
  font-size: 11px;
}

.map-search {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 8px 6px 12px;
  margin-bottom: 10px;
  border: 1px solid #e4eeed;
  border-radius: 14px;
  background: #f7fbfa;
}

.map-search input {
  flex: 1;
  width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #102653;
  font-size: 13px;
}

.leaflet-map {
  z-index: 0;
  width: 100%;
  height: 36dvh;
  min-height: 230px;
  max-height: 360px;
  border-radius: 16px;
  background: #eaf1ef;
}

.map-status {
  margin-bottom: 8px;
  color: #a14b14;
  font-size: 12px;
}

.map-results {
  padding-top: 13px;
}

.results-heading {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 7px;
}

.results-heading strong {
  color: #102653;
  font-size: 14px;
}

.results-heading span {
  color: #718096;
  font-size: 11px;
}

.business-result {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 3px;
  border: 0;
  border-bottom: 1px solid #edf1f3;
  background: white;
  text-align: left;
}

.business-result.selected {
  background: #effaf8;
}

.business-thumb {
  flex: 0 0 58px;
  overflow: hidden;
  border-radius: 11px;
  background: #e5f6f3;
}

.thumb-placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #079b98;
}

.business-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.business-info strong,
.business-info span,
.business-info small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-info strong {
  color: #102653;
  font-size: 12px;
}

.business-info span {
  color: #64748b;
  font-size: 10px;
}

.business-info small {
  color: #079b98;
  font-size: 10px;
}

.empty-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 22px 15px;
  color: #718096;
  text-align: center;
  font-size: 12px;
}

:deep(.leaflet-control-attribution) {
  font-size: 9px;
}


:deep(.business-marker-container) {
  background: transparent;
  border: none;
}

:deep(.business-marker) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  overflow: hidden;
  border: 3px solid #ffffff;
  border-radius: 50%;
  background: #e5f6f3;
  box-shadow: 0 3px 10px rgb(16 38 83 / 25%);
  transition:
    width 0.2s ease,
    height 0.2s ease,
    border-color 0.2s ease;
}

:deep(.business-marker.is-selected) {
  width: 50px;
  height: 50px;
  border: 3px solid #079b98;
  box-shadow: 0 4px 14px rgb(7 155 152 / 35%);
}

:deep(.business-marker-image) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.business-marker-fallback) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #079b98;
  font-size: 21px;
  font-weight: 800;
}

</style>
