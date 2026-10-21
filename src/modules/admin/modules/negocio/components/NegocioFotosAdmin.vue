<template>
<div class="fotos-admin">
  <header class="encabezado">    
    <button class="back-button" @click="volver">
      <v-icon size="21">mdi-arrow-left</v-icon>
    </button>
    <div>
      <h1>Fotos del negocio</h1>
      <p>Organiza las imágenes de tu galería.</p>
    </div>
  </header>

  <div class="aviso">
    <v-icon>mdi-information-outline</v-icon>
    <p>Arrastra las fotos para cambiar su posición. La foto principal se destaca en tu galería.</p>
  </div>

  <section class="resumen">
    <v-icon size="30">mdi-image-multiple-outline</v-icon>
    <div class="resumen-info">
      <strong>Galería del negocio</strong>
      <span>{{ fotos.length }} de 5 fotos</span>
      <v-progress-linear :model-value="fotos.length * 20" color="teal" rounded height="6" />
    </div>
  </section>

  <input ref="selectorFotos" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden @change="seleccionarFotos" />

  <button v-if="fotos.length < 5" class="zona-subida" :disabled="subiendo" @click="$refs.selectorFotos.click()">
    <v-progress-circular v-if="subiendo" indeterminate color="teal" />
    <v-icon v-else size="34">mdi-image-plus-outline</v-icon>
    <strong>{{ subiendo?"Subiendo fotos..." : "Agregar fotos" }}</strong>
    <span>JPG, PNG o WEBP · Máximo 20 MB por foto</span>
  </button>

  <div v-if="cargando" class="estado">
    <v-progress-circular indeterminate color="teal" />
    Cargando galería...
  </div>
        
    <Draggable
      v-else-if="fotos.length"
      v-model="fotos"
      item-key="negocio_archivo_id"
      handle=".asa-arrastre"
      :animation="200"
      @end="guardarOrden"
    >
      <template #item="{ element: foto, index }">
        <article class="foto-card">
          <div class="asa-arrastre" title="Arrastrar para cambiar el orden">
            <v-icon>mdi-drag-vertical</v-icon>
          </div>

          <div class="numero" :class="{ principal: esPrincipal(foto) }">
            {{ index + 1 }}
          </div>

          <button
            class="miniatura"
            @click="abrirVisor(foto)"
            :aria-label="`Ver foto ${index + 1}`"
          >
            <img
              :src="urlImagen(foto.url)"
              :alt="foto.nombre || `Foto ${index + 1}`"
            />
          </button>

          <div class="datos-foto">
            <strong>{{ foto.nombre || `Foto ${index + 1}` }}</strong>

            <span v-if="esPrincipal(foto)" class="etiqueta-principal">
              <v-icon size="14">mdi-star</v-icon>
              Foto principal
            </span>

            <button
              v-else
              class="boton-principal"
              :disabled="procesandoId === foto.negocio_archivo_id"
              @click="hacerPrincipal(foto)"
            >
              <v-icon size="16">mdi-star-outline</v-icon>
              Hacer principal
            </button>
          </div>

          <div class="acciones">
            <button @click="abrirVisor(foto)" aria-label="Ver foto">
              <v-icon>mdi-eye-outline</v-icon>
            </button>

            <button
              class="eliminar"
              :disabled="procesandoId === foto.negocio_archivo_id"
              @click="confirmarEliminar(foto)"
              aria-label="Eliminar foto"
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </article>
      </template>
    </Draggable>
    
    <div v-else-if="!cargando" class="vacio">
      <v-icon size="44">mdi-image-multiple-outline</v-icon>
      <strong>Aún no tienes fotos</strong>
      <span>Agrega imágenes de tu negocio para mostrarlas a tus clientes.</span>
    </div>
  </div>


  
<v-dialog
  v-model="dialogVisor"
  fullscreen
  transition="fade-transition"
  :scrim="true"
