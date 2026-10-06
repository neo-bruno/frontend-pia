<template>
<div class="fotos-container">

  <!-- ENCABEZADO -->

  <div class="seccion-header">

    <div class="seccion-icono">

      <v-icon size="22">mdi-image-multiple</v-icon>

    </div>

    <div class="seccion-header-texto">

      <div class="seccion-titulo">

        Fotos del servicio

      </div>

      <div class="seccion-subtitulo">

        Agrega hasta 5 fotos que muestren el resultado de tu servicio

      </div>

    </div>

  </div>

  <!-- INFORMACIÓN -->

  <v-alert type="info" variant="tonal" density="compact" class="info-alert" icon="mdi-information-outline">

    <div class="info-texto">

      <strong>La primera foto será la imagen principal</strong>

      que verán tus clientes.

      Puedes cambiar el orden arrastrando las imágenes.

    </div>

  </v-alert>

  <!-- CONTADOR -->

  <div class="contador-container">

    <div class="contador">

      {{ fotos.length }}/5 fotos agregadas

    </div>

    <div class="contador-info">

      <v-icon size="15">mdi-star</v-icon>

      La primera será la principal

    </div>

  </div>

  <!-- GALERÍA -->

  <draggable v-model="fotos" item-key="id" class="fotos-grid" handle=".drag-handle" animation="200" ghost-class="foto-ghost" chosen-class="foto-chosen" drag-class="foto-drag" @end="ordenFotosCambio">

    <template #item="{ element, index }">

      <div class="foto-item">

        <!-- IMAGEN -->

        <div class="foto-card">

          <img :src="element.preview" alt="Foto del servicio" class="foto-imagen" @click.stop="abrirVisor(element)" />

          <!-- NÚMERO -->

          <div class="foto-numero">

            {{ index + 1 }}

          </div>

          <!-- ELIMINAR -->

          <v-btn icon="mdi-delete" size="small" density="comfortable" variant="flat" class="btn-eliminar" @click.stop="eliminarFoto(index)" />

          <!-- PRINCIPAL -->

          <div v-if="index === 0" class="principal-chip">

            <v-icon size="13">

              mdi-star

            </v-icon>

            Principal

          </div>

          <!-- <button v-else type="button" class="btn-principal" @mousedown.stop @touchstart.stop @click.stop="establecerPrincipal(index)">

            <v-icon size="14">

              mdi-star-outline

            </v-icon>

            Principal df

          </button> -->

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

    <!-- AGREGAR FOTO -->

    <template #footer>

      <div v-if="fotos.length < MAX_FOTOS" class="foto-item">

        <button type="button" class="agregar-foto-card" @click="seleccionarFotos">

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

            {{ MAX_FOTOS - fotos.length === 1?'disponible' : 'disponibles' }}

          </div>

        </button>

      </div>

    </template>

  </draggable>

  <!-- INPUT OCULTO -->

  <input ref="inputFotos" type="file" accept="image/*" multiple hidden @change="procesarFotos" />

  <!-- INFORMACIÓN INFERIOR -->

  <v-alert type="info" variant="tonal" density="compact" class="info-alert inferior" icon="mdi-lightbulb-outline">

    <div class="info-texto">

      <strong>Consejo:</strong>

      usa fotos claras y de buena calidad donde se pueda apreciar

      el resultado de tu trabajo.

    </div>

  </v-alert>

  <!-- ACCIONES -->

  <div class="acciones">

    <v-btn variant="outlined" color="secondary" class="btn-accion" @click="$emit('anterior')">

      <v-icon start>

        mdi-arrow-left

      </v-icon>

      Atrás

    </v-btn>

    <v-btn color="primary" class="btn-accion" :disabled="fotos.length === 0" @click="siguiente">

      Siguiente

      <v-icon end>

        mdi-arrow-right

      </v-icon>

    </v-btn>

  </div>

</div>

<!-- =========================================

 VISOR DE FOTOS

========================================= -->

