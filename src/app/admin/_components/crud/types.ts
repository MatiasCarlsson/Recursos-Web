import { ReactNode } from "react";

export type ApiError = {
  error?: string;
};

export type Category = {
  id_categoria: number;
  nombre: string | null;
  descripcion: string | null;
  slug: string | null;
};

export type Tag = {
  id_etiqueta: number;
  nombre: string | null;
  descripcion: string | null;
  slug: string | null;
};

export type PriceModel = {
  id_modelo_precio: number;
  nombre: string | null;
};

export type SuggestionStatus = {
  id_estado_sugerencia: number;
  nombre: string | null;
};

export type Resource = {
  id_recurso: number;
  nombre: string | null;
  descripcion: string | null;
  url: string | null;
  destacado: boolean;
  id_categoria: number | null;
  id_modelo_precio: number | null;
  recurso_etiqueta?: Array<{
    id_etiqueta: number;
    etiqueta?: {
      nombre: string | null;
    } | null;
  }>;
};

export type Suggestion = {
  id_sugerencia: number;
  titulo: string | null;
  descripcion: string | null;
  url: string | null;
  id_categoria: number | null;
  id_estado_sugerencia: number | null;
  categoria_sugerida: string | null;
  email_contacto: string | null;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type FormFieldConfig<TForm extends Record<string, string>> = {
  name: keyof TForm & string;
  label: string;
  type: "text" | "url" | "number" | "select" | "multiselect";
  ui?: "default" | "checklist";
  containerClassName?: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
};

export type TableColumn<TItem> = {
  header: string;
  className?: string;
  render: (item: TItem) => ReactNode;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination?: {
    totalPages?: number;
    currentPage?: number;
    total?: number;
    limit?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};
