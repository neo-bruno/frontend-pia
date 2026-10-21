<template>
<div class="historial-page">
  <!-- ENCABEZADO -->
  <header class="historial-header">
    <div class="historial-icono">
      <v-icon size="25">mdi-clock-time-four-outline</v-icon>
    </div>

    <div class="historial-header__texto">
      <h1>Historial de servicios</h1>
      <p>Registro de los servicios atendidos por los clientes.</p>
    </div>
  </header>

  <!-- BÚSQUEDA Y FILTROS -->
  <div class="historial-busqueda">
    <v-text-field v-model="busqueda" placeholder="Buscar cliente, profesional..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable class="busqueda-input" @keyup.enter="aplicarBusqueda" @click:clear="limpiarBusqueda" />

    <v-btn class="boton-filtro" variant="outlined" icon="mdi-filter-outline" aria-label="Filtrar historial" @click="dialogFiltros = true">
      <v-icon size="23">mdi-filter-outline</v-icon>
    </v-btn>
  </div>

  <!-- FILTROS ACTIVOS -->
  <div v-if="hayFiltrosActivos" class="filtros-activos">
    <v-chip v-if="filtros.fechaDesde || filtros.fechaHasta" closable size="small" variant="tonal" color="primary" @click:close="limpiarFechas">
      <v-icon start size="15">mdi-calendar-range</v-icon>
      {{ formatoRangoFechas }}
    </v-chip>

    <v-chip v-if="filtros.negocioId" closable size="small" variant="tonal" color="primary" @click:close="filtros.negocioId = null; cargarHistorial()">
      {{ nombreNegocioSeleccionado }}
    </v-chip>

    <v-chip v-if="filtros.profesionalId" closable size="small" variant="tonal" color="primary" @click:close="filtros.profesionalId = null; cargarHistorial()">
      {{ nombreProfesionalSeleccionado }}
    </v-chip>

    <v-chip v-if="filtros.servicioId" closable size="small" variant="tonal" color="primary" @click:close="filtros.servicioId = null; cargarHistorial()">
      {{ nombreServicioSeleccionado }}
    </v-chip>

    <v-chip v-if="filtros.estado" closable size="small" variant="tonal" :color="colorEstado(filtros.estado)" @click:close="filtros.estado = null; cargarHistorial()">
      {{ etiquetaEstado(filtros.estado) }}
    </v-chip>
  </div>

  <!-- TOTAL -->
  
  <!-- TOTAL Y ACCIONES -->
  <div class="historial-contador">
    <span>{{ totalRegistros }} registros</span>
    <div class="historial-contador__acciones">
      <v-btn icon="mdi-chart-box-outline" variant="tonal" color="primary" density="comfortable" size="small" aria-label="Ver resumen del historial" @click="sheetResumen = true"/>
      <v-btn icon="mdi-refresh" variant="text" density="comfortable" size="small" aria-label="Actualizar historial" :loading="cargando" @click="cargarHistorial"/>
    </div>
  </div>


  <!-- CARGA -->
  <div v-if="cargando && registros.length === 0" class="estado-vacio">
    <v-progress-circular indeterminate color="primary" size="35" />
    <p>Cargando historial...</p>
  </div>

  <!-- LISTA -->
  <div v-else-if="registros.length" class="historial-lista">
    <article v-for="registro in registros" :key="registro.id" class="historial-card" @click="abrirDetalle(registro)">
      <div class="historial-card__superior">
        <div class="historial-fecha">
          <v-icon size="16">mdi-calendar-blank-outline</v-icon>
          <span>{{ formatearFecha(registro.fecha) }}</span>

          <v-icon size="16" class="ml-1">
            mdi-clock-outline
          </v-icon>
          <span>{{ formatearHora(registro.hora || registro.hora_inicio) }}</span>
        </div>

        <v-chip size="small" label class="estado-chip" :color="colorEstado(registro.estado)">
          <v-icon start size="13">
            {{ iconoEstado(registro.estado) }}
          </v-icon>
          {{ etiquetaEstado(registro.estado) }}
        </v-chip>
      </div>

      <div class="historial-card__contenido">
        <v-avatar size="46" color="blue-grey-lighten-4" class="avatar-cliente">
          <v-img v-if="registro.cliente_foto || registro.foto_cliente" :src="registro.cliente_foto || registro.foto_cliente" cover/>

          <span v-else class="text-subtitle-2 font-weight-bold text-primary">
            {{ obtenerIniciales(registro.cliente_nombre || registro.nombre_cliente || registro.nombre) }}
          </span>
        </v-avatar>

        <div class="historial-card__datos">
          <h2>{{ registro.cliente_nombre || registro.nombre_cliente || "Cliente" }}</h2>

          <p class="servicio-nombre">
            {{ registro.servicio_nombre || registro.nombre_servicio || "Servicio" }}
          </p>

          <p class="profesional-nombre">
            {{ registro.profesional_nombre || registro.nombre_profesional || "Profesional" }}
          </p>

          <p class="negocio-nombre">
            {{ registro.negocio_nombre || registro.nombre_negocio || "Negocio" }}
          </p>
        </div>

        <div class="historial-card__importe">
          <strong>{{ formatoImporte(registro.precio ?? registro.precio_aplicable ?? registro.monto) }}</strong>
          <v-icon size="19">mdi-chevron-right</v-icon>
        </div>
      </div>
    </article>

    <!-- PAGINACIÓN -->
    <div v-if="totalPaginas > 1" class="historial-paginacion">
      <v-btn icon="mdi-chevron-left" variant="outlined" size="small" :disabled="pagina <= 1" @click="cambiarPagina(pagina - 1)" />

      <span>{{ pagina }} de {{ totalPaginas }}</span>

      <v-btn icon="mdi-chevron-right" variant="outlined" size="small" :disabled="pagina >= totalPaginas" @click="cambiarPagina(pagina + 1)" />
    </div>
  </div>

  <!-- SIN REGISTROS -->
  <div v-else class="estado-vacio">
    <div class="estado-vacio__icono">
      <v-icon size="34">mdi-clipboard-text-clock-outline</v-icon>
    </div>

    <h2>No hay registros</h2>
    <p>
      No encontramos servicios con los filtros seleccionados.
    </p>

    <v-btn v-if="hayFiltrosActivos || busqueda" color="primary" variant="outlined" rounded="lg" @click="limpiarFiltros">
      Limpiar filtros
    </v-btn>
  </div>

  <!-- DIÁLOGO DE FILTROS -->
  <v-dialog v-model="dialogFiltros" max-width="440" width="calc(100% - 24px)" scrollable>
    <v-card class="dialogo-filtros" rounded="xl">
      <div class="dialogo-filtros__encabezado">
        <div>
          <h2>Filtrar historial</h2>
          <p>Encuentra los servicios que necesitas.</p>
        </div>

        <v-btn icon="mdi-close" variant="text" aria-label="Cerrar filtros" @click="dialogFiltros = false" />
      </div>

      <v-divider />

      <v-card-text class="dialogo-filtros__contenido">
        <label>Fecha desde</label>
        <v-text-field v-model="filtros.fechaDesde" type="date" variant="outlined" density="comfortable" hide-details />

        <label>Fecha hasta</label>
        <v-text-field v-model="filtros.fechaHasta" type="date" variant="outlined" density="comfortable" hide-details />

        <label>Negocio</label>
        <v-select v-model="filtros.negocioId" :items="opcionesNegocio" item-title="nombre" item-value="id" placeholder="Todos" prepend-inner-icon="mdi-store-outline" variant="outlined" density="comfortable" clearable hide-details />

        <label>Profesional</label>
        <v-select v-model="filtros.profesionalId" :items="opcionesProfesional" item-title="nombre" item-value="id" placeholder="Todos" prepend-inner-icon="mdi-account-outline" variant="outlined" density="comfortable" clearable hide-details />

        <label>Servicio</label>
        <v-select v-model="filtros.servicioId" :items="opcionesServicio" item-title="nombre" item-value="id" placeholder="Todos" prepend-inner-icon="mdi-content-cut" variant="outlined" density="comfortable" clearable hide-details />

        <label>Estado</label>
        <v-select v-model="filtros.estado" :items="opcionesEstado" item-title="nombre" item-value="id" placeholder="Todos" prepend-inner-icon="mdi-format-list-bulleted" variant="outlined" density="comfortable" clearable hide-details />
      </v-card-text>

      <v-divider />

      <v-card-actions class="dialogo-filtros__acciones">
        <v-btn variant="outlined" color="primary" rounded="lg" @click="limpiarFiltrosDialogo">
          Limpiar
        </v-btn>

        <v-btn color="primary" variant="flat" rounded="lg" :loading="cargando" @click="aplicarFiltros">
          Aplicar filtros
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- DETALLE DEL SERVICIO -->
  <v-dialog v-model="dialogDetalle" max-width="460" width="calc(100% - 24px)" scrollable>
    <v-card v-if="registroSeleccionado" class="dialogo-detalle" rounded="xl">
      <div class="dialogo-detalle__encabezado">
        <v-btn icon="mdi-arrow-left" variant="text" aria-label="Cerrar detalle" @click="dialogDetalle = false" />

        <h2>Detalle del servicio</h2>

        <v-spacer />

        <v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="dialogDetalle = false" />
      </div>

      <v-card-text class="dialogo-detalle__contenido">
        <div class="detalle-estado" :class="`detalle-estado--${claseEstado(registroSeleccionado.estado)}`">
          <v-icon size="24">
            {{ iconoEstado(registroSeleccionado.estado) }}
          </v-icon>

          <div>
            <strong>{{ etiquetaEstado(registroSeleccionado.estado) }}</strong>
            <span>Estado del registro</span>
          </div>
        </div>

        <div class="detalle-cliente">
          <v-avatar size="58" color="blue-grey-lighten-5">
            <v-img v-if="registroSeleccionado.cliente_foto || registroSeleccionado.foto_cliente" :src="registroSeleccionado.cliente_foto || registroSeleccionado.foto_cliente" cover />
            <v-icon v-else size="30">mdi-account</v-icon>
          </v-avatar>

          <div>
            <h3>
              {{ registroSeleccionado.cliente_nombre || registroSeleccionado.nombre_cliente || "Cliente" }}
            </h3>

            <p>
              <v-icon size="15">mdi-phone-outline</v-icon>
              {{ registroSeleccionado.cliente_telefono || registroSeleccionado.telefono_cliente || "Sin teléfono" }}
            </p>
          </div>
        </div>

        <div class="detalle-lista">
          <div class="detalle-fila">
            <v-icon>mdi-store-outline</v-icon>
            <div>
              <span>Negocio</span>
              <strong>{{ registroSeleccionado.negocio_nombre || registroSeleccionado.nombre_negocio || "No disponible" }}</strong>
            </div>
          </div>

          <div class="detalle-fila">
            <v-icon>mdi-account-outline</v-icon>
            <div>
              <span>Profesional</span>
              <strong>{{ registroSeleccionado.profesional_nombre || registroSeleccionado.nombre_profesional || "No disponible" }}</strong>
            </div>
          </div>

          <div class="detalle-fila">
            <v-icon>mdi-content-cut</v-icon>
            <div>
              <span>Servicio</span>
              <strong>{{ registroSeleccionado.servicio_nombre || registroSeleccionado.nombre_servicio || "No disponible" }}</strong>
            </div>
          </div>

          <div class="detalle-fila">
            <v-icon>mdi-calendar-blank-outline</v-icon>
            <div>
              <span>Fecha de la cita</span>
              <strong>{{ formatearFecha(registroSeleccionado.fecha) }}</strong>
            </div>
          </div>

          <div class="detalle-fila">
            <v-icon>mdi-clock-outline</v-icon>
            <div>
              <span>Horario</span>
              <strong>
                {{ formatearHora(registroSeleccionado.hora_inicio) }}
                <template v-if="registroSeleccionado.hora_fin">
                  – {{ formatearHora(registroSeleccionado.hora_fin) }}
                </template>
              </strong>
            </div>
          </div>

          <div class="detalle-fila">
            <v-icon>mdi-cash-multiple</v-icon>
            <div>
              <span>Precio del servicio</span>
              <strong>
                {{ formatoImporte(registroSeleccionado.precio ?? registroSeleccionado.precio_aplicable ?? registroSeleccionado.monto) }}
              </strong>
            </div>
          </div>

          <div class="detalle-fila">
            <v-icon>mdi-credit-card-outline</v-icon>
            <div>
              <span>Pago</span>
              <strong>
                {{ registroSeleccionado.estado_pago || registroSeleccionado.pago_estado || "No disponible" }}
              </strong>
            </div>
          </div>
        </div>

        <div v-if="registroSeleccionado.observaciones || registroSeleccionado.observacion" class="detalle-observaciones">
          <v-icon size="21">mdi-note-text-outline</v-icon>
          <div>
            <strong>Observaciones</strong>
            <p>{{ registroSeleccionado.observaciones || registroSeleccionado.observacion }}</p>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="dialogo-detalle__acciones">
        <v-btn block color="primary" variant="flat" rounded="lg" @click="dialogDetalle = false">
          Cerrar detalle
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  
  <!-- RESUMEN DEL HISTORIAL: BOTTOM SHEET -->
  <v-bottom-sheet v-model="sheetResumen" inset scrollable>
    <v-card class="resumen-sheet" rounded="t-xl">
      <div class="resumen-sheet__tirador">
        <span></span>
      </div>

      <div class="resumen-sheet__encabezado">
        <div>
          <h2>Resumen del historial</h2>
          <p>Estadísticas de todos los registros del historial filtrado.</p>
        </div>

        <v-btn icon="mdi-close" variant="text" density="comfortable" aria-label="Cerrar resumen" @click="sheetResumen = false"/>
      </div>

      <v-card-text class="resumen-sheet__contenido">
        <div class="resumen-total">
          <div class="resumen-total__icono">
            <v-icon size="25">mdi-calendar-check-outline</v-icon>
          </div>

          <div>
            <span>Total de servicios</span>
            <strong>{{ resumen.total }}</strong>
          </div>
        </div>

        <div class="resumen-estados">
          <div class="resumen-estado resumen-estado--atendido">
            <v-icon size="19">mdi-check-circle</v-icon>
            <strong>{{ resumen.atendidos }}</strong>
            <span>Atendidos</span>
          </div>

          <div class="resumen-estado resumen-estado--inasistencia">
            <v-icon size="19">mdi-clock-alert-outline</v-icon>
            <strong>{{ resumen.noAsistio }}</strong>
            <span>No asistió</span>
          </div>

          <div class="resumen-estado resumen-estado--cancelado">
            <v-icon size="19">mdi-close-circle</v-icon>
            <strong>{{ resumen.cancelados }}</strong>
            <span>Cancelados</span>
          </div>
        </div>

        <div class="servicios-populares">
          <h3>Servicios más solicitados</h3>

          <div v-for="(servicio, index) in serviciosPopulares" :key="servicio.nombre" class="servicio-popular">
            <div class="servicio-popular__icono">
              <v-icon size="17">
                {{
                  [
                    'mdi-content-cut',
                    'mdi-hand-heart',
                    'mdi-laser-pointer',
                    'mdi-nail',
                    'mdi-face-woman'
                  ][index] || 'mdi-star-outline'
                }}
              </v-icon>
            </div>

            <span>{{ servicio.nombre }}</span>
            <strong>{{ servicio.cantidad }} servicios</strong>
          </div>

          <p v-if="!serviciosPopulares.length" class="texto-sin-estadisticas">
            No hay servicios atendidos para mostrar estadísticas.
          </p>
        </div>
      </v-card-text>

      <v-card-actions class="resumen-sheet__acciones">
        <v-btn block color="primary" variant="outlined" rounded="lg" @click="sheetResumen = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>

