import Image from "next/image";
import ScrollReveal from "../../components/ScrollReveal";
import SupportSection from "@/components/about/SupportSection";
import CopyEmailButton from "@/components/about/CopyEmailButton";
import ContactForm from "@/components/about/ContactForm";

export const dynamic = "force-static";

const heroTags = [
  "Curación humana",
  "Estructura rica",
  "Comunidad validada",
  "Sin ruido",
];

const pilares = [
  {
    titulo: "Sobre mí",
    contenido:
      "Soy Matias, desarrollador. Este proyecto nació de la frustración acumulada de perder horas —días enteros— buscando recursos que valgan la pena: tutoriales incompletos, referencias desactualizadas, listas infinitas sin criterio. Acá quiero reunir lo que realmente sirve, con el contexto que me hubiera gustado tener.",
    tone: {
      title: "text-textPrimary",
      bg: "bg-accent/8",
      border: "border-border/35",
    },
  },
  {
    titulo: "Por qué existe",
    contenido:
      "La web tiene demasiado material y poca estructura. Un junior no necesita más enlaces; necesita saber por dónde empezar, qué es relevante para su nivel y por qué un recurso es mejor que otro. Recursos Web ofrece un punto de referencia con ejemplos prácticos, claridad y una nota de contexto en cada entrada: a quién va dirigido y por qué puede servirte.",
    tone: {
      title: "text-buttonColor/95",
      bg: "bg-cardBackground/85",
      border: "border-border/35",
    },
  },
  {
    titulo: "A dónde va",
    contenido:
      "Que sea una biblioteca viva: mejorada con sugerencias de la comunidad, validada por criterios públicos, siempre orientada a la utilidad real. Calidad sobre cantidad. Cada recurso que entra pasa por revisión humana; cada sugerencia se evalúa con los mismos estándares.",
    tone: {
      title: "text-accent/90",
      bg: "bg-buttonColor/8",
      border: "border-border/35",
    },
  },
];

const principios = [
  {
    titulo: "Curación sobre agregación",
    descripcion:
      "No indexamos automáticamente. Cada recurso es revisado, probado o verificado antes de publicarse. Si no lo recomendaríamos a un compañero, no entra.",
  },
  {
    titulo: "Contexto obligatorio",
    descripcion:
      "Todo recurso lleva una nota: nivel sugerido, prerequisitos, por qué sirve, en qué casos no. Un enlace sin contexto es ruido.",
  },
  {
    titulo: "Gratis ≠ mala calidad · Pago ≠ buena calidad",
    descripcion:
      "El modelo de precio es metadato, no juicio de valor. Hay recursos gratuitos excelentes y pagos decepcionantes. Lo señalamos.",
  },
  {
    titulo: "Comunidad sugiere, criterio valida",
    descripcion:
      "Cualquiera puede proponer. La decisión final usa los mismos criterios públicos. Transparencia total: lo que entra y por qué.",
  },
  {
    titulo: "Mantenimiento continuo",
    descripcion:
      "Links rotos, versiones viejas, recursos abandonados: se marcan, se actualizan o se retiran. La fecha de última revisión es visible.",
  },
];

