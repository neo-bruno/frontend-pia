import DetallePreguntaPage from "../pages/DetallePreguntaPage.vue";
import MisConsultasPage from "../pages/MisConsultasPage.vue";
import NuevaConsultaPage from "../pages/NuevaConsultaPage.vue";
import SoportePage from "../pages/SoportePage.vue";

const routes = [
	{
		path: "soporte",
		name: "cliente-soporte",
		component: SoportePage,
	},
  {
		path: "soporte/nueva",
		name: "cliente-soporte-nueva",
		component: NuevaConsultaPage,
	},
  {
    path: "soporte/pregunta/:id",
    name: "cliente-soporte-pregunta",
    component: DetallePreguntaPage,
  },
  {
    path: "soporte/consultas",
    name: "cliente-soporte-consultas",
    component: MisConsultasPage,
  },
];

export default routes;
