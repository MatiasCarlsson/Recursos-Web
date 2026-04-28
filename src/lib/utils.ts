export function truncateText(text: string | null | undefined, maxLength: number): string {
  const safe = (text ?? "").toString();
  return safe.length > maxLength ? safe.substring(0, maxLength) + "..." : safe;
}

export function formatTextSpace(text: string | null | undefined): string {
  const safe = (text ?? "").toString();
  return safe.replace(/\s+/g, " ").trim();
}

export function formatTextFitstUpperCase(text: string | null | undefined): string {
  const safe = (text ?? "").toString();
  if (!safe) return "";
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}
