import PagoComprobanteDetallePage from "../pages/PagoComprobanteDetallePage.vue";
import PagoComprobantePage from "../pages/PagoComprobantePage.vue";

const routes = [
  {
    path: "/cliente/pagos",
    name: "cliente.pagos",
    component: PagoComprobantePage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/cliente/pagos/detalle/:id",
    name: "cliente.pagos.detalle",
    component: PagoComprobanteDetallePage,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;
