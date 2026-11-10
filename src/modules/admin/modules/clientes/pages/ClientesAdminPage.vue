<template>
<div class="clientes-page">

  <!-- ENCABEZADO -->

  <header class="clientes-header">

    <div class="titulo-seccion">

      <div>

        <h1>Clientes</h1>

        <p>Gestiona toda la información de tus clientes.</p>

      </div>

      <div class="total-clientes">

        <v-icon size="19">mdi-account-group-outline</v-icon>

        <span>{{ totalClientes }}</span>

      </div>

    </div>

  </header>

  <!-- CONTENIDO -->

  <main class="clientes-contenido">

    <!-- BUSCADOR Y FILTRO -->

    <div class="busqueda-container">

      <div class="buscador">

        <v-icon size="20">mdi-magnify</v-icon>

        <input v-model="busqueda" type="search" placeholder="Buscar por nombre o teléfono..." aria-label="Buscar clientes" @keyup.enter="cargarClientes" />

        <button v-if="busqueda" type="button" aria-label="Limpiar búsqueda" @click="limpiarBusqueda">

          <v-icon size="18">mdi-close-circle</v-icon>

        </button>

      </div>

      <button class="boton-filtro" type="button" aria-label="Filtrar clientes" @click="sheetFiltros = true">

        <v-icon size="21">mdi-filter-variant</v-icon>

      </button>

    </div>

    <!-- SEGMENTACIONES -->

    <div class="segmentaciones">

      <button v-for="(filtro, index) in filtros" :key="filtro.id" type="button" class="filtro-chip" :class="[

          `filtro-color-${index % 5}`,

          { activo: filtroActivo === filtro.id }

        ]" @click="seleccionarFiltro(filtro.id)">

        <span>{{ filtro.nombre }}</span>

        <span class="chip-cantidad">{{ contarClientes(filtro.id) }}</span>

      </button>

    </div>

    <!-- RESULTADOS -->

    <div class="lista-cabecera">

      <h2>

        {{ tituloFiltro }}

      </h2>

      <span v-if="!cargando">

        {{ clientesFiltrados.length }}

        {{ clientesFiltrados.length === 1?"cliente" : "clientes" }}

      </span>

    </div>

    <!-- CARGANDO -->

    <div v-if="cargando" class="estado-vacio">

      <v-progress-circular indeterminate color="teal" size="35" />

      <p>Cargando clientes...</p>

    </div>

    <!-- ERROR -->

    <div v-else-if="error" class="estado-vacio">

      <v-icon size="42" color="error">

        mdi-alert-circle-outline

      </v-icon>

      <p>{{ error }}</p>

      <button class="boton-reintentar" type="button" @click="cargarClientes">

        <v-icon size="18">mdi-refresh</v-icon>

        Reintentar

      </button>

    </div>

    <!-- SIN CLIENTES -->

    <div v-else-if="clientesFiltrados.length === 0" class="estado-vacio">

      <v-icon size="48" color="grey">

        mdi-account-search-outline

      </v-icon>

      <strong>No encontramos clientes</strong>

      <p>

        {{

            busqueda

             ?"Prueba con otro nombre o teléfono."

              : "Los clientes que atiendas aparecerán aquí."

          }}

      </p>

      <button v-if="busqueda || filtroActivo !== 'todos'" class="boton-reintentar" type="button" @click="limpiarFiltros">

        Ver todos

      </button>

    </div>

    <!-- LISTA DE CLIENTES -->

    <div v-else class="clientes-lista">

      <article v-for="cliente in clientesFiltrados" :key="cliente?.cliente_id" class="cliente-card">
        <!-- AVATAR -->
        <div class="cliente-avatar">
          <span>{{ iniciales(cliente) }}</span>
        </div>

        <!-- NOMBRE Y TELÉFONO -->
        <div class="cliente-info">
          <strong :title="nombreCliente(cliente)">
            {{ nombreCliente(cliente) }}
          </strong>

          <span class="cliente-telefono">
            <v-icon size="13">mdi-phone</v-icon>
            {{ cliente?.telefono || "Sin teléfono" }}
          </span>
        </div>

        <!-- SEGMENTO A LA DERECHA DEL TELÉFONO -->
        <span class="segmentacion-badge" :class="claseSegmentacion(cliente)">
          {{ cliente?.segmentacion_nombre || "Sin segmento" }}
        </span>
        
        
<!-- DESCUENTOS VIGENTES -->
<div
  v-if="Number(cliente.descuentos_vigentes) > 0"
  class="cliente-descuentos-vigentes"
