<template>
<v-bottom-sheet v-model="dialog" inset scrollable :retain-focus="false">
  <v-card class="sheet-fotos">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <div class="sheet-header">

      <div>
        <div class="sheet-titulo">
          Fotos del servicio
        </div>

        <div class="sheet-subtitulo">
          Administra las fotos que verán tus clientes.
        </div>
      </div>

      <v-btn icon="mdi-close" variant="tonal" size="small" class="btn-cerrar" :disabled="procesando" @click="cerrar" />
    </div>

    <!-- ===================================================== -->
    <!-- CONTENIDO -->
    <!-- ===================================================== -->

    <v-card-text class="sheet-contenido">

      <!-- INFORMACIÓN -->

      <v-alert type="info" variant="tonal" density="compact" class="info-alert" icon="mdi-information-outline">
        <div class="info-texto">
          <strong>La primera foto será la imagen principal.</strong>
          Puedes cambiar el orden arrastrando las imágenes.
        </div>
      </v-alert>

      <!-- ================================================= -->
      <!-- CONTADOR -->
      <!-- ================================================= -->

      <div class="contador-container">

        <div class="contador">
          {{ fotos.length }}/{{ MAX_FOTOS }} fotos agregadas
        </div>

        <div class="contador-info">
          <v-icon size="15">
            mdi-star
          </v-icon>

          La primera será la principal
        </div>

      </div>

      <!-- ================================================= -->
      <!-- GALERÍA -->
      <!-- ================================================= -->

      <draggable v-model="fotos" item-key="id" class="fotos-grid" handle=".drag-handle" animation="200" ghost-class="foto-ghost" chosen-class="foto-chosen" drag-class="foto-drag" :disabled="procesando" @end="ordenFotosCambio">

        <template #item="{ element, index }">

          <div class="foto-item">

            <div class="foto-card">

              <!-- IMAGEN -->

              <img :src="element.preview" alt="Foto del servicio" class="foto-imagen" @click.stop="abrirVisor(element)" />

              <!-- NÚMERO -->

              <div class="foto-numero">
                {{ index + 1 }}
              </div>

              <!-- ELIMINAR -->

              <v-btn icon="mdi-delete" size="small" density="comfortable" variant="flat" class="btn-eliminar" :disabled="procesando" @click.stop="eliminarFoto(index)" />

              <!-- PRINCIPAL -->

              <div v-if="index === 0" class="principal-chip">
                <v-icon size="13">
                  mdi-star
                </v-icon>

                Principal
              </div>

              <!-- DRAG -->

              <div class="foto-footer">

                <span>
                  Arrastra para ordenar
                </span>

                <v-icon class="drag-handle" size="20">
                  mdi-drag
                </v-icon>

              </div>

            </div>

          </div>

        </template>

        <!-- ================================================= -->
        <!-- AGREGAR FOTO -->
        <!-- ================================================= -->

        <template #footer>

          <div v-if="fotos.length < MAX_FOTOS" class="foto-item">

            <button type="button" class="agregar-foto-card" :disabled="procesando" @click="seleccionarFotos">

              <div class="agregar-icono">

                <v-icon size="28">
                  mdi-plus
                </v-icon>

              </div>

              <div class="agregar-titulo">
                Agregar foto
              </div>

              <div class="agregar-disponibles">

                {{ MAX_FOTOS - fotos.length }}

                {{
                    MAX_FOTOS - fotos.length === 1
                     ?"disponible"
                      : "disponibles"
                  }}

              </div>

            </button>

          </div>

        </template>

      </draggable>

      <!-- ================================================= -->
      <!-- SIN FOTOS -->
      <!-- ================================================= -->

      <div v-if="fotos.length === 0" class="sin-fotos">

        <v-icon size="48">
          mdi-image-off-outline
        </v-icon>

        <div class="sin-fotos-titulo">
          Este servicio no tiene fotos
        </div>

        <div class="sin-fotos-texto">
          Agrega fotografías para mostrar el resultado de tu trabajo.
        </div>

      </div>

      <!-- ================================================= -->
      <!-- CONSEJO -->
      <!-- ================================================= -->

      <v-alert type="info" variant="tonal" density="compact" class="info-alert inferior" icon="mdi-lightbulb-outline">

        <div class="info-texto">

          <strong>Consejo:</strong>

          usa fotos claras y de buena calidad donde se pueda apreciar
          el resultado de tu trabajo.

        </div>

      </v-alert>

    </v-card-text>

    <!-- ===================================================== -->
    <!-- FOOTER -->
    <!-- ===================================================== -->

    <div class="sheet-footer">

      <v-btn variant="outlined" color="secondary" class="btn-cancelar" :disabled="procesando" @click="cerrar">
        Cancelar
      </v-btn>

      <v-btn color="primary" class="btn-guardar" :loading="procesando" :disabled="!servicioId" @click="guardar">
        <v-icon start>
          mdi-content-save
        </v-icon>

        Guardar fotos
      </v-btn>

    </div>

  </v-card>
