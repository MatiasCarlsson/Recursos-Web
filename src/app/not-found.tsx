import Link from "next/link";
export default function NotFoundPage() {
  return (
    <section className="justify-center items-center w-full text-center mb-4">
      <h1 className="text-4xl font-bold text-center mt-20 text-white">
        404 - Página No Encontrada
      </h1>
      <p className="text-center mt-4 text-gray-400">Lo sentimos, la página que buscas no existe.</p>
      <Link href="/" className="block text-center mt-4 text-blue-400 hover:text-blue-300">
        Volver a la página principal
      </Link>
    </section>
  );
}