>
  <v-icon size="13">mdi-tag-check</v-icon>
  <span>
    {{ cliente.descuentos_vigentes }}
    {{
      Number(cliente.descuentos_vigentes) === 1
        ? "descuento vigente"
        : "descuentos vigentes"
    }}
  </span>
</div>

<!-- DESCUENTOS PROGRAMADOS -->
<div
  v-if="Number(cliente.descuentos_programados) > 0"
  class="cliente-descuentos-programados"
>
  <v-icon size="13">mdi-calendar-clock</v-icon>
  <span>
    {{ cliente.descuentos_programados }}
    {{
      Number(cliente.descuentos_programados) === 1
        ? "descuento programado"
        : "descuentos programados"
    }}
  </span>
</div>


        <!-- TRES PUNTOS -->
        <button class="boton-opciones" type="button" aria-label="Opciones del cliente" @click="abrirOpciones(cliente)">
          <v-icon size="21">mdi-dots-vertical</v-icon>
        </button>
      </article>

    </div>

    <!-- PAGINACIÓN -->

    <div v-if="!cargando && !error && totalPaginas > 1" class="paginacion">

      <button type="button" :disabled="pagina <= 1" @click="cambiarPagina(pagina - 1)">

        <v-icon>mdi-chevron-left</v-icon>

      </button>

      <span>Página {{ pagina }} de {{ totalPaginas }}</span>

      <button type="button" :disabled="pagina >= totalPaginas" @click="cambiarPagina(pagina + 1)">

        <v-icon>mdi-chevron-right</v-icon>

      </button>

    </div>

  </main>

  <!-- SHEET DE FILTROS -->
  <v-bottom-sheet v-model="sheetFiltros">

    <v-card class="sheet-card">

      <div class="sheet-indicador"></div>

      <div class="sheet-titulo">

        <div>

          <h3>Filtrar clientes</h3>

          <p>Selecciona una segmentación</p>

        </div>

        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar filtros" @click="sheetFiltros = false" />

      </div>

      <button v-for="filtro in filtros" :key="filtro.id" type="button" class="opcion-filtro" @click="seleccionarFiltro(filtro.id); sheetFiltros = false">

        <span>{{ filtro.nombre }}</span>

        <v-icon v-if="filtroActivo === filtro.id" color="teal">

          mdi-check-circle

        </v-icon>

      </button>

    </v-card>

  </v-bottom-sheet>

  <!-- SHEET DE OPCIONES DEL CLIENTE -->
  <v-bottom-sheet v-model="sheetOpciones">

    <v-card class="sheet-card">

      <div class="sheet-indicador"></div>

      <div class="cliente-sheet-resumen" v-if="clienteSeleccionado">

        <div class="cliente-avatar avatar-grande">

          <span>{{ iniciales(clienteSeleccionado) }}</span>

        </div>

        <div>

          <h3>{{ nombreCliente(clienteSeleccionado) }}</h3>

          <p>{{ clienteSeleccionado.telefono || "Sin teléfono" }}</p>

        </div>

        <v-btn class="cerrar-sheet" icon="mdi-close" variant="text" size="small" aria-label="Cerrar opciones" @click="sheetOpciones = false" />

      </div>

      <div class="opciones-cliente">

        <button type="button" class="opcion-cliente" @click="abrirDetalle('historial')">

          <span class="opcion-icono icono-azul">

            <v-icon>mdi-history</v-icon>

          </span>

          <span>

            <strong>Historial del cliente</strong>

            <small>Consulta sus servicios y visitas</small>

          </span>

          <v-icon class="opcion-flecha">mdi-chevron-right</v-icon>

        </button>

        <button type="button" class="opcion-cliente" @click="abrirDetalle('segmentacion')">

          <span class="opcion-icono icono-verde">

            <v-icon>mdi-account-group-outline</v-icon>

          </span>

          <span>

            <strong>Segmentación del cliente</strong>

            <small>Consulta su clasificación</small>

          </span>

          <v-icon class="opcion-flecha">mdi-chevron-right</v-icon>

        </button>

        <button type="button" class="opcion-cliente" @click="abrirDetalle('descuentos')">

          <span class="opcion-icono icono-rosa">
            <v-icon>mdi-tag-minus</v-icon>
          </span>

          <span>
            <strong>Descuentos asignados</strong>
            <small>Consulta sus descuentos</small>
          </span>

          <v-icon class="opcion-flecha">mdi-chevron-right</v-icon>
        </button>

        <!-- <button type="button" class="opcion-cliente" @click="abrirDetalle('promociones')">

          <span class="opcion-icono icono-naranja">
            <v-icon>mdi-percent-outline</v-icon>
          </span>

          <span>

            <strong>Promociones asignadas</strong>

            <small>Consulta sus promociones</small>

          </span>

          <v-icon class="opcion-flecha">mdi-chevron-right</v-icon>

        </button> -->

      </div>

    </v-card>

  </v-bottom-sheet>

  <!-- SHEET INDEPENDIENTE DEL HISTORIAL -->
  <HistorialClienteSheet v-model="sheetHistorial" :cliente="clienteSeleccionado" :nombre="clienteSeleccionado?nombreCliente(clienteSeleccionado) : ''" :historial="detalle" :loading="cargandoDetalle" :error="errorDetalle" @retry="cargarDetalle" />

  <SegmentacionClienteSheet v-model="sheetSegmentacion" :cliente="clienteSeleccionado" />

  <AsignarDescuentoClientesSheet v-model="sheetDescuentosCliente" :cliente="clienteSeleccionado" @asignados="alAsignarDescuentos" />

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>
</template>

