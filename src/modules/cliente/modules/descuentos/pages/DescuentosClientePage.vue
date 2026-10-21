<template>
<div class="descuentos-page">

  <!-- ENCABEZADO -->
  <header class="page-header">
    <button class="back-button" @click="volver">
      <v-icon>mdi-arrow-left</v-icon>
    </button>

    <h1>
      {{ descuentoSeleccionado?"Detalle del descuento" : "Mis descuentos" }}
    </h1>

    <div class="header-spacer"></div>
  </header>

  <!-- CARGANDO -->
  <div v-if="cargando" class="estado-contenido">
    <v-progress-circular indeterminate color="teal" size="38" />
    <p>Cargando tus descuentos...</p>
  </div>

  <!-- ERROR -->
  <div v-else-if="error" class="estado-contenido">
    <v-icon size="45" color="error">mdi-alert-circle-outline</v-icon>
    <p>{{ error }}</p>

    <button class="boton-reintentar" @click="cargarDescuentos">
      Intentar nuevamente
    </button>
  </div>

  <template v-else>

    <!-- ================================================
           LISTADO DE DESCUENTOS
      ================================================= -->
    <template v-if="!descuentoSeleccionado">

      <!-- BANNER -->
      <section class="welcome-banner">
        <div class="welcome-illustration">
          <img src="/images/pia/pia-character.png" alt="Pía" />
        </div>

        <div class="welcome-text">
          <h2>Tus descuentos te están esperando</h2>

          <p>
            Aprovecha tus beneficios exclusivos y disfruta
            de tus servicios favoritos.
          </p>

          <span class="welcome-total">
            <v-icon size="16">mdi-gift-outline</v-icon>
            {{ descuentosDisponibles.length }}
            {{ descuentosDisponibles.length === 1?"beneficio disponible" : "beneficios disponibles" }}
          </span>
        </div>
      </section>

      <!-- PESTAÑAS -->
      <nav class="descuentos-tabs">
        <button v-for="tab in tabs" :key="tab.value" class="tab-button" :class="{ active: tabSeleccionada === tab.value }" @click="tabSeleccionada = tab.value">
          {{ tab.label }}

          <span class="tab-count">
            {{ descuentosPorCategoria(tab.value).length }}
          </span>
        </button>
      </nav>

      <!-- LISTA -->
      <section class="descuentos-lista">

        <article v-for="descuento in descuentosPorCategoria(tabSeleccionada)" :key="descuento.asignacion_id" class="descuento-card" @click="verDetalle(descuento)">

          <!-- IMAGEN -->
          <div class="descuento-imagen">
            <img v-if="urlImagen(descuento)" :src="urlImagen(descuento)" :alt="descuento.servicio_nombre" @error="imagenError($event)" />

            <div v-else class="imagen-placeholder">
              <v-icon size="42">mdi-content-cut</v-icon>
            </div>

            <span class="descuento-etiqueta">
              {{ textoDescuento(descuento) }}
            </span>
          </div>

          <!-- INFORMACIÓN -->
          <div class="descuento-info">

            <h3>{{ descuento.servicio_nombre }}</h3>

            <p class="descuento-titulo text-decoration-underline">
              {{ descuento.descuento_titulo }}
            </p>

            <div class="profesional-info">
              <v-icon color="primary" size="16">mdi-account</v-icon>

              <span class="font-weight-bold text-capitalize text-primary pt-1">
                {{ descuento.profesional_nombre }}
              </span>
            </div>

            <p v-if="descuento.descuento_descripcion" class="descuento-descripcion">
              {{ descuento.descuento_descripcion }}
            </p>

            <div class="precios">
              <span v-if="precioOriginal(descuento) !== null" class="precio-original">
                {{ formatoPrecio(precioOriginal(descuento)) }}
              </span>

              <strong v-if="precioConDescuento(descuento) !== null" class="precio-final">
                {{ formatoPrecio(precioConDescuento(descuento)) }}
              </strong>

              <span v-else class="precio-pendiente">
                Consulta las condiciones
              </span>
            </div>
          </div>

          <!-- <v-icon class="card-arrow">
            mdi-chevron-right
          </v-icon> -->

          <!-- VIGENCIA -->
          <div class="descuento-footer">
            <div class="footer-dato">
              <v-icon size="18">mdi-calendar-clock</v-icon>

              <div>
                <small>Válido hasta</small>
                <strong>{{ formatoFecha(descuento.fecha_fin) }}</strong>
              </div>
            </div>

            <div class="footer-dato codigo-resumen">
              <v-icon size="18">mdi-tag-outline</v-icon>

              <div>
                <small>Código</small>
                <strong>
                  {{ descuento.descuento_codigo || "Sin código" }}
                </strong>
              </div>
            </div>
          </div>

        </article>

        <!-- SIN DESCUENTOS -->
        <div v-if="descuentosPorCategoria(tabSeleccionada).length === 0" class="sin-descuentos">
          <div class="sin-descuentos-icon">
            <v-icon size="38">
              {{ iconoVacio(tabSeleccionada) }}
            </v-icon>
          </div>

          <h3>{{ tituloVacio(tabSeleccionada) }}</h3>

          <p>{{ mensajeVacio(tabSeleccionada) }}</p>
        </div>

      </section>

      <!-- AYUDA -->
      <section class="ayuda-banner">
        <v-icon size="27">mdi-lightbulb-on-outline</v-icon>

        <div>
          <h3>¿Cómo funcionan?</h3>
          <p>
            Cada descuento corresponde a un servicio específico.
            Revisa sus condiciones antes de reservar.
          </p>
        </div>
      </section>

    </template>

    <!-- ================================================
           DETALLE DEL DESCUENTO
      ================================================= -->
    <template v-else>

      <section class="detalle-page">

        <!-- IMAGEN PRINCIPAL -->
        <div class="detalle-imagen">
          <img v-if="urlImagen(descuentoSeleccionado)" :src="urlImagen(descuentoSeleccionado)" :alt="descuentoSeleccionado.servicio_nombre" @error="imagenError($event)" />

          <div v-else class="detalle-placeholder">
            <v-icon size="65">mdi-content-cut</v-icon>
          </div>

          <span class="detalle-etiqueta">
            {{ textoDescuento(descuentoSeleccionado) }}
          </span>
        </div>

        <div class="detalle-contenido">

          <h2>{{ descuentoSeleccionado.servicio_nombre }}</h2>

          <p class="detalle-descripcion">
            {{ descuentoSeleccionado.descuento_descripcion ||
                "Disfruta de este beneficio exclusivo para ti." }}
          </p>

          <!-- PROFESIONAL -->
          <section class="profesional-card">
            <!-- <div class="profesional-card-header">
              <v-icon size="19">mdi-account-star-outline</v-icon>
              <h3>Tu profesional</h3>
            </div> -->

            <div class="profesional-card-body">
              <!-- FOTO -->
              <div class="profesional-foto-wrapper">
                <img
                  v-if="urlFotoProfesional(descuentoSeleccionado)"
                  :src="urlFotoProfesional(descuentoSeleccionado)"
                  :alt="descuentoSeleccionado.profesional_nombre"
                  class="profesional-avatar"
                  @error="imagenError($event)"
                />

                <div v-else class="profesional-avatar-placeholder">
                  <v-icon size="30">mdi-account</v-icon>
                </div>
              </div>

              <!-- DATOS -->
              <div class="profesional-datos text-capitalize">
                <h4>{{ descuentoSeleccionado.profesional_nombre }}</h4>

                <p class="profesional-especialidad">
                  {{ "Profesional de belleza" }}
                </p>

                <div
                  v-if="descuentoSeleccionado.profesional_telefono"
                  class="profesional-dato"
                >
                  <v-icon size="16">mdi-phone-outline</v-icon>
                  <a :href="`tel:${descuentoSeleccionado.profesional_telefono}`">
                    {{ descuentoSeleccionado.profesional_telefono }}
                  </a>
                </div>

                <div
                  v-if="descuentoSeleccionado.negocio_nombre"
                  class="profesional-dato"
                >
                  <v-icon size="16">mdi-storefront-outline</v-icon>
                  <span>{{ descuentoSeleccionado.negocio_nombre }}</span>
                </div>

                <div
                  v-if="descuentoSeleccionado.negocio_telefono"
                  class="profesional-dato"
                >
                  <v-icon size="16">mdi-phone-in-talk-outline</v-icon>
                  <a :href="`tel:${descuentoSeleccionado.negocio_telefono}`">
                    {{ descuentoSeleccionado.negocio_telefono }}
                  </a>
                </div>

                <div
                  v-if="
                    descuentoSeleccionado.negocio_direccion ||
                    descuentoSeleccionado.negocio_zona ||
                    descuentoSeleccionado.negocio_municipio
                  "
                  class="profesional-dato"
                >
                  <v-icon size="16">mdi-map-marker-outline</v-icon>
                  <span>
                    {{
                      [
                        descuentoSeleccionado.negocio_direccion,
                        descuentoSeleccionado.negocio_zona,
                        descuentoSeleccionado.negocio_municipio
                      ].filter(Boolean).join(", ")
                    }}
                  </span>
                </div>
              </div>

            </div>

            <p v-if="descuentoSeleccionado.profesional_descripcion" class="profesional-descripcion">
              {{ descuentoSeleccionado.profesional_descripcion }}
            </p>
          </section>

          <!-- SERVICIO Y PRECIO -->
          <section class="detalle-bloque">
            <h3>
              <v-icon size="19">mdi-tag-outline</v-icon>
              Información del descuento
            </h3>

            <div class="detalle-fila">
              <span>Tipo de descuento</span>
              <strong>{{ textoDescuento(descuentoSeleccionado) }}</strong>
            </div>

            <div class="detalle-fila">
              <span>Precio original</span>
              <strong>
                {{ precioOriginal(descuentoSeleccionado) !== null
                   ?formatoPrecio(precioOriginal(descuentoSeleccionado))
                    : "No disponible" }}
              </strong>
            </div>

            <div class="detalle-fila">
              <span>Precio con descuento</span>
              <strong class="precio-final">
                {{ precioConDescuento(descuentoSeleccionado) !== null
                   ?formatoPrecio(precioConDescuento(descuentoSeleccionado))
                    : "Por confirmar" }}
              </strong>
            </div>
          </section>

          <!-- VIGENCIA -->
          <section class="detalle-bloque">
            <h3>
              <v-icon size="19">mdi-calendar-range</v-icon>
              Vigencia
            </h3>

            <div class="detalle-fila">
              <span>Fecha de inicio</span>
              <strong>
                {{ formatoFecha(descuentoSeleccionado.fecha_inicio) }}
              </strong>
            </div>

            <div class="detalle-fila">
              <span>Fecha de fin</span>
              <strong>
                {{ formatoFecha(descuentoSeleccionado.fecha_fin) }}
              </strong>
            </div>
          </section>

          <!-- CÓDIGO -->
          <section class="detalle-bloque">
            <h3>
              <v-icon size="19">mdi-ticket-percent-outline</v-icon>
              Código de descuento
            </h3>

            <div class="codigo-box">
              <span>
                {{ descuentoSeleccionado.descuento_codigo || "Sin código" }}
              </span>

              <button v-if="descuentoSeleccionado.descuento_codigo" class="copiar-button" @click="copiarCodigo(descuentoSeleccionado.descuento_codigo)">
                <v-icon size="21">mdi-content-copy</v-icon>
              </button>
            </div>
          </section>

          <!-- AVISO -->
          <div class="detalle-aviso">
            <v-icon size="22">mdi-information-outline</v-icon>

            <p>
              Este beneficio corresponde al servicio indicado.
              Revisa su vigencia y sus condiciones antes de utilizarlo.
            </p>
          </div>
          
          <button class="btn-agendar" @click="agendarCita">
            <v-icon size="20">
              mdi-calendar-outline
            </v-icon>

            <span>
              Agendar cita
            </span>
          </button>

        </div>
      </section>

    </template>

  </template>

  <div class="bottom-space"></div>

