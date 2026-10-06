<template>
<v-dialog v-model="dialog" width="320" max-width="calc(100vw)" persistent scrim="rgba(0,0,0,0.35)" content-class="login-dialog-content">
  <v-card class="login-card">

    <!-- =========================
           CERRAR
      ========================== -->
    <button type="button" class="close-button" @click="cerrar">
      <v-icon size="20">
        mdi-close
      </v-icon>
    </button>

    <!-- =========================
           LOGO
      ========================== -->
    <div class="logo">
      PIA
    </div>

    <!-- =========================
           TITULO
      ========================== -->
    <div class="login-title">
      ¡Hola! 👋
    </div>

    <div class="login-subtitle">
      Ingresa tu teléfono
      <br>
      para continuar
    </div>

    <!-- =========================
           FORMULARIO
      ========================== -->
    <v-form ref="formulario" @submit.prevent="">

      <!-- =========================
             TELEFONO
        ========================== -->
      <div class="phone-wrapper">

        <vue-tel-input v-model="telefono" ref="telefonoInput" mode="national" default-country="BO" :dropdown-options="{
              showFlags: true,
              showSearchBox: true,
              showDialCodeInSelection: true
            }" :input-options="{
              placeholder: 'Teléfono',
              autocomplete: 'tel',
              maxlength: 15
            }" :valid-characters-only="true" :strict-validation="true" @validate="validarTelefono" @blur="onTelefonoBlur" @on-input="onPhoneUpdate" />

        <!-- ERROR TELEFONO -->
        <div v-if="telefonoTocado && telefono && !telefonoValido" class="telefono-error">
          <v-icon size="16">
            mdi-alert-circle-outline
          </v-icon>

          <span>
            Número no válido
          </span>
        </div>

      </div>

      <!-- =========================
             CLIENTE NUEVO
        ========================== -->
      <transition name="fade-slide">

        <div v-if="mostrarAlias && !clienteEncontrado" class="nuevo-cliente-container">

          <!-- MENSAJE -->
          <div class="nuevo-cliente-message">

            <div class="nuevo-icon">
              <v-icon size="19">
                mdi-account-plus-outline
              </v-icon>
            </div>

            <div class="nuevo-text">

              <div class="nuevo-title">
                ¡Primera vez en PIA!
              </div>

              <div class="nuevo-description">
                No encontramos una cuenta.
                <br>
                Crea un alias para continuar.
              </div>

            </div>

          </div>

          <!-- =========================
                 ALIAS
            ========================== -->
          <v-text-field ref="aliasInput" v-model="alias" label="Alias" placeholder="Tu alias" prepend-inner-icon="mdi-account-outline" variant="outlined" density="comfortable" hide-details="auto" :rules="[rules.alias]" class="alias-field" @keyup.enter="continuar" />

        </div>

      </transition>

      <!-- =========================
             CLIENTE EXISTENTE
        ========================== -->
      <transition name="fade-slide">

        <div v-if="clienteEncontrado" class="cliente-encontrado">

          <v-icon size="18">
            mdi-check-circle
          </v-icon>

          <span>
            Hola, {{ alias }}
          </span>

        </div>

      </transition>

      <!-- =========================
             BOTON CONTINUAR
        ========================== -->
      <v-btn type="submit" block height="46" rounded="12" class="continue-button" :disabled="!puedeContinuar" :loading="loading" @click="continuar">
        Continuar

        <v-icon size="20" class="ml-2">
          mdi-arrow-right
        </v-icon>

      </v-btn>

    </v-form>

    <!-- =========================
           SEGURIDAD
      ========================== -->
    <div class="security-text">

      <v-icon size="15">
        mdi-shield-check-outline
      </v-icon>

      <span>
        Tus datos están protegidos
      </span>

    </div>

  </v-card>
</v-dialog>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

import { findClientByPhone, loginRegisterClient } from '../services/cliente.api'