<script>
import {
  getClientes,
  getHistorialCliente,
  getSegmentacionCliente,
  getPromocionesCliente,
  getDescuentosCliente,
} from "../services/cliente.api.js";

import {
  getSegmentacion
} from "../services/segmentacion.api.js";

import HistorialClienteSheet from "../components/HistorialClienteSheet.vue";
import SegmentacionClienteSheet from "../components/SegmentacionClienteSheet.vue";
import AsignarDescuentoClientesSheet from "../components/AsignarDescuentoClientesSheet.vue";

export default {

  name: "ClientesAdminPage",
  components: {
    HistorialClienteSheet,
    SegmentacionClienteSheet,
    AsignarDescuentoClientesSheet,
  },

  data() {

    return {

      clientes: [],
      totalClientes: 0,
      pagina: 1,
      limite: 20,
      totalPaginas: 1,
      busqueda: "",
      filtroActivo: "todos",
      cargando: false,
      error: null,

      sheetFiltros: false,
      sheetOpciones: false,
      sheetDetalle: false,
      clienteSeleccionado: null,

      tipoDetalle: null,
      detalle: [],

      cargandoDetalle: false,
      errorDetalle: null,
      filtros: [],

      sheetFiltros: false,
      sheetOpciones: false,
      sheetDetalle: false,
      sheetHistorial: false,

      sheetSegmentacion: false,

      sheetDescuentosCliente: false,

      overlay: false,
    };

  },

  computed: {

    clientesFiltrados() {
      const texto = this.normalizar(this.busqueda);

      return this.clientes.filter((cliente) => {
        const nombre = this.normalizar(this.nombreCliente(cliente));
        const telefono = String(cliente.telefono || "");

        const coincideBusqueda = !texto ||
          nombre.includes(texto) ||
          telefono.includes(texto);

        const filtro = this.filtros.find(
          (item) => String(item.id) === String(this.filtroActivo)
        );

        const segmentoCliente = this.normalizar(
          cliente.segmentacion_nombre || ""
        );

        const coincideFiltro =
          this.filtroActivo === "todos" ||
          (
            filtro &&
            segmentoCliente === this.normalizar(filtro.nombre)
          );

        return coincideBusqueda && coincideFiltro;
      });
    },

    tituloFiltro() {

      const filtro = this.filtros.find(

        (item) => item.id === this.filtroActivo,

      );

      return filtro?filtro.nombre : "Todos los clientes";

    },

    tituloDetalle() {

      const titulos = {

        historial: "Historial del cliente",

        segmentacion: "Segmentación del cliente",

        promociones: "Promociones asignadas",

        descuentos: "Descuentos asignados",

      };

      return titulos[this.tipoDetalle] || "Detalle del cliente";

    },

    resumenHistorial() {
      const registros = Array.isArray(this.detalle)?this.detalle : [];
      const completadas = registros.filter(
        (item) => String(item.reserva_estado || "").toUpperCase() === "COMPLETADA",
      ).length;
      const fechas = registros
        .map((item) => item.fecha)
        .filter(Boolean)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      return {
        total: registros.length,
        completadas,
        ultimaVisita: fechas[0] || null,
      };
    },

  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  async mounted() {

    await this.cargarClientes();

    await this.cargarSegmentaciones()

  },

  methods: {

    alAsignarDescuentos({
      cantidad
    }) {
      console.log(`Se asignaron ${cantidad} descuentos al cliente.`);
    },

    normalizar(valor) {

      return String(valor || "")

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toLowerCase()

        .trim();

    },

    nombreCliente(cliente) {

      return (

        cliente.nombre ||

        cliente.alias ||

        "Cliente sin nombre"

      );

    },

    iniciales(cliente) {

      const nombre = this.nombreCliente(cliente);

      return nombre

        .split(/\s+/)

        .filter(Boolean)

        .slice(0, 2)

        .map((parte) => parte.charAt(0).toUpperCase())

        .join("");

    },

    claseSegmentacion(cliente) {
      const segmento = this.normalizar(
        cliente?.segmentacion_nombre || "",
      );

      if (segmento.includes("fiel")) return "badge-fiel";
      if (segmento.includes("frecuente")) return "badge-frecuente";
      if (segmento.includes("constante")) return "badge-constante";
      if (segmento.includes("ocasional")) return "badge-ocasional";
      if (segmento.includes("nuevo")) return "badge-nuevo";

      return "badge-default";
    },

    contarClientes(filtroId) {
      if (String(filtroId) === "todos") {
        return this.totalClientes;
      }

      const filtro = this.filtros.find(
        (item) => String(item.id) === String(filtroId)
      );

      if (!filtro) return 0;

      const nombreSegmento = this.normalizar(filtro.nombre);

      return this.clientes.filter((cliente) => {
        return (
          this.normalizar(cliente.segmentacion_nombre || "") ===
          nombreSegmento
        );
      }).length;
    },

    formatearFecha(fecha) {

      if (!fecha) return "—";

      const valor = new Date(fecha);

      if (Number.isNaN(valor.getTime())) {

        return String(fecha);

      }

      return new Intl.DateTimeFormat("es-BO", {

        day: "2-digit",

        month: "short",

        year: "numeric",

      }).format(valor);

    },

    formatearImporte(valor) {
      if (valor === null || valor === undefined || valor === "") return "—";
      const numero = Number(valor);
      if (!Number.isFinite(numero)) return String(valor);
      return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero);
    },

    claseEstadoReserva(estado) {
      const valor = this.normalizar(estado);
      if (valor === "completada") return "estado-completada";
      if (valor === "confirmada") return "estado-confirmada";
      if (valor === "pendiente") return "estado-pendiente";
      if (valor === "cancelada") return "estado-cancelada";
      if (valor === "no asistio") return "estado-no-asistio";
      return "estado-registrado";
    },

    async cargarSegmentaciones() {

      try {

        this.overlay = true

        const respuesta = await getSegmentacion();

        if (respuesta.data?.ok) {

          this.filtros = [{

              id: "todos",

              nombre: "Todos",

            },

            ...respuesta.data.data.map((segmento) => ({

              id: segmento.id,

              nombre: segmento.nombre,

              cantidad: segmento.cantidad_clientes,

            })),

          ];

        }

      } catch (error) {

        console.error('❌ ERROR CARGAR LA SEGMENTACION:', error)

        this.$piaAlert.error(

          error.response?.data?.message ||

          error.response?.data?.error ||

          error.message ||

          "Ocurrió un error inesperado", {

            title: "Error al Cargar la Segmentacion!",

          }

        );

      } finally {

        this.overlay = false

      }
    },
    
    async cargarClientes() {
      this.cargando = true;
      this.error = null;

      try {
        const response = await getClientes({
          pagina: this.pagina,
          limite: this.limite,
          busqueda: this.busqueda.trim(),
          segmentacionId:
            this.filtroActivo === "todos"
              ? null
              : this.filtroActivo,
        });

        // La API puede devolver un arreglo o un objeto paginado.
        const resultado = response.data?.data ?? response.data;

        const clientesRecibidos = Array.isArray(resultado)
          ? resultado
          : Array.isArray(resultado?.clientes)
            ? resultado.clientes
            : [];

        // Los contadores vienen directamente de la consulta del backend.
        this.clientes = clientesRecibidos.map((cliente) => ({
          ...cliente,
          descuentos_vigentes: Number(
            cliente.descuentos_vigentes ?? 0,
          ),
          descuentos_programados: Number(
            cliente.descuentos_programados ?? 0,
          ),
        }));

        this.totalClientes = Number(
          resultado?.total ??
          response.data?.paginacion?.total ??
          this.clientes.length,
        );

        this.totalPaginas = Math.max(
          1,
          Math.ceil(this.totalClientes / this.limite),
        );
      } catch (error) {
        console.error("Error al cargar clientes:", error);

        this.clientes = [];
        this.totalClientes = 0;

        this.error =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No se pudo cargar la lista de clientes.";
      } finally {
        this.cargando = false;
      }
    },

    async limpiarBusqueda() {

      this.busqueda = "";

      this.pagina = 1;

      await this.cargarClientes();

    },

    async limpiarFiltros() {

      this.busqueda = "";

      this.filtroActivo = "todos";

      this.pagina = 1;

      await this.cargarClientes();

    },

    seleccionarFiltro(filtroId) {

      this.filtroActivo = filtroId;

    },

    async cambiarPagina(nuevaPagina) {

      if (

        nuevaPagina < 1 ||

        nuevaPagina > this.totalPaginas

      ) {

        return;

      }

      this.pagina = nuevaPagina;

      await this.cargarClientes();

    },

    abrirOpciones(cliente) {

      this.clienteSeleccionado = cliente;
      this.sheetOpciones = true;

    },

    async abrirDetalle(tipo) {
      this.tipoDetalle = tipo;
      this.sheetOpciones = false;

      if (tipo === "segmentacion") {

        this.sheetDetalle = false;
        this.sheetHistorial = false;
        this.sheetSegmentacion = true;
        return;
      }

      if (tipo === "historial") {
        this.sheetDetalle = false;
        this.sheetHistorial = true;
        await this.cargarDetalle();
        return;
      }

      if (tipo === "descuentos") {
        this.sheetDetalle = false;
        this.sheetHistorial = false;
        this.sheetSegmentacion = false;
        this.sheetDescuentosCliente = true;
        return;
      }

      this.sheetDetalle = true;
      await this.cargarDetalle();
    },

    async cargarDetalle() {

      if (!this.clienteSeleccionado) return;

      this.cargandoDetalle = true;

      this.errorDetalle = null;

      const clienteId = this.clienteSeleccionado.cliente_id;

      const funciones = {

        historial: getHistorialCliente,

        segmentacion: getSegmentacionCliente,

        promociones: getPromocionesCliente,

        descuentos: getDescuentosCliente,

      };

      try {

        const obtenerDatos = funciones[this.tipoDetalle];

        if (!obtenerDatos) {

          throw new Error("Tipo de detalle no válido.");

        }

        const response = await obtenerDatos(clienteId);

        const data = response.data?.data;

        this.detalle = Array.isArray(data) ?

          data :

          data ?

          [data] :

          [];

      } catch (error) {

        console.error("Error al cargar detalle del cliente:", error);

        this.detalle = [];

        this.errorDetalle =

          error.response?.data?.message ||

          "No se pudo cargar la información.";

      } finally {

        this.cargandoDetalle = false;

      }

    },

  },

};
</script>

