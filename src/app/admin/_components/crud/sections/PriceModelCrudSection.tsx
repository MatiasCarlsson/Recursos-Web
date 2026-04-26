"use client";

import { useEffect, useMemo, useState } from "react";
import AdminEntitySection from "@/app/admin/_components/crud/AdminEntitySection";
import {
  API_ENDPOINTS,
  DEFAULT_QUERY,
  ADMIN_EVENTS,
  buildPayload,
  emitAdminEvent,
  fetchPageData,
  performMutation,
} from "@/app/admin/_components/crud/crud-api";
import type { FormFieldConfig, PriceModel, TableColumn } from "@/app/admin/_components/crud/types";

type PriceModelForm = { nombre: string };

const initialPriceModelForm: PriceModelForm = { nombre: "" };

export default function PriceModelCrudSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceModels, setPriceModels] = useState<PriceModel[]>([]);
  const [form, setForm] = useState(initialPriceModelForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refreshPriceModels() {
    const data = await fetchPageData<PriceModel>(
      `${API_ENDPOINTS.priceModels}${DEFAULT_QUERY.priceModels}`,
    );
    setPriceModels(data);
    emitAdminEvent(ADMIN_EVENTS.priceModelsUpdated);
  }

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPageData<PriceModel>(
          `${API_ENDPOINTS.priceModels}${DEFAULT_QUERY.priceModels}`,
        );
        if (!mounted) return;
        setPriceModels(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar modelos de precio");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  const fields: FormFieldConfig<PriceModelForm>[] = useMemo(
    () => [
      {
        name: "nombre",
        label: "Nombre",
        type: "text",
        placeholder: "Nombre",
        required: true,
      },
    ],
    [],
  );

  const columns: TableColumn<PriceModel>[] = useMemo(
    () => [
      { header: "ID", render: (item) => item.id_modelo_precio },
      { header: "Nombre", render: (item) => item.nombre },
    ],
    [],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const isEdit = editingId !== null;
      const url = isEdit ? `${API_ENDPOINTS.priceModels}/${editingId}` : API_ENDPOINTS.priceModels;
      await performMutation(url, isEdit ? "PUT" : "POST", buildPayload(form));
      setForm(initialPriceModelForm);
      setEditingId(null);
      await refreshPriceModels();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el modelo de precio");
    }
  }

  async function handleDelete(item: PriceModel) {
    const confirmed = confirm("¿Seguro que quieres eliminar este modelo de precio?");
    if (!confirmed) return;

    setError(null);

    try {
      await performMutation(`${API_ENDPOINTS.priceModels}/${item.id_modelo_precio}`, "DELETE");
      await refreshPriceModels();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el modelo de precio");
    }
  }

  if (loading) {
    return (
      <article className="rounded-xl border border-border bg-cardBackground p-4 shadow-sm shadow-glow/15">
        <h2 className="text-lg font-semibold text-textPrimary">Modelos de precio</h2>
        <p className="mt-2 text-sm text-textSecondary">Cargando sección...</p>
      </article>
    );
  }

  return (
    <>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <AdminEntitySection
        title="Modelos de precio"
        description="Crear, editar y eliminar modelos de precio"
        submitCreateLabel="Crear"
        submitEditLabel="Actualizar"
        tableMinWidthClass="min-w-110"
        items={priceModels}
        getKey={(item) => item.id_modelo_precio}
        fields={fields}
        columns={columns}
        formState={form}
        setFormState={setForm}
        editingId={editingId}
        onSubmit={handleSubmit}
        onStartEdit={(item) => {
          setEditingId(item.id_modelo_precio);
          setForm({
            nombre: item.nombre ?? "",
          });
        }}
        onDelete={handleDelete}
        onCancelEdit={() => {
          setEditingId(null);
          setForm(initialPriceModelForm);
        }}
      />
    </>
  );
}
