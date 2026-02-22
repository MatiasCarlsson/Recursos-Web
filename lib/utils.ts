export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function formatTextSpace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function formatTextFitstUpperCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
