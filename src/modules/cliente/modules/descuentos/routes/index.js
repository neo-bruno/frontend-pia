import DescuentosClientePage from "../pages/DescuentosClientePage.vue";

const routes = [
	{
		path: "/cliente/descuentos",
		name: "cliente.descuentos",
		component: DescuentosClientePage,
		meta: {
			requiresAuth: false,
		},
	},
];

export default routes;
