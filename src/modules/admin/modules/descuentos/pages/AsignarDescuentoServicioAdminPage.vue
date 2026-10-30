<template>
<v-container fluid class="asignar-page">

  <!-- ENCABEZADO -->
  <div class="page-header">
    <v-btn icon="mdi-arrow-left" variant="text" size="small" aria-label="Volver" @click="$router.back()" />

    <div class="header-text">
      <h2>Asignar Descuento</h2>
      <p>Selecciona un servicio para aplicar el descuento.</p>
    </div>
  </div>

  <!-- DESCUENTO -->
  <v-card v-if="descuento" class="descuento-resumen" variant="flat" rounded="xl">
    <div class="descuento-icon">
      <v-icon icon="mdi-tag-minus" size="27" />
    </div>

    <div class="descuento-info">
      <div class="descuento-cabecera">
        <div class="descuento-titulo">
          {{ descuento.titulo || descuento.codigo }}
        </div>
        <v-chip :color="descuento.estado === 'ACTIVO'?'success' : 'grey'" size="x-small" variant="tonal" class="estado-chip">
          {{ descuento.estado }}
        </v-chip>
      </div>
      <div class="descuento-descripcion">

        {{ descuento.descripcion || "Descuento especial para tus clientes" }}

      </div>

      <div class="descuento-pie">

        <div class="descuento-valor">

          <template v-if="descuento.porcentaje != null">

            {{ descuento.porcentaje }}% de descuento

          </template>

          <template v-else-if="descuento.monto != null">

            Bs. {{ formatoPrecio(descuento.monto) }} de descuento

          </template>

        </div>

        <v-icon icon="mdi-tag-outline" size="17" class="descuento-tag" />

      </div>

    </div>

  </v-card>

  <!-- TÍTULO Y CONTADOR -->

  <div class="lista-header">

    <div>

      <h3>Servicios disponibles</h3>

      <p>{{ serviciosSeleccionados.length }} seleccionados</p>

    </div>

    <v-btn variant="text" color="primary" size="small" class="seleccionar-btn" :disabled="cargando || !serviciosFiltrados.length" @click="seleccionarVisibles">

      Seleccionar visibles

    </v-btn>

  </div>

  <!-- BUSCADOR -->

  <v-text-field v-model="busqueda" placeholder="Buscar servicios..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" rounded="lg" clearable hide-details class="buscador" />

  <!-- FILTRO ACTUAL -->

  <div class="filtro-resumen">

    <v-chip size="small" color="primary" variant="tonal">

      Todos

    </v-chip>

    <span>{{ serviciosFiltrados.length }} servicios</span>

  </div>

  <!-- CARGA -->

  <div v-if="cargando" class="estado-lista">

    <v-progress-circular indeterminate color="primary" size="32" />

    <p>Cargando servicios...</p>

  </div>

  <!-- SIN RESULTADOS -->

  <v-card v-else-if="serviciosFiltrados.length === 0" variant="outlined" rounded="xl" class="vacio-card">

    <v-icon icon="mdi-magnify" size="34" color="grey" />

    <p>

      No se encontraron servicios.

    </p>

  </v-card>

  <!-- LISTA COMPACTA -->

  <v-card v-else variant="outlined" rounded="xl" class="lista-servicios">

    <div v-for="servicio in serviciosFiltrados" :key="servicio.servicio_id" class="servicio-wrapper">

      <div class="servicio-fila" role="button" tabindex="0" @click="abrirDetalleServicio(servicio)" @keydown.enter="abrirDetalleServicio(servicio)">

        <!-- IMAGEN DEL SERVICIO -->

        <div class="servicio-imagen">

          <v-img v-if="servicio.imagen_url" :src="getFileUrl(servicio.imagen_url)" :alt="servicio.servicio_nombre" cover width="100%" height="100%" class="imagen-real" />

          <v-icon v-else icon="mdi-image-outline" size="24" color="grey-lighten-1" />

        </div>

        <!-- INFORMACIÓN -->

        <div class="servicio-datos">

          <div class="servicio-nombre">

            {{ servicio.servicio_nombre }}

          </div>

          <div v-if="servicio.servicio_descripcion" class="servicio-descripcion">

            {{ servicio.servicio_descripcion }}

          </div>

          <div class="servicio-detalles">

            <span>

              <v-icon icon="mdi-clock-outline" size="13" />

              {{ servicio.duracion }} min

            </span>

            <strong>

              Bs. {{ formatoPrecio(servicio.precio) }}

            </strong>

          </div>

          <div v-if="!servicioHabilitado(servicio)" class="servicio-inactivo">

            Servicio deshabilitado

          </div>

        </div>

        <!-- CHECK SUPERIOR DERECHO -->

        <v-checkbox-btn :model-value="estaSeleccionado(servicio.servicio_id)" :disabled="guardando || !servicioHabilitado(servicio)" color="primary" class="servicio-checkbox" @update:model-value="

          cambiarSeleccion(servicio, $event)

        " />

      </div>

      <!-- CONFIGURACIÓN DEL DESCUENTO -->

      <div v-if="estaSeleccionado(servicio.servicio_id)" class="configuracion-servicio">

        <div class="configuracion-titulo">

          ¿A quién se aplica?

        </div>

        <v-btn-toggle :model-value="tiposDescuento[servicio.servicio_id]" mandatory divided color="primary" variant="outlined" rounded="lg" density="compact" class="tipo-toggle" :disabled="guardando" @update:model-value="

          cambiarTipo(servicio.servicio_id, $event)

        ">

          <v-btn value="PUBLICO" size="small">

            <v-icon icon="mdi-earth" size="16" class="mr-1" />

            Público

          </v-btn>

          <v-btn value="CLIENTE" size="small">

            <v-icon icon="mdi-account" size="16" class="mr-1" />

            Cliente

          </v-btn>

        </v-btn-toggle>

      </div>

    </div>

  </v-card>

  <!-- ESPACIO PARA LA NAVEGACIÓN INFERIOR -->

  <div class="espacio-inferior" />

  <!-- BOTÓN FIJO -->

  <div class="barra-guardar">

    <div class="resumen-guardar">

      <span>Servicios seleccionados</span>

      <strong>{{ serviciosSeleccionados.length }}</strong>

    </div>

    <v-btn block color="primary" rounded="lg" size="large" prepend-icon="mdi-content-save-outline" :loading="guardando" :disabled="cargando || guardando || !descuentoId" @click="guardar">

      Guardar servicios ({{ serviciosSeleccionados.length }})

    </v-btn>

  </div>