</div>
</template>

<script>
import {
  getMisDescuentos
} from "../services/descuentoCliente.api";

export default {
  name: "DescuentosClientePage",

  data() {
    return {
      cargando: false,
      error: "",
      descuentos: [],
      tabSeleccionada: "DISPONIBLE",
      descuentoSeleccionado: null,

      tabs: [{
          label: "Disponibles",
          value: "DISPONIBLE"
        },
        {
          label: "Utilizados",
          value: "UTILIZADO"
        },
        {
          label: "Vencidos",
          value: "VENCIDO"
        },
      ],
    };
  },

  computed: {
    descuentosDisponibles() {
      return this.descuentos.filter(
        (d) => d.categoria === "DISPONIBLE"
      );
    },
  },

  methods: {
    urlFotoProfesional(descuento) {
      const url = descuento?.profesional_foto;

      if (!url) return "";

      if (/^https?:\/\//i.test(url)) {
        return url;
      }

      return `http://localhost:3000${url.startsWith("/") ? "" : "/"}${url}`;
    },
    
    async cargarDescuentos() {
      this.cargando = true;
      this.error = "";

      try {
        const respuesta = await getMisDescuentos();

        const datos = respuesta.data?.data;

        this.descuentos = (datos?.descuentos || []).map((d) => {
          let categoria = d.categoria;

          if (!categoria) {
            if (
              d.fecha_aplicada ||
              d.codigo_aplicado ||
              d.monto_aplicado != null ||
              d.estado_aplicado != null
            ) {
              categoria = "UTILIZADO";
            } else if (
              d.fecha_fin &&
              new Date(d.fecha_fin) < new Date(
                new Date().toDateString()
              )
            ) {
              categoria = "VENCIDO";
            } else if (
              d.fecha_inicio &&
              new Date(d.fecha_inicio) > new Date(
                new Date().toDateString()
              )
            ) {
              categoria = "PENDIENTE";
            } else {
              categoria = "DISPONIBLE";
            }
          }

          return {
            ...d,
            categoria,
          };
        });

        console.log("DESCUENTOS CLASIFICADOS:", this.descuentos);
      } catch (error) {
        console.error(
          "Error al cargar los descuentos del cliente:",
          error
        );

        this.error =
          error.response?.data?.mensaje ||
          "No pudimos cargar tus descuentos. Intenta nuevamente.";
      } finally {
        this.cargando = false;
      }
    },


    descuentosPorCategoria(categoria) {
      return this.descuentos.filter(
        (d) => d.categoria === categoria
      );
    },

    verDetalle(descuento) {
      this.descuentoSeleccionado = descuento;
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },

    volver() {
      if (this.descuentoSeleccionado) {
        this.descuentoSeleccionado = null;
        return;
      }

      this.$router.push("/cliente");
    },

    textoDescuento(descuento) {
      if (descuento.descuento_porcentaje != null) {
        return `${descuento.descuento_porcentaje}% OFF`;
      }

      if (descuento.descuento_monto != null) {
        return `${this.formatoPrecio(descuento.descuento_monto)} OFF`;
      }

      return "Beneficio";
    },

    precioOriginal(descuento) {
      if (descuento.servicio_precio == null) {
        return null;
      }

      return Number(descuento.servicio_precio);
    },

    precioConDescuento(descuento) {
      const precio = this.precioOriginal(descuento);

      if (precio === null) {
        return null;
      }

      if (descuento.descuento_porcentaje != null) {
        return Math.max(
          0,
          precio * (1 - Number(descuento.descuento_porcentaje) / 100)
        );
      }

      if (descuento.descuento_monto != null) {
        return Math.max(
          0,
          precio - Number(descuento.descuento_monto)
        );
      }

      return null;
    },

    formatoPrecio(valor) {
      return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(valor);
    },

    formatoFecha(fecha) {
      if (!fecha) return "Sin fecha límite";

      const valor = String(fecha).slice(0, 10);
      const partes = valor.split("-");

      if (partes.length !== 3) return valor;

      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    },

    urlImagen(descuento) {
      const url = descuento?.imagen_url;

      if (!url) return "";

      if (/^https?:\/\//i.test(url)) {
        return url;
      }

      return `http://localhost:3000${url.startsWith("/")?"" : "/"}${url}`;
    },

    imagenError(event) {
      event.target.style.display = "none";
    },

    async copiarCodigo(codigo) {
      try {
        await navigator.clipboard.writeText(codigo);

        if (this.$piaAlert) {
          this.$piaAlert.success("Ya puedes utilizar tu código.",{
            title: "Código copiado",
          });
        }
      } catch (error) {
        console.error("Error al copiar código:", error);
      }
    },

    agendarCita() {      
      this.$router.push({name: 'horario', params: { profesionalId: this.descuentoSeleccionado.profesional_id}})
    },

    iconoVacio(categoria) {
      const iconos = {
        DISPONIBLE: "mdi-gift-outline",
        UTILIZADO: "mdi-check-circle-outline",
        VENCIDO: "mdi-calendar-remove-outline",
      };

      return iconos[categoria] || "mdi-tag-outline";
    },

    tituloVacio(categoria) {
      const titulos = {
        DISPONIBLE: "Todavía no tienes descuentos",
        UTILIZADO: "Aún no has utilizado descuentos",
        VENCIDO: "No tienes descuentos vencidos",
      };

      return titulos[categoria] || "Sin descuentos";
    },

    mensajeVacio(categoria) {
      const mensajes = {
        DISPONIBLE: "Cuando te asignen beneficios, aparecerán aquí.",
        UTILIZADO: "Aquí aparecerán los descuentos que utilices en tus reservas.",
        VENCIDO: "Los descuentos que superen su fecha de vigencia aparecerán aquí.",
      };

      return mensajes[categoria] || "";
    },
  },

  mounted() {
    this.cargarDescuentos();
  },
};
</script>

