<template>
<section class="preguntas-section">
  <div class="preguntas-titulo">
    <div class="preguntas-titulo-izquierda">
      <v-icon color="#008f9b" size="25">
        mdi-comment-question-outline
      </v-icon>
      <h2>Preguntas frecuentes</h2>
    </div>

    <button v-if="!busqueda && preguntas.length" type="button" class="ver-todas" @click="$emit('ver-todas')">
      {{ mostrarTodas ? "Ver menos" : "Ver todas" }}
    </button>
  </div>

  <div v-if="cargando" class="preguntas-carga">
    <v-progress-circular indeterminate color="#008f9b" size="28" />
  </div>

  <div v-else-if="preguntas.length" class="preguntas-lista">
    <button v-for="pregunta in preguntas" :key="pregunta.id" type="button" class="pregunta-item" @click="$emit('abrir', pregunta)">
      <span>{{ pregunta.pregunta }}</span>

      <v-icon color="#315684">
        mdi-chevron-right
      </v-icon>
    </button>
  </div>

  <div v-else class="preguntas-vacias">
    <v-icon size="30" color="#9aabba">
      mdi-comment-question-outline
    </v-icon>
    <p>No encontramos preguntas relacionadas.</p>
  </div>
</section>
</template>

<script>
export default {
  name: "PreguntasFrecuentes",

  props: {
    preguntas: {
      type: Array,
      default: () => [],
    },

    cargando: {
      type: Boolean,
      default: false,
    },

    mostrarTodas: {
      type: Boolean,
      default: false,
    },

    busqueda: {
      type: String,
      default: "",
    },
  },

  emits: ["abrir", "ver-todas"],
};
</script>

<style lang="scss" scoped>
.preguntas-section {
  margin-top: 24px;
}

.preguntas-titulo,
.preguntas-titulo-izquierda {
  display: flex;
  align-items: center;
}

.preguntas-titulo {
  justify-content: space-between;
  margin-bottom: 13px;
}

.preguntas-titulo-izquierda {
  gap: 8px;

  h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 900;
    color: #102653;
  }
}

.ver-todas {
  padding: 4px;
  border: none;
  background: transparent;
  color: #008f9b;
  font-size: 12px;
  font-weight: 800;
  text-decoration: underline;
}

.preguntas-lista {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pregunta-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: 55px;
  padding: 11px 13px;
  border: 1px solid #e5edf2;
  border-radius: 15px;
  background: #ffffff;
  color: #102653;
  text-align: left;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(20, 65, 110, 0.05);

  span {
    flex: 1;
  }
}

.preguntas-carga,
.preguntas-vacias {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  gap: 8px;
  color: #49658e;
  font-size: 12px;
}

.preguntas-vacias {
  flex-direction: column;

  p {
    margin: 0;
  }
}
</style>
