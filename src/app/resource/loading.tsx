export default function LoadingResourcesPage() {
  return (
    <main>
      <h1 className="text-3xl text-center font-bold w-full">Recursos</h1>
      <section className="p-4 w-full">
        <article className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse"
            />
          ))}
        </article>
      </section>
    </main>
  );
}
