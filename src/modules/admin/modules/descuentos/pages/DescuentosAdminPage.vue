<template>
<div class="descuentos-page">
  <!-- ENCABEZADO -->
  <header class="page-header">
    <div>
      <h1>Descuentos</h1>
      <p>Crea y gestiona descuentos para tus servicios.</p>
    </div>

    <div class="header-count">
      <v-icon icon="mdi-tag-multiple-outline" />
      <span>{{ descuentos.length }}</span>
    </div>
  </header>

  <!-- NUEVO DESCUENTO -->
  <v-btn class="btn-nuevo" block rounded="lg" prepend-icon="mdi-plus" @click="abrirCrear">
    Nuevo descuento
  </v-btn>

  <!-- BUSCADOR -->
  <v-text-field v-model="busqueda" class="search-input" placeholder="Buscar descuentos..." prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" hide-details clearable />

  <!-- FILTROS -->
  <div class="filtros">
    <button v-for="filtro in filtros" :key="filtro.valor" type="button" class="filtro-chip" :class="{ seleccionado: filtroActivo === filtro.valor }" @click="filtroActivo = filtro.valor">
      {{ filtro.texto }}
      <span>{{ contarDescuentos(filtro.valor) }}</span>
    </button>
  </div>

  <!-- CARGANDO -->
  <div v-if="cargando" class="estado-vacio">
    <v-progress-circular indeterminate color="teal" />
    <p>Cargando descuentos...</p>
  </div>

  <!-- ERROR -->
  <v-alert v-else-if="error" type="error" variant="tonal" class="mt-3">
    {{ error }}

    <template #append>
      <v-btn variant="text" @click="cargarDescuentos">
        Reintentar
      </v-btn>
    </template>
  </v-alert>

  <template v-else>
    <!-- RESUMEN -->
    <div class="lista-header">
      <h2>{{ tituloFiltro }}</h2>
      <span>{{ descuentosFiltrados.length }} descuentos</span>
    </div>

    <!-- LISTA -->
    <div v-if="descuentosFiltrados.length" class="descuentos-lista">      
      <article v-for="descuento in descuentosFiltrados" :key="descuento.id" class="descuento-card">
        <!-- PRIMERA FILA: ICONO, INFORMACIÓN Y ACCIONES -->
        <div class="descuento-fila-principal">
          <div class="descuento-icono">
            <v-icon icon="mdi-tag-minus" />
          </div>

          <div class="descuento-info">
            <h3>{{ descuento.titulo || "Descuento sin título" }}</h3>

            <p class="descuento-valor">
              {{ mostrarValor(descuento) }}
            </p>
          </div>

          <div class="descuento-acciones">
            <span class="estado-badge" :class="claseEstado(descuento.estado)">
              {{ descuento.estado }}
            </span>            
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                density="comfortable"
                size="small"
                aria-label="Opciones del descuento"
                @click="abrirOpciones(descuento)"
              />
          </div>
        </div>

        <!-- SEGUNDA FILA: CÓDIGO A TODO EL ANCHO -->
        <div class="descuento-detalles">
          <p class="descuento-codigo">
            Código: {{ descuento.codigo }}
          </p>

          <!-- TERCERA FILA: FECHAS A TODO EL ANCHO -->
          <p class="descuento-fechas">
            {{ mostrarVigencia(descuento) }}
          </p>
        </div>
      </article>

    </div>

    <!-- SIN RESULTADOS -->
    <div v-else class="estado-vacio">
      <v-icon icon="mdi-tag-off-outline" size="42" />
      <h3>No hay descuentos</h3>
      <p>
        {{
            busqueda
             ?"No encontramos descuentos con esa búsqueda."
              : "Crea tu primer descuento para tus servicios."
          }}
      </p>

      <v-btn v-if="!busqueda" color="teal" rounded="lg" @click="abrirCrear">
        Crear descuento
      </v-btn>
    </div>
  </template>

  <!-- FORMULARIO -->
  <v-dialog v-model="dialog" fullscreen scrollable transition="dialog-bottom-transition">
    <v-card class="formulario-dialog">
      <v-toolbar class="formulario-toolbar">
        <v-btn icon="mdi-arrow-left" variant="text" @click="cerrarDialog" />

        <v-toolbar-title>
          {{ editando?"Editar descuento" : "Nuevo descuento" }}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="formulario-contenido">
        <v-form ref="formRef" @submit.prevent="guardar">
          <!-- INFORMACIÓN BÁSICA -->
          <section class="form-seccion">
            <div class="seccion-titulo">
              <div class="seccion-icono rosa">
                <v-icon icon="mdi-percent-outline" />
              </div>
              <h2>Información básica</h2>
            </div>

            <label class="campo-label">Nombre del descuento *</label>
            <v-text-field v-model="form.titulo" placeholder="Ej. Bienvenida PIA" variant="outlined" density="comfortable" :rules="[reglas.requerido]" maxlength="250" counter="250" />

            <label class="campo-label">Descripción</label>
            <v-textarea v-model="form.descripcion" placeholder="Describe el descuento..." variant="outlined" density="comfortable" rows="3" auto-grow />

            <div v-if="editando" class="codigo-actual">
              <label class="campo-label">Código de descuento</label>
              <div class="codigo-valor">
                <span>{{ form.codigo || "Sin código" }}</span>
                <v-btn icon="mdi-content-copy" variant="text" size="small" :disabled="!form.codigo" @click="copiarCodigo" />
              </div>
              <small>El código existente se conserva al editar.</small>
            </div>
          </section>

          <!-- TIPO Y VALOR -->
          <section class="form-seccion">
            <div class="seccion-titulo">
              <div class="seccion-icono naranja">
                <v-icon icon="mdi-tag-outline" />
              </div>
              <h2>Tipo y valor</h2>
            </div>

            <label class="campo-label">Tipo de descuento *</label>

            <div class="tipo-selector">
              <button type="button" class="tipo-opcion" :class="{ activo: form.tipo === 'PORCENTAJE' }" @click="seleccionarTipo('PORCENTAJE')">
                <v-icon icon="mdi-percent-outline" />
                Porcentaje
              </button>

              <button type="button" class="tipo-opcion" :class="{ activo: form.tipo === 'MONTO' }" @click="seleccionarTipo('MONTO')">
                <v-icon icon="mdi-cash" />
                Monto fijo
              </button>
            </div>

            <label class="campo-label">Valor del descuento *</label>

            <v-text-field v-if="form.tipo === 'PORCENTAJE'" v-model.number="form.porcentaje" type="number" placeholder="20" suffix="%" variant="outlined" density="comfortable" min="0.01" max="100" step="0.01" :rules="[reglas.requerido, reglas.porcentaje]" />

            <v-text-field v-else v-model.number="form.monto" type="number" placeholder="50.00" prefix="Bs" variant="outlined" density="comfortable" min="0.01" step="0.01" :rules="[reglas.requerido, reglas.monto]" />
          </section>

          <!-- VIGENCIA -->
          <section class="form-seccion">
            <div class="seccion-titulo">
              <div class="seccion-icono azul">
                <v-icon icon="mdi-calendar-range" />
              </div>
              <h2>Vigencia</h2>
            </div>

            <label class="campo-label">Fecha de inicio</label>
            <v-text-field v-model="form.fecha_inicio" type="date" variant="outlined" density="comfortable" :max="form.fecha_fin || undefined" />

            <label class="campo-label">Fecha de fin</label>
            <v-text-field v-model="form.fecha_fin" type="date" variant="outlined" density="comfortable" :min="form.fecha_inicio || undefined" />

            <p class="ayuda-campo">
              Si dejas las fechas vacías, el descuento no tendrá un límite
              de vigencia definido por fechas.
            </p>
          </section>

          <!-- ESTADO: SOLO VISIBLE AL CREAR -->
          <section
            v-if="!editando"
            class="form-seccion estado-seccion"
          >
            <div>
              <h2>Estado inicial</h2>
              <p>
                El descuento se creará habilitado.
                Podrás desactivarlo desde las opciones del descuento.
              </p>
            </div>

            <v-switch
              v-model="form.estado"
              color="teal"
              true-value="ACTIVO"
              false-value="INACTIVO"
              hide-details
              inset
            />
          </section>


          <v-alert v-if="errorFormulario" type="error" variant="tonal" class="mb-4">
            {{ errorFormulario }}
          </v-alert>

          <v-btn type="submit" block color="teal" size="large" rounded="lg" :loading="guardando" prepend-icon="mdi-content-save-outline">
            {{ editando?"Guardar cambios" : "Guardar descuento" }}
          </v-btn>

          <v-btn block variant="text" class="mt-2" :disabled="guardando" @click="cerrarDialog">
            Cancelar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  
