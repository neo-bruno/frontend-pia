
<template>
  <v-container fluid class="perfil-page pa-3 pa-md-5">
    <!-- ENCABEZADO -->
    <header class="encabezado-pagina">
      <div class="encabezado-texto">
        <h1 class="titulo-pagina">Mi perfil</h1>
        <p class="subtitulo-pagina">
          Administra tus datos personales
        </p>
      </div>

      <div class="encabezado-icono">
        <v-icon size="25" color="primary">
          mdi-account-circle-outline
        </v-icon>
      </div>
    </header>

    <!-- CARGANDO -->
    <div v-if="cargando" class="d-flex justify-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="42"
      />
    </div>

    <template v-else>
      <!-- IDENTIDAD Y FOTOGRAFÍA -->
      <v-card class="tarjeta perfil-identidad mb-4" rounded="xl" flat>
        <v-card-text class="pa-4 pa-md-6">
          <div class="identidad-contenido">
            <div class="avatar-contenedor">
              <v-avatar size="112" class="avatar-perfil">
                <v-img
                  v-if="fotoPreview"
                  :src="fotoPreview?.startsWith('blob:') ? fotoPreview : getFileUrl(fotoPreview)"
                  cover
                  alt="Foto del administrador"
                />

                <v-icon v-else size="65" color="primary">
                  mdi-account
                </v-icon>
              </v-avatar>

              <v-btn
                icon="mdi-camera"
                color="primary"
                size="small"
                class="boton-camara"
                aria-label="Seleccionar foto"
                @click="abrirSelectorFoto"
              />

              <input
                ref="inputFoto"
                type="file"
                accept="image/*"
                class="d-none"
                @change="seleccionarFoto"
              />
            </div>

            <div class="identidad-datos">
              <h2 class="nombre-perfil">
                {{ formulario.nombre || "Administrador" }}
              </h2>

              <v-chip
                :color="perfil?.usuario_estado === 'HABILITADO' ? 'success' : 'warning'"
                variant="tonal"
                size="small"
                class="chip-estado"
              >
                <v-icon start size="14">mdi-circle</v-icon>
                Cuenta {{ perfil?.usuario_estado || "registrada" }}
              </v-chip>

              <div>
                <v-btn
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-camera"
                  rounded="lg"
                  size="small"
                  @click="abrirSelectorFoto"
                >
                  Cambiar foto
                </v-btn>
              </div>

              <p v-if="fotoSeleccionada" class="texto-foto-pendiente">
                La fotografía está seleccionada, pero todavía no se ha
                guardado en el servidor.
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- DATOS PERSONALES -->
      <v-card class="tarjeta mb-4" rounded="xl" flat>
        <v-card-text class="pa-4 pa-md-6">
          <div class="titulo-seccion">
            <div class="icono-seccion">
              <v-icon color="primary">mdi-account-outline</v-icon>
            </div>

            <h2>Datos personales</h2>
          </div>

          <v-form ref="formPerfil" @submit.prevent="guardarCambios">
            <v-row>
              <v-col cols="12">
                <label class="campo-label">Nombre completo</label>

                <v-text-field
                  v-model="formulario.nombre"
                  placeholder="Ingresa tu nombre completo"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[reglas.requerido]"
                  maxlength="150"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12">
                <label class="campo-label">Teléfono</label>

                <v-text-field
                  v-model="formulario.telefono"
                  placeholder="Ingresa tu teléfono"
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[reglas.requerido]"
                  maxlength="30"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="campo-label">Fecha de nacimiento</label>

                <v-text-field
                  v-model="formulario.fecha_nacimiento"
                  type="date"
                  prepend-inner-icon="mdi-calendar-month-outline"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="campo-label">Sexo</label>

                <v-select
                  v-model="formulario.sexo"
                  :items="opcionesSexo"
                  placeholder="Selecciona una opción"
                  prepend-inner-icon="mdi-human-male-female"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  clearable
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- PERFIL PROFESIONAL -->
      <v-card
        v-if="perfil?.profesional_id"
        class="tarjeta mb-4"
        rounded="xl"
        flat
      >
        <v-card-text class="pa-4 pa-md-6">
          <div class="titulo-seccion">
            <div class="icono-seccion">
              <v-icon color="primary">mdi-store-outline</v-icon>
            </div>

            <h2>Perfil profesional</h2>
          </div>

          <v-row>
            <!-- Lema -->
