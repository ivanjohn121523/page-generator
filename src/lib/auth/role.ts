import type { User } from "@supabase/supabase-js";

export type AppRole = "user" | "admin";

export function getAppRole(user: User): AppRole {
  const role = user.app_metadata?.role;
  return role === "admin" ? "admin" : "user";
}
