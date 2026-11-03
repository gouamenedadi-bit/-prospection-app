import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { normalizeEmail } from "@/lib/normalize";

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

        const { password, role } = credentials;
        const email = normalizeEmail(credentials.email);
        // Les comptes créés avant la normalisation peuvent avoir des majuscules en base.
        const byEmail = { email: { equals: email, mode: "insensitive" as const } };

        if (role === "admin") {
          const admin = await prisma.admin.findFirst({ where: byEmail });
          if (admin && await bcrypt.compare(password, admin.password)) {
            return {
              id: String(admin.id),
              name: "Administrateur",
              email: admin.email,
              role: "admin"
            };
          }
          return null;
        }

        if (role === "stockiste") {
          const user = await prisma.stockiste.findFirst({ where: byEmail });
          if (user && await bcrypt.compare(password, user.password)) {
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: "stockiste"
            };
          }
        } else if (role === "partenaire") {
          const user = await prisma.partenaire.findFirst({ where: byEmail });
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
