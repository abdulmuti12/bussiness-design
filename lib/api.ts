/**
 * Central API client for the admin dashboard.
 *
 * Single source of truth for the backend base URL and every fetch the admin
 * UI performs. This adapts the frontend to the Go backend's new behaviour:
 *   - 429 Rate Limit Exceeded → honour Retry-After, then re-try once
 *   - Cache-Control: s-max-age / max-age on master-data endpoints
 *   - no more hard-coded :8000 host — everything derives from NEXT_PUBLIC_API_URL
 */

const RAW = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api").replace(/\/$/, "")

/** Base API URL, e.g. "http://127.0.0.1:8080/api" */
export const API_BASE = RAW

/** Same host with /api stripped, e.g. "http://127.0.0.1:8080" */
export const API_HOST = RAW.replace(/\/api$/, "")

/** Storage asset root, e.g. "http://127.0.0.1:8080/storage/" */
export const STORAGE_BASE = (process.env.NEXT_PUBLIC_STORAGE_URL || `${API_HOST}/storage/`)

/** Resolve a relative asset path to an absolute URL. */
export function assetUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${STORAGE_BASE.replace(/\/$/, "")}/${path}`
}

function token(): string | null {
  if (typeof document === "undefined") return null
  return localStorage.getItem("token")
}

/**
 * Thin wrapper around fetch for the admin API.
 * - appends Authorization when a token exists
 * - parses JSON on 2xx/4xx and throws a typed ApiError on network failure
 * - on 429, waits Retry-After and re-tries once
 */
export async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers || {})
  const t = token()
  if (t && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${t}`)
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json")

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`
  const doFetch = () => fetch(url, { ...init, headers })

  let res = await doFetch()
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After")
    const delay = retryAfter ? Number(retryAfter) * 1000 : 1000
    await new Promise(r => setTimeout(r, delay))
    res = await doFetch()
  }

  let data: unknown = null
  const text = await res.text()
  try { data = text ? JSON.parse(text) : null } catch { /* non-JSON body */ }

  if (!res.ok) {
    const detail = (data as { message?: string; error?: string } | null)?.message ?? (data as { error?: string } | null)?.error ?? res.statusText
    throw new ApiError(res.status, detail, data as Record<string, unknown> | null)
  }
  return data as T
}

/** Thrown by `api()` on any non-2xx response. */
export class ApiError extends Error {
  status: number
  data: Record<string, unknown> | null
  constructor(status: number, message: string, data: Record<string, unknown> | null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}
