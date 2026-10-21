<template>
<v-bottom-sheet :model-value="modelValue" inset scrollable @update:model-value="cerrarSheet">
  <v-card class="segmentacion-sheet" rounded="t-xl">
    <!-- ENCABEZADO -->
    <header class="sheet-header">
      <button v-if="vista !== 'resumen'" class="btn-volver" type="button" aria-label="Volver" @click="vista = 'resumen'">
        <v-icon>mdi-arrow-left</v-icon>
      </button>

      <div class="header-texto">
        <h2>{{ tituloVista }}</h2>
        <p v-if="vista === 'resumen'">
          Comportamiento y fidelidad del cliente
        </p>
      </div>

      <v-btn icon="mdi-close" variant="text" density="comfortable" aria-label="Cerrar" @click="cerrarSheet(false)" />
    </header>

    <!-- CONTENIDO -->
    <div class="sheet-content">
      <!-- CARGANDO -->
      <div v-if="loading" class="estado-contenido">
        <v-progress-circular indeterminate color="teal" size="36" />
        <span>Analizando el historial del cliente...</span>
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="estado-contenido">
        <v-icon color="error" size="38">
          mdi-alert-circle-outline
        </v-icon>

        <p>{{ error }}</p>

        <v-btn color="teal" variant="tonal" rounded="lg" @click="cargarDatos">
          Reintentar
        </v-btn>
      </div>

      <template v-else>
        <!-- IDENTIDAD DEL CLIENTE -->
        <section class="cliente-resumen">
          <div class="avatar-cliente">
            {{ inicialesCliente }}
          </div>

          <div class="cliente-identidad">
            <h3>{{ nombreCliente }}</h3>
            <p>{{ telefonoCliente || "Sin teléfono" }}</p>

            <span v-if="segmentoActual" class="segmento-chip" :class="claseSegmento(segmentoActual.nombre)">
              <v-icon size="15">mdi-account-group</v-icon>
              {{ segmentoActual.nombre }}
            </span>

            <span v-else class="segmento-chip sin-segmento">
              SIN SEGMENTO
            </span>
          </div>
        </section>

        <!-- VISTA 1: RESUMEN -->
        <template v-if="vista === 'resumen'">
          <section v-if="segmentoActual" class="segmento-destacado" :class="claseSegmento(segmentoActual.nombre)">
            <div class="segmento-icono">
              <v-icon size="32">mdi-account-group</v-icon>
            </div>

            <div class="segmento-informacion">
              <span class="texto-secundario">Segmento actual</span>
              <h3>{{ segmentoActual.nombre }}</h3>
              <strong>{{ segmentoActual.descripcion }}</strong>

              <p>
                {{ descripcionSegmentoActual }}
              </p>
            </div>

            <span class="estado-chip">ACTIVO</span>
          </section>

          <section v-else class="sin-clasificacion">
            <v-icon size="30">mdi-account-clock-outline</v-icon>
            <div>
              <strong>Segmentación pendiente</strong>
              <p>
                Registra una atención para que PIA pueda evaluar
                el comportamiento de este cliente.
              </p>
            </div>
          </section>

          <!-- ESTADÍSTICAS -->
          <section class="estadisticas-grid">
            <article class="estadistica-card">
              <div class="estadistica-icono azul">
                <v-icon>mdi-calendar-check</v-icon>
              </div>
              <strong>{{ totalAtenciones }}</strong>
              <span>Atenciones totales</span>
            </article>

            <article class="estadistica-card">
              <div class="estadistica-icono verde">
                <v-icon>mdi-calendar-clock</v-icon>
              </div>
              <strong>{{ diasUltimaAtencionTexto }}</strong>
              <span>Desde la última atención</span>
            </article>

            <article class="estadistica-card">
              <div class="estadistica-icono violeta">
                <v-icon>mdi-calendar-month</v-icon>
              </div>
              <strong>
                {{ segmentoActual?.periodo_dias ?? "—" }}
                <small v-if="segmentoActual?.periodo_dias != null">
                  días
                </small>
              </strong>
              <span>Período de análisis</span>
            </article>

            <article class="estadistica-card">
              <div class="estadistica-icono turquesa">
                <v-icon>mdi-chart-timeline-variant</v-icon>
              </div>
              <strong>{{ intervaloPromedioTexto }}</strong>
              <span>Intervalo promedio</span>
            </article>
          </section>

          <!-- EXPLICACIÓN -->
          <section class="nota-automatica">
            <v-icon size="25">mdi-information-outline</v-icon>
            <p>
              La segmentación se actualiza automáticamente según
              el historial de atenciones y los parámetros definidos
              por el negocio.
            </p>
          </section>

          <!-- ACCESOS -->
          <button class="acceso-vista" type="button" @click="abrirVista('historial')">
            <v-icon size="25">mdi-file-document-outline</v-icon>
            <span>Ver historial de segmentación</span>
            <v-spacer />
            <v-icon>mdi-chevron-right</v-icon>
          </button>

          <button class="acceso-vista" type="button" @click="abrirVista('detalle')">
            <v-icon size="25">mdi-chart-box-outline</v-icon>
            <span>Ver detalle del segmento</span>
            <v-spacer />
            <v-icon>mdi-chevron-right</v-icon>
          </button>
        </template>

        <!-- VISTA 2: HISTORIAL -->
        <template v-else-if="vista === 'historial'">
          <div class="seccion-titulo">
            <div>
              <h3>Historial de segmentación</h3>
              <p>
                Asignaciones registradas por el sistema
              </p>
            </div>

            <span class="contador">
              {{ historial.length }}
            </span>
          </div>

          <div v-if="!historial.length" class="vacio">
            <v-icon size="42">mdi-timeline-clock-outline</v-icon>
            <strong>Sin cambios registrados</strong>
            <p>
              Todavía no hay asignaciones de segmentos
              registradas en el historial.
            </p>
          </div>

          <div v-else class="timeline">
            <article v-for="(item, index) in historial" :key="`${item.historial_id}-${item.segmentacion_id}`" class="timeline-item">
              <div class="timeline-punto" :class="claseSegmento(item.segmentacion_nombre)">
                <v-icon size="16">
                  {{ iconoSegmento(item.segmentacion_nombre) }}
                </v-icon>
              </div>

              <div class="timeline-card">
                <div class="timeline-cabecera">
                  <div>
                    <h4>{{ item.segmentacion_nombre }}</h4>
                    <span class="fecha">
                      {{ formatearFecha(item.fecha_atencion) }}
                    </span>
                  </div>

                  <span v-if="index === 0 && esSegmentoActual(item)" class="estado-chip">
                    ACTUAL
                  </span>
                </div>

                <p>
                  {{ item.descripcion || "Segmento registrado por PIA." }}
                </p>

                <div class="parametros-mini">
                  <div>
                    <strong>{{ item.min_atenciones }}</strong>
                    <span>Atenciones mínimas</span>
                  </div>

                  <div>
                    <strong>{{ valorParametro(item.periodo_dias) }}</strong>
                    <span>Período (días)</span>
                  </div>

                  <div>
                    <strong>
                      {{ valorParametro(item.max_intervalo_dias) }}
                    </strong>
                    <span>Intervalo máximo</span>
                  </div>

                  <div>
                    <strong>
                      {{ valorParametro(item.max_dias_ultima_atencion) }}
                    </strong>
                    <span>Días última atención</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <p class="nota-historial">
            La fecha mostrada corresponde a la atención vinculada
            al registro, no necesariamente al momento exacto
            en que se recalculó el segmento.
          </p>
        </template>

        <!-- VISTA 3: DETALLE -->
        <template v-else-if="vista === 'detalle'">
          <section v-if="segmentoActual" class="segmento-destacado detalle-destacado" :class="claseSegmento(segmentoActual.nombre)">
            <div class="segmento-icono">
              <v-icon size="32">
                {{ iconoSegmento(segmentoActual.nombre) }}
              </v-icon>
            </div>

            <div class="segmento-informacion">
              <div class="detalle-titulo">
                <h3>{{ segmentoActual.nombre }}</h3>
                <span class="estado-chip">ACTIVO</span>
              </div>

              <strong>{{ segmentoActual.descripcion }}</strong>
              <p>{{ descripcionSegmentoActual }}</p>
            </div>
          </section>

          <div v-else class="sin-clasificacion">
            No hay un segmento actual calculado para este cliente.
          </div>

          <div class="seccion-titulo">
            <div>
              <h3>Parámetros del segmento</h3>
              <p>Reglas configuradas en el catálogo de PIA</p>
            </div>
          </div>

          <section v-if="segmentoActual" class="parametros-grid">
            <article class="parametro-card">
              <v-icon color="blue">mdi-account-group</v-icon>
              <strong>{{ segmentoActual.min_atenciones }}</strong>
              <span>Atenciones mínimas</span>
            </article>

            <article class="parametro-card">
              <v-icon color="blue">mdi-calendar-range</v-icon>
              <strong>
                {{ valorParametro(segmentoActual.periodo_dias) }}
              </strong>
              <span>Período de análisis (días)</span>
            </article>

            <article class="parametro-card">
              <v-icon color="teal">mdi-clock-outline</v-icon>
              <strong>
                {{ valorParametro(segmentoActual.max_intervalo_dias) }}
              </strong>
              <span>Intervalo máximo (días)</span>
            </article>

            <article class="parametro-card">
              <v-icon color="teal">mdi-calendar-check</v-icon>
              <strong>
                {{ valorParametro(segmentoActual.max_dias_ultima_atencion) }}
              </strong>
              <span>Máx. días desde la última atención</span>
            </article>
          </section>

          <section class="nota-automatica">
            <v-icon size="25">mdi-target</v-icon>
            <p>
              PIA evalúa automáticamente el historial del cliente
              y determina el segmento que cumple las reglas
              de mayor jerarquía.
            </p>
          </section>

          <div class="seccion-titulo">
            <div>
              <h3>Comparativa de segmentos</h3>
              <p>Catálogo de segmentos activos</p>
            </div>
          </div>

          <div class="tabla-scroll">
            <table class="tabla-segmentos">
              <thead>
                <tr>
                  <th>Segmento</th>
                  <th>Mín.</th>
                  <th>Período</th>
                  <th>Intervalo</th>
                  <th>Última atención</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="segmento in segmentosOrdenados" :key="segmento.id" :class="{
                      'fila-actual':
                        Number(segmento.id) ===
                        Number(segmentoActual?.id),
                    }">
                  <td>
                    <span class="punto-segmento" :class="claseSegmento(segmento.nombre)" />
                    {{ segmento.nombre }}
                  </td>
                  <td>{{ segmento.min_atenciones }}</td>
                  <td>{{ valorParametro(segmento.periodo_dias) }}</td>
                  <td>{{ valorParametro(segmento.max_intervalo_dias) }}</td>
                  <td>
                    {{ valorParametro(segmento.max_dias_ultima_atencion) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
    </div>
  </v-card>
</v-bottom-sheet>
</template>

<script>
import {
  getSegmentacion,
  getSegmentacionCliente,
  getHistorialSegmentacionCliente,
} from "../services/segmentacion.api";

export default {
  name: "SegmentacionClienteSheet",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    cliente: {
      type: Object,
      default: null,
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      vista: "resumen",
      loading: false,
      error: null,
      datos: null,
      historial: [],
      segmentos: [],
      solicitud: 0,
    };
  },

  computed: {
    nombreCliente() {
      const c = this.cliente || {};

      return (
        c.nombre_completo ||
        c.nombre || [c.nombres, c.apellido_paterno, c.apellido_materno]
        .filter(Boolean)
        .join(" ") ||
        c.alias ||
        "Cliente"
      );
    },

    telefonoCliente() {
      return this.cliente?.telefono || "";
    },

    inicialesCliente() {
      const palabras = this.nombreCliente
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      return palabras
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join("");
    },

    tituloVista() {
      return {
        resumen: "Segmentación del cliente",
        historial: "Historial de segmentación",
        detalle: "Detalle del segmento",
      } [this.vista];
    },

    segmentoActual() {
      return this.datos?.segmentacion_actual || null;
    },

    totalAtenciones() {
      return Number(this.datos?.total_atenciones || 0);
    },

    ultimaAtencion() {
      return this.datos?.ultima_atencion || null;
    },

    diasUltimaAtencionTexto() {
      if (!this.ultimaAtencion) return "—";

      const fecha = new Date(this.ultimaAtencion);
      if (Number.isNaN(fecha.getTime())) return "—";

      const hoy = new Date();

      return `${Math.max(
        0,
        Math.floor(
          (Date.UTC(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
          ) -
            Date.UTC(
              fecha.getFullYear(),
              fecha.getMonth(),
              fecha.getDate()
            )) /
            86400000
        )
      )} días`;
    },

    intervaloPromedioTexto() {
      const fechas = [...new Set(
        (this.datos?.atenciones || [])
        .map((item) => item.fecha)
        .filter(Boolean)
        .map((fecha) => new Date(fecha).toISOString().slice(0, 10))
      )].sort();

      if (fechas.length < 2) return "—";

      const diferencias = [];

      for (let i = 1; i < fechas.length; i += 1) {
        const anterior = new Date(`${fechas[i - 1]}T00:00:00Z`);
        const actual = new Date(`${fechas[i]}T00:00:00Z`);

        diferencias.push(
          (actual - anterior) / 86400000
        );
      }

      const promedio =
        diferencias.reduce((total, dias) => total + dias, 0) /
        diferencias.length;

      return `${Math.round(promedio)} días`;
    },

    descripcionSegmentoActual() {
      const segmento = this.segmentoActual;

      if (!segmento) return "";

      const nombre = String(segmento.nombre || "").toUpperCase();

      if (nombre === "NUEVO") {
        return "Cliente con al menos una atención registrada.";
      }

      const minimo = Number(segmento.min_atenciones);
      const periodo = segmento.periodo_dias;
      const intervalo = segmento.max_intervalo_dias;

      return `Cliente con ${minimo} o más atenciones en los últimos ${periodo} días y un intervalo máximo de ${intervalo} días entre visitas.`;
    },

    segmentosOrdenados() {
      return [...this.segmentos].sort(
        (a, b) => Number(a.orden) - Number(b.orden)
      );
    },
  },

  watch: {
    modelValue(abierto) {
      if (abierto) {
        this.vista = "resumen";
        this.cargarDatos();
      } else {
        this.solicitud += 1;
      }
    },

    "cliente.id"(nuevo, anterior) {
      if (nuevo && nuevo !== anterior && this.modelValue) {
        this.vista = "resumen";
        this.cargarDatos();
      }
    },
  },

  methods: {
    cerrarSheet(valor) {
      this.$emit("update:modelValue", valor);

      if (!valor) {
        this.vista = "resumen";
      }
    },

    async cargarDatos() {
      const clienteId = this.cliente?.cliente_id;

      if (!clienteId) {
        this.error = "No se recibió el identificador del cliente.";
        this.datos = null;
        this.historial = [];
        return;
      }

      const solicitudActual = ++this.solicitud;

      this.loading = true;
      this.error = null;

      try {
        const [respuestaSegmentacion, respuestaHistorial, respuestaCatalogo] =
        await Promise.all([
          getSegmentacionCliente(clienteId),
          getHistorialSegmentacionCliente(clienteId),
          getSegmentacion(),
        ]);

        if (solicitudActual !== this.solicitud) return;

        this.datos =
          respuestaSegmentacion.data?.data??
          respuestaSegmentacion.data;

        this.historial =
          respuestaHistorial.data?.data??
          respuestaHistorial.data?? [];

        this.segmentos =
          respuestaCatalogo.data?.data??
          respuestaCatalogo.data?? [];

        if (!Array.isArray(this.historial)) this.historial = [];
        if (!Array.isArray(this.segmentos)) this.segmentos = [];
      } catch (error) {
        if (solicitudActual !== this.solicitud) return;

        console.error(
          "ERROR CARGAR SEGMENTACIÓN DEL CLIENTE:",
          error
        );

        this.$piaAlert.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Ocurrió un error inesperado",
        {
          title: "Error al Cargar la segmentacion del cliente!",
        }
      );
      } finally {
        if (solicitudActual === this.solicitud) {
          this.loading = false;
        }
      }
    },

    abrirVista(vista) {
      this.vista = vista;
    },

    valorParametro(valor) {
      return valor === null || valor === undefined || valor === "" ?
        "—" :
        valor;
    },

    formatearFecha(fecha) {
      if (!fecha) return "Fecha no disponible";

      const valor = new Date(fecha);
      if (Number.isNaN(valor.getTime())) return "Fecha no disponible";

      return valor.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    },

    claseSegmento(nombre) {
      return `segmento-${String(nombre || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}`;
    },

    iconoSegmento(nombre) {
      const iconos = {
        NUEVO: "mdi-account-outline",
        OCASIONAL: "mdi-account-star-outline",
        CONSTANTE: "mdi-account-group-outline",
        FRECUENTE: "mdi-account-multiple-check",
        FIEL: "mdi-heart",
      };

      return iconos[String(nombre || "").toUpperCase()] ||
        "mdi-account-group-outline";
    },

    esSegmentoActual(item) {
      return (
        Number(item.segmentacion_id) ===
        Number(this.segmentoActual?.id)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.segmentacion-sheet {
  max-height: 92dvh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  color: #10284c;
  overflow: hidden;
}

.sheet-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 18px 14px;
  background: #fff;
  border-bottom: 1px solid #e9eef5;
  flex-shrink: 0;
}

.header-texto {
  flex: 1;
  min-width: 0;
}

.header-texto h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 750;
  line-height: 1.3;
}

.header-texto p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7385a0;
}

.btn-volver {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 38px;
  border: 0;
  background: transparent;
  color: #10284c;
}

.sheet-content {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px;
  padding-bottom: max(28px, env(safe-area-inset-bottom));
}

.estado-contenido {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  color: #667a96;
  font-size: 13px;
}

.cliente-resumen {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px;
  background: #fff;
  border: 1px solid #e8eef6;
  border-radius: 17px;
  margin-bottom: 14px;
}

.avatar-cliente {
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dff5f3;
  color: #008e91;
  font-size: 21px;
  font-weight: 800;
}

.cliente-identidad {
  min-width: 0;
}

.cliente-identidad h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 750;
  overflow-wrap: anywhere;
}

