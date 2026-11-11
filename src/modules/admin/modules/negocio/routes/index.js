import NegocioCodigoActivacionAdmin from "../components/NegocioCodigoActivacionAdmin.vue";
import NegocioDatosAdmin from "../components/NegocioDatosAdmin.vue";
import NegocioFotosAdmin from "../components/NegocioFotosAdmin.vue";
import NegocioHorariosAdmin from "../components/NegocioHorariosAdmin.vue";
import NegocioPaginaAdmin from "../components/NegocioPaginaAdmin.vue";
import NegocioProfesionalesAdmin from "../components/NegocioProfesionalesAdmin.vue";
import NegocioVideosAdmin from "../components/NegocioVideosAdmin.vue";

const routes = [
	{
		path: "negocio/datos",
		name: "negocio-datos",
		component: NegocioDatosAdmin,

		meta: {
			requiresAuth: true,
		},
	},

	{
		path: "negocio/horarios",
		name: "negocio-horarios",
		component: NegocioHorariosAdmin,

		meta: {
			requiresAuth: true,
		},
	},

	{
		path: "negocio/profesionales",
		name: "negocio-profesionales",
		component: NegocioProfesionalesAdmin,

		meta: {
			requiresAuth: true,
		},
	},

	{
		path: "negocio/codigo-invitacion",
		name: "negocio-codigo-invitacion",
		component: NegocioCodigoActivacionAdmin,
	},

	{
		path: "negocio/pagina",
		name: "negocio-pagina",
		component: NegocioPaginaAdmin,

		meta: {
			requiresAuth: true,
		},
	},

	{
		path: "negocio/fotos",
		name: "negocio-fotos",
		component: NegocioFotosAdmin,

		meta: {
			requiresAuth: true,
		},
	},

	{
		path: "negocio/videos",
		name: "negocio-videos",
		component: NegocioVideosAdmin,

		meta: {
			requiresAuth: true,
		},
	},
];

export default routes;
