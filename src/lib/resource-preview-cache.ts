import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type CacheEntry = {
  imageUrl: string;
  expiresAt: number;
};

type PreviewInput = {
  resourceId: number;
  rawUrl: string | null;
  title: string;
  forceRefresh?: boolean;
};

const memoryCache = new Map<string, CacheEntry>();
const STORAGE_FOLDER = "resources";
const LOCAL_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 2; // 2 días 172,800,000 ms
const MONTH_MS = 1000 * 60 * 60 * 24 * 30;
const CAPTURE_TIMEOUT_MS = 1000 * 60; // 60s: tiempo máx. que espera a que cargue la web
const CAPTURE_WAIT_UNTIL = "networkidle2"; // espera a que la red se estabilice

function normalizeResourceUrl(rawUrl: string | null) {
  if (!rawUrl) return null;
  const value = rawUrl.trim();
  if (!value) return null;

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

function buildFallbackImage(title: string) {
  const encodedTitle = encodeURIComponent(title || "Recurso");
  return `https://dummyimage.com/1200x675/0f172a/e2e8f0.png&text=${encodedTitle}`;
}

function buildMicrolinkApiUrl(url: string) {
  const params = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    "screenshot.type": "webp",
    "screenshot.width": "1200",
    "screenshot.height": "675",
    "screenshot.fullPage": "false",
    "screenshot.timeout": String(CAPTURE_TIMEOUT_MS),
    waitUntil: CAPTURE_WAIT_UNTIL,
  });

  return `https://api.microlink.io/?${params.toString()}`;
}

function buildThumIoScreenshotUrl(url: string) {
  return `https://image.thum.io/get/width/1200/crop/675/noanimate/timeout/60/${encodeURI(url)}`;
}

function getBucketName() {
  return (
    process.env.SUPABASE_BUCKET ||
    process.env.SUPABASE_RESOURCE_PREVIEWS_BUCKET ||
    "recursos-screenshot"
  );
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son obligatorias para previews");
  }

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: { persistSession: false },
  });
}

function buildStoragePath(resourceId: number, normalizedUrl: string) {
  const hash = createHash("sha1").update(normalizedUrl).digest("hex").slice(0, 12);
  return `${STORAGE_FOLDER}/${resourceId}-${hash}.webp`;
}

function buildMemoryKey(resourceId: number, normalizedUrl: string) {
  return `${resourceId}:${normalizedUrl}`;
}

async function getMicrolinkScreenshotUrl(normalizedUrl: string) {
  const headers: HeadersInit = {};
  if (process.env.MICROLINK_API_KEY) {
    headers["x-api-key"] = process.env.MICROLINK_API_KEY;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CAPTURE_TIMEOUT_MS + 5000);
  let response: Response;
  try {
    response = await fetch(buildMicrolinkApiUrl(normalizedUrl), {
      method: "GET",
      headers,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Microlink error ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: {
      screenshot?: {
        url?: string;
      };
    };
  };

  const screenshotUrl = payload.data?.screenshot?.url;
  if (!screenshotUrl) {
    throw new Error("Microlink response has no screenshot URL");
  }

  return screenshotUrl;
}

async function getBestScreenshotUrl(normalizedUrl: string) {
  try {
    return await getMicrolinkScreenshotUrl(normalizedUrl);
  } catch {
    return buildThumIoScreenshotUrl(normalizedUrl);
  }
}

async function uploadPreviewToSupabase(path: string, screenshotUrl: string) {
  const imageResponse = await fetch(screenshotUrl, { cache: "no-store" });
  if (!imageResponse.ok) {
    throw new Error(`Screenshot download error ${imageResponse.status}`);
  }

  const rawBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const { default: sharp } = await import("sharp");
  const webpBuffer = await sharp(rawBuffer)
    .webp({ quality: 80, effort: 4 })
    .toBuffer();

  const supabase = getSupabaseClient();
  const bucket = getBucketName();

  const uploadResult = await supabase.storage.from(bucket).upload(path, webpBuffer, {
    contentType: "image/webp",
    upsert: true,
    cacheControl: "2592000", // 30 dias
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const publicResult = supabase.storage.from(bucket).getPublicUrl(path);
  return publicResult.data.publicUrl;
}

async function getStorageObjectInfo(path: string) {
  const supabase = getSupabaseClient();
  const bucket = getBucketName();

  const folderPath = path.split("/")[0];
  const fileName = path.split("/")[1] || "";

  const listResult = await supabase.storage.from(bucket).list(folderPath, {
    search: fileName,
    limit: 1,
    offset: 0,
  });

  if (listResult.error) {
    throw new Error(listResult.error.message);
  }

  const objectInfo = listResult.data.find((item) => item.name === fileName);
  if (!objectInfo) return null;

  const publicResult = supabase.storage.from(bucket).getPublicUrl(path);
  return {
    updatedAt: objectInfo.updated_at,
    publicUrl: publicResult.data.publicUrl,
  };
}

function isMonthlyExpired(updatedAt: string | null | undefined) {
  if (!updatedAt) return true;
  const updatedMs = Date.parse(updatedAt);
  if (Number.isNaN(updatedMs)) return true;
  return Date.now() - updatedMs > MONTH_MS;
}

export async function resolveResourcePreviewImage({
  resourceId,
  rawUrl,
  title,
  forceRefresh = false,
}: PreviewInput) {
  const normalizedUrl = normalizeResourceUrl(rawUrl);
  if (!normalizedUrl) {
    return {
      resourceUrl: "#",
      imageUrl: buildFallbackImage(title),
    };
  }

  const memoryKey = buildMemoryKey(resourceId, normalizedUrl);
  const now = Date.now();
  const cached = memoryCache.get(memoryKey);
  if (!forceRefresh && cached && cached.expiresAt > now) {
    return {
      resourceUrl: normalizedUrl,
      imageUrl: cached.imageUrl,
    };
  }

  const storagePath = buildStoragePath(resourceId, normalizedUrl);

  try {
    const existing = await getStorageObjectInfo(storagePath);

    if (existing && !forceRefresh && !isMonthlyExpired(existing.updatedAt)) {
      memoryCache.set(memoryKey, {
        imageUrl: existing.publicUrl,
        expiresAt: now + LOCAL_CACHE_TTL_MS,
      });

      return {
        resourceUrl: normalizedUrl,
        imageUrl: existing.publicUrl,
      };
    }

    const screenshotUrl = await getBestScreenshotUrl(normalizedUrl);
    const publicUrl = await uploadPreviewToSupabase(storagePath, screenshotUrl);

    memoryCache.set(memoryKey, {
      imageUrl: publicUrl,
      expiresAt: now + LOCAL_CACHE_TTL_MS,
    });

    return {
      resourceUrl: normalizedUrl,
      imageUrl: publicUrl,
    };
  } catch {
    if (cached) {
      return {
        resourceUrl: normalizedUrl,
        imageUrl: cached.imageUrl,
      };
    }

    return {
      resourceUrl: normalizedUrl,
      imageUrl: buildFallbackImage(title),
    };
  }
}