</v-container>

<!-- DETALLE DEL SERVICIO Y SU RELACION CON EL DESCUENTO -->
<v-bottom-sheet v-model="sheetDetalleServicio">
  <v-card v-if="servicioDetalle" class="detalle-sheet" rounded="t-xl">
    <div class="sheet-indicador"></div>
    <div class="sheet-header">
      <div>
        <h3>Detalle del servicio</h3>
        <p>Información de su relación con este descuento</p>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar detalle" @click="sheetDetalleServicio = false" />
    </div>
    <div class="detalle-servicio-cabecera">
      <div class="detalle-imagen">
        <v-img v-if="servicioDetalle.imagen_url" :src="getFileUrl(servicioDetalle.imagen_url)" :alt="servicioDetalle.servicio_nombre" cover />
        <v-icon v-else icon="mdi-image-outline" size="30" color="grey" />
      </div>
      <div class="detalle-servicio-info">
        <strong>{{ servicioDetalle.servicio_nombre }}</strong>
        <span>
          <v-icon icon="mdi-clock-outline" size="15" /> {{ servicioDetalle.duracion }} min</span>
        <b>Bs. {{ formatoPrecio(servicioDetalle.precio) }}</b>
      </div>
    </div>
    <p v-if="servicioDetalle.servicio_descripcion" class="detalle-descripcion">{{ servicioDetalle.servicio_descripcion }}</p>
    <div class="relacion-descuento">
      <div class="relacion-cabecera">
        <div class="relacion-icono">
          <v-icon icon="mdi-tag-minus" size="25" />
        </div>

        <div class="relacion-titulo">
          <span class="relacion-etiqueta">Descuento relacionado</span>
          <strong>{{ descuento?.titulo || descuento?.codigo || 'Descuento actual' }}</strong>
        </div>

        <v-chip size="small" :color="estaSeleccionado(servicioDetalle.servicio_id)?'success' : 'grey'" variant="tonal" class="relacion-chip">
          {{ estaSeleccionado(servicioDetalle.servicio_id)?'Elejido' : 'No elejido' }}
        </v-chip>             
      </div>

      <div class="relacion-contenido">
        <p>{{ descuento?.descripcion || 'Descuento asociado a este servicio.' }}</p>

        <b v-if="descuento?.porcentaje != null">
          {{ descuento.porcentaje }}% de descuento
        </b>
        <b v-else-if="descuento?.monto != null">
          Bs. {{ formatoPrecio(descuento.monto) }} de descuento
        </b>
        <b v-else>Descuento configurado</b>
      </div>
    </div>
    <div v-if="estaSeleccionado(servicioDetalle.servicio_id)" class="detalle-tipo">
      <h4>¿A quién se aplica este descuento?</h4>
      <v-btn-toggle :model-value="tiposDescuento[servicioDetalle.servicio_id] || 'PUBLICO'" mandatory divided color="primary" variant="outlined" rounded="lg" class="tipo-toggle-detalle" :disabled="guardando" @update:model-value="cambiarTipo(servicioDetalle.servicio_id, $event)">
        <v-btn value="PUBLICO">
          <v-icon icon="mdi-earth" class="mr-1" /> Público</v-btn>
        <v-btn value="CLIENTE">
          <v-icon icon="mdi-account" class="mr-1" /> Cliente</v-btn>
      </v-btn-toggle>
    </div>
    <div v-else class="detalle-no-seleccionado">Selecciona este servicio en la lista para relacionarlo con el descuento. Los cambios se aplican al guardar.</div>
    <v-btn block variant="outlined" color="primary" rounded="lg" class="cerrar-detalle" @click="sheetDetalleServicio = false">Cerrar detalle</v-btn>
  </v-card>
