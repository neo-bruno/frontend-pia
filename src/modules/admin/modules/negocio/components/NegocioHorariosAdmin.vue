<template>
<div class="negocio-horarios">

  <!-- =========================================
         HEADER
    ========================================== -->
  <div class="page-header">
    <h1>
      <!-- <v-icon @click="">mdi-undo</v-icon> -->
      Horarios del negocio
    </h1>

    <p>
      Configura los días y horarios de atención de tu negocio.
    </p>

  </div>

  <!-- =========================================
         INFORMACIÓN
    ========================================== -->
  <div class="info-card">

    <v-icon icon="mdi-information-outline" class="info-icon" size="20" />

    <div class="info-content">

      <div class="info-title">
        Horarios generales
      </div>

      <div class="info-text">
        Estos son los horarios generales de atención
        de tu negocio.
      </div>

    </div>

  </div>

  <!-- =========================================
         DÍAS
    ========================================== -->
  <div v-for="dia in dias" :key="dia.id" class="dia-card">

    <!-- CABECERA DEL DÍA -->
    <div class="dia-header">

      <div class="dia-nombre">
        {{ dia.nombre }}
      </div>

      <div class="dia-estado">

        <v-switch v-model="dia.abierto" color="primary" hide-details density="compact" inset />

        <span :class="{
              'estado-abierto': dia.abierto,
              'estado-cerrado': !dia.abierto
            }">
          {{ dia.abierto ? 'Abierto' : 'Cerrado' }}
        </span>

      </div>

    </div>

    <!-- =======================================
           DÍA CERRADO
      ======================================== -->
    <div v-if="!dia.abierto" class="cerrado-container">

      <v-icon icon="mdi-store-outline" size="20" />

      <span>
        No atiende este día
      </span>

    </div>

    <!-- =======================================
           HORARIOS DEL DÍA
      ======================================== -->
    <template v-else>

      <div v-for="(horario, index) in dia.horarios" :key="index" class="horario-row">

        <!-- ICONO RELOJ -->
        <div class="horario-icon">

          <v-icon icon="mdi-clock-outline" size="18" />

        </div>

        <!-- HORA INICIO -->
        <v-text-field v-model="horario.hora_inicio" type="time" variant="outlined" density="compact" hide-details class="hora-input" />

        <!-- SEPARADOR -->
        <span class="separador">
          –
        </span>

        <!-- HORA FIN -->
        <v-text-field v-model="horario.hora_fin" type="time" variant="outlined" density="compact" hide-details class="hora-input" />

        <!-- ELIMINAR -->
        <v-btn icon variant="text" color="error" class="btn-eliminar" @click="eliminarHorario(dia, index)">

          <v-icon icon="mdi-delete" size="19" />

        </v-btn>

      </div>

      <!-- =====================================
             AGREGAR HORARIO
        ====================================== -->
      <v-btn block variant="outlined" color="primary" class="agregar-horario" @click="agregarHorario(dia)">

        <v-icon icon="mdi-plus" size="18" />

        <span>
          Agregar horario
        </span>

      </v-btn>

    </template>

  </div>

  <!-- =========================================
         GUARDAR
    ========================================== -->
  <div class="guardar-container">

    <v-btn block color="primary" class="guardar-btn" @click="guardarHorariosNegocio">

      <v-icon icon="mdi-content-save-outline" size="19" class="mr-2" />

      Guardar horarios

    </v-btn>

  </div>

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>

</template>

<script>
import { getBusinessHours, saveBusinessHours } from '../../horarios/services/horario.api';

export default {

  name: 'NegocioHorariosAdmin',

  data() {

    return {

      dias: [
        {
          id: 1,
          nombre: 'Lunes',
          abierto: true,
          horarios: [{
              hora_inicio: '08:00',
              hora_fin: '12:00'
            },
            {
              hora_inicio: '14:00',
              hora_fin: '19:00'
            }
          ]
        },

        {
          id: 2,
          nombre: 'Martes',
          abierto: true,
          horarios: [{
              hora_inicio: '08:00',
              hora_fin: '12:00'
            },
            {
              hora_inicio: '14:00',
              hora_fin: '19:00'
            }
          ]
        },

        {
          id: 3,
          nombre: 'Miércoles',
          abierto: false,
          horarios: []
        },

        {
          id: 4,
          nombre: 'Jueves',
          abierto: true,
          horarios: [{
              hora_inicio: '08:00',
              hora_fin: '12:00'
            },
            {
              hora_inicio: '14:00',
              hora_fin: '19:00'
            }
          ]
        },

        {
          id: 5,
          nombre: 'Viernes',
          abierto: true,
          horarios: [{
              hora_inicio: '08:00',
              hora_fin: '12:00'
            },
            {
              hora_inicio: '14:00',
              hora_fin: '19:00'
            }
          ]
        },

        {
          id: 6,
          nombre: 'Sábado',
          abierto: true,
          horarios: [{
            hora_inicio: '09:00',
            hora_fin: '13:00'
          }]
        },

        {
          id: 7,
          nombre: 'Domingo',
          abierto: false,
          horarios: []
        }
      ],
      negocio: null,
      
      overlay: false,
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

    agregarHorario(dia) {
      dia.horarios.push({
        hora_inicio: '08:00',
        hora_fin: '12:00'
      })
    },

    eliminarHorario(dia, index) {
      dia.horarios.splice(index, 1)
    },

    guardarHorariosNegocio() {
      console.log('HORARIOS DEL NEGOCIO:', this.dias)
    },
    
    async guardarHorariosNegocio() {
      try {
        if (this.dias.length == 0) {
          this.$swal({
            title: "Error!",
            text: "No puede estar vacio los horarios.",
            icon: "error",
            timer: 2500
          })
          return
        }

        this.overlay = true

        const res = await saveBusinessHours(this.dias)

        if (res.status === 200) {
          this.$swal({
            title: "Horario del Negocio Guardado!",
            text: "Se ha guardado los horarios del negocio correctamente!",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.$router.go(-1)
            }
          })
        }

      } catch (error) {
        this.$swal({
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })
      } finally {
        this.overlay = false
      }
    },

    async obtenerHorariosNegocio(){
      try {
        this.overlay = true

        const res = await getBusinessHours()
        if (res.data.ok) {
          console.log('OBTENER HORARIOS NEGOCIO: ', res)
          this.dias = res.data.data.dias
          this.negocio = res.data.data.negocio
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500,          
        })
      } finally {
        this.overlay = false
      }
    },

  },

  mounted(){
    this.obtenerHorariosNegocio()
  }

}
</script>

