<template>
  <div class="negocio-datos-page">    
    <!-- =====================================================
         ENCABEZADO
    ====================================================== -->
    <section class="page-header">
      <button class="back-button" @click="volver">
        <v-icon size="21">mdi-arrow-left</v-icon>
      </button>

      <div class="page-header-text">
        <h1>Datos del negocio</h1>
        <p>Información general y contacto.</p>
      </div>
    </section>

    <v-form ref="formRef" @submit.prevent="guardar">
      <!-- ==========================================
           INFORMACIÓN BÁSICA
      =========================================== -->
      <v-card class="section-card" variant="outlined">
        <div class="section-heading">
          <v-avatar class="section-icon" rounded="lg" size="56">
            <v-icon size="27">mdi-card-account-details-outline</v-icon>
          </v-avatar>

          <div>
            <h2>Información básica</h2>
            <p>Datos principales de tu negocio.</p>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">
            Nombre del negocio <span class="required">*</span>
          </label>

          <v-text-field
            v-model.trim="form.nombre"
            placeholder="Nombre de tu negocio"
            variant="outlined"
            density="comfortable"
            maxlength="150"
            :rules="[reglas.requerido]"
            hide-details="auto"
            required
          />
        </div>

        <div class="field-group">
          <label class="field-label">
            Tipo de negocio <span class="required">*</span>
          </label>

          <v-select
            v-model="form.tipo_negocio_id"
            :items="tiposNegocio"
            item-title="nombre"
            item-value="id"
            placeholder="Selecciona el tipo de negocio"
            variant="outlined"
            density="comfortable"
            :loading="cargandoTipos"
            :rules="[reglas.requerido]"
            :disabled="cargandoTipos"
            hide-details="auto"
            required
          />
        </div>

        <div class="field-group field-group--last">
          <label class="field-label">
            Descripción <span class="required">*</span>
          </label>

          <v-textarea
            v-model.trim="form.descripcion"
            placeholder="Cuéntales a tus clientes sobre tu negocio"
            variant="outlined"
            density="comfortable"
            rows="2"
            auto-grow
            maxlength="500"
            counter
            :rules="[reglas.requerido]"
            hide-details="auto"
            required
          />
        </div>
      </v-card>

      <!-- ==========================================
           CONTACTO
      =========================================== -->
      <v-card class="section-card" variant="outlined">
        <div class="section-heading">
          <v-avatar class="section-icon" rounded="lg" size="56">
            <v-icon size="27">mdi-phone-outline</v-icon>
          </v-avatar>

          <div>
            <h2>Contacto</h2>
            <p>Número de contacto para tus clientes.</p>
          </div>
        </div>

        <div class="field-group field-group--last">
          <label class="field-label">
            Teléfono <span class="required">*</span>
          </label>

          <v-text-field
            v-model.trim="form.telefono"
            placeholder="+591 7070 1234"
            prepend-inner-icon="mdi-phone-outline"
            variant="outlined"
            density="comfortable"
            maxlength="30"
            :rules="[reglas.telefono]"
            hide-details="auto"
            required
          />
        </div>
      </v-card>

      <!-- ==========================================
           UBICACIÓN
      =========================================== -->
      <v-card class="section-card location-card" variant="outlined">
        <div class="section-heading">
          <v-avatar class="section-icon" rounded="lg" size="56">
            <v-icon size="27">mdi-map-marker-outline</v-icon>
          </v-avatar>

          <div>
            <h2>Ubicación</h2>
            <p>Dirección de tu negocio.</p>
          </div>
        </div>

        <v-row>
          <v-col cols="12" sm="6">
            <div class="field-group">
              <label class="field-label">
                Departamento <span class="required">*</span>
              </label>

              <v-select
                v-model="form.departamento"
                :items="departamentos"
                placeholder="Selecciona"
                variant="outlined"
                density="comfortable"
                :rules="[reglas.requerido]"
                hide-details="auto"
                @update:model-value="cambiarDepartamento"
                required
              />
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="field-group">
              <label class="field-label">
                Municipio <span class="required">*</span>
              </label>

              <v-select
                v-model="form.municipio"
                :items="municipiosDisponibles"
                placeholder="Selecciona"
                variant="outlined"
                density="comfortable"
                :disabled="!form.departamento"
                :rules="[reglas.requerido]"
                hide-details="auto"
                required
              />
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="field-group">
              <label class="field-label">Zona</label>

              <v-text-field
                v-model.trim="form.zona"
                placeholder="Ej. Recoleta"
                variant="outlined"
                density="comfortable"
                maxlength="150"
                hide-details="auto"
              />
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="field-group">
              <label class="field-label">
                Dirección <span class="required">*</span>
              </label>

              <v-text-field
                v-model.trim="form.direccion"
                placeholder="Calle, avenida y referencia"
                variant="outlined"
                density="comfortable"
                maxlength="500"
                :rules="[reglas.requerido]"
                hide-details="auto"
                required
              />
            </div>
          </v-col>
        </v-row>

        <!-- MAPA DE UBICACIÓN -->
        <div class="map-heading">
          <v-icon color="teal-darken-1">mdi-map-marker-outline</v-icon>
          <span>Ubicación de tu negocio</span>
        </div>

        <button
          type="button"
          class="map-preview"
          @click="abrirDialogMapa"
        >
          <div class="map-preview__icon">
            <v-icon size="32" color="teal-darken-1">
              mdi-map-search-outline
            </v-icon>
          </div>

          <div class="map-preview__content">
            <strong>
              {{
                form.latitud != null && form.longitud != null
                  ? "Ubicación seleccionada"
                  : "Seleccionar ubicación"
              }}
            </strong>

            <span>
              Toca aquí para abrir el mapa y ubicar tu negocio.
            </span>
          </div>

          <v-icon color="teal-darken-1">mdi-chevron-right</v-icon>
        </button>
        
        <div v-if="coordenadasValidas" class="map-coordinates">
          <v-icon size="17" color="teal-darken-1">
            mdi-check-circle-outline
          </v-icon>

          <span>
            {{ Number(form.latitud).toFixed(6) }},
            {{ Number(form.longitud).toFixed(6) }}
          </span>
        </div>

        <!-- DIÁLOGO AMPLIO DEL MAPA -->
        <v-dialog v-model="dialogMapa" fullscreen scrollable :scrim="true" transition="dialog-bottom-transition" content-class="dialog-mapa-pia">
          <v-card class="map-dialog-card">
            <div class="map-dialog-header">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                aria-label="Cerrar mapa"
                @click="cerrarDialogMapa"
              />

              <div class="map-dialog-title">
                <h2>Ubicación del negocio</h2>
                <p>Mueve el marcador hasta el lugar exacto.</p>
              </div>

              <v-btn
                icon="mdi-close"
                variant="text"
                aria-label="Cerrar"
                @click="cerrarDialogMapa"
              />
            </div>

            <div class="map-dialog-search">
              <v-icon color="teal-darken-1">mdi-map-marker</v-icon>
              <div>
                <strong>{{ form.municipio || "Bolivia" }}</strong>
                <span>
                  {{ form.direccion || "Selecciona el punto en el mapa" }}
                </span>
              </div>
            </div>

            <div class="map-dialog-body">
              <div
                ref="mapDialogElement"
                class="business-map-full"
              />

              <div class="map-center-hint">
                <v-icon color="teal-darken-1" size="17">
                  mdi-gesture-tap
                </v-icon>
                Toca el mapa para colocar el marcador
              </div>
            </div>

            <div class="map-dialog-footer">
              <div class="selected-coordinates">
                <v-icon color="teal-darken-1">
                  mdi-crosshairs-gps
                </v-icon>

                <div>
                  <strong>Coordenadas seleccionadas</strong>
                  <span v-if="coordenadasTemporales">
                    {{ coordenadasTemporales.lat.toFixed(6) }},
                    {{ coordenadasTemporales.lng.toFixed(6) }}
                  </span>
                  <span v-else>Selecciona un punto en el mapa</span>
                </div>
              </div>

              <v-btn
                block
                size="x-large"
                color="teal-darken-2"
                prepend-icon="mdi-check-circle-outline"
                :disabled="!coordenadasTemporales"
                @click="confirmarUbicacion"
              >
                Confirmar ubicación
              </v-btn>
            </div>
          </v-card>
        </v-dialog>


        <div class="map-wrapper">
          <div
            ref="mapElement"
            class="business-map"
            aria-label="Mapa para seleccionar la ubicación del negocio"
          />

          <div v-if="!mapaListo" class="map-loading">
            <v-progress-circular
              indeterminate
              color="teal"
              size="28"
            />
            <span>Preparando mapa...</span>
          </div>
        </div>

        <div class="map-coordinates" v-if="form.latitud != null && form.longitud != null">
          <v-icon size="16" color="teal-darken-1">
            mdi-check-circle-outline
          </v-icon>
          Ubicación seleccionada
        </div>

        <v-btn
          block
          size="large"
          variant="tonal"
          color="teal-darken-2"
          prepend-icon="mdi-map-marker"
          class="location-button"
          @click="centrarMapa"
        >
          Seleccionar ubicación
        </v-btn>

        <p class="map-help">
          Toca el mapa o mueve el marcador para señalar la ubicación exacta.
        </p>
      </v-card>

      <!-- ==========================================
           ACCIONES
      =========================================== -->
      <div class="bottom-actions">
        <v-btn
          type="submit"
          block
          size="x-large"
          color="teal-darken-2"
          prepend-icon="mdi-content-save"
          :loading="guardando"
          :disabled="cargando || cargandoTipos"
          class="save-button"
        >
          Guardar cambios
        </v-btn>

        <v-btn
          block
          size="x-large"
          variant="outlined"
          color="teal-darken-2"
          prepend-icon="mdi-eye-outline"
          class="preview-button"
          @click="verVistaPrevia"
        >
          Vista previa de página pública
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  obtenerDatosNegocio,
  actualizarDatosNegocio,
  getTiposNegocio,
} from "../services/negocio.api.js";