.cliente-identidad p {
  margin: 3px 0 7px;
  color: #7184a0;
  font-size: 13px;
}

.segmento-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.25px;
}

.segmento-destacado {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 17px 13px;
  margin-bottom: 14px;
  border-radius: 17px;
  border: 1px solid transparent;
}

.segmento-icono {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.72);
}

.segmento-informacion {
  flex: 1;
  min-width: 0;
  padding-right: 0;
}

.texto-secundario {
  font-size: 12px;
  font-weight: 650;
}

.segmento-informacion h3 {
  margin: 3px 0;
  font-size: 23px;
  line-height: 1.15;
  font-weight: 850;
}

.segmento-informacion strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.segmento-informacion p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #536985;
}

.estado-chip {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 6px 9px;
  border-radius: 9px;
  background: #c9f7e8;
  color: #008b69;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.segmento-destacado>.estado-chip {
  position: absolute;
  top: 15px;
  right: 12px;
}

.segmento-destacado .segmento-informacion {
  padding-right: 4px;
}

.segmento-destacado:has(> .estado-chip) .segmento-informacion h3 {
  padding-right: 0;
}

.estadisticas-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.estadistica-card {
  min-width: 0;
  min-height: 120px;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 7px;
  background: #fff;
  border: 1px solid #e8eef6;
  border-radius: 14px;
}

