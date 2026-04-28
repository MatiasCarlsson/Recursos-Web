"use client";

import { useEffect, useMemo, useState } from "react";
import AdminEntitySection from "@/app/admin/_components/crud/AdminEntitySection";
import {
  ADMIN_EVENTS,
  API_ENDPOINTS,
  DEFAULT_QUERY,
  buildPayload,
  fetchAllPageData,
  fetchPaginatedData,
  fetchPageData,
  normalizeUrl,
  performMutation,
  toIdArray,
} from "@/app/admin/_components/crud/crud-api";
import type {
  Category,
  FormFieldConfig,
  PriceModel,
  Resource,
  TableColumn,
  Tag,
} from "@/app/admin/_components/crud/types";

type ResourceForm = {
  nombre: string;
  descripcion: string;
  url: string;
  destacado: string;
  categoriaId: string;
  modeloPrecioId: string;
  etiquetas: string;
};

type MutationPayload = Record<string, string | number | boolean | number[] | null>;

const initialResourceForm: ResourceForm = {
  nombre: "",
  descripcion: "",
  url: "",
  destacado: "false",
  categoriaId: "",
  modeloPrecioId: "",
  etiquetas: "",
};

const PAGE_SIZE = 20;

function buildResourcesQuery(page: number) {
  return `${API_ENDPOINTS.adminResources}?limit=${PAGE_SIZE}&page=${page}`;
}

