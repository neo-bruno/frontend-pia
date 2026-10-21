import AsignarDescuentoServicioAdminPage from "../pages/AsignarDescuentoServicioAdminPage.vue";

const routes = [
	{
		path: "descuento/:descuentoId/servicio",
		name: "descuento-servicio",
		component: AsignarDescuentoServicioAdminPage,
		meta: {
			requiresAuth: true,
		},
	},
];

export default routes;
