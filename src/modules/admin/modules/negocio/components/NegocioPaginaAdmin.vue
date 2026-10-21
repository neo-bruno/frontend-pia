<template>
<div class="pagina-negocio">
  <!-- Encabezado -->
  <header class="encabezado">    
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>

    <div class="encabezado-texto">
      <h1>Página del negocio</h1>
      <p>{{ descripcionPestana }}</p>
    </div>
  </header>

  <!-- Pestañas -->
  <nav class="pestanas" aria-label="Secciones de la página">
    <button v-for="pestana in pestanas" :key="pestana.id" type="button" class="pestana" :class="{ activa: seccion === pestana.id }" @click="seccion = pestana.id">
      <v-icon size="18">{{ pestana.icono }}</v-icon>
      <span>{{ pestana.nombre }}</span>
    </button>
  </nav>

  <div v-if="cargando" class="estado-carga">
    <v-progress-circular indeterminate color="teal" size="32" />
    <span>Cargando página del negocio...</span>
  </div>

  <template v-else>
    <!-- ================================================= -->
    <!-- INFORMACIÓN -->
    <!-- ================================================= -->
    <section v-if="seccion === 'informacion'" class="seccion">
      <!-- Portada y logo -->
      <article class="tarjeta-identidad">
        <div class="portada">
          <img v-if="portadaVista" :src="portadaVista" alt="Portada del negocio" class="imagen-portada" />

          <div v-else class="portada-vacia">
            <v-icon size="42">mdi-store-outline</v-icon>
            <strong>Portada del negocio</strong>
            <span>Una buena imagen presenta tu negocio</span>
          </div>

          <button class="boton-cambiar-portada" type="button" :disabled="subiendoImagen" @click="abrirSelector('portada')">
            <v-icon size="18">mdi-camera-outline</v-icon>
            <span>{{ portadaVista?'Cambiar portada' : 'Agregar portada' }}</span>
          </button>
        </div>

        <div class="identidad-contenido">
          <div class="logo-wrapper">
            <img v-if="logoVista" :src="logoVista" alt="Logo del negocio" class="imagen-logo" />

            <div v-else class="logo-vacio">
              <v-icon size="38">mdi-store-outline</v-icon>
            </div>

            <button class="boton-logo" type="button" aria-label="Cambiar logo" :disabled="subiendoImagen" @click="abrirSelector('logo')">
              <v-icon size="17">mdi-camera</v-icon>
            </button>
          </div>

          <div class="identidad-datos">
            <span class="etiqueta">TU NEGOCIO</span>
            <h2>{{ negocio.nombre || 'Nombre del negocio' }}</h2>
            <p>{{ negocio.tipo_negocio_nombre || 'Tipo de negocio' }}</p>
            <span v-if="negocio.municipio || negocio.departamento" class="ubicacion">
              <v-icon size="15">mdi-map-marker-outline</v-icon>
              {{ [negocio.municipio, negocio.departamento].filter(Boolean).join(', ') }}
            </span>
          </div>
        </div>

        <div v-if="subiendoImagen" class="progreso-imagen">
          <v-progress-linear indeterminate color="teal" rounded />
          <span>Guardando imagen...</span>
        </div>
      </article>

      <!-- Campos de presentación -->
      <article class="tarjeta-formulario">
        <div class="titulo-tarjeta">
          <span class="icono-seccion">
            <v-icon>mdi-tag-outline</v-icon>
          </span>
          <div>
            <h3>Eslogan</h3>
            <p>Una frase que represente tu negocio.</p>
          </div>
        </div>

        <v-text-field v-model="form.eslogan" placeholder="Ej. Tu belleza, nuestro compromiso" variant="outlined" density="comfortable" maxlength="250" hide-details class="campo-pia" />

        <div class="contador">{{ form.eslogan.length }}/250</div>
      </article>

      <article class="tarjeta-formulario">
        <div class="titulo-tarjeta">
          <span class="icono-seccion">
            <v-icon>mdi-text-box-outline</v-icon>
          </span>
          <div>
            <h3>Sobre nuestro negocio</h3>
            <p>Cuéntales a tus clientes qué te hace especial.</p>
          </div>
        </div>

        <v-textarea v-model="form.informacion" placeholder="Describe tus servicios, tu experiencia y lo que distingue a tu negocio..." variant="outlined" rows="5" auto-grow maxlength="5000" hide-details class="campo-pia" />

        <div class="contador">{{ form.informacion.length }}/5000</div>
      </article>

      <article class="tarjeta-formulario">
        <div class="titulo-tarjeta">
          <span class="icono-seccion">
            <v-icon>mdi-lightbulb-outline</v-icon>
          </span>
          <div>
            <h3>Recomendación para tus clientes</h3>
            <p>Comparte un consejo antes de reservar.</p>
          </div>
        </div>

        <v-textarea v-model="form.recomendacion" placeholder="Ej. Reserva tu cita con anticipación para asegurar tu horario favorito." variant="outlined" rows="2" auto-grow maxlength="250" hide-details class="campo-pia" />

        <div class="contador">{{ form.recomendacion.length }}/250</div>
      </article>

      <button class="boton-guardar" type="button" :disabled="guardando" @click="guardarPresentacion">
        <v-progress-circular v-if="guardando" indeterminate size="19" width="2" />
        <v-icon v-else>mdi-content-save-outline</v-icon>
        {{ guardando?'Guardando cambios...' : 'Guardar cambios' }}
      </button>
    </section>

    <!-- ================================================= -->
    <!-- ESPECIALIDADES -->
    <!-- ================================================= -->
    <section v-else-if="seccion === 'especialidades'" class="seccion">
      <article class="tarjeta-intro">
        <div class="intro-icono">
          <v-icon size="25">mdi-shape-outline</v-icon>
        </div>
        <div>
          <h3>Especialidades de tu negocio</h3>
          <p>
            Destaca los tratamientos y servicios por los que tus clientes
            pueden encontrarte en PIA.
          </p>
        </div>
      </article>

      <div class="busqueda-especialidad">
        <v-text-field v-model="busquedaEspecialidad" placeholder="Buscar especialidad..." prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" hide-details clearable class="campo-pia" />
        <button type="button" class="boton-agregar" @click="abrirFormularioEspecialidad()">
          <v-icon>mdi-plus</v-icon>
          <span>Agregar</span>
        </button>
      </div>

      <div v-if="cargandoEspecialidades" class="estado-vacio">
        <v-progress-circular indeterminate color="teal" size="28" />
        <span>Cargando especialidades...</span>
      </div>

      <div v-else-if="especialidadesFiltradas.length" class="lista-especialidades">
        <article v-for="especialidad in especialidadesFiltradas" :key="especialidad.id" class="especialidad-item">
          <div class="especialidad-icono">
            <v-icon>{{ iconoEspecialidad(especialidad) }}</v-icon>
          </div>

          <div class="especialidad-datos">
            <strong>{{ especialidad.nombre }}</strong>
            <span class="estado-especialidad" :class="estadoActivo(especialidad)?'estado-activo' : 'estado-inactivo'">
              {{ estadoActivo(especialidad)?'ACTIVO' : 'INACTIVO' }}
            </span>
          </div>

          <div class="acciones-especialidad">
            <button type="button" class="boton-accion" aria-label="Editar especialidad" @click="abrirFormularioEspecialidad(especialidad)">
              <v-icon size="19">mdi-pencil-outline</v-icon>
            </button>

            <button type="button" class="boton-accion boton-eliminar" aria-label="Eliminar especialidad" @click="confirmarEliminarEspecialidad(especialidad)">
              <v-icon size="19">mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </article>
      </div>

      <div v-else class="estado-vacio">
        <v-icon size="38">mdi-shape-outline</v-icon>
        <strong>No hay especialidades</strong>
        <span>Agrega las especialidades que ofrece tu negocio.</span>
      </div>

      <div class="nota-informativa">
        <v-icon color="info" size="23">mdi-information-outline</v-icon>
        <p>
          Las especialidades activas se mostrarán en la página pública de tu
          negocio.
        </p>
      </div>
    </section>

    <!-- ================================================= -->
    <!-- VISTA PREVIA -->
    <!-- ================================================= -->
    <section v-else class="seccion vista-previa">
      <article class="tarjeta-publica">
        <div class="portada previa-portada">
          <img v-if="portadaVista" :src="portadaVista" alt="Portada del negocio" class="imagen-portada" />
          <div v-else class="portada-vacia">
            <v-icon size="40">mdi-image-outline</v-icon>
            <span>Aún no agregaste una portada</span>
          </div>
        </div>

        <div class="publica-identidad">
          <div class="logo-previa">
            <img v-if="logoVista" :src="logoVista" alt="Logo del negocio" />
            <v-icon v-else size="34">mdi-store-outline</v-icon>
          </div>
          <div class="publica-nombre">
            <h2>{{ negocio.nombre || 'Nombre del negocio' }}</h2>
            <p>{{ negocio.tipo_negocio_nombre || 'Negocio en PIA' }}</p>
            <span v-if="negocio.municipio || negocio.departamento">
              <v-icon size="14">mdi-map-marker-outline</v-icon>
              {{ [negocio.municipio, negocio.departamento].filter(Boolean).join(', ') }}
            </span>
          </div>
        </div>

        <div v-if="form.eslogan" class="eslogan-previa">
          “{{ form.eslogan }}”
        </div>

        <div class="bloque-publico">
          <h3>
            <v-icon>mdi-text-box-outline</v-icon> Sobre nosotros
          </h3>
          <p>{{ form.informacion || 'La descripción de tu negocio aparecerá aquí.' }}</p>
        </div>

        <div class="bloque-publico">
          <div class="titulo-especialidades">
            <h3>
              <v-icon>mdi-shape-outline</v-icon> Especialidades
            </h3>
            <span>{{ especialidadesActivas.length }}</span>
          </div>

          <div v-if="especialidadesActivas.length" class="especialidades-previa">
            <div v-for="especialidad in especialidadesActivas.slice(0, 6)" :key="especialidad.id" class="especialidad-previa">
              <div class="especialidad-previa-icono">
                <v-icon>{{ iconoEspecialidad(especialidad) }}</v-icon>
              </div>
              <span>{{ especialidad.nombre }}</span>
            </div>
          </div>

          <p v-else class="texto-secundario">
            Las especialidades activas aparecerán aquí.
          </p>
        </div>

        <div v-if="form.recomendacion" class="recomendacion-previa">
          <v-icon size="25">mdi-lightbulb-outline</v-icon>
          <div>
            <strong>Nuestra recomendación</strong>
            <p>{{ form.recomendacion }}</p>
          </div>
        </div>

        <button type="button" class="boton-guardar boton-reservar" @click="guardarPresentacion">
          <v-icon>mdi-calendar-check-outline</v-icon>
          Guardar y continuar
        </button>
      </article>
    </section>
  </template>

  <!-- Selectores ocultos de imágenes -->
  <input ref="selectorPortada" type="file" accept="image/jpeg,image/png,image/webp" hidden @change="seleccionarImagen($event, 'portada')" />

  <input ref="selectorLogo" type="file" accept="image/jpeg,image/png,image/webp" hidden @change="seleccionarImagen($event, 'logo')" />

  <!-- Diálogo de especialidad -->
  <v-dialog v-model="dialogEspecialidad" max-width="440" width="calc(100% - 28px)">
    <v-card class="dialog-pia">
      <div class="dialog-encabezado">
        <div>
          <h3>{{ especialidadEditando?'Editar especialidad' : 'Nueva especialidad' }}</h3>
          <p>Información que verán tus clientes.</p>
        </div>
        <v-btn icon="mdi-close" variant="text" aria-label="Cerrar" @click="dialogEspecialidad = false" />
      </div>

      <v-card-text>
        <label class="etiqueta-campo">Icono</label>
        <v-select v-model="formEspecialidad.icono" :items="opcionesIconosUnicas" item-title="nombre" item-value="valor" variant="outlined" density="comfortable" hide-details class="campo-pia mb-4">
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon>{{ item?.valor || "mdi-shape-outline" }}</v-icon>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <label class="etiqueta-campo">Nombre de la especialidad</label>
        <v-text-field v-model="formEspecialidad.nombre" placeholder="Ej. Coloración" variant="outlined" maxlength="100" density="comfortable" hide-details class="campo-pia mb-4" />

        <v-switch v-model="formEspecialidad.activa" label="Especialidad activa" color="teal" hide-details inset />
      </v-card-text>

      <div class="dialog-acciones">
        <button type="button" class="boton-secundario" @click="dialogEspecialidad = false">
          Cancelar
        </button>
        <button type="button" class="boton-guardar boton-dialog-guardar" :disabled="guardandoEspecialidad" @click="guardarEspecialidad">
          {{ guardandoEspecialidad?'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import {
  url
} from "@/utils/config";
import {
  obtenerDatosNegocio,
  actualizarPaginaNegocio,
  subirImagenesNegocio,
} from "../services/negocio.api";
import {
  listarEspecialidades,
  crearEspecialidad,
  actualizarEspecialidad,
  eliminarEspecialidad,
} from "../services/especialidad.api";

export default {
  name: "NegocioPaginaAdmin",

  data() {
    return {
      seccion: "informacion",
      cargando: true,
      guardando: false,
      subiendoImagen: false,

      negocio: {},
      form: {
        eslogan: "",
        informacion: "",
        recomendacion: "",
      },

      portadaPrevia: "",
      logoPrevia: "",
      archivoPortada: null,
      archivoLogo: null,

      especialidades: [],
      cargandoEspecialidades: false,
      busquedaEspecialidad: "",

      dialogEspecialidad: false,
      guardandoEspecialidad: false,
      especialidadEditando: null,
      formEspecialidad: {
        nombre: "",
        icono: "mdi-content-cut",
        activa: true,
      },

      pestanas: [{
          id: "informacion",
          nombre: "Información",
          icono: "mdi-clipboard-text-outline"
        },
        {
          id: "especialidades",
          nombre: "Especialidades",
          icono: "mdi-shape-outline"
        },
        {
          id: "vista",
          nombre: "Vista previa",
          icono: "mdi-eye-outline"
        },
      ],
      
      opcionesIconos: [
        // CABELLO Y BARBERÍA
        { nombre: "Corte de cabello", valor: "mdi-content-cut" },
        { nombre: "Barbería", valor: "mdi-razor-double-edge" },
        { nombre: "Barba y bigote", valor: "mdi-face-man" },
        { nombre: "Coloración", valor: "mdi-palette" },
        { nombre: "Mechas y balayage", valor: "mdi-brush" },
        { nombre: "Peinados", valor: "mdi-auto-fix" },
        { nombre: "Trenzas", valor: "mdi-ribbon" },
        { nombre: "Extensiones de cabello", valor: "mdi-hair-dryer" },
        { nombre: "Alisado y keratina", valor: "mdi-water" },
        { nombre: "Tratamientos capilares", valor: "mdi-flask-outline" },

        // MAQUILLAJE Y ROSTRO
        { nombre: "Maquillaje", valor: "mdi-lipstick" },
        { nombre: "Maquillaje para novias", valor: "mdi-diamond-stone" },
        { nombre: "Cuidado facial", valor: "mdi-face-woman-outline" },
        { nombre: "Limpieza facial", valor: "mdi-water-check-outline" },
        { nombre: "Tratamientos faciales", valor: "mdi-spa-outline" },
        { nombre: "Rejuvenecimiento facial", valor: "mdi-face-woman-shimmer" },

        // PESTAÑAS Y CEJAS
        { nombre: "Extensiones de pestañas", valor: "mdi-eye-outline" },
        { nombre: "Lifting de pestañas", valor: "mdi-eye-plus-outline" },
        { nombre: "Diseño de cejas", valor: "mdi-pencil-outline" },
        { nombre: "Laminado de cejas", valor: "mdi-eye-settings-outline" },
        { nombre: "Microblading", valor: "mdi-needle" },
        { nombre: "Micropigmentación", valor: "mdi-fountain-pen-tip" },

        // UÑAS
        { nombre: "Manicure", valor: "mdi-hand-heart-outline" },
        { nombre: "Pedicure", valor: "mdi-foot-print" },
        { nombre: "Uñas acrílicas", valor: "mdi-hand-back-right-outline" },
        { nombre: "Uñas de gel", valor: "mdi-bottle-tonic-outline" },
        { nombre: "Nail art y decoración", valor: "mdi-palette-outline" },

        // DEPILACIÓN Y ESTÉTICA
        { nombre: "Depilación", valor: "mdi-flash-outline" },
        { nombre: "Depilación con cera", valor: "mdi-fire" },
        { nombre: "Depilación láser", valor: "mdi-laser-pointer" },
        { nombre: "Tratamientos corporales", valor: "mdi-human-handsup" },
        { nombre: "Masajes", valor: "mdi-hand-heart" },
        { nombre: "Spa y bienestar", valor: "mdi-spa" },

        // OTROS
        { nombre: "Tatuajes", valor: "mdi-draw" },
        { nombre: "Piercing", valor: "mdi-diamond-outline" },
        { nombre: "Asesoría de imagen", valor: "mdi-account-star-outline" },
        { nombre: "Otros servicios", valor: "mdi-star-four-points-outline" },
      ],

    };
  },

  computed: {
    descripcionPestana() {
      if (this.seccion === "especialidades") {
        return "Gestiona las especialidades que ofreces.";
      }

      if (this.seccion === "vista") {
        return "Así verán tu negocio los clientes en PIA.";
      }

      return "Personaliza cómo se mostrará tu negocio en PIA.";
    },

    portadaVista() {
      if (this.portadaPrevia) return this.portadaPrevia;
      return this.urlImagen(this.negocio.portada);
    },

    logoVista() {
      if (this.logoPrevia) return this.logoPrevia;
      return this.urlImagen(this.negocio.logo);
    },

    especialidadesFiltradas() {
      const busqueda = String(this.busquedaEspecialidad ?? "")
        .trim()
        .toLowerCase();

      return (Array.isArray(this.especialidades) ? this.especialidades : [])
        .filter((especialidad) => especialidad != null)
        .filter((especialidad) => {
          const nombre = String(especialidad.nombre ?? "")
            .trim()
            .toLowerCase();

          return nombre.includes(busqueda);
        });
    },

    especialidadesActivas() {
      return this.especialidades.filter((especialidad) =>
        this.estadoActivo(especialidad),
      );
    },
    opcionesIconosUnicas() {
      const nombres = new Set();

      return this.opcionesIconos.filter((opcion) => {
        const nombre = opcion.nombre.trim().toLowerCase();

        if (nombres.has(nombre)) {
          return false;
        }

        nombres.add(nombre);
        return true;
      });
    },
  },

  async mounted() {
    await this.cargarDatos();
    await this.cargarEspecialidades();
  },

  beforeUnmount() {
    this.liberarPrevia("portada");
    this.liberarPrevia("logo");
  },

  methods: {
    async cargarDatos() {
      this.cargando = true;

      try {
        const respuesta = await obtenerDatosNegocio();
        const data = respuesta.data?.data?? respuesta.data;

        this.negocio = data || {};
        console.log("NEGOCIO RECIBIDO:", this.negocio);
        console.log("URL PORTADA:", this.urlImagen(this.negocio.portada));
        console.log("URL LOGO:", this.urlImagen(this.negocio.logo));
        this.form = {
          eslogan: data?.eslogan || "",
          informacion: data?.informacion || "",
          recomendacion: data?.recomendacion || "",
        };
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo cargar la información del negocio.",
          "error",
        );
      } finally {
        this.cargando = false;
      }
    },

    async cargarEspecialidades() {
      this.cargandoEspecialidades = true;

      try {
        const respuesta = await listarEspecialidades();
        const data = respuesta.data?.data?? respuesta.data;

        this.especialidades = Array.isArray(data)?data : [];
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudieron cargar las especialidades.",
          "error",
        );
      } finally {
        this.cargandoEspecialidades = false;
      }
    },

    volver() {
      if (this.$router.hasRoute("negocio-admin")) {
        this.$router.push({
          name: "negocio-admin"
        });
      } else {
        this.$router.back();
      }
    },

    urlImagen(ruta) {
      if (!ruta) return "";

      if (/^https?:\/\//i.test(ruta) || ruta.startsWith("blob:")) {
        return ruta;
      }

      const base = String(url || "").replace(/\/+$/, "");
      const baseSinApi = base.replace(/\/api$/i, "");
      const rutaLimpia = String(ruta).replace(/^\/+/, "");

      return `${baseSinApi}/${rutaLimpia}`;
    },

    abrirSelector(tipo) {
      if (tipo === "portada") this.$refs.selectorPortada?.click();
      else this.$refs.selectorLogo?.click();
    },

    async seleccionarImagen(evento, tipo) {
      const archivo = evento.target.files?. [0];
      evento.target.value = "";

      if (!archivo) return;

      const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

      if (!tiposPermitidos.includes(archivo.type)) {
        this.notificar("Selecciona una imagen JPG, PNG o WEBP.", "error");
        return;
      }

      if (archivo.size > 10 * 1024 * 1024) {
        this.notificar("La imagen no puede superar los 10 MB.", "error");
        return;
      }

      this.liberarPrevia(tipo);
      const previa = URL.createObjectURL(archivo);

      if (tipo === "portada") {
        this.portadaPrevia = previa;
        this.archivoPortada = archivo;
      } else {
        this.logoPrevia = previa;
        this.archivoLogo = archivo;
      }

      await this.guardarImagenes();
    },

    liberarPrevia(tipo) {
      if (tipo === "portada" && this.portadaPrevia) {
        URL.revokeObjectURL(this.portadaPrevia);
        this.portadaPrevia = "";
      }

      if (tipo === "logo" && this.logoPrevia) {
        URL.revokeObjectURL(this.logoPrevia);
        this.logoPrevia = "";
      }
    },

    async guardarImagenes() {
      if (!this.archivoPortada && !this.archivoLogo) return;

      this.subiendoImagen = true;

      try {
        const respuesta = await subirImagenesNegocio({
          portada: this.archivoPortada,
          logo: this.archivoLogo,
        });

        const data = respuesta.data?.data;

        if (data) this.negocio = {
          ...this.negocio,
          ...data
        };

        this.archivoPortada = null;
        this.archivoLogo = null;
        this.liberarPrevia("portada");
        this.liberarPrevia("logo");

        this.notificar("Las imágenes se guardaron correctamente.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudieron guardar las imágenes.",
          "error",
        );
      } finally {
        this.subiendoImagen = false;
      }
    },

    async guardarPresentacion() {
      this.guardando = true;

      try {
        const respuesta = await actualizarPaginaNegocio({
          eslogan: this.form.eslogan,
          informacion: this.form.informacion,
          recomendacion: this.form.recomendacion,
        });

        const data = respuesta.data?.data;

        if (data) this.negocio = {
          ...this.negocio,
          ...data
        };

        this.notificar("La página del negocio se guardó correctamente.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo guardar la presentación.",
          "error",
        );
      } finally {
        this.guardando = false;
      }
    },

    abrirFormularioEspecialidad(especialidad = null) {
      this.especialidadEditando = especialidad;

      this.formEspecialidad = especialidad?{
        nombre: especialidad.nombre || "",
        icono: especialidad.icono || "mdi-content-cut",
        activa: this.estadoActivo(especialidad),
      } : {
        nombre: "",
        icono: "mdi-content-cut",
        activa: true,
      };

      this.dialogEspecialidad = true;
    },

    async guardarEspecialidad() {
      const nombre = this.formEspecialidad.nombre.trim();

      if (!nombre) {
        this.notificar("Escribe el nombre de la especialidad.", "error");
        return;
      }

      this.guardandoEspecialidad = true;

      try {
        const datos = {
          nombre,
          icono: this.formEspecialidad.icono,
          estado: this.formEspecialidad.activa?"ACTIVO" : "INACTIVO",
        };

        if (this.especialidadEditando) {
          await actualizarEspecialidad(this.especialidadEditando.id, datos);
        } else {
          await crearEspecialidad(datos);
        }

        this.dialogEspecialidad = false;
        await this.cargarEspecialidades();

        this.notificar("La especialidad se guardó correctamente.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo guardar la especialidad.",
          "error",
        );
      } finally {
        this.guardandoEspecialidad = false;
      }
    },

    async confirmarEliminarEspecialidad(especialidad) {
      const confirmar = await this.$piaAlert.confirm({
        title: "Eliminar especialidad",
        message: `¿Deseas eliminar la especialidad "${especialidad.nombre}"?`,
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
      });

      if (confirmar !== true) return;

      try {
        await eliminarEspecialidad(especialidad.id);
        await this.cargarEspecialidades();
        this.notificar("La especialidad se eliminó correctamente.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo eliminar la especialidad.",
          "error",
        );
      }
    },

    estadoActivo(especialidad) {
      return String(especialidad?.estado || "ACTIVO").toUpperCase() === "ACTIVO";
    },

    iconoEspecialidad(especialidad) {
      return especialidad?.icono || "mdi-shape-outline";
    },

    notificar(mensaje, tipo = "info") {
      const opciones = {
        title: tipo === "success" ?
          "Correcto" :
          tipo === "error" ?
          "Error" :
          tipo === "warning" ?
          "Atención" :
          "Información",
      };

      if (tipo === "success") {
        this.$piaAlert.success(mensaje, opciones);
      } else if (tipo === "error") {
        this.$piaAlert.error(mensaje, opciones);
      } else if (tipo === "warning") {
        this.$piaAlert.warning(mensaje, opciones);
      } else {
        this.$piaAlert.info(mensaje, opciones);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pagina-negocio {
  --teal: #079da2;
  --teal-oscuro: #087f86;
  --teal-suave: #e4f6f6;
  --texto: #17324d;
  --secundario: #71869c;
  --borde: #e5edf2;

  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 16px 100px;
  color: var(--texto);
}

.encabezado {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.back-button {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  border-radius: 12px;
  border: 1px solid #dcefee;
  background: #ffffff;
  color: #008b8b;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow: 0 4px 12px rgba(0, 139, 139, 0.07);
}

.encabezado-texto {
  min-width: 0;
}

.encabezado h1 {
  margin: 0;
  font-size: 23px;
  line-height: 1.25;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.encabezado p {
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--secundario);
}

.pestanas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-bottom: 18px;
}

.pestana {
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 5px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: #f4f7f9;
  color: #62778c;
  font-size: 12px;
  font-weight: 650;
  transition: background 0.2s, color 0.2s;
}

.pestana span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pestana.activa {
  background: var(--teal-suave);
  color: var(--teal-oscuro);
  border-color: #d5f0f0;
}

.seccion {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tarjeta-identidad,
.tarjeta-formulario,
.tarjeta-intro,
.tarjeta-publica {
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--borde);
  border-radius: 19px;
  box-shadow: 0 4px 18px rgba(24, 62, 83, 0.035);
}

.portada {
  position: relative;
  height: 225px;
  overflow: hidden;
  background: linear-gradient(140deg, #e3f5f4, #f3f7fa);
}

.imagen-portada {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portada-vacia {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  color: var(--teal-oscuro);
}

.portada-vacia strong {
  font-size: 15px;
}

.portada-vacia span {
  max-width: 230px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--secundario);
}

.boton-cambiar-portada {
  position: absolute;
  right: 12px;
  top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 13px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--texto);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(18, 40, 56, 0.12);
}

.identidad-contenido {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 0 18px 20px;
}

.logo-wrapper {
  position: relative;
  flex: 0 0 94px;
  width: 94px;
  height: 94px;
  margin-top: -39px;
  border-radius: 50%;
  padding: 5px;
  background: white;
  box-shadow: 0 3px 16px rgba(23, 50, 77, 0.12);
}

.imagen-logo,
.logo-vacio {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  align-items: center;
  justify-content: center;
  background: #e9f7f7;
  color: var(--teal);
}

.boton-logo {
  position: absolute;
  right: -2px;
  bottom: 0;
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  border: 3px solid #fff;
  border-radius: 50%;
  background: var(--teal);
  color: white;
}

.identidad-datos {
  flex: 1;
  min-width: 0;
  padding-top: 13px;
}

.etiqueta {
  display: block;
  margin-bottom: 3px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--teal-oscuro);
}

.identidad-datos h2 {
  overflow-wrap: anywhere;
  margin: 0;
  font-size: 19px;
  line-height: 1.3;
  font-weight: 750;
}

.identidad-datos p {
  margin: 4px 0;
  color: var(--secundario);
  font-size: 13px;
}

.ubicacion {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  color: var(--secundario);
  font-size: 12px;
}

.progreso-imagen {
  padding: 0 16px 14px;
}

.progreso-imagen span {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--secundario);
}

.tarjeta-formulario {
  padding: 17px;
}

.titulo-tarjeta {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 15px;
}

.icono-seccion,
.intro-icono {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--teal-suave);
  color: var(--teal-oscuro);
}

