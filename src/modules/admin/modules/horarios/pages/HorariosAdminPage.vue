<template>
<div class="pagina">

  <!-- =====================================================
         ENCABEZADO
    ====================================================== -->

  <div class="encabezado">

    <h1>Mis horarios</h1>

    <p>
      Visualiza y gestiona tus horarios de atención.
    </p>

  </div>

  <!-- =====================================================
         DÍAS
    ====================================================== -->

  <div class="dias-tabs">

    <button v-for="dia in dias" :key="dia.id" class="dia-tab" :class="{
          activo: diaSeleccionado === dia.id
        }" @click="seleccionarDia(dia.id)">
      {{ dia.nombre }}
    </button>

  </div>

  <!-- =====================================================
         DÍA ACTUAL
    ====================================================== -->

  <div v-if="diaActual" class="dia-contenido">

    <div class="dia-titulo">

      <div>
        <h2>
          {{ diaActual.nombre }}
        </h2>

        <span>
          {{ cantidadHorarios }} horario{{ cantidadHorarios === 1?'' : 's' }}
        </span>
      </div>

    </div>

    <!-- ===================================================
           SIN HORARIOS
      ==================================================== -->

    <div v-if="!diaActual.horarios.length" class="sin-horarios">

      <div class="sin-horarios-icono">
        <v-icon>
          mdi-calendar-blank-outline
        </v-icon>
      </div>

      <div>
        No tienes horarios asignados para este día.
      </div>

    </div>

    <!-- ===================================================
           HORARIOS
      ==================================================== -->

    <div v-for="horario in diaActual.horarios" :key="horario.horario_profesional_id || horario.id" class="horario">

      <!-- -----------------------------------------------
             CABECERA HORARIO
        ------------------------------------------------ -->

      <div class="horario-cabecera">

        <v-icon size="15">
          mdi-clock-outline
        </v-icon>

        <span>
          {{ horario.hora_inicio }}
          –
          {{ horario.hora_fin }}
        </span>

      </div>

      <!-- -----------------------------------------------
             DURACIÓN
        ------------------------------------------------ -->

      <div class="duracion">

        <div class="duracion-label">

          <span>
            Duración de las citas
          </span>

          <small>
            Define cómo se distribuirán los slots.
          </small>

        </div>

        <select v-model="horario.duracion" class="select-duracion" @change="cambiarDuracion(horario)">

          <option v-for="item in duraciones" :key="item" :value="item">
            {{ item }} minutos
          </option>

        </select>

      </div>

      <!-- -----------------------------------------------
             INFORMACIÓN
        ------------------------------------------------ -->

      <div class="info">

        <v-icon size="17">
          mdi-information
        </v-icon>

        <span>
          Puedes bloquear las horas en las que no atenderás.
        </span>

      </div>

      <!-- ===================================================
     SLOTS
==================================================== -->

      <div class="slots">

        <div v-for="slot in horario.slots" :key="slot.id" class="slot" :class="{
      bloqueado: slot.estado === 'BLOQUEADO',
      ocupado: slot.estado === 'OCUPADO'
    }">

          <!-- HORA -->

          <div class="slot-hora">

            {{ slot.hora_inicio }}
            –
            {{ slot.hora_fin }}

          </div>

          <!-- SWITCH -->

          <button v-if="slot.estado !== 'OCUPADO'" class="switch" :class="{
        activo: slot.estado === 'DISPONIBLE'
      }" @click="cambiarEstado(slot)">

            <span></span>

          </button>

          <!-- OCUPADO -->

          <div v-else class="slot-ocupado-icon">

            <v-icon size="16">
              mdi-lock
            </v-icon>

          </div>

          <!-- ESTADO -->

          <div class="slot-estado" :class="{
        disponible: slot.estado === 'DISPONIBLE',
        ocupado: slot.estado === 'OCUPADO'
      }">

            {{
        slot.estado === 'DISPONIBLE'
         ?'Disponible'
          : slot.estado === 'OCUPADO'
           ?'Ocupado'
            : 'Bloqueado'
      }}

          </div>

        </div>

      </div>

      <!-- -----------------------------------------------
             RESUMEN
        ------------------------------------------------ -->

      <div class="resumen">
        <span>
          {{ contarDisponibles(horario) }} disponibles
        </span>

        <span>
          {{ contarBloqueados(horario) }} bloqueados
        </span>

        <span v-if="contarOcupados(horario)">
          {{ contarOcupados(horario) }} ocupados
        </span>
      </div>

    </div>

  </div>

  <!-- =====================================================
         RESTABLECER
    ====================================================== -->

  <button v-if="diaActual && diaActual.horarios.length" class="btn-restablecer" @click="restablecerHorarios">

    <v-icon size="18">
      mdi-refresh
    </v-icon>

    <span>
      Restablecer horarios
    </span>

  </button>

  <!-- =====================================================
         GUARDAR
    ====================================================== -->

  <button v-if="dias.length" class="btn-guardar" :disabled="guardando" @click="guardarCambios">

    <v-icon size="18">
      mdi-content-save
    </v-icon>

    <span>
      {{ guardando?'Guardando...' : 'Guardar cambios' }}
    </span>

  </button>

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>
</template>