<v-col cols="12">
  <label class="campo-label">Lema</label>

  <v-textarea
    v-model="formulario.lema"
    placeholder="Una frase que represente tu negocio"
    variant="outlined"
    density="compact"
    rounded="lg"
    maxlength="150"
    rows="2"
    hide-details="auto"
    class="campo-textarea"
  />
</v-col>

<!-- Descripción profesional -->
<v-col cols="12">
  <label class="campo-label">Descripción profesional</label>

  <v-textarea
    v-model="formulario.descripcion"
    placeholder="Cuéntales a tus clientes sobre tu experiencia y servicios"
    variant="outlined"
    density="compact"
    rounded="lg"
    rows="3"
    hide-details="auto"
    class="campo-textarea"
  />
</v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- SEGURIDAD -->
      <v-card class="tarjeta mb-5" rounded="xl" flat>
        <v-card-text class="pa-4 pa-md-6">
          <div class="titulo-seccion">
            <div class="icono-seccion">
              <v-icon color="primary">mdi-lock-outline</v-icon>
            </div>

            <h2>Seguridad</h2>
          </div>

          <v-list class="lista-seguridad" bg-color="transparent">
            <v-list-item
              prepend-icon="mdi-lock-reset"
              title="Cambiar contraseña"
              subtitle="Actualiza la contraseña de tu cuenta"
              append-icon="mdi-chevron-right"
              class="px-1"
              @click="dialogPassword = true"
            />

            <v-divider />

            <v-list-item
              prepend-icon="mdi-clock-outline"
              title="Última actualización"
              subtitle="Información de actualización del perfil"
              class="px-1"
            >
              <template #append>
                <span class="texto-actualizacion">
                  {{ fechaActualizacion }}
                </span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- ACCIONES -->
      <div class="acciones-perfil pb-4">
        <v-btn
          type="button"
          color="primary"
          block
          size="large"
          rounded="lg"
          prepend-icon="mdi-content-save"
          :loading="guardando"
          :disabled="guardando"
          class="boton-guardar mb-3"
          @click="guardarCambios"
        >
          Guardar cambios
        </v-btn>

        <v-btn
          block
          size="large"
          rounded="lg"
          variant="outlined"
          color="secondary"
          prepend-icon="mdi-cancel"
          :disabled="guardando"
          @click="cancelarCambios"
        >
          Cancelar cambios
        </v-btn>
      </div>
    </template>

    
<!-- DIÁLOGO DE CAMBIO DE CONTRASEÑA -->
<v-dialog
  v-model="dialogPassword"
  max-width="420"
  width="calc(100% - 24px)"
  persistent