export default function ResourceCrudSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [priceModels, setPriceModels] = useState<PriceModel[]>([]);
  const [form, setForm] = useState(initialResourceForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);

  async function refreshResources(page = currentPage) {
    const payload = await fetchPaginatedData<Resource>(buildResourcesQuery(page));
    setResources(payload.data);
    setCurrentPage(payload.pagination?.currentPage ?? page);
    setTotalPages(Math.max(1, payload.pagination?.totalPages ?? 1));
    setTotalResources(payload.pagination?.total ?? payload.data.length);
  }

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [resourcesData, categoriesData, tagsData, priceModelsData] = await Promise.all([
          fetchPaginatedData<Resource>(buildResourcesQuery(1)),
          fetchPageData<Category>(`${API_ENDPOINTS.categories}${DEFAULT_QUERY.categories}`),
          fetchAllPageData<Tag>(`${API_ENDPOINTS.tags}${DEFAULT_QUERY.tags}`),
          fetchPageData<PriceModel>(`${API_ENDPOINTS.priceModels}${DEFAULT_QUERY.priceModels}`),
        ]);

        if (!mounted) return;
        setResources(resourcesData.data);
        setCurrentPage(resourcesData.pagination?.currentPage ?? 1);
        setTotalPages(Math.max(1, resourcesData.pagination?.totalPages ?? 1));
        setTotalResources(resourcesData.pagination?.total ?? resourcesData.data.length);
        setCategories(categoriesData);
        setTags(tagsData);
        setPriceModels(priceModelsData);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar recursos");
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
    const syncCatalogs = () => {
      void (async () => {
        try {
          const [categoriesData, tagsData, priceModelsData] = await Promise.all([
            fetchPageData<Category>(`${API_ENDPOINTS.categories}${DEFAULT_QUERY.categories}`),
            fetchAllPageData<Tag>(`${API_ENDPOINTS.tags}${DEFAULT_QUERY.tags}`),
            fetchPageData<PriceModel>(`${API_ENDPOINTS.priceModels}${DEFAULT_QUERY.priceModels}`),
          ]);

          setCategories(categoriesData);
          setTags(tagsData);
          setPriceModels(priceModelsData);
        } catch {
          // Este refresco es de sincronización secundaria; ignoramos errores silenciosamente.
        }
      })();
    };

    window.addEventListener(ADMIN_EVENTS.categoriesUpdated, syncCatalogs);
    window.addEventListener(ADMIN_EVENTS.tagsUpdated, syncCatalogs);
    window.addEventListener(ADMIN_EVENTS.priceModelsUpdated, syncCatalogs);

    return () => {
      window.removeEventListener(ADMIN_EVENTS.categoriesUpdated, syncCatalogs);
      window.removeEventListener(ADMIN_EVENTS.tagsUpdated, syncCatalogs);
      window.removeEventListener(ADMIN_EVENTS.priceModelsUpdated, syncCatalogs);
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

  const tagOptions = useMemo(
    () =>
      tags.map((tag) => ({
        value: String(tag.id_etiqueta),
        label: tag.nombre ?? `Etiqueta #${tag.id_etiqueta}`,
      })),
    [tags],
  );

  const priceModelOptions = useMemo(
    () =>
      priceModels.map((model) => ({
        value: String(model.id_modelo_precio),
        label: model.nombre ?? `Modelo #${model.id_modelo_precio}`,
      })),
    [priceModels],
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

  const priceModelNameById = useMemo(
    () =>
      new Map(
        priceModels.map((model) => [
          model.id_modelo_precio,
          model.nombre ?? `Modelo #${model.id_modelo_precio}`,
        ]),
      ),
    [priceModels],
  );

  const fields: FormFieldConfig<ResourceForm>[] = useMemo(
    () => [
      { name: "nombre", label: "Nombre", type: "text", placeholder: "Nombre", required: true },
      {
        name: "descripcion",
        label: "Descripción",
        type: "text",
        placeholder: "Descripción",
        required: true,
      },
      { name: "url", label: "URL", type: "url", placeholder: "URL", required: true },
      {
        name: "destacado",
        label: "Destacado",
        type: "select",
        options: [
          { value: "false", label: "No" },
          { value: "true", label: "Si" },
        ],
      },
      {
        name: "modeloPrecioId",
        label: "Modelo de precio",
        type: "select",
        placeholder: "Modelo de precio (opcional)",
        options: priceModelOptions,
      },
      {
        name: "categoriaId",
        label: "Categoría",
        type: "select",
        ui: "checklist",
        containerClassName: "sm:col-start-1 lg:col-start-1",
        placeholder: "Categoría (opcional)",
        options: categoryOptions,
      },
      {
        name: "etiquetas",
        label: "Etiquetas",
        type: "multiselect",
        ui: "checklist",
        containerClassName: "sm:col-start-2 lg:col-start-2",
        options: tagOptions,
      },
    ],
    [categoryOptions, priceModelOptions, tagOptions],
  );

  const columns: TableColumn<Resource>[] = useMemo(
    () => [
      { header: "ID", render: (item) => item.id_recurso },
      { header: "Nombre", render: (item) => item.nombre },
      {
        header: "Categoría",
        render: (item) =>
          item.id_categoria ? (categoryNameById.get(item.id_categoria) ?? item.id_categoria) : "-",
      },
      {
        header: "Modelo de precio",
        render: (item) =>
          item.id_modelo_precio
            ? (priceModelNameById.get(item.id_modelo_precio) ?? item.id_modelo_precio)
            : "-",
      },
      {
        header: "URL",
        className: "max-w-65",
        render: (item) => {
          const url = normalizeUrl(item.url);
          if (!url) return <span className="block truncate">{item.url ?? "-"}</span>;

          return (
            <a
              href={url.href}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-textPrimary underline decoration-textSecondary/50 underline-offset-2 hover:text-accent"
              title={url.href}
            >
              {url.label}
            </a>
          );
        },
      },
      {
        header: "Destacado",
        render: (item) => (item.destacado ? "Si" : "No"),
      },
      {
        header: "Etiquetas",
        className: "max-w-65",
        render: (item) => {
          const names =
            item.recurso_etiqueta
              ?.map((relation) => relation.etiqueta?.nombre)
              .filter((name): name is string => Boolean(name)) ?? [];

          return <span className="block truncate">{names.length ? names.join(", ") : "-"}</span>;
        },
      },
    ],
    [categoryNameById, priceModelNameById],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `${API_ENDPOINTS.adminResources}/${editingId}`
        : API_ENDPOINTS.adminResources;
      const payload: MutationPayload = buildPayload({
        nombre: form.nombre,
        descripcion: form.descripcion,
        url: form.url,
      });
      payload.destacado = form.destacado === "true";

      if (form.categoriaId) {
        payload.categoriaId = Number(form.categoriaId);
      } else if (isEdit) {
        payload.categoriaId = null;
      }

      if (form.modeloPrecioId) {
        payload.modeloPrecioId = Number(form.modeloPrecioId);
      } else if (isEdit) {
        payload.modeloPrecioId = null;
      }

      payload.etiquetas = toIdArray(form.etiquetas);
      await performMutation(url, isEdit ? "PUT" : "POST", payload);

      setForm(initialResourceForm);
      setEditingId(null);
      await refreshResources(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el recurso");
    }
  }

  async function handleDelete(item: Resource) {
    const confirmed = confirm("¿Seguro que quieres eliminar este recurso?");
    if (!confirmed) return;

    setError(null);

    try {
      await performMutation(`${API_ENDPOINTS.adminResources}/${item.id_recurso}`, "DELETE");
      await refreshResources(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el recurso");
    }
  }

  if (loading) {
    return (
      <article className="rounded-xl border border-border bg-cardBackground p-4 shadow-sm shadow-glow/15">
        <h2 className="text-lg font-semibold text-textPrimary">Recursos</h2>
        <p className="mt-2 text-sm text-textSecondary">Cargando sección...</p>
      </article>
    );
  }

  return (
    <>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <AdminEntitySection
        title="Recursos"
        description="Crear, editar y eliminar recursos"
        submitCreateLabel="Crear"
        submitEditLabel="Actualizar"
        tableMinWidthClass="min-w-200"
        items={resources}
        getKey={(item) => item.id_recurso}
        fields={fields}
        columns={columns}
        formState={form}
        setFormState={setForm}
        editingId={editingId}
        onSubmit={handleSubmit}
        onStartEdit={(item) => {
          setEditingId(item.id_recurso);
          setForm({
            nombre: item.nombre ?? "",
            descripcion: item.descripcion ?? "",
            url: item.url ?? "",
            destacado: item.destacado ? "true" : "false",
            categoriaId: item.id_categoria?.toString() ?? "",
            modeloPrecioId: item.id_modelo_precio?.toString() ?? "",
            etiquetas:
              item.recurso_etiqueta?.map((relation) => relation.id_etiqueta).join(",") ?? "",
          });
        }}
        onDelete={handleDelete}
        onCancelEdit={() => {
          setEditingId(null);
          setForm(initialResourceForm);
        }}
        pagination={{ currentPage, totalPages, total: totalResources }}
        onPageChange={(page) => {
          void refreshResources(page);
        }}
      />
    </>
  );
}
