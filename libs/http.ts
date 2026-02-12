export interface HttpOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function http<T>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  let finalUrl = url;


  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });
    finalUrl += `?${query.toString()}`;
  }

  const response = await fetch(finalUrl, {
    headers: {
      Accept: "application/json",
      ...headers,
    },
    credentials: "include",
    ...rest,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `HTTP ${response.status} - ${response.statusText}\n${errorBody}`
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
