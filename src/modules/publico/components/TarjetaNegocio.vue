
<template>
  <v-card
    class="business-card"
    elevation="0"
    rounded="xl"
    @click="$emit('click', negocio)"
  >
    <!-- PORTADA -->
    <div class="card-image-wrap">
      <v-img
        :src="imagenNegocio"
        height="145"
        cover
        class="card-image"
        :alt="negocio.nombre || 'Imagen del negocio'"
      >
        <template #placeholder>
          <div class="image-placeholder">
            <v-icon size="36">mdi-store-outline</v-icon>
          </div>
        </template>

        <template #error>
          <div class="image-placeholder">
            <v-icon size="36">mdi-store-outline</v-icon>
            <span>Sin imagen disponible</span>
          </div>
        </template>
      </v-img>

      <!-- DISTANCIA: solo si tenemos un dato real -->
      <div v-if="negocio.distanciaTexto" class="distance-chip">
        <v-icon size="13">mdi-navigation</v-icon>
        {{ negocio.distanciaTexto }}
      </div>

      <!-- FAVORITO -->
      <v-btn class="favorite-btn" icon size="30" variant="flat" aria-label="Agregar o quitar de favoritos" @click.stop="$emit('favorito', negocio)">
        <v-icon size="21" :color="negocio.favorito ? 'primary' : '#0F8F8C'">
          {{ negocio.favorito ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
      
    </div>

    <!-- INFORMACIÓN DEL NEGOCIO -->
    <div class="business-card-content">
      <!-- NOMBRE -->
      <h3 class="business-name">
        {{ negocio.nombre || 'Negocio de belleza' }}
      </h3>

      <!-- CALIFICACIÓN -->
      <div class="business-rating">
        <v-icon size="17" color="#F5A623">
          mdi-star
        </v-icon>

        <strong>{{ mostrarRating }}</strong>

        <span class="business-reviews">
          ({{ cantidadResenas }} reseñas)
        </span>
      </div>

      <!-- UBICACIÓN -->
      <div class="business-location">
        <v-icon color="primary" size="15">mdi-map-marker</v-icon>

        <span>
          {{
            negocio.ubicacion ||
            [negocio.municipio, negocio.departamento]
              .filter(Boolean)
              .join(', ') ||
            'Ubicación no disponible'
          }}
        </span>
      </div>

      <!-- ESPECIALIDADES -->
      <div
        v-if="especialidadesNegocio.length"
        class="business-specialties"
      >
        <span
          v-for="especialidad in especialidadesNegocio"
          :key="especialidad"
          class="specialty-chip"
        >
          {{ especialidad }}
        </span>
      </div>

      <!-- DESCRIPCIÓN BREVE, SI EXISTE -->
      <!-- <p v-if="negocio.eslogan || negocio.descripcion" class="business-description">
        {{ negocio.eslogan || negocio.descripcion }}
      </p> -->

      <!-- ACCIÓN -->
      <div class="business-card-footer">
        <span>Ver negocio</span>
        <v-icon size="18">mdi-chevron-right</v-icon>
      </div>
    </div>
  </v-card>
</template>


<script>
export default {
  name: "TarjetaNegocio",

  props: {
    negocio: {
      type: Object,
      required: true,
    },
  },

  emits: ["click", "favorito"],

  computed: {
    imagenNegocio() {
      const ruta =
        this.negocio.imagen_portada ||
        this.negocio.portada ||
        this.negocio.logo ||
        this.negocio.imagen;

      if (!ruta) return null;

      // Si ya es una URL absoluta, conservarla.
      if (/^https?:\/\//i.test(ruta)) {
        return ruta;
      }

      // Resolver rutas relativas contra el backend de PIA.
      const baseURL = import.meta.env.VITE_SERVER_URL;

      if (!baseURL) {
        console.error("Falta configurar VITE_SERVER_URL");
        return null;
      }

      return `${baseURL.replace(/\/+$/, "")}/${ruta.replace(/^\/+/, "")}`;
    },

    logoNegocio() {
      return (
        this.negocio.logo ||
        this.negocio.imagen ||
        null
      );
    },

    cantidadResenas() {
      return Number(
        this.negocio.resenas ??
        this.negocio.reseñas ??
        0
      );
    },

    mostrarRating() {
      const rating = Number(this.negocio.rating);

      return Number.isFinite(rating) && rating > 0
        ? rating.toFixed(1)
        : "Nuevo";
    },
    
    especialidadesNegocio() {
      const datos =
        this.negocio.especialidades ||
        this.negocio.servicios ||
        [];

      if (!Array.isArray(datos)) return [];

      return datos
        .map((item) => {
          if (typeof item === "string") return item;
          return item?.nombre || item?.nombre_servicio || "";
        })
        .filter(Boolean)
        .slice(0, 3);
    },

  },
};
</script>

<style scoped>
/* ========================================= */
/* TARJETA DEL NEGOCIO                       */
/* ========================================= */

.business-card {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e7edf1;
  background: #ffffff;
  box-shadow: 0 3px 14px rgb(26 52 78 / 5%);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.business-card:active {
  transform: scale(0.985);
  box-shadow: 0 5px 18px rgb(26 52 78 / 10%);
}

/* ========================================= */
/* PORTADA                                   */
/* ========================================= */

.card-image-wrap {
  position: relative;
  overflow: hidden;
  background: #e8f6f4;
}

.card-image {
  width: 100%;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  color: #66818b;
  background: linear-gradient(135deg, #e6f7f4, #f3f8fc);
  font-size: 12px;
}

/* ========================================= */
/* CATEGORÍA                                 */
/* ========================================= */


.business-card {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e5eeee;
  background: #fff;
  box-shadow: 0 3px 12px rgb(20 50 75 / 6%);
  cursor: pointer;
}

.card-image-wrap {
  position: relative;
  overflow: hidden;
  background: #e8f6f4;
}

.card-image {
  width: 100%;
}

.image-placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #079b98;
  background: linear-gradient(135deg, #e4f7f4, #f2f7fb);
  font-size: 11px;
}

.favorite-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
}

.distance-chip {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 20px;
  color: #fff;
  background: rgb(0 137 132 / 92%);
  font-size: 10px;
  font-weight: 700;
}

.business-card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 10px;
}

.business-name {
  margin: 0;
  color: #102653;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.business-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #079b98;
  font-size: 12px;
}

.business-rating strong {
  font-weight: 800;
}

.business-reviews {
  color: #8190a4;
  font-size: 10px;
}

.business-location {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  color: #718096;
  font-size: 10px;
  line-height: 1.4;
}

.business-location .v-icon {
  flex-shrink: 0;
}

.business-location span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.business-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.specialty-chip {
  max-width: 100%;
  padding: 4px 7px;
  overflow: hidden;
  border-radius: 12px;
  color: #087f7d;
  background: #e3f7f4;
  font-size: 9px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-description {
  display: -webkit-box;
  margin: 1px 0 0;
  overflow: hidden;
  color: #8290a3;
  font-size: 10px;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.business-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-top: 3px;
  padding-top: 8px;
  border-top: 1px solid #edf2f3;
  color: #079b98;
  font-size: 11px;
  font-weight: 800;
}

@media (max-width: 400px) {
  .business-card-content {
    padding: 9px;
    gap: 6px;
  }

  .business-name {
    font-size: 13px;
  }
}


.business-category-chip {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  max-width: calc(100% - 64px);
  padding: 6px 10px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 65%);
  border-radius: 20px;
  color: #164d53;
  background: rgb(255 255 255 / 94%);
  font-size: 10px;
  font-weight: 600;
}

.business-category-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ========================================= */
/* FAVORITOS                                 */
/* ========================================= */

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #526579;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

/* ========================================= */
/* DESTACADO                                 */
/* ========================================= */

.business-featured-chip {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 8px;
  color: #80540b;
  background: #fff6dc;
  font-size: 10px;
  font-weight: 700;
}

/* ========================================= */
/* CONTENIDO                                 */
/* ========================================= */

.business-card-content {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px;
}

/* NOMBRE */

.business-name-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
}

.business-name {
  flex: 1;
  min-width: 0;
  margin: 0;
  color: #172d52;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

/* UBICACIÓN */

.business-location {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  min-width: 0;
  color: #718096;
  font-size: 11px;
  line-height: 1.4;
}

.business-location .v-icon {
  flex-shrink: 0;
}

.business-location span {
  min-width: 0;
  overflow-wrap: anywhere;
}

/* CALIFICACIÓN Y PRECIO */

.business-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.business-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #31435a;
  font-size: 12px;
}

.business-rating strong {
  font-weight: 800;
}

.business-reviews {
  color: #8793a3;
  font-size: 10px;
}

.business-price {
  padding: 5px 9px;
  border-radius: 8px;
  color: #087f78;
  background: #e9f8f5;
  font-size: 11px;
  font-weight: 700;
}

/* DESCRIPCIÓN */

.business-description {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #66768a;
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* PIE */

.business-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 4px;
  border-top: 1px solid #edf1f4;
  color: #008f8c;
  font-size: 12px;
  font-weight: 700;
}

/* ========================================= */
/* MÓVIL                                     */
/* ========================================= */

@media (max-width: 400px) {
  .business-card-content {
    gap: 4px;
    padding: 6px;
  }

  .business-name {
    font-size: 14px;
  }

  .card-image-wrap :deep(.v-img) {
    min-height: 150px;
  }
}
</style>
