import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import useSettingStore from "@/lib/useSettingStore";
import useRoutesStore from "@/lib/useRoutesStore";
import useEmissionsStore from "@/lib/useEmissionsStore";
import { ggeToCo2 } from "@/lib/routeE";
import { Login } from "./Login";
import { CreateProfile } from "./CreateProfile";
import { Profile } from "./Profile";

export default function RoutingForm() {
  const { settings, setRouteOptions, setLogout } = useSettingStore();
  const { routes, setRouteIndex, routeIndex } = useRoutesStore();
  const { emissions } = useEmissionsStore();
  const { user } = settings;
  const [origin, setOrigin] = useState(settings.routeOptions.origin);
  const [destination, setDestination] = useState(
    settings.routeOptions.destination
  );
  const [travelMode, setTravelMode] = useState(
    settings.routeOptions.travelMode
  );

  const findRoutes = () => {
    setRouteOptions({
      origin,
      destination,
      travelMode,
    });
  };

  // Combine emissions and routes by polyline id
  const routesWithEmissions = routes
    .map((route) => {
      const co2 = ggeToCo2(
        emissions[route?.overview_polyline]?.data?.output_metadata?.[
          "Total Energy"
        ]
      );
      return {
        ...route,
        co2,
      };
    })
    .sort((a, b) => {
      return parseFloat(a.co2) - parseFloat(b.co2);
    });

  let leastCO2 = Number.MAX_VALUE;
  if (routesWithEmissions.length > 0) {
    routesWithEmissions.map((route) => {
      const co2 = parseFloat(route?.co2);
      leastCO2 = Math.min(co2, leastCO2);
    });
  }

  return (
    <div className="flex p-10 gap-2 flex-col">
      <div className="flex flex-row gap-2 justify-between">
        <div className="flex flex-row gap-2 items-center">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <h1 className="text-3xl font-bold">Route Wise</h1>
        </div>
        {/* show create profile & login button group */}
        <div className="flex flex-row">
          {!user.isLoggedIn && <Login />}
          {!user.isLoggedIn && <CreateProfile />}
          {user.isLoggedIn && <Profile />}
          {user.isLoggedIn && (
            <Button variant="link" onClick={() => setLogout()}>
              Logout
            </Button>
          )}
        </div>
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
      {/* <div className="form-group">
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
      </div> */}
      <Button onClick={() => findRoutes()}>Find Routes</Button>
      <h2 className="text-xl font-bold mt-4">Route Options</h2>
      <Label>
        Vehicle Type <Badge variant="secondary"> {user.vehicleType}</Badge>
      </Label>
      {routesWithEmissions.map((route, index) => {
        const isLeastCO2 =
          route?.co2 == leastCO2?.toString() &&
          route?.co2 !== "NaN" &&
          leastCO2?.toString() !== "NaN";
        return (
          <Card
            key={index}
            className={`${
              routeIndex === index ? "shadow-md border-slate-500" : ""
            }`}
            onClick={() => setRouteIndex(index)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                {route.summary}
                {isLeastCO2 ? (
                  <Image
                    src="/leaf.svg"
                    alt="leaf"
                    className="text-green-600"
                    width={20}
                    height={20}
                  />
                ) : (
                  <></>
                )}
              </CardTitle>
              <CardDescription>
                {route?.legs[0]?.distance?.text} |{" "}
                {route?.legs[0]?.duration?.text} |{" "}
                <b
                  className={
                    route?.co2 == leastCO2?.toString() ? "text-green-600" : ""
                  }
                >
                  CO2 {route?.co2 == "NaN" ? "..." : route?.co2} kg
                </b>
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
