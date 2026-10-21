import EvaluacionesSuperadminPage from "../pages/EvaluacionesSuperadminPage.vue";

const routes = [
  {
    path: "/superadmin",

    component: () => import("@/layouts/SuperadminLayout.vue"),

    meta: {
      requiresAuth: true,
      roles: ["SUPERADMIN"],
    },

    children: [
      {
        path: "",
        name: "superadmin",
        component: () => import("../pages/InicioSuperadminPage.vue"),
      },

      {
        path: "comprobantes",
        name: "superadmin-comprobantes",
        component: () => import("../pages/ComprobantesSuperadminPage.vue"),
      },

      {
        path: "evaluaciones",
        name: "superadmin-evaluaciones",
        component: EvaluacionesSuperadminPage,
      },
    ],
  },
];

export default routes;
