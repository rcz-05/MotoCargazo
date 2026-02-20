"use client";

import { FormEvent, useEffect, useState } from "react";
import { TableCard } from "../../../components/TableCard";
import { adminSupabase } from "../../../lib/supabase";

type ZoneRow = {
  id: string;
  city: string;
  zone_code: string;
  zone_name: string;
  low_emission_only: boolean;
  max_vehicle_weight_kg: number;
  max_vehicle_height_cm: number;
};

export default function CityRulesPage() {
  const [zones, setZones] = useState<ZoneRow[]>([]);
  const [message, setMessage] = useState<string>("");

  const load = async () => {
    const { data, error } = await adminSupabase
      .from("city_zones")
      .select("id, city, zone_code, zone_name, low_emission_only, max_vehicle_weight_kg, max_vehicle_height_cm")
      .order("city", { ascending: true })
      .order("zone_code", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    setZones((data ?? []) as ZoneRow[]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRuleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const cityZoneId = String(formData.get("city_zone_id") ?? "");
    const ruleType = String(formData.get("rule_type") ?? "vehicle");
    const payloadText = String(formData.get("rule_payload") ?? "{}");

    let parsedPayload: Record<string, unknown> = {};
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch {
      setMessage("El JSON del payload no es válido.");
      return;
    }

    const { error } = await adminSupabase.from("zone_rules").insert({
      city_zone_id: cityZoneId,
      rule_type: ruleType,
      rule_payload: parsedPayload,
      active: true
    });

    if (error) {
      setMessage(`Error creando regla: ${error.message}`);
      return;
    }

    setMessage("Regla creada correctamente.");
    event.currentTarget.reset();
  };

  return (
    <>
      <h1 className="page-title">Reglas de Ciudad</h1>
      <p className="page-subtitle">Restricciones de acceso para validación normativa en checkout.</p>

      <TableCard title="Nueva regla de zona" subtitle="Permite actualizar restricciones sin tocar SQL manualmente.">
        <form className="form-grid" onSubmit={handleRuleCreate}>
          <select name="city_zone_id" required defaultValue="">
            <option value="" disabled>
              Selecciona zona
            </option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.zone_code}
              </option>
            ))}
          </select>
          <select name="rule_type" defaultValue="vehicle">
            <option value="vehicle">vehicle</option>
            <option value="time">time</option>
            <option value="permit">permit</option>
          </select>
          <textarea name="rule_payload" defaultValue='{"requiresElectric": true}' />
          <button type="submit">Crear regla</button>
        </form>
      </TableCard>

      <TableCard title="Zonas activas de Seville">
        <table className="table">
          <thead>
            <tr>
              <th>Zona</th>
              <th>LEZ</th>
              <th>Peso max</th>
              <th>Altura max</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td>{`${zone.city} · ${zone.zone_code} (${zone.zone_name})`}</td>
                <td>{zone.low_emission_only ? "Sí" : "No"}</td>
                <td>{zone.max_vehicle_weight_kg}kg</td>
                <td>{zone.max_vehicle_height_cm}cm</td>
              </tr>
            ))}
          </tbody>
        </table>
        {message ? <p className="message">{message}</p> : null}
      </TableCard>
    </>
  );
}
