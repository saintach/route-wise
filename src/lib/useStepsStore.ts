import { create } from "zustand";

export type StepStats = {
  id: string;
  route_id: string;
  distance: number;
  duration: number;
  speed: number;
  elevation_change: number;
  road_grade_percent: number;
};

type Steps = {
  steps: StepStats[];
  addStep: (step: StepStats) => void;
  setSteps: (steps: Steps["steps"]) => void;
  getStep: (step_id: string) => StepStats;
  getAllSteps: () => StepStats[];
};

const useStepsStore = create<Steps>((set, get) => ({
  steps: [],
  addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),
  setSteps: (steps) => set((state) => ({ steps })),
  getStep: (step_id) =>
    get().steps.find((step) => step.id === step_id) as StepStats,
  getAllSteps: () => get().steps,
}));

export default useStepsStore;
