import ReprogramacionHorarioPage from "../pages/ReprogramacionHorarioPage.vue";
import ReprogramacionResumenPage from "../pages/ReprogramacionResumenPage.vue";
import ReprogramacionConfirmadaPage from "../pages/ReprogramacionConfirmadaPage.vue";

const routes = [
	{
		path: "/cliente/reprogramacion/:reservaId",
		name: "cliente.reprogramacion",
		component: ReprogramacionHorarioPage,
		meta: {
			requiresAuth: false,
		},
	},

	{
		path: "/cliente/reprogramacion/:reservaId/resumen",
		name: "cliente.reprogramacion.resumen",
		component: ReprogramacionResumenPage,
		meta: { requiresAuth: false },
	},

	{
		path: "/cliente/reprogramacion/:reservaId/confirmada",
		name: "cliente.reprogramacion.confirmada",
		component: ReprogramacionConfirmadaPage,
		meta: { requiresAuth: false },
	},
];

export default routes;