</v-bottom-sheet>
</template>

<script>
import {

  getServiciosPorDescuento,

  guardarServiciosPorDescuento,

} from "../services/descuentoServicio.api";

import {

  getDescuento,

} from "../services/descuento.api";
import { getFileUrl } from "@/utils/ayuda";

export default {

  name: "AsignarDescuentoServicioAdminPage",

  data() {

    return {

      cargando: false,

      guardando: false,

      descuentoId: null,

      descuento: null,

      servicios: [],

      seleccionados: [],

      tiposDescuento: {},

      busqueda: "",
      sheetDetalleServicio: false,
      servicioDetalle: null,

    };

  },

  computed: {

    serviciosSeleccionados() {

      return this.servicios.filter((servicio) =>

        this.seleccionados.includes(servicio.servicio_id)

      );

    },

    serviciosFiltrados() {

      const texto = (this.busqueda || "")

        .trim()

        .toLowerCase();

      if (!texto) {

        return this.servicios;

      }

      return this.servicios.filter((servicio) => {

        const nombre = (

          servicio.servicio_nombre || ""

        ).toLowerCase();

        const descripcion = (

          servicio.servicio_descripcion || ""

        ).toLowerCase();

        return (

          nombre.includes(texto) ||

          descripcion.includes(texto)

        );

      });

    },

  },

  created() {

    this.descuentoId = Number(

      this.$route.params.descuentoId ||

      this.$route.params.id

    );

    if (

      !Number.isInteger(this.descuentoId) ||

      this.descuentoId <= 0

    ) {

      this.mostrarError("No se recibió un descuento válido.");

      return;

    }

    this.cargarDatos();

  },

  methods: {
    getFileUrl,
    async cargarDatos() {

      this.cargando = true;

      try {

        const [respuestaDescuento, respuestaServicios] = await Promise.all([
          getDescuento(this.descuentoId),
          getServiciosPorDescuento(this.descuentoId),
        ]);

        const descuentoRespuesta = respuestaDescuento.data;
        const serviciosRespuesta = respuestaServicios.data;
        this.descuento = descuentoRespuesta?.data?? descuentoRespuesta;
        const listaServicios = serviciosRespuesta?.data?? serviciosRespuesta;

        if (!Array.isArray(listaServicios)) {

          throw new Error(

            "La respuesta de servicios no tiene el formato esperado."

          );

        }

        this.servicios = listaServicios;

        this.seleccionados = [];

        this.tiposDescuento = {};

        for (const servicio of this.servicios) {

          const servicioId = Number(servicio.servicio_id);

          this.tiposDescuento[servicioId] =

            servicio.tipo_descuento || "PUBLICO";

          if (

            servicio.servicio_descuento_id &&

            servicio.estado_descuento_servicio === "ACTIVO"

          ) {

            this.seleccionados.push(servicioId);

          }

        }

      } catch (error) {

        console.error("Error al cargar servicios del descuento:", error);

        this.mostrarError(

          error.response?.data?.mensaje ||

          error.response?.data?.error ||

          error.message ||

          "No fue posible cargar los servicios."

        );

      } finally {

        this.cargando = false;

      }

    },

    estaSeleccionado(servicioId) {

      return this.seleccionados.includes(Number(servicioId));

    },

    servicioHabilitado(servicio) {

      return servicio.servicio_estado === "HABILITADO";

    },

    cambiarSeleccion(servicio, seleccionado) {

      const servicioId = Number(servicio.servicio_id);

      if (!this.servicioHabilitado(servicio)) {

        return;

      }

      if (seleccionado) {

        if (!this.seleccionados.includes(servicioId)) {

          this.seleccionados.push(servicioId);

        }

        if (!this.tiposDescuento[servicioId]) {

          this.tiposDescuento[servicioId] = "PUBLICO";

        }

      } else {

        this.seleccionados = this.seleccionados.filter(

          (id) => id !== servicioId

        );

      }

    },

    cambiarTipo(servicioId, tipo) {

      if (!tipo || !["PUBLICO", "CLIENTE"].includes(tipo)) {

        return;

      }

      this.tiposDescuento[servicioId] = tipo;

    },

    seleccionarVisibles() {

      const todosSeleccionados =

        this.serviciosFiltrados.length > 0 &&

        this.serviciosFiltrados.every((servicio) =>

          this.estaSeleccionado(servicio.servicio_id)

        );

      if (todosSeleccionados) {

        const idsVisibles = this.serviciosFiltrados

          .filter((servicio) => this.servicioHabilitado(servicio))

          .map((servicio) => Number(servicio.servicio_id));

        this.seleccionados = this.seleccionados.filter(

          (id) => !idsVisibles.includes(id)

        );

        return;

      }

      for (const servicio of this.serviciosFiltrados) {

        if (!this.servicioHabilitado(servicio)) {

          continue;

        }

        const servicioId = Number(servicio.servicio_id);

        if (!this.seleccionados.includes(servicioId)) {

          this.seleccionados.push(servicioId);

        }

        if (!this.tiposDescuento[servicioId]) {

          this.tiposDescuento[servicioId] = "PUBLICO";

        }

      }

    },

    async guardar() {

      if (!this.descuentoId) {

        this.mostrarError("No se identificó el descuento.");

        return;

      }

      const servicios = this.serviciosSeleccionados.map(

        (servicio) => ({

          servicio_id: Number(servicio.servicio_id),

          tipo_descuento: this.tiposDescuento[servicio.servicio_id] || "PUBLICO",

        })

      );

      this.guardando = true;

      try {

        const respuesta = await guardarServiciosPorDescuento(

          this.descuentoId,

          servicios

        );

        if (respuesta.data?.ok === false) {

          throw new Error(

            respuesta.data?.mensaje ||

            "No se pudieron guardar las asociaciones."

          );

        }

        if (this.$piaAlert?.success) {

          this.$piaAlert.success(

            "Los servicios asociados se guardaron correctamente."

          );

        }

        await this.cargarDatos();

      } catch (error) {

        console.error("Error al guardar servicios:", error);

        this.mostrarError(

          error.response?.data?.mensaje ||

          error.response?.data?.error ||

          error.message ||

          "No fue posible guardar los servicios."

        );

      } finally {

        this.guardando = false;

      }

    },

    abrirDetalleServicio(servicio) {
      this.servicioDetalle = servicio;
      this.sheetDetalleServicio = true;
    },

    formatoPrecio(valor) {

      const numero = Number(valor);

      if (!Number.isFinite(numero)) {

        return "0.00";

      }

      return numero.toFixed(2);

    },

    mostrarError(mensaje) {

      if (this.$piaAlert?.error) {

        this.$piaAlert.error(mensaje);

      } else {

        console.error(mensaje);

      }

    },

  },

};
</script>

