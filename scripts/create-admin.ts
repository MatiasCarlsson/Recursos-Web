import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // Validamos variables de entorno para no crear usuarios incompletos.
  if (!email || !password) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD en tu .env antes de ejecutar este script");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Evitamos duplicados por email.
  const existing = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    console.log(`Admin ya existe con email: ${normalizedEmail}`);
    return;
  }

  // Guardamos hash, nunca contraseña en texto plano.
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: {
      email: normalizedEmail,
      password_hash: passwordHash,
      role: "admin",
      activo: true,
    },
  });

  console.log(`Admin creado: ${normalizedEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
