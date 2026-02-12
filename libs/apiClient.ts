const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE não definida");
}

export function buildUrl(path: string): string {
  return `${API_BASE}${path}`;
}
