import { create } from "zustand";

type RouteSettings = {
  settings: {
    routeOptions: {
      origin: string;
      destination: string;
      travelMode: string;
      vehicleType?: string;
    };
  };
  setRouteOptions: (
    routeOptions: RouteSettings["settings"]["routeOptions"]
  ) => void;
  getRouteOptions: () => RouteSettings["settings"]["routeOptions"];
};

const useSettingStore = create<RouteSettings>((set, get) => ({
  settings: {
    routeOptions: {
      origin: "Manhattan Beach, California 90266, USA",
      destination:
        "Griffith Observatory, 2800 E Observatory Rd, Los Angeles, CA 90027",
      travelMode: "DRIVING",
      vehicleType: "gasoline",
    },
  },
  setRouteOptions: (routeOptions) =>
    set((state) => ({ settings: { ...state.settings, routeOptions } })),
  getRouteOptions: () => get().settings.routeOptions,
}));

export default useSettingStore;
