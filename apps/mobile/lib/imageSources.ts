import { Image as ExpoImage } from "expo-image";
import type { ImageURISource } from "react-native";

export type AppImageSource = number | ImageURISource | { uri: string } | string | null | undefined;
export type AppImageSourceInput = AppImageSource | readonly AppImageSource[] | null | undefined;

function isUriObject(value: unknown): value is { uri: string } {
  return typeof value === "object" && value !== null && "uri" in value && typeof (value as { uri?: unknown }).uri === "string";
}

function sourceArrayKey(items: readonly AppImageSource[]): string {
  return items.map(getImageSourceKey).filter(Boolean).join("|");
}

export function normalizeImageSource(source: AppImageSource): number | ImageURISource | string | { uri: string } | null {
  if (!source) return null;
  if (Array.isArray(source)) {
    return normalizeImageSource(source[0]);
  }
  return source;
}

export function getImageSourceUri(source: AppImageSource): string | null {
  const normalized = normalizeImageSource(source);
  if (!normalized) return null;
  if (typeof normalized === "string") return normalized;
  if (typeof normalized === "number") return `asset:${normalized}`;
  if (isUriObject(normalized)) return normalized.uri;
  return null;
}

export function getImageSourceKey(source: AppImageSource): string | null {
  const normalized = normalizeImageSource(source);
  if (!normalized) return null;
  if (typeof normalized === "number") return `asset:${normalized}`;
  if (typeof normalized === "string") return `uri:${normalized}`;
  if (isUriObject(normalized)) return `uri:${normalized.uri}`;
  return null;
}

export function flattenImageSources(source: AppImageSourceInput): AppImageSource[] {
  if (!source) return [];
  if (Array.isArray(source)) {
    return [...source];
  }
  return [source as AppImageSource];
}

export function dedupeImageSources(sources: readonly AppImageSource[]) {
  const seen = new Set<string>();
  return sources.filter((source): source is Exclude<AppImageSource, null | undefined> => {
    const key = getImageSourceKey(source);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function preloadImageSource(source: AppImageSource) {
  const normalized = normalizeImageSource(source);
  if (!normalized) return;

  try {
    if (typeof normalized === "string" && /^https?:\/\//i.test(normalized)) {
      await ExpoImage.prefetch(normalized, { cachePolicy: "memory-disk" });
      return;
    }

    await ExpoImage.loadAsync(normalized as string | number | { uri: string });
  } catch {
    // Ignore prefetch errors. The live render path still handles fallback.
  }
}

export async function preloadImageSources(sources: readonly AppImageSource[]) {
  await Promise.all(dedupeImageSources(sources).map((source) => preloadImageSource(source)));
}