.titulo-tarjeta h3,
.tarjeta-intro h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 750;
}

.titulo-tarjeta p,
.tarjeta-intro p {
  margin: 4px 0 0;
  color: var(--secundario);
  font-size: 12px;
  line-height: 1.5;
}

.campo-pia {
  min-width: 0;
}

.campo-pia :deep(.v-field) {
  border-radius: 12px;
  background: #fff;
}

.campo-pia :deep(.v-field__outline) {
  --v-field-border-opacity: 0.8;
}

.campo-pia :deep(input),
.campo-pia :deep(textarea) {
  color: var(--texto);
  font-size: 13px;
  line-height: 1.55;
}

.contador {
  margin-top: 5px;
  text-align: right;
  color: var(--secundario);
  font-size: 11px;
}

.boton-guardar {
  min-height: 51px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 13px 18px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(100deg, #079ba0, #078c93);
  color: #fff;
  font-size: 14px;
  font-weight: 750;
  box-shadow: 0 6px 16px rgba(7, 153, 159, 0.18);
  transition: opacity 0.2s, transform 0.2s;
}

.boton-guardar:disabled,
.boton-agregar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.boton-guardar:not(:disabled):active {
  transform: scale(0.99);
}

.tarjeta-intro {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px;
}

.tarjeta-intro>div:last-child {
  min-width: 0;
}

.busqueda-especialidad {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 9px;
}

.boton-agregar {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 13px;
  border: 0;
  border-radius: 12px;
  background: var(--teal);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.lista-especialidades {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.especialidad-item {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border: 1px solid var(--borde);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(24, 62, 83, 0.025);
}

.especialidad-icono {
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--teal-suave);
  color: var(--teal-oscuro);
}

.especialidad-icono :deep(.v-icon) {
  font-size: 25px;
}

.especialidad-datos {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.especialidad-datos strong {
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 1.4;
}

.estado-especialidad {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.estado-activo {
  color: #187644;
  background: #ddf7e5;
}

.estado-inactivo {
  color: #5f6c78;
  background: #e9edf1;
}

.acciones-especialidad {
  display: flex;
  align-items: center;
  gap: 5px;
}

.boton-accion {
  flex: 0 0 34px;
  width: 34px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid #edf1f4;
  border-radius: 11px;
  background: #fff;
  color: var(--texto);
}

.boton-eliminar {
  color: #d43c45;
}

.nota-informativa {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
  border-radius: 14px;
  background: #f0f6f9;
}

.nota-informativa p {
  margin: 0;
  color: #60788e;
  font-size: 12px;
  line-height: 1.6;
}

.estado-carga,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 145px;
  padding: 24px;
  text-align: center;
  color: var(--secundario);
  font-size: 13px;
}

.estado-vacio strong {
  color: var(--texto);
  font-size: 14px;
}

.vista-previa {
  gap: 0;
}

.tarjeta-publica {
  border-radius: 20px;
}

.previa-portada {
  height: 205px;
}

.publica-identidad {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 17px 17px;
}

.logo-previa {
  flex: 0 0 76px;
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  overflow: hidden;
  margin-top: -30px;
  border: 4px solid white;
  border-radius: 50%;
  background: var(--teal-suave);
  color: var(--teal);
  box-shadow: 0 3px 12px rgba(23, 50, 77, 0.1);
}

.logo-previa img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.publica-nombre {
  flex: 1;
  min-width: 0;
  padding-top: 11px;
}

.publica-nombre h2 {
  overflow-wrap: anywhere;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.publica-nombre p {
  margin: 3px 0;
  color: var(--secundario);
  font-size: 13px;
}

.publica-nombre span {
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--secundario);
  font-size: 11px;
}

.eslogan-previa {
  margin: 0 16px 18px;
  padding: 13px;
  border-radius: 13px;
  background: var(--teal-suave);
  color: var(--teal-oscuro);
  text-align: center;
  font-size: 14px;
  font-weight: 750;
  line-height: 1.5;
}

.bloque-publico {
  padding: 0 17px 19px;
}

.bloque-publico h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 750;
}

.bloque-publico h3 :deep(.v-icon) {
  color: var(--teal);
}

.bloque-publico>p {
  margin: 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
  color: #536a80;
  font-size: 13px;
  line-height: 1.75;
}

.titulo-especialidades {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.titulo-especialidades h3 {
  margin: 0;
}

.titulo-especialidades>span {
  color: var(--teal);
  font-size: 12px;
  font-weight: 750;
}

.especialidades-previa {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
}

.especialidad-previa {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  text-align: center;
}

.especialidad-previa-icono {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #f0f7f9;
  color: var(--teal-oscuro);
}

.especialidad-previa span {
  overflow-wrap: anywhere;
  color: #405970;
  font-size: 11px;
  line-height: 1.4;
}

.texto-secundario {
  color: var(--secundario);
  font-size: 12px;
}

.recomendacion-previa {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin: 0 15px 17px;
  padding: 15px;
  border-radius: 15px;
  background: var(--teal-suave);
  color: var(--teal-oscuro);
}

.recomendacion-previa>div {
  min-width: 0;
}

.recomendacion-previa strong {
  font-size: 13px;
}

.recomendacion-previa p {
  margin: 5px 0 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
  color: #476e7d;
  font-size: 12px;
  line-height: 1.6;
}

.boton-reservar {
  width: calc(100% - 30px);
  margin: 0 15px 16px;
}

.dialog-pia {
  overflow: hidden;
  border-radius: 20px !important;
}

.dialog-encabezado {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 19px 19px 0;
}

.dialog-encabezado h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 750;
}

.dialog-encabezado p {
  margin: 5px 0 0;
  color: var(--secundario);
  font-size: 12px;
}

.etiqueta-campo {
  display: block;
  margin-bottom: 7px;
  color: var(--texto);
  font-size: 12px;
  font-weight: 700;
}

.dialog-acciones {
  display: flex;
  gap: 10px;
  padding: 0 19px 19px;
}

.boton-secundario {
  flex: 1;
  min-height: 46px;
  border: 1px solid var(--borde);
  border-radius: 12px;
  background: #fff;
  color: var(--texto);
  font-size: 13px;
  font-weight: 700;
}

.boton-dialog-guardar {
  flex: 1;
  min-height: 46px;
  box-shadow: none;
}

@media (min-width: 600px) {
  .pagina-negocio {
    padding: 26px 24px 70px;
  }

  .portada {
    height: 280px;
  }

  .tarjeta-formulario {
    padding: 21px;
  }

  .especialidades-previa {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 380px) {
  .pagina-negocio {
    padding: 0px;
  }

  .encabezado h1 {
    font-size: 20px;
  }

  .pestana {
    gap: 4px;
    font-size: 10px;
  }

  .pestana :deep(.v-icon) {
    font-size: 16px;
  }

  .portada {
    height: 190px;
  }

  .identidad-contenido {
    gap: 11px;
    padding-right: 12px;
    padding-left: 12px;
  }

  .logo-wrapper {
    flex-basis: 78px;
    width: 78px;
    height: 78px;
    margin-top: -31px;
  }

  .identidad-datos h2 {
    font-size: 16px;
  }

  .tarjeta-formulario {
    padding: 14px;
  }

  .especialidad-item {
    gap: 8px;
    padding: 9px;
  }

  .especialidad-icono {
    flex-basis: 41px;
    width: 41px;
    height: 41px;
  }

  .acciones-especialidad {
    gap: 3px;
  }

  .boton-accion {
    flex-basis: 30px;
    width: 30px;
  }
}
</style>
