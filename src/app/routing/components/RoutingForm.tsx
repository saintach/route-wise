import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import useSettingStore from "@/lib/useSettingStore";
import useRoutesStore from "@/lib/useRoutesStore";
import useEmissionsStore from "@/lib/useEmissionsStore";
import { ggeToCo2 } from "@/lib/routeE";

export default function RoutingForm() {
  const { settings, setRouteOptions } = useSettingStore();
  const { routes, setRouteIndex, routeIndex } = useRoutesStore();
  const { emissions } = useEmissionsStore();
  const [origin, setOrigin] = useState(settings.routeOptions.origin);
  const [destination, setDestination] = useState(
    settings.routeOptions.destination
  );
  const [travelMode, setTravelMode] = useState(
    settings.routeOptions.travelMode
  );
  const [vehicleType, setVehicleType] = useState(
    settings.routeOptions.vehicleType
  );

  const findRoutes = () => {
    setRouteOptions({
      origin,
      destination,
      travelMode,
      vehicleType,
    });
  };

  let leastCO2 = Number.MAX_VALUE;
  if (emissions) {
    Object.keys(emissions).map((key) => {
      const co2 = emissions[key]?.data?.output_metadata?.["Total Energy"];
      leastCO2 = Math.min(co2, leastCO2);
    });
  }

  console.log("leastCO2", leastCO2);

  return (
    <div className="flex p-10 gap-2 flex-col">
      <div className="flex flex-row gap-2 items-center">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <h1 className="text-3xl font-bold">Route Wise</h1>
      </div>
      <div className="form-group">
        <Label htmlFor="origin">Origin</Label>
        <Input
          id="origin"
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(event) => setOrigin(event.target.value)}
        />
      </div>
      <div className="form-group">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>
      <div className="form-group">
        <Label htmlFor="origin">Travel Mode</Label>
        <Select onValueChange={(val) => setTravelMode(val)} value={travelMode}>
          <SelectTrigger>
            <SelectValue placeholder="Select travel mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRIVING">Driving</SelectItem>
            <SelectItem value="TRANSIT" disabled>
              Transit
            </SelectItem>
            <SelectItem value="BICYCLING" disabled>
              Bicycling
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="form-group">
        <Label htmlFor="origin">Vehicle Type</Label>
        <Select
          onValueChange={(val) => setVehicleType(val)}
          value={vehicleType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gasoline">Gasoline</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="electric">EV</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => findRoutes()}>Find Routes</Button>
      <h2 className="text-xl font-bold mt-4">Route Options</h2>
      {routes.map((route, index) => {
        const co2 = ggeToCo2(
          emissions[route?.overview_polyline]?.data?.output_metadata?.[
            "Total Energy"
          ]
        );
        return (
          <Card
            key={index}
            className={`${
              routeIndex === index ? "shadow-md border-slate-500" : ""
            }`}
            onClick={() => setRouteIndex(index)}
          >
            <CardHeader>
              <CardTitle>{route.summary}</CardTitle>
              <CardDescription>
                {route?.legs[0]?.distance?.text} |{" "}
                {route?.legs[0]?.duration?.text} |{" "}
                <b
                  className={
                    emissions[route?.overview_polyline]?.data
                      ?.output_metadata?.["Total Energy"] == leastCO2
                      ? "text-green-600"
                      : ""
                  }
                >
                  CO2 {co2} kg
                </b>
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
