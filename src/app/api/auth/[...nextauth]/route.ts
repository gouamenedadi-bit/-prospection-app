import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Défensif contre les valeurs d'env var collées avec des guillemets ou des espaces superflus.
function cleanEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']+/, "").replace(/["']+$/, "").trim();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        role: { label: "Rôle", type: "text" }, // "stockiste" ou "partenaire"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        const { email, password, role } = credentials;

        if (role === "admin") {
          const adminEmail = cleanEnvValue(process.env.ADMIN_EMAIL);
          const adminPasswordHash = cleanEnvValue(process.env.ADMIN_PASSWORD_HASH);
          if (!adminEmail || !adminPasswordHash) {
            console.error("ADMIN_EMAIL / ADMIN_PASSWORD_HASH non configurés");
            return null;
          }
          const emailsMatch = email.trim() === adminEmail;
          const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
          if (!emailsMatch || !passwordMatch) {
            console.error("DEBUG admin login mismatch:", JSON.stringify({
              emailsMatch,
              passwordMatch,
              adminEmailLength: adminEmail.length,
              adminHashLength: adminPasswordHash.length,
            }));
          }
          if (emailsMatch && passwordMatch) {
            return {
              id: "admin",
              name: "Administrateur",
              email: adminEmail,
              role: "admin"
            };
          }
          return null;
        }

        if (role === "stockiste") {
          const user = await prisma.stockiste.findUnique({ where: { email } });
          if (user && await bcrypt.compare(password, user.password)) {
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: "stockiste"
            };
          }
        } else if (role === "partenaire") {
          const user = await prisma.partenaire.findUnique({ where: { email } });
          if (user && await bcrypt.compare(password, user.password)) {
            return {
              id: String(user.id),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: "partenaire"
            };
          }
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