<script>
import {
  getSlots,
  saveSlot
} from '../../slot/services/slots.api';

export default {

  name: "HorariosAdmin",

  data() {

    return {

      loading: false,

      guardando: false,

      diaSeleccionado: 1,

      dias: [],

      datosOriginales: null,

      duraciones: [
        30,
        60,
        90,
        120,
        180,
        240
      ],

      overlay: false,

    };

  },

  computed: {

    // =====================================================
    // DÍA ACTUAL
    // =====================================================

    diaActual() {

      return this.dias.find(
        dia =>
        dia.id === this.diaSeleccionado
      ) || null;

    },

    // =====================================================
    // CANTIDAD DE HORARIOS
    // =====================================================

    cantidadHorarios() {
      return this.diaActual?.horarios?.length || 0;
    }

  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {

    // =====================================================
    // OBTENER HORARIOS
    // =====================================================

    async obtenerHorarios() {

      this.loading = true;

      try {
        this.overlay = true

        const res = await getSlots()
        if (res.data.ok) {
          this.dias = res.data.data.dias

          this.dias.forEach(dia => {
            dia.horarios.forEach(horario => {

              // Por defecto
              horario.duracion = Number(horario.duracion) || 60;
              horario.slots = (horario.slots || []).map(slot => ({
                ...slot,
                estado: slot.estado || 'DISPONIBLE'
              }));

              // Si no existen slots,
              // generamos con 60 minutos
              if (!horario.slots.length) {
                horario.duracion = 60;
                this.generarSlotsLocal(horario);
              }
            });
          });
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,
        })
      } finally {
        this.overlay = false
        this.loading = false
      }

    },

    // =====================================================
    // SELECCIONAR DÍA
    // =====================================================

    seleccionarDia(id) {

      this.diaSeleccionado = id;

    },

    // =====================================================
    // CAMBIAR ESTADO DEL SLOT
    // =====================================================

    cambiarEstado(slot) {

      if (slot.estado === 'OCUPADO') {
        return;
      }

      const estadoAnterior = slot.estado;

      slot.estado =
        slot.estado === 'DISPONIBLE' ?
        'BLOQUEADO' :
        'DISPONIBLE';

      console.log(
        "CAMBIO DE SLOT:", {
          id: slot.id,
          hora_inicio: slot.hora_inicio,
          hora_fin: slot.hora_fin,
          estadoAnterior,
          estadoNuevo: slot.estado
        }
      );
    },

    // =====================================================
    // CAMBIAR DURACIÓN
    // =====================================================

    cambiarDuracion(horario) {

      const tieneOcupados = horario.slots?.some(slot => slot.estado === 'OCUPADO');
      if (tieneOcupados) {
        // Restauramos la duración anterior
        // simplemente no regeneramos
        this.$swal({
          title: "Horario con reservas",
          text: "No puedes cambiar la duración porque este horario tiene slots ocupados.",
          icon: "warning",
          timer: 2500,
          showConfirmButton: false
        });
        return;
      }
      this.generarSlotsLocal(horario);
    },

    // =====================================================
    // GENERAR SLOTS LOCALMENTE
    // =====================================================

    generarSlotsLocal(horario) {
      const inicio = this.horaAMinutos(horario.hora_inicio);
      const fin = this.horaAMinutos(horario.hora_fin);
      const duracion = Number(horario.duracion) || 60;
      const slotsAnteriores = horario.slots || [];
      const slots = [];

      let actual = inicio;

      while (
        actual + duracion <= fin
      ) {

        const horaInicio = this.minutosAHora(actual);

        const horaFin = this.minutosAHora(actual + duracion);
        const anterior = slotsAnteriores.find(slot =>
          slot.hora_inicio === horaInicio &&
          slot.hora_fin === horaFin
        );

        slots.push({
          id: anterior?.id || `temp-${horario.horario_profesional_id}-${actual}`,
          horario_profesional_id: horario.horario_profesional_id,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          duracion,
          estado: anterior?.estado || 'DISPONIBLE'
        });
        actual += duracion;
      }
      horario.slots = slots;
    },

    // =====================================================
    // CONTAR DISPONIBLES
    // =====================================================

    contarDisponibles(horario) {
      return horario.slots.filter(slot => slot.estado === 'DISPONIBLE').length;
    },

    // =====================================================
    // CONTAR BLOQUEADOS
    // =====================================================

    contarBloqueados(horario) {
      return horario.slots.filter(slot => slot.estado === 'BLOQUEADO').length;
    },

    contarOcupados(horario) {
      return horario.slots.filter(slot => slot.estado === 'OCUPADO').length;
    },

    // =====================================================
    // RESTABLECER
    // =====================================================

    restablecerHorarios() {
      if (!this.datosOriginales) {
        return;
      }

      this.dias = JSON.parse(JSON.stringify(this.datosOriginales));
    },

    // =====================================================
    // GUARDAR
    // =====================================================
    async guardarCambios() {
      this.guardando = true;
      this.overlay = true;

      try {
        const datos = this.obtenerDatosGuardar();

        // =====================================================
        // MOSTRAR SOLO LOS SLOTS MODIFICADOS
        // =====================================================
        const res = await saveSlot(datos);        
        if (res.status === 200) {

          this.$swal({
            title: "Horario Guardado!",
            text: "Se ha guardado los datos del horario correctamente!",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.datosOriginales = JSON.parse(JSON.stringify(this.dias));
              this.$router.go(-1);
            }
          });

        }

      } catch (error) {
        console.error("ERROR GUARDAR SLOTS:", error);

        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        });

      } finally {
        this.overlay = false;
        this.guardando = false;
      }
    },

    // =====================================================
    // DATOS PARA GUARDAR
    // =====================================================

    obtenerDatosGuardar() {
      const datos = [];
      this.dias.forEach(
        dia => {
          dia.horarios.forEach(
            horario => {
              horario.slots.forEach(
                slot => {
                  datos.push({
                    slot_id: typeof slot.id === "number"?slot.id : null,
                    horario_profesional_id: horario.horario_profesional_id,
                    hora_inicio: slot.hora_inicio,
                    hora_fin: slot.hora_fin,
                    duracion: Number(horario.duracion) || 60,
                    estado: slot.estado
                  });
                }
              );
            }
          );
        }
      );
      return datos;
    },

    // =====================================================
    // HORA -> MINUTOS
    // =====================================================

    horaAMinutos(hora) {

      const partes =
        hora.split(":");

      return (
        Number(partes[0]) * 60 +
        Number(partes[1])
      );

    },

    // =====================================================
    // MINUTOS -> HORA
    // =====================================================

    minutosAHora(minutos) {

      const horas =
        Math.floor(minutos / 60);

      const minutosRestantes =
        minutos % 60;

      return (
        String(horas).padStart(2, "0") +
        ":" +
        String(
          minutosRestantes
        ).padStart(2, "0")
      );

    }

  },

  async mounted() {
    await this.obtenerHorarios();
  },
};
</script>

