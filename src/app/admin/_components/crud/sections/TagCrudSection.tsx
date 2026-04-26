"use client";

import { useEffect, useMemo, useState } from "react";
import AdminEntitySection from "@/app/admin/_components/crud/AdminEntitySection";
import {
  API_ENDPOINTS,
  DEFAULT_QUERY,
  ADMIN_EVENTS,
  buildPayload,
  emitAdminEvent,
  fetchPaginatedData,
  performMutation,
} from "@/app/admin/_components/crud/crud-api";
import type { FormFieldConfig, TableColumn, Tag } from "@/app/admin/_components/crud/types";

type TagForm = { nombre: string; descripcion: string; slug: string };

const initialTagForm: TagForm = { nombre: "", descripcion: "", slug: "" };

const PAGE_SIZE = 20;

function buildTagsQuery(page: number) {
  return `${API_ENDPOINTS.tags}?limit=${PAGE_SIZE}&page=${page}`;
}

export default function TagCrudSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [form, setForm] = useState(initialTagForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTags, setTotalTags] = useState(0);

  async function refreshTags(page = currentPage) {
    const payload = await fetchPaginatedData<Tag>(buildTagsQuery(page));
    setTags(payload.data);
    setCurrentPage(payload.pagination?.currentPage ?? page);
    setTotalPages(Math.max(1, payload.pagination?.totalPages ?? 1));
    setTotalTags(payload.pagination?.total ?? payload.data.length);
    emitAdminEvent(ADMIN_EVENTS.tagsUpdated);
  }

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPaginatedData<Tag>(buildTagsQuery(1));
        if (!mounted) return;
        setTags(data.data);
        setCurrentPage(data.pagination?.currentPage ?? 1);
        setTotalPages(Math.max(1, data.pagination?.totalPages ?? 1));
        setTotalTags(data.pagination?.total ?? data.data.length);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar etiquetas");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  const fields: FormFieldConfig<TagForm>[] = useMemo(
    () => [
      { name: "nombre", label: "Nombre", type: "text", placeholder: "Nombre", required: true },
      {
        name: "descripcion",
        label: "Descripción",
        type: "text",
        placeholder: "Descripción (uso interno admin)",
      },
      { name: "slug", label: "Slug", type: "text", placeholder: "Slug (opcional)" },
    ],
    [],
  );

  const columns: TableColumn<Tag>[] = useMemo(
    () => [
      { header: "ID", render: (item) => item.id_etiqueta },
      { header: "Nombre", render: (item) => item.nombre },
      {
        header: "Descripción",
        className: "max-w-80",
        render: (item) => (
          <span className="block truncate" title={item.descripcion ?? ""}>
            {item.descripcion ?? "-"}
          </span>
        ),
      },
      { header: "Slug", render: (item) => item.slug },
    ],
    [],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const isEdit = editingId !== null;
      const url = isEdit ? `${API_ENDPOINTS.tags}/${editingId}` : API_ENDPOINTS.tags;
      await performMutation(url, isEdit ? "PUT" : "POST", buildPayload(form));
      setForm(initialTagForm);
      setEditingId(null);
      await refreshTags(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la etiqueta");
    }
  }

  async function handleDelete(item: Tag) {
    const confirmed = confirm("¿Seguro que quieres eliminar esta etiqueta?");
    if (!confirmed) return;

    setError(null);

    try {
      await performMutation(`${API_ENDPOINTS.tags}/${item.id_etiqueta}`, "DELETE");
      await refreshTags(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la etiqueta");
    }
  }

  if (loading) {
    return (
      <article className="rounded-xl border border-border bg-cardBackground p-4 shadow-sm shadow-glow/15">
        <h2 className="text-lg font-semibold text-textPrimary">Etiquetas</h2>
        <p className="mt-2 text-sm text-textSecondary">Cargando sección...</p>
      </article>
    );
  }

  return (
    <>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <AdminEntitySection
        title="Etiquetas"
        description="Crear, editar y eliminar etiquetas"
        submitCreateLabel="Crear"
        submitEditLabel="Actualizar"
        tableMinWidthClass="min-w-180"
        items={tags}
        getKey={(item) => item.id_etiqueta}
        fields={fields}
        columns={columns}
        formState={form}
        setFormState={setForm}
        editingId={editingId}
        onSubmit={handleSubmit}
        onStartEdit={(item) => {
          setEditingId(item.id_etiqueta);
          setForm({
            nombre: item.nombre ?? "",
            descripcion: item.descripcion ?? "",
            slug: item.slug ?? "",
          });
        }}
        onDelete={handleDelete}
        onCancelEdit={() => {
          setEditingId(null);
          setForm(initialTagForm);
        }}
        pagination={{ currentPage, totalPages, total: totalTags }}
        onPageChange={(page) => {
          void refreshTags(page);
        }}
      />
    </>
  );
}
