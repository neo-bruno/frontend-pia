<template>
<v-container class="registro-container py-4">

  <!-- ================================================= -->
  <!-- TOOLBAR -->
  <!-- ================================================= -->

  <v-toolbar color="transparent" flat density="compact" class="registro-toolbar mb-3">

    <v-btn size="35" color="primary" variant="tonal" icon="mdi-undo" @click="$router.back()" />

    <v-toolbar-title class="text-center">

      <div class="registro-title">
        Registro de profesional en PIA
      </div>

      <div class="registro-subtitle">
        Completa los 4 pasos para registrarte como profesional
      </div>

    </v-toolbar-title>

    <div class="toolbar-spacer"></div>

  </v-toolbar>

  <!-- ================================================= -->
  <!-- NEGOCIO SELECCIONADO -->
  <!-- ================================================= -->

  <v-card v-if="negocio" class="negocio-card mx-auto mb-4" max-width="1100" variant="tonal">

    <div class="d-flex align-center pa-4">

      <div class="negocio-icon">
        <v-icon>
          mdi-storefront-outline
        </v-icon>
      </div>

      <div class="ml-3">

        <div class="text-caption text-medium-emphasis">
          Te estás registrando en
        </div>

        <div class="font-weight-bold">
          {{ negocio.nombre }}
        </div>

        <div class="text-caption text-medium-emphasis">
          Código: {{ negocio.codigo }}
        </div>

      </div>

    </div>

  </v-card>

  <!-- ================================================= -->
  <!-- STEPPER -->
  <!-- ================================================= -->

  <v-card class="registro-card mx-auto" max-width="1100" elevation="2">

    <div class="stepper-wrapper pa-4">

      <div class="stepper">

        <div v-for="paso in pasos" :key="paso.numero" class="step" :class="{
              activo: pasoActual === paso.numero,
              completado: pasoActual > paso.numero
            }">

          <div class="step-circle">

            <v-icon v-if="pasoActual > paso.numero" size="18">
              mdi-check
            </v-icon>

            <span v-else>
              {{ paso.numero }}
            </span>

          </div>

          <div class="step-label">
            {{ paso.nombre }}
          </div>

        </div>

      </div>

    </div>

    <v-divider />

    <!-- ================================================= -->
    <!-- CONTENIDO -->
    <!-- ================================================= -->

    <div class="pa-5 pa-md-8">

      <!-- ================================================= -->
      <!-- PASO 1 - PROFESIONAL -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 1">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-account-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Información del profesional
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Completa tus datos personales y de acceso
            </div>

          </div>

        </div>

        <v-form ref="formProfesional" class="mt-6" @submit.prevent>

          <!-- TIPO PROFESIONAL -->

          <v-select autofocus v-model="form.profesional.tipo_profesional_id" label="(*) Tipo de profesional" placeholder="Selecciona el tipo de profesional" :items="tiposProfesional" item-title="nombre" item-value="id" variant="outlined" density="comfortable" :rules="[reglas.requerido]" />

          <div class="agregar-tipo">

            <span>
              ¿No encuentras el tuyo?
            </span>

            <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-plus" @click="abrirDialogoTipoProfesional">
              Agregar nuevo tipo
            </v-btn>

          </div>

          <!-- NOMBRES -->

          <v-text-field v-model="form.profesional.nombres" label="(*) Nombres" placeholder="Ej. María Fernanda" variant="outlined" density="comfortable" maxlength="150" counter="150" :rules="[reglas.nombre]" />

          <!-- APELLIDOS -->

          <v-text-field v-model="form.profesional.apellidos" label="(*) Apellidos" placeholder="Ej. López Sánchez" variant="outlined" density="comfortable" maxlength="150" counter="150" :rules="[reglas.nombre]" />

          <!-- TELÉFONO -->

          <v-text-field v-model="form.profesional.telefono" label="(*) Teléfono personal" placeholder="Ej. 71234567" variant="outlined" density="comfortable" maxlength="15" :rules="[reglas.telefono]" />

          <!-- SEXO / FECHA -->

          <v-row>

            <v-col cols="12" sm="6">

              <v-select v-model="form.profesional.sexo" label="(*) Sexo" placeholder="Selecciona" :items="sexos" variant="outlined" density="comfortable" :rules="[reglas.sexo]" />

            </v-col>

            <v-col cols="12" sm="6">

              <v-text-field v-model="form.profesional.fecha_nacimiento" label="(*) Fecha de nacimiento" type="date" variant="outlined" density="comfortable" :rules="[reglas.fecha]" />

            </v-col>

          </v-row>

          <!-- PASSWORD -->

          <v-text-field v-model="form.profesional.password" label="(*) Contraseña de acceso" placeholder="Mínimo 6 caracteres" prepend-inner-icon="mdi-lock-outline" :type="
                mostrarPassword
                 ?'text'
                  : 'password'
              " :append-inner-icon="
                mostrarPassword
                 ?'mdi-eye-off-outline'
                  : 'mdi-eye-outline'
              " @click:append-inner="
                mostrarPassword = !mostrarPassword
              " variant="outlined" density="comfortable" :rules="[reglas.password]" />

        </v-form>

      </div>

      <!-- ================================================= -->
      <!-- PASO 2 - MEMBRESÍA -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 2">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-crown-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Plan de membresía
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Selecciona cuándo comenzará tu membresía
            </div>

          </div>

        </div>

        <v-card class="plan-card mt-6" variant="outlined">

          <div class="text-subtitle-1 font-weight-bold">
            Plan mensual PIA
          </div>

          <div class="plan-price mt-2">

            Bs. {{ gerencia.monto_qr }}

            <span>
              / mes
            </span>

          </div>

          <div class="mt-4">

            <div class="beneficio">

              <v-icon size="18">
                mdi-check
              </v-icon>

              Perfil profesional dentro de PIA

            </div>

            <div class="beneficio">

              <v-icon size="18">
                mdi-check
              </v-icon>

              Gestión de servicios

            </div>

            <div class="beneficio">

              <v-icon size="18">
                mdi-check
              </v-icon>

              Gestión de reservas

            </div>

            <div class="beneficio">

              <v-icon size="18">
                mdi-check
              </v-icon>

              Presencia dentro del negocio

            </div>

          </div>

        </v-card>

        <v-form ref="formMembresia" class="mt-6" @submit.prevent>

          <v-text-field v-model="membresia.fecha_inicio" label="Fecha de inicio" type="date" variant="outlined" density="comfortable" :rules="[reglas.fecha]" />

        </v-form>

        <v-alert class="mt-4" variant="tonal" type="success">

          <div class="text-body-2">
            Tu membresía será válida hasta:
          </div>

          <div class="font-weight-bold mt-1">

            {{ fechaFinFormateada }}

            <span class="text-caption ml-2">
              (1 mes)
            </span>

          </div>

        </v-alert>

        <v-card class="mt-4 pa-4" variant="outlined">

          <div class="text-body-2 text-medium-emphasis">
            Total a pagar
          </div>

          <div class="text-h5 font-weight-bold text-primary mt-1">
            Bs. {{ membresia.monto }}
          </div>

        </v-card>

      </div>

      <!-- ================================================= -->
      <!-- PASO 3 - PAGO -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 3">

        <div class="section-header">

          <div class="section-icon">
            <v-icon>
              mdi-credit-card-outline
            </v-icon>
          </div>

          <div>

            <div class="text-h6 font-weight-bold">
              Realiza el pago
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Realiza el pago de tu membresía
            </div>

          </div>

        </div>

        <v-form ref="formPago" class="pago-container mt-6" @submit.prevent>

          <div class="text-body-2 text-center mb-4">

            Escanea el código QR de Gerencia PIA
            para realizar el pago.

          </div>

          <!-- DESCARGAR QR -->

          <div class="d-flex justify-end mb-2">

            <v-btn variant="text" size="small" color="primary" prepend-icon="mdi-download" @click="descargarQR">
              Descargar QR
            </v-btn>

          </div>

          <!-- QR -->

          <div class="qr-container">

            <v-img :src="urlQrGerencia(gerencia.url)" cover />

          </div>

          <!-- MONTO -->

          <div class="text-center mt-4">

            <div class="text-body-2 text-medium-emphasis">
              Monto a pagar
            </div>

            <div class="text-h5 font-weight-bold text-primary">
              Bs. {{ membresia.monto }}
            </div>

          </div>

          <!-- COMPROBANTE -->

          <v-file-input v-model="form.pago.comprobante" class="mt-6" label="Comprobante de pago" hint="Imagen o PDF" persistent-hint accept="image/*,.pdf" prepend-icon="mdi-cloud-upload-outline" variant="outlined" density="comfortable" :rules="[reglas.archivo]" />

          <v-alert class="mt-4" variant="tonal" type="info">

            El comprobante será revisado por
            la Gerencia PIA antes de activar
            tu membresía.

          </v-alert>

        </v-form>

      </div>

      <!-- ================================================= -->
      <!-- PASO 4 - FINALIZAR -->
      <!-- ================================================= -->

      <div v-if="pasoActual === 4" class="finalizar-container">

        <div class="success-icon">

          <v-icon size="55">
            mdi-check
          </v-icon>

        </div>

        <div class="text-h5 font-weight-bold mt-6">
          ¡Registro enviado!
        </div>

        <div class="text-body-1 text-medium-emphasis mt-3">

          Tu registro como profesional
          fue enviado correctamente.

        </div>

        <v-alert class="mt-6" variant="tonal" type="success">

          Tu comprobante de pago está pendiente
          de validación por la Gerencia PIA.

        </v-alert>

        <div class="text-body-2 text-medium-emphasis mt-5">

          Te notificaremos cuando tu membresía
          sea activada.

        </div>

      </div>

      <!-- ================================================= -->
      <!-- BOTONES -->
      <!-- ================================================= -->

      <div v-if="pasoActual < 4" class="acciones mt-8">

        <v-btn v-if="pasoActual > 1" variant="outlined" size="large" @click="anterior">
          Atrás
        </v-btn>

        <v-spacer />

        <v-btn color="primary" size="large" min-width="150" @click="siguiente">

          <span v-if="pasoActual < 3">
            Continuar
          </span>

          <span v-else>
            Finalizar
          </span>

          <v-icon end>
            mdi-arrow-right
          </v-icon>

        </v-btn>

      </div>

    </div>

  </v-card>

  <!-- ================================================= -->
  <!-- INFORMACIÓN DE LOS 4 PASOS -->
  <!-- ================================================= -->

  <div class="como-funciona mx-auto mt-8" style="max-width: 1100px;">

    <div class="text-h6 font-weight-bold mb-5">
      ¿Cómo funciona el registro?
    </div>

    <v-row>

      <v-col v-for="paso in pasos" :key="paso.numero" cols="12" sm="6" md="3">

        <div class="funciona-item">

          <div class="funciona-icon">

            <v-icon size="22">
              {{ paso.icono }}
            </v-icon>

          </div>

          <div>

            <div class="font-weight-bold">

              {{ paso.numero }}.
              {{ paso.nombre }}

            </div>

            <div class="text-caption text-medium-emphasis mt-1">

              {{ paso.descripcion }}

            </div>

          </div>

        </div>

      </v-col>

    </v-row>

  </div>

  <!-- ================================================= -->
  <!-- DIALOGO - NUEVO TIPO DE PROFESIONAL -->
  <!-- ================================================= -->

  <v-dialog v-model="dialogoTipoProfesional" max-width="450">

    <v-card>

      <v-card-title class="pa-5 bg-primary">
        Nuevo tipo de profesional
      </v-card-title>

      <v-card-text>

        <v-form ref="formTipoProfesional" @submit.prevent>

          <v-text-field v-model="nuevoTipoProfesional.nombre" autofocus label="Nombre" placeholder="Ej. Estilista" variant="outlined" density="comfortable" maxlength="100" counter="100" :rules="[reglas.tipoNombre]" />

          <v-textarea v-model="nuevoTipoProfesional.descripcion" label="Descripción" placeholder="Describe el tipo de profesional" variant="outlined" density="comfortable" maxlength="255" counter="255" :rules="[reglas.requerido]" />

        </v-form>

      </v-card-text>

      <v-card-actions class="px-5 pb-5">

        <v-spacer />

        <v-btn prepend-icon="mdi-close" color="error" variant="outlined" @click="cerrarDialogoTipoProfesional">
          Cancelar
        </v-btn>

        <v-btn variant="elevated" class="ms-4" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right" color="primary" @click="guardarTipoProfesional">
          Guardar
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</v-container>

