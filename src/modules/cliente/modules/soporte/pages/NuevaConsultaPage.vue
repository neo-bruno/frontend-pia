<template>
<div class="nueva-consulta-page">
  <!-- PRESENTACIÓN -->
  <section class="consulta-presentacion">
    <div class="presentacion-icono">
      <v-icon size="43" color="white">
        mdi-message-processing-outline
      </v-icon>
    </div>

    <div class="presentacion-texto">
      <h1>Nueva consulta</h1>
      <p>
        Cuéntanos qué sucede y nuestro equipo
        podrá ayudarte.
      </p>
    </div>
  </section>

  <!-- FORMULARIO -->
  <form class="consulta-formulario" @submit.prevent="enviarConsulta">

    <!-- CATEGORÍA -->
    <div class="campo-grupo">
      <label for="categoria">Categoría <span>*</span></label>

      <v-select id="categoria" v-model="form.categoria_id" :items="categorias" item-title="nombre" item-value="id" placeholder="Selecciona una categoría" variant="outlined" density="comfortable" hide-details="auto" :loading="cargandoCategorias" :disabled="cargandoCategorias || enviando" :error-messages="errores.categoria_id" class="campo-select">
        <template #prepend-inner>
          <v-icon color="#008f9b">
            {{ iconoCategoria }}
          </v-icon>
        </template>
      </v-select>
    </div>

    <!-- ASUNTO -->
    <div class="campo-grupo">
      <label for="asunto">Asunto <span>*</span></label>

      <v-text-field id="asunto" v-model="form.asunto" placeholder="Ej. No puedo reprogramar mi cita" variant="outlined" density="comfortable" maxlength="200" hide-details="auto" :disabled="enviando" :error-messages="errores.asunto" class="campo-input" />
    </div>

    <!-- DESCRIPCIÓN -->
    <div class="campo-grupo">
      <label for="descripcion">Descripción <span>*</span></label>

      <v-textarea id="descripcion" v-model="form.mensaje" placeholder="Describe tu problema o consulta..." variant="outlined" rows="5" auto-grow maxlength="500" counter hide-details="auto" :disabled="enviando" :error-messages="errores.mensaje" class="campo-textarea" />
    </div>

    <!-- ARCHIVO -->
    <div class="campo-grupo evidencia-grupo">
      <label class="evidencia-label">
        <v-icon color="#008f9b" size="23">
          mdi-image-outline
        </v-icon>
        Adjuntar evidencia
        <span class="opcional">(opcional)</span>
      </label>

      <input ref="inputArchivo" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" hidden @change="seleccionarArchivo" />

      <button type="button" class="evidencia-zona" :class="{ 'archivo-seleccionado': archivo }" :disabled="enviando" @click="$refs.inputArchivo.click()">
        <template v-if="!archivo">
          <v-icon size="39" color="#536b86">
            mdi-cloud-upload-outline
          </v-icon>

          <strong>Selecciona un archivo</strong>

          <span>
            JPG, PNG, WEBP o PDF – máximo 5 MB
          </span>
        </template>

        <template v-else>
          <v-icon size="34" color="#008f9b">
            {{ esPdf?"mdi-file-pdf-box" : "mdi-image-check" }}
          </v-icon>

          <strong class="archivo-nombre">
            {{ archivo.name }}
          </strong>

          <span>
            {{ formatoTamano(archivo.size) }}
            · Toca para cambiar
          </span>
        </template>
      </button>

      <button v-if="archivo" type="button" class="quitar-archivo" :disabled="enviando" @click="quitarArchivo">
        <v-icon size="16">mdi-close-circle-outline</v-icon>
        Quitar archivo
      </button>

    </div>

    <!-- ENVIAR -->
    <button type="submit" class="boton-enviar" :disabled="enviando || cargandoCategorias">
      <v-progress-circular v-if="enviando" indeterminate size="20" width="2" color="white" />

      <template v-else>
        <v-icon size="23">mdi-send-outline</v-icon>
        Enviar consulta
      </template>
    </button>
  </form>

  <!-- MIS CONSULTAS -->
  <button type="button" class="mis-consultas-card" @click="irAMisConsultas">
    <div class="mis-consultas-icono">
      <v-icon size="32" color="#008f9b">
        mdi-format-list-bulleted
      </v-icon>
    </div>

    <div class="mis-consultas-texto">
      <h3>Mis consultas</h3>
      <p>Consulta el estado de tus solicitudes.</p>
    </div>

    <v-icon color="#006e7a" size="27">
      mdi-chevron-right
    </v-icon>
  </button>

  <div class="espacio-inferior"></div>

