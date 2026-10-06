<template>
<div class="pagina">

  <!-- =====================================================
         HEADER
    ====================================================== -->
  <div class="header">
    <div>
      <h1>Mi información</h1>
      <p>Configura la información que verán tus clientes.</p>
    </div>
  </div>

  <!-- =====================================================
         VISTA PREVIA
    ====================================================== -->
  <section class="preview-card">

    <!-- PORTADA -->
    <div class="portada">
      <img v-if="previewPortada" :src="previewPortada" alt="Portada" />

      <div v-else class="portada-placeholder">
        <v-icon size="28">mdi-image-outline</v-icon>
        <span>Portada</span>
      </div>

      <label class="btn-foto portada-btn">
        <v-icon size="17">mdi-camera</v-icon>

        <input type="file" accept="image/*" @change="seleccionarPortada" />
      </label>
    </div>

    <!-- FOTO -->
    <div class="foto-container">

      <div class="foto">
        <img v-if="previewFoto" :src="previewFoto" alt="Foto profesional" />

        <div v-else class="foto-placeholder">
          <v-icon size="30">mdi-account</v-icon>
        </div>
      </div>

      <label class="btn-foto foto-btn">
        <v-icon size="15">mdi-camera</v-icon>

        <input type="file" accept="image/*" @change="seleccionarFoto" />
      </label>

    </div>

    <!-- INFORMACIÓN PRINCIPAL -->
    <div class="preview-info">

      <div class="nombre-row text-capitalize">
        <strong>{{ profesional.nombre || 'Nombre del profesional' }}</strong>

        <v-icon v-if="profesional.verificado" size="18" color="#0fa3a8">
          mdi-check-decagram
        </v-icon>
      </div>

      <div class="profesion text-capitalize">
        {{ nombreEspecialista || 'Profesional de belleza' }}
      </div>

      <div class="rating">
        <v-icon size="16">mdi-star</v-icon>
        <strong>{{ profesional.calificacion }}</strong>
        <span>({{ profesional.cantidad_calificaciones }} reseñas)</span>
      </div>

    </div>

    <!-- ESTADÍSTICAS -->
    <div class="estadisticas">

      <div>
        <strong>{{ experienciaTexto }}</strong>
        <span>de experiencia</span>
      </div>

      <div>
        <strong>{{ profesional.clientes_atendidos }}+</strong>
        <span>clientes satisfechos</span>
      </div>

      <div>
        <strong>Especialista</strong>
        <span>{{ nombreEspecialista }}</span>
      </div>

    </div>

  </section>

  <!-- =====================================================
         TIPOS DE PROFESIONAL
    ====================================================== -->
  <section class="card">

    <div class="section-title">
      <v-icon>mdi-account-star-outline</v-icon>

      <div>
        <strong>Especialidades</strong>
        <span>Selecciona hasta 3 especialidades.</span>
      </div>
    </div>

    <v-select v-model="profesional.tipos" :items="tiposProfesional" item-title="nombre" item-value="id" label="Mis especialidades" placeholder="Selecciona tus especialidades" variant="outlined" density="compact" multiple chips closable-chips hide-details="auto" :rules="[validarTipos]" @update:model-value="limitarTipos" />

    <div class="contador">
      {{ profesional.tipos.length }} / 3 seleccionadas
    </div>

  </section>

  <!-- =====================================================
         EXPERIENCIA
    ====================================================== -->
  <section class="card">

    <div class="section-title">
      <v-icon>mdi-calendar-account</v-icon>

      <div>
        <strong>Experiencia profesional</strong>
        <span>Cuéntales desde cuándo trabajas.</span>
      </div>
    </div>

    <v-text-field v-model="profesional.fecha_trabajo" label="Fecha de inicio" type="date" variant="outlined" density="compact" hide-details />

  </section>

  <!-- =====================================================
         SOBRE MÍ
    ====================================================== -->
  <section class="card">

    <div class="section-title">
      <v-icon>mdi-account-edit-outline</v-icon>

      <div>
        <strong>Sobre mí</strong>
        <span>Presenta tu experiencia y forma de trabajar.</span>
      </div>
    </div>

    <v-textarea v-model="profesional.descripcion" label="Descripción" placeholder="Cuéntales un poco sobre ti, tu experiencia y tu forma de trabajar..." variant="outlined" density="compact" rows="5" auto-grow maxlength="500" counter hide-details="auto" />

  </section>

  <!-- =====================================================
         LEMA
    ====================================================== -->
  <section class="card">

    <div class="section-title">
      <v-icon>mdi-format-quote-close</v-icon>

      <div>
        <strong>Mi lema</strong>
        <span>Una frase que represente tu trabajo.</span>
      </div>
    </div>

    <v-text-field v-model="profesional.lema" label="Lema" placeholder="Ej.: Tu estilo, tu mejor versión." variant="outlined" density="compact" maxlength="150" hide-details />

    <div v-if="profesional.lema" class="lema-preview">
      <v-icon size="27">mdi-format-quote-open</v-icon>

      <div>
        "{{ profesional.lema }}"
        <strong>— {{ profesional.nombre || 'Profesional' }}</strong>
      </div>
    </div>

  </section>

  <!-- =====================================================
        QR
    ====================================================== -->
  <section class="card">

    <div class="section-title">
      <v-icon size="24">mdi-qrcode</v-icon>

      <div>
        <strong>QR para recibir pagos</strong>
        <span>
          Sube el código QR que utilizarán tus clientes para realizar sus pagos.
        </span>
      </div>
    </div>

    <!-- VISTA PREVIA DEL QR -->
    <div class="qr-preview-container">

      <div class="qr-preview">

        <img v-if="previewQr" :src="previewQr" alt="Código QR de pago" />

        <div v-else class="qr-placeholder">
          <v-icon size="70">
            mdi-qrcode
          </v-icon>

          <strong>Vista previa del QR</strong>

          <span>
            Aquí aparecerá tu código QR
          </span>
        </div>

      </div>

    </div>

    <!-- ACCIONES -->
    <div class="qr-actions">

      <label class="btn-qr">
        <v-icon size="19">
          mdi-qrcode-edit
        </v-icon>

        {{ previewQr?'Cambiar código QR' : 'Subir código QR' }}

        <input type="file" accept="image/png,image/jpeg,image/webp" @change="seleccionarQr" />
      </label>

      <button v-if="previewQr" type="button" class="btn-delete" @click="eliminarQr">
        <v-icon size="18">
          mdi-delete-outline
        </v-icon>

        Eliminar QR
      </button>

    </div>

    <div class="qr-info">
      <v-icon size="17">
        mdi-information-outline
      </v-icon>

      <span>
        Recomendamos subir una imagen clara y de buena calidad.
      </span>
    </div>

  </section>

  <!-- =====================================================
         GUARDAR
    ====================================================== -->
  <div class="guardar-container">

    <v-btn block class="btn-guardar" :loading="guardando" @click="guardar">
      <v-icon size="18">mdi-content-save-outline</v-icon>
      Guardar información
    </v-btn>

  </div>

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>
</template>

