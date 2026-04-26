import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Testing database connection...");

  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Prueba una query simple
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log("📅 Server time:", result);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
