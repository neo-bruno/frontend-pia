<template>
<div class="perfil-page">

  <!-- =========================================================
         HEADER
    ========================================================== -->
    <section class="page-header">
      <button class="back-button" @click="volver">
        <v-icon size="21">mdi-arrow-left</v-icon>
      </button>

      <div class="page-header-text">
        <h1>Mi Perfil</h1>
        <p>Modifica los datos del cliente</p>
      </div>
    </section>

  <!-- =========================================================
         LOADING
    ========================================================== -->
  <div v-if="loading" class="loading-container">
    <v-progress-circular indeterminate size="36" width="3" color="#008b8b" />

    <span>Cargando perfil...</span>
  </div>

  <!-- =========================================================
         CONTENIDO
    ========================================================== -->
  <div v-else class="perfil-content">

    <!-- =======================================================
           PERFIL PRINCIPAL
      ======================================================== -->
    <div class="perfil-principal">

      <div class="avatar-container">
        <v-icon size="38">mdi-account</v-icon>
      </div>

      <div class="perfil-nombre">

        <h2>
          {{ cliente.alias || cliente.nombre || 'Cliente PIA' }}
        </h2>

        <p v-if="cliente.alias && cliente.nombre">
          {{ cliente.nombre }}
        </p>

        <span>Cliente PIA</span>

      </div>

    </div>

    <!-- =======================================================
           INFORMACIÓN PERSONAL
      ======================================================== -->
    <section class="perfil-section">

      <div class="section-title">
        <span>Información personal</span>
      </div>

      <div class="info-card">

        <!-- Nombre -->
        <div class="info-row">

          <div class="info-icon">
            <v-icon size="21">mdi-account-outline</v-icon>
          </div>

          <div class="info-content">
            <span class="info-label">Nombre</span>

            <strong>
              {{ cliente.nombre || 'No registrado' }}
            </strong>
          </div>

        </div>

        <!-- Alias -->
        <div class="info-row">

          <div class="info-icon">
            <v-icon size="21">mdi-card-account-details-outline</v-icon>
          </div>

          <div class="info-content">
            <span class="info-label">Alias</span>

            <strong>
              {{ cliente.alias || 'No registrado' }}
            </strong>
          </div>

        </div>

        <!-- Teléfono -->
        <div class="info-row">

          <div class="info-icon">
            <v-icon size="21">mdi-phone-outline</v-icon>
          </div>

          <div class="info-content">
            <span class="info-label">Teléfono</span>

            <strong>
              {{ cliente.telefono || 'No registrado' }}
            </strong>
          </div>

        </div>

        <!-- Sexo -->
        <div class="info-row">

          <div class="info-icon">
            <v-icon size="21">mdi-gender-male-female</v-icon>
          </div>

          <div class="info-content">
            <span class="info-label">Sexo</span>

            <strong>
              {{ formatearSexo(cliente.sexo) }}
            </strong>
          </div>

        </div>

        <!-- Fecha nacimiento -->
        <div class="info-row">

          <div class="info-icon">
            <v-icon size="21">mdi-calendar-account-outline</v-icon>
          </div>

          <div class="info-content">
            <span class="info-label">Fecha de nacimiento</span>

            <strong>
              {{ formatearFecha(cliente.fecha_nacimiento) }}
            </strong>
          </div>

        </div>

      </div>

    </section>

    <!-- =======================================================
           EDITAR PERFIL
      ======================================================== -->
    <section class="perfil-section">

      <div class="action-card" @click="editarPerfil">

        <div class="action-icon edit-icon">
          <v-icon size="22">mdi-pencil-outline</v-icon>
        </div>

        <div class="action-content">

          <strong>Editar perfil</strong>

          <span>
            Actualiza tu información personal
          </span>

        </div>

        <v-icon class="action-arrow">
          mdi-chevron-right
        </v-icon>

      </div>

    </section>

    <!-- =======================================================
           CUENTA
      ======================================================== -->
    <section class="perfil-section cuenta-section">

      <div class="section-title">
        <span>CUENTA</span>
      </div>

      <div class="action-card logout-card" @click="confirmarCerrarSesion">

        <div class="action-icon logout-icon">
          <v-icon size="22">
            mdi-logout
          </v-icon>
        </div>

        <div class="action-content">

          <strong>Cerrar sesión</strong>

          <span>
            Salir de tu cuenta de PIA
          </span>

        </div>

        <v-icon class="action-arrow">
          mdi-chevron-right
        </v-icon>

      </div>

    </section>

    <div class="version">
      PIA · Cliente
    </div>

  </div>

</div>

<EditarPerfilCliente v-model="mostrarEditarPerfil" :cliente="cliente" @actualizado="perfilActualizado"/>
</template>