export default {
  name: 'LoginClienteDialog',

  components: {
    VueTelInput
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'login'],

  data() {
    return {
      // =========================
      // TELEFONO
      // =========================
      telefono: '',
      telefonoCompleto: '',
      telefonoValido: false,
      telefonoTocado: false,

      // =========================
      // CLIENTE
      // =========================
      alias: '',
      clienteEncontrado: false,
      clienteBuscado: false,
      buscandoCliente: false,

      // =========================
      // UI
      // =========================
      mostrarAlias: false,
      loading: false,

      // Evita procesar
      // varias veces el mismo número
      telefonoProcesado: '',

      // =========================
      // REGLAS
      // =========================
      rules: {
        alias: value => {
          if (!value) {
            return 'Ingresa un alias'
          }
          if (value.trim().length < 2) {
            return 'Mínimo 2 caracteres'
          }
          return true
        }
      }
    }
  },

  computed: {
    // =========================
    // DIALOG
    // =========================
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit(
          'update:modelValue',
          value
        )
      }
    },

    // =========================
    // PUEDE CONTINUAR
    // =========================
    puedeContinuar() {
      // Teléfono válido
      if (!this.telefonoValido) {
        return false
      }

      // Todavía buscando
      if (this.buscandoCliente) {
        return false
      }

      // Todavía no terminó búsqueda
      if (!this.clienteBuscado) {
        return false
      }

      // Cliente existente
      if (this.clienteEncontrado) {
        return true
      }

      // Cliente nuevo
      return (
        this.alias.trim().length >= 2
      )
    }
  },

  watch: {
    modelValue(nuevoValor) {
      if (!nuevoValor) {
        return
      }

      // Esperamos a que Vuetify monte el diálogo
      this.$nextTick(() => {
        setTimeout(() => {
          this.enfocarTelefono()
        }, 100)
      })
    },

    telefono(nuevoTelefono) {
      const numero = String(nuevoTelefono || '').replace(/\D/g, '')
      
      // Bolivia = 8 dígitos
      if (numero.length !== 8) { return }

      // Esperar a que vue-tel-input termine
      // de actualizar sus datos internos
      this.$nextTick(() => {
        if (!this.telefonoValido) {
          return
        }

        // Evitar búsquedas repetidas
        if (this.telefonoProcesado === this.telefonoCompleto) {
          return
        }
        this.mostrarAlias = true
        this.buscarCliente()
      })
    }
  },

  methods: {
    // =====================================================
    // ENFOCAR TELEFONO
    // =====================================================
    enfocarTelefono() {
      this.$nextTick(() => {

        const componente = this.$refs.telefonoInput
        if (!componente) {
          console.warn('⚠️ No se encontró telefonoInput')
          return
        }

        const input = componente.$el?.querySelector('input')
        if (!input) {
          console.warn('⚠️ No se encontró input interno del teléfono')
          return
        }
        input.focus()
      })
    },

    // =====================================================
    // TELEFONO CAMBIO
    // =====================================================

    onPhoneUpdate(number) {
      // NO hacer:
      // this.telefono = number
      //
      // NO buscar aquí directamente.
      this.clienteBuscado = false
      this.clienteEncontrado = false
      this.buscandoCliente = false

      this.mostrarAlias = false
      this.alias = ''

      this.telefonoProcesado = ''
    },

    validarTelefono(phoneObject) {
      this.telefonoTocado = true
      this.telefonoValido = phoneObject?.valid === true
      if (phoneObject?.number) {
        this.telefonoCompleto = phoneObject.number
      } else if (phoneObject?.formatted) {
        this.telefonoCompleto = phoneObject.formatted.replace(/[^\d+]/g, '')
      }
    },

    // =====================================================
    // BLUR
    // =====================================================
    async onTelefonoBlur() {
      this.telefonoTocado = true
      if (!this.telefonoValido) {
        console.log('❌ TELÉFONO INVÁLIDO')
        return
      }

      // Esperamos a que vue-tel-input
      // termine de actualizar todos sus valores.
      await this.$nextTick()
      
      // Si ya buscamos este mismo número,
      // no volvemos a consultar.
      if (this.telefonoCompleto && this.telefonoCompleto === this.telefonoProcesado) {
        console.log('⏭️ ESTE TELÉFONO YA FUE BUSCADO')
        return
      }

      console.log('🔎 TELÉFONO VÁLIDO → BUSCANDO CLIENTE')
      await this.buscarCliente()
    },

    // =====================================================
    // BUSCAR CLIENTE
    // =====================================================
    async buscarCliente() {

      if (!this.telefonoValido) {
        console.warn('⚠️ TELÉFONO NO VÁLIDO')
        return
      }

      if (this.buscandoCliente) {
        console.log('⏳ YA EXISTE UNA BÚSQUEDA EN CURSO')
        return
      }

      // ===================================================
      // OBTENER TELÉFONO
      // ===================================================
      let telefonoBusqueda = String(this.telefonoCompleto || '')
      
      // ===================================================
      // DEJAR SOLAMENTE NÚMEROS
      // ===================================================
      telefonoBusqueda = telefonoBusqueda.replace(/\D/g, '')

      // ===================================================
      // QUITAR CÓDIGO DE BOLIVIA
      //
      // +59160154875
      //      ↓
      // 60154875
      // ===================================================
      if (telefonoBusqueda.startsWith('591') && telefonoBusqueda.length === 11) {
        telefonoBusqueda = telefonoBusqueda.substring(3)
      }

      // ===================================================
      // VALIDAR 8 DÍGITOS
      // ===================================================
      if (telefonoBusqueda.length !== 8) {
        console.warn('⚠️ TELÉFONO NACIONAL INVÁLIDO:', telefonoBusqueda)
        return
      }
      
      // ===================================================
      // EVITAR BUSCAR EL MISMO NÚMERO
      // ===================================================
      if (telefonoBusqueda === this.telefonoProcesado) {
        console.log('⏭️ TELÉFONO YA PROCESADO:', telefonoBusqueda)
        return
      }

      this.telefonoProcesado = telefonoBusqueda
      this.buscandoCliente = true
      this.clienteBuscado = false
      this.clienteEncontrado = false

      try {
        // =================================================
        // BUSCAR CLIENTE
        // =================================================
        const res = await findClientByPhone(telefonoBusqueda)
        
        // =================================================
        // CLIENTE EXISTE
        // =================================================
        if (res.data?.existe === true) {
          this.clienteEncontrado = true
          this.alias =res.data.cliente?.nombre || res.data.cliente?.alias || ''
          this.mostrarAlias = false
        }

        // =================================================
        // CLIENTE NO EXISTE
        // =================================================
        else {
          this.clienteEncontrado = false
          this.alias = ''
          this.mostrarAlias = true
          await this.$nextTick()
          this.enfocarAlias()
        }
        this.clienteBuscado = true
        
      } catch (error) {
        console.error('❌ ERROR BUSCANDO CLIENTE:', error)
        // Permitir volver a intentar
        this.telefonoProcesado = ''
        this.clienteBuscado = false

      } finally {
        this.buscandoCliente = false
      }
    },

    // =====================================================
    // ENFOCAR ALIAS
    // =====================================================
    enfocarAlias() {
      this.$nextTick(() => {
        const componente = this.$refs.aliasInput
        if (!componente) {
          console.warn('⚠️ No se encontró aliasInput')
          return
        }

        /*
         * Vuetify VTextField
         */
        const input = componente.$el?.querySelector('input')
        if (input) {          
          input.focus()
          /*
           * Colocar cursor al final.
           */
          const longitud = input.value.length
          try {
            input.setSelectionRange(longitud, longitud)
          } catch (e) {
            // Algunos navegadores
            // pueden no permitirlo.
          }
        }
      })
    },

    // =====================================================
    // CONTINUAR
    // =====================================================
    async continuar() {      
      // --------------------------------------------------
      // VALIDAR TELÉFONO
      // --------------------------------------------------
      if (!this.telefonoValido) {        
        this.telefonoTocado = true
        return
      }

      // --------------------------------------------------
      // SI ES CLIENTE NUEVO → VALIDAR ALIAS
      // --------------------------------------------------
      if (!this.clienteEncontrado) {
        const resultado = await this.$refs.formulario.validate()
        if (!resultado.valid) {
          return
        }
      }

      // --------------------------------------------------
      // OBTENER SOLO EL NÚMERO
      // --------------------------------------------------
      const numero = this.normalizarTelefono()
      
      // --------------------------------------------------
      // VALIDACIÓN FINAL
      // --------------------------------------------------
      if (!numero) {
        console.error('❌ NO SE PUDO OBTENER EL NÚMERO')
        return
      }

      this.loading = true
      try {
        const datos = {
          telefono: numero,
          alias: this.clienteEncontrado?null : this.alias.trim()
        }
        
        const res = await loginRegisterClient(datos)
        if (res.status == 200) {
          const datosCliente = res.data.data
          // ============================================
          // GUARDAR TOKEN
          // ============================================
          localStorage.setItem('cliente_token', datosCliente.token)

          // ============================================
          // GUARDAR DATOS DEL CLIENTE
          // ============================================
          localStorage.setItem('cliente', JSON.stringify(datosCliente))

          console.log('👤 CLIENTE GUARDADO:', datosCliente)
          // ============================================
          // CERRAR LOGIN
          // ============================================
          this.$emit('login', datosCliente)
        }
      } finally {
        this.loading = false
      }
    },

    // =====================================================
    // CERRAR
    // =====================================================
    cerrar() {
      this.dialog = false
      this.limpiar()
    },

    // =====================================================
    // LIMPIAR
    // =====================================================
    limpiar() {
      this.telefono = ''
      this.telefonoCompleto = ''
      this.alias = ''
      this.telefonoValido = false
      this.telefonoTocado = false
      this.clienteEncontrado = false
      this.clienteBuscado = false
      this.buscandoCliente = false
      this.mostrarAlias = false
      this.telefonoProcesado = ''
      this.loading = false
    },

    normalizarTelefono() {
      if (!this.telefonoCompleto) {
        return ''
      }
      let numero = String(this.telefonoCompleto).replace(/\D/g, '')
      if (numero.startsWith('591') && numero.length > 8) {
        numero = numero.substring(3)
      }
      return numero
    },
  }

}
</script>