</v-bottom-sheet>

<!-- ======================================================= -->
<!-- INPUT OCULTO -->
<!-- ======================================================= -->

<input ref="inputFotos" type="file" accept="image/*" multiple hidden @change="procesarFotos" />

<!-- ======================================================= -->
<!-- VISOR DE FOTOS -->
<!-- ======================================================= -->

<v-dialog v-model="visorFoto" fullscreen transition="dialog-bottom-transition" scrim="black">

  <div class="visor-foto">

    <!-- HEADER -->

    <div class="visor-header">

      <div class="visor-contador">

        {{ indiceFotoSeleccionada + 1 }}
        /
        {{ fotos.length }}

      </div>

      <v-btn icon="mdi-close" variant="text" color="white" @click="cerrarVisor" />

    </div>

    <!-- IMAGEN -->

    <div class="visor-contenido">

      <v-btn v-if="indiceFotoSeleccionada > 0" icon="mdi-chevron-left" class="visor-navegacion izquierda" variant="text" color="white" size="large" @click="fotoAnterior" />

      <img v-if="fotoSeleccionada" :src="fotoSeleccionada.preview" alt="Foto del servicio" class="visor-imagen" />

      <v-btn v-if="
            indiceFotoSeleccionada <
            fotos.length - 1
          " icon="mdi-chevron-right" class="visor-navegacion derecha" variant="text" color="white" size="large" @click="fotoSiguiente" />

    </div>

  </div>

</v-dialog>
</template>

<script>
import draggable from "vuedraggable";

import {
  deleteServiceFile,
  setServiceFilePrincipal,
  updateServiceFileOrder,
  uploadServiceFiles,
} from "../services/servicioArchivo.api.js";

