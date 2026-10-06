import { reactive } from "vue";

export const alertState = reactive({
  visible: false,

  type: "info",

  title: "",

  message: "",

  showButton: false,

  buttonText: "Entendido",

  autoClose: true,

  duration: 2200,

  closeOnOverlay: true,

  cancelText: "Cancelar",

  confirmText: "Confirmar",

  resolve: null,
});

let timer = null;

function limpiarTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export function closeAlert() {
  limpiarTimer();

  alertState.visible = false;

  alertState.resolve = null;
}

function mostrar(options = {}) {
  limpiarTimer();

  alertState.type = options.type || "info";

  alertState.title = options.title || "";

  alertState.message = options.message || "";

  alertState.showButton = options.showButton ?? false;

  alertState.buttonText = options.buttonText || "Entendido";

  alertState.autoClose = options.autoClose ?? true;

  alertState.duration = options.duration ?? 2200;

  alertState.closeOnOverlay = options.closeOnOverlay ?? true;

  alertState.cancelText = options.cancelText || "Cancelar";

  alertState.confirmText = options.confirmText || "Confirmar";

  alertState.resolve = options.resolve || null;

  alertState.visible = true;

  if (alertState.autoClose && alertState.type !== "confirm") {
    timer = setTimeout(() => {
      closeAlert();
    }, alertState.duration);
  }
}

/* ============================================================
   SUCCESS
============================================================ */

export function success(message, options = {}) {
  mostrar({
    ...options,
    type: "success",
    title: options.title || "¡Listo!",
    message,
    showButton: options.showButton ?? false,
    duration: options.duration ?? 2200,
  });
}

/* ============================================================
   ERROR
============================================================ */

export function error(message, options = {}) {
  mostrar({
    ...options,
    type: "error",
    title: options.title || "Algo salió mal",
    message,
    showButton: options.showButton ?? true,
    autoClose: options.autoClose ?? false,
  });
}

/* ============================================================
   WARNING
============================================================ */

export function warning(message, options = {}) {
  mostrar({
    ...options,
    type: "warning",
    title: options.title || "Atención",
    message,
    showButton: options.showButton ?? true,
    autoClose: options.autoClose ?? false,
  });
}

/* ============================================================
   INFO
============================================================ */

export function info(message, options = {}) {
  mostrar({
    ...options,
    type: "info",
    title: options.title || "Información",
    message,
    showButton: options.showButton ?? true,
    autoClose: options.autoClose ?? false,
  });
}

/* ============================================================
   CONFIRM
============================================================ */

export function confirm(options = {}) {
  return new Promise((resolve) => {
    mostrar({
      ...options,

      type: "confirm",

      title: options.title || "¿Estás seguro?",

      message: options.message || "",

      showButton: false,

      autoClose: false,

      closeOnOverlay: false,

      cancelText: options.cancelText || "Cancelar",

      confirmText: options.confirmText || "Confirmar",

      resolve,
    });
  });
}

/* ============================================================
   API GLOBAL
============================================================ */

export const piaAlert = {
  success,

  error,

  warning,

  info,

  confirm,

  close: closeAlert,
};