<script>
import { getProfessionalsTypes } from '@/modules/publico/modules/profesional/services/profesional.api';
import { getDataProfessional, updateProfessional } from '../services/profesional.api';
import { getFileUrl } from '@/utils/ayuda';

export default {

  data() {
    return {

      guardando: false,

      profesional: {
        id: null,

        nombre: 'Roli',

        verificado: true,

        tipos: [],

        fecha_trabajo: '',

        descripcion: '',

        lema: '',

        foto: null,

        portada: null,

        qr: null,
      },

      tiposProfesional: [],

      previewFoto: null,

      previewPortada: null,

      previewQr: null,
      overlay: false,
    }
  },

  computed: {
    nombresTipos() {

      if (!this.profesional.tipos.length) {
        return ''
      }

      return this.profesional.tipos
        .map(id => {

          const tipo = this.tiposProfesional
            .find(t => t.id === id)

          return tipo?.nombre

        })
        .filter(Boolean)
        .join(' · ')
    },
    nombreEspecialista() {
      if (!this.profesional.tipos.length) {
        return ''
      }
      return this.profesional.tipos[0]?.nombre || 'en Belleza'
    },

    experienciaTexto() {

      if (!this.profesional.fecha_trabajo) {
        return '0 años'
      }

      const inicio = new Date(
        this.profesional.fecha_trabajo
      )

      const ahora = new Date()

      let años =
        ahora.getFullYear() -
        inicio.getFullYear()

      const mes =
        ahora.getMonth() -
        inicio.getMonth()

      if (
        mes < 0 ||
        (
          mes === 0 &&
          ahora.getDate() < inicio.getDate()
        )
      ) {
        años--
      }

      if (años < 0) {
        años = 0
      }

      return `+${años} años`
    }
  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {
    getFileUrl,

    // =====================================================
    // LIMITAR TIPOS
    // =====================================================
    async obtenerTiposProfesional() {
      try {
        this.overlay = true

        const res = await getProfessionalsTypes()

        if (res.data.ok) {
          this.tiposProfesional = res.data.data
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
        })
      } finally {
        this.overlay = false
      }
    },

    limitarTipos(value) {

      if (value.length > 3) {

        this.profesional.tipos =
          value.slice(0, 3)

        return
      }

      this.profesional.tipos = value
    },

    validarTipos(value) {

      if (!value || value.length === 0) {
        return 'Selecciona al menos una especialidad'
      }

      if (value.length > 3) {
        return 'Máximo 3 especialidades'
      }

      return true
    },

    // =====================================================
    // FOTO
    // =====================================================

    seleccionarFoto(event) {

      const archivo =
        event.target.files?. [0]

      if (!archivo) return

      this.profesional.foto = archivo

      this.previewFoto =
        URL.createObjectURL(archivo)
    },

    // =====================================================
    // PORTADA
    // =====================================================

    seleccionarPortada(event) {

      const archivo =
        event.target.files?. [0]

      if (!archivo) return

      this.profesional.portada = archivo

      this.previewPortada =
        URL.createObjectURL(archivo)
    },

    // =====================================================
    // QR
    // =====================================================

    seleccionarQr(event) {
      const archivo = event.target.files?. [0]

      if (!archivo) return

      this.profesional.qr = archivo
      this.previewQr = URL.createObjectURL(archivo)
    },

    eliminarQr() {
      this.profesional.qr = null
      this.previewQr = null
    },

    async obtenerDatosProfesional() {
      try {
        this.overlay = true

        const res = await getDataProfessional()
        if (res.data.ok) {          
          const data = res.data.data

          // ==========================================
          // DATOS DEL PROFESIONAL
          // ==========================================
          this.profesional = data

          // ==========================================
          // FECHA
          // ==========================================
          this.profesional.fecha_trabajo = this.profesional.fecha_trabajo ? this.profesional.fecha_trabajo.substring(0, 10) : ''

          // ==========================================
          // IMÁGENES EXISTENTES
          // ==========================================
          this.previewFoto = getFileUrl(this.profesional.foto)
          this.previewPortada = getFileUrl(this.profesional.portada)
          this.previewQr = getFileUrl(this.profesional.pago_qr)
        }

      } catch (error) {
        console.log(error)
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })

      } finally {
        this.overlay = false
      }
    },

    // =====================================================
    // GUARDAR
    // =====================================================

    async guardar() {
      try {
        this.overlay = true
        this.guardando = true

        const dataForm = new FormData()

        // ==========================================
        // DATOS DEL PROFESIONAL
        // ==========================================
        dataForm.append('id', String(this.profesional.id))
        dataForm.append('nombre', this.profesional.nombre || '')
        dataForm.append('slug', this.profesional.slug || '')
        dataForm.append('fecha_trabajo', this.profesional.fecha_trabajo || '')
        dataForm.append('descripcion', this.profesional.descripcion || '')
        dataForm.append('lema', this.profesional.lema || '')
        dataForm.append('estado', this.profesional.estado || 'ACTIVO')
        dataForm.append('estado_funciones', this.profesional.estado_funciones || 'HABILITADO')

        // ==========================================
        // TIPOS DE PROFESIONAL
        // ==========================================
        const tiposIds = (this.profesional.tipos || []).map(tipo => typeof tipo === 'object' ? tipo.id : tipo).filter(id => id != null)
        dataForm.append('tipos', JSON.stringify(tiposIds))

        // ==========================================
        // ARCHIVOS
        // ==========================================
        if (this.profesional.foto instanceof File) {
          dataForm.append('foto', this.profesional.foto)
        }

        if (this.profesional.portada instanceof File) {
          dataForm.append('portada', this.profesional.portada)
        }

        if (this.profesional.qr instanceof File) {
          dataForm.append('qr', this.profesional.qr)
        }

        if (!this.profesional.qr && !this.profesional.portada && !this.profesional.foto) {
          this.$swal({
            title: "Error!",
            text: "Debe agregar una imagen!",
            icon: "error",
            timer: 2500
          })
          return
        }

        // ==========================================
        // ENVIAR AL BACKEND
        // ==========================================
        const res = await updateProfessional(dataForm)
        if (res.status === 200) {
          this.$swal({
            title: "Datos Profesional Guardado!",
            text: "Se ha guardado los datos del profesional correctamente!",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.$router.go(-1)
            }
          })
        }
      } catch (error) {
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })
      } finally {
        this.overlay = false
        this.guardando = false
      }
    },
  },

  mounted() {
    this.obtenerDatosProfesional()
    this.obtenerTiposProfesional()
  }
}
</script>