<style lang="scss" scoped>
.clientes-page {

  min-height: 100%;

  background: #f7f9fc;

  color: #17375e;

  font-family: "Nunito", sans-serif;

}

/* ENCABEZADO */

.clientes-header {

  min-height: 72px;

  padding: 1px 10px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  background: #fff;

  border-bottom: 1px solid #edf0f5;

}

.marca {

  display: flex;

  flex-direction: column;

  gap: 0;

}

.marca-logo {

  color: #07979b;

  font-size: 29px;

  line-height: 1;

  font-weight: 900;

  letter-spacing: -1.5px;

}

.marca>span {

  margin-top: 3px;

  color: #607d8b;

  font-size: 10px;

}

.header-acciones {

  display: flex;

  align-items: center;

  gap: 12px;

}

.icono-header,

.avatar-header {

  width: 40px;

  height: 40px;

  border: none;

  background: #fff;

  color: #17375e;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

}

.avatar-header {

  width: 42px;

  height: 42px;

  border-radius: 50%;

  color: #07979b;

  background: #e8f7f7;

}

/* CONTENIDO */

.clientes-contenido {

  width: 100%;

  max-width: 760px;

  margin: 0 auto;

  padding: 10px 7px 28px;

}

.titulo-seccion {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 5px;

}

.titulo-seccion h1 {

  margin: 0;

  font-size: 25px;

  line-height: 1.25;

  font-weight: 800;

  color: #17375e;

}