<v-bottom-sheet
  v-model="sheetOpciones"
  scrollable
>
  <v-card class="opciones-sheet">
    <!-- INDICADOR SUPERIOR -->
    <div class="sheet-indicador"></div>

    <!-- ENCABEZADO -->
    <div class="sheet-encabezado">
      <div class="sheet-titulo-contenido">
        <h2>Opciones del descuento</h2>

        <p>
          {{ descuentoSeleccionado?.titulo || "Descuento" }}
        </p>
      </div>

      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        aria-label="Cerrar opciones"
        @click="sheetOpciones = false"
      />
    </div>

    <!-- OPCIONES -->
    <div class="sheet-opciones">

      <!-- 1. EDITAR DESCUENTO -->
      <button
        type="button"
        class="sheet-opcion"
        @click="editarSeleccionado"
      >
        <span class="sheet-icono editar">
          <v-icon icon="mdi-pencil-outline" />
        </span>

        <span class="sheet-opcion-texto">
          <strong>Editar descuento</strong>

          <span>
            Modificar nombre, descripción, importe
            y fechas de vigencia.
          </span>
        </span>

        <v-icon
          class="sheet-flecha"
          icon="mdi-chevron-right"
        />
      </button>

      <div class="sheet-separador"></div>

      <!-- 2. ASIGNAR DESCUENTO A SERVICIOS -->
      <button
        type="button"
        class="sheet-opcion"
        @click="abrirAsignacionServicios"
      >
        <span class="sheet-icono asignar">
          <v-icon icon="mdi-layers-outline" />
        </span>

        <span class="sheet-opcion-texto">
          <strong>Asignar descuento a servicios</strong>

          <span>
            Seleccionar uno o varios servicios donde
            se aplicará este descuento.
          </span>
        </span>

        <v-icon
          class="sheet-flecha"
          icon="mdi-chevron-right"
        />
      </button>

      <div class="sheet-separador"></div>

      <!-- 3. ACTIVAR / DESACTIVAR -->
      <button
        type="button"
        class="sheet-opcion"
        @click="cambiarEstadoSeleccionado"
      >
        <span
          class="sheet-icono"
          :class="
            descuentoSeleccionado?.estado === 'ACTIVO'
              ? 'desactivar'
              : 'activar'
          "
        >
          <v-icon
            :icon="
              descuentoSeleccionado?.estado === 'ACTIVO'
                ? 'mdi-toggle-switch-off-outline'
                : 'mdi-toggle-switch-outline'
            "
          />
        </span>

        <span class="sheet-opcion-texto">
          <strong>
            {{
              descuentoSeleccionado?.estado === "ACTIVO"
                ? "Desactivar descuento"
                : "Activar descuento"
            }}
          </strong>

          <span>
            {{
              descuentoSeleccionado?.estado === "ACTIVO"
                ? "Suspender temporalmente la disponibilidad del descuento."
                : "Volver a habilitar el descuento para los clientes."
            }}
          </span>
        </span>

        <v-icon
          class="sheet-flecha"
          icon="mdi-chevron-right"
        />
      </button>

    </div>

    <!-- CERRAR PANEL -->
    <div class="sheet-pie">
      <v-btn
        block
        class="btn-cerrar-sheet"
        prepend-icon="mdi-close-circle-outline"
        @click="sheetOpciones = false"
      >
        Cerrar opciones
      </v-btn>
    </div>
  </v-card>
