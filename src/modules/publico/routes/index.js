import negocioRoutes from "../modules/negocio/routes";
import profesionRoutes from "../modules/profesional/routes";
import horarioRoutes from "../modules/horario/routes";
import reservaRoutes from "../modules/reservas/routes";
import servicioRoutes from '../modules/servicios/routes'

import PublicoLayout from "@/layouts/PublicoLayout.vue";
import BusquedaServiciosPage from "../pages/BusquedaServiciosPage.vue";

const routes = [
	{
		path: "/",
		name: "inicio",
		component: PublicoLayout,
		meta: {
			requiresAuth: false,
		},

		children: [
			{
				path: "",
				name: "publico",
				component: () => import("../pages/InicioPublicoPage.vue"),
			},
			{
				path: "busqueda/:palabras",
				name: "publico-busqueda",
				component: BusquedaServiciosPage,
			},

			...negocioRoutes,
			...profesionRoutes,
			...horarioRoutes,
			...reservaRoutes,
			...servicioRoutes,
		],
	},
];

export default routes;