.titulo-seccion p {

  margin: 4px 0 0;

  font-size: 13px;

  color: #71849b;

}

.total-clientes {

  flex-shrink: 0;

  min-width: 54px;

  padding: 8px 10px;

  border-radius: 14px;

  background: #e1f6f5;

  color: #078e93;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  font-size: 14px;

  font-weight: 800;

}

/* BUSCADOR */

.busqueda-container {

  display: flex;

  align-items: stretch;

  gap: 8px;

  margin-bottom: 15px;

}

.buscador {

  flex: 1;

  min-width: 0;

  min-height: 46px;

  padding: 0 12px;

  display: flex;

  align-items: center;

  gap: 9px;

  border: 1px solid #e2eaf2;

  border-radius: 13px;

  background: #fff;

  color: #71849b;

}

.buscador input {

  flex: 1;

  width: 100%;

  min-width: 0;

  border: 0;

  outline: none;

  background: transparent;

  color: #17375e;

  font-family: inherit;

  font-size: 12px;

}

.buscador input::placeholder {

  color: #8b9caf;

}

.buscador button {

  padding: 3px;

  border: 0;

  background: transparent;

  color: #71849b;

}

.boton-filtro {

  width: 46px;

  flex-shrink: 0;

  border: 1px solid #e2eaf2;

  border-radius: 13px;

  background: #fff;

  color: #17375e;

  cursor: pointer;

}

