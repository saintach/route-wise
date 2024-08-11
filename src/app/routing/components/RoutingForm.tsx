import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function RoutingForm() {
  const { settings, setRouteOptions } = useSettingStore();
  const { routes, setRouteIndex, routeIndex } = useRoutesStore();
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

  return (
    <div className="p-10 gap-4">
      <div className="flex flex-row gap-2 items-center">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <h1 className="text-3xl font-bold">Route Wise</h1>
      </div>
      <br />
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
      <br />
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
      <br />
      <div className="form-group">
        <Label htmlFor="travel_mode">Travel Mode</Label>
        <RadioGroup
          defaultValue="DRIVING"
          value={travelMode}
          onValueChange={(event) => setTravelMode(event)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="DRIVING" id="driving" />
            <Label htmlFor="driving">Driving</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="TRANSIT" id="transit" />
            <Label htmlFor="transit">Transit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BICYCLING" id="bicycling" />
            <Label htmlFor="bicycling">Bicycling</Label>
          </div>
        </RadioGroup>
      </div>
      <br />
      <Button onClick={() => findRoutes()}>Find Routes</Button>
      <br />
      <br />
      <h2 className="text-xl font-bold">Route Options</h2>
      <br />
      {routes.map((route, index) => (
        <Card
          key={index}
          className={`mb-4 ${
            routeIndex === index ? "shadow-md border-slate-900" : ""
          }`}
          onClick={() => setRouteIndex(index)}
        >
          <CardHeader>
            <CardTitle>{route.summary}</CardTitle>
            <CardDescription>
              {route?.legs[0]?.distance?.text} |{" "}
              {route?.legs[0]?.duration?.text}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
