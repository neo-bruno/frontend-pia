import PerfilClientePage from "../pages/PerfilClientePage.vue";

const routes = [
  {
    path: "/cliente/perfil",
    name: "cliente.perfil",
    component: PerfilClientePage,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;
