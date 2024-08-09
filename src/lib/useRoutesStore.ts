import { create } from "zustand";

type RouteSettings = {
  routes: google.maps.DirectionsRoute[] | [];
  routeIndex: number;
  setRoutes: (routes: google.maps.DirectionsRoute[]) => void;
  setRouteIndex: (index: number) => void;
  getRoutes: () => google.maps.DirectionsRoute[];
};

const useRoutesStore = create<RouteSettings>((set, get) => ({
  routes: [],
  routeIndex: 0,
  setRoutes: (routes) => set((state) => ({ routes })),
  setRouteIndex: (index) => set((state) => ({ routeIndex: index })),
  getRoutes: () => get().routes,
}));

export default useRoutesStore;