<style lang="scss" scoped>
.pagina {

  width: 100%;
  max-width: 430px;

  margin: 0 auto;

  padding: 12px 10px 25px;

}

/* =====================================================
   ENCABEZADO
===================================================== */

.encabezado {

  margin-bottom: 12px;

}

.encabezado h1 {

  margin: 0;

  font-size: 24px;

  line-height: 1.1;

  font-weight: 700;

}

.encabezado p {

  margin: 4px 0 0;

  font-size: 12px;

  line-height: 1.3;

  color: #777;

}

/* =====================================================
   DÍAS
===================================================== */

.dias-tabs {

  display: flex;

  gap: 5px;

  overflow-x: auto;

  padding-bottom: 4px;

  margin-bottom: 10px;

  scrollbar-width: none;

}

.dias-tabs::-webkit-scrollbar {

  display: none;

}

.dia-tab {

  flex: 0 0 auto;

  border: 1px solid #dfeaea;

  background: #f4f8f8;

  color: #385252;

  border-radius: 7px;

  padding: 7px 13px;

  font-size: 11px;

  cursor: pointer;

}

.dia-tab.activo {

  background: #0f9f9f;

  border-color: #0f9f9f;

  color: white;

}

/* =====================================================
   DÍA
===================================================== */

.dia-contenido {

  width: 100%;

}

.dia-titulo {

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: #eef8f8;

  border-radius: 8px;

  padding: 9px 11px;

  margin-bottom: 8px;

}

