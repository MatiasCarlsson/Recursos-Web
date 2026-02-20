import ResourceCard from "./ResourceCard";
import { loadResources } from "@/lib/api";

export default async function Card() {
  const resources = await loadResources();

  return (
    <section className="p-4">
      <h1 className="text-3xl text-center mb-4 font-bold">Recursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}
