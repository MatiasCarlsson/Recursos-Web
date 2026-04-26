import { createHash } from "crypto";
import { AppError } from "@/lib/errors";

type RateWindowEntry = {
  count: number;
  expiresAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const memoryStore = new Map<string, RateWindowEntry>();

function hashKey(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

function consumeSlot(key: string) {
  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.expiresAt <= now) {
    memoryStore.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });
    return;
  }

  if (current.count >= MAX_PER_WINDOW) {
    throw new AppError(
      "Demasiadas solicitudes. Intenta nuevamente en unos minutos.",
      429,
      "RATE_LIMITED",
    );
  }

  memoryStore.set(key, {
    ...current,
    count: current.count + 1,
  });
}

export function enforceSuggestionRateLimit(params: { ip?: string | null; email?: string | null }) {
  if (params.ip) {
    consumeSlot(`ip:${hashKey(params.ip.trim())}`);
  }

  if (params.email) {
    consumeSlot(`email:${hashKey(params.email.trim().toLowerCase())}`);
  }
}
