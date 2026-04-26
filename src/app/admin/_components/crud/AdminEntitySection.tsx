"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { FormFieldConfig, TableColumn } from "./types";

type Props<TItem, TForm extends Record<string, string>> = {
  title: string;
  description: string;
  submitCreateLabel: string;
  submitEditLabel: string;
  tableMinWidthClass: string;
  items: TItem[];
  getKey: (item: TItem) => number | string;
  fields: FormFieldConfig<TForm>[];
  columns: TableColumn<TItem>[];
  formState: TForm;
  setFormState: React.Dispatch<React.SetStateAction<TForm>>;
  editingId: number | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onStartEdit: (item: TItem) => void;
  onDelete: (item: TItem) => Promise<void>;
  onCancelEdit: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total?: number;
  };
  onPageChange?: (page: number) => void;
};

const actionButtonClass =
  "cursor-pointer rounded-md border border-border/60 bg-primaryColor/90 px-2 py-1 text-xs font-medium text-textPrimary transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-accent/70 hover:shadow-[0_6px_16px_rgba(124,58,237,0.2)] focus:scale-[1.03] active:scale-95";

const primaryButtonClass =
  "cursor-pointer rounded-lg border border-buttonColor/70 bg-buttonColor/90 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-buttonColor hover:bg-buttonColor hover:shadow-[0_10px_24px_rgba(191,0,255,0.35)] focus:scale-[1.02] active:scale-95";

const secondaryButtonClass =
  "cursor-pointer rounded-lg border border-border/70 bg-primaryColor/85 px-4 py-2 text-sm text-textPrimary transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-accent/70 hover:shadow-[0_10px_22px_rgba(124,58,237,0.22)] focus:scale-[1.02] active:scale-95";

type ChecklistProps<TForm extends Record<string, string>> = {
  field: FormFieldConfig<TForm>;
  value: string;
  setFormState: React.Dispatch<React.SetStateAction<TForm>>;
};

