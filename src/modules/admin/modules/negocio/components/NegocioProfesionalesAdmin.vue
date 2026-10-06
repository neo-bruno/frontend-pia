<template>
<div class="pagina">

  <!-- ===================================================== -->
  <!-- TÍTULO -->
  <!-- ===================================================== -->

  <div class="page-title">

    <h1>Horarios</h1>

    <p>
      Asigna qué profesionales atienden en cada horario
    </p>

  </div>

  <!-- ===================================================== -->
  <!-- HORARIO DEL NEGOCIO -->
  <!-- ===================================================== -->

  <div class="negocio-card">

    <div class="negocio-left">

      <v-icon size="16" class="negocio-icon">
        mdi-store-outline
      </v-icon>

      <span>
        Horario del negocio
      </span>

    </div>

    <div class="negocio-nombre">
      {{ negocio.nombre }}
    </div>

  </div>

  <!-- ===================================================== -->
  <!-- INFORMACIÓN -->
  <!-- ===================================================== -->

  <div class="info-card">

    <div class="info-icon">

      <v-icon size="15">
        mdi-information
      </v-icon>

    </div>

    <div class="info-text">

      Selecciona los profesionales que atienden en cada
      horario del negocio.

    </div>

  </div>

  <!-- ===================================================== -->
  <!-- DÍAS -->
  <!-- ===================================================== -->

  <div class="dias-container">

    <div v-for="dia in dias" :key="dia.id" class="dia">

      <!-- ================================================= -->
      <!-- CABECERA DEL DÍA -->
      <!-- ================================================= -->

      <div class="dia-header" :class="{ activo: dia.expandido }" @click="toggleDia(dia)">

        <div class="dia-nombre">
          {{ dia.nombre }}
        </div>

        <div class="dia-resumen">

          <!-- CERRADO -->

          <template v-if="dia.horarios.length === 0">

            <v-icon size="12">
              mdi-store-outline
            </v-icon>

            <span>
              Cerrado
            </span>

          </template>

          <!-- HORARIOS -->

          <template v-else>

            <v-icon size="12">
              mdi-clock-outline
            </v-icon>

            <span>
              {{ dia.horarios.length }}
              {{ dia.horarios.length === 1?'horario' : 'horarios' }}
            </span>

          </template>

          <v-icon size="14" class="flecha" :class="{ arriba: dia.expandido }">
            mdi-chevron-right
          </v-icon>

        </div>

      </div>

      <!-- ================================================= -->
      <!-- CONTENIDO DEL DÍA -->
      <!-- ================================================= -->

      <div v-if="dia.expandido && dia.horarios.length" class="dia-contenido">

        <!-- =============================================== -->
        <!-- HORARIOS -->
        <!-- =============================================== -->

        <div v-for="horario in dia.horarios" :key="horario.id" class="horario">

          <!-- --------------------------------------------- -->
          <!-- CABECERA HORARIO -->
          <!-- --------------------------------------------- -->

          <div class="horario-header">

            <div class="horario-hora">

              <v-icon size="13">
                mdi-clock-outline
              </v-icon>

              <span>
                {{ horario.hora_inicio }}
                –
                {{ horario.hora_fin }}
              </span>

            </div>

          </div>

          <!-- --------------------------------------------- -->
          <!-- PROFESIONALES -->
          <!-- --------------------------------------------- -->

          <div class="profesionales">

            <div v-for="profesional in profesionales" :key="profesional.profesional_id" class="profesional" @click.stop="
                  cambiarAsignacion(
                    horario,
                    profesional.profesional_id
                  )
                ">

              <!-- CHECK -->
              <div class="check">
                <v-checkbox :model-value="estaAsignado(horario, profesional.profesional_id) " hide-details density="compact" color="#0f9999" @click.stop @update:model-value="cambiarAsignacion(horario, profesional.profesional_id)" />
              </div>

              <!-- FOTO -->
              <div class="avatar">
                <img v-if="profesional.foto" :src="profesional.foto" :alt="profesional.nombre" />

                <span v-else>
                  {{ iniciales(profesional.nombre) }}
                </span>
              </div>

              <!-- INFORMACIÓN -->
              <div class="profesional-datos">

                <div class="profesional-nombre">
                  {{ profesional.nombre }}
                </div>

                <div class="profesional-tipo">
                  {{ profesional.tipo }}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- ================================================= -->
      <!-- SIN HORARIOS -->
      <!-- ================================================= -->

      <div v-if="dia.expandido && !dia.horarios.length" class="sin-horarios">

        <v-icon size="15">
          mdi-store-outline
        </v-icon>

        No tienes horarios asignados

      </div>

    </div>

  </div>

  <!-- ===================================================== -->
  <!-- GUARDAR -->
  <!-- ===================================================== -->

  <div class="guardar-wrapper">

    <v-btn block class="btn-guardar" :loading="guardando" elevation="0" @click="guardarAsignaciones">

      <v-icon size="15">
        mdi-content-save-outline
      </v-icon>

      <span>
        Guardar asignaciones
      </span>

    </v-btn>

  </div>

