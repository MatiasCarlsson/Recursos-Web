import type { Resource } from "@/types/resource";
import ResourceCard from "@/components/card/ResourceCard";

type FeaturedResourcesSectionProps = {
  resources: Resource[];
};

export default function FeaturedResourcesSection({ resources }: FeaturedResourcesSectionProps) {
  if (!resources.length) {
    return null;
  }

  return (
    <section id="destacados" className="mx-auto mt-14 w-full max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1400px] px-4 sm:px-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
          Curados por el equipo
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Recursos destacados</h2>
        <p className="mt-2 max-w-2xl text-sm text-textSecondary sm:text-base">
          Selección priorizada para encontrar contenido de alta calidad más rápido.
        </p>
      </header>

      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-4"
        aria-label="Lista de recursos destacados"
      >
        {resources.map((resource) => (
          <li key={resource.id}>
            <ResourceCard resource={resource} />
          </li>
        ))}
      </ul>
    </section>
  );
}