<style lang="scss" scoped>
.negocio-horarios {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px 85px;
}

/* =========================================
   HEADER
========================================= */

.page-header {
  margin-bottom: 12px;
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
  color: #17324d;
}

.page-header p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.35;
  color: #66809a;
}

/* =========================================
   INFORMACIÓN
========================================= */

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  width: 100%;
  box-sizing: border-box;

  padding: 10px;
  margin-bottom: 12px;

  border-radius: 9px;

  background: #eef7ff;
  color: #315a7d;
}

.info-icon {
  color: #2586df;
  flex-shrink: 0;
}

.info-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}

.info-text {
  font-size: 11px;
  line-height: 1.35;
}

/* =========================================
   DÍA
========================================= */

.dia-card {
  width: 100%;
  box-sizing: border-box;

  padding: 10px;

  margin-bottom: 10px;

  border: 1px solid #e2ebf2;
  border-radius: 9px;

  background: #ffffff;
}

.dia-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 6px;

  margin-bottom: 8px;
}

.dia-nombre {
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  color: #17324d;
}

.dia-estado {
  display: flex;
  align-items: center;

  gap: 2px;

  flex-shrink: 0;
}

.dia-estado span {
  font-size: 11px;
}

.estado-abierto {
  color: #64829d;
}

.estado-cerrado {
  color: #8a9aaa;
}

/* =========================================
   FILA DE HORARIO
========================================= */

.horario-row {
  display: flex;
  align-items: center;

  width: 100%;
  box-sizing: border-box;

  gap: 5px;

  margin-bottom: 7px;
}

/* reloj */

.horario-icon {
  width: 23px;
  min-width: 23px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #69849d;
}

/* =========================================
   CAMPOS DE HORA
========================================= */

.hora-input {
  flex: 1 1 0;
  min-width: 0;
  width: auto;
}

/*
  Altura del campo
*/

.hora-input :deep(.v-field) {
  min-height: 36px;
  height: 36px;

  border-radius: 6px;
}

.hora-input :deep(.v-field__input) {
  min-height: 36px;

  padding: 0 6px;

  font-size: 12px;
}

/*
  Texto de la hora
*/

.hora-input :deep(input) {
  width: 100%;

  font-size: 12px;

  text-align: center;
}

/* =========================================
   SEPARADOR
========================================= */

.separador {
  flex: 0 0 auto;

  font-size: 13px;
  font-weight: 600;

  color: #506a82;
}

/* =========================================
   BOTÓN ELIMINAR
========================================= */

.btn-eliminar {
  flex: 0 0 28px;

  width: 28px;
  min-width: 28px !important;

  height: 32px !important;

  padding: 0 !important;
}

/* =========================================
   AGREGAR HORARIO
========================================= */

.agregar-horario {
  width: 100%;

  height: 36px !important;

  margin-top: 3px;

  border-style: dashed !important;
  border-radius: 7px;

  font-size: 12px;

  text-transform: none;
}

/* =========================================
   DÍA CERRADO
========================================= */

.cerrado-container {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  min-height: 48px;

  border-radius: 7px;

  background: #f4f6f8;

  color: #7d8d9b;

  font-size: 12px;
}

/* =========================================
   GUARDAR
========================================= */

.guardar-container {
  position: sticky;

  bottom: 0;

  width: 100%;

  box-sizing: border-box;

  padding: 7px 0;

  background: #ffffff;

  z-index: 10;
}

.guardar-btn {
  width: 100%;

  height: 44px !important;

  border-radius: 8px;

  font-size: 13px;

  text-transform: none;
}

/* =========================================
   CELULARES PEQUEÑOS
========================================= */

@media (max-width: 360px) {

  .negocio-horarios {
    padding-left: 7px;
    padding-right: 7px;
  }

  .dia-card {
    padding: 9px;
  }

  .dia-nombre {
    font-size: 15px;
  }

  .dia-estado span {
    font-size: 10px;
  }

  .horario-row {
    gap: 4px;
  }

  .horario-icon {
    width: 21px;
    min-width: 21px;
  }

  .hora-input :deep(.v-field) {
    min-height: 35px;
    height: 35px;
  }

  .hora-input :deep(.v-field__input) {
    min-height: 35px;
    padding: 0 4px;
    font-size: 11px;
  }

  .hora-input :deep(input) {
    font-size: 11px;
  }

  .separador {
    font-size: 12px;
  }

  .btn-eliminar {
    flex-basis: 26px;

    width: 26px;
    min-width: 26px !important;
  }

  .agregar-horario {
    height: 34px !important;
    font-size: 11px;
  }

  .info-text {
    font-size: 10.5px;
  }

  .guardar-btn {
    height: 42px !important;
    font-size: 12px;
  }
}
</style>