</div>

<!-- capa protectora de proceso -->
<v-overlay :model-value="overlay" class="align-center justify-center" persistent>
  <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
</v-overlay>
</template>

<script>
import {
  getProfessionalHours,
  saveProfessionalHours
} from '../../horario-profesional/services/horarioProfesional.api';
import {
  getBusinessHours
} from '../../horarios/services/horario.api';
import {
  getProfessionalBusiness
} from '../../profesional-negocio/services/profesionalnegocio.api';

export default {

  name: 'NegocioHorariosProfesionalesAdmin',

  data() {

    return {

      guardando: false,

      // =====================================================
      // NEGOCIO
      // =====================================================

      negocio: {

        id: 1,

        nombre: 'Barbería El Estilo'

      },

      // =====================================================
      // PROFESIONALES
      // =====================================================

      profesionales: [

        {
          profesional_id: 1,
          nombre: 'Adrian Rogers',
          tipo: 'Barbero',
          foto: null
        },

        {
          profesional_id: 2,
          nombre: 'Roly',
          tipo: 'Estilista',
          foto: null
        },

        {
          profesional_id: 3,
          nombre: 'María López',
          tipo: 'Manicurista',
          foto: null
        },

        {
          profesional_id: 4,
          nombre: 'Carla Gómez',
          tipo: 'Estilista',
          foto: null
        }

      ],

      // =====================================================
      // DÍAS
      // =====================================================

      dias: [

        {
          id: 1,
          nombre: 'Lunes',
          expandido: true,

          horarios: [

            {
              id: 1,
              hora_inicio: '08:00',
              hora_fin: '12:00',

              profesionales: [
                1,
                2
              ]

            },

            {
              id: 2,
              hora_inicio: '14:00',
              hora_fin: '19:00',

              profesionales: [
                1,
                3
              ]

            }

          ]

        },

        {
          id: 2,
          nombre: 'Martes',
          expandido: false,

          horarios: [

            {
              id: 3,
              hora_inicio: '08:00',
              hora_fin: '12:00',

              profesionales: [
                1,
                2
              ]

            },

            {
              id: 4,
              hora_inicio: '14:00',
              hora_fin: '19:00',

              profesionales: [
                1
              ]

            }

          ]

        },

        {
          id: 3,
          nombre: 'Miércoles',
          expandido: false,
          horarios: []

        },

        {
          id: 4,
          nombre: 'Jueves',
          expandido: false,

          horarios: [

            {
              id: 5,
              hora_inicio: '08:00',
              hora_fin: '12:00',

              profesionales: [
                1,
                2
              ]

            },

            {
              id: 6,
              hora_inicio: '14:00',
              hora_fin: '19:00',

              profesionales: [
                1,
                3
              ]

            }

          ]

        },

        {
          id: 5,
          nombre: 'Viernes',
          expandido: false,

          horarios: [

            {
              id: 7,
              hora_inicio: '08:00',
              hora_fin: '12:00',

              profesionales: [
                1,
                2
              ]

            },

            {
              id: 8,
              hora_inicio: '14:00',
              hora_fin: '19:00',

              profesionales: [
                1,
                3
              ]

            }

          ]

        },

        {
          id: 6,
          nombre: 'Sábado',
          expandido: false,

          horarios: [

            {
              id: 9,
              hora_inicio: '09:00',
              hora_fin: '13:00',

              profesionales: [
                1
              ]

            }

          ]

        },

        {
          id: 7,
          nombre: 'Domingo',
          expandido: false,
          horarios: []

        }

      ],

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

    // =====================================================
    // EXPANDIR DÍA
    // =====================================================

    toggleDia(dia) {

      if (!dia.horarios.length) {
        return
      }

      dia.expandido = !dia.expandido

    },

    // =====================================================
    // VERIFICAR ASIGNACIÓN
    // =====================================================
    estaAsignado(horario, profesionalId) {
      return horario.profesionales.includes(profesionalId)
    },

    // =====================================================
    // CAMBIAR ASIGNACIÓN
    // =====================================================

    cambiarAsignacion(
      horario,
      profesionalId
    ) {

      const index =
        horario.profesionales.indexOf(
          profesionalId
        )

      if (index === -1) {

        horario.profesionales.push(
          profesionalId
        )

      } else {

        horario.profesionales.splice(
          index,
          1
        )

      }

    },

    // =====================================================
    // INICIALES
    // =====================================================

    iniciales(nombre) {

      if (!nombre) {
        return ''
      }

      const partes =
        nombre
        .trim()
        .split(/\s+/)

      if (partes.length === 1) {

        return partes[0]
          .substring(0, 2)
          .toUpperCase()

      }

      return (
        partes[0][0] +
        partes[1][0]
      ).toUpperCase()

    },

    aplicarAsignaciones(asignaciones) {
      asignaciones.forEach(asignacion => {

        const horarioId = Number(asignacion.horario_id)
        const profesionalId = Number(asignacion.profesional_id)

        this.dias.forEach(dia => {
          const horario = dia.horarios.find(h => Number(h.id) === horarioId)
          if (!horario) {
            return
          }

          if (!horario.profesionales.includes(profesionalId)) {
            horario.profesionales.push(profesionalId)
          }
        })
      })
    },

    // =====================================================
    // GUARDAR
    // =====================================================

    async guardarAsignaciones() {
      this.guardando = true
      this.overlay = true
      try {
        const asignaciones = []
        this.dias.forEach(dia => {
          dia.horarios.forEach(horario => {
            horario.profesionales.forEach(
              profesionalId => {
                asignaciones.push({
                  horario_id: horario.id,
                  profesional_id: profesionalId
                })
              }
            )
          })
        })

        console.log('ASIGNACIONES:', asignaciones)
        /*
        =====================================================
        POSTERIOR

        await horarioProfesionalService
          .guardarAsignaciones(asignaciones)
        =====================================================
        */

        const res = await saveProfessionalHours(asignaciones)

        if (res.status === 200) {
          this.$swal({
            icon: 'success',
            title: 'Guardado',
            text: 'Las asignaciones fueron guardadas correctamente.',
            timer: 1600,
            showConfirmButton: false,
            didClose: () => {
              this.$router.go(-1)
            },
          })
        }
      } catch (error) {
        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })
      } finally {
        this.overlay = false
        this.guardando = false
      }
    },

    async obtenerProfesionalesNegocio() {
      try {
        this.overlay = true

        const res = await getProfessionalBusiness()
        if (res.data.ok) {
          this.profesionales = res.data.data.profesionales
          this.negocio = res.data.data.negocio
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
      }
    },

    async obtenerHorariosNegocio() {
      try {
        this.overlay = true

        const res = await getBusinessHours()
        if (res.data.ok) {
          const diasBackend = res.data.data.dias || []
          /*
          =====================================================
          TRANSFORMAMOS LOS DÍAS DEL NEGOCIO
          AL FORMATO QUE NECESITA ESTA PANTALLA
          =====================================================
          */

          this.dias = diasBackend.map((dia, index) => ({
            id: dia.id,
            nombre: dia.nombre,
            // Solo Lunes inicia expandido
            expandido: index === 0,
            horarios: (dia.horarios || []).map((horario, horarioIndex) => ({
              /*
              IMPORTANTE:
              El backend debe enviar el ID real del horario.
              */
              id: horario.id,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              /*
              Por ahora las asignaciones empiezan vacías.
              Después aquí cargaremos horario_profesional.
              */
              profesionales: []

            }))
          }))
          /*
          =====================================================
          NEGOCIO
          =====================================================
          */

          if (res.data.data.negocio) {
            this.negocio = res.data.data.negocio
          }
          console.log('DÍAS TRANSFORMADOS:', this.dias)
        }

      } catch (error) {
        console.error('ERROR OBTENIENDO HORARIOS:', error)

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
      }
    },

    async obtenerAsignaciones() {
      try {
        this.overlay = true

        const res = await getProfessionalHours()
        if (res.data.ok) {
          this.aplicarAsignaciones(res.data.data.asignaciones || [])
        }

      } catch (error) {
        console.error('ERROR OBTENIENDO ASIGNACIONES:', error)

        this.$swal({
          title: "Error!",
          text: error.response?.data?.message ||
            error.message ||
            "No se pudieron obtener las asignaciones",
          icon: "error",
          timer: 2500
        })

      } finally {
        this.overlay = false
      }
    },

    async cargarDatos() {
      try {
        this.overlay = true
        // -----------------------------------------------
        // 1. HORARIOS
        // -----------------------------------------------
        const resHorarios = await getBusinessHours()

        if (!resHorarios.data.ok) {
          throw new Error(
            "No se pudieron obtener los horarios"
          )
        }
        const diasBackend = resHorarios.data.data.dias || []
        this.dias = diasBackend.map((dia, index) => ({
          id: dia.id,
          nombre: dia.nombre,
          expandido: index === 0,
          horarios:
            (dia.horarios || []).map(horario => ({
              id: horario.id,
              hora_inicio: horario.hora_inicio,
              hora_fin: horario.hora_fin,
              profesionales: []
            }))
        }))
        // -----------------------------------------------
        // 2. PROFESIONALES
        // -----------------------------------------------
        const resProfesionales = await getProfessionalBusiness()

        if (!resProfesionales.data.ok) {
          throw new Error(
            "No se pudieron obtener los profesionales"
          )
        }
        this.profesionales = resProfesionales.data.data.profesionales
        this.negocio = resProfesionales.data.data.negocio

        // -----------------------------------------------
        // 3. ASIGNACIONES
        // -----------------------------------------------
        const resAsignaciones = await getProfessionalHours()
        if (!resAsignaciones.data.ok) {
          throw new Error(
            "No se pudieron obtener las asignaciones"
          )
        }
        const asignaciones = resAsignaciones.data.data.asignaciones || []

        // -----------------------------------------------
        // 4. APLICAR RELACIÓN
        // -----------------------------------------------
        this.aplicarAsignaciones(
          asignaciones
        )
        console.log("DATOS FINALES:", {
            negocio: this.negocio,
            profesionales: this.profesionales,
            dias: this.dias
          }
        )

      } catch (error) {
        console.error("ERROR CARGANDO HORARIOS PROFESIONALES:", error)

        this.$swal({
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.message ||
            "Ocurrió un error inesperado",
          icon: "error",
          timer: 2500
        })

      } finally {
        this.overlay = false
      }
    }
  },

  mounted() {
    this.cargarDatos()
  }
}
</script>

