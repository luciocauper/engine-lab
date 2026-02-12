import { buildUrl } from "./apiClient";

export function getImageUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return buildUrl(`/storage/${image}`);
}
