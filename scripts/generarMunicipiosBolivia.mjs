import fs from "node:fs/promises";
import path from "node:path";

const URL_CSV =
	"https://raw.githubusercontent.com/lab-tecnosocial/municipios-bolivia-2024/main/municipios_bolivia_2024.csv";

const ARCHIVO_SALIDA = path.resolve(
	"src/modules/admin/modules/negocio/data/municipiosBolivia.js",
);

// Parsea CSV respetando comillas, comas internas y comillas escapadas.
function parseCSV(texto) {
	const filas = [];
	let fila = [];
	let campo = "";
	let entreComillas = false;

	for (let i = 0; i < texto.length; i++) {
		const caracter = texto[i];

		if (caracter === '"') {
			if (entreComillas && texto[i + 1] === '"') {
				campo += '"';
				i++;
			} else {
				entreComillas = !entreComillas;
			}
		} else if (caracter === "," && !entreComillas) {
			fila.push(campo);
			campo = "";
		} else if ((caracter === "\n" || caracter === "\r") && !entreComillas) {
			if (caracter === "\r" && texto[i + 1] === "\n") i++;

			fila.push(campo);

			if (fila.some((valor) => valor.trim() !== "")) {
				filas.push(fila);
			}

			fila = [];
			campo = "";
		} else {
			campo += caracter;
		}
	}

	if (campo !== "" || fila.length > 0) {
		fila.push(campo);
		filas.push(fila);
	}

	const encabezados = filas.shift();

	return filas.map((valores) =>
		Object.fromEntries(
			encabezados.map((nombre, indice) => [
				nombre.replace(/^\uFEFF/, "").trim(),
				(valores[indice] || "").trim(),
			]),
		),
	);
}

async function generar() {
	console.log("Descargando catálogo de municipios de Bolivia...");

	const respuesta = await fetch(URL_CSV);

	if (!respuesta.ok) {
		throw new Error(
			`No se pudo descargar el catálogo: HTTP ${respuesta.status}`,
		);
	}

	const texto = await respuesta.text();
	const registros = parseCSV(texto);

	// Excluir los tres territorios indígenas (TIOC):
	// son unidades territoriales, pero no municipios.
	const municipios = registros
		.filter(
			(registro) =>
				registro.nombre_dep &&
				registro.nombre_mun &&
				!registro.nombre_mun.startsWith("TIOC-"),
		)
		.map((registro) => ({
			departamento: registro.nombre_dep,
			municipio: registro.nombre_mun
				.replace(/\s*\([^)]*(?:Autonomía|Nación Originaria)[^)]*\)/gi, "")
				.trim(),
		}));

	const departamentos = [
		...new Set(municipios.map((item) => item.departamento)),
	].sort((a, b) => a.localeCompare(b, "es"));

	const municipiosPorDepartamento = {};

	for (const departamento of departamentos) {
		municipiosPorDepartamento[departamento] = [
			...new Set(
				municipios
					.filter((item) => item.departamento === departamento)
					.map((item) => item.municipio),
			),
		].sort((a, b) => a.localeCompare(b, "es"));
	}

	if (departamentos.length !== 9) {
		throw new Error(
			`Se esperaban 9 departamentos; se encontraron ${departamentos.length}.`,
		);
	}

	const totalMunicipios = Object.values(municipiosPorDepartamento).reduce(
		(total, lista) => total + lista.length,
		0,
	);

	if (totalMunicipios !== 340) {
		throw new Error(
			`Se esperaban 340 municipios; se encontraron ${totalMunicipios}. ` +
				"Revisa el catálogo antes de generar el archivo.",
		);
	}

	const contenido = `/**
 * Catálogo de departamentos y municipios de Bolivia.
 *
 * Fuente: Lab TecnoSocial (2026), datos territoriales CPV-2024.
 * Repositorio: https://github.com/lab-tecnosocial/municipios-bolivia-2024
 * Licencia del catálogo: Creative Commons Atribución 4.0 Internacional.
 *
 * Archivo generado automáticamente. No editar manualmente.
 */

export const departamentosBolivia = ${JSON.stringify(departamentos, null, 2)};

export const municipiosPorDepartamento = ${JSON.stringify(
		municipiosPorDepartamento,
		null,
		2,
	)};
`;

	await fs.mkdir(path.dirname(ARCHIVO_SALIDA), {
		recursive: true,
	});

	await fs.writeFile(ARCHIVO_SALIDA, contenido, "utf8");

	console.log("Catálogo generado correctamente.");
	console.log(`Departamentos: ${departamentos.length}`);
	console.log(`Municipios: ${totalMunicipios}`);
	console.log(`Archivo: ${ARCHIVO_SALIDA}`);
}

generar().catch((error) => {
	console.error("Error generando el catálogo:", error.message);
	process.exitCode = 1;
});
