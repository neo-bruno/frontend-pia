<template>
<Teleport to="body">
  <Transition name="pia-alert-fade">

    <div v-if="alert.visible" class="pia-alert-overlay" :class="{ 'is-confirmation': alert.type === 'confirm' }" @click.self="cerrarPorFondo">

      <div class="pia-alert" :class="`pia-alert-${alert.type}`" role="alertdialog" aria-modal="true">

        <!-- ==================================================
               ICONO
          =================================================== -->
        <div class="pia-alert-icon" :class="`icon-${alert.type}`">
          <v-icon size="30">
            {{ icono }}
          </v-icon>
        </div>

        <!-- ==================================================
               CONTENIDO
          =================================================== -->
        <div class="pia-alert-content">

          <h3 v-if="alert.title">
            {{ alert.title }}
          </h3>

          <p v-if="alert.message">
            {{ alert.message }}
          </p>

        </div>

        <!-- ==================================================
               CONFIRMACIÓN
          =================================================== -->
        <div v-if="alert.type === 'confirm'" class="pia-alert-actions">

          <button class="pia-alert-btn pia-alert-btn-cancel" type="button" @click="cancelar">
            {{ alert.cancelText || 'Cancelar' }}
          </button>

          <button class="pia-alert-btn pia-alert-btn-confirm" type="button" @click="confirmar">
            {{ alert.confirmText || 'Confirmar' }}
          </button>

        </div>

        <!-- ==================================================
               BOTÓN SIMPLE
          =================================================== -->
        <button v-else-if="alert.showButton" type="button" class="pia-alert-single-btn" @click="cerrar">
          {{ alert.buttonText || 'Entendido' }}
        </button>

        <!-- ==================================================
               PROGRESO
          =================================================== -->
        <div v-if="alert.autoClose && alert.type !== 'confirm'" class="pia-alert-progress">
          <div class="pia-alert-progress-bar" :style="{
                animationDuration: `${alert.duration}ms`
              }"></div>
        </div>

      </div>

    </div>

  </Transition>
</Teleport>
</template>

<script>
import {
  alertState,
  closeAlert
} from '@/services/piaAlert'

export default {
  name: 'PiaAlert',

  data() {
    return {
      alert: alertState
    }
  },

  computed: {

    icono() {

      const iconos = {
        success: 'mdi-check-circle-outline',
        error: 'mdi-alert-circle-outline',
        warning: 'mdi-alert-outline',
        info: 'mdi-information-outline',
        confirm: 'mdi-help-circle-outline'
      }

      return iconos[this.alert.type] || iconos.info
    }

  },

  methods: {

    cerrar() {
      closeAlert()
    },

    cerrarPorFondo() {

      if (
        this.alert.type !== 'confirm' &&
        this.alert.closeOnOverlay
      ) {
        this.cerrar()
      }

    },

    confirmar() {

      if (typeof this.alert.resolve === 'function') {
        this.alert.resolve(true)
      }

      closeAlert()

    },

    cancelar() {

      if (typeof this.alert.resolve === 'function') {
        this.alert.resolve(false)
      }

      closeAlert()

    }

  }
}
</script>

<style scoped>
/* ============================================================
   OVERLAY
============================================================ */

.pia-alert-overlay {
  position: fixed;
  inset: 0;

  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(15, 23, 42, 0.42);

  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.pia-alert-overlay.is-confirmation {
  padding-bottom: 28px;
}

/* ============================================================
   ALERTA
============================================================ */

.pia-alert {
  position: relative;

  width: min(100%, 360px);

  padding: 24px 20px 20px;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 18px 50px rgba(15, 23, 42, 0.20),
    0 5px 15px rgba(15, 23, 42, 0.08);

  text-align: center;

  overflow: hidden;
}

/* ============================================================
   ICONO
============================================================ */

.pia-alert-icon {
  width: 64px;
  height: 64px;

  margin: 0 auto 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
}

/* SUCCESS */

.icon-success {
  color: #008b8b;
  background: #e7f7f7;
}

/* ERROR */

.icon-error {
  color: #e53935;
  background: #fff0f0;
}

/* WARNING */

.icon-warning {
  color: #e89b00;
  background: #fff8e6;
}

/* INFO */

.icon-info {
  color: #008b8b;
  background: #e7f7f7;
}

/* CONFIRM */

.icon-confirm {
  color: #008b8b;
  background: #e7f7f7;
}

/* ============================================================
   CONTENIDO
============================================================ */

.pia-alert-content h3 {
  margin: 0;

  font-size: 19px;
  line-height: 1.25;

  font-weight: 700;

  color: #263238;
}

.pia-alert-content p {
  margin: 8px 0 0;

  font-size: 13px;
  line-height: 1.55;

  color: #607d8b;
}

/* ============================================================
   BOTÓN SIMPLE
============================================================ */

.pia-alert-single-btn {
  width: 100%;

  margin-top: 20px;

  height: 44px;

  border: none;
  border-radius: 12px;

  background: #008b8b;
  color: #ffffff;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.pia-alert-single-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* ============================================================
   BOTONES CONFIRMACIÓN
============================================================ */

.pia-alert-actions {
  display: flex;

  gap: 10px;

  margin-top: 21px;
}

.pia-alert-btn {
  flex: 1;

  height: 44px;

  border-radius: 12px;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.pia-alert-btn:active {
  transform: scale(0.98);
}

.pia-alert-btn-cancel {
  border: 1px solid #dce8e8;

  background: #ffffff;

  color: #607d8b;
}

.pia-alert-btn-confirm {
  border: none;

  background: #e53935;

  color: #ffffff;
}

/* ============================================================
   PROGRESO
============================================================ */

.pia-alert-progress {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  height: 3px;

  background: #edf5f5;
}

.pia-alert-progress-bar {
  height: 100%;

  width: 100%;

  background: #008b8b;

  transform-origin: left;

  animation-name: pia-alert-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.pia-alert-error .pia-alert-progress-bar {
  background: #e53935;
}

.pia-alert-warning .pia-alert-progress-bar {
  background: #e89b00;
}

/* ============================================================
   ANIMACIÓN
============================================================ */

@keyframes pia-alert-progress {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

.pia-alert-fade-enter-active,
.pia-alert-fade-leave-active {
  transition: opacity 0.20s ease;
}

.pia-alert-fade-enter-active .pia-alert,
.pia-alert-fade-leave-active .pia-alert {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.pia-alert-fade-enter-from,
.pia-alert-fade-leave-to {
  opacity: 0;
}

.pia-alert-fade-enter-from .pia-alert {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.pia-alert-fade-leave-to .pia-alert {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

/* ============================================================
   MÓVIL PEQUEÑO
============================================================ */

@media (max-width: 350px) {

  .pia-alert-overlay {
    padding: 16px;
  }

  .pia-alert {
    padding: 21px 17px 17px;
    border-radius: 20px;
  }

  .pia-alert-icon {
    width: 58px;
    height: 58px;
  }

  .pia-alert-content h3 {
    font-size: 17px;
  }

  .pia-alert-content p {
    font-size: 12px;
  }

}
</style>