<style scoped>
/* =====================================================
   CARD
===================================================== */

.login-card {

  position: relative;

  width: 320px;

  min-height: 500px;

  padding: 30px 24px 18px;

  border-radius: 24px !important;

  background: #ffffff;

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.18);

}

/* =====================================================
   CERRAR
===================================================== */

.close-button {

  position: absolute;

  top: 15px;

  right: 15px;

  width: 30px;

  height: 30px;

  border: none;

  border-radius: 50%;

  background: transparent;

  color: #334155;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 10;

}

.close-button:hover {

  background: #f1f5f9;

}

/* =====================================================
   LOGO
===================================================== */

.logo {

  text-align: center;

  font-size: 36px;

  line-height: 1;

  font-weight: 800;

  color: #078b88;

  margin-top: 10px;

  margin-bottom: 32px;

  letter-spacing: -1px;

}

/* =====================================================
   TITULO
===================================================== */

.login-title {

  text-align: center;

  font-size: 25px;

  font-weight: 700;

  color: #0f172a;

  margin-bottom: 12px;

}

.login-subtitle {

  text-align: center;

  font-size: 15px;

  line-height: 1.45;

  color: #64748b;

  margin-bottom: 28px;

}

/* =====================================================
   TELEFONO
===================================================== */

.phone-wrapper {

  width: 100%;

  margin-bottom: 10px;

}

