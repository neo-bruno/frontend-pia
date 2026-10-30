<template>
<v-card :id="`servicio-${servicio.servicio_id || servicio.id}`" class="service-card" elevation="0" rounded="xl" @click="$emit('click', servicio)">
  <!-- IMAGEN DEL SERVICIO -->
  <div class="service-image-wrapper">
    <v-img :src="getFileUrl(servicio.imagen)" class="service-image" cover :alt="servicio.servicio_nombre || servicio.nombre || 'Servicio de belleza'">
      <template #placeholder>
        <div class="image-placeholder">
          <v-icon size="34" color="#079b98">
            mdi-image-outline
          </v-icon>
        </div>
      </template>

      <!-- DISTANCIA -->
      <div v-if="distancia" class="service-distance">
        <v-icon size="13">mdi-map-marker</v-icon>
        <span>{{ distancia }}</span>
      </div>

      <!-- ETIQUETA DE DESCUENTO -->
      <div v-if="tieneDescuento" class="discount-badge">
        <v-icon size="14">mdi-tag</v-icon>
        Bs {{ ahorroTexto }} OFF
      </div>
    </v-img>

    <!-- FAVORITOS -->
    <v-btn class="favorite-button" icon size="36" variant="flat" :aria-label="
          servicio.favorito
           ?'Quitar de favoritos'
            : 'Agregar a favoritos'
        " @click.stop="$emit('favorito', servicio)">
      <v-icon color="primary" size="24">
        {{ servicio.favorito?'mdi-heart' : 'mdi-heart-outline' }}
      </v-icon>
    </v-btn>
  </div>

  <!-- INFORMACIÓN DEL SERVICIO -->
  <div class="service-content">
    <!-- NOMBRE -->
    <div class="service-name" :title="nombreServicio">
      {{ nombreServicio }}
    </div>

    <!-- VALORACIÓN Y PRECIO -->
    <div class="service-rating-price">
      <div class="service-rating">
        <v-icon color="#ffba08" size="18">
          {{ tieneValoracion?'mdi-star' : 'mdi-star-outline' }}
        </v-icon>

        <span class="rating-value">
          {{ tieneValoracion?ratingTexto : '0.0' }}
        </span>

        <span class="rating-count">
          ({{ resenasTexto }})
        </span>
      </div>

      <!-- PRECIO SIN DESCUENTO -->
      <div v-if="tieneDescuento" class="service-prices">
        <span class="original-price">
          Bs {{ precioOriginalTexto }}
        </span>

        <span class="service-price discounted-price">
          Bs {{ precioFinalTexto }}
        </span>
      </div>

      <!-- PRECIO NORMAL -->
      <div v-else class="service-price">
        Bs {{ precioOriginalTexto }}
      </div>
    </div>

    <!-- UBICACIÓN -->
    <div v-if="ubicacion" class="service-location" :title="ubicacion">
      <v-icon size="18" color="primary">
        mdi-map-marker
      </v-icon>

      <span>{{ ubicacion }}</span>
    </div>

    <!-- NEGOCIO SI NO HAY UBICACIÓN -->
    <div v-else-if="servicio.negocio || servicio.negocio_nombre" class="service-business">
      {{ servicio.negocio || servicio.negocio_nombre }}
    </div>
  </div>
</v-card>
</template>

<script>
import {
  getFileUrl
} from '@/utils/ayuda';