<style lang="scss" scoped>
.asignar-page {

  width: 100%;

  max-width: 760px;

  margin: 0 auto;

  padding: 14px 1px 20px;

  box-sizing: border-box;

  overflow-wrap: anywhere;

}

.page-header {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 18px;

  .v-btn {

    flex: 0 0 40px;

  }

}

.header-text {

  min-width: 0;

  h2 {

    margin: 0;

    font-size: 19px;

    line-height: 1.35;

    font-weight: 700;

  }

  p {

    margin: 3px 0 0;

    color: #718096;

    font-size: 12px;

    line-height: 1.45;

  }

}

.descuento-resumen {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 15px;

  margin-bottom: 24px;

  min-width: 0;

  border: 1px solid #dcefeb;

  background: linear-gradient(135deg, #f1fbf9 0%, #ffffff 75%);

  box-shadow: 0 3px 12px rgb(0 105 100 / 5%);

}

.descuento-icon {

  width: 52px;

  height: 52px;

  flex: 0 0 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  color: #e91e63;

  background: #fce7ef;

}

.descuento-info {

  flex: 1;

  min-width: 0;

}

.descuento-cabecera {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 8px;

}

.descuento-titulo {

  min-width: 0;

  color: #183b50;

  font-size: 15px;

  font-weight: 800;

  line-height: 1.4;

  overflow-wrap: anywhere;

}

.estado-chip {

  flex: 0 0 auto;

  margin-top: 1px;

}

.descuento-descripcion {

  margin-top: 5px;

  color: #647b8c;

  font-size: 12px;

  line-height: 1.45;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}

.descuento-pie {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  margin-top: 10px;

  padding-top: 9px;

  border-top: 1px solid #e1efeb;

}

.descuento-valor {

  color: #008f83;

  font-size: 13px;

  font-weight: 800;

  line-height: 1.4;

}

.descuento-tag {

  flex: 0 0 auto;

  color: #008f83;

}

@media (max-width: 360px) {

  .descuento-resumen {

    gap: 9px;

    padding: 12px;

  }

  .descuento-icon {

    width: 44px;

    height: 44px;

    flex-basis: 44px;

    border-radius: 12px;

  }

  .descuento-titulo {

    font-size: 14px;

  }

  .descuento-valor {

    font-size: 12px;

  }

}

.lista-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 8px;

  margin-bottom: 12px;

  h3 {

    margin: 0;

    font-size: 15px;

    font-weight: 700;

    line-height: 1.4;

  }

  p {

    margin: 3px 0 0;

    color: #718096;

    font-size: 12px;

  }

}

