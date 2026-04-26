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
  fetchPageData,
  performMutation,
} from "@/app/admin/_components/crud/crud-api";
import type { Category, FormFieldConfig, TableColumn } from "@/app/admin/_components/crud/types";

type CategoryForm = { nombre: string; descripcion: string; slug: string };

const initialCategoryForm: CategoryForm = { nombre: "", descripcion: "", slug: "" };

const PAGE_SIZE = 20;

function buildCategoriesQuery(page: number) {
  return `${API_ENDPOINTS.categories}?limit=${PAGE_SIZE}&page=${page}&includeResources=false`;
}

export default function CategoryCrudSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialCategoryForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  async function refreshCategories(page = currentPage) {
    const payload = await fetchPaginatedData<Category>(buildCategoriesQuery(page));
    setCategories(payload.data);
    setCurrentPage(payload.pagination?.currentPage ?? page);
    setTotalPages(Math.max(1, payload.pagination?.totalPages ?? 1));
    setTotalCategories(payload.pagination?.total ?? payload.data.length);
    emitAdminEvent(ADMIN_EVENTS.categoriesUpdated);
  }

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPaginatedData<Category>(buildCategoriesQuery(1));
        if (!mounted) return;
        setCategories(data.data);
        setCurrentPage(data.pagination?.currentPage ?? 1);
        setTotalPages(Math.max(1, data.pagination?.totalPages ?? 1));
        setTotalCategories(data.pagination?.total ?? data.data.length);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar categorías");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  const fields: FormFieldConfig<CategoryForm>[] = useMemo(
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

  const columns: TableColumn<Category>[] = useMemo(
    () => [
      { header: "ID", render: (item) => item.id_categoria },
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
      const url = isEdit ? `${API_ENDPOINTS.categories}/${editingId}` : API_ENDPOINTS.categories;
      await performMutation(url, isEdit ? "PUT" : "POST", buildPayload(form));
      setForm(initialCategoryForm);
      setEditingId(null);
      await refreshCategories(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la categoría");
    }
  }

  async function handleDelete(item: Category) {
    const confirmed = confirm("¿Seguro que quieres eliminar esta categoría?");
    if (!confirmed) return;

    setError(null);

    try {
      await performMutation(`${API_ENDPOINTS.categories}/${item.id_categoria}`, "DELETE");
      await refreshCategories(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la categoría");
    }
  }

  if (loading) {
    return (
      <article className="rounded-xl border border-border bg-cardBackground p-4 shadow-sm shadow-glow/15">
        <h2 className="text-lg font-semibold text-textPrimary">Categorías</h2>
        <p className="mt-2 text-sm text-textSecondary">Cargando sección...</p>
      </article>
    );
  }

  return (
    <>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <AdminEntitySection
        title="Categorías"
        description="Crear, editar y eliminar categorías"
        submitCreateLabel="Crear"
        submitEditLabel="Actualizar"
        tableMinWidthClass="min-w-180"
        items={categories}
        getKey={(item) => item.id_categoria}
        fields={fields}
        columns={columns}
        formState={form}
        setFormState={setForm}
        editingId={editingId}
        onSubmit={handleSubmit}
        onStartEdit={(item) => {
          setEditingId(item.id_categoria);
          setForm({
            nombre: item.nombre ?? "",
            descripcion: item.descripcion ?? "",
            slug: item.slug ?? "",
          });
        }}
        onDelete={handleDelete}
        onCancelEdit={() => {
          setEditingId(null);
          setForm(initialCategoryForm);
        }}
        pagination={{ currentPage, totalPages, total: totalCategories }}
        onPageChange={(page) => {
          void refreshCategories(page);
        }}
      />
    </>
  );
}