<style lang="scss" scoped>
/* ========================================================= */
/* PÁGINA */
/* ========================================================= */

.pagina {

  width: 100%;

  max-width: 430px;

  margin: 0 auto;

  padding: 10px 10px 78px;

  color: #17324d;

}

/* ========================================================= */
/* TÍTULO */
/* ========================================================= */

.page-title {

  margin-bottom: 10px;

}

.page-title h1 {

  margin: 0;

  font-size: 25px;

  line-height: 1.15;

  font-weight: 700;

  color: #102f4d;

}

.page-title p {

  margin: 3px 0 0;

  font-size: 12.5px;

  line-height: 1.35;

  color: #58728a;

}

/* ========================================================= */
/* NEGOCIO */
/* ========================================================= */

.negocio-card {

  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 35px;

  padding: 6px 9px;

  margin-bottom: 7px;

  border: 1px solid #e5ebef;

  border-radius: 7px;

  background: #f8fafb;

  overflow: hidden;

}

.negocio-left {

  display: flex;

  align-items: center;

  gap: 6px;

  min-width: 0;

}

.negocio-icon {

  color: #315978;

}

.negocio-left span {

  font-size: 11.5px;

  font-weight: 600;

  color: #38566e;

}

.negocio-nombre {

  max-width: 48%;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 11.5px;

  color: #688096;

}

