<template>
<div class="servicios-page">

  <!-- =========================
         ENCABEZADO
    ========================== -->
  <div class="page-header">
    <div>
      <h1 class="page-title">
        Servicios
      </h1>

      <p class="page-subtitle">
        Gestiona los servicios que ofreces
      </p>
    </div>

    <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-plus" class="nuevo-servicio-btn" @click="nuevoServicio">
      Nuevo servicio
    </v-btn>
  </div>

  <!-- =========================
         BUSCADOR
    ========================== -->
  <v-text-field v-model="busqueda" placeholder="Buscar servicio..." prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" rounded="lg" hide-details clearable class="buscador" />

  <!-- =========================
         FILTROS
    ========================== -->
  <div class="filtros">
    <v-btn v-for="filtro in filtros" :key="filtro.value" :variant="filtroActual === filtro.value ? 'tonal' : 'text'" :color="filtroActual === filtro.value ? 'primary' : undefined" rounded="lg" size="small" @click="filtroActual = filtro.value">
      {{ filtro.label }}

      <span class="filtro-cantidad">
        {{ contarServicios(filtro.value) }}
      </span>
    </v-btn>
  </div>

  <!-- =========================
         LISTA DE SERVICIOS
    ========================== -->
  <div v-if="serviciosFiltrados.length" class="lista-servicios">
    <v-card v-for="servicio in serviciosFiltrados" :key="servicio.id" variant="flat" class="servicio-item">
      <div class="servicio-contenido">

        <!-- Imagen -->
        <div class="servicio-imagen-container">
          <v-img v-if="imagenPrincipal(servicio)" :src="imagenPrincipal(servicio)" cover class="servicio-imagen" :key="imagenPrincipal(servicio)"/>
          
          <div v-else class="servicio-imagen-placeholder">
            <v-icon size="27" color="primary">
              mdi-content-cut
            </v-icon>
          </div>
        </div>

        <!-- Información -->
        <div class="servicio-info">

          <div class="servicio-nombre">
            {{ servicio.nombre }}
          </div>

          <div class="servicio-meta">

            <span>
              {{ servicio.duracion }} min

              <span class="separador">
                •
              </span>

              Bs. {{ Number(servicio.precio).toFixed(2) }}
            </span>

            <v-chip class="ms-4" :color="colorEstado(servicio.estado)" size="small" variant="tonal" rounded="lg">
              {{ textoEstado(servicio.estado) }}
            </v-chip>

          </div>

        </div>

        <!-- Tres puntitos -->
        <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="secondary" class="boton-opciones" @click="abrirOpciones(servicio)" />

      </div>
    </v-card>
  </div>

  <!-- =========================
         ESTADO VACÍO
    ========================== -->
  <v-card v-else variant="tonal" color="primary" rounded="xl" class="estado-vacio">
    <v-icon size="56" color="primary">
      mdi-content-cut
    </v-icon>

    <h2>
      {{
          busqueda
            ? "No encontramos servicios"
            : "Aún no tienes servicios"
        }}
    </h2>

    <p>
      {{
          busqueda
            ? "Prueba con otro nombre."
            : "Crea tu primer servicio para comenzar."
        }}
    </p>

    <v-btn v-if="!busqueda" color="primary" rounded="lg" prepend-icon="mdi-plus" @click="nuevoServicio">
      Crear servicio
    </v-btn>
  </v-card>

  <!-- =================================================
         BOTTOM SHEET
         OPCIONES DEL SERVICIO
    ================================================== -->
  <v-bottom-sheet v-model="mostrarOpciones" inset>
    <v-card rounded="t-xl" class="sheet-opciones">

      <!-- Indicador superior -->
      <div class="sheet-indicador"></div>

      <!-- Encabezado -->
      <div class="sheet-header">
        <div>
          <div class="sheet-titulo">
            {{ servicioSeleccionado?.nombre }}
          </div>

          <div class="sheet-subtitulo">
            {{ servicioSeleccionado?.duracion }} min
            <span>•</span>
            Bs. {{ Number(servicioSeleccionado?.precio || 0).toFixed(2) }}
          </div>
        </div>

        <v-btn icon="mdi-close" variant="tonal" color="secondary" size="small" @click="cerrarOpciones" />
      </div>

      <v-divider />

      <!-- =========================
             OPCIONES
        ========================== -->
      <v-list nav class="lista-opciones">

        <!-- Editar -->
        <v-list-item prepend-icon="mdi-pencil-outline" title="Editar servicio" @click="editarServicio" />

        <!-- Detalle -->
        <v-list-item prepend-icon="mdi-clock-outline" title="Ver detalle" @click="verDetalle" />

        <!-- Condición -->
        <v-list-item prepend-icon="mdi-image-filter-drama-outline" title="Gestionar condición" @click="gestionarCondicion">
          <template #subtitle>
            {{
              servicioSeleccionado?.condiciones?.length
                ? "Tiene una condición"
                : "Sin condición configurada"
            }}
          </template>
        </v-list-item>

        <!-- Fotos -->
        <v-list-item prepend-icon="mdi-image-multiple-outline" title="Agregar fotos" @click="agregarFotos">
          <template #subtitle>
            {{
              servicioSeleccionado?.archivos?.filter(
                (archivo) => archivo.tipo === "FOTO"
              ).length || 0
            }}/5 fotos
          </template>
        </v-list-item>

        <!-- Videos -->
        <v-list-item prepend-icon="mdi-video-outline" title="Agregar videos" @click="agregarVideos">
          <template #subtitle>
            {{
              servicioSeleccionado?.archivos?.filter(
                (archivo) => archivo.tipo === "VIDEO"
              ).length || 0
            }}/2 videos
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- Desactivar -->
        <v-list-item v-if="servicioSeleccionado?.estado === 'HABILITADO'" prepend-icon="mdi-power" title="Desactivar servicio" class="opcion-peligro" @click="desactivarServicio" />

        <!-- Activar -->
        <v-list-item v-else prepend-icon="mdi-power" title="Activar servicio" class="opcion-exito" @click="activarServicio" />

      </v-list>

      <!-- Cancelar -->
      <div class="sheet-footer">
        <v-btn block variant="tonal" color="error" prepend-icon="mdi-close" append-icon="mdi-chevron-right" rounded="lg" size="large" @click="cerrarOpciones">
          Cancelar
        </v-btn>
      </div>

    </v-card>
  </v-bottom-sheet>