<!-- ================================================= -->
<!-- OVERLAY -->
<!-- ================================================= -->

<v-overlay :model-value="overlay" class="align-center justify-center" persistent>

  <v-progress-circular color="primary" size="64" indeterminate />

</v-overlay>
</template>

<script>
import { urlQrGerencia } from "@/utils/ayuda";
import { getManagement } from "../../gerencia/services/gerencia.api";
import { getProfessionalsTypes, saveProfessional } from "../../profesional/services/profesional.api";

export default {
  name: "RegistroProfesionalPage",

  data() {
    return {
      // ============================================
      // REGLAS
      // ============================================

      reglas: {

        requerido: (value) => {

          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {
            return "Este campo es obligatorio";
          }

          if (
            typeof value === "string" &&
            !value.trim()
          ) {
            return "Este campo es obligatorio";
          }

          return true;

        },

        nombre: (value) => {

          if (
            value === null ||
            value === undefined ||
            !String(value).trim()
          ) {
            return "Este campo es obligatorio";
          }

          const texto = String(value).trim();

          if (texto.length < 2) {
            return "Debe tener al menos 2 caracteres";
          }

          if (texto.length > 150) {
            return "No puede superar los 150 caracteres";
          }

          return true;

        },

        tipoNombre: (value) => {

          if (
            value === null ||
            value === undefined ||
            !String(value).trim()
          ) {
            return "El nombre es obligatorio";
          }

          const texto = String(value).trim();

          if (texto.length < 3) {
            return "Debe tener al menos 3 caracteres";
          }

          if (texto.length > 100) {
            return "No puede superar los 100 caracteres";
          }

          return true;

        },

        telefono: (value) => {

          if (
            value === null ||
            value === undefined ||
            !String(value).trim()
          ) {
            return "El teléfono es obligatorio";
          }

          const telefono = String(value).replace(
            /\D/g,
            ""
          );

          if (
            telefono.length < 7 ||
            telefono.length > 15
          ) {
            return "Ingresa un teléfono válido";
          }

          return true;

        },

        password: (value) => {

          if (!value) {
            return "La contraseña es obligatoria";
          }

          if (value.length < 6) {
            return "Debe tener al menos 6 caracteres";
          }

          return true;

        },

        sexo: (value) => {

          if (!value) {
            return "Selecciona el sexo";
          }

          return true;

        },

        fecha: (value) => {

          if (!value) {
            return "La fecha es obligatoria";
          }

          return true;

        },

        archivo: (value) => {

          if (!value) {
            return "Debes subir el comprobante";
          }

          return true;

        },

      },

      // ============================================
      // PASO ACTUAL
      // ============================================

      pasoActual: 1,

      pasos: [

        {
          numero: 1,
          nombre: "Profesional",
          icono: "mdi-account-outline",
          descripcion: "Registra tus datos personales",
        },

        {
          numero: 2,
          nombre: "Membresía",
          icono: "mdi-crown-outline",
          descripcion: "Selecciona el inicio de tu membresía",
        },

        {
          numero: 3,
          nombre: "Pago",
          icono: "mdi-credit-card-outline",
          descripcion: "Realiza el pago y adjunta el comprobante",
        },

        {
          numero: 4,
          nombre: "Finalizar",
          icono: "mdi-check-circle-outline",
          descripcion: "Envía tu registro a PIA",
        },

      ],

      // ============================================
      // NEGOCIO
      // ============================================

      negocio: null,

      negocioId: null,

      // ============================================
      // GERENCIA
      // ============================================

      gerencia: {},

      // ============================================
      // FORMULARIO
      // ============================================

      form: {

        profesional: {

          tipo_profesional_id: null,

          nombres: "",

          apellidos: "",

          telefono: "",

          sexo: "MASCULINO",

          fecha_nacimiento: "",

          password: "",

          tipo_profesional: null,

        },

        pago: {

          comprobante: null,

        },

      },

      // ============================================
      // MEMBRESÍA
      // ============================================

      membresia: {

        fecha_inicio: "",

        monto: 10,

      },

      // ============================================
      // DATOS AUXILIARES
      // ============================================

      tiposProfesional: [],

      sexos: [

        {
          title: "Masculino",
          value: "MASCULINO",
        },

        {
          title: "Femenino",
          value: "FEMENINO",
        },

      ],

      // ============================================
      // DIALOGOS
      // ============================================

      dialogoTipoProfesional: false,

      nuevoTipoProfesional: {

        id: 0,

        nombre: "",

        descripcion: "",

      },

      // ============================================
      // UI
      // ============================================

      mostrarPassword: false,

      guardando: false,

      overlay: false,

    };

  },

  computed: {

    // ============================================
    // FECHA FIN
    // ============================================

    fechaFin() {

      if (!this.membresia.fecha_inicio) {
        return null;
      }

      const fecha = new Date(
        `${this.membresia.fecha_inicio}T00:00:00`
      );

      if (Number.isNaN(fecha.getTime())) {
        return null;
      }

      fecha.setMonth(
        fecha.getMonth() + 1
      );

      return fecha;

    },

    // ============================================
    // FECHA FIN FORMATEADA
    // ============================================

    fechaFinFormateada() {

      if (!this.fechaFin) {
        return "Selecciona una fecha de inicio";
      }

      return this.fechaFin.toLocaleDateString(
        "es-BO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

    },

  },

  watch: {

    // ============================================
    // FECHA DE INICIO
    // ============================================

    "membresia.fecha_inicio"(valor) {

      if (!valor) {
        return;
      }

      console.log(
        "📅 Fecha inicio membresía:",
        valor
      );

      console.log(
        "📅 Fecha fin membresía:",
        this.fechaFinFormateada
      );

    },

  },

  methods: {

    urlQrGerencia,

    // ============================================
    // DESCARGAR QR
    // ============================================

    descargarQR() {

      const url = urlQrGerencia(
        this.gerencia.url
      );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "QR-Pago-PIA.png";

      link.target = "_blank";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    },

    // ============================================
    // SIGUIENTE
    // ============================================

    async siguiente() {

      let formulario = null;

      if (this.pasoActual === 1) {

        formulario =
          this.$refs.formProfesional;

      }

      if (this.pasoActual === 2) {

        formulario =
          this.$refs.formMembresia;

      }

      if (this.pasoActual === 3) {

        formulario =
          this.$refs.formPago;

      }

      // ==========================================
      // VALIDAR
      // ==========================================

      if (formulario) {

        const resultado =
          await formulario.validate();

        if (!resultado.valid) {

          await this.$nextTick();

          setTimeout(() => {

            const primerError =
              document.querySelector(
                ".v-input--error"
              );

            if (primerError) {

              primerError.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });

            }

          }, 100);

          return;

        }

      }

      // ==========================================
      // PASO 3 → FINALIZAR REGISTRO
      // ==========================================

      if (this.pasoActual === 3) {

        await this.finalizarRegistro();

        return;

      }

      // ==========================================
      // AVANZAR
      // ==========================================

      if (this.pasoActual < 4) {

        this.pasoActual++;

      }

      await this.$nextTick();

      window.scrollTo({

        top: 0,

        behavior: "smooth",

      });

    },

    // ============================================
    // ANTERIOR
    // ============================================

    anterior() {

      if (this.pasoActual > 1) {

        this.pasoActual--;

      }

    },

    // ============================================
    // DIALOGO TIPO PROFESIONAL
    // ============================================

    abrirDialogoTipoProfesional() {

      this.nuevoTipoProfesional = {

        nombre: "",

        descripcion: "",

      };

      this.dialogoTipoProfesional = true;

      this.$nextTick(() => {
        this.$refs.formTipoProfesional?.resetValidation();
      });

    },

    // ============================================
    // GUARDAR TIPO PROFESIONAL
    // ============================================

    async guardarTipoProfesional() {

      const formulario =
        this.$refs.formTipoProfesional;

      if (!formulario) {
        return;
      }

      const resultado =
        await formulario.validate();

      if (!resultado.valid) {
        return;
      }

      const datos = {

        nombre: this.nuevoTipoProfesional.nombre
          .trim(),

        descripcion: this.nuevoTipoProfesional.descripcion
          .trim(),

      };

      console.log(
        "===================================="
      );

      console.log(
        "📦 NUEVO TIPO DE PROFESIONAL"
      );

      console.log(datos);

      console.log(
        "===================================="
      );

      // ==========================================
      // SIMULACIÓN TEMPORAL
      // ==========================================

      const nuevoTipo = {

        id: this.obtenerSiguienteId(
          this.tiposProfesional
        ),

        nombre: datos.nombre,

      };

      this.tiposProfesional.push(
        nuevoTipo
      );

      this.form.profesional
        .tipo_profesional_id =
        nuevoTipo.id;

      this.form.profesional
        .tipo_profesional =
        this.nuevoTipoProfesional;

      this.cerrarDialogoTipoProfesional();

    },

    // ============================================
    // CERRAR DIALOGO
    // ============================================

    cerrarDialogoTipoProfesional() {

      this.dialogoTipoProfesional = false;

      this.nuevoTipoProfesional = {

        nombre: "",

        descripcion: "",

      };

      this.$nextTick(() => {

        this.$refs
          .formTipoProfesional?.resetValidation();

      });

    },

    // ============================================
    // SIGUIENTE ID
    // ============================================

    obtenerSiguienteId(lista) {

      if (!lista.length) {
        return 1;
      }

      return (
        Math.max(
          ...lista.map(
            (item) => item.id
          )
        ) + 1
      );

    },

    // ============================================
    // FINALIZAR REGISTRO
    // ============================================

    async finalizarRegistro() {

      if (this.guardando) {
        return;
      }

      if (!this.negocioId) {
        this.$swal({
          title: "Negocio no encontrado",
          text: "No se pudo determinar el negocio al que deseas registrarte.",
          icon: "error",
          timer: 2500,
        });
        return;
      }

      this.guardando = true;

      try {

        const datosRegistro = {
          negocio_id: this.negocioId,

          profesional: {
            ...this.form.profesional,
          },

          membresia: {
            fecha_inicio: this.membresia.fecha_inicio,
            fecha_fin: this.formatearFechaISO(this.fechaFin),
            monto: this.membresia.monto,
          },

          pago: {
            comprobante: this.form.pago.comprobante,
          },
        };

        console.log(
          "========================================"
        );

        console.log(
          "🚀 REGISTRO PROFESIONAL PIA"
        );

        console.log(
          "========================================"
        );

        console.log(
          "🏪 NEGOCIO ID:",
          this.negocioId
        );

        console.log(
          "👤 PROFESIONAL:",
          datosRegistro.profesional
        );

        console.log(
          "👑 MEMBRESÍA:",
          datosRegistro.membresia
        );

        console.log(
          "💳 PAGO:",
          datosRegistro.pago
        );

        console.log('data: ', datosRegistro)

        console.log(
          "========================================"
        );

        const formData = new FormData();
        formData.append("negocioId", this.negocioId);
        formData.append("profesional", JSON.stringify(datosRegistro.profesional));
        formData.append("membresia", JSON.stringify(datosRegistro.membresia));
        formData.append("comprobante", datosRegistro.pago.comprobante);

        const res = await saveProfessional(formData);

        if (res.status === 201) {
          this.$swal({
            title: "Profesional Guardado!",
            text: "Se ha guardado los datos del profesional correctamente",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.pasoActual = 4;
              this.$router.push({path: '/'})
            }
          })
        }

      } catch (error) {
        console.error(error);

        this.$swal({
          title: "Error!",
          text: error.response?.data?.message || error.response?.data?.mensaje ||
            error.response?.data?.error || 
            error.message || error.mensaje ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
        });

      } finally {
        this.guardando = false;
      }
    },

    // ============================================
    // FECHA ISO
    // ============================================

    formatearFechaISO(fecha) {

      if (!fecha) {
        return null;
      }

      const year =
        fecha.getFullYear();

      const month =
        String(
          fecha.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          fecha.getDate()
        ).padStart(2, "0");

      return `${year}-${month}-${day}`;

    },

    // ============================================
    // OBTENER TIPOS PROFESIONALES
    // ============================================

    async obtenerTiposProfesionales() {

      try {
        this.overlay = true;
        const res = await getProfessionalsTypes();

        if (res.data.ok) {
          this.tiposProfesional = res.data.data;
        }

      } catch (error) {

        console.log(error);

        this.$swal({

          title: "Error!",

          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",

          icon: "error",

          timer: 2500,

        });

      } finally {
        this.overlay = false;
      }

    },

    // ============================================
    // OBTENER GERENCIA
    // ============================================

    async obtenerGerencia() {

      try {
        this.overlay = true;
        const res = await getManagement();

        if (res.data.ok) {
          this.gerencia = res.data.data;
          this.membresia.monto = this.gerencia.monto_qr;
        }
      } catch (error) {

        console.log(error);
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
        });

      } finally {
        this.overlay = false;
      }

    },

    // ============================================
    // OBTENER NEGOCIO DESDE QUERY
    // ============================================

    obtenerNegocio() {
      this.negocioId = this.$route.query.negocio_id || null;

      this.negocio = {
        id: this.negocioId,
        nombre: this.$route.query.negocio_nombre || "Negocio seleccionado",
        codigo: this.$route.query.negocio_codigo || "",
      };

      console.log( "🏪 NEGOCIO SELECCIONADO:", this.negocio);
    },

  },

  // ============================================
  // MOUNTED
  // ============================================

  mounted() {

    this.obtenerNegocio();
    this.obtenerTiposProfesionales();
    this.obtenerGerencia();

  },

};
</script>

