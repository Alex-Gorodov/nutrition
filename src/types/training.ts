export type Training = {
  id: string;
  name: string;
  calories: number;
  time: number;
}

type DistanceTraining = Training & {
  length: number;
  speed: number;
}

export type WalkingTraining = DistanceTraining;

export type RunningTraining = DistanceTraining;

export type SwimmingTraining = DistanceTraining;
