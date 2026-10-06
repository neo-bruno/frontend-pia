import negocioRoutes from '../modules/negocio/routes'
import profesionRoutes from '../modules/profesional/routes'
import horarioRoutes from '../modules/horario/routes'
import reservaRoutes from '../modules/reservas/routes'

import InicioPublicoPage from '../pages/InicioPublicoPage.vue';

const routes = [
  {
    path: "/",
    name: "publico",
    component: InicioPublicoPage,
    meta: {
      requiresAuth: false,
    },
  },
  
  ...negocioRoutes,
  ...profesionRoutes,
  ...horarioRoutes,
  ...reservaRoutes,
];

export default routes;