function ChecklistField<TForm extends Record<string, string>>({
  field,
  value,
  setFormState,
}: ChecklistProps<TForm>) {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedValues = useMemo(
    () =>
      value
        .split(",")
        .map((raw) => raw.trim())
        .filter(Boolean),
    [value],
  );

  const options = field.options ?? [];
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredOptions =
    normalizedSearch.length === 0
      ? options
      : options.filter(
          (option) =>
            option.label.toLowerCase().includes(normalizedSearch) ||
            option.value.toLowerCase().includes(normalizedSearch),
        );

  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-primaryColor/90 p-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filtrar opciones..."
          className="w-full rounded-md border border-border/70 bg-primaryColor px-2.5 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/80 outline-none transition-all focus:border-accent/70"
        />
        <button
          type="button"
          className="rounded-md border border-border/70 bg-primaryColor px-2 py-1.5 text-xs text-textSecondary transition hover:border-accent/60 hover:text-textPrimary"
          onClick={() => setFormState((prev) => ({ ...prev, [field.name]: "" }))}
        >
          Limpiar
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selectedValues.length > 0 ? (
          selectedValues.map((selectedValue) => {
            const selectedLabel =
              options.find((option) => option.value === selectedValue)?.label ?? selectedValue;

            return (
              <span
                key={selectedValue}
                className="rounded-full border border-buttonColor/60 bg-buttonColor/18 px-2.5 py-1 text-xs text-textPrimary"
              >
                {selectedLabel}
              </span>
            );
          })
        ) : (
          <span className="text-xs text-textSecondary">Sin selección</span>
        )}
      </div>

      {/* Render select controls (single or multiple) using the filtered options */}
      {field.type === "select" ? (
        <select
          size={6}
          value={value}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, [field.name]: event.target.value }))
          }
          className="h-36 w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary outline-none transition-all duration-200 focus:border-accent/70"
          required={field.required}
        >
          <option value="">{field.placeholder ?? "Sin selección"}</option>
          {filteredOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="h-36 space-y-1 overflow-y-auto rounded-lg border border-border/70 bg-primaryColor/90 px-2 py-2">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    const nextValues = isSelected
                      ? selectedValues.filter((value) => value !== option.value)
                      : [...selectedValues, option.value];

                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: nextValues.join(","),
                    }));
                  }}
                  className={`w-full rounded-md px-2 py-1 text-left text-sm transition-all ${isSelected ? "bg-buttonColor/22 text-textPrimary" : "text-textSecondary hover:bg-white/6 hover:text-textPrimary"}`}
                  aria-pressed={isSelected}
                >
                  {option.label}
                </button>
              );
            })
          ) : (
            <p className="px-2 py-1 text-sm text-textSecondary">Sin resultados.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminEntitySection<TItem, TForm extends Record<string, string>>({
  title,
  description,
  submitCreateLabel,
  submitEditLabel,
  tableMinWidthClass,
  items,
  getKey,
  fields,
  columns,
  formState,
  setFormState,
  editingId,
  onSubmit,
  onStartEdit,
  onDelete,
  onCancelEdit,
  pagination,
  onPageChange,
}: Props<TItem, TForm>) {
  const hasItems = items.length > 0;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-cardBackground/95 via-cardBackground to-primaryColor/90 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.32)] transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_38px_rgba(124,58,237,0.25)] sm:p-6 ">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-8 left-1/3 h-16 w-16 rounded-full bg-buttonColor/10 blur-2xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-textPrimary sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm text-textSecondary">{description}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-accent/45 bg-accent/12 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-textPrimary/90">
          {items.length} registros
        </span>
      </div>

      <form
        onSubmit={(event) => void onSubmit(event)}
        className="relative mt-5 grid gap-3 rounded-xl border border-border/35 bg-primaryColor/45 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {fields.map((field) => (
          <label key={field.name} className={`block ${field.containerClassName ?? ""}`}>
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-textSecondary">
              {field.label}
            </span>
            {field.ui === "checklist" &&
            (field.type === "select" || field.type === "multiselect") ? (
              <ChecklistField
                field={field}
                value={formState[field.name]}
                setFormState={setFormState}
              />
            ) : field.type === "select" ? (
              <select
                value={formState[field.name]}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary outline-none transition-all duration-200 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.24)]"
                required={field.required}
              >
                <option value="">{field.placeholder ?? "Selecciona"}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "multiselect" ? (
              <select
                multiple
                value={formState[field.name]
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean)}
                onChange={(event) => {
                  const values = Array.from(event.target.selectedOptions).map(
                    (option) => option.value,
                  );
                  setFormState((prev) => ({
                    ...prev,
                    [field.name]: values.join(","),
                  }));
                }}
                className="h-28 w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary outline-none transition-all duration-200 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.24)]"
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formState[field.name]}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary/80 outline-none transition-all duration-200 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.24)]"
                required={field.required}
              />
            )}
          </label>
        ))}

        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
          <button type="submit" className={primaryButtonClass}>
            {submitCreateLabel}
          </button>
        </div>
      </form>

      <div className="mt-5 overflow-x-auto rounded-xl border border-border/30 bg-primaryColor/35">
        <table className={`w-full ${tableMinWidthClass} text-left text-sm`}>
          <thead>
            <tr className="border-b border-border/45 bg-primaryColor/65 text-textSecondary">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              items.map((item) => (
                <tr
                  key={getKey(item)}
                  className="border-b border-border/30 text-textPrimary transition-colors hover:bg-white/3"
                >
                  {columns.map((column) => (
                    <td
                      key={column.header}
                      className={`px-3 py-2.5 align-top ${column.className ?? ""}`}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 align-top">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={() => {
                          onStartEdit(item);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${actionButtonClass} border-red-500/50 text-red-300 hover:border-red-400/90 hover:shadow-[0_6px_16px_rgba(239,68,68,0.18)]`}
                        onClick={() => void onDelete(item)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-8 text-center text-sm text-textSecondary"
                >
                  Aun no hay registros en esta sección.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-primaryColor/35 px-3 py-2">
          <p className="text-xs text-textSecondary">
            Pagina {pagination.currentPage} de {Math.max(1, pagination.totalPages)}
            {typeof pagination.total === "number" ? ` (${pagination.total} total)` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}
              disabled={pagination.currentPage <= 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              Anterior
            </button>
            <button
              type="button"
              className={`${primaryButtonClass} px-3 py-1.5 text-xs`}
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}

      <Modal
        title={`Editar ${title}`}
        open={editingId !== null && isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          onCancelEdit();
        }}
      >
        <form
          onSubmit={(event) => {
            void onSubmit(event);
            setIsEditModalOpen(false);
          }}
          className="grid gap-3"
        >
          {fields.map((field) => (
            <label key={field.name} className={`block ${field.containerClassName ?? ""}`}>
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-textSecondary">
                {field.label}
              </span>
              {field.ui === "checklist" &&
              (field.type === "select" || field.type === "multiselect") ? (
                <ChecklistField
                  field={field}
                  value={formState[field.name]}
                  setFormState={setFormState}
                />
              ) : field.type === "select" ? (
                <select
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary outline-none transition-all duration-200 focus:border-accent/70"
                  required={field.required}
                >
                  <option value="">{field.placeholder ?? "Selecciona"}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "multiselect" ? (
                <select
                  multiple
                  value={formState[field.name]
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean)}
                  onChange={(event) => {
                    const values = Array.from(event.target.selectedOptions).map((o) => o.value);
                    setFormState((prev) => ({ ...prev, [field.name]: values.join(",") }));
                  }}
                  className="h-28 w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary outline-none transition-all duration-200 focus:border-accent/70"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border/70 bg-primaryColor/90 px-3 py-2 text-sm text-textPrimary"
                  required={field.required}
                />
              )}
            </label>
          ))}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => {
                setIsEditModalOpen(false);
                onCancelEdit();
              }}
            >
              Cancelar
            </button>
            <button type="submit" className={primaryButtonClass}>
              {submitEditLabel}
            </button>
          </div>
        </form>
      </Modal>
    </article>
  );
}
