import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminLogoutButton from "@/app/admin/_components/AdminLogoutButton";
import AdminCrudManager from "@/app/admin/_components/AdminCrudManager";

const styles = {
  card: "group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-cardBackground via-cardBackground to-primaryColor p-4 shadow-[0_14px_28px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_18px_36px_rgba(124,58,237,0.24)]",
  number: "text-xl font-semibold text-textPrimary",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Si no hay sesión, mandamos al login privado del admin.
  if (!session?.user) {
    redirect("/admin/login");
  }

  // Si no cumple rol o está inactivo, bloqueamos acceso.
  if (!session.user.active || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  // Obtenemos métricas del panel para tener una vista rápida del contenido.
  const [categoriesCount, resourcesCount, tagsCount, suggestionsCount] = await Promise.all([
    prisma.categoria.count(),
    prisma.recurso.count(),
    prisma.etiqueta.count(),
    prisma.sugerencia.count(),
  ]);

  return (
    <main className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-72 h-52 w-52 rounded-full bg-buttonColor/10 blur-3xl" />

      <header className="relative flex flex-col justify-between gap-4 rounded-2xl border border-border/45 bg-linear-to-r from-cardBackground/90 via-cardBackground to-primaryColor/90 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-buttonColor/75">
            admin center
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-textPrimary">Panel de Administración</h1>
          <p className="mt-2 text-textSecondary">
            Gestiona catálogo, metadatos y sugerencias desde un solo lugar.
          </p>
        </div>
        <AdminLogoutButton />
      </header>

      <section className="relative mt-8 grid items-center justify-between gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
        <article className={styles.card}>
          <div className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-full bg-accent/12 blur-xl" />
          <h2 className="text-sm font-medium text-textSecondary">Categorías</h2>
          <p className="mt-3 text-sm text-textSecondary">Total registradas</p>
          <p className={`${styles.number} mt-1`}>{categoriesCount}</p>
        </article>
        <article className={styles.card}>
          <div className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-full bg-buttonColor/10 blur-xl" />
          <h2 className="text-sm font-medium text-textSecondary">Recursos</h2>
          <p className="mt-3 text-sm text-textSecondary">Total publicados</p>
          <p className={`${styles.number} mt-1`}>{resourcesCount}</p>
        </article>
        <article className={styles.card}>
          <div className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-full bg-accent/12 blur-xl" />
          <h2 className="text-sm font-medium text-textSecondary">Etiquetas</h2>
          <p className="mt-3 text-sm text-textSecondary">Total disponibles</p>
          <p className={`${styles.number} mt-1`}>{tagsCount}</p>
        </article>
        <article className={styles.card}>
          <div className="pointer-events-none absolute right-3 top-3 h-12 w-12 rounded-full bg-buttonColor/10 blur-xl" />
          <h2 className="text-sm font-medium text-textSecondary">Sugerencias</h2>
          <p className="mt-3 text-sm text-textSecondary">Pendientes y gestionadas</p>
          <p className={`${styles.number} mt-1`}>{suggestionsCount}</p>
        </article>
      </section>

      <section className={`relative mt-8 ${styles.card}`}>
        <h2 className="text-lg font-semibold text-textPrimary">Accesos rápidos</h2>
        <p className="mt-1 text-sm text-textSecondary">
          Estos endpoints requieren sesión admin para operaciones de escritura.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm text-textPrimary">
          <li className="rounded-full border border-border/70 bg-primaryColor/80 px-3 py-1.5 font-mono text-xs tracking-wide">
            /api/categories
          </li>
          <li className="rounded-full border border-border/70 bg-primaryColor/80 px-3 py-1.5 font-mono text-xs tracking-wide">
            /api/resources
          </li>
          <li className="rounded-full border border-border/70 bg-primaryColor/80 px-3 py-1.5 font-mono text-xs tracking-wide">
            /api/tags
          </li>
          <li className="rounded-full border border-border/70 bg-primaryColor/80 px-3 py-1.5 font-mono text-xs tracking-wide">
            /api/suggestions
          </li>
        </ul>
      </section>

      <AdminCrudManager />
    </main>
  );
}
