<template>
<div class="perfil-page">

  <!-- CABECERA -->
  <div class="perfil-header">

    <button class="btn-volver" @click="$router.back()">
      <v-icon size="22">mdi-arrow-left</v-icon>
    </button>

    <strong class="logo">PIA</strong>

    <div class="header-actions">
      <v-icon size="22">mdi-share-variant-outline</v-icon>
      <v-icon size="23">mdi-heart-outline</v-icon>
    </div>

  </div>

  <!-- INFORMACIÓN BÁSICA -->
  <div v-if="profesional" class="profesional-resumen">

    <div class="foto-container">
      <img v-if="profesional.profesional?.foto" :src="getFileUrl(profesional.profesional.foto)" :alt="profesional.profesional.nombre" />

      <v-icon v-else size="45">
        mdi-account
      </v-icon>
    </div>

    <div class="profesional-datos">

      <h1>
        {{ profesional.profesional.nombre }}
      </h1>

      <div class="tipo-profesional">
        {{ profesional.profesional.tipos?.map(t => t.nombre).join(', ') }}
      </div>

      <div class="calificacion">
        <v-icon size="17">mdi-star</v-icon>

        <strong>
          {{ profesional.profesional.calificacion || 0 }}
        </strong>

        <span>
          ({{ profesional.profesional.cantidad_calificaciones || 0 }})
        </span>
      </div>

    </div>

  </div>

  <!-- TABS -->
  <div class="tabs">

    <button :class="{ activo: tab === 'informacion' }" @click="tab = 'informacion'">
      <v-icon size="17">mdi-information-outline</v-icon>
      Información
    </button>

    <button :class="{ activo: tab === 'servicios' }" @click="tab = 'servicios'">
      <v-icon size="17">mdi-content-cut</v-icon>
      Servicios
    </button>

    <button :class="{ activo: tab === 'resenas' }" @click="tab = 'resenas'">
      <v-icon size="17">mdi-star</v-icon>
      Reseñas
    </button>

  </div>

  <!-- CONTENIDO -->
  <div v-if="profesional" class="tab-content">
    
    <InformacionProfesionalAdmin v-if="tab === 'informacion'" :profesional="profesional.profesional" :galeria="galeria"/>

    <ServiciosProfesionalAdmin v-if="tab === 'servicios'" :servicios="profesional.servicios"/>

    <ResenaProfesinalAdmin v-if="tab === 'resenas'" :profesional="profesional" />

  </div>

</div>
</template>

<script>
import InformacionProfesionalAdmin from '../components/InformacionProfesionalAdmin.vue'
import ServiciosProfesionalAdmin from '../components/ServiciosProfesionalAdmin.vue'
import ResenaProfesinalAdmin from '../components/ResenaProfesinalAdmin.vue'

import { getProfessionalBySlug } from '../services/profesional.api'
import { getFileUrl } from '@/utils/ayuda.js';

export default {

  components: {
    InformacionProfesionalAdmin,
    ServiciosProfesionalAdmin,
    ResenaProfesinalAdmin
  },

  data() {
    return {
      tab: 'informacion',
      profesional: null,
      galeria: [],
      cargando: false
    }
  },

  async mounted() {
    await this.cargarProfesional()
  },

  methods: {

    getFileUrl,

    async cargarProfesional() {

      try {

        this.cargando = true

        const slug = this.$route.params.slug

        const response = await getProfessionalBySlug(slug)
        this.profesional = response.data.data
        this.galeria = response.data.data.galeria

      } catch (error) {

        console.error(
          'Error al obtener profesional:',
          error
        )

      } finally {

        this.cargando = false

      }

    }

  }

}
</script>

<style lang="scss" scoped>
.perfil-page {
  width: 100%;
  min-height: 100vh;
  background: #fff;
}

/* HEADER */

.perfil-header {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  border-bottom: 1px solid #eeeeee;
}

.logo {
  font-size: 23px;
  color: #07979b;
}

.btn-volver {
  border: none;
  background: transparent;
  cursor: pointer;
}

.header-actions {
  display: flex;
  gap: 16px;
}

/* RESUMEN */

.profesional-resumen {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px;
  padding-bottom: 3px;
}

.foto-container {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.foto-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profesional-datos h1 {
  margin: 0;
  font-size: 20px;
  color: #123b60;
}

.tipo-profesional {
  margin-top: 3px;
  font-size: 13px;
  color: #607d8b;
}

.calificacion {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  font-size: 13px;
}

.calificacion .v-icon {
  color: #f5a623;
}

/* TABS */

.tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid #eeeeee;
}

.tabs button {
  position: relative;
  border: none;
  background: transparent;
  padding: 12px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #607d8b;
  font-size: 12px;
  cursor: pointer;
}

.tabs button.activo {
  color: #07979b;
  font-weight: 600;
}

.tabs button.activo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  right: 15%;
  height: 2px;
  background: #07979b;
}

/* CONTENIDO */

.tab-content {
  padding: 14px;
}
</style>
