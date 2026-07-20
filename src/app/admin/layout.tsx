import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="min-h-dvh bg-primaryColor text-textPrimary">{children}</div>;
}
