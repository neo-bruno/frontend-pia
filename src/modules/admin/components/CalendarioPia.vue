<template>
<div class="calendario-pia">

  <!-- CABECERA -->
  <div class="calendario-header">

    <div>
      <div class="calendario-titulo">
        {{ mesActualNombre }}
      </div>

      <div class="calendario-subtitulo">
        {{ anioActual }}
      </div>
    </div>

    <div class="calendario-navegacion">
      <button class="btn-navegacion" type="button" @click="mesAnterior">
        <v-icon size="20">
          mdi-chevron-left
        </v-icon>
      </button>

      <button class="btn-hoy" type="button" @click="irAHoy">
        Hoy
      </button>

      <button class="btn-navegacion" type="button" @click="mesSiguiente">
        <v-icon size="20">
          mdi-chevron-right
        </v-icon>
      </button>
    </div>

  </div>

  <!-- DÍAS DE LA SEMANA -->
  <div class="dias-semana">

    <div v-for="dia in diasSemana" :key="dia" class="dia-semana">
      {{ dia }}
    </div>

  </div>

  <!-- CALENDARIO -->
  <div class="calendario-grid">

    <button v-for="dia in diasCalendario" :key="dia.key" type="button" class="dia" :class="{
          'dia-otro-mes': !dia.esMesActual,
          'dia-hoy': dia.esHoy,
          'dia-seleccionado': dia.esSeleccionado,
        }" @click="seleccionarDia(dia)">

      <span class="numero-dia">
        {{ dia.numero }}
      </span>

      <span v-if="dia.esHoy" class="indicador-hoy"></span>

    </button>

  </div>

</div>
</template>

<script>
export default {
  name: "CalendarioPia",

  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue", "seleccionar"],

  data() {
    const hoy = new Date();

    return {
      fechaVista: new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        1,
      ),

      diasSemana: [
        "LU",
        "MA",
        "MI",
        "JU",
        "VI",
        "SA",
        "DO",
      ],
    };
  },

  computed: {
    mesActualNombre() {
      return this.fechaVista.toLocaleDateString(
        "es-BO", {
          month: "long",
        },
      ).replace(/^./, (letra) => letra.toUpperCase());
    },

    anioActual() {
      return this.fechaVista.getFullYear();
    },

    diasCalendario() {
      const year = this.fechaVista.getFullYear();
      const month = this.fechaVista.getMonth();

      const primerDia = new Date(year, month, 1);

      /*
       * JavaScript:
       * domingo = 0
       * lunes   = 1
       * ...
       *
       * Nosotros queremos:
       * lunes = 0
       * ...
       * domingo = 6
       */
      let diaSemanaInicio = primerDia.getDay();

      diaSemanaInicio =
        diaSemanaInicio === 0 ?
        6 :
        diaSemanaInicio - 1;

      const ultimoDiaMes = new Date(
        year,
        month + 1,
        0,
      ).getDate();

      const diasMesAnterior = new Date(
        year,
        month,
        0,
      ).getDate();

      const dias = [];

      // ==========================================
      // DÍAS DEL MES ANTERIOR
      // ==========================================

      for (let i = diaSemanaInicio - 1; i >= 0; i--) {
        const numero = diasMesAnterior - i;

        const fecha = new Date(
          year,
          month - 1,
          numero,
        );

        dias.push(
          this.crearDia(
            fecha,
            false,
          ),
        );
      }

      // ==========================================
      // DÍAS DEL MES ACTUAL
      // ==========================================

      for (
        let numero = 1; numero <= ultimoDiaMes; numero++
      ) {
        const fecha = new Date(
          year,
          month,
          numero,
        );

        dias.push(
          this.crearDia(
            fecha,
            true,
          ),
        );
      }

      // ==========================================
      // DÍAS DEL MES SIGUIENTE
      // ==========================================

      const totalCeldas =
        Math.ceil(dias.length / 7) * 7;

      let siguienteNumero = 1;

      while (dias.length < totalCeldas) {
        const fecha = new Date(
          year,
          month + 1,
          siguienteNumero,
        );

        dias.push(
          this.crearDia(
            fecha,
            false,
          ),
        );

        siguienteNumero++;
      }

      return dias;
    },
  },

  watch: {
    modelValue(nuevaFecha) {
      if (!nuevaFecha) return;

      const fecha = this.convertirFecha(nuevaFecha);

      if (!fecha) return;

      /*
       * Solo cambiamos el mes visible cuando
       * el valor seleccionado pertenece a otro mes.
       */
      if (
        fecha.getFullYear() !==
        this.fechaVista.getFullYear() ||
        fecha.getMonth() !==
        this.fechaVista.getMonth()
      ) {
        this.fechaVista = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          1,
        );
      }
    },
  },

  mounted() {
    if (this.modelValue) {
      const fecha = this.convertirFecha(
        this.modelValue,
      );

      if (fecha) {
        this.fechaVista = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          1,
        );
      }
    }
  },

  methods: {
    // ==========================================
    // CREAR DÍA
    // ==========================================

    crearDia(fecha, esMesActual) {
      const fechaString =
        this.formatearFecha(fecha);

      const hoy = this.formatearFecha(
        new Date(),
      );

      return {
        key: fechaString,
        fecha: fechaString,
        numero: fecha.getDate(),
        esMesActual,
        esHoy: fechaString === hoy,
        esSeleccionado: fechaString === this.modelValue,
      };
    },

    // ==========================================
    // FORMATEAR FECHA
    // ==========================================

    formatearFecha(fecha) {
      const year =
        fecha.getFullYear();

      const month = String(
        fecha.getMonth() + 1,
      ).padStart(2, "0");

      const day = String(
        fecha.getDate(),
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    // ==========================================
    // CONVERTIR YYYY-MM-DD SIN UTC
    // ==========================================

    convertirFecha(fecha) {
      if (
        !fecha ||
        typeof fecha !== "string"
      ) {
        return null;
      }

      const partes =
        fecha.substring(0, 10).split("-");

      if (partes.length !== 3) {
        return null;
      }

      const year = Number(partes[0]);
      const month = Number(partes[1]) - 1;
      const day = Number(partes[2]);

      return new Date(
        year,
        month,
        day,
      );
    },

    // ==========================================
    // SELECCIONAR DÍA
    // ==========================================

    seleccionarDia(dia) {
      this.$emit(
        "update:modelValue",
        dia.fecha,
      );

      this.$emit(
        "seleccionar",
        dia.fecha,
      );

      /*
       * Si seleccionamos un día perteneciente
       * al mes anterior o siguiente, cambiamos
       * automáticamente la vista.
       */
      if (!dia.esMesActual) {
        const fecha =
          this.convertirFecha(
            dia.fecha,
          );

        this.fechaVista = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          1,
        );
      }
    },

    // ==========================================
    // MES ANTERIOR
    // ==========================================

    mesAnterior() {
      this.fechaVista =
        new Date(
          this.fechaVista.getFullYear(),
          this.fechaVista.getMonth() - 1,
          1,
        );
    },

    // ==========================================
    // MES SIGUIENTE
    // ==========================================

    mesSiguiente() {
      this.fechaVista =
        new Date(
          this.fechaVista.getFullYear(),
          this.fechaVista.getMonth() + 1,
          1,
        );
    },

    // ==========================================
    // IR A HOY
    // ==========================================

    irAHoy() {
      const hoy = new Date();

      const fechaHoy =
        this.formatearFecha(hoy);

      this.fechaVista =
        new Date(
          hoy.getFullYear(),
          hoy.getMonth(),
          1,
        );

      this.$emit(
        "update:modelValue",
        fechaHoy,
      );

      this.$emit(
        "seleccionar",
        fechaHoy,
      );
    },
  },
};
</script>