.estadistica-icono {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
}

.estadistica-icono.azul {
  background: #e5f1ff;
  color: #1687f8;
}

.estadistica-icono.verde {
  background: #e0f8ed;
  color: #00a87b;
}

.estadistica-icono.violeta {
  background: #f1e9ff;
  color: #9b54f5;
}

.estadistica-icono.turquesa {
  background: #dff8f5;
  color: #00a99c;
}

.estadistica-card>strong {
  font-size: 18px;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.estadistica-card small {
  font-size: 10px;
}

.estadistica-card>span {
  color: #70829e;
  font-size: 10px;
  line-height: 1.4;
}

.nota-automatica {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: #eaf6ff;
  color: #1687ed;
}

.nota-automatica p {
  margin: 0;
  color: #58718f;
  font-size: 12px;
  line-height: 1.6;
}

.acceso-vista {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 16px 13px;
  margin-top: 9px;
  text-align: left;
  background: #fff;
  border: 1px solid #e7edf5;
  border-radius: 14px;
  color: #142b4d;
  font-size: 13px;
  font-weight: 700;
}

.acceso-vista>.v-icon:first-child {
  color: #17355f;
}

.acceso-vista>.v-icon:last-child {
  color: #607998;
}

.sin-clasificacion {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px;
  margin-bottom: 14px;
  background: #fff6e8;
  color: #a86b0a;
  border-radius: 15px;
}

.sin-clasificacion strong {
  display: block;
  font-size: 14px;
}

.sin-clasificacion p {
  margin: 5px 0 0;
  color: #7b6a4e;
  font-size: 12px;
  line-height: 1.5;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 20px 0 12px;
}

.seccion-titulo h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
}

