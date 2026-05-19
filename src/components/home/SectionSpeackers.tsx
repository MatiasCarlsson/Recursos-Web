import Speacker from "./Speaker";

function Speakers() {
  return (
    <section className="mt-12 rounded-lg p-4 shadow-accent shadow-[0px_10px_30px_-2px_rgba(124,58,237,0.43)] mx-4 md:mx-8 lg:mx-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Speakers</h2>
      <span className="text-[10px] text-textSecondary block text-center">(opinión personal)</span>
      <p className="text-center">
        Influyentes de la comunidad técnica que recomiendo en habla hispana
      </p>
      <article className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 text-center text-sec mt-6">
        <Speacker
          nombrePersonal="Carlos Azaustre"
          nombreRedes="Fazt"
          descripcion="Desarrollador y educador en programación. Se especializa en desarrollo web full stack, compartiendo tutoriales sobre tecnologías como JavaScript, Node.js, bases de datos y frameworks. Su contenido se caracteriza por ser directo, práctico y orientado a la construcción de proyectos reales."
          imagenUrl="/image/fazt.webp"
          enlace="https://fazt.dev/"
          canal="https://www.youtube.com/@FaztTech"
        />
        <Speacker
          nombrePersonal="Miguel Ángel Durán"
          nombreRedes="Midudev"
          descripcion="Desarrollador de software y creador de contenido enfocado en JavaScript y desarrollo web. A través de sus streams y cursos, ayuda a la comunidad a aprender programación de forma clara, aplicada y orientada al mundo laboral."
          imagenUrl="/image/midudev.webp"
          enlace="https://midu.dev/"
          canal="https://www.youtube.com/@midudev"
        />
        <Speacker
          nombrePersonal="Brais Moure"
          nombreRedes="MoureDev"
          descripcion="Ingeniero de software con experiencia en desarrollo mobile y backend. Es conocido por su contenido educativo, donde enseña programación desde cero hasta niveles avanzados en el desarrollo de apps."
          imagenUrl="/image/mouredev.webp"
          enlace="https://mouredev.pro/"
          canal="https://www.youtube.com/@mouredev"
        />
      </article>
    </section>
  );
}

export default Speakers;
