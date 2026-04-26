"use client";

import { useEffect, useMemo, useState } from "react";
import AdminEntitySection from "@/app/admin/_components/crud/AdminEntitySection";
import {
  ADMIN_EVENTS,
  API_ENDPOINTS,
  DEFAULT_QUERY,
  buildPayload,
  fetchPageData,
  performMutation,
} from "@/app/admin/_components/crud/crud-api";
import type {
  Category,
  FormFieldConfig,
  Suggestion,
  SuggestionStatus,
  TableColumn,
} from "@/app/admin/_components/crud/types";

type SuggestionForm = {
  titulo: string;
  descripcion: string;
  url: string;
  categoriaId: string;
  categoriaSugerida: string;
  emailContacto: string;
  estadoSugerenciaId: string;
};

const initialSuggestionForm: SuggestionForm = {
  titulo: "",
  descripcion: "",
  url: "",
  categoriaId: "",
  categoriaSugerida: "",
  emailContacto: "",
  estadoSugerenciaId: "",
};

export default function SuggestionCrudSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<SuggestionStatus[]>([]);
  const [form, setForm] = useState(initialSuggestionForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function refreshSuggestions() {
    const data = await fetchPageData<Suggestion>(
      `${API_ENDPOINTS.suggestions}${DEFAULT_QUERY.suggestions}`,
    );
    setSuggestions(data);
  }

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [suggestionsData, categoriesData, statusesData] = await Promise.all([
          fetchPageData<Suggestion>(`${API_ENDPOINTS.suggestions}${DEFAULT_QUERY.suggestions}`),
          fetchPageData<Category>(`${API_ENDPOINTS.categories}${DEFAULT_QUERY.categories}`),
          fetchPageData<SuggestionStatus>(
            `${API_ENDPOINTS.suggestionStatuses}${DEFAULT_QUERY.suggestionStatuses}`,
          ),
        ]);

        if (!mounted) return;
        setSuggestions(suggestionsData);
        setCategories(categoriesData);
        setStatuses(statusesData);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar sugerencias");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const syncCategories = () => {
      void (async () => {
        try {
          const data = await fetchPageData<Category>(
            `${API_ENDPOINTS.categories}${DEFAULT_QUERY.categories}`,
          );
          setCategories(data);
        } catch {
          // Este refresco es de sincronización secundaria; ignoramos errores silenciosamente.
        }
      })();
    };

    window.addEventListener(ADMIN_EVENTS.categoriesUpdated, syncCategories);

    return () => {
      window.removeEventListener(ADMIN_EVENTS.categoriesUpdated, syncCategories);
    };
  }, []);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id_categoria),
        label: category.nombre ?? "Sin nombre",
      })),
    [categories],
  );

  const statusOptions = useMemo(
    () =>
      statuses.map((status) => ({
        value: String(status.id_estado_sugerencia),
        label: status.nombre ?? `Estado #${status.id_estado_sugerencia}`,
      })),
    [statuses],
  );

  const categoryNameById = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id_categoria,
          category.nombre ?? `Categoria #${category.id_categoria}`,
        ]),
      ),
    [categories],
  );

  const statusNameById = useMemo(
    () =>
      new Map(
        statuses.map((status) => [
          status.id_estado_sugerencia,
          status.nombre ?? `Estado #${status.id_estado_sugerencia}`,
        ]),
      ),
    [statuses],
  );

  const fields: FormFieldConfig<SuggestionForm>[] = useMemo(
    () => [
      { name: "titulo", label: "Título", type: "text", placeholder: "Título", required: true },
      {
        name: "descripcion",
        label: "Descripción",
        type: "text",
        placeholder: "Descripción",
      },
      { name: "url", label: "URL", type: "url", placeholder: "URL" },
      {
        name: "categoriaId",
        label: "Categoría",
        type: "select",
        placeholder: "Categoría (opcional)",
        options: categoryOptions,
      },
      {
        name: "categoriaSugerida",
        label: "Categoría sugerida",
        type: "text",
        placeholder: "Categoría sugerida (opcional)",
      },
      {
        name: "emailContacto",
        label: "Email contacto",
        type: "text",
        placeholder: "Email (opcional)",
      },
      {
        name: "estadoSugerenciaId",
        label: "Estado",
        type: "select",
        placeholder: "Estado (opcional)",
        options: statusOptions,
      },
    ],
    [categoryOptions, statusOptions],
  );

  const columns: TableColumn<Suggestion>[] = useMemo(
    () => [
      { header: "ID", render: (item) => item.id_sugerencia },
      { header: "Título", render: (item) => item.titulo },
      {
        header: "Categoría",
        render: (item) =>
          item.id_categoria ? (categoryNameById.get(item.id_categoria) ?? item.id_categoria) : "-",
      },
      {
        header: "Categoría sugerida",
        render: (item) => item.categoria_sugerida ?? "-",
      },
      {
        header: "Email",
        render: (item) => item.email_contacto ?? "-",
      },
      {
        header: "Estado",
        render: (item) =>
          item.id_estado_sugerencia
            ? (statusNameById.get(item.id_estado_sugerencia) ?? item.id_estado_sugerencia)
            : "-",
      },
    ],
    [categoryNameById, statusNameById],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const isEdit = editingId !== null;
      const url = isEdit ? `${API_ENDPOINTS.suggestions}/${editingId}` : API_ENDPOINTS.suggestions;
      await performMutation(url, isEdit ? "PUT" : "POST", buildPayload(form));
      setForm(initialSuggestionForm);
      setEditingId(null);
      await refreshSuggestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la sugerencia");
    }
  }

  async function handleDelete(item: Suggestion) {
    const confirmed = confirm("¿Seguro que quieres eliminar esta sugerencia?");
    if (!confirmed) return;

    setError(null);

    try {
      await performMutation(`${API_ENDPOINTS.suggestions}/${item.id_sugerencia}`, "DELETE");
      await refreshSuggestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la sugerencia");
    }
  }

  if (loading) {
    return (
      <article className="rounded-xl border border-border bg-cardBackground p-4 shadow-sm shadow-glow/15">
        <h2 className="text-lg font-semibold text-textPrimary">Sugerencias</h2>
        <p className="mt-2 text-sm text-textSecondary">Cargando sección...</p>
      </article>
    );
  }

  return (
    <>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <AdminEntitySection
        title="Sugerencias"
        description="Crear, editar y eliminar sugerencias"
        submitCreateLabel="Crear"
        submitEditLabel="Actualizar"
        tableMinWidthClass="min-w-190"
        items={suggestions}
        getKey={(item) => item.id_sugerencia}
        fields={fields}
        columns={columns}
        formState={form}
        setFormState={setForm}
        editingId={editingId}
        onSubmit={handleSubmit}
        onStartEdit={(item) => {
          setEditingId(item.id_sugerencia);
          setForm({
            titulo: item.titulo ?? "",
            descripcion: item.descripcion ?? "",
            url: item.url ?? "",
            categoriaId: item.id_categoria?.toString() ?? "",
            categoriaSugerida: item.categoria_sugerida ?? "",
            emailContacto: item.email_contacto ?? "",
            estadoSugerenciaId: item.id_estado_sugerencia?.toString() ?? "",
          });
        }}
        onDelete={handleDelete}
        onCancelEdit={() => {
          setEditingId(null);
          setForm(initialSuggestionForm);
        }}
      />
    </>
  );
}
