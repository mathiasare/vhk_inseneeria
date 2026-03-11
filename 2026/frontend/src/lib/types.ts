export interface Team {
  id: number;
  name: string | null;
  created_at: string;
}

export interface Experiment {
  id: number;
  name: string;
  team_id: number;
  is_active: boolean;
  started_at: string | null;
  stopped_at: string | null;
  created_at: string;
}

export interface Metric {
  id: number;
  experiment_id: number;
  name: string;
  value: number;
  created_at: string;
}

export interface SensorData {
  id: number;
  team_id: number;
  experiment_id: number | null;
  acceleration_x: number;
  acceleration_y: number;
  acceleration_z: number;
  heart_rate: number;
  timestamp: string;
}