</div>
</template>


<script>
import {
  getSupportCategories,
  createSupportTicket,
} from "../services/soporte.api";

import { piaAlert } from "@/services/piaAlert";

export default {
  name: "NuevaConsultaPage",

  data() {
    return {
      categorias: [],
      cargandoCategorias: false,
      enviando: false,

      archivo: null,

      form: {
        categoria_id: null,
        asunto: "",
        mensaje: "",
      },

      errores: {
        categoria_id: "",
        asunto: "",
        mensaje: "",
      },
    };
  },

  computed: {
    iconoCategoria() {
      const categoria = this.categorias.find(
        (item) => Number(item.id) === Number(this.form.categoria_id)
      );

      return categoria?.icono || "mdi-shape-outline";
    },

    esPdf() {
      return this.archivo?.type === "application/pdf";
    },
  },

  methods: {
    async cargarCategorias() {
      this.cargandoCategorias = true;

      try {
        const respuesta = await getSupportCategories();

        this.categorias = Array.isArray(respuesta.data?.data)
          ? respuesta.data.data
          : [];

        if (!this.categorias.length) {
          piaAlert.info("Todavía no hay categorías de ayuda disponibles.");
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);

        piaAlert.error(
          error.response?.data?.message ||
          "No se pudieron cargar las categorías de ayuda."
        );
      } finally {
        this.cargandoCategorias = false;
      }
    },

    seleccionarArchivo(evento) {
      const archivo = evento.target.files?.[0];

      if (!archivo) return;

      const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      if (!tiposPermitidos.includes(archivo.type)) {
        this.archivo = null;
        evento.target.value = "";

        piaAlert.warning(
          "Solo puedes adjuntar imágenes JPG, PNG, WEBP o documentos PDF."
        );

        return;
      }

      if (archivo.size > 5 * 1024 * 1024) {
        this.archivo = null;
        evento.target.value = "";

        piaAlert.warning(
          "El archivo supera el tamaño máximo permitido de 5 MB."
        );

        return;
      }

      this.archivo = archivo;
    },

    quitarArchivo() {
      this.archivo = null;

      if (this.$refs.inputArchivo) {
        this.$refs.inputArchivo.value = "";
      }
    },

    formatoTamano(bytes) {
      return bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(0)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },

    validarFormulario() {
      this.errores = {
        categoria_id: "",
        asunto: "",
        mensaje: "",
      };

      let valido = true;

      if (!this.form.categoria_id) {
        this.errores.categoria_id = "Selecciona una categoría.";
        valido = false;
      }

      if (!this.form.asunto.trim()) {
        this.errores.asunto = "El asunto es obligatorio.";
        valido = false;
      }

      if (!this.form.mensaje.trim()) {
        this.errores.mensaje = "Describe tu consulta.";
        valido = false;
      }

      if (this.form.mensaje.trim().length > 500) {
        this.errores.mensaje = "Máximo 500 caracteres.";
        valido = false;
      }

      if (!valido) {
        piaAlert.warning(
          "Revisa los campos obligatorios antes de enviar tu consulta."
        );
      }

      return valido;
    },

    async enviarConsulta() {
      if (this.enviando) return;

      if (!this.validarFormulario()) return;

      this.enviando = true;

      try {
        const datos = {
          categoria_id: this.form.categoria_id,
          asunto: this.form.asunto.trim(),
          mensaje: this.form.mensaje.trim(),
        };

        let respuesta;

        if (this.archivo) {
          const formData = new FormData();

          Object.entries(datos).forEach(([clave, valor]) => {
            formData.append(clave, valor);
          });

          // IMPORTANTE: debe coincidir con upload.array("archivos", 5)
          formData.append("archivos", this.archivo);

          respuesta = await createSupportTicket(formData);
        } else {
          respuesta = await createSupportTicket(datos);
        }       

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.message || "No se pudo registrar la consulta."
          );
        }

        this.form = {
          categoria_id: null,
          asunto: "",
          mensaje: "",
        };

        this.quitarArchivo();

        this.errores = {
          categoria_id: "",
          asunto: "",
          mensaje: "",
        };

        piaAlert.success(
          respuesta.data?.message ||
          "Tu consulta fue enviada correctamente."
        );

      } catch (error) {
        console.error("Error al enviar consulta:", error);

        piaAlert.error(
          error.response?.data?.message ||
          error.message ||
          "No se pudo enviar tu consulta. Inténtalo nuevamente."
        );
      } finally {
        this.enviando = false;
        this.$router.go(-1)
      }
    },

    irAMisConsultas() {
      this.$router.push({
        name: "cliente-soporte-consultas",
      });
    },
  },

  mounted() {
    this.cargarCategorias();
  },
};
</script>


