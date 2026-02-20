"use client";

import { FormEvent, useEffect, useState } from "react";
import { TableCard } from "../../../components/TableCard";
import { adminSupabase } from "../../../lib/supabase";

type ProducerRow = {
  id: string;
  rating: number;
  average_delivery_fee_eur: number;
  organization?: {
    name: string;
    city: string;
  };
};

export default function ProducersPage() {
  const [rows, setRows] = useState<ProducerRow[]>([]);
  const [message, setMessage] = useState<string>("");

  const load = async () => {
    const { data: producers } = await adminSupabase
      .from("producers")
      .select("id, rating, average_delivery_fee_eur")
      .order("created_at", { ascending: false });

    const ids = (producers ?? []).map((producer) => producer.id);
    const { data: orgs } = await adminSupabase.from("organizations").select("id, name, city").in("id", ids);

    const merged = (producers ?? []).map((producer) => ({
      ...producer,
      organization: orgs?.find((org) => org.id === producer.id)
    }));

    setRows(merged as ProducerRow[]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleProductCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      producer_id: String(formData.get("producer_id") ?? ""),
      category_code: String(formData.get("category_code") ?? "meat"),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      unit: String(formData.get("unit") ?? "kg"),
      base_price_eur: Number(formData.get("base_price_eur") ?? 0),
      active: true
    };

    const { error } = await adminSupabase.from("products").insert(payload);

    if (error) {
      setMessage(`Error creando producto: ${error.message}`);
      return;
    }

    setMessage("Producto creado correctamente.");
    event.currentTarget.reset();
  };

  const handleWindowCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      producer_id: String(formData.get("producer_id") ?? ""),
      day_of_week: Number(formData.get("day_of_week") ?? 1),
      start_time: String(formData.get("start_time") ?? "06:00"),
      end_time: String(formData.get("end_time") ?? "08:00"),
      same_day_allowed: true,
      next_day_allowed: true
    };

    const { error } = await adminSupabase.from("delivery_windows").insert(payload);

    if (error) {
      setMessage(`Error creando franja: ${error.message}`);
      return;
    }

    setMessage("Franja de entrega creada correctamente.");
    event.currentTarget.reset();
  };

  return (
    <>
      <h1 className="page-title">Proveedores</h1>
      <p className="page-subtitle">Catálogo y operativa de productores activos.</p>

      <TableCard title="Crear producto de catálogo">
        <form className="form-grid" onSubmit={handleProductCreate}>
          <select name="producer_id" required defaultValue="">
            <option value="" disabled>
              Selecciona proveedor
            </option>
            {rows.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {producer.organization?.name ?? producer.id}
              </option>
            ))}
          </select>
          <select name="category_code" defaultValue="meat">
            <option value="meat">meat</option>
            <option value="seafood">seafood</option>
            <option value="produce">produce</option>
          </select>
          <input name="name" placeholder="Nombre de producto" required />
          <input name="description" placeholder="Descripción" />
          <select name="unit" defaultValue="kg">
            <option value="kg">kg</option>
            <option value="piece">piece</option>
          </select>
          <input name="base_price_eur" type="number" step="0.01" placeholder="Precio base" required />
          <button type="submit">Crear producto</button>
        </form>
      </TableCard>

      <TableCard title="Crear franja de entrega">
        <form className="form-grid" onSubmit={handleWindowCreate}>
          <select name="producer_id" required defaultValue="">
            <option value="" disabled>
              Selecciona proveedor
            </option>
            {rows.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {producer.organization?.name ?? producer.id}
              </option>
            ))}
          </select>
          <input name="day_of_week" type="number" min={0} max={6} defaultValue={1} required />
          <input name="start_time" type="time" defaultValue="06:00" required />
          <input name="end_time" type="time" defaultValue="08:00" required />
          <button type="submit">Crear franja</button>
        </form>
      </TableCard>

      <TableCard title="Directorio de productores" subtitle="Sevilla launch cohort">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Rating</th>
              <th>Envío medio</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((producer) => (
              <tr key={producer.id}>
                <td>{producer.organization?.name ?? producer.id}</td>
                <td>{producer.organization?.city ?? "-"}</td>
                <td>{Number(producer.rating).toFixed(1)}</td>
                <td>{Number(producer.average_delivery_fee_eur).toFixed(2)}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
      {message ? <p className="message">{message}</p> : null}
    </>
  );
}