const tecnologias = [
  {
    nombre: "Next.js + TypeScript",
    razon:
      "App Router, Server Components y tipado estricto nos dan rendimiento real, rutas claras y seguridad para iterar rápido sin romper lo que ya funciona. El junior no ve la tech; ve que carga rápido y no falla.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
  {
    nombre: "Prisma + PostgreSQL",
    razon:
      "Modelo relacional limpio para recursos, categorías, etiquetas, modelos de precio y sugerencias. Consultas complejas (filtros combinados, paginación, búsqueda) resueltas en la base, no en el cliente.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    nombre: "Tailwind CSS",
    razon:
      "Diseño system consistente, responsive por defecto, dark mode nativo. Cambios visuales en minutos, no horas. El foco está en la legibilidad y descubrimiento, no en pelear CSS.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    nombre: "NextAuth + Panel Admin",
    razon:
      "Autenticación segura solo para quien cura. El panel permite editar, publicar, rechazar sugerencias y mantener metadatos al día sin tocar código. La calidad editorial no depende de deploys.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
];

const comoItems = [
  "Arquitectura modular por dominio (categories, resources, tags, suggestions, price-models)",
  "Validaciones Zod en entrada y salida: datos limpios desde el origen",
  "Panel admin para revisión editorial, métricas y mantenimiento continuo",
  "UI pensada para leer y descubrir: jerarquía visual, búsqueda combinada, zero clutter",
  "Sistema de sugerencias abierto: cualquiera propone, criterios públicos deciden",
];

const criterios = [
  {
    titulo: "Relevancia práctica",
    texto:
      "¿Resuelve un problema concreto? Tutorial accionable, referencia confiable, guía paso a paso, código que corre. No posts de opinión sin sustento ni listas de enlaces sin criterio.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    titulo: "Calidad pedagógica",
    texto:
      "Explicación clara, ejemplos reproducibles, estructura lógica. Si un junior no puede seguirlo sin ayuda externa, no pasa el filtro.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
  {
    titulo: "Actualidad real",
    texto:
      "Versión probada, dependencias al día, compatibilidad declarada. Si está desactualizado, se marca con badge visible y se busca alternativa.",
    tone: {
      title: "text-accent",
      bg: "bg-accent/15",
      border: "border-border/35",
    },
  },
  {
    titulo: "Contexto de uso",
    texto:
      "Cada recurso muestra: nivel (junior/mid/senior), prerequisitos, tiempo estimado, caso de uso ideal. Tú decides rápido si es para vos.",
    tone: {
      title: "text-textPrimary/95",
      bg: "bg-cardBackground/80",
      border: "border-border/35",
    },
  },
  {
    titulo: "Modelo de precio honesto",
    texto:
      "Gratis / Freemium / Pago / Open Source. Sin dark patterns. El precio es metadato para filtrar, no barrera ni endorsement.",
    tone: {
      title: "text-buttonColor/95",
      bg: "bg-buttonColor/8",
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

      {/* HERO */}
      <section className="flex flex-col items-start gap-8 border-b border-border/20 pb-12 sm:flex-row">
        <div className="flex-1">
          <p className={`${sectionLabelClass} mb-3`}>sobre el proyecto</p>
          <h1 className="mb-5 text-3xl font-semibold italic leading-tight text-textPrimary sm:text-4xl">
            Una biblioteca pensada
            <br />
            para que aprendas sin perderte.
          </h1>
          <p className={`${bodyTextClass} mb-6 max-w-lg sm:text-base`}>
            Recursos Web no es un directorio de enlaces. Es el proyecto que me hubiera gustado
            encontrar cuando empecé: sin ruido, sin duplicados, con contexto real sobre por qué
            cada recurso vale la pena y para quién.
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

      {/* QUIÉN / POR QUÉ / PARA QUÉ */}
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

      {/* MANIFIESTO / PRINCIPIOS */}
      <ScrollReveal className="mb-12" delayMs={140}>
        <p className={`${sectionLabelClass} mb-4`}>manifiesto: lo que no negociamos</p>
        <section className={`${panelClass} ${panelMotionClass} p-6 sm:p-8`}>
          <p className={`${bodyTextClass} mb-6`}>
            Estos principios guían cada decisión: qué entra, qué se rechaza, cómo se presenta.
            Son públicos para que sepas exactamente qué esperar.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principios.map((p) => (
              <article
                key={p.titulo}
                className="relative rounded-xl border border-border/30 bg-primaryColor/30 p-5 transition hover:border-buttonColor/40 hover:bg-primaryColor/40"
              >
                <h3 className="mb-2 font-semibold text-textPrimary">{p.titulo}</h3>
                <p className="text-sm leading-relaxed text-textSecondary">{p.descripcion}</p>
              </article>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* CÓMO SE SELECCIONA EL CONTENIDO */}
      <ScrollReveal className="mb-12" delayMs={180}>
        <p className={`${sectionLabelClass} mb-3 font-bold`}>¿Cómo se selecciona el contenido?</p>
        <section className={`${panelClass} ${panelMotionClass} p-6 sm:p-8`}>
          <p className={`${bodyTextClass} mb-6`}>
            No es un filtro automático. Es un proceso deliberado que convierte una lista de enlaces
            en una selección útil y confiable, con criterios explícitos y visibles.
          </p>
          <div className="mb-6 grid grid-cols-1 overflow-hidden rounded-xl border border-border/20 sm:grid-cols-2 lg:grid-cols-3">
            {criterios.map((c) => (
              <div
                key={c.titulo}
                className={`p-4 text-sm leading-relaxed text-textSecondary ${c.tone.bg} ${c.tone.border} ${panelMotionClass} border-b sm:border-b-0 sm:border-r last:border-r-0 lg:border-b lg:border-r lg:last:border-r-0`}
              >
                <strong className={`mb-1 block font-semibold ${c.tone.title}`}>{c.titulo}</strong>
                {c.texto}
              </div>
            ))}
          </div>
          <p className="border-t border-border/20 pt-5 text-sm italic leading-relaxed text-textSecondary">
            En la práctica: revisión humana, detección de duplicados, validación del contenido y una
            nota breve que te ayuda a decidir en segundos si ese recurso es para vos.
          </p>
        </section>
      </ScrollReveal>

      {/* PROBLEMA Y SOLUCIÓN */}
      <ScrollReveal className="mb-12" delayMs={220}>
        <p className={`${sectionLabelClass} mb-4`}>el problema y la solución</p>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <article className={`${panelClass} ${panelMotionClass} p-6`}>
            <h2 className="mb-4 text-xl font-semibold italic text-textPrimary">
              ¿Qué problema resuelve?
            </h2>
            <p className={`${bodyTextClass} mb-3`}>
              En el ecosistema tech hay demasiado contenido y poca estructura. Un junior busca
              "React tutorial" y encuentra 50.000 resultados: la mitad desactualizados, otros
              asumen conocimientos previos no declarados, muchos son copy-paste sin probar.
            </p>
            <p className={`${bodyTextClass} mb-3`}>
              Recursos Web organiza categorías, etiquetas y modelos de precio para que encuentres
              exactamente lo que buscás, sin navegar entre decenas de resultados irrelevantes.
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
                <li key={item} className="flex items-start gap-3 py-3 text-sm text-textSecondary">
                  <span className="min-w-5 font-mono text-[12px] font-semibold text-textPrimary/60 mt-0.5">
                    0{i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </ScrollReveal>

      {/* POR QUÉ ESTAS TECNOLOGÍAS */}
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

      {/* PARA QUIÉN ES ESTO - NUEVA SECCIÓN */}
      <ScrollReveal className="mb-12" delayMs={300}>
        <p className={`${sectionLabelClass} mb-4`}>¿para quién es esto?</p>
        <section className={`${panelClass} ${panelMotionClass} p-6 sm:p-8`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-border/30 bg-primaryColor/30 p-5">
              <div className="mb-3">
                <h3 className="font-semibold text-textPrimary">Junior / Career switcher</h3>
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">
                No sabés qué buscar ni cómo filtrar. Acá encontrás rutas claras: "Quiero aprender
                backend con Node" → categoría → recursos con nivel, prerequisitos y por qué sirven.
                Sin adivinar.
              </p>
            </article>
            <article className="rounded-xl border border-border/30 bg-primaryColor/30 p-5">
              <div className="mb-3">
                <h3 className="font-semibold text-textPrimary">Mid / Senior con poco tiempo</h3>
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">
                Sabés qué necesitás. Usá filtros combinados (categoría + tag + precio + nivel)
                y llegás al recurso exacto en segundos. Sin scroll infinito, sin clickbait.
              </p>
            </article>
            <article className="rounded-xl border border-border/30 bg-primaryColor/30 p-5">
              <div className="mb-3">
                <h3 className="font-semibold text-textPrimary">Mentores / Team leads</h3>
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">
                Compartís una colección curada con tu equipo: "Estos 5 recursos para onboarding de
                React". Ahorrás horas de búsqueda y alineás criterio.
              </p>
            </article>
            <article className="rounded-xl border border-border/30 bg-primaryColor/30 p-5">
              <div className="mb-3">
                <h3 className="font-semibold text-textPrimary">Comunidad que aporta</h3>
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">
                Encontraste algo bueno que no está. Lo sugerís. Si pasa los criterios, entra con
                tu crédito. El catálogo crece con quienes lo usan.
              </p>
            </article>
          </div>
        </section>
      </ScrollReveal>

      {/* VISIÓN */}
      <ScrollReveal delayMs={340}>
        <p className={`${sectionLabelClass} mb-4`}>visión</p>
        <section
          className={`relative overflow-hidden rounded-2xl border border-buttonColor/35 bg-linear-to-br from-cardBackground/80 via-primaryColor/40 to-cardBackground/80 p-6 sm:p-8 ${panelMotionClass}`}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-buttonColor/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
          <p className={`${bodyTextClass} relative mb-4`}>
            <em className="not-italic font-semibold text-textPrimary">A corto plazo:</em> reforzar
            la calidad del catálogo con mejores filtros, metadatos completos y descripciones
            contextuales desde el panel admin. Que cada recurso tenga nivel, prerequisitos y caso
            de uso.
          </p>
          <p className={`${bodyTextClass} relative mb-4`}>
            <em className="not-italic font-semibold text-textPrimary">A mediano plazo:</em>
            convertir esto en la referencia por defecto para desenvolvedores hispanohablantes:
            búsqueda semántica, colecciones colaborativas, seguimiento de recursos obsoletos y
            API pública para integrar en editors/IDEs.
          </p>
          <p className={`${bodyTextClass} relative`}>
            <em className="not-italic font-semibold text-textPrimary">Principio rector:</em>
            cada decisión se toma preguntando: "¿Esto ayuda a un junior a aprender mejor y más
            rápido?" Si la respuesta no es sí rotundo, no se hace.
          </p>
        </section>
      </ScrollReveal>

      {/* APOYO AL PROYECTO */}
      <ScrollReveal delayMs={380}>
        <SupportSection />
      </ScrollReveal>

      {/* CONTACTO */}
      <ScrollReveal delayMs={440}>
        <section id="contacto" className="pt-6 sm:pt-10">
          <div className={`${panelClass} ${panelMotionClass} p-6 sm:p-8`}>
            <p className={`${sectionLabelClass} mb-4`}>contacto</p>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
              <div>
                <h2 className="mb-3 text-2xl font-semibold italic sm:text-3xl">
                  Hablemos de ideas, recursos o mejoras.
                </h2>
                <p className={`${bodyTextClass} mb-4`}>
                  Si querés aportar sugerencias, reportar algo roto/desactualizado o proponer
                  colaboraciones, este es el canal directo. Respondo personalmente.
                </p>
                <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-primaryColor/35 p-4">
                  <p>
                    Copía el correo electrónico desde aquí
                  </p> <CopyEmailButton />
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