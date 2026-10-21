<template>
<div class="calificacion-page">
  <header class="encabezado">
    <button class="btn-volver" @click="$router.back()">
      <v-icon>mdi-arrow-left</v-icon>
    </button>

    <div>
      <h1>Califica tu experiencia</h1>
      <p>Tu opinión nos ayuda a mejorar PIA.</p>
    </div>
  </header>

  <v-card class="tarjeta" elevation="0">
    <!-- <div class="icono">
      <v-icon size="34" color="#0f8f8c">
        mdi-star-circle-outline
      </v-icon>
    </div> -->
    <span class="text-primary font-weight-bold" style="font-size: 1.3rem;">{{ evaluacionObjetivo }}</span>

    <h2>{{ evaluacionNombre }}</h2>

    <p class="descripcion">
      {{ evaluacionDescripcion ||
        "¿Cómo calificarías tu experiencia con este aspecto del servicio?" }}
    </p>

    <div class="estrellas">
      <button v-for="estrella in 5" :key="estrella" type="button" class="estrella" :aria-label="`Calificar con ${estrella} estrellas`" @click="puntaje = estrella">
        <v-icon :color="estrella <= puntaje?'#F5B301' : '#CBD5E1'" size="39">
          {{ estrella <= puntaje?"mdi-star" : "mdi-star-outline" }}
        </v-icon>
      </button>
    </div>

    <p v-if="puntaje" class="texto-puntaje">
      {{ textoPuntaje }}
    </p>
    <p v-else class="ayuda">
      Selecciona de 1 a 5 estrellas.
    </p>

    <label for="comentario" class="label-comentario">
      Cuéntanos más (opcional)
    </label>

    <v-textarea id="comentario" v-model="observacion" placeholder="¿Qué te gustó o qué podríamos mejorar?" variant="outlined" rows="4" maxlength="1000" counter="1000" hide-details="auto" rounded="lg" class="campo-comentario" />

    <v-alert v-if="error" type="error" variant="tonal" density="comfortable" class="alerta">
      {{ error }}
    </v-alert>

    <v-alert v-if="enviada" type="success" variant="tonal" density="comfortable" class="alerta">
      ¡Gracias! Tu calificación fue registrada.
    </v-alert>

    <v-btn block color="#0f8f8c" size="large" rounded="lg" :loading="enviando" :disabled="!puedeEnviar || cargandoEvaluacion" class="btn-enviar" @click="enviarCalificacion">
      Enviar calificación
    </v-btn>

    <p class="nota">
      Solo puedes registrar una calificación por criterio y reserva.
    </p>
  </v-card>
</div>
</template>

<script>
import {
  crearCalificacion
} from "@/modules/cliente/modules/calificacion/services/calificacion.api";
import { useNotificationStore } from "@/stores/notification.store";
import {
  obtenerEvaluacion
} from "@/modules/cliente/modules/evaluacion/services/evaluacion.api";