>
  <v-card class="dialogo-password" rounded="xl">
    <v-card-title class="dialogo-password__titulo">
      <v-icon color="primary" size="22">
        mdi-lock-reset
      </v-icon>

      <span>Cambiar contraseña</span>

      <v-spacer />

      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        size="small"
        aria-label="Cerrar diálogo"
        :disabled="cambiandoPassword"
        @click="cerrarDialogPassword"
      />
    </v-card-title>

    <v-divider />

    <v-form
      ref="formPassword"
      @submit.prevent="guardarPassword"
    >
      <v-card-text class="dialogo-password__contenido">
        <p class="password-descripcion">
          Introduce tu contraseña actual y elige una nueva.
        </p>

        <v-text-field
          v-model="passwordForm.passwordActual"
          label="Contraseña actual"
          :type="mostrarPasswordActual ? 'text' : 'password'"
          :append-inner-icon="
            mostrarPasswordActual ? 'mdi-eye-off' : 'mdi-eye'
          "
          @click:append-inner="
            mostrarPasswordActual = !mostrarPasswordActual
          "
          variant="outlined"
          density="compact"
          autocomplete="current-password"
          :disabled="cambiandoPassword"
          :rules="[reglasPassword.requerido]"
          class="password-campo"
        />

        <v-text-field
          v-model="passwordForm.passwordNueva"
          label="Nueva contraseña"
          :type="mostrarPasswordNueva ? 'text' : 'password'"
          :append-inner-icon="
            mostrarPasswordNueva ? 'mdi-eye-off' : 'mdi-eye'
          "
          @click:append-inner="
            mostrarPasswordNueva = !mostrarPasswordNueva
          "
          variant="outlined"
          density="compact"
          autocomplete="new-password"
          :disabled="cambiandoPassword"
          :rules="[
            reglasPassword.requerido,
            reglasPassword.longitud
          ]"
          hint="Mínimo 6 caracteres"
          persistent-hint
          class="password-campo"
        />

        <v-text-field
          v-model="passwordForm.confirmarPassword"
          label="Confirmar nueva contraseña"
          :type="mostrarConfirmacion ? 'text' : 'password'"
          :append-inner-icon="
            mostrarConfirmacion ? 'mdi-eye-off' : 'mdi-eye'
          "
          @click:append-inner="
            mostrarConfirmacion = !mostrarConfirmacion
          "
          variant="outlined"
          density="compact"
          autocomplete="new-password"
          :disabled="cambiandoPassword"
          :rules="[
            reglasPassword.requerido,
            reglasPassword.coincide
          ]"
          class="password-campo"
        />
      </v-card-text>

      <v-card-actions class="dialogo-password__acciones">
        <v-btn
          variant="outlined"
          color="primary"
          rounded="lg"
          :disabled="cambiandoPassword"
          @click="cerrarDialogPassword"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          type="submit"
          :loading="cambiandoPassword"
        >
          Actualizar contraseña
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</v-dialog>

    

  </v-container>
</template>

<script>
import { getFileUrl } from "@/utils/ayuda";
import {
  getPerfil,
  updatePerfil,
} from "../services/perfil.api";
import { cambiarPassword } from "@/services/auth";

const crearFormularioVacio = () => ({
  nombre: "",
  telefono: "",
  sexo: null,
  fecha_nacimiento: null,
  fecha_trabajo: null,
  descripcion: "",
  lema: "",
});