.seccion-titulo p {
  margin: 4px 0 0;
  color: #7b8ca5;
  font-size: 11px;
}

.contador {
  display: grid;
  place-items: center;
  min-width: 29px;
  height: 29px;
  padding: 0 7px;
  border-radius: 10px;
  background: #e2f6f5;
  color: #008f91;
  font-size: 12px;
  font-weight: 800;
}

.vacio {
  padding: 35px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  background: #fff;
  border: 1px solid #e7edf5;
  border-radius: 16px;
  color: #7185a0;
}

.vacio strong {
  color: #193657;
  font-size: 14px;
}

.vacio p {
  max-width: 260px;
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
}

.timeline {
  position: relative;
  padding-left: 25px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 9px;
  top: 17px;
  bottom: 18px;
  width: 2px;
  background: linear-gradient(#00b795, #2b9df4, #f5a000, #a1aaba);
}

.timeline-item {
  position: relative;
  margin-bottom: 12px;
}

.timeline-punto {
  position: absolute;
  left: -25px;
  top: 15px;
  z-index: 1;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  border: 2px solid currentColor;
}

.timeline-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e6edf5;
  border-radius: 15px;
}

.timeline-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 13px 12px 10px;
}

.timeline-cabecera h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 850;
}

.fecha {
  display: block;
  margin-top: 4px;
  color: #7185a0;
  font-size: 11px;
}

