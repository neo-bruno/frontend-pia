import FavoritoPage from "../pages/FavoritoPage.vue";

const routes = [
  {
    path: "/cliente/favoritos",
    name: "cliente.favoritos",
    component: FavoritoPage,
    meta: {
      requiresAuth: false,
    },
  },
];

export default routes;
