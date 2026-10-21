<template>
<v-bottom-sheet :model-value="modelValue" inset scrollable @update:model-value="cerrar">
  <v-card class="descuentos-sheet">
    <!-- ENCABEZADO DEL CLIENTE -->
    <div class="sheet-handle"></div>

    <header class="cliente-header">
      <div class="cliente-avatar">
        {{ inicialesCliente }}
      </div>

      <div class="cliente-info">
        <h3>{{ nombreCliente }}</h3>
        <span>{{ cliente?.telefono || "Sin teléfono" }}</span>
      </div>

      <v-btn icon="mdi-close" variant="text" size="small" aria-label="Cerrar" @click="cerrar(false)" />
    </header>

    <v-divider />

    <!-- VISTA 1: LISTADO -->
    <template v-if="vista === 'lista'">
      <div class="contenido-sheet">
        <div class="titulo-seccion">
          <div>
            <h2>Asignar descuentos al cliente</h2>
            <p>
              Selecciona los servicios con descuento que quieres asignar
              a este cliente.
            </p>
          </div>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-3">
          {{ error }}
        </v-alert>

        <v-text-field v-model="busqueda" placeholder="Buscar servicio o descuento..." prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" hide-details clearable class="campo-busqueda" />

        <div class="filtros">
          <button v-for="filtro in filtros" :key="filtro.valor" type="button" class="filtro-chip" :class="{ activo: categoriaActiva === filtro.valor }" @click="categoriaActiva = filtro.valor">
            {{ filtro.texto }}
            <span>{{ contarCategoria(filtro.valor) }}</span>
          </button>
        </div>

        <div class="resumen-listado">
          <span>Descuentos disponibles</span>
          <strong>{{ descuentosFiltrados.length }}</strong>
        </div>

        <div v-if="cargando" class="estado-vacio">
          <v-progress-circular indeterminate color="teal" size="34" />
          <p>Cargando descuentos disponibles...</p>
        </div>

        <div v-else-if="!descuentosFiltrados.length" class="estado-vacio">
          <v-icon size="42" color="grey">mdi-tag-off-outline</v-icon>
          <p>No hay descuentos disponibles para asignar.</p>
        </div>

        <div v-else class="lista-descuentos">
          <article v-for="item in descuentosFiltrados" :key="item.descuento_servicio_id" class="descuento-item" :class="{
                seleccionado: estaSeleccionado(item),
                'ya-asignado-item': yaAsignado(item),
              }">
            <button type="button" class="tarjeta-principal" @click="abrirDetalle(item)">
              <div class="imagen-servicio">
                <v-img v-if="item.imagen_url" :src="urlImagen(item.imagen_url)" cover class="imagen-real" />
                <v-icon v-else size="32" color="grey-lighten-1">
                  mdi-image-outline
                </v-icon>
              </div>

              <div class="tarjeta-info">
                <div class="estado-servicio-fila">
                  <span v-if="yaAsignado(item)" class="estado-servicio-badge badge-asignado">
                    <v-icon size="12">mdi-check-circle</v-icon>
                    ASIGNADO
                  </span>
                  <span v-else class="estado-servicio-badge badge-disponible">
                    DISPONIBLE
                  </span>
                </div>

                <div class="titulo-servicio-fila">
                  <h3>{{ item.servicio_nombre }}</h3>
                </div>

                <p class="descripcion-corta">
                  {{ item.servicio_descripcion || "Sin descripción" }}
                </p>

                <div class="etiquetas">
                  <span class="etiqueta-descuento">
                    <v-icon size="14">mdi-tag-outline</v-icon>
                    {{ nombreDescuento(item) }}
                  </span>
                </div>

                <div class="duracion">
                  <v-icon size="15">mdi-clock-outline</v-icon>
                  {{ item.duracion }} min
                </div>

                <div class="precios">
                  <span class="precio-original">
                    {{ moneda(item.precio) }}
                  </span>
                  <strong>{{ moneda(precioFinal(item)) }}</strong>
                </div>
              </div>

              <v-icon class="flecha-detalle" size="20">
                mdi-chevron-right
              </v-icon>
            </button>

            <div v-if="yaAsignado(item)" class="fila-estado-asignado">
              <div class="icono-estado-asignado">
                <v-icon size="18">mdi-check-circle</v-icon>
              </div>

              <div class="texto-estado-asignado">
                <strong>Este descuento ya fue asignado</strong>
                <span>No puedes volver a seleccionarlo.</span>
              </div>

              <v-btn v-if="puedeRetirar(item)" color="error" variant="tonal" size="small" rounded="lg" :loading="retirandoId === Number(item.asignacion_id)" :disabled="Boolean(retirandoId)" prepend-icon="mdi-link-off" @click.stop="confirmarRetiro(item)">
                Retirar
              </v-btn>

              <v-icon v-else class="candado-asignado" size="18">
                mdi-lock-outline
              </v-icon>
            </div>

            <div v-else class="seleccion-fila">
              <v-checkbox :model-value="estaSeleccionado(item)" :color="estaSeleccionado(item)?'teal-darken-1' : undefined" hide-details density="compact" @update:model-value="alternarSeleccion(item)" />
              <span v-if="estaSeleccionado(item)" class="seleccion-texto seleccionado-texto">
                Seleccionado
              </span>
              <span v-else class="seleccion-texto">
                Seleccionar descuento
              </span>
            </div>
          </article>
        </div>
      </div>

      <!-- BARRA INFERIOR -->
      <div class="barra-inferior">
        <div class="resumen-seleccion">
          <div>
            <strong>{{ seleccionados.length }} seleccionados</strong>
            <span>
              Ahorro potencial: {{ moneda(ahorroTotal) }}
            </span>
          </div>
        </div>

        <v-btn color="teal-darken-1" size="large" block rounded="lg" prepend-icon="mdi-check-circle-outline" :disabled="!seleccionados.length" @click="abrirConfirmacion">
          Revisar asignación ({{ seleccionados.length }})
        </v-btn>
      </div>
    </template>

    <!-- VISTA 2: DETALLE DEL SERVICIO Y DESCUENTO -->
    <template v-else-if="vista === 'detalle' && detalleActual">
      <div class="contenido-sheet detalle-contenido">
        <div class="navegacion-detalle">
          <v-btn icon="mdi-arrow-left" variant="text" @click="vista = 'lista'" />
          <h2>Detalle del descuento</h2>
          <v-btn icon="mdi-close" variant="text" @click="vista = 'lista'" />
        </div>

        <div class="detalle-imagen">
          <v-img v-if="detalleActual.imagen_url" :src="urlImagen(detalleActual.imagen_url)" cover />
          <v-icon v-else size="56" color="grey-lighten-1">
            mdi-image-outline
          </v-icon>

          <div class="duracion-imagen">
            <v-icon size="15">mdi-clock-outline</v-icon>
            {{ detalleActual.duracion }} min
          </div>
        </div>

        <h2 class="nombre-detalle">
          {{ detalleActual.servicio_nombre }}
        </h2>

        <div class="detalle-subtitulo">
          Servicio con descuento para cliente
        </div>

        <p class="descripcion-completa">
          {{ detalleActual.servicio_descripcion || "Este servicio no tiene descripción." }}
        </p>

        <section class="panel-informacion">
          <h3>Información del servicio</h3>

          <div class="dato-fila">
            <span>Duración</span>
            <strong>{{ detalleActual.duracion }} minutos</strong>
          </div>

          <div class="dato-fila">
            <span>Precio original</span>
            <strong>{{ moneda(detalleActual.precio) }}</strong>
          </div>
        </section>

        <section class="panel-informacion panel-descuento">
          <div class="descuento-titulo">
            <div class="icono-descuento">
              <v-icon>mdi-tag-minus</v-icon>
            </div>

            <div>
              <h3>{{ nombreDescuento(detalleActual) }}</h3>
              <span class="tipo-cliente">Tipo Descuento: SOLO - CLIENTE</span>
            </div>
          </div>

          <p class="descripcion-descuento">
            {{ detalleActual.descuento_descripcion || "Descuento asignado a clientes seleccionados." }}
          </p>

          <div class="dato-fila">
            <span>Vigencia desde</span>
            <strong>{{ fecha(detalleActual.fecha_inicio) }}</strong>
          </div>

          <div class="dato-fila">
            <span>Válido hasta</span>
            <strong>{{ fecha(detalleActual.fecha_fin) }}</strong>
          </div>

          <div class="dato-fila">
            <span>Estado</span>
            <span class="estado-vigente">Vigente</span>
          </div>
        </section>

        <section class="panel-precios">
          <h3>Resumen de precios</h3>

          <div class="dato-fila">
            <span>Precio del servicio</span>
            <strong>{{ moneda(detalleActual.precio) }}</strong>
          </div>

          <div class="dato-fila">
            <span>Descuento</span>
            <strong class="ahorro">
              - {{ moneda(montoDescuento(detalleActual)) }}
            </strong>
          </div>

          <div class="total-fila">
            <span>Total a pagar</span>
            <strong>{{ moneda(precioFinal(detalleActual)) }}</strong>
          </div>
        </section>

        <v-alert v-if="yaAsignado(detalleActual)" type="info" variant="tonal" density="compact">
          Este descuento ya está asignado a este cliente.
        </v-alert>

        <v-btn block size="large" rounded="lg" color="teal-darken-1" :disabled="yaAsignado(detalleActual)" :prepend-icon="
              estaSeleccionado(detalleActual)
               ?'mdi-check-circle'
                : 'mdi-plus-circle-outline'
            " @click="alternarSeleccion(detalleActual)">
          {{
              estaSeleccionado(detalleActual)
               ?"Quitar de la selección"
                : "Seleccionar para asignar"
            }}
        </v-btn>
      </div>
    </template>

    <!-- VISTA 3: RESUMEN DE SELECCIÓN -->
    <template v-else-if="vista === 'confirmar'">
      <div class="contenido-sheet">
        <div class="navegacion-detalle">
          <v-btn icon="mdi-arrow-left" variant="text" @click="vista = 'lista'" />
          <h2>Confirmar asignación</h2>
          <v-btn icon="mdi-close" variant="text" @click="vista = 'lista'" />
        </div>

        <v-alert type="info" variant="tonal" density="compact" class="mb-4">
          Revisa los descuentos seleccionados. Se asignarán a este cliente
          y estarán disponibles para su uso.
        </v-alert>

        <h3 class="titulo-resumen">
          Descuentos a asignar ({{ seleccionados.length }})
        </h3>

        <article v-for="item in seleccionados" :key="item.descuento_servicio_id" class="resumen-item">
          <div class="imagen-resumen">
            <v-img v-if="item.imagen_url" :src="urlImagen(item.imagen_url)" cover />
            <v-icon v-else color="grey">mdi-image-outline</v-icon>
          </div>

          <div class="resumen-item-info">
            <strong>{{ item.servicio_nombre }}</strong>
            <span>{{ nombreDescuento(item) }}</span>
            <div class="resumen-precio">
              <span>Original: {{ moneda(item.precio) }}</span>
              <strong>Total: {{ moneda(precioFinal(item)) }}</strong>
            </div>
            <small>Válido hasta {{ fecha(item.fecha_fin) }}</small>
          </div>

          <v-btn icon="mdi-close" size="x-small" variant="text" aria-label="Quitar descuento" @click="alternarSeleccion(item)" />
        </article>

        <section class="panel-precios resumen-final">
          <h3>Resumen de la asignación</h3>

          <div class="dato-fila">
            <span>Servicios con descuento</span>
            <strong>{{ seleccionados.length }}</strong>
          </div>

          <div class="dato-fila">
            <span>Ahorro total potencial</span>
            <strong class="ahorro">{{ moneda(ahorroTotal) }}</strong>
          </div>

          <div class="dato-fila">
            <span>Descuentos vigentes</span>
            <strong>{{ seleccionados.length }}</strong>
          </div>
        </section>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-3">
          {{ error }}
        </v-alert>
      </div>

      <div class="barra-inferior">
        <v-btn block color="teal-darken-1" size="large" rounded="lg" prepend-icon="mdi-check" :loading="guardando" :disabled="!seleccionados.length || guardando" @click="confirmarAsignacion">
          Confirmar asignación
        </v-btn>

        <v-btn block variant="outlined" rounded="lg" class="mt-2" :disabled="guardando" @click="vista = 'lista'">
          Cancelar
        </v-btn>
      </div>
    </template>
  </v-card>