.timeline-card>p {
  margin: 0;
  padding: 0 12px 12px;
  color: #607590;
  font-size: 12px;
  line-height: 1.5;
}

.parametros-mini {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 10px 3px;
  background: #f8fafc;
  border-top: 1px solid #e8eef6;
}

.parametros-mini>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 0 3px;
  text-align: center;
  border-right: 1px solid #e4eaf2;
}

.parametros-mini>div:last-child {
  border-right: 0;
}

.parametros-mini strong {
  font-size: 14px;
}

.parametros-mini span {
  color: #6f819a;
  font-size: 9px;
  line-height: 1.35;
}

.nota-historial {
  margin: 14px 2px 0;
  color: #8290a5;
  font-size: 10px;
  line-height: 1.5;
}

.detalle-destacado {
  margin-top: 4px;
}

.detalle-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.detalle-titulo h3 {
  font-size: 20px;
}

.parametros-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}

.parametro-card {
  min-width: 0;
  min-height: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 12px 4px;
  text-align: center;
  background: #fff;
  border: 1px solid #e7edf5;
  border-radius: 13px;
}

.parametro-card>strong {
  font-size: 19px;
  line-height: 1.1;
}

.parametro-card>span {
  color: #72839c;
  font-size: 10px;
  line-height: 1.4;
}

