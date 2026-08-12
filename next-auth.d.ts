import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "stockiste" | "partenaire" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role: "stockiste" | "partenaire" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "stockiste" | "partenaire" | "admin";
  }
}
