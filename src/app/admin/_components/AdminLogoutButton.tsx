"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // Cierra sesión y vuelve al login privado del admin.
        signOut({ callbackUrl: "/admin/login" });
      }}
      className="cursor-pointer rounded-lg border border-border bg-cardBackground px-3 py-2 text-sm font-medium text-textPrimary transition-transform hover:scale-[1.02] hover:border-accent active:scale-95"
    >
      Cerrar sesión
    </button>
  );
}