.tabla-scroll {
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border: 1px solid #e5ecf4;
  border-radius: 12px;
}

.tabla-segmentos {
  width: 100%;
  min-width: 460px;
  border-collapse: collapse;
  font-size: 10px;
}

.tabla-segmentos th,
.tabla-segmentos td {
  padding: 10px 7px;
  text-align: center;
  border-bottom: 1px solid #edf1f6;
  white-space: nowrap;
}

.tabla-segmentos th {
  background: #f8fafc;
  color: #73849d;
  font-weight: 700;
}

.tabla-segmentos th:first-child,
.tabla-segmentos td:first-child {
  text-align: left;
}

.tabla-segmentos tbody tr:last-child td {
  border-bottom: 0;
}

.fila-actual {
  background: #e4faf4;
  font-weight: 800;
}

.punto-segmento {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
  background: currentColor;
}

.segmento-nuevo {
  color: #758296;
  background-color: #f0f3f7;
}

.segmento-ocasional {
  color: #e99100;
  background-color: #fff1dc;
}

.segmento-constante {
  color: #1689ef;
  background-color: #e6f2ff;
}

.segmento-frecuente {
  color: #00a981;
  background-color: #e0faf1;
}

.segmento-fiel {
  color: #a45cf3;
  background-color: #f3eaff;
}

.sin-segmento {
  background: #eef1f5;
  color: #65758c;
}

@media (max-width: 380px) {
  .sheet-content {
    padding: 12px;
  }

  .cliente-resumen {
    padding: 11px;
  }

  .avatar-cliente {
    width: 56px;
    height: 56px;
  }

  .segmento-destacado {
    gap: 9px;
    padding: 13px 10px;
  }

  .segmento-icono {
    width: 46px;
    height: 46px;
  }

  .segmento-informacion h3 {
    font-size: 19px;
  }

  .estadisticas-grid {
    gap: 5px;
  }

  .estadistica-card {
    min-height: 112px;
    padding: 8px 3px;
  }

  .estadistica-card>strong {
    font-size: 15px;
  }

  .estadistica-card>span {
    font-size: 9px;
  }

  .parametros-grid {
    gap: 4px;
  }

  .parametro-card {
    padding: 9px 2px;
  }

  .parametro-card>span {
    font-size: 9px;
  }
}
</style>
