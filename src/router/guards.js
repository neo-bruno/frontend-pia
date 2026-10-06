export function authGuard(to) {
  const requiresAuth = to.matched.some(
    (route) => route.meta?.requiresAuth === true,
  );

  if (!requiresAuth) {
    return true;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return "/login";
  }

  return true;
}

export function roleGuard(to) {
  const roles = to.meta?.roles;

  if (!roles || roles.length === 0) {
    return true;
  }

  const userData = localStorage.getItem("user");

  if (!userData) {
    return "/login";
  }

  try {
    const user = JSON.parse(userData);

    if (!roles.includes(user.rol)) {
      return getRouteByRole(user.rol);
    }

    return true;
  } catch (error) {
    console.error("❌ Error leyendo usuario:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return "/login";
  }
}

function getRouteByRole(rol) {
  switch (rol) {
    case "SUPERADMIN":
      return "/superadmin";

    case "ADMIN":
      return "/admin";

    case "CLIENTE":
      return "/cliente";

    default:
      return "/login";
  }
}
