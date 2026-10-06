export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
};

export const PERMISOS = {
  // ==========================================
  // SUPERADMIN
  // ==========================================

  SUPERADMIN: [
    "DASHBOARD",
    "NEGOCIOS",
    "GERENTES",
    "PROFESIONALES",
    "CLIENTES",
    "USUARIOS",
    "ROLES",
    "PROMOCIONES",
    "SEGMENTACION",
    "RANKINGS",
    "CALIFICACIONES",
    "RECLAMOS",
    "PAGOS",
    "MEMBRESIAS",
    "METODOS_PAGO",
    "NOTIFICACIONES",
    "CONFIGURACION",
  ],

  // ==========================================
  // ADMIN
  // ==========================================

  ADMIN: [
    "DASHBOARD",
    "GERENCIA",
    "PROFESIONALES",
    "SERVICIOS",
    "HORARIOS",
    "RESERVAS",
    "CLIENTES",
    "PROMOCIONES",
    "DESCUENTOS",
    "SEGMENTACION",
    "CALIFICACIONES",
    "RECLAMOS",
    "PAGOS",
    "COMPROBANTES",
    "CONFIGURACION",
  ],

  // ==========================================
  // CLIENTE
  // ==========================================

  CLIENTE: [
    "INICIO",
    "NEGOCIOS",
    "PROFESIONALES",
    "SERVICIOS",
    "DISPONIBILIDAD",
    "RESERVAR",
    "MIS_RESERVAS",
    "HISTORIAL",
    "CALIFICACIONES",
    "PROMOCIONES",
    "DESCUENTOS",
    "NOTIFICACIONES",
    "RECLAMOS",
    "PERFIL",
  ],
};

export function tienePermiso(rol, permiso) {
  return PERMISOS[rol]?.includes(permiso) || false;
}
