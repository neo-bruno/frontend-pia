import EditarServicioAdmin from "../components/EditarServicioAdmin.vue";
import NuevoServicioAdmin from "../components/NuevoServicioAdmin.vue";
import VerDetalleServicioAdmin from "../components/VerDetalleServicioAdmin.vue";

const routes = [
  {
    path: "servicios/nuevo",
    name: "servicios-nuevo",
    component: NuevoServicioAdmin,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "servicios/editar/:id",
    name: "servicios-editar",
    component: EditarServicioAdmin,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "servicios/detalle/:id",
    name: "servicios-detalle",
    component: VerDetalleServicioAdmin,

    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
