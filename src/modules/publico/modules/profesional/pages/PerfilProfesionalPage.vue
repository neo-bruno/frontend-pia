<template>
<div class="perfil-page">

  <!-- HEADER -->
  <header class="header">

    <button class="header-btn" @click="$router.go(-1)">
      <v-icon size="21">
        mdi-arrow-left
      </v-icon>
    </button>

    <div class="logo">
      PIA
    </div>

    <div class="header-actions">

      <button class="header-btn">
        <v-icon size="20">
          mdi-share-variant-outline
        </v-icon>
      </button>

      <button class="header-btn" @click="toggleFavorito">
        <v-icon size="21" :color="favorito?'#0f9999' : undefined">
          {{ favorito?'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </button>

    </div>

  </header>

  <!-- CONTENIDO -->
  <main v-if="profesional" class="contenido">

    <!-- PERFIL -->
    <section class="perfil-card">

      <!-- PORTADA -->
      <div class="portada">

        <img v-if="profesional.portada" :src="getFileUrl(profesional.portada)" :alt="`Portada de ${profesional.nombre}`" />

        <div v-else class="portada-placeholder">
          <v-icon size="40">
            mdi-image-outline
          </v-icon>
        </div>

      </div>

      <!-- INFORMACIÓN DEL PROFESIONAL -->
      <div class="perfil-superior">

        <!-- FOTO -->
        <div class="foto-wrapper">

          <img v-if="profesional.foto" :src="getFileUrl(profesional.foto)" :alt="profesional.nombre" class="foto" />

          <div v-else class="foto-placeholder">
            <v-icon size="38">
              mdi-account
            </v-icon>
          </div>

        </div>

        <!-- DATOS -->
        <div class="perfil-info">

          <div class="nombre-row">

            <h1>
              {{ profesional.nombre }}
            </h1>

            <v-icon v-if="profesional.verificado" size="18" color="#0f9999">
              mdi-check-decagram
            </v-icon>

          </div>

          <div class="profesion">
            {{ nombreEspecialista || 'Profesional de belleza' }}
          </div>

          <div class="rating">

            <v-icon size="16" color="#f5a623">
              mdi-star
            </v-icon>

            <strong>
              {{ Number(profesional.calificacion || 0).toFixed(1) }}
            </strong>

            <span>
              ({{ profesional.cantidad_calificaciones || 0 }} reseñas)
            </span>

          </div>

        </div>

      </div>

      <!-- ESTADÍSTICAS -->
      <div class="estadisticas">

        <div class="estadistica">

          <strong>
            +{{ profesional.anios_experiencia || 0 }}
          </strong>

          <span>
            años de experiencia
          </span>

        </div>

        <div class="estadistica">

          <strong>
            {{ profesional.clientes_atendidos || 0 }}+
          </strong>

          <span>
            clientes satisfechos
          </span>

        </div>

        <div class="estadistica">

          <strong>
            Especialista
          </strong>

          <span>
            {{ nombreEspecialista }}
          </span>

        </div>

      </div>

    </section>

    <!-- NEGOCIO -->
    <section v-if="profesional.negocio" class="negocio-card">

      <div class="negocio-icon">
        <v-icon size="19">
          mdi-map-marker
        </v-icon>
      </div>

      <div class="negocio-info">

        <strong>
          {{ profesional.negocio.nombre }}
        </strong>

        <span>
          {{ profesional.negocio.direccion }}
        </span>

      </div>

      <v-icon size="20">
        mdi-chevron-right
      </v-icon>

    </section>

    <!-- DESCRIPCIÓN -->
    <section class="descripcion">

      <p v-if="profesional.tipos?.length" class="descripcion-especialidades">
        <strong>
          Especialista en
        </strong>

        <span>
          {{ profesional.tipos.map(tipo => tipo.nombre).join(', ') }}.
        </span>
      </p>

      <p v-if="profesional.descripcion" class="descripcion-texto">
        {{ profesional.descripcion }}
      </p>

    </section>

    <!-- ESPECIALIDADES -->
    <section v-if="profesional.tipos?.length" class="especialidades">

      <div v-for="tipo in profesional.tipos" :key="tipo.id" class="especialidad">

        <div class="especialidad-icon">

          <v-icon size="17">
            {{ getIconoEspecialidad(tipo.nombre) }}
          </v-icon>

        </div>

        <span>
          {{ tipo.nombre }}
        </span>

      </div>

    </section>

    <!-- ACCIONES -->
    <section class="acciones-profesional">

      <button class="btn-agendar" @click="agendarCita">
        <v-icon size="20">
          mdi-calendar-outline
        </v-icon>

        <span>
          Agendar cita
        </span>
      </button>

      <button class="btn-ver-perfil" @click="verPerfilProfesional">
        <v-icon size="19">
          mdi-account-outline
        </v-icon>

        <span>
          Ver perfil profesional
        </span>

        <v-icon size="18">
          mdi-chevron-right
        </v-icon>
      </button>

    </section>

    <!-- SERVICIOS DESTACADOS -->
    <section v-if="fotosGaleria.length" class="trabajos-section">

      <div class="section-header">
        <div class="section-title">
          <v-icon size="18">mdi-image-multiple-outline</v-icon>
          <strong>Servicios destacados</strong>
        </div>

        <span>{{ fotosGaleria.length }} servicios</span>
      </div>

      <div class="trabajos-grid">

        <div
          v-for="(foto, index) in fotosGaleria"
          :key="foto.id"
          class="trabajo-item"
          @click="abrirGaleria(index)"
        >
          <img
            :src="getFileUrl(foto.url)"
            :alt="foto.servicio_nombre"
          />

          <div class="trabajo-overlay">
            <v-icon size="20">mdi-magnify-plus-outline</v-icon>
          </div>
        </div>

      </div>

    </section>

    <!-- SERVICIOS -->
    <section v-if="profesional.servicios?.length" class="servicios-section">
      <div class="section-header">
        <div class="section-title">
          <v-icon size="20">
            mdi-room-service
          </v-icon>

          <h2>
            Mis Servicios
          </h2>
        </div>
      </div>

      <div class="servicios-list">

        <div v-for="servicio in profesional.servicios" :key="servicio.id" class="servicio-card" @click="mostrarServicio(servicio)">

          <!-- FOTO -->
          <div class="servicio-imagen">

            <img v-if="servicio.archivos?.find(a => a.tipo === 'FOTO')" :src="getFileUrl(servicio.archivos.find(a => a.tipo === 'FOTO').url)" :alt="servicio.nombre" />

            <v-icon v-else size="28">
              mdi-image-outline
            </v-icon>

          </div>

          <!-- CONTENIDO -->
          <div class="servicio-contenido">

            <!-- FILA 1: NOMBRE -->
            <div class="servicio-nombre">
              {{ servicio.nombre }}
            </div>

            <!-- FILA 2: INFORMACIÓN -->
            <div class="servicio-detalle">

              <div class="servicio-descripcion">

                <span class="servicio-duracion">
                  {{ servicio.duracion }} min
                </span>

                <span v-if="servicio.descripcion" class="servicio-texto">
                  {{ servicio.descripcion }}
                </span>

              </div>

              <strong class="servicio-precio">
                Bs {{ servicio.precio }}
              </strong>

              <v-icon size="20" class="servicio-arrow">
                mdi-chevron-right
              </v-icon>

            </div>

          </div>

        </div>

      </div>
    </section>

  </main>

  <!-- LOADING -->
  <div v-else-if="cargando" class="loading">
    <v-progress-circular indeterminate color="#0f9999" size="38" />
  </div>

  <!-- ERROR -->
  <div v-else class="error">

    <v-icon size="45">
      mdi-account-alert-outline
    </v-icon>

    <strong>
      Profesional no encontrado
    </strong>

    <button @click="$router.go(-1)">
      Volver
    </button>

  </div>

  <!-- BOTTOM NAV -->
  <nav class="bottom-nav">

    <button>
      <v-icon size="20">
        mdi-home-outline
      </v-icon>

      <span>
        Inicio
      </span>
    </button>

    <button>
      <v-icon size="20">
        mdi-heart-outline
      </v-icon>

      <span>
        Favoritos
      </span>
    </button>

    <button class="bottom-center">

      <div class="bottom-avatar">

        <img v-if="profesional?.foto" :src="getFileUrl(profesional.foto)" :alt="profesional.nombre" />

        <v-icon v-else>
          mdi-account
        </v-icon>

      </div>

    </button>

    <button>
      <v-icon size="20">
        mdi-calendar-outline
      </v-icon>

      <span>
        Mis reservas
      </span>
    </button>

    <button>
      <v-icon size="20">
        mdi-account-outline
      </v-icon>

      <span>
        Perfil
      </span>
    </button>

  </nav>

</div>

<!-- VISOR DE GALERÍA -->
<v-dialog v-model="galeriaDialog" fullscreen transition="dialog-bottom-transition">

  <div class="galeria-viewer">

    <!-- HEADER -->
    <div class="galeria-header">      
      <span>
        {{ fotoActualIndex + 1 }} / {{ fotosGaleria.length }}
      </span>

      <div style="width: auto;">Servicios Destacados</div>

      <v-btn icon variant="text" color="white" @click="cerrarGaleria">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- IMAGEN -->
    <div class="galeria-imagen-container">

      <v-btn v-if="fotosGaleria.length > 1" class="galeria-nav galeria-prev" icon variant="text" color="white" @click="fotoAnterior">
        <v-icon size="38">
          mdi-chevron-left
        </v-icon>
      </v-btn>

      <img v-if="fotoActual" class="galeria-imagen" :src="getFileUrl(fotoActual.url)" :alt="fotoActual.nombre" />

      <v-btn v-if="fotosGaleria.length > 1" class="galeria-nav galeria-next" icon variant="text" color="white" @click="fotoSiguiente">
        <v-icon size="38">
          mdi-chevron-right
        </v-icon>
      </v-btn>

    </div>

    <!-- MINIATURAS -->
    <div v-if="fotosGaleria.length > 1" class="galeria-thumbnails">

      <div v-for="(foto, index) in fotosGaleria" :key="foto.id" class="galeria-thumbnail" :class="{
          activa: index === fotoActualIndex
        }" @click="seleccionarFoto(index)">

        <img :src="getFileUrl(foto.url)" :alt="foto.nombre" />

      </div>

    </div>

  </div>
</v-dialog>

<DescripcionServicioProfesionalAdmin v-if="servicioSeleccionadoId" v-model="dialogServicio" :servicio-id="servicioSeleccionadoId"/>
</template>

<script>
import DescripcionServicioProfesionalAdmin from '../components/DescripcionServicioProfesionalAdmin.vue';

import { getFileUrl } from '@/utils/ayuda'
import { getProfessionalBySlug } from '../services/profesional.api'

export default {
  name: 'PerfilProfesionalPage',

  components: {
    DescripcionServicioProfesionalAdmin,
  },

  data() {
    return {
      cargando: true,
      favorito: false,
      profesional: null,

      galeriaDialog: false,
      fotoActualIndex: 0,

      servicioSeleccionadoId: null,
      dialogServicio: false,
    }
  },

  computed: {

    nombreEspecialista() {
      return this.profesional?.tipos?. [0]?.nombre || ''
    },

    galeriaFotos() {
      return (this.profesional?.galeria || [])
        .filter(item => item.tipo === 'FOTO')
        .sort((a, b) => {
          return Number(a.orden || 0) - Number(b.orden || 0)
        })
    },
    fotosGaleria() {
      return (this.profesional.servicios || [])
        .map(servicio => {
          const foto = (servicio.archivos || [])
            .filter(archivo => archivo.tipo === 'FOTO')
            .sort((a, b) => a.orden - b.orden)[0]

          if (!foto) return null

          return {
            ...foto,
            servicio_id: servicio.id,
            servicio_nombre: servicio.nombre
          }
        })
        .filter(Boolean)
    },

    fotoActual() {
      return this.fotosGaleria[this.fotoActualIndex] || null
    },

  },

  methods: {

    getFileUrl,

    mostrarServicio(item){
      this.servicioSeleccionadoId = item.id      
      this.dialogServicio = true
    },
    agendarServicio(){
      console.log()
    },

    getIconoEspecialidad(nombre) {

      const nombreNormalizado = String(nombre || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      if (
        nombreNormalizado.includes('barber') ||
        nombreNormalizado.includes('corte') ||
        nombreNormalizado.includes('estilist')
      ) {
        return 'mdi-content-cut'
      }

      if (
        nombreNormalizado.includes('peluquer') ||
        nombreNormalizado.includes('peinad')
      ) {
        return 'mdi-hair-dryer'
      }

      if (
        nombreNormalizado.includes('manicur') ||
        nombreNormalizado.includes('unas')
      ) {
        return 'mdi-hand-back-left'
      }

      if (nombreNormalizado.includes('pedicur')) {
        return 'mdi-foot-print'
      }

      if (nombreNormalizado.includes('maquill')) {
        return 'mdi-face-woman-shimmer'
      }

      if (
        nombreNormalizado.includes('color') ||
        nombreNormalizado.includes('tinte')
      ) {
        return 'mdi-palette'
      }

      if (
        nombreNormalizado.includes('ceja') ||
        nombreNormalizado.includes('pestana')
      ) {
        return 'mdi-eye-outline'
      }

      if (
        nombreNormalizado.includes('facial') ||
        nombreNormalizado.includes('estetic')
      ) {
        return 'mdi-face-woman-outline'
      }

      return 'mdi-sparkles'
    },

    abrirGaleria(index) {
      this.fotoActualIndex = index
      this.galeriaDialog = true
    },

    cerrarGaleria() {
      this.galeriaDialog = false
    },

    seleccionarFoto(index) {
      this.fotoActualIndex = index
    },

    fotoAnterior() {
      if (!this.fotosGaleria.length) return

      this.fotoActualIndex =
        this.fotoActualIndex === 0
          ? this.fotosGaleria.length - 1
          : this.fotoActualIndex - 1
    },

    fotoSiguiente() {
      if (!this.fotosGaleria.length) return

      this.fotoActualIndex =
        this.fotoActualIndex === this.fotosGaleria.length - 1
          ? 0
          : this.fotoActualIndex + 1
    },

    async obtenerProfesional() {
      try {
        this.cargando = true

        const slug = this.$route.params.slug

        const res = await getProfessionalBySlug(slug)
        if (!res.data.ok) {
          this.profesional = null
          return
        }

        this.profesional = {
          ...res.data.data.profesional,
          negocio: res.data.data.negocio,
          galeria: res.data.data.galeria || [],
          servicios: res.data.data.servicios || []
        }

      } catch (error) {

        console.error('Error obteniendo profesional:', error)

        this.profesional = null

        this.$swal({
          title: 'Error',
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'No se pudo obtener la información del profesional.',
          icon: 'error',
          timer: 2500
        })

      } finally {

        this.cargando = false

      }

    },

    toggleFavorito() {
      this.favorito = !this.favorito
    },

    agendarCita() {
      this.$router.push({name: 'horario', params: { profesionalId: this.profesional.id}})
    },

    verPerfilProfesional() {
      this.$router.push({
        name: 'ver-perfil-profesional',
        params: {
          slug: this.profesional.slug
        }
      })
    },

    verServicios() {
      console.log('Ver servicios:', this.profesional.servicios)
    }

  },

  mounted() {
    this.obtenerProfesional()
  }
}
</script>

<style lang="scss" scoped>
.perfil-page {
  min-height: 100vh;
  background: #ffffff;
  color: #17324d;
  padding-bottom: 75px;
}

/* HEADER */

.header {
  height: 58px;
  padding: 0 13px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #ffffff;
  border-bottom: 1px solid #eeeeee;

  position: sticky;
  top: 0;
  z-index: 20;
}

.logo {
  color: #0f9999;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: .3px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.header-btn {
  width: 38px;
  height: 38px;

  border: none;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #17324d;
  cursor: pointer;
}

/* CONTENIDO */

.contenido {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* PERFIL */

.perfil-card {
  background: #ffffff;
}

.portada {
  width: 100%;
  height: 205px;

  overflow: hidden;
  background: #edf6f6;
}

.portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portada-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8aa8ad;
}

/* FOTO */

.perfil-superior {
  display: flex;
  align-items: flex-start;

  padding: 0 16px;
}

.foto-wrapper {
  width: 76px;
  height: 76px;

  margin-top: -38px;
  flex-shrink: 0;

  position: relative;
  z-index: 2;

  border: 4px solid #ffffff;
  border-radius: 50%;

  overflow: hidden;

  background: #edf6f6;

  box-shadow: 0 2px 7px rgba(0, 0, 0, .12);
}

.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-placeholder {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8ba1a5;
}

/* INFORMACIÓN */

.perfil-info {
  min-width: 0;
  padding: 8px 0 10px 14px;
}

.nombre-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nombre-row h1 {
  margin: 0;

  font-size: 21px;
  line-height: 1.2;
  font-weight: 750;

  text-transform: capitalize;
}

.profesion {
  margin-top: 3px;

  font-size: 13px;
  color: #536f7d;
}

.rating {
  margin-top: 5px;

  display: flex;
  align-items: center;

  gap: 4px;

  font-size: 12px;
}

.rating strong {
  font-size: 13px;
}

.rating span {
  color: #6d818b;
}

/* ESTADÍSTICAS */

.estadisticas {
  padding: 1px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

.estadistica {
  min-height: 40px;
  padding: 0px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  border-right: 1px solid #eeeeee;
}

.estadistica:last-child {
  border-right: none;
}

.estadistica strong {
  font-size: 13px;
  color: #17324d;
}

.estadistica span {
  margin-top: 3px;

  font-size: 10px;
  line-height: 1.2;

  color: #72828b;
}

/* NEGOCIO */

.negocio-card {
  margin: 10px 16px 0;
  padding: 10px 12px;

  display: flex;
  align-items: center;

  gap: 10px;

  border-radius: 20px;
  background: #f4fbfb;

  cursor: pointer;
}

.negocio-icon {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #dff3f3;
  color: #0f9999;
}

.negocio-info {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.negocio-info strong {
  font-size: 13px;
}

.negocio-info span {
  margin-top: 2px;

  font-size: 10px;
  color: #71828b;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* DESCRIPCIÓN */

.descripcion {
  padding: 13px 18px 5px;
}

.descripcion p {
  margin: 0;

  font-size: 12px;
  line-height: 1.55;

  color: #526b76;
}

.descripcion-especialidades {
  margin-bottom: 5px !important;
}

.descripcion-especialidades strong {
  color: #17324d;
}

/* ESPECIALIDADES */

.especialidades {
  padding: 8px 16px 10px;

  display: flex;
  gap: 7px;
}

.especialidad {
  flex: 1;
  min-height: 42px;

  padding: 7px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  border-radius: 9px;
  background: #f2fafa;

  color: #0f777a;

  text-align: center;
}

.especialidad-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.especialidad span {
  font-size: 10px;
}

/* ACCIONES */

.acciones-profesional {
  width: 100%;
  padding: 5px 16px 15px;

  display: flex;
  flex-direction: column;

  gap: 9px;
}

/* AGENDAR */

.btn-agendar {
  width: 100%;
  height: 47px;

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

/* VER PERFIL */

.btn-ver-perfil {
  width: 100%;
  height: 44px;

  border: 1px solid #d6e8e8;
  border-radius: 9px;

  background: #ffffff;
  color: #0f777a;

  display: flex;
  align-items: center;

  justify-content: center;

  gap: 7px;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background .2s ease,
    border-color .2s ease,
    transform .15s ease;
}

.btn-ver-perfil:hover {
  background: #f3fafa;
  border-color: #b9dcdc;
}

.btn-ver-perfil:active {
  transform: scale(.98);
}

.btn-ver-perfil .v-icon:last-child {
  margin-left: 2px;
}

/* GALERÍA */

.galeria-section {
  padding: 5px 16px 18px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 9px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;

  color: #17324d;
}

.section-title .v-icon {
  color: #0f9999;
}

.section-header h2 {
  margin: 0;

  font-size: 15px;
  font-weight: 700;
}

.section-header>span {
  font-size: 10px;
  color: #72828b;
}

/* GRID DE GALERÍA */

.galeria-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 4px;
}

.galeria-item {
  width: 100%;
  aspect-ratio: 1 / 1;

  overflow: hidden;

  border-radius: 7px;

  background: #edf6f6;
}

.galeria-item img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition: transform .25s ease;
}

.galeria-item:hover img {
  transform: scale(1.04);
}

/* SERVICIOS */

.servicios-section {
  padding: 20px 16px 20px;
}

.section-header button {
  border: none;
  background: transparent;

  color: #0f9999;

  font-size: 10px;

  display: flex;
  align-items: center;

  gap: 2px;

  cursor: pointer;
}

.servicios-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.servicio-card {
  min-height: 55px;

  padding: 10px 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #e5eeee;
  border-radius: 9px;

  background: #ffffff;
}

.servicio-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.servicio-info strong {
  font-size: 13px;
  color: #17324d;
}

.servicio-info span {
  font-size: 10px;
  color: #72828b;
}

.servicio-precio {
  color: #0f9999;
  font-size: 13px;
}

/* LOADING */

.loading {
  min-height: 70vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* ERROR */

.error {
  min-height: 70vh;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 12px;

  color: #72828b;
}

.error strong {
  color: #17324d;
}

.error button {
  border: none;
  border-radius: 8px;

  padding: 9px 18px;

  background: #0f9999;
  color: white;

  cursor: pointer;
}

/* BOTTOM NAV */

.bottom-nav {
  position: fixed;

  left: 50%;
  bottom: 0;

  transform: translateX(-50%);

  width: 100%;
  max-width: 600px;

  height: 66px;

  display: grid;
  grid-template-columns: repeat(5, 1fr);

  background: #ffffff;

  border-top: 1px solid #eeeeee;

  z-index: 30;
}

.bottom-nav button {
  border: none;
  background: transparent;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 3px;

  color: #72828b;

  font-size: 9px;

  cursor: pointer;
}

.bottom-nav button .v-icon {
  color: #607985;
}

.bottom-center {
  position: relative;
}

.bottom-avatar {
  width: 43px;
  height: 43px;

  margin-top: -22px;

  border: 3px solid #ffffff;
  border-radius: 50%;

  overflow: hidden;

  background: #edf6f6;

  box-shadow: 0 2px 7px rgba(0, 0, 0, .15);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8ba1a5;
}

.bottom-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

/* MÓVIL */

@media (max-width: 360px) {

  .portada {
    height: 190px;
  }

  .foto-wrapper {
    width: 72px;
    height: 72px;

    margin-top: -36px;
  }

  .nombre-row h1 {
    font-size: 19px;
  }

  .especialidades {
    gap: 5px;
  }

  .especialidad {
    padding: 6px 4px;
  }

  .especialidad span {
    font-size: 9px;
  }

  .galeria-grid {
    gap: 3px;
  }
}

.servicios-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.servicio-card {
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 12px;

  min-height: 90px;
  padding: 8px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #edf5f0;
}

/* =========================
   IMAGEN
========================= */

.servicio-imagen {
  width: 62px;
  height: 62px;

  border-radius: 8px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f1f5f9;
}

.servicio-imagen img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  display: block;
}

/* =========================
   CONTENIDO
========================= */

.servicio-contenido {
  min-width: 0;

  display: grid;
  grid-template-rows: auto 1fr;

  align-content: center;
}

/* =========================
   FILA 1
========================= */

.servicio-nombre {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;

  color: #0f172a;

  margin-bottom: 5px;

  white-space: normal;
}

/* =========================
   FILA 2
========================= */

.servicio-detalle {
  display: flex;
  align-items: center;

  min-width: 0;
  gap: 8px;
}

.servicio-descripcion {
  min-width: 0;

  display: flex;
  flex-direction: column;

  flex: 1;
}

.servicio-duracion {
  font-size: 12px;
  color: #64748b;
  line-height: 1.2;
}

.servicio-texto {
  margin-top: 2px;

  font-size: 11px;
  color: #64748b;

  line-height: 1.2;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

.servicio-precio {
  flex-shrink: 0;

  font-size: 14px;
  color: #0f9fa3;

  white-space: nowrap;
}

.servicio-arrow {
  flex-shrink: 0;
  color: #94a3b8;
}

/* ========================================
   MIS TRABAJOS
======================================== */

.trabajos-section {
  margin-top: 0px;
  padding: 14px;  
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #123b5d;
}

.section-title strong {
  font-size: 16px;
}

.section-header > span {
  font-size: 11px;
  color: #777;
}


/* ========================================
   GRID DE FOTOS
======================================== */

.trabajos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.trabajo-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
  background: #f2f2f2;
}

.trabajo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.trabajo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  color: white;
  opacity: 0;
  transition: all 0.2s ease;
}

.trabajo-item:hover .trabajo-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.25);
}


/* ========================================
   VISOR
======================================== */

.galeria-viewer {
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}


/* HEADER */

.galeria-header {
  height: 58px;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: white;
  background: #000;
}

.galeria-header span {
  font-size: 14px;
  font-weight: 500;
}


/* ========================================
   IMAGEN GRANDE
======================================== */

.galeria-imagen-container {
  position: relative;
  flex: 1;
  min-height: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  overflow: hidden;
}

.galeria-imagen {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}


/* ========================================
   BOTONES ANTERIOR / SIGUIENTE
======================================== */

.galeria-nav {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  background: rgba(0, 0, 0, 0.45) !important;
}

.galeria-prev {
  left: 8px;
}

.galeria-next {
  right: 8px;
}


/* ========================================
   MINIATURAS
======================================== */

.galeria-thumbnails {
  height: 82px;
  min-height: 82px;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 10px;

  overflow-x: auto;

  background: #000;
}

.galeria-thumbnail {
  width: 64px;
  height: 64px;
  min-width: 64px;

  border-radius: 5px;
  overflow: hidden;

  cursor: pointer;

  opacity: 0.55;
  border: 2px solid transparent;
}

.galeria-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.galeria-thumbnail.activa {
  opacity: 1;
  border-color: #0fa3a8;
}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {

  .galeria-header {
    height: 52px;
    min-height: 52px;
  }

  .galeria-thumbnails {
    height: 72px;
    min-height: 72px;
  }

  .galeria-thumbnail {
    width: 54px;
    height: 54px;
    min-width: 54px;
  }

}
</style>
