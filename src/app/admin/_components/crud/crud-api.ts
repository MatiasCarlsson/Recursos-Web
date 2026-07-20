import type { ApiError, PaginatedResponse } from "./types";

export const API_ENDPOINTS = {
  categories: "/api/admin/categories",
  tags: "/api/admin/tags",
  priceModels: "/api/admin/price-models",
  suggestionStatuses: "/api/suggestion-statuses",
  resources: "/api/resources",
  adminResources: "/api/admin/resources",
  suggestions: "/api/admin/suggestions",
} as const;

export const DEFAULT_QUERY = {
  categories: "?limit=50&page=1&includeResources=false",
  tags: "?limit=50&page=1",
  priceModels: "",
  suggestionStatuses: "",
  resources: "?limit=50&page=1",
  suggestions: "?limit=50&page=1",
} as const;

export const ADMIN_EVENTS = {
  categoriesUpdated: "admin:categories-updated",
  tagsUpdated: "admin:tags-updated",
  priceModelsUpdated: "admin:price-models-updated",
} as const;

export async function parseError(response: Response) {
  try {
    const data = (await response.json()) as ApiError;
    return data.error ?? `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}

export async function fetchPageData<T>(url: string) {
  const payload = await fetchPaginatedData<T>(url);
  return payload.data;
}

export async function fetchPaginatedData<T>(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const payload = (await response.json()) as PaginatedResponse<T>;
  return payload;
}

function withPage(url: string, page: number) {
  const absolute = new URL(url, window.location.origin);
  absolute.searchParams.set("page", String(page));
  return `${absolute.pathname}${absolute.search}`;
}

export async function fetchAllPageData<T>(url: string) {
  const firstResponse = await fetch(url);
  if (!firstResponse.ok) {
    throw new Error(await parseError(firstResponse));
  }

  const firstPayload = (await firstResponse.json()) as PaginatedResponse<T>;
  const totalPages = Math.max(1, firstPayload.pagination?.totalPages ?? 1);

  if (totalPages === 1) {
    return firstPayload.data;
  }

  const requests: Promise<Response>[] = [];
  for (let page = 2; page <= totalPages; page += 1) {
    requests.push(fetch(withPage(url, page)));
  }

  const responses = await Promise.all(requests);
  for (const response of responses) {
    if (!response.ok) {
      throw new Error(await parseError(response));
    }
  }

  const payloads = (await Promise.all(responses.map((response) => response.json()))) as Array<
    PaginatedResponse<T>
  >;

  return [...firstPayload.data, ...payloads.flatMap((payload) => payload.data)];
}

export async function performMutation(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object,
) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}

export function buildPayload<T extends Record<string, string>>(form: T) {
  const payload: Record<string, string | number> = {};

  for (const [key, rawValue] of Object.entries(form)) {
    const value = rawValue.trim();
    if (!value) continue;

    if (key.endsWith("Id")) {
      payload[key] = Number(value);
    } else {
      payload[key] = value;
    }
  }

  return payload;
}

export function toIdArray(csv: string) {
  return csv
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
}

export function normalizeUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return {
      href: url.toString(),
      label: url.hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
}

export function emitAdminEvent(eventName: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName));
  }
}
