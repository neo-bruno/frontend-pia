<template>
<button type="button" class="categoria-card" :class="{ seleccionada: seleccionada }" @click="$emit('seleccionar', categoria)">
  <div class="categoria-icono">
    <v-icon size="31">
      {{ categoria.icono || "mdi-help-circle-outline" }}
    </v-icon>
  </div>

  <div class="categoria-contenido">
    <h3>{{ categoria.nombre }}</h3>
    <p>{{ categoria.descripcion }}</p>
  </div>

  <v-icon class="categoria-flecha">
    mdi-chevron-right
  </v-icon>
</button>
</template>

<script>
export default {
  name: "CategoriaAyudaCard",

  props: {
    categoria: {
      type: Object,
      required: true,
    },

    seleccionada: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["seleccionar"],
};
</script>

<style lang="scss" scoped>
.categoria-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  min-height: 150px;
  padding: 13px;
  border: 1px solid #e2eaf0;
  border-radius: 19px;
  background: #ffffff;
  color: #102653;
  text-align: left;
  box-shadow: 0 4px 12px rgba(20, 65, 110, 0.07);
  transition: 0.2s ease;

  &.seleccionada {
    border-color: #008f9b;
    background: #e9f9f7;
  }
}

.categoria-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 53px;
  height: 53px;
  margin-bottom: 7px;
  border-radius: 15px;
  background: #d9f5f0;
  color: #008f9b;
}

.categoria-contenido {
  padding-right: 15px;

  h3 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 900;
  }

  p {
    margin: 0;
    color: #344968;
    font-size: 12px;
    line-height: 1.4;
  }
}

.categoria-flecha {
  position: absolute;
  top: 23px;
  right: 10px;
  color: #315684;
}
</style>
