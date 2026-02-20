import Link from "next/link";
import type { Route } from "next";
import { ReactNode } from "react";

const navItems: { href: Route; label: string }[] = [
  { href: "/invitations", label: "Invitaciones" },
  { href: "/city-rules", label: "Reglas de ciudad" },
  { href: "/producers", label: "Proveedores" },
  { href: "/contracts", label: "Contratos" },
  { href: "/orders", label: "Pedidos" }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">MotoCargo Admin</div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
