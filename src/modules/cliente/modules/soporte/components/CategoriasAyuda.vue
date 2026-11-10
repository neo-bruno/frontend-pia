
<template>
  <section class="categorias-ayuda">

    <div class="seccion-titulo">
      <v-icon size="25" color="#008f9b">
        mdi-view-grid-outline
      </v-icon>

      <h2>Categorías de ayuda</h2>
    </div>

    <div v-if="cargando" class="estado-carga">
      <v-progress-circular
        indeterminate
        color="#008f9b"
        size="28"
      />
    </div>

    <div v-else-if="categorias.length" class="categorias-grid">

      <CategoriaAyudaCard
        v-for="categoria in categorias"
        :key="categoria.id"
        :categoria="categoria"
        :seleccionada="
          Number(categoriaSeleccionada) === Number(categoria.id)
        "
        @seleccionar="$emit('seleccionar', $event)"
      />

    </div>

    <div v-else class="estado-vacio">
      <v-icon size="30" color="#9aabba">
        mdi-folder-open-outline
      </v-icon>

      <p>No hay categorías disponibles.</p>
    </div>

  </section>
</template>

<script>
import CategoriaAyudaCard from "./CategoriaAyudaCard.vue";

export default {
  name: "CategoriasAyuda",

  components: {
    CategoriaAyudaCard,
  },

  props: {
    categorias: {
      type: Array,
      default: () => [],
    },

    cargando: {
      type: Boolean,
      default: false,
    },

    categoriaSeleccionada: {
      type: Number,
      default: null,
    },
  },

  emits: ["seleccionar"],
};
</script>

<style lang="scss" scoped>
.categorias-ayuda {
  width: 100%;
  margin-top: 22px;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 13px;

  h2 {
    margin: 0;
    color: #102653;
    font-family: "Nunito", sans-serif;
    font-size: 17px;
    font-weight: 900;
  }
}

.categorias-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

.estado-carga,
.estado-vacio {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 110px;
  gap: 8px;
  color: #49658e;
  font-size: 13px;
}

.estado-vacio {
  flex-direction: column;

  p {
    margin: 0;
  }
}
</style>
