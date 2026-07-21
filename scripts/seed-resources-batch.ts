import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { ResourceService } from "../src/modules/resources/resource.service";

const prisma = new PrismaClient();
const service = new ResourceService();

type SeedResource = {
  nombre: string;
  url: string;
  descripcion: string;
  categoriaId: number;
  modeloPrecioId: number;
  etiquetasSlugs: string[];
};

const SEED: SeedResource[] = [
  {
    nombre: "BillionMail",
    url: "https://github.com/Billionmail/BillionMail",
    descripcion:
      "BillionMail es una plataforma de email marketing de código abierto y autohospedable que permite enviar newsletters y campañas masivas sin depender de servicios de terceros ni pagar por correos enviados. Incluye un servidor SMTP propio, constructor de campañas con arrastrar y soltar, gestión de contactos y plantillas, pensado para mantener el control y la privacidad de tus datos. Es útil para desarrolladores y equipos que buscan una alternativa autoalojada a Mailchimp o SendGrid, sin costos por volumen. Se despliega fácilmente con Docker y su interfaz facilita crear, programar y analizar envíos. Palabras clave: email marketing, newsletters, SMTP, código abierto, autohospedado, campañas, email, mailing, privacidad, autoalojado.",
    categoriaId: 12,
    modeloPrecioId: 1,
    etiquetasSlugs: ["email-marketing", "codigo-abierto"],
  },
  {
    nombre: "Impeccable",
    url: "https://impeccable.style/",
    descripcion:
      "Impeccable es un skill de diseño para agentes de IA (Claude Code, Cursor, Copilot, Gemini, Codex) que da a tu asistente el vocabulario del diseñador: jerarquía, contraste, restricción y movimiento. En lugar de generar interfaces con el aspecto típico de la IA, aplica comandos como /typeset, /colorize o /animate para dirigir tipografía, color y motion con precisión, respetando tu design system existente. Incluye un detector de anti-patrones (46 reglas deterministas) integrable en CI para bloquear el 'AI slop' antes de que llegue a producción. Es útil para desarrolladores que quieren UI pulida y coherente sin abandonar la terminal. Palabras clave: diseño, UI, UX, IA, skill, agentes, frontend, anti-patrones, tipografía, slop.",
    categoriaId: 13,
    modeloPrecioId: 1,
    etiquetasSlugs: ["herramientas-ia", "generacion-ui"],
  },
  {
    nombre: "UI/UX Pro Max Skill",
    url: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    descripcion:
      "UI/UX Pro Max Skill es un skill (conjunto de instrucciones) de código abierto para agentes de codificación con IA que mejora drásticamente la calidad visual de las interfaces que generan. Enseña al agente principios de UI/UX, accesibilidad, jerarquía visual y detalles de acabado para evitar el aspecto genérico de las interfaces 'vibe coded'. Se instala como un skill reutilizable y funciona con herramientas como Cursor o Claude Code, elevando el nivel de los componentes, layouts y microinteracciones producidos. Es útil para desarrolladores que quieren resultados de diseño profesional sin contratar un diseñador. Palabras clave: UI, UX, skill, IA, agentes, frontend, diseño, componentes, código abierto, vibe coding.",
    categoriaId: 15,
    modeloPrecioId: 1,
    etiquetasSlugs: ["ingenieria-prompts", "generacion-ui", "codigo-abierto"],
  },
  {
    nombre: "Okara",
    url: "https://okara.ai/",
    descripcion:
      "Okara es una plataforma de marketing autónomo con IA que funciona como un CMO virtual: tras indicarle la URL de tu producto, despliega un equipo de agentes especializados que trabajan a diario en SEO, GEO (visibilidad en ChatGPT y buscadores de IA), Reddit, X, LinkedIn y artículos. Audita tu sitio, detecta palabras clave y competidores, y redacta borradores de contenido listos para revisar y publicar. Es útil para fundadores y equipos pequeños que necesitan distribución y crecimiento orgánico sin contratar un equipo de marketing. Incluye también un chat privado con modelos de código abierto y cifrado de extremo a extremo. Palabras clave: marketing, IA, SEO, GEO, agentes, contenido, crecimiento, automatización, CMO, founders.",
    categoriaId: 15,
    modeloPrecioId: 2,
    etiquetasSlugs: ["herramientas-ia", "automatizacion"],
  },
  {
    nombre: "Call.md",
    url: "https://github.com/video-db/call.md",
    descripcion:
      "Call.md es una aplicación de escritorio de código abierto (Electron) que convierte reuniones en bucles de agentes en vivo: graba localmente, transcribe en tiempo real (tú vs. ellos) y ofrece inteligencia durante y después de la llamada. Incluye asistente en vivo con sugerencias contextuales, métricas de conversación (ritmo, turnos de palabra), detector de necesidades que dispara tus herramientas MCP automáticamente, y al terminar genera resúmenes con puntos clave y tareas. Es útil para ventas, founders y equipos que quieren seguimiento automático de reuniones sin apuntes manuales. Se integra con n8n, Zapier y CRMs vía webhooks. Palabras clave: reuniones, transcripción, IA, agentes, MCP, notas, ventas, asistente, código abierto, productividad.",
    categoriaId: 15,
    modeloPrecioId: 1,
    etiquetasSlugs: ["herramientas-ia", "codigo-abierto"],
  },
  {
    nombre: "Blink",
    url: "https://blink.new/",
    descripcion:
      "Blink es un constructor de aplicaciones nativo en IA que crea productos full-stack completos (web y móvil) a partir de una descripción en lenguaje natural. Proporciona Postgres, autenticación, almacenamiento, un backend en ejecución y una URL en vivo sin que conectes infraestructura: tú posees el código generado en un repositorio de GitHub desde el primer día y puedes exportarlo o autohospedarlo. También ofrece Blink Claw, hosting gestionado de agentes autónomos en minutos. Es útil para founders, PMs y desarrolladores que quieren pasar de la idea a un SaaS funcional sin ocuparse del andamiaje. Palabras clave: IA, app builder, generación de código, full-stack, no-code, agentes, SaaS, backend, despliegue, vibe coding.",
    categoriaId: 15,
    modeloPrecioId: 2,
    etiquetasSlugs: ["generacion-codigo-ia", "herramientas-ia"],
  },
  {
    nombre: "Flaticon",
    url: "https://www.flaticon.es/",
    descripcion:
      "Flaticon es una de las mayores bibliotecas de iconos del mundo, con millones de iconos vectoriales en formatos SVG, PNG, EPS y PSD, organizados por estilo, tema y pack. Permite descargar iconos sueltos o colecciones completas para usar en interfaces, presentaciones y material gráfico, con opciones de edición de color y tamaño. Es útil para diseñadores y desarrolladores que necesitan iconografía consistente y lista para producción sin dibujar desde cero. Incluye un plan gratuito con atribución y planes de pago sin límites para equipos y uso comercial. Palabras clave: iconos, vector, SVG, diseño, UI, gráficos, descargas, Flaticon, biblioteca, assets.",
    categoriaId: 13,
    modeloPrecioId: 2,
    etiquetasSlugs: ["iconos"],
  },
  {
    nombre: "Libros Gratis Dev",
    url: "https://librosgratis.dev/",
    descripcion:
      "Libros Gratis Dev es un directorio de libros técnicos y de programación gratuitos, curados para desarrolladores que quieren aprender o profundizar en lenguajes, frameworks y prácticas sin costo. Reúne títulos en varios niveles y temáticas (frontend, backend, datos, DevOps, carrera) en un único lugar para facilitar el autoaprendizaje. Es útil para estudiantes, autodidactas y profesionales en transición que buscan material de calidad accesible en lugar de pagar por cursos. Incluye libros en español y otros idiomas según disponibilidad. Palabras clave: libros, programación, desarrollo, gratis, aprendizaje, carrera, PDF, recursos, cursos, tecnología.",
    categoriaId: 16,
    modeloPrecioId: 1,
    etiquetasSlugs: ["libros"],
  },
  {
    nombre: "Fonts In Use",
    url: "https://fontsinuse.com/",
    descripcion:
      "Fonts In Use es una galería pública que documenta tipografía real: muestra ejemplos concretos de fuentes aplicadas en logos, portadas, carteles, web y packaging, con fichas que explican qué tipografía se usó y por qué. Funciona como archivo visual y herramienta de investigación para encontrar referencias tipográficas basadas en casos reales en lugar de muestrarios abstractos. Es útil para diseñadores, letreristas y desarrolladores que buscan inspiración tipográfica fundamentada y contexto de uso. Permite explorar por clasificación, industria y estilo. Palabras clave: tipografía, fuentes, diseño, inspiración, galería, letra, branding, tipografía real, referencias, visual.",
    categoriaId: 13,
    modeloPrecioId: 1,
    etiquetasSlugs: ["tipografia", "inspiracion-diseno"],
  },
  {
    nombre: "VERT.sh",
    url: "https://vert.sh/",
    descripcion:
      "VERT.sh es un conversor de archivos de código abierto que procesa imágenes, audio y documentos directamente en tu dispositivo, mientras que los videos se convierten en servidores rápidos. No impone límite de tamaño ni muestra anuncios, y todo el código es abierto y auditable. Es útil para desarrolladores y creadores que necesitan transformar formatos (comprimir, cambiar de tipo, extraer audio) de forma privada y sin depender de servicios en la nube cerrados. Se ejecuta en el navegador y cuenta con una interfaz sencilla de arrastrar y soltar. Palabras clave: conversor, archivos, formatos, código abierto, imágenes, audio, vídeo, privacidad, herramienta, gratis.",
    categoriaId: 12,
    modeloPrecioId: 1,
    etiquetasSlugs: ["codigo-abierto"],
  },
  {
    nombre: "PocketBase",
    url: "https://pocketbase.io/",
    descripcion:
      "PocketBase es un backend de código abierto empaquetado en un solo ejecutable que incluye base de datos integrada (SQLite), autenticación, panel de administración y suscripciones en tiempo real lista para usar. Basta con descargar un binario para tener un backend completo para tu app o prototipo, con API REST y SDKs cliente para conectar desde el frontend sin montar infraestructura. Es útil para desarrolladores que quieren un backend rápido, ligero y autohospedable para MVPs, side projects o aplicaciones pequeñas. Soporta reglas de acceso granulares y fácil despliegue. Palabras clave: backend, código abierto, base de datos, autenticación, SQLite, API, tiempo real, autohospedado, MVP, full-stack.",
    categoriaId: 3,
    modeloPrecioId: 1,
    etiquetasSlugs: ["codigo-abierto", "autenticacion"],
  },
];