<style lang="scss" scoped>
.pagina {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;

  padding: 12px 10px 90px;

  color: #17324d;
}

// =====================================================
// HEADER
// =====================================================

.header {
  margin-bottom: 12px;

  h1 {
    margin: 0;

    font-size: 23px;
    font-weight: 700;
    line-height: 1.2;
  }

  p {
    margin: 4px 0 0;

    font-size: 11.5px;
    color: #718096;
  }
}

// =====================================================
// PREVIEW
// =====================================================

.preview-card {
  position: relative;

  overflow: hidden;

  background: white;

  border: 1px solid #e5edf0;

  border-radius: 15px;

  box-shadow: 0 2px 8px rgba(0, 0, 0, .04);

  margin-bottom: 10px;
}

.portada {
  position: relative;

  height: 118px;

  background: #edf5f6;

  overflow: hidden;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }
}

.portada-placeholder {
  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 3px;

  color: #8ca2ad;

  font-size: 10px;
}

.foto-container {
  position: relative;

  margin-top: -35px;

  margin-left: 15px;

  width: 72px;
}

.foto {
  width: 72px;
  height: 72px;

  border-radius: 50%;

  overflow: hidden;

  background: white;

  border: 3px solid white;

  box-shadow: 0 1px 5px rgba(0, 0, 0, .12);

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }
}

