import { create } from "zustand";

type EmissionStore = {
  emissions: { [routeId: string]: any };
  addEmission: (emissionData: any, routeId: string) => void;
  setEmissions: () => void;
  getEmissions: () => EmissionStore["emissions"];
};

const useEmissionsStore = create<EmissionStore>((set, get) => ({
  emissions: {},
  addEmission: (emissionData: any, routeId: string) =>
    set((state) => ({
      emissions: { ...state.emissions, [routeId]: emissionData },
    })),
  setEmissions: () => {
    // implementation for setEmissions
  },
  getEmissions: () => get().emissions,
}));

export default useEmissionsStore;