/* ========================================================= */
/* INFORMACIÓN */
/* ========================================================= */

.info-card {

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px 9px;

  margin-bottom: 8px;

  border-radius: 7px;

  background: #edf6ff;

}

.info-icon {

  width: 21px;

  height: 21px;

  flex: 0 0 21px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #d9ecff;

  color: #1976d2;

}

.info-text {

  font-size: 11px;

  line-height: 1.35;

  color: #54718b;

}

/* ========================================================= */
/* DÍAS */
/* ========================================================= */

.dias-container {

  width: 100%;

}

.dia {

  width: 100%;

  margin-bottom: 4px;

  border: 1px solid #e5ebef;

  border-radius: 6px;

  overflow: hidden;

  background: white;

}

/* ========================================================= */
/* CABECERA DÍA */
/* ========================================================= */

.dia-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 33px;

  padding: 6px 8px;

  cursor: pointer;

  background: #f7fafb;

}

.dia-header.activo {

  background: #edf7f7;

}

.dia-nombre {

  font-size: 12.5px;

  font-weight: 700;

  color: #17324d;

}

.dia-resumen {

  display: flex;

  align-items: center;

  gap: 4px;

  color: #7a8d9c;

  font-size: 9.5px;

}

.dia-resumen .v-icon {

  color: #627c91;

}