// Importa aquí el catálogo local completo de Bolivia.
// El archivo debe exportar departamentosBolivia y municipiosPorDepartamento.
import {
  departamentosBolivia,
  municipiosPorDepartamento,
} from "../data/municipiosBolivia.js";

const formularioInicial = () => ({
  id: null,
  nombre: "",
  tipo_negocio_id: null,
  descripcion: "",
  telefono: "",
  departamento: "",
  municipio: "",
  zona: "",
  direccion: "",
  latitud: null,
  longitud: null,
});

export default {
  name: "NegocioDatosAdmin",

  data() {
    return {
      form: formularioInicial(),

      tiposNegocio: [],
      departamentos: departamentosBolivia,
      municipiosPorDepartamento,

      cargando: false,
      cargandoTipos: false,
      guardando: false,
      mapaListo: false,

      mapa: null,
      marcador: null,

      reglas: {
        requerido: (valor) =>
          (valor !== null &&
            valor !== undefined &&
            String(valor).trim() !== "") ||
          "Este campo es obligatorio",

        telefono: (valor) =>
          (!!valor &&
            /^[0-9+\s()-]{7,30}$/.test(valor.trim())) ||
          "Ingresa un teléfono válido",
      },

      dialogMapa: false,
      mapaDialog: null,
      marcadorDialog: null,
      coordenadasTemporales: null,

    };
  },

  computed: {
    municipiosDisponibles() {
      if (!this.form.departamento) return [];

      return this.municipiosPorDepartamento[
        this.form.departamento
      ] || [];
    },
    coordenadasValidas() {
      const lat = Number(this.form.latitud);
      const lng = Number(this.form.longitud);

      return (
        this.form.latitud !== null &&
        this.form.latitud !== "" &&
        this.form.longitud !== null &&
        this.form.longitud !== "" &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    },
  },

  async mounted() {
    await Promise.all([
      this.cargarTiposNegocio(),
      this.cargarNegocio(),
    ]);

    await this.$nextTick();
    this.inicializarMapa();
  },

  beforeUnmount() {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = null;
    }

    if (this.mapaDialog) {
      this.mapaDialog.remove();
      this.mapaDialog = null;
      this.marcadorDialog = null;
    }    
  },

  methods: {
    
    abrirDialogMapa() {
      this.coordenadasTemporales = {
        lat: Number.isFinite(this.form.latitud)
          ? this.form.latitud
          : -17.3935,
        lng: Number.isFinite(this.form.longitud)
          ? this.form.longitud
          : -66.1570,
      };

      this.dialogMapa = true;

      this.$nextTick(() => {
        this.inicializarMapaDialog();
      });
    },

    inicializarMapaDialog() {
      const elemento = this.$refs.mapDialogElement;

      if (!elemento) return;

      if (!this.mapaDialog) {
        const { lat, lng } = this.coordenadasTemporales;

        this.mapaDialog = L.map(elemento, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([lat, lng], 16);

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }
        ).addTo(this.mapaDialog);

        this.marcadorDialog = L.marker([lat, lng], {
          draggable: true,
        }).addTo(this.mapaDialog);

        this.mapaDialog.on("click", (evento) => {
          this.seleccionarCoordenadas(
            evento.latlng.lat,
            evento.latlng.lng
          );
        });

        this.marcadorDialog.on("dragend", () => {
          const posicion = this.marcadorDialog.getLatLng();

          this.seleccionarCoordenadas(
            posicion.lat,
            posicion.lng
          );
        });
      } else {
        this.marcadorDialog.setLatLng([
          this.coordenadasTemporales.lat,
          this.coordenadasTemporales.lng,
        ]);

        this.mapaDialog.setView([
          this.coordenadasTemporales.lat,
          this.coordenadasTemporales.lng,
        ], 16);
      }

      // Leaflet necesita recalcular el tamaño cuando el diálogo se abre.
      requestAnimationFrame(() => {
        this.mapaDialog?.invalidateSize();
      });
    },

    seleccionarCoordenadas(lat, lng) {
      this.coordenadasTemporales = {
        lat: Number(lat.toFixed(7)),
        lng: Number(lng.toFixed(7)),
      };

      this.marcadorDialog?.setLatLng([lat, lng]);
    },

    confirmarUbicacion() {
      if (!this.coordenadasTemporales) return;

      this.form.latitud = this.coordenadasTemporales.lat;
      this.form.longitud = this.coordenadasTemporales.lng;

      this.dialogMapa = false;

      this.$piaAlert.success(
        "La ubicación quedó seleccionada. Recuerda guardar los cambios del negocio.",
        { title: "Ubicación seleccionada" }
      );
    },

    cerrarDialogMapa() {
      this.dialogMapa = false;
    },

    async cargarTiposNegocio() {
      this.cargandoTipos = true;

      try {
        const respuesta = await getTiposNegocio();

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.message ||
            "No se pudieron cargar los tipos de negocio."
          );
        }

        this.tiposNegocio = (respuesta.data.data || []).map(
          (tipo) => ({
            ...tipo,
            id: Number(tipo.id),
          })
        );
      } catch (error) {
        console.error("Error al cargar tipos de negocio:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
            error.response?.data?.mensaje ||
            error.message ||
            "No fue posible cargar los tipos de negocio.",
          { title: "Error al cargar" }
        );
      } finally {
        this.cargandoTipos = false;
      }
    },

    async cargarNegocio() {
      this.cargando = true;

      try {
        const respuesta = await obtenerDatosNegocio();
        const resultado = respuesta.data?.data;

        if (!respuesta.data?.ok || !resultado) {
          throw new Error(
            "No se pudieron obtener los datos del negocio."
          );
        }

        this.form = {
          ...formularioInicial(),
          ...resultado,

          tipo_negocio_id:
            resultado.tipo_negocio_id == null
              ? null
              : Number(resultado.tipo_negocio_id),

          latitud:
            resultado.latitud == null || resultado.latitud === ""
              ? null
              : Number(resultado.latitud),

          longitud:
            resultado.longitud == null || resultado.longitud === ""
              ? null
              : Number(resultado.longitud),
        };
      } catch (error) {
        console.error("Error al cargar el negocio:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
            error.response?.data?.mensaje ||
            error.message ||
            "No fue posible cargar los datos del negocio.",
          { title: "Error al cargar" }
        );
      } finally {
        this.cargando = false;
      }
    },

    cambiarDepartamento() {
      // Evita conservar un municipio perteneciente a otro departamento.
      if (!this.municipiosDisponibles.includes(this.form.municipio)) {
        this.form.municipio = "";
      }

      // Si el mapa todavía no está listo, no intenta moverlo.
      if (this.mapa) {
        this.$nextTick(() => this.mapa.invalidateSize());
      }
    },

    inicializarMapa() {
      if (!this.$refs.mapElement || this.mapa) return;

      // Coordenadas iniciales aproximadas de Cochabamba.
      const lat = Number.isFinite(this.form.latitud)
        ? this.form.latitud
        : -17.3935;

      const lng = Number.isFinite(this.form.longitud)
        ? this.form.longitud
        : -66.1570;

      this.mapa = L.map(this.$refs.mapElement, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], this.form.latitud != null ? 16 : 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(this.mapa);

      this.marcador = L.marker([lat, lng], {
        draggable: true,
      }).addTo(this.mapa);

      this.marcador.on("dragend", () => {
        const posicion = this.marcador.getLatLng();
        this.actualizarCoordenadas(posicion.lat, posicion.lng);
      });

      this.mapa.on("click", (evento) => {
        this.marcador.setLatLng(evento.latlng);
        this.actualizarCoordenadas(
          evento.latlng.lat,
          evento.latlng.lng
        );
      });

      this.mapaListo = true;

      this.$nextTick(() => {
        this.mapa?.invalidateSize();
      });
    },

    actualizarCoordenadas(latitud, longitud) {
      this.form.latitud = Number(latitud.toFixed(7));
      this.form.longitud = Number(longitud.toFixed(7));
    },

    centrarMapa() {
      if (!this.mapa || !this.marcador) return;

      const lat = Number.isFinite(this.form.latitud)
        ? this.form.latitud
        : -17.3935;

      const lng = Number.isFinite(this.form.longitud)
        ? this.form.longitud
        : -66.1570;

      const posicion = [lat, lng];

      this.marcador.setLatLng(posicion);
      this.mapa.setView(posicion, 16);
      this.mapa.invalidateSize();

      // Al abrir la selección por primera vez, el usuario puede
      // mover el marcador o tocar otra ubicación en el mapa.
    },

    async guardar() {
      const validacion = await this.$refs.formRef.validate();

      if (!validacion.valid) return;

      if (!this.form.latitud || !this.form.longitud) {
        this.$piaAlert.error(
          "Selecciona la ubicación de tu negocio en el mapa.",
          { title: "Falta la ubicación" }
        );
        return;
      }

      this.guardando = true;

      try {
        const {
          nombre,
          tipo_negocio_id,
          descripcion,
          telefono,
          departamento,
          municipio,
          zona,
          direccion,
          latitud,
          longitud,
        } = this.form;

        const respuesta = await actualizarDatosNegocio({
          nombre,
          tipo_negocio_id,
          descripcion,
          telefono,
          departamento,
          municipio,
          zona,
          direccion,
          latitud,
          longitud,
        });

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.message ||
              respuesta.data?.mensaje ||
              "No se pudieron guardar los cambios."
          );
        }

        if (respuesta.data.data) {
          this.form = {
            ...this.form,
            ...respuesta.data.data,
          };
        }

        this.$piaAlert.success(
          "Los datos del negocio se guardaron correctamente.",
          { title: "Cambios guardados" }
        );
      } catch (error) {
        console.error("Error al guardar el negocio:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
            error.response?.data?.mensaje ||
            error.message ||
            "No fue posible guardar los cambios.",
          { title: "Error al guardar" }
        );
      } finally {
        this.guardando = false;
      }
    },

    volver() {
      this.$router.back();
    },

    verVistaPrevia() {
      const slug = this.form?.slug;

      if (!slug) {
        this.$piaAlert.error(
          "No se encontró el identificador público del negocio. Verifica que el negocio tenga una página configurada.",
          { title: "Vista previa no disponible" }
        );
        return;
      }

      this.$router.push({
        path: `/perfil/negocio/${encodeURIComponent(slug)}`
      }).catch((error) => {
        console.error("Error al abrir la vista previa:", error);

        this.$piaAlert.error(
          "No fue posible abrir la página pública del negocio.",
          { title: "Error de navegación" }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.negocio-datos-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 22px 18px 24px;
  color: #101b3a;
  box-sizing: border-box;
}

/* ==========================================================
   HEADER
\========================================================== */
.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
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
  font-size: 12px;
  line-height: 1.35;
  color: #60779a;
}

.section-card {
  margin-bottom: 16px;
  padding: 19px 18px 17px;
  overflow: visible;
  border: 1px solid #dceaf3;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(33, 86, 116, 0.025);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 21px;
}

.section-icon {
  flex-shrink: 0;
  color: #008d90;
  background: #e1f5f4;
}

.section-heading h2 {
  margin: 0;
  color: #111b38;
  font-size: 20px;
  font-weight: 750;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.section-heading p {
  margin: 3px 0 0;
  color: #7184a3;
  font-size: 14px;
  line-height: 1.4;
}

.field-group {
  min-width: 0;
  margin-bottom: 17px;
}

.field-group--last {
  margin-bottom: 0;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  color: #111b38;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
}

.required {
  color: #e53935;
  font-weight: 700;
}

/* Ajustes visuales para los controles de Vuetify */
.negocio-datos-page :deep(.v-field) {
  border-radius: 12px;
  color: #152342;
}

.negocio-datos-page :deep(.v-field__outline) {
  --v-field-border-opacity: 1;
  color: #d7e1ed;
}

.negocio-datos-page :deep(.v-field--focused .v-field__outline) {
  color: #008f91;
}

.negocio-datos-page :deep(.v-field__input) {
  min-height: 50px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 15px;
}

.negocio-datos-page :deep(.v-field__prepend-inner > .v-icon) {
  color: #7184a3;
  opacity: 1;
}

.negocio-datos-page :deep(.v-textarea .v-field__input) {
  min-height: 62px;
}

.negocio-datos-page :deep(.v-counter) {
  color: #7184a3;
  font-size: 12px;
}

.location-card {
  padding-bottom: 17px;
}

.map-heading {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 4px 0 10px;
  color: #435874;
  font-size: 13px;
  font-weight: 600;
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border: 1px solid #e0e8ef;
  border-radius: 12px;
  background: #eef3f5;
}

.business-map {
  width: 100%;
  height: 100%;
  z-index: 0;
}

.map-loading {
  position: absolute;
  inset: 0;
  z-index: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #547084;
  background: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

.map-coordinates {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 9px 0 0;
  color: #008780;
  font-size: 12px;
  font-weight: 600;
}

.location-button {
  min-height: 49px;
  margin-top: 10px;
  border: 1px solid #bfe8e7;
  border-radius: 11px;
  background: #e9f8f7;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
}

.map-help {
  margin: 9px 0 0;
  color: #7184a3;
  font-size: 12px;
  line-height: 1.5;
}

.bottom-actions {
  position: sticky;
  bottom: 0;
  z-index: 5;
  display: grid;
  gap: 10px;
  margin: 0 -18px;
  padding: 13px 18px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid #edf2f6;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
}

.bottom-actions :deep(.v-btn) {
  min-height: 53px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
}

.save-button {
  color: #fff;
  background: #009b99;
}

.preview-button {
  border-color: #bfe8e7;
  background: #f2fbfa;
}

@media (max-width: 599px) {
  .negocio-datos-page {
    padding: 17px 1px 18px;
  }

  .page-heading {
    gap: 14px;
    margin: 0 2px 22px;
  }

  .page-heading :deep(.v-avatar) {
    width: 62px !important;
    height: 62px !important;
  }

  .page-heading h1 {
    font-size: 22px;
  }

  .page-heading p {
    font-size: 14px;
  }

  .eyebrow {
    font-size: 13px;
  }

  .section-card {
    padding: 17px 14px;
    margin-bottom: 14px;
    border-radius: 16px;
  }

  .section-heading {
    gap: 12px;
    margin-bottom: 19px;
  }

  .section-heading :deep(.v-avatar) {
    width: 48px !important;
    height: 48px !important;
  }

  .section-heading h2 {
    font-size: 18px;
  }

  .section-heading p {
    font-size: 12px;
  }

  .field-group {
    margin-bottom: 15px;
  }

  .field-group--last {
    margin-bottom: 0;
  }

  .field-label {
    font-size: 14px;
  }

  .map-wrapper {
    height: 175px;
  }

  .bottom-actions {
    margin: 0 -14px;
    padding-right: 14px;
    padding-left: 14px;
  }

  .bottom-actions :deep(.v-btn) {
    font-size: 14px;
  }
}

@media (min-width: 600px) {
  .negocio-datos-page {
    padding-top: 28px;
    padding-bottom: 35px;
  }

  .section-card {
    padding: 23px 20px;
  }

  .map-wrapper {
    height: 230px;
  }

  .bottom-actions {
    margin: 0;
    padding: 14px 0;
    border-top: none;
    background: transparent;
    backdrop-filter: none;
  }
}


.map-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  text-align: left;
  border: 1px solid #c8eae8;
  border-radius: 12px;
  background: #effaf9;
  cursor: pointer;
}

.map-preview__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #d9f2f0;
}

.map-preview__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.map-preview__content strong {
  color: #007f80;
  font-size: 14px;
}

.map-preview__content span {
  color: #7184a3;
  font-size: 12px;
  line-height: 1.5;
}

.dialog-mapa-pia {
  width: 100%;
  max-width: none !important;
  height: 100%;
  margin: 0;
}

.map-dialog-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0;
}

.map-dialog-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #e6edf2;
}

