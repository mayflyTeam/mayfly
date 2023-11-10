export interface Spawn {
  cluster: string;
  max_idle_secs: number;
  metadata: {};
  executable: {
    image: string;
    env: {};
  };
}

export interface Squish {
  cluster_id: string;
  backend_id: string;
}

export interface ScheduledResponse {
  Scheduled: {
    drone: string;
    backend_id: string;
    spawned: boolean;
  };
}