</div>

<!-- =================================================
     BOTTOM SHEET
     GESTIONAR CONDICIÓN
================================================== -->
<EditarCondicionAdmin
  v-model="mostrarCondicion"
  :condicionId="servicioSeleccionado?.condicion?.id || null"
  @guardado="condicionGuardada"
/>

<EditarFotosAdmin
  v-model="mostrarFotos"
  :servicio-id="servicioSeleccionado?.id"
  :fotos-iniciales="servicioSeleccionado?.archivos || []"
  @guardado="fotosGuardadas"
/>

<EditarVideosAdmin
  v-model="mostrarVideos"
  :servicio-id="servicioSeleccionado?.id"
  :videos-iniciales="
    servicioSeleccionado?.archivos?.filter(
      archivo => archivo.tipo === 'VIDEO'
    ) || []
  "
  @guardado="videosGuardados"
/>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>
</template>

<script>
import { urlQrGerencia } from '@/utils/ayuda';
import { getServices, updateServiceStatus, } from "../services/servicio.api";
import EditarCondicionAdmin from '../components/EditarCondicionAdmin.vue';
import EditarFotosAdmin from '../components/EditarFotosAdmin.vue';
import EditarVideosAdmin from '../components/EditarVideosAdmin.vue';

export default {
  name: "ServiciosAdminPage",

  components:{
    EditarCondicionAdmin,
    EditarFotosAdmin,
    EditarVideosAdmin,
  },

  data() {
    return {
      busqueda: "",

      filtroActual: "TODOS",

      mostrarOpciones: false,

      servicioSeleccionado: null,

      mostrarCondicion: false,

      mostrarFotos: false,

      mostrarVideos: false,

      filtros: [{
          label: "Todos",
          value: "TODOS",
        },
        {
          label: "Activos",
          value: "ACTIVOS",
        },
        {
          label: "Inactivos",
          value: "INACTIVOS",
        },
      ],

      /*
       * DATOS TEMPORALES
       *
       * Posteriormente serán reemplazados
       * por los datos reales del backend.
       */
      servicios: [],

      overlay: false,
    };
  },

  computed: {
    serviciosFiltrados() {
      let resultado = [...this.servicios];

      /*
       * FILTRO POR ESTADO
       */
      if (this.filtroActual === "ACTIVOS") {
        resultado = resultado.filter(
          (servicio) => servicio.estado === "HABILITADO",
        );
      }

      if (this.filtroActual === "INACTIVOS") {
        resultado = resultado.filter(
          (servicio) => servicio.estado === "DESHABILITADO",
        );
      }

      /*
       * BUSQUEDA
       */
      if (this.busqueda.trim()) {
        const texto = this.busqueda.toLowerCase().trim();

        resultado = resultado.filter((servicio) =>
          servicio.nombre.toLowerCase().includes(texto),
        );
      }

      return resultado;
    },
  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {
    urlQrGerencia,   

    condicionGuardada(condicion) {
      if (!this.servicioSeleccionado) {
        return;
      }

      // Actualizamos la condición local del servicio
      this.servicioSeleccionado.condiciones = condicion
        ? [condicion]
        : [];

      // Actualizamos también el servicio dentro de la lista
      const indice = this.servicios.findIndex(
        servicio => servicio.id === this.servicioSeleccionado.id
      );
      if (indice !== -1) {
        this.servicios[indice].condiciones = condicion
          ? [condicion]
          : [];
      }
    },

    imagenPrincipal(servicio) {
      const archivo = servicio?.archivos?.find(
        (archivo) =>
          archivo.tipo === "FOTO" &&
          archivo.principal === true
      );

      return archivo?.url
        ? `http://localhost:3000${archivo.url}`
        : null;
    },

    /*
     * =========================
     * CONTADORES
     * =========================
     */

    contarServicios(filtro) {
      if (filtro === "TODOS") {
        return this.servicios.length;
      }

      if (filtro === "ACTIVOS") {
        return this.servicios.filter(
          (servicio) => servicio.estado === "HABILITADO",
        ).length;
      }

      if (filtro === "INACTIVOS") {
        return this.servicios.filter(
          (servicio) => servicio.estado === "DESHABILITADO",
        ).length;
      }

      return 0;
    },

    /*
     * =========================
     * ESTADO
     * =========================
     */

    colorEstado(estado) {
      switch (estado) {
        case "HABILITADO":
          return "success";

        case "DESHABILITADO":
          return "error";

        default:
          return "grey";
      }
    },

    textoEstado(estado) {
      switch (estado) {
        case "HABILITADO":
          return "Activo";

        case "DESHABILITADO":
          return "Inactivo";

        default:
          return estado;
      }
    },

    /*
     * =========================
     * BOTTOM SHEET
     * =========================
     */

    abrirOpciones(servicio) {
      this.servicioSeleccionado = servicio;
      this.mostrarOpciones = true;
    },

    cerrarOpciones() {
      this.mostrarOpciones = false;
    },

    /*
     * =========================
     * NAVEGACIÓN
     * =========================
     */
    nuevoServicio() {
      this.$router.push({
        name: "servicios-nuevo",
      });
    },

    editarServicio() {
      const servicio = this.servicioSeleccionado;

      this.cerrarOpciones();

      this.$router.push({
        name: "servicios-editar",
        params: {
          id: servicio.id,
        },
      });
    },

    verDetalle() {
      const servicio = this.servicioSeleccionado;

      this.cerrarOpciones();

      this.$router.push({
        name: "servicios-detalle",
        params: {
          id: servicio.id,
        },
      });
    },

    gestionarCondicion() {
      if (!this.servicioSeleccionado) {
        return;
      }
      this.cerrarOpciones();
      this.mostrarCondicion = true;
    },

    agregarFotos() {
      if (!this.servicioSeleccionado) {
        return;
      }
      this.cerrarOpciones();
      this.mostrarFotos = true
    },

    async fotosGuardadas() {
      this.mostrarFotos = false;
      await this.obtenerServicios();
    },

    agregarVideos() {
      if (!this.servicioSeleccionado) {
        return;
      }
      this.cerrarOpciones();
      this.mostrarVideos = true
    },

    async videosGuardados() {
      this.mostrarVideos = false
      await this.obtenerServicios();
    },

    /*
     * =========================
     * ACTIVAR / DESACTIVAR
     * =========================
     */

    async desactivarServicio() {
      const servicio = this.servicioSeleccionado;

      if (!servicio) {
        return;
      }

      this.cerrarOpciones();
      this.overlay = true;

      try {
        const res = await updateServiceStatus(
          servicio.id,
          "DESHABILITADO",
        );

        if (res.data?.ok) {
          await this.obtenerServicios();

          this.$piaAlert.success(
            "El servicio fue deshabilitado correctamente",
          );
        }
      } catch (error) {
        console.error("Error al deshabilitar servicio:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "No se pudo deshabilitar el servicio",
        );
      } finally {
        this.overlay = false;
      }
    },

    async activarServicio() {
      const servicio = this.servicioSeleccionado;

      if (!servicio) {
        return;
      }

      this.cerrarOpciones();
      this.overlay = true;

      try {
        const res = await updateServiceStatus(
          servicio.id,
          "HABILITADO",
        );

        if (res.data?.ok) {
          await this.obtenerServicios();

          this.$piaAlert.success(
            "El servicio fue habilitado correctamente",
          );
        }
      } catch (error) {
        console.error("Error al habilitar servicio:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "No se pudo habilitar el servicio",
        );
      } finally {
        this.overlay = false;
      }
    },

    /*
     * =========================
     * OBTENER SERVICIOS
     * =========================
     */
    async obtenerServicios() {
      try {
        this.overlay = true

        const res = await getServices()
        if (res.data.ok) {
          this.servicios = res.data.data
        }
      } catch (error) {
        console.log(error)
        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado"
        );
      } finally {
        this.overlay = false
      }
    },
  },

  mounted() {
    this.obtenerServicios()
  }
};
</script>

