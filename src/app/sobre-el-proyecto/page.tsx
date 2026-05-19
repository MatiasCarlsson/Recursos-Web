import Image from "next/image";
import ScrollReveal from "../../components/ScrollReveal";
import SupportSection from "@/components/about/SupportSection";
import ContactForm from "@/components/about/ContactForm";

export const dynamic = "force-static";

const heroTags = ["Revisión manual", "Enfoque en calidad", "Evolución continua"];

const pilares = [
  {
    titulo: "Sobre mí",
    contenido:
      "Soy Matias, desarrollador. Este proyecto nació de perder horas buscando recursos incompletos o desactualizados. Acá quiero reunir lo que realmente sirve.",
    tone: {
      title: "text-textPrimary",
      bg: "bg-accent/8",
      border: "border-border/35",
    },
  },
  {
    titulo: "Por qué existe",
    contenido:
      "La web tiene demasiado material y poca estructura. Quiero ofrecer un punto de referencia con ejemplos prácticos y claridad, no solo listas largas.",
    tone: {
      title: "text-buttonColor/95",
      bg: "bg-cardBackground/85",
      border: "border-border/35",
    },
  },
  {
    titulo: "A dónde va",
    contenido:
      "Que sea una biblioteca viva: mejorada con sugerencias de la comunidad, siempre orientada a la utilidad. Calidad sobre cantidad.",
    tone: {
      title: "text-accent/90",
      bg: "bg-buttonColor/8",
      border: "border-border/35",
    },
  },
];