/* CHIPS */

.segmentaciones {

  display: flex;

  gap: 7px;

  overflow-x: auto;

  padding: 1px 0 12px;

  scrollbar-width: none;

}

.segmentaciones::-webkit-scrollbar {

  display: none;

}

.filtro-chip {

  flex-shrink: 0;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding: 7px 10px;

  border: 1px solid transparent;

  border-radius: 20px;

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;

  transition: border-color 0.15s, transform 0.15s;

}

.filtro-chip.activo {

  border-color: currentColor;

}

.chip-cantidad {

  font-size: 10px;

  font-weight: 800;

}

.filtro-todos {

  background: #e0f7f7;

  color: #087e83;

}

.filtro-frecuentes {

  background: #e4f8ef;

  color: #13865c;

}

.filtro-vip {

  background: #fff0df;

  color: #b75b14;

}

.filtro-nuevo {

  background: #e8f2ff;

  color: #2768b2;

}

.filtro-inactivo {

  background: #fce8ec;

  color: #c23b55;

}

/* LISTA */

.lista-cabecera {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  margin: 7px 0 12px;

}

.lista-cabecera h2 {

  margin: 0;

  font-size: 15px;

  font-weight: 800;

  color: #17375e;

}

.lista-cabecera>span {

  color: #7b8ca0;

  font-size: 11px;

}

/* LISTA DE CLIENTES */

.clientes-lista {

  display: flex;

  flex-direction: column;

  gap: 8px;

}

.cliente-card {
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto 24px;
  grid-template-rows: auto auto auto auto;
  align-items: center;
  column-gap: 8px;
  row-gap: 3px;
  padding: 10px 8px;
  border: 1px solid #edf1f6;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(23, 55, 94, 0.035);
}

.cliente-card .cliente-avatar {
  grid-column: 1;
  grid-row: 1 / 4;
  width: 38px;
  height: 38px;
  flex: none;
}

/* display: contents permite que nombre y teléfono ocupen celdas distintas */
.cliente-card .cliente-info {
  display: contents;
}

.cliente-card .cliente-info>strong {
  grid-column: 2 / 4;
  grid-row: 1;
  display: block;
  width: 100%;
  min-width: 0;
  color: #17375e;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
  white-space: normal;
  overflow-wrap: anywhere;
}

.cliente-card .cliente-telefono {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #71849b;
  font-size: 11px;
  white-space: nowrap;
}

.cliente-card .segmentacion-badge {
  grid-column: 3;
  grid-row: 2;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  max-width: 82px;
  min-width: 0;
  margin: 0;
  padding: 5px 6px;
  border-radius: 9px;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
}

.cliente-card .cliente-descuentos-vigentes {
  grid-column: 2 / 4;
  grid-row: 3;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 5px;
  margin-top: 2px;
  padding: 4px 7px;
  border: 1px solid #ccefe0;
  border-radius: 8px;
  background: #effbf5;
  color: #07805e;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.25;
}

.cliente-card .boton-opciones {
  grid-column: 4;
  grid-row: 1 / 4;
  align-self: center;
  flex: none;
  width: 24px;
  min-width: 24px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #71849b;
  cursor: pointer;
}

.cliente-avatar {

  width: 43px;

  height: 43px;

  flex: 0 0 43px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid #d1eeec;

  border-radius: 50%;

  background: #e0f5f4;

  color: #078e93;

  font-size: 13px;

  font-weight: 900;

}

.badge-nuevo {
  background: #e0f2fe;
  color: #0369a1;
}

.badge-ocasional {
  background: #ffedd5;
  color: #c2410c;
}

