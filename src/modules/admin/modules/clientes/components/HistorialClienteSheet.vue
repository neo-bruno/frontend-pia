<template>
<v-bottom-sheet :model-value="modelValue" inset @update:model-value="$emit('update:modelValue', $event)">
  <v-card class="historial-sheet">

    <!-- INDICADOR SUPERIOR -->
    <div class="historial-indicador"></div>

    <!-- CABECERA -->
    <header class="historial-header">
      <div class="historial-titulo">
        <div class="historial-titulo-icono">
          <v-icon size="23">mdi-history</v-icon>
        </div>

        <div class="historial-titulo-texto">
          <h2>Historial del cliente</h2>
          <p>Servicios y atenciones registradas</p>
        </div>

        <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar historial" @click="cerrar" />
      </div>

      <!-- RESUMEN DEL CLIENTE -->
      <div v-if="cliente" class="historial-cliente">
        <div class="historial-avatar">
          {{ iniciales }}
        </div>

        <div class="historial-cliente-info">
          <strong>{{ nombre || "Cliente" }}</strong>

          <span class="historial-telefono">
            <v-icon size="14">mdi-phone-outline</v-icon>
            {{ cliente.telefono || "Sin teléfono" }}
          </span>

          <span class="historial-segmento">
            {{ cliente.segmentacion_nombre || "Sin segmento" }}
          </span>
        </div>
      </div>
    </header>

    <!-- CONTENIDO CON DESPLAZAMIENTO -->
    <div class="historial-contenido">

      <!-- CARGANDO -->
      <div v-if="loading" class="historial-estado">
        <v-progress-circular indeterminate color="teal" size="32" />
        <span>Cargando historial...</span>
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="historial-estado">
        <v-icon color="error" size="34">
          mdi-alert-circle-outline
        </v-icon>

        <p>{{ error }}</p>

        <v-btn color="teal" variant="tonal" size="small" @click="$emit('retry')">
          Reintentar
        </v-btn>
      </div>

      <!-- SIN REGISTROS -->
      <div v-else-if="historial.length === 0" class="historial-estado">
        <div class="historial-vacio-icono">
          <v-icon size="32">mdi-calendar-blank-outline</v-icon>
        </div>

        <strong>Sin atenciones registradas</strong>

        <p>
          Cuando el cliente tenga servicios registrados,
          aparecerán aquí.
        </p>
      </div>

      <template v-else>

        <!-- ESTADÍSTICAS -->
        <section class="historial-estadisticas">
          <article class="historial-metrica">
            <div class="metrica-icono metrica-azul">
              <v-icon size="19">
                mdi-calendar-check-outline
              </v-icon>
            </div>

            <strong>{{ historial.length }}</strong>
            <span>Atenciones</span>
          </article>

          <article class="historial-metrica">
            <div class="metrica-icono metrica-verde">
              <v-icon size="19">
                mdi-check-circle-outline
              </v-icon>
            </div>

            <strong>{{ totalCompletadas }}</strong>
            <span>Completadas</span>
          </article>

          <article class="historial-metrica">
            <div class="metrica-icono metrica-naranja">
              <v-icon size="19">
                mdi-calendar-clock-outline
              </v-icon>
            </div>

            <strong class="metrica-fecha">
              {{ ultimaVisita ? formatearFecha(ultimaVisita) : "—" }}
            </strong>

            <span>Última visita</span>
          </article>
        </section>

        <!-- TÍTULO DE LA LISTA -->
        <div class="historial-lista-cabecera">
          <h3>Servicios recibidos</h3>
          <span>{{ historial.length }} registros</span>
        </div>

        <!-- SERVICIOS -->
        <section class="historial-lista">
          <article v-for="item in historial" :key="item.historial_id" class="historial-servicio">
            <div class="servicio-icono">
              <v-icon size="22">mdi-content-cut</v-icon>
            </div>

            <div class="servicio-contenido">

              <!-- NOMBRE Y ESTADO -->
              <div class="servicio-cabecera">
                <strong>
                  {{ item.servicio_nombre || "Servicio" }}
                </strong>

                <span class="estado-chip" :class="claseEstado(item.reserva_estado)">
                  {{ item.reserva_estado || "REGISTRADO" }}
                </span>
              </div>

              <!-- FECHA Y HORA -->
              <div class="servicio-fecha">
                <span>
                  <v-icon size="14">mdi-calendar-blank-outline</v-icon>
                  {{ formatearFecha(item.fecha) }}
                </span>

                <span v-if="item.hora_inicio">
                  <v-icon size="14">mdi-clock-outline</v-icon>
                  {{ String(item.hora_inicio).slice(0, 5) }}
                </span>
              </div>

              <!-- DURACIÓN Y PRECIO -->
              <div class="servicio-detalles">
                <span v-if="item.duracion != null">
                  <v-icon size="14">mdi-timer-outline</v-icon>
                  {{ item.duracion }} min
                </span>

                <strong v-if="
                      item.precio_aplicable != null ||
                      item.precio != null
                    ">
                  {{ formatearImporte(
                      item.precio_aplicable ?? item.precio
                    ) }}
                </strong>
              </div>

              <!-- INFORMACIÓN DE PAGO -->
              <div v-if="
                    item.monto_pagado != null ||
                    item.saldo != null
                  " class="servicio-pagos">
                <span v-if="item.monto_pagado != null">
                  Pagado: {{ formatearImporte(item.monto_pagado) }}
                </span>

                <span v-if="item.saldo != null">
                  Saldo: {{ formatearImporte(item.saldo) }}
                </span>
              </div>

              <!-- HORARIO FINAL, CUANDO EXISTE -->
              <div v-if="item.hora_fin" class="servicio-hora-fin">
                Finalización: {{ String(item.hora_fin).slice(0, 5) }}
              </div>

            </div>
          </article>
        </section>
      </template>
    </div>
  </v-card>