export default {

  name: "EditarFotosAdmin",

  components: {
    draggable,
  },

  props: {

    modelValue: {
      type: Boolean,
      default: false,
    },

    servicioId: {
      type: [Number, String],
      default: null,
    },

    fotosIniciales: {
      type: Array,
      default: () => [],
    },

  },

  emits: [
    "update:modelValue",
    "guardado",
  ],

  data() {

    return {

      MAX_FOTOS: 5,

      fotos: [],

      procesando: false,

      visorFoto: false,

      fotoSeleccionada: null,

      indiceFotoSeleccionada: -1,

    };

  },

  computed: {

    dialog: {

      get() {
        return this.modelValue;
      },

      set(valor) {
        this.$emit("update:modelValue", valor);
      },

    },

  },

  watch: {

    modelValue(valor) {

      if (valor) {

        this.cargarFotosIniciales(
          this.fotosIniciales
        );

      }

    },

    fotosIniciales: {

      deep: true,

      handler(nuevasFotos) {

        if (!this.modelValue) {
          return;
        }

        this.cargarFotosIniciales(
          nuevasFotos
        );

      },

    },

  },

  methods: {

    // ======================================================
    // CARGAR FOTOS
    // ======================================================

    cargarFotosIniciales(fotos) {

      if (!Array.isArray(fotos)) {

        this.fotos = [];

        return;

      }

      this.fotos = fotos

        .filter((foto) => {

          return (
            foto.tipo === "FOTO" ||
            !foto.tipo
          );

        })

        .map((foto, index) => {

          return {

            id: foto.id,

            servicio_id: foto.servicio_id ||
              this.servicioId,

            archivo_id: foto.archivo_id,

            tipo: "FOTO",

            orden: Number(foto.orden) ||
              index + 1,

            principal: Boolean(foto.principal),

            nombre: foto.nombre,

            url: foto.url,

            mime_type: foto.mime_type,

            tamano_bytes: foto.tamano_bytes,

            preview: this.obtenerUrlArchivo(
              foto.url
            ),

            archivo: null,

            existente: true,

          };

        })

        .sort((a, b) => {

          return (
            Number(a.orden) -
            Number(b.orden)
          );

        });

      this.normalizarOrden();

      this.normalizarPrincipal();

    },

    // ======================================================
    // URL
    // ======================================================

    obtenerUrlArchivo(url) {

      if (!url) {
        return "";
      }

      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("blob:")
      ) {

        return url;

      }

      const baseUrl =
        import.meta.env.VITE_SERVER_URL ||
        "http://localhost:3000";

      return `${baseUrl}${
        url.startsWith("/")
         ?""
          : "/"
      }${url}`;

    },

    // ======================================================
    // SELECCIONAR FOTOS
    // ======================================================

    seleccionarFotos() {

      if (
        this.fotos.length >=
        this.MAX_FOTOS
      ) {

        return;

      }

      this.$refs.inputFotos.click();

    },

    // ======================================================
    // PROCESAR FOTOS
    // ======================================================

    procesarFotos(event) {

      const archivos =
        Array.from(
          event.target.files || []
        );

      if (!archivos.length) {
        return;
      }

      const espacioDisponible =
        this.MAX_FOTOS -
        this.fotos.length;

      if (espacioDisponible <= 0) {

        event.target.value = "";

        return;

      }

      const archivosAgregar =
        archivos.slice(
          0,
          espacioDisponible
        );

      archivosAgregar.forEach(
        (archivo) => {

          if (
            !archivo.type.startsWith(
              "image/"
            )
          ) {

            return;

          }

          const foto = {

            id: `${Date.now()}-${Math.random()}`,

            archivo,

            preview: URL.createObjectURL(
              archivo
            ),

            existente: false,

            servicio_id: this.servicioId,

            archivo_id: null,

            tipo: "FOTO",

            orden: this.fotos.length + 1,

            principal: false,

            nombre: archivo.name,

            mime_type: archivo.type,

            tamano_bytes: archivo.size,

            url: null,

          };

          this.fotos.push(foto);

        }
      );

      event.target.value = "";

      this.normalizarOrden();

      this.normalizarPrincipal();

    },

    // ======================================================
    // ABRIR VISOR
    // ======================================================

    abrirVisor(foto) {

      const indice =
        this.fotos.findIndex(
          (item) =>
          item.id === foto.id
        );

      this.indiceFotoSeleccionada =
        indice;

      this.fotoSeleccionada =
        foto;

      this.visorFoto = true;

    },

    cerrarVisor() {

      this.visorFoto = false;

      this.fotoSeleccionada =
        null;

      this.indiceFotoSeleccionada = -1;

    },

    fotoAnterior() {

      if (
        this.indiceFotoSeleccionada <=
        0
      ) {

        return;

      }

      this.indiceFotoSeleccionada--;

      this.fotoSeleccionada =
        this.fotos[
          this.indiceFotoSeleccionada
        ];

    },

    fotoSiguiente() {

      if (
        this.indiceFotoSeleccionada >=
        this.fotos.length - 1
      ) {

        return;

      }

      this.indiceFotoSeleccionada++;

      this.fotoSeleccionada =
        this.fotos[
          this.indiceFotoSeleccionada
        ];

    },

    // ======================================================
    // ELIMINAR
    // ======================================================

    async eliminarFoto(index) {

      const foto =
        this.fotos[index];

      if (!foto) {
        return;
      }

      // ----------------------------------------------------
      // FOTO NUEVA
      // ----------------------------------------------------

      if (!foto.existente) {

        if (
          foto.preview &&
          foto.preview.startsWith(
            "blob:"
          )
        ) {

          URL.revokeObjectURL(
            foto.preview
          );

        }

        this.fotos.splice(
          index,
          1
        );

        this.normalizarOrden();

        this.normalizarPrincipal();

        return;

      }

      // ----------------------------------------------------
      // FOTO EXISTENTE
      // ----------------------------------------------------

      if (!foto.id) {
        return;
      }

      this.procesando = true;

      try {

        await deleteServiceFile(
          foto.id
        );

        if (
          foto.preview &&
          foto.preview.startsWith(
            "blob:"
          )
        ) {

          URL.revokeObjectURL(
            foto.preview
          );

        }

        this.fotos.splice(
          index,
          1
        );

        this.normalizarOrden();

        this.normalizarPrincipal();

        if (
          this.fotoSeleccionada?.id ===
          foto.id
        ) {

          this.cerrarVisor();

        }

      } catch (error) {

        console.error(
          "Error eliminando fotografía:",
          error
        );

        this.$piaAlert.error(

          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "No se pudo eliminar la fotografía.",

          {
            title: "Error al eliminar fotografía",
          }

        );

      } finally {

        this.procesando = false;

      }

    },

    // ======================================================
    // DRAG & DROP
    // ======================================================

    ordenFotosCambio() {

      this.normalizarOrden();

      this.normalizarPrincipal();

    },

    // ======================================================
    // NORMALIZAR ORDEN
    // ======================================================

    normalizarOrden() {

      this.fotos.forEach(
        (foto, index) => {

          foto.orden =
            index + 1;

        }
      );

    },

    // ======================================================
    // NORMALIZAR PRINCIPAL
    // ======================================================

    normalizarPrincipal() {

      this.fotos.forEach(
        (foto, index) => {

          foto.principal =
            index === 0;

        }
      );

    },

    // ======================================================
    // GUARDAR
    // ======================================================

    async guardar() {

      if (!this.servicioId) {

        this.$piaAlert.error(

          "No se encontró el servicio que se está editando.",

          {
            title: "Servicio no encontrado",
          }

        );

        return;

      }

      this.procesando = true;

      try {

        // ==================================================
        // 1. NORMALIZAR
        // ==================================================

        this.normalizarOrden();

        this.normalizarPrincipal();

        // ==================================================
        // 2. SUBIR FOTOS NUEVAS
        // ==================================================

        const fotosNuevas =
          this.fotos.filter(
            (foto) =>
            !foto.existente &&
            foto.archivo instanceof File
          );

        if (fotosNuevas.length) {

          const archivos =
            fotosNuevas.map(
              (foto) =>
              foto.archivo
            );

          const respuesta =
            await uploadServiceFiles(
              this.servicioId,
              archivos
            );

          const archivosGuardados =
            respuesta.data?.data || [];

          archivosGuardados.forEach(
            (item, index) => {

              const fotoNueva =
                fotosNuevas[index];

              if (!fotoNueva) {
                return;
              }

              fotoNueva.existente =
                true;

              fotoNueva.id =
                item.relacion?.id;

              fotoNueva.archivo_id =
                item.archivo?.id;

              fotoNueva.servicio_id =
                this.servicioId;

              fotoNueva.url =
                item.archivo?.url ||
                null;

              fotoNueva.nombre =
                item.archivo?.nombre ||
                fotoNueva.nombre;

              fotoNueva.mime_type =
                item.archivo?.mime_type ||
                fotoNueva.mime_type;

              fotoNueva.tamano_bytes =
                item.archivo?.tamano_bytes ||
                fotoNueva.tamano_bytes;

              fotoNueva.archivo =
                null;

              if (
                item.archivo?.url
              ) {

                fotoNueva.preview =
                  this.obtenerUrlArchivo(
                    item.archivo.url
                  );

              }

            }
          );

        }

        // ==================================================
        // 3. NORMALIZAR NUEVAMENTE
        // ==================================================

        this.normalizarOrden();

        this.normalizarPrincipal();

        // ==================================================
        // 4. GUARDAR ORDEN
        // ==================================================

        for (
          let i = 0; i < this.fotos.length; i++
        ) {

          const foto =
            this.fotos[i];

          if (
            !foto.existente ||
            !foto.id
          ) {

            continue;

          }

          await updateServiceFileOrder(
            foto.id,
            i + 1
          );

        }

        // ==================================================
        // 5. ESTABLECER PRINCIPAL
        // ==================================================

        const fotoPrincipal =
          this.fotos[0];

        if (
          fotoPrincipal &&
          fotoPrincipal.existente &&
          fotoPrincipal.id
        ) {

          await setServiceFilePrincipal(
            fotoPrincipal.id
          );

        }

        // ==================================================
        // 6. ACTUALIZAR ORDEN LOCAL
        // ==================================================

        this.normalizarOrden();

        this.normalizarPrincipal();

        // ==================================================
        // 7. AVISAR AL PADRE
        // ==================================================

        this.$emit(
          "guardado",
          this.fotos
        );

        // ==================================================
        // 8. MENSAJE
        // ==================================================

        this.$piaAlert.success(

          "Las fotos del servicio se guardaron correctamente.",

          {
            title: "Fotos actualizadas",
          }

        );

        // ==================================================
        // 9. CERRAR
        // ==================================================

        this.dialog = false;

      } catch (error) {

        console.error(
          "ERROR AL GUARDAR FOTOS:",
          error
        );

        this.$piaAlert.error(

          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "No se pudieron guardar las fotografías.",

          {
            title: "Error al guardar fotografías",
          }

        );

      } finally {

        this.procesando = false;

      }

    },

    // ======================================================
    // CERRAR
    // ======================================================

    cerrar() {

      if (this.procesando) {
        return;
      }

      this.cerrarVisor();

      this.dialog = false;

    },

  },

  // ========================================================
  // LIMPIEZA
  // ========================================================

  beforeUnmount() {

    this.fotos.forEach(
      (foto) => {

        if (
          foto.preview &&
          foto.preview.startsWith(
            "blob:"
          )
        ) {

          URL.revokeObjectURL(
            foto.preview
          );

        }

      }
    );

  },

};
</script>