>
  <v-card class="visor-foto">
    <!-- Barra superior -->
    <header class="visor-header">
      <div class="visor-titulo">
        <v-icon color="white" size="20">mdi-image-outline</v-icon>

        <div>
          <strong>{{ fotoVisor?.nombre || "Foto del negocio" }}</strong>
          <span>Vista previa</span>
        </div>
      </div>

      <v-btn
        icon="mdi-close"
        variant="tonal"
        color="white"
        size="42"
        aria-label="Cerrar visor"
        @click="dialogVisor = false"
      />
    </header>

    <!-- Fotografía -->
    <main class="visor-imagen">
      <img
        v-if="fotoVisor"
        :src="urlImagen(fotoVisor.url)"
        :alt="fotoVisor.nombre || 'Foto del negocio'"
        class="imagen-grande"
      />
    </main>

    <!-- Pie -->
    <footer class="visor-footer">
      <v-icon size="18">mdi-magnify-plus-outline</v-icon>
      <span>Vista ampliada de la fotografía</span>
    </footer>
  </v-card>
</v-dialog>


</template>

<script>
import {
  url
} from "@/utils/config";
import {
  listarArchivosNegocio,
  subirFotosNegocio,
  establecerFotoPrincipal,
  cambiarOrdenArchivoNegocio,
  eliminarArchivoNegocio,
} from "../services/negocioArchivo.api";
import Draggable from "vuedraggable";

const MAX_FOTOS = 5;
const MAX_BYTES = 20 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

