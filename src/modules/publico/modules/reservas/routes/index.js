import ReservaConfirmada from "../components/ReservaConfirmada.vue";
import ReservaResumenPage from "../pages/ReservaResumenPage.vue";

const routes = [
  {
    path: "/resumen/reserva",
    name: "resumen-reserva",
    component: ReservaResumenPage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/reserva/confirmada",
    name: "reserva-confirmada",
    component: ReservaConfirmada,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;