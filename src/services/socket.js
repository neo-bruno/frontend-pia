import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

let socket = null;
let tipoConexionActual = null;

export function conectarSocket(tipo = "PROFESIONAL") {
  const esCliente = tipo === "CLIENTE";

  const token = esCliente ? localStorage.getItem("cliente_token") : localStorage.getItem("token");

  if (!token) {
    console.warn(`⚠️ No hay token para conectar Socket.IO (${tipo})`);
    return null;
  }

  // Si existe una conexión de otro usuario o tipo,
  // la cerramos antes de abrir la nueva.
  if (socket && tipoConexionActual !== tipo) {
    socket.disconnect();
    socket = null;
  }

  if (socket?.connected && tipoConexionActual === tipo) {
    return socket;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log(`🔌 Socket.IO conectado (${tipo}):`, socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error Socket.IO:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket.IO desconectado:", reason);
    });
  } else {
    // Actualizar credenciales si cambió el token
    // sin necesidad de recrear todos los listeners.
    socket.auth = { token };
  }

  tipoConexionActual = tipo;
  socket.connect();

  return socket;
}

export function obtenerSocket() {
  return socket;
}

export function desconectarSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    tipoConexionActual = null;
  }
}
