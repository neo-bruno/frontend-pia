<template>
<v-card class="professional-card" elevation="0" rounded="lg" @click="$emit('click', profesional)">
  <!-- IMAGEN -->
  <div class="card-image-wrap">

    <v-img :src="getFileUrl(profesional.foto)" height="200" cover class="card-image" />

    <!-- POSICIÓN -->
    <v-chip class="ranking-chip" size="small" color="primary" variant="flat">
      {{ profesional.posicion }}
    </v-chip>
    
    <!-- FAVORITO -->
    <v-btn class="favorite-btn" icon size="27" variant="flat" @click.stop="$emit('favorito', profesional)">
      <v-icon size="17" color="primary">
        {{
            profesional.favorito
              ? "mdi-heart"
              : "mdi-heart-outline"
          }}
      </v-icon>
    </v-btn>

  </div>

  <!-- INFORMACIÓN -->
  <v-card-item class="professional-card-content pa-2">

    <!-- NOMBRE -->
    <div class="professional-name">
      {{ profesional.nombre }}
    </div>

    <!-- PROFESIÓN -->
    <div class="professional-role">
      {{ profesional.profesion }}
    </div>

    <!-- RATING / PRECIO -->
    <div class="professional-meta">

      <span class="rating">
        <v-icon size="11">
          mdi-star
        </v-icon>

        {{ profesional.rating }}
      </span>

      <span>
        ({{ profesional.reseñas }})
      </span>

      <span class="separator">
        ·
      </span>

      <span class="price">
        {{ profesional.precio }}
      </span>

    </div>

  </v-card-item>
</v-card>
</template>

<script>
import { getFileUrl } from '@/utils/ayuda';

export default {
  name: "TarjetaProfesional",

  props: {
    profesional: {
      type: Object,
      required: true,
    },
  },

  emits: ["click", "favorito"],

  methods:{
    getFileUrl,
  }
};
</script>

<style scoped>
.professional-card {
  width: 100%;
  height: 100%;
  overflow: hidden;

  border: 1px solid rgba(15, 23, 42, 0.08);

  transition: transform 0.2s ease;
}

.professional-card:active {
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
  top: 6px;
  left: 6px;

  min-width: 25px;
  justify-content: center;

  font-weight: 700;
}

.favorite-btn {
  position: absolute;
  top: 6px;
  right: 6px;

  background: rgba(255, 255, 255, 0.95);
}

.professional-card-content {
  min-height: 70px;
}

.professional-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.professional-role {
  margin-top: 2px;

  font-size: 10px;
  color: #64748b;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.professional-meta {
  display: flex;
  align-items: center;
  gap: 3px;

  margin-top: 5px;

  font-size: 10px;
  color: #64748b;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;

  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.separator {
  color: #94a3b8;
}

.price {
  font-weight: 600;
}
</style>
