import DetalleReservaAdminPage from "../pages/DetalleReservaAdminPage.vue";
import ReservasAdminPage from "../pages/ReservasAdminPage.vue";

const routes = [
  {
    path: "reservas",
    name: "admin.reservas",
    component: ReservasAdminPage,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "reservas/detalle/:id",
    name: "admin.reservas.detalle",
    component: DetalleReservaAdminPage,
    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