export default {
  name: 'TarjetaServicio',

  props: {
    servicio: {
      type: Object,
      required: true,
    },
  },

  emits: ['click', 'favorito'],

  computed: {
    nombreServicio() {
      return (
        this.servicio.servicio_nombre ||
        this.servicio.nombre ||
        'Servicio de belleza'
      );
    },

    rating() {
      return Number(this.servicio.rating) || 0;
    },

    resenas() {
      return Number(
        this.servicio.resenas??
        this.servicio.total_resenas??
        0
      ) || 0;
    },

    tieneValoracion() {
      return this.rating > 0 || this.resenas > 0;
    },

    ratingTexto() {
      return this.rating.toFixed(1);
    },

    resenasTexto() {
      return this.resenas.toLocaleString('es-BO');
    },

    precioOriginal() {
      return Number(this.servicio.precio) || 0;
    },

    precioFinal() {
      const precio = Number(this.servicio.precio_final);

      return Number.isFinite(precio) ?
        Math.max(0, precio) :
        this.precioOriginal;
    },

    tieneDescuento() {
      if (this.servicio.tiene_descuento !== true) {
        return false;
      }

      return (
        this.precioFinal < this.precioOriginal &&
        this.precioOriginal > 0
      );
    },

    precioOriginalTexto() {
      return this.formatearPrecio(this.precioOriginal);
    },

    precioFinalTexto() {
      return this.formatearPrecio(this.precioFinal);
    },

    ahorroTexto() {
      const ahorro = Number(
        this.servicio.monto_descuento_calculado
      );

      return this.formatearPrecio(
        Number.isFinite(ahorro) ?
        Math.max(0, ahorro) :
        this.precioOriginal - this.precioFinal
      );
    },

    ubicacion() {
      return (
        this.servicio.ubicacion || [
          this.servicio.municipio,
          this.servicio.departamento,
        ].filter(Boolean).join(', ')
      );
    },

    distancia() {
      const valor =
        this.servicio.distancia_km??
        this.servicio.distancia;

      if (
        valor === null ||
        valor === undefined ||
        valor === ''
      ) {
        return '';
      }

      const numero = Number(valor);

      if (!Number.isFinite(numero) || numero < 0) {
        return '';
      }

      return `${numero.toFixed(2)} km`;
    },
  },

  methods: {
    getFileUrl,

    formatearPrecio(valor) {
      return Number(valor || 0).toLocaleString('es-BO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>

<style scoped>
.service-card {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #edf0f3;
  border-radius: 17px !important;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(16, 35, 63, 0.08) !important;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.service-card:active {
  transform: scale(0.985);
}

.service-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #eaf5f3;
}

.service-image {
  height: clamp(112px, 34vw, 185px);
}

.image-placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #eaf5f3;
}

.favorite-button {
  position: absolute !important;
  top: 9px;
  right: 9px;
  z-index: 2;
  width: 36px !important;
  height: 36px !important;
  background: rgba(255, 255, 255, 0.96) !important;
  box-shadow: 0 2px 8px rgba(16, 35, 63, 0.12);
}

/* DISTANCIA */
.service-distance {
  position: absolute;
  bottom: 6px;
  left: 6px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  max-width: calc(100% - 12px);
  padding: 2px 7px;
  border-radius: 18px;
  background: rgba(25, 25, 25, 0.78);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  line-height: 14px;
  white-space: nowrap;
}

/* DESCUENTO */
.discount-badge {
  position: absolute;
  top: 9px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  max-width: calc(100% - 55px);
  padding: 5px 8px;
  border-radius: 7px;
  background: #d92d45;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.2;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.16);
}

.discount-badge span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 11px 12px 12px;
}

.service-name {
  display: -webkit-box;
  overflow: hidden;
  color: #102f61;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.service-rating-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  min-width: 0;
}

.service-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  color: #6c829e;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
}

.rating-value,
.rating-count {
  white-space: nowrap;
}

.service-prices {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  min-width: 0;
}

.original-price {
  color: #8793a3;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: line-through;
  white-space: nowrap;
}

.service-price {
  flex-shrink: 0;
  margin: 0;
  color: #079ba9;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.25;
  white-space: nowrap;
}

.discounted-price {
  color: #d92d45;
}

.service-location {
  display: flex;
  align-items: flex-start;
  gap: 5px;  
  min-width: 0;
  color: #294c78;
  font-size: 11px;
  line-height: 1.4;
}

.service-location .v-icon {
  flex-shrink: 0;
  padding-bottom: 7px;
}

.service-location span {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.service-business {
  overflow: hidden;
  color: #718096;
  font-size: 11px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 600px) {
  .service-image {
    height: clamp(145px, 22vw, 210px);
  }

  .service-content {
    gap: 7px;
    padding: 13px 15px 15px;
  }

  .service-name {
    font-size: 16px;
  }

  .service-rating {
    font-size: 14px;
  }

  .service-price {
    font-size: 20px;
  }

  .service-location {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .service-card {
    border-radius: 14px !important;
  }

  .service-content {
    gap: 4px;
    padding: 9px 9px 10px;
  }

  .service-name {
    font-size: 12px;
  }

  .service-rating {
    gap: 2px;
    font-size: 10px;
  }

  .service-price {
    font-size: 14px;
  }

  .original-price {
    font-size: 10px;
  }

  .discount-badge {
    top: 7px;
    left: 6px;
    padding: 4px 6px;
    font-size: 9px;
  }

  .service-location {
    gap: 3px;
    font-size: 10px;
  }

  .favorite-button {
    top: 6px;
    right: 6px;
    width: 32px !important;
    height: 32px !important;
  }
}
</style>
