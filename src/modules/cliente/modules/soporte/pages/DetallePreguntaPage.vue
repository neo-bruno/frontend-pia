
<template>
  <div class="detalle-pregunta-page">

    <!-- ENCABEZADO -->
    <header class="detalle-header">
      <div class="detalle-categoria">
        <v-icon size="25">mdi-calendar-month-outline</v-icon>
        <span>{{ pregunta?.categoria || "Preguntas frecuentes" }}</span>
        <span>·</span>
        <span>Preguntas frecuentes</span>
      </div>

      <h1>
        {{ pregunta?.pregunta || "Cargando pregunta..." }}
      </h1>
    </header>

    <!-- CONTENIDO -->
    <main class="detalle-contenido">

      <div v-if="cargando" class="detalle-cargando">
        <v-progress-circular
          indeterminate
          color="#008f9b"
          size="32"
        />
        <p>Cargando respuesta...</p>
      </div>

      <template v-else-if="pregunta">

        <!-- INFORMACIÓN -->
        <div class="respuesta-introduccion">
          <v-icon size="27">mdi-information-outline</v-icon>

          <p>
            Aquí encontrarás información para resolver tu consulta
            de manera rápida y sencilla.
          </p>
        </div>

        <h2>Respuesta</h2>

        <div class="respuesta-texto">
          {{ pregunta.respuesta || "No hay una respuesta disponible." }}
        </div>

        <div class="separador"></div>

        <!-- VALORACIÓN -->
        <section class="valoracion">
          <h2>¿Te fue útil esta respuesta?</h2>

          <div class="valoracion-acciones">
            <button
              type="button"
              class="valoracion-si"
              @click="valorarRespuesta(true)"
            >
              <v-icon>mdi-thumb-up-outline</v-icon>
              Sí
            </button>

            <button
              type="button"
              class="valoracion-no"
              @click="valorarRespuesta(false)"
            >
              <v-icon>mdi-thumb-down-outline</v-icon>
              No
            </button>
          </div>
        </section>

        <!-- CONTACTO -->
        <button
          type="button"
          class="contactar-boton"
          @click="irANuevaConsulta"
        >
          <v-icon size="27">mdi-headset</v-icon>
          Contactar con soporte
        </button>

      </template>

    </main>

  </div>
</template>

<script>
import { getSupportQuestionById } from "../services/soporte.api";
import { piaAlert } from "@/services/piaAlert";

export default {
  name: "DetallePreguntaPage",

  data() {
    return {
      pregunta: null,
      cargando: false,
    };
  },

  methods: {
    async cargarPregunta() {
      this.cargando = true;
      this.pregunta = null;

      try {
        const respuesta = await getSupportQuestionById(
          this.$route.params.id
        );

        this.pregunta = respuesta.data?.data || null;

        if (!this.pregunta) {
          piaAlert.warning("No encontramos la pregunta solicitada.");
          this.$router.replace({ name: "cliente-soporte" });
        }
      } catch (error) {
        console.error("Error al cargar la pregunta:", error);

        piaAlert.error(
          error.response?.data?.message ||
          "No se pudo cargar la respuesta."
        );

        this.$router.replace({ name: "cliente-soporte" });
      } finally {
        this.cargando = false;
      }
    },

    valorarRespuesta(util) {
      if (util) {
        piaAlert.success("¡Gracias por tu valoración!");
        return;
      }

      piaAlert.info(
        "Gracias por ayudarnos a mejorar. Puedes enviarnos una consulta y nuestro equipo te ayudará."
      );
    },

    irANuevaConsulta() {
      this.$router.push({
        name: "cliente-soporte-nueva",
      });
    },
  },

  watch: {
    "$route.params.id"() {
      this.cargarPregunta();
    },
  },

  mounted() {
    this.cargarPregunta();
  },
};
</script>

<style lang="scss" scoped>
.detalle-pregunta-page {
  width: 100%;
  min-height: calc(100vh - 150px);
  background: #ffffff;
  color: #102653;
  font-family: "Nunito", sans-serif;
}

/* ENCABEZADO */

.detalle-header {
  padding: 20px 17px 30px;
  background: linear-gradient(135deg, #009b9b, #007b80);
  color: #ffffff;
  border-radius: 0 0 22px 22px;

  .detalle-categoria {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 17px;
    font-size: 12px;
    font-weight: 700;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 1.25;
    font-weight: 900;
  }
}

/* CONTENIDO */

.detalle-contenido {
  position: relative;
  margin-top: -12px;
  padding: 20px 15px 25px;
  border-radius: 25px 25px 0 0;
  background: #ffffff;
}

.detalle-cargando {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 50px 0;

  p {
    margin: 0;
    color: #49658e;
    font-size: 13px;
  }
}

/* INTRODUCCIÓN */

.respuesta-introduccion {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-radius: 17px;
  background: #dff8f2;
  color: #087d78;

  p {
    margin: 0;
    color: #17384e;
    font-size: 13px;
    line-height: 1.5;
    font-weight: 600;
  }
}

.detalle-contenido > h2 {
  margin: 20px 0 12px;
  font-size: 17px;
  font-weight: 900;
}

/* RESPUESTA */

.respuesta-texto {
  padding: 17px;
  border-radius: 16px;
  background: #f4f8fa;
  color: #183b55;
  font-size: 14px;
  line-height: 1.65;
  white-space: pre-line;
}

.separador {
  height: 1px;
  margin: 22px 0 17px;
  background: #dce6ed;
}

/* VALORACIÓN */

.valoracion h2 {
  margin: 0 0 13px;
  font-size: 17px;
  font-weight: 900;
}

.valoracion-acciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 53px;
    border: 1px solid #dce7ee;
    border-radius: 16px;
    font-size: 15px;
    font-weight: 900;
  }
}

.valoracion-si {
  background: #e0f8ed;
  color: #15945c;
}

.valoracion-no {
  background: #f5f6f8;
  color: #d93636;
}

/* CONTACTAR */

.contactar-boton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 58px;
  margin-top: 22px;
  padding: 12px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(110deg, #009b9b, #007b80);
  color: #ffffff;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
}

@media (min-width: 768px) {
  .detalle-pregunta-page {
    max-width: 430px;
    margin: 0 auto;
  }
}
</style>