</v-bottom-sheet>

  
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
    {{ mensaje }}
  </v-snackbar>
</div>
</template>

<script>
import {
  getDescuentos,
  crearDescuento,
  actualizarDescuento,
  cambiarEstadoDescuento,
} from "../services/descuento.api";

export default {
  name: "DescuentosAdminPage",

  data() {
    return {
      descuentos: [],
      cargando: false,
      guardando: false,
      error: "",
      errorFormulario: "",

      busqueda: "",
      filtroActivo: "TODOS",

      dialog: false,
      editando: false,
      descuentoId: null,

      snackbar: false,
      snackbarColor: "success",
      mensaje: "",

      form: this.formularioInicial(),

      filtros: [{
          texto: "Todos",
          valor: "TODOS"
        },
        {
          texto: "Activos",
          valor: "ACTIVO"
        },
        {
          texto: "Inactivos",
          valor: "INACTIVO"
        },
      ],

      reglas: {
        requerido: (v) =>
          (v !== null && v !== undefined && v !== "") ||
          "Este campo es obligatorio",

        porcentaje: (v) =>
          (Number(v) > 0 && Number(v) <= 100) ||
          "El porcentaje debe ser mayor que 0 y hasta 100",

        monto: (v) =>
          (Number(v) > 0 && Number.isFinite(Number(v))) ||
          "El monto debe ser mayor que cero",
      },

      sheetOpciones: false,
      descuentoSeleccionado: null,
    };
  },

  computed: {
    descuentosFiltrados() {
      const texto = this.normalizar(this.busqueda || "");

      return this.descuentos.filter((descuento) => {
        const coincideEstado =
          this.filtroActivo === "TODOS" ||
          descuento.estado === this.filtroActivo;

        const contenido = this.normalizar(
          [
            descuento.titulo,
            descuento.descripcion,
            descuento.codigo,
          ]
          .filter(Boolean)
          .join(" "),
        );

        return coincideEstado && contenido.includes(texto);
      });
    },

    tituloFiltro() {
      const filtro = this.filtros.find(
        (item) => item.valor === this.filtroActivo,
      );

      return filtro?filtro.texto : "Descuentos";
    },
  },

  mounted() {
    this.cargarDescuentos();
  },

  methods: {
    formularioInicial() {
      return {
        titulo: "",
        descripcion: "",
        codigo: "",
        tipo: "PORCENTAJE",
        monto: null,
        porcentaje: 20,
        fecha_inicio: "",
        fecha_fin: "",
        estado: "ACTIVO",
      };
    },

    normalizar(valor) {
      return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    },

    async cargarDescuentos() {
      this.cargando = true;
      this.error = "";

      try {
        const respuesta = await getDescuentos();
        const datos = respuesta.data?.data;

        this.descuentos = Array.isArray(datos) ?
          datos :
          Array.isArray(datos?.descuentos) ?
          datos.descuentos :
          [];
      } catch (error) {
        console.error("Error al cargar descuentos:", error);

        this.error =
          error.response?.data?.message ||
          "No se pudieron cargar los descuentos.";
      } finally {
        this.cargando = false;
      }
    },

    contarDescuentos(estado) {
      if (estado === "TODOS") return this.descuentos.length;

      return this.descuentos.filter(
        (descuento) => descuento.estado === estado,
      ).length;
    },

    mostrarValor(descuento) {
      if (descuento.porcentaje !== null &&
        descuento.porcentaje !== undefined) {
        return `${Number(descuento.porcentaje)}% de descuento`;
      }

      if (descuento.monto !== null && descuento.monto !== undefined) {
        return `Bs ${Number(descuento.monto).toFixed(0)} de descuento`;
      }

      return "Valor no definido";
    },

    mostrarVigencia(descuento) {
      const inicio = this.formatearFecha(descuento.fecha_inicio);
      const fin = this.formatearFecha(descuento.fecha_fin);

      if (inicio && fin) return `${inicio} - ${fin}`;
      if (inicio) return `Desde ${inicio}`;
      if (fin) return `Hasta ${fin}`;

      return "Sin límite de fechas";
    },

    formatearFecha(fecha) {
      if (!fecha) return "";

      const valor = String(fecha).slice(0, 10);
      const partes = valor.split("-");

      if (partes.length !== 3) return valor;

      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },

    claseEstado(estado) {
      return estado === "ACTIVO"?"estado-activo" : "estado-inactivo";
    },

    seleccionarTipo(tipo) {
      this.form.tipo = tipo;

      if (tipo === "PORCENTAJE") {
        this.form.monto = null;
        if (this.form.porcentaje === null) this.form.porcentaje = 20;
      } else {
        this.form.porcentaje = null;
        if (this.form.monto === null) this.form.monto = 0;
      }
    },

    abrirCrear() {
      this.editando = false;
      this.descuentoId = null;
      this.errorFormulario = "";
      this.form = this.formularioInicial();
      this.dialog = true;
    },
    
    abrirAsignacionServicios() {
      const descuento = this.descuentoSeleccionado;

      this.sheetOpciones = false;

      if (!descuento) return;

      this.$router.push({
        name: "descuento-servicio",
        params: {
          descuentoId: descuento.id,
        },
      });
    },

    abrirEditar(descuento) {
      this.editando = true;
      this.descuentoId = descuento.id;
      this.errorFormulario = "";

      this.form = {
        titulo: descuento.titulo || "",
        descripcion: descuento.descripcion || "",
        codigo: descuento.codigo || "",
        tipo: descuento.porcentaje !== null &&
          descuento.porcentaje !== undefined ?
          "PORCENTAJE" :
          "MONTO",
        monto: descuento.monto !== null && descuento.monto !== undefined ?
          Number(descuento.monto) :
          null,
        porcentaje: descuento.porcentaje !== null &&
          descuento.porcentaje !== undefined ?
          Number(descuento.porcentaje) :
          null,
        fecha_inicio: descuento.fecha_inicio ?
          String(descuento.fecha_inicio).slice(0, 10) :
          "",
        fecha_fin: descuento.fecha_fin ?
          String(descuento.fecha_fin).slice(0, 10) :
          "",
        estado: descuento.estado || "ACTIVO",
      };

      this.dialog = true;
    },

    async guardar() {
      this.errorFormulario = "";

      const resultado = await this.$refs.formRef.validate();

      if (!resultado.valid) return;

      if (
        this.form.fecha_inicio &&
        this.form.fecha_fin &&
        this.form.fecha_fin < this.form.fecha_inicio
      ) {
        this.errorFormulario =
          "La fecha de fin no puede ser anterior a la fecha de inicio.";
        return;
      }

      const datos = {
        titulo: this.form.titulo.trim(),
        descripcion: this.form.descripcion.trim() || null,
        monto: this.form.tipo === "MONTO"
          ? Number(this.form.monto)
          : null,
        porcentaje: this.form.tipo === "PORCENTAJE"
          ? Number(this.form.porcentaje)
          : null,
        fecha_inicio: this.form.fecha_inicio || null,
        fecha_fin: this.form.fecha_fin || null,
      };

      this.guardando = true;

      try {
        if (this.editando) {
          await actualizarDescuento(this.descuentoId, datos);
          this.$piaAlert.success(
            "Descuento actualizado correctamente.",
            {
              title: "Descuento actualizado",
            }
          );
        } else {
          await crearDescuento(datos);
          this.$piaAlert.success(
            "Descuento creado correctamente.",
            {
              title: "Descuento creado",
            }
          );
        }

        this.dialog = false;
        await this.cargarDescuentos();
      } catch (error) {
        console.error("Error al guardar descuento:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "No se pudo guardar el descuento.",
          {
            title: "Error al guardar descuento",
          }
        );
      } finally {
        this.guardando = false;
      }
    },

    async cambiarEstado(descuento) {
      const nuevoEstado =
        descuento.estado === "ACTIVO"?"INACTIVO" : "ACTIVO";

      try {
        await cambiarEstadoDescuento(descuento.id, nuevoEstado);

        this.$piaAlert.success(
          `Descuento ${nuevoEstado === "ACTIVO" ? "activado" : "desactivado"} correctamente.`,
          {
            title: "Estado actualizado",
          }
        );

        await this.cargarDescuentos();
      } catch (error) {
        console.error("Error al cambiar estado:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "No se pudo cambiar el estado del descuento.",
          {
            title: "Error al cambiar estado",
          }
        );
      }
    },
    
    abrirOpciones(descuento) {
      this.descuentoSeleccionado = descuento;
      this.sheetOpciones = true;
    },

    editarSeleccionado() {
      if (!this.descuentoSeleccionado) return;

      const descuento = this.descuentoSeleccionado;

      this.sheetOpciones = false;
      this.abrirEditar(descuento);
    },

    async cambiarEstadoSeleccionado() {
      if (!this.descuentoSeleccionado) return;

      const descuento = this.descuentoSeleccionado;

      this.sheetOpciones = false;
      await this.cambiarEstado(descuento);
    },

    async copiarCodigo() {
      if (!this.form.codigo) return;

      try {
        await navigator.clipboard.writeText(this.form.codigo);
        this.mostrarMensaje("Código copiado.");
      } catch {
        this.mostrarMensaje("No se pudo copiar el código.", "error");
      }
    },

    cerrarDialog() {
      if (this.guardando) return;

      this.dialog = false;
      this.errorFormulario = "";
    },

    mostrarMensaje(texto, color = "success") {
      this.mensaje = texto;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.descuentos-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 16px;
  color: #10284f;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  h1 {
    margin: 0 0 5px;
    font-size: 23px;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #7185a4;
    font-size: 13px;
    line-height: 1.5;
  }
}

.header-count {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 13px;
  border-radius: 16px;
  background: #e0f7f5;
  color: #009b98;
  font-weight: 800;
}

.btn-nuevo {
  min-height: 46px;
  margin-bottom: 14px;
  background: #009c98;
  color: white;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
}

.search-input {
  margin-bottom: 12px;
}

.filtros {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0 10px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filtro-chip {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid #e1e9f2;
  border-radius: 14px;
  background: white;
  color: #647994;
  font-size: 12px;
  font-weight: 700;

  span {
    font-weight: 800;
  }

  &.seleccionado {
    border-color: #009c98;
    background: #e2f8f6;
    color: #008e89;
  }
}

.lista-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 12px;

  h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
  }

  span {
    color: #8191a9;
    font-size: 12px;
  }
}