.seleccionar-btn {

  flex: 0 0 auto;

  padding: 0 4px;

  font-size: 11px;

  letter-spacing: 0;

  text-transform: none;

}

.buscador {

  margin-bottom: 12px;

}

.filtro-resumen {

  display: flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 12px;

  color: #718096;

  font-size: 12px;

}

.lista-servicios {

  overflow: hidden;

  border-color: #e2eaf2;

}

.servicio-wrapper+.servicio-wrapper {

  border-top: 1px solid #e8edf2;

}

.servicio-fila {

  display: flex;

  align-items: flex-start;

  gap: 11px;

  padding: 14px 12px;

  min-width: 0;

}

.servicio-imagen {

  width: 68px;

  height: 68px;

  flex: 0 0 68px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 12px;

  background: #f0f4f7;

}

.imagen-real {

  width: 100%;

  height: 100%;

  border-radius: 12px;

}

.servicio-datos {

  flex: 1;

  min-width: 0;

  padding-top: 2px;

  padding-right: 2px;

}

.servicio-nombre {

  font-size: 13px;

  font-weight: 700;

  line-height: 1.45;

  overflow-wrap: anywhere;

}

.servicio-descripcion {

  margin-top: 4px;

  color: #718096;

  font-size: 12px;

  line-height: 1.4;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}

