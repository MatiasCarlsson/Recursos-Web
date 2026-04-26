import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Handler estándar de NextAuth para App Router (GET/POST).
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
