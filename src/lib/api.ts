// API configuration and service layer for Healix Backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
export { API_BASE_URL };

// ---------- Types ----------

export interface HealthMetricCreate {
  user_id: string;
  metric_name: string;
  value: number;
  unit?: string;
  recorded_at?: string; // ISO datetime
}

export interface HealthMetricRead {
  id: string;
  user_id: string;
  metric_name: string;
  value: number;
  unit: string;
  anatomy_category: string;
  flag: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ---------- Helper ----------

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers as Record<string, string>) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ---------- Health Metrics API ----------

/**
 * Create a new health metric record
 */
export async function createHealthMetric(data: HealthMetricCreate): Promise<HealthMetricRead> {
  return apiFetch<HealthMetricRead>("/health/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Fetch health metrics for a user, optionally filtered by metric_name
 */
export async function getHealthMetrics(
  userId: string,
  metricName?: string,
  limit = 500
): Promise<HealthMetricRead[]> {
  const params = new URLSearchParams({ user_id: userId, limit: String(limit) });
  if (metricName) params.set("metric_name", metricName);
  return apiFetch<HealthMetricRead[]>(`/health/?${params.toString()}`);
}

/**
 * Delete a health metric record
 */
export async function deleteHealthMetric(metricId: string): Promise<void> {
  return apiFetch<void>(`/health/${metricId}`, { method: "DELETE" });
}

// ---------- Trends API ----------

export interface BiomarkerDataPoint {
  date: string;
  value: number;
  unit: string | null;
  flag: string | null;
}

export interface BiomarkerTrend {
  name: string;
  data_points: BiomarkerDataPoint[];
  ref_min: number | null;
  ref_max: number | null;
  unit: string | null;
}

export async function getBiomarkerNames(userId: string): Promise<string[]> {
  const params = new URLSearchParams({ patient_id: userId });
  return apiFetch<string[]>(`/trends/names?${params.toString()}`);
}

export async function getBiomarkerTrends(userId: string, name: string): Promise<BiomarkerTrend> {
  const params = new URLSearchParams({ patient_id: userId, name });
  return apiFetch<BiomarkerTrend>(`/trends/data?${params.toString()}`);
}

// ---------- User context helpers ----------

const USER_ID_KEY = "healix_user_id";

/**
 * Get the current user ID from localStorage.
 * Returns null if not logged in.
 */
export function getCurrentUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Save user ID after login
 */
export function setCurrentUserId(id: string): void {
  localStorage.setItem(USER_ID_KEY, id);
}
