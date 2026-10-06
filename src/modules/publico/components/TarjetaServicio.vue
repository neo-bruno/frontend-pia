<template>
<v-card class="service-card" elevation="0" rounded="xl" @click="$emit('click')">
  <!-- IMAGEN -->
  <v-img :src="servicio.imagen" height="120" cover />

  <!-- CONTENIDO -->
  <v-card-item class="pa-2">

    <div class="service-name">
      {{ servicio.nombre }}
    </div>

    <div class="service-business">
      {{ servicio.negocio }}
    </div>

    <div class="service-price">
      Bs. {{ servicio.precio }}
    </div>

  </v-card-item>
</v-card>
</template>

<script>
export default {
  name: "TarjetaServicio",

  props: {
    servicio: {
      type: Object,
      required: true,
    },
  },

  emits: ["click"],
};
</script>

<style scoped>
.service-card {
  overflow: hidden;
  border: 1px solid #e4e9ed;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(16, 35, 63, 0.08) !important;
  cursor: pointer;
}

.service-name {
  color: #10233f;
  font-size: 12px;
  line-height: 15px;
  font-weight: 800;
}

.service-business {
  margin-top: 2px;
  color: #637589;
  font-size: 9px;
  line-height: 12px;
}

.service-price {
  margin-top: 6px;
  color: #087f7d;
  font-size: 11px;
  line-height: 14px;
  font-weight: 800;
}
</style>
