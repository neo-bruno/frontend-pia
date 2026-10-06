import ReservasAdminPage from "../pages/ReservasAdminPage.vue";

const routes = [
  {
    path: "reservas",
    name: "admin-reservas",
    component: ReservasAdminPage,
    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
