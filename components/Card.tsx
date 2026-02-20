import ResourceCard from "./ResourceCard";

async function loadResource() {
  const res = await fetch("https://jsonplaceholder.org/posts");
  const data = await res.json();
  return data;
}

interface Resource {
  id: number;
  title: string;
  url: string;
  content: string;
  image: string;
  category: string;
}

export default async function Card() {
  const resources = await loadResource();
  return (
    <section>
      <article className="p-4">
        <h1 className="text-3xl text-center mb-4 font-bold">Recursos</h1>
        <div className="rounded-lg  p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource: Resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </article>
    </section>
  );
}