<style lang="scss" scoped>
.descuentos-page {
  --teal: #009b91;
  --teal-dark: #006c70;
  --teal-light: #e2f9f5;
  --text: #102653;
  --text-secondary: #526b8c;

  width: 100%;
  min-height: 100vh;
  padding: 0 12px;
  box-sizing: border-box;
  background: #ffffff;
  font-family: "Nunito", sans-serif;
  color: var(--text);
}

/* ENCABEZADO */

.page-header {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.back-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: #f0f8f8;
  color: var(--teal-dark);
}

.page-header h1 {
  flex: 1;
  margin: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
}

.header-spacer {
  width: 36px;
}

/* BANNER */

.welcome-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 168px;
  margin: 8px 0 16px;
  padding: 12px;
  overflow: hidden;
  border: 1px solid #d9f5ef;
  border-radius: 22px;
  background: linear-gradient(120deg, #e1faf6, #f4fffd);
  box-sizing: border-box;
}

.welcome-illustration {
  flex: 0 0 40%;
  height: 145px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.welcome-illustration img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.welcome-text {
  flex: 1;
  min-width: 0;
}

.welcome-text h2 {
  margin: 0;
  color: var(--teal-dark);
  font-size: 17px;
  font-weight: 900;
  line-height: 1.25;
}

.welcome-text p {
  margin: 7px 0 10px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.welcome-total {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--teal-dark);
  font-size: 10px;
  font-weight: 800;
}

/* PESTAÑAS */

.descuentos-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.tab-button {
  flex: 1;
  min-width: 0;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 5px;
  border: none;
  border-radius: 24px;
  background: #f0f4f8;
  color: #526783;
  font-family: inherit;
  font-size: 11px;
  font-weight: 800;
}

.tab-button.active {
  background: var(--teal);
  color: #ffffff;
}

.tab-count {
  font-size: 10px;
  opacity: 0.9;
}

/* TARJETAS */

.descuentos-lista {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.descuento-card {
  position: relative;
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  column-gap: 12px;
  padding: 12px;
  border: 1px solid #edf2f5;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 5px 18px rgba(20, 65, 110, 0.06);
  cursor: pointer;
}

.descuento-imagen {
  position: relative;
  width: 112px;
  height: 128px;
  overflow: hidden;
  border-radius: 13px;
  background: #e7f8f5;
}

.descuento-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imagen-placeholder,
.detalle-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--teal);
}

