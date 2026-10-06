import reservaRoutes from "@/modules/cliente/modules/reservas/routes";
import perfilRoutes from "@/modules/cliente/modules/perfil/routes";
import pagoRoutes from "@/modules/cliente/modules/pagos/routes";
import favoritoRoutes from "@/modules/cliente/modules/favoritos/routes";
import NotificationRoutes from '@/modules/cliente/modules/notificacion/routes'

const routes = [
  {
    path: "/cliente",

    component: () => import("@/layouts/ClienteLayout.vue"),

    meta: {
      requiresAuth: false,
    },

    children: [
      {
        path: "",
        name: "cliente",
        component: () => import("../pages/InicioClientePage.vue"),
      },
      ...reservaRoutes,
      ...perfilRoutes,
      ...pagoRoutes,
      ...favoritoRoutes,
      ...NotificationRoutes,
    ],
  },
];

export default routes;
