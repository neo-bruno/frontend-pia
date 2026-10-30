import PerfilServicioPage from "../pages/PerfilServicioPage.vue";

const routes = [
	{
		path: "/servicio/perfil/:servicioId",
		name: "servicio-perfil",
		component: PerfilServicioPage,
		meta: {
			requiresAuth: false,
		},
	},
];

export default routes;
