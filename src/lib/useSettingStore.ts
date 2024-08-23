import { create } from "zustand";

type RouteSettings = {
  settings: {
    user: {
      username: string;
      password: string;
      isLoggedIn: boolean;
      vehicleType?: string;
    };
    routeOptions: {
      origin: string;
      destination: string;
      travelMode: string;
    };
  };
  setUserVehicleType: (vehicleType: string) => void;
  setLogin: (isLoggedIn: boolean) => void;
  setLogout: () => void;
  setUser: (user: RouteSettings["settings"]["user"]) => void;
  setRouteOptions: (
    routeOptions: RouteSettings["settings"]["routeOptions"]
  ) => void;
  getRouteOptions: () => RouteSettings["settings"]["routeOptions"];
};

const useSettingStore = create<RouteSettings>((set, get) => ({
  settings: {
    user: {
      username: "",
      password: "",
      isLoggedIn: false,
      vehicleType: "gasoline",
    },
    routeOptions: {
      origin: "Long Beach",
      destination: "Griffith Observatory",
      travelMode: "DRIVING",
    },
  },
  setUserVehicleType: (vehicleType) =>
    set((state) => ({
      settings: {
        ...state.settings,
        user: { ...state.settings.user, vehicleType },
      },
    })),
  setLogin: (isLoggedIn) =>
    set((state) => ({
      settings: {
        ...state.settings,
        user: { ...state.settings.user, isLoggedIn },
      },
    })),
  setLogout: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        user: { ...state.settings.user, isLoggedIn: false },
      },
    })),
  setUser: (user) =>
    set((state) => ({ settings: { ...state.settings, user } })),
  setRouteOptions: (routeOptions) =>
    set((state) => ({ settings: { ...state.settings, routeOptions } })),
  getRouteOptions: () => get().settings.routeOptions,
}));

export default useSettingStore;