<style scoped>
.calendario-pia {
  width: 100%;
  padding: 4px 2px 8px;
}

/* ==========================================
   CABECERA
========================================== */

.calendario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.calendario-titulo {
  color: #12345b;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.1;
}

.calendario-subtitulo {
  color: #8a9aad;
  font-size: 13px;
  margin-top: 3px;
}

.calendario-navegacion {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-navegacion,
.btn-hoy {
  border: none;
  background: transparent;
  cursor: pointer;
}

.btn-navegacion {
  width: 34px;
  height: 34px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0f8f8c;
}

.btn-navegacion:hover {
  background: #eaf7f6;
}

.btn-hoy {
  padding: 7px 10px;
  border-radius: 9px;

  color: #0f8f8c;
  background: #eaf7f6;

  font-size: 12px;
  font-weight: 700;
}

/* ==========================================
   DÍAS DE LA SEMANA
========================================== */

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 7px;
}

.dia-semana {
  text-align: center;

  color: #91a0af;

  font-size: 10px;
  font-weight: 800;
}

/* ==========================================
   GRID
========================================== */

.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;
  box-sizing: border-box;
}

.calendario-dia {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==========================================
   DÍA
========================================== */

.dia {
  position: relative;

  width: 100%;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: transparent;

  border-radius: 12px;

  color: #173b63;

  cursor: pointer;

  font-family: inherit;
}

.numero-dia {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10%;

  font-size: 13px;
  font-weight: 600;
}

/* ==========================================
   OTRO MES
========================================== */

.dia-otro-mes {
  color: #c4ccd5;
}

.dia-otro-mes .numero-dia {
  font-weight: 500;
}

/* ==========================================
   HOY
========================================== */

.dia-hoy .numero-dia {
  background: #eaf7f6;
  color: #0f8f8c;
  font-weight: 800;
}

/* ==========================================
   SELECCIONADO
========================================== */

.dia-seleccionado .numero-dia {
  background: #0f8f8c;
  color: white;
  font-weight: 800;
}

/*
 * Si hoy también está seleccionado,
 * gana el estado seleccionado.
 */
.dia-seleccionado.dia-hoy .numero-dia {
  background: #0f8f8c;
  color: white;
}

/* ==========================================
   INDICADOR DE HOY
========================================== */

.indicador-hoy {
  position: absolute;

  bottom: 1px;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: #0f8f8c;
}

/* ==========================================
   HOVER
========================================== */

.dia:hover .numero-dia {
  background: #eaf7f6;
  color: #0f8f8c;
}

.dia-seleccionado:hover .numero-dia {
  background: #0f8f8c;
  color: white;
}
</style>
