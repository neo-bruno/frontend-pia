<template>
<v-card class="professional-card" elevation="0" rounded="xl" @click="$emit('click', profesional)">
  <!-- FOTOGRAFÍA -->
  <div class="card-image-wrap">
    <v-img :src="profesional.foto ? getFileUrl(profesional.foto) : undefined" :alt="`Fotografía de ${profesional.nombre}`" height="156" cover class="card-image">
      <template #placeholder>
        <div class="image-placeholder">
          <v-icon size="42" color="grey-lighten-1">
            mdi-account-circle
          </v-icon>
        </div>
      </template>

      <template #error>
        <div class="image-placeholder">
          <v-icon size="42" color="grey-lighten-1">
            mdi-account-circle
          </v-icon>
        </div>
      </template>
    </v-img>

    <!-- POSICIÓN -->
    <v-chip v-if="profesional.posicion != null" class="ranking-chip" size="small" color="white" variant="flat">
      <v-icon start size="13" color="amber-darken-2">
        mdi-trophy-outline
      </v-icon>
      {{ profesional.posicion }}
    </v-chip>

    <!-- FAVORITO -->
    <v-btn class="favorite-btn" icon size="32" variant="flat" :loading="profesional.procesandoFavorito" :disabled="profesional.procesandoFavorito" :aria-label=" profesional.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'" @click.stop="$emit('favorito', profesional)">
      <v-icon size="21" :color="profesional.favorito ? 'primary' : '#0F8F8C'">
        {{
          profesional.favorito
            ? 'mdi-heart'
            : 'mdi-heart-outline'
        }}
      </v-icon>
    </v-btn>

    <!-- INDICADOR DE PERFIL -->
    <div v-if="profesional.verificado" class="verified-chip">
      <v-icon size="12">mdi-check-decagram</v-icon>
      <span>Verificado</span>
    </div>
  </div>

  <!-- INFORMACIÓN -->
  <div class="professional-card-content">
    <div class="professional-name" :title="profesional.nombre">
      {{ profesional.nombre || "Profesional de belleza" }}
    </div>

    <div class="professional-role" :title="profesional.profesion">
      {{ profesional.profesion || "Especialista en belleza" }}
    </div>

    <!-- VALORACIÓN -->
    <div class="professional-rating">
      <v-icon size="15" color="amber-darken-2">
        mdi-star
      </v-icon>

      <span class="rating-value">
        {{ formatearRating(profesional.rating) }}
      </span>

      <span class="review-count">
        ({{ profesional.reseñas ?? 0 }} reseñas)
      </span>
    </div>

    <!-- PRECIO -->
    <div class="professional-footer">
      <span class="price-label">Servicios desde: </span>

      <span class="professional-price">
        {{ profesional.precio || "Consultar" }}
      </span>
    </div>
  </div>
</v-card>
</template>

<script>
import {
  getFileUrl
} from "@/utils/ayuda";

export default {
  name: "TarjetaProfesional",

  props: {
    profesional: {
      type: Object,
      required: true,
    },
  },

  emits: ["click", "favorito"],

  methods: {
    getFileUrl,

    formatearRating(valor) {
      if (valor === null || valor === undefined || valor === "") {
        return "Nuevo";
      }

      const numero = Number(valor);

      return Number.isFinite(numero) ?
        numero.toFixed(1) :
        "Nuevo";
    },
  },
};
</script>

<style scoped>
.professional-card {
  width: 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.045);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.professional-card:active {
  transform: scale(0.985);
}

@media (hover: hover) {
  .professional-card:hover {
    box-shadow: 0 7px 20px rgba(15, 23, 42, 0.1);
    transform: translateY(-2px);
  }
}

.card-image-wrap {
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
}

.card-image {
  width: 100%;
}

.image-placeholder {
  display: flex;
  width: 100%;
  height: 156px;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.ranking-chip {
  position: absolute;
  top: 8px;
  left: 8px;
  height: 25px;
  padding-inline: 7px;
  color: #0f172a !important;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.1);
}

.favorite-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 2px 7px rgba(15, 23, 42, 0.1);
}

.verified-chip {
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 7px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  color: #008f8c;
  font-size: 10px;
  font-weight: 700;
}

.professional-card-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 11px 10px 12px;
}

.professional-name {
  overflow: hidden;
  color: #102a56;
  font-size: 13px;
  font-weight: 750;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow-wrap: anywhere;
}

.professional-role {
  min-height: 15px;
  overflow: hidden;
  color: #64748b;
  font-size: 11px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow-wrap: anywhere;
}

.professional-rating {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 4px;
  min-width: 0;  
}

.rating-value {
  color: #334155;
  font-size: 11px;
  font-weight: 700;
}

.review-count {
  overflow: hidden;
  color: #94a3b8;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.professional-footer {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;  
  padding-top: 3px;
  border-top: 1px solid #f1f5f9;
}

.price-label {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 3px;
}

.professional-price {
  max-width: 100%;
  color: #008f8c;
  font-size: 13px;
  font-weight: 800;
  overflow-wrap: anywhere;
  
}

@media (max-width: 360px) {
  .professional-card-content {
    padding: 9px 8px 10px;
  }

  .professional-name {
    font-size: 12px;
  }

  .review-count {
    font-size: 9px;
  }
}
</style>