export default {
  name: "CalificarNotificacionDetalle",

  data() {
    return {
      puntaje: 0,
      observacion: "",
      enviando: false,
      enviada: false,
      error: "",
      evaluacionObjetivo: '',
      evaluacionNombre: "Cargando evaluación...",
      evaluacionDescripcion: "",
      cargandoEvaluacion: false,
    };
  },

  computed: {
    reservaId() {
      return Number(this.$route.query.reserva_id);
    },

    evaluacionId() {
      return Number(this.$route.query.evaluacion_id);
    },

    puedeEnviar() {
      return (
        Number.isInteger(this.reservaId) &&
        this.reservaId > 0 &&
        Number.isInteger(this.evaluacionId) &&
        this.evaluacionId > 0 &&
        this.puntaje >= 1 &&
        this.puntaje <= 5 &&
        !this.enviando &&
        !this.enviada
      );
    },

    textoPuntaje() {
      const textos = {
        1: "Muy mala",
        2: "Mala",
        3: "Regular",
        4: "Muy buena",
        5: "Excelente",
      };

      return textos[this.puntaje] || "";
    },
  },

  methods: {
    async cargarEvaluacion() {
      if (!this.evaluacionId) {
        this.evaluacionNombre = "Evaluación no válida";
        this.evaluacionDescripcion = "";
        this.error = "No se recibió un identificador de evaluación válido.";
        return;
      }

      this.cargandoEvaluacion = true;

      try {
        const respuesta = await obtenerEvaluacion(this.evaluacionId);
        const evaluacion = respuesta.data?.data;

        if (!respuesta.data?.ok || !evaluacion) {
          throw new Error("No se encontraron los datos de la evaluación.");
        }
        console.log('codigo: ', evaluacion)
        this.evaluacionObjetivo = evaluacion.objetivo || ''
        this.evaluacionNombre = evaluacion.tipo_nombre || "Evaluación del servicio";
        this.evaluacionDescripcion = evaluacion.tipo_descripcion || "";
      } catch (error) {
        console.error("Error cargando evaluación:", error);

        this.evaluacionNombre = "Evaluación del servicio";
        this.error =
          error.response?.data?.mensaje ||
          "No se pudo cargar la información de esta evaluación.";
      } finally {
        this.cargandoEvaluacion = false;
      }
    },

    async enviarCalificacion() {
      if (!this.puedeEnviar) return;

      this.error = "";
      this.enviando = true;

      try {
        await crearCalificacion({
          reserva_id: this.reservaId,
          evaluacion_id: this.evaluacionId,
          puntaje: this.puntaje,
          observacion: this.observacion.trim() || null,
        });

        // Actualizar el contador y las notificaciones del cliente.
        const notificationStore = useNotificationStore();
        await notificationStore.cargarNotificaciones();

        this.enviada = true;

        this.$piaAlert?.success(
          "Gracias por compartir tu experiencia.", {
            title: "Calificación enviada"
          },
        );
        this.$router.push({name: 'cliente.notificaciones'})
      } catch (error) {
        console.error("Error enviando calificación:", error);

        this.error =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "No se pudo enviar tu calificación. Inténtalo nuevamente.";
      } finally {
        this.enviando = false;
      }
    },
  },

  mounted() {
    console.log("Reserva recibida:", this.$route.query.reserva_id);
    console.log("Evaluación recibida:", this.$route.query.evaluacion_id);
    this.cargarEvaluacion();
  },
};
</script>

<style lang="scss" scoped>
.calificacion-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 18px 14px 30px;
  box-sizing: border-box;
  color: #102a43;
}

.encabezado {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-volver {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcefee;
  border-radius: 12px;
  background: white;
  color: #0f8f8c;
  cursor: pointer;
}

.encabezado h1 {
  margin: 0;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 700;
  color: #102d5a;
}

.encabezado p {
  margin: 4px 0 0;
  margin-bottom: 0px;
  font-size: 12px;
  color: #718096;
}

.tarjeta {
  padding: 24px 18px;
  padding-top: 12px;
  border: 1px solid #cad3d3;
  border-radius: 18px;
  background: #fff;
  text-align: center;
}

.icono {
  margin-bottom: 10px;
}

.tarjeta h2 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #102d5a;
}

.descripcion {
  margin: 10px auto 18px;
  max-width: 320px;
  font-size: 13px;
  line-height: 1.6;
  color: #667b91;
}

.estrellas {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 12px 0 8px;
}

.estrella {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.texto-puntaje {
  margin: 8px 0 20px;
  color: #0f8f8c;
  font-size: 13px;
  font-weight: 700;
}

.ayuda {
  margin: 8px 0 20px;
  color: #8796a5;
  font-size: 12px;
}

.label-comentario {
  display: block;
  margin: 20px 0 8px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #334e68;
}

.campo-comentario {
  text-align: left;
}

.alerta {
  margin-top: 14px;
  text-align: left;
}

.btn-enviar {
  margin-top: 20px;
  color: white !important;
  font-weight: 700;
  text-transform: none;
}

.nota {
  margin: 14px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: #8796a5;
}

@media (min-width: 600px) {
  .calificacion-page {
    padding: 24px 20px 36px;
  }

  .tarjeta {
    padding: 30px;
  }
}
</style>