.descuentos-lista {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.descuento-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 10px;
  border: 1px solid #e9eff6;
  border-radius: 15px;
  background: white;
  box-shadow: 0 3px 10px rgb(20 50 90 / 4%);
}

.descuento-icono,
.seccion-icono {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 21px;
}

.descuento-icono {
  background: #ffebf2;
  color: #ec4380;
}

.descuento-info {
  flex: 1;
  min-width: 0;

  h3 {
    overflow-wrap: anywhere;
    margin: 1px 0 5px;
    font-size: 13px;
    font-weight: 800;
  }

  p {
    margin: 3px 0;
    font-size: 11px;
  }

  .descuento-valor {
    color: #405776;
    font-weight: 700;
  }

  .descuento-codigo {
    overflow-wrap: anywhere;
    color: #00938f;
    font-weight: 700;
  }

  .descuento-fechas {
    color: #8091aa;
  }
}

.descuento-acciones {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.estado-badge {
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
}

.estado-activo {
  background: #dcf9e9;
  color: #009a59;
}

.estado-inactivo {
  background: #ffe7e8;
  color: #e3434e;
}

.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 18px;
  color: #8293aa;
  text-align: center;

  h3 {
    margin: 0;
    color: #173258;
    font-size: 16px;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
}

.formulario-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f8fc;
}