/*
 * Contenedor principal
 */

.phone-wrapper :deep(.vue-tel-input) {

  width: 100%;

  height: 56px;

  border: 1px solid #94a3b8 !important;

  border-radius: 12px !important;

  box-shadow: none !important;

  background: #ffffff !important;

  overflow: visible;

}

/*
 * Cuando está enfocado
 */

.phone-wrapper :deep(.vue-tel-input:focus-within) {

  border: 2px solid #078b88 !important;

  box-shadow: none !important;

}

/*
 * Input interno
 */

.phone-wrapper :deep(.vti__input) {

  height: 54px !important;

  border: none !important;

  outline: none !important;

  box-shadow: none !important;

  background: transparent !important;

  font-size: 16px !important;

  color: #0f172a !important;

}

/*
 * Evita la sombra/overlay que
 * estaba tapando el borde.
 */

.phone-wrapper :deep(.vti__input:focus) {

  border: none !important;

  outline: none !important;

  box-shadow: none !important;

}

/*
 * Autofill de Chrome
 */

.phone-wrapper :deep(.vti__input:-webkit-autofill) {

  box-shadow:
    0 0 0 1000px #ffffff inset !important;

}

/*
 * Dropdown
 */

.phone-wrapper :deep(.vti__dropdown) {

  height: 54px !important;

  border-radius: 12px 0 0 12px !important;

  background: transparent !important;

  box-shadow: none !important;

}