export default {
  name: "FotosAdminPage",
  
  components:{
    Draggable,
  },

  data() {
    return {
      fotos: [],
      cargando: false,
      subiendo: false,
      procesandoId: null,
      arrastrandoId: null,
      dialogVisor: false,
      fotoVisor: null,
    };
  },

  mounted() {
    this.cargarFotos();
  },

  methods: {
    
    async guardarOrden() {
      const ordenAnterior = [...this.fotos];

      try {
        for (let i = 0; i < this.fotos.length; i++) {
          await cambiarOrdenArchivoNegocio(
            this.fotos[i].negocio_archivo_id,
            i + 1,
          );
        }

        await this.cargarFotos();
        this.notificar("Orden de las fotos actualizado.", "success");
      } catch (error) {
        this.fotos = ordenAnterior;

        this.notificar(
          error.friendlyMessage || "No se pudo guardar el orden de las fotos.",
          "error",
        );

        await this.cargarFotos();
      }
    },

    async cargarFotos() {
      this.cargando = true;

      try {
        const respuesta = await listarArchivosNegocio();
        const data = respuesta.data?.data?? respuesta.data;
        this.fotos = (Array.isArray(data)?data : [])
          .filter((archivo) => archivo.tipo === "FOTO")
          .sort((a, b) => Number(a.orden) - Number(b.orden));
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo cargar la galería.",
          "error",
        );
      } finally {
        this.cargando = false;
      }
    },

    async seleccionarFotos(evento) {
      const archivos = Array.from(evento.target.files || []);
      evento.target.value = "";

      if (!archivos.length) return;

      const disponibles = MAX_FOTOS - this.fotos.length;

      if (archivos.length > disponibles) {
        this.notificar(`Solo puedes agregar ${disponibles} foto(s) más.`, "warning");
        return;
      }

      for (const archivo of archivos) {
        if (!TIPOS.includes(archivo.type)) {
          this.notificar(`El archivo ${archivo.name} no es un formato permitido.`, "error");
          return;
        }

        if (archivo.size > MAX_BYTES) {
          this.notificar(`${archivo.name} supera los 20 MB.`, "error");
          return;
        }
      }

      this.subiendo = true;

      try {
        await subirFotosNegocio(archivos);
        await this.cargarFotos();
        this.notificar("Las fotos se subieron correctamente.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudieron subir las fotos.",
          "error",
        );
      } finally {
        this.subiendo = false;
      }
    },

    esPrincipal(foto) {
      return foto.principal === true ||
        foto.principal === "t" ||
        foto.principal === 1;
    },

    async hacerPrincipal(foto) {
      const id = foto.negocio_archivo_id;
      this.procesandoId = id;

      try {
        await establecerFotoPrincipal(id);
        await this.cargarFotos();
        this.notificar("Foto principal actualizada.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo establecer la foto principal.",
          "error",
        );
      } finally {
        this.procesandoId = null;
      }
    },

    iniciarArrastre(evento, foto) {
      this.arrastrandoId = foto.negocio_archivo_id;
      evento.dataTransfer.effectAllowed = "move";
      evento.dataTransfer.setData("text/plain", String(foto.negocio_archivo_id));
    },

    async soltarFoto(evento, destino) {
      const idOrigen = Number(evento.dataTransfer.getData("text/plain"));
      const idDestino = destino.negocio_archivo_id;

      this.arrastrandoId = null;

      if (!idOrigen || idOrigen === idDestino) return;

      const copia = [...this.fotos];
      const origenIndex = copia.findIndex(
        (foto) => foto.negocio_archivo_id === idOrigen,
      );
      const destinoIndex = copia.findIndex(
        (foto) => foto.negocio_archivo_id === idDestino,
      );

      if (origenIndex < 0 || destinoIndex < 0) return;

      const [movida] = copia.splice(origenIndex, 1);
      copia.splice(destinoIndex, 0, movida);

      const anterior = this.fotos;
      this.fotos = copia;

      try {
        // Guardar el orden consecutivo en el backend.
        for (let i = 0; i < copia.length; i++) {
          await cambiarOrdenArchivoNegocio(
            copia[i].negocio_archivo_id,
            i + 1,
          );
        }

        await this.cargarFotos();
        this.notificar("Orden de las fotos actualizado.", "success");
      } catch (error) {
        this.fotos = anterior;
        this.notificar(
          error.friendlyMessage || "No se pudo guardar el nuevo orden.",
          "error",
        );
        await this.cargarFotos();
      }
    },

    async confirmarEliminar(foto) {
      const confirmar = await this.$piaAlert.confirm({
        title: "Quitar foto",
        message: `¿Deseas quitar "${foto.nombre || "esta foto"}" de la galería?`,
        confirmText: "Sí, quitar",
        cancelText: "Cancelar",
      });

      if (confirmar !== true) return;

      this.procesandoId = foto.negocio_archivo_id;

      try {
        await eliminarArchivoNegocio(foto.negocio_archivo_id);
        await this.cargarFotos();
        this.notificar("Foto quitada de la galería.", "success");
      } catch (error) {
        this.notificar(
          error.friendlyMessage || "No se pudo eliminar la foto.",
          "error",
        );
      } finally {
        this.procesandoId = null;
      }
    },

    abrirVisor(foto) {
      this.fotoVisor = foto;
      this.dialogVisor = true;
    },

    urlImagen(ruta) {
      if (!ruta) return "";
      if (/^https?:\/\//i.test(ruta) || ruta.startsWith("blob:")) return ruta;

      const base = String(url || "")
        .replace(/\/+$/, "")
        .replace(/\/api$/i, "");

      return `${base}/${String(ruta).replace(/^\/+/, "")}`;
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

    notificar(mensaje, tipo = "info") {
      const opciones = {
        title: tipo === "success"?"Correcto" :
          tipo === "error"?"Error" :
          tipo === "warning"?"Atención" :
          "Información",
      };

      if (tipo === "success") this.$piaAlert.success(mensaje, opciones);
      else if (tipo === "error") this.$piaAlert.error(mensaje, opciones);
      else if (tipo === "warning") this.$piaAlert.warning(mensaje, opciones);
      else this.$piaAlert.info(mensaje, opciones);
    },
  },
};
</script>

<style lang="scss" scoped>
.fotos-admin {
  --teal: #079da2;
  --teal-oscuro: #087f86;
  --teal-suave: #e7f7f7;
  --texto: #17324d;
  --secundario: #71869c;
  --borde: #e4edf2;

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
  margin-bottom: 18px;
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

.encabezado h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}

.encabezado p {
  margin: 5px 0 0;
  color: var(--secundario);
  font-size: 12px;
}

.aviso,
.nota {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px;
  border-radius: 14px;
  background: #eef8fa;
  color: var(--teal-oscuro);
}

.aviso p,
.nota p {
  margin: 0;
  color: #526f85;
  font-size: 12px;
  line-height: 1.6;
}

.resumen {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  margin: 13px 0;
  border: 1px solid var(--borde);
  border-radius: 16px;
}

.resumen>.v-icon {
  color: var(--teal);
}

.resumen-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.resumen-info strong {
  font-size: 13px;
}

.resumen-info span {
  color: var(--secundario);
  font-size: 12px;
}

.zona-subida {
  width: 100%;
  min-height: 125px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 18px;
  margin-bottom: 15px;
  border: 1.5px dashed #18aeb1;
  border-radius: 16px;
  background: #f7fcfc;
  color: var(--teal);
}

.zona-subida strong {
  font-size: 15px;
}

.zona-subida span {
  color: #657d93;
  font-size: 12px;
  text-align: center;
}

.lista-fotos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.foto-card {
  display: grid;
  grid-template-columns: 20px 30px minmax(78px, 100px) minmax(0, 1fr);
  align-items: center;
  gap: 7px;
  padding: 9px;
  border: 1px solid var(--borde);
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(24, 62, 83, 0.035);
}

.foto-card.arrastrando {
  opacity: 0.5;
  border-color: var(--teal);
}

.asa-arrastre {
  color: #73879a;
  cursor: grab;
}

.numero {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8eef3;
  font-size: 13px;
  font-weight: 800;
}

.numero.principal {
  background: var(--teal);
  color: #fff;
}

.miniatura {
  width: 100%;
  height: 92px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 10px;
  background: #edf3f5;
}

.miniatura img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.datos-foto {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
}

.datos-foto>strong {
  width: 100%;
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.etiqueta-principal {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--teal-oscuro);
  font-size: 10px;
  font-weight: 700;
}

.boton-principal {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 7px;
  border: 1px solid var(--borde);
  border-radius: 8px;
  background: #fff;
  color: #496479;
  font-size: 10px;
}

.acciones {
  grid-column: 3 / 5;
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.acciones button {
  width: 36px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--borde);
  border-radius: 9px;
  background: #fff;
  color: var(--texto);
}

.acciones .eliminar {
  color: #d93645;
}

.estado,
.vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 30px 18px;
  color: var(--secundario);
  text-align: center;
  font-size: 13px;
}

