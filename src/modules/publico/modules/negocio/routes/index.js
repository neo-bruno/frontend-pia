
import RegistroNegocioPage from "../pages/RegistroNegocioPage.vue";

const routes = [
  {
    path: "/registro/negocio",
    name: "registro-negocio",
    component: RegistroNegocioPage,
    meta: {
      requiresAuth: false,
    },
  },

  
];

export default routes;