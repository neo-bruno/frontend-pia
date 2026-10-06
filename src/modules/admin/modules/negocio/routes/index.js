import NegocioDatosAdmin from "../components/NegocioDatosAdmin.vue";
import NegocioHorariosAdmin from "../components/NegocioHorariosAdmin.vue";
import NegocioProfesionalesAdmin from "../components/NegocioProfesionalesAdmin.vue";

const routes = [
  {
    path: "negocio/datos",
    name: "negocio-datos",
    component: NegocioDatosAdmin,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "negocio/horarios",
    name: "negocio-horarios",
    component: NegocioHorariosAdmin,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "negocio/profesionales",
    name: "negocio-profesionales",
    component: NegocioProfesionalesAdmin,

    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