<script>
import {
  getClientePerfil
} from "@/modules/publico/modules/cliente/services/cliente.api";
import EditarPerfilCliente from "../components/EditarPerfilCliente.vue";

export default {
  name: 'PerfilClientePage',
  components: {
    EditarPerfilCliente,
  }, 

  data() {
    return {
      loading: true,

      cliente: {
        id: null,
        persona_id: null,
        alias: null,
        telefono: null,
        nombre: null,
        sexo: null,
        fecha_nacimiento: null
      }, 

      mostrarEditarPerfil: false,
    }
  },

  async mounted() {
    await this.cargarPerfil()
  },

  methods: {

    // =========================================================
    // CARGAR PERFIL
    // =========================================================
    async cargarPerfil() {

      this.loading = true

      try {

        const token = localStorage.getItem('cliente_token')

        if (!token) {
          this.loading = false

          await this.$piaAlert.warning('Debes iniciar sesión para continuar.',{ title: 'Sesión no encontrada' })

          this.$router.replace('/cliente/login')

          return
        }

        const response = await getClientePerfil()

        const data = response?.data?.data

        if (!data) {
          throw new Error('No se recibió información del cliente.')
        }

        this.cliente = {
          id: data.id?? null,
          persona_id: data.persona_id?? null,
          alias: data.alias?? null,
          telefono: data.telefono?? null,
          nombre: data.nombre?? null,
          sexo: data.sexo?? null,
          fecha_nacimiento: data.fecha_nacimiento?? null
        }

        // Actualizamos también la información local
        const clienteLocal = {
          ...JSON.parse(
            localStorage.getItem('cliente') || '{}'
          ),
          ...data
        }

        localStorage.setItem(
          'cliente',
          JSON.stringify(clienteLocal)
        )

      } catch (error) {

        console.error(
          'Error al cargar perfil del cliente:',
          error
        )

        // =====================================================
        // FALLBACK LOCAL
        // =====================================================

        try {

          const clienteLocal = JSON.parse(
            localStorage.getItem('cliente') || 'null'
          )

          if (clienteLocal) {

            this.cliente = {
              id: clienteLocal.id?? null,
              persona_id: clienteLocal.persona_id?? null,
              alias: clienteLocal.alias?? null,
              telefono: clienteLocal.telefono?? null,
              nombre: clienteLocal.nombre?? null,
              sexo: clienteLocal.sexo?? null,
              fecha_nacimiento: clienteLocal.fecha_nacimiento?? null
            }

            this.loading = false

            return
          }

        } catch (localError) {

          console.error(
            'Error leyendo cliente local:',
            localError
          )

        }

        this.$piaAlert.error(
          'No fue posible obtener la información de tu cuenta.',
          {
            title: 'No se pudo cargar el perfil'
          }
        )

      } finally {

        this.loading = false

      }
    },

    // =========================================================
    // EDITAR PERFIL
    // =========================================================
    editarPerfil() {
      this.mostrarEditarPerfil = true;
      // await this.$piaAlert.info('La edición del perfil estará disponible próximamente.', { title: 'Próximamente' })
    },
    
    perfilActualizado(clienteActualizado) {
      this.cliente = {
        ...this.cliente,
        ...clienteActualizado,
      };

      localStorage.setItem(
        "cliente",
        JSON.stringify({
          ...JSON.parse(
            localStorage.getItem("cliente") || "{}"
          ),
          ...clienteActualizado,
        })
      );
    },

    // =========================================================
    // CONFIRMAR CIERRE DE SESIÓN
    // =========================================================
    async confirmarCerrarSesion() {
      const confirmado = await this.$piaAlert.confirm({

        title: '¿Cerrar sesión?',

        message: 'Saldrás de tu cuenta de PIA.',

        cancelText: 'Cancelar',

        confirmText: 'Cerrar sesión'

      })

      if (!confirmado) {
        return
      }

      localStorage.removeItem('cliente_token')
      localStorage.removeItem('cliente')

      this.$router.replace('/')

    },

    // =========================================================
    // FORMATEAR SEXO
    // =========================================================
    formatearSexo(sexo) {

      if (!sexo) {
        return 'No registrado'
      }

      const valor = String(sexo)
        .trim()
        .toUpperCase()

      const valores = {
        M: 'Masculino',
        MASCULINO: 'Masculino',
        F: 'Femenino',
        FEMENINO: 'Femenino',
        OTRO: 'Otro'
      }

      return valores[valor] || sexo
    },

    // =========================================================
    // FORMATEAR FECHA
    // =========================================================
    formatearFecha(fecha) {

      if (!fecha) {
        return 'No registrada'
      }

      try {

        const partes = String(fecha).substring(0, 10).split('-')

        if (partes.length !== 3) {
          return 'No registrada'
        }

        const [anio, mes, dia] = partes

        return `${dia}/${mes}/${anio}`

      } catch (error) {

        return 'No registrada'

      }
    },

    volver() {
      this.$router.push({name: 'cliente'});
    },
  }
}
</script>