.formulario-toolbar {
  flex: 0 0 auto;
  border-bottom: 1px solid #e5edf5;
  background: white;
  color: #10284f;

  :deep(.v-toolbar-title) {
    font-size: 17px;
    font-weight: 800;
  }
}

.formulario-contenido {
  flex: 1 1 auto;
  padding: 14px;
}

.form-seccion {
  margin-bottom: 13px;
  padding: 17px 14px 8px;
  border: 1px solid #e9eff6;
  border-radius: 16px;
  background: white;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
  }
}

.seccion-icono {
  width: 38px;
  height: 38px;
}

.rosa {
  background: #ffebf2;
  color: #ec4380;
}

.naranja {
  background: #fff1dc;
  color: #e68b16;
}

.azul {
  background: #e5f2ff;
  color: #2585f4;
}

.campo-label {
  display: block;
  margin-bottom: 7px;
  color: #344b6c;
  font-size: 12px;
  font-weight: 700;
}

.form-seccion :deep(.v-input) {
  margin-bottom: 8px;
}

.form-seccion :deep(.v-field) {
  border-radius: 10px;
  font-size: 13px;
}

.tipo-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 18px;
}

.tipo-opcion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 43px;
  padding: 8px 5px;
  border: 1px solid #dce5ef;
  border-radius: 10px;
  background: white;
  color: #536783;
  font-size: 12px;
  font-weight: 700;

  &.activo {
    border-color: #009c98;
    background: #e6f9f7;
    color: #008d88;
  }
}

