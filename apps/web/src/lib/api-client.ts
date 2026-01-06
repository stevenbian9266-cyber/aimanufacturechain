export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok || json?.ok === false) {
      const msg = json?.error?.message || `Request failed: ${res.status}`;
      throw new Error(msg);
    }
    return json.data as T;
  }
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}