.servicio-detalles {

  display: flex;

  align-items: center;

  justify-content: space-between;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 8px;

  font-size: 12px;

  span {

    display: inline-flex;

    align-items: center;

    gap: 4px;

    color: #718096;

    white-space: nowrap;

  }

  strong {

    color: #009688;

    font-size: 13px;

    white-space: nowrap;

  }

}

.servicio-checkbox {

  flex: 0 0 30px;

  width: 30px;

  margin: -5px -5px 0 0;

}

.configuracion-servicio {

  padding: 0 12px 14px 91px;

}

@media (max-width: 360px) {

  .servicio-fila {

    gap: 8px;

    padding: 12px 9px;

  }

  .servicio-imagen {

    width: 58px;

    height: 58px;

    flex-basis: 58px;

  }

  .servicio-nombre {

    font-size: 12px;

  }

  .servicio-descripcion {

    font-size: 11px;

  }

  .servicio-detalles {

    font-size: 11px;

  }

  .servicio-detalles strong {

    font-size: 12px;

  }

  .configuracion-servicio {

    padding-left: 75px;

  }

}

.servicio-nombre {

  font-size: 13px;

  font-weight: 700;

  line-height: 1.45;

  overflow-wrap: anywhere;

}

.servicio-descripcion {

  margin-top: 3px;

  color: #718096;

  font-size: 12px;

  line-height: 1.4;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}

.servicio-detalles {

  display: flex;

  align-items: center;

  justify-content: space-between;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 7px;

  font-size: 12px;

  span {

    display: inline-flex;

    align-items: center;

    gap: 4px;

    color: #718096;

  }

  strong {

    color: #009688;

    font-size: 13px;

    white-space: nowrap;

  }

}

.servicio-inactivo {

  margin-top: 5px;

  color: #9e6b00;

  font-size: 11px;

}

.configuracion-servicio {

  padding: 0 12px 13px 57px;

}

.configuracion-titulo {

  margin-bottom: 7px;

  color: #64748b;

  font-size: 12px;

  font-weight: 600;

}

.tipo-toggle {

  display: flex;

  width: 100%;

  max-width: 300px;

  :deep(.v-btn) {

    flex: 1;

    min-width: 0;

    padding: 0 8px;

    font-size: 11px;

    letter-spacing: 0;

    text-transform: none;

  }

}

.estado-lista {

  padding: 32px 12px;

  text-align: center;

  color: #718096;

  p {

    margin-top: 10px;

    font-size: 13px;

  }

}

.vacio-card {

  padding: 28px 14px;

  text-align: center;

  p {

    margin-top: 10px;

    color: #718096;

    font-size: 13px;

  }

}

.espacio-inferior {

  height: 120px;

}

.barra-guardar {

  position: sticky;

  bottom: 76px;

  z-index: 3;

  padding: 12px;

  margin: 12px -2px 0;

  border: 1px solid #e2eaf2;

  border-radius: 14px;

  background: rgb(var(--v-theme-surface));

  box-shadow: 0 -5px 18px rgb(20 40 60 / 5%);

}

.resumen-guardar {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 10px;

  color: #718096;

  font-size: 12px;

  strong {

    color: rgb(var(--v-theme-on-surface));

    font-size: 14px;

  }

}

@media (min-width: 600px) {

  .asignar-page {

    padding: 24px;

  }

  .page-header {

    margin-bottom: 24px;

  }

  .header-text h2 {

    font-size: 22px;

  }

  .servicio-fila {

    padding: 16px;

    gap: 12px;

  }

  .servicio-icono {

    width: 50px;

    height: 50px;

    flex-basis: 50px;

  }

  .servicio-nombre {

    font-size: 14px;

  }

  .servicio-descripcion {

    -webkit-line-clamp: 3;

  }

  .configuracion-servicio {

    padding-left: 90px;

  }

  .barra-guardar {

    bottom: 16px;

    margin-top: 20px;

  }

}

.servicio-fila {

  display: grid;

  grid-template-columns: 54px minmax(0, 1fr) 24px;

  grid-template-rows: auto;

  align-items: start;

  column-gap: 9px;

  padding: 12px;

  box-sizing: border-box;

}