.badge-constante {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-frecuente {
  background: #d1fae5;
  color: #047857;
}

.badge-fiel {
  background: #ede9fe;
  color: #6d28d9;
}

.badge-default {
  background: #eef2f7;
  color: #64748b;
}

.boton-opciones:active {

  background: #e8f7f7;

  color: #078e93;

}

/* ESTADOS */

.estado-vacio {

  min-height: 190px;

  padding: 26px 18px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  text-align: center;

  color: #71849b;

}

.estado-vacio strong {

  color: #17375e;

  font-size: 14px;

}

.estado-vacio p {

  margin: 0;

  font-size: 12px;

}

.boton-reintentar {

  padding: 9px 14px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border: 0;

  border-radius: 10px;

  background: #07979b;

  color: #fff;

  font-family: inherit;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

}

.paginacion {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 18px;

  margin-top: 20px;

  color: #71849b;

  font-size: 12px;

}

.paginacion button {

  width: 36px;

  height: 36px;

  border: 1px solid #e2eaf2;

  border-radius: 10px;

  background: #fff;

  color: #17375e;

}

.paginacion button:disabled {

  opacity: 0.35;

  cursor: default;

}

/* SHEETS */

.sheet-card {

  padding: 10px 18px 28px;

  border-radius: 24px 24px 0 0 !important;

  background: #fff;

}

.sheet-indicador {

  width: 38px;

  height: 4px;

  margin: 0 auto 19px;

  border-radius: 10px;

  background: #dce3eb;

}

.sheet-titulo {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 13px;

}

.sheet-titulo h3,

.cliente-sheet-resumen h3 {

  margin: 0;

  color: #17375e;

  font-size: 17px;

  font-weight: 900;

}

.sheet-titulo p,

.cliente-sheet-resumen p {

  margin: 4px 0 0;

  color: #71849b;

  font-size: 12px;

}

.opcion-filtro {

  width: 100%;

  min-height: 47px;

  padding: 10px 4px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border: 0;

  border-bottom: 1px solid #edf1f6;

  background: #fff;

  color: #17375e;

  font-family: inherit;

  font-size: 13px;

  text-align: left;

}

.cliente-sheet-resumen {

  display: flex;

  align-items: center;

  gap: 12px;

  padding-bottom: 17px;

  border-bottom: 1px solid #edf1f6;

}

.avatar-grande {

  width: 49px;

  height: 49px;

}

.cliente-sheet-resumen>div:nth-child(2) {

  flex: 1;

  min-width: 0;

}

.cerrar-sheet {

  flex-shrink: 0;

}

.opciones-cliente {

  display: flex;

  flex-direction: column;

  padding-top: 8px;

}

.opcion-cliente {

  width: 100%;

  min-height: 72px;

  padding: 10px 0;

  display: flex;

  align-items: center;

  gap: 12px;

  border: 0;

  border-bottom: 1px solid #edf1f6;

  background: #fff;

  text-align: left;

  cursor: pointer;

}

.opcion-icono {

  width: 43px;

  height: 43px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

}

.icono-azul {

  color: #2768b2;

  background: #e8f2ff;

}

.icono-verde {

  color: #13865c;

  background: #e4f8ef;

}

.icono-naranja {

  color: #b75b14;

  background: #fff0df;

}

.icono-rosa {

  color: #c23b76;

  background: #fce8f1;

}

.opcion-cliente>span:nth-child(2) {

  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 4px;

}

.opcion-cliente strong {

  color: #17375e;

  font-size: 12px;

  font-weight: 800;

}

.opcion-cliente small {

  color: #71849b;

  font-size: 11px;

}

.opcion-flecha {

  color: #93a2b3;

}

.sheet-detalle {
  max-height: min(84vh, 760px);
  overflow-y: auto;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.detalle-cliente-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 4px;
  color: #71849b;
  font-size: 11px;
}

.detalle-segmento {
  display: inline-flex;
  align-items: center;
  padding: 4px 7px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 800;
}

.estado-detalle {

  min-height: 155px;

  padding: 25px 12px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  color: #71849b;

  text-align: center;

}

.estado-detalle strong {

  color: #17375e;

  font-size: 14px;

}

.estado-detalle p {

  margin: 0;

  font-size: 12px;

}

.detalle-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 12px;
}

.historial-resumen {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 1px 0 8px;
}

.historial-metrica {
  min-width: 0;
  min-height: 105px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  background: #fff;
}

.historial-metrica-icono {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.historial-metrica>strong {
  color: #17375e;
  font-size: 17px;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.historial-metrica>small {
  color: #71849b;
  font-size: 10px;
  line-height: 1.2;
}

.historial-ultima-visita>strong {
  font-size: 11px;
  line-height: 1.3;
}

.historial-lista-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 4px 0 2px;
}

.historial-lista-titulo h4 {
  margin: 0;
  color: #17375e;
  font-size: 14px;
  font-weight: 900;
}

.historial-lista-titulo>span {
  color: #8190a2;
  font-size: 10px;
}

.detalle-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 13px;
  border: 1px solid #edf1f6;
  border-radius: 13px;
  background: #fbfcfe;
}