<style lang="scss" scoped>
.sheet-fotos {
  border-radius: 24px 24px 0 0 !important;
  overflow: hidden;
}

/* ========================================================= */
/* HEADER */
/* ========================================================= */

.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  padding: 22px 18px 16px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.sheet-titulo {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.sheet-subtitulo {
  margin-top: 6px;

  font-size: 13px;
  color: #777;

  line-height: 1.4;
}

.btn-cerrar {
  flex-shrink: 0;
}

/* ========================================================= */
/* CONTENIDO */
/* ========================================================= */

.sheet-contenido {
  padding: 16px 12px 24px !important;
}

/* ========================================================= */
/* INFORMACIÓN */
/* ========================================================= */

.info-alert {
  margin-bottom: 16px;
}

.info-texto {
  font-size: 12px;
  line-height: 1.45;
}

/* ========================================================= */
/* CONTADOR */
/* ========================================================= */

.contador-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 14px;
}

.contador {
  font-size: 13px;
  font-weight: 700;
}

.contador-info {
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 11px;
  color: #777;
}

/* ========================================================= */
/* GRID */
/* ========================================================= */

.fotos-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 10px;
}

/* ========================================================= */
/* FOTO */
/* ========================================================= */

.foto-item {
  min-width: 0;
}

.foto-card {
  position: relative;

  overflow: hidden;

  border-radius: 14px;

  background: #eee;

  aspect-ratio: 1 / 1;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08);
}