<style scoped>
/* ============================================================
   CONTENEDOR
============================================================ */

.perfil-page {
  width: 100%;

  max-width: 100%;

  padding: 10px 10px 95px;

  box-sizing: border-box;
}

/* ============================================================
   HEADER
============================================================ */
.page-header {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 13px;

}
.back-button {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  border-radius: 12px;
  border: 1px solid #dcefee;
  background: #ffffff;
  color: #008b8b;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow: 0 4px 12px rgba(0, 139, 139, 0.07);
}

.page-header-text {
  flex: 1;
}

.page-header-text h1 {
  margin: 0;

  color: #102d5a;

  font-size: 20px;
  line-height: 1.15;
  font-weight: 700;
}

.page-header-text p {
  margin: 3px 0 0;
  font-size: 11px;
  line-height: 1.35;
  color: #60779a;
}

/* ============================================================
   LOADING
============================================================ */

.loading-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #78909c;
  font-size: 13px;
}

/* ============================================================
   CONTENIDO
============================================================ */

.perfil-content {
  padding: 18px 16px 30px;
}

/* ============================================================
   PERFIL PRINCIPAL
============================================================ */

.perfil-principal {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 4px 22px;
}

.avatar-container {
  width: 68px;
  height: 68px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #e8f7f7;
  color: #008b8b;

  border: 2px solid #d5eeee;
}

.perfil-nombre {
  min-width: 0;
}

.perfil-nombre h2 {
  margin: 0;

  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;

  color: #263238;

  word-break: break-word;
}

.perfil-nombre p {
  margin: 4px 0 0;

  font-size: 13px;
  color: #607d8b;

  word-break: break-word;
}

.perfil-nombre span {
  display: block;

  margin-top: 5px;

  font-size: 12px;
  font-weight: 600;

  color: #008b8b;
}

/* ============================================================
   SECCIONES
============================================================ */

.perfil-section {
  margin-top: 20px;
}

.section-title {
  padding: 0 2px 9px;
}

.section-title span {
  font-size: 12px;
  font-weight: 700;
  color: #607d8b;
  letter-spacing: 0.5px;
}

/* ============================================================
   INFORMACIÓN
============================================================ */

.info-card {
  overflow: hidden;

  border: 1px solid #dceeee;
  border-radius: 16px;

  background: #ffffff;
}

.info-row {
  display: flex;
  align-items: center;

  min-height: 68px;

  padding: 10px 13px;

  border-bottom: 1px solid #edf3f3;
}

.info-row:last-child {
  border-bottom: none;
}

.info-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 12px;

  border-radius: 11px;

  background: #eef9f9;
  color: #008b8b;
}

.info-content {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.info-label {
  font-size: 11px;
  color: #78909c;
}

.info-content strong {
  font-size: 14px;
  font-weight: 600;
  color: #263238;

  overflow-wrap: anywhere;
}

/* ============================================================
   ACTION CARDS
============================================================ */

.action-card {
  min-height: 72px;

  display: flex;
  align-items: center;

  padding: 10px 13px;

  border: 1px solid #dceeee;
  border-radius: 16px;

  background: #ffffff;

  cursor: pointer;

  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.action-card:active {
  transform: scale(0.985);
  background: #f7fbfb;
}

.action-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 12px;

  border-radius: 12px;
}

.edit-icon {
  color: #008b8b;
  background: #eef9f9;
}

.logout-icon {
  color: #ef4444;
  background: #fff1f1;
}

.action-content {
  min-width: 0;

  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 3px;
}

.action-content strong {
  font-size: 14px;
  font-weight: 700;
  color: #263238;
}

.action-content span {
  font-size: 11px;
  color: #78909c;
}

.action-arrow {
  color: #90a4ae;
  margin-left: 8px;
}

/* ============================================================
   CERRAR SESIÓN
============================================================ */

.cuenta-section {
  margin-top: 26px;
}

.logout-card {
  border-color: #ffd9d9;
}

.logout-card .action-content strong {
  color: #ef4444;
}

.logout-card .action-arrow {
  color: #ef4444;
}

/* ============================================================
   VERSION
============================================================ */

.version {
  text-align: center;

  margin-top: 30px;

  font-size: 10px;
  color: #b0bec5;
}

/* ============================================================
   DESKTOP
============================================================ */

@media (min-width: 768px) {

  .perfil-page {
    max-width: 430px;
    margin: 0 auto;
  }

}
</style>