const tecnologias = [
  {
    nombre: "Next.js + TypeScript",
    razon:
      "Rutas claras, buen rendimiento y seguridad de tipos para escalar sin romper funcionalidades.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
  {
    nombre: "Prisma + PostgreSQL",
    razon:
      "Base robusta para recursos, categorías, etiquetas y sugerencias. El modelo de datos queda limpio y mantenible.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    nombre: "Tailwind CSS",
    razon:
      "Velocidad para diseñar interfaces consistentes y responsivas, sin perder control visual en cada componente.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    nombre: "Panel de administración",
    razon:
      "Para revisar contenido, mejorar descripciones y mantener coherencia editorial sin depender de código.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
];

const comoItems = [
  "Estructura modular por dominio",
  "Validaciones de entrada para calidad de datos",
  "Panel admin para revisión y mantenimiento continuo",
  "UI pensada para leer y descubrir",
];

const criterios = [
  {
    titulo: "Relevancia",
    texto:
      "¿Responde a una necesidad concreta? Tutorial, referencia, guía práctica, código de ejemplo.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    titulo: "Calidad",
    texto: "Claridad en la explicación, ejemplos reproducibles, buena estructura pedagógica.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
  {
    titulo: "Actualidad",
    texto: "Preferimos material mantenido. Si algo está desactualizado, se avisa.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
  {
    titulo: "Contexto",
    texto: "Cada recurso recibe una nota: a quién va dirigido y por qué puede servirte.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
];

const sectionLabelClass = "font-mono text-[12px] uppercase tracking-[0.18em] text-buttonColor/70";
const panelClass = "bg-cardBackground/60 border border-border/20 rounded-2xl";
const bodyTextClass = "text-sm leading-relaxed text-textSecondary";
const panelMotionClass =
  "transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_38px_rgba(124,58,237,0.2)]";
const chipMotionClass =
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:border-buttonColor/70 hover:bg-buttonColor/20";

export default function AboutProjectPage() {
  return (
    <main className="relative mx-auto w-full max-w-4xl overflow-hidden px-4 pb-20 pt-10 font-serif sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-8 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-80 h-56 w-56 rounded-full bg-buttonColor/8 blur-3xl" />

      <section className="flex flex-col items-start gap-8 border-b border-border/20 pb-12 sm:flex-row">
        <div className="flex-1">
          <p className={`${sectionLabelClass} mb-3`}>sobre el proyecto</p>
          <h1 className="mb-5 text-3xl font-semibold italic leading-tight text-textPrimary sm:text-4xl">
            Una biblioteca pensada
            <br />
            para aprender de verdad.
          </h1>
          <p className={`${bodyTextClass} mb-6 max-w-lg sm:text-base`}>
            Recursos Web no es un directorio de enlaces. Es el proyecto que me hubiera gustado
            encontrar cuando empezaba: sin ruido, sin duplicados, con contexto real sobre por qué
            cada recurso vale la pena.
          </p>
          <div className="flex flex-wrap gap-2">
            {heroTags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border border-buttonColor/40 bg-buttonColor/10 px-3 py-1 font-mono text-[12px] text-accent ${chipMotionClass}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border-2 border-buttonColor/35 bg-cardBackground shadow-[0_0_30px_rgba(124,58,237,0.2)] hover:scale-110 transition-transform duration-500">
            <Image
              src="/image/Perfil_RecursosWeb(1).webp"
              alt="Foto de Matias"
              width={128}
              height={128}
              className="size-full object-cover select-none"
              unoptimized
            />
          </div>
          <span className="text-center font-mono text-[12px] leading-relaxed text-textSecondary">
            Matias Viana Carlsson
            <br />
            Desarrollador
          </span>
        </div>
      </section>

      <ScrollReveal className="mb-12" delayMs={100}>
        <p className={`${sectionLabelClass} mb-4`}>¿quién?, ¿por qué? y ¿para qué?</p>
        <section className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border/20 md:grid-cols-3">
          {pilares.map((pilar) => (
            <article
              key={pilar.titulo}
              className={`p-6 ${pilar.tone.bg} ${pilar.tone.border} ${panelMotionClass} border-b md:border-b-0 md:border-r last:border-r-0`}
            >
              <h2 className={`mb-3 text-sm font-semibold italic ${pilar.tone.title}`}>
                {pilar.titulo}
              </h2>
              <p className={bodyTextClass}>{pilar.contenido}</p>
            </article>
          ))}
        </section>
      </ScrollReveal>

      <ScrollReveal className="mb-12" delayMs={160}>
        <p className={`${sectionLabelClass} mb-3 font-bold`}>¿Cómo se selecciona el contenido?</p>
        <section className={`${panelClass} ${panelMotionClass} p-6 sm:p-8`}>
          <p className={`${bodyTextClass} mb-6`}>
            No es un filtro automático. Es un proceso deliberado que convierte una lista de enlaces
            en una selección útil y confiable, con criterios explícitos.
          </p>
          <div className="mb-6 grid grid-cols-1 overflow-hidden rounded-xl border border-border/20 sm:grid-cols-2">
            {criterios.map((c) => (
              <div
                key={c.titulo}
                className={`p-4 text-sm leading-relaxed text-textSecondary ${c.tone.bg} ${c.tone.border} ${panelMotionClass} border-b sm:border-b-0 sm:border-r last:border-r-0`}
              >
                <strong className={`mb-1 block font-semibold ${c.tone.title}`}>{c.titulo}</strong>
                {c.texto}
              </div>
            ))}
          </div>
          <p className="border-t border-border/20 pt-5 text-sm italic leading-relaxed text-textSecondary">
            En la práctica: revisión humana, detección de duplicados, validación del contenido y una
            nota breve que te ayuda a decidir rápido si ese recurso es para vos.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mb-12" delayMs={210}>
        <p className={`${sectionLabelClass} mb-4`}>el problema y la solución</p>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <article className={`${panelClass} ${panelMotionClass} p-6`}>
            <h2 className="mb-4 text-xl font-semibold italic text-textPrimary">
              ¿Qué problema resuelve?
            </h2>
            <p className={`${bodyTextClass} mb-3`}>
              En el ecosistema tech hay demasiado contenido y poca estructura. Recursos Web organiza
              categorías, etiquetas y modelos de precio para que encuentres exactamente lo que
              buscás, sin navegar entre decenas de resultados irrelevantes.
            </p>
            <p className={bodyTextClass}>
              También incorpora sugerencias de la comunidad para que el catálogo no dependa de una
              sola perspectiva. Así se mantiene actualizado y alineado con necesidades reales.
            </p>
          </article>

          <article className={`${panelClass} ${panelMotionClass} p-6`}>
            <p className={`${sectionLabelClass} mb-4 font-bold`}>¿Cómo se construyó?</p>
            <ul className="flex flex-col divide-y divide-border/20">
              {comoItems.map((item, i) => (
                <li key={item} className="flex items-center gap-3 py-3 text-sm text-textSecondary">
                  <span className="min-w-5 font-mono text-[12px] font-semibold text-textPrimary/60">
                    0{i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mb-12" delayMs={260}>
        <p className={`${sectionLabelClass} mb-4 font-bold`}>¿Por qué estas tecnologías?</p>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tecnologias.map((item) => (
            <article
              key={item.nombre}
              className={`rounded-2xl border p-5 ${item.tone.bg} ${item.tone.border} ${panelMotionClass}`}
            >
              <h3 className={`mb-2 font-mono text-[14px] ${item.tone.title}`}>{item.nombre}</h3>
              <p className={bodyTextClass}>{item.razon}</p>
            </article>
          ))}
        </section>
      </ScrollReveal>

      <ScrollReveal delayMs={320}>
        <p className={`${sectionLabelClass} mb-4`}>visión</p>
        <section
          className={`relative overflow-hidden rounded-2xl border border-buttonColor/35 bg-linear-to-br from-cardBackground/80 via-primaryColor/40 to-cardBackground/80 p-6 sm:p-8 ${panelMotionClass}`}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-buttonColor/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
          <p className={`${bodyTextClass} relative mb-4`}>
            <em className="not-italic font-semibold text-textPrimary">A corto plazo:</em> reforzar
            la calidad del catálogo con mejores filtros, metadatos y descripciones desde el panel
            admin.
          </p>
          <p className={`${bodyTextClass} relative`}>
            <em className="not-italic font-semibold text-textPrimary">A mediano plazo:</em>{" "}
            convertir este proyecto en una plataforma comunitaria donde encontrar recursos sea cada
            vez más preciso, transparente y útil, tanto para perfiles junior como senior.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delayMs={380}>
        <SupportSection />
      </ScrollReveal>

      <ScrollReveal delayMs={440}>
        <section id="contacto" className="pt-6 sm:pt-10">
          <div className={`${panelClass} ${panelMotionClass} p-6 sm:p-8`}>
            <p className={`${sectionLabelClass} mb-4`}>contacto</p>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
              <div>
                <h2 className="mb-3 text-2xl font-semibold italic text-textPrimary sm:text-3xl">
                  Hablemos de ideas, recursos o mejoras.
                </h2>
                <p className={`${bodyTextClass} mb-4`}>
                  Si queres aportar sugerencias, reportar algo o proponer colaboraciones, este es el
                  canal directo. Respondo personalmente.
                </p>
                <div className="rounded-2xl border border-border/30 bg-primaryColor/35 p-4">
                  <p className="mt-2 text-xs text-textSecondary">
                    Usa el formulario o copia el correo desde el footer.
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
