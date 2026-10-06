import { http } from "@/services/api";

export function login(telefono, password) {
  return http().post("/auth/login", {
    telefono,
    password,
  });
}