</v-bottom-sheet>
</template>

<script>
import {
  getDescuentosDisponiblesParaCliente,
  asignarDescuentosCliente,
  retirarAsignacionDescuentoCliente,
} from "../services/descuentoServicioCliente.api";

export default {
  name: "AsignarDescuentoClientesSheet",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    cliente: {
      type: Object,
      default: () => ({}),
    },

    // Opcional: permite al componente recibir datos ya cargados.
    descuentosDisponibles: {
      type: Array,
      default: null,
    },
  },

  emits: ["update:modelValue", "asignados"],

  data() {
    return {
      vista: "lista",
      cargando: false,
      guardando: false,
      retirandoId: null,
      error: "",

      busqueda: "",
      categoriaActiva: "TODOS",
      descuentos: [],
      seleccionados: [],
      detalleActual: null,

      filtros: [{
          texto: "Todos",
          valor: "TODOS"
        },
        {
          texto: "Porcentaje",
          valor: "PORCENTAJE"
        },
        {
          texto: "Monto fijo",
          valor: "MONTO"
        },
      ],

      guardando: false,
      error: "",
    };
  },

  computed: {
    nombreCliente() {
      return (
        this.cliente?.nombre ||
        this.cliente?.alias ||
        "Cliente"
      );
    },

    inicialesCliente() {
      return this.nombreCliente
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join("");
    },

    descuentosFiltrados() {
      const texto = (this.busqueda || "").trim().toLowerCase();

      return this.descuentos.filter((item) => {
        const coincideBusqueda = !texto || [
            item.servicio_nombre,
            item.servicio_descripcion,
            item.descuento_titulo,
            item.descuento_codigo,
          ]
          .filter(Boolean)
          .some((valor) =>
            String(valor).toLowerCase().includes(texto),
          );

        const coincideCategoria =
          this.categoriaActiva === "TODOS" ||
          String(item.tipo_valor || "").toUpperCase() ===
          this.categoriaActiva;

        return coincideBusqueda && coincideCategoria;
      });
    },

    ahorroTotal() {
      return this.seleccionados.reduce(
        (total, item) => total + this.montoDescuento(item),
        0,
      );
    },
  },

  watch: {
    modelValue(abierto) {
      if (abierto) {
        this.inicializar();
      } else {
        this.limpiarEstado();
      }
    },

    descuentosDisponibles: {
      deep: true,
      handler(datos) {
        if (Array.isArray(datos)) {
          this.descuentos = this.normalizarDescuentos(datos);
        }
      },
    },
  },

  methods: {
    async inicializar() {
      this.error = "";
      this.vista = "lista";
      this.busqueda = "";
      this.categoriaActiva = "TODOS";
      this.seleccionados = [];
      this.detalleActual = null;

      if (Array.isArray(this.descuentosDisponibles)) {
        this.descuentos = this.normalizarDescuentos(
          this.descuentosDisponibles,
        );
        return;
      }

      await this.cargarDescuentos();
    },

    limpiarEstado() {
      this.vista = "lista";
      this.error = "";
      this.detalleActual = null;
      this.seleccionados = [];
      this.busqueda = "";
    },

    cerrar(valor = false) {
      if (this.guardando) return;
      this.$emit("update:modelValue", valor);
    },

    async cargarDescuentos() {
      const clienteId = this.cliente?.cliente_id?? this.cliente?.id;

      if (!clienteId) {
        this.error = "No se encontró el identificador del cliente.";
        this.descuentos = [];
        return;
      }

      this.cargando = true;
      this.error = "";

      try {
        const respuesta = await getDescuentosDisponiblesParaCliente(clienteId);
        console.log('CARGAR DESCUENTOS: ', respuesta)
        const datos = respuesta.data?.data?? [];

        this.descuentos = this.normalizarDescuentos(
          Array.isArray(datos)?datos : [],
        );
      } catch (error) {
        this.descuentos = [];
        this.error =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No se pudieron cargar los descuentos disponibles.";
      } finally {
        this.cargando = false;
      }
    },

    normalizarDescuentos(datos) {
      return datos
        .map((item) => {
          const porcentaje = Number(item.porcentaje || 0);
          const monto = Number(item.monto || 0);

          return {
            ...item,
            descuento_servicio_id: Number(item.descuento_servicio_id),
            precio: Number(item.precio || 0),
            duracion: Number(item.duracion || 0),
            porcentaje,
            monto,
            tipo_valor: porcentaje > 0?"PORCENTAJE" : "MONTO",
            clientes_asignados: Boolean(item.asignacion_activa),
          };
        })
        .filter((item) => item.descuento_servicio_id > 0);
    },

    contarCategoria(categoria) {
      if (categoria === "TODOS") return this.descuentos.length;

      return this.descuentos.filter(
        (item) =>
        String(item.tipo_valor || "").toUpperCase() === categoria,
      ).length;
    },

    estaSeleccionado(item) {
      return this.seleccionados.some(
        (seleccionado) =>
        seleccionado.descuento_servicio_id ===
        item.descuento_servicio_id,
      );
    },

    yaAsignado(item) {
      return item.clientes_asignados === true;
    },

    puedeRetirar(item) {
      return (
        this.yaAsignado(item) &&
        Number(item.asignacion_id) > 0 &&
        String(item.estado_asignacion || "").toUpperCase() === "ACTIVO" &&
        item.fecha_aplicada == null &&
        item.hora_aplicada == null &&
        item.codigo_aplicado == null &&
        item.monto_aplicado == null &&
        item.estado_aplicado == null
      );
    },
    
    async confirmarRetiro(item) {
      if (!this.puedeRetirar(item) || this.retirandoId) return;

      const confirmado = await this.$piaAlert.confirm({
        title: "Retirar asignación",
        message: `¿Deseas retirar la asignación del descuento "${this.nombreDescuento(item)}" para este cliente?`,
        confirmText: "Sí, retirar",
        cancelText: "Cancelar",
      });

      // Si cancela, no hacemos nada.
      if (confirmado !== true) return;

      this.retirandoId = Number(item.asignacion_id);
      this.error = "";

      try {
        const respuesta = await retirarAsignacionDescuentoCliente(
          item.asignacion_id
        );

        console.log("RESPUESTA RETIRO:", respuesta.data);

        this.$piaAlert.success(
          "La asignación se retiró correctamente.",
          {
            title: "Asignación retirada",
          }
        );

        await this.cargarDescuentos();
      } catch (error) {
        console.error("ERROR AL RETIRAR:", error.response || error);

        this.$piaAlert.error(
          error.response?.data?.mensaje ||
            error.response?.data?.message ||
            "No se pudo retirar la asignación.",
          {
            title: "Error al retirar",
          }
        );
      } finally {
        this.retirandoId = null;
      }
    },



    alternarSeleccion(item) {
      if (this.yaAsignado(item)) return;

      if (this.estaSeleccionado(item)) {
        this.seleccionados = this.seleccionados.filter(
          (seleccionado) =>
          seleccionado.descuento_servicio_id !==
          item.descuento_servicio_id,
        );
      } else {
        this.seleccionados.push(item);
      }
    },

    abrirDetalle(item) {
      this.detalleActual = item;
      this.vista = "detalle";
    },

    abrirConfirmacion() {
      if (!this.seleccionados.length) return;
      this.error = "";
      this.vista = "confirmar";
    },

    nombreDescuento(item) {
      return (
        item.descuento_titulo ||
        item.titulo ||
        item.descuento_codigo ||
        item.codigo ||
        "Descuento disponible"
      );
    },

    montoDescuento(item) {
      const precio = Number(item.precio || 0);
      const porcentaje = Number(item.porcentaje || 0);
      const monto = Number(item.monto || 0);

      if (porcentaje > 0) {
        return Math.min(precio, precio * porcentaje / 100);
      }

      return Math.min(precio, monto);
    },

    precioFinal(item) {
      return Math.max(
        0,
        Number(item.precio || 0) - this.montoDescuento(item),
      );
    },

    moneda(valor) {
      return `Bs. ${Number(valor || 0).toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },

    fecha(valor) {
      if (!valor) return "Sin fecha";

      // Evita desfases de día al interpretar una fecha SQL YYYY-MM-DD.
      const texto = String(valor).slice(0, 10);
      const partes = texto.split("-");

      if (partes.length !== 3) return texto;

      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },

    urlImagen(url) {
      if (!url) return "";

      if (/^https?:\/\//i.test(url)) return url;

      const base =
        import.meta.env.VITE_SERVER_URL || "";

      return `${base.replace(/\/$/, "")}/${String(url).replace(/^\//, "")}`;
    },

    async confirmarAsignacion() {
      const clienteId = this.cliente?.cliente_id?? this.cliente?.id;

      if (!clienteId) {
        this.error = "No se encontró el identificador del cliente.";
        return;
      }

      if (!this.seleccionados.length || this.guardando) return;

      this.guardando = true;
      this.error = "";

      try {
        const descuentosServicioIds = this.seleccionados.map(
          (item) => item.descuento_servicio_id,
        );

        const respuesta = await asignarDescuentosCliente(
          clienteId,
          descuentosServicioIds,
        );

        const cantidad = respuesta.data?.data?.total_asignados?? this.seleccionados.length;

        this.$emit("asignados", {
          clienteId,
          cantidad
        });

        this.$piaAlert.success(
          "Los descuentos se asignaron correctamente.", {
            title: "Asignación completada"
          },
        );

        // Cerrar directamente: cerrar() bloquea el cierre mientras guardando=true.
        this.$emit("update:modelValue", false);
      } catch (error) {
        this.error =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          "No se pudieron asignar los descuentos.";
      } finally {
        this.guardando = false;
      }
    },

  },
};
</script>

<style lang="scss" scoped>
.descuentos-sheet {
  width: 100%;
  max-width: 650px;
  max-height: 92dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  background: #fff;
}

.sheet-handle {
  width: 42px;
  height: 5px;
  margin: 10px auto 8px;
  border-radius: 10px;
  background: #d8dee7;
  flex-shrink: 0;
}

.cliente-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px 16px;
  flex-shrink: 0;
}

