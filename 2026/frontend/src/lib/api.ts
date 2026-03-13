import type { Team, Experiment, Metric, SensorData } from "./types";

const API_BASE = import.meta.env.VITE_BACKEND_API_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(detail);
  }
  return res.json();
}

// Teams
export const getTeams = () => request<Team[]>("/teams");

export const registerTeam = (teamId: number, name: string) =>
  request<Team>(`/teams/${teamId}/register`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

// Experiments
export const getExperiments = (teamId: number) =>
  request<Experiment[]>(`/teams/${teamId}/experiments`);

export const createExperiment = (teamId: number, name: string) =>
  request<Experiment>(`/teams/${teamId}/experiments`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const startExperiment = (id: number) =>
  request<Experiment>(`/experiments/${id}/start`, { method: "POST" });

export const stopExperiment = (id: number) =>
  request<Experiment>(`/experiments/${id}/stop`, { method: "POST" });

// Metrics
export const getMetrics = (expId: number) =>
  request<Metric[]>(`/experiments/${expId}/metrics`);

export const addMetric = (expId: number, name: string, value: number) =>
  request<Metric>(`/experiments/${expId}/metrics`, {
    method: "POST",
    body: JSON.stringify({ name, value }),
  });

// Sensor data
export const getSensorData = (expId: number) =>
  request<SensorData[]>(`/experiments/${expId}/sensor-data`);

export const getUnassignedSensorData = (teamId: number) =>
  request<SensorData[]>(`/teams/${teamId}/sensor-data/unassigned`);

// Export URLs (direct download links, bypass fetch wrapper)
export const exportSensorDataUrl = (expId: number) =>
  `${API_BASE}/experiments/${expId}/export/sensor-data.csv`;

export const exportMetricsUrl = (expId: number) =>
  `${API_BASE}/experiments/${expId}/export/metrics.csv`;