.descuento-etiqueta,
.detalle-etiqueta {
  position: absolute;
  top: 8px;
  left: 7px;
  padding: 6px 9px;
  border-radius: 22px;
  background: #ff525d;
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
}

.descuento-info {
  min-width: 0;
  padding-right: 10px;
}

.descuento-info h3 {
  margin: 3px 0 5px;
  color: var(--text);
  font-size: 14px;
  line-height: 1.3;
  font-weight: 900;
}

.descuento-titulo {
  margin: 0 0 2px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.3;
}

.profesional-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 11px;
}

.descuento-descripcion {
  display: -webkit-box;
  margin: 6px 0;
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 10px;
  line-height: 1.35;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.precios {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  margin-top: 1px;
}

.precio-original {
  padding-top: 4px;
  color: #8995a7;
  font-size: 11px;
  text-decoration: line-through;
}

.precio-final {
  color: var(--teal-dark);
  font-size: 17px;
  font-weight: 900;
}

.precio-pendiente {
  color: #8a6b32;
  font-size: 10px;
  font-weight: 700;
}

.card-arrow {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  color: #315684;
}

.descuento-footer {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 13px;
  padding-top: 11px;
  border-top: 1px solid #edf2f5;
}

.footer-dato {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--teal);
}

.footer-dato div {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 3px;
}

