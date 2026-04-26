import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Usamos JWT para no depender de una tabla Session mientras avanzas con el modelo actual.
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validación mínima de entrada para evitar consultas innecesarias.
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        // Si no existe o está inactivo, se rechaza el login.
        if (!admin || !admin.activo) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, admin.password_hash);
        if (!isValidPassword) {
          return null;
        }

        // Devolvemos datos mínimos para el token/sesión.
        return {
          id: String(admin.id_admin),
          email: admin.email,
          name: admin.email,
          role: admin.role,
          active: admin.activo,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // En el login guardamos datos del admin dentro del token JWT.
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
        token.active = (user as { active?: boolean }).active ?? true;
      }

      return token;
    },
    async session({ session, token }) {
      // Exponemos rol y estado en la sesión para autorización por rutas.
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "admin";
        session.user.active = Boolean(token.active);
      }

      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