.cliente-avatar {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e0f5f2;
  color: #008f89;
  font-weight: 800;
  flex-shrink: 0;
}

.cliente-info {
  min-width: 0;
  flex: 1;
}

.cliente-info h3 {
  margin: 0;
  color: #142d50;
  font-size: 15px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.cliente-info span {
  display: block;
  margin-top: 3px;
  color: #7285a3;
  font-size: 12px;
}

.contenido-sheet {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 18px;
  overscroll-behavior: contain;
}

.titulo-seccion h2,
.navegacion-detalle h2 {
  margin: 0;
  color: #142d50;
  font-size: 19px;
  font-weight: 800;
}

.titulo-seccion p {
  margin: 7px 0 18px;
  color: #687e9f;
  font-size: 13px;
  line-height: 1.55;
}

.campo-busqueda {
  margin-bottom: 14px;
}

.filtros {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0 12px;
}

.filtro-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border: 1px solid #e1e9f2;
  border-radius: 20px;
  background: #f7f9fc;
  color: #536d91;
  white-space: nowrap;
  font-size: 12px;
}

.filtro-chip span {
  font-weight: 800;
}

.filtro-chip.activo {
  border-color: #008f89;
  background: #008f89;
  color: white;
}

.resumen-listado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0 12px;
  color: #536d91;
  font-size: 13px;
}