.dia-titulo h2 {

  margin: 0;

  font-size: 14px;

  font-weight: 700;

}

.dia-titulo span {

  font-size: 9px;

  color: #777;

}

/* =====================================================
   HORARIO
===================================================== */

.horario {

  border: 1px solid #e3eded;

  border-radius: 8px;

  overflow: hidden;

  margin-bottom: 8px;

}

.horario-cabecera {

  display: flex;

  align-items: center;

  gap: 5px;

  background: #f6f9f9;

  padding: 8px 9px;

  color: #0b7070;

  font-size: 10.5px;

  font-weight: 600;

}

/* =====================================================
   DURACIÓN
===================================================== */

.duracion {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  padding: 8px 9px;

  border-bottom: 1px solid #edf2f2;

}

.duracion-label {

  display: flex;

  flex-direction: column;

  min-width: 0;

}

.duracion-label span {

  font-size: 10px;

  font-weight: 600;

}

.duracion-label small {

  margin-top: 2px;

  font-size: 8px;

  color: #888;

}

.select-duracion {

  height: 32px;

  min-width: 105px;

  border: 1px solid #d8e5e5;

  border-radius: 6px;

  padding: 0 7px;

  background: white;

  color: #345;

  font-size: 10px;

  outline: none;

}

.select-duracion:focus {

  border-color: #0f9f9f;

}

/* =====================================================
   INFORMACIÓN
===================================================== */

.info {

  display: flex;

  align-items: center;

  gap: 7px;

  background: #edf7ff;

  color: #426273;

  padding: 8px 9px;

  margin: 7px;

  border-radius: 6px;

  font-size: 9px;

  line-height: 1.3;

}

/* =====================================================
   SLOTS
===================================================== */

.slots {

  padding: 0 7px 7px;

}

.slot {

  display: grid;

  grid-template-columns:
    1fr 42px 72px;

  align-items: center;

  min-height: 37px;

  padding: 2px 7px;

  border-bottom: 1px solid #edf1f1;

}

.slot:last-child {

  border-bottom: none;

}

.slot.bloqueado {

  background: #fafafa;

}

.slot-hora {

  font-size: 10.5px;

  color: #283f3f;

}

.slot-estado {

  text-align: right;

  font-size: 9.5px;

  color: #899292;

}

.slot-estado.disponible {

  color: #0b9999;

}

/* =====================================================
   SWITCH
===================================================== */

.switch {

  position: relative;

  width: 36px;

  height: 20px;

  padding: 0;

  border: none;

  border-radius: 20px;

  background: #b8c4d4;

  cursor: pointer;

  transition: .2s;

}

.switch span {

  position: absolute;

  width: 16px;

  height: 16px;

  top: 2px;

  left: 2px;

  border-radius: 50%;

  background: white;

  transition: .2s;

}

.switch.activo {

  background: #0f9f9f;

}

.switch.activo span {

  left: 18px;

}

/* =====================================================
   RESUMEN
===================================================== */

.resumen {

  display: flex;

  justify-content: space-between;

  padding: 7px 10px;

  background: #f8fafa;

  font-size: 8.5px;

  color: #777;

}

/* =====================================================
   SIN HORARIOS
===================================================== */

.sin-horarios {

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 15px;

  border: 1px solid #e4eeee;

  border-radius: 8px;

  font-size: 10px;

  color: #777;

}

.sin-horarios-icono {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 30px;

  height: 30px;

  border-radius: 50%;

  background: #eef7f7;

}

/* =====================================================
   BOTONES
===================================================== */

.btn-restablecer,
.btn-guardar {

  width: 100%;

  border: none;

  border-radius: 7px;

  min-height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  font-size: 10.5px;

  cursor: pointer;

}

.btn-restablecer {

  margin-top: 7px;

  background: #f1f7fb;

  color: #526b79;

}

.btn-guardar {

  margin-top: 7px;

  background: #0f9f9f;

  color: white;

  font-weight: 600;

}

.btn-guardar:disabled {

  opacity: .6;

  cursor: not-allowed;

}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 360px) {

  .pagina {

    padding-left: 8px;

    padding-right: 8px;

  }

  .dia-tab {

    padding-left: 10px;

    padding-right: 10px;

  }

  .slot {

    grid-template-columns:
      1fr 38px 68px;

  }

}

.slot.ocupado {
  background: #f5f5f5;
}

.slot-ocupado-icon {
  width: 32px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #777;
}

.slot-estado.ocupado {
  color: #777;
  font-weight: 500;
}
</style>