<style lang="css" scoped>
.registro-container {
  min-height: 100vh;
  background: #ffffff;
}

.registro-card {
  border-radius: 18px;
  overflow: hidden;
}

/* ========================================= */
/* NEGOCIO */
/* ========================================= */

.negocio-card {
  border-radius: 14px;
}

.negocio-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eaf7f6;

  color: #0f8f8c;
}

/* ========================================= */
/* STEPPER */
/* ========================================= */

.stepper-wrapper {
  overflow-x: auto;
}

.stepper {
  display: flex;

  justify-content: space-between;

  min-width: 500px;

  position: relative;
}

.step {
  flex: 1;

  text-align: center;

  position: relative;

  z-index: 1;
}

.step:not(:last-child)::after {

  content: "";

  position: absolute;

  top: 17px;

  left: 50%;

  width: 100%;

  height: 2px;

  background: #e5e7eb;

  z-index: -1;

}

.step.completado:not(:last-child)::after {

  background: #35b7b0;

}

.step-circle {

  width: 34px;

  height: 34px;

  margin: 0 auto;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #eef2f2;

  color: #64748b;

  font-weight: 600;

}

.step.activo .step-circle,
.step.completado .step-circle {

  background: #0f8f8c;

  color: white;

}

.step-label {

  margin-top: 7px;

  font-size: 12px;

  font-weight: 500;

  color: #64748b;

}

