import { TrainingType } from "../const";

export type TrainingSession = {
  activity: TrainingType;
  date: Date;
  duration: number;
  caloriesBurned: number;
  id: string;
};