.footer-dato small {
  color: #8997a9;
  font-size: 10px;
}

.footer-dato strong {
  overflow-wrap: anywhere;
  color: var(--text);
  font-size: 10px;
}

/* ESTADOS VACÍOS */

.estado-contenido,
.sin-descuentos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 42px 20px;
  text-align: center;
}

.estado-contenido p,
.sin-descuentos p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.sin-descuentos h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}

.sin-descuentos-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: var(--teal-light);
  color: var(--teal);
}

.boton-reintentar {
  padding: 10px 16px;
  border-radius: 22px;
  background: var(--teal);
  color: #ffffff;
  font-weight: 800;
}

/* AYUDA */

.ayuda-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
  padding: 15px;
  border-radius: 18px;
  background: #e5f9f5;
  color: var(--teal-dark);
}

.ayuda-banner h3 {
  margin: 0 0 5px;
  font-size: 13px;
  font-weight: 900;
}

.ayuda-banner p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.5;
}

/* DETALLE */

.detalle-page {
  margin-top: 8px;
  overflow: hidden;
  border: 1px solid #edf2f5;
  border-radius: 21px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(20, 65, 110, 0.05);
}

.detalle-imagen {
  position: relative;
  height: 230px;
  overflow: hidden;
  background: #e7f8f5;
}

