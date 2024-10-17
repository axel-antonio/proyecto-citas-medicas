
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/auth/login', // La página de login si no están autenticados
  },
  callbacks: {
    authorized: ({ token }) => {
      // Asegura que el token existe
      return !!token;
    },
  },
  // Si necesitas bloquear algunas rutas específicas basadas en el rol:
  async redirect({ url, token }) {
    if (url.startsWith("/dashboard")) {
      if (token?.role === "DOCTOR") {
        return "/dashboard/doctor"; // Redirige a la página de Doctor
      } else if (token?.role === "CLIENT") {
        return "/dashboard/client"; // Redirige a la página de Cliente
      }
    }
    return url;
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Asegura que todas las rutas dentro de dashboard usen esta lógica
};
