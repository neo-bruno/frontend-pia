import PerfilNegocioPage from "../pages/PerfilNegocioPage.vue";
import RegistroNegocioPage from "../pages/RegistroNegocioPage.vue";

const routes = [
	{
		path: "/registro/negocio",
		name: "registro-negocio",
		component: RegistroNegocioPage,
		meta: {
			requiresAuth: false,
		},
	},

	{
		path: "/perfil/negocio/:slug",
		name: "perfil-negocio",
		component: PerfilNegocioPage,
		meta: {
			requiresAuth: false,
		},
	},
];

export default routes;