</div>
</template>

<script>
import {
  getHistorial
} from "../services/historial.api";

const crearFiltros = () => ({
  fechaDesde: "",
  fechaHasta: "",
  negocioId: null,
  profesionalId: null,
  servicioId: null,
  estado: null,
});

export default {
  name: "HistorialAdminPage",

  data() {
    return {
      cargando: false,
      dialogFiltros: false,
      dialogDetalle: false,
      busqueda: "",
      registros: [],
      registroSeleccionado: null,

      totalRegistros: 0,
      pagina: 1,
      limite: 10,
      totalPaginas: 0,

      filtros: crearFiltros(),

      opcionesNegocio: [],
      opcionesProfesional: [],
      opcionesServicio: [],

      opcionesEstado: [{
          id: "COMPLETADA",
          nombre: "Atendido"
        },
        {
          id: "NO_ASISTIO",
          nombre: "No asistió"
        },
        {
          id: "CANCELADA",
          nombre: "Cancelada"
        },
      ],
      sheetResumen: false,

      resumen: {
        total: 0,
        atendidos: 0,
        noAsistio: 0,
        cancelados: 0,
      },
      serviciosPopulares: [],
    };
  },

  computed: {
    hayFiltrosActivos() {
      return Boolean(
        this.filtros.fechaDesde ||
        this.filtros.fechaHasta ||
        this.filtros.negocioId ||
        this.filtros.profesionalId ||
        this.filtros.servicioId ||
        this.filtros.estado,
      );
    },

    formatoRangoFechas() {
      const desde = this.filtros.fechaDesde ?
        this.formatearFecha(this.filtros.fechaDesde) :
        "Inicio";

      const hasta = this.filtros.fechaHasta ?
        this.formatearFecha(this.filtros.fechaHasta) :
        "Hoy";

      return `${desde} → ${hasta}`;
    },

    nombreNegocioSeleccionado() {
      return this.opcionesNegocio.find(
        (item) => String(item.id) === String(this.filtros.negocioId),
      )?.nombre || "Negocio";
    },

    nombreProfesionalSeleccionado() {
      return this.opcionesProfesional.find(
        (item) => String(item.id) === String(this.filtros.profesionalId),
      )?.nombre || "Profesional";
    },

    nombreServicioSeleccionado() {
      return this.opcionesServicio.find(
        (item) => String(item.id) === String(this.filtros.servicioId),
      )?.nombre || "Servicio";
    },
  },

  mounted() {
    this.cargarHistorial();
  },

  methods: {

    obtenerIniciales(nombre) {
      if (!nombre) return "?";

      return nombre
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra.charAt(0).toUpperCase())
        .join("");
    },
    
    async cargarHistorial() {
      this.cargando = true;

      try {
        const params = {
          pagina: this.pagina,
          limite: this.limite,
          fechaDesde: this.filtros.fechaDesde || undefined,
          fechaHasta: this.filtros.fechaHasta || undefined,
          negocioId: this.filtros.negocioId || undefined,
          profesionalId: this.filtros.profesionalId || undefined,
          servicioId: this.filtros.servicioId || undefined,
          estado: this.filtros.estado || undefined,
          busqueda: this.busqueda?.trim() || undefined,
        };

        const respuesta = await getHistorial(params);

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.mensaje || "No se pudo cargar el historial."
          );
        }

        const resultado = respuesta.data.data;

        // Registros de la página actual.
        const registros = Array.isArray(resultado)
          ? resultado
          : resultado?.registros || resultado?.items || [];

        // Normalizar el estado real de la reserva.
        this.registros = registros.map((registro) => ({
          ...registro,
          estado: registro.reserva_estado ?? registro.estado ?? null,
        }));

        // Paginación.
        this.totalRegistros = Number(
          resultado?.total ?? registros.length
        );

        this.totalPaginas = Number(
          resultado?.totalPaginas ??
          Math.ceil(this.totalRegistros / this.limite)
        );

        // Resumen global devuelto por el backend.
        this.resumen = {
          total: Number(
            resultado?.resumen?.total ?? this.totalRegistros
          ),
          atendidos: Number(resultado?.resumen?.atendidos ?? 0),
          noAsistio: Number(resultado?.resumen?.noAsistio ?? 0),
          cancelados: Number(resultado?.resumen?.cancelados ?? 0),
        };

        // Servicios populares devueltos por el backend.
        this.serviciosPopulares = Array.isArray(
          resultado?.serviciosPopulares
        )
          ? resultado.serviciosPopulares
          : [];

        // Opciones de filtros, si el backend las devuelve.
        if (resultado?.filtros) {
          this.opcionesNegocio =
            resultado.filtros.negocios || this.opcionesNegocio;

          this.opcionesProfesional =
            resultado.filtros.profesionales || this.opcionesProfesional;

          this.opcionesServicio =
            resultado.filtros.servicios || this.opcionesServicio;
        }
      } catch (error) {
        console.error("Error al cargar el historial:", error);

        this.$piaAlert.error(
          error.response?.data?.mensaje ||
            error.message ||
            "No se pudo cargar el historial.",
          {
            title: "Error al cargar el historial",
          }
        );
      } finally {
        this.cargando = false;
      }
    },

    async aplicarBusqueda() {
      this.pagina = 1;
      await this.cargarHistorial();
    },

    async limpiarBusqueda() {
      this.busqueda = "";
      this.pagina = 1;
      await this.cargarHistorial();
    },

    async aplicarFiltros() {
      if (
        this.filtros.fechaDesde &&
        this.filtros.fechaHasta &&
        this.filtros.fechaDesde > this.filtros.fechaHasta
      ) {
        this.$piaAlert.warning(
          "La fecha inicial no puede ser posterior a la fecha final.", {
            title: "Revisa las fechas"
          },
        );
        return;
      }

      this.pagina = 1;
      this.dialogFiltros = false;
      await this.cargarHistorial();
    },

    limpiarFiltrosDialogo() {
      this.filtros = crearFiltros();
    },

    async limpiarFiltros() {
      this.filtros = crearFiltros();
      this.busqueda = "";
      this.pagina = 1;
      this.dialogFiltros = false;
      await this.cargarHistorial();
    },

    async limpiarFechas() {
      this.filtros.fechaDesde = "";
      this.filtros.fechaHasta = "";
      this.pagina = 1;
      await this.cargarHistorial();
    },

    async cambiarPagina(nuevaPagina) {
      if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) {
        return;
      }

      this.pagina = nuevaPagina;
      await this.cargarHistorial();
    },

    abrirDetalle(registro) {
      this.registroSeleccionado = registro;
      this.dialogDetalle = true;
    },

    formatearFecha(fecha) {
      if (!fecha) return "Fecha no disponible";

      // Evita que una fecha YYYY-MM-DD cambie de día por la zona horaria.
      const coincidencia = String(fecha).match(
        /^(\d{4})-(\d{2})-(\d{2})/,
      );

      if (coincidencia) {
        const [, anio, mes, dia] = coincidencia;
        return `${dia}/${mes}/${anio}`;
      }

      const valor = new Date(fecha);

      if (Number.isNaN(valor.getTime())) return "Fecha no disponible";

      return new Intl.DateTimeFormat("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(valor);
    },

    formatearHora(hora) {
      if (!hora) return "--:--";

      const coincidencia = String(hora).match(/(\d{2}):(\d{2})/);

      return coincidencia ?
        `${coincidencia[1]}:${coincidencia[2]}` :
        "--:--";
    },

    formatoImporte(importe) {
      const valor = Number(importe);

      if (!Number.isFinite(valor)) return "Bs 0,00";

      return `Bs ${valor.toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },

    etiquetaEstado(estado) {
      const valor = String(estado || "").toUpperCase();

      const etiquetas = {
        COMPLETADA: "Atendido",
        ATENDIDO: "Atendido",
        ATENDIDA: "Atendido",
        NO_ASISTIO: "No asistió",
        CANCELADA: "Cancelada",
        CANCELADO: "Cancelada",
        CONFIRMADA: "Confirmada",
        PENDIENTE: "Pendiente",
      };

      return etiquetas[valor] || estado || "Sin estado";
    },

    colorEstado(estado) {
      const valor = String(estado || "").toUpperCase();
      
      if (["COMPLETADA", "ATENDIDO", "ATENDIDA"].includes(valor)) {
        return "success";
      }

      if (["NO_ASISTIO"].includes(valor)) return "warning";

      if (["CANCELADA", "CANCELADO"].includes(valor)) return "error";

      if (["CONFIRMADA"].includes(valor)) return "info";

      return "grey";
    },

    claseEstado(estado) {
      const valor = String(estado || "").toUpperCase();

      if (["COMPLETADA", "ATENDIDO", "ATENDIDA"].includes(valor)) {
        return "atendido";
      }

      if (valor === "NO_ASISTIO") return "inasistencia";

      if (["CANCELADA", "CANCELADO"].includes(valor)) {
        return "cancelado";
      }

      return "pendiente";
    },

    iconoEstado(estado) {
      const valor = String(estado || "").toUpperCase();

      if (["COMPLETADA", "ATENDIDO", "ATENDIDA"].includes(valor)) {
        return "mdi-check-circle";
      }

      if (valor === "NO_ASISTIO") return "mdi-clock-alert-outline";

      if (["CANCELADA", "CANCELADO"].includes(valor)) {
        return "mdi-close-circle";
      }

      return "mdi-clock-outline";
    },
  },
};
</script>

<style lang="scss" scoped>
.historial-page {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 16px 12px 28px;
  color: #18324d;
  background: #fff;
}

.historial-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.historial-icono,
.resumen-icono {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  color: #079b9a;
  background: #e1f7f4;
}

.historial-header__texto {
  min-width: 0;
}

.historial-header h1 {
  margin: 0;
  font-size: 23px;
  font-weight: 750;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.historial-header p,
.resumen-historial__encabezado p {
  margin: 4px 0 0;
  color: #61758d;
  font-size: 12px;
  line-height: 1.45;
}

.historial-busqueda {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.busqueda-input {
  flex: 1;
  min-width: 0;
}

.busqueda-input :deep(input) {
  font-size: 13px;
}

.boton-filtro {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-color: #dce7ef;
  border-radius: 12px;
  color: #183b5d;
}

.filtros-activos {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.filtros-activos :deep(.v-chip) {
  max-width: 100%;
}

.historial-contador {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #18324d;
  font-size: 12px;
  font-weight: 650;
}

.historial-lista {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.historial-card {
  min-width: 0;
  padding: 12px 11px;
  border: 1px solid #e4edf4;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 3px 12px rgb(31 68 97 / 4%);
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.historial-card:active {
  border-color: #079b9a;
}

.historial-card__superior {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  margin-bottom: 11px;
}

.historial-fecha {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  color: #536b85;
  font-size: 11px;
}

.estado-chip {
  flex-shrink: 0;
  height: 25px;
  font-size: 10px;
  font-weight: 650;
}

.historial-card__contenido {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.avatar-cliente {
  flex: 0 0 46px;
}

.historial-card__datos {
  flex: 1;
  min-width: 0;
}

.historial-card__datos h2 {
  margin: 0 0 3px;
  color: #18324d;
  font-size: 13px;
  font-weight: 750;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.historial-card__datos p {
  margin: 2px 0;
  font-size: 11px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.servicio-nombre {
  color: #304b68;
  font-weight: 600;
}

.profesional-nombre,
.negocio-nombre {
  color: #61758d;
}

.historial-card__importe {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 2px;
  color: #18324d;
}

.historial-card__importe strong {
  font-size: 12px;
  white-space: nowrap;
}

.historial-paginacion {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  padding: 16px 0 4px;
  font-size: 12px;
}

.estado-vacio {
  display: flex;
  min-height: 210px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 18px;
  text-align: center;
}

.estado-vacio__icono {
  display: flex;
  width: 65px;
  height: 65px;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  color: #079b9a;
  background: #e7f8f5;
}

.estado-vacio h2 {
  margin: 0;
  font-size: 16px;
}

.estado-vacio p {
  max-width: 270px;
  margin: 0;
  color: #61758d;
  font-size: 12px;
  line-height: 1.5;
}

.resumen-historial {
  margin-top: 25px;
  padding: 15px 12px;
  border: 1px solid #e2edf3;
  border-radius: 18px;
  background: #fbfdff;
}

.resumen-historial__encabezado {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
}

.resumen-historial__encabezado h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 750;
  line-height: 1.3;
}

.resumen-total {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid #e3edf4;
  border-radius: 13px;
  background: #fff;
}

.resumen-total__icono {
  display: flex;
  width: 43px;
  height: 43px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #079b9a;
  background: #e2f7f5;
}

.resumen-total span,
.resumen-total strong {
  display: block;
}

.resumen-total span {
  color: #61758d;
  font-size: 11px;
}

.resumen-total strong {
  margin-top: 2px;
  font-size: 23px;
  line-height: 1.2;
}

.resumen-estados {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-top: 9px;
}

.resumen-estado {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 11px 8px;
  border: 1px solid transparent;
  border-radius: 12px;
}

.resumen-estado strong {
  font-size: 19px;
  line-height: 1.2;
}

.resumen-estado span {
  font-size: 10px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.resumen-estado--atendido {
  color: #07875b;
  background: #effbf5;
  border-color: #d9f3e5;
}

.resumen-estado--inasistencia {
  color: #bd7a0b;
  background: #fff9e9;
  border-color: #f7ebc7;
}

.resumen-estado--cancelado {
  color: #cf4141;
  background: #fff2f1;
  border-color: #f7dedd;
}

.servicios-populares {
  margin-top: 20px;
}

.servicios-populares h3 {
  margin: 0 0 11px;
  font-size: 13px;
  font-weight: 750;
}

.servicio-popular {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 9px 0;
  border-bottom: 1px solid #edf1f5;
}

.servicio-popular:last-of-type {
  border-bottom: none;
}

.servicio-popular__icono {
  display: flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #078f91;
  background: #e6f8f6;
}

.servicio-popular span {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.servicio-popular strong {
  flex-shrink: 0;
  color: #526b85;
  font-size: 10px;
  text-align: right;
}

.texto-sin-estadisticas,
.nota-estadisticas {
  color: #8291a3;
  font-size: 10px;
  line-height: 1.5;
}

.nota-estadisticas {
  margin: 14px 0 0;
}

.dialogo-filtros,
.dialogo-detalle {
  overflow: hidden;
}

.dialogo-filtros__encabezado,
.dialogo-detalle__encabezado {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 14px;
}

.dialogo-filtros__encabezado>div {
  flex: 1;
  min-width: 0;
}

.dialogo-filtros__encabezado h2,
.dialogo-detalle__encabezado h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 750;
  line-height: 1.35;
}

.dialogo-filtros__encabezado p {
  margin: 4px 0 0;
  color: #61758d;
  font-size: 11px;
}

.dialogo-filtros__contenido,
.dialogo-detalle__contenido {
  padding: 17px 16px;
}

.dialogo-filtros__contenido label {
  display: block;
  margin: 0 0 7px;
  color: #18324d;
  font-size: 12px;
  font-weight: 650;
}

.dialogo-filtros__contenido :deep(.v-input) {
  margin-bottom: 16px;
}

.dialogo-filtros__contenido :deep(.v-input:last-child) {
  margin-bottom: 0;
}

.dialogo-filtros__contenido :deep(input),
.dialogo-filtros__contenido :deep(.v-field__input) {
  font-size: 13px;
}

.dialogo-filtros__acciones {
  display: flex;
  gap: 9px;
  padding: 14px 16px;
}

.dialogo-filtros__acciones .v-btn {
  flex: 1;
  min-width: 0;
  font-size: 12px;
}

.dialogo-detalle__encabezado {
  padding: 8px 10px;
}

.dialogo-detalle__encabezado h2 {
  font-size: 15px;
}

.dialogo-detalle__contenido {
  padding-top: 10px;
}

.detalle-estado {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border-radius: 12px;
}

.detalle-estado strong,
.detalle-estado span {
  display: block;
}

.detalle-estado strong {
  font-size: 13px;
}

.detalle-estado span {
  margin-top: 3px;
  font-size: 11px;
}

.detalle-estado--atendido {
  color: #087e57;
  background: #e5f9ef;
}

.detalle-estado--inasistencia {
  color: #a76b08;
  background: #fff5dc;
}

.detalle-estado--cancelado {
  color: #c63e3e;
  background: #fff0ef;
}

.detalle-estado--pendiente {
  color: #526b85;
  background: #f0f5fa;
}

.detalle-cliente {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px 0;
  border-bottom: 1px solid #e8eef3;
}

.detalle-cliente h3 {
  margin: 0;
  font-size: 15px;
  overflow-wrap: anywhere;
}

.detalle-cliente p {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 5px 0 0;
  color: #61758d;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.detalle-lista {
  display: flex;
  flex-direction: column;
}

.detalle-fila {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 13px 0;
  border-bottom: 1px solid #edf1f5;
}

.detalle-fila>.v-icon {
  flex: 0 0 22px;
  color: #627c96;
}

.detalle-fila div {
  flex: 1;
  min-width: 0;
}

.detalle-fila span,
.detalle-fila strong {
  display: block;
  overflow-wrap: anywhere;
}

.detalle-fila span {
  margin-bottom: 4px;
  color: #7b8ca0;
  font-size: 11px;
}

.detalle-fila strong {
  color: #18324d;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.45;
}

.detalle-observaciones {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 15px;
  padding: 13px;
  border-radius: 12px;
  color: #23617b;
  background: #edf8ff;
}

.detalle-observaciones strong {
  font-size: 12px;
}

.detalle-observaciones p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.dialogo-detalle__acciones {
  padding: 12px 16px 16px;
}

@media (min-width: 600px) {
  .historial-page {
    padding: 22px 18px 32px;
  }

  .historial-card {
    padding: 14px;
  }

  .historial-header h1 {
    font-size: 23px;
  }

  .resumen-historial {
    padding: 18px;
  }
}

@media (max-width: 360px) {
  .historial-page {
    padding-right: 9px;
    padding-left: 9px;
  }

  .historial-header {
    gap: 9px;
  }

  .historial-header h1 {
    font-size: 20px;
  }

  .historial-card {
    padding: 10px 8px;
  }

  .historial-card__contenido {
    gap: 7px;
  }

  .avatar-cliente {
    flex-basis: 39px;
  }

  .historial-card__importe strong {
    font-size: 11px;
  }

  .historial-card__datos h2 {
    font-size: 12px;
  }

  .resumen-estado {
    padding: 9px 6px;
  }
}


.historial-contador__acciones {
  display: flex;
  align-items: center;
  gap: 5px;
}

.resumen-sheet {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  max-height: 88dvh;
  overflow-y: auto;
  color: #18324d;
  background: #fff;
}

.resumen-sheet__tirador {
  display: flex;
  justify-content: center;
  padding: 10px 0 5px;
}

.resumen-sheet__tirador span {
  width: 38px;
  height: 4px;
  border-radius: 10px;
  background: #b8c5d0;
}

.resumen-sheet__encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px 14px;
}

.resumen-sheet__encabezado h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 750;
}

.resumen-sheet__encabezado p {
  margin: 4px 0 0;
  color: #61758d;
  font-size: 12px;
  line-height: 1.45;
}

.resumen-sheet__contenido {
  padding: 8px 16px 16px;
}

.resumen-sheet .resumen-estados {
  gap: 7px;
}

.resumen-sheet .resumen-estado {
  padding: 12px 9px;
}

.resumen-sheet .servicios-populares {
  margin-top: 20px;
}

.resumen-sheet__acciones {
  padding: 12px 16px calc(16px + env(safe-area-inset-bottom));
  background: #fff;
}

@media (max-width: 360px) {
  .resumen-sheet__contenido {
    padding-right: 12px;
    padding-left: 12px;
  }

  .resumen-sheet .resumen-estado {
    padding: 9px 6px;
  }
}

</style>
