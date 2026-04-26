import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const emailArg = process.argv[2];
  const idArg = process.argv[3];

  // Prioridad de borrado: email por argumento, luego ADMIN_EMAIL del .env.
  const emailFromEnv = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const email = emailArg?.toLowerCase().trim() || emailFromEnv;

  // Permite borrar por id como alternativa: pnpm admin:delete -- "" 3
  const id = idArg ? Number(idArg) : undefined;

  if (!email && !id) {
    throw new Error("Proporciona");
  }

  if (id !== undefined) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("El id debe ser un entero positivo");
    }

    const result = await prisma.admin.deleteMany({
      where: { id_admin: id },
    });

    console.log(`Admins eliminados por id: ${result.count}`);
    return;
  }

  const result = await prisma.admin.deleteMany({
    where: { email },
  });

  console.log(`Admins eliminados por email (${email}): ${result.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