<style lang="scss" scoped>
.nueva-consulta-page {
  width: 100%;
  min-height: 100%;
  padding: 18px 15px 0;
  box-sizing: border-box;
  background: #fff;
  color: #102653;
  font-family: "Nunito", sans-serif;
}

.consulta-presentacion {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.presentacion-icono {
  flex: 0 0 82px;
  width: 82px;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(145deg, #00a49e, #007e83);
}

.presentacion-texto {
  flex: 1;
  min-width: 0;

  h1 {
    margin: 0 0 5px;
    font-size: 23px;
    line-height: 1.2;
    font-weight: 900;
    color: #102653;
  }

  p {
    margin: 0;
    color: #405675;
    font-size: 14px;
    line-height: 1.45;
  }
}

.consulta-formulario {
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.campo-grupo {
  display: flex;
  flex-direction: column;
  gap: 7px;

  >label {
    font-size: 15px;
    font-weight: 900;
    color: #102653;

    span {
      color: #e53935;
    }
  }
}

.campo-select,
.campo-input,
.campo-textarea {
  :deep(.v-field) {
    border-radius: 12px;
    background: #fff;
  }

  :deep(.v-field__outline) {
    color: #c9d5e2;
  }

  :deep(.v-field--focused .v-field__outline) {
    color: #008f9b;
  }

  :deep(input),
  :deep(textarea) {
    font-family: "Nunito", sans-serif;
    font-size: 14px;
    color: #183653;
  }
}

.campo-textarea {
  :deep(textarea) {
    min-height: 112px;
  }

  :deep(.v-counter) {
    color: #405675;
    font-size: 12px;
  }
}

.evidencia-grupo {
  margin-top: 1px;
}

.evidencia-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px !important;

  .opcional {
    color: #60738b;
    font-size: 12px;
    font-weight: 500;
  }
}

.evidencia-zona {
  width: 100%;
  min-height: 132px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 15px;
  border: 2px dashed #b7c8d9;
  border-radius: 16px;
  background: #fff;
  color: #344b67;
  cursor: pointer;

  strong {
    font-size: 13px;
    font-weight: 800;
  }

  span {
    font-size: 12px;
    text-align: center;
  }

  &.archivo-seleccionado {
    border-color: #008f9b;
    background: #effaf8;
  }
}

.archivo-nombre {
  max-width: 100%;
  overflow-wrap: anywhere;
}

.quitar-archivo {
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  color: #d43e45;
  font-size: 12px;
  font-weight: 800;
}

.boton-enviar {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  margin-top: 1px;
  border: none;
  border-radius: 35px;
  background: linear-gradient(110deg, #009b98, #007e7d);
  color: white;
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(0, 143, 155, 0.13);

  &:disabled {
    opacity: 0.65;
  }
}

.mis-consultas-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 29px;
  padding: 16px 13px;
  border: none;
  border-radius: 19px;
  background: #e2f8f7;
  text-align: left;
}

.mis-consultas-icono {
  flex: 0 0 59px;
  width: 59px;
  height: 59px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #bdf1eb;
}

.mis-consultas-texto {
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 4px;
    color: #102653;
    font-size: 15px;
    font-weight: 900;
  }

  p {
    margin: 0;
    color: #385675;
    font-size: 12px;
    line-height: 1.4;
  }
}

.espacio-inferior {
  height: 95px;
}

@media (min-width: 768px) {
  .nueva-consulta-page {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
