<template>
<div class="soporte-page">

  <SoporteHero />

  <SoporteBuscador @buscar="buscarPreguntas" />

  <CategoriasAyuda :categorias="categorias" :cargando="cargandoCategorias" :categoria-seleccionada="categoriaSeleccionada" @seleccionar="seleccionarCategoria" />

  <!-- PREGUNTAS FRECUENTES -->
  <PreguntasFrecuentes
    :preguntas="preguntasFiltradas"
    :cargando="cargandoPreguntas"
    :mostrar-todas="mostrarTodas"
    :busqueda="busqueda"
    @abrir="abrirPregunta"
    @ver-todas="mostrarTodas = !mostrarTodas"
  />

  <!-- CONTACTO -->
  <section class="contacto-soporte">
    <div class="contacto-icono">
      <v-icon size="42">mdi-headset</v-icon>
    </div>

    <div class="contacto-contenido">
      <h3>¿No encuentras lo que buscas?</h3>

      <p>
        Contáctanos y nuestro equipo
        te ayudará.
      </p>

      <button type="button" class="contacto-boton" @click="irANuevaConsulta">
        <v-icon size="21">mdi-send-outline</v-icon>
        Enviar una consulta
      </button>
    </div>
  </section>


  <div class="espacio-inferior"></div>

</div>
</template>

<script>
import SoporteHero from "../components/SoporteHero.vue";
import SoporteBuscador from "../components/SoporteBuscador.vue";
import CategoriasAyuda from "../components/CategoriasAyuda.vue";

import {
  getSupportCategories,
  getSupportQuestions,
} from "../services/soporte.api";

import PreguntasFrecuentes from "../components/PreguntasFrecuentes.vue";

export default {
  name: "SoportePage",

  components: {
    SoporteHero,
    SoporteBuscador,
    CategoriasAyuda,
    PreguntasFrecuentes,
  },

  data() {
    return {
      categorias: [],
      preguntas: [],

      cargandoCategorias: false,
      cargandoPreguntas: false,
      
      categoriaSeleccionada: null,
      busqueda: "",
      
      mostrarTodas: false,
    };
  },

  
  computed: {
    preguntasFiltradas() {
      let resultado = [...this.preguntas];

      if (this.categoriaSeleccionada !== null) {
        resultado = resultado.filter(
          (p) =>
            Number(p.categoria_id) ===
            Number(this.categoriaSeleccionada),
        );
      }

      if (this.busqueda.trim()) {
        const texto = this.busqueda.toLowerCase().trim();

        resultado = resultado.filter(
          (p) =>
            p.pregunta.toLowerCase().includes(texto) ||
            p.respuesta.toLowerCase().includes(texto),
        );
      } else if (!this.mostrarTodas) {
        resultado = resultado.filter((p) => p.destacada === true);
      }

      return resultado.sort((a, b) => {
        if (a.categoria_id !== b.categoria_id) {
          return a.categoria_id - b.categoria_id;
        }

        return a.orden - b.orden;
      });
    }
  },


  methods: {
    async cargarCategorias() {
      this.cargandoCategorias = true;

      try {
        const respuesta = await getSupportCategories();

        this.categorias = Array.isArray(respuesta.data?.data)
          ? respuesta.data.data
          : [];
      } catch (error) {
        console.error("Error al cargar categorías:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
          "No se pudieron cargar las categorías."
        );
      } finally {
        this.cargandoCategorias = false;
      }
    },

    async cargarPreguntas() {
      this.cargandoPreguntas = true;

      try {
        const respuesta = await getSupportQuestions();

        this.preguntas = Array.isArray(respuesta.data?.data)
          ? respuesta.data.data
          : [];
      } catch (error) {
        console.error("Error al cargar preguntas:", error);

        this.$piaAlert.error(
          error.response?.data?.message ||
          "No se pudieron cargar las preguntas frecuentes."
        );
      } finally {
        this.cargandoPreguntas = false;
      }
    },

    async cargarPreguntas() {
      this.cargandoPreguntas = true;

      try {
        const respuesta = await getSupportQuestions();

        this.preguntas = Array.isArray(respuesta.data?.data) ?
          respuesta.data.data :
          [];
      } catch (error) {
        console.error("Error al cargar preguntas frecuentes:", error);
        this.mostrarMensaje("No se pudieron cargar las preguntas frecuentes.");
      } finally {
        this.cargandoPreguntas = false;
      }
    },
    
    seleccionarCategoria(categoria) {
      const id = Number(categoria.id);

      this.categoriaSeleccionada =
        id === Number(this.categoriaSeleccionada)
          ? null
          : id;

      this.mostrarTodas = false;
    },

    buscarPreguntas(texto) {
      this.busqueda = texto;
    },

    limpiarFiltros() {
      this.categoriaSeleccionada = null;
      this.busqueda = "";
      this.mostrarTodas = false;
    },

    async abrirPregunta(pregunta) {
      this.$router.push({
        name: "cliente-soporte-pregunta",
        params: {
          id: pregunta.id,
        },
      });
    },

    valorarRespuesta(util) {
      this.dialogPregunta = false;

      this.mensajeSnackbar = util ?
        "¡Gracias por tu valoración!" :
        "Gracias. Puedes enviarnos una consulta para ayudarte.";

      this.snackbar = true;
    },

    irANuevaConsulta() {
      this.$router.push("/cliente/soporte/nueva");
    },

    mostrarMensaje(mensaje) {
      this.mensajeSnackbar = mensaje;
      this.snackbar = true;
    },
  },

  mounted() {
    this.cargarCategorias();
    this.cargarPreguntas();
  },
};
</script>

<style lang="scss" scoped>
.soporte-page {
  width: 100%;
  min-height: 100vh;
  padding: 10px 12px 0;
  box-sizing: border-box;
  background: #ffffff;
  font-family: "Nunito", sans-serif;
  color: #102653;
}

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
  }
}

.ver-todas {
  padding: 4px;
  background: transparent;
  border: none;
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

.contacto-soporte {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 25px;
  padding: 16px 12px;
  border: 1px solid #e0edf2;
  border-radius: 20px;
  background: #f5fafc;
}

.contacto-icono {
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #d9f5f0;
  color: #008f9b;
}

.contacto-contenido {
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 900;
  }

  p {
    margin: 4px 0 12px;
    color: #49658e;
    font-size: 12px;
    line-height: 1.35;
  }
}

.contacto-boton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 45px;
  padding: 8px 12px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(110deg, #008f9b, #007d7d);
  color: white;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 900;
}

.dialog-pregunta {
  overflow: hidden;
  border-radius: 20px !important;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  background: #008f9b;
  color: white;

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 900;
  }
}

.pregunta-detalle {
  margin: 5px 0 16px;
  color: #102653;
  font-size: 19px;
  font-weight: 900;
}

.respuesta-detalle {
  padding: 15px;
  border-radius: 15px;
  background: #e6f9f5;
  color: #183b55;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
}

.detalle-carga {
  display: flex;
  justify-content: center;
  padding: 25px;
}

.respuesta-util {
  margin-top: 22px;

  p {
    margin-bottom: 10px;
    font-weight: 900;
  }
}

.respuesta-acciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 45px;
    border: 1px solid #dce7ee;
    border-radius: 13px;
    font-weight: 900;
  }
}

.respuesta-si {
  background: #e1f8ed;
  color: #15945c;
}

.respuesta-no {
  background: #f5f6f8;
  color: #d93636;
}

.espacio-inferior {
  height: 85px;
}

@media (min-width: 768px) {
  .soporte-page {
    max-width: 430px;
    margin: 0 auto;
  }
}
</style>