.map-dialog-title {
  flex: 1;
  min-width: 0;
}

.map-dialog-title h2 {
  font-size: 17px;
  font-weight: 700;
  color: #111b38;
}

.map-dialog-title p {
  margin-top: 3px;
  color: #7184a3;
  font-size: 12px;
}

.map-dialog-search {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #e6edf2;
}

.map-dialog-search div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.map-dialog-search strong {
  font-size: 14px;
}

.map-dialog-search span {
  overflow-wrap: anywhere;
  color: #7184a3;
  font-size: 12px;
}

.map-dialog-body {
  position: relative;
  flex: 1;
  min-height: 180px;
}

.business-map-full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #eef3f5;
}

.map-center-hint {
  position: absolute;
  z-index: 500;
  bottom: 14px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 6px;
  width: max-content;
  max-width: calc(100% - 28px);
  padding: 10px 13px;
  border: 1px solid #dcebe9;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  color: #435874;
  font-size: 12px;
  transform: translateX(-50%);
}

.map-dialog-footer {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 14px;
  padding: 15px 16px max(16px, env(safe-area-inset-bottom));
  border-top: 1px solid #e6edf2;
  background: #fff;
}

.selected-coordinates {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-coordinates div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selected-coordinates strong {
  color: #243750;
  font-size: 13px;
}

.selected-coordinates span {
  color: #7184a3;
  font-size: 12px;
}

.map-dialog-footer :deep(.v-btn) {
  min-height: 52px;
  border-radius: 12px;
  font-weight: 650;
  text-transform: none;
}

@media (min-width: 600px) {
  .dialog-mapa-pia {
    width: 100%;
    height: 100%;
  }

  .map-dialog-search,
  .map-dialog-footer {
    padding-right: 24px;
    padding-left: 24px;
  }
}

</style>
