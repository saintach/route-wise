import { StepStats } from "./useStepsStore";

export type RouteEData = {
  segment_ids: string[];
  lengths_miles: number[];
  speeds_mph: number[];
  grades_percent: number[];
  model: string;
};

const mToMiles = (m: number): number => {
  return m * 0.000621371;
};

const mpsToMph = (mps: number): number => {
  return mps * 2.23694;
};

export const ggeToCo2 = (gge: number): string => {
  return (gge * 8.89).toFixed(2); // returns in kg
};

export const processStepsToRouteEData = (
  steps: StepStats[],
  selectedModel: string,
  stepsUnit: "metrics" | "imperial"
): RouteEData => {
  let routeEData: RouteEData = {
    segment_ids: [],
    lengths_miles: [],
    speeds_mph: [],
    grades_percent: [],
    model: selectedModel,
  };
  steps.map((step) => {
    routeEData.segment_ids.push(step.id);
    routeEData.lengths_miles.push(
      stepsUnit === "metrics" ? mToMiles(step.distance) : step.distance
    );
    routeEData.speeds_mph.push(
      stepsUnit === "metrics" ? mpsToMph(step.speed) : step.speed
    );
    routeEData.grades_percent.push(step.road_grade_percent);
  });
  return routeEData;
};