<v-dialog v-model="visorFoto" fullscreen transition="dialog-bottom-transition" scrim="black">

  <div class="visor-foto">

    <!-- CABECERA -->

    <div class="visor-header">

      <div class="visor-contador">

        {{ indiceFotoSeleccionada + 1 }}

        /

        {{ fotos.length }}

      </div>

      <v-btn icon="mdi-close" variant="text" size="large" class="visor-cerrar" @click="cerrarVisor" />

    </div>

    <!-- BOTÓN ANTERIOR -->

    <v-btn v-if="indiceFotoSeleccionada> 0" icon="mdi-chevron-left" variant="flat" class="visor-navegacion visor-anterior" @click.stop="fotoAnterior" />

    <!-- IMAGEN -->

    <div class="visor-imagen-container">

      <img v-if="fotoSeleccionada" :src="fotoSeleccionada.preview" alt="Vista previa" class="visor-imagen" />

    </div>

    <!-- BOTÓN SIGUIENTE -->

    <v-btn v-if="indiceFotoSeleccionada < fotos.length - 1" icon="mdi-chevron-right" variant="flat" class="visor-navegacion visor-siguiente" @click.stop="fotoSiguiente" />

    <!-- INDICADOR INFERIOR -->

    <div class="visor-footer">

      <span>

        Foto {{ indiceFotoSeleccionada + 1 }}

        de {{ fotos.length }}

      </span>

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

  name: "FotosAdmin",

  components: {

    draggable,

  },

  props: {

    // ========================================================

    // DATOS INICIALES

    // ========================================================

    datosIniciales: {

      type: Array,

      default: () => [],

    },

    // ========================================================

    // MODO

    // ========================================================

    modo: {

      type: String,

      default: "nuevo",

    },

    // ========================================================

    // ID DEL SERVICIO

    // ========================================================

    servicioId: {

      type: [Number, String],

      default: null,

    },

  },

  emits: [

    "anterior",

    "siguiente",

  ],

  data() {

    return {

      MAX_FOTOS: 5,

      fotos: [],

      visorFoto: false,

      fotoSeleccionada: null,

      indiceFotoSeleccionada: -1,

      procesando: false,

    };

  },

  watch: {

    // ========================================================

    // CARGAR FOTOS INICIALES

    // ========================================================

    datosIniciales: {

      immediate: true,

      deep: true,

      handler(nuevasFotos) {

        if (this.modo !== "editar") {

          return;

        }

        this.cargarFotosIniciales(nuevasFotos);

      },

    },

  },

  methods: {

    // ========================================================

    // CARGAR FOTOS EXISTENTES

    // ========================================================

    cargarFotosIniciales(fotos) {

      if (!Array.isArray(fotos)) {

        this.fotos = [];

        return;

      }

      this.fotos = fotos

        .map((foto, index) => {

          return {

            id: foto.id,

            servicio_id: foto.servicio_id,

            archivo_id: foto.archivo_id,

            tipo: foto.tipo,

            orden: Number(foto.orden) || index + 1,

            principal: Boolean(foto.principal),

            nombre: foto.nombre,

            url: foto.url,

            mime_type: foto.mime_type,

            tamano_bytes: foto.tamano_bytes,

            // ------------------------------------------------

            // Las existentes usan URL

            // ------------------------------------------------

            preview: this.obtenerUrlArchivo(foto.url),

            // ------------------------------------------------

            // Las nuevas tendrán File

            // ------------------------------------------------

            archivo: null,

            existente: true,

          };

        })

        .sort((a, b) => {

          return Number(a.orden) - Number(b.orden);

        });

      this.normalizarPrincipal();

    },

    // ========================================================

    // URL DEL ARCHIVO

    // ========================================================

    obtenerUrlArchivo(url) {

      if (!url) {

        return "";

      }

      if (

        url.startsWith("http://") ||

        url.startsWith("https://")

      ) {

        return url;

      }

      const baseUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

      return `${baseUrl}${url.startsWith("/")?"" : "/"}${url}`;

    },

    // ========================================================

    // ABRIR SELECTOR

    // ========================================================

    seleccionarFotos() {
      if (this.fotos.length >= this.MAX_FOTOS) {

        return;

      }

      this.$refs.inputFotos.click();

    },

    // ========================================================

    // PROCESAR FOTOS

    // ========================================================

    procesarFotos(event) {

      const archivos = Array.from(

        event.target.files || []

      );

      if (!archivos.length) {

        return;

      }

      const espacioDisponible =

        this.MAX_FOTOS - this.fotos.length;

      if (espacioDisponible <= 0) {

        event.target.value = "";

        return;

      }

      const archivosAgregar =

        archivos.slice(0, espacioDisponible);

      archivosAgregar.forEach((archivo) => {

        if (!archivo.type.startsWith("image/")) {

          return;

        }

        const foto = {

          id: `${Date.now()}-${Math.random()}`,

          archivo,

          preview: URL.createObjectURL(archivo),

          existente: false,

          servicio_id: null,

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

      });

      event.target.value = "";

      this.normalizarOrden();

      this.normalizarPrincipal();

    },

    // ========================================================

    // VISOR

    // ========================================================

    abrirVisor(foto) {

      const indice = this.fotos.findIndex(

        (item) => item.id === foto.id

      );

      this.indiceFotoSeleccionada = indice;

      this.fotoSeleccionada = foto;

      this.visorFoto = true;

    },

    cerrarVisor() {

      this.visorFoto = false;

      this.fotoSeleccionada = null;

      this.indiceFotoSeleccionada = -1;

    },

    fotoAnterior() {

      if (this.indiceFotoSeleccionada <= 0) {

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

    // ========================================================

    // ELIMINAR FOTO

    // ========================================================

    async eliminarFoto(index) {

      const foto = this.fotos[index];

      if (!foto) {

        return;

      }

      // ======================================================

      // FOTO NUEVA

      // ======================================================

      if (!foto.existente) {

        if (foto.preview) {

          URL.revokeObjectURL(foto.preview);

        }

        this.fotos.splice(index, 1);

        this.normalizarOrden();

        this.normalizarPrincipal();

        return;

      }

      // ======================================================

      // FOTO EXISTENTE

      // ======================================================

      if (!foto.id) {

        return;

      }

      this.procesando = true;

      try {

        await deleteServiceFile(foto.id);

        if (foto.preview) {

          // No revocamos URL remota

          if (foto.preview.startsWith("blob:")) {

            URL.revokeObjectURL(foto.preview);

          }

        }

        this.fotos.splice(index, 1);

        this.normalizarOrden();

        this.normalizarPrincipal();

        if (

          this.fotoSeleccionada?.id === foto.id

        ) {

          this.cerrarVisor();

        }

      } catch (error) {

        console.error(

          "Error eliminando fotografía:",

          error

        );

        this.$piaAlert?.error(

          error.response?.data?.message ||

          "No se pudo eliminar la fotografía."

        );

      } finally {

        this.procesando = false;

      }

    },

    // ========================================================

    // DRAG & DROP

    // ========================================================

    async ordenFotosCambio() {
      console.log("🔄 ORDEN DE FOTOS CAMBIÓ");

      // ------------------------------------------------------------
      // NUEVO SERVICIO
      // ------------------------------------------------------------
      // Si todavía no estamos editando un servicio guardado,
      // solamente actualizamos el orden visual.
      // ------------------------------------------------------------

      if (this.modo !== "editar") {
        this.normalizarOrden();
        return;
      }

      // ------------------------------------------------------------
      // EDITANDO SERVICIO
      // ------------------------------------------------------------

      this.procesando = true;

      try {
        /*
         * IMPORTANTE:
         *
         * No todas las fotos que aparecen en this.fotos
         * necesariamente existen todavía en la BD.
         *
         * Las fotos nuevas tienen:
         *
         *    existente === false
         *
         * Por eso solamente enviamos al backend las
         * fotos que ya existen.
         */

        const fotosExistentes = this.fotos.filter(
          (foto) => foto.existente === true
        );

        console.log(
          "📸 Fotos existentes para actualizar:",
          fotosExistentes
        );

        /*
         * El orden que se guarda en BD debe contar solamente
         * las fotos que ya existen.
         *
         * Ejemplo:
         *
         * UI:
         *
         * NUEVA
         * FOTO A
         * FOTO B
         * FOTO C
         *
         * En BD:
         *
         * FOTO A -> 1
         * FOTO B -> 2
         * FOTO C -> 3
         *
         * La NUEVA todavía no se manda.
         */

        // ============================================================
        // 1. ACTUALIZAR EL ORDEN DE TODAS LAS FOTOS
        // ============================================================

        for (let i = 0; i < fotosExistentes.length; i++) {
          const foto = fotosExistentes[i];

          const nuevoOrden = i + 1;

          console.log(
            `📌 Actualizando foto ${foto.id} -> orden ${nuevoOrden}`
          );

          await updateServiceFileOrder(
            foto.id,
            nuevoOrden
          );
        }

        // ============================================================
        // 2. ESTABLECER UNA SOLA FOTO COMO PRINCIPAL
        // ============================================================

        // La foto que está en la posición 1
        // es la imagen principal.

        const fotoPrincipal = fotosExistentes[0];

        if (fotoPrincipal) {
          console.log(
            `⭐ Estableciendo foto ${fotoPrincipal.id} como PRINCIPAL`
          );

          await setServiceFilePrincipal(
            fotoPrincipal.id
          );
        }

        // ------------------------------------------------------------
        // ACTUALIZAR ORDEN VISUAL
        // ------------------------------------------------------------

        this.normalizarOrden();

        /*
         * IMPORTANTE:
         *
         * NO llamamos normalizarPrincipal().
         *
         * Cambiar el orden NO debe cambiar la principal.
         */

        console.log("✅ Orden de fotos actualizado correctamente");

      } catch (error) {
        console.error(
          "❌ Error actualizando orden de fotografías:",
          error
        );

        this.$piaAlert?.error(
          error.response?.data?.message ||
          error.message ||
          "No se pudo actualizar el orden de las fotografías."
        );

      } finally {
        this.procesando = false;
      }
    },

    // ========================================================

    // NORMALIZAR ORDEN

    // ========================================================

    normalizarOrden() {

      this.fotos.forEach((foto, index) => {

        foto.orden = index + 1;

      });

    },

    // ========================================================

    // NORMALIZAR PRINCIPAL

    // ========================================================

    normalizarPrincipal() {

      if (!this.fotos.length) {

        return;

      }

      this.fotos.forEach((foto, index) => {

        foto.principal = index === 0;

      });

    },

    // ========================================================

    // ESTABLECER PRINCIPAL

    // ========================================================

    async establecerPrincipal(index) {

      if (index < 0 || index >= this.fotos.length) {
        return;
      }

      if (index === 0) {
        return;
      }

      const foto = this.fotos[index];

      if (!foto) {
        return;
      }

      console.log("⭐ ESTABLECER PRINCIPAL");
      console.log("⭐ INDEX:", index);
      console.log("⭐ FOTO:", foto);

      // Primero cambiamos la posición en pantalla.
      const [seleccionada] = this.fotos.splice(index, 1);
      this.fotos.unshift(seleccionada);

      this.normalizarOrden();
      this.normalizarPrincipal();

      // Una foto nueva todavía no existe en la base de datos.
      if (this.modo !== "editar" || !seleccionada.existente) {
        return;
      }

      this.procesando = true;

      try {
        // Guardar principal.
        await setServiceFilePrincipal(seleccionada.id);

        // Guardar el nuevo orden.
        for (let i = 0; i < this.fotos.length; i++) {
          const fotoActual = this.fotos[i];

          if (!fotoActual.existente || !fotoActual.id) {
            continue;
          }

          await updateServiceFileOrder(
            fotoActual.id,
            i + 1
          );
        }

        this.normalizarOrden();
        this.normalizarPrincipal();

      } catch (error) {
        console.error(
          "Error estableciendo foto principal:",
          error
        );

        this.$piaAlert?.error(
          error.response?.data?.message ||
          "No se pudo establecer la foto principal."
        );

      } finally {
        this.procesando = false;
      }
    },

    // SIGUIENTE

    // ========================================================

    async siguiente() {

      if (!this.fotos.length) {

        return;

      }

      // ========================================================

      // NORMALIZAR

      // ========================================================

      this.normalizarOrden();

      this.normalizarPrincipal();

      // ========================================================

      // NUEVO SERVICIO

      // ========================================================

      if (this.modo !== "editar") {

        this.$emit(

          "siguiente",

          this.fotos

        );

        return;

      }

      // ========================================================

      // VALIDAR SERVICIO

      // ========================================================

      if (!this.servicioId) {

        this.$piaAlert?.error(

          "No se encontró el servicio que se está editando."

        );

        return;

      }

      // ========================================================

      // BUSCAR FOTOS NUEVAS

      // ========================================================

      const fotosNuevas = this.fotos.filter(

        (foto) =>

        !foto.existente &&

        foto.archivo instanceof File

      );

      // ========================================================

      // SI NO HAY FOTOS NUEVAS

      // ========================================================

      if (!fotosNuevas.length) {

        this.$emit(

          "siguiente",

          this.fotos

        );

        return;

      }

      // ========================================================

      // SUBIR FOTOS

      // ========================================================

      this.procesando = true;

      try {

        const archivos = fotosNuevas.map(

          (foto) => foto.archivo

        );

        const respuesta =

          await uploadServiceFiles(

            this.servicioId,

            archivos

          );

        const archivosGuardados =

          respuesta.data?.data || [];

        // ======================================================

        // MARCAR LAS FOTOS COMO EXISTENTES

        // ======================================================

        archivosGuardados.forEach(

          (item, index) => {

            const fotoNueva =

              fotosNuevas[index];

            if (!fotoNueva) {

              return;

            }

            fotoNueva.existente = true;

            fotoNueva.id =

              item.relacion?.id;

            fotoNueva.archivo_id =

              item.archivo?.id;

            fotoNueva.servicio_id =

              this.servicioId;

            fotoNueva.url =

              item.archivo?.url || null;

            fotoNueva.nombre =

              item.archivo?.nombre ||

              fotoNueva.nombre;

            fotoNueva.mime_type =

              item.archivo?.mime_type ||

              fotoNueva.mime_type;

            fotoNueva.tamano_bytes =

              item.archivo?.tamano_bytes ||

              fotoNueva.tamano_bytes;

            fotoNueva.archivo = null;

            // La URL real viene del backend

            if (item.archivo?.url) {

              fotoNueva.preview =

                this.obtenerUrlArchivo(

                  item.archivo.url

                );

            }

          }

        );

        // ======================================================

        // CONTINUAR

        // ======================================================

        this.$emit(

          "siguiente",

          this.fotos

        );

      } catch (error) {

        console.error(

          "Error subiendo fotografías:",

          error

        );

        this.$piaAlert?.error(

          error.response?.data?.message ||

          "No se pudieron guardar las fotografías."

        );

      } finally {

        this.procesando = false;

      }

    },

  },

  // ==========================================================

  // LIMPIEZA

  // ==========================================================

  beforeUnmount() {

    this.fotos.forEach((foto) => {

      if (

        foto.preview &&

        foto.preview.startsWith("blob:")

      ) {

        URL.revokeObjectURL(

          foto.preview

        );

      }

    });

  },

};
</script>

<style lang="scss" scoped>
.fotos-container {

  width: 100%;

  padding: 18px 12px 24px;

}

/* ================================

 HEADER

================================ */

.seccion-header {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 16px;

}

.seccion-icono {

  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #edf6f6;

  color: #0f9b9d;

  flex-shrink: 0;

}

.seccion-header-texto {

  min-width: 0;

}

.seccion-titulo {

  font-size: 17px;

  font-weight: 700;

  color: #102a43;

}

.seccion-subtitulo {

  margin-top: 2px;

  font-size: 12px;

  line-height: 1.4;

  color: #627d98;

}

/* ================================

 ALERT

================================ */

.info-alert {

  margin-bottom: 18px;

  border-radius: 10px;

}

.info-texto {

  font-size: 11px;

  line-height: 1.45;

}

/* ================================

 CONTADOR

================================ */

.contador-container {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 12px;

}

.contador {

  font-size: 13px;

  font-weight: 700;

  color: #102a43;

}

.contador-info {

  display: flex;

  align-items: center;

  gap: 4px;

  font-size: 10px;

  color: #627d98;

}

/* ================================

 GRID

================================ */

.fotos-grid {

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 10px;

  width: 100%;

}

/* ================================

 FOTO

================================ */

.foto-item {

  min-width: 0;

}

.foto-card {

  position: relative;

  width: 100%;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  border-radius: 12px;

  background: #edf2f2;

  border: 1px solid #dce8e8;

  box-shadow: 0 2px 6px rgba(16, 42, 67, 0.08);

}

.foto-imagen {

  width: 100%;

  height: 100%;

  display: block;

  object-fit: cover;

}

/* ================================

 NUMERO

================================ */

.foto-numero {

  position: absolute;

  top: 8px;

  left: 8px;

  width: 26px;

  height: 26px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(16, 42, 67, 0.88);

  color: white;

  font-size: 11px;

  font-weight: 700;

  z-index: 3;

}

/* ================================

 ELIMINAR

================================ */

.btn-eliminar {

  position: absolute;

  top: 6px;

  right: 6px;

  width: 28px;

  height: 28px;

  background: rgba(255, 255, 255, 0.94);

  color: #d64545;

  z-index: 4;

}

/* ================================

 PRINCIPAL

================================ */

.principal-chip {

  position: absolute;

  left: 8px;

  bottom: 38px;

  display: flex;

  align-items: center;

  gap: 4px;

  padding: 4px 8px;

  border-radius: 20px;

  background: rgba(15, 155, 157, 0.95);

  color: white;

  font-size: 9px;

  font-weight: 700;

  z-index: 3;

}

.btn-principal {

  position: absolute;

  left: 8px;

  bottom: 38px;

  display: flex;

  align-items: center;

  gap: 4px;

  padding: 4px 8px;

  border: none;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.95);

  color: #0f8f8c;

  font-size: 9px;

  font-weight: 700;

  cursor: pointer;

  z-index: 10;

}

/* ================================

 FOOTER FOTO

================================ */

.foto-footer {

  position: absolute;

  left: 0;

  right: 0;

  bottom: 0;

  height: 32px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 8px;

  background: linear-gradient(to top,

      rgba(0, 0, 0, 0.72),

      rgba(0, 0, 0, 0.25));

  color: white;

  font-size: 9px;

  z-index: 2;

}

.drag-handle {

  cursor: grab;

  opacity: 0.9;

}

.drag-handle:active {

  cursor: grabbing;

}

/* ================================

 AGREGAR FOTO

================================ */

.agregar-foto-card {

  width: 100%;

  aspect-ratio: 1 / 1;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border: 2px dashed #b9d5d5;

  border-radius: 12px;

  background: #f8fbfb;

  color: #0f8f91;

  cursor: pointer;

  transition:

    border-color 0.2s ease,

    background 0.2s ease,

    transform 0.2s ease;

}

.agregar-foto-card:hover {

  border-color: #0f9b9d;

  background: #edf6f6;

}

.agregar-foto-card:active {

  transform: scale(0.98);

}

.agregar-icono {

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 8px;

  border-radius: 50%;

  background: #dff5f3;

  color: #0f9b9d;

}

.agregar-titulo {

  font-size: 12px;

  font-weight: 700;

}

.agregar-disponibles {

  margin-top: 3px;

  font-size: 10px;

  color: #627d98;

}

/* ================================

 DRAG & DROP

================================ */

.foto-ghost {

  opacity: 0.35;

}

.foto-chosen {

  transform: scale(1.02);

}

.foto-drag {

  transform: rotate(1deg);

}

/* ================================

 ALERT INFERIOR

================================ */

.inferior {

  margin-top: 18px;

  margin-bottom: 18px;

}

/* ================================

 ACCIONES

================================ */

.acciones {

  display: flex;

  gap: 10px;

  margin-top: 8px;

}

.btn-accion {

  flex: 1;

  height: 42px;

  border-radius: 10px;

  font-size: 12px;

  font-weight: 700;

}

/* ================================

 MOBILE

================================ */

@media (max-width: 360px) {

  .fotos-container {

    padding-left: 8px;

    padding-right: 8px;

  }

  .fotos-grid {

    gap: 8px;

  }

  .foto-footer {

    padding: 0 6px;

    font-size: 8px;

  }

  .foto-numero {

    width: 24px;

    height: 24px;

  }

}

/* ================================

 DESKTOP

================================ */

@media (min-width: 600px) {

  .fotos-grid {

    grid-template-columns: repeat(3, minmax(0, 1fr));

  }

}

/* ================================

 VISOR DE FOTO

================================ */

.foto-imagen {

  cursor: zoom-in;

}

.visor-foto {

  position: relative;

  width: 100%;

  height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  background: rgba(0, 0, 0, 0.96);

}

.visor-imagen {

  max-width: 100%;

  max-height: 100%;

  width: auto;

  height: auto;

  object-fit: contain;

  user-select: none;

}

.visor-cerrar {

  position: absolute;

  top: 12px;

  right: 12px;

  z-index: 10;

  color: white !important;

  background: rgba(255, 255, 255, 0.12);

}

/* =========================================

 VISOR DE FOTOS

========================================= */

.foto-imagen {

  cursor: zoom-in;

}

/* CONTENEDOR PRINCIPAL */

.visor-foto {

  position: relative;

  width: 100%;

  height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  background: rgba(0, 0, 0, 0.97);

  overflow: hidden;

}

/* =========================================

 CABECERA

========================================= */

.visor-header {

  position: absolute;

  top: 0;

  left: 0;

  right: 0;

  height: 64px;

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 20;

  background: linear-gradient(to bottom,

      rgba(0, 0, 0, 0.65),

      rgba(0, 0, 0, 0));

}

.visor-contador {

  padding: 6px 12px;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.12);

  color: white;

  font-size: 12px;

  font-weight: 700;

  backdrop-filter: blur(6px);

}

