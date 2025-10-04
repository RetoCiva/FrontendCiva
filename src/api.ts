import { Bus, CreateBusRequest} from "../type";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

function authHeaders(): HeadersInit {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function normalizeBus(raw: any): Bus {
  return {
    ...raw,
    status: raw.status === 1 ? "active" : "inactive",
  };
}

export const api = {
  async getBuses() {
    const res = await fetch(`${BASE}/bus`, { headers: { ...authHeaders() } });
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeBus) : [];
  },

  async getBus(id: number) {
    const res = await fetch(`${BASE}/bus/${id}`, { headers: { ...authHeaders() } });
    const data = await res.json();
    return normalizeBus(data);
  },

  async createBus(body: CreateBusRequest) {
    const res = await fetch(`${BASE}/bus`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return normalizeBus(data);
  },
};
