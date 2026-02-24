import { Resource } from "@/types/resource";

export async function loadResources(): Promise<Resource[]> {
  const res = await fetch("https://jsonplaceholder.org/posts", {
    next: { revalidate: 3600 }, // Cache por 1 hora
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resources");
  }

  return res.json();
}
