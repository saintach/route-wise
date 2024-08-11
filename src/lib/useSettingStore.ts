import { create } from "zustand";

type RouteSettings = {
  settings: {
    routeOptions: {
      origin: string;
      destination: string;
      travelMode: string;
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
      origin: "100 Front St, Toronto ON",
      destination: "500 College St, Toronto ON",
      travelMode: "DRIVING",
    },
  },
  setRouteOptions: (routeOptions) =>
    set((state) => ({ settings: { ...state.settings, routeOptions } })),
  getRouteOptions: () => get().settings.routeOptions,
}));

export default useSettingStore;