<style lang="scss" scoped>
.servicios-page {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  color: #102a43;
}

/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
  color: #102a43;
}

.page-subtitle {
  margin: 5px 0 0;
  font-size: 14px;
  color: #627d98;
}

.nuevo-servicio-btn {
  min-height: 44px;
  white-space: nowrap;
}

/* =========================
   BUSCADOR
========================= */

.buscador {
  margin-bottom: 10px;
}

/* =========================
   FILTROS
========================= */

.filtros {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 2px 0 10px;
  scrollbar-width: none;
}

.filtros::-webkit-scrollbar {
  display: none;
}

.filtro-cantidad {
  margin-left: 5px;
  opacity: 0.7;
}

/* =========================
   LISTA
========================= */

.lista-servicios {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eaf7f6;
}

.servicio-item {
  border-bottom: 1px solid #eaf7f6;
  border-radius: 0 !important;
  background: #ffffff;
}

.servicio-contenido {
  display: flex;
  align-items: center;
  min-height: 78px;
  gap: 10px;
  padding: 9px 2px;
}

/* =========================
   IMAGEN
========================= */

.servicio-imagen-container {
  flex: 0 0 58px;
  width: 58px;
  height: 58px;
}

.servicio-imagen {
  width: 58px;
  height: 58px;
  border-radius: 10px;
}