.visor-cerrar {

  position: absolute;

  top: 12px;

  right: 12px;

  color: white !important;

  background: rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(6px);

  z-index: 30;

}

/* =========================================

 IMAGEN

========================================= */

.visor-imagen-container {

  width: 100%;

  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 64px 0 48px;

  box-sizing: border-box;

}

.visor-imagen {

  max-width: 100%;

  max-height: 100%;

  width: auto;

  height: auto;

  object-fit: contain;

  user-select: none;

  border-radius: 4px;

}

/* =========================================

 NAVEGACIÓN

========================================= */

.visor-navegacion {

  position: absolute;

  top: 50%;

  transform: translateY(-50%);

  width: 44px !important;

  height: 44px !important;

  min-width: 44px !important;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.14) !important;

  color: white !important;

  backdrop-filter: blur(8px);

  z-index: 25;

  transition:

    background 0.2s ease,

    transform 0.2s ease;

}

.visor-navegacion:hover {

  background: rgba(255, 255, 255, 0.25) !important;

  transform: translateY(-50%) scale(1.05);

}

.visor-anterior {

  left: 12px;

}

.visor-siguiente {

  right: 12px;

}

/* =========================================

 FOOTER

========================================= */

.visor-footer {

  position: absolute;

  left: 0;

  right: 0;

  bottom: 0;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: rgba(255, 255, 255, 0.75);

  font-size: 11px;

  background: linear-gradient(to top,

      rgba(0, 0, 0, 0.65),

      rgba(0, 0, 0, 0));

  z-index: 20;

}

/* =========================================

 MÓVIL

========================================= */

@media (max-width: 600px) {

  .visor-imagen-container {

    padding: 64px 0 48px;

  }

  .visor-navegacion {

    width: 40px !important;

    height: 40px !important;

    min-width: 40px !important;

  }

  .visor-anterior {

    left: 8px;

  }

  .visor-siguiente {

    right: 8px;

  }

}
</style>