export default {
  name: "PerfilAdminPage",

  data() {
    return {
      cargando: false,
      guardando: false,
      perfil: null,

      formulario: crearFormularioVacio(),
      formularioOriginal: crearFormularioVacio(),

      fotoSeleccionada: null,
      fotoPreview: null,

      dialogPassword: false,

      opcionesSexo: [
        { title: "Femenino", value: "Femenino" },
        { title: "Masculino", value: "Masculino" },
        { title: "Otro", value: "Otro" },
      ],

      reglas: {
        requerido: (valor) =>
          !!String(valor ?? "").trim() ||
          "Este campo es obligatorio.",
      },

      dialogPassword: false,
      cambiandoPassword: false,

      mostrarPasswordActual: false,
      mostrarPasswordNueva: false,
      mostrarConfirmacion: false,

      passwordForm: {
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
      },      
    };
  },

  computed: {
    fechaActualizacion() {
      if (!this.perfil?.updated_at) return "—";

      const fecha = new Date(this.perfil.updated_at);

      if (Number.isNaN(fecha.getTime())) return "—";

      return fecha.toLocaleDateString();
    },
    reglasPassword() {
      return {
        requerido: (v) =>
          !!v || "Este campo es obligatorio.",

        longitud: (v) =>
          (typeof v === "string" && v.length >= 6) ||
          "La contraseña debe tener al menos 6 caracteres.",

        coincide: (v) =>
          v === this.passwordForm.passwordNueva ||
          "Las contraseñas no coinciden.",
      };
    },
  },

  mounted() {
    this.cargarPerfil();
  },

  beforeUnmount() {
    this.liberarFotoPreview();
  },

  methods: {
    getFileUrl,

    async guardarPassword() {
      const resultado = await this.$refs.formPassword?.validate();

      if (!resultado?.valid) return;

      this.cambiandoPassword = true;

      try {
        const respuesta = await cambiarPassword(this.passwordForm);

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.mensaje ||
              "No se pudo cambiar la contraseña."
          );
        }

        this.dialogPassword = false;

        this.passwordForm = {
          passwordActual: "",
          passwordNueva: "",
          confirmarPassword: "",
        };

        this.mostrarPasswordActual = false;
        this.mostrarPasswordNueva = false;
        this.mostrarConfirmacion = false;

        this.$piaAlert.success(
          respuesta.data.mensaje ||
            "La contraseña se actualizó correctamente.",
          { title: "Contraseña actualizada" }
        );
      } catch (error) {
        console.error(
          "Error al cambiar la contraseña:",
          error.response?.data?.mensaje || error.message
        );

        this.$piaAlert.error(
          error.response?.data?.mensaje ||
            "No se pudo cambiar la contraseña.",
          { title: "Error de seguridad" }
        );
      } finally {
        this.cambiandoPassword = false;
      }
    },

    cerrarDialogPassword() {
      if (this.cambiandoPassword) return;

      this.dialogPassword = false;

      this.passwordForm = {
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
      };

      this.mostrarPasswordActual = false;
      this.mostrarPasswordNueva = false;
      this.mostrarConfirmacion = false;

      this.$refs.formPassword?.resetValidation();
    },

    async cargarPerfil() {
      this.cargando = true;

      try {
        const respuesta = await getPerfil();
        const datos = respuesta.data?.data;

        if (!respuesta.data?.ok || !datos) {
          throw new Error(
            respuesta.data?.mensaje ||
              "No se pudo obtener el perfil."
          );
        }

        this.perfil = datos;

        const formulario = {
          nombre: datos.nombre ?? "",
          telefono:
            datos.persona_telefono ??
            datos.usuario_telefono ??
            "",
          sexo: datos.sexo ?? null,
          fecha_nacimiento: this.formatearFecha(
            datos.fecha_nacimiento
          ),
          fecha_trabajo: this.formatearFecha(
            datos.fecha_trabajo
          ),
          descripcion: datos.descripcion ?? "",
          lema: datos.lema ?? "",
        };

        this.formulario = { ...formulario };
        this.formularioOriginal = { ...formulario };

        this.fotoSeleccionada = null;
        this.liberarFotoPreview();
        this.fotoPreview = datos.foto || null;
      } catch (error) {
        console.error("Error al cargar el perfil:", error);

        this.$piaAlert.error(
          error.response?.data?.mensaje ||
            error.message ||
            "No se pudo cargar el perfil.",
          { title: "Error al cargar el perfil" }
        );
      } finally {
        this.cargando = false;
      }
    },

    formatearFecha(valor) {
      if (!valor) return null;

      if (typeof valor === "string") {
        return valor.slice(0, 10);
      }

      return null;
    },

    async guardarCambios() {
      const resultado =
        await this.$refs.formPerfil?.validate();

      if (resultado && !resultado.valid) {
        this.$piaAlert.warning(
          "Revisa los campos obligatorios antes de continuar.",
          { title: "Revisa tus datos" }
        );
        return;
      }

      this.guardando = true;

      try {
        // FormData permite enviar los datos y la fotografía en una sola petición.
        const datos = new FormData();

        datos.append("nombre", this.formulario.nombre?.trim() || "");
        datos.append("telefono", this.formulario.telefono?.trim() || "");
        datos.append("sexo", this.formulario.sexo || "");
        datos.append(
          "fecha_nacimiento",
          this.formulario.fecha_nacimiento || ""
        );
        datos.append(
          "fecha_trabajo",
          this.formulario.fecha_trabajo || ""
        );
        datos.append("descripcion", this.formulario.descripcion || "");
        datos.append("lema", this.formulario.lema || "");

        if (this.fotoSeleccionada) {
          datos.append("foto", this.fotoSeleccionada);
        }

        const respuesta = await updatePerfil(datos);

        if (!respuesta.data?.ok) {
          throw new Error(
            respuesta.data?.mensaje ||
              "No se pudo actualizar el perfil."
          );
        }

        this.$piaAlert.success(
          respuesta.data.mensaje || "Perfil actualizado correctamente.",
          { title: "Perfil actualizado" }
        );

        await this.cargarPerfil();
      } catch (error) {
        console.error("Error al guardar el perfil:", error);

        this.$piaAlert.error(
          error.response?.data?.mensaje ||
            error.response?.data?.message ||
            error.message ||
            "No se pudo guardar el perfil.",
          { title: "Error al guardar el perfil" }
        );
      } finally {
        this.guardando = false;
      }
    },

    async cancelarCambios() {
      // Restaurar una copia limpia de los datos cargados desde el servidor.
      this.formulario = { ...this.formularioOriginal };

      this.fotoSeleccionada = null;
      this.liberarFotoPreview();
      this.fotoPreview = this.perfil?.foto || null;

      if (this.$refs.inputFoto) {
        this.$refs.inputFoto.value = "";
      }

      // Esperar a que Vue actualice los campos antes de limpiar validaciones.
      await this.$nextTick();
      this.$refs.formPerfil?.resetValidation();

      this.$piaAlert.info("Se descartaron los cambios.", {
        title: "Cambios descartados",
      });
    },

    abrirSelectorFoto() {
      this.$refs.inputFoto?.click();
    },

    seleccionarFoto(evento) {
      const archivo = evento.target.files?.[0];

      if (!archivo) return;

      if (!archivo.type.startsWith("image/")) {
        this.$piaAlert.warning("Selecciona un archivo de imagen.", {
          title: "Archivo no válido",
        });
        evento.target.value = "";
        return;
      }

      if (archivo.size > 5 * 1024 * 1024) {
        this.$piaAlert.warning("La imagen no debe superar los 5 MB.", {
          title: "Imagen demasiado grande",
        });
        evento.target.value = "";
        return;
      }

      this.liberarFotoPreview();

      this.fotoSeleccionada = archivo;
      this.fotoPreview = URL.createObjectURL(archivo);
    },

    liberarFotoPreview() {
      if (this.fotoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(this.fotoPreview);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.perfil-page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  color: #14264d;
  font-size: 13px;
}

.encabezado-pagina {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
  padding: 2px 4px;
}

.encabezado-texto,
.identidad-datos {
  min-width: 0;
}

.titulo-pagina {
  margin: 0;
  color: #14264d;
  font-size: 25px;
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.5px;
}

.subtitulo-pagina {
  margin: 6px 0 0;
  color: #71819b;
  font-size: 13px;
  line-height: 1.5;
}

.encabezado-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #e1f8f5;
}

