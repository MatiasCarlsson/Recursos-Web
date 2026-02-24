import ResourceCard from "./ResourceCard";
import { loadResources } from "@/lib/api";

export default async function Card() {
  const resources = await loadResources();

  return (
    <section className="p-4 w-full">
      <h1 className="text-3xl text-center font-bold w-full">Recursos</h1>
      <article className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </article>
    </section>
  );
}
