import AdminLayout from "@/layouts/AdminLayout.vue";
// PRINCIPAL
import InicioAdminPage from "../pages/InicioAdminPage.vue";
import AgendaAdminPage from "../modules/agenda/pages/AgendaAdminPage.vue";
import ClientesAdminPage from "../modules/clientes/pages/ClientesAdminPage.vue";
import HistorialAdminPage from "../modules/historial/pages/HistorialAdminPage.vue";
// CONFIGURACION
import ServiciosAdminPage from "../modules/servicios/pages/ServiciosAdminPage.vue";
import HorariosAdminPage from "../modules/horarios/pages/HorariosAdminPage.vue";
import NegocioAdminPage from "../modules/negocio/pages/NegocioAdminPage.vue";
import ProfesionalesAdminPage from "../modules/profesional/pages/ProfesionalesAdminPage.vue";
// import ReservasAdminPage from "../pages/administracion/ReservasAdminPage.vue";
import ConfiguracionAdminPage from "../pages/administracion/ConfiguracionAdminPage.vue";
import DescuentosAdminPage from "../modules/descuentos/pages/DescuentosAdminPage.vue";

// MODULOS
import serviciosRoutes from "../modules/servicios/routes";
import negocioRoutes from "../modules/negocio/routes";
import reservasRoutes from "../modules/reservas/routes";
import descuentoServicioRoutes from "../modules/descuentos/routes";
import PerfilAdminPage from "../modules/perfil/pages/PerfilAdminPage.vue";
import MembresiaAdminPage from "../modules/membresia/pages/MembresiaAdminPage.vue";

const routes = [
	{
		path: "/admin",
		component: AdminLayout,

		meta: {
			requiresAuth: true,
			roles: ["ADMIN"],
		},

		children: [
			// ==========================================
			// PRINCIPAL
			// ==========================================

			{
				path: "",
				name: "admin",
				component: InicioAdminPage,
			},

			{
				path: "agenda",
				name: "agenda",
				component: AgendaAdminPage,
			},

			{
				path: "historial",
				name: "historial",
				component: HistorialAdminPage,
			},

			{
				path: "perfil",
				name: "perfil",
				component: PerfilAdminPage,
			},

			{
				path: "servicios",
				name: "servicios",
				component: ServiciosAdminPage,
			},

			{
				path: "horarios",
				name: "horarios",
				component: HorariosAdminPage,
			},

			{
				path: "negocio",
				name: "negocio",
				component: NegocioAdminPage,
			},

			// ==========================================
			// ADMINISTRACION
			// ==========================================

			{
				path: "clientes",
				name: "clientes",
				component: ClientesAdminPage,
			},

			{
				path: "profesionales",
				name: "profesionales",
				component: ProfesionalesAdminPage,
			},

			{
				path: "descuentos",
				name: "descuentos",
				component: DescuentosAdminPage,
			},

			{
				path: "membresia",
				name: "membresia",
				component: MembresiaAdminPage,
			},

			{
				path: "configuracion",
				name: "configuracion",
				component: ConfiguracionAdminPage,
			},

			// ==========================================
			// MODULOS
			// ==========================================

			...serviciosRoutes,
			...negocioRoutes,
			...reservasRoutes,
			...descuentoServicioRoutes,
		],
	},
];

export default routes;
