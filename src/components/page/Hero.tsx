import { loadResourceFilters } from "@/api/api";
import Link from "next/link";
import SearchBar from "../SearchBar";

async function Hero() {
  const filters = await loadResourceFilters();

  return (
    <section
      className="relative overflow-hidden px-4 py-14 sm:py-18 h-[90dvh]"
      aria-labelledby="home-hero-title"
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-buttonColor/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <div className="max-w-3xl space-y-4">
          <p className="inline-flex rounded-full border border-border/80 bg-cardBackground/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
            Directorio comunitario de recursos
          </p>

          <h1
            id="home-hero-title"
            className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
          >
            Descubre recursos curados por la comunidad dev
          </h1>

          <p className="mx-auto max-w-2xl text-base text-textSecondary sm:text-lg">
            Busca por categoría, explora recomendaciones y comparte tus hallazgos para ayudar a
            otros desarrolladores a aprender más rápido.
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <SearchBar categories={filters.categories} tags={filters.tags} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/resource"
            className="rounded-xl border border-buttonColor bg-buttonColor/90 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-buttonColor"
          >
            Explorar recursos
          </Link>
          <Link
            href="/#sugerir-recurso"
            className="rounded-xl border border-border/80 bg-cardBackground/70 px-5 py-2.5 text-sm font-semibold text-textPrimary transition hover:scale-[1.02] hover:border-buttonColor/60"
          >
            Sugerir un recurso
          </Link>
          <Link
            href="/sobre-el-proyecto#apoya"
            className="rounded-xl border border-buttonColor/60 bg-buttonColor/10 px-5 py-2.5 text-sm font-semibold text-textPrimary transition hover:scale-[1.02] hover:border-buttonColor hover:bg-buttonColor/20"
          >
            Apoya 😉
          </Link>
          <Link
            href="/#destacados"
            className="rounded-xl border border-border/80 bg-cardBackground/70 px-5 py-2.5 text-sm font-semibold text-textPrimary transition hover:scale-[1.02] hover:border-buttonColor/60"
          >
            Ver destacados
          </Link>
          <span className="rounded-xl border border-border/80 bg-cardBackground/70 px-4 py-2.5 text-sm text-textSecondary">
            {filters.categories.length}+ categorías disponibles
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