.resumen-listado strong {
  color: #008f89;
}

.lista-descuentos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.descuento-item {
  overflow: hidden;
  border: 1px solid #e4ebf4;
  border-radius: 15px;
  background: #fff;
  transition: border-color 0.15s, background 0.15s;
}

.descuento-item.seleccionado {
  border-color: #009b93;
  background: #fbfffe;
}

.descuento-item.ya-asignado-item {
  border: 1.5px solid #9bd8c9;
  background: #f0faf6;
  box-shadow: inset 4px 0 0 #169b79;
}

.descuento-item.ya-asignado-item .tarjeta-principal {
  background: #f0faf6;
}

.descuento-item.ya-asignado-item .tarjeta-info h3 {
  color: #456b65;
}

.descuento-item.ya-asignado-item .imagen-servicio {
  border: 1px solid #c8e9df;
}

.titulo-servicio-fila {
  display: block;
  width: 100%;
  margin-bottom: 5px;
}

.titulo-servicio-fila h3 {
  width: 100%;
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  line-height: 1.4;
}

.estado-servicio-fila {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin: 0 0 6px;
}

.estado-servicio-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex-shrink: 0;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 9px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: 0.2px;
}

.badge-asignado {
  color: #08785d;
  background: #d4f3e6;
  border: 1px solid #a8e2cd;
}

