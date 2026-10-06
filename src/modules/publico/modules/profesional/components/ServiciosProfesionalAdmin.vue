<template>
<div class="servicios-profesional">

  <!-- ENCABEZADO -->
  <section class="servicios-section">

    <div class="section-title">
      <v-icon size="18">mdi-briefcase-outline</v-icon>
      <strong>Mis servicios</strong>
    </div>

    <p class="section-description">
      Servicios especializados en cuidado y belleza profesional
    </p>

  </section>

  <!-- LISTA DE SERVICIOS -->
  <section v-if="servicios.length" class="servicios-list">

    <div v-for="servicio in servicios" :key="servicio.id" class="servicio-card" @click="mostrarServicio(servicio)">

      <!-- IMAGEN -->
      <div class="servicio-imagen">

        <img v-if="getFotoServicio(servicio)" :src="getFileUrl(getFotoServicio(servicio).url)" :alt="servicio.nombre" />

        <v-icon v-else size="30">
          mdi-image-outline
        </v-icon>

      </div>

      <!-- INFORMACIÓN -->
      <div class="servicio-contenido">

        <!-- FILA 1: NOMBRE -->
        <div class="servicio-nombre">
          {{ servicio.nombre }}
        </div>

        <span class="servicio-duracion">
          {{ servicio.duracion }} minutos
        </span>

        <strong class="servicio-precio">
            Bs {{ servicio.precio }}
          </strong>

        <!-- FILA 2: INFORMACIÓN -->
        <div class="servicio-detalles">

          <div class="servicio-descripcion">           

            <span v-if="servicio.descripcion" class="servicio-texto">
              {{ servicio.descripcion }}
            </span>

          </div>          

          <v-icon size="18" class="servicio-arrow">
            mdi-chevron-right
          </v-icon>

        </div>

      </div>

    </div>

  </section>

  <!-- SIN SERVICIOS -->
  <div v-else class="sin-servicios">
    <v-icon size="32">
      mdi-briefcase-outline
    </v-icon>

    <span>
      Este profesional aún no tiene servicios registrados.
    </span>
  </div>

</div>

<DescripcionServicioProfesionalAdmin v-if="servicioSeleccionadoId" v-model="dialogServicio" :servicio-id="servicioSeleccionadoId"/>
</template>

<script>
import DescripcionServicioProfesionalAdmin from './DescripcionServicioProfesionalAdmin.vue';
import { getFileUrl } from '@/utils/ayuda';

export default {

  name: 'ServiciosProfesionalAdmin',

  props: {
    servicios: {
      type: Array,
      default: () => []
    }
  },

  components:{
    DescripcionServicioProfesionalAdmin,
  },

  data(){
    return{
      servicioSeleccionadoId: null,
      dialogServicio: false,
    }
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

    getFotoServicio(servicio) {

      if (!servicio?.archivos?.length) {
        return null
      }

      const fotos = servicio.archivos
        .filter(archivo => archivo.tipo === 'FOTO')
        .sort((a, b) => {

          if (a.principal && !b.principal) return -1
          if (!a.principal && b.principal) return 1

          return Number(a.orden || 0) - Number(b.orden || 0)
        })

      return fotos[0] || null
    },
  }

}
</script>

<style lang="scss" scoped>
.servicios-profesional {
  width: 100%;
}

/* =========================
   ENCABEZADO
========================= */

.servicios-section {
  margin-bottom: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 7px;

  color: #123b63;
  font-size: 15px;
}

.section-title .v-icon {
  color: #0fa3a8;
}

.section-description {
  margin: 4px 0 0 25px;

  color: #718397;
  font-size: 10px;
  line-height: 1.4;
}

/* =========================
   LISTA
========================= */

.servicios-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* =========================
   TARJETA
========================= */

.servicio-card {
  width: 100%;
  min-height: 78px;

  display: flex;
  align-items: stretch;

  overflow: hidden;

  border: 1px solid #e3e9ed;
  border-radius: 10px;

  background: #fff;
}

/* =========================
   IMAGEN
========================= */

.servicio-imagen {
  width: 78px;
  min-width: 78px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: #f1f4f5;
}

.servicio-imagen img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.servicio-imagen .v-icon {
  color: #a8b5bd;
}

/* =========================
   CONTENIDO
========================= */

.servicio-contenido {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;

  padding: 8px 7px 7px 10px;
}

/* =========================
   NOMBRE
========================= */

.servicio-nombre {
  width: 100%;

  color: #123b63;

  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* =========================
   DETALLES
========================= */

.servicio-detalles {
  flex: 1;

  display: flex;
  align-items: flex-end;

  min-width: 0;  
}

.servicio-descripcion {
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.servicio-duracion {
  margin-top: 2px;
  color: #607589;
  font-size: 9px;
  line-height: 1.2;
}

.servicio-texto {

  color: #718397;

  font-size: 9px;
  line-height: 1.25;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

/* =========================
   PRECIO
========================= */

.servicio-precio {
  margin-top: 4px;  
  color: #0fa3a8;

  font-size: 13px;
  white-space: nowrap;
}

/* =========================
   FLECHA
========================= */

.servicio-arrow {
  margin-left: 3px;

  color: #54718b;
}

/* =========================
   SIN SERVICIOS
========================= */

.sin-servicios {
  min-height: 120px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 8px;

  color: #8a9aa8;

  text-align: center;
  font-size: 11px;
}

/* =========================
   MÓVIL
========================= */

@media (max-width: 600px) {

  .servicio-card {
    min-height: 76px;
  }

  .servicio-imagen {
    width: 76px;
    min-width: 76px;
    height: 76px;
  }

  .servicio-contenido {
    padding: 7px 6px 6px 9px;
  }

  .servicio-nombre {
    font-size: 12px;
  }

  .servicio-precio {
    font-size: 12px;
  }

}
</style>
