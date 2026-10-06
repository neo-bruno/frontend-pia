import PerfilProfesionalPage from "../pages/PerfilProfesionalPage.vue";
import RegistroProfesionalPage from "../pages/RegistroProfesionalPage.vue";
import VerPerfilProfesionalPage from "../pages/VerPerfilProfesionalPage.vue";

const routes = [
  {
    path: "/registro/profesional",
    name: "registro-profesional",
    component: RegistroProfesionalPage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/profesional/:slug",
    name: "perfil-profesional",
    component: PerfilProfesionalPage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/ver/profesional/:slug",
    name: "ver-perfil-profesional",
    component: VerPerfilProfesionalPage,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;