.detalle-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detalle-etiqueta {
  top: 15px;
  left: 15px;
  padding: 9px 15px;
  font-size: 15px;
}

.detalle-contenido {
  padding: 17px 14px;
}

.detalle-contenido>h2 {
  margin: 0;
  color: var(--text);
  font-size: 21px;
  line-height: 1.3;
  font-weight: 900;
}

.detalle-descripcion {
  margin: 8px 0 16px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.detalle-bloque {
  margin-top: 13px;
  padding: 14px;
  border: 1px solid #edf2f5;
  border-radius: 16px;
}

.detalle-bloque h3 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 13px;
  color: var(--text);
  font-size: 13px;
  font-weight: 900;
}

.detalle-bloque h3 .v-icon {
  color: var(--teal);
}

.detalle-nombre {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
}

.detalle-fila {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-top: 1px solid #f0f3f6;
  font-size: 12px;
}

.detalle-fila:first-of-type {
  border-top: none;
}

.detalle-fila span {
  color: var(--text-secondary);
}

.detalle-fila strong {
  text-align: right;
  overflow-wrap: anywhere;
}

.codigo-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border: 1px dashed #75d9cf;
  border-radius: 12px;
  background: #f0fcf9;
  color: var(--teal-dark);
  font-size: 13px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.copiar-button {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #d8f5ef;
  color: var(--teal-dark);
}

