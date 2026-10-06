import HorarioPage from "../pages/HorarioPage.vue";

const routes = [
  {
    path: "/horario/:profesionalId/:servicioId?",
    name: "horario",
    component: HorarioPage,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;