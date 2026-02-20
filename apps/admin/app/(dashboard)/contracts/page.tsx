"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TableCard } from "../../../components/TableCard";
import { adminSupabase } from "../../../lib/supabase";

type ContractRow = {
  id: string;
  status: string;
  current_version: number;
  producer_organization_id: string;
  restaurant_organization_id: string;
  updated_at: string;
};

export default function ContractsPage() {
  const [rows, setRows] = useState<ContractRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await adminSupabase
        .from("contracts")
        .select("id, status, current_version, producer_organization_id, restaurant_organization_id, updated_at")
        .order("updated_at", { ascending: false });

      setRows((data ?? []) as ContractRow[]);
    };

    load();
  }, []);

  const visibleRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  const onStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  return (
    <>
      <h1 className="page-title">Contratos</h1>
      <p className="page-subtitle">Monitorea borradores, revisiones y contratos activos.</p>

      <TableCard title="Estado de contratos" subtitle="Pipeline de autonomía restaurante-proveedor">
        <div style={{ marginBottom: 10 }}>
          <select value={statusFilter} onChange={onStatusChange}>
            <option value="all">Todos</option>
            <option value="draft">draft</option>
            <option value="revision_requested">revision_requested</option>
            <option value="accepted">accepted</option>
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="expired">expired</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Versión</th>
              <th>Restaurante</th>
              <th>Proveedor</th>
              <th>Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.id.slice(0, 8)}</td>
                <td>
                  <span className={`status ${contract.status === "active" ? "status--active" : ""}`}>{contract.status}</span>
                </td>
                <td>{contract.current_version}</td>
                <td>{contract.restaurant_organization_id.slice(0, 8)}</td>
                <td>{contract.producer_organization_id.slice(0, 8)}</td>
                <td>{new Date(contract.updated_at).toLocaleString("es-ES")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}