/*
 * Bandera
 */

.phone-wrapper :deep(.vti__flag) {

  transform: scale(1.05);

}

/*
 * Código del dropdown
 * solamente se muestra en el selector,
 * NO dentro del teléfono.
 */

.phone-wrapper :deep(.vti__selection) {

  font-size: 14px;

}

/* =====================================================
   ERROR TELEFONO
===================================================== */

.telefono-error {

  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 5px;

  padding-left: 4px;

  color: #dc2626;

  font-size: 12px;

}

/* =====================================================
   NUEVO CLIENTE
===================================================== */

.nuevo-cliente-container {

  margin-top: 12px;

}

/* =====================================================
   MENSAJE NUEVO CLIENTE
===================================================== */

.nuevo-cliente-message {

  display: flex;

  align-items: flex-start;

  gap: 9px;

  padding: 11px 12px;

  border: 1px solid #b7eee8;

  border-radius: 12px;

  background: #f0fdfa;

  margin-bottom: 10px;

}

.nuevo-icon {

  flex-shrink: 0;

  color: #078b88;

  margin-top: 1px;

}

.nuevo-text {

  min-width: 0;

}

.nuevo-title {

  color: #078b88;

  font-size: 14px;

  font-weight: 700;

  margin-bottom: 3px;

}

.nuevo-description {

  color: #64748b;

  font-size: 12px;

  line-height: 1.4;

}

/* =====================================================
   ALIAS
===================================================== */

.alias-field {

  margin-top: 2px;

}

/*
 * Evita sombras adicionales de Vuetify
 */

.alias-field :deep(.v-field) {

  border-radius: 12px !important;

  box-shadow: none !important;

}

.alias-field :deep(.v-field--focused) {

  box-shadow: none !important;

}

.alias-field :deep(input) {

  font-size: 15px;

}

/* =====================================================
   CLIENTE EXISTENTE
===================================================== */

.cliente-encontrado {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  margin-top: 12px;

  padding: 10px;

  border-radius: 10px;

  background: #f0fdfa;

  color: #078b88;

  font-size: 13px;

  font-weight: 600;

}

/* =====================================================
   BOTON CONTINUAR
===================================================== */

.continue-button {

  margin-top: 14px;

  background: #0b9996 !important;

  color: white !important;

  font-size: 14px;

  font-weight: 700;

  text-transform: none;

  box-shadow:
    0 4px 10px rgba(7, 139, 136, 0.18);

}

.continue-button:hover {

  background: #078b88 !important;

}

/*
 * Deshabilitado
 */

.continue-button:disabled {

  background: #7bc8c6 !important;

  color: white !important;

  opacity: 1 !important;

  box-shadow: none;

}

/* =====================================================
   SEGURIDAD
===================================================== */

.security-text {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  margin-top: 18px;

  color: #94a3b8;

  font-size: 11px;

}

.security-text .v-icon {

  color: #94a3b8;

}

/* =====================================================
   ANIMACION
===================================================== */

.fade-slide-enter-active,
.fade-slide-leave-active {

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

}

.fade-slide-enter-from,
.fade-slide-leave-to {

  opacity: 0;

  transform: translateY(-6px);

}

/* =====================================================
   CENTRADO DEL DIALOGO
===================================================== */

:deep(.login-dialog-content) {
  margin: 0 auto !important;
  width: 320px !important;
  max-width: calc(100vw - 24px) !important;
}

/* =====================================================
   CARD DEL LOGIN
===================================================== */

.login-card {
  position: relative;
  width: 100%;
  min-height: 500px;
  padding: 30px 24px 18px;

  border-radius: 24px !important;
  background: #ffffff;

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.18);

  box-sizing: border-box;
}
</style>
