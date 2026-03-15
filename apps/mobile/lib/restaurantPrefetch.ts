import { getDemoProductById, getDemoProviderById } from "./demoCatalog";
import { fetchProductById, fetchProducerById } from "./api";
import { AppImageSource, preloadImageSources } from "./imageSources";
import { queryClient } from "./queryClient";

const visibleProductWarmCount = 6;

function getProductMediaSources(product: {
  image_source?: AppImageSource | null;
  image_fallback_source?: AppImageSource | null;
  image_url?: string | null;
}) {
  return [product.image_source ?? product.image_url, product.image_fallback_source];
}

function getProviderMediaSources(provider: {
  heroImageSource?: AppImageSource | null;
  heroImage?: string | null;
  products?: Array<{
    image_source?: AppImageSource | null;
    image_fallback_source?: AppImageSource | null;
    image_url?: string | null;
  }>;
}) {
  return [
    provider.heroImageSource ?? provider.heroImage,
    ...(provider.products ?? []).slice(0, visibleProductWarmCount).flatMap((product) => getProductMediaSources(product))
  ];
}

export function warmProviderRoute(providerId: string) {
  const demo = getDemoProviderById(providerId);
  if (demo) {
    void preloadImageSources(getProviderMediaSources(demo));
  }

  void queryClient
    .ensureQueryData({
      queryKey: ["producer", providerId],
      queryFn: () => fetchProducerById(providerId)
    })
    .then((provider) => preloadImageSources(getProviderMediaSources(provider)))
    .catch(() => undefined);
}

export function warmProductRoute(productId: string) {
  const demo = getDemoProductById(productId);
  if (demo) {
    void preloadImageSources(getProductMediaSources(demo));
  }

  void queryClient
    .ensureQueryData({
      queryKey: ["product", productId],
      queryFn: () => fetchProductById(productId)
    })
    .then((product) => preloadImageSources(getProductMediaSources(product)))
    .catch(() => undefined);
}