</v-bottom-sheet>
</template>

<script>
export default {
  name: "HistorialClienteSheet",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    cliente: {
      type: Object,
      default: null,
    },

    nombre: {
      type: String,
      default: "",
    },

    historial: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue", "retry"],

  computed: {
    iniciales() {
      const nombre = (this.nombre || "").trim();

      if (!nombre) return "CL";

      return nombre
        .split(/\s+/)
        .slice(0, 2)
        .map((palabra) => palabra.charAt(0))
        .join("")
        .toUpperCase();
    },

    totalCompletadas() {
      return this.historial.filter(
        (item) =>
        String(item.reserva_estado || "").toUpperCase() ===
        "COMPLETADA"
      ).length;
    },

    ultimaVisita() {
      if (!this.historial.length) return null;

      return this.historial.reduce((ultima, item) => {
        if (!item.fecha) return ultima;
        if (!ultima) return item.fecha;

        return String(item.fecha) > String(ultima) ?
          item.fecha :
          ultima;
      }, null);
    },
  },

  methods: {
    cerrar() {
      this.$emit("update:modelValue", false);
    },

    formatearFecha(fecha) {
      if (!fecha) return "Sin fecha";

      // Evita desplazamientos de día cuando PostgreSQL
      // devuelve una fecha en formato YYYY-MM-DD.
      const texto = String(fecha);
      const coincidencia = texto.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

      let date;

      if (coincidencia) {
        date = new Date(
          Number(coincidencia[1]),
          Number(coincidencia[2]) - 1,
          Number(coincidencia[3])
        );
      } else {
        date = new Date(fecha);
      }

      if (Number.isNaN(date.getTime())) return "Fecha inválida";

      return new Intl.DateTimeFormat("es-BO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date).replace(/\./g, "");
    },

    formatearImporte(valor) {
      const numero = Number(valor);

      if (!Number.isFinite(numero)) return "Bs 0,00";

      return `Bs ${numero.toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },

    claseEstado(estado) {
      const valor = String(estado || "").toUpperCase();

      const clases = {
        COMPLETADA: "estado-completada",
        CONFIRMADA: "estado-confirmada",
        PENDIENTE: "estado-pendiente",
        CANCELADA: "estado-cancelada",
        NO_ASISTIO: "estado-no-asistio",
      };

      return clases[valor] || "estado-registrado";
    },
  },
};
</script>

<style lang="scss" scoped>
.historial-sheet {
  display: flex;
  flex-direction: column;
  max-height: min(88dvh, 850px);
  overflow: hidden;
  border-radius: 24px 24px 0 0 !important;
  background: #f8fafc;
}

.historial-indicador {
  flex: 0 0 auto;
  width: 38px;
  height: 4px;
  margin: 9px auto 0;
  border-radius: 10px;
  background: #d8e1e9;
}

.historial-header {
  flex: 0 0 auto;
  padding: 16px 18px 14px;
  background: #fff;
}

.historial-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.historial-titulo-icono {
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #e0f5f4;
  color: #078e93;
}

.historial-titulo-texto {
  flex: 1;
  min-width: 0;

  h2 {
    margin: 0;
    color: #17375e;
    font-size: 17px;
    font-weight: 800;
    line-height: 1.3;
  }

  p {
    margin: 4px 0 0;
    color: #71849b;
    font-size: 11px;
  }
}

.historial-cliente {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e8eff5;
  border-radius: 14px;
  background: #f8fbfd;
}

.historial-avatar {
  display: flex;
  flex: 0 0 46px;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #dff4f2;
  color: #078e93;
  font-size: 14px;
  font-weight: 800;
}

.historial-cliente-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;

  strong {
    color: #17375e;
    font-size: 13px;
    font-weight: 800;
    overflow-wrap: anywhere;
  }
}

.historial-telefono {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #71849b;
  font-size: 11px;
}

.historial-segmento {
  padding: 4px 8px;
  border-radius: 20px;
  background: #e8eef4;
  color: #526b84;
  font-size: 10px;
  font-weight: 700;
}

.historial-contenido {
  flex: 1 1 auto;
  min-height: 0;
  padding: 14px 18px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.historial-estadisticas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-bottom: 22px;
}

.historial-metrica {
  display: flex;
  min-width: 0;
  min-height: 96px;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 10px 8px;
  border: 1px solid #e6edf4;
  border-radius: 15px;
  background: #fff;

  strong {
    color: #17375e;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.2;
  }

  >span:last-child {
    color: #71849b;
    font-size: 10px;
  }

  .metrica-fecha {
    font-size: 10px;
    overflow-wrap: anywhere;
  }
}

.metrica-icono {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.metrica-azul {
  background: #e7f1ff;
  color: #3978d4;
}

.metrica-verde {
  background: #e1f8ed;
  color: #119768;
}

.metrica-naranja {
  background: #fff0e0;
  color: #dc751b;
}

.historial-lista-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    color: #17375e;
    font-size: 14px;
    font-weight: 800;
  }

  span {
    color: #8293a7;
    font-size: 10px;
  }
}

.historial-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.historial-servicio {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 12px 10px;
  border: 1px solid #e7edf4;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(23, 55, 94, 0.025);
}

.servicio-icono {
  display: flex;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #e0f5f4;
  color: #078e93;
}

.servicio-contenido {
  flex: 1;
  min-width: 0;
}

.servicio-cabecera {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 7px;

  >strong {
    min-width: 0;
    color: #17375e;
    font-size: 12px;
    font-weight: 800;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
}

.estado-chip {
  flex: 0 0 auto;
  max-width: 105px;
  padding: 4px 6px;
  border-radius: 7px;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
}

.estado-completada {
  background: #dff8eb;
  color: #07885b;
}

.estado-confirmada {
  background: #e2efff;
  color: #2768b2;
}

.estado-pendiente {
  background: #fff0d8;
  color: #a96109;
}

.estado-cancelada,
.estado-no-asistio {
  background: #ffe7e9;
  color: #c13c4e;
}

.estado-registrado {
  background: #edf1f5;
  color: #5d7086;
}

.servicio-fecha {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  color: #71849b;
  font-size: 10px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.servicio-detalles {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
  color: #71849b;
  font-size: 10px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  strong {
    color: #17375e;
    font-size: 12px;
    font-weight: 800;
  }
}

.servicio-pagos {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 12px;
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid #edf1f5;
  color: #71849b;
  font-size: 10px;
}

.servicio-hora-fin {
  margin-top: 5px;
  color: #8293a7;
  font-size: 10px;
}

.historial-estado {
  display: flex;
  min-height: 190px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;

  >span,
  >strong {
    color: #17375e;
    font-size: 13px;
    font-weight: 700;
  }

  p {
    max-width: 260px;
    margin: 0;
    color: #71849b;
    font-size: 12px;
    line-height: 1.5;
  }
}

.historial-vacio-icono {
  display: flex;
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: #eaf2f7;
  color: #71849b;
}

@media (max-width: 360px) {
  .historial-header {
    padding-right: 14px;
    padding-left: 14px;
  }

  .historial-contenido {
    padding-right: 14px;
    padding-left: 14px;
  }

  .historial-estadisticas {
    gap: 6px;
  }

  .historial-metrica {
    padding: 9px 7px;
  }

  .historial-servicio {
    gap: 8px;
    padding: 10px 8px;
  }
}
</style>