.badge-disponible {
  color: #2466a5;
  background: #e6f1ff;
  border: 1px solid #c9e0fb;
}

.tarjeta-principal {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 11px;
  padding: 12px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.imagen-servicio {
  display: grid;
  width: 78px;
  height: 88px;
  place-items: center;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 11px;
  background: #edf5f5;
}

.imagen-real,
.imagen-resumen .v-img {
  width: 100%;
  height: 100%;
}

.tarjeta-info {
  flex: 1;
  min-width: 0;
}

.tarjeta-info h3 {
  margin: 0 0 4px;
  color: #142d50;
  font-size: 14px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.descripcion-corta {
  display: -webkit-box;
  overflow: hidden;
  margin: 0 0 7px;
  color: #7588a6;
  font-size: 11px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.etiquetas {
  margin-bottom: 7px;
}

.etiqueta-descuento {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 5px 7px;
  border-radius: 7px;
  background: #fff0f5;
  color: #d82d76;
  font-size: 10px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.duracion {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6b7f9e;
  font-size: 11px;
}

.precios {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: baseline;
  gap: 9px;
  margin-top: 7px;
}

.precio-original {
  color: #8b98ab;
  font-size: 11px;
  text-decoration: line-through;
}

.precios strong {
  color: #008f89;
  font-size: 15px;
  font-weight: 900;
}

.flecha-detalle {
  align-self: center;
  flex-shrink: 0;
  color: #7890ad;
}

.seleccion-fila {
  display: flex;
  min-height: 42px;
  align-items: center;
  gap: 5px;
  padding: 2px 12px 5px;
  border-top: 1px solid #f0f3f7;
  background: #fbfcfe;
}

.seleccion-texto {
  color: #7a8ca6;
  font-size: 11px;
}

.seleccionado-texto {
  color: #008f89;
  font-weight: 800;
}

.fila-estado-asignado {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 62px;
  padding: 9px 12px;
  border-top: 1px solid #cdece1;
  background: #e3f7ef;
}

.icono-estado-asignado {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: #c6efdf;
  color: #08785d;
}

.texto-estado-asignado {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.texto-estado-asignado strong {
  color: #08785d;
  font-size: 11px;
  font-weight: 900;
  line-height: 1.35;
}

.texto-estado-asignado span {
  color: #477c6e;
  font-size: 10px;
  line-height: 1.35;
}

.candado-asignado {
  flex-shrink: 0;
  color: #398b75;
}

.barra-inferior {
  flex-shrink: 0;
  padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #e8eef5;
  background: white;
  box-shadow: 0 -5px 18px #142d5008;
}

.resumen-seleccion {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.resumen-seleccion div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.resumen-seleccion strong {
  color: #142d50;
  font-size: 13px;
}

.resumen-seleccion span {
  color: #7285a3;
  font-size: 11px;
}

.estado-vacio {
  display: flex;
  min-height: 160px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #7588a6;
  text-align: center;
  font-size: 13px;
}

.navegacion-detalle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: -8px -8px 16px;
}

.navegacion-detalle h2 {
  flex: 1;
  font-size: 17px;
}

.detalle-imagen {
  position: relative;
  display: grid;
  height: 210px;
  place-items: center;
  overflow: hidden;
  border-radius: 15px;
  background: #edf5f5;
}

.detalle-imagen .v-img {
  width: 100%;
  height: 100%;
}

.duracion-imagen {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  border-radius: 20px;
  background: #142d50d9;
  color: white;
  font-size: 12px;
}

.nombre-detalle {
  margin: 15px 0 4px;
  color: #142d50;
  font-size: 22px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.detalle-subtitulo {
  color: #68809f;
  font-size: 12px;
}

.descripcion-completa {
  margin: 12px 0 18px;
  color: #566f91;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.panel-informacion,
.panel-precios {
  margin-bottom: 13px;
  padding: 15px;
  border: 1px solid #e5edf5;
  border-radius: 14px;
  background: #f7fbff;
}

.panel-informacion h3,
.panel-precios h3 {
  margin: 0 0 12px;
  color: #142d50;
  font-size: 14px;
  font-weight: 800;
}

.dato-fila {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e8eef5;
  font-size: 12px;
}

.dato-fila:last-child {
  border-bottom: 0;
}

.dato-fila>span {
  color: #687f9f;
}

.dato-fila>strong {
  color: #29476e;
  text-align: right;
  overflow-wrap: anywhere;
}

.panel-descuento {
  border-color: #f7dce9;
  background: #fff7fa;
}

.descuento-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icono-descuento {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: #ffe5ef;
  color: #d82d76;
}

.descuento-titulo h3 {
  margin: 0 0 5px;
  overflow-wrap: anywhere;
}

.tipo-cliente {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 15px;
  background: #e1f6f1;
  color: #008f89;
  font-size: 10px;
  font-weight: 800;
}

.descripcion-descuento {
  margin: 12px 0;
  color: #657b99;
  font-size: 12px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.estado-vigente {
  padding: 4px 8px;
  border-radius: 12px;
  background: #dcf7eb;
  color: #078457;
  font-size: 11px;
  font-weight: 800;
}

.panel-precios {
  border-color: #d9f0ec;
  background: #f1fbf9;
}

.ahorro {
  color: #008f89 !important;
}

.total-fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #d8ebe8;
  color: #142d50;
  font-size: 14px;
  font-weight: 800;
}

.total-fila strong {
  color: #008f89;
  font-size: 20px;
}

.titulo-resumen {
  margin: 18px 0 12px;
  color: #142d50;
  font-size: 16px;
  font-weight: 800;
}

.resumen-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  padding: 12px;
  border: 1px solid #e4ebf4;
  border-radius: 13px;
}

.imagen-resumen {
  display: grid;
  width: 66px;
  height: 72px;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  border-radius: 10px;
  background: #edf5f5;
}

.resumen-item-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.resumen-item-info>strong {
  color: #142d50;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.resumen-item-info>span {
  color: #7588a6;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.resumen-precio {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 5px;
  font-size: 11px;
}

.resumen-precio span {
  color: #7285a3;
}

.resumen-precio strong {
  color: #008f89;
}

.resumen-item-info small {
  color: #7285a3;
  font-size: 10px;
}

.resumen-final {
  margin-top: 18px;
}

@media (min-width: 700px) {
  .descuentos-sheet {
    max-height: 88dvh;
    border-radius: 24px;
  }

  .contenido-sheet {
    padding: 24px;
  }

  .lista-descuentos {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .detalle-imagen {
    height: 260px;
  }
}

@media (max-width: 360px) {
  .contenido-sheet {
    padding: 15px 12px;
  }

  .imagen-servicio {
    width: 66px;
    height: 78px;
  }

  .tarjeta-principal {
    gap: 8px;
    padding: 10px;
  }

  .precios strong {
    font-size: 13px;
  }

  .titulo-seccion h2 {
    font-size: 17px;
  }
}
</style>
