"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TableCard } from "../../../components/TableCard";
import { adminSupabase } from "../../../lib/supabase";

type OrderRow = {
  id: string;
  status: string;
  total_eur: number;
  scheduled_delivery_start: string;
  producer_organization_id: string;
  restaurant_organization_id: string;
};

export default function OrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await adminSupabase
        .from("orders")
        .select("id, status, total_eur, scheduled_delivery_start, producer_organization_id, restaurant_organization_id")
        .order("created_at", { ascending: false })
        .limit(100);

      setRows((data ?? []) as OrderRow[]);
    };

    load();
  }, []);

  const visibleRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((order) => order.status === statusFilter);
  }, [rows, statusFilter]);

  const onStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  return (
    <>
      <h1 className="page-title">Pedidos</h1>
      <p className="page-subtitle">Supervisión operacional de orders y entregas.</p>

      <TableCard title="Últimos pedidos">
        <div style={{ marginBottom: 10 }}>
          <select value={statusFilter} onChange={onStatusChange}>
            <option value="all">Todos</option>
            <option value="proposed">proposed</option>
            <option value="submitted">submitted</option>
            <option value="accepted_by_producer">accepted_by_producer</option>
            <option value="preparing">preparing</option>
            <option value="out_for_delivery">out_for_delivery</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Entrega</th>
              <th>Total</th>
              <th>Restaurante</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.scheduled_delivery_start).toLocaleString("es-ES")}</td>
                <td>{Number(order.total_eur).toFixed(2)}€</td>
                <td>{order.restaurant_organization_id.slice(0, 8)}</td>
                <td>{order.producer_organization_id.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}
