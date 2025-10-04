import type { Bus, CreateBusRequest, SignInRequest, SignUpRequest, AuthResponse } from "../type";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

function authHeaders(): HeadersInit {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function normalizeBus(raw: any): Bus {
  return { ...raw, status: raw.status === 1 ? "active" : "inactive" };
}

export const api = {
  // ===== AUTH =====
  async signUp(body: SignUpRequest) {
    const res = await fetch(`${BASE}/authentication/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return json<{ id?: number; token?: string }>(res);
  },

  async signIn(body: SignInRequest) {
    const res = await fetch(`${BASE}/authentication/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return json<AuthResponse>(res);
  },

  // ===== BRANDS (combo) =====
  async getBrands() {
    const res = await fetch(`${BASE}/brands`, { headers: { ...authHeaders() } });
    return json<Array<{ id: number; name: string }>>(res);
  },

  // ===== BUSES =====
  async getBuses() {
    const res = await fetch(`${BASE}/bus`, { headers: { ...authHeaders() } });
    const data = await json<any[]>(res);
    return data.map(normalizeBus);
  },

  async getBus(id: number) {
    const res = await fetch(`${BASE}/bus/${id}`, { headers: { ...authHeaders() } });
    const data = await json<any>(res);
    return normalizeBus(data);
  },

  async createBus(body: CreateBusRequest) {
    const res = await fetch(`${BASE}/bus`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body)
    });
    const data = await json<any>(res);
    return normalizeBus(data);
  }
};