.servicio-imagen-placeholder {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eaf7f6;
}

/* =========================
   INFORMACIÓN
========================= */

.servicio-info {
  min-width: 0;
  flex: 1;
}

.servicio-nombre {
  font-size: 14px;
  font-weight: 700;
  color: #102a43;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.servicio-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #627d98;
}

.separador {
  margin: 0 4px;
}

/* =========================
   ESTADO
========================= */

.servicio-estado {
  flex-shrink: 0;
}

.servicio-estado :deep(.v-chip) {
  font-size: 11px;
}

/* =========================
   BOTÓN 3 PUNTOS
========================= */

.boton-opciones {
  flex-shrink: 0;
}

/* =========================
   BOTTOM SHEET
========================= */

.sheet-opciones {
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

.sheet-indicador {
  width: 38px;
  height: 4px;
  margin: 10px auto 4px;
  border-radius: 10px;
  background: #cbd5e1;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
}

.sheet-titulo {
  font-size: 18px;
  font-weight: 700;
  color: #102a43;
}

.sheet-subtitulo {
  margin-top: 4px;
  font-size: 13px;
  color: #627d98;
}

.sheet-subtitulo span {
  margin: 0 5px;
}

.lista-opciones {
  padding: 8px 12px 4px;
}

.lista-opciones :deep(.v-list-item) {
  min-height: 58px;
  border-radius: 12px;
  margin-bottom: 2px;
}

.lista-opciones :deep(.v-list-item-title) {
  font-size: 14px;
  font-weight: 600;
}

.lista-opciones :deep(.v-list-item-subtitle) {
  font-size: 12px;
  color: #627d98;
}

.lista-opciones :deep(.v-list-item__prepend .v-icon) {
  color: #0f8f8c;
}

.opcion-peligro {
  color: #d9534f !important;
}

.opcion-peligro :deep(.v-icon) {
  color: #d9534f !important;
}

.opcion-exito {
  color: #16a6a0 !important;
}

.opcion-exito :deep(.v-icon) {
  color: #16a6a0 !important;
}

.sheet-footer {
  padding: 8px 18px 18px;
}

/* =========================
   ESTADO VACÍO
========================= */

.estado-vacio {
  min-height: 280px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.estado-vacio h2 {
  margin-top: 15px;
  font-size: 20px;
  color: #102a43;
}

.estado-vacio p {
  margin: 8px 0 20px;
  color: #627d98;
  font-size: 14px;
}

/* =========================
   MÓVIL
========================= */

@media (max-width: 600px) {
  .servicios-page {
    max-width: 100%;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .nuevo-servicio-btn {
    width: 100%;
  }

  .servicio-contenido {
    min-height: 70px;
    gap: 7px;
  }

  .servicio-imagen-container,
  .servicio-imagen,
  .servicio-imagen-placeholder {
    width: 54px;
    height: 54px;
  }

  .servicio-estado :deep(.v-chip) {
    font-size: 10px;
  }

  .sheet-opciones {
    border-radius: 22px 22px 0 0 !important;
  }

  .sheet-header {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