.detalle-item strong {
  color: #17375e;
  font-size: 13px;
}

.detalle-item span {
  color: #536d87;
  font-size: 12px;
}

.detalle-item small {
  color: #8190a2;
  font-size: 11px;
}

.historial-item {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  padding: 11px;
  background: #fff;
  box-shadow: 0 2px 7px rgba(23, 55, 94, 0.035);
}

.historial-servicio-icono {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #e0f5f4;
  color: #078e93;
}

.historial-servicio-contenido {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.historial-servicio-cabecera {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.historial-servicio-cabecera>strong {
  min-width: 0;
  font-size: 12px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.estado-reserva-chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 105px;
  padding: 4px 6px;
  border-radius: 7px;
  font-size: 8px !important;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
}

.estado-completada {
  color: #12805c !important;
  background: #dff7eb;
}

.estado-confirmada {
  color: #2768b2 !important;
  background: #e8f2ff;
}

.estado-pendiente {
  color: #a76512 !important;
  background: #fff0d9;
}

.estado-cancelada {
  color: #b93851 !important;
  background: #fce8ec;
}

.estado-no-asistio {
  color: #7c4bb3 !important;
  background: #f0e7ff;
}

.estado-registrado {
  color: #63758a !important;
  background: #edf1f5;
}

.historial-fecha-hora {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  color: #71849b;
}

.historial-fecha-hora span {
  font-size: 11px;
}

.historial-fecha-hora .historial-separador {
  padding: 0 2px;
  color: #b2bfcc;
}

.historial-servicio-pie {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.historial-servicio-pie>span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #71849b;
  font-size: 10px;
}

.historial-servicio-pie>strong {
  color: #17375e;
  font-size: 12px;
  font-weight: 900;
}

.historial-pago-info {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 12px;
  padding-top: 6px;
  border-top: 1px solid #edf1f6;
}

.historial-pago-info span {
  color: #71849b;
  font-size: 10px;
}

@media (max-width: 360px) {
  .historial-resumen {
    gap: 6px;
  }

  .historial-metrica {
    min-height: 98px;
    padding: 8px;
  }

  .historial-metrica>strong {
    font-size: 15px;
  }

  .historial-ultima-visita>strong {
    font-size: 10px;
  }

  .historial-item {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 8px;
    padding: 9px;
  }

  .historial-servicio-icono {
    width: 36px;
    height: 36px;
  }
}

/* PANTALLAS GRANDES */

@media (min-width: 700px) {

  .clientes-contenido {

    padding: 28px 24px;

  }

  .clientes-lista {

    gap: 11px;

  }

  .cliente-card {

    padding: 13px;

  }

  .cliente-avatar {

    width: 48px;

    height: 48px;

  }

  .cliente-info>strong {

    font-size: 14px;

  }

  .segmentacion-badge {

    max-width: 130px;

    font-size: 11px;

  }

}

/* MÓVILES ESTRECHOS */

@media (max-width: 360px) {
  .cliente-card {
    column-gap: 6px;
    padding: 8px 6px;
    grid-template-columns: 38px minmax(0, 1fr) auto 23px;
  }

  .cliente-card .cliente-avatar {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .cliente-card .segmentacion-badge {
    max-width: 76px;
    padding: 4px 5px;
    font-size: 8px;
  }

  .cliente-card .boton-opciones {
    width: 23px;
    min-width: 23px;
  }
}

/* COLORES DE LOS FILTROS */

.filtro-color-0 {

  background: #e0f7f7;

  color: #087e83;

}

.filtro-color-1 {

  background: #e4f8ef;

  color: #13865c;

}

.filtro-color-2 {

  background: #fff0df;

  color: #b75b14;

}

.filtro-color-3 {

  background: #e8f2ff;

  color: #2768b2;

}

.filtro-color-4 {

  background: #fce8ec;

  color: #c23b55;

}

.filtro-chip.activo {

  border-color: currentColor;

}


.cliente-card .cliente-descuentos-programados {
  grid-column: 2 / 4;
  grid-row: 4;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 5px;
  margin-top: 2px;
  padding: 4px 7px;
  border: 1px solid #cfe5fb;
  border-radius: 8px;
  background: #eff7ff;
  color: #2768b2;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.25;
}

</style>
