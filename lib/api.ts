// Empty string = relative paths — Next.js rewrites proxy /api/* to Railway (avoids CORS in dev + prod)
const API_URL = ""

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("4u_session")
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    console.log(`[4U] ${res.status} error from ${path}:`, JSON.stringify(error))
    throw new Error(error.message || error.error || `Request failed: ${res.status}`)
  }

  return res.json()
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const auth = {
  getNonce: async (walletAddress: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await request(`/api/auth/nonce/${walletAddress}`)
    console.log("[4U] nonce response:", raw)
    return raw as { nonce: string }
  },

  login: async (walletAddress: string, signature: string, message: string, nonce?: string) => {
    const body = { walletAddress, signature, message, nonce }
    console.log("[4U] POST /api/auth/wallet body:", JSON.stringify(body))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await request("/api/auth/wallet", {
      method: "POST",
      body: JSON.stringify(body),
    })
    console.log("[4U] login response keys:", Object.keys(raw))
    console.log("[4U] login response:", JSON.stringify(raw).slice(0, 300))
    // Normalize: backend may return token under different key names
    const token = raw.token ?? raw.jwt ?? raw.accessToken ?? raw.access_token ?? raw.sessionToken
    const user = raw.user ?? raw.profile ?? raw.account
    return { token, user } as { token: string; user: User }
  },

  me: () => request<User>("/api/auth/me"),

  updateProfile: (data: Partial<User>) =>
    request<User>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  logout: () =>
    request("/api/auth/logout", { method: "POST" }),
}

// ─── Requests ────────────────────────────────────────────────────────────────

export const requests = {
  list: async (params?: { category?: string; status?: string; budget?: string; recency?: string }): Promise<{ requests: BuildRequest[]; total: number }> => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v && v !== "All" && v !== "Any"))
    ).toString()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await request(`/api/requests${query ? `?${query}` : ""}`)
    console.log("[4U] /api/requests raw response:", JSON.stringify(raw)?.slice(0, 500))
    // Normalize: backend may return [] directly, { requests: [], total: N }, or { data: [], total: N }
    if (Array.isArray(raw)) {
      return { requests: raw, total: raw.length }
    }
    const arr = raw.requests ?? raw.data ?? []
    return { requests: Array.isArray(arr) ? arr : [], total: raw.total ?? arr.length }
  },

  get: async (id: string): Promise<BuildRequest> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await request(`/api/requests/${id}`)
    console.log("[4U] request detail keys:", Object.keys(raw))
    console.log("[4U] request detail pitches field:", raw.pitches, typeof raw.pitches)
    return raw
  },

  create: (data: CreateRequestPayload) =>
    request<BuildRequest>("/api/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  upvote: (id: string) =>
    request(`/api/requests/${id}/upvote`, { method: "POST" }),
}

// ─── Pitches ─────────────────────────────────────────────────────────────────

export const pitches = {
  list: async (requestId: string): Promise<{ pitches: Pitch[] }> => {
    // Try multiple endpoint patterns since /api/requests/:id/pitches returns 404
    const endpoints = [
      `/api/requests/${requestId}/pitches`,
      `/api/pitches?request_id=${requestId}`,   // backend uses snake_case (author_id → request_id)
      `/api/pitches?requestId=${requestId}`,
      `/api/pitches/${requestId}`,
      `/api/bids?request_id=${requestId}`,
      `/api/bids?requestId=${requestId}`,
    ]
    for (const endpoint of endpoints) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: any = await request(endpoint)
        const arr = Array.isArray(raw) ? raw : (raw?.pitches ?? raw?.data ?? raw?.bids ?? [])
        console.log(`[4U] pitches found at ${endpoint}:`, arr.length)
        return { pitches: Array.isArray(arr) ? arr : [] }
      } catch {
        // try next
      }
    }
    return { pitches: [] }
  },

  create: (requestId: string, data: { price: number; deliveryTime: string; message: string }) =>
    request<Pitch>(`/api/requests/${requestId}/pitches`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// ─── Hire ─────────────────────────────────────────────────────────────────────

export const hire = {
  hire: (requestId: string, pitchId: string, txSignature: string) =>
    request("/api/hire/hire", {
      method: "POST",
      body: JSON.stringify({ requestId, pitchId, txSignature }),
    }),
}

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = {
  list: () => request<{ notifications: Notification[] }>("/api/notifications"),
  markRead: (id: string) =>
    request(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () =>
    request("/api/notifications/read-all", { method: "PATCH" }),
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboard = {
  myRequests: () =>
    request<{ requests: BuildRequest[] }>("/api/dashboard/requests"),
  myPitches: () =>
    request<{ pitches: DashboardPitch[] }>("/api/dashboard/pitches"),
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id: string
  walletAddress: string
  username?: string
  bio?: string
  avatar?: string
}

export interface BuildRequest {
  id: string
  title: string
  description: string
  // Backend uses "categories" not "tags"
  categories?: string[]
  tags?: string[]
  budget: number
  currency?: string
  // Backend uses "timeline" not "deadline"
  timeline?: string
  deadline?: string
  status: string
  upvotes?: number
  // Backend uses "pitches" as a count number
  pitches?: number
  pitchCount?: number
  createdAt: string
  // Backend uses "author" not "poster"
  author?: string
  author_wallet?: string
  poster?: string
  posterWallet?: string
  attachment?: string | null
}

export interface Pitch {
  id: string
  agentName: string
  agentType: string
  rating: number
  price: number
  currency: string
  deliveryTime: string
  message: string
  createdAt: string
  agentWallet?: string
}

export interface CreateRequestPayload {
  title: string
  description: string
  tags: string[]
  budget: number
  deadline: string
}

export interface DashboardPitch {
  id: string
  requestId: string
  requestTitle: string
  price: number
  currency: string
  status: "Pending" | "Hired" | "Rejected"
  createdAt: string
}

export interface Notification {
  id: string
  type: "pitch" | "hired" | "delivered"
  message: string
  read: boolean
  createdAt: string
  requestId?: string
}