.foto-imagen {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  cursor: pointer;
}

/* ========================================================= */
/* NÚMERO */
/* ========================================================= */

.foto-numero {
  position: absolute;

  top: 7px;
  left: 7px;

  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.72);

  color: white;

  font-size: 12px;
  font-weight: 700;
}

/* ========================================================= */
/* ELIMINAR */
/* ========================================================= */

.btn-eliminar {
  position: absolute;

  top: 6px;
  right: 6px;

  background: white !important;

  color: #e53935 !important;

  z-index: 3;
}

/* ========================================================= */
/* PRINCIPAL */
/* ========================================================= */

.principal-chip {
  position: absolute;

  left: 7px;
  bottom: 38px;

  display: flex;
  align-items: center;
  gap: 4px;

  padding: 4px 8px;

  border-radius: 20px;

  background: rgba(0, 150, 136, 0.95);

  color: white;

  font-size: 10px;
  font-weight: 600;
}

/* ========================================================= */
/* FOOTER FOTO */
/* ========================================================= */

.foto-footer {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  height: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 7px;

  background:
    linear-gradient(transparent,
      rgba(0, 0, 0, 0.78));

  color: white;

  font-size: 9px;
}

.drag-handle {
  cursor: grab;
}

/* ========================================================= */
/* AGREGAR */
/* ========================================================= */

