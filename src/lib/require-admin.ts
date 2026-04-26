import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppError } from "@/lib/errors";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  // Si no hay sesión, devolvemos 401.
  if (!session?.user) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  // Solo permitimos usuarios activos con rol admin.
  if (!session.user.active || session.user.role !== "admin") {
    throw new AppError("Admin role required", 403, "FORBIDDEN");
  }

  return session.user;
}
