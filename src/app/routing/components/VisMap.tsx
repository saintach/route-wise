import React, { useEffect, useState } from "react";
import groupBy from "lodash.groupby";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import useSettingStore from "@/lib/useSettingStore";
import useRoutesStore from "@/lib/useRoutesStore";
import useStepsStore, { StepStats } from "@/lib/useStepsStore";
import { processStepsToRouteEData, RouteEData } from "@/lib/routeE";
import useEmissionsStore from "@/lib/useEmissionsStore";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const VisMap = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      defaultCenter={{ lat: 43.65, lng: -79.38 }}
      defaultZoom={9}
      gestureHandling={"greedy"}
      fullscreenControl={false}
      style={{ width: "100%", height: "900px" }}
    >
      <Directions />
    </Map>
  </APIProvider>
);

function Directions() {
  const map = useMap();
  const { settings } = useSettingStore();
  const { user } = settings;
  const { routes, setRoutes, routeIndex, setRouteIndex } = useRoutesStore();
  const { steps, setSteps, addStep, getStep } = useStepsStore();
  const { addEmission } = useEmissionsStore();

  const routesLibrary = useMapsLibrary("routes");
  const elevationLibrary = useMapsLibrary("elevation");
  const [elevationService, setElevationService] =
    useState<google.maps.ElevationService>();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map || !elevationLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    setElevationService(new elevationLibrary.ElevationService());
  }, [routesLibrary, map, elevationLibrary]);

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: settings.routeOptions.origin,
        destination: settings.routeOptions.destination,
        travelMode:
          (settings.routeOptions.travelMode as google.maps.TravelMode) ||
          google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        setSteps([]);
      });
    return () => directionsRenderer.setMap(map);
  }, [
    directionsService,
    directionsRenderer,
    settings.routeOptions.origin,
    settings.routeOptions.destination,
    settings.routeOptions.travelMode,
    setRoutes,
    map,
    setSteps,
  ]);

  // Add traffic layer to the map
  // useEffect(() => {
  //   const trafficLayer = new google.maps.TrafficLayer();
  //   trafficLayer.setMap(map);
  // }, [map]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  // Get elevation data and steps
  useEffect(() => {
    if (!elevationService || routes.length === 0) return;

    for (let route of routes) {
      for (let leg of route.legs) {
        for (let step of leg.steps) {
          let step_id =
            step.start_location.toString() + step.end_location.toString();
          if (getStep(step_id)) {
            console.log("Step already exists", step_id);
            continue;
          }

          elevationService.getElevationForLocations(
            { locations: [step.start_location, step.end_location] },
            (results, status) => {
              let step_stats = {
                route_id: route.overview_polyline.toString(),
                id:
                  step.start_location.toString() + step.end_location.toString(),
                distance: step.distance?.value || 0,
                duration: step.duration?.value || 0,
                speed:
                  (step.distance?.value || 0) / (step.duration?.value || 0),
                elevation_change: 0,
                road_grade_percent: 0,
              };

              if (status === "OK" && results?.length === 2) {
                const delta = results[0].elevation - results[1].elevation;
                step_stats.elevation_change = parseFloat(delta.toFixed(2));
                const road_grade_percent = (delta / step_stats.distance) * 100;
                step_stats.road_grade_percent = parseFloat(
                  road_grade_percent.toFixed(2)
                );
              }
              addStep(step_stats);
            }
          );
        }
      }
    }
  }, [addStep, elevationService, getStep, leg, routeIndex, routes, setSteps]);

  // Use steps to call /route API endpoint
  useEffect(() => {
    const routesTotalSteps = routes?.reduce(
      (total, route) => total + route?.legs[0]?.steps?.length,
      0
    );
    if (!steps?.length || steps?.length !== routesTotalSteps) return;

    async function fetchRouteEAPI(data: RouteEData, routeId: string) {
      try {
        const response = await fetch("/api/route-e", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responseJSON = await response.json();
        console.log("RouteE request data: ", data);
        console.log("RouteE response: ", responseJSON);
        addEmission(responseJSON, routeId);
      } catch (error) {
        console.log("RouteE error");
        console.log(error);
      }
    }

    const stepsGroupedByRoute = groupBy(steps, (val) => val.route_id);

    Object.keys(stepsGroupedByRoute).forEach((key) => {
      let steps = stepsGroupedByRoute[key];
      const routeEData = processStepsToRouteEData(
        steps,
        user?.vehicleType || "gasoline",
        "metrics"
      );
      fetchRouteEAPI(routeEData, key);
    });
  }, [addEmission, routes, user?.vehicleType, steps]);

  if (!leg) return null;

  return <></>;
}

export default VisMap;