.servicio-imagen {

  grid-column: 1;

  grid-row: 1;

  width: 54px;

  height: 54px;

  overflow: hidden;

  border-radius: 10px;

  background: #f0f4f7;

}

.servicio-datos {

  grid-column: 2;

  grid-row: 1;

  min-width: 0;

  padding: 0;

}

.servicio-nombre {

  font-size: 13px;

  font-weight: 700;

  line-height: 1.4;

  overflow-wrap: anywhere;

}

.servicio-descripcion {

  margin-top: 4px;

  color: #718096;

  font-size: 12px;

  line-height: 1.45;

  white-space: normal;

  overflow-wrap: anywhere;

}

.servicio-checkbox {

  grid-column: 3;

  grid-row: 1;

  width: 24px;

  height: 24px;

  min-width: 24px;

  margin: -4px 0 0;

  padding: 0;

  justify-self: end;

  align-self: start;

}

.servicio-checkbox :deep(.v-selection-control) {

  width: 24px;

  height: 24px;

  min-height: 24px;

}

.configuracion-servicio {

  padding: 0 12px 12px 75px;

}

.detalle-sheet {
  max-width: 720px;
  margin: 0 auto;
  padding: 10px 18px calc(22px + env(safe-area-inset-bottom));
  color: #17324d;
}

.sheet-indicador {
  width: 42px;
  height: 4px;
  margin: 0 auto 18px;
  border-radius: 99px;
  background: #a0acb8;
}

.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.sheet-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.sheet-header p {
  margin: 4px 0 0;
  color: #718096;
  font-size: 12px;
}

.detalle-servicio-cabecera {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detalle-imagen {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 14px;
  background: #edf5f5;
}

.detalle-imagen :deep(.v-img) {
  width: 100%;
  height: 100%;
}

.detalle-servicio-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detalle-servicio-info strong {
  font-size: 16px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.detalle-servicio-info span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #718096;
  font-size: 13px;
}

.detalle-servicio-info b {
  color: #009688;
  font-size: 17px;
}

.detalle-descripcion {
  margin: 16px 0;
  color: #526782;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.relacion-descuento {
  display: block;
  width: 100%;
  min-width: 0;
  margin-top: 16px;
  padding: 10px;
  border: 1px solid #d8eeee;
  border-radius: 15px;
  background: #f5fbfb;
  box-sizing: border-box;
}

.relacion-cabecera {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.relacion-icono {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #009688;
  background: #dff5f1;
}

.relacion-titulo {
  flex: 1 1 auto;
  min-width: 0;
}

.relacion-etiqueta {
  display: block;
  margin-bottom: 4px;
  color: #718096;
  font-size: 11px;
}

.relacion-titulo strong {
  display: block;
  font-size: 14px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.relacion-chip {
  flex: 0 0 auto;
  max-width: 120px;
}

.relacion-contenido {
  width: 100%;
  min-width: 0;
  margin-top: 10px;
  padding-left: 52px;
  box-sizing: border-box;
}

.relacion-contenido p {
  margin: 0 0 8px;
  color: #718096;
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-line;
  overflow-wrap: anywhere;
  word-break: normal;
}

.relacion-contenido b {
  display: block;
  color: #009688;
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 380px) {
  .relacion-descuento {
    padding: 10px;
  }

  .relacion-cabecera {
    gap: 8px;
  }

  .relacion-icono {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
  }

  .relacion-chip {
    max-width: 105px;
  }

  .relacion-contenido {
    padding-left: 44px;
  }
}

.detalle-tipo {
  margin-top: 20px;
}

.detalle-tipo h4 {
  margin: 0 0 10px;
  font-size: 14px;
}

.tipo-toggle-detalle {
  display: flex;
  width: 100%;
}

.tipo-toggle-detalle :deep(.v-btn) {
  flex: 1;
  min-width: 0;
}

.detalle-no-seleccionado {
  margin-top: 18px;
  padding: 12px;
  border-radius: 12px;
  color: #65758b;
  background: #f5f7fa;
  font-size: 12px;
  line-height: 1.5;
}

.cerrar-detalle {
  margin-top: 20px;
}

.servicio-fila {
  cursor: pointer;
}
</style>
