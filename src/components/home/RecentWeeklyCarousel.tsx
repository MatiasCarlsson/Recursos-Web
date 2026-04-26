import type { Resource } from "@/types/resource";
import ResourceCard from "@/components/card/ResourceCard";

type RecentWeeklyCarouselProps = {
  resources: Resource[];
};

function getWeekRangeLabel() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;

  const start = new Date(now);
  start.setDate(now.getDate() - diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export default function RecentWeeklyCarousel({ resources }: RecentWeeklyCarouselProps) {
  if (!resources.length) {
    return null;
  }

  return (
    <section
      className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6"
      aria-labelledby="recientes-semana-title"
    >
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
            Actualización semanal
          </p>
          <h2 id="recientes-semana-title" className="mt-2 text-2xl font-bold sm:text-3xl">
            Recursos añadidos recientemente
          </h2>
        </div>

        <span className="rounded-full border border-border/70 bg-cardBackground/70 px-3 py-1 text-xs text-textSecondary">
          Semana: {getWeekRangeLabel()}
        </span>
      </header>

      <div
        className="overflow-x-auto pb-2"
        role="region"
        aria-label="Carrusel de recursos recientes"
      >
        <ul className="flex snap-x snap-mandatory gap-4">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="min-w-56 max-w-56 snap-start sm:min-w-60 sm:max-w-60 md:min-w-[16rem] md:max-w-[16rem]"
            >
              <ResourceCard resource={resource} variant="compact" />
            </li>
          ))}
        </ul>
        x
      </div>
    </section>
  );
}
