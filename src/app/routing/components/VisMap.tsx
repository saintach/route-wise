import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import useSettingStore from "@/lib/useSettingStore";
import useRoutesStore from "@/lib/useRoutesStore";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const VisMap = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      defaultCenter={{ lat: 43.65, lng: -79.38 }}
      defaultZoom={9}
      gestureHandling={"greedy"}
      fullscreenControl={false}
      style={{ width: "100%", height: "600px" }}
    >
      <Directions />
    </Map>
  </APIProvider>
);

function Directions() {
  const map = useMap();
  const { settings } = useSettingStore();
  const { routes, setRoutes, routeIndex, setRouteIndex } = useRoutesStore();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  console.log("routes", routes);

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: settings.routeOptions.origin || "100 Front St, Toronto ON",
        destination:
          settings.routeOptions.destination || "500 College St, Toronto ON",
        travelMode:
          (settings.routeOptions.travelMode as google.maps.TravelMode) ||
          google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
    return () => directionsRenderer.setMap(null);
  }, [
    directionsService,
    directionsRenderer,
    settings.routeOptions.origin,
    settings.routeOptions.destination,
    settings.routeOptions.travelMode,
    setRoutes,
  ]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="directions" style={{ border: "solid 2px red" }}>
      <h1 className="warning">DEBUG CONSOLE</h1>
      <h2>Selected route: {selected.summary}</h2>
      <p>
        <b>{leg.start_address.split(",")[0]}</b> to{" "}
        <b>{leg.end_address.split(",")[0]}</b>
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>
      <br />
      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={`${route.summary}${index}`}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VisMap;
