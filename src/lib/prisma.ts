import { PrismaClient } from "@prisma/client";

// Patrón singleton recomendado por Prisma para Next.js:
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

// Sin esto, Next.js crea una nueva instancia por cada hot-reload, agotando el pool de conexiones.

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function buildPrismaUrlWithSafePoolDefaults() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    const isPgBouncer = url.searchParams.get("pgbouncer") === "true";

    if (!url.searchParams.has("pool_timeout")) {
      // Allow more wait time before failing under temporary load spikes.
      url.searchParams.set("pool_timeout", process.env.PRISMA_POOL_TIMEOUT ?? "30");
    }

    if (isPgBouncer && !url.searchParams.has("connection_limit")) {
      // Keep Prisma from opening too many parallel DB connections behind PgBouncer.
      url.searchParams.set("connection_limit", process.env.PRISMA_CONNECTION_LIMIT ?? "5");
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

const prismaDatasourceUrl = buildPrismaUrlWithSafePoolDefaults();

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    prismaDatasourceUrl
      ? {
          datasources: {
            db: {
              url: prismaDatasourceUrl,
            },
          },
        }
      : undefined,
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