.ayuda-campo {
  margin: 0 0 10px;
  color: #7c8da5;
  font-size: 11px;
  line-height: 1.5;
}

.estado-seccion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 14px;

  h2 {
    margin: 0 0 5px;
    font-size: 14px;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #7c8da5;
    font-size: 11px;
  }
}

.codigo-valor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px dashed #b8dcd9;
  border-radius: 10px;
  background: #f0fbfa;
  color: #008d88;
  font-size: 13px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.codigo-actual small {
  display: block;
  margin: 6px 0 12px;
  color: #8293aa;
  font-size: 11px;
}

@media (min-width: 700px) {
  .descuentos-page {
    padding: 24px;
  }

  .formulario-dialog {
    max-width: 620px;
    margin-left: auto;
  }
}


.descuento-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 13px 10px;
  border: 1px solid #e9eff6;
  border-radius: 15px;
  background: white;
  box-shadow: 0 3px 10px rgb(20 50 90 / 4%);
  min-width: 0;
}

.descuento-fila-principal {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.descuento-icono,
.seccion-icono {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 21px;
}

.descuento-icono {
  background: #ffebf2;
  color: #ec4380;
}

.descuento-info {
  flex: 1;
  min-width: 0;
  padding-top: 1px;

  h3 {
    overflow-wrap: anywhere;
    margin: 1px 0 5px;
    font-size: 13px;
    font-weight: 800;
  }

  .descuento-valor {
    margin: 3px 0;
    color: #405776;
    font-size: 11px;
    font-weight: 700;
  }
}

.descuento-acciones {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.estado-badge {
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
}

.estado-activo {
  background: #dcf9e9;
  color: #009a59;
}

.estado-inactivo {
  background: #ffe7e8;
  color: #e3434e;
}

/* Código y fechas en filas independientes, ocupando todo el ancho */
.descuento-detalles {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  gap: 3px;
  padding-left: 5px;
}

.descuento-codigo,
.descuento-fechas {
  width: 100%;
  margin: 0;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.descuento-codigo {
  color: #00938f;
  font-weight: 700;
}

.descuento-fechas {
  color: #8091aa;
}


.opciones-sheet {
  padding: 10px 18px calc(20px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0 !important;
  background: #ffffff;
  color: #10284f;
}

.sheet-indicador {
  width: 44px;
  height: 5px;
  margin: 3px auto 20px;
  border-radius: 99px;
  background: #d6e0eb;
}

.sheet-encabezado {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  h2 {
    margin: 0 0 7px;
    color: #10284f;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.35;
  }

  p {
    margin: 0;
    color: #657b98;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
}

.sheet-titulo-contenido {
  flex: 1;
  min-width: 0;
  padding-top: 3px;
}

.sheet-opciones {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sheet-opcion {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-height: 94px;
  padding: 15px 10px;
  border: 1px solid #e7edf5;
  border-radius: 16px;
  background: #ffffff;
  color: #173258;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:active {
    background: #f5f8fc;
  }
}

.sheet-icono {
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  font-size: 23px;

  &.editar {
    background: #e0f7f5;
    color: #009c98;
  }

  &.desactivar {
    background: #fcecee;;
    color: #c91c33;
  }

  &.activar {
    background: #dcf9e9;
    color: #008b50;
  }
}

.sheet-opcion-texto {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: 7px;

  strong {
    color: #173258;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.4;
  }

  span {
    color: #657b98;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.6;
    white-space: normal;
    overflow-wrap: anywhere;
  }
}

.sheet-flecha {
  flex-shrink: 0;
  color: #91a0b4;
}

.sheet-separador {
  height: 1px;
  margin: 4px 2px;
  background: #edf1f6;
}

.sheet-pie {
  padding-top: 20px;
}

.btn-cerrar-sheet {
  min-height: 48px;
  border-radius: 12px;
  background: #c91c33;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  text-transform: none;
  letter-spacing: 0;

  &:hover {
    background: #741725;
  }
}

</style>