.flecha {

  margin-left: 3px;

  transition: transform .2s ease;

}

.flecha.arriba {

  transform: rotate(90deg);

}

/* ========================================================= */
/* CONTENIDO DÍA */
/* ========================================================= */

.dia-contenido {

  padding: 4px 5px 5px;

}

/* ========================================================= */
/* HORARIO */
/* ========================================================= */

.horario {

  margin-bottom: 5px;

  border: 1px solid #edf1f4;

  border-radius: 6px;

  overflow: hidden;

}

.horario:last-child {

  margin-bottom: 0;

}

.horario-header {

  display: flex;

  align-items: center;

  min-height: 28px;

  padding: 4px 7px;

  background: #f8fafb;

}

.horario-hora {

  display: flex;

  align-items: center;

  gap: 5px;

  font-size: 11px;

  font-weight: 600;

  color: #274762;

}

.horario-hora .v-icon {

  color: #627c91;

}

/* ========================================================= */
/* PROFESIONALES */
/* ========================================================= */

.profesionales {

  padding: 1px 6px;

}

.profesional {

  display: flex;

  align-items: center;

  min-height: 38px;

  gap: 5px;

  border-bottom: 1px solid #f1f3f5;

  cursor: pointer;

}

.profesional:last-child {

  border-bottom: none;

}

/* ========================================================= */
/* CHECKBOX */
/* ========================================================= */

.check {

  width: 27px;

  flex: 0 0 27px;

}

.check :deep(.v-selection-control) {

  min-height: 27px;

}

.check :deep(.v-selection-control__wrapper) {

  width: 27px;

  height: 27px;

}

.check :deep(.v-icon) {

  font-size: 19px;

}

/* ========================================================= */
/* AVATAR */
/* ========================================================= */

.avatar {

  width: 32px;

  height: 32px;

  flex: 0 0 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  border-radius: 50%;

  background: #e6f4f4;

  color: #0f9999;

  font-size: 10px;

  font-weight: 700;

}

.avatar img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}

/* ========================================================= */
/* DATOS PROFESIONAL */
/* ========================================================= */

.profesional-datos {

  min-width: 0;

  flex: 1;

}

.profesional-nombre {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 12px;

  line-height: 1.2;

  font-weight: 600;

  color: #17324d;

}

.profesional-tipo {

  margin-top: 2px;

  font-size: 11px;

  line-height: 1.15;

  color: #71879a;

}

/* ========================================================= */
/* SIN HORARIOS */
/* ========================================================= */

.sin-horarios {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  min-height: 35px;

  font-size: 10.5px;

  color: #7c8d99;

  background: #f6f8f9;

}

/* ========================================================= */
/* GUARDAR */
/* ========================================================= */

.guardar-wrapper {

  position: fixed;

  left: 50%;

  bottom: 68px;

  width: min(100% - 20px, 410px);

  transform: translateX(-50%);

  z-index: 20;

  padding: 5px 0;

  background: rgba(255, 255, 255, .96);

}

.btn-guardar {

  height: 36px !important;

  min-height: 36px !important;

  border-radius: 6px !important;

  background: #0f9999 !important;

  color: white !important;

  text-transform: none !important;

  font-size: 11.5px !important;

  font-weight: 600 !important;

  gap: 5px;

}

.btn-guardar .v-icon {

  margin-right: 3px;

}

/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (min-width: 600px) {

  .pagina {

    max-width: 430px;

    padding-left: 12px;

    padding-right: 12px;

  }

}
</style>