.detalle-aviso {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 14px;
  padding: 13px;
  border-radius: 14px;
  background: #eaf9fc;
  color: #168da5;
}

.detalle-aviso p {
  margin: 0;
  color: #426987;
  font-size: 11px;
  line-height: 1.5;
}

/* AGENDAR */

.btn-agendar {
  width: 100%;
  height: 47px;

  margin-top: 30px;

  border: none;
  border-radius: 9px;

  background: #0f9999;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: 0 3px 8px rgba(15, 153, 153, .18);

  transition:
    background .2s ease,
    transform .15s ease;
}

.btn-agendar:hover {
  background: #0c8989;
}

.btn-agendar:active {
  transform: scale(.98);
}

/* NAVEGACIÓN INFERIOR */

.bottom-space {
  height: 86px;
}

@media (max-width: 360px) {
  .descuentos-page {
    padding-right: 9px;
    padding-left: 9px;
  }

  .page-header h1 {
    font-size: 16px;
  }

  .welcome-banner {
    min-height: 155px;
    padding: 9px;
  }

  .welcome-illustration {
    flex-basis: 37%;
    height: 132px;
  }

  .welcome-text h2 {
    font-size: 15px;
  }

  .welcome-text p {
    font-size: 11px;
  }

  .tab-button {
    gap: 3px;
    padding: 7px 3px;
    font-size: 10px;
  }

  .descuento-card {
    grid-template-columns: 96px minmax(0, 1fr);
    column-gap: 9px;
    padding: 9px;
    border-radius: 17px;
  }

  .descuento-imagen {
    width: 96px;
    height: 116px;
  }

  .descuento-info h3 {
    font-size: 12px;
  }

  .descuento-titulo,
  .profesional-info {
    font-size: 10px;
  }

  .precio-final {
    font-size: 15px;
  }

  .footer-dato {
    gap: 4px;
  }

  .footer-dato strong {
    font-size: 9px;
  }

  .detalle-imagen {
    height: 205px;
  }
}

/* TARJETA DEL PROFESIONAL */

.profesional-card {
  margin-top: 13px;
  padding: 14px;
  border: 1px solid #dcefeb;
  border-radius: 18px;
  background: linear-gradient(145deg, #f4fcfa, #ffffff);
}

.profesional-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: var(--teal);
}

.profesional-card-header h3 {
  margin: 0;
  color: var(--text);
  font-size: 13px;
  font-weight: 900;
}

.profesional-card-body {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.profesional-foto-wrapper {
  flex: 0 0 72px;
  width: 72px;
  height: 72px;
}

.profesional-avatar {
  display: block;
  width: 72px;
  height: 72px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  box-shadow: 0 3px 10px rgba(0, 143, 155, 0.14);
}

.profesional-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #dff7f2;
  color: var(--teal);
}

.profesional-datos {
  flex: 1;
  min-width: 0;
}

.profesional-datos h4 {
  margin: 2px 0 4px;
  color: var(--text);
  font-size: 14px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.profesional-especialidad {
  margin: 0 0 9px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.4;
}

.profesional-dato {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 7px;
  color: var(--teal-dark);
  font-size: 11px;
  line-height: 1.4;
}

.profesional-dato .v-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.profesional-dato a {
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.profesional-dato span {
  color: var(--text-secondary);
  overflow-wrap: anywhere;
}

.profesional-descripcion {
  margin: 13px 0 0;
  padding-top: 11px;
  border-top: 1px solid #e7f1ef;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
</style>