.foto-placeholder {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #edf5f6;

  color: #7d969f;
}

.btn-foto {
  position: absolute;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #0fa3a8;

  color: white;

  cursor: pointer;

  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);

  input {
    display: none;
  }
}

.portada-btn {
  width: 32px;
  height: 32px;

  right: 10px;
  bottom: 10px;
}

.foto-btn {
  width: 25px;
  height: 25px;

  right: -2px;
  bottom: 0;
}

.preview-info {
  padding: 7px 15px 10px;
}

.nombre-row {
  display: flex;

  align-items: center;

  gap: 5px;

  font-size: 21px;
}

.profesion {
  margin-top: 1px;

  font-size: 13px;

  color: #627789;
}

.rating {
  display: flex;

  align-items: center;

  gap: 4px;

  margin-top: 4px;

  font-size: 12px;

  color: #627789;

  .v-icon {
    color: #f6a623;
  }
}

// =====================================================
// ESTADISTICAS
// =====================================================

.estadisticas {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  border-top: 1px solid #edf1f2;

  padding: 11px 5px;

  text-align: center;

  >div {
    display: flex;

    flex-direction: column;

    gap: 2px;

    border-right: 1px solid #edf1f2;

    &:last-child {
      border-right: none;
    }
  }

  strong {
    font-size: 12px;
  }

  span {
    font-size: 10px;
    color: #7b8d98;
  }
}

