export default function Footer() {
  return (
    <footer className="bg-footerBackground grid grid-cols-3 items-center justify-between m-4 text-sm">
      <section className="">
        <p>Contacto</p>
        <div className=""></div>
        <div className=""></div>
      </section>
      <section className="">
        <p className="">
          &copy; {new Date().getFullYear()} Mi sitio Web. Todos los derechos reservados.
        </p>
      </section>
      <section className="justify-self-end">
        <p className="">Links</p>
      </section>
    </footer>
  );
}