.tarjeta {
  border: 1px solid #e9eff4;
  background: #fff;
  box-shadow: 0 4px 18px rgba(23, 51, 79, 0.045);
}

.perfil-identidad {
  background: linear-gradient(125deg, #f3fffd 0%, #fff 100%);
  border-color: #d7f4ef;
}

.identidad-contenido {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-contenedor {
  position: relative;
  flex-shrink: 0;
}

.avatar-perfil {
  background: #def7f3;
  border: 5px solid #fff;
  box-shadow: 0 0 0 1px #e3f3f1;
}

.boton-camara {
  position: absolute;
  right: -3px;
  bottom: 3px;
  border: 3px solid #fff;
}

.nombre-perfil {
  margin: 0 0 10px;
  color: #14264d;
  font-size: 20px;
  font-weight: 750;
  overflow-wrap: anywhere;
}

.chip-estado {
  margin-bottom: 14px;
}

.texto-foto-pendiente {
  margin: 8px 0 0;
  color: #71819b;
  font-size: 12px;
  line-height: 1.5;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.titulo-seccion h2 {
  min-width: 0;
  margin: 0;
  color: #14264d;
  font-size: 18px;
  font-weight: 750;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.icono-seccion {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #e1f8f5;
}

.campo-label {
  display: block;
  margin-bottom: 5px;
  color: #536a87;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

/* Campos Vuetify: iconos centrados verticalmente y texto legible. */
.perfil-page :deep(.v-field) {
  font-size: 13px;
}

.perfil-page :deep(.v-field__input) {
  min-width: 0;
  font-size: 13px !important;
  line-height: 1.45 !important;
  overflow-wrap: break-word;
}

.perfil-page :deep(.v-field--variant-outlined),
.perfil-page :deep(.v-field__outline) {
  border-radius: 9px;
}

.perfil-page :deep(.v-field__prepend-inner),
.perfil-page :deep(.v-field__append-inner) {
  align-items: center !important;
  align-self: center;
}

.perfil-page :deep(.v-field__prepend-inner > .v-icon),
.perfil-page :deep(.v-field__append-inner > .v-icon) {
  font-size: 17px;
}

/* Textareas: pequeño espacio interior para que no se corte el texto. */
.perfil-page :deep(.v-textarea .v-field__input) {
  min-height: 0 !important;
  padding: 9px 1px 10px !important;
  align-items: flex-start !important;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: normal;
}

.perfil-page :deep(.v-textarea textarea) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 1px 0 !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: normal;
  overflow-y: auto;
  resize: vertical;
}

.perfil-page :deep(.v-textarea .v-field__field) {
  min-width: 0;
  align-items: stretch;
}

.perfil-page :deep(.v-row) {
  row-gap: 0;
}

.perfil-page :deep(.v-col) {
  padding-top: 5px;
  padding-bottom: 5px;
}

.perfil-page :deep(.v-messages) {
  font-size: 11px;
  line-height: 1.4;
}

.lista-seguridad {
  color: #526982;
}

.lista-seguridad :deep(.v-list-item) {
  min-height: 60px;
}

.lista-seguridad :deep(.v-list-item__prepend > .v-icon) {
  color: #60758e;
  opacity: 1;
}

.lista-seguridad :deep(.v-list-item__content) {
  min-width: 0;
}

.lista-seguridad :deep(.v-list-item-title) {
  color: #243b5c;
  font-weight: 600;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.35;
}

.lista-seguridad :deep(.v-list-item-subtitle) {
  color: #71819b;
  font-size: 12px;
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: anywhere;
}

.lista-seguridad :deep(.v-list-item__prepend) {
  margin-inline-end: 12px;
}

.lista-seguridad :deep(.v-list-item__append) {
  margin-inline-start: 8px;
}

.texto-actualizacion {
  color: #71819b;
  font-size: 12px;
  white-space: nowrap;
}

.acciones-perfil {
  width: 100%;
}

.boton-guardar {
  min-height: 48px;
  font-weight: 700;
  letter-spacing: 0;
}

.d-none {
  display: none;
}

/* Diálogo de contraseña: el texto puede envolver sin quedar recortado. */
.dialogo-password {
  width: 100%;
  overflow: hidden;
}

.dialogo-password__titulo {
  display: flex;
  align-items: center;  
  gap: 9px;
  padding: 14px 16px !important;
  font-size: 16px !important;
  font-weight: 650;
  line-height: 1.4;
  white-space: normal;
}

.dialogo-password__titulo > span {
  flex: auto;
  min-width: 0;  
  overflow-wrap: anywhere;
}

.dialogo-password__contenido {
  min-width: 0;
  padding: 16px !important;
  color: #526982;
  font-size: 13px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  word-break: normal;
}

.dialogo-password__contenido p {
  margin: 0;
  overflow-wrap: anywhere;
}

.texto-aviso-password {
  display: block;
  min-width: 0;
  font-size: 12px;
  line-height: 1.5;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;
}

.dialogo-password :deep(.v-alert__content) {
  min-width: 0;
  flex: 1 1 auto;
  overflow-wrap: anywhere;
  word-break: normal;
}

.dialogo-password :deep(.v-alert__prepend) {
  align-self: flex-start;
  padding-top: 2px;
}

.dialogo-password__acciones {
  padding: 12px 16px 16px !important;
}

@media (min-width: 768px) {
  .acciones-perfil {
    max-width: 420px;
    margin-left: auto;
  }
}

@media (max-width: 600px) {
  .perfil-page {
    width: 100%;
    max-width: 100%;
    padding: 4px !important;
  }

  .perfil-page .tarjeta > .v-card-text {
    padding: 10px !important;
  }

  .perfil-page :deep(.v-row) {
    margin-inline: -4px;
  }

  .perfil-page :deep(.v-col) {
    padding-inline: 4px;
  }

  .perfil-page :deep(.v-textarea .v-field__input) {
    padding: 8px !important;
  }

  .perfil-page :deep(.v-textarea textarea) {
    font-size: 12px !important;
    line-height: 1.5 !important;
  }

  .encabezado-pagina {
    margin-bottom: 12px;
    gap: 8px;
    padding: 0 2px;
  }

  .titulo-pagina {
    font-size: 20px;
    line-height: 1.25;
    letter-spacing: 0;
  }

  .subtitulo-pagina {
    max-width: 250px;
    margin-top: 3px;
    font-size: 11px;
    line-height: 1.4;
  }

  .encabezado-icono {
    width: 36px;
    height: 36px;
    border-radius: 11px;
  }

  .tarjeta {
    margin-bottom: 12px !important;
  }

  .identidad-contenido {
    flex-direction: column;
    gap: 12px;
  }

  .avatar-perfil {
    width: 78px !important;
    height: 78px !important;
  }

  .avatar-perfil :deep(.v-icon) {
    font-size: 46px !important;
  }

  .identidad-datos {
    width: 100%;
    text-align: center;
  }

  .nombre-perfil {
    margin-bottom: 6px;
    font-size: 16px;
  }

  .chip-estado {
    margin-bottom: 8px;
    font-size: 10px;
  }

  .titulo-seccion {
    gap: 8px;
    margin-bottom: 12px;
  }

  .titulo-seccion h2 {
    font-size: 14px;
    line-height: 1.35;
  }

  .icono-seccion {
    width: 34px;
    height: 34px;
    border-radius: 9px;
  }

  .campo-label {
    margin-bottom: 4px;
    font-size: 12px;
  }

  .perfil-page :deep(.v-field__input),
  .perfil-page :deep(.v-textarea textarea),
  .perfil-page :deep(.v-select__selection-text) {
    font-size: 12px !important;
  }

  .lista-seguridad :deep(.v-list-item) {
    min-height: 56px;
    padding-inline: 0 !important;
  }

  .lista-seguridad :deep(.v-list-item-title) {
    font-size: 12px;
  }

  .lista-seguridad :deep(.v-list-item-subtitle) {
    font-size: 10px;
  }

  .lista-seguridad :deep(.v-list-item__prepend) {
    margin-inline-end: 10px;
  }

  .lista-seguridad :deep(.v-list-item__append) {
    margin-inline-start: 6px;
  }

  .texto-actualizacion {
    font-size: 10px;
  }

  .boton-guardar {
    min-height: 42px;
    font-size: 12px;
  }

  .acciones-perfil .v-btn {
    font-size: 12px;
  }
}

.dialogo-password {
  width: 100%;
  overflow: hidden;
}

.dialogo-password__titulo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  white-space: normal;
}

.dialogo-password__contenido {
  padding: 16px;
}

.password-descripcion {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.password-campo {
  margin-bottom: 10px;
}

.password-campo :deep(input) {
  font-size: 13px;
}

.password-campo :deep(.v-field__input) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.password-campo :deep(.v-label) {
  font-size: 13px;
}

.password-campo :deep(.v-messages) {
  font-size: 11px;
  line-height: 1.4;
}

.dialogo-password__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px 16px;
}

.dialogo-password__acciones .v-btn {
  flex: 1 1 140px;
  min-width: 0;
  font-size: 12px;
  letter-spacing: normal;
}
</style>