// =====================================================
// CARD
// =====================================================

.card {
  background: white;

  border: 1px solid #e5edf0;

  border-radius: 13px;

  padding: 12px;

  margin-bottom: 9px;

  box-shadow: 0 1px 5px rgba(0, 0, 0, .025);
}

.section-title {
  display: flex;

  align-items: flex-start;

  gap: 9px;

  margin-bottom: 10px;

  .v-icon {
    color: #0fa3a8;
    margin-top: 1px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 14px;
  }

  span {
    font-size: 11px;
    color: #7a8d97;
  }
}

.contador {
  margin-top: 5px;

  text-align: right;

  font-size: 9px;

  color: #80919a;
}

// =====================================================
// LEMA
// =====================================================

.lema-preview {
  display: flex;

  gap: 8px;

  margin-top: 9px;

  padding: 10px;

  border-radius: 9px;

  background: #eef9fa;

  color: #38566a;

  font-size: 12px;

  line-height: 1.4;

  .v-icon {
    color: #0fa3a8;
  }

  strong {
    display: block;

    margin-top: 3px;

    font-size: 10px;
  }
}

// =====================================================
// QR
// =====================================================

.qr-preview-container {
  width: 100%;

  display: flex;

  justify-content: center;

  margin: 14px 0 13px;
}

.qr-preview {
  width: 210px;
  height: 210px;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: white;

  border: 2px dashed #b7cdd2;

  border-radius: 14px;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, .05);

  img {
    width: 100%;
    height: 100%;

    object-fit: contain;

    padding: 8px;
  }
}

.qr-placeholder {
  width: 100%;
  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 7px;

  text-align: center;

  color: #82959d;

  .v-icon {
    color: #0fa3a8;

    opacity: .75;
  }

  strong {
    font-size: 13px;

    color: #526b77;
  }

  span {
    max-width: 150px;

    font-size: 10.5px;

    line-height: 1.4;
  }
}

.qr-actions {
  display: flex;

  flex-direction: column;

  gap: 8px;

  width: 100%;
}

.btn-qr,
.btn-delete {
  width: 100%;

  min-height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  border-radius: 8px;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;
}

.btn-qr {
  background: #0fa3a8;

  color: white;

  input {
    display: none;
  }
}

.btn-delete {
  background: #fff8f8;

  border: 1px solid #eadada;

  color: #b45c5c;
}

.qr-info {
  display: flex;

  align-items: flex-start;

  gap: 6px;

  margin-top: 10px;

  padding: 9px 10px;

  border-radius: 8px;

  background: #f3f8f9;

  color: #617984;

  font-size: 10px;

  line-height: 1.4;

  .v-icon {
    flex-shrink: 0;

    color: #0fa3a8;
  }
}

// =====================================================
// GUARDAR
// =====================================================

.guardar-container {
  margin-top: 5px;
}

.btn-guardar {
  height: 40px !important;

  border-radius: 9px;

  background: #0fa3a8 !important;

  color: white !important;

  font-size: 11.5px;

  font-weight: 600;

  text-transform: none;
}

// =====================================================
// VUETIFY
// =====================================================

:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-field__input) {
  min-height: 44px;

  font-size: 12px;
}

:deep(.v-label) {
  font-size: 12px;
}

:deep(.v-chip) {
  font-size: 10.5px;

  height: 28px;
}

:deep(.v-textarea .v-field__input) {
  font-size: 12.5px;
  line-height: 1.5;
}

// =====================================================
// RESPONSIVE
// =====================================================

@media (max-width: 360px) {

  .pagina {
    padding-left: 8px;
    padding-right: 8px;
  }

  .portada {
    height: 105px;
  }

  .qr-preview {
    width: 250px;
    height: 400px;
  }

}
</style>