.vacio {
  border: 1px dashed var(--borde);
  border-radius: 16px;
}



.visor-foto {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #101418 !important;
  color: white;
  border-radius: 0 !important;
}

.visor-header {
  flex: 0 0 auto;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: #101418;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.visor-titulo {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.visor-titulo > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.visor-titulo strong {
  max-width: 65vw;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visor-titulo span {
  color: #aebbc6;
  font-size: 11px;
}

.visor-imagen {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  background: #101418;
}

.imagen-grande {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.visor-footer {
  flex: 0 0 auto;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  color: #aebbc6;
  font-size: 11px;
  background: #101418;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}



.nota {
  margin-top: 14px;
}

@media (min-width: 600px) {
  .foto-card {
    grid-template-columns: 26px 36px 140px minmax(0, 1fr) auto;
    gap: 10px;
    padding: 12px;
  }

  .miniatura {
    height: 112px;
  }

  .acciones {
    grid-column: auto;
  }
}

@media (max-width: 380px) {
  .fotos-admin {
    padding: 12px 10px 95px;
  }

  .foto-card {
    grid-template-columns: 17px 26px minmax(72px, 88px) minmax(0, 1fr);
    gap: 5px;
    padding: 7px;
  }

  .numero {
    width: 26px;
    height: 26px;
  }

  .miniatura {
    height: 82px;
  }

  .acciones button {
    width: 32px;
    height: 31px;
  }
}

.asa-arrastre {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.asa-arrastre:active {
  cursor: grabbing;
}

.foto-ghost {
  opacity: 0.35;
  background: #e7f7f7;
  border: 2px dashed #079da2;
}

.foto-arrastrando {
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(0, 120, 125, 0.18);
}
</style>