async function ensureTag(slug: string): Promise<number> {
  const existing = await prisma.etiqueta.findFirst({ where: { slug } });
  if (existing) return existing.id_etiqueta;

  const nombre = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const created = await prisma.etiqueta.create({
    data: { nombre, slug },
  });
  console.log(`Etiqueta creada: ${nombre} (${created.id_etiqueta}) [${slug}]`);
  return created.id_etiqueta;
}

async function main() {
  const slugToId = new Map<string, number>();
  for (const r of SEED) {
    for (const slug of r.etiquetasSlugs) {
      if (!slugToId.has(slug)) {
        slugToId.set(slug, await ensureTag(slug));
      }
    }
  }

  let ok = 0;
  let fail = 0;

  for (const r of SEED) {
    const etiquetas = r.etiquetasSlugs.map((s) => slugToId.get(s)!);
    try {
      const created = await service.createResource({
        nombre: r.nombre,
        descripcion: r.descripcion,
        url: r.url,
        categoriaId: r.categoriaId,
        modeloPrecioId: r.modeloPrecioId,
        etiquetas,
      });
      ok += 1;
      console.log(`OK recurso ${created.id_recurso} - ${created.nombre}`);
    } catch (error) {
      fail += 1;
      console.error(`FAIL ${r.nombre}`, error);
    }
  }

  console.log(`\nRecursos creados: ${ok} | fallidos: ${fail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
