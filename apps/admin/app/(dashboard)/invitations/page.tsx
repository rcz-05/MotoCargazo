"use client";

import { FormEvent, useEffect, useState } from "react";
import { TableCard } from "../../../components/TableCard";
import { adminSupabase } from "../../../lib/supabase";

type InvitationRow = {
  id: string;
  email: string;
  role: "restaurant" | "producer" | "admin";
  city: string;
  status: string;
  expires_at: string;
};

export default function InvitationsPage() {
  const [rows, setRows] = useState<InvitationRow[]>([]);
  const [message, setMessage] = useState<string>("");

  const load = async () => {
    const { data, error } = await adminSupabase
      .from("invitations")
      .select("id, email, role, city, status, expires_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setMessage(`Error cargando invitaciones: ${error.message}`);
      return;
    }

    setRows((data ?? []) as InvitationRow[]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      role: String(formData.get("role") ?? "producer"),
      organization_id: String(formData.get("organization_id") ?? "").trim(),
      city: String(formData.get("city") ?? "Sevilla").trim(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      status: "pending"
    };

    const { error } = await adminSupabase.from("invitations").insert(payload);

    if (error) {
      setMessage(`Error creando invitación: ${error.message}`);
      return;
    }

    setMessage("Invitación creada correctamente.");
    event.currentTarget.reset();
    await load();
  };

  return (
    <>
      <h1 className="page-title">Invitaciones</h1>
      <p className="page-subtitle">Gestión de onboarding curado para restaurantes y proveedores.</p>

      <TableCard title="Nueva invitación" subtitle="Solo productores invitados pueden registrarse en MVP.">
        <form className="form-grid" onSubmit={handleCreate}>
          <input name="email" placeholder="proveedor@dominio.es" required />
          <select name="role" defaultValue="producer">
            <option value="producer">Producer</option>
            <option value="restaurant">Restaurant</option>
          </select>
          <input name="city" placeholder="Sevilla" defaultValue="Sevilla" required />
          <input name="organization_id" placeholder="Organization UUID" required />
          <button type="submit">Crear invitación</button>
        </form>
        {message ? <p className="message">{message}</p> : null}
      </TableCard>

      <TableCard title="Invitaciones recientes">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Expira</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>{row.city}</td>
                <td>{row.status}</td>
                <td>{new Date(row.expires_at).toLocaleString("es-ES")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}
