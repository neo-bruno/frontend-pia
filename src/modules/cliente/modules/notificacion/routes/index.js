import DescuentoNotificacionDetalle from "../pages/DescuentoNotificacionDetalle.vue";
import NotificacionesPage from "../pages/NotificacionesPage.vue";
import PagoNotificacionDetalle from "../pages/PagoNotificacionDetalle.vue";
import PromocionNotificacionDetalle from "../pages/PromocionNotificacionDetalle.vue";
import ReservaNotificacionDetalle from "../pages/ReservaNotificacionDetalle.vue";
import ServicioNotificacionDetalle from "../pages/ServicioNotificacionDetalle.vue";

const routes = [
  {
    path: "/cliente/notificaciones",
    name: "cliente.notificaciones",
    component: NotificacionesPage,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/cliente/notificaciones/reservas",
    name: "cliente.notificaciones.reservas",
    component: ReservaNotificacionDetalle,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/cliente/notificaciones/pago",
    name: "cliente.notificaciones.pago",
    component: PagoNotificacionDetalle,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/cliente/notificaciones/promocion",
    name: "cliente.notificaciones.promocion",
    component: PromocionNotificacionDetalle,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/cliente/notificaciones/descuento",
    name: "cliente.notificaciones.descuento",
    component: DescuentoNotificacionDetalle,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/cliente/notificaciones/servicio",
    name: "cliente.notificaciones.servicio",
    component: ServicioNotificacionDetalle,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;
