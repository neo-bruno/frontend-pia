<template>
<v-card class="business-card" elevation="0" rounded="lg" @click="$emit('click', negocio)">
  <!-- IMAGEN -->
  <div class="card-image-wrap">
    <v-img :src="negocio.imagen" height="130" class="card-image" />

    <!-- POSICIÓN -->
    <v-chip class="ranking-chip" size="small" color="primary" variant="flat">
      {{ negocio.posicion }}
    </v-chip>

    <!-- FAVORITO -->    
    <v-btn class="favorite-btn" icon size="27" variant="flat" @click.stop="$emit('favorito', negocio)">
      <v-icon size="17" color="primary">
        {{
            negocio.favorito
              ? "mdi-heart"
              : "mdi-heart-outline"
          }}
      </v-icon>
    </v-btn>
  </div>

  <!-- INFORMACIÓN -->
  <v-card-item class="business-card-content pa-2">

    <!-- NOMBRE -->
    <div class="business-name-row">
      <div class="business-name">
        {{ negocio.nombre }}
      </div>

      <v-icon v-if="negocio.verificado" size="15" color="primary">
        mdi-check-decagram
      </v-icon>
    </div>

    <!-- RATING / PRECIO -->
    <div class="business-meta">

      <span class="rating">
        <v-icon size="12">
          mdi-star
        </v-icon>

        {{ negocio.rating }}
      </span>

      <span>
        ({{ negocio.reseñas }})
      </span>

      <span class="separator">
        ·
      </span>

      <span class="price">
        {{ negocio.precio }}
      </span>

    </div>

    <!-- UBICACIÓN -->
    <div class="business-location">

      <v-icon size="12">
        mdi-map-marker-outline
      </v-icon>

      <span>
        {{ negocio.ubicacion }}
      </span>

    </div>

    <!-- DESTACADO -->
    <v-chip class="featured-chip mt-2" size="x-small" variant="flat">
      Destacado
    </v-chip>

  </v-card-item>
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
};
</script>

<style scoped>
.business-card {
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease;
}

.business-card:active {
  transform: scale(0.98);
}

.card-image-wrap {
  position: relative;
}

.card-image {
  border-radius: 0;
}

.ranking-chip {
  position: absolute;
  top: 7px;
  left: 7px;
  min-width: 27px;
  justify-content: center;
  font-weight: 700;
}

.favorite-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgba(255, 255, 255, 0.95);
}

.business-card-content {
  min-height: 112px;
}

.business-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.business-name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-meta {
  display: flex;
  align-items: center;
  gap: 4px;

  margin-top: 5px;

  font-size: 11px;
  color: #64748b;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #0f9f9a;
  font-weight: 600;
}

.separator {
  color: #94a3b8;
}

.price {
  font-weight: 600;
}

.business-location {
  display: flex;
  align-items: center;
  gap: 3px;

  margin-top: 4px;

  font-size: 10px;
  color: #64748b;

  overflow: hidden;
}

.business-location span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.featured-chip {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>
