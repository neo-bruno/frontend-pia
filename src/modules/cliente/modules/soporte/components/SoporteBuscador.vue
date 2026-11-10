<template>
<div class="soporte-buscador">
  <v-icon color="#49658e" size="25">
    mdi-magnify
  </v-icon>

  <input v-model="texto" type="text" placeholder="Buscar ayuda o escribir una pregunta..." @input="$emit('buscar', texto)" />

  <button v-if="texto" type="button" class="limpiar-busqueda" @click="limpiar">
    <v-icon size="20">mdi-close-circle</v-icon>
  </button>
</div>
</template>

<script>
export default {
  name: "SoporteBuscador",

  emits: ["buscar"],

  data() {
    return {
      texto: "",
    };
  },

  methods: {
    limpiar() {
      this.texto = "";
      this.$emit("buscar", "");
    },
  },
};
</script>

<style lang="scss" scoped>
.soporte-buscador {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 56px;
  padding: 0 15px;
  box-sizing: border-box;
  border: 1px solid #dce7ee;
  border-radius: 17px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(20, 65, 110, 0.06);

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: #102653;
    font-family: "Nunito", sans-serif;
    font-size: 13px;
  }

  input::placeholder {
    color: #70819a;
    opacity: 1;
  }
}

.limpiar-busqueda {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border: none;
  background: transparent;
  color: #71849a;
}
</style>
