"use client"; // Esto marca el componente como Client Component

import { SessionProvider } from "next-auth/react";

export default function ClientSessionProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}