.agregar-foto-card {
  width: 100%;

  aspect-ratio: 1 / 1;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 5px;

  border: 2px dashed rgba(0, 150, 136, 0.35);

  border-radius: 14px;

  background:
    rgba(0, 150, 136, 0.04);

  color: #008f85;

  cursor: pointer;
}

.agregar-foto-card:disabled {
  opacity: 0.5;
  cursor: default;
}

.agregar-icono {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(0, 150, 136, 0.12);
}

.agregar-titulo {
  font-size: 13px;
  font-weight: 700;
}

.agregar-disponibles {
  font-size: 10px;
  color: #777;
}

/* ========================================================= */
/* SIN FOTOS */
/* ========================================================= */

.sin-fotos {
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 30px 20px;

  text-align: center;

  color: #999;
}

.sin-fotos-titulo {
  margin-top: 10px;

  font-size: 14px;
  font-weight: 700;

  color: #666;
}

.sin-fotos-texto {
  margin-top: 5px;

  max-width: 280px;

  font-size: 12px;

  line-height: 1.4;
}

/* ========================================================= */
/* CONSEJO */
/* ========================================================= */

.inferior {
  margin-top: 18px;
}

/* ========================================================= */
/* FOOTER */
/* ========================================================= */

.sheet-footer {
  display: flex;

  gap: 10px;

  padding: 12px;

  border-top: 1px solid rgba(0, 0, 0, 0.06);

  background: white;
}

.btn-cancelar,
.btn-guardar {
  flex: 1;
}

/* ========================================================= */
/* DRAG */
/* ========================================================= */

.foto-ghost {
  opacity: 0.35;
}

.foto-chosen {
  transform: scale(1.02);
}

.foto-drag {
  opacity: 0.9;
}

/* ========================================================= */
/* VISOR */
/* ========================================================= */

.visor-foto {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  background: rgba(0, 0, 0, 0.96);
}

.visor-header {
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;

  color: white;
}

.visor-contador {
  font-size: 14px;
  font-weight: 600;
}

.visor-contenido {
  position: relative;

  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
}

.visor-imagen {
  max-width: 92%;
  max-height: 88%;

  object-fit: contain;

  user-select: none;
}

.visor-navegacion {
  position: absolute;

  top: 50%;

  transform: translateY(-50%);

  z-index: 5;
}

.visor-navegacion.izquierda {
  left: 10px;
}

.visor-navegacion.derecha {
  right: 10px;
}

/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (min-width: 600px) {

  .fotos-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}
</style>
