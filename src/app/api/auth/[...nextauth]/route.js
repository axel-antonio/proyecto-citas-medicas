import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/libs/db'
import bcrypt from 'bcrypt'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        console.log(credentials)

        const userFound = await db.user.findUnique({
            where: {
                email: credentials.email
            }
        })

        if (!userFound) throw new Error('No user found')

        console.log(userFound)

        const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

        if (!matchPassword) throw new Error('Wrong password')

        return {
            id: userFound.id,
            name: userFound.username,
            email: userFound.email,
            role: userFound.role, // Incluye el rol en la respuesta
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Almacena el rol en el token JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // Almacena el rol en la sesión
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  }
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