.step.activo .step-label {

  color: #0f8f8c;

  font-weight: 700;

}

/* ========================================= */
/* HEADER */
/* ========================================= */

.section-header {

  display: flex;

  align-items: center;

  gap: 14px;

}

.section-icon {

  width: 46px;

  height: 46px;

  border-radius: 50%;

  background: #eaf7f6;

  color: #0f8f8c;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* ========================================= */
/* TIPO */
/* ========================================= */

.agregar-tipo {

  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 5px;

  margin-top: 0px;

  margin-bottom: 14px;

  font-size: 12px;

  color: #64748b;

}

/* ========================================= */
/* PLAN */
/* ========================================= */

.plan-card {

  padding: 20px;

  border-radius: 14px;

  border-color: #35b7b0 !important;

  background: #f3fbfa;

}

.plan-price {

  font-size: 26px;

  font-weight: 700;

  color: #0f8f8c;

}

.plan-price span {

  font-size: 14px;

  font-weight: 400;

  color: #64748b;

}

.beneficio {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 9px;

  font-size: 14px;

}

.beneficio .v-icon {

  color: #0f8f8c;

}

/* ========================================= */
/* PAGO */
/* ========================================= */

.pago-container {

  max-width: 500px;

  margin-left: auto;

  margin-right: auto;

}

.qr-container {

  width: 100%;

  height: 100%;

  margin: 0 auto;

  border: 1px solid #e2e8f0;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: white;

}

/* ========================================= */
/* FINALIZAR */
/* ========================================= */

.finalizar-container {

  max-width: 600px;

  margin: 0 auto;

  text-align: center;

  padding: 40px 10px;

}

.success-icon {

  width: 100px;

  height: 100px;

  margin: 0 auto;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #0f8f8c;

  color: white;

  box-shadow: 0 0 0 14px #eaf7f6;

}

/* ========================================= */
/* ACCIONES */
/* ========================================= */

.acciones {

  display: flex;

  align-items: center;

  gap: 12px;

}

/* ========================================= */
/* COMO FUNCIONA */
/* ========================================= */

.como-funciona {

  padding: 10px;

}

.funciona-item {

  display: flex;

  align-items: flex-start;

  gap: 12px;

}

.funciona-icon {

  min-width: 42px;

  height: 42px;

  border-radius: 50%;

  background: #eaf7f6;

  color: #0f8f8c;

  display: flex;

  align-items: center;

  justify-content: center;

}

/* ========================================= */
/* TOOLBAR */
/* ========================================= */

.registro-toolbar {

  min-height: 58px;

}

.registro-title {

  font-size: 1.1rem;

  font-weight: 700;

  color: #0b5f63;

  line-height: 1.2;

}

.registro-subtitle {

  margin-top: 3px;

  font-size: 0.68rem;

  font-weight: 400;

  color: #64748b;

  line-height: 1.2;

}

.toolbar-spacer {

  width: 34px;

  min-width: 34px;

}

/* ========================================= */
/* RESPONSIVE */
/* ========================================= */

@media (max-width: 600px) {

  .registro-container {

    padding-left: 10px !important;

    padding-right: 10px !important;

  }

  .stepper {

    min-width: 440px;

  }

  .step-label {

    font-size: 10px;

  }

  .agregar-tipo {

    flex-direction: column;

    align-items: flex-end;

  }

  .acciones {

    flex-wrap: wrap;

  }

  .acciones .v-spacer {

    display: none;

  }

  .acciones .v-btn {

    flex: 1;

  }

}
</style>
