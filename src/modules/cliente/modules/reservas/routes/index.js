import DetalleReservaPage from "../pages/DetalleReservaPage.vue";
import HistorialReservaPage from "../pages/HistorialReservaPage.vue";
import MisReservasPage from "../pages/MisReservasPage.vue";

const routes = [
  {
    path: "/cliente/reservas",
    name: "cliente.reservas",
    component: MisReservasPage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/cliente/reservas/:id",
    name: "cliente.reservas.detalle",
    component: DetalleReservaPage,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/cliente/historial/reservas",
    name: "cliente.historial.reservas",
    component: HistorialReservaPage,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;
