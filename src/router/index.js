import { createRouter, createWebHistory } from "vue-router";

import publicoRoutes from '@/modules/publico/routes'
import superadminRoutes from "@/modules/superadmin/routes";
import adminRoutes from "@/modules/admin/routes";
import clienteRoutes from "@/modules/cliente/routes";

import { authGuard, roleGuard } from "./guards";

const routes = [
  // ==========================================
  // AUTENTICACIÓN
  // ==========================================

  {
    path: "/login",
    name: "login",

    component: () => import("@/modules/auth/LoginPage.vue"),

    meta: {
      requiresAuth: false,
    },
  },

  // ==========================================
  // ACTORES
  // ==========================================

  ...publicoRoutes,
  ...superadminRoutes,
  ...adminRoutes,
  ...clienteRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authResult = authGuard(to);

  if (authResult !== true) {
    return authResult;
  }

  return roleGuard(to);
});

router.onError((error) => {
  console.error("❌ Error de navegación:", error);
});

export default router;
